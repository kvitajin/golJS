"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const worker_threads_1 = require("worker_threads");
let data = [];
let matrixSize = 2;
const workers = [];
async function paralelRound(args) {
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
        let line = [];
        for (let j = 0; j < data[i].length; ++j) {
            line[j] = data[i][j];
        }
        const worker = new worker_threads_1.Worker(path.resolve(__dirname, './worker.js'), {
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
function surroundings(data, i, j) {
    let counter = 0;
    for (let k = i - 1; k < i + 2; ++k) {
        for (let l = j - 1; l < j + 2; ++l) {
            if (k >= 0 &&
                l >= 0 &&
                k < data.length &&
                l < data[0].length &&
                (!(k == i && l == j))) {
                if (data[k][l] == 1) {
                    ++counter;
                }
            }
        }
    }
    return counter;
}
function round(data) {
    let tmp = [];
    for (let i = 0; i < data.length; ++i) {
        tmp[i] = [];
    }
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data[i].length; ++j) {
            let counter = surroundings(data, i, j);
            if (data[i][j] && counter < 2) {
                tmp[i].push(0);
            }
            else if (data[i][j] && (counter == 2 || counter == 3)) {
                tmp[i].push(1);
            }
            else if (data[i][j] && counter > 3) {
                tmp[i].push(0);
            }
            else if (!data[i][j] && counter == 3) {
                tmp[i].push(1);
            }
            else {
                tmp[i].push(0);
            }
        }
    }
    // console.log(tmp)
    return tmp;
}
function print(data) {
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data[i].length; ++j) {
            if (data[i][j] === 1) {
                process.stdout.write(" ■ "); //■
            }
            else {
                process.stdout.write("   ");
            }
        }
        console.log("|");
    }
    // console.log(data)
}
async function main() {
    let playingBoard = [[0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]];
    print(playingBoard);
    playingBoard = round(playingBoard);
    playingBoard = round(playingBoard);
    print(playingBoard);
}
main();
