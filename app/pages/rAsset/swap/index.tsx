import React, { useEffect, useState } from 'react'; 
import Content from '@shared/components/content';
import Title from '@shared/components/cardTitle';
import Back from '@shared/components/backIcon';
import Input from '@shared/components/input/addressInput';
import TypeInput from '@shared/components/input/typeInput';
import {rSymbol,Symbol} from '@keyring/defaults';
import Button from '@shared/components/button/button'
import './index.scss'
import rETH_svg from '@images/rETH.svg';
import selected_rETH from '@images/selected_rETH.svg'; 
import rFIS_svg from '@images/rFIS.svg';
import selected_rFIS from '@images/selected_rFIS.svg'; 
import rDOT from '@images/rDOT.svg';
import selected_rDOT from '@images/selected_rDOT.svg'; 
import Understood from '@components/modal/understood'
const datas=[{
  icon:rETH_svg,
  selectedIcon:selected_rETH,
  title:"Atom",
  amount:"23.289",
  type:Symbol.Atom
},{
  icon:rFIS_svg,
  selectedIcon:selected_rFIS,
  title:"rFIS",
  amount:"23.289",
  type:Symbol.Fis
},{
  icon:rDOT,
  selectedIcon:selected_rDOT,
  title:"rDOT",
  amount:"23.289",
  type:Symbol.Dot
}]
export default function Index(props:any){  
  const [fromAoumt,setFormAmount]=useState();
  const [fromType,setFormType]=useState(datas[0]);
  const [toAoumt,setToAmount]=useState(); 
  const [address,setAddress]=useState();


  const [visible,setVisible]=useState(false);
  const [tokenType,setTokenType]=useState();
  const [operationType,setOperationType]=useState<undefined | 'erc20' |'native'>();
  // state: {type: "native", rSymbol: "rFIS"}
  useEffect(()=>{ 
    if(props.location.state){
      setTokenType(props.location.state.rSymbol);
      setOperationType(props.location.state.type);
    }
  },[props.location.state])

  // console.log(tokenType,operationType,"====operationType");
  return  <Content className="stafi_rasset_swap">
      <Back onClick={()=>{
          props.history &&  props.history.goBack(); 
      }}/>
      <Title label="rBridge Swap"/>
      <div>
        <div className="row">
          <div className="label">
              <label>From</label>
              <label className="balance">rFIS balance 233.424</label>
          </div>
          <div>
            <TypeInput 
            placeholder="0.0" 
            value={fromAoumt} 
            onChange={(value:any)=>{
              setFormAmount(value)
            }} 
            selectDataSource={datas} 
            token={fromType} 
            token_icon={operationType=="erc20" ? selected_rETH : fromType.selectedIcon}
            token_title={fromType.title}
            onSelectChange={(e:any)=>{ 
              setFormType(e);
            }}/> 
          </div>
        </div>
       
        <div className="row">
          <div className="label">
              <label>To</label> 
          </div>
          <div>
            <TypeInput disabled={true}  
            placeholder="0.0" 
            value={toAoumt} 
            onChange={(value:any)=>{
              setFormAmount(value)
            }} 
            selectDataSource={datas} 
            token={fromType}
            token_icon={operationType=="native" ? selected_rETH :fromType.selectedIcon}
            token_title={fromType.title}
            /> 
          </div>
        </div>

        <div className="row last"> 
          <div>
            <Input placeholder="To Ethereum Address" value={address} onChange={(e:any)=>{
              setAddress(e.target.value)
            }}/> 
          </div>
        </div>
        <div className="fee">
            Estimate Fee: 12.23 FIS
        </div>
        <div className="btns">
        <Button  onClick={()=>{
            setVisible(true);
         }}>Swap</Button>
        </div>
      </div>
      <Understood visible={visible}  onCancel={()=>{
         setVisible(false);
      }} onOk={()=>{
        setVisible(false);
      }}/>
  </Content>
}