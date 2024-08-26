var wpd = wpd || {};
wpd.sidebar = (function() {
    function show(sbid) { // Shows a specific sidebar
        clear();
        let sb = document.getElementById(sbid);
        sb.style.display = "inline-block";
        sb.style.height = parseInt(document.body.offsetHeight, 10) - 280 + 'px';
    }

    function clear() { // Clears all open sidebars

        const sidebarList = document.getElementsByClassName('sidebar');
        for (let ii = 0; ii < sidebarList.length; ii++) {
            sidebarList[ii].style.display = "none";
        }
    }

    function resize() {

        let sidebarList = document.getElementsByClassName('sidebar');
        for (let ii = 0; ii < sidebarList.length; ii++) {
            if (sidebarList[ii].style.display === "inline-block") {
                sidebarList[ii].style.height =
                    parseInt(document.body.offsetHeight, 10) - 280 + 'px';
            }
        }
    }

    return {
        show: show,
        clear: clear,
        resize: resize
    };
})();