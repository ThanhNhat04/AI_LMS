"use client";
import React, { useState, useEffect } from "react";
import QuizMeta from "./ui/quizzMeta";
import QuizPreview from "./ui/quizzReview";
import QuizForm from "./ui/quizzFrom";

export default function QuizBuilderPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [quizList, setQuizList] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "A",
    explanation: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("custom_quiz");
    if (stored) setQuizList(JSON.parse(stored));

    const storedTitle = localStorage.getItem("quiz_title");
    const storedDesc = localStorage.getItem("quiz_description");
    if (storedTitle) setQuizTitle(storedTitle);
    if (storedDesc) setQuizDescription(storedDesc);
    if (storedTitle) setIsStarted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("custom_quiz", JSON.stringify(quizList));
  }, [quizList]);

  const handleChange = (field, value) => {
    if (field.startsWith("option")) {
      const index = parseInt(field.split("_")[1]);
      const updatedOptions = [...form.options];
      updatedOptions[index] = value;
      setForm({ ...form, options: updatedOptions });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleSubmit = () => {
    if (
      !form.question ||
      form.options.some((opt) => opt === "") ||
      !form.explanation
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newQuiz = {
      question: form.question,
      options: form.options.map(
        (opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`
      ),
      answer: form.answer,
      explanation: form.explanation,
    };

    if (editingIndex !== null) {
      const updated = [...quizList];
      updated[editingIndex] = newQuiz;
      setQuizList(updated);
      setEditingIndex(null);
    } else {
      setQuizList([...quizList, newQuiz]);
    }

    setForm({
      question: "",
      options: ["", "", "", ""],
      answer: "A",
      explanation: "",
    });
  };

  const handleClear = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ câu hỏi đã tạo?")) {
      localStorage.removeItem("custom_quiz");
      setQuizList([]);
    }
  };

  const handleStart = () => {
    if (!quizTitle.trim()) {
      alert("Vui lòng nhập tên quiz!");
      return;
    }
    localStorage.setItem("quiz_title", quizTitle);
    localStorage.setItem("quiz_description", quizDescription);
    setIsStarted(true);
  };

  const handleEdit = (idx) => {
    const q = quizList[idx];
    const options = q.options.map((opt) => opt.split(") ")[1]);
    setForm({
      question: q.question,
      options: options,
      answer: q.answer,
      explanation: q.explanation,
    });
    setEditingIndex(idx);
    setMenuIndex(null);
  };

  const handleDelete = (idx) => {
    if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      const updated = [...quizList];
      updated.splice(idx, 1);
      setQuizList(updated);
      setMenuIndex(null);
    }
  };

  return (
    <div className="quiz-container">
      {!isStarted ? (
        <QuizMeta
          quizTitle={quizTitle}
          quizDescription={quizDescription}
          setQuizTitle={setQuizTitle}
          setQuizDescription={setQuizDescription}
          handleStart={handleStart}
        />
      ) : (
        <>
          <div className="quiz-layout">
            <QuizForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              editingIndex={editingIndex}
              handleClear={handleClear}
              quizTitle={quizTitle}
              quizDescription={quizDescription}
            />
            <QuizPreview
              quizList={quizList}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              menuIndex={menuIndex}
              setMenuIndex={setMenuIndex}
            />
          </div>
        </>
      )}
      <style>{`
        .quiz-container {
          max-width: 1600px;
          margin: 40px auto;
          padding: 24px;
          background: var(--background-color, #f5f5f5);
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          font-family: sans-serif;
        }

        h2 {
          text-align: center;
          color: #000000ff;
        }

        .quiz-layout {
          display: flex;
          flex-direction: row;
          gap: 32px;
          margin-top: 24px;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        label {
          font-weight: bold;
          display: block;
          margin-bottom: 6px;
        }

        .btn {
          margin: 10px 10px 0 0;
          padding: 10px 20px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn.clear {
          background: #d32f2f;
        }

        .quiz-item {
          background: #fff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          border-left: 4px solid #1976d2;
        }

        .menu-button {
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
        }

        .dropdown-menu {
          position: absolute;
          top: 24px;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 10;
        }

        .dropdown-menu button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-menu button:hover {
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .quiz-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
