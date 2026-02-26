import { useState, useRef } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ModeSidebar from './components/ModeSidebar';
import ServiceSecondaryNav from './components/ServiceSecondaryNav';
import TicketsDashboard from './components/TicketsDashboard';
import HRTicketsDashboard from './components/HRTicketsDashboard';
import InboxView from './components/InboxView';
import WorkSecondaryNav from './components/WorkSecondaryNav';
import SearchModal from './components/SearchModal';
import AutomationsView from './components/AutomationsView';
import HomeView from './components/HomeView';
import CreateQueueWizard from './components/CreateQueueWizard';

// NavBar height  = h-11 = 2.75rem = 44px
// ModeSidebar    = w-16 = 4rem    = 64px
// SecondaryNav   = w-[182px]

// ── URL → active state mapping ────────────────────────────────────────────────
function getRouteState(pathname) {
  if (pathname === '/')             return { mode: 'work',    serviceNav: null,          workItem: 'Home' };
  if (pathname === '/inbox')        return { mode: 'service', serviceNav: 'Inbox',        workItem: null   };
  if (pathname === '/tickets')      return { mode: 'service', serviceNav: 'IT Tickets',   workItem: null   };
  if (pathname === '/hr-tickets')   return { mode: 'service', serviceNav: 'HR Tickets',   workItem: null   };
  if (pathname === '/automations')  return { mode: 'service', serviceNav: 'Automations',  workItem: null   };
  if (pathname === '/create-queue') return { mode: 'service', serviceNav: 'Create Queue', workItem: null   };
  return { mode: 'service', serviceNav: null, workItem: null };
}

// ── Service nav label → URL ───────────────────────────────────────────────────
const SERVICE_NAV_URL = {
  'Inbox':        '/inbox',
  'IT Tickets':   '/tickets',
  'HR Tickets':   '/hr-tickets',
  'Automations':  '/automations',
  'Create Queue': '/create-queue',
};

