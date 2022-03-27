import { Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import black_close from 'src/assets/images/black_close.svg';
import bsc_white from 'src/assets/images/bsc_white.svg';
import eth_white from 'src/assets/images/eth_white.svg';
import solana_white from 'src/assets/images/solana_white.svg';
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
    title: 'SPL',
    content: 'Solana',
    type: 'spl',
  },
];

type Props = {
  type: 'native' | 'erc' | 'bep' | 'spl';
  onClick?: Function;
};

export default function Index(props: Props) {
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
        className={`${
          !selectingNative && selectedRTokenData && selectedRTokenData.title === 'ERC20' && 'tag_active_right_erc20'
        } ${
          !selectingNative && selectedRTokenData && selectedRTokenData.title === 'BEP20' && 'tag_active_right_bep20'
        } ${!selectingNative && selectedRTokenData && selectedRTokenData.title === 'SPL' && 'tag_active_right_spl'}`}
        onClick={() => {
          history.push(`/rAsset/home/${selectedRTokenData && selectedRTokenData.type}`);
        }}>
        <div className='rAsset_tag_right'>
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
                  history.push(`/rAsset/home/${v.type}`);
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
              <div className={!selectingNative ? 'arrow_down_selected' : 'arrow_down'} />
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
