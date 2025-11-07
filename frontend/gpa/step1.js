//All Course Titles--------------------------------------------------------------------------------------------------------
var courseLengthDescriptions = {
    Full: "Full Year Course",
    "1mp": "One Marking Period Course",
    Sem: "Semester Course",
};
var subjectTitles_v2 = {
    Regular: {
        English: {
            Levels: {
                Academic: [
                    "English 1-2",
                    "English 2-2",
                    "English 3-2",
                    "English 4-2",
                ],
                Accelerated: [
                    "English 1-1",
                    "English 2-1",
                    "English 3-1",
                    "English 4-1",
                ],
                Honors: [
                    "English 1-H",
                    "English 2-H",
                    "English 3-H",
                    "English 4-H",
                ],
                AP: [
                    "AP Literature/Composition",
                    "AP Language/Composition",
                    "AP Research",
                    "AP Seminar",
                ],
            },
            Lengths: ["Full"],
        },
        History: {
            Levels: {
                Academic: [
                    "US History 1-2",
                    "US History 2-2",
                    "World History 1-2",
                ],
                Accelerated: [
                    "US History 1-1",
                    "US History 2-1",
                    "World History 1-1",
                ],
                Honors: ["US History 1-H", "US History 2-H", "History 1-H"],
                AP: [
                    "AP US History",
                    "AP World History",
                    "AP European History",
                    "AP US GOV.",
                ],
            },
            Lengths: ["Full"],
        },
        Math: {
            Levels: {
                Academic: [
                    "Algebra 1-2",
                    "Geom 1-2",
                    "Algebra 2-2",
                    "Pre-Calc 1-2",
                    "Integrated Math A 1-2",
                    "Integrated Math B 1-2",
                    "Statistics 1-2",
                ],
                Accelerated: [
                    "Algebra 1-1",
                    "Geom 1-1",
                    "Algebra 2-1",
                    "Pre-Calc 1-1",
                    "Calculus 1-1",
                    "Statistics 1-1",
                ],
                Honors: [
                    "Geom 1-H",
                    "Algebra 2-H",
                    "Pre-Calc 1-H",
                    "Calculus 1-H",
                    "Calculus 3-H",
                ],
                AP: [
                    "AP Pre-Calculus",
                    "AP Statistics",
                    "AP Calculus AB",
                    "AP Calculus BC",
                ],
            },
            Lengths: ["Full"],
        },
        Science: {
            Levels: {
                Academic: [
                    "Biology",
                    "Chemistry",
                    "Physics",
                    "Integrated Science",
                ],
                Accelerated: ["Biology 1-1", "Chemistry 2-1", "Physics 3-1"],
                Honors: ["Biology H", "Chemistry H", "Physics H"],
                AP: [
                    "AP Chemistry",
                    "AP Biology",
                    "AP Enviromental",
                    "AP Physics A",
                    "AP Physics B",
                    "AP Physics C",
                ],
            },
            Lengths: ["Full"],
        },
        Health: {
            Levels: {
                Standard: ["Health"],
            },
            Lengths: ["1mp", "Sem"],
        },
        Gym: {
            Levels: {
                Standard: ["Gym"],
            },
            Lengths: ["1mp", "Sem"],
        },
        Language: {
            Italian: {
                Levels: {
                    Academic: ["Italian 1-1", "Italian 2-1"],
                    Honors: ["Italian 2-H", "Italian 3-H", "Italian 4-H"],
                },
                Lengths: ["Full"],
            },
            Mandarin: {
                Levels: {
                    Academic: ["Mandarin 1-1", "Mandarin 2-1"],
                    Honors: ["Mandarin 2-H", "Mandarin 3-H", "Mandarin 4-H"],
                    AP: ["AP Mandarin"],
                },
                Lengths: ["Full"],
            },
            Latin: {
                Levels: {
                    Academic: ["Latin 1-1", "Latin 2-1"],
                    Honors: ["Latin 2-H", "Latin 3-H", "Latin 4-H"],
                },
                Lengths: ["Full"],
            },
            Spanish: {
                Levels: {
                    Academic: [
                        "Spanish for Heritage Speakers 1-1",
                        "Spanish for Heritage Speakers 2-1",
                        "Spanish 1-1",
                        "Spanish 2-1",
                        "Spanish 3-1",
                        "Spanish 4-1",
                        "Spanish 5-1",
                        "Spanish 6-1",
                    ],
                    Honors: ["Spanish 2-H", "Spanish 3-H", "Spanish 4-H"],
                    AP: ["AP Spanish"],
                },
                Lengths: ["Full"],
            },
            French: {
                Levels: {
                    Academic: [
                        "French 1-1",
                        "French 2-1",
                        "French 3-1",
                        "French 4-1",
                        "French 5-1",
                    ],
                    Honors: ["French 2-H", "French 3-H", "French 4-H"],
                    AP: ["AP French"],
                },
                Lengths: ["Full"],
            },
        },
    },
    Electives: {
        English: {
            Levels: {
                Electives: [
                    "Creative Writing 1-1",
                    "Creative Writing 2-1",
                    "Journalism and Media 1-1",
                    "Public Speaking 1-1",
                    "Theater Arts 1-1",
                    "Theater Arts 2-1",
                    "Theater Arts 3-H",
                    "Theater Arts 4-H",
                ],
            },
            Lengths: ["1mp", "Sem"],
        },
        History: {
            Levels: {
                Electives: [
                    "Diversity/Multiculturalism in U.S. Society",
                    "Introduction to African American Studies",
                    "Psychology/Topics in Human Behavior",
                    "Sociology",
                ],
            },
            Lengths: ["1mp", "Sem"],
        },
        Science: {
            Levels: {
                Electives: ["Forensics", "Anatomy / Physiology"],
            },
            Lengths: ["1mp", "Sem"],
        },
        Family_Science: {
            Levels: {
                Academic: [
                    "Child Growth 1-1",
                    "Interior Design 1-1",
                    "Fashion 1-1",
                    "Fashion 2-1",
                    "Culinary Arts 1-1",
                    "Culinary Arts 2-1",
                ],
                Honors: ["Fashion Merchandising H", "Culinary Arts 3-H"],
            },
            Lengths: ["1mp", "Sem"],
        },
        Buisness: {
            Levels: {
                Academic: [
                    "Introduction to Business 1-1",
                    "Business Applications 1-1",
                    "Business Law and Ethics 1-1",
                    "Business Management 1-1",
                    "Economics 1-1",
                    "Marketing and Advertising 1-1",
                    "Personal Finance 1-1",
                    "Finance and Investing 1-1",
                ],
                Accelerated: ["Acounting 1-1"],
                Honors: ["Accounting 2-H", "International Business 1-H"],
                AP: ["AP Economics"],
            },
            Lengths: ["1mp", "Sem", "Full"],
        },
        Tech_Edu: {
            Levels: {
                Academic: [
                    "Academic ESports",
                    "Academic ESports 2",
                    "Architectural Drawing 1-1",
                    "Architectural Drawing 2-1",
                    "Electronics 1-1",
                    "Electronics 2-1",
                    "Engineering Design 1-1",
                    "Engineering Design 2-1",
                    "Robotics 1-1",
                    "Robotics 2-1",
                    "Automotive Technology 1-1",
                    "Automotive Technology 2-1",
                    "Digital Media and Photography 1-1",
                    "Digital Media and Photography 2-1",
                    "Woodworking 1-1",
                    "Woodworking 2-1",
                    /* For exclusively jps
            "Construction Technology 1-1", 
            "Study of Film History 1-1",
            "Video Production 1-1",
            "Video Production 2-1",
          */
                ],
                Honors: ["Academic ESports 2"],
            },
            Lengths: ["1mp", "Sem", "Full"],
        },
        Visual_Arts: {
            Levels: {
                Academic: [
                    "Art 1-1",
                    "Art 2-1",
                    "Visual Arts 1-1",
                    "Ceramics 1-1",
                    "Three-Dimensional Design 1-1",
                    "Painting/Drawing 1-1",
                    "Printmaking and Design 1-1",
                    /*JPS EXCLUSIVE
            "Concert Choir 1-1 (JPS)", 
            "Concert Choir 2-1 (JPS)", 
          */
                ],
                AP: [
                    "Visual Arts 3/AP Studio Art 2-D",
                    "AP Art History",
                    "AP Studio Art 3-D",
                ],
            },
            Lengths: ["1mp", "Sem", "Full"],
        },
        Perf_Arts: {
            Levels: {
                Academic: [
                    "Freshmen band 1-1",
                    "Symphonic Band 1-1",
                    "Symphonic Band 2-1",
                    "Wind Ensemble 1-1",
                    "Concert Orchestra 1-1",
                    "Chamber Orchestra 1-1",
                    "Camerata Orchestra 1-1",
                    "A Capella Choir 1-1",
                    "Chamber Singers 1-1",
                    "Music Theory 1-1",
                    "Music Theory 2-1",
                    "Introduction to Music Technology/Composition 1-1",
                    "Music Technology II: Electronic Music & Audio Engineering 2-1",
                    "Dance 1-1",
                    "Dance 2-1",
                    "Dance Repertory 1-1",
                    "Guitar 1-1",
                    "Guitar 2-1",
                ],
                Honors: [
                    "Symphonic Band 3-H",
                    "Wind Ensemble 2-H",
                    "Chamber Orchestra 2-H",
                    "Camerata Orchestra 2-H",
                    "A Capella Choir 2-H",
                    "Chamber Singers 2-H",
                    "Dance 3-H",
                    "Dance 4-H",
                    "Guitar 3-H",
                    "Guitar 4-H",
                ],
                AP: ["AP Music Theory 3"],
            },
            Lengths: ["1mp", "Sem", "Full"],
        },
        Comp_sci: {
            Levels: {
                Academic: ["Python 1-1"],
                Honors: ["Java 1-H"],
                AP: [
                    "AP Computer Science Principles (APCSP)",
                    "AP Computer Science A (APCSA)",
                ],
            },
            Lengths: ["Full"],
        },
    },
};
//variables----------------------------------------------------------------------
var currentMpNum = 0;
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

