
import { Mastra } from '@mastra/core';
import { weatherAgent } from './registry/agents/weather-agent';

export const mastra = new Mastra(
    {
        agents: { weatherAgent}
    }
)
        