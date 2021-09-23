import arrowDownIcon from '@images/arrow_down_green.svg';
import black_close from '@images/black_close.svg';
import bsc_white from '@images/bsc_white.svg';
import eth_white from '@images/eth_white.svg';
import solana_white from '@images/solana_white.svg';
import { Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import './index.scss';

const rTokenPlatforms = [
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
  type: 'native' | 'erc' | 'bep' | 'sol';
  onClick?: Function;
};

export default function index(props: Props) {
  const { selectedPlatform, rTokenPlatform } = useParams<any>();
  const history = useHistory();

  const [showSelect, setShowSelect] = useState(false);
  const [rTokenList, _] = useState(rTokenPlatforms);
  const [selectingNative, setSelectingNative] = useState(false);
  const [selectedRTokenData, setSelectedRTokenData] = useState(null);

  useEffect(() => {
    let rTokenPlatformType = '';
    if (selectedPlatform === 'native') {
      rTokenPlatformType = rTokenPlatform;
    } else {
      rTokenPlatformType = selectedPlatform;
    }
    const tem = rTokenPlatforms.find((item) => {
      return item.type === rTokenPlatformType;
    });
    setSelectedRTokenData(tem);

    setSelectingNative(selectedPlatform === 'native');
  }, [selectedPlatform, rTokenPlatform]);

  return (
    <div className='rAsset_tag'>
      <div
        className={`${selectingNative && 'tag_active'}`}
        onClick={() => {
          history.push(`/rAsset/home/native/${selectedRTokenData && selectedRTokenData.type}`);
        }}>
        Native<label>/ StaFi</label>
      </div>

      <div
        className={`${!selectingNative && 'tag_active'}`}
        onClick={() => {
          history.push(`/rAsset/home/${selectedRTokenData && selectedRTokenData.type}`);
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            {selectedRTokenData && selectedRTokenData.title}
            <label>/ {selectedRTokenData && selectedRTokenData.content}</label>
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
                selectedType={selectedRTokenData && selectedRTokenData.type}
                onSelectChange={(v: any) => {
                  setSelectedRTokenData(v);
                  setShowSelect(false);
                  if (selectedPlatform !== 'native') {
                    history.push(`/rAsset/home/${v.type}`);
                  } else {
                    history.push(`/rAsset/home/native/${v.type}`);
                  }
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
  selectedType?: string;
};

function Select(props: SelectProps) {
  return (
    <div className='content'>
      {props.selectDataSource &&
        props.selectDataSource.map((item, index) => {
          return (
            <div
              key={index}
              className={`item ${props.selectedType && props.selectedType == item.type ? 'active' : ''}`}
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
