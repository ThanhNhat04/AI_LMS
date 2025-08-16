'use client'
import * as React from 'react';
import { useParams } from 'next/navigation';
import { getCourseContentsUrl, getPagesByCoursesUrl } from '@/lib/api.js';
import {IframeWrapper} from '@/utils/helper.js'


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
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCourseData(data);
          localStorage.setItem('courseData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching course contents:', error);
      }
    };

    const fetchPagesByCourses = async () => {
      const url = getPagesByCoursesUrl(courseId);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
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

  const handleModuleClick = (module) => {
    const pageId = module.instance;
    const page = pagesData.find(p => p.id === pageId);
    if (page) {
      setSelectedPageContent(page.content);
      setSelectedPageName(page.name);
      localStorage.setItem('selectedPageContent', page.content);
      localStorage.setItem('selectedPageName', page.name);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="course-content-container">
      {/* Nội dung chính */}
      <div className="course-content-main">
        {selectedPageContent || selectedContent ? (
          <div className="course-content-detail">
            {selectedPageContent ? (
              <>
                <IframeWrapper html={selectedPageContent} />
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

      {/* Sidebar khóa học */}
      <div className="course-content-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Nội dung khóa học</h2>
        </div>

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
                  <li
                    key={module.id}
                    className="module-item"
                    onClick={() => handleModuleClick(module)}
                  >
                    {module.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <style>{`
        body {
          overflow-y: hidden;
        }
        .course-content-container {
          display: flex;
          gap: 40px;
          width: 100%;
          margin: 0;
          background: white;
        }
        .course-content-main {
          flex: 2 1 90%;
          min-width: 1000px;
          width:auto; 
          display: flex;
          align-items: flex-start;
          justify-content: center;
          height: calc(100vh - 200px); 
          overflow-y: auto;
          background: white;
        }
        .course-content-detail {
          padding: 32px 10px;
          width: 100%;
          overflow: auto;
          text-align: center;
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
          font-size: 22px;
          color: #1976d2;
        }
        .course-content-sidebar {
          flex: 1 1 35%;
          min-width: 320px;
          border-radius: 5px;
          height: 100vh;
          overflow-y: auto;
          scrollbar-gutter: stable; 
        }
        .sidebar-title {
          font-size: 24px;
          font-weight: 700;
          color: #1976d2;
          padding: 15px
        }
        .section-box {
          margin-bottom: 5px;
          border: 1px solid #d0e2ff;
          overflow: hidden;
          background: linear-gradient(90deg, #f5f8fd 70%, #e3f0ff 100%);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 22px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
          color: black;
        }
        .section-name {
          font-weight: bold;
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
          transition: background 0.2s;
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
        }
      `}</style>
    </div>
  );
});

export default courseContent;
