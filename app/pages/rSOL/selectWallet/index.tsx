import WalletCard from '@components/card/walletCard';
import Item from '@components/card/walletCardItem';
import { connectPolkadotjs } from '@features/globalClice';
import { setSolAccount } from '@features/rSOLClice';
import { Symbol } from '@keyring/defaults';
import { getLocalStorageItem, Keys } from '@util/common';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { solAccounts, solAccount } = useSelector((state: any) => {
    return {
      solAccounts: state.rSOLModule.solAccounts,
      solAccount: state.rSOLModule.solAccount || {},
    };
  });
  const [account, setAccount] = useState<any>();

  useEffect(() => {
    if (solAccount && !solAccount.address && solAccounts.length > 0) {
      //    dispatch(setDotAccount(dotAccounts[0]));
      setAccount(solAccounts[0]);
    } else {
      setAccount(solAccount);
    }
  }, [solAccounts]);

  useEffect(() => {
    if (getLocalStorageItem(Keys.SolAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(connectPolkadotjs(Symbol.Sol));
      // dispatch(getPools(()=>{
      //     setTimeout(()=>{
      //       dispatch(continueProcess());
      //     },20)
      //   }));
    }
  }, []);

  return (
    <WalletCard
      title='Select a SOL wallet'
      btnText={props.type == 'header' || getLocalStorageItem(Keys.FisAccountKey) ? 'Confirm' : 'Next'}
      history={props.history}
      form={props.type}
      onCancel={() => {
        props.onClose && props.onClose();
      }}
      onConfirm={() => {
        if (account.address) {
          dispatch(setSolAccount(account));
          if (props.onClose) {
            props.onClose();
          } else {
            if (getLocalStorageItem(Keys.FisAccountKey)) {
              props.history.push('/rSOL/type');
            } else {
              props.history.push({
                pathname: '/rSOL/fiswallet',
                state: {
                  showBackIcon: true,
                },
              });
            }
          }
        } else {
          message.error('Please select the SOL wallet');
        }
      }}>
      {solAccounts.map((item: any) => {
        return (
          <Item
            data={item}
            type='SOL'
            key={item.address}
            selected={account ? item.address == account.address : false}
            onClick={() => {
              setAccount(item);
            }}
          />
        );
      })}
    </WalletCard>
  );
}
