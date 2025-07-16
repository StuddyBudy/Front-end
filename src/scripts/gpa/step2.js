var num = 0;

function input() {
    // getting the user input and pasting it to the table
    var subject_var = document.getElementById("subject").value;
    var title_var = document.getElementById("subject_title").value;
    var lv_var = document.getElementById("course_lv").value;

    num = num + 1;

    document.getElementById("subject_" + num).textContent = subject_var;
    document.getElementById("title_" + num).textContent = title_var;
    document.getElementById("lv_" + num).textContent = lv_var;

    /*
    //Storing User Input
    localStorage.setItem('subject_' + num, subject_var);
    localStorage.setItem('title_' + num, title_var);
    localStorage.setItem('lv_' + num, lv_var);
    */
}

// Un-Hiding the table and input prompts
function unhidden() {
    // unhides inputs / categories
    var x = document.getElementById("input_id");
    x.style.display = "block";

    // unhides grade input
    document.getElementById("grade_cont").style.display = "block";
}

function newRow() {
    var dropdown = document.getElementById("subject");
    var table = document.getElementById(dropdown + "_table");

    // Get the selected option value
    var selectedValue = dropdown.options[dropdown.selectedIndex].value;

    // Create a new row and cells
    var newRow = table.insertRow(-1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);

    // Set the cell values based on the selected option
    cell1.innerHTML = selectedValue;
    cell2.innerHTML = "Additional Info";

    // Reset the dropdown selection to the default option
    dropdown.selectedIndex = 0;
}

// Hiding the input prompts
function hide() {
    // hides all input
    document.getElementById("input_id").style.display = "none";

    // resets the dropdown to original
    var d = document.getElementById("input_id");
    d.dropdown.selectedIndex = 0;
}

// Clears local Storage
function clearLocalStorage() {
    localStorage.clear();
    alert("Storage has been reset!");
}

// Clears Table
function clearTable() {
    num = 0;

    for (var i = 1; i <= 8; i++) {
        document.getElementById("subject_" + i).textContent = " ";
        document.getElementById("title_" + i).textContent = " ";
        document.getElementById("lv_" + i).textContent = " ";

        localStorage.removeItem("subject_" + i);
        localStorage.removeItem("title_" + i);
        localStorage.removeItem("lv_" + i);
    }

    // Ensure the "Add Class" button is visible again if it was hidden
    document.getElementById("add_class").style.display = "inline";
    // Hide the max classes message if it was displayed
    document.getElementById("max_classes").style.display = "none";
}

// Clears the local storage
function clearStorage() {
    localStorage.clear();
    alert("Storage has been reset!");
}

// Local storage values
var names = [];
var values = [];

// Puts the storage into names and value arrays
function storage_into_array() {
    var storage_num = localStorage.length;

    for (var i = 0; i < storage_num; i++) {
        // Gets the names of the local storage
        var key = localStorage.key(i);
        names.push(key);

        // Gets the values of the corresponding name
        var value = localStorage.getItem(key);
        values.push(value);
    }
    organizer1000();
}

