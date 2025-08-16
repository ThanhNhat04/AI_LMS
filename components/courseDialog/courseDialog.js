"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { IconXMark } from "../../public/svg/index.js";
import {getCourseImageUrl} from "@/lib/api.js";

const CourseDialog = ({ open, handleClose, course }) => {
  const router = useRouter();
  
  const [role, setRole] = useState(null);
  useEffect(() => {
    const checkRole = localStorage.getItem("role");
    setRole(checkRole);
  }, []);

  if (!open) return null;

  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  const handleGoToLesson = () => {
    if (!isLoggedIn()) {
      alert("Bạn cần đăng nhập để truy cập bài học.");
      router.push(`auth/login?redirect=/${course.id}`);
    } else {
      router.push(`/${course.id}`);
    }
    handleClose();
  };

  const handleGoToQuiz = () => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để truy cập quiz.");
      router.push(`auth/login?redirect=/${course.id}/quiz`);
    } else {
      router.push(`${course.id}/quiz`);
      handleClose();
    }
  };

  const handletoManager = () => {
    if (!isLoggedIn()) {
      alert("Bạn cần đăng nhập để truy cập quản lý quizz");
      router.push(`auth/login?redirect=/${course.id}/manager`);
    } else {
      router.push(`/${course.id}/quiz/manager`);
      handleClose();
    }
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
            <button className="dialog-btn" onClick={handleGoToLesson}>
              Bài học
            </button>
            <button className="dialog-btn" onClick={handleGoToQuiz}>
              Quizz
            </button>
            {role === "teacher" && (
              <button className="dialog-btn" onClick={handletoManager}>
                Tạo Quizz
              </button>
            )}
          </div>
        </div>
      </div>
      <style> {`
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
      
      `}
      </style>
    </div>
  );
};

export default CourseDialog