import React from 'react';
import './QuestionLog.css';

/**
 * QuestionLog Component
 * Two panels showing both players' question history (answered + skipped)
 * Both panels are always visible — no PIN lock
 */
export function QuestionLog({ questions, playerNames }) {
  const p1Label = playerNames?.P1 || 'اللاعب الأول';
  const p2Label = playerNames?.P2 || 'اللاعب الثاني';

  // Get all actions a player has taken (answered or skipped)
  const getPlayerActions = (playerId) => {
    const actions = [];
    questions.forEach((q) => {
      const action = (q.playerActions || []).find((a) => a.player === playerId);
      if (action) {
        actions.push({ question: q, action: action.action });
      }
    });
    return actions;
  };

  const p1Actions = getPlayerActions('P1');
  const p2Actions = getPlayerActions('P2');

  const renderList = (actions, isAdmin) => {
    if (actions.length === 0) {
      return <p className="empty-log">لا يوجد سجل بعد</p>;
    }
    return (
      <ul>
        {actions.map(({ question, action }) => (
          <li key={question.id + action} className="log-item">
            <div className="log-question-row">
              <span className="log-question">{question.text}</span>
              <div className="log-meta">
                {isAdmin && question.isImportant && (
                  <span className="important-badge">⚠️</span>
                )}
                <span className={`log-action ${action === 'answered' ? 'answered' : 'skipped'}`}>
                  {action === 'answered' ? 'أجاب ✓' : 'تخطى ✗'}
                </span>
                <span className="log-square">#{question.squareIndex}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="question-log-container" dir="rtl">
      {/* P1 Panel */}
      <div className="log-panel p1-panel">
        <h3 className="log-title">☁️ {p1Label}</h3>
        <div className="questions-answered">
          {renderList(p1Actions, true)}
        </div>
      </div>

      {/* P2 Panel */}
      <div className="log-panel p2-panel">
        <h3 className="log-title">⭐ {p2Label}</h3>
        <div className="questions-answered">
          {renderList(p2Actions, false)}
        </div>
      </div>
    </div>
  );
}