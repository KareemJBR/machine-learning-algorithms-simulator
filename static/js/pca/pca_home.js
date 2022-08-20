// set the dimensions and margins of the graph
const minHeight = 460;
const MARGIN = { top: 20, right: 130, bottom: 130, left: 60 },
    WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - MARGIN.left - MARGIN.right,
    HEIGHT = minHeight - 30;

// X asis values
const setosaXClass = [[5.1, 3.5, 1.4, 0.2], [4.9, 3, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2], [4.6, 3.1, 1.5, 0.2], [5, 3.6, 1.4, 0.2], [5.4, 3.9, 1.7, 0.4], [4.6, 3.4, 1.4, 0.3], [5, 3.4, 1.5, 0.2], [4.4, 2.9, 1.4, 0.2], [4.9, 3.1, 1.5, 0.1], [5.4, 3.7, 1.5, 0.2], [4.8, 3.4, 1.6, 0.2], [4.8, 3, 1.4, 0.1], [4.3, 3, 1.1, 0.1], [5.8, 4, 1.2, 0.2], [5.7, 4.4, 1.5, 0.4], [5.4, 3.9, 1.3, 0.4], [5.1, 3.5, 1.4, 0.3], [5.7, 3.8, 1.7, 0.3], [5.1, 3.8, 1.5, 0.3], [5.4, 3.4, 1.7, 0.2], [5.1, 3.7, 1.5, 0.4], [4.6, 3.6, 1, 0.2], [5.1, 3.3, 1.7, 0.5], [4.8, 3.4, 1.9, 0.2], [5, 3, 1.6, 0.2], [5, 3.4, 1.6, 0.4], [5.2, 3.5, 1.5, 0.2], [5.2, 3.4, 1.4, 0.2], [4.7, 3.2, 1.6, 0.2], [4.8, 3.1, 1.6, 0.2], [5.4, 3.4, 1.5, 0.4], [5.2, 4.1, 1.5, 0.1], [5.5, 4.2, 1.4, 0.2], [4.9, 3.1, 1.5, 0.2], [5, 3.2, 1.2, 0.2], [5.5, 3.5, 1.3, 0.2], [4.9, 3.6, 1.4, 0.1], [4.4, 3, 1.3, 0.2], [5.1, 3.4, 1.5, 0.2], [5, 3.5, 1.3, 0.3], [4.5, 2.3, 1.3, 0.3], [4.4, 3.2, 1.3, 0.2], [5, 3.5, 1.6, 0.6], [5.1, 3.8, 1.9, 0.4], [4.8, 3, 1.4, 0.3], [5.1, 3.8, 1.6, 0.2], [4.6, 3.2, 1.4, 0.2], [5.3, 3.7, 1.5, 0.2], [5, 3.3, 1.4, 0.2]];
const versicolorXClass = [[7, 3.2, 4.7, 1.4], [6.4, 3.2, 4.5, 1.5], [6.9, 3.1, 4.9, 1.5], [5.5, 2.3, 4, 1.3], [6.5, 2.8, 4.6, 1.5], [5.7, 2.8, 4.5, 1.3], [6.3, 3.3, 4.7, 1.6], [4.9, 2.4, 3.3, 1], [6.6, 2.9, 4.6, 1.3], [5.2, 2.7, 3.9, 1.4], [5, 2, 3.5, 1], [5.9, 3, 4.2, 1.5], [6, 2.2, 4, 1], [6.1, 2.9, 4.7, 1.4], [5.6, 2.9, 3.6, 1.3], [6.7, 3.1, 4.4, 1.4], [5.6, 3, 4.5, 1.5], [5.8, 2.7, 4.1, 1], [6.2, 2.2, 4.5, 1.5], [5.6, 2.5, 3.9, 1.1], [5.9, 3.2, 4.8, 1.8], [6.1, 2.8, 4, 1.3], [6.3, 2.5, 4.9, 1.5], [6.1, 2.8, 4.7, 1.2], [6.4, 2.9, 4.3, 1.3], [6.6, 3, 4.4, 1.4], [6.8, 2.8, 4.8, 1.4], [6.7, 3, 5, 1.7], [6, 2.9, 4.5, 1.5], [5.7, 2.6, 3.5, 1], [5.5, 2.4, 3.8, 1.1], [5.5, 2.4, 3.7, 1], [5.8, 2.7, 3.9, 1.2], [6, 2.7, 5.1, 1.6], [5.4, 3, 4.5, 1.5], [6, 3.4, 4.5, 1.6], [6.7, 3.1, 4.7, 1.5], [6.3, 2.3, 4.4, 1.3], [5.6, 3, 4.1, 1.3], [5.5, 2.5, 4, 1.3], [5.5, 2.6, 4.4, 1.2], [6.1, 3, 4.6, 1.4], [5.8, 2.6, 4, 1.2], [5, 2.3, 3.3, 1], [5.6, 2.7, 4.2, 1.3], [5.7, 3, 4.2, 1.2], [5.7, 2.9, 4.2, 1.3], [6.2, 2.9, 4.3, 1.3], [5.1, 2.5, 3, 1.1], [5.7, 2.8, 4.1, 1.3]];
const virginicaXClass = [[6.3, 3.3, 6, 2.5], [5.8, 2.7, 5.1, 1.9], [7.1, 3, 5.9, 2.1], [6.3, 2.9, 5.6, 1.8], [6.5, 3, 5.8, 2.2], [7.6, 3, 6.6, 2.1], [4.9, 2.5, 4.5, 1.7], [7.3, 2.9, 6.3, 1.8], [6.7, 2.5, 5.8, 1.8], [7.2, 3.6, 6.1, 2.5], [6.5, 3.2, 5.1, 2], [6.4, 2.7, 5.3, 1.9], [6.8, 3, 5.5, 2.1], [5.7, 2.5, 5, 2], [5.8, 2.8, 5.1, 2.4], [6.4, 3.2, 5.3, 2.3], [6.5, 3, 5.5, 1.8], [7.7, 3.8, 6.7, 2.2], [7.7, 2.6, 6.9, 2.3], [6, 2.2, 5, 1.5], [6.9, 3.2, 5.7, 2.3], [5.6, 2.8, 4.9, 2], [7.7, 2.8, 6.7, 2], [6.3, 2.7, 4.9, 1.8], [6.7, 3.3, 5.7, 2.1], [7.2, 3.2, 6, 1.8], [6.2, 2.8, 4.8, 1.8], [6.1, 3, 4.9, 1.8], [6.4, 2.8, 5.6, 2.1], [7.2, 3, 5.8, 1.6], [7.4, 2.8, 6.1, 1.9], [7.9, 3.8, 6.4, 2], [6.4, 2.8, 5.6, 2.2], [6.3, 2.8, 5.1, 1.5], [6.1, 2.6, 5.6, 1.4], [7.7, 3, 6.1, 2.3], [6.3, 3.4, 5.6, 2.4], [6.4, 3.1, 5.5, 1.8], [6, 3, 4.8, 1.8], [6.9, 3.1, 5.4, 2.1], [6.7, 3.1, 5.6, 2.4], [6.9, 3.1, 5.1, 2.3], [5.8, 2.7, 5.1, 1.9], [6.8, 3.2, 5.9, 2.3], [6.7, 3.3, 5.7, 2.5], [6.7, 3, 5.2, 2.3], [6.3, 2.5, 5, 1.9], [6.5, 3, 5.2, 2], [6.2, 3.4, 5.4, 2.3], [5.9, 3, 5.1, 1.8]];

