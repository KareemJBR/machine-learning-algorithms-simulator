const minHeight = 430;
const WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 40;
const HEIGHT = minHeight - 30;
const DURATION = 500;

document.getElementById('x_point-pl').textContent = WIDTH;
document.getElementById('y_point-pl').textContent = HEIGHT;

document.getElementById('x-label').textContent = `X (0-${WIDTH}):`;
document.getElementById('y-label').textContent = `Y (0-${HEIGHT}):`;

document.getElementById('x_point').max = WIDTH;
document.getElementById('y_point').max = HEIGHT;

const svg = d3.select(".kmeans")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

var Y = d3.scaleLinear();
var X = d3.scaleLinear();

const lineg = svg.append('g');
const dotg = svg.append('g');
const centerg = svg.append('g');

class Group {
    constructor(hue) {
        this.dots = [];
        this.color = `hsl(${hue},100%,50%)`;
        this.init = { center: {} };
        this.center = new Coord();
        this.init.center = new Coord(this.center.x, this.center.y);
    }

    reset() {
        this.dots = [];
        this.center.x = this.init.center.x;
        this.center.y = this.init.center.y;
    }

    moveToCenter() {
        let dot_size = this.dots.length;
        if (dot_size === 0) {
            return;
        }

        let x = 0, y = 0;
        this.dots.forEach((dot) => {
            x += dot.x;
            y += dot.y;
        });
        this.center = new Coord(x / dot_size, y / dot_size);
    }
}

class Coord {
    constructor(x = Math.random() * WIDTH, y = Math.random() * HEIGHT) {
        this.x = x;
        this.y = y;
    }
}

class Dot extends Coord {
    constructor(x, y) {
        super();
        this.group = undefined;
        this.init = new Coord(x, y);
    }
    reset() {
        this.x = this.init.x;
        this.y = this.init.y;
        this.group = undefined;
    }
}

class UserDot extends Coord {
    constructor(x, y) {
        super();
        this.group = undefined;
        this.init = new Coord(x, y);
        this.x = x;
        this.y = y;
    }
    reset() {
        this.x = this.init.x;
        this.y = this.init.y;
        this.group = undefined;
    }
}

class LineDrawer {
    constructor(dots) {
        this.lines = lineg.selectAll('line').data(dots);
        this.duration = DURATION;
    }

    draw() {
        this.apply(this.lines.enter().append('line'));
        this.apply(this.lines.transition().duration(this.duration));
        this.lines.exit().remove();
    }

    apply(lines) {
        lines.attr('x1', (d) => {
            return d.x;
        }).attr('y1', (d) => {
            return d.y
        }).attr('x2', (d) => {
            return d.group.center.x;
        }).attr('y2', (d) => {
            return d.group.center.y;
        }).attr('stroke', (d) => {
            return d.group.color;
        });
    }

    clear() {
        lineg.selectAll('line').remove();
    }
}

class CircleDrawer {
    constructor(dots) {
        dotg.selectAll('circle').data(dots).enter().append('circle');
        this.circles = dotg.selectAll('circle').data(dots);
        this.duration = DURATION;
    }

    draw() {
        this.circles.exit().remove();
        this.circles.transition().duration(this.duration).attr('cx', (d) => {
            return d.x;
        }).attr('cy', (d) => {
            return d.y;
        }).attr('fill', (d) => {
            return d.group ? d.group.color : '#ffffff';
        }).attr('r', 5);
    }
}

class CenterDrawer {
    constructor(groups) {
        this.centers = centerg.selectAll('path').data(groups);
        this.color = '#aabbcc';
        this.duration = DURATION;
    }

    draw() {
        this.centers.exit().remove();
        this.apply(this.centers.enter().append('path').attr('d', d3.symbol().type(d3.symbolCross)).attr('stroke', this.color));
        this.apply(this.centers.transition().duration(this.duration));
    }

    apply(centers) {
        centers.attr('transform', (d) => {
            return `translate(${d.center.x}, ${d.center.y}) rotate(45)`;
        }).attr('fill', (d) => {
            return d.color;
        }).attr('stroke', this.color);
    }
}

class KMeans {
    constructor() {
        this.dots = [];
        this.userDots = [];
        this.groups = [];
        this.flag = false;
        this.k = 1;
        this.n = 0;
        this.x = 0;
        this.y = 0;
        this.started = false;
        this.firstRun = false;

        // event listeners
        this.onChangeX();
        this.onChangeY();
        this.onChangeK();
        this.prepare();
    }

