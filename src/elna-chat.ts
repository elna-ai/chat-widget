import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import { getTextEmbedding } from "./api";
import elnaLogo from "./assets/elna-logo.svg";
import sendIcon from "./assets/send-icon.svg";
import { wizard_details } from "./declerations/wizard_details";
import { elna_RAG_backend } from "./declerations/elna_RAG_backend";
import { WizardDetails } from "./declerations/wizard_details/wizard_details.did";
import { handleAutoResizeTextBox, isErr } from "./utils";
import { Message } from "./types";
import "./elna-chat-bubble";

@customElement("elna-chat")
export class ElnaChat extends LitElement {
  @property()
  headerBackgroundColor = "";

  @property()
  agentDescription = "";

  @property()
  agentId = "";

  @property()
  logo = "";

  @state()
  protected error = "";

  @state()
  protected isLoading = true;

  @state()
  protected messages: Message[] = [];

  @state()
  protected isResponseLoading = false;

  @state()
  protected wizard?: WizardDetails;

  @state()
  protected inputMessage: string = "";

  static styles = css`
    .chat-wrapper {
      display: grid;
      height: 100%;
      grid-template-rows: auto 1fr auto;
    }

    .chat-header {
      text-align: left;
      background-size: cover;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      cursor: pointer;
    }

    .chat-header__wrapper {
      display: flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      gap: 1rem;
    }

    .chat-header__title {
      font-weight: 800;
      margin: 0;
      line-height: 20px;
    }

    .chat-header__description {
      font-weight: 400;
      font-size: 10px;

      line-height: 15px;
    }

    .chat-header__close {
      margin: 0;
      margin-left: auto;
      cursor: pointer;
    }

    .chat-header__avatar {
      flex-shrink: 0;
      max-width: 30px;
      max-height: 30px;
      border-radius: 8px;
    }

    .chat-header__wrapper img {
      background-color: #000200;
      border: 1px solid rgb(255 255 255 / 30%);
    }

    .chat-body {
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .chat-body-wrapper {
      margin: 0.5rem;
    }

    .chat-footer {
      padding: 0.5rem 1rem;
    }

    .chat-footer__warning {
      font-size: 10px;
      background-color: #7e7e801a;
      color: #ff0000b2;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      padding: 0.25rem 0.5rem;
      margin: 0 auto;
      margin-top: 0.5rem;
      width: max-content;
    }

    .chat-footer__warning__name {
      font-weight: 600;
    }

    .chat-footer__input-wrapper {
      position: relative;
    }

    .chat-footer__input-wrapper__input {
      color: #000804;
      width: 80%;
      background-color: transparent;
      resize: none;
      border: 1px solid #cacfd5;
      margin-top: 0;
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      border-radius: 0.5rem;
      padding-bottom: 0.875rem;
      padding-top: 0.875rem;
      padding-left: 1rem;
      padding-right: 3rem;
      font-size: 14px;
    }

    .chat-footer__input-wrapper__input:focus,
    .chat-footer__input-wrapper__input:focus-visible {
      outline: none;
      color: #000804;
    }

    .chat-footer__input-wrapper__input::placeholder {
      color: #00080457;
    }

    .chat-footer__input-wrapper__button {
      position: absolute;
      right: 14px;
      bottom: 16px;
      background-color: #020202;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-footer__input-wrapper__button:hover {
      border: transparent;
      border-radius: 8px;
    }

    .chat-footer__input-wrapper__button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-footer__input-wrapper__button:focus,
    .chat-footer__input-wrapper__button:focus-visible {
      outline: none;
    }

    .chat-footer__wrapper {
      display: flex;
      justify-content: center;
    }

    .chat-footer__wrapper__link {
      display: flex;
      justify-content: center;
      font-size: 8px;
      gap: 0.25rem;
      align-items: center;
      color: rgb(0 8 4 / 40%);
    }

    .chat-footer__wrapper__link svg {
      height: 15px;
    }

    .chat-footer__wrapper__link:hover {
      color: rgb(0 8 4 / 40%);
    }

    @media only screen and (min-width: 300px) and (max-width: 699px) {
      .chat-footer__input-wrapper__input {
        padding: 0.875rem 3.9rem 0.875rem 1rem;
      }
    }
  `;

