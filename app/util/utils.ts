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
  number2:/^\d+(\.)?(\d+)?$/
}

// Limit only 0~9 and . can be input
export const parseNumber = (value:any) => {
  if (!value && value !== 0) return;
  return value.replace(regular.nonNumber, '');
};

// Limit only number can be input
export const parseInterge = (value:any) => {
  if (!value && value !== 0) return;
  return value.replace(regular.nonInteger, '');
};