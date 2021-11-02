import React, { useState } from 'react';
import {Input,Popover,message} from 'antd';  
import black_close from '@images/black_close.svg';
import leftArrowSvg from '@images/left_arrow.svg';

import rETH_svg from '@images/rETH.svg';
import './index.scss';

type Props={
    placeholder?:string, 
    unit?:string,
    value?:string | number ,
    onChange?:Function,
    onSelectChange?:Function,
    selectDataSource?:any[],
    token?:any,
    token_icon:any,
    token_title:string,
    disabled?:boolean, 
    selectTitle?:string,
    maxInput?:string | number
}
export default function Index(props:Props){

    const [showSelect,setShowSelect]=useState(false)
    return <Input 
    disabled={props.disabled}
    className="amount_input type_input" 
    onChange={(e)=>{  
      let value = e.target.value.replace(/[^\d\.]/g,""); 
      value = value.replace(/^\./g,"");         
      value = value.replace(/\.{2,}/g,".");     
      value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/,'$1$2.$3');  
      if(Number(value)>Number(props.maxInput)){
        message.error("The input amount exceeds your transferrable balance");
        props.onChange && props.onChange(""); 
      }else{
        props.onChange && props.onChange(value); 
      }
    
    }}
    value={props.value}
    placeholder={props.placeholder} 
    suffix={props.disabled?<div className="disabled"><img className="icon" src={props.token_icon} />{props.token_title} </div>:(<Popover  visible={showSelect} placement="bottomRight" overlayClassName="stafi_type_input_select" title={<SelectTitle title={props.selectTitle} onClose={()=>{
      setShowSelect(false)
    }}/>} content={<Select 
      selectDataSource={props.selectDataSource}
      // fromType={props.type}
      selectedData={props.token}
      onSelectChange={(e:any)=>{ 
        props.onSelectChange && props.onSelectChange(e);
        setShowSelect(false)
      }}/>}>
      {props.token?<div onClick={()=>{
      setShowSelect(true);
    }}><img className="icon" src={props.token_icon} />{props.token_title} <img className="icon_last" src={leftArrowSvg} /></div>:<div></div>}</Popover>)}/>
}

type SelectTitleProps={
  onClose?:Function,
  title?:string
}
function SelectTitle(props:SelectTitleProps){
  return  <div className='title'>
  <label>{props.title?props.title:"Select a token"}</label>
  <img src={black_close} onClick={()=>{
    props.onClose && props.onClose()
  }}/>
</div>
}

type SelectProps={
  onSelectChange?:Function,
  selectDataSource?:any[],
  selectedData?:any
}
function Select(props:SelectProps){ 
  return <div className="content">

      {props.selectDataSource && props.selectDataSource.map(item=>{
        return <div className={`item ${props.selectedData.title==item.title?"active":""}`}  onClick={()=>{
                  props.onSelectChange && props.onSelectChange(item)
                }}>
                <div className="title">
                  <div>
                    <img src={item.icon} />
                  </div>
                  {item.title}
                </div>
                <label className="amount">
                    {item.amount}
                </label>
          </div>
      })} 
    </div> 
}

{/* <Popover placement="bottomRight" title={text} content={content} trigger="click">
        <Button>BR</Button>
      </Popover> */}