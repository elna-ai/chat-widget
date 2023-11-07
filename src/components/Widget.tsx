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
      <div className="widget__box">
        <div
          className="widget__title"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {title}
        </div>
        <div
          className={classNames("widget__chat", {
            "widget__chat--close": !isOpen,
          })}
        >
          <Chat wizardId={wizardId} />
        </div>
      </div>
    </div>
  );
}

export default Widget;
