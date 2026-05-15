const images = document.getElementById("inpfile");
const btnStart = document.getElementById("btnStart");
const diashowImg = document.getElementById("diashowImg");
const btnStop = document.getElementById("btnStop");
let intervall;
let imglist = [];
let index = 0;
let curTimer;
document.getElementById("btnStop").style.display = "none";

images.addEventListener("change", function (event) {
  imglist = event.target.files;
  let firstImg = imglist[0];
  let imgURL = URL.createObjectURL(firstImg);
  diashowImg.src = imgURL;
});

btnStart.addEventListener("click", function () {
  hideCur();
  document.getElementById("btnStop").style.display = "block";
  document.body.style.backgroundColor = "black";
  document.querySelector(".upload").style.display = "none";
  document.getElementById("h").style.display = "none";
  let secondsperimage = Number(document.getElementById("SPImg").value);
  let millisecondsperimage = secondsperimage * 1000;
  intervall = setInterval(function () {
    index = index + 1;
    if (index == imglist.length) {
      index = 0;
    }
    let nextImg = imglist[index];
    let imgURL = URL.createObjectURL(nextImg);
    diashowImg.src = imgURL;
  }, millisecondsperimage);
});

btnStop.addEventListener("click", function () {
  clearInterval(intervall);
  document.removeEventListener("mousemove", removeListener);
  clearTimeout(curTimer);
  document.body.style.cursor = "default";
  document.querySelector(".upload").style.display = "block";
  document.getElementById("h").style.display = "block";
  document.body.style.backgroundColor = "white";
  document.getElementById("btnStop").style.display = "none";
});

// Cursor Hiding
function removeListener() {
  clearTimeout(curTimer);
  document.getElementById("btnStop").style.display = "block";
  document.body.style.cursor = "default";
  curTimer = setTimeout(function () {
    document.getElementById("btnStop").style.display = "none";
    document.body.style.cursor = "none";
  }, 1000);
}

function hideCur() {
  document.addEventListener("mousemove", removeListener);
}
