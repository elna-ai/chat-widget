# Elna chat widget

A third party react library which can we embedded into the customers application which can interact with wizards created in elna platform

## Integration and Usage

```sh
   npm i @elna-ai/chat-widget
```

#### Example  usage
```js
   import Widget from "@elna-ai/chat-widget";
   ...

   <Widget
      wizardId="${WIZARD_UUID_IN_ELNA}"
      title="Hello world"
      chatBg={chatBg}
      logo={logo}
   />
```
logo is and chatBg are expected to be images, logo is the image used in the title and as avatar for the bot. chatBg is used as the background for the title bar in expanded state
