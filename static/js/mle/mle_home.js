class MLE {
    constructor() {
        this.mean = 40.10868841891503;
        this.std = 9.967034665881858;
        this.onChangeMean();
        this.onChangeStd();
    }

    onChangeMean() {
        document.querySelector('#mean').addEventListener('change', e => {
            this.setMean(e.target.value)
            document.querySelector('#mean-pl').innerHTML = e.target.value
        })
    }

    onChangeStd() {
        document.querySelector('#std').addEventListener('change', e => {
            this.setMean(e.target.value)
            document.querySelector('#std-pl').innerHTML = e.target.value
        })
    }

    setMean(mean) {
        this.mean = mean;
    }

    setStd(std) {
        this.std = std;
    }

    async analyze() {
        const data = {
            mean: this.mean,
            std: this.std,
        }
        const result = await fetch("http://127.0.0.1:8000/mle/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((resp) => { return resp.json() })
        const image = result["image"];
        document.getElementById('plot').src = `data:image/png;base64,${image}`;
    }

    reset() {
        document.getElementById('plot').src = "";
        this.mean = 40.10868841891503;
        this.std = 9.967034665881858;
    }

    run() {
        document.querySelector('.analyze').addEventListener('click', (e) => {
            this.analyze();
        });

        document.querySelector('.reset').addEventListener('click', (e) => {
            this.reset();
        });
    }
}

let mle = new MLE();
mle.run()
