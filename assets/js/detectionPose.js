
let video;
var canvas;
var div;

// let widthCanv = 720;
// let heightCanv = 480;
let widthCanv = 320;
let heightCanv = 256;

let stopButton;
let startButton;
var videoAvailable = false;
var isStarted = false;

// var detector;
var posit;
var pose;
var markers;
var currentImage;
var ismarked = false;

var rectWitdh = 0;
var centrex = 0;
var centrey = 0;

var context;


function preload() {
  soundFormats('mp3');
  soundA = loadSound('assets/js/sounds/maracasShort.mp3');
  soundA.setVolume(1.0);
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
  posit = new POS.Posit(40, width);
  console.log(posit);
}


function setup() {

  userStartAudio();

  console.log("setup: "+getAudioContext().state);

  // if(windowHeight > windowWidth){
  //   widthCanv = windowWidth;
  //   heightCanv = windowWidth * 1.5;
  // }else {
  //   widthCanv = windowHeight;
  //   heightCanv = windowHeight * 1.5;
  // }
  console.log("canvas width: "+widthCanv);
  console.log("canvas height: "+heightCanv);
  // canvas = createCanvas((windowWidth/3)*2, (windowHeight/3)*2);
  canvas = createCanvas(widthCanv, heightCanv);
  canvas.parent("canvas");

  div = select("#canvas");

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
    // console.log("startButtonPressed: "+getAudioContext().state);
  }

  isStarted = true;
  div.attribute("aria-disabled", "false");
}

function pauseVideo(){
  if(getAudioContext().state !== "suspended"){
    getAudioContext().suspend();
    // console.log("stopButtonPressed: "+getAudioContext().state);
  }
  isStarted = false;

  if(soundA.isPlaying()){
    soundA.stop();
  }
  div.attribute("aria-disabled", "true");
}

function drawCorners(markers){
  var corners, corner, i, j;

  for (i = 0; i !== markers.length; ++ i){
    // console.log(markers[i]);
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
    // console.log(centrex+" "+centrey);
    strokeWeight(1);
    point(centrex, centrey);

    text(markers[i].id, xMin, yMin);
  }
}

function changeVolume(pose){

  // console.log("pose: "+pose);
  var z = pose.bestTranslation[2];
  console.log("z: "+z);
  var newVolume = norm(z, 100, 1000);
  // var newVolume = map(z, 100, 2000, 1, 0);
  newVolume = 1 - (Math.round(newVolume * 10) / 10)
  var playbackRate = map(z, 100, 1000, 2, 0);
  playbackRate = constrain(playbackRate, 0.01, 4);

  console.log(newVolume);
  // console.log(playbackRate);

  soundA.setVolume(newVolume);
  soundA.rate(playbackRate);
  if(!soundA.isPlaying()){
    soundA.play();
  }
}


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
    // console.log(currentImage);
    image(currentImage, 0, 0);
    markers = detector.detectImage(width, height, currentImage.pixels);
    // console.log(markers);
    if(markers.length > 0){
      //I am interested only in markers with ID == 2, so I filter by ID
      for (i = 0; i !== markers.length; ++ i){
        var markerId = markers[i].id;
        if(markerId === 2){
          ismarked = true;
          pose = posit.pose(markers[i].corners);
        }
      }
    }
    if(ismarked){
      drawCorners(markers);
      drawId(markers);
      changeVolume(pose);
      // if(!soundA.isPlaying()){
      //   soundA.play();
      // }
      ismarked = false;
    }
    // else{
    //   if(soundA.isPlaying()){
    //     console.log("here");
    //     soundA.stop();
    //   }
    // }
  }else{
    background(255);
  }
  //image(video, 0, 0, 320, 240);
  //fill(255);
  //textSize(16);

  // text(value, 10, height - 10);

}
