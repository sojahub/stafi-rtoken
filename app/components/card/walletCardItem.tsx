import React from 'react';
import selected_svg from '@images/selected.svg';
import unSelected_svg from '@images/unSelected.svg';

type Props={
  data:any,
  type?:string,
  selected?:boolean,
  onClick?:Function
}
export default function Index(props:Props){
  return <div className="wallet_card_item" onClick={()=>{
    props.onClick && props.onClick();
  }}> 
<div className="item_title">{props.data.name} 
      <div className="item_money">
        {props.data.balance} {props.type} <img src={props.selected?selected_svg:unSelected_svg} />
      </div>
    </div>
<div className="item_address">{props.data.address}</div> 
  </div>
}