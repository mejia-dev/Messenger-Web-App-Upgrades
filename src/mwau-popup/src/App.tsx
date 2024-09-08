import { useEffect, useState } from 'react';
import './App.css'

export default function App(): JSX.Element {

  const [audioSrc, setAudioSrc] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const chromeStorage: chrome.storage.LocalStorageArea = chrome.storage.local;

  async function handleAudioUpload() {
    try {
      const audioFileInput = document.getElementById("audioFileUpload") as HTMLInputElement;
      const fileUpload: File = audioFileInput.files![0];
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const audioDataURL = e.target!.result as string;
        chromeStorage.set({ uploadedAudio: audioDataURL },
          () => {
            setStatusMessage("Successfully uploaded file. Please refresh the page to activate the custom sound.");
            loadAudio();
          }
        );
      };
      reader.readAsDataURL(fileUpload);
    }
    catch (error: unknown) {
      if (error instanceof Error) setStatusMessage(error.message);
    }
  }

  interface StoredData {
    uploadedAudio?: string;
  }

  async function loadAudio() {
    chromeStorage.get(["uploadedAudio"], function (result: StoredData) {
      if (result.uploadedAudio) {
        setAudioSrc(result.uploadedAudio);
        const audioElement = document.getElementById("audioElement") as HTMLAudioElement;
        audioElement.load();
      }
    });
  }


  useEffect(() => {
    loadAudio();
  }, []);


  return (
    <>
      <div id="contentCard">
        <h1>Messenger Notification<br />Sound Changer</h1>

        <p>Play current custom sound:
          <audio src={audioSrc} controls id="audioElement">
            Your browser does not support the audio tag.
          </audio>
        </p>
        <p>
          <label htmlFor="audioFileUpload">Upload new custom sound</label>
          <input type="file" accept="audio/*" id="audioFileUpload" onChange={handleAudioUpload} />
        </p>
        <p><span id="message">{statusMessage}</span></p>
      </div>
    </>
  )
}