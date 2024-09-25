import { ReactElement } from 'react';
import './SettingsItem.css';

interface SettingsItemProps {
  title: string;
  desc: string;
  svgElement: ReactElement;
  value: boolean;
  onChangeFunc: () => void;
}

export default function SettingsItem(props: SettingsItemProps): JSX.Element {
  return (
    <>
      <div className='settingsItem'>
        <div className='settingsItemIcon'>
          {props.svgElement}
        </div>
        <div className='settingsItemDescription'>
          <span className='settingsItemDescriptionHeader'>{props.title}</span>
          <span className='settingsItemDescriptionText'>{props.desc}</span>
        </div>
        <label className="settingsItemToggle">
          <input type='checkbox' checked={props.value} onChange={props.onChangeFunc} />
          <div className="settingsItemToggleSlider"></div>
        </label>
      </div>
      <br />
    </>
  )
}