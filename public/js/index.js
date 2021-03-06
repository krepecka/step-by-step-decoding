$('.decode').hide();

//užkodavimo užklausos formavimas į serverį
$("#encode").click(function (e) {
    var k = parseInt($("#code_length").val());
    var n = parseInt($("#code_dimension").val());
    var p = parseFloat($("#p").val());
    var matrix = $("#matrix").val();
    var vector = $("#vector").val();
    var randomMatrix = $("#random_matrix").prop('checked')

    vector = checkBasicFields(k, n, p, vector);

    //jei pažymėta, kad atsitiktinė matrica, nedarome tikrinimų
    if (!randomMatrix) {
        var rows = checkMatrix(matrix, n, k);
    }else
        rows = null;
    
    //jei nepraėjo tikrinimų ir ne atsitiktinė matrica - nevykdom
    if (!(vector && (rows || randomMatrix))) {
        return
    }

    $.ajax({
        url: '/encode',
        method: "POST",
        data: {
            k: k,
            n: n,
            p: p,
            matrix: rows,
            vector: vector
        },
    }).done(function (data) {
        console.log(data);
        parseEncodingResult(data);
    });
});

//dekodavimo užklausa serveriui
$("#decode").click(function (e) {
    var k = parseInt($("#code_length").val());
    var n = parseInt($("#code_dimension").val());
    var p = parseFloat($("#p").val());
    var matrix = $("#matrix").val();
    var vector = $("#received").val();

    vector = checkBasicFields(n, k, p, vector);
    var rows = checkMatrix(matrix, n, k);

    //jei nepraėjo tikrinimų - nevykdom
    if (!(vector && rows)) {
        return
    }

    $.ajax({
        url: '/decode',
        method: "POST",
        data: {
            k: k,
            n: n,
            matrix: rows,
            vector: vector
        },
    }).done(function (data) {
        console.log(data);
        parseDecodingResult(data);
    });

});

//laukų tikrinimai ir vektoriaus formavimas
function checkBasicFields(k, n, p, vector) {

    if (isNaN(p) || p > 1 || p < 0) {
        alert("p turi būti tarp 0 ir 1");
        return false;
    }

    if (isNaN(k) || isNaN(n) || n == 0 || k == 0) {
        alert("n ir k turi būti užpildyti");
        return false;
    }

    if (vector.length != n) {
        alert("Vektoriaus ilgis turi būti lygus " + n);
        return false;
    }

    vector = vector.split('').map((x) => { return parseInt(x, 0) })
    vector = vector.filter((val) => {
        return !isNaN(val) && (val === 1 || val === 0);
    });

    if (vector.length != n) {
        alert("Vektorius turi būti sudarytas iš kūno q = 2 elementų. (0 ir 1)");
        return false;
    }
    return vector;
}

//tikrinimai, ar matrica yra korektiška
function checkMatrix(matrix, n, k) {
    var rows = matrix.split('\n');

    if (rows.length != n) {
        alert("matricos eilučių skaičius turi būti lygus n");
        return false;
    }

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var values = row.split(' ');
        var nums = values.map((x) => { return parseInt(x, 0) })
        nums = nums.filter((val) => {
            return !isNaN(val) && (val === 1 || val === 0);
        });

        if (nums.length != values.length) {
            alert("Neteisingas matricos formatas. Eilutė: " + i);
            return false;
        }

        if (nums.length != k) {
            alert("Stulpelių skaičius turi būti lygus k. Eilutė: " + i);
            return false;
        }

        //tikrinimas ar standartinio pavidalo matrica
        for (var j = 0; j < n; j++) {
            if ((j == i && nums[j] != 1) || (j != i && nums[j] != 0)) {
                alert("Matrica turi būti standartinio pavidalo. Eilutė: " + i + " Stulpelis: " + j);
                return false;
            }
        }
        rows[i] = nums;
    }
    return rows;
}

// VEKTORIAUS užklausos rezultato susiejimas su interfeisu
function parseEncodingResult(data) {
    var encoded = data.encodedVector;
    var mistakesMade = data.numOfMistakes;
    var receivedVector = data.receivedVector;
    var mistakes = data.mistakePositions;

    //idedame serveryje sugeneruota matrica, jei pazymeta, kad nori atsitiktines
    if($("#random_matrix").prop('checked')){
        var result = ''
        var rows = data.matrix.rows;

        for(var i = 0; i < rows.length; i++){
            result += rows[i].join(' ')
            result += '\n'
        }

        result = result.substring(0, result.length-1);
        console.log(result);
        $('#matrix').val(result);

        $("#random_matrix").prop('checked', false)
    }
    
    $('fieldset').prop('disabled', false);

    $('#encoded').val(encoded.join(''));
    $('#received').val(receivedVector.join(''));
    $('#mistakes_made').val(mistakesMade);
    $('#mistakes').val(mistakes.join(', '));

    $('.decode').show();
}

//vektoriaus dekodavimo rezultatas
function parseDecodingResult(data) {
    var decoded = data.decodedVector;
    $('#decoded').val(decoded.join(''));
}

// TEKSTO u=kodavimo užklausos į serverį formavimas
$("#endode_t").click(function (e) {
    var k = parseInt($("#code_length").val());
    var n = parseInt($("#code_dimension").val());
    var p = parseFloat($("#p").val());
    var matrix = $("#matrix").val();
    var text = $("#text_r").val();

    if (isNaN(p) || p > 1 || p < 0) {
        alert("p turi būti tarp 0 ir 1");
        return false;
    }

    if (isNaN(k) || isNaN(n) || n == 0 || k == 0) {
        alert("n ir k turi būti užpildyti");
        return false;
    }

    if (text == undefined || text == "") {
        alert("Tekstas turi būti užpildytas");
        return false;
    }

    var rows = checkMatrix(matrix, n, k);

    //jei nepraėjo tikrinimų - nevykdom
    if (!rows) {
        return;
    }

    $.ajax({
        url: '/encode_t',
        method: "POST",
        data: {
            k: k,
            n: n,
            p: p,
            matrix: rows,
            text: text
        },
    }).done(function (data) {
        console.log(data);
        parseTextResult(data);
    });

});

//resultato po teksto dekodavimo susiejimas
function parseTextResult(data) {
    $("#text_noencoding").val(data.textNoCoding);
    $("#text_decoded").val(data.textWithCoding);
}