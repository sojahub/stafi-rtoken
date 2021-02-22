import React from 'react';
import {processStatus} from '@features/globalClice'
import Button from '../button/button'
import success from '@images/success.png'
import failure from '@images/failure.svg'
import doubt from "@images/doubt.svg"
import StringUtil from '@util/stringUtil'
import './liquidingProcessSliderItem.scss';

type Props={
  index:number,
  title:string,
  failure?:boolean,
  showButton?:boolean,
  data?:any
}
export default function Index(props:Props){
  return <div className="liquidingProcesSliderItem">
    <div className="title">
      <div className="sequence">{props.index}</div> <label>{props.title}</label>
      <img className="doubt" src={doubt}/>
    </div>
    <div className="item">
      <label>Brocasting...</label>
      {(props.data && props.data.brocasting==processStatus.success) && <img src={success}/>}
      {(props.data && props.data.brocasting==processStatus.failure) && <img src={failure}/>}
    </div>
    <div className="item">
      <label>Packing...</label> 
      {(props.data && props.data.packing==processStatus.success) && <img src={success}/>}
      {(props.data && props.data.packing==processStatus.failure) && <img src={failure}/>}
    </div>
    <div className="item">
      <label>Finalizing...</label>
      {(props.data && props.data.minting==processStatus.success) && <img src={success}/>}
      {(props.data && props.data.minting==processStatus.failure) && <img src={failure}/>}
    </div>
    {(props.data && props.data.checkTx) && <div className="item">
      <label>Check Tx <label className="address">{StringUtil.replacePkh(props.data.checkTx,6,60)}</label></label> 
    </div>}

    {(props.data && (props.data.brocasting==processStatus.failure || props.data.packing==processStatus.failure || props.data.minting==processStatus.failure)) && <div className="item failure">
        <label>{props.title} is fail</label> 
        {props.showButton && <Button btnType="square" size="small">Re-{props.title}</Button>}
    </div>}
  </div>
}