import React, { useEffect } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 
import metamask from '@images/metamask.png'
import Button from '@shared/components/button/connect_button';
import Tag from './components/carTag/index'
import Content from '@shared/components/content';
import './page.scss'
export default function Index(props:any){ 
 
  return  <Content>
    <Tag type="erc" onClick={()=>{
      props.history.push("/rAsset/native")
    }}/>
   <div className="rAsset_content"> 
      <Button icon={metamask}>
          Connect to Metamask
      </Button>
    </div>
    </Content>
}