export default function AsanaService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode: activeMode, serviceNav: activeServiceNav, workItem: workActiveItem } =
    getRouteState(location.pathname);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [routedHRTickets, setRoutedHRTickets] = useState([]);
  const [linkedHRTickets, setLinkedHRTickets] = useState({});
  const [deepLinkITTicketId, setDeepLinkITTicketId] = useState(null);
  const [deepLinkHRTicketId, setDeepLinkHRTicketId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPillRect, setSearchPillRect] = useState(null);
  const searchPillRef = useRef(null);

  function handleSelectMode(mode) {
    if (mode === 'work') navigate('/');
    else if (mode === 'service') navigate('/inbox');
    // other modes: no route yet
  }

  function handleSelectServiceNav(label) {
    const url = SERVICE_NAV_URL[label];
    if (url) navigate(url);
  }

  function handleSelectWorkNav(label) {
    if (label === 'Home') navigate('/');
    // other work labels: no route yet
  }

  function handleOpenSearch() {
    if (searchPillRef.current) {
      setSearchPillRect(searchPillRef.current.getBoundingClientRect());
    }
    setSearchOpen(true);
  }

  function handleCloseSearch() {
    setSearchOpen(false);
  }

  function handleAddHRTicket(ticket) {
    setRoutedHRTickets(prev => [ticket, ...prev]);
    if (ticket.linkedFromId) {
      setLinkedHRTickets(prev => ({ ...prev, [ticket.linkedFromId]: ticket }));
    }
  }

  function handleLinkHRTicket(itTicketId, hrTicket) {
    setLinkedHRTickets(prev => ({ ...prev, [itTicketId]: hrTicket }));
  }

  function handleHRCaseStatusChange(hrId, itTicketId, status) {
    setRoutedHRTickets(prev => prev.map(t => t.id === hrId ? { ...t, status } : t));
    if (itTicketId) {
      setLinkedHRTickets(prev =>
        prev[itTicketId]
          ? { ...prev, [itTicketId]: { ...prev[itTicketId], status } }
          : prev
      );
    }
  }

  function handleGoToLinkedITTicket(itTicketId) {
    navigate('/tickets');
    setDeepLinkITTicketId(itTicketId);
  }

  function handleGoToLinkedHRTicket(hrTicketId) {
    navigate('/hr-tickets');
    setDeepLinkHRTicketId(hrTicketId);
  }

  function handleSearchSelectIT(id) {
    navigate('/tickets');
    setDeepLinkITTicketId(id);
    handleCloseSearch();
  }

  function handleSearchSelectHR(id) {
    navigate('/hr-tickets');
    setDeepLinkHRTicketId(id);
    handleCloseSearch();
  }

  const secondaryVisible = sidebarOpen && (activeMode === 'service' || activeMode === 'work');
  const mainLeft = sidebarOpen ? (secondaryVisible ? 64 + 182 : 64) : 0;

  return (
    // Fixed root — truly viewport-locked, no flex-chain height dependencies
    <div className="fixed inset-0 overflow-hidden bg-white">

      {/* ── Top bar ─────────────────────────────────────────────── z-50 */}
      <div className="absolute inset-x-0 top-0 h-11 z-50">
        <NavBar
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onOpenSearch={handleOpenSearch}
          searchOpen={searchOpen}
          pillRef={searchPillRef}
        />
      </div>

      {/* ── Separator below NavBar — skips the mode sidebar zone ───────────── */}
      <div
        className="absolute pointer-events-none z-[55]"
        style={{ top: 44, left: mainLeft, right: 0, height: 1, background: '#e0e1e3' }}
      />

      {/* ── Mode sidebar ────────────────────────────── left-0, below top bar */}
      {sidebarOpen && (
        <div className="absolute top-11 left-0 w-16 bottom-0 z-40">
          <ModeSidebar active={activeMode} onSelect={handleSelectMode} />
        </div>
      )}

      {/* ── Gray fill behind secondary nav top-left rounded corner ─────────── */}
      {secondaryVisible && sidebarOpen && (
        <div
          className="absolute pointer-events-none z-[39]"
          style={{ top: 44, left: 64, width: 12, height: 12, background: '#f5f5f4' }}
        />
      )}

      {/* ── Secondary nav ──────────────── left-16, service or work mode */}
      {secondaryVisible && (
        <div className="absolute top-11 left-16 w-[182px] bottom-0 z-40">
          {activeMode === 'service' && (
            <ServiceSecondaryNav
              activeItem={activeServiceNav}
              onSelect={handleSelectServiceNav}
            />
          )}
          {activeMode === 'work' && (
            <WorkSecondaryNav
              activeItem={workActiveItem}
              onSelect={handleSelectWorkNav}
            />
          )}
        </div>
      )}

      {/* ── Main content ─────────── fills remaining space, adjusts with sidebars */}
      <div
        className="absolute top-11 bottom-0 right-0 overflow-hidden"
        style={{ left: mainLeft }}
      >
        <Routes>
          <Route path="/" element={
            <HomeView onOpenServiceMode={() => navigate('/tickets')} />
          } />
          <Route path="/inbox" element={
            <InboxView defaultTab="Service" />
          } />
          <Route path="/tickets" element={
            <TicketsDashboard
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              deepLinkTicketId={deepLinkITTicketId}
              onDeepLinkHandled={() => setDeepLinkITTicketId(null)}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/hr-tickets" element={
            <HRTicketsDashboard
              extraTickets={routedHRTickets}
              onHRCaseStatusChange={handleHRCaseStatusChange}
              onGoToLinkedITTicket={handleGoToLinkedITTicket}
              deepLinkTicketId={deepLinkHRTicketId}
              onDeepLinkHandled={() => setDeepLinkHRTicketId(null)}
            />
          } />
          <Route path="/automations" element={<AutomationsView />} />
          <Route path="/create-queue" element={
            <CreateQueueWizard onDone={() => navigate('/tickets')} />
          } />
          <Route path="*" element={
            <div className="p-8">
              <p className="text-sm text-[#9ea0a2]">Content coming soon.</p>
            </div>
          } />
        </Routes>
      </div>

      {/* ── Search modal ─────────────────────────────────────── above all, z-300 */}
      {searchOpen && (
        <SearchModal
          onClose={handleCloseSearch}
          contextMode={activeMode}
          onSelectITTicket={handleSearchSelectIT}
          onSelectHRTicket={handleSearchSelectHR}
          pillRect={searchPillRect}
        />
      )}

    </div>
  );
}