var elective_id = document.getElementById("elective_id");
var language_id = document.getElementById("language_id");

var num = 0;
var mpNum = 0;

//courses info list
let stored = { courses: [] };
// Get locally stored data first\

populateSubjects();
getStorage();
renderTable();

// Calling Functions -----------------------------------------------------------------------

//when anything gets changed, run this

document.getElementById("subject").addEventListener("change", function () {
    var sub = document.getElementById("subject").value;
    dropBg(sub);
    console.log(sub);

    // If the subject is elective, then display elective and undisplay language
    if (sub === "Electives") {
        elective_id.style.display = "block";
        language_id.style.display = "none";
        populateElectives();
    }

    // If the subject is language, then display language and undisplay elective
    else if (sub == "Language") {
        language_id.style.display = "block";
        elective_id.style.display = "none";
        populateLanguages();
    }

    // Else, hide both elective and language dropdowns
    else {
        elective_id.style.display = "none";
        language_id.style.display = "none";
    }
    unhide2();
    populateLevels();
    populateTitles();
    populateCourseLen();
});

// when the subject is changed, the course lv gets populated
document.getElementById("elective").addEventListener("change", function () {
    var y = ele;
    dropBg(y);
    populateLevels();
    populateTitles();
    populateCourseLen();
});

// when the course lv is changed, the title gets populated
document.getElementById("course_lv_id").addEventListener("change", function () {
    var y = course_lv;
    dropBg(y);
});

