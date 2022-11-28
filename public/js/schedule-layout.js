
const baseUrl = 'http://localhost:5050/schedule/load/';

function getElements() {

  const scheduleElements = [...document.getElementsByClassName('schedule')];
  scheduleElements.forEach((elem) => {
    let url = baseUrl + elem.id + '/' + getDate();

    getData(url);
  });
}

function getDate() {
  let date = document.getElementById('date-select').value;

  if (date === '' || date === undefined || date === null) {

    const dateObj = new Date();

    let monthString = (dateObj.getMonth() + 1).toString();
    if (monthString.length === 1) {
      monthString = '0' + monthString;
    }
    const dateString =
      dateObj.getFullYear() + '-' + monthString + '-' + dateObj.getDate();
    return dateString;
  }

  const year = date.split('-')[0];
  const month = date.split('-')[1];
  let day = date.split('-')[2];


  if (day.charAt(0) === '0') {
    day = day.charAt(1);
  }

  const dateString = year + '-' + month + '-' + day;
  return dateString;
}

async function apiFetch(url) {
  const respone = await fetch(url);
  const data = await respone.json();
  return data;
}

const getData = async (url) => {
  const data = await apiFetch(url);
  console.log(data);
  loadData(data);
};

function sortData(data) {
  data.appointments.forEach((item) => (item.dayTime = new Date(item.dayTime)));
  data.appointments.sort((d1, d2) => d1.dayTime - d2.dayTime);
  // console.log(data);
  return data.appointments;
}

function formatTimeString(date) {

  let hours = date.getHours();
  let amOrPm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; 


  let minutes = date.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;


  return hours + ':' + minutes + ' ' + amOrPm;
}

function generateHtml(appointment, profileId) {

  const sectionElem = document.createElement('div');
  sectionElem.className = 'appointment';

  // column one
  const divOne = document.createElement('div');
  divOne.className = 'apt-box-1';

  const nameElem = document.createElement('p');
  nameElem.className = 'apt-name';
  nameElem.innerHTML = appointment.name;

  const phoneElem1 = document.createElement('a');
  phoneElem1.className = 'apt-phone1';
  phoneElem1.href = 'tel:' + appointment.phone;
  phoneElem1.innerHTML = appointment.phone;

  divOne.appendChild(nameElem);
  divOne.appendChild(phoneElem1);

  // column two
  const divTwo = document.createElement('div');
  divTwo.className = 'apt-box-2';

  const timeElem = document.createElement('p');
  timeElem.className = 'apt-time';
  timeElem.innerHTML =
    '<b>Start time: </b>' + formatTimeString(appointment.dayTime);

  const durationElem = document.createElement('p');
  durationElem.className = 'apt-duration';
  durationElem.innerHTML = '<b>Duration: </b>' + appointment.duration;

  const detailsBtn = document.createElement('button');
  detailsBtn.className = 'apt-details-btn';
  detailsBtn.id = appointment._id;
  detailsBtn.innerHTML = 'Details';

  divTwo.appendChild(timeElem);
  divTwo.appendChild(durationElem);
  divTwo.appendChild(detailsBtn);

  const divThree = document.createElement('div');
  divThree.className = 'apt-box-3';

  const delForm = document.createElement('form');
  delForm.action = '/schedule/delete/' + profileId + '/' + appointment._id;
  delForm.method = 'post';

  const delBtn = document.createElement('button');
  delBtn.className = 'apt-delete';
  delBtn.type = 'submit';

  delBtn.innerHTML = 'Delete';


  const delInput = document.createElement('input');
  delInput.type = 'hidden';
  delInput.name = '_csrf';
  delInput.value = document.getElementById('_csrf').value;

  delForm.appendChild(delBtn);
  delForm.appendChild(delInput);

  const phoneElem2 = document.createElement('a');
  phoneElem2.className = 'apt-phone2';
  phoneElem2.href = 'tel:' + appointment.phone;
  phoneElem2.innerHTML = appointment.phone;

  divThree.appendChild(delForm);
  divThree.appendChild(phoneElem2);


  const reasonElem = document.createElement('p');
  reasonElem.className = 'reason';
  reasonElem.innerHTML = '<b>Reason: </b>' + appointment.reason;


  sectionElem.appendChild(divOne);
  sectionElem.appendChild(divTwo);
  sectionElem.appendChild(divThree);
  sectionElem.appendChild(reasonElem);


  detailsBtn.addEventListener('click', () => {
    if (detailsBtn.className !== 'apt-details-btn active') {
      detailsBtn.className = 'apt-details-btn active';
      phoneElem1.style.display = 'block';
      durationElem.style.display = 'block';
      delBtn.style.display = 'block';
      reasonElem.style.display = 'block';
      phoneElem2.style.display = 'none';
      detailsBtn.innerHTML = 'Hide';
    } else {
      detailsBtn.className = 'apt-details-btn';
      phoneElem1.style.display = 'none';
      durationElem.style.display = 'none';
      delBtn.style.display = 'none';
      reasonElem.style.display = 'none';
      phoneElem2.style.display = 'block';
      detailsBtn.innerHTML = 'Details';
    }
  });

  return sectionElem;
}

function loadData(data) {

  if (data.appointments.length > 0) {
    const sortedData = sortData(data);
    profileId = data.profileId;


    const sectionElem = document.getElementById(profileId);

    sortedData.forEach((item) => {
      sectionElem.appendChild(generateHtml(item, profileId));
    });
  } else {
    console.log('No data');
    return;
  }
}

getElements();



function dateButtonControl() {

  const scheduleElem = [...document.getElementsByClassName('schedule')];
  scheduleElem.forEach((elem) => {
    elem.innerHTML = '';
  });
  getElements();
}

document
  .getElementById('date-btn')
  .addEventListener('click', dateButtonControl);
