// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// get data asynchronously
async function getData() {
  const response = await fetch("/web-prototype/assets/json/CPSC.json");
  const json = await response.json();
  console.log(json);
  return json;
}

// get node and link arrays
async function init() {
  const dataJson = await getData();
  const dataArray = dataJson.courses;
  const nodes = [];
  const links = [];
  dataArray.forEach((course) => {
    let v = { key: course.name };
    nodes.push(v);
    links.push(course);
  });
  // console.log nodes);
  // console.log courses);
  return { nodes, links: links };
}

async function createGraph() {

  const graphData = await init();

  // make diagram
  const myDiagram = createDiagram();

  // when the user clicks on the background of the Diagram, remove all highlighting
  myDiagram.click = function (e) {
    e.diagram.commit(function (d) { d.clearHighlighteds(); }, "no highlighteds");
  };

  // add nodes to new model
  myDiagram.model = new go.GraphLinksModel(graphData.nodes);

  // add links for edges
  graphData.links.forEach((link) => {
    const tempPrereqs = link.prereqs;
    tempPrereqs.forEach((andCombo) => {
      andCombo.forEach((orCombo) => {
        if (orCombo.constructor === Array) {
          return;
        }
        const currLink = {
          from: orCombo,
          to: link.name
        }
        // console.log(orCombo);
        // console.log(link);
        myDiagram.model.addLinkData(currLink);
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
  });
}

// returns new layout
function createLayout() {
  const newLayout = new go.LayeredDigraphLayout();
  newLayout.direction = 270;
  newLayout.layerSpacing = 100;
  newLayout.columnSpacing = 50;
  newLayout.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;
  newLayout.aggressiveOption = go.LayeredDigraphLayout.AggressiveMore;
  return newLayout;
}

// retuns new node template
function createNodeTemplate() {
  return nodeTemplate = $(
    go.Node, "Auto",
    {
      click: function (e, node) {
        const diagram = node.diagram;
        // lock
        diagram.startTransaction("highlight");
        // remove any previous highlighting
        diagram.clearHighlighteds();
        // set Node.isHighlighted for all outgoing Links
        node.findLinksOutOf().each(function (l) { l.isHighlighted = true; });
        // set Node.isHighlighted for all outgoing Nodes
        node.findNodesOutOf().each(function (n) { n.isHighlighted = true; });
        // set Node.isHighlighted for all incoming Links
        node.findLinksInto().each(function (l) { l.isHighlighted = true; });
        // set Node.isHighlighted for all incoming Nodes
        node.findNodesInto().each(function (n) { n.isHighlighted = true; });
        // unlock
        diagram.commitTransaction("highlight");
      }
    },
    $(go.Shape, "Rectangle",
      { strokeWidth: 2, stroke: null, fill: "#FFF" },
      new go.Binding("fill", "color"),
      // the Shape.stroke color depends on whether Node.isHighlighted is true
      new go.Binding("stroke", "isHighlighted", function (h) { return h ? "#FC5185" : "#000"; }).ofObject(),
      new go.Binding("fill", "isHighlighted", function (h) { return h ? "#FC5185" : "#FFF"; }).ofObject(),
      new go.Binding("stroke", "isSelected", function (h) { return h ? "#1e90ff" : "#000"; }).ofObject(),
      new go.Binding("fill", "isSelected", function (h) { return h ? "#1e90ff" : "#FFF"; }).ofObject()),
    $(go.TextBlock,
      "course id", // default text
      // text config, padding
      { margin: 12, stroke: "#000", font: "bold 16px sans-serif" },
      new go.Binding("stroke", "isHighlighted", function (h) { return h ? "#FFF" : "#000"; }).ofObject(),
      new go.Binding("stroke", "isSelected", function (h) { return h ? "#FFF" : "#000"; }).ofObject(),
      new go.Binding("text", "key"))
  );
}

// returns new link template
function createLinkTemplate() {
  return LinkTemplate =
    $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 0 },
      $(go.Shape,
        // the Shape.stroke color depends on whether Link.isHighlighted is true
        new go.Binding("stroke", "isHighlighted", function (h) { return h ? "#FC5185" : "black"; })
          .ofObject(),
        // the Shape.strokeWidth depends on whether Link.isHighlighted is true
        new go.Binding("strokeWidth", "isHighlighted", function (h) { return h ? 3 : 1; })
          .ofObject()),
      $(go.Shape,
        { toArrow: "Standard", strokeWidth: 0 },
        // the Shape.fill color depends on whether Link.isHighlighted is true
        new go.Binding("fill", "isHighlighted", function (h) { return h ? "#FC5185" : "black"; })
          .ofObject())
    );
}
