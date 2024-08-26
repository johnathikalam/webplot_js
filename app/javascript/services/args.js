var wpd = wpd || {};

wpd.args = (function() {
    // Simple argument parser
    // e.g.
    // if WPD is launched as http://localhost:8000/index.html?q=1
    // then getValue('q') should return '1'
    // and getValue('nonexistent') should return null
    function getValue(arg) {

        var searchString = window.location.search.substring(1),
            i, val,
            params = searchString.split("&");

        for (i = 0; i < params.length; i++) {
            val = params[i].split("=");
            if (val[0] === arg) {
                return unescape(val[1]);
            }
        }
        return null;
    }

    return {
        getValue: getValue
    };
})();