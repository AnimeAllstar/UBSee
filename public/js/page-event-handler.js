// initializes copy button Bootstrap tooltip
const copyBtn = document.getElementById('copyBtn');
const copyTooltip = new bootstrap.Tooltip(copyBtn, {
  boundary: document.body,
});

// events listener to reset tooltip text
copyBtn.addEventListener('hidden.bs.tooltip', () => {
  copyBtn.setAttribute('data-bs-original-title', 'Copies URL of current graph to clipboard');
});

// copies URL of page
function copyToClipboard() {
  const inputc = document.body.appendChild(document.createElement('input'));
  inputc.value = getNewURL();
  inputc.focus();
  inputc.select();
  document.execCommand('copy');
  inputc.parentNode.removeChild(inputc);
  updateCopyTooltip();
}

// gets new URL by setting the 'nodes' parameter
// the 'nodes' parameter is a comma separated string containing all selected nodes
function getNewURL() {
  const url = new URL(window.location.href);
  let nodeArr = [];
  myGraph.nodes.each((node) => {
    if (node.isHighlighted) {
      nodeArr.push(node.data.key);
    }
  });
  url.searchParams.set('nodes', nodeArr.join(','));
  return url;
}

// updates title of copyToolTip
function updateCopyTooltip() {
  copyBtn.setAttribute('data-bs-original-title', 'URL copied!');
  copyTooltip.update();
  copyTooltip.show();
}

// opens new tab using <select> elements in index.html
function openTab() {
  const subject = document.getElementById('subject-select').value;
  const course = document.getElementById('course-select').value;
  const year = document.getElementById('displayRange').value;
  if (subject && course) {
    window.open(`/subject/${subject}/course/${course.split(' ')[1]}`);
  } else if (subject) {
    if (year < 4) {
      window.open(`/subject/${subject}?year=${year}`);
    } else {
      window.open(`/subject/${subject}`);
    }
  }
}

// updates graph paramaters using variables in the Preferences tab in index.html
function updateAppearance() {
  myGraph.startTransaction('update appearance');
  setLayeringOption(getRadioValue('layering'));
  myGraph.layout.direction = parseInt(getRadioValue('direction'));
  myGraph.commitTransaction('update appearance');
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
  document.getElementById('displayRangeText').innerText = 'Display courses up to year ' + val;
}

// updates focus(opacity) of year levels in the graph
function updateFocus() {
  const checkedArr = getCheckboxes('focus');
  if (checkedArr) {
    updateOpacity(checkedArr);
  }
}

// sets node.shape opacity to 0.4 if it's year level is unchecked
function updateOpacity(arr) {
  myGraph.nodes.each(function (node) {
    const shape = node.findObject('shape');
    shape.opacity = 1.0;
    for (let i = 0; i < arr.length; i++) {
      if (node.data.key.split(' ')[1].substring(0, 1) == arr[i]) {
        shape.opacity = 0.4;
        break;
      }
    }
  });
}

// searches for nodes within graph
function searchGraph() {
  const searchString = document.getElementById("search-input");

  if (searchString.value) {
    // search key and title data property of all nodes using regex made using searchString
    const safe = searchString.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safe, "i");
    const results = myGraph.findNodesByExample({
      key: regex
    }, {
      title: regex
    });

    // update isSearched data property of results collection (method from node-even-handler.js)
    updateDataForAll(results, 'isSearched', true, 'set isSearched to true');
  }
}

// clear search selection of all searched nodes
function clearSelection() {
  const searchedNodes = myGraph.findNodesByExample({
    isSearched: true
  });
  // since isSearched is bound to scale (see graph-initializer), setting it to false, returns scale to normal
  updateDataForAll(searchedNodes, 'isSearched', false, 'set isSearched to false for searched nodes');
}