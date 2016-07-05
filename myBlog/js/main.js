/**
 * Created by xiaowan on 2016/4/2.
 */

/**
 * Created by xiaowan on 2016/4/1.
 */
;(function($){

    var LightBox = function(){
        var self = this;

        //创建遮罩和弹出窗
        this.popupMask = $('<div id="G-lightbox-mask">');
        this.popupWin = $('<div id="G-lightbox-popup">');
        this.bodyNode = $(document.body);

        //渲染DOM并插入元素
        this.renderDOM();
        this.picViewArea = this.popupWin.find("div.lightbox-pic-view");
        this.popupPic = this.popupWin.find("img.lightbox-img");
        this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");
        this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");
        this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
        this.captionText = this.popupWin.find("p.lightbox-pic-desc");
        this.currentIndex = this.popupWin.find("span.lightbox-of-index");
        this.closeBtn = this.popupWin.find("span.lightbox-close-btn");



        //var lightbox = $(".js-lightbox,[data-role=lightbox]");
        //lightbox.click(function(){
        //    alert("1")
        //})
        this.groupName = null;
        this.groupData = [];
        this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click", function(e){
            e.stopPropagation();
            //alert($(this).attr("data-group"))
            var currentGroupName = $(this).attr("data-group");
            if(currentGroupName != self.groupName){
                self.groupName = currentGroupName;
                self.getGroup();

            }
            self.initPopup($(this));
        });
        this.popupMask.click(function(){
            $(this).fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        });
        this.closeBtn.click(function(){
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        })
        this.flag = true;
        this.nextBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).addClass("lightbox-next-btn-show")
            }
        },function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).removeClass("lightbox-next-btn-show")
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")&&self.flag){
                self.flag= false;
                e.stopPropagation();
                self.goto("next");
            }
        })
        this.prevBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).addClass("lightbox-prev-btn-show")
            }
        },function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).removeClass("lightbox-prev-btn-show")
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled"&&self.flag)){
                self.flag = false;
                e.stopPropagation();
                self.goto("prev");
            }
        })
        var timer = null;
        this.clear = false;
        $(window).resize(function(){
            if(self.clear){
                window.clearTimeout(timer);
                timer = window.setTimeout(function(){
                    self.loadPicSize(self.groupData[self.index].src);
                }, 500);
            }
        })


    };
    LightBox.prototype={
        goto:function(dir){
            if(dir=="next"){
                this.index++;
                if(this.index >= this.groupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(this.index!=0){
                    this.prevBtn.removeClass("disabled");
                }

                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
            }else if(dir == "prev"){
                this.index--;
                if(this.index<=0){
                    this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                }
                if(this.index!=this.groupData.length-1){
                    this.nextBtn.removeClass("disabled");
                }
                src = this.groupData[this.index].src;
                this.loadPicSize(src);


            }
        },


        loadPicSize:function(sourceSrc){
            var self=this;
            self.popupPic.css({
                width:"auto",
                height:"auto"
            }).hide();
            self.picCaptionArea.hide();

            this.preLoadImg(sourceSrc,function(){

                self.popupPic.attr("src",sourceSrc);
                var picWidth = self.popupPic.width();
                var picHeight = self.popupPic.height();
                self.changePic(picWidth, picHeight);

            });
        },
        changePic:function(width,height){
            var  self=this,
                winWidth = $(window).width(),
                winHeight = $(window).height();
            var scale= Math.min(winWidth/(width+10),winHeight/(height+10),1);
            width = width*scale;
            height = height*scale;
            this.picViewArea.animate({
                width:width-10,
                height:height-10
            });
            this.popupWin.animate({
                width:width-10,
                height:height-10,
                marginLeft:-(width/2),
                top:(winHeight-height)/2
            },function(){
                self.popupPic.css({
                    width:width,
                    height:height
                }).fadeIn();
                self.picCaptionArea.fadeIn();
                self.flag = true;
                self.clear = true;
            });
            console.log(this.index);

            this.captionText.text(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引:"+(this.index+1)+"of"+this.groupData.length);

        },
        preLoadImg:function(src,callback){
            var img = new Image();
            if(!!window.ActiveXObject){
                img.onreadystatechange = function(){
                    if(this.readyState == 'complete'){
                        callback();
                    }
                }
            }else{
                img.onload=function(){
                    callback();
                }
            }
            img.src=src;
        },
        showMaskAndPopup:function(sourceSrc,currentId){
            var self = this;
            this.popupPic.hide();
            this.picCaptionArea.hide();
            this.popupMask.fadeIn();

            var winWidth = $(window).width();
            var winHeight = $(window).height();
            this.picViewArea.css({
                width:winWidth/2,
                height:winHeight/2
            });
            this.popupWin.fadeIn();
            var viewHeight = winHeight/2+10;
            this.popupWin.css({
                width:winWidth/2+10,
                height:winHeight/2+10,
                marginLeft:-(winWidth/2+10)/2,
                top: -viewHeight
            }).animate({
                top:(winHeight-viewHeight)/2
            },function(){
                self.loadPicSize(sourceSrc);
            });

            this.index = this.getIndexOf(currentId);
            var groupDataLength = this.groupData.length;
            if(groupDataLength>1){
                if(this.index === 0){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index === groupDataLength-1){
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{
                    this.nextBtn.removeClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }
            }

        },

        getIndexOf:function(currentId){
            var index=0;
            $(this.groupData).each(function(i){
                index = i;
                if(this.id === currentId){
                    return false;
                }
            });
            return index;
        },

        initPopup:function(currentObj){
            var self = this,
                sourceSrc = currentObj.attr("data-source"),
                currentId = currentObj.attr("data-id");
            this.showMaskAndPopup(sourceSrc,currentId);
        },

        getGroup:function() {
            var self = this;
            var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
            self.groupData.length = 0;
            groupList.each(function(){
                self.groupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                    caption:$(this).attr("data-caption")
                });
            });

        },


        renderDOM:function(){
            var strDom =  '<div class="lightbox-pic-view">'+
                '<span class="lightbox-btn lightbox-prev-btn ">'+
                '</span>'+
                '<img  class="lightbox-img" src="" >'+
                '<span class="lightbox-btn lightbox-next-btn ">'+
                '</span>'+
                '</div>'+
                '<div class="lightbox-pic-caption">'+
                '<div class="lightbox-caption-area">'+
                '<p class="lightbox-pic-desc"></p>'+
                '<span class="lightbox-of-index"></span>'+
                '</div>'+
                '<span class="lightbox-close-btn"></span>'+
                '</div>';
            this.popupWin.html(strDom);
            this.bodyNode.append(this.popupMask,this.popupWin);
        }

    };
    window['LightBox'] = LightBox;
})(jQuery);



