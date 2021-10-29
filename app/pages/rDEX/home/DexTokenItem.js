import { Text } from '@components/commonComponents';
import React from 'react';

export default function DexTokenItem(props) {
  return (
    <div style={{ maxWidth: '280px', marginBottom: '22px', position: 'relative' }}>
      <div
        style={{
          height: '70px',
          display: 'flex',
          flexDirection: 'row',
        }}>
        <img width='20' height='20' style={{ opacity: 0.4, marginLeft: '12px' }} src={props.icon} />

        <div style={{ flex: 1, marginLeft: '10px', marginTop: '1px' }}>
          <Text size='18px' sameLineHeight bold color='#676767'>
            {props.title}/{props.title.slice(1)}
          </Text>

          <Text size='14px' sameLineHeight color='#676767' mt='20px'>
            Redeem rate: {props.ratio}
          </Text>
        </div>

        <Text
          size='18px'
          sameLineHeight
          color='#BABABA'
          style={{ position: 'absolute', right: '18px', top: '1px' }}>
          {props.totalRate}
        </Text>
      </div>

      <div style={{ height: '1px', backgroundColor: '#363E47' }}></div>
    </div>
  );
}
