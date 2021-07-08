// resolves conflict with go.GraphObject.make() in graph-initializer
jQuery.noConflict();

jQuery(document).ready(function () {
  // initalizes all <select> tags
  jQuery('#subject-select').select2({
    theme: 'bootstrap-5',
    placeholder: 'Subject',
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });
  jQuery('#course-select').select2({
    theme: 'bootstrap-5',
    placeholder: 'Course #',
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });
});

// if subject is selected, update the data in #course-select using myData (declared in in graph-initializer.js)
jQuery('#subject-select').on('select2:selecting', function (e) {
  jQuery('#course-select').empty().trigger('change');
  const subject = myData[e.params.args.data.text];
  const data = [];
  let c = 1;
  for (course in subject) {
    data.push(subject[course].name + ' - ' + subject[course].title);
  }
  jQuery('#course-select').select2({
    data: data,
    theme: 'bootstrap-5',
    placeholder: 'Course',
    allowClear: true,
    selectionCssClass: 'select2--small',
    dropdownCssClass: 'select2--small',
  });

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