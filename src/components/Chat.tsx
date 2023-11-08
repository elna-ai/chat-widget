import "../stylesheets/index.scss";

import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
// import Button from "react-bootstrap/Button";
import { v4 as uuidv4 } from "uuid";
import useWebSocket from "react-use-websocket";

import Bubble from "./Bubble";
import avatarImg from "../images/avatars/01.png";

type Message = {
  user: {
    name: string;
    isBot?: boolean;
  };
  message: string;
};

type ChatProps = {
  wizardId: string;
  onClose: () => void;
};

type WizardDetails = {
  biography: string;
  greeting: string;
  name: string;
};

function Chat({ wizardId, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [wizard, setWizard] = useState<WizardDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [socketUrl] = useState(
    `${import.meta.env.VITE_CHAT_SOCKET_BASE}/chat?uuid=${wizardId}`
  );

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
    <div className="chat-wrapper">
      <header className="chat-header">
        <div className="chat-header__wrapper">
          <img
            src={avatarImg}
            alt="wizard image"
            className=" chat-header__avatar"
          />
          <h3 className="chat-header__title">{wizard?.name}</h3>
          <p style={{ marginLeft: "auto" }} onClick={onClose}>
            close
          </p>
        </div>
        <hr />
      </header>
      <div className="chat-body">
        <div className="chat-body--wrapper">
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
        <div className="chat-footer__input-wrapper">
          <textarea
            placeholder="Send a message"
            className="chat-footer__input-wrapper__input"
            value={messageInput}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onChange={(event) => setMessageInput(event.target.value)}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="chat-footer__input-wrapper__button"
            disabled={!messageInput.trim() || isResponseLoading}
          >
            Send
          </button>
        </div>
        <a
          className="chat-footer__link"
          href="https://gpdbs-xqaaa-aaaah-adtiq-cai.raw.icp0.io/"
          rel="noreferrer noopener"
          target="_blank"
        >
          POWERED BY ELNA
        </a>
      </div>
    </div>
  );
}

export default Chat;
