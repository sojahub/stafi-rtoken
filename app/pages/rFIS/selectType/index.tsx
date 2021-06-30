import React, { useEffect } from 'react'; 
import {useDispatch, useSelector} from 'react-redux';
import TypeCard from '@components/card/typeCard'; 

export default function Index(props:any){

  const dispatch=useDispatch();
 

  // if(tokenAmount!="--" && tokenAmount!=0){
  //   return <Redirect to="/rATOM/staker/info" />
  // }
  return <TypeCard 
      type="rFIS"  
      total={0}
      apr={0.00}
      onClick={(e:string)=>{
        if(e=="Staker"){
          props.history.push("/rFIS/staker")
        }else{
          props.history.push("/rFIS/validator")
        }
  }}/> 
}