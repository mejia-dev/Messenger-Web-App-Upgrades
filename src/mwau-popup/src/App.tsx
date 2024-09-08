import './App.css'

function App() {

  console.log(chrome.storage);


  const chromeStorage = chrome.storage.local;
  // const chromeStorage = window.localStorage;

  const audioElement: HTMLAudioElement = document.getElementById("audioElement") as HTMLAudioElement;

  async function handleAudioUpload() {
    try {
      const audioFileUpload: HTMLInputElement = document.getElementById("audioFileUpload") as HTMLInputElement;
      const file = audioFileUpload.files![0];
      const reader = new FileReader();
      reader.onload = function (e: any) {
        const audioDataURL = e.target.result;
        chromeStorage.set({ uploadedAudio: audioDataURL },
          function () {
            document.getElementById("message")!.innerText = "Successfully uploaded file. Please refresh the page to activate the custom sound.";
            loadCurrentAudio();
          }
        );
      };
      reader.readAsDataURL(file);
    }
    catch (e: any) {
      document.getElementById("message")!.innerText = e.message;
    }
  }

  async function loadCurrentAudio() {
    chromeStorage.get(["uploadedAudio"], function (result: any) {
      if (result.uploadedAudio) {
        const audioSource = document.createElement("source");
        audioSource.setAttribute("src", result.uploadedAudio);
        audioElement.innerHTML = "";
        audioElement.appendChild(audioSource);
        audioElement.load();
        generateDeleteButton();
      }
    });
  }

  function generateDeleteButton() {
    if (document.getElementById("deleteSoundButton")) document.getElementById("deleteSoundButton")!.remove();
    const delButton = document.createElement("button");
    delButton.innerText = "Remove custom sound";
    delButton.id = "deleteSoundButton";
    delButton.classList.add("deleteSoundButton");
    delButton.addEventListener("click", doDelete);
    audioElement.after(delButton);
  }

  function doDelete() {
    chromeStorage.clear();
    audioElement.innerHTML = "";
    audioElement.load();
    document.getElementById("deleteSoundButton")!.remove();
    document.getElementById("message")!.innerText = "Custom sound removed. Please refresh the page to complete the removal.";
  }

  loadCurrentAudio();

  return (
    <>
      <div id="contentCard">
        <h1>Messenger Notification<br />Sound Changer</h1>

        <p>Play current custom sound:
          <audio controls id="audioElement">
            Your browser does not support the audio tag.
          </audio>
        </p>
        <p>
          <label htmlFor="audioFileUpload">Upload new custom sound</label>
          <input type="file" accept="audio/*" id="audioFileUpload" onChange={handleAudioUpload} />
        </p>
        <p><span id="message"></span></p>
      </div>
    </>
  )
}

export default App
