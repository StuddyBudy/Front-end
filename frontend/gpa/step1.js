/*

    version (may 11) - robert

    - fixed the alert system if input was left empty
    - titleChange function gets called when subject dropdown menus is changed so if the user 
        wants to be an incompitent asshole and fillout the inputs from reverse, it works
    - fixed / condenced all the mp button mayehm (went from 90 lines of 4 buttons to 10 lines and 1 function)

    - a



*/

//variables----------------------------------------------------------------------

var subVal = document.getElementById("subject").value;
var lvVal = document.getElementById("course_lv").value;
var titVal = document.getElementById("subject_title").value;
var elective = document.getElementById("elective").value; 

var sub = document.getElementById("subject");
var ele = document.getElementById("elective"); 
var course_lv = document.getElementById("course_lv");
var subTit = document.getElementById("subject_title");
var lang = document.getElementById("language");
var len1 = document.getElementById("course_length");




var lv_id = document.getElementById("course_lv_id");
var sub_id = document.getElementById("subject_id");
var tit_id = document.getElementById("title_id");
var elective_id = document.getElementById("elective_id");


var mathCnt = 0;
var sciCnt = 0;


var num = 0;
var mpNum = 0;


var mpNum1 = 0;
var mpNum2 = 0;
var mpNum3 = 0;
var mpNum4 = 0;

var len ='';

// Calling Functions -----------------------------------------------------------------------

    //when anything gets changed, run this 

    document.getElementById('subject_id').addEventListener('change', function(){
        var y = sub;
        dropBg(y);

        lv_change(document.getElementById("subject").value);
        unhide2();
        title_change();
    });
    document.getElementById('elective_id').addEventListener('change', function(){
        var y = ele;
        dropBg(y);
        title_change();

    });
    document.getElementById('course_lv_id').addEventListener('change', function(){
        var y = course_lv;
        dropBg(y);
    });

    document.getElementById('language_id').addEventListener('change', function(){
        var y = lang;
        dropBg(y);
    });
    document.getElementById('course_length_id').addEventListener('change', function(){
        var y = len1;
        dropBg(y);
    });
    document.getElementById('subject_title').addEventListener('change', function(){
        var y = subTit;
        dropBg(y);
    });



    //when course/elective/lang is changes, the title dropdown function runs and options get changed
    document.getElementById('course_lv_id','elective_id','language_id').addEventListener('change', title_change);

// Functions -------------------------------------------------------------------------------

//changes the bg, unhides the corresponding table, unhides mp cnt
//gets called when mp button is pressed
function mpButts(mpNum){
    bg(mpNum);    
    unhideTable(mpNum);
    document.getElementById("class_num"+mpNum).style.display="block";
    document.getElementById("mpSel").textContent=" You are now editing mp"+mpNum;
    document.getElementById("mpSel").style.display="block";


}

//------------------------------------------------------------------------------------------------

// when the mp button is clicked, the corresponding button will change bg color
// gets called in mpButts
function bg(mpNum){
    for (var i=1;i<=4;i++){
        document.getElementById("mp"+i).style="background-color: #FEA1A1;"
    }
    document.getElementById("mp"+mpNum).style="background-color: #D18585;"

}

//------------------------------------------------------------------------------------------------

//changes the bg of the dropdown menus
//gets called whenever of the dropdown menus are changed 
function dropBg(y){

   if(y.selectedIndex!=0){
    y.style="background-color: #D3D3D3";
   }
   else{
    y.style="background-color: #fafffd";
   }

}

//------------------------------------------------------------------------------------------------

