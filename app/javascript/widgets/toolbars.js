var wpd = wpd || {};
wpd.toolbar = (function() {
    function show(tbid) { // Shows a specific toolbar
        clear();
        let tb = document.getElementById(tbid);
        tb.style.visibility = "visible";
    }

    function clear() { // Clears all open toolbars

        const toolbarList = document.getElementsByClassName('toolbar');
        for (let ii = 0; ii < toolbarList.length; ii++) {
            toolbarList[ii].style.visibility = "hidden";
        }
    }

    return {
        show: show,
        clear: clear
    };
})();