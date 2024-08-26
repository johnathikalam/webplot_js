var wpd = wpd || {};

wpd.Color = class {
    constructor(r = 0, g = 0, b = 0, a = 255) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    toRGBString() {
        return `rgb(${this._r}, ${this._g}, ${this._b})`;
    }

    toRGBAString() {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
    }

    serialize() {
        return [this._r, this._g, this._b, this._a];
    }

    getRGB() {
        return [this._r, this._g, this._b];
    }

    deserialize(data) {
        this._r = data[0];
        this._g = data[1];
        this._b = data[2];
        this._a = data[3];
    }
};