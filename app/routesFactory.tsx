import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Switch, BrowserRouter, Redirect } from 'react-router-dom';

import Home from './pages/template';
import RDOTHOME from './pages/rDotHome'

const routeFn = (props:any) => {
  return <BrowserRouter>{renderRoutes(props.route.routes)}</BrowserRouter>;
};

const routesFactory=(role?:any)=>{ 
  const routes=[
    {
      id:"root",
      path:'/',
      exact:true,
      render:()=>{
        return <Redirect to={"/home"}/>
      }
    },
    {
      id:"home",
      path:"/home",
      component: Home,
      routes:[{
        id:"RDOTHome",
        path:"/home",
        component:RDOTHOME
      }]
    }
  ]

  return renderRoutes(routes);
}

export default routesFactory;