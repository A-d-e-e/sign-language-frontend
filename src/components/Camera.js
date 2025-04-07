import React, { useRef, useEffect, useState } from 'react';

function Camera({ onPrediction }) {
  const videoRef = useRef(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const intervalRef = useRef();

  const startPrediction = () => {
    setIsPredicting(true);
    intervalRef.current = setInterval(async () => {
      try {
        // Create a canvas element to capture a frame from the video
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        
        // Convert canvas image to base64 data URL
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Call the AWS Lambda (API Gateway URL)
        const response = await fetch("https://595gkvigtd.execute-api.eu-north-1.amazonaws.com/default/sign-language-backend", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData, sentence: "" }) // You can send current sentence if needed
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        // API Gateway might encapsulate the response body as a JSON string inside data.body
        let result = data;
        if (data.body) {
          result = JSON.parse(data.body);
        }
        if (result.gesture) {
          onPrediction(result.gesture, result.sentence);
        }
      } catch (error) {
        console.error('Prediction error:', error);
      }
    }, 2000); // Every 2 seconds
  };

  const stopPrediction = () => {
    setIsPredicting(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          startPrediction();
        }
      })
      .catch(console.error);

    return () => {
      stopPrediction();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Camera Feed</h2>
      <video 
        ref={videoRef} 
        autoPlay 
        muted
        style={{ width: '640px', height: '480px', border: '1px solid black' }}
      ></video>
      <div>
        <button 
          onClick={isPredicting ? stopPrediction : startPrediction}
          style={{ margin: '10px', padding: '10px 20px' }}
        >
          {isPredicting ? 'Stop Prediction' : 'Start Prediction'}
        </button>
      </div>
    </div>
  );
}

export default Camera;
