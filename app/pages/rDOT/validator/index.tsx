import React from 'react';
import Card from '@components/card/stakeCard';
import Sider from '@components/sider/stakeSider';
import Content from './validatorContent';
import {rDOT_data} from '../systemData';
export default function Index(props:any){
  console.log(props)
  return <Card>
      <Sider data={rDOT_data} type={props.route.type}/>
      <Content onRecovery={()=>{
        props.history.push("/rDOT/search")
      }}></Content>
  </Card>
}