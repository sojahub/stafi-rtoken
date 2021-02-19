export default {
  // 浮点数相加
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

  // 浮点数减法运算
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
    //动态控制精度长度
    n = r1 >= r2 ? r1 : r2;
    return ((Math.round(arg1 * m) - Math.round(arg2 * m)) / m).toFixed(n);
  },

  // 浮点数乘法运算
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

  // 浮点数除法运算
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

  // 向下取整 保留6位小数 注意 小数点最后为0的会舍弃
  handleEthAmountRound(amount) {
    return Math.floor(amount * 1000000) / 1000000;
  },

  // 保留6位小数 并舍去其他位数
  handleEthAmountFloor(amount) {
    return parseInt(amount * 1000000) / 1000000;
  },

  // 返回字符串 保留6位小数 固定6位 包括0
  handleEthAmountRateToFixed(amount) {
    return this.handleEthAmountRound(amount).toFixed(6);
  },

  // 返回字符串 保留6位小数 固定4位 包括0
  handleEthAmountToFixed(amount) {
    return (Math.floor(amount * 1000000) / 1000000).toFixed(6);
  },

  // 返回字符串 保留6位小数 固定2位 包括0
  handleEthRoundToFixed(amount) {
    return (Math.floor(amount * 100) / 100).toFixed(2);
  },

  // 返回字符串 保留6位小数 固定6位 包括0
  handleEthGweiToFixed(amount) {
    return this.handleEthAmountRound(amount).toFixed(6);
  },

  // 保留3位小数 并舍去其他位数
  handleErc20AmountFloor(amount) {
    return parseInt(amount * 1000) / 1000;
  },

  // 返回字符串 保留6位小数 固定3位 包括0
  handleFisAmountToFixed(amount) {
    return (Math.floor(amount * 1000000) / 1000000).toFixed(6);
  },

  // 返回字符串 保留6位小数 固定6位 包括0
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

  // 收取的手续费 2位小数点
  fisFeeToFixed(fee) {
    return this.handleEthAmountRound(fee * 100).toFixed(2);
  },
};
