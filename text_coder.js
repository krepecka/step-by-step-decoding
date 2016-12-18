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
        var arr = new Array(n - t_bits);
        arr.fill(0);

        //pridedam prie galo
        bits.push(...arr);
    }

    var result = [];
    bits = bits.toArray();

    //atkerpam reikiamo ilgio žinutę ir siunčiam kanalu
    while(bits.length){
        var message = bits.splice(0, n);

        this.channel.send(message);

        result.push(...message);
    }

    //atkerpam tuos bitus, kuriuos pridėjom, kad sudaryti reikiamo ilgio vektorius
    result.splice(result.length - 1 - t_bits, t_bits);

    //iš bitų formuojame bufferį ir tada tekstą
    return new BitArray(result).toBuffer().toString();
}

TextCoder.prototype.textWithEncoding = function(text, n){
    var buff = new Buffer(text);

    var bits = BitArray.fromBuffer(buff);

    //tarnybinė informacija - pridėtų bitų skaičius
    var t_bits = bits.length % n;

    //jei paskutinis vektorius nesigauna pilnas, pridedame nulių
    if(t_bits !== 0){
        var arr = new Array(n - t_bits);
        arr.fill(0);

        //pridedam prie galo
        bits.push(...arr);
    }

    var result = [];
    bits = bits.toArray();

    while(bits.length){
        //paimam vektorių
        var message = bits.splice(0, n);
        //užkoduojame
        var encoded_msg = this.encoder.encodeVector(message);
        //siunčiam kanalu
        this.channel.send(encoded_msg);
        //dekoduojam
        var decoded_msg = this.decoder.decodeVector(encoded_msg);

        //pridedam prie rezultato
        result.push(...decoded_msg);
    }

    //atkerpam tuos bitus, kuriuos pridėjom, kad sudaryti reikiamo ilgio vektorius
    result.splice(result.length - 1 - t_bits, t_bits);

    //iš bitų formuojame tekstą
    return new BitArray(result).toBuffer().toString();
}

module.exports = TextCoder;