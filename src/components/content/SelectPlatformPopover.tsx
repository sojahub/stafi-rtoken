import { Popover } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router';
import arrow_down_black from 'src/assets/images/arrow_down_black.svg';
import styled from 'styled-components';
import { Text } from '../commonComponents';

type Props = {
  currentPlatform: string;
  platforms: Array<string>;
  onClick: Function;
};

export const SelectPlatformPopover = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  return (
    <div>
      <Popover
        visible={visible}
        onVisibleChange={setVisible}
        overlayClassName={'stafi-popover-link'}
        placement='bottom'
        trigger='click'
        content={
          <div>
            {props.platforms &&
              props.platforms.map((item, index) => {
                return (
                  <div
                    key={index + ''}
                    className='item-link'
                    onClick={() => {
                      setVisible(false);
                      props.onClick(item);
                    }}>
                    {item}
                  </div>
                );
              })}
          </div>
        }>
        <PlatformCard>
          <Text
            size='12px'
            scale={0.67}
            bold
            transformOrigin='left center'
            color='#2B3239'
            clickable
            style={{ width: '30px' }}>
            {props.currentPlatform}
          </Text>

          <img src={arrow_down_black} width='8px' height='5px' alt='icon' />
        </PlatformCard>
      </Popover>
    </div>
  );
};

const PlatformCard = styled.div`
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  height: 16px;
  width: 54px;
  justify-content: center;
  cursor: pointer;
`;
