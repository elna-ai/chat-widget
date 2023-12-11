import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "../stylesheets/index.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import useWebSocket from "react-use-websocket";
import Bubble from "./Bubble";
import ElnaLogo from "./ElnaLogo";
import useAutoSizeTextArea from "../hooks/useAutoResizeTextArea";
function Chat({ wizardId, onClose, chatBg, description, logo }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isResponseLoading, setIsResponseLoading] = useState(false);
    const [wizard, setWizard] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [socketUrl] = useState(`${import.meta.env.VITE_CHAT_SOCKET_BASE}/chat?uuid=${wizardId}`);
    const inputRef = useRef(null);
    const lastBubbleRef = useRef(null);
    const { sendMessage, lastMessage } = useWebSocket(socketUrl);
    useAutoSizeTextArea(inputRef.current, messageInput);
    useEffect(() => {
        if (wizard === undefined || isLoading === true)
            return;
        const newMessage = {
            user: { name: wizard.name, isBot: true },
            message: wizard.greeting,
        };
        setMessages((prev) => [...prev, newMessage]);
    }, [isLoading]);
    useEffect(() => {
        const getWizard = async () => {
            try {
                const data = await axios.get(`${import.meta.env.VITE_CHAT_API_BASE}/agent`, { params: { uuid: wizardId } });
                if (!data?.data?.data?.agent) {
                    setError("unable to load wizard");
                    setIsLoading(false);
                    throw new Error("unable to find wizard ");
                }
                setError("");
                setWizard(data.data.data.agent);
            }
            catch (e) {
                console.error(e);
                // TODO:add generic error to be displayed to the user
            }
            finally {
                setIsLoading(false);
            }
        };
        getWizard();
    }, []);
    useEffect(() => {
        if (wizard === undefined)
            return;
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
    const handleClickSendMessage = useCallback((message) => sendMessage(message), []);
    const handleSubmit = async () => {
        setMessages((prev) => [
            ...prev,
            { user: { name: "User" }, message: messageInput.trim() },
        ]);
        setMessageInput("");
        setIsResponseLoading(true);
        handleClickSendMessage(messageInput.trim());
    };
    const handleKeyDown = (event) => {
        // TODO:make it command + Enter
        if (event.key === "Enter" && messageInput.trim() && !isResponseLoading) {
            event.preventDefault();
            handleSubmit();
        }
    };
    useEffect(() => inputRef?.current?.focus(), [wizard]);
    if ((isLoading || wizard === undefined) && error === "") {
        return _jsx("div", { children: "Page loading" });
    }
    return (_jsxs("div", { className: "chat-wrapper", children: [_jsx("header", { className: "chat-header", style: { backgroundImage: `url(${chatBg})` }, onClick: onClose, children: _jsxs("div", { className: "chat-header__wrapper", children: [_jsx("img", { src: logo, alt: "wizard avatar", className: " chat-header__avatar" }), _jsxs("div", { children: [_jsx("h3", { className: "chat-header__title", children: wizard?.name }), _jsx("div", { className: "chat-header__description", children: description })] }), _jsx("p", { className: "chat-header__close", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12.0001 19.1643L18.2072 12.9572L16.793 11.543L12.0001 16.3359L7.20718 11.543L5.79297 12.9572L12.0001 19.1643ZM12.0001 13.5144L18.2072 7.30728L16.793 5.89307L12.0001 10.686L7.20718 5.89307L5.79297 7.30728L12.0001 13.5144Z", fill: "rgba(249,249,249,1)" }) }) })] }) }), error !== "" ? (_jsx("div", { children: error })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "chat-body", children: _jsx("div", { className: "chat-body--wrapper", children: messages.length > 0 ? (_jsxs(_Fragment, { children: [messages.map(({ user, message }, index) => (_jsx(Bubble, { user: user, message: message, ref: index === messages.length - 1 ? lastBubbleRef : null, botImage: logo }, uuidv4()))), isResponseLoading && (_jsx(Bubble, { user: { name: wizard?.name, isBot: true }, botImage: logo, isLoading: true }, uuidv4()))] })) : (_jsx("div", { children: "No History " })) }) }), _jsxs("div", { className: "chat-footer", children: [_jsxs("div", { className: "chat-footer__warning", children: [_jsx("span", { children: "Heads up: " }), _jsx("span", { className: "chat-footer__warning__name", children: `${wizard?.name}` }), _jsx("span", { children: " might slip up; double-check crucial info." })] }), _jsxs("div", { className: "chat-footer__input-wrapper", children: [_jsx("textarea", { placeholder: "Write a reply", className: "chat-footer__input-wrapper__input", value: messageInput, ref: inputRef, onKeyDown: handleKeyDown, onChange: (event) => setMessageInput(event.target.value), rows: 1 }), _jsx("button", { onClick: handleSubmit, className: "chat-footer__input-wrapper__button", disabled: !messageInput.trim() || isResponseLoading, children: _jsx("svg", { width: "17", height: "18", viewBox: "0 0 17 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0.5 9.83358H5.5V8.16691H0.5V0.538249C0.5 0.308132 0.68655 0.121582 0.916667 0.121582C0.986875 0.121582 1.05595 0.139324 1.11747 0.173165L16.5028 8.63517C16.7045 8.746 16.7781 8.99942 16.6672 9.201C16.6291 9.27025 16.5721 9.32725 16.5028 9.36533L1.11747 17.8272C0.915833 17.9382 0.662475 17.8647 0.551575 17.663C0.517742 17.6015 0.5 17.5324 0.5 17.4622V9.83358Z", fill: "white" }) }) })] }), _jsx("div", { className: "chat-footer__wrapper", children: _jsxs("a", { className: "chat-footer__wrapper__link", href: "https://gpdbs-xqaaa-aaaah-adtiq-cai.raw.icp0.io/", rel: "noreferrer noopener", target: "_blank", children: [_jsx("span", { children: "POWERED BY " }), _jsx(ElnaLogo, {})] }) })] })] }))] }));
}
export default Chat;
