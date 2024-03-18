let courses = [];
let currentGolfCourse = '';
let teeBoxOptions = [];
let currentTeeBox = '';
let players = []

//Global click listener
document.addEventListener("click", event => {
  console.log(event.target)
  //Returns clicked course from course list
  if (event.target == document.getElementById('course-select')) {
    courses.forEach(course => {
      if (course.id == event.target.value) {
        if (currentGolfCourse.id != course.id) {
          //Gets selected course API then renders teeBox
          getGolfCourseDetails(course.id).then(response => {
            renderTeeBoxSelect(response);
            renderTable(teeBoxOptions[0])
          }).catch(error => {
            console.error('An error occurred: ', error);
          })
        }
      }
    })
  }
  //Returns clicked tee fromo tee list
  else if (event.target == document.getElementById('tee-box-select')) {
    teeBoxOptions.forEach(teeBox => {
      //Checking if Spanish Oaks Golf Course then renders table
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
  //Button adds new player (up to 4)
  else if (event.target == document.getElementById('addPlayer')) {
    const playerName = document.getElementById('new-list-name-input')
    if (players.length < 4) {
        if (playerName.value.trim() !== '') {
          const playerId = Math.floor(Math.random() * 1000)
          const newPlayer = new Player(playerName.value.trim(), playerId)
          players.push(newPlayer)
          playerName.value = ''
          renderTable(currentTeeBox)
        }
        else {
          window.alert('Please enter a player name.')
        }
    }
    else {
      window.alert('You already have the maximum number of players.')
      playerName.value = ''
    }
  }

  //Checks if player table cell was clicked
  else if (event.target.classList.contains('playerScoreCell')) {
    for (let i=0; i < players.length; i++) {
      for (let j=0; j < players[i].scores.length+1; j++) {
        if (event.target.classList.contains(`${players[i].name}`) && event.target.classList.contains(`Hole${j+1}Score`)) {
          if (event.target.innerText == '') {
            let newScore = window.prompt('Enter a score');
            if (newScore != null && newScore.trim() != '') {
              players[i].scores.push(newScore)
              renderTable(currentTeeBox)
            }
          }
          else {
            window.alert(`You've already added a score for this hole`)
          }
        }
      }
    }
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
  }).catch(error => {
    console.error('An error occurred: ', error);
  })
}
//Fetch selected golf course
function getGolfCourseDetails(golfCourseId) {
  return fetch(
    `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
  ).then(response => {
    return response.json();
  }).catch(error => {
    console.error('An error occurred: ', error);
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
//Renders tee box
function renderTeeBoxSelect(selectedCourse) {
  currentGolfCourse = selectedCourse;
  teeBoxOptions = [];
  let teeBoxSelectHtml = '';
  //Returns tees for first hole of selected course
  currentGolfCourse.holes[0].teeBoxes.forEach(function (teeBox, index) {
    if (currentGolfCourse.id != 19002) {
      teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}</option>`
      teeBoxOptions.push(teeBox);
    }
    else {
      if (teeBox.teeType != 'auto change location') {
        teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}</option>`
        teeBoxOptions.push(teeBox);
      }
      else {
        teeBoxSelectHtml += ''
      }
    }
  });

  document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}
//renders table
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
        if (players[i].scores[j] !== undefined) {
          front9HTML += `<td class="playerScoreCell ${players[i].name} Hole${j+1}Score">${players[i].scores[j]}</td>`
        }
        else {
          front9HTML += `<td class="playerScoreCell ${players[i].name} Hole${j+1}Score"></td>`
        }
      }
    }
    front9HTML +=  '</tr>'
  }
  else {
    front9HTML += ''
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
      for (let j=9; j < 18; j++) {
        if (players[i].scores[j] !== undefined) {
          back9HTML += `<td class="playerScoreCell ${players[i].name} Hole${j+1}Score">${players[i].scores[j]}</td>`
        }
        else {
          back9HTML += `<td class="playerScoreCell ${players[i].name} Hole${j+10}Score"></td>`
        }
      }
    }
    back9HTML +=  '</tr>'
  }
  else {
    back9HTML +=  ''
  }

  document.getElementById('front9').innerHTML = front9HTML;
  document.getElementById('back9').innerHTML = back9HTML;
}

//Runs when page loads
getAvailableGolfCourses().then(response => {
  courses = response;
  renderCoursesList()
  getGolfCourseDetails(courses[0].id).then(response => {
    renderTeeBoxSelect(response)
    renderTable(teeBoxOptions[0])
  }).catch(error => {
    console.error('An error occurred: ', error);
  })
})