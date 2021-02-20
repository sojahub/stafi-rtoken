 
export enum Keys {
  FisAccountKey = 'stafi_fis_account', 
  DotAccountKey = 'stafi_dot_account', 
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