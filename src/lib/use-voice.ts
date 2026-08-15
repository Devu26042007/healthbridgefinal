import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

export function useVoice(onFinal?: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef(onFinal);
  finalRef.current = onFinal;

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    const Ctor = (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]) as
      | (new () => SpeechRecognitionLike)
      | undefined;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        const alt = e.results[i]?.[0];
        if (alt) text += alt.transcript;
      }
      setTranscript(text);
    };
    rec.onend = () => {
      setListening(false);
      setTranscript((t) => {
        if (t.trim()) finalRef.current?.(t.trim());
        return t;
      });
    };
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => {
      rec.onend = null;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const start = useCallback(() => {
    if (!recRef.current) return;
    setTranscript("");
    try {
      recRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

  return { listening, transcript, supported, start, stop, toggle, setTranscript };
}

export function speak(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
