import React from 'react';
import {useDispatch} from 'react-redux';
import { Popover} from 'antd';
import Item from './popoverItem';
import {setProcessSlider} from '@features/globalClice'
import './popover.scss';

type Props={
  children:any
}
export default function Index(props:Props){
  const dispatch = useDispatch();
  const content=(<>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  " 
  onClick={()=>{
    dispatch(setProcessSlider(true))
  }}/>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  " onClick={()=>{
    dispatch(setProcessSlider(true))
  }}/>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  "/>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  "/>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  "/>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  "/>
  <Item title="Stake" 
  content="Staked 24 FIS from your Wallet to StaFi Validator Pool Contract"
  time=" 2020-11-20 22:10  "/>
  </> )
   return <Popover placement="bottomLeft" overlayClassName="stafi_notice_popover" title="Notification"  content={content} trigger="click">
     {props.children}
 </Popover>
}