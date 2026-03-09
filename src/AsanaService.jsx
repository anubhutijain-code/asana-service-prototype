import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Routes, Route } from 'react-router-dom';
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
import AssetsView from './components/AssetsView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import DashboardView from './components/DashboardView';
import SettingsView from './components/SettingsView';
import OptimizeView from './components/OptimizeView';
import OptimizeV2View from './components/OptimizeV2View';
import Admin2HomeView from './components/Admin2HomeView';
import UnifiedHomeView from './components/UnifiedHomeView';
import RequestsView from './components/RequestsView';
import MyApprovalsView from './components/MyApprovalsView';
import EscalationsView from './components/EscalationsView';
import AgentMyTicketsView from './components/AgentMyTicketsView';
import CollaboratingView from './components/CollaboratingView';
import AgentHomeView from './components/AgentHomeView';

// NavBar height  = h-11 = 2.75rem = 44px
// ModeSidebar    = w-16 = 4rem    = 64px
// SecondaryNav   = w-[182px]

function EmptyModeView({ mode }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {mode && (
        <p className="text-sm font-medium text-[#6D6E6F]">{mode}</p>
      )}
      <p className="text-xs text-[#9ea0a2] mt-1">Content coming soon.</p>
    </div>
  );
}

// ── URL → active state mapping ────────────────────────────────────────────────
function getRouteState(pathname) {
  if (pathname === '/')             return { mode: 'work',     serviceNav: null,          workItem: 'Home'  };
  if (pathname === '/work/inbox')   return { mode: 'work',     serviceNav: null,          workItem: 'Inbox' };
  if (pathname === '/strategy')     return { mode: 'plan',     serviceNav: null,          workItem: null    };
  if (pathname === '/workflow')     return { mode: 'workflow', serviceNav: null,          workItem: null    };
  if (pathname === '/people')       return { mode: 'company',  serviceNav: null,          workItem: null    };
  if (pathname === '/inbox')        return { mode: 'service',  serviceNav: 'Inbox',        workItem: null    };
  if (pathname === '/tickets' || pathname.startsWith('/tickets/'))
                                    return { mode: 'service',  serviceNav: 'IT Tickets',   workItem: null    };
  if (pathname === '/hr-tickets' || pathname.startsWith('/hr-tickets/'))
                                    return { mode: 'service',  serviceNav: 'HR Tickets',   workItem: null    };
  if (pathname === '/automations')  return { mode: 'service',  serviceNav: 'Automations',  workItem: null    };
  if (pathname === '/assets')       return { mode: 'service',  serviceNav: 'Assets',       workItem: null    };
  if (pathname === '/dashboard')    return { mode: 'service',  serviceNav: 'Dashboard',    workItem: null    };
  if (pathname === '/optimize')     return { mode: 'service',  serviceNav: 'Optimize',     workItem: null    };
  if (pathname === '/optimize-v2')  return { mode: 'service',  serviceNav: 'Optimize V2',  workItem: null    };
  if (pathname === '/create-queue') return { mode: 'service',  serviceNav: 'Create Queue', workItem: null    };
  if (pathname === '/knowledge-base' || pathname.startsWith('/knowledge-base/'))
    return { mode: 'service', serviceNav: 'Knowledge base', workItem: null };
  if (pathname === '/settings')
    return { mode: 'service', serviceNav: 'Settings', workItem: null };
  if (pathname === '/my-queue')
    return { mode: 'service', serviceNav: 'My Queue', workItem: null };
  if (pathname === '/following')
    return { mode: 'service', serviceNav: 'Following', workItem: null };
  if (pathname === '/unassigned')
    return { mode: 'service', serviceNav: 'Unassigned', workItem: null };
  if (pathname === '/my-dashboard')
    return { mode: 'service', serviceNav: 'My Dashboard', workItem: null };
  // Agent (workbench) routes
  if (pathname === '/my-tickets')
    return { mode: 'service', serviceNav: 'My Tickets', workItem: null };
  if (pathname === '/collaborating')
    return { mode: 'service', serviceNav: 'Collaborating', workItem: null };
  if (pathname === '/agent-home')
    return { mode: 'service', serviceNav: 'Agent Home', workItem: null };
  if (pathname === '/all-tickets')
    return { mode: 'service', serviceNav: 'All Tickets', workItem: null };
  if (pathname === '/it-unassigned')
    return { mode: 'service', serviceNav: 'IT Unassigned', workItem: null };
  if (pathname === '/it-all-active')
    return { mode: 'service', serviceNav: 'IT All Active', workItem: null };
  if (pathname === '/hr-unassigned')
    return { mode: 'service', serviceNav: 'HR Unassigned', workItem: null };
  if (pathname === '/hr-all-active')
    return { mode: 'service', serviceNav: 'HR All Active', workItem: null };
  // Agent 3 / Admin 2 routes
  if (pathname === '/home')
    return { mode: 'service', serviceNav: 'Home', workItem: null };
  if (pathname === '/workload')
    return { mode: 'service', serviceNav: 'Workload', workItem: null };
  if (pathname === '/escalations')
    return { mode: 'service', serviceNav: 'Escalations', workItem: null };
  if (pathname === '/my-approvals')
    return { mode: 'service', serviceNav: 'My Approvals', workItem: null };
  if (pathname === '/requests')
    return { mode: 'service', serviceNav: 'Requests', workItem: null };
  return { mode: 'service', serviceNav: null, workItem: null };
}

