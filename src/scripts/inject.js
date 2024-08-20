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


document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !document.querySelector("*[aria-label='Media viewer']")) {

    document.querySelector("a[aria-label='New message']").click();
    window.history.replaceState({}, "Messenger", "/t/");


    function hideChatUI() {
      const newChat = document.evaluate("//*[@data-virtualized='false']/../../../div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      const chatScreenContent = document.evaluate("//*[contains(@aria-label,'Thread list')]/following::div/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      const chatPopup = document.evaluate("//*[@role='listbox']/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      newChat.style.display = "none";
      chatScreenContent.style.display = "none";
      chatPopup.style.display = "none";
    }

    setTimeout(() => {
      hideChatUI();
    }, 100);

  }
});