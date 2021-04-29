import { Symbol,rSymbol } from '../keyring/defaults'

export default {
  getSymbolByTokenType(tokenType) {
    switch (tokenType) {
      case 1:
      case '1':
        return Symbol.Xtz;
      case 2:
      case '2':
        return Symbol.Atom;
      case 11:
      case '11':
        return Symbol.Kava;
      case 12:
      case '12':
        return Symbol.Dot;
      case 13:
      case '13':
        return Symbol.Ksm;
      case 14:
      case '14':
        return Symbol.Matic;
      case 15:
      case '15':
        return Symbol.One;
      default:
        return Symbol.Xtz;
    }
  },
  pageType(){
    if(location.pathname.includes("/rDOT")){
      return rSymbol.Dot
    }
    if(location.pathname.includes("/rKSM")){
      return rSymbol.Ksm
    }
    if(location.pathname.includes("/rATOM")){
      return rSymbol.Atom
    }
    if(location.pathname.includes("/rAsset")){
      return rSymbol.Asset
    }
   
    return rSymbol.Asset;
  },
  getTokenTypeBySymbol(symbol) {
    switch (symbol) {
      case Symbol.Xtz:
        return '1';
      case Symbol.Atom:
        return '2';
      case Symbol.Kava:
        return '11';
      case Symbol.Dot:
        return '12';
      case Symbol.Ksm:
        return '13';
      case Symbol.Matic:
        return '14';
      case Symbol.One:
        return '15';
      default:
        return '1';
    }
  },

  getSymbolNameBySymbol(symbol) {
    switch (symbol) {
      case Symbol.Xtz:
        return 'XTZ';
      case Symbol.Atom:
        return 'ATOM';
      case Symbol.Kava:
        return 'KAVA';
      case Symbol.Dot:
        return 'DOT';
      case Symbol.Ksm:
        return 'KSM';
      case Symbol.Matic:
        return 'MATIC';
      case Symbol.One:
        return 'ONE'
      default:
        return 'XTZ';
    }
  },

  
  formatDateTime(timeStamp) {
    let date = new Date();
    date.setTime(timeStamp * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;
    return y + '.' + m + '.' + d + ' ' + h + ':' + minute + ':' + second;
  },
  getRSymbolNameByRSymbol(rSymbol) {
    switch (rSymbol) {
      case RSymbol.RFIS:
        return 'rFIS';
      case RSymbol.RDOT:
        return 'rDOT';
      case RSymbol.RKSM:
        return 'rKSM';
      case RSymbol.RATOM:
        return 'rATOM';
      default:
        return 'rFIS';
    }
  }
};