// Y asis values
const setosaType = 0;
const versicolorType = 1;
const virginicaType = 2;

// append the svg object to the body of the page
let svg = d3.select("#pca")
    .append("svg")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
    .append("g")
    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

class PCA {
    constructor() {
        this.n_components = 2;
        this.amountOfPointsPerClass = 50;
        this.x = [];
        this.y = [];
        this.p1 = [];
        this.p2 = [];
        this.p3 = [];
        this.color = [];
        this.result = [];

        this.onChangeNComponents();
    }

    setNComponents(n_components) {
        this.n_components = n_components;
    }

    onChangeNComponents() {
        document.querySelector('#n_components').addEventListener('change', e => {
            this.setNComponents(e.target.value);
            document.querySelector('#n_components-pl').innerHTML = e.target.value;
        })
    }

    prepare() {
        const slicedSetosaXArray = setosaXClass.slice(0, this.amountOfPointsPerClass);
        const slicedVersicolorXArray = versicolorXClass.slice(0, this.amountOfPointsPerClass);
        const slicedVirginicaXArray = virginicaXClass.slice(0, this.amountOfPointsPerClass);
        const setosaY = Array.from({ length: this.amountOfPointsPerClass }, i => setosaType);
        const versicolorY = Array.from({ length: this.amountOfPointsPerClass }, i => versicolorType);
        const virginicaY = Array.from({ length: this.amountOfPointsPerClass }, i => virginicaType);
        this.x = [...slicedSetosaXArray, ...slicedVersicolorXArray, ...slicedVirginicaXArray];
        this.y = [...setosaY, ...versicolorY, ...virginicaY];
    }

