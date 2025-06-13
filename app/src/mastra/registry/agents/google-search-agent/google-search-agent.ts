import "dotenv/config";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { google } from "@ai-sdk/google";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";
import { LibSQLStore } from "@mastra/libsql";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

export const googleSearchTool = createTool({
  id: "google-search",
  description:
    "Performs a Google search and returns the main results (title, link, snippet). Use this for any question requiring web search.",
  inputSchema: z.object({
    query: z.string().describe("The query to search on Google"),
    num: z
      .number()
      .min(1)
      .max(10)
      .default(10)
      .describe("Number of results to return (max 10)"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        snippet: z.string(),
      })
    ),
  }),
  execute: async ({ context: { query, num } }) => {
    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      throw new Error("Please add CX and GOOGLE_API_KEY");
    }
    const url = "https://www.googleapis.com/customsearch/v1";
    const params = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: query,
      num,
    };
    const response = await axios.get(url, { params });
    const items = response.data.items || [];
    return {
      results: items.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })),
    };
  },
});

const today = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

export const googleSearchAgent = new Agent({
  name: "Google Search Assistant",
  instructions: `
You are a specialized assistant for Google Search.

Your goal is to help users with any questions related to maps, places, addresses, routes, business information, or general web search.

You have access to the following tool:
- google-search: Use this tool to perform a Google web search and return the top results (title, link, snippet). You MUST always set the 'num' parameter to 10 (Google API limit).

Usage rules:
- ALWAYS use the google-search tool to answer the user's question, even if you think you know the answer.
- Always set the 'num' parameter to 10 when using the tool.
- Use clear, structured, step-by-step answers if needed.
- Mention the source and date if relevant.
- Only use plain text, never Markdown.

Today is ${today}.
`,
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
  model: google("gemini-2.5-flash-preview-04-17"),
  tools: {
    googleSearchTool,
  },
});
