let k = 1;
let num_of_classes = 4;
const num_of_points = 40;
const window_width = 800;
const window_height = 600;

let train_x = [], train_y = [];
let train_classes = [];
let pointsCanvas = document.getElementById('points_canvas');
let ctx = pointsCanvas.getContext('2d');

function getRndInteger(min, max){
  return Math.floor(Math.random() * (max - min) ) + min;
}

function init_points(){
    let i, j, current_random_x = -1;
    let succeeded = true;
    let current_random_y = -1;
    for(i =0;i < num_of_points;i++){
        succeeded=true;
        current_random_x = getRndInteger(0, window_width);
        current_random_y = getRndInteger(0, window_height);
        for(j=0;j<train_x.length;j++){
            if(train_x[j].equals(current_random_x) && train_y.equals(current_random_y)){
                i--;
                succeeded=false;
            }
        }
        if(succeeded){
            train_x.push(current_random_x);
            train_y.push(current_random_y);
        }
    }

    for(i=0;i<num_of_points;i++){
        if(i<num_of_points/4)
            train_classes.push(1);
        else if(i<num_of_points/2)
            train_classes.push(2);
        else if(i<num_of_points*3/4)
            train_classes.push(3);
        else
            train_classes.push(4);
    }

}

function submit_to_server(){
    const dict_values = {
        train_x,
        train_y,
        train_classes,
        k,
        num_of_classes,
        window_width,
        window_height
    }

    const results = JSON.stringify(dict_values);

    $.ajax({
        url: '/knn',
        type: 'POST',
        contentType: 'application/JSON',
        data: JSON.stringify(results)
    });
}

function main(){
    init_points();
    submit_to_server();
}