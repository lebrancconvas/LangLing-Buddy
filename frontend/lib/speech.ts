type SpeechCallback = (text: string) => void;
type ErrorCallback = (error: string) => void;

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  onResult: SpeechCallback | null = null;
  onError: ErrorCallback | null = null;
  onEnd: (() => void) | null = null;

  constructor() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal && this.onResult) {
        this.onResult(last[0].transcript);
      }
    };

    this.recognition.onerror = (event) => {
      this.onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd?.();
    };
  }

  get available() {
    return this.recognition !== null;
  }

  setLanguage(lang: string) {
    if (this.recognition) this.recognition.lang = lang;
  }

  startListening() {
    if (!this.recognition || this.isListening) return;
    this.isListening = true;
    this.recognition.start();
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;
    this.recognition.stop();
    this.isListening = false;
  }
}

export class SpeechSynthesisService {
  speak(text: string, lang = "en-US") {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (match) utterance.voice = match;

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined") return [];
    return window.speechSynthesis?.getVoices() ?? [];
  }
}

export const sttService = new SpeechRecognitionService();
export const ttsService = new SpeechSynthesisService();