// when the subject title gets changed to language, the language dropdown gets populated with its according language levels
document.getElementById("language").addEventListener("change", function () {
    var y = lang;
    dropBg(y);
    populateLevels();
    populateTitles();
    populateCourseLen();
});

// when course level is changed, the bg gets changed
document.getElementById("course_lv").addEventListener("change", function () {
    var y = lvVal;
    dropBg(y);
    populateTitles();
});

// when the course length is changed, the bg gets changed
document
    .getElementById("course_length_id")
    .addEventListener("change", function () {
        var y = len1;
        dropBg(y);
    });

// when the subject title is changed, the bg gets changed
document
    .getElementById("subject_title")
    .addEventListener("change", function () {
        var y = subTit;
        dropBg(y);
    });

//when course/elective/lang is changes, the title dropdown function runs and options get changed
// document.getElementById('course_lv_id','elective_id','language_id').addEventListener('change', title_change);

// ----------------------- Functions -------------------------------------------------------------------------------

// Gets the stored subject data from the local storage
function getStorage() {
    const storedData = localStorage.getItem("stored");
    if (storedData) {
        stored = JSON.parse(storedData);
        console.log(JSON.stringify(stored));
    }
}

//------------------------------------------------------------------------------------------------

// Renders Table for the Stored Subjects
function renderTable() {
    mpNum = currentMpNum;
    if (mpNum === 0) {
        return; // If no marking period is selected, do not render the table
    }
    console.log("MP Number: " + mpNum);
    miniTable = document.getElementById("miniTable");
    miniTable.innerHTML = "";
    const table = document.createElement("table");
    const tHead = document.createElement("thead");

    // Create the table header
    tHead.innerHTML = `
    <th> # </th>
    <th> Subject </th>
    <th> Course Lv </th>
    <th> Course Title </th>
    <th> Course Length </th>
    <th> Action </th>`;
    table.appendChild(tHead);
    const tBody = document.createElement("tbody");
    counter = 0;
    // Loop through the stored courses and create a row for each
    stored.courses.forEach((course, index) => {
        if (course.markingPeriod !== mpNum) return; // Only render courses for the selected marking period
        const row = document.createElement("tr");
        row.innerHTML = `<td>${++counter}</td>
        <td>${course.subject}</td>
        <td>${course.level}</td>
        <td>${course.title}</td>
        <td>${courseLengthDescriptions[course.course_length]}</td>
        <td><button class="hover:brightness-80 border"
        style="background-color:#cc0c05; border-radius: 10px; z-index: 2;
        "; id='removeButton'onclick = removeCourse(this)>Delete</button></td>`;
        tBody.appendChild(row);
    });

    // Append the body to the table
    table.appendChild(tBody);
    miniTable.appendChild(table);
    miniTable.style.display = "block";

    // Update the number of classes used
    document.getElementById("class_num").textContent =
        counter + " out of 8 classes used";

    // Hiding the add class button
    if (counter >= 8) {
        document.getElementById("add_class").style.display = "none";
        document.getElementById("max_classes").style.display = "inline";
    } else {
        document.getElementById("add_class").style.display = "inline";
        document.getElementById("max_classes").style.display = "none";
    }
}

