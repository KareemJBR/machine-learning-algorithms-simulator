class Circle {
    constructor(cx, cy, radius = 5, type = 'None', color = 'grey') {
        this.cy = cy
        this.cx = cx
        this.radius = radius
        this.type = type
        this.color = color
    }
    setType(type) {
        this.type = type
    }
    setColor(color) {
        this.color = color
    }
    calculateDistanceToNeighbor(n) {
        return Math.sqrt(Math.pow((n.cx - this.cx), 2) + Math.pow((n.cy - this.cy), 2))
    }
}

class KNN {
    constructor(k = 1, types) {
        this.k = k
        this.types = types
        this.circle = null
        this.closestNeighbors = null
    }
    classifyCircleType() {
        return this.determineCircleTypeByDistance(this.closestNeighbors)
    }
    determineCircleTypeByDistance(neighbors) {
        return _.chain(neighbors.map(n => n.type))
            .countBy().pairs().max(_.last).head().value()
    }
    getKBoundingCircle() {
        if (this.circle) {
            const radius = this.closestNeighbors[this.k - 1].distance + this.closestNeighbors[this.k - 1].radius
            return new Circle(this.circle.cx, this.circle.cy, radius, 'None', 'transparent')

        }
    }
    getKConnectingLines() {
        // create color scale from grey to white, depending on inverse distance from new circle
        // if there is no inverseDistance, set the domain maximum to 100
        const colorScaleWeighted = d3.scaleLinear()
            .domain([0, this.closestNeighbors[0].inverseDistance || 100])
            .range(['rgba(186, 186, 186, 0.4)', '#f20e80'])
        //const colorScale = d3.scaleOrdinal().domain(this.types).range(['rgba(102, 34, 170, 0.6)','rgba(23, 196, 109, 0.3)'])
        return this.closestNeighbors.map(n => {
            const strokeWidth = this.weighted ? n.inverseDistance * 100 : 2
            const stroke = this.weighted ? colorScaleWeighted(n.inverseDistance) : 'rgba(230,230,230,0.5)'
            return {
                x1: n.cx,
                x2: this.circle.cx,
                y1: n.cy,
                y2: this.circle.cy,
                strokeWidth: strokeWidth,
                stroke: stroke
            }
        })
    }
    findKClosestNeighbors(neighbors, k) {
        return neighbors.filter((n, i) => i < k)
    }
    getNeighborsSortedByDistanceAsc(neighbors) {
        return neighbors.filter(n => n != this.circle) // filter out circle that was added by clicking
            .map(n => {
                n.distance = n.calculateDistanceToNeighbor(this.circle)
                return n
            })
            .sort((a, b) => this.compareDistance(a, b))
    }
    compareDistance(a, b) {
        if (a.distance < b.distance) {
            return -1
        } else if (a.distance > b.distance) {
            return 1
        }
        return 0
    }
    setCircle(circle) {
        this.circle = circle
    }
    setClosestNeighbors(neighbors) {
        this.closestNeighbors = this.findKClosestNeighbors(this.getNeighborsSortedByDistanceAsc(neighbors), this.k)
        if (this.weighted) {
            this.closestNeighbors = this.closestNeighbors.map(n => {
                n.inverseDistance = 1 / n.distance
                return n
            })
        }
    }
    setK(k) {
        this.k = k
    }
}

