import "../stylesheets/index.scss";

import { useState, useRef, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
// import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

// import { wizard_details as wizardDetails } from "declarations/wizard_details";
// import { WizardDetails } from "declarations/wizard_details/wizard_details.did";

import Bubble from "./Bubble";
import { AVATAR_DUMMY_IMAGE } from "../constants";
// import NoHistory from "./NoHistory";

type Message = {
  user: {
    name: string;
    isBot?: boolean;
  };
  message: string;
};

type WidgetProps = {
  wizardId: string;
};

function Widget({ wizardId }: WidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [selectedImage] = useState(
    Math.floor(Math.random() * AVATAR_DUMMY_IMAGE.length)
  );
  //WizardDetails
  const [wizard, setWizard] = useState();
  // true
  const [isLoading, setIsLoading] = useState(false);

  // const { id } = useParams();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const lastBubbleRef = useRef<HTMLDivElement | null>(null);

  console.log("In Widget new");
  console.log({ wizardId });

  useEffect(() => {
    // const getWizard = async () => {
    //   setIsLoading(true);
    //   if (wizardId === undefined) {
    //     // toast.error("Unable to find wizard");
    //     throw new Error("WizardId not defined");
    //     return;
    //   }
    //   try {
    //     const wizard = await wizardDetails.getWizard(id);
    //     if (wizard[0] === undefined) {
    //       toast.error("Unable to find wizard");
    //       return;
    //     }
    //     setWizard(wizard[0]);
    //     const initialMessage = {
    //       user: { name: wizard[0].name, isBot: true },
    //       message: wizard[0].greeting,
    //     };
    //     setMessages((prev) => [...prev, initialMessage]);
    //   } catch (e) {
    //     console.error(e);
    //     toast.error("Something went wrong");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // getWizard();
  }, []);

  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  // const handleClickSendMessage = useCallback(
  //   message => sendMessage(message),
  //   []
  // );

  const imgUrl = AVATAR_DUMMY_IMAGE[selectedImage];

  // const { t } = useTranslation();s

  const handleSubmit = async () => {
    setMessages((prev) => [
      ...prev,
      { user: { name: "User" }, message: messageInput.trim() },
    ]);
    setMessageInput("");
    setIsResponseLoading(true);
    if (import.meta.env.VITE_CHAT_API === undefined) {
      // toast.error("Something went wrong");
      throw new Error("chat api not defined");
    }

    try {
      const response = await axios.post(import.meta.env.VITE_CHAT_API, {
        input_prompt: messageInput.trim(),
        biography:
          wizard?.biography ||
          "Your name is test bot and you are supposed to end every reply with NOTE:THIS IS A TEST",
      });
      setIsResponseLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          user: { name: wizard?.name || "ELNA", isBot: true },
          message: response.data.body.response,
        },
      ]);
    } catch (e) {
      console.error(e);
      // toast.error("Something went wrong");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // make it command + Enter
    if (event.key === "Enter" && messageInput.trim() && !isResponseLoading) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => inputRef?.current?.focus(), [wizard]);
  // || wizard === undefined
  // if (isLoading) return <div>Page loading</div>;
  // <PageLoader />;

  return (
    <div className="row chatapp-single-chat">
      <div className="container-fluid">
        <div>
          <header className="text-left">
            <div className="d-flex align-items-center">
              <div className="chat-header__avatar">
                <div className="avatar">
                  {imgUrl && (
                    <img src={imgUrl} alt="user" className="avatar-img" />
                  )}
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h3 className="text-lg mt-2">{wizard?.name || "Elna"}</h3>
                <p className="text-muted fs-8">
                  {wizard?.biography || "biography"}
                </p>
              </div>
            </div>
            <hr className="mt-2" />
          </header>
        </div>
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
                    user={{ name: wizard?.name || "Elna", isBot: true }}
                    isLoading
                  />
                )}
              </>
            ) : (
              // <NoHistory />
              <div>No History </div>
            )}
          </div>
        </div>
        <div className="hk-footer chatfooter">
          <div className="chatfooter-bg shadow rounded">
            <div className="input-position-set">
              <textarea
                placeholder="Send a message"
                className="rounded-3 chat-input-area resize-none"
                value={messageInput}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={(event) => setMessageInput(event.target.value)}
              ></textarea>
              <Button
                onClick={handleSubmit}
                className="absolute right-2 bottom-1.5"
                disabled={!messageInput.trim() || isResponseLoading}
              >
                Send
              </Button>
            </div>
            <p className="text-muted fs-8 text-center">
              Ai Wizards may display inaccurate or offensive information about
              people, places and facts that doesn't represent Team Elna's views
              POWERED BY ELNA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Widget;
