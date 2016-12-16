'use strict';

const q = 2;

class Matrix {
    //pirmi du parametrai - stulpelių ir eilučių skaičiai, trečia - eilutės
    constructor(row_n, col_n, rows) {
        this.row_n = row_n;
        this.col_n = col_n;
        this.rows = [];

        if (rows.constructor == Array) {

            //atfiltruojam kiekvienos matricos eilutės kiekvieną langelį pagal tai,
            //ar langelyje skaičius. Lieka tos eilutės, kurių visuose langeliuose yra toks skaičius
            //skaičių, kiek matrica turi stulpelių
            var rows_only_nums = rows.filter((row) => {
                return row.filter((cell) => {
                    return !isNaN(cell);
                }).length == col_n;
            });

            //jei po filtravimo turime tiek korektiškų eilučių, kiek ir reikia matricai, 
            //reiškia, matrica korektiška
            if (rows_only_nums.length == row_n)
                this.rows = this.rows.concat(rows_only_nums);
        }
    }
}
//debug'inimui
Matrix.prototype.show = function () {
    console.log('----------');
    this.rows.forEach(function (element) {
        console.log(element);
    });
    console.log('----------');
}

//matricos daugyba iš vektoriaus
Matrix.prototype.multByVector = function (vector) {
    var result = [];

    //tikrinam, ar atsiuntė masyvą ir ar vektoriaus ilgis sutampa su kodo dimensija
    if (vector.constructor == Array && vector.length == this.row_n) {
        //eisim per visus matricos stulpelius
        for (var i = 0; i < this.col_n; i++) {
            var sum = 0;

            //einam per kiekvieno stulpelio eilutes ir atitinkamai dauginam
            //iš vektoriaus pozicijų
            for (var j = 0; j < this.row_n; j++) {
                //einamoji eilute
                var row = this.rows[j];
                //row[i] - einamos eilutės langelis pagal einamą stulpelį
                sum += (row[i] * vector[j]);
            }
            //kūne su q
            sum = sum % q;
            //pridedam į vektorių
            result.push(sum);
        }
    }

    return result;
}

//matricos daugyba iš transponuoto vektoriaus
Matrix.prototype.multByVectorT = function (vector) {
    var result = [];

    //tikrinam, ar atsiuntė masyvą ir ar vektoriaus ilgis sutampa su kodo ilgiu
    if (vector.constructor == Array && vector.length == this.col_n) {

        //einam per matricos eilutes
        for (var i = 0; i < this.row_n; i++) {
            var sum = 0;
            var row = this.rows[i];

            //kiekvieną eilutės narį dauginam iš kiekvieno vektoriaus nario
            for (var j = 0; j < row.length; j++) {
                sum += (vector[j] * row[j]);
            }

            sum = sum % q;
            result.push(sum);
        }
    }

    return result;
}

//sukuriam kontrolinę matricą
Matrix.prototype.createParityCheckMatrix = function () {
    var newRows = [];
    var n = this.row_n;
    var k = this.col_n;

    //einam per esamos matricos eilutes
    // k-n yra transponuotos matricos eilučių skaičius
    for (var i = 0; i < k-n; i++) {
        var row = this.rows[i];
        var newRow = [];

        //transponuojame : į naujos matricos eilutę surašome matricos stulpelius
        for (var j = 0; j < n; j++) {
            var row = this.rows[j];
            var cell = row[n + i];
            newRow.push(cell);
        }

        //likusioje dalyje surašome vienetinę matricą
        for (var j = n; j < row.length; j++) {
            if (i == j - n)
                newRow.push(1);
            else
                newRow.push(0);
        }
        newRows.push(newRow);
    }

    //grąžinam naują matricą
    return new Matrix(k-n, this.col_n, newRows);
}

module.exports.Matrix = Matrix;