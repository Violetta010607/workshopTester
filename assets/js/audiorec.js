let mic, recorder;
let soundFile, soundStart, soundEnd, soundDownload;
let stateRecording = 0;

var recordButton;
var downloadButton;
// var timer;
// var player, audioRecord;


function preload() {
  soundFormats('mp3');
  soundStart = loadSound('assets/js/sounds/RecordStart.mp3');
  soundEnd = loadSound('assets/js/sounds/RecordEnd.mp3');
  soundDownload = loadSound('assets/js/sounds/download.mp3');
}

function setup() {
  //let cnv = createCanvas(100, 100);
  recordButton = select("#recordButton");
  recordButton.mousePressed(canvasPressed);

  downloadButton = select("#downloadButton");
  downloadButton.mousePressed(downloadPressed);

  // player = select("#player");
  // audioRecord = select('#audioSrc');

  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

  //text('tap to record', width/2, height/2);
}

function canvasPressed() {
  // ensure audio is enabled
  userStartAudio();

  console.log(stateRecording);

  // make sure user enabled the mic
  if (stateRecording === 0 && mic.enabled) {
    console.log("if true")
    console.log(stateRecording+" start recording");
    // record to our p5.SoundFile
    recordButton.style('background-color','#dc3545');
    recordButton.html('Stop');

    soundStart.play();

    recorder.record(soundFile);
    stateRecording++;

  }
  else if (stateRecording === 1) {
    console.log(stateRecording +" stop recording");
    recordButton.style('background-color','#0ea0ff');
    recordButton.html('Record');

    soundEnd.play();

    recorder.stop();
    stateRecording++;


    // stop recorder and
    // send result to soundFile

  }

  // else if (stateRecording === 2) {
  //   console.log(stateRecording+" save recording");
  //
  //   soundFile.play(); // play the result!
  //   save(soundFile, 'reflection-activity01.wav');
  //   // audioRecord.src = soundFile;
  //   // player.play();
  //   stateRecording = 0;
  // }
}

function downloadPressed(){
  userStartAudio();
  if (stateRecording === 2) {
    console.log(stateRecording+" save recording");
    soundDownload.play();
    soundFile.play(); // play the result!
    save(soundFile, 'reflection-activity01.wav');
    // audioRecord.src = soundFile;
    // player.play();
    stateRecording = 0;
  }
}

function draw() {
  // background(220);
}
