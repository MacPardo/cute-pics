window.addEventListener("load", function() {
  const awwReq = new XMLHttpRequest();
  awwReq.onload = function () {
    const awwInfo = JSON.parse(this.responseText);

    const urls = awwInfo.data.children
      .filter(function(p) {
        return !p.data.is_self && !p.data.is_video;
      })
      .map(function(p) {
        return p.data.url;
      });

    urls.forEach(function(url) {
      const li = document.createElement("li");
      li.classList.add("img-container");

      const img = document.createElement("img");
      img.addEventListener("load", function() {
        this.setAttribute("natural-width", this.width);
        this.setAttribute("natural-height", this.height);

        li.appendChild(img);
        document.querySelector(".images").appendChild(li);

        imageType(img);
        //imageZoom(li);
      });
      img.src = url;

    });
  }
  awwReq.open("get", "https://www.reddit.com/r/aww.json", true);
  awwReq.send();
});

function imageType(img) {
  const container = img.parentElement;
  
  const imgWidth = parseInt(img.getAttribute("natural-width"));
  const imgHeight = parseInt(img.getAttribute("natural-height"));

  const cWidth = container.getBoundingClientRect().width;
  const cHeight = container.getBoundingClientRect().height;
  
  const imgRatio = imgWidth / imgHeight;
  const containerRatio = cWidth / cHeight;

  if (imgRatio > containerRatio) {
    img.classList.remove("portrait");
    img.classList.add("landscape");
  }
  else {
    img.classList.add("portrait");
    img.classList.remove("landscape")
  }
}

function imageZoom(container) {

  //console.log(container);

  const zoom = 1.5;
  const img = container.querySelector("img");

  const cw = container.getBoundingClientRect().width;
  const ch = container.getBoundingClientRect().height;

  const iw = img.getBoundingClientRect().width;
  const ih = img.getBoundingClientRect().height;

  const ziw = iw * zoom;
  const zih = ih * zoom;

  //console.log(cw,ch,iw,ih,ziw,zih);

  img.style.width = String(parseInt(iw)) + "px";
  img.style.height = String(parseInt(ih)) + "px";

  var gate = true;
  container.addEventListener("mousemove", function(event) {

    if (!gate) return;
    gate = false;

    img.style.width = String(parseInt(ziw)) + "px";
    img.style.height = String(parseInt(zih)) + "px";

    img.style.transform = "none";
    
    mouseX = event.pageX - container.getBoundingClientRect().left;
    mouseY = event.pageY - container.getBoundingClientRect().top;

    const x = mouseX / cw;
    const y = mouseY / ch;

    //const a_ = ziw * x;
    //const b_ = zih * y;

    const a_ = mouseX * zoom;
    const b_ = mouseY * zoom;

    const left = parseInt(-a_ + event.layerX);
    const top = parseInt(-b_ + event.layerY);

    console.log("---");
    console.log(x,y);
    console.log(left);
    console.log("---");

    img.style.left = String(left) + "px";
    img.style.top = String(top) + "px";

    setTimeout(function() {
      gate = true;
    }, 10);
  });
}