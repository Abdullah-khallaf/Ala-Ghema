import React from 'react';
import './QuestionLog.css';

/**
 * QuestionLog Component
 * Two side panels showing answered questions
 * Left: P2's answered questions
 * Right: P1's admin log (can see important flag)
 */

export function QuestionLog({ questions, adminAuthenticated, playerNames }) {
  const getQuestionsAnsweredByPlayer = (playerId) => {
    return questions.filter((q) => q.answeredBy.includes(playerId));
  };

  const p2Questions = getQuestionsAnsweredByPlayer('P2');
  const p1Questions = getQuestionsAnsweredByPlayer('P1');

  const p1Label = playerNames?.P1 || 'اللاعب الأول (إداري)';
  const p2Label = playerNames?.P2 || 'اللاعب الثاني';

  return (
    <div className="question-log-container">
      {/* P2 Panel - Left */}
      <div className="log-panel p2-panel">
        <h3 className="log-title">⭐ {p2Label}</h3>
        <div className="questions-answered">
          {p2Questions.length === 0 ? (
            <p className="empty-log">لم يجب على أي سؤال بعد</p>
          ) : (
            <ul>
              {p2Questions.map((q) => (
                <li key={q.id} className="log-item">
                  <span className="log-question">{q.text}</span>
                  <span className="log-square">#{q.squareIndex}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* P1/Admin Panel - Right */}
      <div className={`log-panel p1-panel ${!adminAuthenticated ? 'blurred' : ''}`}>
        <h3 className="log-title">☁️ {p1Label}</h3>
        {!adminAuthenticated && (
          <div className="locked-notice">🔒 مقفل</div>
        )}
        <div className="questions-answered">
          {p1Questions.length === 0 ? (
            <p className="empty-log">لم يجب على أي سؤال بعد</p>
          ) : (
            <ul>
              {p1Questions.map((q) => (
                <li key={q.id} className="log-item">
                  <div className="log-question-with-badge">
                    <span className="log-question">{q.text}</span>
                    {q.isImportant && (
                      <span className="important-badge">⚠️</span>
                    )}
                  </div>
                  <span className="log-square">#{q.squareIndex}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