    onChangeX() {
        document.querySelector('#x_point').addEventListener('change', e => {
            this.setX(e.target.value)
            document.querySelector('#x_point-pl').innerHTML = e.target.value;
        });
    };
    onChangeY() {
        document.querySelector('#y_point').addEventListener('change', e => {
            this.setY(e.target.value);
            document.querySelector('#y_point-pl').innerHTML = e.target.value;
        });
    };


    setX(x) {
        this.x = x;
    };

    setY(y) {
        this.y = y;
    };

    prepare() {
        _.times(this.k, (i) => {
            this.groups.push(new Group(i * 360 / this.k));
        });
        _.times(this.n, (i) => {
            this.dots.push(new Dot());
        });
    }

    step() {
        d3.select(".restart").attr("disabled", null);
        if (this.flag) {
            this.moveToCenter();
        } else {
            this.calculate();
        }
        this.draw();
        this.flag = !this.flag;
    }

    restart() {
        this.flag = false;
        d3.select(".restart").attr("disabled", "disabled");
        this.groups.forEach((g) => {
            g.reset();
        });
        this.dots.forEach((d) => {
            d.reset();
        });
    }

    reset() {
        this.groups = [];
        this.dots = [];
        this.userDots = [];
        this.flag = false;
        this.firstRun = false;
        this.prepare();
    }

    draw() {
        new CircleDrawer(this.dots).draw();
        const lineDrawer = new LineDrawer(this.dots);
        if (this.started) {
            if (this.dots[0].group) {
                lineDrawer.draw();
            } else {
                lineDrawer.clear();
            }
        }

        new CenterDrawer(this.groups).draw();
    }

    moveToCenter() {
        this.groups.forEach((group) => {
            group.moveToCenter();
        })
    }

    calculate() {
        this.groups.forEach((g) => {
            g.dots = [];
        });

        this.dots.forEach((dot) => {
            let min = Infinity;
            let group;
            this.groups.forEach((g) => {
                // https://en.wikipedia.org/wiki/K-means_clustering
                let distance = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2);
                if (distance < min) {
                    min = distance;
                    group = g;
                }
            });
            group.dots.push(dot);
            dot.group = group;
        });
    }

    setK(k) {
        this.k = k;
    }

    onChangeK() {
        document.querySelector('#k').addEventListener('change', e => {
            this.setK(e.target.value);
            document.querySelector('#k-pl').innerHTML = e.target.value;
        })
    }

    removeGroupFromDots() {
        let updatedDots = [];
        this.dots.forEach((dot) => {
            dot.group = undefined
            updatedDots.push(dot)
        });
        this.dots = updatedDots;

        let updatedGroups = [];
        this.groups.forEach((group) => {
            group.dots = [];
            updatedGroups.push(group);
        });
    }

    uploadPoints(points) {
        points.forEach((point) => {
            this.dots.push(new UserDot(point["x"], point["y"]));
            this.userDots.push(new UserDot(point["x"], point["y"]));
            new CircleDrawer(this.dots).draw();
        })
    }

    run() {
        d3.select(".add-point").on("click", () => {
            this.dots.push(new UserDot(this.x, this.y));
            this.userDots.push(new UserDot(this.x, this.y));
            new CircleDrawer(this.dots).draw();
        });

        d3.select(".step").on("click", () => {
            if (!this.firstRun) {
                this.restart();
                this.step();
                this.draw();
                this.firstRun = true;
            } else {
                if (this.userDots.length > 0) {
                    this.restart();
                    this.userDots = [];
                }
                this.step();
                this.draw();
            }
        });

        d3.select(".restart").on("click", () => {
            this.restart();
            this.draw();
        });

        d3.select(".reset").on("click", () => {
            this.reset();
            if (this.dots.length === 0) {
                const lineDrawer = new LineDrawer(this.dots);
                lineDrawer.clear();
            }
            this.draw();
        });
        d3.select(".update-clusters").on("click", () => {
            this.reset();
            this.started = false;
            const lineDrawer = new LineDrawer(this.dots);
            lineDrawer.clear();
            this.draw();
            this.started = true;
        });

        this.draw();
        this.started = true;
    }
}

let kmeans = new KMeans();
kmeans.run();

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
}

async function getPoints(e, form) {
    e.preventDefault();
    const formData = new FormData(form);
    await fetch(form.action, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data["points"]) {
                document.getElementById('error').textContent = "";
                kmeans.uploadPoints(data["points"])
            } else {
                document.getElementById('error').textContent = `${data["error"]}`;
            }
        })
};
