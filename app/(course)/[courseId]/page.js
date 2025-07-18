'use client'
import * as React from 'react';
import { useParams } from 'next/navigation';

// ---- API constants and helpers ----
const BASE_URL = 'https://learn.s4h.edu.vn';
const TOKEN = process.env.NEXT_PUBLIC_MOODLE_TOKEN;

const getCourseContentsUrl = (courseId) =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=core_course_get_contents&courseid=${courseId}&moodlewsrestformat=json`;

const getPagesByCoursesUrl = (courseId) =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=mod_page_get_pages_by_courses&courseids[0]=${courseId}&moodlewsrestformat=json`;

// ---- Component ----
const courseContent = React.memo(() => {
  const params = useParams();
  const courseId = params.courseId;

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
        console.log('Fetched course contents:', data);
        
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
          gap: 40px;
          width: 100%;
          margin: 40px auto 0 auto;
          max-width: 1600px; /* tăng chiều rộng tổng */
          background: linear-gradient(135deg, #e3f0ff 0%, #f8fafc 100%);
          border-radius: 5px;
          box-shadow: 0 8px 32px rgba(25, 118, 210, 0.10);
          padding: 40px 32px;
        }
        .course-content-main {
          flex: 2 1 60%;
          min-width: 1000px; /* tăng chiều rộng phần nội dung chính */
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
        .course-content-detail {
          padding: 32px 40px;
          width: 100%;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 4px 24px rgba(25, 118, 210, 0.12);
          overflow: auto;
          text-align: center; /* căn giữa chữ */
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .divider {
          margin: 28px 0;
          border: none;
          border-top: 2px solid #1976d2;
        }
        .module-title {
          margin-top: 18px;
          font-weight: bold;
          font-size: 26px;
          color: #1976d2;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
        }
        .course-content-sidebar {
          flex: 1 1 35%;
          min-width: 320px;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 4px 24px rgba(25, 118, 210, 0.10);
          padding: 32px 22px;
          animation: fadeIn 0.7s;
        }
        .sidebar-title {
          margin-bottom: 24px;
          font-size: 28px;
          font-weight: 700;
          color: #1976d2;
          text-align: center;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
        }
        .section-box {
          margin-bottom: 22px;
          border: 1px solid #d0e2ff;
          border-radius: 5px;
          overflow: hidden;
          background: linear-gradient(90deg, #f5f8fd 70%, #e3f0ff 100%);
          box-shadow: 0 2px 12px rgba(25, 118, 210, 0.06);
          transition: box-shadow 0.2s;
        }
        .section-box:hover {
          box-shadow: 0 6px 24px rgba(25, 118, 210, 0.13);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #e3e7ed;
          padding: 16px 22px;
          cursor: pointer;
          font-size: 20px;
          font-weight: 600;
          color: #1976d2;
          transition: background 0.2s;
        }
        .section-header:hover {
          background: #d0d7e6;
        }
        .section-name {
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-toggle {
          font-size: 22px;
          color: #1976d2;
        }
        .module-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .module-item {
          padding: 14px 28px;
          border-bottom: 1px solid #e3e7ed;
          cursor: pointer;
          background: #fff;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          font-size: 17px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 4px solid transparent;
        }
        .module-item:hover {
          background: #e3f0ff;
          color: #1976d2;
          border-left: 4px solid #1976d2;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
        }
        .module-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
});

export default courseContent;
