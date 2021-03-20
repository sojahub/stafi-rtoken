import React, { useEffect } from 'react'; 
import Content from '@shared/components/content';
import Title from '@shared/components/cardTitle';
import Back from '@shared/components/backIcon';
import TypeInput from '@shared/components/input/typeInput'
import './index.scss'
export default function Index(props:any){ 
 
  return  <Content className="stafi_rasset_swap">
      <Back />
      <Title label="rBridge Swap"/>
      <div>
        <TypeInput />
      </div>
  </Content>
}