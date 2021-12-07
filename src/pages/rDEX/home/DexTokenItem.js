import React from 'react';
import { Text } from 'src/components/commonComponents';
import { useSwapRates } from 'src/hooks/useSwapRates';
import numberUtil from 'src/util/numberUtil';

export default function DexTokenItem(props) {
  const { tokenRate, liquidityRate } = useSwapRates({ type: props.type });

  const formatTokenRate = isNaN(Number(tokenRate)) ? '--' : numberUtil.handleAmountRoundToFixed(tokenRate, 3);

  const totalRate = isNaN(Number(tokenRate * liquidityRate))
    ? '--'
    : numberUtil.handleAmountRoundToFixed(tokenRate * liquidityRate, 3);

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
            Redeem rate: {formatTokenRate}
          </Text>
        </div>

        <Text
          size='18px'
          bold
          sameLineHeight
          color='#BABABA'
          style={{ position: 'absolute', right: '18px', top: '1px' }}>
          {totalRate}
        </Text>
      </div>

      <div style={{ height: '1px', backgroundColor: '#363E47' }}></div>
    </div>
  );
}
