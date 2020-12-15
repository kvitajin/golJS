import * as path from 'path';
import * as os from 'os';
import { Worker } from 'worker_threads';
import { resolve } from 'path';

let data: number[][]=[];
let matrixSize=2;
const workers: Worker[] = [];


interface lineOfData{
    id :number;
    line: number[];
}
async function paralelRound(args:lineOfData){
    // return new Promise((resolve, reject =>{
    //     const worker = new Worker(path.resolve(__dirname, './worker.js'), {
    //         workerData:args,
    //     });
    //     worker.on('message', (msg) => {
    //         resolve(msg);
    //     });
    //
    //     worker.on('error', (err) => {
    //         reject(err);
    //     });
    // } );


    for (let i = 0; i < os.cpus().length; ++i) {
        let line:number[]=[];
        for (let j = 0; j< data[i].length;++j){
            line[j]=data[i][j];
        }
        const worker = new Worker(path.resolve(__dirname, './worker.js'), {
            workerData: {
                id: i,
                line: line
            },
        });

        worker.on('message', (msg) => {
            console.log(msg);
        });

        workers.push(worker);
    }







}

function surroundings(data: number[][], i:number, j:number){
    let counter=0;
    for (let k=i-1;k<i+2; ++k){
        for (let l=j-1; l<j+2; ++l){
            if (k >= 0 &&
                l >= 0 &&
                k < data.length &&
                l < data[0].length &&
                (!(k == i && l == j))){
                    if(data[k][l]==1){
                        ++counter;
                    }
            }
        }
    }
    return counter;

}







function round(data: number[][]) {
    let tmp: number[][]=[];
    for(let i = 0; i<data.length; ++i){
        tmp[i]=[];
    }
    for (let i=0; i<data.length; ++i){
        for (let j=0; j<data[i].length; ++j){
            let counter= surroundings(data, i, j);
            if (data[i][j] && counter<2 ){
                tmp[i].push(0);
            }
            else if (data[i][j] && (counter == 2 || counter == 3 )){
                tmp[i].push(1);
            }
            else if (data[i][j] && counter >3){
                tmp[i].push(0);
            }
            else if (!data[i][j] && counter==3 ){
                tmp[i].push(1);
            }
            else{
                tmp[i].push(0)
            }

        }
    }
    // console.log(tmp)
    return tmp;
}
function print(data: number[][]){
    for (let i=0; i<data.length; ++i) {
        for (let j = 0; j < data[i].length; ++j) {
            if (data[i][j]===1){
                process.stdout.write(" ■ ");    //■
            }
            else{
                process.stdout.write("   ");
            }
        }
        console.log("|");
    }
    // console.log(data)
}

async function main(){
    let playingBoard: number[][]=  [[0, 0, 0, 0, 0, 0],
                                    [0, 0, 0, 1, 0, 0],
                                    [0, 1, 0, 0, 1, 0],
                                    [0, 1, 0, 0, 1, 0],
                                    [0, 0, 1, 0, 0, 0],
                                    [0, 0, 0, 0, 0, 0]];
    print(playingBoard);
    playingBoard=round(playingBoard);
    playingBoard=round(playingBoard);
    print(playingBoard)
}

main();