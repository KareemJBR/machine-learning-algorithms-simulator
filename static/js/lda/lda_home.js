// set the dimensions and margins of the graph
const minHeight = 460;
const MARGIN = { top: 20, right: 130, bottom: 130, left: 60 },
    WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - MARGIN.left - MARGIN.right,
    HEIGHT = minHeight - 30;

// INITIAL DATA
const points_labels = ['s_length', 's_width', 'p_length', 'p_width', 'target', 'species']

// X asis values
const setosaXClass = [[5.1, 3.5, 1.4, 0.2], [4.9, 3, 1.4, 0.2], [4.7, 3.2, 1.3, 0.2], [4.6, 3.1, 1.5, 0.2], [5, 3.6, 1.4, 0.2], [5.4, 3.9, 1.7, 0.4], [4.6, 3.4, 1.4, 0.3], [5, 3.4, 1.5, 0.2], [4.4, 2.9, 1.4, 0.2], [4.9, 3.1, 1.5, 0.1], [5.4, 3.7, 1.5, 0.2], [4.8, 3.4, 1.6, 0.2], [4.8, 3, 1.4, 0.1], [4.3, 3, 1.1, 0.1], [5.8, 4, 1.2, 0.2], [5.7, 4.4, 1.5, 0.4], [5.4, 3.9, 1.3, 0.4], [5.1, 3.5, 1.4, 0.3], [5.7, 3.8, 1.7, 0.3], [5.1, 3.8, 1.5, 0.3], [5.4, 3.4, 1.7, 0.2], [5.1, 3.7, 1.5, 0.4], [4.6, 3.6, 1, 0.2], [5.1, 3.3, 1.7, 0.5], [4.8, 3.4, 1.9, 0.2], [5, 3, 1.6, 0.2], [5, 3.4, 1.6, 0.4], [5.2, 3.5, 1.5, 0.2], [5.2, 3.4, 1.4, 0.2], [4.7, 3.2, 1.6, 0.2], [4.8, 3.1, 1.6, 0.2], [5.4, 3.4, 1.5, 0.4], [5.2, 4.1, 1.5, 0.1], [5.5, 4.2, 1.4, 0.2], [4.9, 3.1, 1.5, 0.2], [5, 3.2, 1.2, 0.2], [5.5, 3.5, 1.3, 0.2], [4.9, 3.6, 1.4, 0.1], [4.4, 3, 1.3, 0.2], [5.1, 3.4, 1.5, 0.2], [5, 3.5, 1.3, 0.3], [4.5, 2.3, 1.3, 0.3], [4.4, 3.2, 1.3, 0.2], [5, 3.5, 1.6, 0.6], [5.1, 3.8, 1.9, 0.4], [4.8, 3, 1.4, 0.3], [5.1, 3.8, 1.6, 0.2], [4.6, 3.2, 1.4, 0.2], [5.3, 3.7, 1.5, 0.2], [5, 3.3, 1.4, 0.2]];
const versicolorXClass = [[7, 3.2, 4.7, 1.4], [6.4, 3.2, 4.5, 1.5], [6.9, 3.1, 4.9, 1.5], [5.5, 2.3, 4, 1.3], [6.5, 2.8, 4.6, 1.5], [5.7, 2.8, 4.5, 1.3], [6.3, 3.3, 4.7, 1.6], [4.9, 2.4, 3.3, 1], [6.6, 2.9, 4.6, 1.3], [5.2, 2.7, 3.9, 1.4], [5, 2, 3.5, 1], [5.9, 3, 4.2, 1.5], [6, 2.2, 4, 1], [6.1, 2.9, 4.7, 1.4], [5.6, 2.9, 3.6, 1.3], [6.7, 3.1, 4.4, 1.4], [5.6, 3, 4.5, 1.5], [5.8, 2.7, 4.1, 1], [6.2, 2.2, 4.5, 1.5], [5.6, 2.5, 3.9, 1.1], [5.9, 3.2, 4.8, 1.8], [6.1, 2.8, 4, 1.3], [6.3, 2.5, 4.9, 1.5], [6.1, 2.8, 4.7, 1.2], [6.4, 2.9, 4.3, 1.3], [6.6, 3, 4.4, 1.4], [6.8, 2.8, 4.8, 1.4], [6.7, 3, 5, 1.7], [6, 2.9, 4.5, 1.5], [5.7, 2.6, 3.5, 1], [5.5, 2.4, 3.8, 1.1], [5.5, 2.4, 3.7, 1], [5.8, 2.7, 3.9, 1.2], [6, 2.7, 5.1, 1.6], [5.4, 3, 4.5, 1.5], [6, 3.4, 4.5, 1.6], [6.7, 3.1, 4.7, 1.5], [6.3, 2.3, 4.4, 1.3], [5.6, 3, 4.1, 1.3], [5.5, 2.5, 4, 1.3], [5.5, 2.6, 4.4, 1.2], [6.1, 3, 4.6, 1.4], [5.8, 2.6, 4, 1.2], [5, 2.3, 3.3, 1], [5.6, 2.7, 4.2, 1.3], [5.7, 3, 4.2, 1.2], [5.7, 2.9, 4.2, 1.3], [6.2, 2.9, 4.3, 1.3], [5.1, 2.5, 3, 1.1], [5.7, 2.8, 4.1, 1.3]];
const virginicaXClass = [[6.3, 3.3, 6, 2.5], [5.8, 2.7, 5.1, 1.9], [7.1, 3, 5.9, 2.1], [6.3, 2.9, 5.6, 1.8], [6.5, 3, 5.8, 2.2], [7.6, 3, 6.6, 2.1], [4.9, 2.5, 4.5, 1.7], [7.3, 2.9, 6.3, 1.8], [6.7, 2.5, 5.8, 1.8], [7.2, 3.6, 6.1, 2.5], [6.5, 3.2, 5.1, 2], [6.4, 2.7, 5.3, 1.9], [6.8, 3, 5.5, 2.1], [5.7, 2.5, 5, 2], [5.8, 2.8, 5.1, 2.4], [6.4, 3.2, 5.3, 2.3], [6.5, 3, 5.5, 1.8], [7.7, 3.8, 6.7, 2.2], [7.7, 2.6, 6.9, 2.3], [6, 2.2, 5, 1.5], [6.9, 3.2, 5.7, 2.3], [5.6, 2.8, 4.9, 2], [7.7, 2.8, 6.7, 2], [6.3, 2.7, 4.9, 1.8], [6.7, 3.3, 5.7, 2.1], [7.2, 3.2, 6, 1.8], [6.2, 2.8, 4.8, 1.8], [6.1, 3, 4.9, 1.8], [6.4, 2.8, 5.6, 2.1], [7.2, 3, 5.8, 1.6], [7.4, 2.8, 6.1, 1.9], [7.9, 3.8, 6.4, 2], [6.4, 2.8, 5.6, 2.2], [6.3, 2.8, 5.1, 1.5], [6.1, 2.6, 5.6, 1.4], [7.7, 3, 6.1, 2.3], [6.3, 3.4, 5.6, 2.4], [6.4, 3.1, 5.5, 1.8], [6, 3, 4.8, 1.8], [6.9, 3.1, 5.4, 2.1], [6.7, 3.1, 5.6, 2.4], [6.9, 3.1, 5.1, 2.3], [5.8, 2.7, 5.1, 1.9], [6.8, 3.2, 5.9, 2.3], [6.7, 3.3, 5.7, 2.5], [6.7, 3, 5.2, 2.3], [6.3, 2.5, 5, 1.9], [6.5, 3, 5.2, 2], [6.2, 3.4, 5.4, 2.3], [5.9, 3, 5.1, 1.8]];

