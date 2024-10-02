import { useEffect, useState } from 'react';
import './App.css';
import SettingsItem from './components/SettingsItem';
import SoundSettings from './components/SoundSettings';
import About from './components/About';
import Header from './components/Header';

export const chromeStorage: chrome.storage.LocalStorageArea = chrome.storage.local;
export default function App(): JSX.Element {

  interface SettingsObject {
    customNotificationSound: boolean,
    escCloseChat: boolean,
    unreadBadges: boolean
  }

  const defaultSettingsList: SettingsObject = {
    customNotificationSound: true,
    escCloseChat: true,
    unreadBadges: true,
  }

  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);
  const [settingsList, setSettingsList] = useState<SettingsObject>(defaultSettingsList);
  const [settingsMessage, setSettingsMessage] = useState<string>("");
  const [aboutShown, setAboutShown] = useState<boolean>(false);

  function toggleSetting(setting: keyof SettingsObject) {
    const savedSettings = settingsList;
    switch (setting) {
      case 'customNotificationSound':
        savedSettings.customNotificationSound = !settingsList.customNotificationSound;
        break;
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
      setSettingsMessage("Settings saved. Please refresh Messenger to apply changes.");
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
    loadSettings();
  }, []);


  return (
    <>
      {aboutShown ?
        (
          <div className='contentCard'>
            <Header 
              aboutVisible={aboutShown}
              changeAboutVisible={setAboutShown}
            />
            <About />
          </div>
        )
        :
        (
          <>
            <div className='contentCard'>
              <Header 
                aboutVisible={aboutShown}
                changeAboutVisible={setAboutShown}
              />
              {loadingSettings ? (<p>Loading...</p>) : (
                <>
                  <br />
                  <SettingsItem
                    title="Custom Notification Sound"
                    desc="Replace the default new message notification sound."
                    value={settingsList.customNotificationSound}
                    onChangeFunc={() => toggleSetting('customNotificationSound')}
                    svgElement={(<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-volume-up-fill" viewBox="0 0 16 16"><path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z" /><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" /><path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" /></svg>)}
                  />
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
                  {settingsMessage != "" ? <p id='settingsMessage'>{settingsMessage}</p> : <></>}
                </>
              )}
            </div>

            {!loadingSettings && settingsList.customNotificationSound ? (
              <div className="contentCard">
                <h4 className='settingsHeader'>Custom Notification Sound Settings</h4>
                <SoundSettings />
              </div>
            ) : (<></>)}
          </>
        )
      }
    </>
  )
}