var wpd = wpd || {};

wpd.webcamCapture = (function() {
    var cameraStream;

    function isSupported() {
        return !(getUserMedia() == null);
    }

    function unsupportedBrowser() {
        wpd.messagePopup.show(wpd.gettext('webcam-capture'), wpd.gettext('webcam-capture-text'));
    }

    function getUserMedia() {
        return navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    function start() {
        if (!isSupported()) {
            unsupportedBrowser();
            return;
        }
        wpd.popup.show('webcamCapture');
        var $camVideo = document.getElementById('webcamVideo');
        navigator.getUserMedia = getUserMedia();
        navigator.getUserMedia({
                video: true
            },
            function(stream) {
                cameraStream = stream;
                $camVideo.src = window.URL.createObjectURL(stream);
            },
            function() {});
    }

    function capture() {
        var $webcamCanvas = document.createElement('canvas'),
            $camVideo = document.getElementById('webcamVideo'),
            webcamCtx = $webcamCanvas.getContext('2d'),
            imageData;
        $webcamCanvas.width = $camVideo.videoWidth;
        $webcamCanvas.height = $camVideo.videoHeight;
        webcamCtx.drawImage($camVideo, 0, 0);
        imageData = webcamCtx.getImageData(0, 0, $webcamCanvas.width, $webcamCanvas.height);
        cameraOff();
        wpd.graphicsWidget.runImageOp(function() {
            return {
                imageData: imageData,
                width: $webcamCanvas.width,
                height: $webcamCanvas.height
            };
        });
    }

    function cameraOff() {
        if (cameraStream != undefined) {
            cameraStream.stop();
        }
        wpd.popup.close('webcamCapture');
    }

    function cancel() {
        cameraOff();
    }

    return {
        start: start,
        cancel: cancel,
        capture: capture
    };
})();