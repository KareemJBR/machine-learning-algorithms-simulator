const minHeight = 430;
const WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 40;
const HEIGHT = minHeight - 30;
const DURATION = 500;

const svg = d3.select(".kmeans")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .on("click", () => {
        d3.event.preventDefault();
        kmeans.step();
    });

const lineg = svg.append('g');
const dotg = svg.append('g');
const centerg = svg.append('g');

class Coord {
    constructor(x = Math.random() * WIDTH, y = Math.random() * HEIGHT) {
        this.x = x;
        this.y = y;
    }
}

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

class Dot extends Coord {
    constructor() {
        super();
        this.group = undefined;
        this.init = new Coord(this.x, this.y);
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
        this.groups = [];
        this.dots = [];
        this.flag = false;
        this.k = 5;
        this.n = 100;

        // event listeners
        this.onChangeN();
        this.onChangeK();
        this.prepare();
    }

    prepare() {
        console.log(`N=${this.n}, K=${this.k}`)
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
        this.flag = false;
        this.prepare();
    }

    draw() {
        new CircleDrawer(this.dots).draw();
        const lineDrawer = new LineDrawer(this.dots);
        if (this.dots[0].group) {
            lineDrawer.draw();
        } else {
            lineDrawer.clear();
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

    setN(n) {
        this.n = n;
    }

    onChangeN() {
        document.querySelector('#n').addEventListener('change', e => {
            this.setN(e.target.value);
            document.querySelector('#n-pl').innerHTML = e.target.value;

        })
    }
    onChangeK() {
        document.querySelector('#k').addEventListener('change', e => {
            this.setK(e.target.value);
            document.querySelector('#k-pl').innerHTML = e.target.value;
        })
    }

    run() {
        d3.select(".step").on("click", () => {
            this.step();
            this.draw();
        });

        d3.select(".restart").on("click", () => {
            this.restart();
            this.draw();
        });
        d3.select(".reset").on("click", () => {
            this.reset();
            this.draw();
        });
        this.draw();
    }
}

let kmeans = new KMeans();
kmeans.run();
