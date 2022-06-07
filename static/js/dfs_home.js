const red = '#F44336';
const blue = '#2196F3';
const yellow = '#FFEB3B';
const green = '#4CAF50';
const pink = '#E91E63';
const black = '#000';
const grey = '#9E9E9E';
const amber = '#FFC107';

const gridSizeX = 11;
const gridSizeY = 11;
const nodeSize = 1;
const nodeColor = grey;

const startNodeColor = blue;
const startNodeX = Math.floor((Math.random() * 10) + 1);
const startNodeY = Math.floor((Math.random() * 10) + 1);
const stopNodeX = Math.floor((Math.random() * 10) + 1);
const stopNodeY = Math.floor((Math.random() * 10) + 1);
const stopNodeColor = red;
let timestep = 50;  // changes with select
const exploredNodeColor = black;
const frontierNodeColor = amber;
const pathColor = pink;

const neighborDirections = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function positionToId(x, y) {
    return `${x}_${y}`;
}

const startNodeId = positionToId(startNodeX, startNodeY);
const stopNodeId = positionToId(stopNodeX, stopNodeY);

function createGraph(s) {
    s.graph.clear();
    for (let x = 0; x < gridSizeX; x++) {
        for (let y = 0; y < gridSizeY; y++) {
            let id = positionToId(x, y);
            s.graph.addNode({ id, x, y, size: nodeSize, color: nodeColor, outEdgeIds: [] });
        }
    }

    for (let x = 0; x < gridSizeX; x++) {
        for (let y = 0; y < gridSizeY; y++) {
            let id = `${x}_${y}`;
            let neighbors = neighborDirections
                .map((dir) => {
                    return [x + dir[0], y + dir[1]];
                })
                .filter((n) => {
                    if (n[0] < 0 || n[0] >= gridSizeX || n[1] < 0 || n[1] >= gridSizeY) {
                        return false;
                    }
                    return true;
                });

            neighbors.forEach((neighbor) => {
                let nId = positionToId(neighbor[0], neighbor[1]);
                let eId = positionToId(id, nId);
                s.graph.addEdge({
                    id: eId,
                    source: id,
                    target: nId,
                    weight: 210,
                    //color: red,
                });
            });
        }
    }

    s.graph.edges().forEach((edge) => {
        let source = s.graph.nodes(edge.source);
        let target = s.graph.nodes(edge.target);
        let maxX = Math.max(source.x, target.x);
        let maxY = Math.max(source.y, target.y);
        let minX = Math.min(source.x, target.x);
        let minY = Math.min(source.y, target.y);
        if (maxX <= 1 || maxY <= 1) {
            edge.weight = 1;
            //edge.color = black;
        } else if (maxX <= 2 || maxY <= 2) {
            edge.weight = 2;
            //edge.color = blue;
        } else if (maxX <= 3 || maxY <= 3) {
            edge.weight = 6;
            //edge.color = yellow;
        } else if (maxX <= 4 || maxY <= 4) {
            edge.weight = 30;
            //edge.color = green;
        }
        if (minX >= 9 || minY >= 9) {
            edge.weight = 1;
            //edge.color = black;
        } else if ((minX >= 2 && minX <= 8 && minY >= 8) || (minY >= 2 && minY <= 8 && minX >= 8)) {
            edge.weight = 2;
            //edge.color = blue;
        } else if ((minX >= 3 && minX <= 7 && minY >= 7) || (minY >= 3 && minY <= 7 && minX >= 7)) {
            edge.weight = 6;
            //edge.color = yellow;
        } else if ((minX >= 4 && minX <= 6 && minY >= 6) || (minY >= 4 && minY <= 6 && minX >= 6)) {
            edge.weight = 30;
            //edge.color = green;
        }
    });

    for (let x = 0; x < gridSizeX - 1; x++) {
        let id1 = positionToId(x, 0);
        let id2 = positionToId(x + 1, 0);
        let e1 = positionToId(id1, id2);
        let e2 = positionToId(id2, id1);
        s.graph.dropEdge(e1).dropEdge(e2);
        id1 = positionToId(x, gridSizeY - 1);
        id2 = positionToId(x + 1, gridSizeY - 1);
        e1 = positionToId(id1, id2);
        e2 = positionToId(id2, id1);
        s.graph.dropEdge(e1).dropEdge(e2);
    }

    for (let y = 0; y < gridSizeY - 1; y++) {
        let id1 = positionToId(0, y);
        let id2 = positionToId(0, y + 1);
        let e1 = positionToId(id1, id2);
        let e2 = positionToId(id2, id1);
        s.graph.dropEdge(e1).dropEdge(e2);
        id1 = positionToId(gridSizeX - 1, y);
        id2 = positionToId(gridSizeX - 1, y + 1);
        e1 = positionToId(id1, id2);
        e2 = positionToId(id2, id1);
        s.graph.dropEdge(e1).dropEdge(e2);
    }

    s.graph
        .dropNode(positionToId(0, 0))
        .dropNode(positionToId(0, gridSizeY - 1))
        .dropNode(positionToId(gridSizeX - 1, 0))
        .dropNode(positionToId(gridSizeX - 1, gridSizeY - 1));

    s.graph.edges().forEach((edge) => {
        s.graph.nodes(edge.source).outEdgeIds.push(edge.id);
    });

    s.graph.nodes(startNodeId).color = startNodeColor;
    s.graph.nodes(stopNodeId).color = stopNodeColor;
    s.refresh();
}

