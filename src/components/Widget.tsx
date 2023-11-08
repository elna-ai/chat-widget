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
        <div
          className={classNames("widget__title", {
            "widget__title--open": isOpen,
          })}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {title}
        </div>
        <div
          className={classNames("widget__chat", {
            "widget__chat--close": !isOpen,
          })}
        >
          <Chat
            wizardId={wizardId}
            onClose={() => setIsOpen((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}

export default Widget;
