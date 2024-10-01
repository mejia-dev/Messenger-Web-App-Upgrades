(async () => {
  const injectScript = await chrome.runtime.getURL("scripts/inject.js");
  const script = document.createElement("script");
  script.setAttribute("src", injectScript);
  script.setAttribute("type", "text/javascript");
  script.onload = function () {
    this.remove();
    document.dispatchEvent(new CustomEvent("MWAU-StartBadges"));
    chrome.storage.local.get(["uploadedAudio", "settings"], function (result) {
      if (result.uploadedAudio && result.settings) {
        if (result.settings.customNotificationSound) document.dispatchEvent(new CustomEvent("MWAU-CustomSound", { detail: result.uploadedAudio }));
      }
    });
  }
  document.head.appendChild(script);
})();