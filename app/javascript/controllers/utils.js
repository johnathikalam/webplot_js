var wpd = wpd || {};

wpd.utils = (function() {
    function toggleElementsDisplay(elements, hide) {
        for (const $el of elements) $el.hidden = hide;
    }

    function addToCollection(collection, key, objects) {
        if (!collection[key]) {
            collection[key] = [];
        }
        Array.prototype.push.apply(collection[key], objects);
    }

    function deleteFromCollection(collection, key, objects) {
        if (!collection[key]) return;
        objects.forEach(object => {
            const index = collection[key].indexOf(object);
            if (index > -1) {
                collection[key].splice(index, 1);
            }
        });
    }

    function invertObject(object) {
        let map = {};
        Object.entries(object).forEach(([index, collection]) => {
            collection.forEach(item => map[item.name] = parseInt(index, 10));
        });
        return map;
    }

    function filterCollection(collection, key, objects) {
        let filtered = [];
        if (collection[key]) {
            filtered = objects.filter(object => {
                return collection[key].indexOf(object) > -1;
            });
        }
        return filtered;
    }

    function findKey(collection, object) {
        for (const key in collection) {
            if (collection[key].indexOf(object) > -1) {
                return parseInt(key, 10);
            }
        }
    }

    function createOptionsHTML(labels, values, selectedValue) {
        if (labels.length !== values.length) {
            console.error('labels and values length mismatch');
        }

        let optionsHTML = '';
        for (let i = 0; i < labels.length; i++) {
            optionsHTML += '<option value="' + values[i] + '"';
            if (values[i] === selectedValue) optionsHTML += ' selected';
            optionsHTML += '>' + labels[i] + '</option>';
        }
        return optionsHTML;
    }

    function integerRange(count, start = 0) {
        return Array.apply(null, Array(count)).map((_, i) => i + start);
    }

    function isInteger(value) {
        return /^-?[1-9]\d*$|^0$/.test(value);
    }

    function toSentenceCase(string) {
        return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    }

    return {
        addToCollection: addToCollection,
        createOptionsHTML: createOptionsHTML,
        deleteFromCollection: deleteFromCollection,
        filterCollection: filterCollection,
        findKey: findKey,
        integerRange: integerRange,
        invertObject: invertObject,
        isInteger: isInteger,
        toggleElementsDisplay: toggleElementsDisplay,
        toSentenceCase: toSentenceCase
    };
})();