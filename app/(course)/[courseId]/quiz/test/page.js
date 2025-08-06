"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { studentReportData } from "@/app/data/test.js";

// HÀM MỚI: Tự động sửa lỗi cú pháp Markdown đơn giản
// Hàm này sẽ tìm các dòng bắt đầu bằng '*' và theo sau là một ký tự không phải khoảng trắng
// và chèn một khoảng trắng vào giữa. Ví dụ: "*Điểm" -> "* Điểm"
const fixMarkdown = (text) => {
  if (typeof text !== 'string') {
    return text;
  }
  // Sử dụng regex để sửa lỗi thiếu khoảng trắng sau dấu * hoặc -
  return text.replace(/^(\s*)\*(\S)/gm, '$1* $2').replace(/^(\s*)\-(\S)/gm, '$1- $2');
};

const initializeExerciseStates = (practiceData) => {
  const initialState = {};
  if (!practiceData || !practiceData.exercise_groups) return initialState;

  practiceData.exercise_groups.forEach(group => {
    (group.exercises || []).forEach(ex => {
      if (ex.exercise_type === 'multiple_choice' && ex.options) {
        initialState[ex.exercise_id] = {
          selected: null,
          submitted: false,
        };
      }
    });
  });
  return initialState;
};

export default function LessonResult() {
  const data = studentReportData.user_response;
  const [exerciseStates, setExerciseStates] = useState(() =>
    initializeExerciseStates(data.practice)
  );

  if (!data) return <p>Không có dữ liệu.</p>;

  const handleAnswerSelect = (exerciseId, optionId) => {
    setExerciseStates(prevStates => ({
      ...prevStates,
      [exerciseId]: { ...prevStates[exerciseId], selected: optionId },
    }));
  };

  const handleSubmit = (exerciseId) => {
    setExerciseStates(prevStates => ({
      ...prevStates,
      [exerciseId]: { ...prevStates[exerciseId], submitted: true },
    }));
  };

  return (
    <main className="result-page">
      <h1>Kết quả học tập</h1>

      {/* Tổng quan */}
      <section>
        <h2>Tổng quan</h2>
        {/* SỬA: Áp dụng hàm fixMarkdown */}
        <ReactMarkdown>{fixMarkdown(data.overview) || "Chưa có tổng quan."}</ReactMarkdown>
      </section>

      {/* Bài giảng */}
      <section>
        <h2>Bài giảng</h2>
        <p className="title">{data.lesson?.lesson_title || "Chưa có tiêu đề bài học"}</p>
        {/* SỬA: Áp dụng hàm fixMarkdown */}
        <ReactMarkdown>{fixMarkdown(data.lesson?.greeting) || "Chưa có lời chào."}</ReactMarkdown>

        <ul>
          {(data.lesson?.learning_objectives || []).map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>

        {(data.lesson?.sections || []).map((sec, i) => (
          <div key={i} className="card">
            <h3>{sec.title || "Chưa có tiêu đề mục"}</h3>
            {/* SỬA: Áp dụng hàm fixMarkdown */}
            <ReactMarkdown>{fixMarkdown(sec.content) || "Chưa có nội dung mục."}</ReactMarkdown>
            <p><strong>Ví dụ:</strong></p>
            <ul>
              {(sec.examples || []).map((ex, j) => <li key={j}>{ex}</li>)}
            </ul>
            <p><strong>Ý chính:</strong></p>
            <ul>
              {(sec.key_points || []).map((kp, j) => <li key={j}>{kp}</li>)}
            </ul>
          </div>
        ))}

        <div>
          <h3>Hoạt động</h3>
          {(data.lesson?.activities || []).map((act, i) => (
            <div key={i} className="card">
              <p><strong>Loại:</strong> {act.activity_type || "Chưa có"}</p>
              <p><strong>Tiêu đề:</strong> {act.title || "Chưa có"}</p>
              <p><strong>Mô tả:</strong> {act.description || "Chưa có"}</p>
              <div>
                <strong>Nội dung:</strong>
                {/* SỬA: Áp dụng hàm fixMarkdown */}
                <ReactMarkdown>{fixMarkdown(act.content) || "Chưa có"}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <p><strong>Kết luận bài giảng:</strong></p>
        {/* SỬA: Áp dụng hàm fixMarkdown */}
        <ReactMarkdown>{fixMarkdown(data.lesson?.conclusion) || "Chưa có kết luận."}</ReactMarkdown>
      </section>

      {/* Luyện tập */}
      <section>
        <h2>Luyện tập</h2>
        {/* SỬA: Áp dụng hàm fixMarkdown */}
        <ReactMarkdown>{fixMarkdown(data.practice?.introduction) || "Chưa có phần giới thiệu luyện tập."}</ReactMarkdown>
        <p><strong>Trọng tâm:</strong> {(data.practice?.focus_areas || []).join(", ") || "Chưa có."}</p>

        {(data.practice?.exercise_groups || []).map((group, i) => (
          <div key={group.group_title + i}>
            <h3>{group.group_title || "Nhóm bài tập"}</h3>
            {group.concept && <p><em>Khái niệm:</em> {group.concept}</p>}
            {(group.exercises || []).map((ex) => {
              if (ex.exercise_type !== 'multiple_choice' || !exerciseStates[ex.exercise_id]) {
                return null;
              }
              const state = exerciseStates[ex.exercise_id];
              const isCorrect = state.selected === ex.correct_answer;
              return (
                <div key={ex.exercise_id} className="card">
                  <p><strong>Câu hỏi:</strong> {ex.question}</p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {(ex.options || []).map((opt) => (
                      <li key={opt.option_id}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${ex.exercise_id}`}
                            value={opt.option_id}
                            checked={state.selected === opt.option_id}
                            disabled={state.submitted}
                            onChange={() => handleAnswerSelect(ex.exercise_id, opt.option_id)}
                          />
                          {" "}{opt.text}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled={state.submitted || state.selected === null}
                    onClick={() => handleSubmit(ex.exercise_id)}
                    style={{ marginTop: "8px", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Nộp bài
                  </button>
                  {state.submitted && (
                    <div style={{ marginTop: "8px" }}>
                      <p style={{ color: isCorrect ? "green" : "red", fontWeight: "bold" }}>
                        {isCorrect ? "Chính xác!" : "Sai rồi!"}
                      </p>
                      <p><strong>Đáp án đúng:</strong> {ex.options.find(o => o.option_id === ex.correct_answer)?.text}</p>
                      {ex.explanation && (
                        <p><strong>Giải thích:</strong> {ex.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Các phần còn lại không cần sửa vì không dùng ReactMarkdown hoặc đã đúng */}
        
        <p><strong>Kết luận luyện tập:</strong></p>
        {/* SỬA: Áp dụng hàm fixMarkdown */}
        <ReactMarkdown>{fixMarkdown(data.practice?.conclusion) || "Chưa có kết luận."}</ReactMarkdown>
      </section>

      {/* Lời động viên */}
      <section>
        <h2>Lời động viên</h2>
        {/* SỬA: Áp dụng hàm fixMarkdown */}
        <ReactMarkdown>{fixMarkdown(data.encouragement) || "Chưa có lời động viên."}</ReactMarkdown>
      </section>

      <style>{`
        /* CSS của bạn giữ nguyên */
        .result-page { font-family: Arial, sans-serif; margin: 20px auto; max-width: 800px; padding: 20px; line-height: 1.6; }
        .result-page h1 { font-size: 28px; color: #2c3e50; }
        .result-page h2 { font-size: 22px; margin-top: 24px; color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 8px; }
        .result-page h3 { font-size: 18px; margin-top: 16px; color: #555; }
        .result-page p { margin: 8px 0; }
        .result-page ul { margin-left: 20px; padding-left: 20px; /* Thêm padding-left để thụt đầu dòng đẹp hơn */ }
        .result-page .card { background: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 16px; margin-top: 12px; }
        strong { color: #1d4ed8; }
        em { color: #16a34a; }
        code { background-color: #eee; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        .title { font-weight: bold; font-size: 18px; }
      `}</style>
    </main>
  );
}