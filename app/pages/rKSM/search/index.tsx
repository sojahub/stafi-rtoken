import React from 'react';
import {Form} from 'antd';
import {useDispatch} from 'react-redux';
import Input from '@shared/components/input/index';
import Button from '@shared/components/button/button';
import Select,{Option} from '@shared/components/select';
import leftArrowSvg from '@images/left_arrow.svg';
import {getBlock} from '@features/rKSMClice'
import './index.scss';
export default function Index(props:any){
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: any) => { 
    dispatch(getBlock(values.blockHash,values.txHash)) 
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
    <br/>You could submit your token sending TX information to proceed. 
    </div>
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    > 
        <Form.Item initialValue="1" label="Token" name="token"> 
          <Select >
            <Option value="1">KSM</Option> 
          </Select>
        </Form.Item> 
        <Form.Item label={<div className="item_title"><label>TxHash</label><a>How to get TxHash</a></div>} name="txHash">
          <Input placeholder="" />
        </Form.Item> 
        <Form.Item label={<div className="item_title"><label>BlockHash</label><a>How to get BlockHash</a></div>} name="blockHash">
          <Input placeholder="" />
        </Form.Item> 
        <div className="btns">
          <Button btnType="square" htmlType="submit">Proceed</Button>
        </div> 
    </Form>
  </div>
}