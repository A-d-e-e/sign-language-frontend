import React, { useState } from 'react';
import Camera from './components/Camera';
import SentenceDisplay from './components/SentenceDisplay';

function App() {
  const [sentence, setSentence] = useState("");

  const handleReset = () => {
    setSentence("");
  };

  const handlePrediction = (gesture, newSentence) => {
    setSentence(newSentence);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Hand Gesture Translation App</h1>
      <SentenceDisplay 
        sentence={sentence} 
        onReset={handleReset} 
      />
      <Camera onPrediction={handlePrediction} />
    </div>
  );
}
export default App;