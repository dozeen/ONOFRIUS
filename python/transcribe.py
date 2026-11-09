#!/usr/bin/env python3
"""
transcribe.py - Trascrizione Vocale con faster-whisper e Controlli Diagnostici Avanzati
"""

import sys
import json
import os
import shutil
import time
import warnings
import logging

warnings.filterwarnings('ignore')
logging.getLogger().setLevel(logging.ERROR)

venv_site_pkgs = [
    os.path.join(os.path.dirname(__file__), '..', '.venv', 'lib', f'python{sys.version_info.major}.{sys.version_info.minor}', 'site-packages'),
    os.path.join(os.path.dirname(__file__), '..', '.venv', 'lib', 'python3.12', 'site-packages'),
    os.path.join(os.path.dirname(__file__), '..', '.venv', 'lib', 'python3.11', 'site-packages'),
    os.path.join(os.path.dirname(__file__), '..', '.venv', 'lib', 'python3.10', 'site-packages'),
    os.path.join(os.getcwd(), '.venv', 'lib', 'python3.12', 'site-packages'),
]
for p in venv_site_pkgs:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

def format_timestamp(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f'{mins:02d}:{secs:02d}'

def transcribe():
    # 1. Controllo Argomenti
    if len(sys.argv) < 2:
        print(json.dumps({
            'status': 'error',
            'error_code': 'NO_AUDIO_ARGUMENT',
            'error': 'Nessun percorso file audio specificato come argomento',
            'transcript': ''
        }, ensure_ascii=False))
        return

    audio_path = sys.argv[1]

    # 2. Controllo Esistenza File Audio
    if not os.path.exists(audio_path):
        print(json.dumps({
            'status': 'error',
            'error_code': 'FILE_NOT_FOUND',
            'error': f'File audio non trovato sul disco: {audio_path}',
            'transcript': ''
        }, ensure_ascii=False))
        return

    # 3. Controllo Dimensione File
    file_size = os.path.getsize(audio_path)
    if file_size < 120:
        print(json.dumps({
            'status': 'error',
            'error_code': 'AUDIO_FILE_EMPTY_OR_CORRUPT',
            'error': f'File audio vuoto o troppo piccolo per contenere stream valido ({file_size} bytes)',
            'file_size': file_size,
            'transcript': ''
        }, ensure_ascii=False))
        return

    # 4. Controllo Dipendenza FFmpeg
    ffmpeg_bin = shutil.which('ffmpeg')
    if not ffmpeg_bin:
        print(json.dumps({
            'status': 'error',
            'error_code': 'FFMPEG_MISSING',
            'error': 'Eseguibile FFmpeg non trovato in PATH. Impossibile decodificare i pacchetti OGG/Opus.',
            'transcript': ''
        }, ensure_ascii=False))
        return

    # 5. Inizializzazione Modello Whisper
    try:
        from faster_whisper import WhisperModel
    except ImportError as imp_err:
        print(json.dumps({
            'status': 'error',
            'error_code': 'FASTER_WHISPER_NOT_INSTALLED',
            'error': f'Modulo faster_whisper non disponibile in Python: {str(imp_err)}',
            'transcript': ''
        }, ensure_ascii=False))
        return

    try:
        # Modello con configurazione ottimizzata CPU/INT8
        model = WhisperModel('small', device='cpu', compute_type='int8')
    except Exception as mod_err:
        print(json.dumps({
            'status': 'error',
            'error_code': 'MODEL_LOAD_FAILED',
            'error': f'Errore caricamento modello Whisper: {str(mod_err)}',
            'transcript': ''
        }, ensure_ascii=False))
        return

    # 6. Esecuzione Trascrizione
    try:
        lang = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != 'auto' else None
        task = sys.argv[3] if len(sys.argv) > 3 else 'transcribe'
        kwargs = {'task': task, 'beam_size': 5}
        if lang:
            kwargs['language'] = lang

        t0 = time.time()
        segments, info = model.transcribe(audio_path, **kwargs)

        full_text = ''
        seg_list = []

        for s in segments:
            text_clean = s.text.strip()
            if text_clean:
                full_text += text_clean + ' '
                seg_list.append({
                    'start': format_timestamp(s.start),
                    'end': format_timestamp(s.end),
                    'text': text_clean,
                    'probability': round(s.avg_logprob, 2)
                })

        duration = round(info.duration, 2) if hasattr(info, 'duration') else 0.0
        detected_lang = info.language if hasattr(info, 'language') else 'it'
        elapsed = round(time.time() - t0, 3)

        result = {
            'status': 'success',
            'transcript': full_text.strip(),
            'language': detected_lang,
            'duration': duration,
            'file_size': file_size,
            'transcribe_time_sec': elapsed,
            'segments': seg_list
        }

        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({
            'status': 'error',
            'error_code': 'TRANSCRIPTION_DECODE_EXCEPTION',
            'error': f'Eccezione durante la decodifica audio: {str(e)}',
            'file_size': file_size,
            'transcript': ''
        }, ensure_ascii=False))

if __name__ == '__main__':
    transcribe()
