class PCA {
    constructor(n) {
        this.n_components = n;
    };
    async analyze() {
        const data_dict = {
            n_components: this.n_components,
        }
        const result = await fetch("http://127.0.0.1:8000/custom_pca/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data_dict)
        })
            .then((resp) => { return resp.json() });
        if (result["error"]) {
            console.log("error", result["error"]);
            document.getElementById('error').textContent = result["error"];
        } else {
            document.getElementById('error').textContent = "";
        }

    };
};

function chooseN(n) {
    let pca = new PCA(n);
    pca.analyze();
};

function showFileType(fileInput) {
    const files = fileInput.files;
    for (const i = 0; i < files.length; i++) {
        const name = files[i].name;
        const type = files[i].type;
        if (type !== "text/csv" && type !== "text/plain") {
            document.getElementById('upload-file').disabled = true;
            alert("Invalid file format! Please upload the file of .csv or .txt format.");
        } else {
            document.getElementById('upload-file').disabled = false;
        }
    }
};
