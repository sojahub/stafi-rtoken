import { useEffect, useRef } from 'react';
import { bech32 } from 'bech32';

export const regular = {
  urlParameterReg: /([^?&=]+)=([^&]+)/g,
  phoneNumberReg: /^\d+$/,
  mobilePhoneReg: /^1[3456789]\d{9}$/,
  number: /\d{1,3}(?=(\d{3})+$)/g,
  nonNumber: /^([1-9][\d]*|0)(\.[\d]+)?$/,
  nonInteger: /^([^0][0-9]+|0)$/,
  integer: /^([0-9]+|0)$/,
  positiveInteger: /^[1-9]\d*$/,
  emailReg: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  number2: /^\d+(\.)?(\d+)?$/,
};

// Limit only 0~9 and . can be input
export const parseNumber = (value: any) => {
  if (!value && value !== 0) return;
  return value.replace(regular.nonNumber, '');
};

// Limit only number can be input
export const parseInterge = (value: any) => {
  if (!value && value !== 0) return;
  return value.replace(regular.nonInteger, '');
};

export function useInterval(callback: any, delay: number, clearCb?: any) {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (savedCallback && savedCallback.current) {
        savedCallback.current();
      }
    }

    let id = setInterval(tick, delay);
    return () => {
      clearInterval(id);
      clearCb && clearCb();
    };
  }, [delay]);
}

export function checkCosmosAddress(address: string, addrPrefix: string): boolean {
  if (!address || address.length < 0) {
    return false;
  }
  try {
    decodeCosmosAddress(address, addrPrefix);
    return true;
  } catch (e) {
    return false;
  }
}

function decodeCosmosAddress(accAddress: string, addrPrefix: string) {
  const { prefix, words } = bech32.decode(accAddress);
  if (prefix !== addrPrefix) {
    throw Error('Wrong prefix');
  }

  //   const buffer = Buffer.from(bech32.fromWords(words));
  //   if (buffer.length !== DECODED_ADDRESS_LEN) {
  //     throw Error("Wrong decoded address len");
  //   }

  //   return buffer;
}
