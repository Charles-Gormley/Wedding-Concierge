"use server"

// Server-side only imports and initialization
import OpenAI from "openai"
import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { NodeHttpHandler } from "@aws-sdk/node-http-handler"

// Import the new storage function
import { saveWeddingDataWithRetry } from "./wedding-storage"

// Create a function that returns the OpenAI client instead of initializing it at the module level
function getOpenAIClient() {
  // This ensures the client is only created when the function is called (on the server)
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not defined in environment variables")
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // This is safe because this code only runs on the server in a server action
  })
  console.log(`${openai}`)

  return openai
}

// Create a function that returns the S3 client
function getS3Client() {
  // Validate AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID is not defined")
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not defined")
  }
  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is not defined")
  }

  // Create S3 client with explicit configuration to avoid filesystem access
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    // Use NodeHttpHandler with explicit configuration
    requestHandler: new NodeHttpHandler({
      connectionTimeout: 5000, // 5 seconds
      socketTimeout: 5000, // 5 seconds
    }),
    // Disable credential loading from shared files
    credentialDefaultProvider: () => async () => {
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      }
    },
    // Disable loading config from files
    loadedConfig: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      region: process.env.AWS_REGION,
      logger: console,
    },
  })

  return s3Client
}

// Generate a unique ID for the wedding
const generateWeddingId = () => {
  return uuidv4()
}

// Process a document with OpenAI to extract text information
async function processDocumentWithAI(file: File): Promise<string> {
  try {
    // Validate file
    if (!file || !file.name) {
      return "Invalid file provided"
    }

    // Get file type
    const fileType = file.type || "application/octet-stream"

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: fileType })

    // Create a FormData object to upload the file
    const formData = new FormData()
    formData.append("file", blob, file.name)
    formData.append("purpose", "user_data")

    console.log(`Uploading file: ${file.name}`)

    // Upload the file to OpenAI
    const uploadResponse = await fetch("https://api.openai.com/v1/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error(`Failed to upload file to OpenAI: ${uploadResponse.status} - ${errorText}`)
    }

    const uploadResult = await uploadResponse.json()
    const fileId = uploadResult.id
    console.log(`File uploaded successfully with ID: ${fileId}`)

    // Use the file ID in the responses API call
    const isPdf = file.type === "application/pdf" || (file.name && file.name.toLowerCase().endsWith(".pdf"))

    let upload_object
    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString("base64")
      upload_object = {
        type: "input_file",
        filename: file.name,
        file_data: `data:application/pdf;base64,${base64}`,
      }
    } else {
      async function fileToBase64(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        return buffer.toString("base64")
      }

      // Usage
      const base64 = await fileToBase64(file)
      const mimeType = file.type || "image/png"
      const dataUrl = `data:${mimeType};base64,${base64}`

      upload_object = {
        type: "input_image",
        image_url: dataUrl,
      }
    }

    const responsesBody = {
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            upload_object,
            {
              type: "input_text",
              text: "Please extract all relevant information from this wedding document. Be thorough and don't miss any important details.",
            },
          ],
        },
      ],
    }

    const responsesResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(responsesBody),
    })

    if (!responsesResponse.ok) {
      const errorText = await responsesResponse.text()
      throw new Error(`OpenAI Responses API error: ${responsesResponse.status} - ${errorText}`)
    }
    console.log("Response")
    const result = await responsesResponse.json()

    // Extract the content from the response
    const extractedText =
      result.output?.[0]?.content?.[0]?.text || "No information could be extracted from the document."

    // Clean up by deleting the file from OpenAI servers
    try {
      await fetch(`https://api.openai.com/v1/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })
      console.log(`File ${fileId} deleted from OpenAI servers`)
    } catch (deleteError) {
      console.error(`Warning: Failed to delete file ${fileId} from OpenAI servers`, deleteError)
      // Continue execution even if deletion fails
    }

    return extractedText
  } catch (error) {
    return `Error processing document with OpenAI: ${error instanceof Error ? error.message : String(error)}`
  }
}

// Simple fetch-based S3 upload as a fallback
async function uploadToS3WithFetch(content: string | Buffer, key: string, contentType: string): Promise<string> {
  try {
    // Validate AWS credentials
    if (!process.env.AWS_S3_BUCKET || !process.env.AWS_REGION) {
      throw new Error("AWS S3 bucket or region not configured")
    }

    // Create the S3 URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    // Make a direct PUT request to S3
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: content,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`S3 upload failed: ${response.status} - ${errorText}`)
    }

    return url
  } catch (error: any) {
    throw error
  }
}

// Upload to S3 using AWS SDK with fallback to fetch
async function uploadToS3(content: string | Buffer, key: string, contentType: string): Promise<string> {
  try {
    // Validate AWS credentials
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET is not defined")
    }

    try {
      // Try AWS SDK first
      // Get S3 client
      const s3Client = getS3Client()

      // Prepare the upload command
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: content,
        ContentType: contentType,
      }

      // Execute the upload
      const command = new PutObjectCommand(uploadParams)
      const response = await s3Client.send(command)
    } catch (sdkError) {
      // If AWS SDK fails, try fetch as fallback
      await uploadToS3WithFetch(content, key, contentType)
    }

    // Construct the URL for the uploaded object
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    return url
  } catch (error) {
    throw error
  }
}

// Upload a file to S3
async function uploadFileToS3(file: File, weddingId: string): Promise<string> {
  try {
    // Validate parameters
    if (!file || !file.name || !weddingId) {
      throw new Error("Invalid file or wedding ID")
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const key = `weddings/${weddingId}/documents/${file.name}`
    const contentType = file.type || "application/octet-stream"

    return await uploadToS3(buffer, key, contentType)
  } catch (error) {
    throw new Error(
      `Failed to upload ${file?.name || "file"} to S3: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// Create a master document from all extracted text
async function createMasterDocument(allText: string, weddingName: string): Promise<string> {
  try {
    // Validate parameters
    if (!allText || !weddingName) {
      throw new Error("Invalid text or wedding name provided")
    }

    // Get a fresh OpenAI client
    const openai = getOpenAIClient()

    // Use a simpler approach to avoid potential issues
    const systemPrompt =
      "You are an AI assistant that organizes wedding information into a comprehensive master document. Your task is to condense and organize all the provided information while ensuring no important details are lost. Format the information in a clear, structured way that would be useful for wedding planning and coordination."

    const userPrompt = `Please create a comprehensive master document for ${weddingName} using all the following information. Be detailed and don't miss any important information. Organize the content logically by categories such as event details, schedule, venue information, contact information, etc.\n\n${allText}`

    // Make the API call with explicit typing
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: 16000,
    })

    // Check if we have a valid response
    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("OpenAI returned an empty response")
    }

    // Extract the content safely
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("OpenAI response did not contain content")
    }

    return content
  } catch (error) {
    // Return a fallback document instead of throwing
    return `Wedding Master Document for ${weddingName}\n\nUnable to generate a complete master document due to an error. Please try again later.\n\nRaw information:\n${allText.substring(0, 1000)}...\n
    error:${error}`
  }
}

