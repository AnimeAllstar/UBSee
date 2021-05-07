// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

var myToolTip = $(go.HTMLInfo, {
  show: showToolTip,
  // do nothing on hide: This tooltip doesn't hide unless the mouse leaves the diagram
})
var myDiagram;

// get data asynchronously
async function getData() {
  const response = await fetch("/web-prototype/assets/json/CPSC.json");
  const json = await response.json();
  return json;
}

var lastStroked = null;  // this remembers the last highlight Shape

// return node and links arrays
async function init() {
  const dataJson = await getData();
  const dataArray = dataJson.courses;
  const nodes = [];
  const links = [];
  dataArray.forEach((course) => {
    nodes.push({
      key: course.name,
      prereqs: course.prereqs,
      isClickable: course.prereqs[0].length === 0 ? true : false,
      title: course.title,
    });
    links.push(course);
  });
  return { nodes, links: links };
}

async function createGraph() {
  const graphData = await init();

  // make diagram
  myDiagram = createDiagram();

  // add nodes to new model
  myDiagram.model = new go.GraphLinksModel(graphData.nodes);

  // add links for edges
  graphData.links.forEach((link) => {
    const tempPrereqs = link.prereqs;
    tempPrereqs.forEach((andCombo) => {
      andCombo.forEach((orCombo) => {
        myDiagram.model.addLinkData({ from: orCombo, to: link.name });
      });
    });
  });
}

// returns new diagram
function createDiagram() {
  return $(go.Diagram, "diagram-div", {
    "undoManager.isEnabled": true,
    initialAutoScale: go.Diagram.Uniform,
    layout: createLayout(),
    nodeTemplate: createNodeTemplate(),
    linkTemplate: createLinkTemplate(),
    allowDelete: false,
    allowCopy: false,
    allowMove: false,
    allowInsert: false,
    mouseHover: doMouseHover,  // this event handler is defined below
    click: doMouseHover,  // this event handler is defined below
    "toolManager.hoverDelay": 300,
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
    "Auto",
    {
      selectionAdorned: false,
      click: function (e, node) {
        nodeClickHandler(node);
      },
      toolTip: myToolTip,
    },
    $(
      go.Shape,
      "Rectangle",
      { strokeWidth: 2, stroke: null, fill: "#FFF", name:"Rectangle" },
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
    $(
      go.TextBlock,
      "course id", // default text
      // text config, padding
      { margin: 12, stroke: "#fff", font: "bold 16px sans-serif" },
      new go.Binding("text", "key")
    )
  ));
}

// returns new link template
function createLinkTemplate() {
  return (LinkTemplate = $(
    go.Link,
    { routing: go.Link.Normal, corner: 0 },
    $(
      go.Shape,
      // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
      new go.Binding("stroke", "isHighlighted", (h) => {
        return h ? "#1ec887" : "black";
      }).ofObject(),
      new go.Binding("strokeWidth", "isHighlighted", (h) => {
        return h ? 3 : 1;
      }).ofObject()
    ),
    $(
      go.Shape,
      { toArrow: "Standard", strokeWidth: 0 },
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

// Called when the mouse is over the diagram's background
function doMouseHover(e) {
  if (e === undefined) e = myDiagram.lastInput;
  var doc = e.documentPoint;
  // find all Nodes that are within 100 units
  var list = myDiagram.findObjectsNear(doc, 100, null, function(x) { return x instanceof go.Node; });
  // now find the one that is closest to e.documentPoint
  var closest = null;
  var closestDist = 999999999;
  list.each(function(node) {
    var dist = doc.distanceSquaredPoint(node.getDocumentPoint(go.Spot.Center));
    if (dist < closestDist) {
      closestDist = dist;
      closest = node;
    }
  });
  showToolTip(closest, myDiagram);
}

// Called with a Node (or null) that the mouse is over or near
function showToolTip(obj, diagram) {
  if (obj !== null) {
    var node = obj.part;
    var e = diagram.lastInput;
    updateInfoBox(e.viewPoint, node.data, node.location);
  } else {
    document.getElementById("infoBoxHolder").innerHTML = "";
  }
}
