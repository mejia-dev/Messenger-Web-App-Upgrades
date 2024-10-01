(async () => {
  const injectScript = await chrome.runtime.getURL("scripts/inject.js");
  const script = document.createElement("script");
  script.setAttribute("src", injectScript);
  script.setAttribute("type", "text/javascript");
  script.onload = function () {
    this.remove();
    chrome.storage.local.get(["uploadedAudio", "settings"], function (result) {
      if (result.settings) {
        if (result.settings.customNotificationSound && result.uploadedAudio) document.dispatchEvent(new CustomEvent("MWAU-CustomSound", { detail: result.uploadedAudio }));
        if (result.settings.unreadBadges) document.dispatchEvent(new CustomEvent("MWAU-StartBadges"));
        if (result.settings.escCloseChat) document.dispatchEvent(new CustomEvent("MWAU-StartEscCloseChat"));
      }
    });
  }
  document.head.appendChild(script);
})();