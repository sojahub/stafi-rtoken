import React from 'react';
import selected_svg from '@images/selected.svg';
import unSelected_svg from '@images/unSelected.svg';

type Props={
  data:any
  selected?:boolean,
  onClick?:Function
}
export default function Index(props:Props){
  return <div className="wallet_card_item" onClick={()=>{
    props.onClick && props.onClick();
  }}>
    <div>
<label className="item_title">{props.data.title}</label>
<label className="item_address">{props.data.address}</label>
    </div>
    <div className="item_money">
      {props.data.money} <img src={props.selected?selected_svg:unSelected_svg} />
    </div>
  </div>
}