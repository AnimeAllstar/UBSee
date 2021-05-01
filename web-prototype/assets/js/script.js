async function getData() {
  const response = await fetch("/web-prototype/assets/json/CPSC.json");
  const json = await response.json();
  console.log(json);
  return json;
}

async function init() {
  const dataJson = await getData();
  const dataArray = dataJson.courses;
  const vertices = [];
  const edges = [];
  dataArray.forEach((course) => {
    let v = { key: course.name };
    vertices.push(v);
    let e = [course.prereqs];
    edges.push(e);
  });
  // console.log(vertices);
  console.log(edges);
  return { vertices, edges };
}

async function createGraph() {

  const graphData = await init();

  // $ is a function pointer for go.GraphObject.make()
  const $ = go.GraphObject.make;

  // make diagram
  const myDiagram = $(go.Diagram, "diagram-div", {
    "undoManager.isEnabled": true,
    layout: $(go.LayeredDigraphLayout), // alternate layout : go.ForceDirectedLayout
  });

  myDiagram.nodeTemplate = $(
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

  myDiagram.model = new go.GraphLinksModel(graphData.vertices);

  // [
  //   // array of edges
  //   { from: "Pre-calculus 12", to: "CPSC 121" },
  //   { from: "CPSC 103", to: "CPSC 107" },
  //   { from: "CPSC 107", to: "CPSC 121" },
  //   { from: "CPSC 110", to: "CPSC 121" },
  //   { from: "CPSC 121", to: "CPSC 107" },
  //   { from: "CPSC 121", to: "CPSC 110" },

  //   { from: "CPSC 103", to: "CPSC 203" },
  //   { from: "CPSC 110", to: "CPSC 210" },
  //   { from: "CPSC 121", to: "CPSC 213" },
  //   { from: "CPSC 210", to: "CPSC 213" },
  //   { from: "CPSC 210", to: "CPSC 221" },
  //   { from: "CPSC 298", to: "CPSC 299" },
  // ]
}
