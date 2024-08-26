var wpd = wpd || {};

wpd.AxesCornersTool = (function() {
    var Tool = function(calibration, reloadTool) {
        var pointCount = 0,
            _calibration = calibration,
            isCapturingCorners = true;

        if (reloadTool) {
            pointCount = _calibration.maxPointCount;
            isCapturingCorners = false;
        } else {
            pointCount = 0;
            isCapturingCorners = true;
            wpd.graphicsWidget.resetData();
        }

        this.onMouseClick = function(ev, pos, imagePos) {
            if (isCapturingCorners) {

                pointCount = pointCount + 1;
                // _calibration.addPoint(imagePos.x, imagePos.y, 0, 0);
                switch(pointCount){
                    case 1: _calibration.addPoint(388.57202291110343, 1655.3711507293356, 0, 0);break;
                    case 2: _calibration.addPoint(3179.1896272285253, 1655.3711507293356, 0, 0);break;
                    case 3: _calibration.addPoint(388.57202291110343, 1655.3711507293356, 0, 0);break;
                    case 4: _calibration.addPoint(388.57202291110343, 235.1883296567205, 0, 0);break;
                }
                console.log("imagePos: "+imagePos.x, imagePos.y, 0, 0)
                _calibration.unselectAll();
                _calibration.selectPoint(pointCount - 1);
                wpd.graphicsWidget.forceHandlerRepaint();

                if (pointCount === _calibration.maxPointCount) {
                    isCapturingCorners = false;
                    wpd.alignAxes.calibrationCompleted();
                }

                wpd.graphicsWidget.updateZoomOnEvent(ev);
            } else {
                _calibration.unselectAll();
                // cal.selectNearestPoint(imagePos.x,
                // imagePos.y, 15.0/wpd.graphicsWidget.getZoomRatio());
                _calibration.selectNearestPoint(imagePos.x, imagePos.y);
                wpd.graphicsWidget.forceHandlerRepaint();
                wpd.graphicsWidget.updateZoomOnEvent(ev);
            }
        };

        this.onKeyDown = function(ev) {
            if (_calibration.getSelectedPoints().length === 0) {
                return;
            }

            var selPoint = _calibration.getPoint(_calibration.getSelectedPoints()[0]),
                pointPx = selPoint.px,
                pointPy = selPoint.py,
                stepSize = ev.shiftKey === true ? 5 / wpd.graphicsWidget.getZoomRatio() :
                0.5 / wpd.graphicsWidget.getZoomRatio();

            // rotate to current rotation
            const currentRotation = wpd.graphicsWidget.getRotation();
            let {
                x,
                y
            } = wpd.graphicsWidget.getRotatedCoordinates(0, currentRotation, pointPx, pointPy);

            if (wpd.keyCodes.isUp(ev.keyCode)) {
                y = y - stepSize;
            } else if (wpd.keyCodes.isDown(ev.keyCode)) {
                y = y + stepSize;
            } else if (wpd.keyCodes.isLeft(ev.keyCode)) {
                x = x - stepSize;
            } else if (wpd.keyCodes.isRight(ev.keyCode)) {
                x = x + stepSize;
            } else {
                return;
            }

            // rotate back to original rotation
            ({
                x,
                y
            } = wpd.graphicsWidget.getRotatedCoordinates(currentRotation, 0, x, y));

            _calibration.changePointPx(_calibration.getSelectedPoints()[0], x, y);
            wpd.graphicsWidget.forceHandlerRepaint();
            wpd.graphicsWidget.updateZoomToImagePosn(x, y);
            ev.preventDefault();
            ev.stopPropagation();
        };
    };

    return Tool;
})();

wpd.AlignmentCornersRepainter = (function() {
    var Tool = function(calibration) {
        var _calibration = calibration;

        this.painterName = 'AlignmentCornersReptainer';

        this.onForcedRedraw = function() {
            wpd.graphicsWidget.resetData();
            this.onRedraw();
        };

        this.onRedraw = function() {
            if (_calibration == null) {
                return;
            }

            var i, imagePos, imagePx, fillStyle;

            for (i = 0; i < _calibration.getCount(); i++) {
                imagePos = _calibration.getPoint(i);
                imagePx = {
                    x: imagePos.px,
                    y: imagePos.py
                };

                if (_calibration.isPointSelected(i)) {
                    fillStyle = "rgba(0,200,0,1)";
                } else {
                    fillStyle = "rgba(200,0,0,1)";
                }

                wpd.graphicsHelper.drawPoint(imagePx, fillStyle, _calibration.labels[i],
                    _calibration.labelPositions[i]);
            }
        };
    };
    return Tool;
})();

wpd.CircularChartRecorderAlignmentRepainter = class {
    _calibration = null;
    painterName = 'CircularChartRecorderAlignmentRepainter';

    constructor(calibration) {
        this._calibration = calibration;
    }

    onForcedRedraw() {
        wpd.graphicsWidget.resetData();
        this.onRedraw();
    }

    onRedraw() {
        if (this._calibration == null) {
            return;
        }
        for (let i = 0; i < this._calibration.getCount(); i++) {
            let imagePos = this._calibration.getPoint(i);
            let imagePx = {
                x: imagePos.px,
                y: imagePos.py
            };

            let fillStyle = "rgba(200,0,0,1)";
            if (this._calibration.isPointSelected(i)) {
                fillStyle = "rgba(0,200,0,1)";
            }
            wpd.graphicsHelper.drawPoint(imagePx, fillStyle, this._calibration.labels[i], this._calibration.labelPositions[i]);
        }

        // draw chart and pen circles
        if (this._calibration.getCount() == 5) {
            let cp = [];
            for (let i = 0; i < 5; i++) {
                cp.push(this._calibration.getPoint(i));
            }
            let penArcPts = [
                [cp[0].px, cp[0].py],
                [cp[1].px, cp[1].py],
                [cp[2].px, cp[2].py]
            ];
            let chartPts = [
                [cp[2].px, cp[2].py],
                [cp[3].px, cp[3].py],
                [cp[4].px, cp[4].py]
            ];
            let penCircle = wpd.getCircleFrom3Pts(penArcPts);
            let chartCircle = wpd.getCircleFrom3Pts(chartPts);
            wpd.graphicsHelper.drawCircle(penCircle, "rgba(0,200,0,0.5)");
            wpd.graphicsHelper.drawCircle(chartCircle, "rgba(200,0,0,1)");
        }
    }
};