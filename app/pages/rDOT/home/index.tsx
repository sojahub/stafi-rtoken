import React from 'react';
import {useDispatch} from 'react-redux'
import HomeCard from '@components/card/homeCard'; 
import rDOT_svg from '@images/rDOT.svg' 
import './index.scss';

export default function Inde(props:any){
 
  console.log(props)
  const dispatch = useDispatch();  
    return <HomeCard 
        title={<><label>Liquify</label> Your Staking DOT</>}
        subTitle={"Staking via StaFi Staking Contract and get rDOT in return"}
        btnText="Connect to Polkadotjs extension"
        btnIcon={rDOT_svg}
        onBtnClick={()=>{ 
          props.history.push("/rDOT/wallet")
        }}
        onIntroClick={()=>{

        }}
    />
}