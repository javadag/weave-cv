import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"
import OpenAI from "openai"
import type { AiProvider } from "~/constants/aiProviders"
import { AI_PROVIDERS } from "~/constants/aiProviders"

interface AiChatOptions {
  provider: AiProvider
  apiKey: string
  systemPrompt: string
  userPrompt: string
  temperature?: number
}

export async function aiChatToJson(options: AiChatOptions): Promise<Record<string, unknown>> {
  const provider = options.provider

  const providerInfo = AI_PROVIDERS[provider]
  if (!providerInfo) {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  switch (provider) {
    case "groq": {
      return groqJsonChat(options, providerInfo.model)
    }
    case "openai":
    case "deepseek":
    case "mistral":
    case "xai": {
      return openaiJsonChat(options, providerInfo.model, providerInfo.baseURL)
    }
    case "perplexity": {
      return perplexityJsonChat(options, providerInfo.model)
    }
    case "anthropic": {
      return anthropicJsonChat(options, providerInfo.model)
    }
    case "gemini": {
      return geminiJsonChat(options, providerInfo.model)
    }
    default: {
      throw new Error(`Unsupported provider: ${provider}`)
    }
  }
}

async function groqJsonChat(options: AiChatOptions, model: string): Promise<Record<string, unknown>> {
  const groq = new Groq({ apiKey: options.apiKey })
  const completion = await groq.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: options.temperature ?? 0,
    messages: [
      { role: "system", content: options.systemPrompt },
      { role: "user", content: options.userPrompt }
    ]
  })
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error("Empty response from model")
  return JSON.parse(raw) as Record<string, unknown>
}

async function openaiJsonChat(
  options: AiChatOptions,
  model: string,
  baseURL?: string
): Promise<Record<string, unknown>> {
  const openai = new OpenAI({ apiKey: options.apiKey, baseURL })
  const completion = await openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: options.temperature ?? 0,
    messages: [
      { role: "system", content: options.systemPrompt },
      { role: "user", content: options.userPrompt }
    ]
  })
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error("Empty response from model")
  return JSON.parse(raw) as Record<string, unknown>
}

async function perplexityJsonChat(options: AiChatOptions, model: string): Promise<Record<string, unknown>> {
  const openai = new OpenAI({ apiKey: options.apiKey, baseURL: "https://api.perplexity.ai" })
  const completion = await openai.chat.completions.create({
    model,
    temperature: options.temperature ?? 0,
    messages: [
      { role: "system", content: options.systemPrompt + "\n\nYou MUST respond with ONLY valid JSON. No markdown, no code fences, no extra text." },
      { role: "user", content: options.userPrompt }
    ]
  })
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error("Empty response from Perplexity")
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "")
  return JSON.parse(cleaned) as Record<string, unknown>
}

async function anthropicJsonChat(options: AiChatOptions, model: string): Promise<Record<string, unknown>> {
  const anthropic = new Anthropic({ apiKey: options.apiKey })
  const completion = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    temperature: options.temperature ?? 0,
    system:
      options.systemPrompt + "\n\nYou MUST respond with ONLY valid JSON. No markdown, no code fences, no extra text.",
    messages: [{ role: "user", content: options.userPrompt }]
  })
  const block = completion.content[0]
  if (!block || block.type !== "text") throw new Error("Empty or unexpected response from Anthropic")
  const raw = block.text.trim()
  const cleaned = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "")
  return JSON.parse(cleaned) as Record<string, unknown>
}

async function geminiJsonChat(options: AiChatOptions, model: string): Promise<Record<string, unknown>> {
  const genAI = new GoogleGenerativeAI(options.apiKey)
  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature: options.temperature ?? 0,
      responseMimeType: "application/json"
    },
    systemInstruction: options.systemPrompt
  })
  const result = await genModel.generateContent(options.userPrompt)
  const raw = result.response.text()
  if (!raw) throw new Error("Empty response from Gemini")
  return JSON.parse(raw) as Record<string, unknown>
}

export { type AiProvider } from "~/constants/aiProviders"
