
import React from 'react';
import {includes} from 'lodash'; 
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import { Redirect } from 'react-router-dom';
export const authorized = (allowed:any[], currentRole:any) => includes(allowed, currentRole);

 
const AuthorizeRoute = (currentRole: string,url:string) => {
  return (WrappedComponent: any) => {
    class WithAuthorization extends React.Component<any> { 
      static propTypes: any;
      render() { 
        if(this.props[currentRole] && this.props[currentRole].accounts.length>0){
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
