/**
 * Created by Administrator on 2015/11/16.
 */
$(function(){

    function init(){
        drawLines($('.line-min'), 60, 85);
        drawLines($('.line-hour'), 12, 80);
        drawNumbers($('.number'));
        move();
    }
    init();


    /*
     * �����ӱ�̶���
     * @param wrap �̶��ߵĸ�����
     * @param total �̶��ߵ��ܸ���
     * @param translateX �̶�����x�᷽���ƫ����
     */
    function drawLines(wrap, total, translateX){
        var gap = 360/total;
        var strHtml = '';
        for(var i=0; i<total; i++){
            strHtml += '<li style="transform:rotate('+ (i*gap) + 'deg) translate(' + translateX + 'px,-50%)"></li>';
        }
        wrap.html(strHtml);
    }


    /*
     * ����ʱ������
     * @param wrap ���ֵĸ�����
     */
    function drawNumbers(wrap){
        var radius = wrap.width() / 2;

        var strHtml = '';
        for(var i=1; i<=12; i++){
            var myAngle = (i-3)/6 * Math.PI;

            var myX = radius + radius*Math.cos(myAngle), // x=r+rcos(��)
                myY = radius + radius*Math.sin(myAngle); // y=r+rsin(��)

            strHtml += '<li style="left:' + myX + 'px; top:'+ myY +'px">' + i + '</li>';
        }
        wrap.html(strHtml);
    }


    /*
     * �ӱ��߶���ת�����롢���롢ʱ��
     */
    function move(){
        var domHour = $(".hour"),
            domMin = $(".min"),
            domSec = $(".sec");

        setInterval(function(){
            var now = new Date(),
                hour = now.getHours(),
                min = now.getMinutes(),
                sec = now.getSeconds();

            var secAngle = sec*6 - 90,  // s*6-90
                minAngle = min*6 + sec*0.1 - 90,  // m*6+s*0.1-90
                hourAngle = hour*30 + min*0.5 - 90;  // h*30+m*0.5 - 90

            domSec.css('transform', 'rotate(' + secAngle + 'deg)');
            domMin.css('transform', 'rotate(' + minAngle + 'deg)');
            domHour.css('transform', 'rotate(' + hourAngle + 'deg)');

            //document.title = hour + ':' + min + ':' + sec;
        },1000);
    }

});