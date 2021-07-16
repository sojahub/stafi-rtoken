import { Popover } from 'antd';
import React from 'react';
import './index.scss';

type Props = {
  children: any;
  data: any[];
};
export default function Index(props: Props) {
  return (
    <Popover
      overlayClassName={'stafi-popover-link'}
      placement='bottom'
      trigger='click'
      content={
        <div>
          {props.data &&
            props.data.map((item, index) => {
              return (
                <div
                  key={index + ''}
                  className='item-link'
                  onClick={() => {
                    window.open(item.url);
                  }}>
                  {item.label}
                </div>
              );
            })}
        </div>
      }>
      {props.children}
    </Popover>
  );
}
