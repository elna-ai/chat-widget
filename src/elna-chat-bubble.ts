import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import DOMPurify from "dompurify";

@customElement("elna-chat-bubble")
export class ElnaChatBubble extends LitElement {
  @property({ type: Boolean })
  public isBot = false;

  @property({ type: String })
  public botImage = "";

  @property({ type: Boolean })
  public isLoading = false;

  @property({ type: String })
  public message = "";

  static styles = css`
    .chat-bubble {
      margin-top: 0.5rem;
      display: flex;
      width: calc(100% - 1rem);
      gap: 0.5rem;
    }

    .chat-bubble--user {
      flex-direction: row-reverse;
      margin-left: 1rem;
    }

    .chat-bubble__wrapper--user {
      flex-direction: row-reverse;
      align-self: flex-end;
    }

    .chat-bubble__name img {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000804;
      width: 2rem;
      height: 2rem;
      border-radius: 0.25rem;
      padding: 0.25rem;
    }

    .chat-bubble__message {
      white-space: pre-line;
      font-size: 13px;
      line-height: 1.35;
    }

    .chat-bubble__message--wrapper {
      min-width: 100%;
      max-width: 24rem;
      padding: 0.75rem;
    }

    .chat-bubble__message--wrapper--bot {
      background-color: #ececec;
      border-bottom-left-radius: 1rem;
      color: #000804;
      border-bottom-right-radius: 1rem;
      border-top-right-radius: 1rem;
    }

    .chat-bubble__message--wrapper--user {
      color: #fff;
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      background-color: var(--elna-primary-user-color);
    }

    .typing {
      align-items: center;
      display: flex;
      height: 17px;

      .dot {
        animation: dotTypingAnimation 1.8s infinite ease-in-out;
        background-color: #99cbcf;
        opacity: 1;
        height: 5px;
        border-radius: 50%;
        margin-right: 0.25rem;
        vertical-align: middle;
        width: 5px;
        display: inline-block;

        &:nth-child(1) {
          animation-delay: 200ms;
        }

        &:nth-child(2) {
          animation-delay: 300ms;
        }

        &:nth-child(3) {
          animation-delay: 400ms;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    @keyframes dotTypingAnimation {
      0% {
        transform: translateY(0px);
        background-color: #99cbcf;
        opacity: 1;
      }

      28% {
        transform: translateY(-7px);
        background-color: #99cbcf;
        opacity: 0.9;
      }

      44% {
        transform: translateY(0px);
        background-color: #99cbcf;
        opacity: 0.8;
      }
    }
  `;

  protected render() {
    return html`<div
      class=${classMap({
        "chat-bubble": true,
        "chat-bubble--user": !this.isBot,
      })}
    >
      ${this.isBot
        ? html`<div class="chat-bubble__name">
            <img src=${this.botImage} alt="bot avatar" />
          </div>`
        : ""}
      <div>
        <div
          class=${classMap({
            "chat-bubble__message--wrapper": true,
            "chat-bubble__message--wrapper--user": !this.isBot,
            "chat-bubble__message--wrapper--bot": this.isBot,
          })}
        >
          ${this.isLoading
            ? html`<div class="typing">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>`
            : html`<div class="chat-bubble__message">
                ${DOMPurify.sanitize(this.message)}
              </div>`}
        </div>
      </div>
    </div>`;
  }
}
