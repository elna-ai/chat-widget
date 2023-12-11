import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import classNames from "classnames";
import Chat from "./Chat";
function Widget({ wizardId, title = "Support", description = "Hi there! 🚀  Ask me any questions", logo, chatBg, }) {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { className: classNames("widget__box", {
            "widget__box--close": !isOpen,
        }), children: [_jsxs("div", { className: classNames("widget__title", {
                    "widget__title--open": isOpen,
                }), onClick: () => setIsOpen((prev) => !prev), children: [_jsxs("div", { className: "widget__title__group", children: [_jsx("img", { src: logo, alt: "logo", className: "widget__title__group__image" }), _jsxs("div", { children: [_jsx("div", { className: "widget__title__group__title", children: title }), _jsx("div", { className: "widget__title__group__description", children: description })] })] }), _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12.0001 4.83594L5.79297 11.043L7.20718 12.4573L12.0001 7.66436L16.793 12.4573L18.2072 11.043L12.0001 4.83594ZM12.0001 10.4858L5.79297 16.6929L7.20718 18.1072L12.0001 13.3143L16.793 18.1072L18.2072 16.6929L12.0001 10.4858Z", fill: "black" }) })] }), _jsx("div", { className: classNames("widget__chat", {
                    "widget__chat--close": !isOpen,
                }), children: _jsx(Chat, { wizardId: wizardId, onClose: () => setIsOpen((prev) => !prev), chatBg: chatBg, description: description, logo: logo }) })] }));
}
export default Widget;
