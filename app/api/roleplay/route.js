// app/api/roleplay/route.js
// POST endpoint untuk AI Roleplay — call Claude Haiku dengan system prompt Hijazi.
// API key (ANTHROPIC_API_KEY) di .env.local lokal & Vercel env vars (server-only, ga di-expose ke client).

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { buildRoleplayPrompt, buildGradingPrompt } from '@/lib/roleplay-prompts';

// Pakai Haiku 4.5 — murah, cepat, cukup bagus untuk Hijazi Arabic.
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400; // per response — short conversational turns

// Rate limit minimal: max 30 request per user per 5 menit (in-memory, soft limit).
const rateLimitMap = new Map(); // userId → { count, resetAt }
const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 menit
const RATE_LIMIT = 30;

function checkRateLimit(userId) {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set');
      return NextResponse.json(
        { error: 'AI Roleplay belum dikonfigurasi. Hubungi admin.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { scenarioId, messages = [], action = 'chat', userId } = body;

    if (!scenarioId) {
      return NextResponse.json({ error: 'scenarioId required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId required (untuk rate limit)' }, { status: 400 });
    }

    // Rate limit check
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Terlalu banyak request. Coba lagi 5 menit lagi.' },
        { status: 429 }
      );
    }

    // Validate messages format
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages harus array' }, { status: 400 });
    }
    if (messages.length > 25) {
      return NextResponse.json({ error: 'Conversation terlalu panjang' }, { status: 400 });
    }

    const anthropic = new Anthropic({ apiKey });

    if (action === 'grade') {
      // Final grading call — return JSON grade
      const { system, messages: gradeMessages } = buildGradingPrompt(scenarioId, messages);
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 600,
        system,
        messages: gradeMessages,
      });

      const text = response.content?.[0]?.text || '';
      let grade;
      try {
        // Strip markdown wrapper kalau ada (kadang model masih kasih ```json)
        const cleaned = text.replace(/```json\s*|\s*```/g, '').trim();
        grade = JSON.parse(cleaned);
      } catch (e) {
        console.error('Failed to parse grade JSON:', text);
        // Fallback grade
        grade = {
          grade: 'Jayyid',
          score: 75,
          feedback_id: 'Bagus! Lanjutkan latihanmu.',
          vocab_learned: [],
          vocab_to_practice: [],
          achievement_hijazi: 'ما شاء الله! (Masya Allah!)',
        };
      }

      return NextResponse.json({ grade });
    }

    // Default: regular chat turn
    const { system, messages: chatMessages } = buildRoleplayPrompt(scenarioId, messages);

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: chatMessages,
    });

    const reply = response.content?.[0]?.text || '';

    // Parse [USER_TRANSLATED] block kalau ada — terjemahan apa yang user mau
    // omongin kalau pakai bahasa Arab. Block-nya dihapus dari AI reply, lalu
    // dikirim balik sbg `userTranslation` supaya frontend bisa attach ke user bubble.
    let userTranslation = null;
    const translatedMatch = reply.match(/\[USER_TRANSLATED\]([\s\S]*?)\[\/USER_TRANSLATED\]/);
    if (translatedMatch) {
      const inside = translatedMatch[1].trim();
      const lines = inside.split('\n').map((l) => l.trim()).filter((l) => l);
      // Line 1 harus Arabic (cek char), line 2 Latin
      const arabic = lines.find((l) => /[؀-ۿ]/.test(l));
      const latin = lines.find((l) => !/[؀-ۿ]/.test(l));
      if (arabic && latin) {
        userTranslation = { arabic, latin };
      }
    }

    // Detect end token
    const endDetected = reply.includes('[END_SCENARIO]');
    // Strip [USER_TRANSLATED] block + [END_SCENARIO] token dari reply
    const cleanReply = reply
      .replace(/\[USER_TRANSLATED\][\s\S]*?\[\/USER_TRANSLATED\]/, '')
      .replace('[END_SCENARIO]', '')
      .trim();

    return NextResponse.json({
      reply: cleanReply,
      userTranslation, // null kalau user pakai Arabic, atau {arabic, latin} kalau Indo/English
      endScenario: endDetected,
      usage: response.usage, // untuk debug cost
    });
  } catch (error) {
    console.error('Roleplay API error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Internal error',
        // Hint untuk debug Anthropic-specific errors
        type: error?.error?.type || error?.type || 'unknown',
      },
      { status: 500 }
    );
  }
}
