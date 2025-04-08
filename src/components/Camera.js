import React, { useRef, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://vs338bdfg2.execute-api.eu-north-1.amazonaws.com/default/HandGestureBackend";

function Camera({ onPrediction }) {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
      });
  }, []);

  // Capture frames periodically and send to the backend for processing
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        try {
          const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData, sentence: "" })
          });
          const data = await response.json();
          if (data.gesture) {
            // Pass the gesture and updated sentence back to the parent component
            onPrediction(data.gesture, data.sentence);
          }
        } catch (error) {
          console.error("Error predicting gesture:", error);
        }
      }
    }, 2000); // every 2 seconds
    return () => clearInterval(interval);
  }, [onPrediction]);

  return (
    <div>
      <h2>Camera Feed</h2>
      <video 
        ref={videoRef} 
        autoPlay 
        muted
        style={{ width: '640px', height: '480px', border: '1px solid black' }}
      ></video>
    </div>
  );
}

export default Camera;
