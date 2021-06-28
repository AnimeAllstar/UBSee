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
  if (prereqs.length === 0) {
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

  // checks if any of the combinations have been satisfied
  const newState = getNewState(node.data.key.split(' ')[0], inLinksData, prereqs);

  // update node.data.isClickable using newState
  node.diagram.model.commit((model) => {
    model.set(node.data, 'isClickable', newState);
  }, 'change isClickable');
}

// iterates over prereqs to check conditions
function getNewState(subjectId, inLinksData, prereqs) {
  const re = new RegExp(subjectId + '\\s\\d{3}', 'g');
  const courseList = prereqs.match(re);

  const states = {};
  courseList.forEach((course) => {
    inLinksData.forEach((link) => {
      if (link.data.from === course) {
        if (link.isHighlighted) {
          states[course] = 1;
        } else {
          states[course] = 0;
        }
      }
    });
  });

  Object.keys(states).forEach((course) => {
    const re = new RegExp(course);
    prereqs = prereqs.replace(re, states[course]);
  });
  return eval(prereqs);
}