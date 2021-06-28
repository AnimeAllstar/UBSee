// opens new tab using <select> elements in index.html
function openTab() {
  const subject = document.getElementById('subject-select').value;
  const course = document.getElementById('course-select').value;
  if (subject && course) {
    window.open(`/subject/${subject}/course/${course.split(' ')[1]}`);
  } else if (subject) {
    window.open(`/subject/${subject}`);
  }
}

// updates graph paramaters using variables in the Settings tab in index.html
function updateGraph() {
  myGraph.startTransaction('update');
  myGraph.layout.direction = parseInt(getRadioValue('direction'));
  myGraph.commitTransaction('update');
}

// returns value of radio button inputs using name
function getRadioValue(name) {
  let radio = document.getElementsByName(name);
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      return radio[i].value;
    }
  }
}