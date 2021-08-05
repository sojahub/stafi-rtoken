import React from 'react';
import styled from 'styled-components';
import { Text } from './commonComponents';

export default function CommonButton(props) {
  const handleClick = () => {
    if (!props.disabled) {
      props.onClick();
    }
  };

  return (
    <Button
      top={props.mt}
      bottom={props.mb}
      left={props.ml}
      right={props.mr}
      disabled={props.disabled}
      onClick={handleClick}>
      <Text color={'#23292F'} size={'18px'} sameLineHeight bold>
        {props.text}
      </Text>
    </Button>
  );
}

const Button = styled.div((props) => ({
  marginTop: props.top,
  marginBottom: props.bottom,
  marginLeft: props.left,
  marginRight: props.right,
  opacity: props.disabled ? 0.5 : 1,
  height: '43px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  backgroundColor: '#00F3AB',
  borderRadius: '4px',
  cursor: 'pointer',
}));
