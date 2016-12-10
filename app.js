'use-strict';

var Matrix = require("./matrix.js").Matrix;

var matrixA = new Matrix(2,4,[1,2,3,4],[4,5,6,7]);

var code = matrixA.multByVector([1,1]);


console.log("finish");