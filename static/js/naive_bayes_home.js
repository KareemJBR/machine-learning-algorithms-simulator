let trueChart = document.getElementById('temp-gradient-true-chart').getContext('2d'),
    truegradient1 = trueChart.createLinearGradient(0, 0, 0, 450),
    truegradient2 = trueChart.createLinearGradient(0, 0, 0, 450),
    truegradient3 = trueChart.createLinearGradient(0, 0, 0, 450);

let predictChart = document.getElementById('temp-gradient-predict-chart').getContext('2d'),
    predictgradient1 = predictChart.createLinearGradient(0, 0, 0, 450),
    predictgradient2 = predictChart.createLinearGradient(0, 0, 0, 450),
    predictgradient3 = predictChart.createLinearGradient(0, 0, 0, 450);

const trueData = {
    labels: [" ", " ", " "],
    data: [],

    datasets: [{
        label: 'setosa',
        backgroundColor: truegradient1,
        pointBackgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#911215',
        data: [0, 19, 0]
    }, {
        label: 'versicolor',
        backgroundColor: truegradient2,
        pointBackgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#171911',
        data: [0, 18, 0]
    }, {
        label: 'virginica',
        backgroundColor: truegradient3,
        pointBackgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'green',
        data: [0, 13, 0]
    }]
};
const predictData = {
    labels: [" ", " ", " "],
    data: [],

    datasets: [{
        label: 'setosa',
        backgroundColor: predictgradient1,
        pointBackgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#911215',
        data: [0, 0, 0]
    }, {
        label: 'versicolor',
        backgroundColor: predictgradient2,
        pointBackgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#171911',
        data: [0, 0, 0]
    }, {
        label: 'virginica',
        backgroundColor: predictgradient3,
        pointBackgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'green',
        data: [0, 0, 0]
    }]
};

const trueChartInstance = new Chart(trueChart, {
    type: 'line',
    data: trueData,
});
const predictChartInstance = new Chart(predictChart, {
    type: 'line',
    data: predictData,
});

class NaiveBayes {
    constructor() {
        this.versicolor = 0;
        this.setosa = 0;
        this.virginica = 0;
        this.accuracy = 0;

        this.onClickPredictAll();
        this.onClickPredictVertosa();
        this.onClickPredictSetosa();
        this.onClickPredictVirginica();
    }
    onClickPredictAll() {
        document.querySelector('#all').addEventListener('click', (e) => {
            this.predict();
            predictChartInstance.data.datasets[0].data = [0, this.setosa, 0];
            predictChartInstance.data.datasets[1].data = [0, this.versicolor, 0];
            predictChartInstance.data.datasets[2].data = [0, this.virginica, 0];
            predictChartInstance.update();
        });
    };

    onClickPredictVertosa() {
        document.querySelector('#versicolor').addEventListener('click', (e) => {
            this.predict();
            predictChartInstance.data.datasets[0].data = [0, 0, 0];
            predictChartInstance.data.datasets[1].data = [0, this.versicolor, 0];
            predictChartInstance.data.datasets[2].data = [0, 0, 0];
            predictChartInstance.update();
        });
    };
    onClickPredictSetosa() {
        document.querySelector('#setosa').addEventListener('click', (e) => {
            this.predict();
            predictChartInstance.data.datasets[0].data = [0, this.setosa, 0];
            predictChartInstance.data.datasets[1].data = [0, 0, 0];
            predictChartInstance.data.datasets[2].data = [0, 0, 0];
            predictChartInstance.update();
        });
    };
    onClickPredictVirginica() {
        document.querySelector('#virginica').addEventListener('click', (e) => {
            this.predict();
            predictChartInstance.data.datasets[0].data = [0, 0, 0];
            predictChartInstance.data.datasets[1].data = [0, 0, 0];
            predictChartInstance.data.datasets[2].data = [0, this.virginica, 0];
            predictChartInstance.update();
        });

    };
    async predict() {
        const data_dict = {
        }
        const result = await fetch("http://127.0.0.1:8000/naive_bayes/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data_dict)
        })
            .then((resp) => { return resp.json() })
        const data = result["data"];
        this.versicolor = data["versicolor"];
        this.setosa = data["setosa"];
        this.virginica = data["virginica"];
        this.accuracy = data["accuracy"];
    }
};

let naiveBayes = new NaiveBayes();
naiveBayes.predict();
