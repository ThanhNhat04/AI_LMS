import { useState, memo } from 'react';
import LazyLoad from 'react-lazyload';
import CourseDialog from '../courseDialog/courseDialog';
import { getCourseImageUrl } from '../../utils/courseUtils';

const CourseCard = memo(({ course }) => {
    const [open, setOpen] = useState(false);
    const [randomStudents] = useState(() => Math.floor(Math.random() * (35 - 10 + 1)) + 10);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="course-card" onClick={handleClickOpen}>
                <LazyLoad height={180} offset={100}>
                    <img
                        className="course-img"
                        src={getCourseImageUrl(course)}
                        alt=" "
                    />
                </LazyLoad>
                <div className="course-status">Đang diễn ra</div>
                <div className="course-content">
                    <div>{course.displayname}</div>
                    <div style={{ color: "#888" }}>
                        {new Date(course.startdate * 1000).toLocaleDateString()} - {new Date(course.enddate * 1000).toLocaleDateString()}
                    </div>
                    <div>Đã học: 2 / 25 buổi</div>
                    <div>
                        <span role="img" aria-label="students">👥</span> {randomStudents}/ 40
                    </div>
                </div>
            </div>
            <CourseDialog open={open} handleClose={handleClose} course={course} />
        </>
    );
});

export default CourseCard;