function init() {
  // $ is a function pointer for go.GraphObject.make()
  var $ = go.GraphObject.make;

  // make diagram
  var myDiagram = $(go.Diagram, "diagram-div", {
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

  myDiagram.model = new go.GraphLinksModel(
    [
      // array of vertices
      { key: "Pre-calculus 12" },
      { key: "CPSC 100" },
      { key: "CPSC 101" },
      { key: "CPSC 103" },
      { key: "CPSC 107" },
      { key: "CPSC 110" },
      { key: "CPSC 121" },

      { key: "CPSC 203" },
      { key: "CPSC 210" },
      { key: "CPSC 213" },
      { key: "CPSC 259" },
      { key: "CPSC 261" },
      { key: "CPSC 298" },
      { key: "CPSC 299" },
    ],
    [
      // array of edges
      { from: "Pre-calculus 12", to: "CPSC 121" },
      { from: "CPSC 103", to: "CPSC 107" },
      { from: "CPSC 107", to: "CPSC 121" },
      { from: "CPSC 110", to: "CPSC 121" },
      { from: "CPSC 121", to: "CPSC 107" },
      { from: "CPSC 121", to: "CPSC 110" },

      { from: "CPSC 103", to: "CPSC 203" },
      { from: "CPSC 110", to: "CPSC 210" },
      { from: "CPSC 121", to: "CPSC 213" },
      { from: "CPSC 210", to: "CPSC 213" },
      { from: "CPSC 210", to: "CPSC 221" },
      { from: "CPSC 298", to: "CPSC 299" },
    ]
  );
}
