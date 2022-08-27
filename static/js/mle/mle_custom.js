class MLE {
    constructor() {
        this.mean = 0;
        this.std = 0;
        this.target_column = "";
    }

    async analyze_by_column(column) {
        document.getElementById('plot').src = "";
        this.target_column = column;
        const data = {
            target_column: column,
        }
        const result = await fetch("http://127.0.0.1:8000/custom_mle/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((resp) => { return resp.json() })
        if (result["image"]) {
            const image = result["image"];
            document.getElementById('plot').src = `data:image/png;base64,${image}`;
            document.getElementById('error').textContent = "";
        }
        if (result["mean"]) {
            this.mean = result["mean"];
            console.log("this.mean", this.mean)
            document.getElementById('mean').textContent = `μ: ${this.mean}`;
        }
        if (result["std"]) {
            this.std = result["std"];
            console.log("this.std", this.std)
            document.getElementById('std').textContent = `σ: ${this.std}`;
        }
        if (result["error"]) {
            document.getElementById('error').textContent = `${result["error"]}`;
            document.getElementById('plot').src = "";
        }
    }
}

function chooseTarget(column) {
    let mle = new MLE();
    mle.analyze_by_column(column)
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
