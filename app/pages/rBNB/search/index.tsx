import config from '@config/index';
import { onProceed } from '@features/rBNBClice';
import leftArrowSvg from '@images/left_arrow.svg';
import Button from '@shared/components/button/button';
import Input from '@shared/components/input/index';
import { Form, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import './index.scss';
export default function Index(props: any) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const onFinish = (values: any) => {
    if (!values.txHash) {
      message.error('Please enter txhash');
      return;
    }
    dispatch(
      onProceed(values.txHash, () => {
        props.history.push('/rBNB/staker/info');
      }),
    );
  };

  return (
    <div className={'stafi_search_container stafi_search_matic_container'}>
      <img
        className='back_icon'
        onClick={() => {
          props.history.goBack();
        }}
        src={leftArrowSvg}
      />

      <div className='title'>Staking Record</div>

      <div className='sub_title'>
        Under special occasions like sudden shutdown of your computer after sending your PoS tokens, you may not receive
        your rToken tokens because of being not able to sign the staking authorization.
        <div>You could submit your token sending TX information to proceed. </div>
      </div>

      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item initialValue='BNB' label='Token' name='token'>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          label={
            <div className='item_title'>
              <label>TxHash</label>

              <a href={config.txHashAndBlockhashURl.bnbURL} target='_blank'>
                How to get TxHash
              </a>
            </div>
          }
          name='txHash'>
          <Input placeholder='' />
        </Form.Item>

        <div className='btns'>
          <Button btnType='square' htmlType='submit'>
            Proceed
          </Button>
        </div>
      </Form>
    </div>
  );
}
