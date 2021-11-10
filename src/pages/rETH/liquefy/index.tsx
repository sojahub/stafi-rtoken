import { Form } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import leftArrowSvg from 'src/assets/images/left_arrow.svg';
import Button from 'src/shared/components/button/button';
import Input from 'src/shared/components/input/index';
import Select, { Option } from 'src/shared/components/select';
import './index.scss';
export default function Index(props:any){
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: any) => {   
   
  };
  return <div className="stafi_liquefy_container">
    <img className="back_icon" onClick={()=>{
      props.history.goBack();
    }} src={leftArrowSvg}/>
    <div className="title">
    Liquefy
    </div>
    <div className="sub_title">
      StaFi provide liquidity for validator according to the performance on node operation, validator can liquefy deposited ETH by receiving FIS as return.
    </div>
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    > 
        <Form.Item initialValue="1" label="Check contract address" name="address"> 
          <Select size="max">
            <Option value="1">
            0x7bfFCd7D2C17D534EDf4d153528c44324eb13A36
            </Option>
            <Option value="2">
            0x7bfFCd7D2C17D534EDf4d153528c44324eb13A32
            </Option>
            <Option value="3">
            0x7bfFCd7D2C17D534EDf4d153528c44324eb13A33
            </Option>
          </Select>
        </Form.Item> 
        <Form.Item label="Liquidable ETH" name="txHash">
          <Input  />
        </Form.Item> 
        <Form.Item label="Received FIS" name="blockHash">
          <Input  />
        </Form.Item> 
        <div className="btns">
          <Button htmlType="submit">Liquefy</Button>
        </div> 
    </Form>
  </div>
}