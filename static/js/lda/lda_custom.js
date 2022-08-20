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
        } else {
            document.getElementById('error').textContent = `${result["error"]}`;
        }
    }
}

function chooseTarget(column) {
    let lda = new LDA(column);
    lda.classify();
};