  protected render() {
    return html` <div class="chat-wrapper">
      <header
        class="chat-header"
        style=${styleMap({ background: this.headerBackgroundColor })}
        @click=${() => {
          this.dispatchEvent(
            new CustomEvent("toggle-open", { bubbles: true, composed: true })
          );
        }}
      >
        <div class="chat-header__wrapper">
          <img
            src=${this.logo}
            alt="agent avatar"
            class="chat-header__avatar"
          />
          <div>
            <h3 class="chat-header__title">${this.wizard?.name}</h3>
            <div class="chat-header__description">
              ${this.agentDescription}
            </div>
          </div>
          <p class="chat-header__close">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0001 19.1643L18.2072 12.9572L16.793 11.543L12.0001 16.3359L7.20718 11.543L5.79297 12.9572L12.0001 19.1643ZM12.0001 13.5144L18.2072 7.30728L16.793 5.89307L12.0001 10.686L7.20718 5.89307L5.79297 7.30728L12.0001 13.5144Z"
                fill="rgba(249,249,249,1)"
              ></path>
            </svg>
          </p>
        </div>
      </header>
      ${this.isLoading
        ? html`<div style="color:black">Loading agent details</div>`
        : ""}
      ${!this.isLoading && this.error !== ""
        ? html`<div style="color:black">${this.error}</div>`
        : ""}
      ${!this.isLoading && this.error === ""
        ? html`<div class="chat-body">
            <div class="chat-body-wrapper">
              ${this.messages.length > 0
                ? html`${this.messages.map(
                    (message) =>
                      html`<elna-chat-bubble
                        ?isBot=${message.user.isBot}
                        message=${message.message}
                        botImage=${this.logo}
                      />`
                  )}
                  ${this.isResponseLoading
                    ? html`<elna-chat-bubble
                        botImage=${this.logo}
                        isBot
                        isLoading
                      />`
                    : ""} `
                : html`<div>No History</div>`}
            </div>
          </div>`
        : ""}
      ${this.renderFooter()}
    </div>`;
  }

  renderFooter() {
    return html`<div class="chat-footer">
      <div class="chat-footer__warning">
        <span>Heads up: </span>
        <span class="chat-footer__warning__name">${this.wizard?.name}</span>
        <span> might slip up; double-check crucial info.</span>
      </div>
      <div class="chat-footer__input-wrapper">
        <textarea
          placeholder="Write a reply"
          class="chat-footer__input-wrapper__input"
          .value=${this.inputMessage}
          @input=${this.setMessage}
          @keydown=${this.handleKeyDown}
          rows="1"
        ></textarea>
        <button
          @click=${this.handleSubmit}
          class="chat-footer__input-wrapper__button"
          ?disabled=${!this.inputMessage.trim() || this.isResponseLoading}
        >
          <img src=${sendIcon} alt="send icon" />
        </button>
      </div>
      <div class="chat-footer__wrapper">
        <a
          class="chat-footer__wrapper__link"
          href="https://dapp.elna.ai/"
          rel="noreferrer noopener"
          target="_blank"
        >
          <span>POWERED BY </span>
          <img src=${elnaLogo} alt="elna logo" />
        </a>
      </div>
    </div>`;
  }

  async connectedCallback() {
    super.connectedCallback();
    // TODO:needed for @difinity/agent to work better way for this
    (window as any).global = window;
    this.getAgent(this.agentId);
  }

  setMessage(e: Event) {
    const inputElement = e.target as HTMLTextAreaElement;
    this.inputMessage = inputElement.value;

    handleAutoResizeTextBox(inputElement);
  }

  handleKeyDown(event: KeyboardEvent) {
    // TODO:make it command + Enter
    if (
      event.key === "Enter" &&
      this.inputMessage.trim() &&
      !this.isResponseLoading
    ) {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  async handleSubmit() {
    this.messages = [
      ...this.messages,
      {
        user: { name: "User", isBot: false },
        message: this.inputMessage.trim(),
      },
    ];
    this.sendChat(this.agentId, this.inputMessage.trim());
  }

  async getAgent(agentId: string) {
    const wizard = await wizard_details.getWizard(agentId);
    if (wizard[0]) {
      this.wizard = wizard[0];
      const initialMessage = {
        user: { name: wizard[0].name, isBot: true },
        message: wizard[0].greeting,
      };
      this.messages = [...this.messages, initialMessage];
      this.error = "";
    } else {
      this.error = "Unable to load agent. Please contact support";
    }
    this.isLoading = false;
  }

  async sendChat(agentId: string, text: string) {
    this.isResponseLoading = true;
    const embeddings = await getTextEmbedding(text);
    const res = await elna_RAG_backend.chat(
      agentId,
      text,
      embeddings,
      crypto.randomUUID()
    );
    if (isErr(res)) {
      this.isResponseLoading = false;
      this.messages = [
        ...this.messages,
        {
          user: { isBot: true, name: this.wizard!.name },
          message: "Something went wrong please send the message again",
        },
      ];
      return;
    }

    this.messages = [
      ...this.messages,
      {
        user: { isBot: true, name: this.wizard!.name },
        message: res.Ok.body.response,
      },
    ];
    this.inputMessage = "";
    this.isResponseLoading = false;
  }
}