// Simple function to concatenate all text without additional processing
async function createRawTextDocument(allText: string, weddingName: string): Promise<string> {
  // Simply return the concatenated text with a basic header
  return `# Raw Wedding Document for ${weddingName}\n\n${allText}`
}

// Upload text content to S3
async function uploadTextToS3(content: string, filename: string, weddingId: string): Promise<string> {
  try {
    // Validate parameters
    if (!content || !filename || !weddingId) {
      throw new Error("Invalid content, filename, or wedding ID")
    }

    const key = `weddings/${weddingId}/${filename}`
    return await uploadToS3(content, key, "text/plain")
  } catch (error) {
    throw new Error(`Failed to upload ${filename} to S3: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Format wedding name without using replace
function formatWeddingName(name: any): string {
  // Ensure we have a string
  const nameStr = typeof name === "string" ? name : String(name || "")

  // Split by spaces and join with hyphens
  const parts = nameStr.split(/\s+/)
  return parts.join("-")
}

// Main function to process wedding submission
export async function processWeddingSubmission(formData: FormData) {
  try {
    const weddingName = formData.get("weddingName") as string
    const weddingDetails = formData.get("weddingDetails") as string
    const files = formData.getAll("files") as File[]

    if (!weddingName) {
      throw new Error("Wedding name is required")
    }

    // Generate a unique ID for this wedding
    const weddingId = generateWeddingId()

    console.log(`files: ${files}`)

    // Process all documents in parallel
    const documentProcessingPromises = files.map(async (file) => {
      try {
        // Process document with AI and upload to S3 in parallel
        const [extractedText, fileUrl] = await Promise.all([
          processDocumentWithAI(file),
          uploadFileToS3(file, weddingId),
        ])

        console.log(`extracted text: ${extractedText}`)

        return {
          filename: file.name,
          extractedText,
          fileUrl,
        }
      } catch (error) {
        return {
          filename: file.name,
          extractedText: `Error processing document: ${error instanceof Error ? error.message : String(error)}`,
          fileUrl: "",
        }
      }
    })

    // Wait for all document processing to complete
    const processedDocuments = await Promise.all(documentProcessingPromises)

    console.log(processedDocuments)

    // Combine all text (form details + extracted text from documents)
    let allText = `Wedding Name: ${weddingName}\n\nWedding Details:\n${weddingDetails || "No details provided"}\n\n`

    processedDocuments.forEach((doc, index) => {
      allText += `\n--- Document ${index + 1}: ${doc.filename} ---\n${doc.extractedText || "No text extracted"}\n`
    })

    // Upload the combined text to S3
    await uploadTextToS3(allText, "all-text.txt", weddingId)

    // Create a raw text document without additional processing
    const rawTextDocument = await createRawTextDocument(allText, weddingName)

    // Upload the raw text document to S3
    const rawTextDocUrl = await uploadTextToS3(rawTextDocument, "raw-document.txt", weddingId)

    // Keep the original master document creation for reference
    // but don't use it in the final output
    let masterDocument
    try {
      masterDocument = await createMasterDocument(allText, weddingName)
      // Upload the master document to S3 but with a different name
      await uploadTextToS3(masterDocument, "ai-processed-document.txt", weddingId)
    } catch (error) {
      console.error("Error creating master document:", error)
      // No need to handle this error further as we're not using the master document
    }

    // Format the wedding name for the URL using our custom function
    const formattedWeddingName = formatWeddingName(weddingName)

    // Save to both S3 and DynamoDB for redundancy and faster retrieval
    try {
      console.log("Saving raw text document to DynamoDB for faster LLM retrieval")
      console.log("Wedding Name:", weddingName)
      console.log("Wedding Details:", JSON.stringify(weddingDetails, null, 2))
      console.log("Raw Text Document:", rawTextDocument)
      console.log("Wedding ID:", weddingId)
      
      // Wait for the save operation to complete to ensure data consistency
      
      await saveWeddingDataWithRetry(weddingName, rawTextDocument, weddingId)
      console.log("Successfully saved wedding data to DynamoDB")
    } catch (error: unknown) {
      console.error("Error saving to DynamoDB:", error)
      if (error instanceof Error) {
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        })
      }
      // Continue execution even if DynamoDB save fails - we still have the S3 backup
    }

    return {
      success: true,
      weddingId,
      formattedWeddingName,
      rawTextDocUrl, // Return the URL to the raw text document
      processedDocuments,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
