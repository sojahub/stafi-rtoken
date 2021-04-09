export default {
  // Add floating point numbers
  floatAdd: function(arg1, arg2) {
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
  floatSub: function(arg1, arg2) {
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

 
  floatMul: function(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    );
  },

  // Division of floating point numbers
  floatDiv: function(arg1, arg2) {
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

  // The return string contains 6 decimal places and 3 decimal places, including 0
  handleFisAmountToFixed(amount) { 
    return (Math.floor(amount * 1000000) / 1000000).toFixed(6) || "--";
  },

  // Returns a string containing 6 decimal places, including 0
  handleFisAmountRateToFixed(amount) {
    return this.handleEthAmountRound(amount).toFixed(6);
  },

  fisAmountToHuman(amount) {
    return amount / 1000000000000;
  },

  fisAmountToChain(amount) {
    return Math.round(Number(amount) * 1000000000000);
  },

  fisFeeToHuman(fee) {
    return fee / 1000000000;
  },

  // 2 decimal places of service charge
  fisFeeToFixed(fee) {
    return this.handleEthAmountRound(fee * 100).toFixed(2);
  }
}; 

 