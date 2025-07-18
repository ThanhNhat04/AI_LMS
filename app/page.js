"use client"

import { useState, useEffect, memo } from 'react';
import LazyLoad from 'react-lazyload';
import { useRouter } from 'next/navigation';
import IconXMark from '../public/svg/index.js'; 
import { Alert } from '@mui/material';
// ---- API constants and helpers ----
const BASE_URL = 'https://learn.s4h.edu.vn';
const TOKEN = process.env.NEXT_PUBLIC_MOODLE_TOKEN;

const getCoursesUrl = () =>
  `${BASE_URL}/webservice/rest/server.php?wstoken=${TOKEN}&wsfunction=core_course_get_courses_by_field&moodlewsrestformat=json`;

const getCourseImageUrl = (course) =>
  course.overviewfiles?.[0]?.fileurl
    ? course.overviewfiles[0].fileurl + '?token=' + TOKEN
    : 'https://img.freepik.com/free-vector/paper-style-white-monochrome-background_23-2149009213.jpg';

// ---- Components ----
const CourseDialog = ({ open, handleClose, course }) => {
    const router = useRouter();

    if (!open) return null;

    const handleGoToLesson = () => {
        router.push(`${course.id}`);
        handleClose();
    };

    const handleGoToQuiz = () => {
        router.push(`${course.id}/quiz`);
        handleClose();
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-content enhanced-dialog">
                <div className="dialog-header">
                    <span>{course.displayname}</span>
                    <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                        <IconXMark />
                    </button>
                </div>
                <div className="dialog-body">
                    <img
                        className="dialog-img"
                        src={getCourseImageUrl(course)}
                        alt={course.displayname}
                    />
                    <div className="dialog-actions">
                        <button className="dialog-btn" onClick={handleGoToLesson}>Bài học</button>
                        <button className="dialog-btn" onClick={handleGoToQuiz}>Quizz</button>
                        <button className="dialog-btn" onClick={() => alert('Đang phát triển')}>Tạo Quizz</button>
                    </div>
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

export default function CourseManager() {
    const [value, setValue] = useState(0);
    const [courses, setCourses] = useState([]);

    const handleChange = (newValue) => setValue(newValue);

    useEffect(() => {
        const fetchCourses = async () => {
            const url = getCoursesUrl();
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
                .course-card {
                height: 300px;
                    width: 400px;
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
                    height: 200px;
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
                .enhanced-dialog {
                    min-width: 320px;
                    padding: 32px 24px;
                    box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12);
                    border: 1px solid #e3e3e3;
                    animation: fadeInDialog 0.3s;
                }
                @keyframes fadeInDialog {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .dialog-body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 18px;
                }
                .dialog-img {
                    width: 100%;
                    max-width: 320px;
                    height: 140px;
                    object-fit: cover;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }
                .dialog-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                    margin-top: 8px;
                }
                .dialog-btn {
                    width: 100%;
                    padding: 10px 0;
                    border-radius: 6px;
                    border: none;
                    background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
                    color: #fff;
                    font-size: 17px;
                    cursor: pointer;
                    font-weight: 500;
                    box-shadow: 0 2px 8px rgba(25,118,210,0.08);
                    transition: background 0.2s;
                }
                .dialog-btn:hover {
                    background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
                }
                .dialog-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e3e3e3;
                }
                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    margin-left: 12px;
                    transition: transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
                .close-btn:hover {
                    color: #1a639eff;
                }
            `}</style>
        </div>
    );
}