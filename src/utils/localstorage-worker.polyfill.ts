// This polyfill is needed when running in service worker or in chrome extensions background service

if (!globalThis.localStorage) {
    console.log('overriding localStorage implementation');
    globalThis.localStorage = {
        _data: {},
        setItem: function (id, val) {
            return this._data[id] = String(val);
        },
        getItem: function (id) {
            return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
        },
        removeItem: function (id) {
            return delete this._data[id];
        },
        clear: function () {
            return this._data = {};
        },
        key: function (i) {
            return Array.from(this._data.keys())[i] as string | null
        },
        get length() {
            return this._data.length();
        }
    };
    //localStorage.setItem('debug', 'libp2p:*');
}

export default {}
