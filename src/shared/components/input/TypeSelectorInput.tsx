import React, { useState } from 'react';
import downArrowSvg from 'src/assets/images/ic_arrow_down.svg';
import left_arrow from 'src/assets/images/left_arrow.svg';
import { HContainer } from 'src/components/commonComponents';
import AmountInputEmbedNew from 'src/shared/components/input/amountInputEmbedNew';
import './index.scss';

type Props = {
  title: string;
  maxInput: any;
  value: any;
  onChange: Function;
  selectable?: boolean;
  onClickSelect?: Function;
  selectDataSource?: any[];
  selectedData?: any;
  selectedTitle?: any;
  popTitle?: string;
  disabled?: boolean;
  showMax?: boolean;
};

export default function Index(props: Props) {
  const [showSelect, setShowSelect] = useState(false);

  return (
    <div className='type_selector_input_container'>
      <div className='title'>{props.title}</div>

      <div className='content'>
        <div className='left_container'>
          <AmountInputEmbedNew
            maxInput={props.maxInput}
            placeholder='0.0'
            disabled={props.disabled}
            value={props.value}
            onChange={props.onChange}
          />
        </div>

        <HContainer style={{ alignItems: 'flex-end' }}>
          {props.showMax && props.selectedData && (
            <div
              className='max'
              onClick={() => {
                if (props.maxInput) {
                  props.onChange(props.maxInput);
                }
              }}>
              Max
            </div>
          )}

          <HContainer
            style={{ cursor: props.selectable ? 'pointer' : '' }}
            onClick={() => {
              if (props.selectable) {
                props.onClickSelect && props.onClickSelect();
                // setShowSelect(true);
              }
            }}>
            {props.selectable ? (
              props.selectedData ? (
                <div className='title'>{props.selectedData.title}</div>
              ) : (
                <div className='select_token_hint'>Select a token</div>
              )
            ) : (
              <div className='title'>{props.selectedTitle || '--'}</div>
            )}

            <div className='icon_last_container'>
              {props.selectable && <img className='icon_last' src={downArrowSvg} />}
            </div>
          </HContainer>
        </HContainer>
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
      <img
        src={left_arrow}
        onClick={() => {
          props.onClose && props.onClose();
        }}
      />
      <label>{props.title ? props.title : 'Select a token'}</label>
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
        })}
    </div>
  );
}
