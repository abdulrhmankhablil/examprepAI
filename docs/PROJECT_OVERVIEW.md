# Project overview

## Product goal

ExamPrep AI helps students convert large study files into clear summaries and exam practice questions. The product focuses on active recall, time saving, and accessibility for digital and scanned material.

## Main workflow

1. Student uploads a study file.
2. Backend extracts text from PDF, image, DOCX, or TXT.
3. Text is cleaned and prepared for analysis.
4. AI generates structured academic study output.
5. Student reviews summaries and practices questions.

## Architecture

```text
React Frontend -> Express API -> Text Extraction -> AI/Demo Analyzer -> JSON Study Pack
```

## Future upgrades

- Authentication and user accounts
- Saved study libraries
- Flashcard export
- Audio summaries
- Diagram generation
- Mobile app
- Course-specific prompt templates