// organizing the local storage
function organizer1000() {
    var subject_holder = [];
    var lv_holder = [];
    var class_holder = [];

    // storage -> corresponding arrays

    /*
    for (var i = names.length - 1; i >= 0; i--) {
        if (names[i].startsWith("subject_")) {
            subject_holder.push(names[i]);
            names.splice(i, 1); // Remove the item from the names array
        } else if (names[i].startsWith("lv_")) {
            lv_holder.push(names[i]);
            names.splice(i, 1); // Remove the item from the names array
        } else {
            class_holder.push(names[i]);
            names.splice(i, 1); // Remove the item from the names array
        }
    }
*/

    for (var i = values.length - 1; i >= 0; i--) {
        if (values[i].startsWith("subject_")) {
            subject_holder.push(values[i]);
            values.splice(i, 1); // Remove the item from the names array
        } else if (values[i].startsWith("lv_")) {
            lv_holder.push(values[i]);
            values.splice(i, 1); // Remove the item from the names array
        } else {
            class_holder.push(values[i]);
            values.splice(i, 1); // Remove the item from the names array
        }
    }

    //Debug logs
    console.log("-----------------------");
    console.log("Subject holder:", subject_holder);
    console.log("LV holder:", lv_holder);
    console.log("Class holder:", class_holder);
    console.log("-----------------------");

    // organizing arrays
    // subject organizer
    var subject_organize_holder = [];
    var lv_organize_holder = [];
    var class_organize_holder = [];

    for (var i = subject_holder.length - 1; i >= 0; i--) {
        var value = localStorage.getItem(subject_holder[i]);
        if (value.endsWith("1")) {
            subject_organize_holder[0] = value;
        } else if (value.endsWith("2")) {
            subject_organize_holder[1] = value;
        } else if (value.endsWith("3")) {
            subject_organize_holder[2] = value;
        } else if (value.endsWith("4")) {
            subject_organize_holder[3] = value;
        } else if (value.endsWith("5")) {
            subject_organize_holder[4] = value;
        } else if (value.endsWith("6")) {
            subject_organize_holder[5] = value;
        } else if (value.endsWith("7")) {
            subject_organize_holder[6] = value;
        } else if (value.endsWith("8")) {
            subject_organize_holder[7] = value;
        } else if (value.endsWith("9")) {
            subject_organize_holder[8] = value;
        }
    }

    // lv organizer
    for (var i = lv_holder.length - 1; i >= 0; i--) {
        var value = localStorage.getItem(lv_holder[i]);
        if (value.endsWith("1")) {
            lv_organize_holder[0] = value;
        } else if (value.endsWith("2")) {
            lv_organize_holder[1] = value;
        } else if (value.endsWith("3")) {
            lv_organize_holder[2] = value;
        } else if (value.endsWith("4")) {
            lv_organize_holder[3] = value;
        } else if (value.endsWith("5")) {
            lv_organize_holder[4] = value;
        } else if (value.endsWith("6")) {
            lv_organize_holder[5] = value;
        } else if (value.endsWith("7")) {
            lv_organize_holder[6] = value;
        } else if (value.endsWith("8")) {
            lv_organize_holder[7] = value;
        } else if (value.endsWith("9")) {
            lv_organize_holder[8] = value;
        }
    }

    // class organizer
    for (var i = class_holder.length - 1; i >= 0; i--) {
        var value = localStorage.getItem(class_holder[i]);
        if (value.endsWith("1")) {
            class_organize_holder[0] = value;
        } else if (value.endsWith("2")) {
            class_organize_holder[1] = value;
        } else if (value.endsWith("3")) {
            class_organize_holder[2] = value;
        } else if (value.endsWith("4")) {
            class_organize_holder[3] = value;
        } else if (value.endsWith("5")) {
            class_organize_holder[4] = value;
        } else if (value.endsWith("6")) {
            class_organize_holder[5] = value;
        } else if (value.endsWith("7")) {
            class_organize_holder[6] = value;
        } else if (value.endsWith("8")) {
            class_organize_holder[7] = value;
        } else if (value.endsWith("9")) {
            class_organize_holder[8] = value;
        }
    }

    console.log("subjects: " + subject_organize_holder);
    console.log("lv: " + lv_organize_holder);
    console.log("class name: " + class_organize_holder);
    console.log(localStorage.getItem("lv_1"));
}

//                         DEV TOOLS

// Displays ALL tables
function tables() {
    document.getElementById("lang_table").style.display = "block";
    document.getElementById("english_table").style.display = "block";
    document.getElementById("math_table").style.display = "block";
    document.getElementById("science_table").style.display = "block";
    document.getElementById("history_table").style.display = "block";
    document.getElementById("health_table").style.display = "block";
    document.getElementById("gym_table").style.display = "block";
    document.getElementById("elective_table").style.display = "block";
    document.getElementById("lang_table").style.display = "block";
}

// Displays all categories
function mere() {
    document.getElementById("health").style.display = "inline";
    document.getElementById("lang").style.display = "inline";
    document.getElementById("gym").style.display = "inline";
    document.getElementById("science").style.display = "inline";
    document.getElementById("history").style.display = "inline";
    document.getElementById("math").style.display = "inline";
    document.getElementById("english").style.display = "inline";
}

// Hides ALL tables
function hideTables() {
    document.getElementById("lang_table").style.display = "none";
    document.getElementById("english_table").style.display = "none";
    document.getElementById("math_table").style.display = "none";
    document.getElementById("science_table").style.display = "none";
    document.getElementById("history_table").style.display = "none";
    document.getElementById("health_table").style.display = "none";
    document.getElementById("gym_table").style.display = "none";
    document.getElementById("elective_table").style.display = "none";
    document.getElementById("lang_table").style.display = "none";
}

// Hides all categories
function hideCats() {
    document.getElementById("health").style.display = "none";
    document.getElementById("lang").style.display = "none";
    document.getElementById("gym").style.display = "none";
    document.getElementById("science").style.display = "none";
    document.getElementById("history").style.display = "none";
    document.getElementById("math").style.display = "none";
    document.getElementById("english").style.display = "none";
}

function skadoosh() {
    console.log(localStorage.getItem("subject_" + 1));
    console.log(localStorage.getItem("lv_" + 1));
    console.log(localStorage.getItem("title_" + 1));

    console.log("ello");
}
