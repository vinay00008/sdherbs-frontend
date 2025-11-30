import axios from '../api/axiosConfig';

/**
 * Converts text to speech using the backend proxy and plays the audio.
 * @param {string} text - The text to speak.
 * @returns {Promise<void>} - Resolves when audio starts playing.
 */
export const speakText = async (text) => {
    if (!text) return;

    try {
        const response = await axios.post('/voice/speak', { text }, {
            responseType: 'blob', // Important: Expect binary data
        });

        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.play();

        // Optional: Revoke URL after playback to free memory
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
        };

    } catch (error) {
        console.error('TTS Error:', error);
        // Optional: Fallback to browser TTS if backend fails
        // const utterance = new SpeechSynthesisUtterance(text);
        // window.speechSynthesis.speak(utterance);
    }
};
