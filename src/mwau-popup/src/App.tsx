import { useEffect, useState } from 'react';
import './App.css';
import './SettingsItem.css';

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
      <div className="contentCard">
        <h1>Messenger Web App Upgrades</h1>

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
      <div className="contentCard">
        <div className='settingsItem'>
          <div className='settingsItemIcon'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
            </svg>
          </div>
          <div className='settingsItemDescription'>
            <span className='settingsItemDescriptionHeader'>Escape to Close</span>
            <span className='settingsItemDescriptionText'>Press the escape key to close the current chat.</span>
          </div>
          <label className="settingsItemToggle" htmlFor='enableEscapeToClose'>
            <input type='checkbox' id='enableEscapeToClose'/>
            <div className="settingsItemToggleSlider"></div>
          </label>
        </div>
      </div>
    </>
  )
}