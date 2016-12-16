'use strict';

const q = 2;

class Channel{
    constructor(p){
        this.p = p;
    }
}

//grąžina klaidų pozicijų masyvą, vektorius yra pakeičiamas viduje
Channel.prototype.send = function(vector){
    var mistakes = [];

    if(vector.constructor == Array){
        for(var i = 0; i < vector.length; i++){
            var rand = Math.random();

            //jei pagal tikimybę reikia iškraipyti, pridedam 1
            if(rand < this.p){
                vector[i] = (vector[i] + 1) % q;
                mistakes.push(i);
            }
        }
    }

    return mistakes;
}

module.exports.Channel = Channel;