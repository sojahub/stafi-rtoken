import { Carousel } from 'antd';
import { useState } from 'react';
import { HContainer } from 'src/components/commonComponents';
import styled from 'styled-components';
import DexTokenItem from './DexTokenItem';

export const SwapTokenSlider = (props: { items: any[] }) => {
  const { items } = props;
  const [current, setCurrent] = useState(0);
  const firstPageItems = items.slice(0, 4);
  const secondPageItems = items.slice(4);

  return (
    <div style={{ flex: 1, width: '250px', marginTop: '140px', marginLeft: '100px', marginRight: '50px' }}>
      <Carousel autoplay dots={false} afterChange={setCurrent} autoplaySpeed={5000}>
        <div>
          {firstPageItems.map((tokenData) => (
            <DexTokenItem key={tokenData.type} {...tokenData} />
          ))}
        </div>

        <div>
          {secondPageItems.map((tokenData) => (
            <DexTokenItem key={tokenData.type} {...tokenData} />
          ))}
        </div>
      </Carousel>

      <div style={{ width: '52px', marginLeft: '124px' }}>
        <HContainer justifyContent='center'>
          <Dot selected={current === 0} />

          <Dot selected={current === 1} />
        </HContainer>
      </div>
    </div>
  );
};

interface DotProps {
  selected: boolean;
}

const Dot = styled.div<DotProps>`
  background-color: ${(props) => (props.selected ? 'white' : '#676767')};
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 10px;
`;
