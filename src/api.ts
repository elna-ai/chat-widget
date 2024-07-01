import axios from "axios";
import { CreateEmbeddingResponse } from "./types";

export const getTextEmbedding = async (text: string) => {
  const { data } = await axios.post<undefined, CreateEmbeddingResponse>(
    `${import.meta.env.VITE_CHAT_API_BASE}/create-embedding`,
    { text }
  );
  return data.body.vectors;
};
