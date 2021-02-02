import React from 'react';
import {Form} from 'antd';
import Input from '@components/input/index';
import Button from '@components/button/button'
import './index.scss';
export default function Index(){
  const [form] = Form.useForm();
  return <div className="stafi_search_container">
    <div className="title">
      Bond Minting Record Search
    </div>
    <div className="sub_title">
      Search your mint record if it isn’t shown in the main page 
    </div>
    <Form
      layout="vertical"
      form={form}
    > 
        <Form.Item label="Token">
          <Input placeholder="input placeholder" />
        </Form.Item> 
        <Form.Item label="TxHash">
          <Input placeholder="input placeholder" />
        </Form.Item> 
        <Form.Item label="BlockHash">
          <Input placeholder="input placeholder" />
        </Form.Item> 
        <div className="btns">
          <Button btnType="square" htmlType="submit">Search</Button>
        </div> 
    </Form>
  </div>
}