//changes the course lv depending on the subject
//gets run when subject catagorey is touched
function lv_change(subVal) {
    lv_id = document.getElementById("course_lv");
    len = document.getElementById("course_length").options;

        //if health / gym, only standard is able to be selected
        
        if (subVal === "Health" || subVal === "Gym") { 

            //changes the selected lv option to standard
            lv_id.selectedIndex=1;
            dropBg(lv_id);

            //hides all lvs exept standard
            for(var i=1;i<=5;i++){
                lv_id.options[i].disabled = true;
            }
            lv_id.options[1].disabled = false;

            //disables full yr and enables 1mp + sem
            len[1].disabled=true;
            len[2].disabled=false;
            len[3].disabled=false;

            elective_id.style.display = "none";

        }
        else {
            lv_id.selectedIndex=0;
            dropBg(lv_id);

            for(var i=2;i<=5;i++){
                lv_id.options[i].disabled = false;
            }
            lv_id.options[1].disabled = true;

            len[1].disabled=false;
            len[2].disabled=true;
            len[3].disabled=true;

        }


       //if its electiives, display the elective column, otherwise nuh uhhhh
        if (subVal==="Electives") {
            elective_id.style.display = "block";
            lv_id.options[2].disabled = true;
        
        }
        else{
            elective_id.style.display = "none";
            document.getElementById("language_id").style.display="none";

        } 

        //resets the course titles 
        subTit.innerHTML = '<option value="" disabled selected> Select your class: </option>';
 
    }
 
 //------------------------------------------------------------------------------------------------
 
 //changes the course options
 //gets run when subject's changed
    function title_change(){ 

        var selectedLv= document.getElementById("course_lv").value;
        subVal = document.getElementById("subject").value;
        len = document.getElementById("course_length").options;


        //resets the course titles 
        subTit.innerHTML = '<option value="" disabled selected> Select your class: </option>';
        
       if(subVal === "Electives"){
          subVal = document.getElementById("elective").value;
          console.log("elective selected "+subVal);

            //enables all length
            len[1].disabled=false;
            len[2].disabled=false;
            len[3].disabled=false;
            course_lv[2].disabled=true; 



            //disables honors & AP for tech edu
            if (subVal === "Tech_Edu"){
                
                for(var i=0;i>=5;i++){
                    course_lv[i].disabled=true;
                 }
              
            
            }

                 //disables standard and honors
            else if (subVal === "Visual_Arts"){
                for(let i=3;i<=5;i++){
                    course_lv[i].disabled=false;
                }
                course_lv[2].disabled=true;
                course_lv[4].disabled=true;  }

                //enables everything and put it back
            else if (subVal !== "Visual_Arts" || subVal!=="Tech_Edu"|| subVal!=="Comp_sci"){
                for(let i=3;i<=5;i++){
                    course_lv[i].disabled=false; }   }


    // if / when language is selected under elective, the langauge catagorey will be displayed
            if (subVal === "Language"){
                for(let i=3;i<=5;i++){
                    course_lv[i].disabled=false;
                }

                document.getElementById("language_id").style.display="block";
                subVal=document.getElementById("language").value;

                //disables all exept full
                len[1].disabled=false;
                len[2].disabled=true;
                len[3].disabled=true;               
            }
 
    //otherwise hide lang and reset lv options 
            else if (subVal !== "Language"){
                for(let i=3;i<=5;i++){
                    course_lv[i].disabled=false;   }

                subVal = document.getElementById("elective").value;
                document.getElementById("language_id").style.display="none";
            }
    
        }
 
 
        if (selectedLv === "AP"){
          subVal = subVal+"_AP";
 
        } 
        else if (selectedLv === "Academic"){
          subVal = subVal+"_2"
 
        }
        else if (selectedLv === "Accelerated"){
          subVal = subVal+"_1"
 
        }
        else if (selectedLv === "Honors"){
          subVal = subVal+"_H"
        }
        else if (selectedLv === "Standard"){
            subVal=subVal;
        }
    //console.log("subVal: "+subVal);
    //console.log("lvVal: "+lvVal);
 
        var titles = subjectTitles[subVal];
        //console.log("Titles:", titles);
        
            for (var key in titles) {
                var option = document.createElement("option");
                option.value = key;
                option.textContent = titles[key];
                subTit.appendChild(option);
            }
 


        }
