import React from 'react';
import LeftContent from '@components/content/leftContent';
import selected_rETH_svg from '@images/selected_rETH.svg';
import pool_eth_svg from '@images/pool_eth.svg';
import Button from '@shared/components/button/button';
import AddressCard from './components/addressCard';
import AddressItem from './components/addressCard/item';
import down_arrow from '@images/selectedIcon2.svg'
import NoDetails from '@shared/components/noDetails'
import './index.scss'
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import NumberUtil from '@util/numberUtil';
export default function Index(props:any){

  const {selfDeposited,apr} =useSelector((state:RootState)=>{
    return  {
      selfDeposited:state.rETHModule.selfDeposited,
      apr:state.rETHModule.validatorApr
    }
  })
  // return <LeftContent className="stafi_status_validator_context">
  //     <NoDetails type="max"/> 
  // </LeftContent>
  return <LeftContent className="stafi_status_validator_context">
        <div className="staked_eth">
            <div className="title">
                <img src={selected_rETH_svg} /> Staked ETH
            </div>
            <div className="liquefy_panel">
                <label>
                    64.15
                </label>
                <Button size="small" btnType="ellipse" onClick={()=>{
                  //  props.history.push("/rETH/liquefy"); 
                   message.info('This feature is not yet open.');
              }}>Liquefy</Button>
            </div>
            <div className="apr_panel">
                <div>
                  Self-deposited: {NumberUtil.handleEthRoundToFixed(selfDeposited)}
                </div>
                <div>
                  Current APR: {apr}
                </div>
            </div>
        </div>
        <div className="pool_contracts">
            <div className="title">
                <img src={pool_eth_svg} />Pool Contracts (5)  <img className="icon" src={down_arrow} />
            </div>
            <NoDetails type="small"/> 
            {/* <div className="Row">
              <AddressCard >
                    <AddressItem status="Active" />
                    <AddressItem status="Pending"/>
                    <AddressItem status="Waiting"/>
                    <AddressItem status="Unresponsive"/>
                    <AddressItem status="Exit"/>
              </AddressCard>

              <div className="btns">
              <Button size="small" btnType="ellipse" onClick={()=>{
                  props.history.push("/rETH/validator/deposit")
                }}>New Deposit</Button>
              </div>
            </div> */}
        </div>
    </LeftContent>
}