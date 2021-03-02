import React from 'react';
import {Select} from 'antd'

import selectedIcon from '@images/selectedIcon.svg'
import './index.scss';

export default function Index(props:any){
  return <Select {...props} className="stafi_select" placeholder="Please select" suffixIcon={
    <img src={selectedIcon} className="pec_select_suffixIcon" />
  }>
    {props.children}
  </Select>
}

// const Index = forwardRef((props: any, ref: any) => {
//   return (<Select {...props} placeholder="Please select" suffixIcon={
//     <img src={selectedIcon} className="pec_select_suffixIcon" />
//   }>
//     {props.children}
//   </Select>
//   );
// })
// export default Index;
export const Option = Select.Option