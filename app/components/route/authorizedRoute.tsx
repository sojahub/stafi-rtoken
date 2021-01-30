
import React from 'react';
import {includes} from 'lodash'; 
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 

export const authorized = (allowed:any[], currentRole:any) => includes(allowed, currentRole);

 
const AuthorizeRoute = (allowed: any[], currentRole: string) => {
  return (WrappedComponent: any) => {
    class WithAuthorization extends React.Component<any> {
      static propTypes: any;
   
      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    WithAuthorization.propTypes = { 
    };

    const mapDispatchToProps = {
      
    };

    return connect(() => ({}), mapDispatchToProps)(WithAuthorization);
  };
};

export default AuthorizeRoute;
