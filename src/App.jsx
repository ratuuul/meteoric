import gsap from 'gsap';
import {
  Activity,
  BookUser,
  Code2,
  Crown,
  Droplets,
  HandHeart,
  HeartPulse,
  Mail,
  MapPin,
  Moon,
  Newspaper,
  Phone,
  RadioTower,
  Search,
  Signal,
  Sun,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import signalPosts from './data/signalPosts.json';
import students from './data/students.json';

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const bloodOrder = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const tabs = [
  { id: 'directory', label: 'Roster', icon: BookUser },
  { id: 'blood', label: 'Donors', icon: HandHeart },
  { id: 'insights', label: 'Pulse', icon: Activity },
  { id: 'stories', label: 'Signals', icon: Newspaper },
  { id: 'dev', label: 'Dev', icon: Code2 },
];

function isCr(student) {
  return normalize(student.name).includes('ahnaf muttaqui anuprov') || normalize(student.nickname).includes('anuprov');
}

function hasBangla(value) {
  return /[\u0980-\u09FF]/.test(String(value ?? ''));
}

function langProps(value) {
  return hasBangla(value) ? { lang: 'bn' } : {};
}

function formatName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\b[A-Za-z][A-Za-z']*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function fuzzyIncludes(field, query) {
  if (!query) return true;
  if (field.includes(query)) return true;
  if (query.length < 3) return false;
  let queryIndex = 0;
  for (const char of field) {
    if (char === query[queryIndex]) queryIndex += 1;
    if (queryIndex === query.length) return true;
  }
  return false;
}

function buildCrProfiles() {
  const ahnaf = students.find((student) => isCr(student));
  const abuRayan = students.find((student) => normalize(student.name).includes('jourder abu rayan'));
  return [
    {
      key: 'ahnaf-anuprov',
      name: ahnaf?.name || 'Ahnaf Muttaqui Anuprov',
      nickname: ahnaf?.nickname || 'Anuprov',
      role: 'Class Representative',
      student: ahnaf,
    },
    {
      key: 'jourder-abu-rayan',
      name: abuRayan?.name || 'JOURDER ABU RAYAN',
      nickname: abuRayan?.nickname || 'Abu Rayan',
      role: 'Class Representative',
      student: abuRayan,
    },
  ];
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function App() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const [blood, setBlood] = useState('All');
  const [hometown, setHometown] = useState('All');
  const [activeTab, setActiveTab] = useState('directory');
  const [selected, setSelected] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('ete-theme') ?? 'light');
  const [loading, setLoading] = useState(true);
  const [showPhaseAlert, setShowPhaseAlert] = useState(true);
  const heroConsoleRef = useRef(null);
  const crProfiles = useMemo(() => buildCrProfiles(), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('ete-theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !showPhaseAlert) return undefined;
    const timer = window.setTimeout(() => setShowPhaseAlert(false), 7000);
    return () => window.clearTimeout(timer);
  }, [loading, showPhaseAlert]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set('q', query);
    else params.delete('q');
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
    window.history.replaceState({}, '', next);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        document.querySelector('#student-search')?.focus();
      }
      if (event.key === 'Escape') {
        setQuery('');
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.topbar', { y: -18, opacity: 0, duration: 0.7, ease: 'power3.out' });
        gsap.from('.heroCopy > *', {
          y: 22,
          opacity: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: 'power3.out',
        });
        gsap.to('.heroConsole', {
          y: -7,
          rotateX: 1.4,
          rotateY: -1.8,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to('.statusDot', {
          scale: 1.75,
          opacity: 0.28,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [loading]);

  useEffect(() => {
    if (loading) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = '.directorySection, .donorSection, .insightSection, .storySection, .devSection';
      gsap.fromTo(
        targets,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.48, ease: 'power2.out', overwrite: true },
      );
    });
    return () => mm.revert();
  }, [activeTab, loading]);

  const tiltHeroConsole = (event) => {
    const node = heroConsoleRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(node, {
      rotateY: x * 9,
      rotateX: y * -8,
      y: -8,
      transformPerspective: 900,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const resetHeroConsole = () => {
    const node = heroConsoleRef.current;
    if (!node) return;
    gsap.to(node, {
      rotateY: -1.8,
      rotateX: 1.4,
      y: -7,
      duration: 0.7,
      ease: 'elastic.out(1, 0.55)',
      overwrite: 'auto',
    });
  };

  const hometowns = useMemo(
    () => ['All', ...Array.from(new Set(students.map((student) => student.hometown).filter(Boolean))).sort()],
    [],
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return students.filter((student) => {
      const matchesQuery =
        !q ||
        [student.name, student.nickname, student.roll, student.mobile, student.email, student.hometown, student.blood]
          .map(normalize)
          .some((field) => fuzzyIncludes(field.replace(/\s+/g, ''), q.replace(/\s+/g, '')));
      const matchesBlood = blood === 'All' || student.blood === blood;
      const matchesHometown = hometown === 'All' || student.hometown === hometown;
      return matchesQuery && matchesBlood && matchesHometown;
    });
  }, [query, blood, hometown]);

  const stats = useMemo(() => {
    const bloodCounts = students.reduce((acc, student) => {
      acc[student.blood || 'Unknown'] = (acc[student.blood || 'Unknown'] ?? 0) + 1;
      return acc;
    }, {});
    const hometownCounts = students.reduce((acc, student) => {
      acc[student.hometown || 'Unknown'] = (acc[student.hometown || 'Unknown'] ?? 0) + 1;
      return acc;
    }, {});
    const topHometowns = Object.entries(hometownCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6);
    return { bloodCounts, topHometowns };
  }, []);

  const resetFilters = () => {
    setQuery('');
    setBlood('All');
    setHometown('All');
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'stories') setSelectedPostId(null);
    window.setTimeout(() => {
      document.getElementById(tabId === 'dev' ? 'about-dev' : 'directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  };

  if (loading) {
    return <TelecomLoader />;
  }

  return (
    <div className="app">
      {activeTab === 'dev' ? (
        <header className="plainHeader">
          <TopNav activeTab={activeTab} setTheme={setTheme} switchTab={switchTab} theme={theme} />
        </header>
      ) : (
        <header className="hero">
          <TopNav activeTab={activeTab} setTheme={setTheme} switchTab={switchTab} theme={theme} />

        <section className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">RUET ETE · Batch 2024</p>
            <h1>The !family you never knew existed.</h1>
            <p>
              Find a batchmate by name, nickname, roll, hometown, or blood group. Open a richer profile, call in one
              tap, send an email, or export the exact list you need.
            </p>
            <div className="heroActions">
                <a href="#directory" className="primaryCta" onClick={() => switchTab('directory')}>
                Search the batch
              </a>
            </div>
            <div className="proofStrip" aria-label="Directory summary">
              <span><b>{students.length}</b> students</span>
              <span><b>{Object.keys(stats.bloodCounts).length}</b> blood groups</span>
              <span><b>{hometowns.length - 1}</b> hometowns</span>
            </div>
          </div>
          <div
            className="heroConsole"
            ref={heroConsoleRef}
            onMouseMove={tiltHeroConsole}
            onMouseLeave={resetHeroConsole}
            aria-label="Directory preview"
          >
            <div className="consoleHeader">
              <span className="statusDot" />
              <span>Live batch signal</span>
              <b>{filtered.length}</b>
            </div>
            <div className="consoleSearch">
              <Search size={18} />
              <span>Search “A+”, “Dhaka”, “2404”, or “Ratul”</span>
            </div>
            <div className="consoleStack">
              {students.slice(0, 5).map((student) => (
                <div className="consoleRow" key={student.roll}>
                  <span className="miniAvatar">{initials(student.name)}</span>
                  <span>
                    <b>{formatName(student.name)}</b>
                    <small>{student.nickname || 'mETEoric'} · {student.roll}</small>
                  </span>
                  <i>{student.blood}</i>
                </div>
              ))}
            </div>
            <div className="consoleMetrics">
              <span><HeartPulse size={18} /> Donor lookup</span>
              <span><Signal size={18} /> Tap-ready contact</span>
            </div>
          </div>
        </section>
        </header>
      )}

      <main id="directory" className="main">
        {activeTab === 'directory' && (
          <>
            <CrSection profiles={crProfiles} onSelect={setSelected} />
            <section className="directorySection">
              <div className="sectionHead">
                <div>
                  <p className="eyebrow">Roster</p>
                  <h2>{filtered.length} people on your current frequency.</h2>
                </div>
              </div>
              <section className="commandCenter">
                <label className="searchBox" htmlFor="student-search">
                  <Search size={20} />
                  <input
                    id="student-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name, roll, nickname, hometown..."
                  />
                  {query && (
                    <button onClick={() => setQuery('')} type="button">
                      <X size={17} />
                    </button>
                  )}
                </label>
                <div className="filters">
                  <select className="bloodFilter" value={blood} onChange={(event) => setBlood(event.target.value)} aria-label="Filter by blood group">
                    {bloodOrder
                      .filter((item) => item === 'All' || stats.bloodCounts[item])
                      .map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                  </select>
                  <select className="hometownFilter" value={hometown} onChange={(event) => setHometown(event.target.value)} aria-label="Filter by hometown">
                    {hometowns.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button className="ghostButton" onClick={resetFilters} type="button">
                    Reset
                  </button>
                </div>
              </section>
              <div className="rosterShell">
                <aside className="rosterAside">
                  <span className="asideIcon"><Users size={22} /></span>
                  <h3>Batch lookup</h3>
                  <p>Search once, then call, email, inspect details, or export the filtered roster.</p>
                  <div className="asideCrList" aria-label="Class representatives">
                    {crProfiles.map((cr) => (
                      <button
                        className="asideCr"
                        key={cr.key}
                        onClick={() => cr.student && setSelected(cr.student)}
                        type="button"
                      >
                        <span><Crown size={14} /></span>
                        <b>{cr.nickname}</b>
                        <small>{cr.role}</small>
                      </button>
                    ))}
                  </div>
                  <div className="asideStats">
                    <span><b>{filtered.length}</b> visible</span>
                    <span><b>{blood}</b> blood</span>
                    <span><b>{hometown}</b> area</span>
                  </div>
                </aside>
                <div className={filtered.length ? 'studentList' : 'studentList emptyList'}>
                  {filtered.length ? (
                    filtered.map((student, index) => (
                      <StudentCard key={student.roll} student={student} index={index} onSelect={() => setSelected(student)} />
                    ))
                  ) : (
                    <EmptyState onReset={resetFilters} />
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'blood' && (
          <BloodSection stats={stats} setBlood={setBlood} switchTab={switchTab} />
        )}

        {activeTab === 'insights' && <Insights stats={stats} />}

        {activeTab === 'stories' && <SignalStories selectedPostId={selectedPostId} setSelectedPostId={setSelectedPostId} />}

        {activeTab === 'dev' && <AboutDev />}
      </main>

      <div className="bottomNav" aria-label="Mobile navigation">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'active' : ''}
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            type="button"
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {selected && <ProfileModal student={selected} onClose={() => setSelected(null)} />}
      {showPhaseAlert && !loading && <PhaseAlert onClose={() => setShowPhaseAlert(false)} />}
    </div>
  );
}

function TopNav({ activeTab, setTheme, switchTab, theme }) {
  return (
    <nav className="topbar" aria-label="Primary">
      <div className="brand">
        <span className="brandMark">m</span>
        <span>
          <strong>mETEoric 24</strong>
          <small>Batch signal hub</small>
        </span>
      </div>
      <div className="desktopNav">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'navItem active' : 'navItem'}
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            type="button"
          >
            <tab.icon size={17} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="navActions">
        <button className="iconButton" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="button">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          <span className="srOnly">Toggle theme</span>
        </button>
      </div>
    </nav>
  );
}

function CrSection({ profiles, onSelect }) {
  return (
    <section className="crSection" aria-label="Class representatives">
      <div className="crIntro">
        <span className="storyLabel">Class Representatives</span>
        <h2>CR command desk for mETEoric 24.</h2>
        <p>Quickly find the batch representatives students usually need first for coordination, notices, and support.</p>
      </div>
      <div className="crCards">
        {profiles.map((profile) => {
          const profileHref = profile.student?.email
            ? `mailto:${profile.student.email}`
            : profile.student?.mobile
              ? `tel:${profile.student.mobile}`
              : undefined;
          return (
            <article className="crCard" key={profile.key}>
              <a className="crIdentity" href={profileHref} aria-label={`Contact ${formatName(profile.name)}`}>
                <span className="crAvatarWrap">
                  <span className="crCrown"><Crown size={20} /></span>
                  <Avatar className="crAvatar" name={profile.name} image={profile.student?.image} />
                </span>
                <span className="crIdentityText">
                  <span className="crPill">CR</span>
                  <h3>{formatName(profile.name)}</h3>
                  <p>{profile.nickname}</p>
                </span>
              </a>
              <div className="crActions">
                {profile.student?.mobile ? (
                  <a href={`tel:${profile.student.mobile}`}><Phone size={16} /> Call</a>
                ) : (
                  <span><Phone size={16} /> Number soon</span>
                )}
                {profile.student?.email ? (
                  <a href={`mailto:${profile.student.email}`}><Mail size={16} /> Email</a>
                ) : (
                  <span><Mail size={16} /> Email soon</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StudentCard({ student, index, onSelect }) {
  const cr = isCr(student);
  return (
    <article className="studentCard" style={{ animationDelay: `${Math.min(index, 18) * 35}ms` }}>
      <button className="profileButton" onClick={onSelect} type="button">
        <span className="avatarShell">
          <Avatar name={student.name} image={student.image} />
          {cr && <span className="crownBadge"><Crown size={13} /></span>}
        </span>
        <span>
          <strong>
            {formatName(student.name)}
            {cr && <em className="crTag">CR</em>}
          </strong>
          <small>{student.nickname || 'mETEoric 24'}</small>
        </span>
      </button>
      <div className="metaRows">
        <span>
          <MapPin size={16} /> {student.hometown || 'Unknown'}
        </span>
        <span>
          <Droplets size={16} /> {student.blood || 'Unknown'}
        </span>
      </div>
      <div className="quickActions">
        <a href={`tel:${student.mobile}`}>
          <Phone size={17} /> {student.mobile}
        </a>
        <a href={`mailto:${student.email}`}>
          <Mail size={17} /> Email
        </a>
      </div>
    </article>
  );
}

function Avatar({ className = '', image, name }) {
  const label = `${name || 'Student'} image`;
  return (
    <span className={`avatar ${className}`.trim()}>
      {image ? <img src={image} alt={label} loading="lazy" /> : <span>{initials(name || 'Student')}</span>}
    </span>
  );
}

function BloodSection({ stats, setBlood, switchTab }) {
  const groups = Object.entries(stats.bloodCounts)
    .filter(([group]) => normalize(group) !== 'unknown')
    .sort((a, b) => bloodOrder.indexOf(a[0]) - bloodOrder.indexOf(b[0]));
  const max = Math.max(...groups.map(([, count]) => count));
  const rareGroups = groups.filter(([, count]) => count <= 2).length;
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.[0] || 'O+');
  const selectedDonors = students
    .filter((student) => student.blood === selectedGroup && normalize(student.blood) !== 'unknown')
    .sort((a, b) => Number(normalize(b.hometown).includes('rajshahi')) - Number(normalize(a.hometown).includes('rajshahi')));

  return (
    <section className="insightSection donorSection">
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Donors</p>
          <h2>Find a matching donor before the group chat gets messy.</h2>
        </div>
      </div>
      <div className="donorHero">
        <div>
          <span className="storyLabel">Blood group bento</span>
          <h3>Tap a blood group to see everyone in that group.</h3>
          <p>A clean group-first view for quick lookup, with names, rolls, hometowns, and direct call buttons in the same panel.</p>
        </div>
        <Droplets size={74} />
      </div>
      <div className="donorOverview">
        <article>
          <span><HandHeart size={20} /></span>
          <b>{groups.reduce((sum, [, count]) => sum + count, 0)}</b>
          <p>students indexed for donor lookup</p>
        </article>
        <article>
          <span><Droplets size={20} /></span>
          <b>{groups.length}</b>
          <p>blood groups available</p>
        </article>
        <article>
          <span><Signal size={20} /></span>
          <b>{rareGroups}</b>
          <p>low-count groups to note quickly</p>
        </article>
      </div>
      <div className="bloodGrid">
        {groups.map(([group, count], index) => (
            <button
              className={[
                'bloodTile',
                selectedGroup === group ? 'active' : '',
                index % 5 === 0 ? 'wide' : '',
                index % 7 === 0 ? 'tall' : '',
              ].filter(Boolean).join(' ')}
              key={group}
              onClick={() => setSelectedGroup(group)}
              type="button"
            >
              {count <= 2 && <em>Rare signal</em>}
              <strong>{group}</strong>
              <span>{count} students</span>
              <i style={{ width: `${(count / max) * 100}%` }} />
            </button>
        ))}
      </div>
      <div className="donorExplorer single">
        <article className="donorPanel">
          <div className="donorPanelHead">
            <div>
              <span className="storyLabel">{selectedGroup}</span>
              <h3>{selectedDonors.length} people found</h3>
            </div>
          </div>
          <div className="donorRows">
            {selectedDonors.map((student) => (
              <div className="donorRow" key={student.roll}>
                <span className="miniAvatar">{initials(student.name)}</span>
                <div>
                  <b>{formatName(student.name)}</b>
                  <small>{student.roll} · {student.hometown || 'Hometown unknown'}</small>
                </div>
                <a href={`tel:${student.mobile}`}><Phone size={15} /> Call</a>
              </div>
            ))}
          </div>
          <footer>
            <span>Showing only students with a listed blood group.</span>
            <button
              onClick={() => {
                setBlood(selectedGroup);
                switchTab('directory');
              }}
              type="button"
            >
              View in roster
            </button>
          </footer>
        </article>
      </div>
    </section>
  );
}

function PhaseAlert({ onClose }) {
  return (
    <aside className="phaseAlert" role="status" aria-live="polite">
      <span className="phaseAlertIcon"><Signal size={18} /></span>
      <div>
        <b>Initial phase preview</b>
        <p>mETEoric 24 is live with the core directory now. More polished tools and batch features are coming soon.</p>
      </div>
      <button onClick={onClose} type="button" aria-label="Close alert">
        <X size={18} />
      </button>
    </aside>
  );
}

function Insights({ stats }) {
  const maxTown = Math.max(...stats.topHometowns.map(([, count]) => count));
  const bloodGroups = Object.keys(stats.bloodCounts).length;
  return (
    <section className="insightSection">
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Pulse</p>
          <h2>Quick signals from the batch data.</h2>
        </div>
      </div>
      <div className="pulseMetrics">
        <article>
          <span>Total roster</span>
          <strong>{students.length}</strong>
          <p>verified directory entries</p>
        </article>
        <article>
          <span>Blood coverage</span>
          <strong>{bloodGroups}</strong>
          <p>groups represented</p>
        </article>
        <article>
          <span>Top hometown</span>
          <strong>{stats.topHometowns[0]?.[0] || 'N/A'}</strong>
          <p>{stats.topHometowns[0]?.[1] || 0} students</p>
        </article>
      </div>
      <div className="statsLayout">
        <div className="chartBlock">
          <h3>Blood distribution</h3>
          {Object.entries(stats.bloodCounts).map(([group, count]) => (
            <div className="barRow" key={group}>
              <span>{group}</span>
              <div>
                <i style={{ width: `${(count / students.length) * 100}%` }} />
              </div>
              <b>{count}</b>
            </div>
          ))}
        </div>
        <div className="chartBlock">
          <h3>Top hometowns</h3>
          {stats.topHometowns.map(([town, count]) => (
            <div className="barRow" key={town}>
              <span>{town}</span>
              <div>
                <i style={{ width: `${(count / maxTown) * 100}%` }} />
              </div>
              <b>{count}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutDev() {
  const dev = students.find((student) => normalize(student.name).includes('hossain mohammod ratul'));
  const projects = [
    {
      name: 'ETE CGPA Calculator',
      href: 'https://ratuuul.github.io/calcgpa',
      bio: 'A CGPA calculator for RUET ETE students.',
    },
  ];
  return (
    <section id="about-dev" className="devSection">
      <div className="devFrame">
        <header className="devHeader">
          <div>
            <span className="storyLabel">About Dev</span>
            <h2>Developer of this directory.</h2>
            <p>
              This section stores the builder profile, project details, contact links, and the stack used for the
              mETEoric 24 directory.
            </p>
          </div>
          <a className="devTalk" href={dev?.email ? `mailto:${dev.email}` : '#directory'}>
            Let&apos;s Talk
          </a>
        </header>

        <div className="devBento">
          <article className="devPortraitCard">
            <div className="devImageSlot">
              <Avatar className="devAvatar" image={dev?.image} name={dev?.name || 'Hossain Mohammod Ratul'} />
              <span>Image will be added later</span>
            </div>
            <div className="devTimeline">
              <span><b>Project</b> mETEoric 24 directory</span>
              <span><b>Role</b> Frontend development</span>
              <span><b>Data</b> - </span>
            </div>
          </article>

          <article className="devProjectsCard">
            <div className="devCardHead">
              <span className="storyLabel">Projects</span>
              <small>{projects.length} listed</small>
            </div>
            <div className="projectList">
              {projects.map((project) => (
                <a className="projectItem" href={project.href} key={project.name} target="_blank" rel="noreferrer">
                  <span>
                    <b>{project.name}</b>
                    <small>{project.bio}</small>
                  </span>
                  <Code2 size={17} />
                </a>
              ))}
            </div>
          </article>

          <article className="devNoteCard">
            <Code2 size={22} />
            <p>
              Coming soon !
            </p>
            <b>{formatName(dev?.name || 'Hossain Mohammod Ratul')}</b>
            <small>Developer · mETEoric 24</small>
          </article>

          <article className="devContactCard">
            <div>
              <span className="storyLabel">Contact</span>
              <h3>Contact and updates</h3>
            </div>
            <div className="devContactPills">
              {dev?.email && <a href={`mailto:${dev.email}`}><Mail size={15} /> {dev.email}</a>}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function SignalStories({ selectedPostId, setSelectedPostId }) {
  const { posts } = signalPosts;
  const selectedPost = posts.find((post) => post.id === selectedPostId);

  if (selectedPost) {
    return <SignalPostPage post={selectedPost} onBack={() => setSelectedPostId(null)} />;
  }

  return (
    <section className="storySection">
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Signal Stories</p>
          <h2>Batch achievements, ready to publish.</h2>
        </div>
      </div>
      <div className="storyGrid">
        {posts.map((story, index) => (
          <article
            className="storyCard"
            key={story.id || story.title || index}
            style={{ animationDelay: `${index * 65}ms` }}
          >
            <button className="storyCardButton" onClick={() => setSelectedPostId(story.id)} type="button">
              {story.image && <img className="storyImage" src={story.image} alt={story.imageAlt || story.title} loading="lazy" />}
              <div className="storyMeta">
                <span>{story.label || 'Story'}</span>
                <small>{story.date || 'Date'}</small>
              </div>
              <h3 {...langProps(story.title)}>{story.title || 'Untitled achievement post'}</h3>
              <p {...langProps(story.excerpt || story.body)}>
                {story.excerpt || makeStoryPreview(story.body) || 'Story body will appear here when it is added to signalPosts.json.'}
              </p>
            </button>
            {story.tags?.length > 0 && (
              <div className="storyTags">
                {story.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            <footer>
              <b>{formatName(story.author || 'Author')}</b>
              <button onClick={() => setSelectedPostId(story.id)} type="button">{story.footer || 'Read story'}</button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function makeStoryPreview(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > 180 ? `${text.slice(0, 180).trim()}...` : text;
}

function SignalPostPage({ post, onBack }) {
  const [zoomedImage, setZoomedImage] = useState(false);
  return (
    <section className="postPage">
      <button className="backButton" onClick={onBack} type="button">
        Back to Signals
      </button>
      <article className="postArticle">
        <header>
          <span className="storyLabel">{post.label || 'Story'}</span>
          <h2 {...langProps(post.title)}>{post.title || 'Untitled achievement post'}</h2>
          <div className="postByline">
            <span>{formatName(post.author || 'Author')}</span>
            <span>{post.date || 'Date'}</span>
          </div>
        </header>
        {post.image ? (
          <button className="postImageButton" onClick={() => setZoomedImage(true)} type="button">
            <img className="postHeroImage" src={post.image} alt={post.imageAlt || post.title} loading="lazy" />
          </button>
        ) : (
          <div className="postImagePlaceholder">Add an image link in signalPosts.json</div>
        )}
        {post.tags?.length > 0 && (
          <div className="storyTags postTags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        <div className="postBody">
          {(post.body || 'Write the full story body in signalPosts.json. You can include the achievement context, names, event, result, and a closing note for the batch.')
            .split('\n')
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph} {...langProps(paragraph)}>{paragraph}</p>
            ))}
        </div>
        <footer className="postFooter">
          <span>{post.footer || 'mETEoric 24 Signals'}</span>
          <button onClick={onBack} type="button">Back to Signals</button>
        </footer>
      </article>
      {zoomedImage && (
        <div className="imageZoomBackdrop" onMouseDown={() => setZoomedImage(false)}>
          <button className="imageZoomClose" onClick={() => setZoomedImage(false)} type="button">
            <X size={20} />
            <span className="srOnly">Close image</span>
          </button>
          <div className="imageZoomFrame" onMouseDown={(event) => event.stopPropagation()}>
            <img src={post.image} alt={post.imageAlt || post.title} />
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="emptyState">
      <Search size={32} />
      <h3>No match in the roster</h3>
      <p>Try a shorter name, a roll prefix, a hometown, nickname, or blood group.</p>
      <button className="primaryCta" onClick={onReset} type="button">
        Show everyone again
      </button>
    </div>
  );
}

function ProfileModal({ student, onClose }) {
  const cr = isCr(student);
  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <article className="profileModal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="closeButton" onClick={onClose} type="button">
          <X size={20} />
          <span className="srOnly">Close</span>
        </button>
        <div className="profileHero">
          <span className="avatarShell largeShell">
            <Avatar className="large" name={student.name} image={student.image} />
            {cr && <span className="crownBadge largeCrown"><Crown size={16} /></span>}
          </span>
          <div>
            <p className="eyebrow">Roll {student.roll}</p>
            <h2>
              {formatName(student.name)}
              {cr && <em className="crTag">CR</em>}
            </h2>
            <p className="modalNick">{student.nickname || 'mETEoric 24'}</p>
          </div>
        </div>
        <div className="profileFactGrid">
          <span>
            <b>Blood</b>
            <strong><Droplets size={17} /> {student.blood || 'Unknown'}</strong>
          </span>
          <span>
            <b>Hometown</b>
            <strong><MapPin size={17} /> {student.hometown || 'Unknown'}</strong>
          </span>
          <span>
            <b>Roll</b>
            <strong>{student.roll}</strong>
          </span>
          <span>
            <b>Nickname</b>
            <strong>{student.nickname || 'mETEoric 24'}</strong>
          </span>
        </div>
        <div className="contactPanel">
          <a href={`tel:${student.mobile}`}>
            <span><Phone size={18} /></span>
            <b>Mobile</b>
            <strong>{student.mobile}</strong>
          </a>
          <a href={`mailto:${student.email}`}>
            <span><Mail size={18} /></span>
            <b>Email</b>
            <strong>{student.email}</strong>
          </a>
        </div>
      </article>
    </div>
  );
}

function TelecomLoader() {
  return (
    <div className="telecomLoader" role="status" aria-label="Loading mETEoric 24">
      <div className="towerWrap">
        <span className="signalRing ringOne" />
        <span className="signalRing ringTwo" />
        <span className="signalRing ringThree" />
        <RadioTower size={54} />
      </div>
      <p className="eyebrow">mETEoric 24</p>
      <h1>Locking onto the batch signal</h1>
      <div className="loadingBars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