//--------------------------------------------------------------------------------------------------------
    // getting the user input and pasting it to the corresponding table
    //gets called when submit is pressed
    function input() {

        subVal = document.getElementById("subject").value;
        lvVal = document.getElementById("course_lv").value;
        titVal = document.getElementById("subject_title").value;
        len = document.getElementById("course_length").value;


        //checks to see if anything is missing, if so, ends function 
        if (titVal.trim()=== ""|| lvVal.trim()=== ""
        || subVal.trim() === ""|| len.trim()=== "start") {
            alert("One or more inputs are empty! Please re enter your class");
            return;
        }


        classCntMath(len);

        if(len=="Full"){
     
            num++;
    
            for(var i=1;i<=4;i++){
                mpNum=i;
                document.getElementById(mpNum+"subject_" + num).textContent = subVal;
                document.getElementById(mpNum+"title_" + num).textContent = titVal;
                document.getElementById(mpNum+"lv_" + num).textContent = lvVal;
                
                document.getElementById(mpNum+"lv_" + num).parentElement.addEventListener("click", () => {
                    console.log("lv click");
                });

            }
         }


     if (mpNum1 >=8 || mpNum2 >=8 || mpNum3 >=8 || mpNum4 >=8 ){
        document.getElementById("add_class").style.display = "none";
        document.getElementById("max_classes").style.display = "inline";
        document.getElementById("class_num").textContent ="8 out of 8 classes used in MP"+mpNum;

     }


  
//hide / disbables the user's choice to not allow duplicacitcy  

    // fix it so depending on what subject is selcted, changes length disabled or enabled !!!!!
    var sub = document.getElementById("subject");
    var subIndex = document.getElementById("subject").selectedIndex;

    //IF english, his, health, gym were used, disable it
    if (subIndex==1||subIndex==4||subIndex==5||subIndex==6){
        sub.options[sub.selectedIndex].disabled = true;
    }
    //math
    else if(subIndex==2){
        mathCnt++;
        console.log("meth= " + mathCnt);
        if(mathCnt>=2){
            sub.options[sub.selectedIndex].disabled = true;
        }
    }
    //science
    else if(subIndex==3){
        sciCnt++;
        console.log("sci= " + sciCnt);
        if(sciCnt>=2){
            sub.options[sub.selectedIndex].disabled = true;
        }


    }

    //storing(subVal,lvVal,titVal);


 }



//--------------------------------------------------------------------------------------------------------
 

    // Un-Hiding the table AND input prompts
        //gets called when mp button being pressed
     function unhideTable(mpNum) {

        document.getElementById("options").style.display = "block";

        //hides all tables and _/_ classes then unhides the one selected
        for(var i=1;i<=4;i++){
            document.getElementById("mp"+i+"_table").style.display = "none";
            document.getElementById("class_num"+i).style.display = "none";
        }
        document.getElementById("mp"+mpNum+"_table").style.display = "block";
        
        
         
     }

//--------------------------------------------------------------------------------------------------------
     //when add class is pressed
     function unhide2(){
        document.getElementById("subject_id").style.display = "block";
        document.getElementById("course_lv_id").style.display = "block";
        document.getElementById("course_length_id").style.display = "block";
        document.getElementById("title_id").style.display = "block";
        document.getElementById("submit").style.display = "block";


     }

//-----------------------------------------------------------   ---------------------------------------------
    //resets the inputs to their original value 
    function valueReset(){

        document.getElementById("course_length").selectedIndex=" Select the course Length: ";
        document.getElementById("subject").selectedIndex=" Select a subject: ";
        document.getElementById("course_lv").selectedIndex="Select the course level:";
        document.getElementById("subject_title").selectedIndex=" Select your class name: ";
        document.getElementById("elective").selectedIndex=" Select your elective: ";

        //resets the course titles 
        subTit.innerHTML = '<option value="" disabled selected> Select your class: </option>';

        sub.style="background-color: #fafffd";
        ele.style="background-color: #fafffd";
        course_lv.style="background-color: #fafffd";
        subTit.style="background-color: #fafffd";
        lang.style="background-color: #fafffd";
        len1.style="background-color: #fafffd";

 
     }

//--------------------------------------------------------------------------------------------------------
    // Hiding input when submit button is pressed
     function hide() {

        document.getElementById("course_length_id").style.display = "none";
        document.getElementById("subject_id").style.display = "none";
        document.getElementById("title_id").style.display = "none";
        document.getElementById("submit").style.display = "none";
        document.getElementById("course_lv_id").style.display = "none";
        document.getElementById("language_id").style.display = "none";
        document.getElementById("elective_id").style.display = "none";

     }

//--------------------------------------------------------------------------------------------------------
// Clears local Storage
     function clearLocalStorage() {

         localStorage.clear();
         alert("Storage has been reset!");
     }
 
//--------------------------------------------------------------------------------------------------------


