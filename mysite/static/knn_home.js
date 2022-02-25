let k = 1;
const num_of_points = 30;
const window_width = 800;
const window_height = 600;

let x_results = [], y_results = [];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function init_points(){
    document.getElementById('points_canvas');
    let i, j, current_random_x = -1;
    let succeeded = true;
    let current_random_y = -1;
    for(i =0;i < num_of_points;i++){
        succeeded=true;
        current_random_x = getRndInteger(0, window_width);
        current_random_y = getRndInteger(0, window_height);
        for(j=0;j<x_results.length;j++){
            if(x_results[j].equals(current_random_x) && y_results.equals(current_random_y)){
                i--;
                succeeded=false;
            }
        }
        if(succeeded){
            x_results.add(current_random_x);
            y_results.add(current_random_y);
        }
    }
}

function main(){
    init_points();
    // send points data to python
}