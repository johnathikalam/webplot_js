var wpd = wpd || {};

wpd.imageOps = (function() {
    function hflipOp(idata, iwidth, iheight) {
        var rowi, coli, index, mindex, tval, p;
        for (rowi = 0; rowi < iheight; rowi++) {
            for (coli = 0; coli < iwidth / 2; coli++) {
                index = 4 * (rowi * iwidth + coli);
                mindex = 4 * ((rowi + 1) * iwidth - (coli + 1));
                for (p = 0; p < 4; p++) {
                    tval = idata.data[index + p];
                    idata.data[index + p] = idata.data[mindex + p];
                    idata.data[mindex + p] = tval;
                }
            }
        }
        return {
            imageData: idata,
            width: iwidth,
            height: iheight
        };
    }

    function vflipOp(idata, iwidth, iheight) {
        var rowi, coli, index, mindex, tval, p;
        for (rowi = 0; rowi < iheight / 2; rowi++) {
            for (coli = 0; coli < iwidth; coli++) {
                index = 4 * (rowi * iwidth + coli);
                mindex = 4 * ((iheight - (rowi + 2)) * iwidth + coli);
                for (p = 0; p < 4; p++) {
                    tval = idata.data[index + p];
                    idata.data[index + p] = idata.data[mindex + p];
                    idata.data[mindex + p] = tval;
                }
            }
        }
        return {
            imageData: idata,
            width: iwidth,
            height: iheight
        };
    }

    function hflip() {
        wpd.graphicsWidget.runImageOp(hflipOp);
    }

    function vflip() {
        wpd.graphicsWidget.runImageOp(vflipOp);
    }

    return {
        hflip: hflip,
        vflip: vflip
    };
})();