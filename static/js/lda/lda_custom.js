class LDA {
    constructor(column) {
        this.column = column;
    }

    async classify() {
        const data = {
            target_column: this.column,
        }
        const result = await fetch("http://127.0.0.1:8000/custom_lda/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((resp) => { return resp.json() })
        if (result["image"]) {
            const image = result["image"];
            document.getElementById('custom-lda').src = `data:image/png;base64,${image}`;
            document.getElementById('error').textContent = "";
        } else {
            document.getElementById('error').textContent = `${result["error"]}`;
            document.getElementById('custom-lda').src = "";
        }
    }
}

function chooseTarget(column) {
    let lda = new LDA(column);
    lda.classify();
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
