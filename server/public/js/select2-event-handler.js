// resolves conflict with go.GraphObject.make() in graph-initializer
jQuery.noConflict();

// contains the data for the course and subject selects
let selectData;

// runs as soon as the document is ready
jQuery(document).ready(function () {
  // initalizes all <select> tags
  setSelect('#subject-select', 'Subject', null, false);
  setSelect('#course-select', 'Course', null, false);
  getSelectData(setSelect);
});

// get subject and course data and initialize selectData
// store all subject names into d and then execute the callback
async function getSelectData(callback) {
  const response = await fetch('/api/subjects');
  selectData = await response.json();
  const d = selectData.map(subject => {
    return subject.name
  });
  callback('#subject-select', 'Subject', d, false);
}

// sets a select2 tag using id, data and clear
function setSelect(id, placeholder, data, clear) {
  jQuery(id).select2({
    data: data,
    theme: 'bootstrap-5',
    placeholder: placeholder,
    allowClear: clear,
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });
}

// if subject is selected, update the data in #course-select using selectData
jQuery('#subject-select').on('select2:selecting', function (e) {
  jQuery('#course-select').empty().trigger('change');
  const subject = selectData.find(subject => subject.name === e.params.args.data.text);

  setSelect('#course-select', 'Course', subject.courses, true);

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