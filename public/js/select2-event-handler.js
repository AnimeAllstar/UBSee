// resolves conflict with go.GraphObject.make() in graph-initializer
jQuery.noConflict();

let selectData;

jQuery(document).ready(function () {
  // initalizes all <select> tags
  setSelect('#subject-select', null, false);
  setSelect('#course-select', null, false);
  getSelectData(setSelect);
});

async function getSelectData(callback) {
  const response = await fetch('/api/subjects');
  selectData = await response.json();
  const d = selectData.map(subject => {
    return subject.name
  });
  callback('#subject-select', d, false);
}

function setSelect(id, data, clear) {
  jQuery(id).select2({
    data: data,
    theme: 'bootstrap-5',
    placeholder: 'Subject',
    allowClear: clear,
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });
}

// if subject is selected, update the data in #course-select using myData (declared in in graph-initializer.js)
jQuery('#subject-select').on('select2:selecting', function (e) {
  jQuery('#course-select').empty().trigger('change');
  const subject = selectData.find(subject => subject.name === e.params.args.data.text);

  setSelect('#course-select', subject.courses, true);

  // adds empty option for placeholder
  jQuery('#course-select').append(new Option('', '', true, true)).trigger('change');

  // prevents <select> from opening after it is cleared
  jQuery('select').on('select2:clear', function (evt) {
    jQuery(this).on('select2:opening.cancelOpen', function (evt) {
      evt.preventDefault();

      jQuery(this).off('select2:opening.cancelOpen');
    });
  });
});