import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Polyfill type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal && onTranscript) {
          onTranscript(transcriptText);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
             toast({
                title: "Voice Captured",
                description: `"${transcript}"`,
             })
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast({
              variant: "destructive",
              title: "Voice Error",
              description: "Could not capture audio. Check permissions."
          })
      }
    }
  }, [onTranscript, toast, transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!recognitionRef.current) {
    return null; // Browser not supported
  }

  return (
    <div className="relative">
      <Button
        size="icon"
        variant={isListening ? "destructive" : "default"}
        onClick={toggleListening}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          isListening ? "animate-pulse scale-110" : "hover:scale-105"
        }`}
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      {isListening && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
          Listening...
        </div>
      )}
    </div>
  );
}
