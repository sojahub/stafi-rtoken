import React from 'react'; 
import leftArrowSvg from '@images/left_arrow.svg'; 
import DataItem from './components/dataItem';
import A from '@shared/components/button/a'
import './index.scss';
export default function Index(props:any){
   
  return <div className="stafi_poolStatus_container">
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
    <div className="title">
        Pool Status
    </div> 

    <div className="container">
      <DataItem label="Deposited ETH" value={23.23}/>
      <DataItem label="Minted rETH" value={23.233} other={<>
        Contracts address: <A underline={true}> 0x23…HNe8</A>
      </>}/>
      <DataItem label="Staked ETH" value={23} /> 
      <DataItem label="Pool ETH " value={0} other="Pool Contracts: 23"/>
      <DataItem label="Unmatched ETH" value={23}/>
      <DataItem label="Unmatched Validators" value={23} other="You rank 3rd in the matching queen"/>
      <DataItem label="Staker APR" value={"23.89%"} other="Estimated"/>
      <DataItem label="Validator APR" value={"23.41%"} other="Estimated"/> 
    </div>
  </div>
}