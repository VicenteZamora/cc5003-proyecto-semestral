import { useState } from "react";

export function FormGuide() {
  const [content, setContent] = useState<string>("");
  return (
    <>
      <form>
        <input
          type="text"
          placeholder="Add a comment"
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
