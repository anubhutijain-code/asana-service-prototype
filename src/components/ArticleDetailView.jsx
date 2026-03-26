// ─── ArticleDetailView — Asana Notes–style document viewer ───────────────────

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from './ui/Avatar';
import { KB_ARTICLES, KB_DRAFTS, KB_PROJECTS, formatDate } from '../data/knowledgeBase';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", "SF Pro Text", -apple-system, sans-serif';

// ─── Icons ─────────────────────────────────────────────────────────────────────

function DocIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
      <rect x="2" y="1" width="10" height="14" rx="2" fill="var(--background-strong)" stroke="var(--border-strong)" strokeWidth="1"/>
      <path d="M5 5h6M5 8h6M5 11h4" stroke="var(--text-disabled)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.6 3.3 3.6.5-2.6 2.6.6 3.6L8 10.3l-3.2 1.7.6-3.6L2.8 5.8l3.6-.5L8 2z"/>
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
      <circle cx="4" cy="8" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="12" cy="8" r="1.2"/>
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 3L5 8l5 5"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="10" height="8" rx="1.5"/>
      <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
    </svg>
  );
}

function BoldIcon()   { return <span style={{ fontWeight: 700, fontSize: 12, fontFamily: SFT, lineHeight: 1 }}>B</span>; }
function ItalicIcon() { return <span style={{ fontStyle: 'italic', fontSize: 12, fontFamily: SFT, lineHeight: 1 }}>I</span>; }
function UnderlineIcon() { return <span style={{ textDecoration: 'underline', fontSize: 12, fontFamily: SFT, lineHeight: 1 }}>U</span>; }
function StrikeIcon() { return <span style={{ textDecoration: 'line-through', fontSize: 12, fontFamily: SFT, lineHeight: 1 }}>S</span>; }

function CodeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4L1 8l4 4M11 4l4 4-4 4"/>
    </svg>
  );
}

function BulletIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="3" cy="5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="3" cy="9" r="1" fill="currentColor" stroke="none"/>
      <path d="M6 5h8M6 9h8"/>
    </svg>
  );
}

function NumberedIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 3h2v6H2M2 9h2" strokeWidth="1.2"/>
      <path d="M6 5h8M6 9h8" strokeWidth="1.4"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 9a3 3 0 0 0 4.24.03l2-2a3 3 0 0 0-4.24-4.24l-1.15 1.15"/>
      <path d="M9 7a3 3 0 0 0-4.24-.03L2.76 8.97a3 3 0 0 0 4.24 4.24l1.14-1.15"/>
    </svg>
  );
}

function AtIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="8" cy="8" r="3"/>
      <path d="M11 8c0 2 .8 3 2 3"/>
      <path d="M13 5a6 6 0 1 0-1.5 8"/>
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 2H2v2M12 2h2v2M4 14H2v-2M12 14h2v-2"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2H2v10h10V9M8 2h4v4M12 2L6 8"/>
    </svg>
  );
}

// ─── Toolbar button ────────────────────────────────────────────────────────────

function TBtn({ children, label }) {
  return (
    <button
      type="button"
      title={label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5,
        border: 'none', background: 'transparent', cursor: 'pointer',
        color: 'var(--text-weak)', transition: 'background 0.1s, color 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
    >
      {children}
    </button>
  );
}

function TDivider() {
  return <span style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0, margin: '0 4px' }} />;
}

// ─── Content block renderer ────────────────────────────────────────────────────

