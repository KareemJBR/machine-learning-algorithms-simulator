class NaiveBayes {
    constructor(type) {
        this.type = type;
        this.accuracy = 0;
        this.actual_values = {};
        this.predicted_values = {};
    }
    drawActualValues() {
        let trueChart = document.getElementById('temp-gradient-true-chart').getContext('2d');
        let trueData = {
            labels: [" ", " ", " "],
            data: [],
            datasets: [],
        };
        for (const [key, value] of Object.entries(this.actual_values)) {
            const truegradient = trueChart.createLinearGradient(0, 0, 0, 450);
            const item = {
                label: key,
                backgroundColor: truegradient,
                pointBackgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#911215',
                data: [0, value, 0]
            }
            trueData["datasets"].push(item);
        }
        console.log("trueData", trueData);
        new Chart(trueChart, {
            type: 'line',
            data: trueData,
        });
        document.getElementById("predictedValues").innerText = "Predicted Values";
    }
    drawPredictedValues() {
        let predictedChart = document.getElementById('temp-gradient-predict-chart').getContext('2d');
        let predictedData = {
            labels: [" ", " ", " "],
            data: [],
            datasets: [],
        };
        for (const [key, value] of Object.entries(this.predicted_values)) {
            const predictedgradient = predictedChart.createLinearGradient(0, 0, 0, 450);
            const item = {
                label: key,
                backgroundColor: predictedgradient,
                pointBackgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#911215',
                data: [0, value, 0]
            }
            predictedData["datasets"].push(item);
        }
        console.log("predictedData", predictedData);
        new Chart(predictedChart, {
            type: 'line',
            data: predictedData,
        });
        document.getElementById("trueValues").innerText = "True Values";
    };
    displayAccuracy() {
        document.getElementById("accuracy").innerText = `Accuracy: ${this.accuracy}`;
    };

    onClickSubmit() {
        document.querySelector('#submit-type-btn').addEventListener('click', (e) => {
            console.log("TYPE", e.target.value);
        });
    };

    async predict() {
        const data_dict = {
            type: this.type
        }
        const result = await fetch("http://127.0.0.1:8000/custom_naive_bayes/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data_dict)
        })
            .then((resp) => { return resp.json() });
        const data = result;
        if (data["error"]) {
            document.getElementById('error').textContent = `${data["error"]}`;
            this.accuracy = 0;
            this.actual_values = {};
            this.predicted_values = {};
            this.drawActualValues();
            this.drawPredictedValues();
            this.displayAccuracy();
        } else {
            document.getElementById('error').textContent = "";
            this.accuracy = data["data"]["accuracy"];
            this.actual_values = data["data"]["actual_values"];
            this.predicted_values = data["data"]["predicted_values"];
            this.drawActualValues();
            this.drawPredictedValues();
            this.displayAccuracy();
        }
    };
};

function chooseType(type) {
    let naiveBayes = new NaiveBayes(type);
    console.log("TYPE", naiveBayes.type);
    naiveBayes.predict();
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