function drawExplored(s, explored) {
    for (let id of explored) {
        let node = s.graph.nodes(id);
        node.color = exploredNodeColor;
        delete node['label'];
    }
    s.graph.nodes(startNodeId).color = startNodeColor;
    s.graph.nodes(stopNodeId).color = stopNodeColor;
}

function drawFrontier(s, obj, i, label = false) {
    obj.forEach((frame) => {
        let node = frame[i];
        node.color = frontierNodeColor;
        if (label) {
            node.label = JSON.stringify(frame[0]);
        }
    });
}

function drawPath(s, path) {
    for (let i = 0; i < path.length - 1; i++) {
        let nodeId1 = path[i];
        let nodeId2 = path[i + 1];
        let edgeId = positionToId(nodeId1, nodeId2);
        let edge = s.graph.edges(edgeId);
        edge.color = pathColor;
    }
}

function clearNodeColors(s) {
    s.graph.nodes().forEach((node) => {
        node.color = nodeColor;
    });
}

function union(set1, set2) {
    let union = new Set(set1);
    for (let elem of set2) {
        union.add(elem);
    }
    return union;
}

function pqCompare(a, b) {
    if (a[0] < b[0]) {
        return 1;
    } if (a[0] > b[0]) {
        return -1;
    }
    return 0;
}

function pqReplaceOrAppend(pq, id, nodeIndex, valueIndex, replacement) {
    let arr = pq.toArray();
    let index = null;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][nodeIndex].id === id) {
            index = i;
            break;
        }
    }
    if (index !== null) {
        if (arr[index][valueIndex] > replacement[valueIndex]) {
            arr[index] = replacement;
            pq.clear();
            arr.forEach((item) => {
                pq.enqueue(item);
            });
        }
    } else {
        pq.enqueue(replacement);
    }
}

function pathCost(s, path) {
    let cost = 0.0;
    for (let i = 0; i < path.length - 1; i++) {
        let nodeId1 = path[i];
        let nodeId2 = path[i + 1];
        let edgeId = positionToId(nodeId1, nodeId2);
        let edge = s.graph.edges(edgeId);
        cost += edge.weight;
    }
    return { cost, length: path.length };
}

function l1Distance(node1, node2) {
    return Math.abs(node2.x - node1.x) + Math.abs(node2.y - node1.y);
}

function dfsStep(s, stack, explored, stopId, callback) {
    let frame = stack.pop();
    let node = frame[0];
    let path = frame[1];
    let alreadyExplored = explored.has(node.id);
    explored.add(node.id);

    if (node.id == stopId) {
        return callback({ path, explored, frontier: stack });
    }

    for (let i = node.outEdgeIds.length - 1; i >= 0; i--) {
        let edge = s.graph.edges(node.outEdgeIds[i]);
        let targetNode = s.graph.nodes(edge.target);
        let newPath = path.concat([edge.target]);

        if (!explored.has(targetNode.id)) {
            stack.push([targetNode, newPath]);
        }
    }

    drawFrontier(s, stack, 0);
    drawExplored(s, explored);
    s.refresh();

    if (stack.length > 0) {
        setTimeout(() => dfsStep(s, stack, explored, stopId, callback), timestep);
    }
}

function dfsAndDraw(s, start, stop, callback) {
    let startNode = s.graph.nodes(start);
    let stopNode = s.graph.nodes(stop);

    let explored = new Set();
    let stack = [[startNode, [start]]];
    dfsStep(s, stack, explored, stop, callback);
}

function displayResults(id, cost, explored, frontier) {
    document.getElementById(id + 'Cost').innerText = `Path Cost: ${cost.cost}`;
    document.getElementById(id + 'Length').innerText = `Path Length: ${cost.length}`;
    document.getElementById(id + 'Explored').innerText = `Explored Nodes: ${explored.size}`;
    document.getElementById(id + 'Frontier').innerText = `Frontier Nodes: ${frontier.length}`;
}

const algorithms = [['dfs', 0, false, dfsAndDraw]];

let sigmas = [];

function run() {
    sigmas.forEach((s) => {
        s.kill();
    });
    sigmas = [];

    setTimeout(() => {
        algorithms.forEach((item) => {
            let s = new sigma();
            s.addRenderer({
                type: 'canvas',
                container: item[0]
            });
            s.settings({
                edgeColor: 'default',
                defaultEdgeColor: 'transparent',
                zoomMin: 1.0,
                zoomMax: 1.0,
                mouseWheelEnabled: false,
                sideMargin: 1.05,
            });
            sigmas.push(s);

            createGraph(s);
            item[3](s, startNodeId, stopNodeId, (result) => {
                clearNodeColors(s);
                drawFrontier(s, result.frontier, item[1], item[2]);
                drawExplored(s, result.explored);
                drawPath(s, result.path);
                s.refresh();
                let cost = pathCost(s, result.path);
                displayResults(`${item[0]}Results`, cost, result.explored, result.frontier);
            });

        });
    }, 0);
}

document.getElementById('selectTimestep').addEventListener('change', (e) => {
    timestep = parseInt(e.target.value);
});

document.getElementById('btnRun').addEventListener('click', () => {
    run();
});

document.getElementById('btnNew').addEventListener('click', () => {
    window.location.reload();
});

run();