//-------------------------------------------------------------------------------------------------
// Removes a course from the stored courses
// This function is called when the delete button is clicked
function removeCourse(element) {
    selectedCourse = element.closest("tr");
    courseName = selectedCourse.cells[3].innerHTML;
    console.log(courseName);
    console.log(selectedCourse);
    stored.courses.forEach((course, index) => {
        if (course.markingPeriod === mpNum && course.title === courseName) {
            console.log("Found course to remove: " + course.title);
            // Remove the course from the stored courses
            stored.courses.splice(index, 1);
            console.log("Course removed successfully");
        }
    });
    localStorage.setItem("stored", JSON.stringify(stored));
    //Render the table again after removing the course
    renderTable();
}
//-----------------------------------------------------------------------------------------------

//changes the bg, unhides the corresponding table, unhides mp cnt
//gets called when mp button is pressed
function mpButts(mpNum) {
    bg(mpNum);
    //unhideTable(mpNum);
    //document.getElementById("class_num"+mpNum).style.display="block";
    currentMpNum = mpNum;
    document.getElementById("options").style.display = "block";
    document.getElementById("mpSel").textContent =
        " You are now editing mp" + mpNum;
    document.getElementById("mpSel").style.display = "block";
    renderTable();
}

//------------------------------------------------------------------------------------------------

// when the mp button is clicked, the corresponding button will change bg color
// gets called in mpButts
function bg(mpNum) {
    //staying as a commenting section as of rn (7/13), used to hard code the bg
    //---of the mp buttons when clicked on, soft coding it by changing the individual
    //--- colors in #input.css
    /*
    for (var i=1;i<=4;i++){
        document.getElementById("mp"+i).style="background-color: #ffd04f"
    }
    document.getElementById("mp"+mpNum).style="background-color: #d8ad36";
    */
}

//------------------------------------------------------------------------------------------------

//changes the bg of the dropdown menus
//gets called whenever of the dropdown menus are changed
function dropBg(y) {
    if (y.selectedIndex != 0) {
        y.style = "background-color: #D3D3D3";
    } else {
        y.style = "background-color: #fafffd";
    }
}

//--------------------------------------------------------------------------------------------------------
// Populates the subjects dropdown based on the subjectTitles_v2 object
// Gets called on page load to populate the subjects dropdown
function populateSubjects() {
    var subjectSelect = document.getElementById("subject");
    subjectSelect.innerHTML =
        '<option value="" disabled selected> Select a subject: </option>';

    // Populate the subjects dropdown
    for (var subject in subjectTitles_v2["Regular"]) {
        var option = document.createElement("option");
        option.value = subject;
        option.textContent = subject.replace(/_/g, " "); // Replace underscores with spaces for display
        subjectSelect.appendChild(option);
    }
    var electiveOption = document.createElement("option");
    electiveOption.value = "Electives";
    electiveOption.textContent = "Electives";
    subjectSelect.appendChild(electiveOption);
}

