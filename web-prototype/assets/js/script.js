async function getData() {
  const response = await fetch("/web-prototype/assets/json/CPSC.json");
  const json = await response.json();
  console.log(json);
  return json;
}

async function init() {
  const dataJson = await getData();
  const dataArray = dataJson.courses;
  const nodes = [];
  const courses = [];
  dataArray.forEach((course) => {
    let v = { key: course.name };
   nodes.push(v);
   courses.push(course);
  });
  // console.log nodes);
  // console.log courses);
  return { nodes, courses };
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
  myDiagram.layout.direction = 90;

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

  myDiagram.model = new go.GraphLinksModel(graphData.nodes);

  graphData.courses.forEach((course) => {
    var tempPrereqs = course.prereqs;
    tempPrereqs.forEach((andCombo) => {
      andCombo.forEach((orCombo) => {
        if(orCombo.constructor === Array){
          return;
        }
        const link = {
          from: orCombo,
          to: course.name
        }
        // console.log(orCombo);
        // console.log(link);
        myDiagram.model.addLinkData(link);
      });
    });
  });
}
