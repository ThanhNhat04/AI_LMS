

const BASE_URL = process.env.NEXT_PUBLIC_MOODLE_URL;
const TOKEN = process.env.NEXT_PUBLIC_MOODLE_TOKEN ;

export const getAssignmentsUrl = (courseid) =>
  `${BASE_URL}/webservice/rest/server.php?moodlewsrestformat=json&wstoken=${TOKEN}&wsfunction=mod_assign_get_assignments&courseids[0]=${courseid}`;

export const getSubmissionsUrl = (ids) => {
  let url = `${BASE_URL}/webservice/rest/server.php?moodlewsrestformat=json&wstoken=${TOKEN}&wsfunction=mod_assign_get_submissions`;
  ids.forEach((id, i) => url += `&assignmentids[${i}]=${id}`);
  return url;
};

export const getUsersInfoUrl = (userIds) => {
  let url = `${BASE_URL}/webservice/rest/server.php?moodlewsrestformat=json&wstoken=${TOKEN}&wsfunction=core_user_get_users_by_field&field=id`;
  userIds.forEach((id, index) => {
    url += `&values[${index}]=${id}`;
  });
  return url;
}

export const getCoursesUrl = () =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=core_course_get_courses_by_field&moodlewsrestformat=json`;

export const getCourseImageUrl = (course) =>
  course.overviewfiles?.[0]?.fileurl
    ? course.overviewfiles[0].fileurl + '?token=' + TOKEN
    : 'https://img.freepik.com/free-vector/paper-style-white-monochrome-background_23-2149009213.jpg';


export const getCourseContentsUrl = (courseId) =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=core_course_get_contents&courseid=${courseId}&moodlewsrestformat=json`;

export const getPagesByCoursesUrl = (courseId) =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=mod_page_get_pages_by_courses&courseids[0]=${courseId}&moodlewsrestformat=json`;
