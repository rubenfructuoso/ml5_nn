let model;
let targetLabel = 'C';
let state = 'collection';

function setup() {

    createCanvas(400, 400);
    background(230);

    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: 'true',
        learningRate: 0.5
    };

    model = ml5.neuralNetwork(options);
    model.loadData('mouse-notes.json', dataLoaded);

}

function dataLoaded() {

    console.log(model.data);
    let data = model.data.data.raw;
    for (let i = 0; i < data.length; i++) {
        var inputs = data[i].xs;
        var target = data[i].ys;
    }


    stroke(0,0,0,70);
    noFill();
    ellipse(inputs.x, inputs.y, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(target.label, inputs.x, inputs.y);

}

function keyPressed() {

    if (key == 't') {

        state = 'training';
        console.log('Training started!');
        model.normalizeData();
        let options = {
            epochs: 300
        };
        model.train(options, whileTraining, finishedTraining);

    } else if (key == 's') {

        model.saveData('mouse-notes');

    }

    targetLabel = key.toUpperCase();

}

function whileTraining(epoch, loss) {

    console.log(epoch);

}

function finishedTraining() {

    console.log('Training finished!');
    state = 'prediction';

}

function mousePressed() {

    let inputs = {
        x: mouseX,
        y: mouseY
    };

    if (state == 'collection') {

        let target = {
            label: targetLabel
        };


        model.addData(inputs, target);

        stroke(0);
        noFill();
        ellipse(mouseX, mouseY, 24);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(targetLabel, mouseX, mouseY);

    } else if (state == 'prediction') {

        model.classify(inputs, gotResults);

    }

}

function gotResults(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    console.log(results);
    stroke(0);
    fill(0,0,255,100);
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(results[0].label, mouseX, mouseY);
}