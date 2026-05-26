// app/api/admin-help/escalate/route.js
// Escalate pertanyaan user ke founder via email + simpan di Firestore.
//
// Email pakai Resend (https://resend.com) — gratis 100 email/hari.
// Setup: RESEND_API_KEY di env vars + verify domain @tulisnoon.app (atau pakai onboarding@resend.dev untuk testing).
//
// Fallback: kalau Resend gak di-set → tetap simpan di Firestore (founder bisa cek manual).

import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';

const FOUNDER_EMAIL = 'nadhif1113@gmail.com';
const FROM_EMAIL = process.env.ESCALATION_FROM_EMAIL || 'onboarding@resend.dev';

async function sendEmailViaResend({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email send. Escalation saved to Firestore only.');
    return { skipped: true };
  }
  const payload = {
    from: `Tulis Noon Admin <${FROM_EMAIL}>`,
    to: [to],
    subject,
    html,
  };
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Resend error:', data);
    return { error: data?.message || 'Email send failed', skipped: false };
  }
  return { id: data.id, skipped: false };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userEmail, userName, userPhotoURL, messages = [], category = 'lainnya', deviceInfo = '' } = body;

    if (!userId || !messages.length) {
      return NextResponse.json({ error: 'userId & messages required' }, { status: 400 });
    }

    // Build last user message + recent context
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '(tidak ada)';
    const lastAdminMsg = [...messages].reverse().find((m) => m.role === 'admin')?.content || '(AI tidak menjawab)';
    const conversationHTML = messages
      .map((m) => {
        const who = m.role === 'admin' ? '🤖 Admin AI' : '👤 User';
        const bg = m.role === 'admin' ? '#f3ebd9' : '#e6f0ec';
        return `<div style="background:${bg};padding:10px 14px;border-radius:10px;margin:6px 0;"><strong>${who}:</strong> ${escapeHtml(String(m.content))}</div>`;
      })
      .join('');

    const timestamp = new Date().toISOString();
    const ticketId = `tn-${userId.slice(0, 8)}-${Date.now()}`;

    // ===== 1. Save to Firestore =====
    let firestoreSaved = false;
    try {
      if (adminFirestore) {
        await adminFirestore.collection('escalations').doc(ticketId).set({
          ticketId,
          userId,
          userEmail: userEmail || null,
          userName: userName || null,
          userPhotoURL: userPhotoURL || null,
          category,
          deviceInfo,
          messages,
          lastUserMsg,
          status: 'open', // open | replied | closed
          createdAt: timestamp,
        });
        firestoreSaved = true;
      }
    } catch (e) {
      console.error('Firestore escalation save failed:', e);
    }

    // ===== 2. Send email to founder =====
    const subject = `[Tulis Noon] Pertanyaan dari ${userName || 'User'} — ${category}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: linear-gradient(135deg, #0a4d3c, #1a6b56); color: white; padding: 24px; border-radius: 16px 16px 0 0;">
          <p style="margin: 0; font-size: 11px; letter-spacing: 2px; opacity: 0.85; text-transform: uppercase;">Tulis Noon — Eskalasi Admin AI</p>
          <h2 style="margin: 6px 0 0 0; font-size: 22px;">Pertanyaan butuh jawaban founder</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.85;">Ticket: <code>${ticketId}</code> · Kategori: <strong>${category}</strong></p>
        </div>
        <div style="background: #faf6ee; padding: 20px; border-radius: 0 0 16px 16px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0a4d3c;">Info User</h3>
          <table style="width: 100%; font-size: 13px; margin-bottom: 18px;">
            <tr><td style="padding: 4px 0; color: #8b6b3d;">Nama:</td><td style="padding: 4px 0;"><strong>${escapeHtml(userName || '-')}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #8b6b3d;">Email:</td><td style="padding: 4px 0;"><strong>${escapeHtml(userEmail || '-')}</strong></td></tr>
            <tr><td style="padding: 4px 0; color: #8b6b3d;">User ID:</td><td style="padding: 4px 0;"><code style="background:#fff;padding:2px 6px;border-radius:4px;">${userId}</code></td></tr>
            <tr><td style="padding: 4px 0; color: #8b6b3d;">Device:</td><td style="padding: 4px 0; font-size: 11px;">${escapeHtml(deviceInfo || '-')}</td></tr>
            <tr><td style="padding: 4px 0; color: #8b6b3d;">Waktu:</td><td style="padding: 4px 0;">${new Date(timestamp).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</td></tr>
          </table>

          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0a4d3c;">Pertanyaan Terakhir</h3>
          <div style="background: white; padding: 14px; border-radius: 10px; border-left: 4px solid #c9a961; margin-bottom: 18px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">${escapeHtml(lastUserMsg)}</p>
          </div>

          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0a4d3c;">Riwayat Percakapan</h3>
          <div>${conversationHTML}</div>

          <div style="margin-top: 24px; padding: 16px; background: rgba(201,169,97,0.15); border-radius: 12px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #8b6b3d;"><strong>📬 Cara balas:</strong></p>
            <p style="margin: 0; font-size: 12px; color: #3d2817; line-height: 1.5;">
              Reply email ini langsung ke user (${escapeHtml(userEmail || 'email user kosong')}), atau buka Firebase Console → escalations/${ticketId} untuk update status.
            </p>
          </div>
        </div>
      </div>
    `;

    const emailResult = await sendEmailViaResend({
      to: FOUNDER_EMAIL,
      subject,
      html,
      replyTo: userEmail || undefined,
    });

    return NextResponse.json({
      ok: true,
      ticketId,
      firestoreSaved,
      emailSent: !emailResult.skipped && !emailResult.error,
      emailSkipped: !!emailResult.skipped,
      emailError: emailResult.error || null,
    });
  } catch (err) {
    console.error('Escalate error:', err);
    return NextResponse.json({ error: 'Server error: ' + (err.message || 'unknown') }, { status: 500 });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
