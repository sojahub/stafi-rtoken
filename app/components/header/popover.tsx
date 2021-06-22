import { checkAll_minting, readNotice, setProcess } from '@features/noticeClice';
import { Symbol } from '@keyring/defaults';
import { Popover } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './popover.scss';
import Item from './popoverItem';

type Props={
  children:any,
  history?:any
}
export default function Index(props:Props){
  const dispatch = useDispatch();

  const data=useSelector((state:any)=>{  
    return state.noticeModule.noticeData;
  }) 
  const content=(<>
  {
    !data &&  <Item noData={true}/>
  }
  {data && data.datas.map((item:any,index:any)=>{
    return <Item 
    key={index}
    data={item}
    onClick={()=>{  
      dispatch(setProcess(item,data.datas));
      const hasGo_DOT=location.pathname.includes("/rDOT")
      if(item.rSymbol==Symbol.Dot && !hasGo_DOT){ 
        props.history && props.history.push("/rDOT/home");
      }

      const hasGo_KSM=location.pathname.includes("/rKSM")
      if(item.rSymbol==Symbol.Ksm && !hasGo_KSM){ 
        props.history && props.history.push("/rKSM/home");
      }
      const hasGo_ATOM=location.pathname.includes("/rATOM")
      if(item.rSymbol==Symbol.Ksm && !hasGo_KSM){ 
        props.history && props.history.push("/rATOM/home");
      }
    }}/>
  })}
 
   
  </> )
   return <Popover onVisibleChange={(e)=>{
    if(e){
      dispatch(checkAll_minting(data?data.datas:[]))
      dispatch(readNotice({}));
    }
    
   }} placement="bottomLeft" overlayClassName="stafi_notice_popover" title="Notification"  content={content} trigger="click">
     {props.children}
 </Popover>
}