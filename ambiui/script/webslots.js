btn_slot_1 = document.getElementById("slot_1");
btn_slot_2 = document.getElementById("slot_2");
btn_slot_3 = document.getElementById("slot_3");
divSetupSlot = document.querySelector(".setup_slot");
btnSaveSlot = document.getElementById("btn_save_slot");
rm_slot_1 = document.getElementById("rm_slot_1");
rm_slot_2 = document.getElementById("rm_slot_2");
rm_slot_3 = document.getElementById("rm_slot_3");
div_bnt_slots = document.querySelector(".btn_slots");

if (localStorage.getItem("slot_1_url") == null) {
  rm_slot_1.style.display = "none";
}
if (localStorage.getItem("slot_2_url") == null) {
  rm_slot_2.style.display = "none";
}
if (localStorage.getItem("slot_3_url") == null) {
  rm_slot_3.style.display = "none";
}

div_bnt_slots.addEventListener("click", function (e) {
  if (e.target.id === "rm_slot_1") {
    localStorage.removeItem("slot_1_url");
    localStorage.removeItem("slot_1_name");
    location.reload();
  } else if (e.target.id === "rm_slot_2") {
    localStorage.removeItem("slot_2_url");
    localStorage.removeItem("slot_2_name");
    location.reload();
  } else if (e.target.id === "rm_slot_3") {
    localStorage.removeItem("slot_3_url");
    localStorage.removeItem("slot_3_name");
    location.reload();
  }
});

if (localStorage.getItem("slot_1_url") == null) {
  btn_slot_1.addEventListener("click", function () {
    divSetupSlot.style.display = "block";
    btnSaveSlot.addEventListener("click", function () {
      let slot_url = document.getElementById("inp_slot_url").value;
      let slot_name = document.getElementById("inp_slot_text").value;
      if (slot_url && slot_name) {
        localStorage.setItem("slot_1_url", slot_url);
        localStorage.setItem("slot_1_name", slot_name);
        location.reload();
      }
    });
  });
} else {
  btn_slot_1.addEventListener("click", function () {
    window.open(localStorage.getItem("slot_1_url"), "_blank");
  });
}

if (localStorage.getItem("slot_2_url") == null) {
  btn_slot_2.addEventListener("click", function () {
    divSetupSlot.style.display = "block";
    btnSaveSlot.addEventListener("click", function () {
      let slot_url = document.getElementById("inp_slot_url").value;
      let slot_name = document.getElementById("inp_slot_text").value;
      if (slot_url && slot_name) {
        localStorage.setItem("slot_2_url", slot_url);
        localStorage.setItem("slot_2_name", slot_name);
        location.reload();
      }
    });
  });
} else {
  btn_slot_2.addEventListener("click", function () {
    window.open(localStorage.getItem("slot_2_url"), "_blank");
  });
}

if (localStorage.getItem("slot_3_url") == null) {
  btn_slot_3.addEventListener("click", function () {
    divSetupSlot.style.display = "block";
    btnSaveSlot.addEventListener("click", function () {
      let slot_url = document.getElementById("inp_slot_url").value;
      let slot_name = document.getElementById("inp_slot_text").value;
      if (slot_url && slot_name) {
        localStorage.setItem("slot_3_url", slot_url);
        localStorage.setItem("slot_3_name", slot_name);
        location.reload();
      }
    });
  });
} else {
  btn_slot_3.addEventListener("click", function () {
    window.open(localStorage.getItem("slot_3_url"), "_blank");
  });
}

if (localStorage.getItem("slot_1_name") != null) {
  btn_slot_1.textContent = localStorage.getItem("slot_1_name");
}
if (localStorage.getItem("slot_2_name") != null) {
  btn_slot_2.textContent = localStorage.getItem("slot_2_name");
}
if (localStorage.getItem("slot_3_name") != null) {
  btn_slot_3.textContent = localStorage.getItem("slot_3_name");
}
