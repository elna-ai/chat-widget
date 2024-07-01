import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import downArrow from "./assets/down-arrow.svg";
import "./elna-chat";

@customElement("elna-chat-widget")
export class ElnaChatWidget extends LitElement {
  @property({ type: String })
  agentId = "";

  @property()
  title = "Support";

  @property()
  description = "Hi there! 🚀  Ask me any questions";

  @property()
  logo = "";

  @property()
  headerBackgroundColor = "";

  @property({ type: Boolean })
  open = false;

  static styles = css`
    :host {
      --elna-primary-600: var(--elna-primary-600, #007d88);
      --elna-dark-primary-600: var(--elna-dark-primary-600, #03fd8e);
      --elna-green-600: var(--elna-green-600, rgb(22 163 74));
      --elna-primary-color: var(--elna-primary-600, #007d88);
      --elna-title-color: var(--elna-dark-primary-600, #03fd8e);
      --elna-primary-user-color: var(--elna-primary-user-color, #158152);
    }

    .widget__icon {
      width: 50px;
      height: 50px;
      position: fixed;
      right: 0;
      bottom: 0;
      border-radius: 9999px;
      background-color: var(--elna-primary-color);
      padding: 0.25rem;
      box-shadow:
        0 1px 6px 0 rgba(0, 0, 0, 0.06),
        0 2px 32px 0 rgba(0, 0, 0, 0.16);
      transition: transform 167ms cubic-bezier(0.33, 0, 0, 1);
      box-sizing: content-box;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }

    .widget__icon:hover {
      transition: transform 250ms cubic-bezier(0.33, 0, 0, 1);
      transform: scale(1.1);
    }

    .widget__icon__img {
      width: 30px;
      height: 30px;
    }

    .widget__box {
      margin: 0px 10px 0px 0px;
      z-index: 2500;
      position: fixed;
      bottom: 0;
      right: 0;
      transform-origin: right bottom;
      height: min(520px, 100% - 104px);
      min-height: 80px;
      width: 360px;
      max-height: 520px;
      overflow: hidden;
      opacity: 1;
      box-shadow: #00000061 0 5px 40px;
      transition:
        width.2s ease 0s,
        height.2s ease 0s,
        max-height.2s ease 0s,
        transform.3s cubic-bezier(0, 1.2, 1, 1) 0s,
        opacity 83ms ease-out 0s;
      pointer-events: all;
      display: flex;
      flex-direction: column;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }

    .widget__box--close {
      box-shadow: none;
      height: min-content;
    }

    .widget__title {
      display: flex;
      justify-content: space-between;
      background-color: var(--elna-title-color);
      color: #000804;
      margin-top: auto;
      padding: 0.25rem 0.75rem;
      height: 58px;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      border: 1px solid #5ffeb8;
      display: flex;
      align-items: center;
      cursor: pointer;
      box-shadow: #03fd8e 0 5px 20px;
      margin-left: 30px;
      margin-right: 30px;
    }

    .widget__title__group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .widget__title__group__image {
      max-width: 40px;
      height: auto;
      background-color: #000200;
      border-radius: 0.25rem;
    }

    .widget__title__group__title {
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
    }

    .widget__title__group__description {
      font-weight: 400;
      font-size: 10px;
      line-height: 15px;
    }

    .widget__title--open {
      display: none;
    }

    .widget__chat {
      display: block;
      background-color: #eff5fd;
      height: 100%;
      border-top-left-radius: 1.5rem;
      border-top-right-radius: 1.5rem;
    }

    .widget__chat--close {
      display: none;
    }

    @media only screen and (min-width: 300px) and (max-width: 699px) {
      .widget__box {
        width: 345px;
        max-height: 420px;
      }
    }
  `;

  protected render() {
    return html`
      <div
        class=${classMap({
          widget__box: true,
          "widget__box--close": !this.open,
        })}
      >
        <div
          class=${classMap({
            widget__title: true,
            "widget__title--open": this.open,
          })}
          @click=${() => {
            this.open = !this.open;
          }}
        >
          <div class="widget__title__group">
            <img
              src=${this.logo}
              alt="logo"
              class="widget__title__group__image"
            />
            <div>
              <div class="widget__title__group__title">${this.title}</div>
              <div class="widget__title__group__description">
                ${this.description}
              </div>
            </div>
          </div>
          <img src=${downArrow} alt="down arrow" />
        </div>
        <div
          class=${classMap({
            widget__chat: true,
            "widget__chat--close": !this.open,
          })}
        >
          <elna-chat
            agentId=${this.agentId}
            agentDescription=${this.description}
            headerBackgroundColor=${this.headerBackgroundColor}
            logo=${this.logo}
          ></elna-chat>
        </div>
      </div>
    `;
  }

  constructor() {
    super();
    this.addEventListener("toggle-open", () => {
      this.open = !this.open;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "elna-chat-widget": ElnaChatWidget;
  }
}
