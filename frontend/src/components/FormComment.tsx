import { useState } from "react";

export function FormComment({
  callback,
}: {
  callback?: (content: string) => void;
}) {
  const [content, setContent] = useState<string>("");

  const addComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (callback) callback(content);
    setContent("");
  };

  return (
    <form className="space-y-4" onSubmit={addComment}>
      <textarea
        placeholder="Add a comment"
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
        className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
}
