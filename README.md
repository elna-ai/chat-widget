# Elna chat widget

A third party [lit](https://lit.dev/) library which can we embedded into the customers application which can interact with agents created in Elna platform

## Integration and Usage
 ### npm

```bash 
npm i @elna-ai/chat-widget
```

### yarn 
```bash
yarn add @elna-ai/chat-widget
```

### pnpm
```bash 
pnpm add @elna-ai/chat-widget
```

#### Example  usage
```js
   import "@elna-ai/chat-widget";
   ...
  <elna-chat-widget
      agentId="${AGENT_UUID_IN_ELNA}"
      logo="${LOGO_URL}"
      headerBackgroundColor="#{VALID_VALUE_FOR_COLOR_PROPERTY}"
      ></elna-chat-widget>

```
logo is the image used in the title and as avatar for the bot. headerBackgroundColor is used as the background for the title bar in expanded state

### Cavite with React
might need to declare type manually to avoid `JSX.IntrinsicElements` error
https://coryrylan.com/blog/how-to-use-web-components-with-typescript-and-react

## Running locally

clone repo
```sh 
  git clone https://github.com/elna-ai/chat-widget.git
```

install dependence

```bash
pnpm install
```

run dev server
```bash
  pnpm dev
```


