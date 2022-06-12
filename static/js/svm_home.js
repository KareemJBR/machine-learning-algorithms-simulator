
function SVM(X, y, C, tolerance, max_passes, gamma) {
    // Performs the SVM algorithm to determine Lagrange Multipliers for a SVM

    let n = X.length, // Size of Data
        a = [],          // Lagrange Multipliers
        E = [],			 // Expected Values
        b = 0.0,	     // Threshold
        passes = 0,		 // Current Passes
        num_changed_alphas = 0;

    //initialize lagrange multipliers
    for (let i = n - 1; i >= 0; i--) {
        a[i] = 0.0;
        E[i] = 0.0;
    }

    while (passes < max_passes) {
        num_changed_alphas = 0;

        //Calculate Ei = f(x_i) - y_i
        for (let i = n - 1; i >= 0; i--) {

            E[i] = b - y[i];
            for (let j = n - 1; j >= 0; j--) {
                E[i] += (y[j] * a[j] * RBF(X[i], X[j], gamma));
            }

            if ((y[i] * E[i] < -tolerance && a[i] < C) || (y[i] * E[i] > tolerance && a[i] > 0)) {
                //Select j != i Randomly

                do {
                    j = Math.floor(Math.random() * n);
                }
                while (j === i);

                //Calculate Ej = f(x_j) - y_j
                E[j] = b - y[j];
                for (let k = n - 1; k >= 0; k--) {
                    E[j] += (y[k] * a[k] *
                        RBF(X[j], X[k], gamma));
                }

                let alpha_old_i = a[i],
                    alpha_old_j = a[j];

                //Compute L and H by 10 or 11
                if (y[i] !== y[j]) {
                    let L = Math.max(0, a[j] - a[i]);
                    let H = Math.min(C, C + a[j] - a[i]);
                }
                else {
                    let L = Math.max(0, a[i] + a[j] - C);
                    let H = Math.min(C, a[j] + a[i]);
                }

                if (L === H) {
                    continue;
                }

                //Compute nen by 14
                let nen = 2 * RBF(X[i], X[j], gamma) -
                    RBF(X[i], X[i], gamma) -
                    RBF(X[j], X[j], gamma);

                if (nen >= 0) {
                    continue;
                }

                //Compute and clip new value for aj using 12 and 15
                a[j] = a[j] - ((y[j] * (E[i] - E[j])) / nen);

                //Clip aj to fall in range
                if (a[j] > H) {
                    a[j] = H;
                }
                else if (a[j] < L) {
                    a[j] = L;
                }

                //Check Change
                if (Math.abs(a[j] - alpha_old_j) < 10e-5) {
                    continue;
                }
                //Compute value for ai using 16
                a[i] = a[i] + (y[i] * y[j] * (alpha_old_j - a[j]));


                //Compute b1 and b2 with 17 and 18
                let b1 = b - E[i] - y[i] * (a[i] - alpha_old_i) *
                    RBF(X[i], X[i], gamma) - y[j] *
                    (a[j] - alpha_old_j) * RBF(X[i], X[j], gamma);

                let b2 = b - E[j] - y[i] * (a[i] - alpha_old_i) *
                    RBF(X[i], X[j], gamma) - y[j] *
                    (a[j] - alpha_old_j) * RBF(X[j], X[j], gamma);

                //Compute b by 19
                if ((a[i] > 0) && (a[i] < C)) {
                    b = b1;
                }
                else if ((a[j] > 0) && (a[j] < C)) {
                    b = b2;
                }
                else {
                    b = (b1 + b2) / 2;
                }
                num_changed_alphas += 1;
            }
        }
        if (num_changed_alphas === 0) {
            passes += 1;
        }
        else {
            passes = 0;
        }
    }

    let w = [[]];
    for (let i = X[0].length - 1; i >= 0; i--) {
        w[0][i] = 0;
    }
    for (let i = n - 1; i >= 0; i--) {
        for (let j = X[0].length - 1; j >= 0; j--) {
            w[0][j] += a[i] * X[i][j] * y[i];
        }
    }
    return { 'w': w, 'b': b };
}

function RBF(a, b, gamma) {
    let d = 0.0;

    for (let i = a.length - 1; i >= 0; i--) {
        d += a[i] * b[i]
    }
    return d;
}

let margin = { top: 80, right: 180, bottom: 80, left: 180 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select(".svm").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let y = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

let x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width])

let xAxis = d3.axisBottom().scale(x);

let yAxis = d3.axisLeft().scale(y);

