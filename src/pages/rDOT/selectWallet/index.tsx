import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import WalletCard from 'src/components/card/walletCard';
import Item from 'src/components/card/walletCardItem';
import { connectPolkadotjs } from 'src/features/globalClice';
import { setDotAccount } from 'src/features/rDOTClice';
import { Symbol } from 'src/keyring/defaults';
import { getLocalStorageItem, Keys } from 'src/util/common';
import './index.scss';

export default function Index(props: any) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { dotAccounts, dotAccount } = useSelector((state: any) => {
    return {
      dotAccounts: state.rDOTModule.dotAccounts,
      dotAccount: state.rDOTModule.dotAccount || {},
    };
  });
  const [account, setAccount] = useState<any>();

  useEffect(() => {
    if (dotAccount && !dotAccount.address && dotAccounts.length > 0) {
      setAccount(dotAccounts[0]);
    } else {
      setAccount(dotAccount);
    }
  }, [dotAccounts]);

  useEffect(() => {
    if (getLocalStorageItem(Keys.DotAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(connectPolkadotjs(Symbol.Dot));
      // dispatch(getPools(()=>{
      //     setTimeout(()=>{
      //       dispatch(continueProcess());
      //     },20)
      //   }));
    }
  }, []);

  return (
    <WalletCard
      title='Select a DOT wallet'
      btnText={props.type == 'header' || getLocalStorageItem(Keys.FisAccountKey) ? 'Confirm' : 'Next'}
      history={props.history}
      form={props.type}
      onCancel={() => {
        props.onClose && props.onClose();
      }}
      onConfirm={() => {
        if (account.address) {
          dispatch(setDotAccount(account));
          if (props.onClose) {
            props.onClose();
          } else {
            if (getLocalStorageItem(Keys.FisAccountKey)) {
              props.history.push('/rDOT/type');
            } else {
              props.history.push({
                pathname: '/rDOT/fiswallet',
                state: {
                  showBackIcon: true,
                },
              });
            }
          }
        } else {
          message.error('Please select the DOT wallet');
        }
      }}>
      {dotAccounts.map((item: any) => {
        return (
          <Item
            data={item}
            type='DOT'
            key={item.address}
            selected={account ? item.address === account.address : false}
            onClick={() => {
              setAccount(item);
            }}
          />
        );
      })}
    </WalletCard>
  );
}
