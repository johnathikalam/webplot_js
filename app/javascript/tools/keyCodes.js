var wpd = wpd || {};

wpd.keyCodes = {
    isUp: function(code) {
        return code === 38;
    },
    isDown: function(code) {
        return code === 40;
    },
    isLeft: function(code) {
        return code === 37;
    },
    isRight: function(code) {
        return code === 39;
    },
    isTab: function(code) {
        return code === 9;
    },
    isDel: function(code) {
        return code === 46;
    },
    isBackspace: function(code) {
        return code === 8;
    },
    isAlphabet: function(code, alpha) {
        if (code > 90 || code < 65) {
            return false;
        }
        return String.fromCharCode(code).toLowerCase() === alpha;
    },
    isPeriod: function(code) {
        return code === 190;
    },
    isComma: function(code) {
        return code === 188;
    },
    isEnter: function(code) {
        return code === 13;
    },
    isEsc: function(code) {
        return code === 27;
    }
};