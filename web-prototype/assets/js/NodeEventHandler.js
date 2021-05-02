//updates clickability of node
//if not clickable node
//    and if node is highlighted,
//        calls unhighlight
//    returns
//if it is clickable then it calls the appropriate method to highlight/unhighlight
function updateHighlight(node) {
  checkPrerequisiteSatisfied(node);
  if (!node.clickable) {
    if (node.isHighlighted === true) {
      unhighlight(node);
    }
    return;
  }
  if (node.isHighlighted === false) {
    highlight(node);
  } else {
    unhighlight(node);
  }
}

// checks if the course prerequisites have been satisfied
function checkPrerequisiteSatisfied(node) {
  node.clickable = true;
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

  // make node unclickable if any of the and conditions is unsatsified
  if (!finalCheck) {
    node.clickable = false;
  }
  return node.clickable;
}

// function that highlights a given node and highlights the links coming out of it
function highlight(node) {
  const diagram = node.diagram;
  // lock
  diagram.startTransaction("highlight");

  // Color clicked node
  node.isHighlighted = true;

  // set Node.isHighlighted for all outgoing Links
  node.findLinksOutOf().each(function (l) { l.isHighlighted = true; });

  // unlock
  diagram.commitTransaction("highlight");
}

//function that unhighlights a node, and child links
//recursively calls updateHighlight on child nodes, to recheck prerequisite paramaters
function unhighlight(node) {
  const diagram = node.diagram;
  // lock
  diagram.startTransaction("unhighlight");

  // DeColor clicked nodes
  node.isHighlighted = false;

  // Decolor links coming out of node
  node.findLinksOutOf().each(function (l) { l.isHighlighted = false; });

  // unlock
  diagram.commitTransaction("unhighlight");

  // recursively call update on children nodes
  node.findNodesOutOf().each(function (node) {
    recursiveUpdateHighlight(node);
  });
}

function recursiveUpdateHighlight(node) {
  checkPrerequisiteSatisfied(node);
  if (!node.clickable) {
    if (node.isHighlighted === true) {
      unhighlight(node);
    }
    return;
  }
}
