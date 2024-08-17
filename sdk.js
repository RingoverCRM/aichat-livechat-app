function log(...objects) {
  if (window.origin.includes("localhost")) console.log(objects);
}

class AIChatSDK {
  isIframePresent = false;
  isReady = false;

  MESSAGE_TYPES = {
    IS_READY: "is_ready",
    IS_CHATBOX_OPEN: "is_chatbox_open",
    SET_STYLES: "set_styles",
  };

  CLOSED_CHAT_WIDTH = "50px";
  CLOSED_CHAT_HEIGHT = "50px";
  OPEN_CHAT_WIDTH = "350px";
  OPEN_CHAT_HEIGHT = "555px";

  constructor(agentId, options) {
    if (this.isIframePresent) return;

    const iframe = document.createElement("IFRAME");
    const IFRAME_SRC =
      "https://ai-chat-livechat-dot-aichat-408808.ey.r.appspot.com";
    iframe.src = `${IFRAME_SRC}?agent_id=${agentId}`;
    this.iframe = iframe;
    document.body.appendChild(this.iframe);
    this.isIframePresent = true;
    this.setStyles(options);

    const handleMessage = (event) => {
      if (event.origin !== IFRAME_SRC) return;

      log("MESSAGE FROM IFRAME", event.data);

      if (event.data?.type === this.MESSAGE_TYPES.IS_READY) {
        this.isReady = true;
      } else if (event.data?.type === this.MESSAGE_TYPES.IS_CHATBOX_OPEN) {
        if (event.data.data) {
          this.iframe.style.width = this.OPEN_CHAT_WIDTH;
          this.iframe.style.height = this.OPEN_CHAT_HEIGHT;
          this.iframe.style.boxShadow =
            "rgba(41, 43, 88, 0.2) 5.10258px 0.2052px 51.0258px";
        } else {
          this.iframe.style.width = this.CLOSED_CHAT_WIDTH;
          this.iframe.style.height = this.CLOSED_CHAT_HEIGHT;
          this.iframe.style.boxShadow = "none";
        }
      }
    };

    window.addEventListener("message", handleMessage);
  }

  sendMessage(data) {
    this.iframe.contentWindow.postMessage(data, "*");
  }

  setStyles(options) {
    this.iframe.frameBorder = "0";
    this.iframe.style.width = options?.width ?? "50px";
    this.iframe.style.height = options?.height ?? "50px";

    this.iframe.style.border = "none";
    this.iframe.style.position = "fixed";
    this.iframe.style.bottom = options?.bottom ?? "40px";
    this.iframe.style.left = options?.left ?? null;
    this.iframe.style.right = options?.right ?? "40px";
    this.iframe.style.top = options?.top ?? null;
    this.iframe.style.zIndex = options?.zIndex ?? 1000;
    this.iframe.style.borderRadius = "15px";

    this.sendMessage({ type: this.MESSAGE_TYPES.SET_STYLES, data: options });
  }
}

window.CustomerSupportSDK = AIChatSDK;
