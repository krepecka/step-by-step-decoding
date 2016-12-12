'use strict';

const Vec = require('./vectors.js');
const q = 2;

class Decoder {
    constructor(matrixG) {
        this.matrixG = matrixG;
        this.matrixH = matrixG.createParityCheckMatrix();

        var n = matrixG.row_n;
        var k = matrixG.col_n;

        this.n = n;
        this.k = k;

        var code_words = new Array(Math.pow(2, n));

        // sugeneruojame visus galimus kodo žodžius. Jų yra 2^n
        for (var i = 0; i < code_words.length; i++) {
            code_words[i] = matrixG.multByVector(Vec.intToBinaryArr(i, n));
        }

        //konstruojame standard array
        let st_arr = new Array();

        //pirma eilutė yra mūsų kodo žodžiai
        st_arr.push(code_words);
        for (var i = 0; i < k; i++) {
            setCosetRow(st_arr, k, code_words.length);
        }
        printStandardArray(st_arr);
        this.syndromesToWeight = getSyndromes(st_arr, this.matrixH);

        st_arr = null;
    }
}

Decoder.prototype.decodeVector = function (vector) {
    //dauginam gautą vektorių(transponuotą) iš H
    var syndromeV = this.matrixH.multByVectorT(vector);
    var syndrome = syndromeV.join('');

    var w = this.syndromesToWeight[syndrome];

    //pradinė e pozicija - pats pirmas bitas
    var ePos = 0;
    var lastW;

    while (w != 0) {
        lastW = w;
        vector = Vec.addToVectorPoss(vector, ePos);
        syndrome = this.matrixH.multByVectorT(vector)
        w = this.syndromesToWeight[syndrome.join('')];

        //jei svoris nemažėja, grąžinam tą bitą atgal
        if (w >= lastW) {
            Vec.addToVectorPoss(vector, ePos);
            w = lastW;
        }
        ePos++;
    }
    return vector.slice(0, this.n);
}

//prideda vieną eilutę prie standartinės lentelės
function setCosetRow(st_arr, k, code_word_count) {
    //galimų žodžių aibė
    var combinations = Math.pow(2, k);

    //kiekvieną turimo standard array eilutę konvertuojam į dešimtainį atitikmenį
    var takenNums = st_arr.map((coset) => {
        var cosetN = coset.map((x) => {
            return parseInt(x.join(''), 2);
        });
        return cosetN;
    });

    //sugeneruojam visus galimus skaičius pagal kodo ilgį
    var allPossibleNumbers = [];
    for (var i = 0; i < combinations; i++) {
        allPossibleNumbers.push(i);
    }

    //iš visų galimų skaičių atmetame tuos, kurie jau panaudoti standard array
    var possNumbers = allPossibleNumbers.filter((x) => {
        for (var j = 0; j < takenNums.length; j++) {
            var row = takenNums[j];
            for (var i = 0; i < row.length; i++) {
                if (row.indexOf(x) > -1)
                    return false;
            }
        }
        return true;
    });

    //galimus naudoti skaičius paverčiame į atitinkamus vektorius
    var allPossibleVectors = possNumbers.map((number) => {
        return Vec.intToBinaryArr(number, k);
    });

    //išrikiuojame vektorius pagal svorį
    allPossibleVectors.sort((a, b) => {
        return Vec.getWeight(a) - Vec.getWeight(b);
    });

    //formuojam rinkinį
    var coset = [];
    var firstCoset = st_arr[0];
    // imam pirmą elementą
    var cosetLeader = allPossibleVectors.shift();

    coset.push(cosetLeader);

    for (var i = 1; i < code_word_count; i++) {
        coset.push(Vec.addVectors(cosetLeader, firstCoset[i]));
    }
    st_arr.push(coset);
}

//grąžina ryšį tarp galimų siųsti žodžių ir klasių lyderių svorių
function getSyndromes(st_arr, matrixH) {
    var cosetLeaders = [];
    var dictionary = {};
    //paimame pirmą stulpelį
    cosetLeaders = st_arr.map((row) => {
        return row[0];
    });

    //sudarom ryšį tarp syndrome ir coset leadear svorio
    for (var i = 0; i < cosetLeaders.length; i++) {
        var leader = cosetLeaders[i];
        var syndrome = matrixH.multByVectorT(leader);
        var key = syndrome.join('');
        dictionary[key] = Vec.getWeight(leader);
    }
    return dictionary;
}

//debug'inimui : išrašo standartinę lentelę
function printStandardArray(array) {
    array.forEach(function (element) {
        var str = '';
        element.forEach((vector) => {
            str += vector.join('') + ' ';
        });
        console.log(str);
    });
}

module.exports = Decoder;