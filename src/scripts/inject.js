// Good and working!!
// document.addEventListener("MWAU-StartBadges", () => {
//   function addBadges() {
//     const chatElement = document.querySelector("a[aria-label*='Chats']");

//     function setUnreadBadge(textToParse) {
//       const regex = /\d+/g;
//       const resultNumber = parseInt(textToParse.match(regex));
//       navigator.setAppBadge(resultNumber);
//     }

//     function checkForUnreadMessages() {
//       if (chatElement != null) {
//         if (chatElement.textContent != "") {
//           setUnreadBadge(chatElement.textContent);
//         } else {
//           navigator.clearAppBadge();
//         }
//       }
//     }

//     checkForUnreadMessages();

//     const observer = new MutationObserver((mutations) => {
//       for (let mutation of mutations) {
//         checkForUnreadMessages();
//       }
//     });

//     observer.observe(chatElement, {
//       characterData: true,
//       childList: true,
//       subtree: true,
//     });
//   }

//   setTimeout(addBadges, 4000);
// });


// Unread Badges

document.addEventListener("MWAU-StartBadges", () => {
  function addBadges() {
    const chatElement = document.querySelector("a[aria-label*='Chats']");

    function setUnreadBadge(textToParse) {
      const regex = /\d+/g;
      const resultNumber = parseInt(textToParse.match(regex));
      navigator.setAppBadge(resultNumber);
    }

    function checkForUnreadMessages() {
      if (chatElement != null) {
        if (chatElement.textContent != "") {
          setUnreadBadge(chatElement.textContent);
        } else {
          navigator.clearAppBadge();
        }
      }
    }

    checkForUnreadMessages();
  }

  window.setInterval(function(){
    addBadges();
  }, 1000);
});


// Escape to Close Chat

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !document.querySelector("*[aria-label='Media viewer']")) {

    const newMessageButton = document.querySelector("a[aria-label='New message']");
    newMessageButton.click();
    newMessageButton.addEventListener("click", (e) => {
      document.dispatchEvent(new CustomEvent("MWAU-NewChat"));
    })
    window.history.replaceState({}, "Messenger", "/t/");

    setTimeout(() => {
      document.dispatchEvent(new CustomEvent("MWAU-CloseChat"));
    }, 100);
  }
});

document.addEventListener("MWAU-CloseChat", () => {
  const newChat = document.evaluate("//*[@data-virtualized='false']/../../../div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const chatScreenContent = document.evaluate("//*[contains(@aria-label,'Thread list')]/following::div/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const chatPopup = document.evaluate("//*[@role='listbox']/..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  newChat.style.display = "none";
  chatScreenContent.style.display = "none";
  if (chatPopup != null) {
    chatPopup.style.display = "none";
  }
});

document.addEventListener("MWAU-NewChat", () => {
  setTimeout(() => {
    if (window.location.href.contains("/new")) {
      const newChat = document.evaluate("//*[@data-virtualized='false']/../../../div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const chatScreenContent = document.evaluate("//*[contains(@aria-label,'Thread list')]/following::div/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      newChat.style.display = "";
      chatScreenContent.style.display = "";
    }
  }, 100);
});


// Notification Sound Changer

document.addEventListener("MWAU-CustomSound", (message) => {
  const customAudio = message.detail;

  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        const addedElement = mutation.addedNodes[0];
        if (addedElement.tagName === "AUDIO") {
          addedElement.src = customAudio;
          addedElement.play();
          observer.disconnect();
          break;
        }
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
});