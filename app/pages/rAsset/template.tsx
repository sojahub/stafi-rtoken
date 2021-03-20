import React, { useEffect } from 'react'; 
import {useDispatch,useSelector} from 'react-redux'; 

import {renderRoutes}  from 'react-router-config'; 
import '../template/index.scss'
export default function Index(props:any){
  const dispatch = useDispatch();
 
 
  return  <div className="stafi_layout"> 
      <div className="stafi_container"> 
           {renderRoutes(props.route.routes)} 
      </div> 
  </div>
}