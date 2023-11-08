import "../stylesheets/index.scss";

import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { v4 as uuidv4 } from "uuid";
import useWebSocket from "react-use-websocket";

import Bubble from "./Bubble";
import { AVATAR_DUMMY_IMAGE } from "../constants";

type Message = {
  user: {
    name: string;
    isBot?: boolean;
  };
  message: string;
};

type ChatProps = {
  wizardId: string;
};

type WizardDetails = {
  biography: string;
  greeting: string;
  name: string;
};

function Chat({ wizardId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [selectedImage] = useState(
    Math.floor(Math.random() * AVATAR_DUMMY_IMAGE.length)
  );
  const [wizard, setWizard] = useState<WizardDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [socketUrl] = useState(`wss://api.elna.live/chat?uuid=${wizardId}`);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const lastBubbleRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage, lastMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (wizard === undefined || isLoading === true) return;

    const newMessage = {
      user: { name: wizard.name, isBot: true },
      message: wizard.greeting,
    };

    setMessages((prev) => [...prev, newMessage]);
  }, [isLoading]);

  useEffect(() => {
    const getWizard = async () => {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_CHAT_API_BASE}/agent`,
          { params: { uuid: wizardId } }
        );
        setWizard(data.data.data.agent);
      } catch (e) {
        console.error(e);
        // TODO:add generic error to be displayed to the user
      } finally {
        setIsLoading(false);
      }
    };
    getWizard();
  }, []);

  useEffect(() => {
    if (wizard === undefined) return;

    if (lastMessage !== null) {
      setIsResponseLoading(false);
      const newMessage = {
        user: { name: wizard.name, isBot: true },
        message: lastMessage.data,
      };

      setMessages((prev) => [...prev, newMessage]);
    }
  }, [lastMessage, setMessages]);

  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  const imgUrl = AVATAR_DUMMY_IMAGE[selectedImage];
  const handleClickSendMessage = useCallback(
    (message: string) => sendMessage(message),
    []
  );

  const handleSubmit = async () => {
    setMessages((prev) => [
      ...prev,
      { user: { name: "User" }, message: messageInput.trim() },
    ]);
    setMessageInput("");
    setIsResponseLoading(true);
    handleClickSendMessage(messageInput.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // TODO:make it command + Enter
    if (event.key === "Enter" && messageInput.trim() && !isResponseLoading) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => inputRef?.current?.focus(), [wizard]);

  if (isLoading || wizard === undefined) return <div>Page loading</div>;

  return (
    <div
      style={{
        display: "grid",
        height: "100%",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <header className="text-left">
        <div className="d-flex align-items-center chat-header__block">
          <div className="chat-header__avatar">
            <div className="avatar">
              {imgUrl && (
                <img src={imgUrl} alt="wizard image" className="avatar-img" />
              )}
            </div>
          </div>
          <div className="flex-grow-1 ms-3">
            <h3 className="text-lg mt-2">{wizard?.name}</h3>
          </div>
        </div>
        <hr className="mt-2" />
      </header>
      <div className="chat-body">
        {/* TODO: media query to be converted to scss */}
        <div className="sm:mx-2 chat-body--wrapper">
          {messages.length > 0 ? (
            <>
              {messages.map(({ user, message }, index) => (
                <Bubble
                  key={uuidv4()}
                  user={user}
                  message={message}
                  ref={index === messages.length - 1 ? lastBubbleRef : null}
                />
              ))}
              {isResponseLoading && (
                <Bubble
                  key={uuidv4()}
                  user={{ name: wizard?.name, isBot: true }}
                  isLoading
                />
              )}
            </>
          ) : (
            <div>No History </div>
          )}
        </div>
      </div>
      <div className="chat-footer">
        <div className="chatfooter-bg shadow rounded">
          <div className="chat-footer__input-wrapper">
            <textarea
              placeholder="Send a message"
              className="rounded-3 chat-input-area resize-none chat-footer__input-wrapper__input"
              value={messageInput}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              onChange={(event) => setMessageInput(event.target.value)}
            ></textarea>
            <Button
              onClick={handleSubmit}
              className="chat-footer__input-wrapper__button"
              disabled={!messageInput.trim() || isResponseLoading}
            >
              Send
            </Button>
          </div>
          <a
            href="https://gpdbs-xqaaa-aaaah-adtiq-cai.raw.icp0.io/"
            className="text-muted fs-8 text-center justify-content-center"
            rel="noreferrer noopener"
            target="_blank"
          >
            POWERED BY ELNA
          </a>
        </div>
      </div>
    </div>
  );
}

export default Chat;
