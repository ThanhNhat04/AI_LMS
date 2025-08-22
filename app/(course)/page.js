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
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <style>{`
        .main-container {
          background: #fff;
          padding: 16px;
          margin: 40px 20px 0 20px;
          min-height: 800px;
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