function addLoadEvent(func) {
    var oldonload  = window.onload;
    if (typeof window.onload != 'function'){
        window.onload = func;
    }else{
        window.onload = function(){
            oldonload();
            func();
        }
    }
}

function sliderShow(){
    var container = document.getElementById('container');
    var list = document.getElementById('list');
    var buttons = document.getElementById('buttons').getElementsByTagName('span');
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var index = 1;
    var animated  = false;
    var timer;
    function showButtons(){
        for(var i=0;i<buttons.length;i++){
            if(buttons[i].className == 'on'){
                buttons[i].className = '';
                break;
            }
        }
        buttons[index - 1].className = 'on';
    }
    function animate(offset){
        animated = true;
        var newleft = parseInt(list.style.left) + offset;
        var time = 2000;
        var interval = 10;
        var speed = offset/(time/interval);

        function go(){
            if(speed < 0 && parseInt(list.style.left) > newleft || speed > 0 && parseInt(list.style.left) < newleft ){
                list.style.left = parseInt(list.style.left) + speed + 'px';
                setTimeout(go, interval);
            }else{
                animated = false;
                list.style.left = newleft + 'px';
                if(newleft > -800){
                    list.style.left = -4000 + 'px';
                }
                if(newleft < -4000){
                    list.style.left = -800 + 'px';
                }

            }
        }
        go();

    }

    function play(){
        timer = setInterval(function(){
            next.click();
        }, 2000)
    }
    function stop(){
        clearInterval(timer);
    }

    next.onclick = function(){
        if(!animated){
            if(index == 5){
                index = 1;
            }else{
                index += 1;
            }
            showButtons();
            animate(-800);
        }

    }
    prev.onclick = function(){
        if(!animated){
            if(index == 1){
                index = 5;
            }else{
                index -= 1;
            }
            showButtons();
            animate(800);
        }


    }
    for (var i=0;i<buttons.length;i++){
        buttons[i].onclick = function(){
            if(this.className == 'on'){
                return;
            }
            var myIndex = this.getAttribute('index');
            var offset = -800*(myIndex - index);
            animate(offset);
            index = myIndex;
            showButtons();
        }
    }
    container.onmouseout = play;
    container.onmouseover = stop;
    play();
}

