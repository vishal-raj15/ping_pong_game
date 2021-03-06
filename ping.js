const cnvs = document.getElementById("ping");
const ctx = cnvs.getContext("2d") ;
cnvs.height = window.innerHeight;

cnvs.width = window.innerWidth;

var aud = new Audio("tree.mp3");

const user = {
    x:cnvs.width*0.03,

    y:cnvs.height/2 ,
    width:10,
    height:cnvs.height/4,
    color:"red",
    score:0
}

const comp = {
    x:cnvs.width*0.97,
    y: user.y,
    width:10,
    height:cnvs.height/4,
    color:"WHITE",
    score:0
}

const ball = {
    x:cnvs.width/2,
    y:cnvs.height/2,
    radius:10,
    speed:7,
    vx:2,
    vy:0,
    color:"WHITE"

}

const net ={
    x:cnvs.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"WHITE"
}

function drawnet()
{
    for(let i=0 ; i<= cnvs.height ; i+=15)
    {
        drawrect(net.x , net.y + i , net.width , net.height , net.color);
    }
}

function constraint(y_max , y_min){
    
}

function drawrect(x,y,w,h,color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

drawrect(0,0,cnvs.width , cnvs.height , "Black");

function drawcir(x,y,r,color)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2 , false);
    ctx.closePath();
    ctx.fill();

}

function drawtext(text,x,y,color)
{
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y);
}

cnvs.addEventListener("mousemove",movepaddle);

function movepaddle(evt)
{
    let rect = cnvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top-user.height/2;
}

document.onkeydown =keypress;

function keypress(key){
	if(key.keyCode == "38" && user.y>=0){

		user.y -= 20; 
	}
	if(key.keyCode == "40"  && user.y <= cnvs.height){
		user.y += 20;
	}
}


function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x -b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y+p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right>p.left && b.bottom>p.top && b.left < p.right
    && b.top < p.bottom;
}
function reset(){
    ball.x = cnvs.width/2;
    ball.y = Math.random()*cnvs.height/2;
    ball.speed = 7;
    ball.vx = 4;
    ball.vy=4;
}

function update()
{

    ball.x += ball.vx;
    ball.y += ball.vy;

    let cl = 0.1;
    comp.y += (ball.y - (comp.y + comp.height/2))*cl; 

    if(ball.y + ball.radius > cnvs.height || ball.y + ball.radius < 20)
    {
        ball.vy = -ball.vy;
    }  

    let player = (ball.x < cnvs.width/2)?user:comp;
    if(collision(ball,player)){
    	aud.play();
        ball.vx = -ball.vx;
        

        let colldpnt = ball.y - (player.y + player.height/2);

        colldpnt = colldpnt/(player.height/2);
        let ang = colldpnt * Math.PI/4;
        let dir = (ball.x < cnvs.width/2) ? 1 : -1;
        ball.vx = dir * ball.speed * Math.cos(ang);
        ball.vy = ball.speed * Math.sin(ang);
        ball.speed += 0.1;
        
    }
    if(ball.x + ball.radius< 5){
        reset();
        comp.score+=1;
    }
    if(ball.x > cnvs.width){
        reset();
        user.score+=1;
    }


}

function render()
{

    drawrect(0,0,cnvs.width , cnvs.height,"BLACK");
    drawrect(user.x , user.y , user.width,user.height , "WHITE");
    drawrect(comp.x , comp.y , comp.width,comp.height , "WHITE");

    drawnet();
    drawcir(ball.x,ball.y , ball.radius,ball.color);
   // drawcir(ball2.x,ball2.y , ball2.radius,ball2.color);

    drawtext( user.score , cnvs.width/4 , cnvs.height/5,"WHITE");

    drawtext(comp.score , 3*cnvs.width/4 , cnvs.height/5 ,"WHITE");
 
    //keypress(key);
}

function game()
{
    update();
    render();
}

const framePerSecond = 100;
setInterval(game , 1000/framePerSecond);
