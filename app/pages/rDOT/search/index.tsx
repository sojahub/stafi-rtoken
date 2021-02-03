import React from 'react';
import {Form} from 'antd';
import Input from '@components/input/index';
import Button from '@components/button/button';
import Select,{Option} from '@components/select';
import leftArrowSvg from '@images/left_arrow.svg'
import './index.scss';
export default function Index(props:any){
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
  };
  return <div className="stafi_search_container">
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
    <div className="title">
      Bond Minting Record Search
    </div>
    <div className="sub_title">
    If you did not find your stake record in Notification，you can resubmmit to proceed
    </div>
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    > 
        <Form.Item label="Token" name="token"> 
          <Select>
            <Option value="1">123</Option>
            <Option value="2">222</Option>
            <Option value="3">333</Option>
          </Select>
        </Form.Item> 
        <Form.Item label="TxHash" name="txHash">
          <Input placeholder="input placeholder" />
        </Form.Item> 
        <Form.Item label="BlockHash" name="blockHash">
          <Input placeholder="input placeholder" />
        </Form.Item> 
        <div className="btns">
          <Button btnType="square" htmlType="submit">Search</Button>
        </div> 
    </Form>
  </div>
}