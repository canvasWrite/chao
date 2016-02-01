var draw = new Object({
	init:function() {
		this.canvasWidth=Math.min(700,$(window).width()-20);
		this.canvasHeight=Math.min(700,$(window).width()-20);
		this.strokeColor="black";
		this.isMouseDown = false;
		this.lastLoc={x:0,y:0};
		this.lastTimestamp=0;
		this.lastLineWidth=-1;
		this.pointLineWidth=30;
		this.canvas = document.getElementById("canvas");
		this.context = canvas.getContext("2d");
		var selfthis=this;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
		$("#controller").css("width",this.canvasWidth+"px");
		this.drawGrid();
		$("#clear_btn").click(function(e) {
			// var context=selfthis.canvas.getContext("2d");
			selfthis.context.clearRect(0,0,selfthis.canvasWidth,selfthis.canvasHeight);
			selfthis.drawGrid();
		});
		$(".color_btn").click(function(e) {
			$(".color_btn").removeClass("color_btn_selected");
			$(this).addClass("color_btn_selected");
			selfthis.strokeColor=$(this).css("background-color");
		});
		$(".math_btn").click(function(e) {
			$(".math_btn").removeClass("math_btn_selected");
			$(this).addClass("math_btn_selected");
			selfthis.pointLineWidth=$(this).text();
		});
		this.canvas.onmousedown=function(e) {
			e.preventDefault();
			selfthis.beginStroke({x:e.clientX,y:e.clientY});
		}
		this.canvas.onmouseup=function(e) {
			e.preventDefault();
			selfthis.endStroke();
		}
		this.canvas.onmouseout=function(e) {
			e.preventDefault();
			selfthis.endStroke();
		}
		this.canvas.onmousemove=function(e) {
			e.preventDefault();
			if(selfthis.isMouseDown) {
				selfthis.moveStroke({x:e.clientX,y:e.clientY});
			}
		}
		this.canvas.addEventListener('touchstart',function(e) {
			e.preventDefault();
			touch=e.touches[0];
			selfthis.beginStroke({x:touch.pageX,y:touch.pageY});
		})
		this.canvas.addEventListener('touchmove',function(e) {
			e.preventDefault();
			if(selfthis.isMouseDown) {
				touch=e.touches[0];
				selfthis.moveStroke({x:touch.pageX,y:touch.pageY});
			}
		})
		this.canvas.addEventListener('touchend',function(e) {
			e.preventDefault();
			selfthis.endStroke();
		})
	},


	beginStroke:function(point) {
		this.isMouseDown=true;
		this.lastLoc=this.windowToCanvas(point.x,point.y);
		this.lastTimestamp=new Date().getTime();
	},
	endStroke:function() {
		this.isMouseDown = false;
	},
	moveStroke:function(point) {
		var curLoc=this.windowToCanvas(point.x,point.y);
		var s=this.calcDistance(curLoc,this.lastLoc);
		var curTimestamp=new Date().getTime();
		var t=curTimestamp-this.lastTimestamp;

		var lineWidth=this.calcLineWidth(t,s);


		this.context.beginPath();
		this.context.moveTo(this.lastLoc.x,this.lastLoc.y);
		this.context.lineTo(curLoc.x,curLoc.y);

		this.context.strokeStyle=this.strokeColor;
		this.context.lineWidth=lineWidth;
		this.context.lineCap="round";
		this.context.lineJoin="round";
		this.context.stroke();

		this.lastLoc=curLoc;
		this.lastTimestamp=curTimestamp;
		this.lastLineWidth=lineWidth;
	},


	calcLineWidth:function(t,s) {
		var v=s/t;
		if(v<=0.1) {
			resultLineWidth=this.pointLineWidth;
		}else if(v>=10) {
			resultLineWidth=1;
		}else {
			resultLineWidth=this.pointLineWidth-(v-0.1)/(10-0.1)*(this.pointLineWidth-1);
		}
		if(this.lastLineWidth==-1) {
			return resultLineWidth;
		}else {
			return this.lastLineWidth*2/3+resultLineWidth*1/3;
		}
	},
	calcDistance:function(loc1,loc2) {
		return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
	},
	windowToCanvas:function(x,y) {
		var bbox=canvas.getBoundingClientRect();
		return {x:Math.round(x-bbox.left) ,y:Math.round(y-bbox.top)};
	},
	drawGrid:function() {
		this.context.save();
		this.context.strokeStyle="rgb(230,11,9)";
		this.context.beginPath();
		this.context.moveTo(3,3);
		this.context.lineTo(this.canvasWidth-3,3);
		this.context.lineTo(this.canvasWidth-3,this.canvasHeight-3);
		this.context.lineTo(3,this.canvasHeight-3);
		this.context.closePath();

		this.context.lineWidth=6;
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(0,0);
		this.context.lineTo(this.canvasWidth,this.canvasHeight);

		this.context.moveTo(this.canvasWidth,0);
		this.context.lineTo(0,this.canvasHeight);

		this.context.moveTo(this.canvasWidth/2,0);
		this.context.lineTo(this.canvasWidth/2,this.canvasWidth);

		this.context.moveTo(0,this.canvasWidth/2);
		this.context.lineTo(this.canvasWidth,this.canvasWidth/2);

		this.context.lineWidth=1;
		this.context.stroke();
		this.context.restore();
	},

});

draw.init();
