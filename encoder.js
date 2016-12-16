'use strict';

class Encoder{
    constructor(matrixG) {
        this.matrixG = matrixG;
    }
}

Encoder.prototype.encodeVector = function(vector){
    return this.matrixG.multByVector(vector);
}

module.exports = Encoder;