let courses = [];
let currentGolfCourse = '';
let teeBoxOptions = [];
let currentTeeBox = '';
let players = []

//Button adds new player (up to 4)
document.getElementById('addPlayer').addEventListener('click', event => { 
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
});
//Checks if Clear Scores button was clicked
document.getElementById('resetCard').addEventListener('click', event => { 
  if (players.length !== 0) {
    if (window.confirm('Are you sure? This will delete all players and scores.')) {
      players = []
      renderTable(currentTeeBox)
    }
  }
});
//Checks for changes in course list and returns selected course
document.getElementById('course-select').addEventListener('change', event => {
  courses.forEach(course => {
    if (course.id == event.target.value) {
      if (currentGolfCourse.id != course.id) {
        //Gets selected course API then renders teeBox
        getGolfCourseDetails(course.id).then(response => {
          renderTeeBoxSelect(response);
          if (players.length !== 0) {
            if (players.find(player => player.scores.length > 0)) {
              if (window.confirm('Would you like to reset your scores?')) {
                players.forEach(player => player.scores = [])
              }
            }
          }
          renderTable(teeBoxOptions[0])
        }).catch(error => {
          console.error('An error occurred: ', error);
        })
      }
    }
  })
});
//Checks for changes in tee list and returns selected tee
document.getElementById('tee-box-select').addEventListener('change', event => {
  teeBoxOptions.forEach(teeBox => {
    //Checking if Spanish Oaks Golf Course then renders table
    if(currentGolfCourse.id != 19002) {
      if (event.target.value == (teeBox.teeTypeId - 1)) {
        if (currentTeeBox.courseHoleTeeBoxId != teeBox.courseHoleTeeBoxId) {
          if (players.length !== 0) {
            if (players.find(player => player.scores.length > 0)) {
              if (window.confirm('Would you like to reset your scores?')) {
                players.forEach(player => player.scores = [])
              }
            }
          }
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
});
//Global click listener for dynamically created elements
document.addEventListener('click', event => {
  //Checks if player table cell was clicked
  if (event.target.classList.contains('playerScoreCell')) {
    for (let i=0; i < players.length; i++) {
      for (let j=0; j < 18; j++) {
        if (event.target.classList.contains(`${players[i].id}`) && event.target.classList.contains(`Hole${j+1}Score`)) {
          if (event.target.innerText == '') {
            let newScore = window.prompt('Enter a score');
            // event.target.innerHTML = `<input type='text' value='Enter score'>`
            if (newScore != null && newScore.trim() != '') {
              if (newScore.match(/^[0-9]+$|-/) && newScore !== '--' && newScore.length <= 3) {
                players[i].scores.push(
                {
                  score: newScore,
                  id: `Hole${j+1}Score`
                })
                renderTable(currentTeeBox)
              }
              else {
                window.alert('That is not a valid entry.')
              }
             
            }
          }
          else {
            let changeScore = window.prompt('Enter a new score');
            if (changeScore != null && changeScore.trim() != '') {
              if (changeScore.match(/^[0-9]+$|-/) && changeScore !== '--' && changeScore.length <= 3) {
                const findMatch = players[i].scores.find(n => n.id === `Hole${j+1}Score`)
                  if (findMatch) {
                    findMatch.score = changeScore
                    renderTable(currentTeeBox)
                  }
              }
              else {
                window.alert('That is not a valid entry.')
              }
            }
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
    if (currentGolfCourse.id != 18300) {
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
//Renders table
function renderTable(selectedTeeBox) {
  currentTeeBox = selectedTeeBox;
  let yardTotals = 0
  let parTotals = 0
  //Start of front9 render
  let front9HTML = '';
  //Render front9 headers
  front9HTML += '<tr class="table-success"><th>Hole</th>';
  for (let i=0; i < 9; i++) {
    front9HTML += `<th>${currentGolfCourse.holes[i].hole}</th>`
  }
  front9HTML += `<th>Out</th>`
  front9HTML += '</tr>'
  //Checking if Spanish Oaks Golf Course
  if(currentGolfCourse.id != 19002) {
    //Render front9 yardage
    let yardScore = 0;
    front9HTML +=  '<tr class="table-primary"><td>Yardage</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].yards}</td>`
      yardScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].yards
    }
    yardTotals += yardScore
    front9HTML += `<td class="out">${yardScore}</td>`
    front9HTML +=  '</tr>'
    //Render front9 par
    let parScore = 0;
    front9HTML +=  '<tr class="table-success"><td>Par</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].par}</td>`
      parScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].par
    }
    parTotals += parScore
    front9HTML += `<td class="out">${parScore}</td>`
    front9HTML +=  '</tr>'
    //Render front9 handicap
    front9HTML +=  '<tr class="table-primary"><td>Handicap</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].hcp}</td>`
    }
    front9HTML += `<td>N/A</td>`
    front9HTML +=  '</tr>'
  }
  else {
    //Render front9 yardage
    let yardScore = 0;
    front9HTML +=  '<tr class="table-primary"><td>Yardage</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].yards}</td>`
      yardScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].yards
    }
    yardTotals += yardScore
    front9HTML += `<td class="out">${yardScore}</td>`
    front9HTML +=  '</tr>'
    //Render front9 par
    let parScore = 0;
    front9HTML +=  '<tr class="table-success"><td>Par</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].par}</td>`
      parScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].par
    }
    parTotals += parScore
    front9HTML += `<td class="out">${parScore}</td>`
    front9HTML +=  '</tr>'
    //Render front9 handicap
    front9HTML +=  '<tr class="table-primary"><td>Handicap</td>'
    for (let i=0; i < 9; i++) {
      front9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].hcp}</td>`
    }
    front9HTML += `<td>N/A</td>`
    front9HTML +=  '</tr>'
  }  
  //Renders players' names and scores
  let playerScore = 0;
  if (players.length > 0) {
    //Goes through player list
    for (let i=0; i < players.length; i++) {
      //Adds cell with player's name
      front9HTML += `<tr class="table-warning"><td>${players[i].name}</td>`
      //Runs through first 9 holes
      for (let j=0; j < 9; j++) {
        //Checks for any scores
        if (players[i].scores.length > 0) {
          //Searches for player score id that matches cell id
          const findMatch = players[i].scores.find(n => n.id === `Hole${j+1}Score`)
          //If a match was found generate cell with score and add to playerScore
          if (findMatch) {
            front9HTML += `<td class="playerScoreCell ${players[i].name} ${players[i].id} Hole${j+1}Score">${findMatch.score}</td>`
            playerScore += Number(findMatch.score) 
          }
          //If no match was found, generate blank cell
          else {
            front9HTML += `<td class="playerScoreCell ${players[i].name} ${players[i].id} Hole${j+1}Score"></td>`
          }
        }
        //If no scores just renders blank cells
        else {
          front9HTML += `<td class="playerScoreCell ${players[i].name} ${players[i].id} Hole${j+1}Score"></td>`
        }
      }
      //Renders Out score
      front9HTML += `<td class="out">${playerScore}</td>`
    }
    //Closes off table row
    front9HTML +=  '</tr>'
  }
  else {
    //Renders nothing if no players
    front9HTML += ''
  }
  
  //Start of back9HTML render
  let back9HTML = '';
  //Render back9HTML headers
  back9HTML += '<tr class="table-success"><th>Hole</th>';
  for (let i=9; i < currentGolfCourse.holes.length; i++) {
    back9HTML += `<th>${currentGolfCourse.holes[i].hole}</th>`
  }
  back9HTML += `<th>In</th>`
  back9HTML += `<th>Total</th>`
  back9HTML += '</tr>'
  //Checking if Spanish Oaks Golf Course
  if(currentGolfCourse.id != 19002) {
    //Render back9HTML yardage
    let yardScore = 0;
    back9HTML +=  '<tr class="table-primary"><td>Yardage</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].yards}</td>`
      yardScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].yards
    }
    yardTotals += yardScore
    back9HTML += `<td class="in">${yardScore}</td>`
    back9HTML += `<td class="in">${yardTotals}</td>`
    back9HTML +=  '</tr>'
    //Render back9HTML par
    let parScore = 0;
    back9HTML +=  '<tr class="table-success"><td>Par</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].par}</td>`
      parScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].par
    }
    parTotals += parScore
    back9HTML += `<td class="in">${parScore}</td>`
    back9HTML += `<td class="in">${parTotals}</td>`
    back9HTML +=  '</tr>'
    //Render back9HTML handicap
    back9HTML +=  '<tr class="table-primary"><td>Handicap</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-1].hcp}</td>`
    }
    back9HTML += `<td>N/A</td>`
    back9HTML += `<td>N/A</td>`
    back9HTML +=  '</tr>'
  }
  else {
    //Render back9HTML yardage
    let yardScore = 0;
    back9HTML +=  '<tr class="table-primary"><td>Yardage</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].yards}</td>`
      yardScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].yards
    }
    yardTotals += yardScore
    back9HTML += `<td class="in">${yardScore}</td>`
    back9HTML += `<td class="in">${yardTotals}</td>`
    back9HTML +=  '</tr>'
    //Render back9HTML par
    let parScore = 0;
    back9HTML +=  '<tr class="table-success"><td>Par</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].par}</td>`
      parScore += currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].par
    }
    parTotals += parScore
    back9HTML += `<td class="in">${parScore}</td>`
    back9HTML += `<td class="in">${parTotals}</td>`
    back9HTML +=  '</tr>'
    //Render back9HTML handicap
    back9HTML +=  '<tr class="table-primary"><td>Handicap</td>'
    for (let i=9; i < currentGolfCourse.holes.length; i++) {
      back9HTML += `<td>${currentGolfCourse.holes[i].teeBoxes[currentTeeBox.teeTypeId-2].hcp}</td>`
    }
    back9HTML += `<td>N/A</td>`
    back9HTML += `<td>N/A</td>`
    back9HTML +=  '</tr>'
  }  
  //Renders players' names and scores
  if (players.length !== 0) {
    for (let i=0; i < players.length; i++) {
      let playerTotalScore = playerScore;
      playerScore = 0;
      back9HTML += `<tr class="table-warning"><td>${players[i].name}</td>`
      for (let j=9; j < 18; j++) {
        if (players[i].scores.length > 0) {
          const findMatch = players[i].scores.find(n => n.id === `Hole${j+1}Score`)
          
          if (findMatch) {
            back9HTML += `<td class="playerScoreCell ${players[i].name} ${players[i].id} Hole${j+1}Score">${findMatch.score}</td>`
            playerScore += Number(findMatch.score)
            playerTotalScore += Number(findMatch.score) 
          }
          else {
            back9HTML += `<td class="playerScoreCell ${players[i].name} ${players[i].id} Hole${j+1}Score"></td>`
          }
        }
        else {
          back9HTML += `<td class="playerScoreCell ${players[i].name} ${players[i].id} Hole${j+1}Score"></td>`
        }
      }
      back9HTML += `<td class="in">${playerScore}</td>`
      back9HTML += `<td class="in">${playerTotalScore}</td>`
    }
    back9HTML +=  '</tr>'
  }
  else {
    back9HTML += ''
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