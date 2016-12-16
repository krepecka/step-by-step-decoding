'use strict';

var BitArray = require('node-bitarray');

class TextCoder{
    constructor(encoder, channel, decoder) {
        this.encoder = encoder;
        this.channel = channel;
        this.decoder = decoder;
    }
}

//suskaido tekstą į simbolius, tada kiekvieną simbolį konvertuoja į ascii atitikmenį
// ir sudeda į bufferį. Tada visą bufferį konvertuoja į bitų masyvą, sukarpo į reikiamo ilgio vektorius ir 
// siunčia kanalu. 
TextCoder.prototype.textNoEncoding = function(text, n){

    var buff = new Buffer(text);

    var bits = BitArray.fromBuffer(buff);

    //tarnybinė informacija - pridėtų bitų skaičius
    var t_bits = bits.length % n;

    //jei paskutinis vektorius nesigauna pilnas, pridedame nulių
    if(t_bits !== 0){
        var arr = new Array(t_bits);
        arr.fill(0);

        //pridedam prie galo
        bits.push(...arr);
    }

    var result = [];
    bits = bits.toArray();

    while(bits.length){
        var message = bits.splice(0, 1);

        this.channel.send(message);

        result.push(...message);
    }

    console.log(result);
}

TextCoder.prototype.textWithEncoding = function(text, n){
    return this.matrixG.multByVector(vector);
}

module.exports = TextCoder;