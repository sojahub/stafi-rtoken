import React, { useEffect } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import Button from '@shared/components/button/connect_button';
import DataList from './components/list'
import Tag from './components/carTag/index';
import CountAmount from './components/countAmount'
import rDOT_svg from '@images/rDOT.svg'
import Content from '@shared/components/content';
import './page.scss'
export default function Index(props:any){ 
 
  return  <Content>
    <Tag type="native" onClick={()=>{
      props.history.push("/rAsset/erc")
    }}/>
    {/* <div className="rAsset_content">
      <Button icon={rDOT_svg}>
        Connect to Polkadotjs extension
      </Button>
    </div> */}
    <DataList /> 
    <CountAmount />
  </Content>
}