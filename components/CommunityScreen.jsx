// components/CommunityScreen.jsx
// Fase 3 sosial — feed komunitas: posting + like + komentar.

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Heart, MessageCircle, Send, Trash2, Loader2, Sparkles, Info, AlertCircle, Globe2, Users } from 'lucide-react';
import { createPost, getPosts, toggleLikePost, deletePost, addComment, getComments, validateArabicText, getFriends } from '@/lib/social';

// Hanya izinkan huruf Arab, angka, spasi, tanda baca umum (huruf latin diblok).
const ALLOWED_RE = /[^؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿\s0-9٠-٩.,!?؟،؛:"'()\-]/g;

function Avatar({ emoji, name, size = 40 }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: emoji ? 'rgba(201,169,97,0.15)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
      {emoji ? <span style={{ fontSize: size * 0.5 }}>{emoji}</span> : <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>{(name || '?')[0].toUpperCase()}</span>}
    </div>
  );
}

export default function CommunityScreen({ userId, userProfile, onBack, onHome, onAwardCommentXp, onMarkCommunityRead }) {
  const me = {
    uid: userId,
    name: userProfile?.displayName || 'Pengguna',
    avatarEmoji: userProfile?.avatarEmoji || null,
  };

  const [posts, setPosts] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [visibility, setVisibility] = useState('public'); // 'public' | 'friends'
  const [posting, setPosting] = useState(false);
  const [openComments, setOpenComments] = useState(null); // postId
  const [comments, setComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [postError, setPostError] = useState(null);
  const [commentError, setCommentError] = useState(null);

  const loadPosts = async () => {
    // Ambil friend list dulu untuk filter visibility
    const friends = userId ? await getFriends(userId).catch(() => []) : [];
    const ids = friends.map((f) => f.uid).filter(Boolean);
    setFriendIds(ids);
    const list = await getPosts(30, { currentUserId: userId, friendIds: ids });
    setPosts(list);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
    // Mark community as read saat buka screen → reset unread badge
    if (onMarkCommunityRead) onMarkCommunityRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePost = async () => {
    const text = draft.trim();
    if (!text || posting) return;
    setPosting(true);
    setPostError(null);
    const check = await validateArabicText(text);
    if (!check.valid) {
      setPostError(check.reason || 'Postingan harus bahasa Arab yang bermakna');
      setPosting(false);
      return;
    }
    const res = await createPost(me, text, visibility);
    if (res.success) {
      setDraft('');
      // optimistic prepend
      setPosts((p) => [{
        id: res.id, authorId: me.uid, authorName: me.name, authorAvatar: me.avatarEmoji,
        text, visibility, likes: [], likeCount: 0, commentCount: 0, time: 'baru saja',
      }, ...p]);
    }
    setPosting(false);
  };

  const handleLike = async (post) => {
    const liked = (post.likes || []).includes(userId);
    // optimistic
    setPosts((arr) => arr.map((p) => p.id === post.id ? {
      ...p,
      likes: liked ? p.likes.filter((u) => u !== userId) : [...(p.likes || []), userId],
      likeCount: liked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1,
    } : p));
    await toggleLikePost(post.id, userId, liked);
  };

  const handleDelete = async (postId) => {
    if (!confirm('Hapus postingan ini?')) return;
    setPosts((arr) => arr.filter((p) => p.id !== postId));
    await deletePost(postId);
  };

  const openCommentsFor = async (postId) => {
    if (openComments === postId) { setOpenComments(null); return; }
    setOpenComments(postId);
    setComments([]);
    setCommentLoading(true);
    const list = await getComments(postId);
    setComments(list);
    setCommentLoading(false);
  };

  const handleComment = async (postId) => {
    const text = commentDraft.trim();
    if (!text) return;
    setCommentError(null);
    const check = await validateArabicText(text);
    if (!check.valid) {
      setCommentError(check.reason || 'Komentar harus bahasa Arab yang bermakna');
      return;
    }
    const res = await addComment(postId, me, text);
    if (res.success) {
      setCommentDraft('');
      setComments((c) => [...c, { id: Date.now() + '', authorId: me.uid, authorName: me.name, authorAvatar: me.avatarEmoji, text, time: 'baru saja' }]);
      setPosts((arr) => arr.map((p) => p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p));
      // Award XP — parent handle daily cap & ngasih notifikasi
      if (onAwardCommentXp) onAwardCommentXp();
    }
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Komunitas</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Cerita & Tanya</h2>
        </div>
        {onHome && (
          <button onClick={onHome} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <Home size={18} style={{ color: '#0a4d3c' }} />
          </button>
        )}
      </div>

      {/* Banner aturan */}
      <button onClick={() => setShowRules(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: 'rgba(201,169,97,0.12)' }}>
        <Info size={14} style={{ color: '#a05536' }} className="flex-shrink-0" />
        <p className="text-[11px] text-left flex-1" style={{ color: '#8b6b3d' }}>Komunitas ini <strong>khusus bahasa Arab baku</strong>. Tap untuk baca aturan.</p>
      </button>

      {/* Composer */}
      <div className="rounded-2xl p-4 mb-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
        <div className="flex gap-3">
          <Avatar emoji={me.avatarEmoji} name={me.name} size={40} />
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(e) => { setDraft(e.target.value.replace(ALLOWED_RE, '')); if (postError) setPostError(null); }}
              placeholder="اكتب بالعربية الفصحى..."
              dir="rtl"
              maxLength={500}
              rows={2}
              className="w-full text-base outline-none resize-none"
              style={{ fontFamily: 'Amiri, serif', color: '#1a1a1a', background: 'transparent' }}
            />
            {postError && (
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle size={13} style={{ color: '#c0392b' }} />
                <p className="text-[11px]" style={{ color: '#c0392b' }}>{postError}</p>
              </div>
            )}
            {/* Privacy toggle */}
            <div className="flex items-center gap-1.5 mt-2 mb-1">
              <button
                onClick={() => setVisibility('public')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                style={{
                  background: visibility === 'public' ? 'rgba(10,77,60,0.12)' : 'transparent',
                  color: visibility === 'public' ? '#0a4d3c' : '#8b6b3d',
                  border: visibility === 'public' ? '1px solid rgba(10,77,60,0.3)' : '1px solid rgba(139,107,61,0.2)',
                }}
              >
                <Globe2 size={11} /> Publik
              </button>
              <button
                onClick={() => setVisibility('friends')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                style={{
                  background: visibility === 'friends' ? 'rgba(201,169,97,0.18)' : 'transparent',
                  color: visibility === 'friends' ? '#8b6b3d' : '#8b6b3d',
                  border: visibility === 'friends' ? '1px solid rgba(201,169,97,0.6)' : '1px solid rgba(139,107,61,0.2)',
                }}
              >
                <Users size={11} /> Teman saja
              </button>
              <p className="text-[10px] ml-1" style={{ color: '#a98e5e' }}>
                {visibility === 'public' ? '· dilihat semua' : `· cuma ${friendIds.length} teman`}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px]" style={{ color: '#8b6b3d' }}>{draft.length}/500</span>
              <button
                onClick={handlePost}
                disabled={posting || !draft.trim()}
                className="px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#0a4d3c' }}
              >
                {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Posting
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="py-10 flex justify-center"><Loader2 size={22} className="animate-spin" style={{ color: '#c9a961' }} /></div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(10,77,60,0.04)' }}>
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#0a4d3c' }}>Belum ada postingan</p>
          <p className="text-xs" style={{ color: '#8b6b3d' }}>Jadi yang pertama berbagi cerita ke komunitas!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const liked = (post.likes || []).includes(userId);
            const isMine = post.authorId === userId;
            return (
              <div key={post.id} className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
                <div className="flex items-start gap-3">
                  <Avatar emoji={post.authorAvatar} name={post.authorName} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#0a4d3c' }}>{post.authorName}</p>
                        {post.visibility === 'friends' && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0" style={{ background: 'rgba(201,169,97,0.15)', color: '#8b6b3d' }}>
                            <Users size={9} /> Teman
                          </span>
                        )}
                      </div>
                      {isMine && (
                        <button onClick={() => handleDelete(post.id)} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(192,57,43,0.06)' }}>
                          <Trash2 size={13} style={{ color: '#c0392b' }} />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] mb-1.5" style={{ color: '#8b6b3d' }}>{post.time}</p>
                    <p className="text-base whitespace-pre-wrap" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#1a1a1a' }}>{post.text}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-5 mt-3">
                      <button onClick={() => handleLike(post)} className="flex items-center gap-1.5">
                        <Heart size={16} style={{ color: liked ? '#e0245e' : '#8b6b3d' }} fill={liked ? '#e0245e' : 'none'} />
                        <span className="text-xs" style={{ color: liked ? '#e0245e' : '#8b6b3d' }}>{post.likeCount || 0}</span>
                      </button>
                      <button onClick={() => openCommentsFor(post.id)} className="flex items-center gap-1.5">
                        <MessageCircle size={16} style={{ color: '#8b6b3d' }} />
                        <span className="text-xs" style={{ color: '#8b6b3d' }}>{post.commentCount || 0}</span>
                      </button>
                    </div>

                    {/* Comments */}
                    {openComments === post.id && (
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(10,77,60,0.08)' }}>
                        {commentLoading ? (
                          <div className="py-2 flex justify-center"><Loader2 size={16} className="animate-spin" style={{ color: '#c9a961' }} /></div>
                        ) : (
                          <div className="space-y-2.5 mb-3">
                            {comments.length === 0 && <p className="text-xs" style={{ color: '#8b6b3d' }}>Belum ada komentar. Jadi yang pertama!</p>}
                            {comments.map((c) => (
                              <div key={c.id} className="flex items-start gap-2">
                                <Avatar emoji={c.authorAvatar} name={c.authorName} size={28} />
                                <div className="flex-1 rounded-xl px-3 py-2" style={{ background: 'rgba(10,77,60,0.04)' }}>
                                  <p className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>{c.authorName} <span className="font-normal" style={{ color: '#8b6b3d' }}>· {c.time}</span></p>
                                  <p className="text-sm mt-0.5" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#1a1a1a' }}>{c.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {commentError && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <AlertCircle size={12} style={{ color: '#c0392b' }} />
                            <p className="text-[11px]" style={{ color: '#c0392b' }}>{commentError}</p>
                          </div>
                        )}
                        {/* XP hint untuk dorong komentar */}
                        <div className="flex items-center gap-1 mb-1.5 px-2 py-1 rounded-full inline-flex w-fit" style={{ background: 'rgba(201,169,97,0.12)' }}>
                          <Sparkles size={10} style={{ color: '#c9a961' }} />
                          <p className="text-[10px] font-semibold" style={{ color: '#8b6b3d' }}>+3 XP/komentar (maks 5/hari)</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            value={commentDraft}
                            onChange={(e) => { setCommentDraft(e.target.value.replace(ALLOWED_RE, '')); if (commentError) setCommentError(null); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post.id); }}
                            placeholder="علّق بالعربية..."
                            dir="rtl"
                            maxLength={300}
                            className="flex-1 px-3 py-2 rounded-full text-sm outline-none"
                            style={{ fontFamily: 'Amiri, serif', background: 'rgba(10,77,60,0.05)', border: '1px solid rgba(10,77,60,0.1)', color: '#1a1a1a' }}
                          />
                          <button onClick={() => handleComment(post.id)} disabled={!commentDraft.trim()} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40" style={{ background: '#0a4d3c' }}>
                            <Send size={14} color="white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal aturan komunitas */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-3xl p-5" style={{ background: '#faf6ee' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
              <span style={{ fontFamily: 'Amiri, serif', color: '#fff', fontSize: 24 }}>ن</span>
            </div>
            <h3 className="text-lg font-bold text-center mb-2" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Aturan Komunitas: Arab Baku</h3>
            <div className="space-y-2 mb-4">
              {[
                'Posting & komentar WAJIB pakai bahasa Arab baku (fusha) yang jelas artinya.',
                'Harus bermakna — bukan huruf acak atau asal ketik.',
                'Bahasa lain (latin) otomatis tidak bisa diketik & tidak terkirim.',
                'Tujuannya: melatih nulis & berdiskusi dalam bahasa Arab bareng jamaah lain 🌙',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: '#c9a961' }}>•</span>
                  <p className="text-sm leading-snug" style={{ color: '#3d2817' }}>{t}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowRules(false)} className="w-full py-3 rounded-2xl font-semibold text-white" style={{ background: '#0a4d3c' }}>
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