var curShowTimeSeconds = 0;
var balls = [];
const colors =["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

function timeClock(){
    WINDOW_HEIGHT = document.getElementById("canvas-img").clientHeight;
    WINDOW_WIDTH = document.getElementById("canvas-img").clientWidth;
    //WINDOW_WIDTH = 600;
    //WINDOW_HEIGHT = 400;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/3);

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(function(){
        render(context);
        update()
    },50);

}
function getCurrentShowTimeSeconds(){
    var curTime = new Date();
    var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();
    return ret;
}
function update(){
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds/3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
    var nextSeconds = parseInt(nextShowTimeSeconds%60);

    var curHours = parseInt(curShowTimeSeconds/3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
    var curSeconds = parseInt(curShowTimeSeconds%60);

    if(nextSeconds != curSeconds){
        if(parseInt(curHours/10) != parseInt(nextHours/10)){
            addBalls( MARGIN_LEFT, MARGIN_TOP, parseInt(curHours/10));
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
        }
        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curHours/10));
        }
        if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
        }
        if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curHours/10));
        }
        if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
    //console.log(balls.length);
}

function updateBalls(){
    for (var i=0;i<balls.length;i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS){
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy*0.5;
        }
    }
    var cnt = 0;
    for (var i=0;i<balls.length;i++)
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[i];
        }
    while(balls.length > Math.min(300,cnt)){
        balls.pop();
    }

}
function addBalls( x, y, num){
    for(var i=0;i<digit[num].length;i++)
        for(var j=0;j<digit[num][i].length;j++)
            if(digit[num][i][j] == 1){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5*Math.random(),
                    vx:Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    vy:-2,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }
                balls.push(aBall);
            }
}


function render(cxt){
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds/3600);
    var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
    var seconds = parseInt(curShowTimeSeconds%60);
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
    renderDigit(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt);
    renderDigit(MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt);
    renderDigit(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt);
    renderDigit(MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt);
    renderDigit(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt);

    for(var i=0;i<balls.length;i++){
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true)
        cxt.closePath();
        cxt.fill();
    }

}

function renderDigit(x, y, num, cxt){
    cxt.fillStyle = "rgba(255,255,255,.7)";
    for(var i =0 ;i<digit[num].length;i++)
        for(var j=0;j<digit[num][i].length;j++)
            if(digit[num][i][j]==1){
                cxt.beginPath();
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
}

/*放大镜代码*/
function realScale(){

    var canvas = document.getElementById("scale-canvas");
    var context = canvas.getContext("2d");
    var slider = document.getElementById("scale-range");
    var image = new Image();

    var watermarkCanvas = document.getElementById("watermark-canvas");
    var watermarkContext = watermarkCanvas.getContext("2d");
    function scale(){

        canvas.width = document.body.clientWidth;
        canvas.height = 500;
        var scale = slider.value;

        image.src = "img/school.jpg";
        image.onload = function(){
            //context.drawImage( image, 0, 0, canvas.width, canvas.height )
            drawImageByScale(scale);
            slider.onmousemove = function(){
                scale = slider.value;
                drawImageByScale(scale);
            }
        }
        watermarkCanvas.width = 800;
        watermarkCanvas.height = 100;
        watermarkContext.font = "bold 30px Arial";
        watermarkContext.fillStyle = "rgba( 255, 255, 255, 0.5)";
        watermarkContext.textBaseline = "middle";
        watermarkContext.fillText("==中国地质大学（武汉） 小万作品 ==", 20, 50);

    }



    function drawImageByScale(scale){
        var imageWidth = canvas.width*scale;
        var imageHeight = 768*scale;
//        var sx = imageWidth/2 - canvas.width/2;
//        var sy = imageHeight/2 - canvas.height/2;
//        context.drawImage( image, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        var dx = canvas.width/2 - imageWidth/2;
        var dy = canvas.height/2 - imageHeight/2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage( image, dx, dy, imageWidth, imageHeight);
        context.drawImage(watermarkCanvas, canvas.width-watermarkCanvas.width, canvas.height-watermarkCanvas.height);
    }
    return scale();
}



addLoadEvent(sliderShow);
addLoadEvent(timeClock);
addLoadEvent(realScale);