import React from 'react';
import leftArrowSvg from '@images/left_arrow.svg';

import './index.scss';
type Props={
  onClick?:Function
}
export default function Index(props:Props){
  return <img className="stafi_card_back" src={leftArrowSvg} onClick={()=>{
      props.onClick && props.onClick()
  }}/>
}