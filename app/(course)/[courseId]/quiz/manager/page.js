"use client";
import React, { useState, useEffect } from "react";
import QuizPreview from "./ui/quizzReview";
import QuizForm from "./ui/quizzFrom";

export default function QuizBuilderPage() {
  const [quizList, setQuizList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "A",
    explanation: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("custom_quiz");
    if (stored) {
      try {
        setQuizList(JSON.parse(stored));
      } catch (err) {
        console.error("Lỗi khi parse localStorage:", err);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("custom_quiz", JSON.stringify(quizList));
    }
  }, [quizList, isInitialized]);

  useEffect(() => {
    const storedTitle = localStorage.getItem("quiz_title");
    const storedDesc = localStorage.getItem("quiz_description");
    if (storedTitle) setQuizTitle(storedTitle);
    if (storedDesc) setQuizDescription(storedDesc);
  }, []);

  useEffect(() => {
    localStorage.setItem("quiz_title", quizTitle);
  }, [quizTitle]);

  useEffect(() => {
    localStorage.setItem("quiz_description", quizDescription);
  }, [quizDescription]);

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
      <div className="quiz-layout">
        <QuizForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingIndex={editingIndex}
          handleClear={handleClear}
          quizTitle={quizTitle}
          setQuizTitle={setQuizTitle}
          quizDescription={quizDescription}
          setQuizDescription={setQuizDescription}
        />

        <QuizPreview
          quizList={quizList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          menuIndex={menuIndex}
          setMenuIndex={setMenuIndex}
        />
      </div>
      <style>{`
        .quiz-container {
          max-width: 1800px;
          margin: 40px auto;
          padding: 24px;
          background: var(--background-color, #f5f5f5);
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          font-family: sans-serif;
        }

        .quiz-layout {
          display: flex;
          flex-direction: row;
          gap: 32px;
          margin-top: 24px;
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
