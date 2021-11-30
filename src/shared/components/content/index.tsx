import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './index.scss';

type Props = {
  children: any;
  className?: string;
  routes?: any[];
  location?: any;
};

export default function Index(props: Props) {
  const location = useLocation();
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

  const className2 = location.pathname.includes('/staker/reward') ? 'stafi_content_high' : 'stafi_content';

  return <div className={`stafi_content ${className} ${className2} ${props.className}`}>{props.children}</div>;
}
