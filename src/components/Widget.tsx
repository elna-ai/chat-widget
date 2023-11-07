import { useState } from "react";
import classNames from "classnames";
import chatIcon from "../images/chat-icon.webp";

import Chat from "./Chat";

type WidgetProps = {
  wizardId: string;
  title?: string;
  theme?: "light" | "dark" | "system";
};

function Widget({
  wizardId,
  title = "Support",
  theme = "system",
}: WidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={classNames("widget__wrapper", {
        light: theme === "light",
        dark: theme === "dark",
      })}
    >
      <div
        className={classNames("widget__box", {
          "widget__box--close": !isOpen,
        })}
      >
        <div className="widget__title">{title}</div>
        <div
          className={classNames("widget__chat", {
            "widget__chat--close": !isOpen,
          })}
        >
          <Chat wizardId={wizardId} />
        </div>
      </div>
      <button
        className="widget__icon"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img className="widget__icon__img" src={chatIcon} alt="chat icon" />
      </button>
    </div>
  );
}

export default Widget;
