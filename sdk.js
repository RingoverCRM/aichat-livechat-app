function log(...objects) {
  if (window.origin.includes("localhost")) console.log(objects);
}

const ENV = {
  PRODUCTION: "production",
  STAGING: "staging",
  DEV: "dev",
};

const IFRAME_SRC_MAP = {
  [ENV.PRODUCTION]:
    "https://ai-chat-livechat-dot-aichat-408808.ey.r.appspot.com",
  [ENV.STAGING]: "https://ai-chat-livechat-dot-aichat-408808.ey.r.appspot.com",
  [ENV.DEV]: "https://ai-chat-livechat-dev-dot-aichat-408808.ey.r.appspot.com",
};

class AIChatSDK {
  isIframePresent = false;
  isReady = false;

  MESSAGE_TYPES = {
    IS_READY: "is_ready",
    IS_CHATBOX_OPEN: "is_chatbox_open",
    SET_STYLES: "set_styles",
    URL_CHANGED: "url_changed",
  };

  CLOSED_CHAT_WIDTH = "50px";
  CLOSED_CHAT_HEIGHT = "50px";
  OPEN_CHAT_WIDTH = "350px";
  OPEN_CHAT_HEIGHT = "555px";

  constructor(agentId, options) {
    if (this.isIframePresent) return;

    const iframe = document.createElement("IFRAME");

    const env = options?.env || ENV.PRODUCTION;

    const IFRAME_SRC = options?.iframe_url || IFRAME_SRC_MAP[env];

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
    this.trackUrlChanges();
  }

  sendMessage(data) {
    this.iframe.contentWindow.postMessage(data, "*");
  }

  setStyles(options) {
    this.iframe.frameBorder = "0";
    this.iframe.style.width = options?.bubbleSize || "50px";
    this.iframe.style.height = options?.bubbleSize || "50px";

    this.iframe.style.border = "none";
    this.iframe.style.position = "fixed";
    this.iframe.style.bottom = options?.bottom || "40px";
    this.iframe.style.left = options?.left || null;
    this.iframe.style.right = options?.right || "40px";
    this.iframe.style.top = options?.top || null;
    this.iframe.style.zIndex = options?.zIndex || 1000;
    this.iframe.style.borderRadius = "15px";

    this.sendMessage({ type: this.MESSAGE_TYPES.SET_STYLES, data: options });
  }

  // New method to track URL changes
  trackUrlChanges() {
    const sendUrlToIframe = () => {
      const currentUrl = window.location.href;
      this.sendMessage({
        type: this.MESSAGE_TYPES.URL_CHANGED,
        url: currentUrl,
      });
    };

    // Intercept pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      sendUrlToIframe();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      sendUrlToIframe();
    };

    // Listen to back/forward navigation (popstate)
    window.addEventListener("popstate", sendUrlToIframe);

    // Send initial URL when SDK is loaded
    sendUrlToIframe();
  }
}

window.AIChatSDK = AIChatSDK;
