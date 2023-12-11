import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useRef } from "react";
import classNames from "classnames";
import DOMPurify from "dompurify";
function Bubble({ user, message, isLoading = false, botImage }) {
    // const bubbleRef = useRef<HTMLDivElement | null>(null);
    const isUserBot = user?.isBot ?? false;
    const sanitize = DOMPurify.sanitize;
    return (_jsxs("div", { className: classNames("chat-bubble", {
            "chat-bubble--user": !isUserBot,
        }), children: [isUserBot && (_jsx("div", { className: "chat-bubble__name", children: _jsx("img", { src: botImage }) })), _jsx("div", { children: _jsx("div", { className: classNames("chat-bubble__message--wrapper", {
                        "chat-bubble__message--wrapper--user": !isUserBot,
                        "chat-bubble__message--wrapper--bot": isUserBot,
                    }), children: isLoading ? (_jsxs("div", { className: "typing", children: [_jsx("div", { className: "dot" }), _jsx("div", { className: "dot" }), _jsx("div", { className: "dot" })] })) : (_jsx("div", { className: "chat-bubble__message", dangerouslySetInnerHTML: {
                            __html: sanitize(message || ""),
                        } })) }) })] }));
}
export default Bubble;
