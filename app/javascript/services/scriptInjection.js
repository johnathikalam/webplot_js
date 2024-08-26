var wpd = wpd || {};

wpd.scriptInjector = (function() {
    function start() {
        wpd.popup.show('runScriptPopup');
    }

    function cancel() {
        wpd.popup.close('runScriptPopup');
    }

    function load() {
        var $scriptFileInput = document.getElementById('runScriptFileInput');
        wpd.popup.close('runScriptPopup');
        if ($scriptFileInput.files.length == 1) {
            var fileReader = new FileReader();
            fileReader.onload = function() {
                if (typeof wpdscript !== "undefined") {
                    wpdscript = null;
                }
                eval(fileReader.result);
                if (typeof wpdscript !== "wpdscript") {
                    window["wpdscript"] = wpdscript;
                    wpdscript.run();
                }
            };
            fileReader.readAsText($scriptFileInput.files[0]);
        }
    }

    function injectHTML() {}

    function injectCSS() {}

    return {
        start: start,
        cancel: cancel,
        load: load
    };
})();