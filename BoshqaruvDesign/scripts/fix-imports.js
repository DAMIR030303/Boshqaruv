// Fix versioned import specifiers and motion/react across src
// Example: "lucide-react@0.487.0" -> "lucide-react"
//          "@radix-ui/react-dialog@1.1.6" -> "@radix-ui/react-dialog"
//          "motion/react" -> "framer-motion"

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');

/**
 * Recursively walk a directory and collect files matching extensions
 */
function listFiles(dir, exts, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, exts, out);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.includes(ext)) out.push(full);
    }
  }
  return out;
}

const files = listFiles(root, ['.ts', '.tsx']);

let changedCount = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let updated = original;

  // Replace motion/react -> framer-motion
  updated = updated.replace(/(['"])motion\/react\1/g, '$1framer-motion$1');

  // Remove trailing @version from import specifiers inside string literals
  // Matches 'module@1.2.3' or "@scope/module@1.2.3-alpha" etc.
  updated = updated.replace(/(['"])((?:@[^\/'"\n]+\/)?[^'"\n@]+)@\d[^'"\n]*\1/g, '$1$2$1');

  // Also normalize known modules that might have been missed by the generic rule
  const directPairs = [
    ['sonner@', 'sonner'],
    ['class-variance-authority@', 'class-variance-authority'],
    ['lucide-react@', 'lucide-react'],
    ['react-day-picker@', 'react-day-picker'],
    ['embla-carousel-react@', 'embla-carousel-react'],
    ['react-resizable-panels@', 'react-resizable-panels'],
    ['recharts@', 'recharts'],
    ['cmdk@', 'cmdk'],
    ['input-otp@', 'input-otp'],
    ['vaul@', 'vaul'],
    ['react-hook-form@', 'react-hook-form'],
  ];
  for (const [from, to] of directPairs) {
    const re = new RegExp(`(['"])${from.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^'"\n]*)\\1`, 'g');
    updated = updated.replace(re, `$1${to}$1`);
  }

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    changedCount++;
  }
}

console.log(`fix-imports: processed ${files.length} files, changed ${changedCount}`);


