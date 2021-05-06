// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// get data asynchronously
async function getData() {
  const response = await fetch("/web-prototype/assets/json/CPSC.json");
  const json = await response.json();
  return json;
}

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
  const myDiagram = createDiagram();

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
  });
}

// returns new layout
// https://gojs.net/latest/samples/ldLayout.html
function createLayout() {
  const newLayout = new go.TreeLayout();
  newLayout.angle = 0;
  newLayout.layerSpacing = 100;
  newLayout.columnSpacing = 20;
  newLayout.alignment = go.TreeLayout.AlignmentCenterChildren;
  return newLayout;
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
      toolTip: $(
        "ToolTip",
        $(go.TextBlock, { margin: 4 }, new go.Binding("text", "title"))
      ), // end of Adornment
    },
    $(
      go.Shape,
      "Rectangle",
      { strokeWidth: 2, stroke: null, fill: "#FFF" },
      // bind Shape.stroke and Shape.fill to Node.isHighlighted and Node.isClickable
      new go.Binding("stroke", "isHighlighted", (h) => {
        return h ? "#000" : "#000";
      }).ofObject(),
      new go.Binding("fill", "", (node) => {
        if (node.data.isClickable) {
          if (node.isHighlighted) {
            return "#ffcd42";
          } else {
            return "#28df99";
          }
        } else {
          return "#ff1e56";
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
    { routing: go.Link.AvoidsNodes, corner: 0 },
    $(
      go.Shape,
      // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
      new go.Binding("stroke", "isHighlighted", (h) => {
        return h ? "#28df99" : "black";
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
        return h ? "#28df99" : "black";
      }).ofObject()
    )
  ));
}
