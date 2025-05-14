import ChatInterface from "@/components/chat-interface";
import { getWeddingData } from "@/app/actions/wedding-actions";

export default async function ChatPage({
  params,
}: {
  params: { weddingId: string };
}) {
  // Get the wedding ID from the URL parameter
  const weddingId = params.weddingId;

  // Server‑side log (appears in the terminal, not the browser console)
  console.log("Wedding ID from URL:", weddingId);

  // Fetch wedding data using server action
  const weddingData = await getWeddingData(weddingId);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg sm:text-xl font-light text-black dark:text-white truncate">
          {weddingData.weddingName}&apos;s Wedding Chat
        </h1>
      </div>
      <ChatInterface weddingName={weddingData.weddingName} weddingId={weddingData.weddingId} />
    </div>
  );
}
