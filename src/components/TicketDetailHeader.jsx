import { useState, useRef, useEffect } from 'react';

// ─── Pill constants + icons ────────────────────────────────────────────────────

export const PRIORITY_COLORS = {
  Critical: { bg: '#FEF3C7', color: '#92400E' },
  Medium:   { bg: '#DBEAFE', color: '#1D4ED8' },
  Low:      { bg: '#F3F4F6', color: '#6D6E6F' },
};
export const STATUS_BORDER = {
  'On hold':      '#F1BD6C',
  'Investigating':'#79ABFF',
  'Not started':  '#D1D5DB',
  'Resolved':     '#58A182',
  'Closed':       '#D1D5DB',
  'Routed':       '#D1D5DB',
};
export const PRIORITY_OPTIONS = ['Critical', 'Medium', 'Low'];
export const STATUS_OPTIONS   = ['Not started', 'Investigating', 'On hold', 'Resolved'];

export function PillStatusIcon({ status }) {
  if (status === 'Not started') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 8C7.7945 8 6 9.7945 6 12C6 14.2055 7.7945 16 10 16C12.2055 16 14 14.2055 14 12C14 9.795 12.2055 8 10 8ZM10 15C8.3455 15 7 13.6545 7 12C7 10.3455 8.3455 9 10 9C11.6545 9 13 10.3455 13 12C13 13.6545 11.6545 15 10 15Z" fill="#6D6E6F" />
    </svg>
  );
  if (status === 'On hold') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 6C6.692 6 4 8.6915 4 12C4 15.3085 6.692 18 10 18C13.309 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.2435 17 5 14.757 5 12C5 9.243 7.2435 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12 9.5L12 14.5C12 14.6326 11.9473 14.7598 11.8536 14.8536C11.7598 14.9473 11.6326 15 11.5 15C11.3674 15 11.2402 14.9473 11.1464 14.8536C11.0527 14.7598 11 14.6326 11 14.5L11 9.5C11 9.36739 11.0527 9.24021 11.1464 9.14645C11.2402 9.05268 11.3674 9 11.5 9C11.6326 9 11.7598 9.05268 11.8536 9.14645C11.9473 9.24021 12 9.36739 12 9.5ZM9 9.5L9 14.5C9 14.6326 8.94732 14.7598 8.85355 14.8536C8.75979 14.9473 8.63261 15 8.5 15C8.36739 15 8.24021 14.9473 8.14645 14.8536C8.05268 14.7598 8 14.6326 8 14.5L8 9.5C8 9.36739 8.05268 9.24021 8.14645 9.14645C8.24021 9.05268 8.36739 9 8.5 9C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5Z" fill="#F1BD6C" />
    </svg>
  );
  if (status === 'Investigating') return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5.5" stroke="#79ABFF" />
      <path d="M3 6H9M9 6L7 4M9 6L7 8" stroke="#79ABFF" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (status === 'Resolved') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 6C6.6915 6 4 8.6915 4 12C4 15.3085 6.6915 18 10 18C13.3085 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.243 17 5 14.757 5 12C5 9.243 7.243 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12.8535 10.1465C12.9 10.1929 12.9368 10.248 12.962 10.3087C12.9872 10.3693 13.0001 10.4343 13.0001 10.5C13.0001 10.5657 12.9872 10.6307 12.962 10.6913C12.9368 10.752 12.9 10.8071 12.8535 10.8535L9.52 14.187C9.47367 14.2336 9.41859 14.2706 9.35793 14.2958C9.29726 14.321 9.2322 14.334 9.1665 14.334C9.1008 14.334 9.03574 14.321 8.97507 14.2958C8.91441 14.2706 8.85933 14.2336 8.813 14.187L7.1465 12.52C7.05275 12.4262 7.00008 12.2991 7.00008 12.1665C7.00008 12.0339 7.05275 11.9068 7.1465 11.813C7.24025 11.7192 7.36741 11.6666 7.5 11.6666C7.63259 11.6666 7.75975 11.7192 7.8535 11.813L9.1665 13.1265L12.1465 10.1465C12.1929 10.1 12.248 10.0632 12.3087 10.038C12.3693 10.0128 12.4343 9.9999 12.5 9.9999C12.5657 9.9999 12.6307 10.0128 12.6913 10.038C12.752 10.0632 12.8071 10.1 12.8535 10.1465Z" fill="#58A182" />
    </svg>
  );
  return null;
}