// ── Wrapper: mounts TicketsDashboard at /tickets/:ticketId ────────────────────
function TicketsRouteWrapper(props) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  return (
    <TicketsDashboard
      {...props}
      deepLinkTicketId={ticketId ?? null}
      onDeepLinkHandled={() => {}}
      onURLBack={() => navigate('/tickets')}
    />
  );
}

// ── Wrapper: mounts HRTicketsDashboard at /hr-tickets/:ticketId ───────────────
function HRTicketsRouteWrapper(props) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  return (
    <HRTicketsDashboard
      {...props}
      deepLinkTicketId={ticketId ?? null}
      onDeepLinkHandled={() => {}}
      onURLBack={() => navigate('/hr-tickets')}
    />
  );
}

// ── Service nav label → URL ───────────────────────────────────────────────────
const SERVICE_NAV_URL = {
  'Inbox':           '/inbox',
  'IT Tickets':      '/tickets',
  'HR Tickets':      '/hr-tickets',
  'Automations':     '/automations',
  'Assets':          '/assets',
  'Create Queue':    '/create-queue',
  'Knowledge base':  '/knowledge-base',
  'Dashboard':       '/dashboard',
  'Optimize':        '/optimize',
  'Optimize V2':     '/optimize-v2',
  'Settings':        '/settings',
  'My Queue':        '/my-queue',
  'Following':       '/following',
  'Unassigned':      '/unassigned',
  'My Dashboard':    '/my-dashboard',
  // Agent workbench
  'My Tickets':      '/my-tickets',
  'Collaborating':   '/collaborating',
  'Agent Home':      '/agent-home',
  'All Tickets':     '/all-tickets',
  'IT Unassigned':   '/it-unassigned',
  'IT All Active':   '/it-all-active',
  'HR Unassigned':   '/hr-unassigned',
  'HR All Active':   '/hr-all-active',
  // Agent 3 / Admin 2
  'Home':            '/home',
  'Workload':        '/workload',
  'Escalations':     '/escalations',
  'My Approvals':    '/my-approvals',
  'Requests':        '/requests',
};

