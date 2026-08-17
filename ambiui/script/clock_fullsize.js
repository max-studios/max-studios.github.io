const pclock = document.getElementById("pclock");

pclock.innerText = "AmbiUI";

setInterval(() => {
  let d = new Date();
  let hour = String(d.getHours()).padStart(2, "0");
  let minute = String(d.getMinutes()).padStart(2, "0");
  pclock.innerText = hour + ":" + minute;
}, 1000);

let body = document.body;
body.addEventListener("mousemove", () => {
  body.style.cursor = "none";
});