// Clears Table
     function clearTable() {

        for (var i = 1; i <= 8; i++) {
            document.getElementById("subject_" + i).textContent = ' ';
            document.getElementById("title_" + i).textContent = ' ';
            document.getElementById("lv_" + i).textContent = ' ';

            localStorage.removeItem('subject_' + i);
            localStorage.removeItem('title_' + i);
            localStorage.removeItem('lv_' + i);
        }
        document.getElementById("class_num").textContent = "0 out of 8 classes used";

        // Ensure the "Add Class" button is visible again if it was hidden
        document.getElementById("add_class").style.display = "inline";

        // Hide the max classes message if it was displayed
        document.getElementById("max_classes").style.display = "none";

        // Re-enable the options in the "subject" and "course_lv" dropdowns
        var subjectOptions = document.getElementById("subject").options;
        var courseLvOptions = document.getElementById("course_lv").options;

        for (var i = 0; i < subjectOptions.length; i++) {
            subjectOptions[i].disabled = false;
        }

        for (var i = 0; i < courseLvOptions.length; i++) {
            courseLvOptions[i].disabled = false;
        }

        document.getElementById("subject").value = "";
        document.getElementById("course_lv").value = "";
        document.getElementById("subject_title").value = "";

    }

 //--------------------------------------------------------------------------------------------------------

     // Stores the user input into the local storage for later use 
     function storing(subVal,lvVal,titVal) {
       var title_holder=document.getElementById("title_var"+num);
       course = {subject:subVal,level:lvVal,title:titVal,assignments:[],categories:{}}
       stored.courses.push(course);
 
         localStorage.setItem('subject_' + num, subVal);
         localStorage.setItem('lv_' + num, lvVal);
         localStorage.setItem('title_' + num, titVal);
         localStorage.setItem('stored',JSON.stringify(stored))
         console.log(subVal);
         console.log(lvVal);
         console.log(titVal);
     }
 
 
//--------------------------------------------------------------------------------------------------------
//checks to see what mp has been selected based on the table thats showing
    function mpCheck(){
        for (var i = 1; i <= 4; i++) {
            var table = document.getElementById("mp" + i + "_table");
            var displayStyle = window.getComputedStyle(table).display;

            if (displayStyle == "block") {
                mpNum = i;
            }
            
        }
        return mpNum;


    }

//--------------------------------------------------------------------------------------------------------
    function classCntShow(){
        mp = mpCheck();
        console.log("num:"+mp);

        document.getElementById("class_num1").style.display="block";


        //hides all then spits out the right mp class cnt
        /*
        for (let i=1; i >=4; i++){
            document.getElementById("class_num"+i).style.display="none";
        }
*/
    }

//------------------------------------------------------------------------------

//changes the class cnt and displays the corresponding one
//gets called in input function
    function classCntMath(len){

        var n=mpCheck();
/*
        var cln="class_num"+n;
        var test=mpNum+n;

        console.log("cln: "+cln);
        console.log("test: "+test);
*/
        if (len=="Full"){
            mpNum1++;
            mpNum2++;
            mpNum3++;
            mpNum4++;

            document.getElementById("class_num1").textContent = mpNum1 + " out of 8 classes used";
            document.getElementById("class_num2").textContent = mpNum2 + " out of 8 classes used";                   
            document.getElementById("class_num3").textContent = mpNum3 + " out of 8 classes used";                   
            document.getElementById("class_num4").textContent = mpNum4 + " out of 8 classes used";                   

        }
        
        else if (len=="1mp"){
            //document.getElementById(cln.textContent = mpNum+n )
        }

        

    }
//------------------------------------------------------------------------------



