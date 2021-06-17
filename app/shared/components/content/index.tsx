import React, { useMemo } from 'react'; 
import './index.scss';
type Props={
    children:any,
    className?:string,
    routes?:any[],
    location?:any
}
export default function Index(props:Props){
    const width=useMemo(()=>{ 
        if(props.location && props.routes){
            const obj=props.routes.find((item)=>{
                return item.path==props.location.pathname;
            })
            if(obj){
                return obj.width
            }
        }
        return null;
    },[props.location])
    return <div style={width && {width:width}} className={`stafi_content ${props.className}`}>
        {props.children}
    </div>
}