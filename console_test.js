'use strict';

var Matrix = require("./matrix.js").Matrix;
var Channel = require("./channel.js").Channel;
var Decoder = require("./decoder.js");
var Encoder = require("./encoder.js");

var channel = new Channel(0.5);
//var matrixG = new Matrix(4,7,[[1,0,0,0,1,0,1],[0,1,0,0,1,1,0],[0,0,1,0,1,1,1],[0,0,0,1,0,1,1]]);//new Matrix(3,6,[[1,0,0,1,0,1],[0,1,0,1,1,0],[0,0,1,0,1,1]]);
var matrixG = new Matrix(1, 5, [[1,1,1,1,1]]);
var decoder = new Decoder(matrixG);
var encoder = new Encoder(matrixG);

matrixG.show();
matrixG.createParityCheckMatrix().show();


var vector = [1];
console.log("Starting vector: " + vector);


vector = encoder.encodeVector(vector);
console.log("Encoded vector: " + vector);

var mistakes = channel.send(vector);
console.log("Mistakes positions: " + mistakes);
console.log("Sent vector: " + vector);

vector = decoder.decodeVector(vector);
console.log("Decoded vector: " + vector);

/*
var matrixG_ = new Matrix(2,4,[[1,0,1,0],[0,1,0,1]]);

var vectorT = [1,1,1,0,0,0];
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

var mistakes = channel.send(vectorT);
console.log(vectorT);
console.log("Number of mistakes: " + mistakes.length);
console.log("Mistakes possitions: " + mistakes);


var Dec = new Decoder(matrixG);

var decoded = Dec.decodeVector(vectorT);

console.log("decoded: ");
console.log(decoded);

console.log("finish");*/