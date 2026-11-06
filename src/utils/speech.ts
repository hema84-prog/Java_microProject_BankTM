import { Language } from '../types';

export const speakText = (text: string, language: Language = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map application language to speech voice tags
    const langCodes: Record<Language, string> = {
      en: 'en-IN',
      kn: 'kn-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ml: 'ml-IN',
    };

    utterance.lang = langCodes[language] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try to find a matched voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
