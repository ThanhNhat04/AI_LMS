import { useState, memo } from "react";
import LazyLoad from "react-lazyload";
import CourseDialog from "../courseDialog/courseDialog";
import { getCourseImageUrl } from "@/lib/api.js";

const CourseCard = memo(({ course, onClick }) => {
  const [open, setOpen] = useState(false);
  const [randomStudents] = useState(
    () => Math.floor(Math.random() * (35 - 10 + 1)) + 10
  );

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
        <div className="course-status">Đang diễn ra</div>
        <div className="course-content">
          <div>{course.displayname}</div>
          <div>
            <span role="img" aria-label="students">👥</span>{" "}
            {randomStudents}/ 40
          </div>
        </div>
      </div>

      {!onClick && (
        <CourseDialog open={open} handleClose={handleClose} course={course} />
      )}

      <style>{`
        .course-card {
          height: 300px;
          width: 400px;
          background: #fafafa;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          margin-bottom: 16px;
          transition: box-shadow 0.2s;
        }
        .course-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);     
        }
        .course-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .course-status {
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          padding: 4px 10px;
          border-radius: 0 0 8px 0;
          font-size: 13px;
        }
        .course-content {
          padding: 12px;
          min-height: 90px;
        }
      `}</style>
    </>
  );
});

export default CourseCard;