//-----------------------------------------------------------------------------------------------------------
// Populates the electives based on the selected subject
// Gets called when subject is changed to Electives
function populateElectives() {
    var electiveSelect = document.getElementById("elective");
    electiveSelect.innerHTML =
        '<option value="" disabled selected> Select your elective: </option>';

    // Populate the electives dropdown
    for (var subject in subjectTitles_v2["Electives"]) {
        var option = document.createElement("option");
        option.value = subject;
        option.textContent = subject.replace(/_/g, " "); // Replace underscores with spaces for display
        electiveSelect.appendChild(option);
    }
}

//--------------------------------------------------------------------------------------------------------
// Populates the languages based on the selected subject
// Gets called when subject is changed to Language
function populateLanguages() {
    var languageSelect = document.getElementById("language");
    languageSelect.innerHTML =
        '<option value="" disabled selected> Select your language: </option>';
    var languages = subjectTitles_v2["Regular"]["Language"];

    // Populate the languages dropdown
    for (var lang in languages) {
        var option = document.createElement("option");
        option.value = lang;
        option.textContent = lang.replace(/_/g, " "); // Replace underscores with spaces for display
        languageSelect.appendChild(option);
    }
}

//--------------------------------------------------------------------------------------------------------
// Populates the course levels based on the selected subject and elective
// Gets called when subject or elective is changed
function populateLevels() {
    var subVal = document.getElementById("subject").value;
    var courseLvSelect = document.getElementById("course_lv");
    var levels;
    // Clear previous options
    courseLvSelect.innerHTML =
        '<option value="" disabled selected> Select the course level: </option>';
    // Check if the subject is Electives
    if (subVal === "Electives") {
        elective = document.getElementById("elective").value;
        console.log(subjectTitles_v2["Electives"][elective]);
        levels = subjectTitles_v2["Electives"][elective]["Levels"];
    }
    // If Language is selected, get the language value
    else if (subVal === "Language") {
        var langVal = document.getElementById("language").value;
        console.log("Language selected: " + langVal);
        console.log(subjectTitles_v2["Regular"]["Language"][langVal]);
        levels = subjectTitles_v2["Regular"]["Language"][langVal]["Levels"];
    }
    // Otherwise, get the levels for the selected subject
    else {
        console.log(subjectTitles_v2["Regular"][subVal]);
        levels = subjectTitles_v2["Regular"][subVal]["Levels"];
    }
    if (!levels) {
        return;
    }
    // Populate the course level dropdown
    for (var level in levels) {
        var option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        courseLvSelect.appendChild(option);
    }
}

