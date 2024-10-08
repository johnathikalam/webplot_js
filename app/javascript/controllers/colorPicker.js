var wpd = wpd || {};

wpd.colorSelectionWidget = (function() {
    var color, triggerElementId, title, setColorDelegate;

    function setParams(params) {
        color = params.color;
        triggerElementId = params.triggerElementId;
        title = params.title;
        setColorDelegate = params.setColorDelegate;

        let $widgetTitle = document.getElementById('color-selection-title');
        $widgetTitle.innerHTML = title;
    }

    function apply() {
        let $triggerBtn = document.getElementById(triggerElementId);
        $triggerBtn.style.backgroundColor =
            'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
        if (color[0] + color[1] + color[2] < 200) {
            $triggerBtn.style.color = 'rgb(255,255,255)';
        } else {
            $triggerBtn.style.color = 'rgb(0,0,0)';
        }
    }

    function startPicker() {
        let $selectedColor = document.getElementById('color-selection-selected-color-box');

        $selectedColor.style.backgroundColor = 'rgb(128,128,0)';
        document.getElementById('color-selection-red').value = 128;
        document.getElementById('color-selection-green').value = 128;
        document.getElementById('color-selection-blue').value = 0;
        // $selectedColor.style.backgroundColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
        // document.getElementById('color-selection-red').value = color[0];
        // document.getElementById('color-selection-green').value = color[1];
        // document.getElementById('color-selection-blue').value = color[2];
        renderColorOptions();
        wpd.popup.show('color-selection-widget');
    }

    function renderColorOptions() {
        let $container = document.getElementById('color-selection-options');
        let topColors = wpd.appData.getPlotData().getTopColors();
        let colorCount = topColors.length > 10 ? 10 : topColors.length;
        let containerHtml = "";

        for (let colori = 0; colori < colorCount; colori++) {
            let colorString = 'rgb(' + topColors[colori].r + ',' + topColors[colori].g + ',' +
                topColors[colori].b + ');';
            let perc = topColors[colori].percentage.toFixed(3) + "%";
            containerHtml += '<div class="colorOptionBox" style="background-color: ' + colorString +
                '\" title=\"' + perc +
                '" onclick="wpd.colorSelectionWidget.selectTopColor(' + colori +
                ');"></div>';
        }

        $container.innerHTML = containerHtml;
    }

    function pickColor() {
        wpd.popup.close('color-selection-widget');
        let tool = new wpd.ColorPickerTool();
        tool.onComplete = function(col) {
            color = col;
            setColorDelegate(col);
            wpd.graphicsWidget.removeTool();
            startPicker();
        };
        wpd.graphicsWidget.setTool(tool);
    }

    function setColor() {
        let gui_color = [];
        gui_color[0] = parseInt(document.getElementById('color-selection-red').value, 10);
        gui_color[1] = parseInt(document.getElementById('color-selection-green').value, 10);
        gui_color[2] = parseInt(document.getElementById('color-selection-blue').value, 10);
        color = gui_color;
        console.log("color : "+ color);
        setColorDelegate(gui_color);
        wpd.popup.close('color-selection-widget');
        apply();
    }

    function selectTopColor(colorIndex) {
        let gui_color = [];
        let topColors = wpd.appData.getPlotData().getTopColors();

        gui_color[0] = topColors[colorIndex].r;
        gui_color[1] = topColors[colorIndex].g;
        gui_color[2] = topColors[colorIndex].b;

        color = gui_color;
        setColorDelegate(gui_color);
        startPicker();
    }

    function paintFilteredColor(binaryData, maskPixels) {
        let ctx = wpd.graphicsWidget.getAllContexts();
        const imageSize = wpd.graphicsWidget.getImageSize();
        let dataLayer = ctx.oriDataCtx.getImageData(0, 0, imageSize.width, imageSize.height);

        if (maskPixels == null || maskPixels.size === 0) {
            return;
        }

        for (let img_index of maskPixels) {

            if (binaryData.has(img_index)) {
                dataLayer.data[img_index * 4] = 255;
                dataLayer.data[img_index * 4 + 1] = 255;
                dataLayer.data[img_index * 4 + 2] = 0;
                dataLayer.data[img_index * 4 + 3] = 255;
            } else {
                dataLayer.data[img_index * 4] = 0;
                dataLayer.data[img_index * 4 + 1] = 0;
                dataLayer.data[img_index * 4 + 2] = 0;
                dataLayer.data[img_index * 4 + 3] = 150;
            }
        }

        ctx.oriDataCtx.putImageData(dataLayer, 0, 0);
        wpd.graphicsWidget.copyImageDataLayerToScreen();
    }

    return {
        setParams: setParams,
        startPicker: startPicker,
        pickColor: pickColor,
        setColor: setColor,
        selectTopColor: selectTopColor,
        paintFilteredColor: paintFilteredColor
    };
})();