export default function AsanaService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode: activeMode, serviceNav: activeServiceNav, workItem: workActiveItem } =
    getRouteState(location.pathname);

  const [role, setRole] = useState('admin2');

  useEffect(() => {
    if (role === 'agent')       navigate('/my-tickets');
    else if (role === 'agent3') navigate('/agent-home');
    else if (role === 'admin')  navigate('/dashboard');
    else if (role === 'admin2') navigate('/home');
    else                        navigate('/inbox');
  }, []);

  function handleRoleChange(newRole) {
    setRole(newRole);
    if (newRole === 'agent')       navigate('/my-tickets');
    else if (newRole === 'agent3') navigate('/agent-home');
    else if (newRole === 'admin')  navigate('/dashboard');
    else if (newRole === 'admin2') navigate('/home');
    else                           navigate('/inbox'); // agent2
  }
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [kbExpanded, setKbExpanded] = useState(false);
  const [routedHRTickets, setRoutedHRTickets] = useState([]);
  const [linkedHRTickets, setLinkedHRTickets] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPillRect, setSearchPillRect] = useState(null);
  const searchPillRef = useRef(null);

  function handleSelectMode(mode) {
    if (mode === 'work')          navigate('/');
    else if (mode === 'service') {
      if (role === 'agent')        navigate('/my-tickets');
      else if (role === 'agent3')  navigate('/agent-home');
      else if (role === 'admin')   navigate('/dashboard');
      else if (role === 'admin2')  navigate('/home');
      else                         navigate('/inbox');
    }
    else if (mode === 'plan')     navigate('/strategy');
    else if (mode === 'workflow') navigate('/workflow');
    else if (mode === 'company')  navigate('/people');
  }

  const activeKBProject = location.pathname.startsWith('/knowledge-base/')
    ? location.pathname.replace('/knowledge-base/', '')
    : null;

  function handleSelectServiceNav(label) {
    if (label === 'Knowledge base') setKbExpanded(true);
    const url = SERVICE_NAV_URL[label];
    if (url) navigate(url);
  }

  function handleSelectWorkNav(label) {
    if (label === 'Home')  navigate('/');
    if (label === 'Inbox') navigate('/work/inbox');
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
    navigate(`/tickets/${itTicketId}`);
  }

  function handleGoToLinkedHRTicket(hrTicketId) {
    navigate(`/hr-tickets/${hrTicketId}`);
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
      <div className="absolute inset-x-0 top-0 h-12 z-50">
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
        style={{ top: 48, left: mainLeft, right: 0, height: 1, background: '#e0e1e3' }}
      />

      {/* ── Mode sidebar ────────────────────────────── left-0, below top bar */}
      {sidebarOpen && (
        <div className="absolute top-12 left-0 w-16 bottom-0 z-40">
          <ModeSidebar active={activeMode} onSelect={handleSelectMode} role={role} onRoleChange={handleRoleChange} />
        </div>
      )}

      {/* ── Gray fill behind secondary nav top-left rounded corner ─────────── */}
      {secondaryVisible && sidebarOpen && (
        <div
          className="absolute pointer-events-none z-[39]"
          style={{ top: 48, left: 64, width: 12, height: 12, background: '#e8e9ea' }}
        />
      )}

      {/* ── Secondary nav ──────────────── left-16, service or work mode */}
      {secondaryVisible && (
        <div className="absolute top-12 left-16 w-[182px] bottom-0 z-40">
          {activeMode === 'service' && (
            <ServiceSecondaryNav
              activeItem={activeServiceNav}
              onSelect={handleSelectServiceNav}
              expandedKB={kbExpanded || activeServiceNav === 'Knowledge base'}
              onToggleKB={() => setKbExpanded(v => !v)}
              activeKBProject={activeKBProject}
              onSelectKBProject={(id) => navigate(`/knowledge-base/${id}`)}
              role={role}
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
        className="absolute top-12 bottom-0 right-0 overflow-hidden"
        style={{ left: mainLeft }}
      >
        <Routes>
          <Route path="/" element={
            <HomeView onOpenServiceMode={() => navigate('/tickets')} />
          } />
          <Route path="/inbox" element={
            <InboxView defaultTab="Service" />
          } />
          <Route path="/work/inbox" element={
            <InboxView defaultTab="Activity" />
          } />
          <Route path="/tickets" element={
            <TicketsDashboard
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/tickets/:ticketId" element={
            <TicketsRouteWrapper
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
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
            />
          } />
          <Route path="/hr-tickets/:ticketId" element={
            <HRTicketsRouteWrapper
              extraTickets={routedHRTickets}
              onHRCaseStatusChange={handleHRCaseStatusChange}
              onGoToLinkedITTicket={handleGoToLinkedITTicket}
            />
          } />
          <Route path="/automations" element={<AutomationsView />} />
          <Route path="/assets" element={<AssetsView />} />
          <Route path="/knowledge-base/:projectId" element={<KnowledgeBaseView />} />
          <Route path="/knowledge-base" element={<KnowledgeBaseView />} />
          <Route path="/create-queue" element={
            <CreateQueueWizard onDone={() => navigate('/tickets')} />
          } />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/optimize" element={<OptimizeView onNavigateToTicket={id => navigate(`/tickets/${id}`)} />} />
          <Route path="/optimize-v2" element={<OptimizeV2View onNavigateToTicket={id => navigate(`/tickets/${id}`)} />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/my-queue" element={
            <TicketsDashboard
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/following" element={
            <TicketsDashboard
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/unassigned" element={
            <TicketsDashboard
              initialTab="Unassigned"
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/my-dashboard" element={<DashboardView />} />
          {/* Agent workbench routes */}
          <Route path="/my-tickets" element={<AgentMyTicketsView />} />
          <Route path="/collaborating" element={<CollaboratingView />} />
          <Route path="/it-unassigned" element={
            <TicketsDashboard
              initialTab="Unassigned"
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/it-all-active" element={
            <TicketsDashboard
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          <Route path="/hr-unassigned" element={
            <HRTicketsDashboard
              initialTab="Unassigned"
              extraTickets={routedHRTickets}
              onHRCaseStatusChange={handleHRCaseStatusChange}
              onGoToLinkedITTicket={handleGoToLinkedITTicket}
            />
          } />
          <Route path="/hr-all-active" element={
            <HRTicketsDashboard
              extraTickets={routedHRTickets}
              onHRCaseStatusChange={handleHRCaseStatusChange}
              onGoToLinkedITTicket={handleGoToLinkedITTicket}
            />
          } />
          {/* Agent 3 routes */}
          <Route path="/agent-home" element={<AgentHomeView />} />
          <Route path="/all-tickets" element={
            <TicketsDashboard
              initialTab="All Tickets"
              onRouteToHR={handleAddHRTicket}
              onCreateHRTicket={handleAddHRTicket}
              linkedHRTickets={linkedHRTickets}
              onLinkHRTicket={handleLinkHRTicket}
              onGoToLinkedHRTicket={handleGoToLinkedHRTicket}
            />
          } />
          {/* Admin 2 routes */}
          <Route path="/home"         element={<UnifiedHomeView defaultTab="service" onOpenServiceMode={() => navigate('/tickets')} />} />
          <Route path="/workload"     element={<DashboardView initialTab="Team" hideTabs={true} />} />
          <Route path="/escalations"  element={<EscalationsView />} />
          <Route path="/my-approvals" element={<MyApprovalsView />} />
          <Route path="/requests"     element={<RequestsView />} />
          <Route path="/strategy" element={<EmptyModeView mode="Strategy" />} />
          <Route path="/workflow" element={<EmptyModeView mode="Workflow" />} />
          <Route path="/people" element={<EmptyModeView mode="People" />} />
          <Route path="*" element={<EmptyModeView mode="" />} />
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
