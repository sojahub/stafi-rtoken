import black_close from '@images/black_close.svg';
import downArrowSvg from '@images/ic_arrow_down.svg';
import icNone from '@images/ic_none.svg';
import { Popover } from 'antd';
import React, { useState } from 'react';
import './index.scss';

type Props = {
  selectedTitle: string;
  selectedDescription?: string;
  onSelectChange?: Function;
  selectDataSource?: any[];
  selectedData?: any;
  popTitle?: string;
};

export default function Index(props: Props) {
  const [showSelect, setShowSelect] = useState(false);
  return (
    <div className='type_selector_container'>
      <div
        className='left_container'
        onClick={() => {
          setShowSelect(true);
        }}>
        <div className='title'>{props.selectedTitle}</div>
        <div className='description'>{props.selectedDescription}</div>
      </div>

      <div>
        <Popover
          visible={showSelect}
          onVisibleChange={setShowSelect}
          trigger="click"
          placement='bottomRight'
          overlayClassName='stafi_type_input_select'
          title={
            <SelectTitle
              title={props.popTitle}
              onClose={() => {
                setShowSelect(false);
              }}
            />
          }
          content={
            <Select
              selectDataSource={props.selectDataSource}
              selectedData={props.selectedData}
              onSelectChange={(e: any) => {
                props.onSelectChange && props.onSelectChange(e);
                setShowSelect(false);
              }}
            />
          }>
          <a
            onClick={() => {
              setShowSelect(true);
            }}>
            <img className='icon_last' src={downArrowSvg} />
          </a>
        </Popover>
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
        onClick={() => {
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
      {props.selectDataSource && props.selectDataSource.length > 0 ?
        props.selectDataSource.map((item, index) => {
          return (
            <div
              key={index}
              className={`item ${props.selectedData && props.selectedData.title == item.title ? 'active' : ''}`}
              onClick={() => {
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
        }) : (
          <div className='select_token_empty_container'>
            <div className='left_container'>
              <img src={icNone} className='icon' />

              <div className='text'>NONE</div>
            </div>

            <div className='content'>None</div>
          </div>
        )}
    </div>
  );
}
