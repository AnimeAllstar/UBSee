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
  const checkedArr = getCheckboxes("opacity");
  if (checkedArr) {
    updateOpacity(checkedArr);
  }
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

// returns array of unckecked checkboxes using name
function getCheckboxes(name) {
  let checkboxes = document.getElementsByName(name);
  let unchecked = [];
  checkboxes.forEach((box) => {
    if (!box.checked) {
      unchecked.push(box.value);
    }
  });
  return unchecked;
}

function updateDisplayText(val) {
  document.getElementById('displayRangeText').innerText = "Display courses up to year " + val;
}

// sets node.shape opacity to 0.4 if it is unchecked
function updateOpacity(arr) {
  myGraph.nodes.each(function (node) {
    const shape = node.findObject("shape");
    shape.opacity = 1.0;
    for (let i = 0; i < arr.length; i++) {
      if (node.data.key.split(" ")[1].substring(0, 1) == arr[i]) {
        shape.opacity = 0.4;
        break;
      }
    }
  });
};