// TeamCard.js
import React from 'react';
import '../styles/TeamCard.css';

function TeamCard({ team, score, onScoreChange }) {
  const handleInput = (e) => {
    onScoreChange(e.target.value);
  };

  return (
    <div className="tc-team-card">
      <div className="tc-team-header">
        <h3>{team.name}</h3>
        <span className="tc-team-tier">{team.tier}</span>
      </div>

      <div className="tc-team-users">
        {team.users.map((user, index) => (
          <div key={index} className="tc-user-info">
            <span className="tc-nickname">{user.nickname}</span>
            <span className="tc-mmr">MMR: {user.mmr}</span>
          </div>
        ))}
      </div>

      <div className="tc-team-average">
        <strong>Team Average MMR:</strong> {
          Math.round(
            team.users.reduce((sum, user) => sum + user.mmr, 0) / team.users.length
          )
        }
      </div>

      <div className="tc-score-input">
        <label htmlFor={`${team.name}-score`}>{team.name} Score</label>
        <input
          id={`${team.name}-score`}
          type="number"
          value={score}
          onChange={handleInput}
          placeholder="Enter score (e.g., 21)"
        />
      </div>
    </div>
  );
}

export default TeamCard;
