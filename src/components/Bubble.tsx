// import { useRef } from "react";
import classNames from "classnames";
import DOMPurify from "dompurify";

type BubbleProps = {
  message?: string;
  user: {
    name: string;
    isBot?: boolean;
  };
  isLoading?: boolean;
} & React.HTMLProps<HTMLDivElement>;

function Bubble({ user, message, isLoading = false }: BubbleProps) {
  // const bubbleRef = useRef<HTMLDivElement | null>(null);

  const isUserBot = user?.isBot ?? false;
  const sanitize = DOMPurify.sanitize;

  return (
    <div
      className={classNames("chat-bubble", {
        "chat-bubble--user": !isUserBot,
      })}
    >
      {isUserBot && (
        <div
          className={classNames("chat-bubble__name", {
            "chat-bubble__name--bot": isUserBot,
          })}
        >
          {user?.name[0]?.toUpperCase()}
        </div>
      )}
      <div>
        <div
          className={classNames("chat-bubble__message--wrapper", {
            "chat-bubble__message--wrapper--user": !isUserBot,

            "chat-bubble__message--wrapper--bot": isUserBot,
          })}
        >
          {isLoading ? (
            <div className="typing">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          ) : (
            <div
              className="chat-bubble__message"
              dangerouslySetInnerHTML={{
                __html: sanitize(message || ""),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Bubble;
