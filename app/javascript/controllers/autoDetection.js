var wpd = wpd || {};
wpd.autoExtraction = (function() {
    function start() {
        wpd.colorPicker.init();
        wpd.algoManager.updateAlgoList();
    }

    return {
        start: start
    };
})();

// Manage auto extract algorithms
wpd.algoManager = (function() {
    var axes, dataset;

    function updateAlgoList() {

        dataset = wpd.tree.getActiveDataset();
        axes = wpd.appData.getPlotData().getAxesForDataset(dataset);

        let innerHTML = '';
        let $algoOptions = document.getElementById('auto-extract-algo-name');

        // Averaging Window
        if (!(axes instanceof wpd.BarAxes)) {
            innerHTML +=
                '<option value="averagingWindow">' + wpd.gettext('averaging-window') + '</option>';
        }

    

        $algoOptions.innerHTML = innerHTML;

        let autoDetector = getAutoDetectionData();
        if (autoDetector.algorithm != null) {
            if (autoDetector.algorithm instanceof wpd.AveragingWindowAlgo) {
                $algoOptions.value = "averagingWindow";
            } 
            renderParameters(autoDetector.algorithm);
        } else {
            applyAlgoSelection();
        }
    }

    function getAutoDetectionData() {
        let ds = wpd.tree.getActiveDataset();
        return wpd.appData.getPlotData().getAutoDetectionDataForDataset(ds);
    }

    function applyAlgoSelection() {
        let $algoOptions = document.getElementById('auto-extract-algo-name');
        let selectedValue = $algoOptions.value;
        let autoDetector = getAutoDetectionData();

        if (selectedValue === 'averagingWindow') {
            autoDetector.algorithm = new wpd.AveragingWindowAlgo();
        } 

        renderParameters(autoDetector.algorithm);
    }

    function renderParameters(algo) {
        let $paramContainer = document.getElementById('algo-parameter-container');
        let algoParams = algo.getParamList(axes);
        let algoParamKeys = Object.keys(algoParams);
        let tableString = "<table>";

        for (let pi = 0; pi < algoParamKeys.length; pi++) {
            let algoParam = algoParams[algoParamKeys[pi]];
            
            tableString += '<tr><td>' + algoParam[0] +
                '</td><td><input type="text" size=3 id="algo-param-' + algoParamKeys[pi] +
                '" class="algo-params" value="' + algoParam[2] + '"/></td><td>' +
                algoParam[1] + '</td></tr>';
        }

        tableString += "</table>";
        $paramContainer.innerHTML = tableString;
    }

    function run() {
        wpd.busyNote.show();
        let autoDetector = getAutoDetectionData();
        let algo = autoDetector.algorithm;
        let repainter = new wpd.DataPointsRepainter(axes, dataset);
        let $paramFields = document.getElementsByClassName('algo-params');
        let ctx = wpd.graphicsWidget.getAllContexts();
        let imageSize = wpd.graphicsWidget.getImageSize();

        let algoParams = {};
        for (let pi = 0; pi < $paramFields.length; pi++) {
            let paramId = $paramFields[pi].id;
            let paramVar = paramId.replace('algo-param-', '');
            algoParams[paramVar] = $paramFields[pi].value;
        }
        algo.setParams(algoParams);

        wpd.graphicsWidget.removeTool();

        let imageData = ctx.oriImageCtx.getImageData(0, 0, imageSize.width, imageSize.height);
        autoDetector.imageWidth = imageSize.width;
        autoDetector.imageHeight = imageSize.height;
        autoDetector.generateBinaryData(imageData);
        wpd.graphicsWidget.setRepainter(repainter);
        console.log("autoDetector: "+autoDetector);
        algo.run(autoDetector, dataset, axes);
        wpd.graphicsWidget.forceHandlerRepaint();
        wpd.dataPointCounter.setCount(dataset.getCount());
        wpd.busyNote.close();
        return true;
    }

    return {
        updateAlgoList: updateAlgoList,
        applyAlgoSelection: applyAlgoSelection,
        run: run
    };
})();