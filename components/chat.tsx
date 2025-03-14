import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onResponse: (response) => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-[90%] xl:w-1/2 mx-auto my-24">
      <div
        className="flex flex-col h-[700px] xl:h-[800px] overflow-auto px-3"
        ref={messagesRef}
        id="messages-container"
      >
        <div className="py-2 px-3 rounded-lg bg-gray-200 text-slate-700 max-w-xs mx-2 my-6">
          What&apos;s up?
        </div>

        {messages.map((m) => {
          if (m.role === "user") {
            return (
              <div
                key={m.id}
                className="py-2 px-3 my-6 rounded-lg bg-blue-500 text-white max-w-xs ml-auto"
              >
                {m.content}
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className="py-2 px-3 rounded-lg bg-gray-200 text-slate-700 max-w-xs mx-2 my-6"
              dangerouslySetInnerHTML={{ __html: m.content }}
            />
          );
        })}
        {loading ? (
          <div className="py-2 px-3 rounded-lg bg-gray-200 text-slate-700 max-w-xs mx-2 my-6 w-9 animate-bounce">
            ...
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-10 inset-x-0 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault;
            setLoading(true);
            handleSubmit(e);
          }}
          className="flex flex-col gap-2 sm:flex-row sm:items-center justify-center"
        >
          <input
            value={input}
            placeholder="Say something..."
            className="p-3 rounded-md w-full sm:flex-1 border border-gray-200"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="p-3 rounded-md bg-blue-500 text-white w-full sm:w-auto"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
