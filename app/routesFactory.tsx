import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Switch, BrowserRouter, Redirect } from 'react-router-dom';

import Home from './pages/template';
import RDOTHome from './pages/rDOT/home'
import RDOTWallet from './pages/rDOT/selectWallet';
import RDOTStake from './pages/rDOT/stake';
import RDOTSeach from './pages/rDOT/search';

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
        return <Redirect to={"/rDOT/home"}/>
      }
    },
    {
      id:"home",
      path:"/rDOT",
      component: Home,
      routes:[{
        id:"RDOT_home",
        path:"/rDOT/home",
        component:RDOTHome
      },{
        id:"RDOT_wallet",
        path:"/rDOT/wallet",
        component:RDOTWallet
      },{
        id:"RDOT_stake",
        path:"/rDOT/stake",
        component:RDOTStake
      },{
        id:"RDOT_search",
        path:"/rDOT/search",
        component:RDOTSeach
      },{
        path: '*',
        component: () => <Redirect to="/rDOT/home"/>
      }]
    }
  ]

  return renderRoutes(routes);
}

export default routesFactory;