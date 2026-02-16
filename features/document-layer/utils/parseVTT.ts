import type { TranscriptEntry } from '../types';

// Parse WebVTT format into structured transcript entries
export function parseVTT(vttContent: string): TranscriptEntry[] {
  const entries: TranscriptEntry[] = [];
  const blocks = vttContent.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;

    // Find the timestamp line (format: 00:00:01.000 --> 00:00:05.000)
    const timestampLine = lines.find(l => l.includes('-->'));
    if (!timestampLine) continue;

    const [startStr, endStr] = timestampLine.split('-->').map(s => s.trim());
    const startTime = parseTimestamp(startStr);
    const endTime = parseTimestamp(endStr);

    // Text is everything after the timestamp line
    const tsIdx = lines.indexOf(timestampLine);
    const textLines = lines.slice(tsIdx + 1).filter(l => l.trim());
    const fullText = textLines.join(' ').trim();

    if (!fullText) continue;

    // Extract speaker if prefixed with "<v SpeakerName>" or "Speaker:"
    let speaker = 'Unknown';
    let text = fullText;

    const vMatch = fullText.match(/^<v\s+([^>]+)>(.*)/);
    if (vMatch) {
      speaker = vMatch[1].trim();
      text = vMatch[2].replace(/<\/v>/, '').trim();
    } else {
      const colonMatch = fullText.match(/^([A-Za-z\s]+):\s*(.*)/);
      if (colonMatch && colonMatch[1].length < 30) {
        speaker = colonMatch[1].trim();
        text = colonMatch[2].trim();
      }
    }

    entries.push({ speaker, startTime, endTime, text });
  }

  return entries;
}

function parseTimestamp(ts: string): number {
  const parts = ts.replace(',', '.').split(':');
  if (parts.length === 3) {
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  }
  if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return 0;
}
