// Professional GPA Calculator Script

let classes = [];
let darkMode = false;

document.getElementById("add-class-btn").addEventListener("click", addClass);
document
    .getElementById("dark-mode-toggle")
    .addEventListener("click", toggleDarkMode);

function addClass() {
    const classId = classes.length + 1;
    classes.push({ id: classId, assignments: [] });

    const classContainer = document.createElement("div");
    classContainer.classList.add("class-container");
    classContainer.id = `class-${classId}`;

    classContainer.innerHTML = `
        <h3>Class ${classId}</h3>
        <div id="assignments-${classId}"></div>
        <button onclick="addAssignment(${classId})" class="btn">+ Add Assignment</button>
        <button onclick="whatIf(${classId})" class="btn">What If</button>
        <p>Average Grade: <span id="average-${classId}">0.00</span></p>
    `;

    document.getElementById("classes").appendChild(classContainer);
    updateGPA();
}

function addAssignment(classId) {
    const assignmentId = classes[classId - 1].assignments.length + 1;

    const assignmentContainer = document.createElement("div");
    assignmentContainer.classList.add("assignment");
    assignmentContainer.id = `assignment-${classId}-${assignmentId}`;

    assignmentContainer.innerHTML = `
        <input type="text" placeholder="Assignment ${assignmentId}" disabled>
        <input type="number" placeholder="Grade (%)" id="grade-${classId}-${assignmentId}" oninput="updateGrade(${classId}, ${assignmentId})">
        <button onclick="removeAssignment(${classId}, ${assignmentId})">Remove</button>
    `;

    document
        .getElementById(`assignments-${classId}`)
        .appendChild(assignmentContainer);
    classes[classId - 1].assignments.push({ id: assignmentId, grade: 0 });
}

function updateGrade(classId, assignmentId) {
    const gradeInput = document.getElementById(
        `grade-${classId}-${assignmentId}`,
    );
    const grade = parseFloat(gradeInput.value) || 0;

    const classData = classes[classId - 1];
    const assignment = classData.assignments.find((a) => a.id === assignmentId);
    assignment.grade = grade;

    updateClassAverage(classId);
    updateGPA();
}

function updateClassAverage(classId) {
    const classData = classes[classId - 1];
    const totalGrades = classData.assignments.reduce(
        (sum, a) => sum + a.grade,
        0,
    );
    const average =
        classData.assignments.length > 0
            ? totalGrades / classData.assignments.length
            : 0;

    document.getElementById(`average-${classId}`).textContent =
        average.toFixed(2);
}

function updateGPA() {
    const totalGrades = classes.reduce((sum, c) => {
        const classAverage =
            c.assignments.reduce((sum, a) => sum + a.grade, 0) /
            (c.assignments.length || 1);
        return sum + classAverage;
    }, 0);

    const gpa = classes.length > 0 ? totalGrades / classes.length : 0;
    document.getElementById("gpa").textContent = gpa.toFixed(2);
}

function removeAssignment(classId, assignmentId) {
    const classData = classes[classId - 1];
    classData.assignments = classData.assignments.filter(
        (a) => a.id !== assignmentId,
    );

    document.getElementById(`assignment-${classId}-${assignmentId}`).remove();
    updateClassAverage(classId);
    updateGPA();
}

function whatIf(classId) {
    const hypotheticalGrade = prompt(
        "Enter a hypothetical grade for a new assignment:",
    );
    if (hypotheticalGrade === null || isNaN(hypotheticalGrade)) return;

    const classData = classes[classId - 1];
    const totalGrades =
        classData.assignments.reduce((sum, a) => sum + a.grade, 0) +
        parseFloat(hypotheticalGrade);
    const average = (totalGrades / (classData.assignments.length + 1)).toFixed(
        2,
    );

    alert(
        `If you add an assignment with a grade of ${hypotheticalGrade}, your new average for Class ${classId} would be ${average}.`,
    );
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
}
