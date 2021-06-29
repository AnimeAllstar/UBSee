// opens new tab using <select> elements in index.html
function openTab() {
  const subject = document.getElementById("subject-select").value;
  const course = document.getElementById("course-select").value;
  if (subject && course) {
    window.open(`/subject/${subject}/course/${course.split(" ")[1]}`);
  } else if (subject) {
    window.open(`/subject/${subject}`);
  }
}

// updates graph paramaters using variables in the Settings tab in index.html
function updateGraph() {
  myGraph.startTransaction("update");
  myGraph.layout.direction = parseInt(getRadioValue("direction"));
  updateYearHighlights(parseInt(getRadioValue("year")));
  myGraph.commitTransaction("update");
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

const updateYearHighlights = (year) => {
  myGraph.nodes.each(function (node) {
    var shape = node.findObject("SHAPE");
    shape.opacity = 1.0;
    if (year === -1) {
      return;
    } else {
      if (parseInt(node.data.key.split(" ")[1].substring(0, 1)) !== year) {
        shape.opacity = 0.1;
      }
    }
  });
};
