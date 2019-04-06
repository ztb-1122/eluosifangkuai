
 Spacing=20;
 NoShape=0;
 ZShape=1;
 Sshape=2;
 LineShape=3;
 Tshape=4;
 SquareShape=5;
 LShape=6;
 MirroredLShape=7;
 Colors=["pink",'fuchsia',"#cff","red","orange","aqua","green","yellow"];
 Shapes=[
 [[0,-1],[0,0],[-1,0],[-1,1]],
 [[0,-1],[0,0],[1,0],[1,1]],
 [[0,-1],[0,0],[-1,0],[-1,1]],
 [[0,-1],[0,0],[0,1],[0,2]],
 [[-1,0],[0,0],[1,0],[,01]],
 [[0,0],[1,0],[0,1],[1,1]],
  [[-1,-1],[0,-1],[0,0],[0,1]],
  [[1,-1],[0,-1],[0,0],[0
  ,1]]               
 ];



function Block(){
	//this.data=[[],[],[],[]];
}
Block.prototype.Block=function(){
	this.born();
}

Block.prototype.born=function(){
	this.shape_id=Math.floor(Math.random()*7)+1;
	this.data=Shapes[this.shape_id];
	this.color=Colors[this.shape_id];
	//console.log(this.data);
}

Block.prototype.translate=function(row,col){
	var copy=[];
	for(var i=0;i<4;i++){
		var temp={};
		temp.row=this.data[i][1]+row;
		temp.col=this.data[i][0]+col;
		copy.push(temp);
	}
	return copy;
}

Block.prototype.rotate=function(){
	var copy=[[],[],[],[]];
	for(var i=0;i<4;i++){
		copy[i][0]=this.data[i][1];
		copy[i][1]=-this.data[i][0];
	}
	return copy;
}
function Map(w,h){
	this.width=w;
	this.height=h;
	this.lines=[];
	for(var row=0;row<h;row++){
		this.lines[row]=this.newLine();
	}

}

Map.prototype.newLine=function(){
	var shapes=[];
	for(var col=0;col<this.width;col++){
		shapes[col]=NoShape;
	}
	return shapes;
}

Map.prototype.isFullLine=function(row){
     var line=this.lines[row];
     for(var col=0;col<this.width;col++){
     	if(line[col]==NoShape){
     		return false;
     	}
     }
     return true;
}


Map.prototype.isCollide=function(data){
	for(var i=0;i<4;i++){
		var row=data[i].row;
		var col=data[i].col;
		//console.log(row,col);
		if(col<0||col==this.width) return true;
		if(row==this.height) return true;
		if(row<0){continue;
		}else{
			if(this.lines[row][col]!=0)
				return true;
		}

	}
	return false;
}


Map.prototype.appendShape=function(shape_id,data){
	for(var i=0;i<4;i++){
		var row=data[i].row;
		var col=data[i].col;
		this.lines[row][col]=shape_id;
	}
	for(var row=0;row<this.height;row++){
		if(this.isFullLine(row)){
			onClearRow(row);
			this.lines.splice(row,1);
			this.lines.unshift(this.newLine());
		}
	}

}



function GameModel(w,h){
	this.map=new Map(w,h);
	this.currentBlock=new Block();
	this.currentBlock.Block();
	this.row=1;
	this.col=Math.floor(this.map.width/2);
	this.nextBlock=new Block();
	this.nextBlock.Block();
//	onUpdate();
}
                                                                                         
GameModel.prototype.CreateNewBlock=function(){
	this.currentBlock=this.nextBlock;
	this.row=1;
	this.col=Math.floor(this.map.width/2);
	this.nextBlock=new Block();
	this.nextBlock.Block();
}
GameModel.prototype.left=function(){
	this.col--;
	var temp=this.currentBlock.translate(this.row,this.col);
	if(this.map.isCollide(temp)){
		this.col++;
	}else{
		onUpdate();
	}
}

GameModel.prototype.right=function(){
	this.col++;
	var temp=this.currentBlock.translate(this.row,this.col);
	if(this.map.isCollide(temp)){
		this.col--;
	}else{
		onUpdate();
	}
}

GameModel.prototype.rotate=function(){
	if(this.currentBlock.shape_id==SquareShape) return;
	var copy=this.currentBlock.rotate();
	var temp=this.currentBlock.translate(this.row,this.col);
	if(this.map.isCollide(temp)){
		return;
	}
	this.currentBlock.data=copy;
	onUpdate();
}