//dictionary for all of the class options
var subjectTitles = {
 
    //English Tables 
               "English_2": {
    
                   "English 1-2": "English 1-2",
                   "English 2-2": "English 2-2",
                   "English 3-2": "English 3-2",
                   "English 4-2": "English 4-2",
    
               },
    
               "English_1": {
                   "English 1-1": "English 1-1",
                   "English 2-1": "English 2-1",
                   "English 3-1": "English 3-1",
                   "English 4-1": "English 4-1",
    
               },
    
               "English_H":{
                   "English 1-H": "English 1-H",
                   "English 2-H": "English 2-H",
                   "English 3-H": "English 3-H",
                   "English 4-H": "English 4-H",
    
               },
               "English_AP":{
                   "AP Literature/Composition": "AP Literature/Composition",
                   "AP Language/Composition": "AP Language/Composition",
                   "AP Research": "AP Research",
                   "AP Seminar": "AP Seminar",
    
    
               },  
               "English_Electives":{
                   "Creative Writing 1-1": "Creative Writing 1-1",
                   "Creative Writing 2-1": "Creative Writing 2-1",
                   "Journalism and Media 1-1": "Journalism and Media 1-1",
                   "Public Speaking 1-1": "Public Speaking 1-1",
    
                   "Theater Arts 1-1": "Theater Arts 1-1",
                   "Theater Arts 2-1": "Theater Arts 2-1",
                   "Theater Arts 3-H": "Theater Arts 3-H",
                   "Theater Arts 4-H": "Theater Arts 4-H",
    
               },
    
    //History Tables
    
               "History_2":{
    
                   "US History 1-2": "US History 1-2",
                   "US History 2-2": "US History 2-2",
    
                   "World History 1-2": "World History 1-2",
    
               },
    
               "History_1": {
                   "US History 1-1": "US History 1-1",
                   "US History 2-1": "US History 2-1",
    
                   "World History 1-1": "World History 1-1",
       
               },
    
               "History_H":{
                   "US History 1-H": "US History 1-H",
                   "US History 2-H": "US History 2-H",
    
                   "History 1-H": "History 1-H",
    
               },
    
               "History_AP":{
                   "AP US History": "AP US History",
                   "AP World History": "AP World History",
                   "AP European History": "AP European History",
                   "AP US GOV.": "AP US GOV.",
    
               },
               "History_Electives":{
                   "Diversity/Multiculturalism in U.S. Society": "Diversity/Multiculturalism in U.S. Society",
                   "Introduction to African American Studies": "Introduction to African American Studies",
                   "Psychology/Topics in Human Behavior": "Psychology/Topics in Human Behavior",
                   "Sociology": "Sociology",
    
               },
    
    //Math Tables
    
               "Math_2": {
                   "Algebra 1-2": "Algebra 1-2",
                   "Geom 1-2": "Geom 1-2",
                   "Algebra 2-2": "Algebra 2-2",
                   "Pre-Calc 1-2": "Pre-Calc 1-2",
                   "Integrated Math A 1-2": "Integrated Math A 1-2",
                   "Integrated Math B 1-2": "Integrated Math B 1-2",
                   "Statistics 1-2": "Statistics 1-2",
    
               },
    
               "Math_1": {
                   "Algebra 1-1": "Algebra 1-1",
                   "Geom 1-1": "Geom 1-1",
                   "Algebra 2-1": "Algebra 2-1",
                   "Pre-Calc 1-1": "Pre-Calc 1-1",
                   "Calculus 1-1": "Calculus 1-1",
                   "Statistics 1-1": "Statistics 1-1",
    
               },
    
               "Math_H":{
                   "Geom 1-H": "Geom 1-H",
                   "Algebra 2-H": "Algebra 2-H",
                   "Pre-Calc 1-H": "Pre-Calc 1-H",
                   "Calculus 1-H": "Calculus 1-H",
                   "Calculus 3-H": "Calculus 3-H",
                   
               },
    
               "Math_AP": {
                   "AP Statistics": "AP Statistics",
                   "AP Calculus AB": "AP Calculus AB",
                   "AP Calculus BC": "AP Calculus BC",
               },
    
    //Science Tables
    
               "Science_2": {
                   "Biology 1-2": "Biology 1-2",
                   "Chemistry 1-2": "Chemistry 1-2",
                   "Physics 1-2": "Physics 1-2",
                   "Integrated Science 1-2": "Integrated Science 1-2",
    
    
               },
    
               "Science_1": {
                   "Biology 1-1": "Biology 1-1",
                   "Chemistry 1-1": "Chemistry 1-1",
                   "Physics 1-1": "Physics 1-1",
    
               },
    
               "Science_H":{
                   "Biology 1-H": "Biology 1-H",
                   "Chemistry 1-H": "Chemistry 1-H",
                   "Physics 1-H": "Physics 1-H",
                   "Calc 1-H": "Calc 1-H"
                   
               },
    
               "Science_AP": {
                   "AP Chemistry": "AP Chemistry",
                   "AP Biology": "AP Biology",
                   "AP Enviromental": "AP Enviromental",
                   "AP Physics A": "AP Physics A",
                   "AP Physics B": "AP Physics B",
                   "AP Physics C": "AP Physics C",
    
               },
    
               "Science Electives_1": {
                   "Forensics": "Forensics",
                   "Anatomy / Physiology": "Anatomy / Physiology",
               },
    
    
    //Health elective Table 
    // FIXXX ME!!!!
    /*
               "Health_1": {
                   "First Aid 1-1": "First Aid 1-1",
                   "Contemporary Health Issues 1-1": "Contemporary Health Issues 1-1",
    
               },
    */
    //Gym Table 
               "Gym": {
                   "Gym": "Gym",
               },
    //Health Table 
               "Health":{
                "Health":"Health"
               },
    // -----------------------------ELECTIVES:---------------------------------------
    
   
    
    
    //language tables
       //Italian Tables
    
               "Italian_1": {
                   "Italian 1-1": "Italian 1-1",
                   "Italian 2-1": "Italian 2-1",
    
               },
    
               "Italian_H": {
                   "Italian 2-H": "Italian 2-H",
                   "Italian 3-H": "Italian 3-H",
                   "Italian 4-H": "Italian 4-H",
    
               },
       //Mandarin Tables
               "Mandarin_1": {
                   "Mandarin 1-1": "Mandarin 1-1",
                   "Mandarin 2-1": "Mandarin 2-1",
    
               },
    
               "Mandarin_H": {
                   "Mandarin 2-H": "Mandarin 2-H",
                   "Mandarin 3-H": "Mandarin 3-H",
                   "Mandarin 4-H": "Mandarin 4-H",  
    
               },
       //latin tables
               "Latin_1": {
                   "Latin 1-1": "Latin 1-1",
                   "Latin 2-1": "Latin 2-1",
    
               },
    
               "Latin_H": {
                   "Latin 2-H": "Latin 2-H",
                   "Latin 3-H": "Latin 3-H",
                   "Latin 4-H": "Latin 4-H",
    
               },
       //Spanish Tables
               "Spanish_1": {
                   "Spanish for Heritage Speakers 1-1": "Spanish for Heritage Speakers 1-1",
                   "Spanish for Heritage Speakers 2-1": "Spanish for Heritage Speakers 2-1",
                   "Spanish 1-1": "Spanish 1-1",
                   "Spanish 2-1": "Spanish 2-1",
                   "Spanish 3-1": "Spanish 3-1",
                   "Spanish 4-1": "Spanish 4-1",
                   "Spanish 5-1": "Spanish 5-1",
                   "Spanish 6-1": "Spanish 6-1",
    
               },
    
               "Spanish_H": {
                   "Spanish 2-H": "Spanish 2-H",
                   "Spanish 3-H": "Spanish 3-H",
                   "Spanish 4-H": "Spanish 4-H",
    
               },
       //French Tables
               "French_1": {
                   "French 1-1": "French 1-1",
                   "French 2-1": "French 2-1",
                   "French 3-1": "French 3-1",
                   "French 4-1": "French 4-1",
                   "French 5-1": "French 5-1",
    
               },
    
               "French_H": {
                   "French 2-H": "French 2-H",
                   "French 3-H": "French 3-H",
                   "French 4-H": "French 4-H",
    
               },
    //AP lang tables
                "French_AP":{
                    "AP French": "AP French",
               },
                "Spanish_AP":{
                    "AP Spanish": "AP Spanish",
               },
                "Mandarin_AP":{
                    "AP Mandarin": "AP Mandarin",
               },                              
    
    //Computer Science Tables
               "Comp_sci_1":{
                   "Python 1-1": "Python 1-1",
               },
    
               "Comp_sci_H":{
                   "Java 1-H": "Java 1-H",
               },
    
               "Comp_sci_AP": {
                   "AP Computer Science Principles (APCSP)": "AP Computer Science Principles (APCSP)",
                   "AP Computer Science A (APCSA)": "AP Computer Science A (APCSA)",
               },
    
    //Family / Consumer Science Tables
    
               "Family_Science_1": {
                   "Child Growth 1-1": "Child Growth 1-1",
                   "Interior Design 1-1": "Interior Design 1-1",
                   "Fashion 1-1": "Fashion 1-1",
                   "Fashion 2-1": "Fashion 2-1",
                   "Culinary Arts 1-1": "Culinary Arts 1-1",
                   "Culinary Arts 2-1": "Culinary Arts 2-1",
    
               },
    
               "Family_Science_H": {
                   "Fashion Merchandising H": "Fashion Merchandising H",
                   "Culinary Arts 3-H": "Culinary Arts 3-H",
               },
    
    //Buisness Tables 
    
               "Buisness_1": {
                   "Accounting 1-1": "Accounting 1-1",
                   "Accounting 2-1": "Accounting 2-1",
                   "Introduction to Business 1-1": "Introduction to Business 1-1",
                   "Business Applications 1-1": "Business Applications 1-1",
                   "Business Law and Ethics 1-1": "Business Law and Ethics 1-1",
                   "Business Management 1-1": "Business Management 1-1",
                   "Economics 1-1": "Economics 1-1", 
                   "Marketing and Advertising 1-1": "Marketing and Advertising 1-1", 
                   "Personal Finance 1-1": "Personal Finance 1-1",
                   "Finance and Investing 1-1": "Finance and Investing 1-1",
    
               }, 
    
               "Buisness_H": {
                   "International Business 1-H": "International Business 1-H", 
               },
    
               "Buisness_AP": {
                   "AP Economics": "AP Economics",
               },
    
    //TECHNOLOGY EDUCATION Tables
    
               "Tech_Edu_2": {
                   "ESports 1-2": "ESports 1-2",
               },
    
               "Tech_Edu_1": {
                   "Architectural Drawing 1-1": "Architectural Drawing 1-1", 
                   "Architectural Drawing 2-1": "Architectural Drawing 2-1", 
                   "Electronics 1-1": "Electronics 1-1", 
                   "Electronics 2-1": "Electronics 2-1", 
                   "Engineering Design 1-1": "Engineering Design 1-1", 
                   "Engineering Design 2-1": "Engineering Design 2-1", 
                   "Robotics 1-1": "Robotics 1-1", 
                   "Robotics 2-1": "Robotics 2-1", 
                   "Automotive Technology 1-1": "Automotive Technology 1-1",
                   "Automotive Technology 2-1": "Automotive Technology 2-1", 
                   "Digital Media and Photography 1-1": "Digital Media and Photography 1-1",
                   "Digital Media and Photography 2-1": "Digital Media and Photography 2-1",
                   "Woodworking 1-1": "Woodworking 1-1",
                   "Woodworking 2-1": "Woodworking 2-1",
    
               /* For exclusively jps
                   "Construction Technology 1-1": "Construction Technology 1-1", 
                   "Study of Film History 1-1": "Study of Film History 1-1",
                   "Video Production 1-1": "Video Production 1-1",
                   "Video Production 2-1": "Video Production 2-1",
    
               */
    
    
               },
               
    // Visual Arts classes
    
               "Visual_Arts_1": {
                   "Art 1-1": "Art 1-1",
                   "Art 2-1": "Art 2-1",
                   "Visual Arts 1-1": "Visual Arts 1-1",
                   "Ceramics 1-1": "Ceramics 1-1",
                   "Three-Dimensional Design 1-1": "Three-Dimensional Design 1-1",
                   "Painting/Drawing 1-1": "Painting/Drawing 1-1",
                   "Printmaking and Design 1-1": "Printmaking and Design 1-1",
    
               },
               "Visual_Arts_AP": {
                   "Visual Arts 3/AP Studio Art 2-D": "Visual Arts 3/AP Studio Art 2-D",
                   "AP Art History": "AP Art History", 
                   "AP Studio Art 3-D": "AP Studio Art 3-D", 
               },
    
    // Performing Arts Tables
    
               "Perf_Arts_1": {
                   "Freshmen band 1-1": "Freshmen band 1-1",
                   "Symphonic Band 1-1": "Symphonic Band 1-1",
                   "Symphonic Band 2-1": "Symphonic Band 2-1",
                   "Wind Ensemble 1-1": "Wind Ensemble 1-1", 
                   "Concert Orchestra 1-1": "Concert Orchestra 1-1", 
                   "Chamber Orchestra 1-1": "Chamber Orchestra 1-1",
                   "Camerata Orchestra 1-1": "Camerata Orchestra 1-1",
    
                   /*JPS EXCLUSIVE
                   "Concert Choir 1-1 (JPS)": "Concert Choir 1-1 (JPS)", 
                   "Concert Choir 2-1 (JPS)": "Concert Choir 2-1 (JPS)", 
                   */
                  "A Capella Choir 1-1": "A Capella Choir 1-1", 
                  "Chamber Singers 1-1": "Chamber Singers 1-1",
                  "Music Theory 1-1": "Music Theory 1-1",
                  "Music Theory 2-1": "Music Theory 2-1",
                  "Introduction to Music Technology/Composition 1-1": "Introduction to Music Technology/Composition 1-1",
                  "Music Technology II: Electronic Music & Audio Engineering 2-1": "Music Technology II: Electronic Music & Audio Engineering 2-1",
                  "Dance 1-1": "Dance 1-1",
                  "Dance 2-1": "Dance 2-1",
                  "Dance Repertory 1-1": "Dance Repertory 1-1",
                  "Guitar 1-1": "Guitar 1-1",
                  "Guitar 2-1": "Guitar 2-1",
    
               },
    
               "Perf_Arts_H": {
                   "Symphonic Band 3-H": "Symphonic Band 3-H", 
                   "Wind Ensemble 2-H": "Wind Ensemble 2-H", 
                   "Chamber Orchestra 2-H": "Chamber Orchestra 2-H", 
                   "Camerata Orchestra 2-H": "Camerata Orchestra 2-H", 
                   "A Capella Choir 2-H": "A Capella Choir 2-H", 
                   "Chamber Singers 2-H": "Chamber Singers 2-H", 
                   "Dance 3-H": "Dance 3-H", 
                   "Dance 4-H": "Dance 4-H",
                   "Guitar 3-H": "Guitar 3-H", 
                   "Guitar 4-H": "Guitar 4-H", 
    
               }, 
    
               "Perf_Arts_AP": {
                   "AP Music Theory 3": "AP Music Theory 3",
               },
    
       };
    
    
