import { Input } from 'antd';
import React from 'react';
import './inputEmbed.scss';

export default function Index(props: any) {
  return (
    <div className={'address_input_embed_container'}>
      <Input {...props} className={'address_input ant-input-affix-wrapper'}/>
    </div>
  );
}
