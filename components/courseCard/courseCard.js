import { useState, memo } from "react";
import LazyLoad from "react-lazyload";
import CourseDialog from "../courseDialog/courseDialog";
import { getCourseImageUrl } from "@/lib/api.js";

const CourseCard = memo(({ course, onClick }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(course);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="course-card" onClick={handleClick}>
        <LazyLoad height={180} offset={100}>
          <img className="course-img" src={getCourseImageUrl(course)} alt=" " />
        </LazyLoad>
        <div className="course-content">
          <div className="course-label">Khóa học</div>
          <div className="course-title">{course.displayname}</div>
        </div>
      </div>

      {!onClick && (
        <CourseDialog open={open} handleClose={handleClose} course={course} />
      )}

      <style>{`
        .course-card {
          min-height: 260px;
          width: 360px;
          background: #fafafa;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          margin-bottom: 16px;
          transition: box-shadow 0.2s;
          border-radius: 8px;
          flex-direction: column;  
        }
          .course-label {
          display: inline-block;
          padding: 4px 8px;
          background-color: #E0E7FF; 
          color: #2563EB;
          font-size: 12px;
          font-weight: 500;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .course-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);     
        }
        .course-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .course-content {
          padding: 12px;
          min-height: 90px;
        }
        .course-title {
          font-weight: bold;
          font-size: 20px;
        }

      `}</style>
    </>
  );
});

export default CourseCard;
