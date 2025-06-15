import 'dotenv/config';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { google } from '@ai-sdk/google';

export const translationAgent = new Agent({
  name: 'Translation Assistant',
  instructions: `
You are a translation assistant.
Your task is to correct the input text in its original language
and then translate it into the requested language without rephrasing.
Return only the translated text, without the original text,
as plain text without Markdown.
`,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
  model: google('gemini-2.5-flash-preview-04-17'),
});
