"use client";

import { useState, useEffect } from "react";
import CourseCard from "@/components/courseCard/courseCard.js";
import { getCoursesUrl } from "@/lib/api.js";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(getCoursesUrl());
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="main-container">
      <div className="courses-grid">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            course={course}
            onClick={(course) => alert(`Clicked on ${course.displayname}`)}
          />
        ))}
      </div>

      <style>{`
        .main-container {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin: 40px 20px 0 20px;
          min-height: 800px;
        }
        .tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tab {
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #eee;
          padding: 4px 16px;
          font-size: 15px;
          cursor: pointer;
        }
        .tab.active {
          background: #1976d2;
          color: #fff;
          border-color: #1976d2;
        }
        .courses-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
