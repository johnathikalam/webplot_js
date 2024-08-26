var wpd = wpd || {};

wpd.log = function() {
    // Capture some basic info that helps WPD development.
    // Never capture anything about the data here!

    // if we're running inside electron, then skip
    if (wpd.browserInfo.isElectronBrowser()) {
        return;
    }

    // if server has disabled logging, then skip
    fetch("log").then(function(response) {
        return response.text();
    }).then(function(text) {
        if (text == "true") {
            // logging is enabled
            let data = {};
            data["screen-size"] = window.screen.width + "x" + window.screen.height;
            data["document-location"] = document.location.href;
            data["document-referrer"] = document.referrer;
            data["platform"] = window.navigator.platform;
            data["userAgent"] = window.navigator.userAgent;
            data["language"] = window.navigator.language;
            fetch("log", {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
    });
};