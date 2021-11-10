import { Button } from 'antd';
import React from 'react';
import './index.scss';


type Props = {
  children: any;
  disabled?: boolean;
  onClick?: Function;
  htmlType?: 'button' | 'submit' | 'reset';
  className?: string;
};
export default function Index(props: Props) {
  return (
    <Button
      htmlType={props.htmlType}
      ghost
      disabled={props.disabled}
      onClick={() => {
        props.onClick && props.onClick();
      }}
      className={`stafi_ghost_button ${props.className}`}>
      {props.children}
    </Button>
  );
}
