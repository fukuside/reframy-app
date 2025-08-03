import React, { useState } from 'react';

const SpeechInput = ({ onResult }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const handleSpeech = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('このブラウザは音声認識に対応していません。');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ja-JP'; // 日本語
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onerror = (event) => {
      setListening(false);
      setError(`エラー: ${event.error}`);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) {
        onResult(transcript);
      }
    };

    recognition.start();
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={handleSpeech} disabled={listening}>
        {listening ? '音声認識中...' : '🎤 音声入力'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SpeechInput;
