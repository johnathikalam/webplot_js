var wpd = wpd || {};

wpd.initApp = function() {
    wpd.browserInfo.checkBrowser();
    wpd.layoutManager.initialLayout();
    wpd.handleLaunchArgs();
    wpd.log();
    document.getElementById('loadingCurtain').style.display = 'none';

};

wpd.loadDefaultImage = function() {
    // Need to initialize file manager alongside loading image.
    // TODO: clean up file manager initialization!
    let loadImage = async function() {
        let response = await fetch("start.png");
        let data = await response.blob();
        let metadata = {
            type: "image/png"
        };
        let file = new File([data], "start.png", metadata);
        wpd.imageManager.initializeFileManager([file]);
        wpd.imageManager.loadFromFile(file);
        console.log(file);
    };
    loadImage();
}

wpd.handleLaunchArgs = function() {
    // fetch a project with specific ID from the backend if a projectid argument is provided:
    let projectid = wpd.args.getValue("projectid");
    if (projectid == null) {
        wpd.loadDefaultImage();
    } else {
        fetch("storage/project/" + projectid + ".tar").then(function(response) {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error("Can not open project file with ID: " + projectid);
            }
        }).then(function(blob) {
            wpd.saveResume.readProjectFile(blob);
        }).catch((err) => {
            wpd.messagePopup.show(wpd.gettext("invalid-project"), err);
            wpd.loadDefaultImage();
        });
    }
};

document.addEventListener("DOMContentLoaded", wpd.initApp, true);