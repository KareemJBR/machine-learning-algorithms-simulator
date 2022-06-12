function main() {
    const HEIGHT = 600;
    const WIDTH = 800;
    let canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let ctx = canvas.getContext('2d');
    ctx.height = HEIGHT;
    ctx.width = WIDTH;

    let num_classes = 3;
    let num_points = 10;
    let metric = l2_distance;
    let k = 1;

    let state = {
        num_classes: 4,
        num_points: 40,
        cluster_std: 50,
        metric: l2_distance,
        k: 1,
        colors: [
            'red', 'blue', 'green', 'purple', 'orange',
        ],
        small_step: 3,
        big_step: 10,
    };

    function gen_points() {
        state.points = generate_cluster_points(ctx, state.num_classes, state.num_points, state.cluster_std);
    }
    gen_points();

    function redraw(speed) {
        let step = state.small_step;
        if (speed === 'fast') step = state.big_step;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        draw_boundaries(ctx, state, step);
        draw_points(ctx, state.points, state.colors);
    }
    redraw();

    // Handlers for metric buttons
    $('#l2-btn').click(function () {
        // state.metric = l2_distance;
        state.metric = l2_distance;
        redraw();
    });
    $('#l1-btn').click(function () {
        state.metric = l1_distance;
        redraw();
    });

    // Handlers for buttons that set K
    for (let k = 1; k <= 7; k++) {
        (function () {
            let kk = k;
            $('#k-' + k + '-btn').click(function () {
                $('#k-' + state.k + '-btn').removeClass("active");
                $(this).addClass("active");
                state.k = kk;
                redraw();
            });
        })();
    }

    // Handlers for buttons that set number of classes
    for (let c = 2; c <= 5; c++) {
        (function () {
            let cc = c;
            $('#num-cls-' + c + '-btn').click(function () {
                $('#num-cls-' + state.num_classes + '-btn').removeClass("active");
                $(this).addClass("active");
                state.num_classes = cc;
                gen_points();
                redraw();
            });
        })();
    }

    let num_points_choices = [20, 30, 40, 50, 60];
    for (let i = 0; i < num_points_choices.length; i++) {
        (function () {
            let num_points = num_points_choices[i];
            let s = '#num-pts-' + num_points + '-btn';
            console.log(s);
            $('#num-pts-' + num_points + '-btn').click(function () {
                $('#num-pts-' + state.num_points + '-btn').removeClass("active");
                $(this).addClass("active");
                state.num_points = num_points;
                gen_points();
                redraw();
            });
        })();
    }

    let dragging_point = null;
    $(canvas).mousedown(function (e) {
        let p = get_click_coords(canvas, e);
        let thresh = 10;
        let idx = null;
        let min_dist = 100000;
        for (let i = 0; i < state.num_points; i++) {
            let dx = (p[0] - state.points[i][0]);
            let dy = (p[1] - state.points[i][1]);
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < thresh && d < min_dist) {
                min_dist = d;
                idx = i;
            }
        }
        dragging_point = idx;
    });
    $(canvas).mousemove(function (e) {
        if (dragging_point === null) return;
        let p = get_click_coords(canvas, e);
        state.points[dragging_point][0] = p[0];
        state.points[dragging_point][1] = p[1];
        redraw('fast');
    });
    $(canvas).mouseup(function () {
        dragging_point = null;
        redraw();
    })

}


function get_click_coords(obj, e) {
    let offset = $(obj).offset();
    let cx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(offset.left);
    let cy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(offset.top) + 1;
    return [cx, cy];
}



function randn() {
    // Using Box-Muller transform
    let u = 1 - Math.random();
    let v = 1 - Math.random();
    let r = Math.sqrt(-2 * Math.log(u));
    let t = Math.cos(2 * Math.PI * v);
    return r * t;
}


function generate_uniform_points(ctx, num_classes, num_points) {
    // Returns a list of [x, y, class]
    let points = [];
    for (let i = 0; i < num_points; i++) {
        let x = ctx.width * Math.random();
        let y = ctx.height * Math.random();
        let c = Math.floor(num_classes * Math.random());
        points.push([x, y, c]);
    }
    return points;
}

function generate_cluster_points(ctx, num_classes, num_points, std) {
    // First generate random cluster centers
    let centers = [];
    for (let c = 0; c < num_classes; c++) {
        let x = ctx.width * Math.random();
        let y = ctx.height * Math.random();
        centers.push([x, y]);
    }

    // Now generate points near cluster centers
    let points = [];
    for (let i = 0; i < num_points; i++) {
        let c = Math.floor(num_classes * Math.random());
        let x = centers[c][0] + std * randn();
        let y = centers[c][1] + std * randn();
        points.push([x, y, c]);
    }
    return points;
}


function draw_points(ctx, points, colors) {
    for (let i = 0; i < points.length; i++) {
        let x = points[i][0];
        let y = points[i][1];
        let c = points[i][2];

        ctx.beginPath();
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = colors[c];
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}


function l2_distance(p1, p2) {
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
}


function l1_distance(p1, p2) {
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    return Math.abs(dx) + Math.abs(dy);
}



function find_neighbors(p, points, k, metric) {
    let dists = [];
    for (let i = 0; i < points.length; i++) {
        let dist = metric(p, points[i]);
        dists.push([dist, points[i]]);
    }
    dists.sort(function (a, b) { return a[0] - b[0] });
    let neighbors = [];
    for (let i = 0; i < k && i < dists.length; i++) {
        neighbors.push(dists[i][1]);
    }
    return neighbors;
}


function majority_vote(points, num_classes) {
    // Assume points is a list of the form [x, y, c]
    let votes = [];
    for (let c = 0; c < num_classes; c++) {
        votes.push(0);
    }
    for (let i = 0; i < points.length; i++) {
        votes[points[i][2]] += 1;
    }
    let max_votes = 0;
    let winner = null;
    for (let c = 0; c < num_classes; c++) {
        if (votes[c] === max_votes) {
            winner = null;
        } else if (votes[c] > max_votes) {
            max_votes = votes[c];
            winner = c;
        }
    }
    return winner;
}


function draw_boundaries(ctx, state, step) {
    let eps = 0;
    for (let x = step / 2; x < ctx.width; x += step) {
        for (let y = step / 2; y < ctx.height; y += step) {
            let neighbors = find_neighbors([x, y], state.points, state.k, state.metric);
            let c = majority_vote(neighbors, state.num_classes);

            if (c !== null) {
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = state.colors[c];
                ctx.fillRect(
                    x - step / 2 - eps,
                    y - step / 2 - eps,
                    step + 2 * eps,
                    step + 2 * eps);
            }
        }
    }
}

$(main);
