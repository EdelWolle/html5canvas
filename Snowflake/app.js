window.addEventListener('load', function(){
	var collection=[];

    const canvas    = document.getElementById( 'canvas' );
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight; 
    const ctx       = canvas.getContext("2d");


animate();





function getMousePos(c, evt) {
	var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function animate() {
		//requestAnimationFrame( animate );
    setTimeout(animate, 50);
    var point = {x: -10, y: -10};
    if(Math.random()<0.5){
      point.x = Math.round(Math.random()*canvas.width);
    }else{
      point.y = Math.round(Math.random()*canvas.height);
    }
    collection.push(new Snowflake(canvas, ctx, point.x, point.y, "rgb("+ 255 +", "+ 255 +", "+ 255 +")"));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deja=false, l=0;

    for (let i = 0; i < collection.length; i++) {
      collection[i].draw()
      if(collection[i].x <= collection[i].canvas.width && collection[i].y <= collection[i].canvas.height && !deja){
        l = i;
        deja = true;
      }
    }
    collection.splice(0, l);
}
});

class Snowflake {
  constructor(canvas, ctx, x, y, color) {
    this.canvas = canvas
    this.ctx = ctx

    this.color = color
    this.maxSize = (Math.random() * (40 - 10)) + 10
    this.x = x
    this.y = y

    this.dx = (Math.random() * (5 - 2)) + 2;

    this.size = 0.3
    this.lineWidth = 0.2
  }

  draw() {
    this.size *= this.size < 0.6 ? 1.005 : 1
    this.lineWidth *= this.lineWidth < 0.5 ? 1.005 : 1

    this.x += this.dx; 
    this.y += this.dx;

    this.ctx.globalCompositeOperation = 'lighter'
    this.ctx.strokeStyle = this.color
    this.ctx.shadowColor = this.color
    this.ctx.shadowBlur = 10
    this.ctx.lineWidth = this.lineWidth

    this.ctx.beginPath();

    this.ctx.moveTo(this.x, this.y - this.size*30);
    this.ctx.lineTo(this.x, this.y + this.size*30);
       this.ctx.moveTo(this.x, this.y - this.size*15);
       this.ctx.lineTo(this.x - this.size*10, this.y - this.size*25);
       this.ctx.moveTo(this.x, this.y - this.size*15);
       this.ctx.lineTo(this.x + this.size*10, this.y - this.size*25);
       //
       this.ctx.moveTo(this.x, this.y + this.size*15);
       this.ctx.lineTo(this.x - this.size*10, this.y + this.size*25);
       this.ctx.moveTo(this.x, this.y + this.size*15);
       this.ctx.lineTo(this.x + this.size*10, this.y + this.size*25);

    this.ctx.moveTo(this.x - this.size*30, this.y - this.size*20);
    this.ctx.lineTo(this.x + this.size*30, this.y + this.size*20);
       this.ctx.moveTo(this.x - this.size*15, this.y - this.size*10);
       this.ctx.lineTo(this.x - this.size*20, this.y - this.size*23);
       this.ctx.moveTo(this.x - this.size*15, this.y - this.size*10);
       this.ctx.lineTo(this.x - this.size*29, this.y - this.size*8);
       //
       this.ctx.moveTo(this.x + this.size*15, this.y + this.size*10);
       this.ctx.lineTo(this.x + this.size*18, this.y + this.size*24);
       this.ctx.moveTo(this.x + this.size*15, this.y + this.size*10);
       this.ctx.lineTo(this.x + this.size*30, this.y + this.size*7);

    this.ctx.moveTo(this.x - this.size*30, this.y + this.size*20);
    this.ctx.lineTo(this.x + this.size*30, this.y - this.size*20);
       this.ctx.moveTo(this.x - this.size*15, this.y + this.size*10);
       this.ctx.lineTo(this.x - this.size*19, this.y + this.size*24);
       this.ctx.moveTo(this.x - this.size*15, this.y + this.size*10);
       this.ctx.lineTo(this.x - this.size*29, this.y + this.size*8);
       //
       this.ctx.moveTo(this.x + this.size*15, this.y - this.size*10);
       this.ctx.lineTo(this.x + this.size*20, this.y - this.size*25);
       this.ctx.moveTo(this.x + this.size*15, this.y - this.size*10);
       this.ctx.lineTo(this.x + this.size*30, this.y - this.size*8);

    this.ctx.stroke();
  }
}

