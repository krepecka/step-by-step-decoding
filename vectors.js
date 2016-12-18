'use strict';

const q = 2;

//grąžina vektoriaus svorį
//  atfiltruojame nenulines pozicijas ir suskaičiuojame, kiek tokių yra
var getWeight = function(vector) {
    return vector.filter((x) => { return x === 1 }).length;
}

// vektorių sudėtis
var addVectors = function(vector1, vector2) {
    var result = [];

    if (vector1.length == vector2.length) {
        for (var i = 0; i < vector1.length; i++) {
            result.push((vector1[i] + vector2[i]) % q);
        }
    }
    return result;
}

//nurodytoje vietoje vektoriui pridedam vienetą
var addToVectorPoss = function(vector, possition){
    if(possition < vector.length){
        vector[possition] = (vector[possition] + 1) % q;
    }
    return vector;
}

//konvertuoja skaičių į bitų masyvą/vektorių
var intToBinaryArr = function(num, arr_len) {
    var word = [];
    word = (num).toString(2).split("").map((x) => { return parseInt(x, 0) });
    word = word.reverse();

    //užpildome tuščias vietas nuliais
    for (var j = arr_len - 1; j > 0; j--) {
        if (word[j] === undefined) {
            word[j] = 0;
        }
    }
    return word.reverse();
}

module.exports.intToBinaryArr = intToBinaryArr;
module.exports.addToVectorPoss = addToVectorPoss;
module.exports.getWeight = getWeight;
module.exports.addVectors = addVectors;