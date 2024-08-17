document.addEventListener("MessengerBadges-Initialize", () => {
  function addBadges() {
    const chatElement = document.querySelector("a[aria-label*='Chats']");

    function setUnreadBadge(textToParse) {
      const regex = /\d+/g;
      const resultNumber = parseInt(textToParse.match(regex));
      navigator.setAppBadge(resultNumber);
    }

    function checkForUnreadMessages() {
      if (chatElement.textContent != "") {
        setUnreadBadge(chatElement.textContent);
      } else {
        navigator.clearAppBadge();
      }
    }

    checkForUnreadMessages();

    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        checkForUnreadMessages();
      }
    });

    observer.observe(chatElement, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  setTimeout(addBadges, 4000);
});