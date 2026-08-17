btnSubmit = document.getElementById("btnsubmit");
divFirstSetup = document.querySelector(".firstsetup");
divWebLinks = document.querySelector(".weblinks");
greeting = document.getElementById("pgreeting");

const savedLeft = localStorage.getItem("colorLeft");
const savedRight = localStorage.getItem("colorRight");
const searchbar = document.querySelector(".searchbar");

if (localStorage.getItem("name") == null) {
  greeting.style.display = "none";
  divWebLinks.style.display = "none";
  divFirstSetup.style.display = "block";
  btnSubmit.addEventListener("click", function () {
    let name = document.getElementById("inpname").value;
    localStorage.setItem("name", name);
    divFirstSetup.style.display = "none";
    location.reload();
  });
} else {
  let name = localStorage.getItem("name");
}

if (savedLeft !== null) {
  document.documentElement.style.setProperty("--bg-radial-left", savedLeft);
}
if (savedRight !== null) {
  document.documentElement.style.setProperty("--bg-radial-right", savedRight);
}

let searchEngine = localStorage.getItem("searchEngine") || "google";

if (searchEngine == "google") {
  searchbar.innerHTML = `<form id="searchForm" action="https://www.google.com/search" method="get" target="_blank">
    <input id="searchInput" type="search" name="q" placeholder="Google it..." required />
  </form>`;
} else if (searchEngine == "ecosia") {
  searchbar.innerHTML = `<form id="searchForm" action="https://www.ecosia.org/search" method="get" target="_blank">
    <input id="searchInput" type="search" name="q" placeholder="Ecosia it..." required />
  </form>`;
} else if (searchEngine == "url") {
  searchbar.innerHTML = `
    <form id="searchForm">
      <input id="searchInput" type="url" placeholder="Enter URL (e.g., https://www.google.com, https://www.ecosia.com)..." required />
    </form>`;
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let url = input.value.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    window.open(url, "_blank");
  });
} else if (searchEngine == "duckduckgo") {
  searchbar.innerHTML = `<form id="searchForm" action="https://www.duckduckgo.com/search" method="get" target="_blank">
    <input id="searchInput" type="search" name="q" placeholder="DuckDuckGo it..." required />
  </form>`;
} else if (searchEngine == "startpage") {
  searchbar.innerHTML = `<form id="searchForm" action="https://www.startpage.com/sp/search" method="get" target="_blank">
    <input id="searchInput" type="search" name="query" placeholder="Startpage it..." required />
  </form>`;
} else {
  searchbar.innerHTML = "<p>please choose search engine in settings</p>";
  searchbar.style.textAlign = "center";
}
