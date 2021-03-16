import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Popover} from 'antd';
import Item from './popoverItem';
import {setProcessSlider} from '@features/globalClice' 
import {readNotice,setProcess} from '@features/noticeClice';
import {Symbol} from '@keyring/defaults'
import './popover.scss';

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
      dispatch(setProcessSlider(true));
      dispatch(setProcess(item));
      const hasGo=location.pathname.includes("/rDOT")
      if(item.rSymbol==Symbol.Dot && !hasGo){
        //跳转到对应到类型页面
        props.history && props.history.push("/rDOT/home");
      }
    }}/>
  })}
 
   
  </> )
   return <Popover onVisibleChange={(e)=>{
    if(e){
      dispatch(readNotice({}));
    }
    
   }} placement="bottomLeft" overlayClassName="stafi_notice_popover" title="Notification"  content={content} trigger="click">
     {props.children}
 </Popover>
}