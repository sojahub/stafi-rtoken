import { Symbol } from '@keyring/defaults';
import { getLocalStorageItem, Keys } from '@util/common';
import { includes } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
export const authorized = (allowed: any[], currentRole: any) => includes(allowed, currentRole);

const account = (type: string) => {
  switch (type) {
    case Symbol.Ksm:
      if (getLocalStorageItem(Keys.KsmAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rKSM/home';
      }
      if (getLocalStorageItem(Keys.KsmAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
        return '/rKSM/wallet';
      }
      return true;
    case Symbol.Atom:
      if (getLocalStorageItem(Keys.AtomAccountKey) == null || getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rATOM/home';
      }
      // if(getLocalStorageItem(Keys.AtomAccountKey)==null && getLocalStorageItem(Keys.FisAccountKey)){
      //   return '/rATOM/home';
      // }
      return true;
    case Symbol.Dot:
      // if(getLocalStorageItem(Keys.DotAccountKey)==null){
      //   return '/rDOT/home'
      // }
      if (getLocalStorageItem(Keys.DotAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rDOT/home';
      }
      if (getLocalStorageItem(Keys.DotAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
        return '/rDOT/wallet';
      }
      return true;
    // return getLocalStorageItem(Keys.DotAccountKey) && getLocalStorageItem(Keys.FisAccountKey);
    case Symbol.Fis:
      return getLocalStorageItem(Keys.FisAccountKey);
    case Symbol.Sol:
      if (getLocalStorageItem(Keys.SolAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rSOL/home';
      }
      if (getLocalStorageItem(Keys.SolAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
        return '/rSOL/wallet';
      }
      return true;
    default:
      return '/rKSM/home';
  }
};
const AuthorizeRoute = (currentRole: string) => {
  return (WrappedComponent: any) => {
    class WithAuthorization extends React.Component<any> {
      static propTypes: any;
      render() {
        const url = account(currentRole);
        if (url === true) {
          return <WrappedComponent {...this.props} />;
        } else {
          return <Redirect to={url} />;
        }
      }
    }

    WithAuthorization.propTypes = {};

    const mapDispatchToProps = {};

    return connect((state) => state, mapDispatchToProps)(WithAuthorization);
  };
};

export default AuthorizeRoute;