class KNNVisualization {
    constructor(width = 500, height = 300, amountOfCircles = 10, types = ['A', 'B', 'None']) {
        this.width = width;
        this.height = height;
        this.amountOfCircles = amountOfCircles;
        this.types = types;

        // colors
        this.visColors = { purple: '#663399', green: '#66cc99', white: 'white' }
        this.colorMap = this.createColorMap();
        // random initial circle positions
        this.ellipsoids = {
            [this.types[0]]: {
                width: this.width / 3,
                height: this.height / 3,
                cx: this.width / 3,
                cy: this.height / 3
            },
            [this.types[1]]: {
                width: this.width / 2.5,
                height: this.height / 3,
                cx: this.width / 3 * 2,
                cy: this.height / 3 * 2
            }
        }
        this.circles = Array.apply(null, Array(this.amountOfCircles)).map(el => this.createCircle())
        this.chart = d3.select(".knn")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
        this.clickable = true;

        // event listeners
        this.onChangeK();
        this.onChangeN();
        this.onClickSVG();

        // KNN setup
        this.knn = new KNN(document.querySelector('#k').value, this.types)
    }
    createCircle(x = undefined, y = undefined) {
        if (!x && !y) {
            const type = Math.random() > 0.5 ? this.types[0] : this.types[1]
            const coord = this.calculateRandomCoordinates(
                this.ellipsoids[type].width,
                this.ellipsoids[type].height,
                this.ellipsoids[type].cx,
                this.ellipsoids[type].cy
            )
            const color = this.colorMap[type]
            return new Circle(coord.x, coord.y, 5, type, color)
        }
        return new Circle(x, y)
    }
    calculateRandomCoordinates(width, height, cx, cy) {
        const rho = Math.sqrt(Math.random())
        const phi = Math.random() * Math.PI * 2
        const rands = { x: _.random(-width / 2, width / 2), y: _.random(-height / 2, height / 2) }
        const x = (rho * Math.cos(phi) * width / 2) + cx + rands.x
        const y = (rho * Math.sin(phi) * height / 2) + cy + rands.y
        return { x, y }
    }
    addCircle(e) {
        if (e.target && e.target.classList.contains('knn')) {
            const dim = e.target.getBoundingClientRect();
            const coord = [e.clientX - dim.left, e.clientY - dim.top]
            const circle = this.createCircle(coord[0], coord[1])
            console.log("circle", circle)
            this.circles.push(circle)

            this.knn.setCircle(circle)
            this.knn.setClosestNeighbors(this.circles)
            // get bounding circle around k neighbors for visualization purposes
            const kBoundingCircle = this.knn.getKBoundingCircle()
            this.circles.push(kBoundingCircle)
            // let KNN classify circle type
            const type = this.knn.classifyCircleType()
            circle.setType(type)
            circle.setColor(this.colorMap[type])

            // draw connecting lines between circle and k closest neighbors
            // reverse the array, so that the longest lines are drawn first and we can see the shortest lines better
            const kConnectingLines = this.knn.getKConnectingLines().reverse()
            this.drawKConnectingLines(kConnectingLines)

            // update maximum of range input
            this.setKRangeMax(this.circles.length - 1)

            // draw new circle and bounding circle around k neighbors
            this.drawKNN()
        }
    }
    drawKConnectingLines(kConnectingLines) {
        this.chart.selectAll('line')
            .data(kConnectingLines)
            .enter().append("line")
            .style("stroke", function (d) { return d.stroke })
            .attr("stroke-width", function (d) { return d.strokeWidth })
            .attr("x1", function (d) { return d.x1 })
            .attr("y1", function (d) { return d.y1 })
            .attr("x2", function (d) { return d.x2 })
            .attr("y2", function (d) { return d.y2 })
            .attr('class', 'remove')
    }
    drawKNN() {
        this.chart.selectAll("circle")
            .data(this.circles)
            .enter().append("circle")
            .style("stroke", 'white')
            .style("fill", function (d) { return d.type == 'None' ? 'rgba(190,190,190,0.1)' : 'grey' })
            .attr("r", function (d) { return d.radius })
            .attr("cx", function (d) { return d.cx })
            .attr("cy", function (d) { return d.cy })
            .attr('class', function (d) { return d.type == 'None' ? 'remove' : '' })
            .transition().duration(1500)
            .style('fill', function (d) { return d.color })
            .style('stroke', function (d) { return d.type == 'None' ? 'transparent' : 'black' })

        this.removeBoundingCircleAndConnectingLines()
    }
    removeBoundingCircleAndConnectingLines() {
        this.circles = this.circles.filter(c => c.type != 'None')
        this.clickable = false // ensure user can't click on svg again before bounding circle and lines are removed
        const that = this
        that.chart.selectAll('.remove')
            .transition().duration(2000)
            .style('stroke', 'transparent')
            .style('fill', 'transparent')
            .on('end', function () {
                that.chart.selectAll('.remove').remove()
                that.clickable = true
            })
    }
    appendCircles() {
        this.chart.selectAll("circle")
            .data(this.circles)
            .enter().append("circle")
            .style("stroke", "black")
            .style("fill", function (d) { return d.color })
            .attr("r", function (d) { return d.radius })
            .attr("cx", function (d) { return d.cx })
            .attr("cy", function (d) { return d.cy })
    }
    removeCircles() {
        this.chart.selectAll("circle")
            .data(this.circles)
            .exit().remove()
    }
    createColorMap() {
        return {
            [this.types[0]]: this.visColors.purple,
            [this.types[1]]: this.visColors.green,
            [this.types[2]]: 'grey'
        }
    }
    setKRangeValue(val) {
        document.querySelector('#k').value = val
        document.querySelector('#k-pl').innerHTML = val
    }
    setKRangeMax(max) {
        document.querySelector('#k').max = max
    }
    onChangeK() {
        document.querySelector('#k').addEventListener('change', e => {
            this.knn.setK(e.target.value)
            document.querySelector('#k-pl').innerHTML = e.target.value
        })
    }
    onChangeN() {
        document.querySelector('#n').addEventListener('change', e => {
            document.querySelector('#n-pl').innerHTML = e.target.value
            // create new circles: n - amountOfCircles, if negative -> remove circles
            const amountToChange = parseInt(e.target.value) - this.amountOfCircles
            if (amountToChange > 0) { // add circles
                this.increaseAmountOfCircles(amountToChange)
            } else {
                this.reduceAmountOfCircles(amountToChange)
            }
        })
    }
    onClickSVG() {
        console.log("document.querySelector('.knn')", document.querySelector('.knn'))
        document.querySelector('.knn').addEventListener('click', (e) => { if (this.clickable) { this.addCircle(e) } })
    }
    increaseAmountOfCircles(amountToChange) {
        const newCircles = Array.apply(null, Array(amountToChange)).map(el => this.createCircle());
        this.circles.push(...newCircles);
        this.amountOfCircles = this.circles.length;

        this.setKRangeMax(this.amountOfCircles);
        this.appendCircles();
    }
    reduceAmountOfCircles(amountToChange) {
        this.circles.splice(amountToChange);
        this.amountOfCircles = this.circles.length;
        if (this.knn.k > this.amountOfCircles) {
            this.knn.setK(this.amountOfCircles);
        }
        this.setKRangeMax(this.amountOfCircles);
        this.setKRangeValue(this.amountOfCircles);
        this.removeCircles();
    }
}

const minHeight = 350;
const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 40;
const height = minHeight - 30;
const amountOfCircles = 10;
const knnVis = new KNNVisualization(width, height, amountOfCircles);
knnVis.appendCircles();
