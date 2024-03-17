let courses = [];
let currentGolfCourse = '';
let teeBoxOptions = [];
let currentTeeBox = '';
let players = []

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
      //Checking if Spanish Oaks Golf Course
      if(currentGolfCourse.id != 19002) {
        if (event.target.value == (teeBox.teeTypeId - 1)) {
          if (currentTeeBox.courseHoleTeeBoxId != teeBox.courseHoleTeeBoxId) {
            renderTable(teeBox);
          }
        }
      }
      else {
        if (event.target.value == (teeBox.teeTypeId - 2)) {
          if (currentTeeBox.courseHoleTeeBoxId != teeBox.courseHoleTeeBoxId) {
            renderTable(teeBox);
          }
        }
      }
    })
  }
  else if (event.target == document.getElementById('addPlayer')) {
    const playerName = document.getElementById('new-list-name-input')
    const playerId = Math.floor(Math.random() * 1000)
    const newPlayer = new Player(playerName.value, playerId)
    players.push(newPlayer)
    console.log(players)
  }
});

class Player {
  constructor(name, id, scores = []) {
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
  //Start of front9 render
  let front9HTML = '';
  //Render front9 headers
  front9HTML += '<tr><th>Hole</th>';
  for (let i=0; i < 9; i++) {
    front9HTML += `<th>${currentGolfCourse.holes[i].hole}</th>`
  }
  front9HTML += '</tr>'
  //Checking if Spanish Oaks Golf Course
  if(currentGolfCourse.id != 19002) {
    //Render front9 yardage
    front9HTML +=  '<tr><td>Yardage</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].yards}</td>`
    }
    front9HTML +=  '</tr>'
    //Render front9 par
    front9HTML +=  '<tr><td>Par</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].par}</td>`
    }
    front9HTML +=  '</tr>'
    //Render front9 handicap
    front9HTML +=  '<tr><td>Handicap</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].hcp}</td>`
    }
    front9HTML +=  '</tr>'
  }
  else {
    //Render front9 yardage
    front9HTML +=  '<tr><td>Yardage</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].yards}</td>`
    }
    front9HTML +=  '</tr>'
    //Render front9 par
    front9HTML +=  '<tr><td>Par</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].par}</td>`
    }
    front9HTML +=  '</tr>'
    //Render front9 handicap
    front9HTML +=  '<tr><td>Handicap</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].hcp}</td>`
    }
    front9HTML +=  '</tr>'
  }  
  //Renders players' names and scores
  if (players.length !== 0) {
    for (let i=0; i < players.length; i++) {
      front9HTML += `<tr><td>${players[i].name}</td>`
      for (let j=0; j < 9; j++) {
        if (players[i].scores[j] != undefined) {
          front9HTML += `<td>${players[i].scores[j]}</td>`
        }
        else {
          front9HTML += `<td></td>`
        }
      }
    }
    front9HTML +=  '</tr>'
  }
  else {
    console.log('There are no players currently')
  }
  
  //Start of back9 render
  let back9HTML = '';
  //Render back9 headers
  back9HTML += '<tr><th>Hole</th>';
  for (let i=9; i < currentGolfCourse.holes.length; i++) {
    back9HTML += `<th>${currentGolfCourse.holes[i].hole}</th>`
  }
  back9HTML += '</tr>'
  //Checking if Spanish Oaks Golf Course
  if(currentGolfCourse.id != 19002) {
    //Render back9 yardage
    back9HTML +=  '<tr><td>Yardage</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].yards}</td>`
    }
    back9HTML +=  '</tr>'
    //Render back9 par
    back9HTML +=  '<tr><td>Par</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].par}</td>`
    }
    back9HTML +=  '</tr>'
    //Render back9 handicap
    back9HTML +=  '<tr><td>Handicap</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].hcp}</td>`
    }
    back9HTML +=  '</tr>'
  }
  else {
    //Render back9 yardage
    back9HTML +=  '<tr><td>Yardage</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].yards}</td>`
    }
    back9HTML +=  '</tr>'
    //Render back9 par
    back9HTML +=  '<tr><td>Par</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].par}</td>`
    }
    back9HTML +=  '</tr>'
    //Render back9 handicap
    back9HTML +=  '<tr><td>Handicap</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].hcp}</td>`
    }
    back9HTML +=  '</tr>'
  }
  //Renders players' names and scores
  if (players.length !== 0) {
    for (let i=0; i < players.length; i++) {
      back9HTML += `<tr><td>${players[i].name}</td>`
      for (let j=0; j < 9; j++) {
        if (players[i].scores[j] != undefined) {
          back9HTML += `<td>${players[i].scores[j]}</td>`
        }
        else {
          back9HTML += `<td></td>`
        }
      }
    }
    back9HTML +=  '</tr>'
  }
  else {
    console.log('There are no players currently')
  }

  document.getElementById('front9').innerHTML = front9HTML;
  document.getElementById('back9').innerHTML = back9HTML;
}


getAvailableGolfCourses().then(response => {
  courses = response;
  renderCoursesList()
})