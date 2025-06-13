// MatchInput.js
import React, { useState } from 'react';
import TeamCard from './TeamCard';
import '../styles/MatchInput.css';

function MatchInput() {
  const [step, setStep] = useState('input'); // 'input' | 'summary' | 'rankings' | 'history'
  const [matchType, setMatchType] = useState('singles');
  const [teamAScore, setTeamAScore] = useState('');
  const [teamBScore, setTeamBScore] = useState('');

  const teamA = {
    name: 'Team A',
    tier: 'Silver 3',
    users: [
      { nickname: 'Carol Davis', mmr: 1320 }
    ]
  };

  const teamB = {
    name: 'Team B',
    tier: 'Silver 2',
    users: [
      { nickname: 'Alice Johnson', mmr: 1250 }
    ]
  };

  const handleSubmit = () => {
    if (teamAScore === '' || teamBScore === '') {
      alert('Please enter scores for both teams.');
      return;
    }
    // Send to backend: { teamAScore, teamBScore, matchType, teamA.users, teamB.users }
    console.log('Submitted:', { teamAScore, teamBScore });
    setStep('summary');
  };

  const renderTabs = () => (
    <div className="tab-menu">
      <button className={step === 'input' ? 'active' : ''} onClick={() => setStep('input')}>🏆 Match Input</button>
      <button className={step === 'summary' ? 'active' : ''} onClick={() => setStep('summary')}>⭕ Result Summary</button>
      <button className={step === 'rankings' ? 'active' : ''} onClick={() => setStep('rankings')}>🥇 Rankings</button>
      <button className={step === 'history' ? 'active' : ''} onClick={() => setStep('history')}>⏱ Match History</button>
    </div>
  );

  const renderContent = () => {
    if (step === 'input') {
      return (
        <>
          <h2>Match Result Entry</h2>
          <p>Enter individual team scores after the match ends</p>

          <div className="match-type-selector">
            <label htmlFor="matchType">Match Type</label>
            <select
              id="matchType"
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
            >
              <option value="singles">Singles (1v1)</option>
              <option value="doubles">Doubles (2v2)</option>
            </select>
          </div>

          <div className="team-card-container">
            <TeamCard
              team={teamA}
              score={teamAScore}
              onScoreChange={setTeamAScore}
            />
            <TeamCard
              team={teamB}
              score={teamBScore}
              onScoreChange={setTeamBScore}
            />
          </div>

          <button className="mi-submit-btn" onClick={handleSubmit}>Submit Match Result</button>
        </>
      );
    } else if (step === 'summary') {
      return <div className="mi-result-summary">✅ Match Submitted! Team A: {teamAScore}, Team B: {teamBScore}</div>;
    } else if (step === 'rankings') {
      return <div className="mi-rankings">🏅 Player Rankings (Coming Soon)</div>;
    } else if (step === 'history') {
      return <div className="mi-match-history">📜 Match History (Coming Soon)</div>;
    }
    return null;
  };

  return (
    <div className="mi-match-input-wrapper">
      {renderTabs()}
      {renderContent()}
    </div>
  );
}

export default MatchInput;
