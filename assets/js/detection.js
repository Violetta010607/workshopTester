
let video;
var canvas;

// let widthCanv = 720;
// let heightCanv = 480;
let widthCanv = 320;
let heightCanv = 256;

let stopButton;
let startButton;
var videoAvailable = false;
var isStarted = false;

var detector;
var posit;
var markers;
var currentImage;
var ismarked = false;

var rectWitdh = 0;
var centrex = 0;
var centrey = 0;

var context;
var div;


function preload() {
  soundFormats('mp3');
  soundA = loadSound('assets/js/sounds/a.mp3');
  // soundA.setLoop(true);
}
//ARUCO_MIP_36h12
function videoReady() {
  console.log('Video is ready!!!');
  videoAvailable = true;
  detector = new AR.Detector({
    dictionaryName: 'ARUCO_MIP_36h12',
    maxHammingDistance: 8
  });
  console.log(detector);
}


function setup() {
  // mimics the autoplay policy
  // getAudioContext().suspend();
  userStartAudio();
  // if(getAudioContext().state === "suspended"){
  //   getAudioContext().resume();
  // }
  console.log("setup: "+getAudioContext().state);

  div = select("#canvas");

  // if(windowHeight > windowWidth){
  //   widthCanv = windowWidth;
  //   heightCanv = windowWidth * 1.5;
  // }else {
  //   widthCanv = windowHeight;
  //   heightCanv = windowHeight * 1.5;
  // }
  // console.log("canvas width: "+widthCanv);
  // console.log("canvas height: "+heightCanv);
  // canvas = createCanvas((windowWidth/3)*2, (windowHeight/3)*2);
  canvas = createCanvas(widthCanv, heightCanv);
  canvas.parent("canvas");

  background(255);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  console.log("video width: "+width);
  console.log("video height: "+height);
  background(0);

  startButton = select("#startDetection");
  startButton.mousePressed(startVideo);

  stopButton = select("#endDetection");
  stopButton.mousePressed(pauseVideo);
}


function startVideo(){
  if(getAudioContext().state !== "running"){
    getAudioContext().resume();
    console.log("startButtonPressed: "+getAudioContext().state);
  }
  // userStartAudio();
  isStarted = true;
  div.attribute("aria-disabled", "false");

}

function pauseVideo(){
  if(getAudioContext().state !== "suspended"){
    getAudioContext().suspend();
    console.log("stopButtonPressed: "+getAudioContext().state);
  }
  isStarted = false;
  div.attribute("aria-disabled", "true");
}

// function playSound(){
//   if(!soundA.isPlaying()){
//     soundA.setVolume(0.5);
//     soundA.play();
//   }
// }
//
// function stopSound(){
//   if(soundA.isPlaying()){
//     soundA.stop();
//   }
// }

function drawCorners(markers){
  var corners, corner, i, j;

  for (i = 0; i !== markers.length; ++ i){
    console.log(markers[i]);
    corners = markers[i].corners;

    stroke(0, 255, 0);
    strokeWeight(1);
    noFill();

    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];
      let x0 = corner.x;
      let y0 = corner.y;
      corner = corners[(j + 1) % corners.length];
      line(x0, y0, corner.x, corner.y);
    }

  }
}

function drawId(markers){
  var corners, corner, x, y, i, j;

  stroke(255, 0 ,0);
  textSize(10)
  noFill();

  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;

    xMin = Infinity;
    yMin = Infinity;

    xMax = 0;
    yMax = 0;

    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];

      xMin = Math.min(xMin, corner.x);
      yMin = Math.min(yMin, corner.y);

      xMax = Math.max(xMax, corner.x);
      yMax = Math.max(yMax, corner.y);
    }

    centrex = (xMin + xMax)/2;
    centrey = (yMin + yMax)/2;
    console.log(centrex+" "+centrey);
    strokeWeight(1);
    point(centrex, centrey);

    text(markers[i].id, xMin, yMin);
  }
}

function changeVolume(){
  var newVolume = norm(centrex, 0, width);
  newVolume = Math.round(newVolume * 10) / 10
  console.log(newVolume);
  soundA.setVolume(newVolume);
  stroke(255, 255 ,255);
  textSize(20)
  text(soundA.getVolume(), 10, height+25);
}


// function detection(currentImage){
//   markers = detector.detectImage(320, 240, currentImage.pixels);
//   console.log(markers);
//   if(markers.length > 0){
//     ismarked = true;
//   }
// }

function draw() {
  // console.log("draw: "+getAudioContext().state);
  if(videoAvailable && isStarted){
    //move image by the width of image to the left
    translate(video.width, 0);
    //then scale it by -1 in the x-axis
    //to flip the image
    scale(-1, 1);

    currentImage = video.get();
    currentImage.loadPixels();
    console.log(currentImage);
    image(currentImage, 0, 0);
    markers = detector.detectImage(width, height, currentImage.pixels);
    console.log(markers);
    if(markers.length > 0){
      ismarked = true;
    }

    if(ismarked){
      drawCorners(markers);
      drawId(markers);
      // changeVolume();
      if(!soundA.isPlaying()){
        soundA.play();
      }
      ismarked = false;
    }
  }else{
    background(255);
  }
  //image(video, 0, 0, 320, 240);
  //fill(255);
  //textSize(16);

  // text(value, 10, height - 10);

}
