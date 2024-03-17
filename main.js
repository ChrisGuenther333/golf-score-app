let courses = [];
let currentGolfCourse = '';

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
});
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
  console.log(currentGolfCourse)
  let teeBoxSelectHtml = ''
  currentGolfCourse.holes.forEach(hole => {
    hole.teeBoxes.forEach(function (teeBox, index) {
      teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
        teeBox.totalYards
      } yards</option>`
    });
  })

  document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}




getAvailableGolfCourses().then(response => {
  courses = response;
  console.log(courses)
  renderCoursesList()
})