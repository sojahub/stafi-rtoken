import React from 'react';
import './TokenSelector.scss';

type SelectProps = {
  onSelectChange?: Function;
  selectDataSource?: any[];
  selectedData?: any;
};

export default function TokenSelector(props: SelectProps) {
  return (
    <div className='token_selector_input_container'>
      <div className='content'>
        {props.selectDataSource &&
          props.selectDataSource.map((item, index) => {
            return (
              <div
                key={index}
                className={`item ${props.selectedData && props.selectedData.title == item.title ? 'active' : ''} ${
                  props.selectDataSource && props.selectDataSource.length === index + 1 ? 'last' : ''
                }`}
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
    </div>
  );
}