function ContentBlocks({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  // Group consecutive 'li' blocks together
  const elements = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === 'li') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'li') {
        items.push(blocks[i].text);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '0 0 16px', paddingLeft: 24, listStyleType: 'disc' }}>
          {items.map((text, j) => (
            <li key={j} style={{ fontFamily: SFT, fontSize: 15, color: 'var(--text)', lineHeight: '26px' }}>
              {text}
            </li>
          ))}
        </ul>
      );
    } else {
      switch (block.type) {
        case 'h2':
          elements.push(
            <h2 key={i} style={{ fontFamily: SFD, fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: '28px 0 10px', lineHeight: '28px' }}>
              {block.text}
            </h2>
          );
          break;
        case 'p':
          elements.push(
            <p key={i} style={{ fontFamily: SFT, fontSize: 15, color: 'var(--text)', lineHeight: '26px', margin: '0 0 16px' }}>
              {block.text}
            </p>
          );
          break;
        case 'link':
          elements.push(
            <p key={i} style={{ margin: '0 0 16px' }}>
              <a
                href="#"
                onClick={e => e.preventDefault()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: SFT, fontSize: 14, color: 'var(--selected-text)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                <ExternalLinkIcon />
                {block.text}
              </a>
            </p>
          );
          break;
        default:
          break;
      }
      i++;
    }
  }
  return <>{elements}</>;
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ArticleDetailView({ role }) {
  const { projectId, articleId } = useParams();
  const navigate = useNavigate();

  const article = KB_ARTICLES.find(a => a.id === articleId && a.projectId === projectId);
  const draft = !article ? KB_DRAFTS.find(d => d.id === articleId && d.projectId === projectId) : null;
  const doc = article ?? (draft ? { ...draft, status: 'Draft', author: 'AI Generated', updatedAt: draft.generatedAt?.slice(0, 10) } : null);
  const project = KB_PROJECTS.find(p => p.id === projectId);

  const [starred, setStarred] = useState(false);
  const [published, setPublished] = useState(false);
  const isAdmin = role === 'admin' || role === 'admin2';
  const hasContent = doc?.content?.length > 0;
  const isDraft = !!draft && !published;

  // Fake collaborators using article author + a couple extras
  const collaborators = doc
    ? [doc.author, 'Sarah Lin', 'James Carter'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)
    : [];

  if (!doc) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
        <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text-weak)' }}>Article not found.</p>
        <button
          type="button"
          onClick={() => navigate(`/knowledge-base/${projectId}`)}
          style={{ fontFamily: SFT, fontSize: 13, color: 'var(--selected-text)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Back to knowledge base
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--background-weak)' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 48, borderBottom: '1px solid var(--border)',
        background: 'var(--background-weak)',
      }}>
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`/knowledge-base/${projectId}`)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, height: 28,
            padding: '0 8px', borderRadius: 6, border: 'none', background: 'transparent',
            color: 'var(--text-weak)', cursor: 'pointer', fontFamily: SFT, fontSize: 12,
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
        >
          <ChevronLeftIcon />
          {project?.name ?? 'Knowledge base'}
        </button>

        <span style={{ color: 'var(--border-strong)', fontSize: 14 }}>/</span>

        {/* Doc icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          <DocIcon />
          <span style={{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.title}
          </span>
          {isDraft && (
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT, background: 'var(--selected-background)', color: 'var(--selected-text)' }}>
              AI Draft
            </span>
          )}
          {published && (
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT, background: 'var(--success-background)', color: 'var(--success-text)' }}>
              Published
            </span>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Collaborator avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collaborators.map((name, i) => (
              <div key={name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: collaborators.length - i }}>
                <Avatar name={name} size={22} />
              </div>
            ))}
          </div>

          {isDraft ? (
            /* Draft mode — publish CTA */
            <button
              type="button"
              onClick={() => setPublished(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 12px', borderRadius: 6,
                border: 'none', background: 'var(--selected-background-strong)',
                fontFamily: SFT, fontSize: 12, fontWeight: 500, color: '#fff',
                cursor: 'pointer', transition: 'opacity 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Publish article
            </button>
          ) : (
            <>
              {/* Share */}
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 28, padding: '0 10px', borderRadius: 6,
                  border: '1px solid var(--border)', background: 'transparent',
                  fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <LockIcon />
                Share
              </button>

              {/* Star */}
              <button
                type="button"
                onClick={() => setStarred(s => !s)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  color: starred ? '#f59e0b' : 'var(--text-disabled)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <StarIcon filled={starred} />
              </button>

              {/* More */}
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer', color: 'var(--text-disabled)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
              >
                <MoreIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Toolbar (admin only) ────────────────────────────────────────── */}
      {isAdmin && (
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2,
          padding: '0 20px', height: 40, borderBottom: '1px solid var(--border)',
          background: 'var(--background-weak)',
        }}>
          {/* + insert */}
          <TBtn label="Insert block">
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 1v12M1 7h12"/>
            </svg>
          </TBtn>

          <TDivider />

          {/* Paragraph style dropdown */}
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              height: 26, padding: '0 8px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
          >
            Paragraph
            <svg viewBox="0 0 10 6" width="9" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l4 4 4-4"/>
            </svg>
          </button>

          <TDivider />

          <TBtn label="Bold"><BoldIcon /></TBtn>
          <TBtn label="Italic"><ItalicIcon /></TBtn>
          <TBtn label="Underline"><UnderlineIcon /></TBtn>
          <TBtn label="Strikethrough"><StrikeIcon /></TBtn>
          <TBtn label="Code"><CodeIcon /></TBtn>

          <TDivider />

          <TBtn label="Bulleted list"><BulletIcon /></TBtn>
          <TBtn label="Numbered list"><NumberedIcon /></TBtn>
          <TBtn label="Link"><LinkIcon /></TBtn>
          <TBtn label="Mention"><AtIcon /></TBtn>
          <TBtn label="Full screen"><ExpandIcon /></TBtn>

          <TDivider />

          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 26, padding: '0 10px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text-weak)',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
          >
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="12" height="8" rx="1.5"/>
              <path d="M4 6h6M4 8.5h4"/>
            </svg>
            Create task
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Narrow view */}
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              height: 26, padding: '0 8px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
          >
            Narrow view
            <svg viewBox="0 0 10 6" width="9" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l4 4 4-4"/>
            </svg>
          </button>

          {/* Saved status */}
          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)', marginLeft: 4 }}>
            Saved
          </span>
        </div>
      )}

      {/* ── Content area ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 60px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', paddingTop: 48 }}>

          {/* Article meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Avatar name={doc.author} size={20} />
            <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)' }}>{doc.author}</span>
            <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>·</span>
            <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)' }}>
              Updated {formatDate(doc.updatedAt)}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: SFD, fontSize: 30, fontWeight: 700, color: 'var(--text)', margin: '0 0 32px', lineHeight: '38px' }}>
            {doc.title}
          </h1>

          {/* Content */}
          {hasContent ? (
            <ContentBlocks blocks={doc.content} />
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '60px 0', gap: 8,
            }}>
              <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                <rect x="8" y="4" width="28" height="40" rx="4" fill="var(--background-strong)" stroke="var(--border)" strokeWidth="1.5"/>
                <path d="M14 14h16M14 20h16M14 26h10" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text-disabled)', margin: 0 }}>
                {isAdmin ? 'Start writing to add content.' : 'No content yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
