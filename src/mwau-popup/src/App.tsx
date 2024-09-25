import { useEffect, useState } from 'react';
import './App.css';
import SettingsItem from './components/SettingsItem';

export default function App(): JSX.Element {

  const chromeStorage: chrome.storage.LocalStorageArea = chrome.storage.local;

  interface SettingsObject {
    escCloseChat: boolean,
    unreadBadges: boolean
  }

  const defaultSettingsList: SettingsObject = {
    escCloseChat: true,
    unreadBadges: true,
  }

  const [audioSrc, setAudioSrc] = useState<string>("");
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [settingsList, setSettingsList] = useState<SettingsObject>(defaultSettingsList);



  async function handleAudioUpload(): Promise<void> {
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

  async function loadAudio(): Promise<void> {
    chromeStorage.get(["uploadedAudio"], function (result: StoredData) {
      if (result.uploadedAudio) {
        setAudioSrc(result.uploadedAudio);
        const audioElement = document.getElementById("audioElement") as HTMLAudioElement;
        audioElement.load();
      }
    });
  }


  function toggleSetting(setting: keyof SettingsObject) {
    console.log("Previous:" + settingsList.escCloseChat);
    console.log("Previous:" + settingsList.unreadBadges);
    const savedSettings = settingsList;
    switch (setting) {
      case 'escCloseChat':
        savedSettings.escCloseChat = !settingsList.escCloseChat;
        break;
      case 'unreadBadges':
        savedSettings.unreadBadges = !settingsList.unreadBadges;
        break;
      default:
        break;
    }
    chromeStorage.set({ "settings": savedSettings }, () => {
      loadSettings();
    });
  }

  interface StoredSettings {
    settings?: SettingsObject;
  }

  function loadSettings() {
    chromeStorage.get(["settings"], (result: StoredSettings) => {
      if (result.settings) {
        setSettingsList(result.settings);
      }
      setLoadingSettings(false);
    });
  }

  useEffect(() => {
    loadAudio();
    loadSettings();
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
        <h4 id='settingsHeader'>Settings</h4>
        {loadingSettings ? (<p>Loading...</p>) : (
          <>
            <br />

            <SettingsItem
              title="Escape to Close"
              desc="Press the escape key to close the current chat."
              value={settingsList.escCloseChat}
              onChangeFunc={() => toggleSetting('escCloseChat')}
              svgElement={(<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" /></svg>)}
            />

            <SettingsItem
              title="PWA Unread Badges"
              desc="Display badges on the app if installed as a PWA."
              value={settingsList.unreadBadges}
              onChangeFunc={() => toggleSetting('unreadBadges')}
              svgElement={(<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-app-indicator" viewBox="0 0 16 16"><path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1z" /><path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0" /></svg>)}
            />
          </>
        )}
      </div>

    </>
  )
}