GameModel.prototype.down=function(){
    var old=this.currentBlock.translate(this.row,this.col);
    this.row++;
    var temp=this.currentBlock.translate(this.row,this.col);
    if(this.map.isCollide(temp)){
       this.row--;
       if(this.row==1){
       	onGameOver();
       	return;
       }
       this.map.appendShape(this.currentBlock.shape_id,old);
       this.CreateNewBlock();
    }
  //  console.log(11);
    //return;
    onUpdate();
}

var display=document.getElementById("html5_09_01");
var display2=document.getElementById("html5_09_02");
var model=null;
var loop_interval=null;
var tick_interval=null;
var waiting=false;
var speed=500;
var score=0;
var textmsg=document.getElementById("textmsg");

function start(){
	//console.log(display.offsetWidth);
    model=new GameModel(display.offsetWidth/Spacing,display.offsetHeight/Spacing);
  // console.log(model);
   //return;
   window.onkeydown=function(e){
	onKeyPress(e);
}

    loop();
}


function pause(){
	waiting=!waiting;
	if(waiting){
		document.getElementById("btnPause").value="继续";
	}else{
		document.getElementById("btnPause").value="暂停";
	}
}

function loop(){
	tick_interval=setInterval(function(){
       if(waiting) return;
       onTick();
	},speed);
}
function onUpdate(){
	paint();
}

function onClearRow(row){
	clearline(row);
	score=score+10;
	textmsg.innerHTML=score+"分";
}


function onGameOver(){
	//alert("Game Over");
	clearInterval(tick_interval);
	alert("游戏结束");
}

function onTick(){
	model.down();
}

function onKeyPress(evt){
   evt.preventDefault();
  // console.log(evt.keyCode);
   switch(evt.keyCode){
   	case 37:model.left();break;
   	case 39:model.right();break;
   	case 38:model.rotate();break;
   	case 40:model.down();break;

   }
}


function clearline(row){
	clearInterval(tick_interval);
	speed=speed-10;
	loop();
	waiting=true;
	var ctx=display.getContext("2d");
	ctx.fillRect(0,row*Spacing,display.width,Spacing,"black");
	setTimeout("waiting=false",50);
}


function paint(){
   //  console.log(typeof(model));
	//console.log(model.hasOwnProperty(currentBlock));
	//return;
	var map=model.map;
	//console.log(model.map);

	//return;
	
	var data=model.currentBlock.translate(model.row,model.col);
	var nextdata=model.nextBlock.translate(1,2);
	//console.log(display);
	//console.log(display.getContext);
	//return;
	var ctx=display.getContext("2d");
	//console.log(ctx);
	//return;
	var ctx2=display2.getContext("2d");
	ctx.clearRect(0,0,display.width,display.height);
	ctx2.clearRect(0,0,display2.width,display2.height);
	var lines=map.lines;
	for(var row=0;row<map.height;row++){
		for(var col=0;col<map.width;col++){
			var shape_id=lines[row][col];
			if(shape_id!=NoShape){
				var y=row*Spacing;
				var x=col*Spacing;
				var color=Colors[shape_id];
				var ctx=display.getContext("2d");
				ctx.fillStyle="rgba(255,255,255,0.2)";
				ctx.fillRect(x,y,Spacing,Spacing);
				ctx.fillStyle=color;
				ctx.fillRect(x+1,y+1,Spacing-2,Spacing-2);
			}
		}
	}


	for(var i=0;i<4;i++){
		var y=data[i].row*Spacing;
		var x=data[i].col*Spacing;
		var color=model.currentBlock.color;
		var ctx=display.getContext("2d");
		ctx.fillStyle="rgba(255,255,255,0.2)";
		ctx.fillRect(x,y,Spacing,Spacing);
		ctx.fillStyle=color;
		ctx.fillRect(x+1,y+1,Spacing-2,Spacing-2);
	}

	for(var i =0;i<4;i++){
		var y=nextdata[i].row*Spacing;
		var x=nextdata[i].col*Spacing;
		var color=model.nextBlock.color;
		var ctx2=display2.getContext("2d");
		ctx2.fillStyle="rgba(255,255,255,0.2)";
		ctx2.fillRect(x,y,Spacing,Spacing);
		ctx2.fillStyle=color;
		ctx2.fillRect(x+1,y+1,Spacing-2,Spacing-2);

	}
}



































