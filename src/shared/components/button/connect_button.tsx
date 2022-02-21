import { Button } from 'antd';
import React from 'react';
import './index.scss';

type Props = {
  icon: any;
  children: any;
  width?: any;
  onClick?: Function;
  disabled?: boolean;
};
export default function Index(props: Props) {
  return (
    <Button
      disabled={props.disabled}
      className='stafi_connect_button'
      style={{ width: props.width }}
      onClick={() => {
        props.onClick && props.onClick();
      }}>
      <img src={props.icon} style={{ objectFit: 'cover' }} alt='icon' /> {props.children}
    </Button>
  );
}
