// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

var myDiagram;

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
      url: course.url,
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
      toolTip: createToolTip(),
      contextMenu: createContextMenu(),
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

// returns node tooltip
function createToolTip() {
  return (ToolTip = $(
    "ToolTip",
    { "Border.fill": "#ffffffdd" },
    $(
      go.Panel,
      "Vertical",
      $(go.TextBlock, { text: "Course Information", font: "12pt sans-serif", alignment: go.Spot.Left }),
      $(
        go.TextBlock,
        { margin: 4 },
        new go.Binding("text", "", (data) => {
          return `${data.title} \nPre-reqs: ${data.prereqs[0].length !== 0 ? data.prereqs : "none"}`;
        })
      )
    )
  ));
}

// returns contextmenu
function createContextMenu() {
  return (ContextMenu = $(
    "ContextMenu",
    $(
      "ContextMenuButton",
      {
        "ButtonBorder.fill": "white",
        _buttonFillOver: "#ededed",
      },
      $(go.TextBlock, "Course Page"),
      {
        click: (e, obj) => {
          window.open(obj.part.data.url);
        },
      }
    ),
    $(
      "ContextMenuButton",
      {
        "ButtonBorder.fill": "white",
        _buttonFillOver: "#ededed",
      },
      $(go.TextBlock, "Course Graph"),
      {
        click: (e, obj) => {
          showModal(obj);
        },
      }
    )
  ));
}

function showModal(obj) {
  const modalElem = document.getElementById("inverse-graph");
  const modal = new bootstrap.Modal(modalElem);
  const modalTitle = modalElem.querySelector(".modal-title");
  modalTitle.textContent = obj.part.data.key;
  modal.show();
}
