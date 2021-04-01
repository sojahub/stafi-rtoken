import React, { useEffect, useState } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import Button from '@shared/components/button/connect_button';
import DataList from './components/list'
import Tag from './components/carTag/index';
import CountAmount from './components/countAmount'
import rDOT_svg from '@images/rDOT.svg'
import Content from '@shared/components/content';
import Modal from '@shared/components/modal/connectModal';
import Page_FIS from '../../rDOT/selectWallet_rFIS/index';
import {connectPolkadotjs} from '@features/globalClice';
import {Symbol} from '@keyring/defaults'
import './page.scss'
export default function Index(props:any){ 
  const dispatch=useDispatch();
  const {fisAccount}=useSelector((state:any)=>{ 
    return {
      fisAccount:state.FISModule.fisAccount
    }
  })

  const [visible,setVisible]=useState(false);
  return  <Content>
    <Tag type="native" onClick={()=>{
      props.history.push("/rAsset/erc")
    }}/>
 
    {fisAccount?<><DataList /><CountAmount /> </>:<div className="rAsset_content">
      <Button icon={rDOT_svg} onClick={()=>{
           dispatch(connectPolkadotjs(Symbol.Fis)); 
          setVisible(true)
      }}>
        Connect to Polkadotjs extension
      </Button>
    </div>}
    
    <Modal visible={visible}>
          <Page_FIS location={{}} type="header"  onClose={()=>{
                setVisible(false);
            }}/>
    </Modal>
  </Content>
}