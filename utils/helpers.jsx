export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getLanguageSpeechCode = (language) => {
  const langMap = {
    'Spanish': 'es-ES', 'French': 'fr-FR', 'Japanese': 'ja-JP',
    'Korean': 'ko-KR', 'German': 'de-DE', 'Italian': 'it-IT',
    'English': 'en-US', 'Chinese': 'zh-CN'
  };
  return langMap[language] || 'en-US';
};

export const getLanguageSpeechCodeAlt = (language) => {
  const speechCodes = {
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'German': 'de-DE',
    'Italian': 'it-IT',
    'English': 'en-US',
    'Chinese': 'zh-CN'
  };
  return speechCodes[language] || 'en-US';
};