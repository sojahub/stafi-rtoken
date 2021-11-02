import LeftContent from '@components/content/leftContent';
import React from 'react';
import {renderRoutes}  from 'react-router-config';
import './index.scss';
 

export default function Index(props:any){
    return <LeftContent className="rpool_staker_status_content"> 
        {renderRoutes(props.route.routes)} 
    </LeftContent>
}