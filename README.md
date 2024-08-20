## Installation

### CDN

Using jsDelivr CDN:

```html
<script
  async
  src="https://cdn.jsdelivr.net/gh/RingoverCRM/aichat-livechat-sdk/sdk.min.js"
></script>
```

## Usage

```js
// Initialise sdk
// Pass Chatbot ID in the constructor
const sdk = new AIChatSDK("<Chatbot ID>", options);
```

Here is a complete list of available options with their default values:

```js
{
    // position of chatbot
    bottom: "40px",
    right: "40px",
    left: null,

    // size of chatbot bubble
    bubbleSize: "50px",
}
```

## Example

```js
const sdk = new AIChatSDK("9e9b96fb-173c-44b0-9b24-d68d718c3a0a", {
  bottom: "20px",
  left: "20px",
});
```
