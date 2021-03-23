import React, { useState } from 'react';
import {Input,Popover} from 'antd';  
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
    type?:any
}
export default function Index(props:Props){

    const [showSelect,setShowSelect]=useState(false)
    return <Input 
    className="amount_input type_input" 
    onChange={(e)=>{  
        let value:any = e.target.value.replace(/[^\d\.]/g,'')
        props.onChange && props.onChange(value);
    }}
    value={props.value}
    placeholder={props.placeholder} 
    suffix={<Popover visible={showSelect} placement="bottomRight" overlayClassName="stafi_type_input_select" title={<SelectTitle onClose={()=>{
      setShowSelect(false)
    }}/>} content={<Select 
      selectDataSource={props.selectDataSource}
      fromType={props.type}
      onSelectChange={(e:any)=>{ 
        props.onSelectChange && props.onSelectChange(e);
        setShowSelect(false)
      }}/>} trigger="click">
      {props.type?<div onClick={()=>{
      setShowSelect(true);
    }}><img src={props.type.selectedIcon} />{props.type.title} <img src={leftArrowSvg} /></div>:<div></div>}</Popover>}/>
}

type SelectTitleProps={
  onClose?:Function
}
function SelectTitle(props:SelectTitleProps){
  return  <div className='title'>
  <label>Select a token</label>
  <img src={black_close} onClick={()=>{
    props.onClose && props.onClose()
  }}/>
</div>
}

type SelectProps={
  onSelectChange?:Function,
  fromType:any,
  selectDataSource?:any[]
}
function Select(props:SelectProps){
  return <div className="content">

      {props.selectDataSource && props.selectDataSource.map(item=>{
        return <div className="item"  onClick={()=>{
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