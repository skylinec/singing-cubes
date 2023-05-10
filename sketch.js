var locX; // light locations
var locY;

var boxSeparation = 60; // parameters for primitive drawing for loops
var division = 7;
var heldDivision; // user chosen division

var boxSize = 50; // primitive params
var boxDepth = 50;

var triOsc; // synth
var reverb;

var rotation = -75; // rotation

var fft;

var cubeCount;
var showText = true;
var enableRotation = true;
var fsEnabled = false;
var mouseMoveMode = false;

function preload() {
    myFont = loadFont('assets/Inconsolata-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // frameRate(20);

    triOsc = new p5.Oscillator('triangle');

    let t1 = 0.4; // attack time in seconds
    let l1 = 0.7; // attack level 0.0 to 1.0
    let t2 = 0.3; // decay time in seconds
    let l2 = 0.5; // decay level  0.0 to 1.0

    env = new p5.Envelope(t1, l1, t2, l2);
    env.setRange(1, 0);

    triOsc.start();

    fft = new p5.FFT();

    reverb = new p5.Reverb;
    reverb.process(triOsc, 3, 2);
}

//no need to edit this
function draw() {

    t1 = mouseY/10000;

    divison = heldDivision;

    background(mouseX/48);
    // boxSeparation = mouseX/10;

    if (enableRotation) rotation = 1000*sin(0.015*frameCount);

    push();
        noStroke();
        fill(400-(mouseX/48)); // green
        translate(-windowWidth / 2, -windowHeight / 2, 0);
        translate(windowWidth/4.2, windowHeight/3.5,350);
        textFont(myFont, windowWidth/80);
        text(mouseX + ',' + mouseY, 0, 0);
        textFont(myFont, 5+(windowWidth/200));
        text("SINGING CUBES by Matthew Holloway (Audio react/visualiser project)", 0, -20);
        text("SPACE to toggle instructions", 0, 30);
        if (showText) {
            text("Canvas & primitive count readjust with window size", 0, 45);
            text("Tap mouse to play sound. Left and right arrow to move camera", 0, 60);
            text("Up arrow and down arrow change cube count", 0, 75);
            text("A and D to change box separation (density)", 0, 90);
            text("P to enable/disable automatic rotation", 0, 105);
            text("F for fullscreen", 0, 120);
            text("K for mouse move mode (high performance impact)", 0, 135);
        }
        text("DIVISION: " + division + "  CUBE COUNT: " + cubeCount + "  BOX SEPARATION: " + boxSeparation + "  MOVE MODE: " + mouseMoveMode + "  ROTATION: " + rotation, 100-(windowWidth/150), 0);
    pop();

    drawBox();
    

}

function drawBox() {
    push();
        // blendMode(SCREEN);

        camera(141+rotation, 636+rotation, 200 + tan(frameCount * 0.01) * 0.01, 0, 0, 0, 0, 1, 0);
        // plane(10, 10);

        let locX = mouseX - height / 2;
        let locY = mouseY - width / 2;

        ambientLight((mouseX*mouseY)/3000); // ambient light with colour based on mouse location
        directionalLight(255, 0, 0, 0.25, 0.25, 0);
        pointLight(0, 0, 255, locX, locY, 250);

        boxSize = 60 + ((mouseX*mouseY)/3000);

        let fftOut = fft.analyze();

        boxSize = 60+ (boxSize * (fftOut[60]/200));
        // boxDepth = 60+ (boxDepth * (fftOut[60]/200));
        // boxSeparation = (mouseX*mouseY)/3000;

        // box count dynamically readjusts with the size of the window to work on any device
        cubeCount=0;

        // division= division + (fftOut[60]/800);

        for(let x = 0; x < (windowWidth/division); x=x+boxSeparation) {
            for(let y = 0; y < (windowHeight/division); y=y+boxSeparation) {
                for(let z = 0; z < (windowHeight/division); z=z+boxSeparation) {
                    cubeCount = cubeCount + 4;
                    push();
                        translate(x, y, z); // populate top left with boxes 
                        rotateX(frameCount * mouseX/100000);
                        rotateY(frameCount * mouseY/100000);
                        specularMaterial(250);
                        box(boxSize, boxSize, boxDepth);
                    pop();

                    push();
                        translate(-x, -y, z); // populate bottom right with boxes
                        rotateX(frameCount * mouseX/100000);
                        rotateY(frameCount * mouseY/100000);
                        specularMaterial(250);
                        box(boxSize, boxSize, boxDepth);
                    pop();

                    push();
                        translate(x, -y, -z); // populate bottom right with boxes
                        rotateX(frameCount * -mouseX/100000);
                        rotateY(frameCount * -mouseY/100000);
                        specularMaterial(250);
                        box(boxSize, boxSize, boxDepth);
                    pop();

                    push();
                        translate(-x, y, -z); // populate bottom left with boxes
                        rotateX(frameCount * -mouseX/100000);
                        rotateY(frameCount * -mouseY/100000);
                        specularMaterial(250);
                        box(boxSize, boxSize, boxDepth);
                    pop();
                }
            } 
        }
    pop();
    // box();
}

function playSynth() {
    userStartAudio();

    // triOsc.pan((mouseX/1000)-0.4);
    triOsc.freq(mouseX/10);
    // triOsc.start();

    env.play(triOsc);

    if (!mouseMoveMode) {
        reverb.set(mouseY/50, mouseY/1000);
    }
    
}

function mousePressed() {
    
    playSynth();
}

function mouseMoved() {
    if (mouseMoveMode) {
        playSynth();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    console.log("KEY")
    if (keyCode == LEFT_ARROW) {
        rotation = rotation-100;
        console.log("LEFT");
    } else if (keyCode == RIGHT_ARROW) {
        rotation = rotation+100;
        console.log("RIGHT");
    } else if (keyCode == UP_ARROW) {
        division++;
    } else if (keyCode == DOWN_ARROW) {
        if (division>=2) {
            division--;
        } 
    } else if (keyCode == '32') {
        showText = !showText;
    } else if (keyCode == '65') {
        boxSeparation+=20;
    } else if (keyCode == '68') {
        boxSeparation-=20;
    } else if (keyCode == '80') {
        enableRotation = !enableRotation;
    } else if (keyCode == '70') {
        fullscreen(!fs);
    } else if (keyCode == '75') {
        mouseMoveMode = !mouseMoveMode;
    }

    heldDivision = division;
}