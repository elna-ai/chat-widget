import { useState } from "react";
import classNames from "classnames";

import Chat from "./Chat";
import { WidgetProps } from "../../lib/index";

function Widget({
  wizardId,
  title = "Support",
  theme = "system",
  description = "Hi there! 🚀  Ask me any questions",
  logo,
  chatBg,
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
        <div
          className={classNames("widget__title", {
            "widget__title--open": isOpen,
          })}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="widget__title__group">
            <img
              src={logo}
              alt="logo"
              className="widget__title__group__image"
            />
            <div>
              <div className="widget__title__group__title">{title}</div>
              <div className="widget__title__group__description">
                {description}
              </div>
            </div>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0001 4.83594L5.79297 11.043L7.20718 12.4573L12.0001 7.66436L16.793 12.4573L18.2072 11.043L12.0001 4.83594ZM12.0001 10.4858L5.79297 16.6929L7.20718 18.1072L12.0001 13.3143L16.793 18.1072L18.2072 16.6929L12.0001 10.4858Z"
              fill="black"
            />
          </svg>
        </div>
        <div
          className={classNames("widget__chat", {
            "widget__chat--close": !isOpen,
          })}
        >
          <Chat
            wizardId={wizardId}
            onClose={() => setIsOpen((prev) => !prev)}
            chatBg={chatBg}
            description={description}
            logo={logo}
          />
        </div>
      </div>
    </div>
  );
}

export default Widget;
