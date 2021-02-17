import React from 'react';
import Button from '../button/button'
import success from '@images/success.png'
import failure from '@images/failure.svg'
import doubt from "@images/doubt.svg"
import './liquidingProcessSliderItem.scss';

type Props={
  index:number,
  title:string,
  failure?:boolean,
  showButton?:boolean
}
export default function Index(props:Props){
  return <div className="liquidingProcesSliderItem">
    <div className="title">
      <div className="sequence">{props.index}</div> <label>{props.title}</label>
      <img className="doubt" src={doubt}/>
    </div>
    <div className="item">
      <label>Brocasting...</label>
      <img src={success}/>
    </div>
    <div className="item">
      <label>Packing...</label>
      <img src={success}/>
    </div>
    <div className="item">
      <label>Finalizing...</label>
      {props.failure?<img src={failure}/>:<img src={success}/>}
    </div>
    <div className="item">
      <label>Check Tx <label className="address">0x64…4cd8</label></label> 
    </div>

    {props.failure && <div className="item failure">
        <label>{props.title} is fail</label> 
        {props.showButton && <Button btnType="square" size="small">Re-{props.title}</Button>}
    </div>}
  </div>
}