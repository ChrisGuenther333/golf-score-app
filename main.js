let courses = [];
let currentGolfCourse = '';
let teeBoxOptions = [];
let currentTeeBox = '';

//Global click listener
document.addEventListener("click", event => {
  //Returns selected course from course list
  if (event.target == document.getElementById('course-select')) {
    courses.forEach(course => {
      if (course.id == event.target.value) {
        if (currentGolfCourse.id != course.id) {
          getGolfCourseDetails(course.id).then(response => {
            renderTeeBoxSelect(response);
          })
        }
      }
    })
  }
  else if (event.target == document.getElementById('tee-box-select')) {
    teeBoxOptions.forEach(teeBox => {
      if (event.target.value == (teeBox.teeTypeId - 1)) {
        if (currentTeeBox.courseHoleTeeBoxId != teeBox.courseHoleTeeBoxId) {
          renderTable(teeBox);
        }
      }
    })
  }
});

class Player {
  constructor(name, id = getNextId(), scores = []) {
    this.name = name;
    this.id = id;
    this.scores = scores;
  }
}

//Fetch golf course list
function getAvailableGolfCourses() {
  return fetch(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
  ).then(function (response) {
    return response.json();
  });
}
//Fetch selected golf course
function getGolfCourseDetails(golfCourseId) {
  return fetch(
    `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
  ).then(response => {
    return response.json();
  })
}
//Renders golf course list
function renderCoursesList() {
  let courseOptionsHtml = '';
  courses.forEach(course => {
    courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
  });
  
  document.getElementById('course-select').innerHTML = courseOptionsHtml;
}

function renderTeeBoxSelect(selectedCourse) {
  currentGolfCourse = selectedCourse;
  teeBoxOptions = [];
  let teeBoxSelectHtml = '';
  //Returns tees for first hole of selected course
  currentGolfCourse.holes[0].teeBoxes.forEach(function (teeBox, index) {
    teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
      teeBox.totalYards
    } yards</option>`
    teeBoxOptions.push(teeBox);
  });

  document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}

function renderTable(selectedTeeBox) {
  currentTeeBox = selectedTeeBox;
  
  let front9HTML = '';
  front9HTML += '<tr><th>Hole</th>';

  for (let i=0; i < 9; i++) {
    front9HTML += `<th>${currentGolfCourse.holes[i].hole}</th>`
  }
  front9HTML += '</tr>'

  let back9HTML = '';
  back9HTML += '<tr><th>Hole</th>';

  for (let i=9; i < currentGolfCourse.holes.length; i++) {
    back9HTML += `<th>${currentGolfCourse.holes[i].hole}</th>`
  }
  back9HTML += '</tr>'

  document.getElementById('front9').innerHTML = front9HTML;
  document.getElementById('back9').innerHTML = back9HTML;

  
}


getAvailableGolfCourses().then(response => {
  courses = response;
  renderCoursesList()
})