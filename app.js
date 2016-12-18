'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var Matrix = require("./matrix.js").Matrix;
var createRandomMatrix = require("./matrix.js").createRandomMatrix;
var Channel = require("./channel.js").Channel;
var Decoder = require("./decoder.js");
var Encoder = require("./encoder.js");
var TCoder = require("./text_coder.js");

var Vec = require("./vectors.js");

var app = express();

//pateikiami statiniai puslapiai
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/decode', function(req, res){
    var body = req.body;
    
    //vektorius, kurį reikia dekoduoti
    var vector = body.vector;

    //konvertuojame vektorių į skaičių masyvą
    vector = vector.map((x) => { return parseInt(x, 0) });

    //sukuriame matricą iš paduotų k, n ir eilučių
    var matrix = parseMatrix(body.n, body.k, body.matrix);

    //sukuriame dekodavimo objektą
    var decoder = new Decoder(matrix);

    //užkoduojam vectorių
    var vector = decoder.decodeVector(vector);

    //grąžiname :
    //  decodedVector - dekoduotas vektorius
    var result = {
        decodedVector: vector
    }
    res.send(result);
});

//Užkodavimo ir siuntimo kanalu procedūros.
//Paspaudus mygtuką [užkoduoti]
//Įeities parametrai: matrica, klaidos tikimybė, kodo ilgis ir dimensija
app.post('/encode', function(req, res){
    var body = req.body;
    
    //klaidos tikimybė, vektorius
    var p = parseFloat(body.p);
    var vector = body.vector;

    //konvertuojame vektorių į skaičių masyvą
    vector = vector.map((x) => { return parseInt(x, 0) });

    //sukuriame matricą iš paduotų k, n ir eilučių arba generuojam atsitiktinę
    var matrix;
    if(body.matrix == ""){
        matrix = createRandomMatrix(body.n, body.k)
    }else{
        matrix = parseMatrix(body.n, body.k, body.matrix);
    }

    //sukuriame kanalą su tikimybe p
    var channel = new Channel(p);

    //sukuriame užkodavimo objektą
    var encoder = new Encoder(matrix);

    //užkoduojam vectorių
    var vector = encoder.encodeVector(vector);

    //nukopijuojame vektorių, nes kanale jis bus pakeistas
    var encodedVector = vector.slice(0);
    //siunčiam kanalu. gauname klaidų pozicijas
    var mistakes = channel.send(vector);

    //grąžiname :
    //  encodedVector - vektorius po Užkodavimo
    //  receivedVecor - iš kanalo gautas vektorius
    //  mistakePositions - pozicijos, kuriose siunčiant kanalu padarytos klaidos
    //  numOfMistakes - klaidų skaičius
    //  matrix - mūsų generuojanti matrica 
    var result = {
        encodedVector: encodedVector,
        receivedVector: vector,
        mistakePositions: mistakes,
        numOfMistakes: mistakes.length,
        matrix: matrix
    }
    res.send(result);
});

app.post('/encode_t', function(req, res){
    var body = req.body;
    
    //klaidos tikimybė, gautas tekstas
    var p = parseFloat(body.p);
    var text = body.text;


    //sukuriame matricą iš paduotų k, n ir eilučių
    var matrix = parseMatrix(body.n, body.k, body.matrix);

    //sukuriame kanalą su tikimybe p
    var channel = new Channel(p);

    //sukuriame užkodavimo objektą
    var encoder = new Encoder(matrix);

    //sukuriame užkodavimo objektą
    var decoder = new Decoder(matrix);

    //sukuriame objektą, kuris dirbs su tekstu
    var tCoder = new TCoder(encoder, channel, decoder);

    //kaip atrodo tekstas be kodavimo
    var textNoCoding = tCoder.textNoEncoding(text, matrix.row_n);

    //kaip atrodo tekstas naudojant kodavimą
    var textWithCoding = tCoder.textWithEncoding(text, matrix.row_n);

    // grąžiname tekstą su užkodaviu ir be
    var result = {
        textNoCoding: textNoCoding,
        textWithCoding: textWithCoding
    }
    res.send(result);
});

function parseMatrix(strN, strK, strM){
    //Matricos eilutės gaunamos kaip tekstas. Paverčiam į skaičių masyvus
    var rows = strM.map((row) => {
        return row.map((val) => {
            return parseInt(val, 0);
        });
    })

    //kodo ilgis ir dimensija
    var k = parseInt(strK);
    var n = parseInt(strN);

    //sukuriame matricą iš paduotų k, n ir eilučių
    return new Matrix(n, k, rows);
}

//Paleidžiame aplikaciją
//  portas 3000 lokaliam paleidimui
app.listen(process.env.PORT || 3000, function(){
    console.log("Application is running on Localhost:3000 !");
});