//--------------------------------------------------------------------------------------------------------
// Populates the course titles based on the selected subject and course level
// Gets called when course level is changed
function populateTitles() {
    var titleSelect = document.getElementById("subject_title");
    var levelVal = document.getElementById("course_lv").value;
    var subVal = document.getElementById("subject").value;
    titleSelect.innerHTML =
        '<option value="" disabled selected> Select your class: </option>';
    var titles;
    // Check if the subject is Electives
    if (subVal === "Electives") {
        elective = document.getElementById("elective").value;
        console.log(subjectTitles_v2["Electives"][elective]);
        titles = subjectTitles_v2["Electives"][elective]["Levels"][levelVal];
    }
    // If Language is selected, get the language value
    else if (subVal === "Language") {
        var langVal = document.getElementById("language").value;
        console.log("Language selected: " + langVal);
        console.log(subjectTitles_v2["Regular"]["Language"][langVal]);
        titles =
            subjectTitles_v2["Regular"]["Language"][langVal]["Levels"][
                levelVal
            ];
    }
    // Otherwise, get the titles for the selected subject and level
    else {
        console.log(subjectTitles_v2["Regular"][subVal]);
        titles = subjectTitles_v2["Regular"][subVal]["Levels"][levelVal];
    }
    // If no titles are found, return early (just to keep console clean)
    if (!titles) {
        return;
    }

    // Populate the course titles dropdown
    titles.forEach((title) => {
        // Check if the course is already selected for the current marking period
        const alreadySelected = stored.courses.some(
            (course) =>
                course.title == title && course.markingPeriod == currentMpNum
        );
        if (alreadySelected) {
            return; // Skip adding this option
        }
        var option = document.createElement("option");
        option.value = title;
        option.textContent = title.replace(/_/g, " "); // Replace underscores with spaces for display;
        titleSelect.appendChild(option);
    });
}
//--------------------------------------------------------------------------------------------------------
function populateCourseLen() {
    var courseLenSelect = document.getElementById("course_length");
    var subVal = document.getElementById("subject").value;
    var lengthVal = document.getElementById("course_lv").value;

    courseLenSelect.innerHTML =
        '<option value="" disabled selected> Select the course length: </option>';
    var courseLengths;

    // Check if the subject is Electives
    if (subVal === "Electives") {
        elective = document.getElementById("elective").value;
        console.log(subjectTitles_v2["Electives"][elective]);
        courseLengths = subjectTitles_v2["Electives"][elective]["Lengths"];
    }
    // If Language is selected...
    else if (subVal === "Language") {
        var langVal = document.getElementById("language").value;
        console.log("Language selected: " + langVal);
        console.log(subjectTitles_v2["Regular"]["Language"][lengthVal]);
        courseLengths =
            subjectTitles_v2["Regular"]["Language"][langVal]["Lengths"];
    }
    // Otherwise, get the lengths for the selected subject
    else {
        courseLengths = subjectTitles_v2["Regular"][subVal]["Lengths"];
    }
    // Populate the languages dropdown
    courseLengths.forEach((courselen) => {
        var option = document.createElement("option");
        option.value = courselen;
        console.log("Course Length: " + option.value);
        option.textContent = courseLengthDescriptions[courselen]; // Replace underscores with spaces for display
        courseLenSelect.appendChild(option);
    });
}

//--------------------------------------------------------------------------------------------------------
// getting the user input and pasting it to the corresponding table
//gets called when submit is pressed
function input() {
    // Try block to catch any errors that may occur during input processing
    try {
        // getting the user input and pasting it to the table
        subject = document.getElementById("subject").value;
        course_lv = document.getElementById("course_lv").value;
        course_length = document.getElementById("course_length").value;
        subject_title = document.getElementById("subject_title").value;
        document.getElementById("errorMessage").textContent = "";

        // Checking if the inputs are empty
        if (
            subject.trim() === "" ||
            course_lv.trim() === "" ||
            course_length.trim() === "" ||
            subject_title.trim() === ""
        ) {
            alert("One or more inputs are empty!");
            return;
        }
        storing(subject, course_lv, course_length, subject_title);
        renderTable();
    } catch (err) {
        // Raise an error if the above program results in one
        document.getElementById("errorMessage").textContent = err.message;
    }
}
//--------------------------------------------------------------------------------------------------------
//when add class is pressed
function unhide2() {
    document.getElementById("subject_id").style.display = "block";
    document.getElementById("course_lv_id").style.display = "block";
    document.getElementById("course_length_id").style.display = "block";
    document.getElementById("title_id").style.display = "block";
    document.getElementById("submit").style.display = "block";
}

//-----------------------------------------------------------   ---------------------------------------------
//resets the inputs to their original value
function valueReset() {
    //resets the inputs to their original value
    document.getElementById("course_length").selectedIndex =
        " Select the course Length: ";
    document.getElementById("subject").selectedIndex = " Select a subject: ";
    document.getElementById("course_lv").selectedIndex =
        "Select the course level:";
    document.getElementById("subject_title").selectedIndex =
        " Select your class name: ";
    document.getElementById("elective").selectedIndex =
        " Select your elective: ";

    //resets the course titles
    subTit.innerHTML =
        '<option value="" disabled selected> Select your class: </option>';

    sub.style = "background-color: #fafffd";
    ele.style = "background-color: #fafffd";
    course_lv.style = "background-color: #fafffd";
    subTit.style = "background-color: #fafffd";
    lang.style = "background-color: #fafffd";
    len1.style = "background-color: #fafffd";
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
    S;
    refreshPage();
}

//--------------------------------------------------------------------------------------------------------
// Refreshes the page
function refreshPage() {
    window.location.reload();
}

//--------------------------------------------------------------------------------------------------------

