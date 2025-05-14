// AWS Signature V4 implementation without filesystem dependencies
// Based on AWS documentation: https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html

// Helper function to convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

// Helper function to convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const result = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16)
  }
  return result
}

// Helper function to convert Uint8Array to hex string
function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// SHA-256 hash function using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgUint8 = stringToUint8Array(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// HMAC-SHA256 function using Web Crypto API
async function hmacSha256(key: Uint8Array, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, stringToUint8Array(message))
  return new Uint8Array(signature)
}

// Get AWS signature key
async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
): Promise<Uint8Array> {
  const kDate = await hmacSha256(stringToUint8Array(`AWS4${key}`), dateStamp)
  const kRegion = await hmacSha256(kDate, regionName)
  const kService = await hmacSha256(kRegion, serviceName)
  const kSigning = await hmacSha256(kService, "aws4_request")
  return kSigning
}

export interface AwsSignatureOptions {
  method: string
  service: string
  region: string
  endpoint: string
  headers: Record<string, string>
  body?: string
  accessKey: string
  secretKey: string
}

// Main function to sign AWS requests
export async function signAwsRequest(options: AwsSignatureOptions): Promise<Record<string, string>> {
  const { method, service, region, endpoint, headers, body = "", accessKey, secretKey } = options

  // Create a date for headers and the credential string
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
  const dateStamp = amzDate.substring(0, 8)

  // Create canonical request
  const canonicalUri = "/"
  const canonicalQueryString = ""

  // Create canonical headers
  const canonicalHeaders = Object.entries({
    ...headers,
    host: `${service}.${region}.amazonaws.com`,
    "x-amz-date": amzDate,
  })
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(([key, value]) => `${key.toLowerCase()}:${value.trim()}\n`)
    .join("")

  // Create signed headers
  const signedHeaders = Object.keys(headers)
    .concat(["host", "x-amz-date"])
    .map((h) => h.toLowerCase())
    .sort()
    .join(";")

  // Create payload hash
  const payloadHash = await sha256(body)

  // Create canonical request
  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n")

  // Create string to sign
  const algorithm = "AWS4-HMAC-SHA256"
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [algorithm, amzDate, credentialScope, await sha256(canonicalRequest)].join("\n")

  // Calculate signature
  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service)
  const signature = uint8ArrayToHex(await hmacSha256(signingKey, stringToSign))

  // Create authorization header
  const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  // Return headers with authorization
  return {
    ...headers,
    "X-Amz-Date": amzDate,
    Authorization: authorizationHeader,
    "X-Amz-Content-Sha256": payloadHash,
  }
}
