var wpd = wpd || {};

wpd.GridColorFilterRepainter = (function() {
    var Painter = function() {
        this.painterName = 'gridColorFilterRepainter';

        this.onRedraw = function() {
            var autoDetector = wpd.appData.getPlotData().getGridDetectionData();
            wpd.colorSelectionWidget.paintFilteredColor(autoDetector.binaryData,
                autoDetector.gridMask.pixels);
        };
    };
    return Painter;
})();
