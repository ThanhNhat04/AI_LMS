'use client'
import * as React from 'react';

// ---- API constants and helpers ----
const BASE_URL = 'https://learn.s4h.edu.vn';
const TOKEN = process.env.NEXT_PUBLIC_MOODLE_TOKEN;

const getCourseContentsUrl = (courseId) =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=core_course_get_contents&courseid=${courseId}&moodlewsrestformat=json`;

const getPagesByCoursesUrl = (courseId) =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=mod_page_get_pages_by_courses&courseids[0]=${courseId}&moodlewsrestformat=json`;

// ---- Component ----
const CourseContent = React.memo(({ courseId }) => {
  const [courseData, setCourseData] = React.useState([]);
  const [selectedContent, setSelectedContent] = React.useState(null);
  const [pagesData, setPagesData] = React.useState([]);
  const [selectedPageContent, setSelectedPageContent] = React.useState(null);
  const [selectedPageName, setSelectedPageName] = React.useState('');
  const [selectedContentName, setSelectedContentName] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState({});

  React.useEffect(() => {
    const fetchCourseContents = async () => {
      const url = getCourseContentsUrl(courseId);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourseData(data);
          localStorage.setItem('courseData', JSON.stringify(data));
        } else {
          console.error('Fetched course data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching course contents:', error);
      }
    };

    const fetchPagesByCourses = async () => {
      const url = getPagesByCoursesUrl(courseId);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPagesData(data.pages);
        localStorage.setItem('pagesData', JSON.stringify(data.pages));
        if (data.pages && data.pages.length > 0) {
          setSelectedPageContent(data.pages[0].content);
          setSelectedPageName(data.pages[0].name);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchCourseContents();
    fetchPagesByCourses();
  }, [courseId]);

  const handleModuleClick = async (module) => {
    const pageId = module.instance;
    const page = pagesData.find(p => p.id === pageId);

    if (page) {
      setSelectedPageContent(page.content);
      setSelectedPageName(page.name);
      localStorage.setItem('selectedPageContent', page.content);
      localStorage.setItem('selectedPageName', page.name);
    } else {
      console.error('Page not found for module instance:', pageId);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  };

  return (
    <div className="course-content-container">
      <div className="course-content-main">
        {selectedPageContent || selectedContent ? (
          <div className="course-content-detail">
            {selectedPageContent ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: selectedPageContent }} />
                <hr className="divider" />
                <div className="module-title">{selectedPageName}</div>
              </>
            ) : (
              <>
                <div>{selectedContent}</div>
                <hr className="divider" />
                <div className="module-title">{selectedContentName}</div>
              </>
            )}
          </div>
        ) : null}
      </div>
      <div className="course-content-sidebar">
        <h2 className="sidebar-title">Chi tiết khóa học</h2>
        {courseData.map(section => (
          <div key={section.id} className="section-box">
            <div
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              <span className="section-name">{section.name}</span>
              <span className="section-toggle">{expandedSections[section.id] ? '▲' : '▼'}</span>
            </div>
            {expandedSections[section.id] && (
              <ul className="module-list">
                {section.modules.map(module => (
                  <li key={module.id} className="module-item" onClick={() => handleModuleClick(module)}>
                    {module.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <style>{`
        .course-content-container {
          display: flex;
          gap: 24px;
          width: 100%;
          margin-left: 10px;
        }
        .course-content-main {
          flex: 2 1 60%;
          min-width: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .course-content-detail {
          padding: 16px;
          width: 100%;
          overflow: auto;
          text-align: center;
        }
        .divider {
          margin: 16px 0;
          border: none;
          border-top: 2px solid #000;
        }
        .module-title {
          margin-top: 16px;
          font-weight: bold;
          font-size: 18px;
        }
        .course-content-sidebar {
          flex: 1 1 35%;
          min-width: 250px;
        }
        .sidebar-title {
          margin-bottom: 16px;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
        }
        .section-box {
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f5f5f5;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 500;
        }
        .section-header:hover {
          background: #e0e0e0;
        }
        .section-name {
          font-weight: bold;
        }
        .section-toggle {
          font-size: 18px;
        }
        .module-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .module-item {
          padding: 8px 16px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          background: #fff;
          transition: background 0.2s;
        }
        .module-item:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
});

export default CourseContent;
