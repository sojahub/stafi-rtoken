import { Input } from 'antd';
import React from 'react';
import './inputEmbedNew.scss';

const { TextArea } = Input;

export default function Index(props: any) {
  return (
    <div className={'address_input_embed_new_container'}>
      <TextArea {...props} className={'address_input ant-input-affix-wrapper'} autoSize={{ minRows: 1, maxRows: 2 }} />
    </div>
  );
}
