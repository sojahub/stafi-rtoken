import { Form, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import leftArrowSvg from 'src/assets/images/left_arrow.svg';
import config from 'src/config/index';
import { onProceed } from 'src/features/rDOTClice';
import Button from 'src/shared/components/button/button';
import Input from 'src/shared/components/input/index';
import './index.scss';
export default function Index(props: any) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: any) => {
    if (!values.txHash) {
      message.error('Please enter txhash');
      return;
    }
    if (!values.blockHash) {
      message.error('Please enter blockHash');
      return;
    }
    dispatch(
      onProceed(values.blockHash, values.txHash, () => {
        props.history.push('/rDOT/staker/info');
      }),
    );
  };
  return (
    <div className='stafi_search_dot_container'>
      <img
        className='back_icon'
        onClick={() => {
          props.history.goBack();
        }}
        src={leftArrowSvg}
      />
      <div className='title'>Staking Record</div>
      <div className='sub_title'>
        Under certain circumstances such as the sudden shutdown of your computer after staking your PoS Tokens, you may
        not receive your rTokens due to being unable to sign the staking authorization transaction.
        <div>Fret not, submit your TX information to recover your rTokens.</div>
      </div>
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item initialValue='DOT' label='Token' name='token'>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label={
            <div className='item_title'>
              <label>TxHash</label>
              <a href={config.txHashAndBlockhashURl.dotURL} target='_blank' rel='noreferrer'>
                How to get TxHash
              </a>
            </div>
          }
          name='txHash'>
          <Input placeholder='' />
        </Form.Item>
        <Form.Item
          label={
            <div className='item_title'>
              <label>BlockHash</label>
              <a href={config.txHashAndBlockhashURl.dotURL} target='_blank' rel='noreferrer'>
                How to get BlockHash
              </a>
            </div>
          }
          name='blockHash'>
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
