(async () => {
  const injectScript = await chrome.runtime.getURL("scripts/inject.js");
  const script = document.createElement("script");
  script.setAttribute("src", injectScript);
  script.setAttribute("type", "text/javascript");
  script.onload = function () {
    this.remove();
    document.dispatchEvent(new CustomEvent("MessengerBadges-Initialize"));
  }
  document.head.appendChild(script);
})();