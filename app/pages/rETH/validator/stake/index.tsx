import React, { useEffect, useState } from 'react';
import A from '@shared/components/button/a';
import {message} from 'antd'
import ProgressBar from '@shared/components/progressBar';
import eth_svg from '@images/eth.svg'
import Upload from '@shared/components/upload';
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import {getNodeStakingPoolCount,handleCurrentPool,handleOffboard,handleStake} from '@features/rETHClice'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import OffboardModal from '@components/modal/offboardModal'
import { RootState } from 'app/store';
import StringUtil from '@util/stringUtil';
import Popover from '@shared/components/popover/addressSelect'
import drop_down_arrow from '@images/drop_down_arrow.svg'
import Modal from '@components/modal/ethDepositModal'

export default function Index(props:any){
    const dispatch = useDispatch()
    const [offboardModalVisible,setOffboardModalVisible]=useState(false)
    const [validatorKeysState,setValidatorKeysState]=useState<any>([])
    const [btnActiveStatus,setBtnActiveStatus]=useState(0);
    const [poolTotalStake,setPoolTotalStake]=useState(32);
    const [visible,setVisible]=useState(false);
    useEffect(()=>{
        dispatch(getNodeStakingPoolCount())
    },[])
    const {currentTotalDeposit,currentPoolStatus,poolAddressItems,poolAddress}=useSelector((state:RootState)=>{
        return {
            currentTotalDeposit:state.rETHModule.currentTotalDeposit,
            currentPoolStatus:state.rETHModule.currentPoolStatus, 
            poolAddressItems:state.rETHModule.poolAddressItems,
            poolAddress:state.rETHModule.poolAddress
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
            check <A underline={true} onClick={()=>{
                props.history.push({pathname: "/rETH/poolStatus",
                state: poolAddress})
            }}>pool status</A>
       </div>

        
        <div className="address">
           {(poolAddress && poolAddress.length>0) ?<>Contract Address:<Popover onClick={(e:any)=>{ 
              dispatch(handleCurrentPool(e));
           }} datas={poolAddressItems} data={poolAddress}><label> <A underline={true}>{StringUtil.replacePkh(poolAddress,4,38)}</A><img src={drop_down_arrow} /></label></Popover></>:"No Contract Addresses Founded"} 
        </div>
        <ProgressBar icon={eth_svg} text={currentTotalDeposit} progress={currentTotalDeposit*100/poolTotalStake}/>
        <div className="reth_title upload_title"> Upload </div>
       <div className="reth_sub_title upload_sub_title">
            Follow the <A onClick={()=>{
              window.open("https://docs.stafi.io/rproduct/reth-solution/original-validator-guide#2-use-deposit-cli-to-generate-a-key-file");
              }}  underline={true}>instruction</A> and upload your file(deposit_data-*.json)
       </div>
        <Upload currentPoolStatus={currentPoolStatus} onChange={(e:any)=>{
             filesChange(e);
        }}/>
        <div className="btns stake_btns">
          {/* <A  isGrey={true} onClick={()=>{ 
              currentPoolStatus ==1 &&  setOffboardModalVisible(true) 
          }}>Offboard</A> */}
          <Button disabled={currentPoolStatus==2 || poolAddressItems.length==0} onClick={()=>{
              setOffboardModalVisible(true) 
           }}>
               Offboard 
           </Button>
           <Button disabled={btnActiveStatus!=1 || validatorKeysState.length != 1 || poolAddressItems.length==0} onClick={()=>{
              if (currentPoolStatus == 2) {
                message.error("This pool contract has been staked");
                return;
              } 
              setVisible(true);
              dispatch(handleStake(validatorKeysState,(e:string)=>{
                setVisible(false);
                if(e=="ok"){
                  props.history.push("/rETH/validator/status");
                }
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
          <Modal 
        visible={visible}
        onClose={()=>{
            setVisible(false);
        }}
       />
    </LeftContent>
}