import React, { useMemo } from 'react';
import './index.scss';
type Props = {
  children: any;
  className?: string;
  routes?: any[];
  location?: any;
};
export default function Index(props: Props) {
  const className = useMemo(() => {
    if (props.location && props.routes) {
      const obj = props.routes.find((item) => {
        return item.path == props.location.pathname;
      });
      if (obj) {
        return obj.className;
      }
    }
    return null;
  }, [props.location]);
  return (
    <div
      className={`stafi_content ${className} ${
        location.pathname.includes('/rETH') ||
        location.pathname.includes('rAsset/erc') ||
        location.pathname.includes('swap/erc') ||
        location.pathname.includes('/rPool')
          ? ''
          : 'stafi_content_notice'
      }  ${props.className}`}>
      {props.children}
    </div>
  );
}