//------------------------------------------------------------------------------

    function titCheck(){

        for (let key in subjectTitles) {
        console.log("key: "+ key); 
        console.log("subject title key: "+subjectTitles[key])
        console.log("everything: "+key,subjectTitles[key])
        }

        for (var i=0; i<= subjectTitles.length; i++){
        console.log("sub tit : "+subjectTitles[i]);
       }
    }
//--------------------------------------------------------------------------------------------------------
 

//                              ** Dev Tools **









//easter egg function
     function easter1(){
         alert("hey! you found easter egg numero uno!")
     }

//--------------------------------------------------------------------------------------------------------
//console.log function, admin button
    function loggy(){
        console.log("--------");
        console.log(" ");

    }
 //--------------------------------------------------------------------------------------------------------
//SHOW all table function, admin button
    function show_tables(){
        document.getElementById("mp1_table").style.display="inline";
        document.getElementById("mp2_table").style.display="inline";
        document.getElementById("mp3_table").style.display="inline";
        document.getElementById("mp4_table").style.display="inline";
    }


//--------------------------------------------------------------------------------------------------------
//HIDE all table function, admin button
    function hide_tables(){
        document.getElementById("mp1_table").style.display="none";
        document.getElementById("mp2_table").style.display="none";
        document.getElementById("mp3_table").style.display="none";
        document.getElementById("mp4_table").style.display="none";
    }


 //--------------------------------------------------------------------------------------------------------
