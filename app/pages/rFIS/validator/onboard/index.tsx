import React from 'react';
import Button from '@shared/components/button/button';
import LeftContent from '@components/content/leftContent';
import Content from '../components/validatorContent'; 
import { message } from 'antd';
 
export default function Index(props:any){
    return <Content onBoard={()=>{
        props.history.push("/rFIS/validator/offboard")
      }}></Content>
}