

function bindResize(sidehandle){
var sidebar = document.getElementById("sidebar")
x = 0;

$(sidehandle).mousedown(function (e){
  x = e.clientX - sidehandle.offsetWidth - $("#sidebar").width();
  console.log(sidehandle.setCapture)
  sidehandle.setCapture ? (
    sidehandle.setCapture(),
    sidehandle.onmousemove = function (ev){

      mouseMove(ev || event);
    },
    sidehandle.onmouseup = mouseUp
  ) : (
    $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
  );
  e.preventDefault();
});

function mouseMove(e){
  sidebar.style.transition = 'none';
  sidebar.style.width = e.clientX - x - 20 + 'px';
  console.log(e.clientX)
}

function mouseUp(){
  sidebar.style.transition = "width 0.5s"
  sidehandle.releaseCapture ? (
    sidehandle.releaseCapture(),
    sidehandle.onmousemove = sidehandle.onmouseup = null
  ) : (
    $(document).unbind("mousemove", mouseMove).unbind("mouseup",mouseUp)
  );
}
}

bindResize(document.getElementById("sidehandle"))
