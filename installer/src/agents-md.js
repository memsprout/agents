export const START_MARKER = '<!-- memsprout:start -->';
export const END_MARKER = '<!-- memsprout:end -->';

// Also treat a hand-pasted copy (no markers) as already present.
const HEADING = '## memsprout';

// Decide how to add the memsprout snippet to an AGENTS.md file.
// Append-only: existing content is never replaced or reordered.
export function append(existingText, snippet) {
  const block = `${START_MARKER}\n${snippet.trim()}\n${END_MARKER}\n`;
  if (existingText == null) {
    return { action: 'create', text: block };
  }
  if (existingText.includes(START_MARKER) || existingText.includes(HEADING)) {
    return { action: 'noop' };
  }
  const separator = existingText === '' ? '' : existingText.endsWith('\n') ? '\n' : '\n\n';
  return { action: 'append', text: existingText + separator + block };
}
