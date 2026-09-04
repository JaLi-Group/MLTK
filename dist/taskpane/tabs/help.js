mltkLogger.debug("Entering help.js....");

 const btnHelp = document.getElementById("btnHelp2");
  if (!btnHelp.dataset.bound) {
      btnHelp.addEventListener("click", () => {
          window.open("https://localhost:3000/help/index.html", "_blank");
      });
      btnHelp.dataset.bound = "true";
  }

function initHelpTab() {
  // const btn1Help = document.getElementById("helpTestBtn");
  // const btn2Help = document.getElementById("helpTestBtn2");
  // const outHelp = document.getElementById("helpOutput");

  // btn1Help.onclick = () => {
  //   outHelp.innerText = "Help button works!";
  // };
  // btn2Help.onclick = () => {
  //   outHelp.innerText = "";
  // };
}   

window.initHelpTab = initHelpTab;
mltkLogger.debug("....Leaving help.js");
