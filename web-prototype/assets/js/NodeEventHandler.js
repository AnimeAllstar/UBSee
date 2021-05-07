//updates clickability of node
//if node is clickable
//   if node is highlighted, unHighlight node
//   otherwise, highlight node
function nodeClickHandler(node) {
  if (node.data.isClickable) {
    updateHighlight(node, !node.isHighlighted);
  }
}

// function that highlights a given node and highlights the links coming out of it
function updateHighlight(node, val) {
  const diagram = node.diagram;
  // lock
  diagram.startTransaction("highlight");

  // change status of clicked node
  node.isHighlighted = val;

  // change node.isHighlighted for all outgoing Links
  node.findLinksOutOf().each(function (l) {
    l.isHighlighted = val;
  });

  // recursively call update on children nodes
  node.findNodesOutOf().each(function (node) {
    recursiveUpdateHighlight(node);
  });

  // unlock
  diagram.commitTransaction("highlight");
}

// update highlighting for all
function recursiveUpdateHighlight(node) {
  updateIsclickable(node);

  //base case
  if (node.data.isClickable) {
    return;
  }

  if (node.isHighlighted === true) {
    updateHighlight(node, false);
  }
}

// checks if the course prerequisites have been satisfied
function updateIsclickable(node) {
  const prereqs = node.data.prereqs;

  // no prereqs
  if (prereqs[0].length === 0) {
    return;
  }

  let check = false;
  let finalCheck = true;
  const inLinksData = [];

  // push required data of all in-links of node into inLinksData
  node.findLinksInto().each(function (l) {
    inLinksData.push({ data: l.data, isHighlighted: l.isHighlighted });
  });

  // checks if any of the combinations have been satisfied
  prereqs.forEach((andCombo) => {
    andCombo.forEach((orCombo) => {
      inLinksData.forEach((link) => {
        if (link.data.from === orCombo && link.isHighlighted) {
          check = true;
        }
      });
    });
    if (!check) {
      finalCheck = false;
    }
    check = false;
  });

  // update node.data.isClickable using finalCheck
  node.diagram.model.commit((model) => {
    model.set(node.data, "isClickable", finalCheck);
  }, "change isClickable");
}

// This function is called to update the tooltip information
// depending on the bound data of the Node that is closest to the pointer.
function updateInfoBox(mousePt, data, loc) {
  var box = document.getElementById("infoBoxHolder");
  box.innerHTML = "";
  var infobox = document.createElement("div");
  infobox.id = "infoBox";
  box.appendChild(infobox);
  for (var i = 0; i < 9; i++) {
    var child = document.createElement("div");
    switch (i) {
      case 0: child.textContent = "Course info"; break;
      case 1: child.className = "infoTitle"; child.textContent = "Course Title: " + data.title; break;
      case 3: child.className = "infoTitle"; child.textContent = "Pre-reqs: " + (data.prereqs[0].length !== 0 ? data.prereqs : "none"); break;
    }
    infobox.appendChild(child);
  }
  var docloc = myDiagram.transformDocToView(loc);
  box.style.left = (+docloc.x.toFixed(2) + +150) + "px";
  box.style.top = (+docloc.y.toFixed(2) + +28) + "px";

  // box.style.left = mousePt.x + 30 + "px";
  // box.style.top = mousePt.y + 20 + "px";
}


