// browserInfo.js - browser and available HTML5 feature detection
var wpd = wpd || {};
wpd.browserInfo = (function() {
    function checkBrowser() {
        if (!window.FileReader || typeof WebAssembly !== "object" || !("download" in document.createElement("a"))) {
            alert(
                'WARNING!\nYour web browser may not be fully supported. Please use a recent version of Google Chrome, Firefox or Safari browser with HTML5 and WebAssembly support.');
        }
    }

    function isElectronBrowser() {
        if (typeof process === 'undefined') { // there's probably a much better way to do this!
            return false;
        }
        return true;
    }

    return {
        checkBrowser: checkBrowser,
        isElectronBrowser: isElectronBrowser
    };
})();