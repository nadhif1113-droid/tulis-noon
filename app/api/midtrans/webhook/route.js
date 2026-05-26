// app/api/midtrans/webhook/route.js
// Webhook endpoint untuk notifikasi pembayaran dari Midtrans.
// Midtrans bakal hit endpoint ini setelah transaksi selesai (success/failure/pending).
//
// Setup di Midtrans Dashboard:
//   Settings → Configuration → Payment Notification URL:
//   https://tulis-noon.vercel.app/api/midtrans/webhook
//
// Security: verify signature pakai SHA512(orderId + statusCode + grossAmount + ServerKey)

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminFirestore as firestore } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
const FieldValue = admin.firestore.FieldValue;

function verifySignature(orderId, statusCode, grossAmount, serverKey, providedSignature) {
  const raw = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash('sha512').update(raw).digest('hex');
  return hash === providedSignature;
}

export async function POST(request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error('Webhook: MIDTRANS_SERVER_KEY not set');
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const notification = await request.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
      payment_type,
    } = notification;

    // Verify signature
    if (!verifySignature(order_id, status_code, gross_amount, serverKey, signature_key)) {
      console.error('Webhook: invalid signature for order', order_id);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    if (!firestore) {
      console.error('Webhook: firestore admin not configured');
      return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
    }

    // Lookup order
    const orderRef = firestore.collection('orders').doc(order_id);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      console.error('Webhook: order not found:', order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderSnap.data();

    // Idempotency: kalau sudah credited, skip
    if (order.status === 'paid') {
      console.log('Webhook: already credited:', order_id);
      return NextResponse.json({ ok: true, message: 'Already credited' });
    }

    // Tentukan status
    let newStatus = order.status;
    const isSuccess =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement';
    const isPending = transaction_status === 'pending';
    const isFailed = ['cancel', 'deny', 'expire', 'failure'].includes(transaction_status);

    if (isSuccess) newStatus = 'paid';
    else if (isPending) newStatus = 'pending';
    else if (isFailed) newStatus = 'failed';

    // Top up koin kalau success
    if (isSuccess) {
      const userRef = firestore.collection('users').doc(order.userId);
      await userRef.update({
        coins: FieldValue.increment(order.coinsTotal),
        lastTopUpAt: new Date().toISOString(),
      });
      console.log(`Webhook: credited ${order.coinsTotal} koin to user ${order.userId}`);
    }

    await orderRef.update({
      status: newStatus,
      paymentType: payment_type || null,
      midtransStatus: transaction_status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Server error: ' + (err.message || 'unknown') },
      { status: 500 }
    );
  }
}
