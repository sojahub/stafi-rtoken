import React from 'react';
import './index.scss';
type Props = {
  children: any;
  className?: string;
};
export default function Index(props: Props) {
  return (
    <div
      className={`stafi_content ${
        location.pathname.includes('/rETH') || location.pathname.includes('rAsset/erc') || location.pathname.includes('swap/erc') ? '' : 'stafi_content_notice'
      } ${props.className}`}>
      {props.children}
    </div>
  );
}
