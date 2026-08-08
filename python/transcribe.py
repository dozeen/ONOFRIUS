import sys
import json
import os

def format_timestamp(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{mins:02d}:{secs:02d}"

def transcribe():
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "error": "No audio file provided", "transcript": ""}))
        return

    audio_path = sys.argv[1]

    try:
        from faster_whisper import WhisperModel
        model = WhisperModel("small", device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, language="it")

        full_text = ""
        seg_list = []

        for s in segments:
            text_clean = s.text.strip()
            if text_clean:
                full_text += text_clean + " "
                seg_list.append({
                    "start": format_timestamp(s.start),
                    "end": format_timestamp(s.end),
                    "text": text_clean,
                    "probability": round(s.avg_logprob, 2)
                })

        result = {
            "status": "success",
            "transcript": full_text.strip(),
            "language": info.language if hasattr(info, 'language') else "it",
            "duration": round(info.duration, 2) if hasattr(info, 'duration') else 0.0,
            "segments": seg_list
        }

        print(json.dumps(result))

    except Exception as e:
        # Fallback se non c'è GPU o errore import
        print(json.dumps({"status": "error", "error": str(e), "transcript": ""}))

if __name__ == "__main__":
    transcribe()
