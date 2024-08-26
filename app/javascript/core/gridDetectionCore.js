var wpd = wpd || {};

wpd.gridDetectionCore = (function() {
    var hasHorizontal, hasVertical, xFrac = 0.1,
        yFrac = 0.1;

    function run(autoDetector) {
        var gridData = new Set(),
            xi, yi, xmin = autoDetector.gridMask.xmin,
            xmax = autoDetector.gridMask.xmax,
            ymin = autoDetector.gridMask.ymin,
            ymax = autoDetector.gridMask.ymax,
            dw = autoDetector.imageWidth,
            dh = autoDetector.imageHeight,
            linePixCount;

        if (hasVertical) {

            for (xi = xmin; xi <= xmax; xi++) {
                linePixCount = 0;
                for (yi = ymin; yi < ymax; yi++) {
                    if (autoDetector.binaryData.has(yi * dw + xi)) {
                        linePixCount++;
                    }
                }
                if (linePixCount > yFrac * (ymax - ymin)) {
                    for (yi = ymin; yi < ymax; yi++) {
                        gridData.add(yi * dw + xi);
                    }
                }
            }
        }

        if (hasHorizontal) {

            for (yi = ymin; yi <= ymax; yi++) {
                linePixCount = 0;
                for (xi = xmin; xi <= xmax; xi++) {
                    if (autoDetector.binaryData.has(yi * dw + xi)) {
                        linePixCount++;
                    }
                }
                if (linePixCount > xFrac * (xmax - xmin)) {
                    for (xi = xmin; xi <= xmax; xi++) {
                        gridData.add(yi * dw + xi);
                    }
                }
            }
        }

        return gridData;
    }

    function setHorizontalParameters(has_horizontal, x_perc) {
        hasHorizontal = has_horizontal;
        xFrac = Math.abs(parseFloat(x_perc) / 100.0);
    }

    function setVerticalParameters(has_vertical, y_perc) {
        hasVertical = has_vertical;
        yFrac = Math.abs(parseFloat(y_perc) / 100.0);
    }

    return {
        run: run,
        setHorizontalParameters: setHorizontalParameters,
        setVerticalParameters: setVerticalParameters
    };
})();
