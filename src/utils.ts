import {
  Error,
  Result,
} from "./declerations/elna_RAG_backend/elna_RAG_backend.did";
import { Message } from "./types";

const MIN_TEXT_AREA_HEIGHT = 52;
const MAX_TEXT_AREA_HEIGHT = 120;

// TODO: check if required
export const transformHistory = (messages: Message[]) => {
  return messages.map(({ user, message }) =>
    user.isBot
      ? { role: "assistant", content: message }
      : { role: "user", content: message }
  );
};

export const isErr = (response: Result): response is { Err: Error } =>
  Object.keys(response).includes("Err");

export const handleAutoResizeTextBox = (element: HTMLTextAreaElement) => {
  element.style.height = `inherit`;
  let newHeight = Math.min(
    Math.max(element.scrollHeight, MIN_TEXT_AREA_HEIGHT),
    MAX_TEXT_AREA_HEIGHT
  );
  element.style.height = `${newHeight}px`;
  element.style.overflowY =
    newHeight >= MAX_TEXT_AREA_HEIGHT ? "scroll" : "hidden";
};
