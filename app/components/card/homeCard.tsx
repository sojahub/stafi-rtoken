import React from 'react';
import Button from '@shared/components/button/connect_button';
import rDOT_svg from '@images/rDOT.svg'
import './index.scss';
type Props={
  title:any,
  subTitle:string,
  btnText:string,
  btnIcon?:any,
  onBtnClick?:Function,
  onIntroClick?:Function
}
export default function Index(props:Props){ 
    return <div className="stafi_home_card">
            <div className="title"> 
              {props.title}
            </div>
            <div className="sub_title"> 
              {props.subTitle}
            </div>
            <Button icon={props.btnIcon || rDOT_svg} onClick={()=>{   
              props.onBtnClick && props.onBtnClick();
            }}>
            {props.btnText}
            </Button>
            <a className="stafi_a" onClick={()=>{
              props.onIntroClick && props.onIntroClick();
            }}>Get Intro</a>
    </div>
}