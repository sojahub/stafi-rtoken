import { Input, message } from 'antd';
import React from 'react';
import './inputEmbed.scss';

export default function Index(props: any) {
  return (
    <div className={'slippage_tolerance_embed_container'}>
      <Input
        className={'amount_input ant-input-affix-wrapper'}
        value={props.value}
        onChange={(e) => {
          let value = e.target.value.replace(/[^\d.]/g, '');
          value = value.replace(/^\./g, '');
          value = value.replace(/\.{2,}/g, '.');
          value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
          value = value.replace(/^(-)*(\d+)\.(\d\d\d\d\d\d).*$/, '$1$2.$3');
          if (Number(value) > Number(99)) {
            message.error(`Slippage Tolerance should be between 0.1% - 99%`);
            props.onChange && props.onChange('');
          } else if (Number(value) > 0 && Number(value) < Number(0.1)) {
            message.error(`Slippage Tolerance should be between 0.1% - 99%`);
            props.onChange && props.onChange('');
          } else {
            props.onChange && props.onChange(value);
          }
        }}
      />
    </div>
  );
}
