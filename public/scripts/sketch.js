var socket = io();
var scribble = new Scribble();
var systems;


function setup() {
  createCanvas(windowWidth, windowHeight);

  background( 255 );
  stroke( 0 );
  strokeWeight( 1 );
  systems = [];

  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
	  particlePush(data.x, data.y);

    }
  );
}

function draw() {
  background(255);
  background(255);
  for (i = 0; i < systems.length; i++) {
    systems[i].run();

  }
  if (systems.length==0) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("click mouse to add particle systems", width/2, height/2);
  }
}

function particlePush(x,y){
    this.p = new ParticleSystem(createVector(x, y));
  systems.push(p);
  if(systems.length > 2){
	systems.shift();
  }
}

function mousePressed() {
  particlePush(mouseX,mouseY);
  sendmouse(mouseX,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}



// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255.0;
  
  
  this.seed = Math.random()*1000000;
  randomSeed( this.seed );
  
  this.scale = 0.5;
  this.faceWidth = random(100,200) * this.scale;
  this.faceHeight = random(120,230) * this.scale;
  this.eyeWidth = random(20,40) * this.scale;
  this.eyeHeight = random(8,15) * this.scale;
  this.pupilWidth = random(5,20) * this.scale;
  this.pupilHeight = random(5,15) * this.scale;
  this.noseNum = random(1,4);
  this.noseRnd = random(5,20);
  this.hairNum = random(1,4);
  
  
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function () {
	
  //stroke(200, this.lifespan);
  //strokeWeight(2);
	face(this);
  //scribble.scribbleEllipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  // Add either a Particle or CrazyParticle to the system
  p = new Particle(this.origin);
  this.particles.push(p);
};

ParticleSystem.prototype.run = function () {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
  if (this.particles.length < 1){
	  	this.addParticle();
  }
};






function face(particle){


  randomSeed( particle.seed );
  outline(particle);
  eye(particle); 
  pupil(particle);
  mouth1(particle);
  eyebrows(particle);
  AllTheNoses(particle);
  AllTheHairs(particle);
}

function outline(particle){

  this.position = particle.position.copy();	
  noFill(0);
  strokeWeight( 1 );
  faceWidth = particle.faceWidth;
  faceHeight = particle.faceHeight;
  
  scribble.bowing = random(1,8);    
  scribble.roughness = random(1,3);
  scribble.numEllipseSteps = 5;
  scribble.maxOffset = random(1,5);  
  scribble.scribbleEllipse( this.position.x, this.position.y, faceWidth, faceHeight );
}

function eye(particle){
  this.position = particle.position.copy();
  noFill(0);
  var eyeWidth = particle.eyeWidth;
  var eyeHeight = particle.eyeHeight;
  var x = random(30,45) * particle.scale;

  scribble.roughness = (1);
  scribble.scribbleEllipse( this.position.x-x, this.position.y-2 * particle.scale, eyeWidth, eyeHeight );
  scribble.scribbleEllipse( this.position.x+x, this.position.y-2 * particle.scale, eyeWidth, eyeHeight );
}

function pupil(particle){
  this.position = particle.position.copy();
  var pupilWidth = particle.pupilWidth;
  var pupilHeight = particle.pupilHeight;
  var x = random(30,40)* particle.scale;
  
  fill(0);
  scribble.roughness = (1);
  scribble.scribbleEllipse( this.position.x-x, this.position.y-2 * particle.scale, pupilWidth, pupilHeight );
  scribble.scribbleEllipse( this.position.x+x, this.position.y-2 * particle.scale, pupilWidth, pupilHeight );
}

function mouth1(particle){
  this.position = particle.position.copy();
  var x = random(5,30) * particle.scale;
  var y = random(5,10) * particle.scale;
  
  fill(0);
  scribble.roughness = (1);
  scribble.roughness = (1);
  scribble.scribbleEllipse( this.position.x, this.position.y + (50 * particle.scale), x, y );
}


function eyebrows(particle){
  this.position = particle.position.copy()
  var x = random(10,40) * particle.scale;
  var y = random(2,10) * particle.scale;

  scribble.bowing = random(1,3);    
  scribble.roughness = random(1,2);
  scribble.numEllipseSteps = 5;
  scribble.scribbleRect( this.position.x-(35* particle.scale), (this.position.y)-(30 * particle.scale), x, y );
  scribble.scribbleRect( this.position.x+(35* particle.scale), (this.position.y)-(30 * particle.scale), x, y );
  
  
 
}

function nose1(particle){
  this.position = particle.position.copy()	
  noFill();
  var x = particle.noseRnd;
  
  scribble.roughness = (1);
  scribble.scribbleCurve( this.position.x, (this.position.y)-(x* particle.scale), this.position.x-(2* particle.scale), (this.position.y)+(30* particle.scale), this.position.x-(3* particle.scale), (this.position.y)+(30* particle.scale), this.position.x+(3* particle.scale), (this.position.y)+(30* particle.scale) );
}

function nose2(particle){
  this.position = particle.position.copy()	
  var x = particle.noseRnd;
  
  scribble.roughness = (1);
  scribble.scribbleCurve( this.position.x, (this.position.y)-x, this.position.x-(10* particle.scale), (this.position.y)+(30* particle.scale), this.position.x-(3* particle.scale), (this.position.y)+(30* particle.scale), this.position.x+(3* particle.scale), (this.position.y)+(30* particle.scale) );
}

function nose3(particle){
  this.position = particle.position.copy()
  var x = particle.noseRnd;
  
  scribble.roughness = (1);
  scribble.scribbleCurve( this.position.x, (this.position.y)-x, this.position.x-(20* particle.scale), (this.position.y)+(40* particle.scale), this.position.x-(3* particle.scale), (this.position.y)+(30* particle.scale), this.position.x+(20* particle.scale), (this.position.y)+(40* particle.scale) );
}

function AllTheNoses(particle){
  this.position = particle.position.copy()
var ranNum = particle.noseNum;
//console.log(ranNum);
if(ranNum <= 2){
  nose1(particle);
}

else if(ranNum <= 3){
  nose2(particle);
}

else{
  nose3(particle);
}
}

function AllTheHairs(particle){
  this.position = particle.position.copy()
  var ranNum = particle.hairNum;

if(ranNum <= 2){
  hair1(particle);
}

else if(ranNum <= 3){
  hair2(particle);
}

else{
  bangs(particle);
}
  
}

function hair1(particle){
  this.position = particle.position.copy()
  scribble.bowing = random(1,8);    
  scribble.roughness = random(1,10);
  scribble.numEllipseSteps = 5;
  scribble.maxOffset = random(1,5);  
  var hairLength = random(10,300);
  var howMuch = random(1,20);
  for( var i=0; i<howMuch;i++){
  scribble.scribbleLine( this.position.x,((this.position.y)-(faceHeight/2)), this.position.x, this.position.y - (hairLength* particle.scale) );
  }
}
  
  function hair2(particle){
  this.position = particle.position.copy()
  scribble.bowing = random(1,50);
  scribble.roughness = random(1,20);
  scribble.maxOffset = random(1,50);  
  var hairLength = random(10,200);
  var howMuch = random(1,10);
  var position = random(200,300);
  var long = random(30,300);
  for( var i=0; i<howMuch;i++){
  scribble.scribbleCurve( this.position.x,((this.position.y)-(faceHeight/2)),this.position.x-(200* particle.scale), (this.position.y)+(long* particle.scale), this.position.x-(200* particle.scale), (this.position.y)+(100* particle.scale), this.position.x-(200* particle.scale), (this.position.y)+(200* particle.scale));
  scribble.scribbleCurve( this.position.x,((this.position.y)-(faceHeight/2)),this.position.x +(200* particle.scale), (this.position.y)+(long* particle.scale), this.position.x+(200* particle.scale), (this.position.y)+(100* particle.scale), this.position.x+(200* particle.scale), (this.position.y)+(200* particle.scale));
  }
  }
  
  function bangs(particle){
  this.position = particle.position.copy()
  scribble.bowing = random(1,5);
  scribble.roughness = random(1,10);
  scribble.maxOffset = random(1,5);  
  var long = random(20,200);
  
  var hairLength = random( 10,150 );
  var howMuch = random(1,10);
  for( var i=0; i<howMuch;i++){
  scribble.scribbleLine( this.position.x,((this.position.y)-(faceHeight/2)), this.position.x, this.position.y - (hairLength* particle.scale) );
  scribble.scribbleCurve( this.position.x,((this.position.y)-(faceHeight/2)),this.position.x-(300* particle.scale), (this.position.y)+(long* particle.scale), this.position.x-(300* particle.scale), (this.position.y)+(100* particle.scale), this.position.x-(300* particle.scale), (this.position.y)+(300* particle.scale));
  scribble.scribbleCurve( this.position.x,((this.position.y)-(faceHeight/2)),this.position.x +(300* particle.scale), (this.position.y)+(long* particle.scale), this.position.x+(300* particle.scale), (this.position.y)+(100* particle.scale), this.position.x+(300** particle.scale), (this.position.y)+(300* particle.scale));
  }
  
  
}

















