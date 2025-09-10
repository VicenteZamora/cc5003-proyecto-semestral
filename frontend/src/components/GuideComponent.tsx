import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Guide } from "../interfaces";

function GuideComponent() {
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide>();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/guides/${id}`)
      .then((json) => setGuide(json.data))
      .catch((err) => console.log(err));
  }, [id]);
  return (
    <>
      {guide ? (
        <div>
          <p> {guide.tags} </p>
          <p> {guide.title} </p>
          <p> {guide.content}</p>
        </div>
      ) : (
        <div>NO ENCONTRADO</div>
      )}
    </>
  );
}

export default GuideComponent;