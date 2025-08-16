import { log } from 'console';
import { useState, useEffect } from 'react';

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
};


export async function findAssignment(courseid) {
  const url = getAssignmentsUrl(courseid);
  const response = await fetch(url, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const json = await response.json();
  return json.courses[0]?.assignments || [];
}

export async function findSubmissions(ids) {
  const url = getSubmissionsUrl(ids);
  const response = await fetch(url, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const json = await response.json();
  const submissions = [];
  json.assignments?.forEach(assignment => {
    assignment.submissions?.forEach(submission => {
      const file = submission.plugins.find(p => p.type === 'file')?.fileareas[0]?.files[0];
      if (file) {
        submissions.push({ ...file, userid: submission.userid, assignmentid: assignment.assignmentid });
      }
    });
  });
  return submissions;
}

export async function getUsersInfo(userIds) {
  const url = getUsersInfoUrl(userIds);
  const response = await fetch(url, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return await response.json();
}

export function useLessonPath(courseid = 30) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [assignmentMap, setAssignmentMap] = useState({});

  useEffect(() => {
    async function fetchData() {
      const assignments = await findAssignment(courseid);
      const assignmentMap = {};
      assignments.forEach(assignment => {
        assignmentMap[assignment.id] = assignment.name;
      });
      setAssignmentMap(assignmentMap);
      setAssignments(assignments);

      const assignmentIds = assignments.map(a => a.id);
      const submissions = await findSubmissions(assignmentIds);
      const userIds = [...new Set(submissions.map(s => s.userid))];
      const users = await getUsersInfo(userIds);
      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = user;
      });
      setUserMap(userMap);
      setSubmissions(submissions);
    }
    fetchData();
  }, [courseid]);

  return {
    assignments,
    submissions,
    userMap,
    assignmentMap,
  };
}
