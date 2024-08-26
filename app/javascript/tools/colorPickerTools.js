var wpd = wpd || {};

wpd.ColorPickerTool = (function() {
    var Tool = function() {
        var ctx = wpd.graphicsWidget.getAllContexts();

        this.onMouseClick = function(ev, pos, imagePos) {
            var ir, ig, ib, ia, pixData;

            pixData = ctx.oriImageCtx.getImageData(imagePos.x, imagePos.y, 1, 1);
            ir = pixData.data[0];
            ig = pixData.data[1];
            ib = pixData.data[2];
            ia = pixData.data[3];
            if (ia === 0) { // for transparent color, assume white RGB
                ir = 255;
                ig = 255;
                ib = 255;
            }
            this.onComplete([ir, ig, ib]);
        };

        this.onComplete = function(col) {};
    };
    return Tool;
})();

wpd.ColorFilterRepainter = (function() {
    var Painter = function() {
        this.painterName = 'colorFilterRepainter';

        this.onRedraw = function() {
            let ds = wpd.tree.getActiveDataset();
            let autoDetector = wpd.appData.getPlotData().getAutoDetectionDataForDataset(ds);
            wpd.colorSelectionWidget.paintFilteredColor(autoDetector.binaryData, autoDetector.mask);
        };
    };
    return Painter;
})();