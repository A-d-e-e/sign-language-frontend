import React from 'react';

function SentenceDisplay({ sentence, onReset }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Current Sentence:</h2>
      <p style={{ 
          fontSize: '24px', 
          border: '1px solid #ccc', 
          padding: '10px', 
          minHeight: '50px',
          width: '80%',
          margin: 'auto'
        }}>
        {sentence}
      </p>
      <button 
        onClick={onReset} 
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Clear Sentence
      </button>
    </div>
  );
}
export default SentenceDisplay;