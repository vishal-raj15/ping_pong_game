const cnvs = document.getElementById("ping");
const ctx = cnvs.getContext("2d") ;
cnvs.height = window.innerHeight;

cnvs.width = window.innerWidth;


const user = {
    x:0,
    y:cnvs.height/2 - 50,
    width:10,
    height:150,
    color:"WHITE",
    score:0
}

const comp = {
    x:cnvs.width - 30,
    y:cnvs.height/2 - 50,
    width:10,
    height:150,
    color:"WHITE",
    score:0
}

const ball = {
    x:cnvs.width/2,
    y:Math.random()*cnvs.height/2,
    radius:10,
    speed:5,
    vx:5,
    vy:5,
    color:"WHITE"

}

const ball2 = {
    x:cnvs.width/2,
    y: Math.random()*cnvs.height,
    radius:10,
    speed:5,
    vx:50,
    vy:50,
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
    ball.y = Math.random()*cnvs.height;
    ball.speed = 5;
    ball.vx = 5;
    ball.vy=5;
}

function update()
{
    ball.x += ball.vx;
    ball.y += ball.vy;

    let cl = 0.4;
    comp.y += (ball.y - (comp.y + comp.height/2))*cl; 

    if(ball.y + ball.radius > cnvs.height || ball.y + ball.radius < 0)
    {
        ball.vy = -ball.vy;
    }  

    let player = (ball.x < cnvs.width/2)?user:comp;
    if(collision(ball,player)){
        ball.vx = -ball.vx;

        let colldpnt = ball.y - (player.y + player.height/2);

        colldpnt = colldpnt/(player.height/2);
        let ang = colldpnt * Math.PI/4;
        let dir = (ball.x < cnvs.width/2) ? 1 : -1;
        ball.vx = dir * ball.speed * Math.cos(ang);
        ball.vy = ball.speed * Math.sin(ang);
        ball.speed += 1;
        
    }
    if(ball.x + ball.radius< 0 || (ball.x.radius<0 && ball.y > cnvs.height)){
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
 

}

function game()
{
    update();
    render();
}

const framePerSecond = 50;
setInterval(game , 1000/framePerSecond);
