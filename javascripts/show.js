/**
 * Created by Administrator on 2015/11/17.
 */
function addLoadEvent(func){
     var oldonload = window.onload;
    if(typeof window.onload != 'function') {
        window.onload = func;
    }else{
      window.onload = function(){
          oldonload();
          func();
      }
    }
}

function navChange(){
    var ul = document.getElementsByTagName('ul')[0];
    var a = ul.getElementsByTagName('a');
    for(i=0;i< a.length;i++){
      a[i].onmouseover = function(){
          if(this.className != "on"){
              clearInterval(this.time);
              var m = this;
              m.time = setInterval(function(){
                  m.style.width = m.offsetWidth + 60 + "px";
                  if(m.offsetWidth>=140){
                      clearInterval(m.time);
                  }
              },30)
          }

      }
      a[i].onmouseout = function(){
         if(this.className != "on"){
             clearInterval(this.time);
             var m =this;
             m.time = setInterval(function(){
                 m.style.width = m.offsetWidth - 60 + "px";
                 if(m.offsetWidth<=80){
                     m.style.width = "80px";
                     clearInterval(m.time);
                 }
             },30)
         }
      }

    }
}

addLoadEvent(navChange);