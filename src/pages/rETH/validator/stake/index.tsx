import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import drop_down_arrow from 'src/assets/images/drop_down_arrow.svg';
import eth_svg from 'src/assets/images/eth.svg';
import LeftContent from 'src/components/content/leftContent';
import OffboardModal from 'src/components/modal/boardModal';
import { getNodeStakingPoolCount, handleCurrentPool, handleOffboard, handleStake } from 'src/features/rETHClice';
import A from 'src/shared/components/button/a';
import Button from 'src/shared/components/button/button';
import Popover from 'src/shared/components/popover/addressSelect';
import ProgressBar from 'src/shared/components/progressBar';
import Upload from 'src/shared/components/upload';
import { RootState } from 'src/store';
import StringUtil from 'src/util/stringUtil';
import './index.scss';

export default function Index(props:any){
    const dispatch = useDispatch()
    const [offboardModalVisible,setOffboardModalVisible]=useState(false)
    const [validatorKeysState,setValidatorKeysState]=useState<any>([])
    const [btnActiveStatus,setBtnActiveStatus]=useState(0);
    const [poolTotalStake,setPoolTotalStake]=useState(32); 
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
              window.open("https://docs.stafi.io/rtoken-app/reth-solution/original-validator-guide#2.-use-deposit-cli-to-generate-a-key-file");
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
              dispatch(handleStake(validatorKeysState,(e:string)=>{
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
            OKText="Offboard"
            CancelText="Cancel"
            title="Confirm to offboard"
            content="Are your sure to offboard? All deposits will be refunded once confirm"
            onOK={()=>{
                setOffboardModalVisible(false)
                dispatch(handleOffboard(()=>{
                    props.history.push("/rETH/validator/deposit")
                }))
            }}
        />
  
    </LeftContent>
}