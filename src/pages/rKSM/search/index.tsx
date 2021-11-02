import React from 'react';
import {Form,message} from 'antd';
import {useDispatch} from 'react-redux';
import Input from '@shared/components/input/index';
import Button from '@shared/components/button/button'; 
import leftArrowSvg from '@images/left_arrow.svg';
import {getBlock,onProceed} from '@features/rKSMClice';
import config from '@config/index'
import './index.scss';
export default function Index(props:any){
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: any) => { 
    if(!values.txHash){
      message.error("Please enter txhash");
      return;
    }
    if(!values.blockHash){
      message.error("Please enter blockHash");
      return;
    }
    dispatch(onProceed(values.blockHash,values.txHash,()=>{
      props.history.push("/rKSM/staker/info");
    })) 
  };
  return <div className="stafi_search_container">
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
    <div className="title">
    Staking Record
    </div>
    <div className="sub_title">
    Under special occasions like sudden shutdown of your computer after sending your PoS tokens, you may not receive your rToken tokens because of being not able to sign the staking authorization.
    <div>You could submit your token sending TX information to proceed. </div>
    </div>
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    > 
        <Form.Item initialValue="KSM" label="Token" name="token"> 
          <Input disabled={true}/>
        </Form.Item> 
        <Form.Item label={<div className="item_title"><label>TxHash</label><a  href={config.txHashAndBlockhashURl.ksmURL} target="_blank">How to get TxHash</a></div>} name="txHash">
          <Input placeholder="" />
        </Form.Item> 
        <Form.Item label={<div className="item_title"><label>BlockHash</label><a  href={config.txHashAndBlockhashURl.ksmURL} target="_blank">How to get BlockHash</a></div>} name="blockHash">
          <Input placeholder="" />
        </Form.Item> 
        <div className="btns">
          <Button btnType="square" htmlType="submit">Proceed</Button>
        </div> 
    </Form>
  </div>
}