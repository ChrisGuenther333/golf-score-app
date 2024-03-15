function getAvailableGolfCourses() {
    return fetch(
      "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
    ).then(response => {
      return response.json();
    }).catch(error => {
        return console.error('Error fetching available courses', error);
    });
  }
  function getGolfCourseDetails(golfCourseId) {
    return fetch(
      `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
    ).then(response => {
      return response.json();
    }).catch(error => {
        return console.error(`Error fetching data for course ${golfCourseId}`, error);
    });
  }

getGolfCourseDetails(getAvailableGolfCourses())