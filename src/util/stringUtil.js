const stringUtil = {
  //Replace the address string with
  replacePkh: function (pkh, start, end) {
    if (!pkh) {
      return pkh;
    }
    if (start < 0 || start >= pkh.length || pkh.length == 0 || end < 0 || end >= pkh.length) {
      return pkh;
    }

    let sFrontPart = pkh.substr(0, start);
    let sTailPart = pkh.substr(end, pkh.length);

    return sFrontPart + '...' + sTailPart;
  },

  replacePkhRemain6: function (pkh) {
    if (!pkh) {
      return pkh;
    }
    if (pkh.length <= 12) {
      return pkh;
    }

    let sFrontPart = pkh.substr(0, 6);
    let sTailPart = pkh.substr(pkh.length - 6, pkh.length);

    return sFrontPart + '...' + sTailPart;
  },

  mixTextOverflow: function (text, length) {
    if (text.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= length) {
      return text;
    } else {
      let _length = 0;
      let outputText = '';
      for (let i = 0; i < text.length; i++) {
        if (/[\u4e00-\u9fa5]/.test(text[i])) {
          _length += 2;
        } else {
          _length += 1;
        }
        if (_length > length) {
          break;
        } else {
          outputText += text[i];
        }
      }
      return outputText + '...';
    }
  },
};

export default stringUtil;
