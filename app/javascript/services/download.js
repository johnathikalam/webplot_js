var wpd = wpd || {};

wpd.download = (function() {

    function textFile(data, filename) {
        let $downloadElem = document.createElement('a');
        $downloadElem.href = URL.createObjectURL(new Blob([data]), {
            type: "text/plain"
        });
        $downloadElem.download = stripIllegalCharacters(filename);
        $downloadElem.style.display = "none";
        document.body.appendChild($downloadElem);
        $downloadElem.click();
        document.body.removeChild($downloadElem);
    }

    function json(jsonData, filename) {
        if (filename == null) {
            filename = 'wpd_plot_data.json';
        }
        textFile(jsonData, filename);
    }

    function csv(csvData, filename) {
        if (filename == null) {
            filename = 'data.csv';
        }
        textFile(csvData, filename);
    }

    function stripIllegalCharacters(filename) {
        return filename.replace(/[^a-zA-Z\d+\.\-_\s]/g, "_");
    }

    return {
        json: json,
        csv: csv
    };
})();