    async analyze() {
        const data_dict = {
            train_x: this.x,
            train_y: this.y,
            n_components: this.n_components,
        }
        const result = await fetch("http://127.0.0.1:8000/pca/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data_dict)
        })
            .then((resp) => { return resp.json() })
        if (this.n_components === 2 || this.n_components === "2") {
            const data = result["data"];

            this.p1 = data["p1"];
            this.p2 = data["p2"];
            this.color = data["target"];

            const groupData = [];
            this.p1.forEach((num1, index) => {
                const num2 = this.p2[index];
                const num3 = this.color[index]
                groupData.push([num1, num2, num3])
            });
            this.result = groupData;

            // Add X axis
            let x = d3.scaleLinear()
                .domain([-4, 3])
                .range([0, WIDTH]);
            svg.append("g")
                .attr("transform", "translate(0," + HEIGHT + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            let y = d3.scaleLinear()
                .domain([-1.5, 1.5])
                .range([HEIGHT, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            const chooseColor = d3.scaleOrdinal()
                .domain([0, 1])
                .range(["#440154ff", "#21908dff", "#fde725ff"])

            svg.append('g')
                .selectAll("dot")
                .data(this.result)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d[0]); })
                .attr("cy", function (d) { return y(d[1]); })
                .attr("r", 3)
                .style("fill", function (d) { return chooseColor(d[2]) });
        }
        if (this.n_components === 3 || this.n_components === "3") {
            const data = result["data"];
            this.p1 = data["p1"];
            this.p2 = data["p2"];
            if (data["p3"]) {
                this.p3 = data["p3"];
            }
            this.color = data["target"];
            const groupData = [];
            this.p1.forEach((num1, index) => {
                const num2 = this.p2[index];
                const num3 = this.p3[index];
                const num4 = this.color[index]
                groupData.push([num1, num2, num3, num4])
            });
            this.result = groupData;
            let image = document.getElementById("image");
            image.style = "display: block";
        }
    }

    reset() {
        this.x = [];
        this.y = [];
        this.p1 = [];
        this.p2 = [];
        this.p3 = [];
        this.color = [];
        this.result = [];
        svg.selectAll("*").remove();
        this.prepare();
        let i = document.getElementById('image')
        i.style.display = "none";
    }

    run() {
        d3.select(".analyze").on("click", () => {
            this.reset();
            this.prepare();
            this.analyze();
        });

        d3.select(".reset").on("click", () => {
            this.reset();
        });
    }
}

let pca = new PCA();
pca.run();

let img = document.getElementById('image')
img.style.display = "none";
