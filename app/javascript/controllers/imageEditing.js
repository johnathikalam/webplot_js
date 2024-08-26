var wpd = wpd || {};

wpd.imageEditing = {
    showImageInfo: function() {
        let $imageDimensions = document.getElementById('image-info-dimensions');
        let imageInfo = wpd.imageManager.getImageInfo();
        $imageDimensions.innerHTML = '(' + imageInfo.width + 'x' + imageInfo.height + ')';

        if (wpd.appData.isMultipage()) {
            let $imagePages = document.getElementById('image-info-pages');
            $imagePages.innerHTML = wpd.appData.getPageManager().pageCount();
        }
        wpd.popup.show('image-info-popup');
    },

    startImageCrop: function() {
        wpd.graphicsWidget.setTool(new wpd.CropTool());
    },

    startPerspective: function() {
        wpd.popup.show('perspective-info');
    },

    startPerspectiveConfirmed: function() {

    },

    undo: function() {
        wpd.appData.getUndoManager().undo();
    },

    redo: function() {
        wpd.appData.getUndoManager().redo();
    }
};

wpd.ReversibleAction = class {
    constructor() {}
    execute() {}
    undo() {}
};

wpd.CropImageAction = class extends wpd.ReversibleAction {
    constructor(x0, y0, x1, y1) {
        super();
        this._x0 = x0;
        this._y0 = y0;
        this._x1 = x1;
        this._y1 = y1;
        this._originalImage = null;
    }

    execute() {
        // store current image for undo
        let ctx = wpd.graphicsWidget.getAllContexts();
        let imageSize = wpd.graphicsWidget.getImageSize();
        this._originalImage = ctx.oriImageCtx.getImageData(0, 0, imageSize.width, imageSize.height);

        const width = this._x1 - this._x0;
        const height = this._y1 - this._y0;

        // crop image
        let croppedImage = ctx.oriImageCtx.getImageData(this._x0, this._y0, width, height);
        let croppedWidth = Math.abs(width);
        let croppedHeight = Math.abs(height);

        // replace current image with cropped image
        let imageOp = function(imageData, width, height) {
            return {
                imageData: croppedImage,
                width: croppedWidth,
                height: croppedHeight,
                keepZoom: true
            };
        };

        wpd.graphicsWidget.runImageOp(imageOp);
    }

    undo() {
        // set the saved image
        let originalImage = this._originalImage;
        let imageOp = function(imageData, width, height) {
            return {
                imageData: originalImage,
                width: originalImage.width,
                height: originalImage.height
            };
        };

        // call all dependent UI elements
        wpd.graphicsWidget.runImageOp(imageOp);
    }
};