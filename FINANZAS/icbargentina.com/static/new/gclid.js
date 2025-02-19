function getParam(p) {
  var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getExpiryRecord(value) {
  var expiryPeriod = 90 * 24 * 60 * 60 * 1000; // caducidad de 90 dias, en milisegundos

  var expiryDate = new Date().getTime() + expiryPeriod;
  return {
    value: value,
    expiryDate: expiryDate
  };
}

function addGclid() {
  var gclidParam = getParam('gclid');
  var gclidFormFields = ['gclid_field'];
  var gclidRecord = null;
  var currGclidFormField;

  var gclsrcParam = getParam('gclsrc');
  var isGclsrcValid = !gclsrcParam || gclsrcParam.indexOf('aw') !== -1;

  gclidFormFields.forEach(function (field) {
    if (document.getElementById(field)) {
      currGclidFormField = document.getElementById(field);
    }
  });

  if (gclidParam && isGclsrcValid) {
    gclidRecord = getExpiryRecord(gclidParam);
    localStorage.setItem('gclid', JSON.stringify(gclidRecord));
  }

  var gclid = gclidRecord || JSON.parse(localStorage.getItem('gclid'));
  var isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;

  if (currGclidFormField && isGclidValid) {
    currGclidFormField.value = gclid.value;
  }
}

window.addEventListener('load', addGclid);
