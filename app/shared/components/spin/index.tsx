import React from 'react';
import {
  createFromIconfontCN
} from '@ant-design/icons';
import './index.scss';

const IconFont = createFromIconfontCN({
  scriptUrl: ['http://at.alicdn.com/t/font_2582233_im43gq2fz9.js'],
});

export default function Index(Props: {type:string,fontSize?:string,color?:string }) {
  return (
    <span className="current-iconfontcn">
      <IconFont
        type={Props.type||''}
        style={{
          fontSize:Props.fontSize||'55px',
          color:Props.color||'#23292F',
        }}
        spin
        />
    </span>
  );
}