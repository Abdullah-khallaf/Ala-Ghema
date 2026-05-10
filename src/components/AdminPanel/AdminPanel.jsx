import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { assignQuestionsToSquares } from '../../utils/boardHelpers';
import './AdminPanel.css';

export function AdminPanel() {
  const { state, setPlayerNames, startGame } = useGameContext();

  const [p1Name, setP1Name] = useState(state.playerNames?.P1 || 'اللاعب الأول');
  const [p2Name, setP2Name] = useState(state.playerNames?.P2 || 'اللاعب الثاني');
  const [questionText, setQuestionText] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [localQuestions, setLocalQuestions] = useState([]);
  const [importantCount, setImportantCount] = useState(0);
  const [error, setError] = useState('');
  const [namesSet, setNamesSet] = useState(false);

  const MAX_QUESTIONS = 20;
  const MAX_IMPORTANT = 5;

  const handleSetNames = () => {
    if (!p1Name.trim() || !p2Name.trim()) {
      setError('الرجاء إدخال أسماء كلا اللاعبين');
      return;
    }
    setPlayerNames({ P1: p1Name.trim(), P2: p2Name.trim() });
    setNamesSet(true);
    setError('');
  };

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      setError('الرجاء إدخال نص السؤال');
      return;
    }
    if (localQuestions.length >= MAX_QUESTIONS) {
      setError(`الحد الأقصى للأسئلة: ${MAX_QUESTIONS}`);
      return;
    }
    if (isImportant && importantCount >= MAX_IMPORTANT) {
      setError(`الحد الأقصى للأسئلة المهمة: ${MAX_IMPORTANT}`);
      return;
    }

    const newQuestion = {
      id: `q_${Date.now()}`,
      text: questionText.trim(),
      isImportant,
      squareIndex: null,
      answeredBy: [],
      playerActions: [],
    };

    setLocalQuestions([...localQuestions, newQuestion]);
    if (isImportant) setImportantCount(importantCount + 1);
    setQuestionText('');
    setIsImportant(false);
    setError('');
  };

  const handleRemoveQuestion = (index) => {
    const question = localQuestions[index];
    if (question.isImportant) setImportantCount(importantCount - 1);
    setLocalQuestions(localQuestions.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (localQuestions.length === 0) {
      setError('أضف سؤالاً واحداً على الأقل');
      return;
    }
    const questionsWithSquares = assignQuestionsToSquares(localQuestions);
    startGame(questionsWithSquares);
  };

  return (
    <div className="admin-panel" dir="rtl">
      <h1 className="admin-title">على غيمة ☁️</h1>
      <p className="admin-subtitle">إعداد اللعبة</p>

      {/* STEP 1: Player Names */}
      {!namesSet ? (
        <div className="admin-section">
          <h2>أسماء اللاعبين</h2>
          <div className="names-input-group">
            <div className="name-input">
              <label>اسم اللاعب الأول ☁️</label>
              <input
                type="text"
                placeholder="أدخل اسم اللاعب الأول"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="text-input"
              />
            </div>
            <div className="name-input">
              <label>اسم اللاعب الثاني ⭐</label>
              <input
                type="text"
                placeholder="أدخل اسم اللاعب الثاني"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="text-input"
              />
            </div>
            <button onClick={handleSetNames} className="btn-primary">
              التالي →
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: Add Questions */
        <div className="admin-section">
          <h2>إضافة الأسئلة</h2>
          <p className="step-info">✓ {p1Name} و {p2Name}</p>

          <p className="question-count">
            {localQuestions.length} / {MAX_QUESTIONS} سؤال
            <span className="important-count">
              ({importantCount} / {MAX_IMPORTANT} مهم ⚠️)
            </span>
          </p>

          <div className="question-input-group">
            <textarea
              placeholder="أدخل نص السؤال..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="question-textarea"
              rows="3"
            />
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  disabled={!isImportant && importantCount >= MAX_IMPORTANT}
                />
                <span>سؤال مهم ⚠️</span>
              </label>
            </div>
            <button onClick={handleAddQuestion} className="btn-secondary">
              + إضافة سؤال
            </button>
          </div>

          {localQuestions.length > 0 && (
            <div className="questions-list">
              <h3>الأسئلة المضافة:</h3>
              <ul>
                {localQuestions.map((q, index) => (
                  <li key={q.id} className="question-item">
                    <div className="question-content">
                      <span className="question-text">{q.text}</span>
                      {q.isImportant && (
                        <span className="important-badge">⚠️ مهم</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(index)}
                      className="btn-remove"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleStartGame}
            disabled={localQuestions.length === 0}
            className="btn-start-game"
          >
            ابدأ اللعبة 🎲
          </button>
        </div>
      )}

      {error && !namesSet && <div className="error-message">{error}</div>}
    </div>
  );
}