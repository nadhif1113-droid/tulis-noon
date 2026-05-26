// app/api/midtrans/snap-token/route.js
// POST endpoint untuk create Midtrans Snap transaction.
// Returns { token, redirect_url, orderId } yang dipakai client buat trigger snap popup.
//
// Body: { packageId, userId, userEmail, userName }
//
// Setelah pembayaran berhasil → Midtrans hit webhook → server top-up koin user.

import { NextResponse } from 'next/server';
import { getPackageById, MIDTRANS_API_BASE } from '@/lib/midtrans';
import { adminFirestore as firestore } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json(
        { error: 'MIDTRANS_SERVER_KEY belum di-set. Tambah di Vercel env vars.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { packageId, userId, userEmail, userName } = body;

    if (!packageId || !userId) {
      return NextResponse.json({ error: 'packageId & userId required' }, { status: 400 });
    }

    const pkg = getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 400 });
    }

    // Unique order ID — userId + timestamp
    const orderId = `tn-${userId.slice(0, 8)}-${Date.now()}`;

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: pkg.price,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: userName || 'Tulis Noon User',
        email: userEmail || 'user@tulis-noon.app',
      },
      item_details: [
        {
          id: pkg.id,
          price: pkg.price,
          quantity: 1,
          name: `${pkg.label} — ${pkg.coins + pkg.bonusCoins} koin`,
          category: 'in-app purchase',
        },
      ],
      // Enable all payment methods including Apple Pay / Google Pay / QRIS / VA Bank / e-wallets
      enabled_payments: [
        // Cards
        'credit_card',
        // Apple Pay / Google Pay (auto-show on supported devices)
        'apple_pay',
        'google_pay',
        // QRIS — Indonesian QR standard
        'other_qris',
        'gopay',
        // E-wallets ID
        'shopeepay',
        'ovo',
        'dana',
        // Virtual Account Bank
        'bca_va',
        'bni_va',
        'bri_va',
        'permata_va',
        'cimb_va',
        'mandiri_va', // echannel mandiri bill payment
        'other_va',
        // Retail
        'indomaret',
        'alfamart',
      ],
      metadata: {
        userId,
        packageId,
        coinsTotal: pkg.coins + pkg.bonusCoins,
      },
    };

    // Auth: HTTP Basic with server key + ":"
    const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

    const res = await fetch(`${MIDTRANS_API_BASE}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Midtrans create error:', data);
      return NextResponse.json(
        { error: data?.error_messages?.[0] || data?.status_message || 'Midtrans error' },
        { status: 500 }
      );
    }

    // Persist pending order ke Firestore — biar webhook bisa cross-check user
    try {
      if (firestore) {
        await firestore.collection('orders').doc(orderId).set({
          orderId,
          userId,
          packageId,
          coinsTotal: pkg.coins + pkg.bonusCoins,
          amount: pkg.price,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('Order persist failed (non-blocking):', e);
    }

    return NextResponse.json({
      token: data.token,
      redirect_url: data.redirect_url,
      orderId,
    });
  } catch (err) {
    console.error('Snap token error:', err);
    return NextResponse.json(
      { error: 'Server error: ' + (err.message || 'unknown') },
      { status: 500 }
    );
  }
}