// Y asis values
const setosaType = 0;
const versicolorType = 1;
const virginicaType = 2;

// append the svg object to the body of the page
let svg = d3.select("#lda")
    .append("svg")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
    .append("g")
    .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

// Add X axis
let x = d3.scaleLinear()
    .domain([0, 8])
    .range([0, WIDTH]);
svg.append("g")
    .attr("transform", "translate(0," + HEIGHT + ")")
    .call(d3.axisBottom(x));

// Add Y axis
let y = d3.scaleLinear()
    .domain([0, 3])
    .range([HEIGHT, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

// square root scale.
let radius = d3.scaleSqrt()
    .range([2, 5]);

// again scaleOrdinal
let color = d3.scaleOrdinal(d3.schemeCategory20);

let line = d3.line()
    .x(function (d) { return x(d.x); })
    .y(function (d) { return y(d.y); });

const lines = [
    [{ "x": 1.8, "y": 0.1 }, { "x": 5.5, "y": 3.0 }],
    [{ "x": 4.75, "y": 2.4 }, { "x": 7.5, "y": 0.4 },],
]

class LDA {
    constructor() {
        this.x = [];
        this.y = [];
        this.setosaClass = [];
        this.versicolorClass = [];
        this.virginicaClass = [];
        this.amountOfPointsPerClass = 50;
        this.prepare();
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

    setPointsPerClass(points) {
        this.amountOfPointsPerClass = points;
    }

    onChangePointsPerClass() {
        document.querySelector('#points').addEventListener('change', e => {
            this.setPointsPerClass(e.target.value);
            document.querySelector('#points-pl').innerHTML = e.target.value;
        })
    }

    reset() {
        this.setosaClass = [];
        this.versicolorClass = [];
        this.virginicaClass = [];
        svg.selectAll("circle").remove();
        this.prepare();
    }

    async classify() {
        const data = {
            points_x: this.x,
            points_y: this.y,
        }
        const result = await fetch("http://127.0.0.1:8000/lda/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((resp) => { return resp.json() })
        console.log("RES", result)
        // set first class
        const firstGroup = result["data"][0]
        const firstX = firstGroup["x"]
        const firstY = firstGroup["y"]
        const setosaGroupData = [];
        firstX.forEach((num1, index) => {
            const num2 = firstY[index];
            setosaGroupData.push([num1, num2])
        });
        this.setosaClass = setosaGroupData;

        // set second class
        const secondGroup = result["data"][1]
        const secondX = secondGroup["x"]
        const secondY = secondGroup["y"]
        const virginicaGroupData = [];
        secondX.forEach((num1, index) => {
            const num2 = secondY[index];
            virginicaGroupData.push([num1, num2])
        });
        this.virginicaClass = virginicaGroupData;

        // set third class
        const thirdGroup = result["data"][2]
        const thirdX = thirdGroup["x"]
        const thirdY = thirdGroup["y"]
        const versicolorGroupData = [];
        thirdX.forEach((num1, index) => {
            const num2 = thirdY[index];
            versicolorGroupData.push([num1, num2])
        });
        this.versicolorClass = versicolorGroupData;

        svg.append('g')
            .selectAll("dot")
            .data(this.virginicaClass)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); })
            .attr("cy", function (d) { return y(d[1]); })
            .attr("r", 3)
            .style("fill", "#21908dff");

        svg.append('g')
            .selectAll("dot")
            .data(this.setosaClass)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); })
            .attr("cy", function (d) { return y(d[1]); })
            .attr("r", 3)
            .style("fill", "#CC0000");

        svg.append('g')
            .selectAll("dot")
            .data(this.versicolorClass)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[0]); })
            .attr("cy", function (d) { return y(d[1]); })
            .attr("r", 3)
            .style("fill", "#fde725ff");

        for (var i = 0; i < lines.length; i++) {
            // console.log("***", lines[i]);
            svg.append("path")
                .datum(lines[i])
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) { return x(d["x"]) })
                    .y(function (d) { return y(d["y"]) })
                )
        }
    }
    run() {
        d3.select(".classify").on("click", () => {
            this.reset();
            this.prepare();
            this.classify();
        });

        d3.select(".reset").on("click", () => {
            this.reset();
            window.location.reload();
        });
    }
}

let lda = new LDA();
lda.run();
