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
    go.Node,
    "Horizontal",
    { background: "#fc5185" },
    $(
      go.TextBlock,
      "course id", // default text
      // text config, padding
      { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
      // TextBlock.text is bound to Node.data.key
      new go.Binding("text", "key")
    )
  );
}

// returns new link template
function createLinkTemplate() {
  return LinkTemplate =
    $(go.Link,
      { routing: go.Link.AvoidsNodes, corner: 0 },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));
}
