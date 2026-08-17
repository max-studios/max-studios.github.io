const pclock = document.getElementById("pclock");

pclock.innerText = "connecting...";

setInterval(() => {
  let d = new Date();
  let hour = String(d.getHours()).padStart(2, "0");
  let minute = String(d.getMinutes()).padStart(2, "0");
  pclock.innerText = hour + ":" + minute;
}, 1000);

pclock.addEventListener("click", () => {
  window.open("clock/", "_blank");
});
