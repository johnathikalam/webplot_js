var wpd = wpd || {};

wpd.gridDetection = (function() {
    function start() {
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();
        wpd.sidebar.show('grid-detection-sidebar');
        sidebarInit();
    }

    function sidebarInit() {
        let $colorPickerBtn = document.getElementById('grid-color-picker-button');
        let $backgroundMode = document.getElementById('grid-background-mode');
        let autodetector = wpd.appData.getPlotData().getGridDetectionData();
        let color = autodetector.lineColor;
        let backgroundMode = autodetector.gridBackgroundMode;

        if (color != null) {
            $colorPickerBtn.style.backgroundColor =
                'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            if (color[0] + color[1] + color[2] < 200) {
                $colorPickerBtn.style.color = 'rgb(255,255,255)';
            } else {
                $colorPickerBtn.style.color = 'rgb(0,0,0)';
            }
        }

        $backgroundMode.checked = backgroundMode;
    }

    
    function run() {

        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();

        // For now, just reset before detecting, otherwise users will get confused:
        reset();

        let autoDetector = wpd.appData.getPlotData().getGridDetectionData();
        let ctx = wpd.graphicsWidget.getAllContexts();
        let imageSize = wpd.graphicsWidget.getImageSize();
        let $xperc = document.getElementById('grid-horiz-perc');
        let $yperc = document.getElementById('grid-vert-perc');
        let horizEnable = document.getElementById('grid-horiz-enable').checked;
        let vertEnable = document.getElementById('grid-vert-enable').checked;
        let backgroundMode = document.getElementById('grid-background-mode').checked;
        let plotData = wpd.appData.getPlotData();

        if (autoDetector.backupImageData == null) {
            autoDetector.backupImageData =
                ctx.oriImageCtx.getImageData(0, 0, imageSize.width, imageSize.height);
        }

        let imageData = ctx.oriImageCtx.getImageData(0, 0, imageSize.width, imageSize.height);

        autoDetector.generateBinaryData(imageData);

        // gather detection parameters from GUI

        wpd.gridDetectionCore.setHorizontalParameters(horizEnable, $xperc.value);
        wpd.gridDetectionCore.setVerticalParameters(vertEnable, $yperc.value);
        autoDetector.gridData = wpd.gridDetectionCore.run(autoDetector);

        // edit image
        wpd.graphicsWidget.runImageOp(removeGridLinesOp);

        // cleanup memory
        wpd.appData.getPlotData().getGridDetectionData().gridData = null;
    }

    function resetImageOp(idata, width, height) {
        let bkImg = wpd.appData.getPlotData().getGridDetectionData().backupImageData;

        for (let i = 0; i < bkImg.data.length; i++) {
            idata.data[i] = bkImg.data[i];
        }

        return {
            imageData: idata,
            width: width,
            height: height,
            keepZoom: true
        };
    }

    function reset() {
        wpd.graphicsWidget.removeTool();
        wpd.appData.getPlotData().getGridDetectionData().gridData = null;
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();

        let plotData = wpd.appData.getPlotData();
        if (plotData.getGridDetectionData().backupImageData != null) {
            wpd.graphicsWidget.runImageOp(resetImageOp);
        }
    }

    function removeGridLinesOp(idata, width, height) {
        /* image op to remove grid lines */
        let gridData = wpd.appData.getPlotData().getGridDetectionData().gridData;
        let bgColor = wpd.appData.getPlotData().getTopColors()[0];

        if (bgColor == null) {
            bgColor = {
                r: 255,
                g: 0,
                b: 0
            };
        }

        if (gridData != null) {
            for (let rowi = 0; rowi < height; rowi++) {
                for (let coli = 0; coli < width; coli++) {
                    let pindex = 4 * (rowi * width + coli);
                    if (gridData.has(pindex / 4)) {
                        idata.data[pindex] = bgColor.r;
                        idata.data[pindex + 1] = bgColor.g;
                        idata.data[pindex + 2] = bgColor.b;
                        idata.data[pindex + 3] = 255;
                    }
                }
            }
        }

        return {
            imageData: idata,
            width: width,
            height: height
        };
    }

    function startColorPicker() {
        wpd.colorSelectionWidget.setParams({
            color: wpd.appData.getPlotData().getGridDetectionData().lineColor,
            triggerElementId: 'grid-color-picker-button',
            title: 'Specify Grid Line Color',
            setColorDelegate: function(
                col) {
                wpd.appData.getPlotData().getGridDetectionData().lineColor = col;
            }
        });
        wpd.colorSelectionWidget.startPicker();
    }

    function testColor() {
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.resetData();
        wpd.graphicsWidget.setRepainter(new wpd.GridColorFilterRepainter());

        let autoDetector = wpd.appData.getPlotData().getGridDetectionData();

        changeColorDistance();

        let ctx = wpd.graphicsWidget.getAllContexts();
        let imageSize = wpd.graphicsWidget.getImageSize();
        let imageData = ctx.oriImageCtx.getImageData(0, 0, imageSize.width, imageSize.height);
        autoDetector.generateBinaryData(imageData);

        wpd.colorSelectionWidget.paintFilteredColor(autoDetector.binaryData,
            autoDetector.gridMask.pixels);
    }

    function changeColorDistance() {
        let color_distance = parseFloat('0');
        // let color_distance = parseFloat(document.getElementById('grid-color-distance').value);
        wpd.appData.getPlotData().getGridDetectionData().colorDistance = color_distance;
    }

    function changeBackgroundMode() {
        let backgroundMode = document.getElementById('grid-background-mode').checked;
        wpd.appData.getPlotData().getGridDetectionData().gridBackgroundMode = backgroundMode;
    }

    return {
        start: start,
        startColorPicker: startColorPicker,
        changeColorDistance: changeColorDistance,
        changeBackgroundMode: changeBackgroundMode,
        testColor: testColor,
        run: run,
        reset: reset
    };
})();