import React, { useEffect, useState } from 'react';  
import LeftContent from '@components/content/leftContent';
import rFIS_stafi_svg from '@images/selected_r_fis.svg';
import rFIS_detail_svg from '@images/rfis_detail.svg';
import Button from '@shared/components/button/button'; 
import no_details from '@images/noDetail.png';
import NumberUtil from '@util/numberUtil' 
import A from '@shared/components/button/a';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store';
import {initValidatorStatus,handleOffboard} from '@features/FISClice';
import Modal from '@components/modal/boardModal';
import {Redirect} from 'react-router';

export default function Index(props:any){
  const dispatch  =useDispatch();
  const [visible,setVisible]=useState(false)
  useEffect(()=>{
    dispatch(initValidatorStatus());
  },[])


  const {exposure,nominateStatus,lastReward,currentCommission,validatorAddressItems,showValidatorStatus} = useSelector((state:RootState)=>{
    return {
      exposure:state.FISModule.exposure,
      nominateStatus:state.FISModule.nominateStatus,
      lastReward:state.FISModule.lastReward,
      currentCommission:state.FISModule.currentCommission,
      validatorAddressItems:state.FISModule.validatorAddressItems,
      showValidatorStatus:state.FISModule.showValidatorStatus,
    }
  })

  if(!showValidatorStatus){
    return <Redirect to="/rFIS/validator/onboard" />
  }
  return <LeftContent className="stafi_validator_context rfis_offboard_context">
      <div className="item first">
          <div className="title">
              <div>
                  <img src={rFIS_stafi_svg} />  Nominated FIS
              </div>
               {nominateStatus==1?<label>
                  Active
               </label>:<label className="waiting">
                  Waiting
               </label>}
          </div>

          <div className="info">
            <div className="rfis_value">
            {exposure ? NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(exposure.total)):"--" }
            </div>
            <div className="rfis_info_item">
              Self-bond: <label>{exposure? NumberUtil.handleFisAmountToFixed(NumberUtil.fisAmountToHuman(exposure.own)) :"--"}</label>
            </div>
            <div className="rfis_info_item">
              Reward last 7-day: {lastReward} FIS
            </div>
            <div className="rfis_info_item">
              Commission: {currentCommission}
            </div>
          </div>
      </div>
      <div className="item last nodata">
          <div className="title">
              <div>
                  <img src={rFIS_detail_svg} />  Nominated Details
              </div> 
          </div>
          {(validatorAddressItems && validatorAddressItems.length>0)?<div className="list">
                {validatorAddressItems.map((item:any)=>{
                  return <div className="row">
                  <div className="col col1">
                    Pool Address: <A onClick={()=>{
                      window.open('https://stafi.subscan.io/account/' + item.address);
                    }}>{item.shortAddress}</A>
                  </div>
                  <div className="col col2">
                    ERA {item.era}
                  </div>
                  <div className="col col3">
                    +{item.amount} FIS
                  </div>
              </div>
                })}
          </div>:<img className="no_details" src={no_details} />}
           
          <div className="btns">
            <Button size="small" btnType="ellipse" onClick={()=>{
              setVisible(true)
            }}>Offboard</Button>
          </div>
      </div>

      <Modal visible={visible} 
        title="Confirm to offboard"
        content="Make sure your current FIS account is your Controller account"
        OKText="Cancel"
        CancelText="Offboard"
        onClose={()=>{
          setVisible(false);
          dispatch(handleOffboard());
        }}
        onOK={()=>{
          setVisible(false)
          
        }}
      />
    </LeftContent>
}