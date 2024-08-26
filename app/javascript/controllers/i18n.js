var wpd = wpd || {};

wpd.gettext = function(stringId) {
    let $str = document.getElementById('i18n-string-' + stringId);
    if ($str) {
        return $str.innerHTML;
    }
    return 'i18n string';
};