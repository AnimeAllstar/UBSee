// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// global variable for graph
let myGraph;

// global data variable
let myData;

// get data asynchronously
async function getJSON() {
  const response = await fetch('/json/courses.json');
  const json = await response.json();
  myData = json.courses;
  return json;
}

// gets the 'year' parameter and returns a value between 0 and 4
function getYear() {
  const y = getParam('year');
  if (y) {
    return y > 0 ? (y < 5 ? y : 4) : 4;
  } else {
    return 4;
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
function addToGraph(course, arg) {
  nodes.push({
    key: course.name,
    title: course.title,
    url: course.url,
    prereqs: course.prereqs,
    prereqText: course.prereqText,
    isClickable: course.prereqs.length === 0 ? true : false,
  });
  links.push(course);
}

// adds to graph if year level condition is met
function SelectiveAddToGraph(course, year) {
  if (course.name.split(' ')[1].substring(0, 1) <= year) {
    addToGraph(course);
  }
}

// splits course.prereqs into an array of course
// iterates through that array and applies func to each element
function iterateCourses(course, arg, func) {
  const re = new RegExp(course.name.split(' ')[0] + '\\s\\d{3}', 'g');
  const courseList = course.prereqs.match(re);
  if (courseList) {
    courseList.forEach((c) => {
      func(c, arg);
    });
  }
}

// recursively adds all nodes with possibile link to course
// used to create dataset for course graph
function recursiveAdd(course, subject) {
  addToGraph(course);
  iterateCourses(course, subject, (c, subject) => {
    // if course has not been added to nodes[] call recursiveAdd on it
    // this allows all the courses connect to the initial node to be added to nodes[]
    if (!nodes.some((e) => e.key === c)) {
      if (subject[c]) {
        recursiveAdd(subject[c], subject);
      }
    }
  });
}

// return node and links arrays
async function getData(req) {
  const dataJson = await getJSON();

  let subject;

  // conditions check for what data to fetch
  if (req.course && req.subject) {
    // course graph
    subject = dataJson.courses[req.subject];
    recursiveAdd(subject[req.subject + ' ' + req.course], subject);
    return {
      nodes,
      links: links,
    };
  } else if (!req.course && !req.subject) {
    // home page, displays CPSC subject graph
    subject = dataJson.courses.CPSC;
  } else if (!req.course && req.subject) {
    // subject graph
    subject = dataJson.courses[req.subject];
  }

  // decides whether course need to be selectively added based on the year parameter
  let func;
  const year = getYear();
  if (year != 4) {
    func = SelectiveAddToGraph;
  } else {
    func = addToGraph;
  }

  // add courses node to graph
  for (const course in subject) {
    func(subject[course], year);
  }

  return {
    nodes,
    links: links,
  };
}

async function createGraph(req) {
  const graphData = await getData(req);

  // make graph
  myGraph = getGraph('graph-div');

  // add nodes to new model
  myGraph.model = new go.GraphLinksModel(graphData.nodes);

  // add edges to nodes
  graphData.links.forEach((link) => {
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
// replaces the all course names in prereqs string with l.isHighlighted
// for example: (CPSC 101 && CPSC 103) || CPSC 110 could be replace to (1 && 0) || 1
// returns the evaluated newState
function getNewState(node, prereqs) {
  node.findLinksInto().each((l) => {
    const newState = l.isHighlighted ? true : false;
    const re = new RegExp(l.data.from, 'g');
    prereqs = prereqs.replaceAll(re, newState);
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
function updateGraph() {
  myGraph.startTransaction('update');
  setLayeringOption(getRadioValue('layering'));
  myGraph.layout.direction = parseInt(getRadioValue('direction'));
  const checkedArr = getCheckboxes('focus');
  if (checkedArr) {
    updateOpacity(checkedArr);
  }
  myGraph.commitTransaction('update');
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
// resolves conflict with go.GraphObject.make() in graph-initializer
jQuery.noConflict();

jQuery(document).ready(function () {
  // initalizes all <select> tags
  jQuery('#subject-select').select2({
    theme: 'bootstrap-5',
    placeholder: 'Subject',
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });
  jQuery('#course-select').select2({
    theme: 'bootstrap-5',
    placeholder: 'Course #',
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });
});

// if subject is selected, update the data in #course-select using myData (declared in in graph-initializer.js)
jQuery('#subject-select').on('select2:selecting', function (e) {
  jQuery('#course-select').empty().trigger('change');
  const subject = myData[e.params.args.data.text];
  const data = [];
  let c = 1;
  for (course in subject) {
    data.push(subject[course].name + ' - ' + subject[course].title);
  }
  jQuery('#course-select').select2({
    data: data,
    theme: 'bootstrap-5',
    placeholder: 'Course',
    allowClear: true,
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });

  // adds empty option for placeholder
  jQuery('#course-select').append(new Option('', '', true, true)).trigger('change');

  // prevents <select> from opening after it is cleared
  jQuery('select').on('select2:clear', function (evt) {
    jQuery(this).on('select2:opening.cancelOpen', function (evt) {
      evt.preventDefault();

      jQuery(this).off('select2:opening.cancelOpen');
    });
  });
});
// gets parameter 'param' from the URL
function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// returns whether device is a touch device
function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

// returns whether device is a mobile device
function isMobileDevice() {
  return (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
}