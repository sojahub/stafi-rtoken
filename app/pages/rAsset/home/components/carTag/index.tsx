import arrowDownIcon from '@images/arrow_down_green.svg';
import black_close from '@images/black_close.svg';
import bsc_white from '@images/bsc_white.svg';
import eth_white from '@images/eth_white.svg';
import solana_white from '@images/solana_white.svg';
import { Popover } from 'antd';
import React, { useState } from 'react';
import './index.scss';

const rTokens = [
  {
    icon: eth_white,
    title: 'ERC20',
    content: 'Ethereum',
    type: 'erc',
  },
  {
    icon: bsc_white,
    title: 'BEP20',
    content: 'BSC',
    type: 'bep',
  },
  {
    icon: solana_white,
    title: 'SLP20',
    content: 'Solana',
    type: 'sol',
  },
];

type Props = {
  type: 'native' | 'erc' | 'bep';
  onClick?: Function;
};

export default function index(props: Props) {
  const [showSelect, setShowSelect] = useState(false);
  const [rTokenList, setRTokenList] = useState(rTokens);

  return (
    <div className='rAsset_tag'>
      <div
        className={`${props.type == 'native' && 'tag_active'}`}
        onClick={() => {
          props.onClick && props.type != 'native' && props.onClick('native');
        }}>
        Native<label>/ StaFi</label>
      </div>

      <div
        className={`${props.type == 'erc' && 'tag_active'}`}
        onClick={() => {
          props.onClick && props.type != 'erc' && props.onClick('erc');
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            ERC20<label>/ Ethereum</label>
          </div>

          <Popover
            visible={showSelect}
            onVisibleChange={setShowSelect}
            trigger='click'
            placement='bottomRight'
            overlayClassName='stafi_type_input_select'
            title={
              <SelectTitle
                title='Select a rToken standard'
                onClose={() => {
                  setShowSelect(false);
                }}
              />
            }
            content={
              <Select
                selectDataSource={rTokenList}
                selectedData={rTokenList[0]}
                onSelectChange={(e: any) => {
                  setShowSelect(false);
                }}
              />
            }>
            <a
              onClick={(e) => {
                if (e.stopPropagation) {
                  e.stopPropagation();
                } else {
                  e.cancelable = true;
                }
                setShowSelect(true);
              }}>
              <img src={arrowDownIcon} className='arrow_down' />
            </a>
          </Popover>
        </div>
      </div>
    </div>
  );
}

type SelectTitleProps = {
  onClose?: Function;
  title?: string;
};

function SelectTitle(props: SelectTitleProps) {
  return (
    <div className='title'>
      <label>{props.title ? props.title : 'Select a token'}</label>
      <img
        src={black_close}
        onClick={(e) => {
          if (e.stopPropagation) {
            e.stopPropagation();
          } else {
            e.cancelable = true;
          }
          props.onClose && props.onClose();
        }}
      />
    </div>
  );
}

type SelectProps = {
  onSelectChange?: Function;
  selectDataSource?: any[];
  selectedData?: any;
};

function Select(props: SelectProps) {
  return (
    <div className='content'>
      {props.selectDataSource &&
        props.selectDataSource.map((item, index) => {
          return (
            <div
              key={index}
              className={`item ${props.selectedData && props.selectedData.title == item.title ? 'active' : ''}`}
              onClick={(e) => {
                if (e.stopPropagation) {
                  e.stopPropagation();
                } else {
                  e.cancelable = true;
                }
                props.onSelectChange && props.onSelectChange(item);
              }}>
              <div className='title'>
                <div>
                  <img src={item.icon} />
                </div>
                {item.title}
              </div>
              <label className='amount'>{item.content}</label>
            </div>
          );
        })}
    </div>
  );
}
