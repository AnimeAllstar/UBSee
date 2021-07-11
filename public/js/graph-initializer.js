// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// global variable for graph
let myGraph;

// global data variable
let myData;

// returns Api URL
function getApiURL(req) {
  const temp = `${window.location.origin}/api/subject`;
  if (req.course && req.subject) {
    return `${temp}/${req.subject}`;
  } else if (req.subject) {
    return `${temp}/${req.subject}?year=${getYear()}`;
  } else {
    return `${temp}/CPSC?year=${getYear()}`;
  }
}

// set myData asynchronously
async function setMyData(url) {
  const response = await fetch(url);
  myData = await response.json();
}

// gets the 'year' parameter and returns a value between 1 and 4
function getYear() {
  const y = getParam('year');
  if (y) {
    return y > 4 ? 4 : y < 1 ? 4 : y;
  }
}

// gets an array of the highlighted nodes from the 'nodes' parameter
function getHighlightedNodes() {
  const h = getParam('nodes');
  if (h) {
    return h.split(',');
  }
  return null;
}

// global variables to store nodes and links
const nodes = [];
const links = [];

// add relevant data to nodes[] and links[]
function addToData(course) {
  nodes.push({
    key: course.name,
    subject: course.subject,
    year: course.year,
    title: course.title,
    prereqs: course.prereqs,
    prereqText: course.prereqText,
    url: course.url,
    isClickable: course.prereqs.length === 0 ? true : false,
  });
  links.push(course);
}

// splits course.prereqs into an array of course
// iterates through that array and applies func to each element
function iterateCourses(course, arg, func) {
  const re = new RegExp(course.subject + '\\s\\d{3}', 'g');
  const courseList = course.prereqs.match(re);
  if (courseList) {
    courseList.forEach((c) => {
      func(c, arg);
    });
  }
}

// recursively adds all nodes with possibile link to course
// used to create dataset for course graph
function recursiveAdd(course) {
  addToData(course);
  iterateCourses(course, myData, (c, myData) => {
    // if course has not been added to nodes[] call recursiveAdd on it
    // this allows all the courses connect to the initial node to be added to nodes[]
    if (!nodes.some((e) => e.key === c)) {
      const cElem = myData.find((elem) => {
        return elem.name === c;
      });
      if (cElem) {
        recursiveAdd(cElem, myData);
      }
    }
  });
}

// populates nodes[] and links[]
async function setGlobal(req) {
  await setMyData(getApiURL(req));

  // conditions check for type of graph
  if (req.course && req.subject) {
    // course graph
    const root = myData.find((course) => {
      return course.name === req.subject + ' ' + req.course;
    });
    // recursively add courses node and links to nodes[] and links[]
    recursiveAdd(root);
  } else {
    // subject graph
    // add all courses node and links to nodes[] and links[]
    myData.forEach((course) => {
      addToData(course);
    });
  }
}

// called from script tag in index.html
// req contains the subject ID and course #
async function createGraph(req) {
  await setGlobal(req);

  // make graph
  myGraph = getGraph('graph-div');

  // add nodes to new model
  myGraph.model = new go.GraphLinksModel(nodes);

  // add links to nodes
  links.forEach((link) => {
    iterateCourses(link, link.name, (fromKey, toKey) => {
      if (!links.some((e) => e.key === fromKey)) {
        myGraph.model.addLinkData({
          from: fromKey,
          to: toKey,
        });
      }
    });
  });

  // set node and link colors
  setColors();
}

// sets node and link highlight and clickable values using the 'nodes' URL query parameter
function setColors() {
  const highlightedNodes = getHighlightedNodes();
  // if param is passed (not null)
  if (highlightedNodes) {
    // until all nodes are highlighted, remove the first node, find it in the graph, simulate a click on the node
    // if the node is not highlighted, add it back to the array
    // (this handles the case where a prereq node is present after the node in the query parameter)
    while (highlightedNodes.length != 0) {
      const elem = highlightedNodes.shift();
      const graphNode = myGraph.findNodeForKey(elem);
      if (graphNode) {
        nodeClickHandler(graphNode);
        if (!graphNode.isHighlighted) {
          highlightedNodes.push(elem);
        }
      }
    }
  }
}

// returns new graph
function getGraph(id) {
  return $(go.Diagram, id, {
    'undoManager.isEnabled': true,
    'toolManager.hoverDelay': 500,
    'toolManager.toolTipDuration': 30000,
    initialAutoScale: go.Diagram.Uniform,
    layout: createLayout(),
    nodeTemplate: createNodeTemplate(),
    linkTemplate: createLinkTemplate(),
    allowDelete: false,
    allowCopy: false,
    allowMove: false,
    allowInsert: false,
  });
}

// returns new layout
function createLayout() {
  return (layout = $(go.LayeredDigraphLayout, {
    direction: 0,
    layerSpacing: 100,
    columnSpacing: 10,
    linkSpacing: 7,
    layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
  }));
}

