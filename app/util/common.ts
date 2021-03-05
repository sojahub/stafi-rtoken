 
import NumberUtil from './numberUtil'
export enum Keys {
  FisAccountKey = 'stafi_fis_account', 
  FisProcessParameter = 'stafi_fis_processParameter', 
  FisStakeHash='stafi_fis_stakeHash', 
  DotAccountKey = 'stafi_dot_account', 
  DotProcessParameter = 'stafi_dot_processParameter', 
  DotStakeHash='stafi_dot_stakeHash', 
}

export const setSessionStorageItem = (key:string, val:any) => {
  sessionStorage.setItem(key, JSON.stringify(val));
};

export const getSessionStorageItem = (key:string) => {
  const value = sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

export const setLocalStorageItem = (key:string, val:any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const getLocalStorageItem = (key:string) => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

export const removeLocalStorageItem = (key:string) =>{
  localStorage.removeItem(key); 
}

export const ratioToAmount=(amount:number,ratio:number)=>{
  if (amount && ratio) {
    return  NumberUtil.handleFisAmountToFixed(amount / ratio);;
  }
  return 0;
}