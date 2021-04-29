 
import NumberUtil from './numberUtil'
export enum Keys {
  FisAccountKey = 'stafi_fis_account', 
  FisProcessParameter = 'stafi_fis_processParameter', 
  FisStakeHash='stafi_fis_stakeHash', 
  DotAccountKey = 'stafi_dot_account', 
  DotProcessParameter = 'stafi_dot_processParameter', 
  DotStakeHash='stafi_dot_stakeHash', 

  KsmAccountKey = 'stafi_ksm_account', 
  KsmProcessParameter = 'stafi_ksm_processParameter', 
  KsmStakeHash='stafi_ksm_stakeHash', 

  AtomAccountKey = 'stafi_atom_account', 
  AtomProcessParameter = 'stafi_atom_processParameter', 
  AtomStakeHash='stafi_atom_stakeHash', 

  MetamaskAccountKey = 'stafi_Metamask_account', 
  StafiNoticeKey="stafi_notice",
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

export const stafi_uuid=()=>{
  return Date.now().toString(36)
}

export function timeout(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}