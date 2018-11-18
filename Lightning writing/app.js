window.addEventListener('load', function(){
	var collection=[],
  down=false,
  maxLightning = 15,
  minLightning = 5,
  usedMax = minLightning,
  branchesConcentration = 0.1;

    const canvas    = document.getElementById( 'canvas' );
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight; 
    const ctx       = canvas.getContext("2d");

var inputs = document.getElementsByTagName('input');
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('input', function(){
    if(this.id === "branchesConcentration"){
      var n = Number(this.value);
      if(n <=0.5 && n >= 0 && this.value){
        branchesConcentration = n;
      }else{
        branchesConcentration = 0.1
      }
    }
    else if(this.id === "maxLightning"){
      var n = Number(this.value);
      if(n >= 1 && this.value){
        maxLightning = n;
      }else{
        maxLightning = 15;
      }
      if(collection.length/5 > usedMax && collection.length/5 < maxLightning){
        usedMax = Math.floor(collection.length/5)
      }else{
        usedMax = maxLightning;
      }
    }
    else if(this.id === "minLightning"){
      var n = Number(this.value);
      if(n >= 0 && this.value){
        minLightning = n;
      }else{
        minLightning = 5;
      }
    }
  })
}

animate();


canvas.addEventListener('mousemove', function(evt){
  if(down){
    var {x , y} = getMousePos(this, evt);
    collection.push({x: x, y: y});
    if(collection.length/5 > usedMax && collection.length/5 < maxLightning){
      usedMax = Math.floor(collection.length/5)
    }else{
      usedMax = maxLightning;
    }
  }
});

canvas.addEventListener('mouseup', function(evt){
  down = false;
});
canvas.addEventListener('mousedown', function(evt){
  down = true;
});


function getMousePos(c, evt) {
	var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function animate() {
		requestAnimationFrame( animate );
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let lightning = Math.round(Math.random()*(usedMax - minLightning) + minLightning);
    if(collection.length > 0){
      for (let i = 0; i < collection.length; i++) {
        new LightningWriting(canvas, ctx, collection[i].x, collection[i].y, "rgb("+ 200 +", "+ 200 +", "+ 255 +")").draw()
      }
      for(let j=0; j<lightning; j++){
        let random = Math.round(Math.random()*(collection.length - 1));
        new LightningStrike(canvas, ctx, collection[random].x, collection[random].y, "rgb("+ 100 +", "+ 100 +", "+ 255 +")", branchesConcentration).draw()
      }
    }
}
});


//CLASS

class LightningStrike {
  constructor(canvas, ctx, x, y, color, branchesConcentration) {
    this.canvas = canvas
    this.ctx = ctx

    this.color = color
    this.x = x
    this.y = y

    this.strikeLimit = {min: 1, max: 1} // Per point

    this.date = Date.now()

    this.lightning = new Array(Math.round(Math.random()*(this.strikeLimit.max-this.strikeLimit.min)+this.strikeLimit.min)).fill(0).map(()=>{
      var l = new Lightning(this.canvas, this.ctx, this.x, this.y, this.color, branchesConcentration);
      return [l, ...l.collection]
    }).flat()
  }

  draw() {
    this.ctx.globalCompositeOperation = 'lighter'
    this.fillStyle = this.color;
    this.ctx.beginPath();

    for (var i = 0; i < this.lightning.length; i++) {
      this.lightning[i].draw();
    }
    this.ctx.stroke();
    this.ctx.closePath();

  }
}

class Lightning {
  constructor(canvas, ctx, x, y, color, branchesConcentration) {
    this.canvas = canvas
    this.ctx = ctx

    this.color = color
    this.x = x
    this.y = y
    this.branchesConcentration = branchesConcentration;
    this.targety = this.y + (Math.random()<5 ? 1 : -1)*((Math.random() * (400 - 200)) + 200)


    this.points = [{x: this.x, y: this.y}]

    this.lineWidth = 1.6
    this.collection = [];


    var i = this.points.length;
    while(this.points[this.points.length-1].y < this.targety){
      let c = ((Math.random() * (20 - 5)) + 5);
      let x = (Math.random()<0.5 ? 1 : (-1))*((Math.random() * (5 - 1)) + 1)
      for (let j = 0; j < c; j++) {
        let y = ((Math.random() * (6 - 1)) + 1);
        this.points[i] = {x: (this.points[i-1].x+x), y: 0};
        this.points[i].y = this.points[i-1].y + y;
        i++;
        if(this.points[this.points.length-1].y >= this.targety){
           this.points[this.points.length-1].y=this.targety;
           break;
        }
      }
    }
    for (let i = 0; i < this.points.length-1; i++) {
      if(Math.random() < branchesConcentration){
        this.collection.push(new LightningBranches(this.canvas, this.ctx, this.points[i].x, this.points[i].y, "rgb("+ 140 +", "+ 140 +", "+ 255 +")"))
      }
    }

  }

  draw() {

    this.ctx.strokeStyle = this.color
    this.ctx.shadowColor = this.color
    this.ctx.shadowBlur = 30
    this.ctx.lineWidth = this.lineWidth

    for (let i = 0; i < this.points.length-1; i++) {
      this.ctx.moveTo(this.points[i].x, this.points[i].y);
      this.ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
    }
    this.ctx.stroke();
  }
}

class LightningBranches {
  constructor(canvas, ctx, x, y, color) {
    this.canvas = canvas
    this.ctx = ctx

    this.color = color
    this.x = x
    this.y = y

    this.deriction = 1 //Math.random()<0.5 ? 1 : (-1)

    this.targety = this.y + this.deriction*((Math.random() * (70 - 50)) + 50)

    this.points = [{x: this.x, y: this.y}]

    this.lineWidth = 0.7
  }

  draw() {

    this.ctx.strokeStyle = this.color
    this.ctx.shadowColor = this.color
    this.ctx.shadowBlur = 30
    this.ctx.lineWidth = this.lineWidth

    var i = this.points.length;
    while((this.points[this.points.length-1].y < this.targety && this.deriction>0) || (this.points[this.points.length-1].y > this.targety && this.deriction<0)){
      let c = ((Math.random() * (20 - 5)) + 5);
      let x = (Math.random()<0.5 ? 1 : (-1))*((Math.random() * (5 - 1)) + 1)
      for (let j = 0; j < c; j++) {
        let y = ((Math.random() * (6 - 2)) + 2);
        this.points[i] = {x: (this.points[i-1].x+x), y: 0};
        this.points[i].y = this.points[i-1].y + y*this.deriction;
        i++;
        if((this.points[this.points.length-1].y >= this.targety && this.deriction>0) || (this.points[this.points.length-1].y <= this.targety && this.deriction<0)){
           this.points[this.points.length-1].y=this.targety;
           break;
        }
      }
    }


    for (let i = 0; i < this.points.length-1; i++) {
      this.ctx.moveTo(this.points[i].x, this.points[i].y);
      this.ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
    }
  }
}


class LightningWriting {
  constructor(canvas, ctx, x, y, color) {
    this.canvas = canvas
    this.ctx = ctx

    this.color = color
    this.x = x
    this.y = y
  }

  draw() {
    this.ctx.globalCompositeOperation = 'lighter'
    this.ctx.strokeStyle = this.color
    this.ctx.shadowColor = this.color
    this.ctx.shadowBlur = 10
    
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0 ,2*Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

