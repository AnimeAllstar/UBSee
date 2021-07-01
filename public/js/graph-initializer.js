// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// global variable for graph
let myGraph;

// global data variable
let myData;

// get year param
const year = getYear();

// get data asynchronously
async function getJSON() {
  const response = await fetch("/json/courses.json");
  const json = await response.json();
  myData = json.courses;
  return json;
}

// get year parameter from the URL (will update to getting all parameters if more are added in the future)
function getYear() {
  const urlParams = new URLSearchParams(window.location.search);
  const y = urlParams.get("year");
  // returns appropriate value for y
  if (y) {
    return (y > 0) ? (y < 5 ? y : 4) : 4;
  } else {
    return 4;
  }
}

// global variables to store nodes and links
const nodes = [];
const links = [];

// add relevant data to nodes[] and links[]
function addToGraph(course) {
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
function SelectiveAddToGraph(course) {
  if (course.name.split(" ")[1].substring(0, 1) <= year) {
    addToGraph(course);
  }
}

// splits course.prereqs into an array of course
// iterates through that array and applies func to each element
function iterateCourses(course, arg, func) {
  const re = new RegExp(course.name.split(" ")[0] + "\\s\\d{3}", "g");
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
    recursiveAdd(subject[req.subject + " " + req.course], subject);
    return {
      nodes,
      links: links
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
  if (year != 4) {
    func = SelectiveAddToGraph;
  } else {
    func = addToGraph;
  }

  // add courses node to graph
  for (const course in subject) {
    func(subject[course]);
  }

  return {
    nodes,
    links: links
  };
}

async function createGraph(req) {
  const graphData = await getData(req);

  // make graph
  myGraph = getGraph("graph-div");

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
}

// returns new graph
function getGraph(id) {
  return $(go.Diagram, id, {
    "undoManager.isEnabled": true,
    "toolManager.toolTipDuration": 30000,
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
  return (nodeTemplate = $(go.Node, "Auto", {
      selectionAdorned: false,
      click: function (e, node) {
        nodeClickHandler(node);
      },
      toolTip: createToolTip(),
      contextMenu: createContextMenu(),
    },
    $(go.Shape, "Rectangle", {
        strokeWidth: 2,
        stroke: null,
        fill: "#FFF",
        name: "shape",
      },
      // bind Shape.stroke and Shape.fill to Node.isHighlighted and Node.isClickable
      new go.Binding("stroke", "isHighlighted", (h) => {
        return h ? "#000" : "#000";
      }).ofObject(),
      new go.Binding("fill", "", (node) => {
        if (node.data.isClickable) {
          if (node.isHighlighted) {
            return "#1e90ff";
          } else {
            return "#1ec887";
          }
        } else {
          return "#ff1a53";
        }
      }).ofObject()
    ),
    $(go.TextBlock, "course id", { // default text and text config
        margin: 12,
        stroke: "#fff",
        font: "bold 16px sans-serif",
      },
      new go.Binding("text", "key")
    )
  ));
}

// returns new link template
function createLinkTemplate() {
  return (LinkTemplate = $(go.Link, {
      routing: go.Link.Normal,
      corner: 0,
    },
    $(go.Shape,
      // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
      new go.Binding("stroke", "isHighlighted", (h) => {
        return h ? "#1ec887" : "black";
      }).ofObject(),
      new go.Binding("strokeWidth", "isHighlighted", (h) => {
        return h ? 3 : 1;
      }).ofObject()
    ),
    $(go.Shape, {
        toArrow: "Standard",
        strokeWidth: 0,
      },
      // bind Shape.fill to Link.isHighlighted
      new go.Binding("fill", "isHighlighted", (h) => {
        return h ? "#1ec887" : "black";
      }).ofObject(),
      new go.Binding("fill", "isSelected", (sel) => {
        return sel ? "#1e90ff" : "black";
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
  return (ToolTip = $("ToolTip", {
      "Border.fill": "#ffffff",
    },
    $(go.Panel, "Vertical",
      $(go.TextBlock, {
        margin: new go.Margin(0, 2, 2, 4),
        text: "Course Information",
        font: "11pt sans-serif",
        alignment: go.Spot.Left,
        wrap: go.TextBlock.WrapFit
      }),
      $(go.TextBlock, {
          margin: new go.Margin(0, 2, 2, 4),
          width: 300,
          alignment: go.Spot.Left,
          font: "10pt sans-serif",
          wrap: go.TextBlock.WrapFit
        },
        new go.Binding("text", "", (data) => {
          return `${data.title}`;
        })
      ),
      $(go.TextBlock, {
          margin: new go.Margin(0, 2, 0, 4),
          width: 300,
          alignment: go.Spot.Left,
          font: "9pt sans-serif",
          wrap: go.TextBlock.WrapFit
        },
        new go.Binding("text", "", (data) => {
          return `Pre-reqs: ${data.prereqText}`;
        })
      )
    )
  ));
}

// returns contextmenu
function createContextMenu() {
  return (ContextMenu =
    $("ContextMenu",
      getContextMenuButton("Course Page", "text1", "shape1", (e, obj) => {
        window.open(obj.part.data.url);
      }),
      getContextMenuButton("Course Graph", "text2", "shape2", (e, obj) => {
        openCourseGraph(obj);
      })
    ));
}

// opens new tab (for hover menu)
function openCourseGraph(obj) {
  const key = obj.part.data.key.split(" ");
  window.open(`/subject/${key[0]}/course/${key[1]}`);
}

// returns ContextMenuButton
function getContextMenuButton(label, textBox, Shape, func) {
  return $("ContextMenuButton",
    $(go.Shape, "Rectangle", {
      stroke: null,
      maxSize: new go.Size(95, 25),
      fill: "#FFF",
      name: Shape
    }),
    $(go.TextBlock, label, {
      name: textBox,
      background: "#fff",
      font: "14px sans-serif",
      click: func
    }), {
      mouseEnter: (e, obj) => {
        obj.findObject(Shape).fill = "#0d6efd";
        obj.findObject(textBox).background = "#0d6efd";
        obj.findObject(textBox).stroke = "#fff";
      },
      mouseLeave: (e, obj) => {
        obj.findObject(Shape).fill = "#fff";
        obj.findObject(textBox).background = "#fff";
        obj.findObject(textBox).stroke = "#000";
      }
    }
  )
}