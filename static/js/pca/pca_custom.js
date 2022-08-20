
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
            .then((resp) => { return resp.json() })
    };
};

function chooseN(n) {
    let pca = new PCA(n);
    pca.analyze();
};