// ─── Header icons ──────────────────────────────────────────────────────────────

function DotsIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="6 6 16 16" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M15.6827 12.318C16.1021 12.735 16.4345 13.231 16.6607 13.7774C16.887 14.3238 17.0025 14.9096 17.0007 15.501C17.0024 16.0923 16.8868 16.6781 16.6605 17.2245C16.4343 17.7708 16.102 18.2669 15.6827 18.684L13.6823 20.684C13.2646 21.1023 12.7684 21.434 12.2221 21.66C11.6759 21.886 11.0904 22.0019 10.4992 22.001C9.9081 22.0019 9.3226 21.886 8.77636 21.66C8.23013 21.434 7.73392 21.1023 7.31625 20.684C5.56125 18.929 5.56125 16.074 7.31625 14.319L9.14525 12.4895C9.19171 12.4431 9.24685 12.4063 9.30753 12.3811C9.36822 12.356 9.43325 12.3431 9.49893 12.3431C9.5646 12.3432 9.62963 12.3561 9.69029 12.3813C9.75096 12.4064 9.80608 12.4433 9.8525 12.4897C9.89892 12.5362 9.93574 12.5913 9.96085 12.652C9.98596 12.7127 9.99887 12.7777 9.99885 12.8434C9.99883 12.9091 9.98587 12.9741 9.96072 13.0348C9.93556 13.0955 9.89871 13.1506 9.85225 13.197L8.02325 15.026C7.36787 15.6831 6.99981 16.5732 6.99981 17.5012C6.99981 18.4293 7.36787 19.3194 8.02325 19.9765C9.38825 21.3415 11.6097 21.3425 12.9748 19.9765L14.9752 17.9765C15.6308 17.3194 15.9989 16.4292 15.9989 15.501C15.9989 14.5728 15.6308 13.6826 14.9752 13.0255C14.5744 12.6219 14.0804 12.3233 13.5367 12.156C13.4124 12.1149 13.3092 12.0266 13.2492 11.9101C13.1893 11.7937 13.1774 11.6584 13.2162 11.5333C13.255 11.4082 13.3413 11.3033 13.4566 11.2412C13.5719 11.179 13.7069 11.1646 13.8327 11.201C14.5307 11.4181 15.1654 11.8016 15.6823 12.3185L15.6827 12.318ZM20.6842 7.31649C18.9288 5.56149 16.0737 5.56149 14.3182 7.31649L12.3177 9.31649C11.8984 9.73355 11.5659 10.2297 11.3397 10.7761C11.1134 11.3226 10.9979 11.9085 10.9998 12.5C10.9998 13.7025 11.4678 14.8325 12.3177 15.6835C12.8346 16.2004 13.4693 16.5839 14.1672 16.801C14.2923 16.8347 14.4255 16.8185 14.5389 16.756C14.6523 16.6935 14.7371 16.5895 14.7754 16.4658C14.8138 16.3421 14.8026 16.2084 14.7444 16.0927C14.6862 15.977 14.5854 15.8884 14.4632 15.8455C13.9197 15.6784 13.4256 15.3799 13.0248 14.9765C12.3691 14.3194 12.0008 13.429 12.0008 12.5007C12.0008 11.5725 12.3691 10.6821 13.0248 10.025L15.0252 8.02499C16.3907 6.65999 18.6122 6.65999 19.9767 8.02499C21.3412 9.38899 21.3417 11.6105 19.9767 12.976L18.1477 14.8045C18.1013 14.8509 18.0644 14.906 18.0393 14.9667C18.0141 15.0274 18.0012 15.0924 18.0011 15.1581C18.0011 15.2237 18.014 15.2888 18.0391 15.3495C18.0643 15.4101 18.1011 15.4653 18.1475 15.5117C18.1939 15.5582 18.249 15.5951 18.3097 15.6202C18.3704 15.6454 18.4354 15.6583 18.5011 15.6583C18.5667 15.6584 18.6318 15.6455 18.6925 15.6203C18.7532 15.5952 18.8083 15.5584 18.8547 15.512L20.6837 13.6825C22.4387 11.9275 22.4387 9.07249 20.6837 7.31749L20.6842 7.31649Z" />
    </svg>
  );
}

// ─── TicketDetailHeader ───────────────────────────────────────────────────────

function WorkflowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M7.99875 5.5938C8.03538 5.6282 8.06472 5.66961 8.08504 5.71556C8.10535 5.76152 8.11622 5.8111 8.117 5.86134C8.11778 5.91158 8.10845 5.96147 8.08958 6.00804C8.0707 6.0546 8.04266 6.0969 8.00712 6.13242C7.97157 6.16794 7.92925 6.19595 7.88267 6.2148C7.83609 6.23364 7.7862 6.24293 7.73596 6.24211C7.68571 6.2413 7.63615 6.23039 7.5902 6.21005C7.54426 6.1897 7.50287 6.16033 7.4685 6.12367L7.18725 5.84242C7.12172 5.77122 7.08625 5.67745 7.08825 5.5807C7.09026 5.48396 7.12958 5.39173 7.19801 5.32331C7.26643 5.25488 7.35866 5.21556 7.4554 5.21355C7.55215 5.21155 7.64593 5.24702 7.71713 5.31255L7.99875 5.5938ZM6.40575 4.0008C6.33455 3.93527 6.24077 3.8998 6.14403 3.9018C6.04728 3.90381 5.95506 3.94313 5.88663 4.01156C5.81821 4.07998 5.77888 4.17221 5.77688 4.26895C5.77487 4.3657 5.81034 4.45948 5.87588 4.53067L6.15713 4.81192C6.19187 4.84687 6.23318 4.8746 6.27868 4.89352C6.32418 4.91245 6.37297 4.92219 6.42225 4.92219C6.47153 4.92219 6.52032 4.91245 6.56582 4.89352C6.61132 4.8746 6.65263 4.84687 6.68738 4.81192C6.75756 4.74162 6.79698 4.64633 6.79698 4.54699C6.79698 4.44764 6.75756 4.35236 6.68738 4.28205L6.40575 4.0008ZM11.7773 5.33392L5.33475 11.7764C5.18925 11.9227 4.99688 11.9954 4.80525 11.9954C4.70683 11.9956 4.60935 11.9763 4.51841 11.9386C4.42747 11.901 4.34488 11.8457 4.27538 11.776L3.35288 10.8535C3.30015 10.8009 3.26432 10.7337 3.24996 10.6605C3.2356 10.5874 3.24336 10.5116 3.27225 10.4429C3.37428 10.2029 3.40216 9.93792 3.3523 9.68196C3.30245 9.426 3.17714 9.19082 2.9925 9.00667C2.80844 8.82178 2.57318 8.69631 2.3171 8.64644C2.06102 8.59658 1.79587 8.62461 1.55588 8.72692C1.48722 8.75578 1.41153 8.76353 1.33846 8.74917C1.26538 8.73481 1.19825 8.69899 1.14563 8.6463L0.223126 7.7238C0.082637 7.58317 0.00372314 7.39252 0.00372314 7.19374C0.00372314 6.99496 0.082637 6.80431 0.223126 6.66368L6.66563 0.2223C6.80619 0.0818341 6.99678 0.00292969 7.1955 0.00292969C7.39422 0.00292969 7.58481 0.0818341 7.72538 0.2223L8.64788 1.1448C8.7006 1.19748 8.73643 1.26468 8.75079 1.33782C8.76515 1.41096 8.75739 1.48672 8.7285 1.55542C8.62639 1.79545 8.59847 2.06055 8.64832 2.31659C8.69818 2.57262 8.82354 2.80787 9.00825 2.99205C9.19238 3.17671 9.42759 3.30201 9.68357 3.3518C9.93955 3.4016 10.2046 3.3736 10.4445 3.27142C10.5132 3.24233 10.589 3.23446 10.6622 3.24883C10.7353 3.2632 10.8026 3.29915 10.8551 3.35205L11.7776 4.27455C11.9181 4.41518 11.997 4.60583 11.997 4.80461C11.997 5.00339 11.9181 5.19404 11.7776 5.33467L11.7773 5.33392ZM11.2474 4.80405L10.491 4.04767C10.1391 4.14754 9.76689 4.15142 9.41298 4.0589C9.05908 3.96639 8.73638 3.78085 8.47838 3.52155C8.21914 3.26342 8.03366 2.94065 7.94115 2.58671C7.84864 2.23276 7.85247 1.86052 7.95225 1.50855L7.19625 0.752175L5.17688 2.77155L5.51625 3.11092C5.55288 3.14532 5.58222 3.18673 5.60254 3.23269C5.62285 3.27865 5.63372 3.32822 5.6345 3.37846C5.63528 3.42871 5.62595 3.47859 5.60708 3.52516C5.5882 3.57173 5.56016 3.61403 5.52462 3.64955C5.48907 3.68506 5.44675 3.71308 5.40017 3.73192C5.35359 3.75076 5.3037 3.76005 5.25346 3.75924C5.20321 3.75842 5.15365 3.74752 5.1077 3.72717C5.06176 3.70683 5.02037 3.67745 4.986 3.6408L4.64663 3.30142L0.753376 7.1943L1.50975 7.95068C1.86165 7.85081 2.23386 7.84693 2.58777 7.93945C2.94167 8.03196 3.26437 8.2175 3.52238 8.4768C3.78161 8.73493 3.96709 9.0577 4.0596 9.41164C4.15211 9.76559 4.14828 10.1378 4.0485 10.4898L4.8045 11.2462L8.69775 7.3533L8.35838 7.01393C8.29284 6.94273 8.25737 6.84895 8.25938 6.7522C8.26138 6.65546 8.30071 6.56323 8.36913 6.49481C8.43756 6.42638 8.52978 6.38706 8.62653 6.38505C8.72328 6.38305 8.81705 6.41852 8.88825 6.48405L9.22763 6.82343L11.2466 4.80442L11.2474 4.80405Z" />
    </svg>
  );
}

