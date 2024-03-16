let courses = [];

document.addEventListener("click", event => {
  courses.forEach(course => {
    if (course.id == event.target.value) {
      getGolfCourseDetails(course.id).then(response => {
        console.log(response)
      })
    }
  })
});

function getAvailableGolfCourses() {
  return fetch(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
  ).then(function (response) {
    return response.json();
  });
}

function getGolfCourseDetails(golfCourseId) {
  return fetch(
    `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
  ).then(function (response) {
    return response.json();
  });
}

function renderCoursesList() {
  let courseOptionsHtml = '';
  courses.forEach(course => {
    courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
  });
  
  document.getElementById('course-select').innerHTML = courseOptionsHtml;
}


// let teeBoxSelectHtml = ''
// teeBoxes.forEach(function (teeBox, index) {
//   teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
//     teeBox.totalYards
//   } yards</option>`
// });

// document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;

getAvailableGolfCourses().then(response => {
  courses = response;
  console.log(courses)
  renderCoursesList()
})