//UNhides all , admin button
    function unhideADMIN(){
        show_tables();
        unhide2();
        
        elective_id.style.display = "block";
        document.getElementById("course_lv").style.display = "block";
        document.getElementById("language_id").style.display="block";

        for(var i=1;i<=4;i++){
            document.getElementById("mp"+i+"_table").style.display = "block" ;
        }
        document.getElementById("subject_id").style.display = "block";
        document.getElementById("options").style.display = "block";
        document.getElementById("course_length_id").style.display = "block";


    }


//--------------------------------------------------------------------------------------------------------
//HIDES all , admin button
    function hideADMIN(){
    hide_tables()
    hide()
    document.getElementById("add_class").style.display = "none";

    for(var i=1;i<=4;i++){
        document.getElementById("mp"+i+"_table").style.display = "none";
        document.getElementById("class_num"+i).style.display = "none";
        
    }

    }


//--------------------------------------------------------------------------------------------------------
//adds a value to each table, admin button
    function unoMore(){
        for(var i=1;i<=4;i++){
            mpNum=i;
            document.getElementById("class_num"+i).textContent = mpNum4 + " out of 8 classes used";                   
            document.getElementById(mpNum+"subject_" + num).textContent = subVal;
            document.getElementById(mpNum+"title_" + num).textContent = titVal;
            document.getElementById(mpNum+"lv_" + num).textContent = lvVal;
        }
    }

//--------------------------------------------------------------------------------------------------------
//fills table, admin button
    function fillTable(){
        var words = "words";

        for(var u=1;u<=4;u++){
            for(var i=1;i<=8;i++){
                document.getElementById(u +"subject_" + i).textContent = words;
                document.getElementById(u+"title_" + i).textContent = words;
                document.getElementById(u+"lv_" + i).textContent = words;
            }

        }


    }
 