// retuns new node template
function createNodeTemplate() {
  return (nodeTemplate = $(
    go.Node,
    'Auto', {
      selectionAdorned: false,
      click: function (e, node) {
        nodeClickHandler(node);
      },
      toolTip: createToolTip(),
      contextMenu: createContextMenu(),
    },
    $(
      go.Shape,
      'Rectangle', {
        strokeWidth: 2,
        stroke: null,
        fill: '#fff',
        name: 'shape',
      },
      // bind Shape.stroke and Shape.fill to Node.isHighlighted and Node.isClickable
      new go.Binding('stroke', 'isHighlighted', (h) => {
        return h ? '#000' : '#000';
      }).ofObject(),
      new go.Binding('fill', '', (node) => {
        if (node.data.isClickable) {
          if (node.isHighlighted) {
            return '#1e90ff';
          } else {
            return '#1ec887';
          }
        } else {
          return '#ff1a53';
        }
      }).ofObject()
    ),
    $(
      go.TextBlock,
      'course id', {
        // default text and text config
        margin: 12,
        stroke: '#fff',
        font: 'bold 16px sans-serif',
      },
      new go.Binding('text', 'key')
    )
  ));
}

// returns new link template
function createLinkTemplate() {
  return (LinkTemplate = $(
    go.Link, {
      routing: go.Link.Normal,
      corner: 0,
    },
    $(
      go.Shape,
      // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
      new go.Binding('stroke', 'isHighlighted', (h) => {
        return h ? '#1ec887' : '#000';
      }).ofObject(),
      new go.Binding('strokeWidth', 'isHighlighted', (h) => {
        return h ? 3 : 1;
      }).ofObject()
    ),
    $(
      go.Shape, {
        toArrow: 'Standard',
        strokeWidth: 0,
      },
      // bind Shape.fill to Link.isHighlighted
      new go.Binding('fill', 'isHighlighted', (h) => {
        return h ? '#1ec887' : '#000';
      }).ofObject(),
      new go.Binding('fill', 'isSelected', (sel) => {
        return sel ? '#1e90ff' : '#000';
      }).ofObject()
    )
  ));
}

// returns node tooltip if device is not a touch mobile device, otherwise returns null
// this is because the tooltip interferes with the clicking of nodes on touch devices
function createToolTip() {
  if (isTouchDevice() && isMobileDevice()) {
    return null;
  }
  return (ToolTip = $(
    'ToolTip', {
      'Border.fill': '#ffffff',
    },
    $(
      go.Panel,
      'Vertical',
      $(go.TextBlock, {
        margin: new go.Margin(0, 2, 2, 4),
        text: 'Course Information',
        font: '11pt sans-serif',
        alignment: go.Spot.Left,
        wrap: go.TextBlock.WrapFit,
      }),
      $(
        go.TextBlock, {
          margin: new go.Margin(0, 2, 2, 4),
          width: 300,
          alignment: go.Spot.Left,
          font: '10pt sans-serif',
          wrap: go.TextBlock.WrapFit,
        },
        new go.Binding('text', '', (data) => {
          return `${data.title}`;
        })
      ),
      $(
        go.TextBlock, {
          margin: new go.Margin(0, 2, 0, 4),
          width: 300,
          alignment: go.Spot.Left,
          font: '9pt sans-serif',
          wrap: go.TextBlock.WrapFit,
        },
        new go.Binding('text', '', (data) => {
          return `Pre-reqs: ${data.prereqText}`;
        })
      )
    )
  ));
}

// returns contextmenu
function createContextMenu() {
  return (ContextMenu = $(
    'ContextMenu',
    getContextMenuButton('Course Page', 'text1', 'shape1', (e, obj) => {
      window.open(obj.part.data.url);
    }),
    getContextMenuButton('Course Graph', 'text2', 'shape2', (e, obj) => {
      openCourseGraph(obj);
    })
  ));
}

// opens new tab (for hover menu)
function openCourseGraph(obj) {
  const key = obj.part.data.key.split(' ');
  window.open(`/subject/${key[0]}/course/${key[1]}`);
}

// returns ContextMenuButton
function getContextMenuButton(label, textBox, Shape, func) {
  return $(
    'ContextMenuButton',
    $(go.Shape, 'Rectangle', {
      stroke: null,
      maxSize: new go.Size(95, 25),
      fill: '#fff',
      name: Shape,
    }),
    $(go.TextBlock, label, {
      name: textBox,
      background: '#fff',
      font: '14px sans-serif',
      click: func,
    }), {
      mouseEnter: (e, obj) => {
        obj.findObject(Shape).fill = '#0d6efd';
        obj.findObject(textBox).background = '#0d6efd';
        obj.findObject(textBox).stroke = '#fff';
      },
      mouseLeave: (e, obj) => {
        obj.findObject(Shape).fill = '#fff';
        obj.findObject(textBox).background = '#fff';
        obj.findObject(textBox).stroke = '#000';
      },
    }
  );
}