function updateGraph() {
  myDiagram.startTransaction('update');
  myDiagram.layout.direction = parseInt(getRadioValue('direction'));
  myDiagram.commitTransaction('update');
}

function getRadioValue(name) {
  let radio = document.getElementsByName(name);
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      return radio[i].value;
    }
  }
}