let line = d3.line()
    .x(function (d) { return x(d.x); })
    .y(function (d) { return y(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);


const data = [{ "x": 1.3918159586, "y": 2.3137462987, "c": -1 }, { "x": 2.7553492977, "y": 3.8358933062, "c": -1 }, { "x": 1.3068825052, "y": 1.562141254, "c": -1 }, { "x": 2.8944226465, "y": 2.5841533943, "c": -1 }, { "x": 3.7024428812, "y": 2.7501198675, "c": -1 }, { "x": 3.5026863304, "y": 4.1441852379, "c": -1 }, { "x": 1.2875267989, "y": 1.6449839313, "c": -1 }, { "x": 1.5512224368, "y": 3.479681808, "c": -1 }, { "x": 2.4134867529, "y": 4.2236237896, "c": -1 }, { "x": 3.6559341255, "y": 1.9783436371, "c": -1 }, { "x": 3.6559341255, "y": 0.9783436371, "c": -1 }, { "x": 3.6559341255, "y": 4.9783436371, "c": -1 }, { "x": 6.9659900849, "y": 5.3009901301, "c": 1.0 }, { "x": 9.0119210614, "y": 7.702946096, "c": 1.0 }, { "x": 5.950966712, "y": 7.2311001543, "c": 1.0 }, { "x": 5.979236673, "y": 7.7339372771, "c": 1.0 }, { "x": 5.955605886, "y": 6.8574976596, "c": 1.0 }, { "x": 5.955605886, "y": 5.8574976596, "c": 1.0 }, { "x": 7.8664572356, "y": 6.3242365141, "c": 1.0 }, { "x": 5.2714950518, "y": 6.744864841, "c": 1.0 }, { "x": 7.0457948624, "y": 8.2216029477, "c": 1.0 }, { "x": 8.3580121873, "y": 7.1820232618, "c": 1.0 }, { "x": 9.6273291291, "y": 7.0579781464, "c": 1.0 }, { "x": 8.6273291291, "y": 6.0579781464, "c": 1.0 }, { "x": 1.5512224368, "y": 4.479681808, "c": -1 }, { "x": 4.2333333333333325, "y": 5.705882352941176, "c": 1 }]


class SVMVisualization {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.c = 1;
        this.pointColor = 1;
        this.clickable = true;
        this.initialDots = data;

        // event listeners
        this.onChangeC();
        this.onChangeColor();

    }

    addDot(dot) {
        this.initialDots.push(dot);
        svm.appendInitialDots();
    }

    onChangeC() {
        document.querySelector('#c').addEventListener('change', e => {
            this.setC(e.target.value);
            document.querySelector('#c-pl').innerHTML = e.target.value;
        })
    }
    onChangeColor() {
        document.getElementById('dotColor').addEventListener('change', (e) => {
            this.pointColor = parseInt(e.target.value);
        });
    }

    setC(c) {
        this.c = c;
    }

    visualize() {
        let X = [],
            Y = [];

        for (let i = this.initialDots.length - 1; i >= 0; i--) {
            X[i] = [+this.initialDots[i].x, +this.initialDots[i].y];
            Y[i] = +this.initialDots[i].c;
        }
        console.log("X", X)
        console.log("Y", Y)


        let V = SVM(X, Y, this.c, 0.000001, 30, -1);
        let w = V.w[0],
            b = V.b;

        let decision = [];
        for (let i = 0; i < 1000; i++) {
            decision[i] = { 'x': i / 100, 'y': (-w[0] / w[1]) * (i / 100) - (b / w[1]) };
        }
        let pg = [];
        for (let i = 0; i < 1000; i++) {
            pg[i] = { 'x': i / 100, 'y': (-w[0] / w[1]) * (i / 100) - ((1 + b) / w[1]) };
        }


        let ng = [];
        for (let i = 0; i < 1000; i++) {
            ng[i] = { 'x': i / 100, 'y': (-w[0] / w[1]) * (i / 100) - ((-1 + b) / w[1]) };
        }


        // Add the line
        svg.append("path")
            .datum(decision)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d["x"]) })
                .y(function (d) { return y(d["y"]) })
            )

        // Add the line
        svg.append("path")
            .datum(pg)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d["x"]) })
                .y(function (d) { return y(d["y"]) })
            ).style("stroke-dasharray", ("3, 3"))

        // Add the line
        svg.append("path")
            .datum(ng)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d["x"]) })
                .y(function (d) { return y(d["y"]) })
            ).style("stroke-dasharray", ("3, 3"))
    }
    reload() {
        window.location.reload();
    };

    reset() {
        svg.selectAll("path").remove();
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    appendInitialDots() {
        svg.selectAll(".dot")
            .data(this.initialDots)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 5.5)
            .attr("cx", function (d) {
                return x(+d.x);
            })
            .attr("cy", function (d) {
                return y(+d.y)
            })
            .style("fill", function (d) {
                if (d.c === 1) {
                    return "#377eb8";
                } else {
                    return "#e41a1c";
                }
            })
            .style("stroke-width", 2)
    }

    run() {
        d3.select("svg").on('click', () => {
            const xx = x.invert(d3.event.pageX);
            const newXX = xx - 7.9;
            const yy = y.invert(d3.event.pageY);
            const newYY = yy + 10;
            if (newXX >= 0 && newYY >= 0 && newXX <= 10 && newYY <= 10) {
                let circle = { "x": newXX, "y": newYY, "c": this.pointColor }
                this.addDot(circle);
            }
        })
        d3.select(".classify").on("click", () => {
            this.reset();
            this.visualize();
        });
        d3.select(".reset").on("click", () => {
            this.reload();
        });
    }
}

let svm = new SVMVisualization();
svm.appendInitialDots();
svm.run();