export default function TicketDetailHeader({ ticket, onBack, onRequestApproval, onRouteToHR, onCreateTicketHR, readOnly = false, hasWorkflow = false, workflowOpen = false, onToggleWorkflow }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div
      className="shrink-0 flex items-center justify-between bg-white"
      style={{ height: 72, padding: '0 24px', borderBottom: '1px solid #EDEAE9' }}
    >
      {/* Left: breadcrumb + title */}
      <div className="flex flex-col gap-0.5 min-w-0 mr-6">
        <div className="flex items-center gap-1" style={{ fontSize: 12, color: '#6D6E6F' }}>
          <button
            type="button"
            onClick={onBack}
            className="border-0 bg-transparent p-0 cursor-pointer hover:underline transition-colors"
            style={{ fontSize: 12, color: '#6D6E6F' }}
          >
            Tickets
          </button>
          <span style={{ color: '#9ea0a2' }}>/</span>
          <span style={{ color: '#1E1F21', fontWeight: 500 }}>{ticket.id}</span>
        </div>
        <h1
          className="truncate"
          style={{ fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-0.2px', color: '#1E1F21', maxWidth: 600 }}
        >
          {ticket.name}
        </h1>
      </div>

      {/* Right: icon buttons */}
      <div className="flex items-center shrink-0" style={{ gap: 8 }}>
        {hasWorkflow && (
          <button
            type="button"
            onClick={onToggleWorkflow}
            style={{
              height: 30, padding: '0 10px',
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 500,
              color: workflowOpen ? '#4573D2' : '#6D6E6F',
              background: workflowOpen ? '#EEF4FF' : 'transparent',
              border: `1px solid ${workflowOpen ? '#C7DCF5' : '#EDEAE9'}`,
              borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <WorkflowIcon />
            Workflow
          </button>
        )}
        <button
          type="button"
          aria-label="Copy link"
          className="flex items-center justify-center cursor-pointer transition-colors"
          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', color: '#6D6E6F' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LinkIcon />
        </button>

        {!readOnly && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              type="button"
              aria-label="More options"
              className="flex items-center justify-center cursor-pointer transition-colors"
              style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: menuOpen ? '#F5F5F4' : 'transparent', color: '#6D6E6F' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
              onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
              onClick={() => setMenuOpen(o => !o)}
            >
              <DotsIcon />
            </button>

            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', border: '1px solid #EDEAE9', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', background: 'white', zIndex: 50, minWidth: 200, padding: '4px 0' }}>
                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: '#1E1F21' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onRequestApproval?.(); }}
                >
                  Request approval
                </button>

                <div style={{ height: 1, background: '#EDEAE9', margin: '4px 0' }} />

                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: '#1E1F21' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onCreateTicketHR?.(); }}
                >
                  Create ticket for HR
                </button>
                <div style={{ height: 1, background: '#EDEAE9', margin: '4px 0' }} />

                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: '#1E1F21' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onRouteToHR?.(); }}
                >
                  Route to HR
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
