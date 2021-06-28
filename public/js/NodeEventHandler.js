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
  const graph = node.diagram;
  // lock
  graph.startTransaction('highlight');

  // change status of clicked node
  node.isHighlighted = val;

  // change node.isHighlighted for all outgoing Links
  node.findLinksOutOf().each((l) => {
    l.isHighlighted = val;
  });

  // recursively call update on nodes dependant on this to evaluate and update their state
  node.findNodesOutOf().each((node) => {
    recursiveUpdateHighlight(node);
  });

  // unlock
  graph.commitTransaction('highlight');
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

// iterates over node.findLinksInto() to check if the links from other nodes are highlighted
// replaces the course names in prereqs string with l.isHighlighted
// for example: (CPSC 101 && CPSC 103) || CPSC 110 could be replace to (1 && 0 ) || 1 
// returns the evaluated newState
function getNewState(node, prereqs) {
  node.findLinksInto().each((l) => {
    const newState = l.isHighlighted ? 1 : 0;
    const re = new RegExp(l.data.from);
    prereqs = prereqs.replace(re, newState);
  });
  return eval(prereqs);
}

// checks if the course prerequisites have been satisfied
function updateIsclickable(node) {
  const prereqs = node.data.prereqs;

  // no prereqs, base case
  if (prereqs.length === 0) {
    return;
  }

  // gets the new state of the node
  const newState = getNewState(node, prereqs);

  // update node.data.isClickable using newState
  node.diagram.model.commit((model) => {
    model.set(node.data, 'isClickable', newState);
  }, 'change isClickable');
}