import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WalletCard from 'src/components/card/walletCard';
import Item from 'src/components/card/walletCardItem';
import { setFisAccount } from 'src/features/FISClice';
import { connectPolkadotjs } from 'src/features/globalClice';
import { Symbol } from 'src/keyring/defaults';
import './index.scss';

export default function Index(props: any) {
  const dispatch = useDispatch();
  const { fisAccounts, fisAccount } = useSelector((state: any) => {
    return {
      fisAccounts: state.FISModule.fisAccounts,
      fisAccount: state.FISModule.fisAccount || {},
    };
  });
  const [account, setAccount] = useState<any>();
  useEffect(() => {
    if (fisAccounts && fisAccounts.length === 0) {
      dispatch(connectPolkadotjs(Symbol.Fis));
    }
    if (fisAccount && !fisAccount.address && fisAccounts.length > 0) {
      setAccount(fisAccounts[0]);
    } else {
      setAccount(fisAccount);
    }
  }, [fisAccounts]);

  const { showBackIcon, form } = useMemo(() => {
    // props.location.state && props.location.state.showBackIcon;
    return {
      showBackIcon: props.location.state ? props.location.state.showBackIcon : false,
      form: props.location.state && props.location.state.form,
    };
  }, [props.location.state]);
  return (
    <WalletCard
      title='Select a FIS wallet'
      btnText='Confirm'
      history={props.history}
      showBackIcon={showBackIcon}
      form={props.type}
      onCancel={() => {
        props.onClose && props.onClose();
      }}
      onConfirm={() => {
        if (account.address) {
          dispatch(setFisAccount(account));
          props.onClose ? props.onClose() : props.history.push('/rKSM/type');
        } else {
          message.error('Please select the FIS wallet');
        }
      }}>
      {fisAccounts.map((item: any) => {
        return (
          <Item
            data={item}
            key={item.address}
            type='FIS'
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
