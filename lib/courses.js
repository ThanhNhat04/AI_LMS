// ---- API constants and helpers ----
const BASE_URL = 'https://learn.s4h.edu.vn';
const TOKEN = process.env.REACT_APP_MOODLE_TOKEN ;

const getAssignmentsUrl = (courseid) =>
  `${BASE_URL}/webservice/rest/server.php?moodlewsrestformat=json&wstoken=${TOKEN}&wsfunction=mod_assign_get_assignments&courseids[0]=${courseid}`;

const getSubmissionsUrl = (ids) => {
  let url = `${BASE_URL}/webservice/rest/server.php?moodlewsrestformat=json&wstoken=${TOKEN}&wsfunction=mod_assign_get_submissions`;
  ids.forEach((id, i) => url += `&assignmentids[${i}]=${id}`);
  return url;
};

const getUsersInfoUrl = (userIds) => {
  let url = `${BASE_URL}/webservice/rest/server.php?moodlewsrestformat=json&wstoken=${TOKEN}&wsfunction=core_user_get_users_by_field&field=id`;
  userIds.forEach((id, index) => {
    url += `&values[${index}]=${id}`;
  });
  return url;
}

const getCoursesUrl = () =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=core_course_get_courses_by_field&moodlewsrestformat=json`;

const getCourseImageUrl = (course) =>
  course.overviewfiles?.[0]?.fileurl
    ? course.overviewfiles[0].fileurl + '?token=' + TOKEN
    : 'https://img.freepik.com/free-vector/paper-style-white-monochrome-background_23-2149009213.jpg';
