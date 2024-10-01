import './SoundSettings.css';

interface SoundSettingsProps {
  audioSrc: string;
  uploadFunction: () => Promise<void>;
  deleteFunction: () => void;
  statusMessage: string;
}

export default function SoundSettings(props: SoundSettingsProps): JSX.Element {
  return (
    <>
      <p>Play current custom sound:
        <audio src={props.audioSrc} controls id="audioElement">
          Your browser does not support the audio tag.
        </audio>
      </p>
      <p id='soundButtonHolder'>
        <label htmlFor="audioFileUpload">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
          <span> {props.audioSrc == "" ? "Upload New" : "Replace Existing"}</span>
        </label>
        <input type="file" accept="audio/*" id="audioFileUpload" onChange={props.uploadFunction} />

        <button onClick={props.deleteFunction} disabled={props.audioSrc == ""}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
          <span> Delete</span>
        </button>
      </p>
      <p><span>{props.statusMessage}</span></p>
    </>
  )
}