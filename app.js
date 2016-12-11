'use-strict';

var Matrix = require("./matrix.js").Matrix;
var Channel = require("./channel.js").Channel;

var Channel_ = new Channel(0.5);

var matrixA = new Matrix(2,4,[[1,2,3,4],[4,5,6,7]]);

var code = matrixA.multByVector([1,1]);


var matrixG = new Matrix(3,6,[[1,0,0,1,0,1],[0,1,0,1,1,0],[0,0,1,0,1,1]]);
var matrixG_ = new Matrix(2,4,[[1,0,1,0],[0,1,0,1]]);

var vectorT = [1,0,0,0,1,1];
//console.log(matrixH.multByVectorT(vectorT));
matrixG.show();
var matrixH = matrixG.createParityCheckMatrix();

matrixH.show();

matrixG_.show();
matrixG_.createParityCheckMatrix().show();


var matrixHe = new Matrix(4,7,[[1,0,0,0,1,0,1],[0,1,0,0,1,1,0],[0,0,1,0,1,1,1],[0,0,0,1,0,1,1]]);
matrixHe.show();
matrixHe.createParityCheckMatrix().show();

var m = new Matrix(2,3,[[1,0,1],[0,1,1]]);
m.show();
m.createParityCheckMatrix().show();

var mistakes = Channel_.send(vectorT);
console.log(vectorT);
console.log("Number of mistakes: " + mistakes.length);
console.log("Mistakes possitions: " + mistakes);




console.log("finish");