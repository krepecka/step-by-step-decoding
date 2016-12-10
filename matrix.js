'use strict';

class Matrix{
    //pirmi du parametrai - stulpelių ir eilučių skaičiai. Visi likę parametrai - eilutės
    constructor(row_n, col_n, rows){
        this.row_n = row_n;
        this.col_n = col_n;
        this.rows = [];

        if(arguments.length > 2){
            //atkerpam visas matricos eilutes iš argumentų sąrašo
            var rows = Array.prototype.slice.call(arguments, 2);

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
            if(rows_only_nums.length == row_n)  
                this.rows = this.rows.concat(rows_only_nums);          
        }
    }
}

//matricos daugyba iš vektoriaus
Matrix.prototype.multByVector = function (vector){
        var result = [];

        //tikrinam, ar atsiuntė masyvą ir ar vektoriaus ilgis sutampa su kodo dimensija
        if(vector.constructor == Array && vector.length == this.row_n){
            //eisim per visus matricos stulpelius
            for(var i = 0; i < this.col_n; i++){
                var sum = 0;

                //einam per kiekvieno stulpelio eilutes ir atitinkamai dauginam
                //iš vektoriaus pozicijų
                for(var j = 0; j < this.row_n; j++){
                    //einamoji eilute
                    var row = this.rows[j];
                    //row[i] - einamos eilutės langelis pagal einamą stulpelį
                    sum += (row[i] * vector[j]);
                }

                //pridedam į vektorių
                result.push(sum);
            }
        }

        return result;
    }

module.exports.Matrix = Matrix;