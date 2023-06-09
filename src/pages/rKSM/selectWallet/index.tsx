import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WalletCard from 'src/components/card/walletCard';
import Item from 'src/components/card/walletCardItem';
import { connectPolkadotjs } from 'src/features/globalClice';
import { setKsmAccount } from 'src/features/rKSMClice';
import { Symbol } from 'src/keyring/defaults';
import { getLocalStorageItem, Keys } from 'src/util/common';
import './index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { ksmAccounts, ksmAccount } = useSelector((state: any) => {
    return {
      ksmAccounts: state.rKSMModule.ksmAccounts,
      ksmAccount: state.rKSMModule.ksmAccount || {},
    };
  });
  const [account, setAccount] = useState<any>();

  useEffect(() => {
    if (ksmAccount && !ksmAccount.address && ksmAccounts.length > 0) {
      //    dispatch(setDotAccount(dotAccounts[0]));
      setAccount(ksmAccounts[0]);
    } else {
      setAccount(ksmAccount);
    }
  }, [ksmAccounts]);

  useEffect(() => {
    if (getLocalStorageItem(Keys.KsmAccountKey) == null && getLocalStorageItem(Keys.FisAccountKey)) {
      dispatch(connectPolkadotjs(Symbol.Ksm));
      // dispatch(getPools(()=>{
      //     setTimeout(()=>{
      //       dispatch(continueProcess());
      //     },20)
      //   }));
    }
  }, []);

  return (
    <WalletCard
      title='Select a KSM wallet'
      btnText={props.type == 'header' || getLocalStorageItem(Keys.FisAccountKey) ? 'Confirm' : 'Next'}
      history={props.history}
      form={props.type}
      onCancel={() => {
        props.onClose && props.onClose();
      }}
      onConfirm={() => {
        if (account.address) {
          dispatch(setKsmAccount(account));
          if (props.onClose) {
            props.onClose();
          } else {
            if (getLocalStorageItem(Keys.FisAccountKey)) {
              props.history.push('/rKSM/type');
            } else {
              props.history.push({
                pathname: '/rKSM/fiswallet',
                state: {
                  showBackIcon: true,
                },
              });
            }
          }
        } else {
          message.error('Please select the KSM wallet');
        }
      }}>
      {ksmAccounts.map((item: any) => {
        return (
          <Item
            data={item}
            type='KSM'
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
