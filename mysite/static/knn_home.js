let k = 1;
const num_of_points = 30;
const window_width = 800;
const window_height = 600;

let train_x = [], train_y = [];
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
            train_x.add(current_random_x);
            train_y.add(current_random_y);
        }
    }
}

function submit_to_server(){
    // TODO: submit train data, width, height and k to the server then add the right colors to the canvas
}

function main(){
    init_points();
    submit_to_server();
}