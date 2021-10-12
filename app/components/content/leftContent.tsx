import React from 'react';
import './index.scss';
type Props = {
  children: any;
  className?: string;
  padding?: string;
  width?: any;
};
export default function Index(props: Props) {
  return (
    <div
      className={`stafi_left_context ${props.className || ''}`}
      style={{ padding: props.padding, width: props.width }}>
      {props.children}
    </div>
  );
}
