name = localStorage.getItem("name");
document.getElementById(pgreeting);
let hour = new Date().getHours();

if (hour < 12) {
  pgreeting.textContent = "Good morning, " + name + "!";
} else if (hour < 18) {
  pgreeting.textContent = "Good afternoon, " + name + "!";
} else {
  pgreeting.textContent = "Good evening, " + name + "!";
}
