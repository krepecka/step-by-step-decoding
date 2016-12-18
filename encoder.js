'use strict';

class Encoder{
    constructor(matrixG) {
        this.matrixG = matrixG;
    }
}

//vektoriaus užkodavimas pagal matricą
Encoder.prototype.encodeVector = function(vector){
    return this.matrixG.multByVector(vector);
}

module.exports = Encoder;