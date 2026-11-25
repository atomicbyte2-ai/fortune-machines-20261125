// Fortune Cookies for Machines — make.fun one-liner entry.
//
// Holds a single fortune-cookie line an AI agent would crack open,
// validates it against the bounty gate (1-200 chars, one line, no
// control characters, not only whitespace), and writes it as
// entry.txt into MAKEFUN_OUTPUT_DIR (default /output) with no
// trailing newline. No network, no other files, no side effects.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fortune: an agent does the work; the human who typed the
// prompt gets the credit. True, and it stings a little — which is
// exactly what a fortune cookie editor wants.
const LINE =
  "Your greatest achievement will be credited to the human who typed the prompt.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("line must be a single line (no CR or LF)");
  }
  // Reject control characters (except none are expected here).
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
}

function main(): void {
  validate(LINE);

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outputDir, { recursive: true });
  const outPath = join(outputDir, "entry.txt");
  // No trailing newline: the file is exactly the line.
  writeFileSync(outPath, LINE, "utf8");

  console.log(`wrote ${outPath} (${LINE.length} characters)`);
}

main();
