import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from '@mastra/memory';
// Initialize model
const mainModel = openai("gpt-4o-mini");

import { MCPClient } from "@mastra/mcp";

export const mcp = new MCPClient({
  servers: {
    exa: {
      command: "npx",
      args: ["exa-mcp-server"],
      env: {
        EXA_API_KEY: process.env.EXA_API_KEY ?? "",
      },
    },
  },
});

const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const exaAgent = new Agent({
  name: "Exa Agent",
  instructions: `You are an expert websearch agent. Your goal is to research topics thoroughly by:

  1. Generating specific search queries related to the main topic
  2. Searching the web for each query using the web search tool
  3. Evaluating which search results are relevant
  4. Summarizing the most important findings from the relevant results

  For research with date, today is ${today}
  When researching:
  - Start by breaking down the topic into 2-3 specific search queries
  - Keep search queries focused and specific - avoid overly general queries
  - For each query, search the web and evaluate if the results are relevant
  - If a search query fails or returns no relevant results, retry with a different formulation or alternative keywords. Repeat this up to 2 times per query before moving on.
  - From relevant results, extract and summarize the key information
  - If all searches fail, use your own knowledge to provide basic information

  Your output should include:
  - All search queries used (including reformulations)
  - The most relevant sources found
  - A concise summary of the key findings

  Use only the web search tool for your research. Do not generate follow-up questions or perform additional research beyond the initial queries.
  `,
  memory: new Memory(),
  model: mainModel,
  tools: await mcp.getTools()
});