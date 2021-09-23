import { Popover } from 'antd';
import React, { useState } from 'react';
import './index.scss';

type Props = {
  children: any;
  data: any[];
  onClick?: Function;
};
export default function Index(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
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
                    setVisible(false);
                    if (props.onClick) {
                      props.onClick(item);
                    } else {
                      window.open(item.url);
                    }
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