// Stores the user input into the local storage for later use
function storing(subject, course_lv, course_length, subject_title) {
    var markingpNum = currentMpNum;
    // How the courses will all be stored
    course = {
        markingPeriod: markingpNum,
        subject: subject,
        level: course_lv,
        course_length: course_length,
        title: subject_title,
        assignments: [],
        categories: {},
    };
    stored.courses.push(course);
    // Store the course in local storage
    localStorage.setItem("markingPeriod", markingpNum);
    localStorage.setItem("subject_" + num, subject);
    localStorage.setItem("lv_" + num, course_lv);
    localStorage.setItem("title_" + num, subject_title);
    localStorage.setItem("stored", JSON.stringify(stored));
    // Log the stored course for debugging
    console.log(markingpNum);
    console.log(subject);
    console.log(course_lv);
    console.log(subject_title);
    console.log(course);
}

//------------------------------------------------------------------------------

function titCheck() {
    for (let key in subjectTitles) {
        console.log("key: " + key);
        console.log("subject title key: " + subjectTitles[key]);
        console.log("everything: " + key, subjectTitles[key]);
    }

    for (var i = 0; i <= subjectTitles.length; i++) {
        console.log("sub tit : " + subjectTitles[i]);
    }
}

//------------------------------------------------------------------------------
function overlayOFF() {
    document.body.style.filter = "none";
    document.body.style.overflow = "";
    document.querySelector(".inside-overlay").style.display = "none";
}
function overlayON() {
    document.body.style.filter = "brightness(30%) blur(2px)";
    document.body.style.overflow = "hidden";
    document.querySelector(".inside-overlay").style.display = "block";
}

//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//                              ** Dev Tools **
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//easter egg function
function easter1() {
    alert("hey! you found easter egg numero uno!");
}

//--------------------------------------------------------------------------------------------------------
//console.log function, admin button
function loggy() {
    console.log("--------");
    console.log(" ");
}
//--------------------------------------------------------------------------------------------------------
//SHOW all table function, admin button
function show_tables() {
    document.getElementById("mp1_table").style.display = "inline";
    document.getElementById("mp2_table").style.display = "inline";
    document.getElementById("mp3_table").style.display = "inline";
    document.getElementById("mp4_table").style.display = "inline";
}

//--------------------------------------------------------------------------------------------------------
//HIDE all table function, admin button
function hide_tables() {
    document.getElementById("mp1_table").style.display = "none";
    document.getElementById("mp2_table").style.display = "none";
    document.getElementById("mp3_table").style.display = "none";
    document.getElementById("mp4_table").style.display = "none";
}

//--------------------------------------------------------------------------------------------------------
//UNhides all , admin button
function unhideADMIN() {
    show_tables();
    unhide2();

    elective_id.style.display = "block";
    document.getElementById("course_lv").style.display = "block";
    document.getElementById("language_id").style.display = "block";

    for (var i = 1; i <= 4; i++) {
        document.getElementById("mp" + i + "_table").style.display = "block";
    }
    document.getElementById("subject_id").style.display = "block";
    document.getElementById("options").style.display = "block";
    document.getElementById("course_length_id").style.display = "block";
}

//--------------------------------------------------------------------------------------------------------
//HIDES all , admin button
function hideADMIN() {
    hide_tables();
    hide();
    document.getElementById("add_class").style.display = "none";

    for (var i = 1; i <= 4; i++) {
        document.getElementById("mp" + i + "_table").style.display = "none";
        document.getElementById("class_num" + i).style.display = "none";
    }
}

//--------------------------------------------------------------------------------------------------------
//adds a value to each table, admin button
function unoMore() {
    for (var i = 1; i <= 4; i++) {
        mpNum = i;
        document.getElementById("class_num" + i).textContent =
            mpNum4 + " out of 8 classes used";
        document.getElementById(mpNum + "subject_" + num).textContent = subVal;
        document.getElementById(mpNum + "title_" + num).textContent = titVal;
        document.getElementById(mpNum + "lv_" + num).textContent = lvVal;
    }
}

//--------------------------------------------------------------------------------------------------------
//fills table, admin button
function fillTable() {
    var words = "words";

    for (var u = 1; u <= 4; u++) {
        for (var i = 1; i <= 8; i++) {
            document.getElementById(u + "subject_" + i).textContent = words;
            document.getElementById(u + "title_" + i).textContent = words;
            document.getElementById(u + "lv_" + i).textContent = words;
        }
    }
}
