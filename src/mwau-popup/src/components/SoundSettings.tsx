import './SoundSettings.css';
import { chromeStorage } from '../storage';
import { useCallback, useEffect, useState } from 'react';


export default function SoundSettings(): JSX.Element {
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  function uploadAudio(): void {
    try {
      const audioFileInput = document.getElementById("audioFileUpload") as HTMLInputElement;
      const fileUpload: File = audioFileInput.files![0];
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const audioDataURL = e.target!.result as string;
        chromeStorage.set({ uploadedAudio: audioDataURL },
          () => {
            setStatusMessage("Successfully uploaded file. Please refresh Messenger to activate the custom sound.");
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

  interface StoredAudio {
    uploadedAudio?: string;
  }

  const loadAudio = useCallback(() => {
    chromeStorage.get(["uploadedAudio"], function (result: StoredAudio) {
      if (result.uploadedAudio) {
        setAudioSrc(result.uploadedAudio);
        const audioElement = document.getElementById("audioElement") as HTMLAudioElement;
        audioElement.load();
      }
    });
  }, [setAudioSrc]);

  function deleteAudio(): void {
    chromeStorage.remove("uploadedAudio");
    setAudioSrc("");
    setStatusMessage("Custom sound removed. Please refresh Messenger to complete the removal.");
  }

  useEffect(() => {
    loadAudio();
  }, [loadAudio]);


  return (
    <>
      <p>Play current custom sound:</p>
      <audio src={audioSrc} controls id="audioElement">
        Your browser does not support the audio tag.
      </audio>
      <p id='soundButtonHolder'>
        <label htmlFor="audioFileUpload" className='styledLikeButton'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
          <span> {audioSrc == "" ? "Upload New" : "Replace Existing"}</span>
        </label>
        <input type="file" accept="audio/*" id="audioFileUpload" onChange={uploadAudio} />

        <button onClick={deleteAudio} disabled={audioSrc == ""}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
          <span> Delete</span>
        </button>
      </p>
      <p><span>{statusMessage}</span></p>
    </>
  )
}