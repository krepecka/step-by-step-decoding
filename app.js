'use strict';

var express = require('express');
var bodyParser = require('body-parser');
// var consolidate = require('consolidate');

var Matrix = require("./matrix.js").Matrix;
var Channel = require("./channel.js").Channel;
var Decoder = require("./decoder.js");
var Encoder = require("./encoder.js");

var channel = new Channel(0.1);
var matrixG = new Matrix(4,7,[[1,0,0,0,1,0,1],[0,1,0,0,1,1,0],[0,0,1,0,1,1,1],[0,0,0,1,0,1,1]]);//new Matrix(3,6,[[1,0,0,1,0,1],[0,1,0,1,1,0],[0,0,1,0,1,1]]);
var decoder = new Decoder(matrixG);
var encoder = new Encoder(matrixG);

var app = express();

//pateikiami statiniai puslapiai
app.use(express.static(__dirname + '/public'));
// app.engine('html', consolidate.nunjucks);
// app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/encode', function(req, res){
    var path = req.path;
    res.locals.path = path;
    //res.render('index');
    res.send("<h1>Hello world, once again!</h1>");
});

//Užkodavimo ir siuntimo kanalu procedūros
app.post('/encode', function(req, res){
    var path = req.path;
    var body = req.body;
    res.locals.path = path;
    
    var rows = body.matrix.map((row) => {
        return row.map((val) => {
            return parseInt(val, 0);
        })
    })

    var p = parseFloat(body.p);
    var k = parseInt(body.k);
    var n = parseInt(body.n);
    var vector = body.vector;

    vector = vector.map((x) => { return parseInt(x, 0) });

    var matrix = new Matrix(n, k, rows);
    var channel = new Channel(p);
    var encoder = new Encoder(matrix);
    //užkoduojam vectorių
    var vector = encoder.encodeVector(vector);
    //nukopijuojame vektorių, nes kanale jis pasikeis
    var encodedVector = vector.slice(0);
    //siunčiam kanalu
    var mistakes = channel.send(vector);

    var result = {
        encodedVector: encodedVector,
        receivedVector: vector,
        mistakePositions: mistakes,
        numOfMistakes: mistakes.length
    }
    res.send(result);
});

app.post('/blog/:title?', (req, res) => {
    var title = req.params.title;
    if(title === undefined){
        res.status(200);
        res.render('blog', {'posts' : postList});
    } else{
        var post = posts[title] || {};
        res.render('post', {'post' : post});
    }
});

//portas 3000 lokaliam paleidimui
app.listen(process.env.PORT || 3000, function(){
    console.log("Application is runnin on Localhost:3000 !");
});