wpd.colorPicker = (function() {
    function getAutoDetectionData() {
        let ds = wpd.tree.getActiveDataset();
        return wpd.appData.getPlotData().getAutoDetectionDataForDataset(ds);
    }

    function getFGPickerParams() {
        let ad = getAutoDetectionData();
        return {
            color: ad.fgColor,
            triggerElementId: 'color-button',
            title: wpd.gettext('specify-foreground-color'),
            setColorDelegate: function(col) {
                ad.fgColor = col;
            }
        };
    }

    function getBGPickerParams() {
        let ad = getAutoDetectionData();
        return {
            color: ad.bgColor,
            triggerElementId: 'color-button',
            title: wpd.gettext('specify-background-color'),
            setColorDelegate: function(col) {
                ad.bgColor = col;
            }
        };
    }

    function init() {
        let $colorBtn = document.getElementById('color-button');
        let $colorDistance = document.getElementById('color-distance-value');
        console.log("colorDistance: "+$colorDistance.value);
        let autoDetector = getAutoDetectionData();
        let $modeSelector = document.getElementById('color-detection-mode-select');
        let color = null;

        if (autoDetector.colorDetectionMode === 'fg') {
            // autoDetector.fgColor.color[0], autoDetector.fgColor.color[1], autoDetector.fgColor.color[2] =  128,128,0;
            
            color = autoDetector.fgColor;
            console.log("Color:" + color);
        } else {
            color = autoDetector.bgColor;
        }
        let color_distance = autoDetector.colorDistance;

        $colorBtn.style.backgroundColor = 'rgb(128,128,0)';

        console.log("color[0]: "+color[0]);
        console.log("color[2]: "+color[1]);
        console.log("color[3]: "+color[2]);


        // $colorBtn.style.backgroundColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
        
        // $colorDistance.value = '0';
        $colorDistance.value = color_distance;

        $modeSelector.value = autoDetector.colorDetectionMode;
    }

    function changeColorDistance() {
        let color_distance = parseFloat(document.getElementById('color-distance-value').value);
        getAutoDetectionData().colorDistance = color_distance;
    }

    function testColorDetection() {
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();
        wpd.graphicsWidget.setRepainter(new wpd.ColorFilterRepainter());

        let ctx = wpd.graphicsWidget.getAllContexts();
        let autoDetector = getAutoDetectionData();
        let imageSize = wpd.graphicsWidget.getImageSize();

        let imageData = ctx.oriImageCtx.getImageData(0, 0, imageSize.width, imageSize.height);
        autoDetector.generateBinaryData(imageData);
        wpd.colorSelectionWidget.paintFilteredColor(autoDetector.binaryData, autoDetector.mask);
    }

    function startPicker() {
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();
        if (getAutoDetectionData().colorDetectionMode === 'fg') {
            wpd.colorSelectionWidget.setParams(getFGPickerParams());
        } else {
            wpd.colorSelectionWidget.setParams(getBGPickerParams());
        }
        wpd.colorSelectionWidget.startPicker();
    }

    function changeDetectionMode() {
        let $modeSelector = document.getElementById('color-detection-mode-select');
        getAutoDetectionData().colorDetectionMode = $modeSelector.value;
        init();
    }

    return {
        startPicker: startPicker,
        changeDetectionMode: changeDetectionMode,
        changeColorDistance: changeColorDistance,
        init: init,
        testColorDetection: testColorDetection
    };
})();