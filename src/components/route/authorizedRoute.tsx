import { includes } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useMetaMaskAccount } from 'src/hooks/useMetaMaskAccount';
import { Symbol } from 'src/keyring/defaults';
import { getLocalStorageItem, Keys } from 'src/util/common';
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
      if (getLocalStorageItem(Keys.KsmAccountKey) && getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rKSM/fiswallet';
      }
      return true;
    case Symbol.Atom:
      // if (getLocalStorageItem(Keys.AtomAccountKey) == null || getLocalStorageItem(Keys.FisAccountKey) == null) {
      //   return '/rATOM/home';
      // }
      return true;
    case Symbol.Dot:
      if (getLocalStorageItem(Keys.DotAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rDOT/home';
      }
      if (getLocalStorageItem(Keys.DotAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
        return '/rDOT/wallet';
      }
      if (getLocalStorageItem(Keys.DotAccountKey) && getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rDOT/fiswallet';
      }
      return true;
    case Symbol.Eth:
      // if (getLocalStorageItem(Keys.FisAccountKey) == null) {
      //   return '/rETH/home';
      // }
      return true;
    case Symbol.Sol:
      if (getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rSOL/home';
      }
      return true;
    case Symbol.Matic:
      if (getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rMATIC/home';
      }
      return true;
    case Symbol.Bnb:
      if (getLocalStorageItem(Keys.FisAccountKey) == null) {
        return '/rBNB/home';
      }
      return true;
    case Symbol.Fis:
      if (getLocalStorageItem(Keys.FisAccountKey)) {
        return true;
      } else {
        return '/rFIS/home';
      }
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
