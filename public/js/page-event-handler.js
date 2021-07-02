// initializes copy button Bootstrap tooltip
const copyBtn = document.getElementById('copyBtn');
const copyTooltip = new bootstrap.Tooltip(copyBtn, {
  boundary: document.body
});

// events listener to reset tooltip text
copyBtn.addEventListener('hidden.bs.tooltip', () => {
  copyBtn.setAttribute('data-bs-original-title', 'Copy url of current graph to clipboard');
})

// copies URL of page
function copyToClipboard() {
  const inputc = document.body.appendChild(document.createElement("input"));
  inputc.value = window.location.href;
  inputc.focus();
  inputc.select();
  document.execCommand('copy');
  inputc.parentNode.removeChild(inputc);
  updateCopyTooltip();
}

// updates title of copyToolTip
function updateCopyTooltip() {
  copyBtn.setAttribute('data-bs-original-title', 'copied!');
  copyTooltip.update();
  copyTooltip.show();
}

// opens new tab using <select> elements in index.html
function openTab() {
  const subject = document.getElementById("subject-select").value;
  const course = document.getElementById("course-select").value;
  const year = document.getElementById('displayRange').value;
  if (subject && course) {
    window.open(`/subject/${subject}/course/${course.split(" ")[1]}`);
  } else if (subject) {
    if (year < 4) {
      window.open(`/subject/${subject}?year=${year}`);
    } else {
      window.open(`/subject/${subject}`);
    }
  }
}

// updates graph paramaters using variables in the Settings tab in index.html
function updateGraph() {
  myGraph.startTransaction("update");
  setLayeringOption(getRadioValue("layering"));
  myGraph.layout.direction = parseInt(getRadioValue("direction"));
  const checkedArr = getCheckboxes("focus");
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

// sets myGraph.layout.layeringOption
function setLayeringOption(layering) {
  if (layering == 0) {
    myGraph.layout.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
  } else if (layering == 1) {
    myGraph.layout.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;
  } else if (layering == 2) {
    myGraph.layout.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
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

// updates range slider label value
function updateDisplayText(val) {
  document.getElementById('displayRangeText').innerText = "Display courses up to year " + val;
}

// sets node.shape opacity to 0.4 if it's year level is unchecked
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