var express = require("express");
var app = express();
var natural = require('natural');
var outputTrain = require("./output.json");
var bodyParser = require('body-parser');
var classifier = new natural.BayesClassifier();

app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/proses", function(req, res, ) {
    var inputUser = req.body.teks;
    // console.log(inputUser)
    
    // dataset
    classifier.addDocument('beli narkoba', 'narkoba');
    classifier.addDocument('jual narkoba', 'narkoba');
    classifier.addDocument('sabu-sabu', 'narkoba');
    classifier.addDocument('jual ganja', 'narkoba');
    classifier.addDocument('jual ganja', 'narkoba');
    classifier.addDocument('judi', 'judi');
    classifier.addDocument('poker terpercaya', 'judi');
    classifier.addDocument('situs poker', 'judi');
    classifier.addDocument('DominoQQ', 'judi');
    classifier.addDocument('GemparQQ', 'judi');
    var maxIteration = 100;
    var minImprovment = .01;
    classifier.train(maxIteration,minImprovment);
    
    var teksUser = classifier.getClassifications(inputUser);
    var narkoba;
    var judi;
    var output;
    var akurasi;
    teksUser.forEach(function(classPlusProbability) {
        // console.log(classPlusProbability);
        pemenang = classPlusProbability.value;
        if(classPlusProbability.label === 'narkoba'){
            narkoba = classPlusProbability.value;
        }else{
            judi = classPlusProbability.value;
        }
    });
    if(narkoba == judi){
        output = 'lolos'
        akurasi = 0
    }else if(narkoba > judi){
        output = 'narkoba'
        akurasi = narkoba
    }else if(narkoba < judi){
        output = 'judi'
        akurasi = judi
    }
    // console.log(output)
    // simpan ke json outputnya
    outputTrain.forEach(function(hasil) {
        hasil.textAsli = inputUser;
        hasil.result = output;
        hasil.akurasi = akurasi;
    });
    res.sendFile(__dirname + "/output.html");
});

app.get("/result", function(req, res) {
    res.json(outputTrain);
});


const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});