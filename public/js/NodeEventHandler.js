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
  diagram.startTransaction('highlight');

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
  diagram.commitTransaction('highlight');
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

  const inLinksData = [];

  // push required data of all in-links of node into inLinksData
  node.findLinksInto().each(function (l) {
    inLinksData.push({
      data: l.data,
      isHighlighted: l.isHighlighted
    });
  });

  let newState;

  // checks if any of the combinations have been satisfied
  if (Array.isArray(prereqs[0][0])) {
    newState = getNewState(inLinksData, prereqs[0]) || checkOption(inLinksData, prereqs[1])
  } else {
    newState = getNewState(inLinksData, prereqs);
  }

  // update node.data.isClickable using newState
  node.diagram.model.commit((model) => {
    model.set(node.data, 'isClickable', newState);
  }, 'change isClickable');
}

// iterates over prereqs to check conditions
function getNewState(inLinksData, prereqs) {
  let check = false;
  let finalCheck = true;

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

  return finalCheck;
}

// TODO: special case for a few math courses, add a more permanent solution if more instances occur (eg: MATH 320)
function checkOption(inLinksData, prereqs) {
  let check = false;
  let finalCheck = true;

  prereqs.forEach((andCombo) => {
    inLinksData.forEach((link) => {
      if (link.data.from === andCombo && link.isHighlighted) {
        check = true;
      }
    });
    if (!check) {
      finalCheck = false;
    }
    check = false;
  });

  return finalCheck;
}