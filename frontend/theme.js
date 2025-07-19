const web = document.getElementById("theme-toggle-web");
const mobile = document.getElementById("theme-toggle-mobile");
//finds what file the user is on 
const path = window.location.pathname;
const fileName = path.substring(path.lastIndexOf('/') + 1);

// initial value localStorage or default to "system" if nothin in storage
const savedTheme = localStorage.theme || "system";
web.value = savedTheme;
mobile.value = savedTheme;

function updateTheme(e) {
  let value = savedTheme;
  if (e && e.target) {
    value = e.target.value;
  } else {
    value = web.value; // goes back to web in case
  } 

  // saving theme
  localStorage.theme = value;
  web.value = value;
  mobile.value = value;

  if (value === "system") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } else {
    document.documentElement.setAttribute("data-theme", value);
  }
 if(fileName==="step1.html"){ gpaTheme();}

}

//when theme should run pendejo
web.addEventListener("change", updateTheme);
mobile.addEventListener("change", updateTheme);

updateTheme();


//---------------------------- Specific File Styling ----------------------------
//gpa styling:
var add_class=document.getElementById("add_class");
var butt_color =' ';

function gpaTheme(){

  if(localStorage.theme==="light"){
    document.getElementById("add_class").style.color="#000000";
  }
  else{
    document.getElementById("add_class").style.color="var(--color-button)"
  }

  /*
  if(localStorage.theme==="ehs"){
    butt_color="background-color: #ffd04f";
    //changing button colors:

    for (let i=1;i<=4;i++){
      let spefButt = "mp"+i;
      document.getElementById(spefButt).style=butt_color;
      }
    //document.getElementById("add_class").style="background-color: #ffd04f; color: #000000;"









    }




    else{
      for (var i=1;i<=4;i++){
        document.getElementById("mp"+i).style="background-color: #000000";
      }
    }
*/
}