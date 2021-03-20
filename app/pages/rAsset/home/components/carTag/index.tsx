import React from 'react';
import './index.scss';

type Props={
  type:'native' | 'erc',
  onClick?:Function
}
export default function index(props:Props){
  return <div className="rAsset_tag">
    <div className={`${props.type=="native" && "tag_active"}`} onClick={()=>{
      (props.onClick && props.type!="native") &&  props.onClick();
    }}>
      rAssets<label>/Native</label>
    </div>
    <div className={`${props.type=="erc" && "tag_active"}`} onClick={()=>{
      (props.onClick && props.type!="erc") &&  props.onClick();
    }}>
      rAssets<label>/ERC20</label>
    </div>
  </div>
}