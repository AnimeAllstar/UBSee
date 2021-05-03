// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// get data asynchronously
async function getData() {
    const response = await fetch("/web-prototype/assets/json/CPSC.json");
    const json = await response.json();
    console.log(json);
    return json;
}

// return node and links arrays
async function init() {
    const dataJson = await getData();
    const dataArray = dataJson.courses;
    const nodes = [];
    const links = [];
    dataArray.forEach((course) => {
        let n = { key: course.name, prereqs: course.prereqs };
        nodes.push(n);
        links.push(course);
    });
    return { nodes, links: links };
}

async function createGraph() {

    const graphData = await init();

    // make diagram
    const myDiagram = createDiagram();

    // when the user clicks on the background of the Diagram, remove all highlighting
    myDiagram.click = function (e) {
        e.diagram.commit(function (d) {
            d.clearHighlighteds();
        }, "no highlighteds");
    };

    // add nodes to new model
    myDiagram.model = new go.GraphLinksModel(graphData.nodes);
    myDiagram.model.isReadOnly = true

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
    });
}

// returns new layout
// https://gojs.net/latest/samples/ldLayout.html
function createLayout() {
    const newLayout = new go.LayeredDigraphLayout();
    newLayout.direction = 270;
    newLayout.layerSpacing = 100;
    newLayout.columnSpacing = 50;
    newLayout.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
    newLayout.aggressiveOption = go.LayeredDigraphLayout.AggressiveMore;
    return newLayout;
}

// retuns new node template
function createNodeTemplate() {
    return nodeTemplate = $(
        go.Node, "Auto",
        {
            selectionAdorned: false,
            click: function (e, node) {
                updateHighlight(node);
            },
        },
        $(go.Shape, "Rectangle",
            { strokeWidth: 2, stroke: null, fill: "#FFF" },
            new go.Binding("fill", "color"),
            // bind Shape.stroke to Node.isSelected
            new go.Binding("stroke", "isSelected", (sel) => { return sel ? "#1E90FF" : "#000"; }).ofObject(),
            // bind Shape.stroke and Shape.fill to Node.isHighlighted
            new go.Binding("stroke", "isHighlighted", (h) => { return h ? "#000" : "#000"; }).ofObject(),
            new go.Binding("fill", "isHighlighted", (h) => { return h ? "#FC5185" : "#FFF"; }).ofObject()),
        $(go.TextBlock,
            "course id", // default text
            // text config, padding
            { margin: 12, stroke: "#000", font: "bold 16px sans-serif" },
            new go.Binding("stroke", "isHighlighted", (h) => { return h ? "#FFF" : "#000"; }).ofObject(),
            new go.Binding("text", "key"))
    );
}

// returns new link template
function createLinkTemplate() {
    return LinkTemplate =
        $(go.Link,
            { routing: go.Link.AvoidsNodes, corner: 0 },
            $(go.Shape,
                // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
                new go.Binding("stroke", "isHighlighted", (h) => { return h ? "#FC5185" : "black"; }).ofObject(),
                new go.Binding("strokeWidth", "isHighlighted", (h) => { return h ? 3 : 1; }).ofObject()),
            $(go.Shape,
                { toArrow: "Standard", strokeWidth: 0 },
                // bind Shape.fill to Link.isHighlighted
                new go.Binding("fill", "isHighlighted", (h) => { return h ? "#FC5185" : "black"; }).ofObject())
        );
}
