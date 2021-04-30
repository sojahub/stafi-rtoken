import React from 'react'; 
import './index.scss';
type Props={
  title:any,
  subTitle:string, 
  onIntroUrl?:string, 
  children:any
}
export default function Index(props:Props){ 
    return <div className="stafi_home_card">
            <div className="title"> 
              {props.title}
            </div>
            <div className="sub_title"> 
              {props.subTitle}
            </div>
              {props.children}
            {props.onIntroUrl && <a className="stafi_a" href={props.onIntroUrl} target="_blank">Get Intro</a>}
    </div>
}