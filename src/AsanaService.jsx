import { useState, useRef } from 'react';
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

export default function AsanaService() {
  const [activeMode, setActiveMode] = useState('service');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeServiceNav, setActiveServiceNav] = useState('Inbox');
  const [workActiveItem, setWorkActiveItem] = useState('Home');
  const [routedHRTickets, setRoutedHRTickets] = useState([]);
  const [linkedHRTickets, setLinkedHRTickets] = useState({}); // { [itTicketId]: hrTicketObj }
  const [deepLinkITTicketId, setDeepLinkITTicketId] = useState(null);
  const [deepLinkHRTicketId, setDeepLinkHRTicketId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPillRect, setSearchPillRect] = useState(null);
  const searchPillRef = useRef(null);

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

  // Called on every HR status change (not just Resolved)
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
    setActiveServiceNav('IT Tickets');
    setDeepLinkITTicketId(itTicketId);
  }

  function handleGoToLinkedHRTicket(hrTicketId) {
    setActiveServiceNav('HR Tickets');
    setDeepLinkHRTicketId(hrTicketId);
  }

  function handleSearchSelectIT(id) {
    setActiveMode('service');
    setActiveServiceNav('IT Tickets');
    setDeepLinkITTicketId(id);
    handleCloseSearch();
  }

  function handleSearchSelectHR(id) {
    setActiveMode('service');
    setActiveServiceNav('HR Tickets');
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
          <ModeSidebar active={activeMode} onSelect={setActiveMode} />
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
              onSelect={setActiveServiceNav}
            />
          )}
          {activeMode === 'work' && (
            <WorkSecondaryNav
              activeItem={workActiveItem}
              onSelect={setWorkActiveItem}
            />
          )}
        </div>
      )}

      {/* ── Main content ─────────── fills remaining space, adjusts with sidebars */}
      <div
        className="absolute top-11 bottom-0 right-0 overflow-hidden"
        style={{ left: mainLeft }}
      >
        {activeMode === 'work' && workActiveItem === 'Home'
          ? <HomeView onOpenServiceMode={() => { setActiveMode('service'); setActiveServiceNav('IT Tickets'); }} />
          : (activeMode === 'service' && activeServiceNav === 'Inbox') ||
         (activeMode === 'work'    && workActiveItem    === 'Inbox')
          ? <InboxView defaultTab={activeMode === 'service' ? 'Service' : 'Activity'} />
          : activeMode === 'service' && activeServiceNav === 'IT Tickets'
          ? <TicketsDashboard
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              deepLinkTicketId={deepLinkITTicketId}
              onDeepLinkHandled={() => setDeepLinkITTicketId(null)}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          : activeMode === 'service' && activeServiceNav === 'Automations'
          ? <AutomationsView />
          : activeMode === 'service' && activeServiceNav === 'Create Queue'
          ? <CreateQueueWizard onDone={() => setActiveServiceNav('IT Tickets')} />
          : activeMode === 'service' && activeServiceNav === 'HR Tickets'
          ? <HRTicketsDashboard
              extraTickets={routedHRTickets}
              onHRCaseStatusChange={handleHRCaseStatusChange}
              onGoToLinkedITTicket={handleGoToLinkedITTicket}
              deepLinkTicketId={deepLinkHRTicketId}
              onDeepLinkHandled={() => setDeepLinkHRTicketId(null)}
            />
          : (
            <div className="p-8">
              <p className="text-sm text-[#9ea0a2] capitalize">
                {activeMode}{activeServiceNav ? ` › ${activeServiceNav}` : ''} — content coming soon.
              </p>
            </div>
          )
        }
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
