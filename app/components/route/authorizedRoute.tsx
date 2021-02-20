
import React from 'react';
import {includes} from 'lodash'; 
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import { Redirect } from 'react-router-dom';
import {getLocalStorageItem,Keys} from '@util/common';
import {Symbol} from '@keyring/defaults'
export const authorized = (allowed:any[], currentRole:any) => includes(allowed, currentRole);

 
const account=(type:string)=>{
  switch(type){
    case Symbol.Dot:
      return getLocalStorageItem(Keys.DotAccountKey) && getLocalStorageItem(Keys.FisAccountKey);
    case Symbol.Fis:
      return getLocalStorageItem(Keys.FisAccountKey);
    default:
        return null;

  }
}
const AuthorizeRoute = (currentRole: string,url:string) => {
  return (WrappedComponent: any) => {
    class WithAuthorization extends React.Component<any> { 
      static propTypes: any;
      render() { 
        if(account(currentRole)){
          return <WrappedComponent {...this.props} />;
        }else{
          return <Redirect to={url}/>
        }
      }
    }

    WithAuthorization.propTypes = { 
    };

    const mapDispatchToProps = {
      
    };

    return connect((state) => (state), mapDispatchToProps)(WithAuthorization);
  };
};

export default AuthorizeRoute;
