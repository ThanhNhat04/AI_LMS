"use client"

import { useState, useEffect, memo } from 'react';
import LazyLoad from 'react-lazyload';
import CourseContent from '../components/courseContent';

const CourseDialog = ({ open, handleClose, course }) => {
    if (!open) return null;
    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <div className="dialog-header">
                    <span>{course.displayname}</span>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>
                <div>
                    <CourseContent courseId={course.id} />
                </div>
            </div>
        </div>
    );
};

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
                        src={course.overviewfiles?.[0]?.fileurl
                            ? course.overviewfiles[0].fileurl + '?token=7c3afb790462432d924aef3f79a90b22'
                            : 'https://img.freepik.com/free-vector/paper-style-white-monochrome-background_23-2149009213.jpg'}
                        alt="Lập trình thiết bị di động"
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

export default function CourseManager() {
    const [value, setValue] = useState(0);
    const [courses, setCourses] = useState([]);

    const handleChange = (newValue) => setValue(newValue);

    useEffect(() => {
        const fetchCourses = async () => {
            const token = '7c3afb790462432d924aef3f79a90b22';
            const wsFunction = 'core_course_get_courses_by_field';
            const moodleWsRestFormat = 'json';
            const url = `https://learn.s4h.edu.vn/webservice/rest/server.php?wstoken=${token}&wsfunction=${wsFunction}&moodlewsrestformat=${moodleWsRestFormat}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCourses(data.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="main-container">
            <div className="tabs">
                <button className={value === 0 ? "tab active" : "tab"} onClick={() => handleChange(0)}>
                    Tất cả ({courses.length})
                </button>
                <button className={value === 1 ? "tab active" : "tab"} onClick={() => handleChange(1)}>
                    Đang diễn ra (11)
                </button>
                <button className={value === 2 ? "tab active" : "tab"} onClick={() => handleChange(2)}>
                    Kết thúc (14)
                </button>
            </div>
            <div className="courses-grid">
                {courses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                ))}
            </div>
            <style>{`
                .git {
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
                .course-card {
                    width: 260px;
                    background: #fafafa;
                    border-radius: 8px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                    margin-bottom: 16px;
                    transition: box-shadow 0.2s;
                }
                .course-card:hover {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                }
                .course-img {
                    width: 100%;
                    height: 140px;
                    object-fit: cover;
                }
                .course-status {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: rgba(0,0,0,0.5);
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 0 0 8px 0;
                    font-size: 13px;
                }
                .course-content {
                    padding: 12px;
                    min-height: 90px;
                }
                .dialog-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .dialog-content {
                    background: #fff;
                    border-radius: 8px;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: auto;
                    padding: 24px;
                    position: relative;
                }
                .dialog-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 20px;
                    margin-bottom: 16px;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #888;
                }
            `}</style>
        </div>
    );
}
