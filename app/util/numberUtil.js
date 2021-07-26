import { rSymbol } from '@keyring/defaults';
import { divide, floor } from 'mathjs';
export default {
  // Add floating point numbers
  floatAdd: function (arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m;
  },

  // Subtraction of floating point numbers
  floatSub: function (arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));

    n = r1 >= r2 ? r1 : r2;
    return ((Math.round(arg1 * m) - Math.round(arg2 * m)) / m).toFixed(n);
  },

  floatMul: function (arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
  },

  // Division of floating point numbers
  floatDiv: function (arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1,
      r2;
    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {}

    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * pow(10, t2 - t1);
  },

  // Round down to 6 decimal places. Note that the last decimal point of 0 will be discarded
  handleEthAmountRound(amount) {
    return Math.floor(amount * 1000000) / 1000000;
  },

  // Keep 6 decimal places and round off others
  handleEthAmountFloor(amount) {
    return parseInt(amount * 1000000) / 1000000;
  },

  // Keep 6 decimal places and round off other digits to return string. Keep 6 decimal places and fix 6 decimal places including 0
  handleEthAmountRateToFixed(amount) {
    return this.handleEthAmountRound(amount).toFixed(6);
  },

  // The return string contains 6 decimal places and 4 decimal places, including 0
  handleEthAmountToFixed(amount) {
    return (Math.floor(amount * 1000000) / 1000000).toFixed(6);
  },

  // The return string contains 6 decimal places and 2 decimal places, including 0
  handleEthRoundToFixed(amount) {
    if (amount == '--' || isNaN(amount)) {
      return '--';
    }
    return (Math.floor(amount * 100) / 100).toFixed(2);
  },

  // Returns a string containing 6 decimal places, including 0
  handleEthGweiToFixed(amount) {
    return this.handleEthAmountRound(amount).toFixed(6);
  },

  // Keep 3 decimal places and round off others
  handleErc20AmountFloor(amount) {
    return parseInt(amount * 1000) / 1000;
  },

  // The return string contains 6 decimal places, including 0
  handleFisAmountToFixed(amount) {
    if (amount == '--') {
      return '--';
    }
    return (floor(amount * 1000000) / 1000000).toFixed(6) || '--';
  },

  // The return string contains 6 decimal places, including 0
  handleFisRoundToFixed(amount) {
    if (amount == '--') {
      return '--';
    }
    return (Math.round(amount * 100000000) / 100000000).toFixed(6) || '--';
  },

  // Returns a string containing 6 decimal places, including 0
  handleFisAmountRateToFixed(amount) {
    return this.handleEthAmountRound(amount).toFixed(6);
  },

  fisAmountToHuman(amount) {
    return amount / 1000000000000;
  },

  solAmountToHuman(amount) {
    return amount / 1000000000;
  },

  fisAmountToChain(amount) {
    return Math.round(Number(amount) * 1000000000000);
  },

  solAmountToChain(amount) {
    return Math.round(Number(amount) * 1000000000);
  },

  // The return string contains 4 decimal places, including 0
  handleAtomRoundToFixed(amount) {
    if (amount == '--') {
      return '--';
    } 
    return (Math.round(amount * 1000000) / 1000000).toFixed(4) || '--';
  },

  tokenAmountToHuman(amount, symbol) {
    let factor;
    switch (symbol) {
      case rSymbol.Dot:
        factor = 10000000000;
        break;
      case rSymbol.Atom:
        factor = 1000000;
        break;
      case rSymbol.Fis:
        factor = 1000000000000;
        break;
      case rSymbol.Ksm:
        factor = 1000000000000;
        break;
      case rSymbol.Sol:
        factor = 1000000000;
        break;
      case rSymbol.Eth:
        factor = 1000000000000000000;
        break;
      case rSymbol.Matic:
        factor = 1000000000000000000;
        break;
      default:
        factor = 1000000000000;
        break;
    }

    // console.log(`amount: ${amount} factor: ${factor}`);
    return divide(Number(amount), factor);
  },
  tokenAmountToChain(amount, symbol) {
    switch (symbol) { 
      case rSymbol.Dot:
        return Math.round(Number(amount) * 10000000000);
      case rSymbol.Atom:
        return Math.round(Number(amount) * 1000000);
      case rSymbol.Fis:
        return Math.round(Number(amount) * 1000000000000);
      case rSymbol.Ksm: 
        return Math.round(Number(amount) * 1000000000000);
      case rSymbol.Sol:
        return Math.round(Number(amount) * 1000000000); 
      case rSymbol.Matic:
        return Math.round(Number(amount) * 1000000000000000000);
      case rSymbol.Eth:
        return Math.round(Number(amount) * 1000000000000000000); 
      default:
        return Math.round(Number(amount) * 1000000000000);
    }
  },
  fisFeeToHuman(fee) {
    return fee / 1000000000;
  },

  // 2 decimal places of service charge
  fisFeeToFixed(fee) {
    return this.handleEthAmountRound(fee * 100).toFixed(2);
  },
  rTokenRateToHuman(amount) {
    return amount / 1000000000000;
  },  
  amount_format(amount,decimals){
    if(amount=="--"){
      return "--"
    }
    return this.number_format(amount,decimals || 2,".",",")
  },
  number_format(number, decimals, dec_point, thousands_sep) {
      /*
      * Parameter Description:
      * number：Number to format
      * decimals：Keep a few decimal places
      * dec_point：decimal symbol
      * thousands_sep：Thousandth symbol
      * */
      number = (number + '').replace(/[^0-9+-Ee.]/g, '');
      var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
          s = '',
          toFixedFix = function (n, prec) {
              var k = Math.pow(10, prec);
              return '' + Math.ceil(n * k) / k;
          };
  
     
    
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      var re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
          s[0] = s[0].replace(re, "$1" + sep + "$2");
      }
      
      if ((s[1] || '').length < prec && number.indexOf(".")>-1) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
  }
}; 
