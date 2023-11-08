import { useState } from "react";
import classNames from "classnames";

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
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16.8 19L14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}

export default Widget;
