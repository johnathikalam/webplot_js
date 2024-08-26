var wpd = wpd || {};

// Run-length encoder/decoder (Mainly used for masks)
wpd.rle = {};

// wpd.rle.encode - Encode a sorted array of integers
wpd.rle.encode = function(sortedArray) {
    // return an array as [[pos, count], [pos, count], ... ]
    let ret = [];
    let prevVal = null;
    let item = [0, 0];
    for (let val of sortedArray) {
        if (prevVal == null) { // first item
            item = [val, 1];
        } else if (val == prevVal + 1) { // continued item
            item[1]++;
        } else { // item ended
            ret.push(item);
            item = [val, 1];
        }
        prevVal = val;
    }
    // add last item
    if (item[1] != 0) {
        ret.push(item);
    }

    return ret;
};

// wpd.rle.decode - Decode RLE array with data as [[pos, count], [pos, count], ... ] etc.
wpd.rle.decode = function(rleArray) {
    let ret = [];
    for (let item of rleArray) {
        let val = item[0];
        let count = item[1];
        for (let i = 0; i < count; ++i) {
            ret.push(val + i);
        }
    }
    return ret;
};