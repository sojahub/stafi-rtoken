import React, { useEffect, useState } from 'react';
import A from '@shared/components/button/a';
import {message} from 'antd'
import ProgressBar from '@shared/components/progressBar';
import eth_svg from '@images/eth_2.svg'
import Upload from '@shared/components/upload';
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import {getNodeStakingPoolCount,handleCurrentPool,handleOffboard,handleStake} from '@features/rETHClice'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import OffboardModal from '@components/modal/offboardModal'
import { RootState } from 'app/store';
export default function Index(props:any){
    const dispatch = useDispatch()
    const [offboardModalVisible,setOffboardModalVisible]=useState(false)
    const [validatorKeysState,setValidatorKeysState]=useState<any>([])
    const [btnActiveStatus,setBtnActiveStatus]=useState(0);
    const [poolTotalStake,setPoolTotalStake]=useState(32)
    useEffect(()=>{
        dispatch(getNodeStakingPoolCount())
    },[])
    const {currentTotalDeposit,currentPoolStatus}=useSelector((state:RootState)=>{
        return {
            currentTotalDeposit:state.rETHModule.currentTotalDeposit,
            currentPoolStatus:state.rETHModule.currentPoolStatus, 
        }
    })
    const filesChange=(file:any) =>{
        let resultFile = file;
      
        if (!resultFile) { 
          message.error('Please select a file.')
          return;
        }
      
        let reader = new FileReader()
        reader.readAsText(resultFile, 'UTF-8')
        reader.onload = (e) => {
          let fileContent:any = e.target.result
          try {
            let validatorKeys = JSON.parse(fileContent); 
            if (!Array.isArray(validatorKeys)) {
              message.error('Json content must be array!');
              return;
            }
            if (validatorKeys.length != 1) { 
              message.error('There are multiple keys, please upload only one key');
              return;
            }
            
            if (!validatorKeys[0].deposit_data_root || !validatorKeys[0].signature || 
              !validatorKeys[0].pubkey) {
                message.error('Miss deposit_data_root or signature or pubkey')
              return;
            }
            // this.uploadFieldName = resultFile.name;
            setValidatorKeysState(validatorKeys);
            if (currentTotalDeposit >= poolTotalStake) {
                setBtnActiveStatus(1)
            }
          } catch(error) {
            message.error('JSON error!')
          }
          
        }
      }
    return <LeftContent className="stafi_validator_context stafi_reth_validator_context">
        <div className="reth_title"> Stake </div>
       <div className="reth_sub_title">
        Pool contract can be staked once 32ETH is matched to your node, 
        Check <A underline={true} onClick={()=>{
            props.history.push("/rETH/poolStatus")
        }}>pool status</A>
       </div>

        <div className="address">
            Contract Address: <A underline={true}>0x23…HNe8</A>
        </div>
        <ProgressBar icon={eth_svg} text={currentTotalDeposit} progress={currentTotalDeposit*100/poolTotalStake}/>
        <div className="reth_title upload_title"> Upload </div>
       <div className="reth_sub_title upload_sub_title">
            Follow the <A underline={true}>instruction</A> and upload your file
       </div>
        <Upload currentPoolStatus={currentPoolStatus} onChange={(e:any)=>{
             filesChange(e);
        }}/>
        <div className="btns stake_btns">
          <A isGrey={true} onClick={()=>{
              setOffboardModalVisible(true)
          }}>Offboard</A>
           <Button disabled={btnActiveStatus!=1 || validatorKeysState.length != 1} onClick={()=>{
              if (currentPoolStatus == 2) {
                message.error("This pool contract has been staked");
                return;
              } 
              dispatch(handleStake(validatorKeysState,()=>{
                props.history.push("/rETH/validator/status")
              }));
           }}>
               Stake 
           </Button>
        </div>
        <OffboardModal visible={offboardModalVisible}
            onClose={()=>{
                setOffboardModalVisible(false)
            }}
            onOK={()=>{
                setOffboardModalVisible(false)
                dispatch(handleOffboard(()=>{
                    props.history.push("/rETH/validator/deposit")
                }))
            }}
        />
    </LeftContent>
}