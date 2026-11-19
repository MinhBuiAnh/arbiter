import { FormEvent, ReactNode, useMemo, useState } from "react";

type Route =
  | "problems"
  | "problem"
  | "leaderboard"
  | "login"
  | "register"
  | "profile"
  | "password"
  | "practice"
  | "status"
  | "submissions"
  | "submission"
  | "progress"
  | "admin-problems"
  | "admin-problem-form"
  | "admin-cases"
  | "admin-case-form"
  | "admin-users"
  | "admin-submissions";

const publicRoutes: Route[] = ["problems", "problem", "leaderboard", "login", "register"];

type IconName =
  | "code"
  | "grid"
  | "list"
  | "trophy"
  | "user"
  | "shield"
  | "search"
  | "chevron"
  | "arrow"
  | "play"
  | "history"
  | "check"
  | "x"
  | "clock"
  | "refresh"
  | "edit"
  | "plus"
  | "trash"
  | "lock"
  | "terminal"
  | "settings"
  | "logout"
  | "info";

const paths: Record<IconName, ReactNode> = {
  code: (
    <>
      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1a4 4 0 0 0 4 4M17 6h3v1a4 4 0 0 1-4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  arrow: <path d="m15 18-6-6 6-6" />,
  play: <path d="m8 5 11 7-11 7V5Z" />,
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  x: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7h-5V2M4 17h5v5" />
      <path d="M5.5 9a7 7 0 0 1 11.7-3L20 7M4 17l2.8 1A7 7 0 0 0 18.5 15" />
    </>
  ),
  edit: (
    <>
      <path d="m14 4 6 6L8 22H2v-6L14 4Z" />
      <path d="m12 6 6 6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  terminal: (
    <>
      <path d="m4 7 5 5-5 5M12 17h8" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1-2.6 2.6-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21h-3.6v-.2A2 2 0 0 0 9 19a2 2 0 0 0-2.2.4l-.1.1-2.6-2.6.1-.1A2 2 0 0 0 4.6 15a2 2 0 0 0-1.8-1.2H2v-3.6h.8A2 2 0 0 0 4.6 9a2 2 0 0 0-.4-2.2l-.1-.1 2.6-2.6.1.1A2 2 0 0 0 9 4.6a2 2 0 0 0 1.2-1.8V2h3.6v.8A2 2 0 0 0 15 4.6a2 2 0 0 0 2.2-.4l.1-.1 2.6 2.6-.1.1a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2h.8v3.6h-.8a2 2 0 0 0-1.8 1.2Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H4v14h6M14 8l4 4-4 4M8 12h10" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const problems = [
  {
    id: "AR-001",
    title: "Two Sum",
    difficulty: "EASY",
    category: "Arrays",
    tags: ["Arrays", "Hash Map"],
    solved: true,
    acceptance: "71.2%",
    status: "PUBLISHED",
  },
  {
    id: "AR-014",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    category: "Strings",
    tags: ["Strings", "Sliding Window"],
    solved: true,
    acceptance: "48.7%",
    status: "PUBLISHED",
  },
  {
    id: "AR-027",
    title: "Merge K Sorted Lists",
    difficulty: "HARD",
    category: "Linked Lists",
    tags: ["Linked List", "Heap"],
    solved: false,
    acceptance: "33.4%",
    status: "PUBLISHED",
  },
  {
    id: "AR-038",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    category: "Trees",
    tags: ["Tree", "BFS"],
    solved: true,
    acceptance: "62.1%",
    status: "PUBLISHED",
  },
  {
    id: "AR-052",
    title: "Climbing Stairs",
    difficulty: "EASY",
    category: "Dynamic Programming",
    tags: ["Dynamic Programming"],
    solved: false,
    acceptance: "78.9%",
    status: "DRAFT",
  },
  {
    id: "AR-071",
    title: "Course Schedule",
    difficulty: "MEDIUM",
    category: "Graphs",
    tags: ["Graph", "DFS"],
    solved: false,
    acceptance: "45.6%",
    status: "DRAFT",
  },
];

const submissions = [
  {
    id: "SUB-9F2A1",
    problem: "Two Sum",
    lang: "Python 3",
    status: "COMPLETED",
    verdict: "ACCEPTED",
    time: "Today, 14:32",
    runtime: "42 ms",
    memory: "16.8 MB",
    user: "akira",
  },
  {
    id: "SUB-9F180",
    problem: "Course Schedule",
    lang: "C++17",
    status: "COMPLETED",
    verdict: "WRONG_ANSWER",
    time: "Today, 13:08",
    runtime: "8 ms",
    memory: "12.1 MB",
    user: "akira",
  },
  {
    id: "SUB-9EFC2",
    problem: "Merge K Sorted Lists",
    lang: "Python 3",
    status: "RUNNING",
    verdict: "",
    time: "Yesterday, 21:44",
    runtime: "—",
    memory: "—",
    user: "mira",
  },
  {
    id: "SUB-9EC11",
    problem: "Climbing Stairs",
    lang: "C++17",
    status: "COMPLETED",
    verdict: "TIME_LIMIT_EXCEEDED",
    time: "Yesterday, 18:12",
    runtime: "2,001 ms",
    memory: "9.4 MB",
    user: "ren",
  },
  {
    id: "SUB-9D882",
    problem: "Binary Tree Level Order Traversal",
    lang: "Python 3",
    status: "INTERNAL_ERROR",
    verdict: "",
    time: "Jun 18, 10:03",
    runtime: "—",
    memory: "—",
    user: "sora",
  },
];

function Badge({ children, kind = "neutral" }: { children: ReactNode; kind?: string }) {
  return <span className={`badge ${kind.toLowerCase()}`}>{children}</span>;
}

function Difficulty({ value }: { value: string }) {
  const bars = value === "EASY" ? 1 : value === "MEDIUM" ? 2 : 3;
  return (
    <Badge kind={value}>
      <span className="meter">
        {[1, 2, 3].map((n) => (
          <i key={n} className={n <= bars ? "on" : ""} />
        ))}
      </span>
      {value}
    </Badge>
  );
}

function Verdict({ value }: { value: string }) {
  if (!value) return <span className="muted">Awaiting judgment</span>;
  return (
    <Badge kind={value}>
      <Icon
        name={value === "ACCEPTED" ? "check" : value.includes("LIMIT") ? "clock" : "x"}
        size={13}
      />
      {value.replaceAll("_", " ")}
    </Badge>
  );
}

function Button({
  children,
  icon,
  variant = "secondary",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  icon?: IconName;
  variant?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button className={`btn ${variant}`} onClick={onClick} type={type} disabled={disabled}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

function PageHead({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="head-actions">{actions}</div>}
    </div>
  );
}

function Field({ label, children, help }: { label: string; children: ReactNode; help?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {help && <small>{help}</small>}
    </label>
  );
}

function Modal({
  title,
  children,
  confirm,
  danger = false,
  onClose,
  onConfirm,
}: {
  title: string;
  children: ReactNode;
  confirm: string;
  danger?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <div
      className="modal-wrap"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-mark" />
        <h2>{title}</h2>
        <div className="modal-copy">{children}</div>
        <div className="modal-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState<Route>("progress");
  const [signedIn, setSignedIn] = useState(true);
  const [pendingRoute, setPendingRoute] = useState<Route | null>(null);
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [selectedSubmission, setSelectedSubmission] = useState(submissions[0]);
  const [adminProblem, setAdminProblem] = useState(
    problems.find((p) => p.status === "DRAFT") ?? problems[0],
  );
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [modal, setModal] = useState<null | {
    title: string;
    text: string;
    confirm: string;
    danger?: boolean;
    onConfirm?: () => void;
  }>(null);
  const [toast, setToast] = useState("");

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const go = (next: Route) => {
    if (!signedIn && !publicRoutes.includes(next)) {
      setPendingRoute(next);
      next = "login";
    }
    setRoute(next);
    setAccountOpen(false);
    setAdminOpen(false);
    scrollTop();
  };
  const openProblem = (p = problems[0]) => {
    setSelectedProblem(p);
    go("problem");
  };
  const openSubmission = (s = submissions[0]) => {
    setSelectedSubmission(s);
    go(s.status === "RUNNING" ? "status" : "submission");
  };
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };
  const completeLogin = () => {
    setSignedIn(true);
    const destination = pendingRoute ?? "progress";
    setPendingRoute(null);
    setRoute(destination);
    setAccountOpen(false);
    setAdminOpen(false);
    scrollTop();
    notify("Signed in as Akira Chen.");
  };
  const signOut = () => {
    setSignedIn(false);
    setPendingRoute(null);
    setRoute("problems");
    setAccountOpen(false);
    setAdminOpen(false);
    scrollTop();
    notify("You have been signed out. Signed-in areas now require authentication.");
  };
  const openTestCases = (p: (typeof problems)[0]) => {
    setAdminProblem(p);
    go("admin-cases");
  };
  const adminRoutes: { label: string; route: Route; icon: IconName }[] = [
    { label: "Problems", route: "admin-problems", icon: "list" },
    { label: "Users", route: "admin-users", icon: "user" },
    { label: "Submissions", route: "admin-submissions", icon: "terminal" },
  ];
  const isAdmin = route.startsWith("admin");

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go(signedIn ? "progress" : "problems")}
          aria-label="Arbiter home"
        >
          <span className="brand-mark">
            <i />
            <i />
          </span>
          <span>ARBITER</span>
        </button>
        <nav className="main-nav" aria-label="Primary">
          <button
            className={route === "problems" || route === "problem" ? "active" : ""}
            onClick={() => go("problems")}
          >
            Problems
          </button>
          <button
            className={route === "leaderboard" ? "active" : ""}
            onClick={() => go("leaderboard")}
          >
            Leaderboard
          </button>
          {signedIn && (
            <>
              <button
                className={route === "progress" ? "active" : ""}
                onClick={() => go("progress")}
              >
                Progress
              </button>
              <button
                className={["submissions", "submission", "status"].includes(route) ? "active" : ""}
                onClick={() => go("submissions")}
              >
                Submissions
              </button>
              <div className="nav-pop">
                <button
                  className={isAdmin ? "active" : ""}
                  onClick={() => setAdminOpen((v) => !v)}
                >
                  <Icon name="shield" size={16} /> Admin <Badge kind="admin">Admin</Badge>
                </button>
                {adminOpen && (
                  <div className="dropdown admin-menu">
                    {adminRoutes.map((item) => (
                      <button key={item.route} onClick={() => go(item.route)}>
                        <Icon name={item.icon} />
                        {item.label}
                        <Icon name="chevron" size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
        {signedIn ? (
          <div className="account nav-pop">
            <button className="account-button" onClick={() => setAccountOpen((v) => !v)}>
              <span className="avatar">AK</span>
              <span>
                <b>Akira Chen</b>
                <small>@akira</small>
              </span>
              <span className="down">⌄</span>
            </button>
            {accountOpen && (
              <div className="dropdown account-menu">
                <button onClick={() => go("profile")}>
                  <Icon name="user" />
                  Profile
                </button>
                <button onClick={() => go("password")}>
                  <Icon name="lock" />
                  Security
                </button>
                <hr />
                <button
                  onClick={() =>
                    setModal({
                      title: "Leave the arena?",
                      text: "You will be signed out of this session and returned to the public problem list.",
                      confirm: "Sign out",
                      danger: true,
                      onConfirm: signOut,
                    })
                  }
                >
                  <Icon name="logout" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="guest-actions">
            <button
              className={route === "login" ? "active" : ""}
              onClick={() => go("login")}
            >
              Sign in
            </button>
            <Button variant="primary" onClick={() => go("register")}>
              Create account
            </Button>
          </div>
        )}
      </header>
      <main className={isAdmin ? "wide" : ""}>
        {route === "problems" && <ProblemList openProblem={openProblem} />}
        {route === "problem" && <ProblemDetail problem={selectedProblem} go={go} />}
        {route === "leaderboard" && <Leaderboard />}
        {route === "login" && <Auth mode="login" go={go} onLogin={completeLogin} />}
        {route === "register" && <Auth mode="register" go={go} onLogin={completeLogin} />}
        {route === "profile" && <Profile go={go} notify={notify} setModal={setModal} />}
        {route === "password" && <ChangePassword go={go} notify={notify} />}
        {route === "practice" && <Practice problem={selectedProblem} go={go} setModal={setModal} />}
        {route === "status" && <SubmissionStatus submission={selectedSubmission} go={go} />}
        {route === "submissions" && <SubmissionHistory openSubmission={openSubmission} />}
        {route === "submission" && <SubmissionDetail submission={selectedSubmission} go={go} />}
        {route === "progress" && <Progress openSubmission={openSubmission} go={go} />}
        {route === "admin-problems" && (
          <AdminProblems
            go={go}
            setModal={setModal}
            notify={notify}
            openTestCases={openTestCases}
          />
        )}
        {route === "admin-problem-form" && <ProblemForm go={go} notify={notify} />}
        {route === "admin-cases" && (
          <TestCases
            problem={adminProblem}
            go={go}
            setModal={setModal}
            notify={notify}
          />
        )}
        {route === "admin-case-form" && (
          <TestCaseForm problem={adminProblem} go={go} notify={notify} />
        )}
        {route === "admin-users" && <AdminUsers setModal={setModal} />}
        {route === "admin-submissions" && <AdminSubmissions />}
      </main>
      {modal && (
        <Modal
          title={modal.title}
          confirm={modal.confirm}
          danger={modal.danger}
          onClose={() => setModal(null)}
          onConfirm={modal.onConfirm}
        >
          <p>{modal.text}</p>
        </Modal>
      )}
      {toast && (
        <div className="toast">
          <Icon name="check" />
          <div>
            <b>Operation complete</b>
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast("")} aria-label="Dismiss">
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function ProblemList({ openProblem }: { openProblem: (p: (typeof problems)[0]) => void }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const filtered = useMemo(
    () =>
      problems.filter(
        (p) =>
          (!query ||
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.join(" ").toLowerCase().includes(query.toLowerCase())) &&
          (difficulty === "ALL" || p.difficulty === difficulty),
      ),
    [query, difficulty],
  );
  return (
    <>
      <PageHead
        eyebrow="Problem archive"
        title="Choose your challenge"
        description="Sharpen your reasoning across algorithms, data structures, and systems."
        actions={
          <div className="stat-inline">
            <span>
              <b>128</b> problems
            </span>
            <span>
              <b>34</b> solved
            </span>
          </div>
        }
      />
      <section className="filter-bar">
        <div className="search">
          <Icon name="search" />
          <input
            aria-label="Search problems"
            placeholder="Search by title or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Difficulty"
        >
          <option value="ALL">All difficulties</option>
          <option>EASY</option>
          <option>MEDIUM</option>
          <option>HARD</option>
        </select>
        <select aria-label="Category">
          <option>All categories</option>
          <option>Arrays</option>
          <option>Graphs</option>
          <option>Trees</option>
        </select>
        <select aria-label="Sort">
          <option>Newest first</option>
          <option>Acceptance rate</option>
          <option>Difficulty</option>
        </select>
      </section>
      <section className="table-card">
        <div className="table-meta">
          <span>{filtered.length} challenges</span>
          <span className="legend">
            <i className="solved-dot" /> Solved
          </span>
        </div>
        <div className="problem-list">
          {filtered.map((p, i) => (
            <button className="problem-row" onClick={() => openProblem(p)} key={p.id}>
              <span className="row-index">
                {p.solved ? <Icon name="check" size={17} /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="problem-main">
                <b>{p.title}</b>
                <small className="mono">{p.id}</small>
              </span>
              <span className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
              <span className="acceptance">
                {p.acceptance}
                <small>acceptance</small>
              </span>
              <Difficulty value={p.difficulty} />
              <Icon name="chevron" />
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty">
            <Icon name="search" size={32} />
            <h2>No matching challenges</h2>
            <p>Try widening your search or clearing a filter.</p>
            <Button
              variant="primary"
              onClick={() => {
                setQuery("");
                setDifficulty("ALL");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
        <div className="pagination">
          <Button disabled icon="arrow">
            Previous
          </Button>
          <span>
            Page <b>1</b> of 22
          </span>
          <Button>
            Next <Icon name="chevron" />
          </Button>
        </div>
      </section>
    </>
  );
}

function ProblemDetail({ problem, go }: { problem: (typeof problems)[0]; go: (r: Route) => void }) {
  return (
    <>
      <button className="back-link" onClick={() => go("problems")}>
        <Icon name="arrow" /> Back to problems
      </button>
      <PageHead
        eyebrow={problem.id}
        title={problem.title}
        description="Find two distinct elements whose values add up to the given target."
        actions={
          <Button variant="primary" icon="play" onClick={() => go("practice")}>
            Solve challenge
          </Button>
        }
      />
      <div className="detail-layout">
        <article className="prose panel">
          <div className="problem-badges">
            <Difficulty value={problem.difficulty} />
            {problem.tags.map((t) => (
              <Badge kind="tag" key={t}>
                {t}
              </Badge>
            ))}
          </div>
          <h2>Problem statement</h2>
          <p>
            Given an array of integers <code>nums</code> and an integer <code>target</code>, return
            the indices of the two numbers such that they add up to <code>target</code>.
          </p>
          <p>
            You may assume that each input has exactly one solution, and you may not use the same
            element twice. Return the answer in any order.
          </p>
          <h2>Input format</h2>
          <p>
            The first line contains an integer <code>n</code>, the number of elements. The second
            line contains <code>n</code> space-separated integers. The final line contains the
            target integer.
          </p>
          <h2>Output format</h2>
          <p>Print two zero-based indices separated by a single space.</p>
          <h2>Constraints</h2>
          <pre>2 ≤ n ≤ 10⁵{"\n"}−10⁹ ≤ nums[i], target ≤ 10⁹</pre>
          <h2>Sample</h2>
          <div className="samples">
            <div>
              <b>Input</b>
              <pre>
                4{"\n"}2 7 11 15{"\n"}9
              </pre>
            </div>
            <div>
              <b>Output</b>
              <pre>0 1</pre>
            </div>
          </div>
          <div className="info-note">
            <Icon name="info" />
            <span>
              The output is <code>0 1</code> because <code>nums[0] + nums[1] = 9</code>.
            </span>
          </div>
        </article>
        <aside className="detail-side">
          <div className="panel">
            <h3>Execution limits</h3>
            <dl>
              <div>
                <dt>Time limit</dt>
                <dd>2 seconds</dd>
              </div>
              <div>
                <dt>Memory limit</dt>
                <dd>256 MB</dd>
              </div>
            </dl>
          </div>
          <div className="panel">
            <h3>Supported languages</h3>
            <div className="language">
              <Icon name="code" />
              <span>
                <b>C++17</b>
                <small>GNU Compiler Collection</small>
              </span>
            </div>
            <div className="language">
              <Icon name="terminal" />
              <span>
                <b>Python 3</b>
                <small>CPython 3.11</small>
              </span>
            </div>
          </div>
          <div className="panel">
            <h3>Community result</h3>
            <div className="accept-ring">
              <span>
                <b>71.2%</b>
                <small>acceptance</small>
              </span>
            </div>
            <dl>
              <div>
                <dt>Submissions</dt>
                <dd>48,219</dd>
              </div>
              <div>
                <dt>Accepted</dt>
                <dd>34,332</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </>
  );
}

function Leaderboard() {
  const leaders = [
    ["1", "NX", "nox", "Nora Xu", "214", "91.4%"],
    ["2", "TL", "turing_lab", "Theo Lin", "208", "89.7%"],
    ["3", "MK", "miko", "Mika Kovács", "197", "88.2%"],
    ["4", "AK", "akira", "Akira Chen", "184", "86.9%"],
    ["5", "IV", "ivana", "Ivana Petrova", "176", "85.1%"],
    ["6", "RS", "rustacean", "Rui Santos", "169", "82.8%"],
  ];
  return (
    <>
      <PageHead
        eyebrow="Global standings"
        title="Leaderboard"
        description="The strongest problem solvers, ranked by challenges conquered."
        actions={<Button icon="refresh">Refresh ranking</Button>}
      />
      <div className="podium">
        <div className="podium-place second">
          <span className="rank">02</span>
          <div className="big-avatar">TL</div>
          <b>turing_lab</b>
          <small>208 solved</small>
        </div>
        <div className="podium-place first">
          <Icon name="trophy" size={26} />
          <span className="rank">01</span>
          <div className="big-avatar">NX</div>
          <b>nox</b>
          <small>214 solved</small>
        </div>
        <div className="podium-place third">
          <span className="rank">03</span>
          <div className="big-avatar">MK</div>
          <b>miko</b>
          <small>197 solved</small>
        </div>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Arbiter</th>
              <th>Display name</th>
              <th className="num">Solved</th>
              <th className="num">Acceptance</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((l) => (
              <tr className={l[2] === "akira" ? "selected" : ""} key={l[1]}>
                <td className="rank-cell">#{l[0]}</td>
                <td>
                  <div className="user-cell">
                    <span className="avatar">{l[1]}</span>
                    <b>{l[2]}</b>
                    {l[2] === "akira" && <Badge kind="tag">You</Badge>}
                  </div>
                </td>
                <td>{l[3]}</td>
                <td className="num strong">{l[4]}</td>
                <td className="num">{l[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Auth({
  mode,
  go,
  onLogin,
}: {
  mode: "login" | "register";
  go: (r: Route) => void;
  onLogin: () => void;
}) {
  const register = mode === "register";
  const [registered, setRegistered] = useState(false);
  return (
    <div className="auth-layout">
      <div className="auth-art">
        <div className="brand-mark large">
          <i />
          <i />
        </div>
        <div className="eyebrow">Enter the arena</div>
        <h1>
          Measure your logic.
          <br />
          <em>Master the craft.</em>
        </h1>
        <p>Join a community of builders testing their skill against carefully judged challenges.</p>
        <div className="lattice" />
      </div>
      {registered ? (
        <div className="auth-card auth-success">
          <span className="success-mark">
            <Icon name="check" size={24} />
          </span>
          <div className="eyebrow">Registration complete</div>
          <h2>Your account is ready</h2>
          <p>Sign in with your new credentials to continue into the arena.</p>
          <div className="info-note">
            <Icon name="info" />
            <span>A confirmation has been sent to the email address you provided.</span>
          </div>
          <Button variant="primary" onClick={() => go("login")}>
            Continue to sign in
          </Button>
        </div>
      ) : (
        <form
          className="auth-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (register) {
              setRegistered(true);
            } else {
              onLogin();
            }
          }}
        >
          <div className="eyebrow">{register ? "New contender" : "Welcome back"}</div>
          <h2>{register ? "Create your account" : "Sign in to Arbiter"}</h2>
          <p>
            {register ? "Your next challenge awaits." : "Continue your path through the archive."}
          </p>
          {register && (
            <Field label="Username">
              <input required placeholder="Choose a unique username" />
            </Field>
          )}
          <Field label={register ? "Email address" : "Email or username"}>
            <input
              required
              placeholder={register ? "you@example.com" : "akira or akira@example.com"}
            />
          </Field>
          <Field label="Password">
            <input type="password" required placeholder="At least 8 characters" />
          </Field>
          {register && (
            <Field label="Confirm password">
              <input type="password" required placeholder="Repeat your password" />
            </Field>
          )}
          <Button variant="primary" type="submit">
            {register ? "Create account" : "Sign in"}
          </Button>
          <div className="auth-switch">
            {register ? "Already registered?" : "New to Arbiter?"}{" "}
            <button type="button" onClick={() => go(register ? "login" : "register")}>
              {register ? "Sign in" : "Create an account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Profile({
  go,
  notify,
  setModal,
}: {
  go: (r: Route) => void;
  notify: (s: string) => void;
  setModal: (v: any) => void;
}) {
  const [edit, setEdit] = useState(false);
  return (
    <>
      <PageHead
        eyebrow="Account"
        title="Your profile"
        description="Manage how you appear across the Arbiter community."
        actions={<Button icon="refresh">Refresh</Button>}
      />
      <div className="profile-grid">
        <aside className="panel identity">
          <div className="profile-avatar">AK</div>
          <h2>Akira Chen</h2>
          <p>@akira</p>
          <Badge kind="admin">
            <Icon name="shield" size={13} /> Administrator
          </Badge>
          <div className="identity-stats">
            <span>
              <b>184</b>
              <small>Solved</small>
            </span>
            <span>
              <b>86.9%</b>
              <small>Accepted</small>
            </span>
          </div>
          <small>Member since February 12, 2024</small>
        </aside>
        <section className="panel profile-form">
          <div className="section-head">
            <div>
              <h2>Account information</h2>
              <p>Your public details and contact information.</p>
            </div>
            {!edit && (
              <Button icon="edit" onClick={() => setEdit(true)}>
                Edit profile
              </Button>
            )}
          </div>
          <Field label="Username">
            <input value="akira" readOnly />
          </Field>
          <Field label="Display name">
            <input defaultValue="Akira Chen" readOnly={!edit} />
          </Field>
          <Field label="Email address">
            <input defaultValue="akira@example.com" readOnly={!edit} />
          </Field>
          <Field label="Bio">
            <textarea
              defaultValue="Backend engineer. Competitive programming enthusiast. Always looking for a cleaner proof."
              readOnly={!edit}
              rows={4}
            />
          </Field>
          {edit && (
            <div className="form-actions">
              <Button
                onClick={() =>
                  setModal({
                    title: "Discard unsaved changes?",
                    text: "Your edits to this profile will be lost.",
                    confirm: "Discard",
                    danger: true,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setEdit(false);
                  notify("Profile ARB-USR-041 updated successfully.");
                }}
              >
                Save changes
              </Button>
            </div>
          )}
          <div className="security-row">
            <span>
              <Icon name="lock" />
              <span>
                <b>Password & security</b>
                <small>Last changed 3 months ago</small>
              </span>
            </span>
            <Button onClick={() => go("password")}>Change password</Button>
          </div>
        </section>
      </div>
    </>
  );
}

function ChangePassword({ go, notify }: { go: (r: Route) => void; notify: (s: string) => void }) {
  return (
    <>
      <button className="back-link" onClick={() => go("profile")}>
        <Icon name="arrow" /> Back to profile
      </button>
      <PageHead
        eyebrow="Account security"
        title="Change password"
        description="Choose a strong password you do not use elsewhere."
      />
      <form
        className="panel focused-form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          notify("Password changed. Please sign in again.");
          go("login");
        }}
      >
        <div className="info-note">
          <Icon name="info" />
          <span>You will be signed out on all devices after changing your password.</span>
        </div>
        <Field label="Current password">
          <input type="password" required />
        </Field>
        <Field label="New password" help="At least 8 characters with a number and symbol.">
          <input type="password" required />
        </Field>
        <Field label="Confirm new password">
          <input type="password" required />
        </Field>
        <div className="form-actions">
          <Button onClick={() => go("profile")}>Cancel</Button>
          <Button variant="primary" type="submit">
            Update password
          </Button>
        </div>
      </form>
    </>
  );
}

const templates = {
  "Python 3": `def two_sum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, value in enumerate(nums):\n        if target - value in seen:\n            return [seen[target - value], i]\n        seen[value] = i\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nprint(*two_sum(nums, target))`,
  "C++17": `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
};

function Practice({
  problem,
  go,
  setModal,
}: {
  problem: (typeof problems)[0];
  go: (r: Route) => void;
  setModal: (v: any) => void;
}) {
  const [lang, setLang] = useState<"Python 3" | "C++17">("Python 3");
  const [code, setCode] = useState(templates["Python 3"]);
  const changeLang = (l: "Python 3" | "C++17") => {
    setLang(l);
    setCode(templates[l]);
  };
  return (
    <div className="workspace">
      <div className="workspace-bar">
        <div>
          <button onClick={() => go("problem")}>
            <Icon name="arrow" />
          </button>
          <span>
            <small>{problem.id}</small>
            <b>{problem.title}</b>
          </span>
          <Difficulty value={problem.difficulty} />
        </div>
        <div>
          <span className="limit">2 sec</span>
          <span className="limit">256 MB</span>
          <Button icon="history" onClick={() => go("submissions")}>
            History
          </Button>
        </div>
      </div>
      <div className="editor-layout">
        <aside className="workspace-problem">
          <div className="tabs">
            <button className="active">Description</button>
            <button>Solutions</button>
          </div>
          <h2>{problem.title}</h2>
          <p>
            Given an array of integers <code>nums</code> and an integer <code>target</code>, return
            indices of the two numbers such that they add up to target.
          </p>
          <h3>Example</h3>
          <pre>Input: nums = [2,7,11,15], target = 9{"\n"}Output: [0,1]</pre>
          <h3>Constraints</h3>
          <ul>
            <li>2 ≤ nums.length ≤ 10⁵</li>
            <li>Exactly one valid answer exists.</li>
          </ul>
        </aside>
        <section className="code-panel">
          <div className="editor-toolbar">
            <select value={lang} onChange={(e) => changeLang(e.target.value as any)}>
              <option>Python 3</option>
              <option>C++17</option>
            </select>
            <div>
              <button
                onClick={() =>
                  setModal({
                    title: "Restore starter template?",
                    text: `Your current ${lang} source will be replaced by the default template.`,
                    confirm: "Restore",
                    danger: true,
                  })
                }
              >
                <Icon name="refresh" />
                Restore
              </button>
              <button
                onClick={() =>
                  setModal({
                    title: "Clear all source?",
                    text: `This will remove all code in the ${lang} editor. This action cannot be undone.`,
                    confirm: "Clear source",
                    danger: true,
                  })
                }
              >
                <Icon name="trash" />
                Clear
              </button>
            </div>
          </div>
          <div className="code-editor">
            <div className="line-nums">
              {code.split("\n").map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="Source code editor"
            />
          </div>
          <div className="editor-footer">
            <span className="mono">{code.length} bytes · Ln 1, Col 1</span>
            <Button variant="primary" icon="play" onClick={() => go("status")}>
              Submit solution
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SubmissionStatus({
  submission,
  go,
}: {
  submission: (typeof submissions)[0];
  go: (r: Route) => void;
}) {
  const [stage, setStage] = useState(2);
  const steps = ["Queued", "Compiling", "Running", "Completed"];
  return (
    <>
      <button className="back-link" onClick={() => go("submissions")}>
        <Icon name="arrow" /> Submission history
      </button>
      <PageHead
        eyebrow="Live judgment"
        title="Submission status"
        description={`Tracking ${submission.id}`}
      />
      <div className="judgment panel">
        <div className="judgment-top">
          <div className="pulse">
            <Icon name={stage === 3 ? "check" : "terminal"} size={28} />
          </div>
          <div>
            <Badge kind={stage === 3 ? "COMPLETED" : "RUNNING"}>
              {stage === 3 ? "COMPLETED" : "RUNNING"}
            </Badge>
            <h2>{stage === 3 ? "Judgment complete" : "Executing your solution"}</h2>
            <p>
              {stage === 3
                ? "All test cases finished. Your result is ready."
                : "Your code is running against the private test set."}
            </p>
          </div>
        </div>
        <div className="timeline">
          {steps.map((s, i) => (
            <div className={i <= stage ? "done" : ""} key={s}>
              <span>{i < stage || stage === 3 ? <Icon name="check" size={14} /> : i + 1}</span>
              <b>{s}</b>
              <small>
                {i < stage
                  ? ["14:32:06", "14:32:07", "14:32:08"][i]
                  : i === stage
                    ? "In progress"
                    : "Pending"}
              </small>
            </div>
          ))}
        </div>
        <div className="submission-summary">
          <span>
            <small>Problem</small>
            <b>Two Sum</b>
          </span>
          <span>
            <small>Language</small>
            <b>Python 3</b>
          </span>
          <span>
            <small>Submitted</small>
            <b>Today, 14:32:06</b>
          </span>
        </div>
        <div className="judgment-actions">
          {stage < 3 ? (
            <>
              <p>
                <Icon name="refresh" /> Status updates automatically without reloading.
              </p>
              <Button onClick={() => setStage(3)}>Simulate completion</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => go("submission")}>
              View result <Icon name="chevron" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function SubmissionHistory({
  openSubmission,
}: {
  openSubmission: (s: (typeof submissions)[0]) => void;
}) {
  return (
    <>
      <PageHead
        eyebrow="Your record"
        title="Submission history"
        description="Review every attempt, from first compile to final verdict."
      />
      <section className="filter-bar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Search problem or submission ID…" />
        </div>
        <select>
          <option>All problems</option>
          <option>Two Sum</option>
        </select>
        <select>
          <option>All verdicts</option>
          <option>Accepted</option>
          <option>Wrong answer</option>
        </select>
      </section>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Submission</th>
              <th>Problem</th>
              <th>Language</th>
              <th>Status</th>
              <th>Verdict</th>
              <th>Submitted</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} onClick={() => openSubmission(s)} className="clickable">
                <td className="mono">{s.id}</td>
                <td className="strong">{s.problem}</td>
                <td>{s.lang}</td>
                <td>
                  <Badge kind={s.status}>{s.status.replace("_", " ")}</Badge>
                </td>
                <td>
                  {s.status === "INTERNAL_ERROR" ? (
                    <span className="system-text">System failure</span>
                  ) : (
                    <Verdict value={s.verdict} />
                  )}
                </td>
                <td>{s.time}</td>
                <td>
                  <Icon name="chevron" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Showing 1–5 of 48</span>
          <div>
            <Button disabled>Previous</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>
    </>
  );
}

function SubmissionDetail({
  submission,
  go,
}: {
  submission: (typeof submissions)[0];
  go: (r: Route) => void;
}) {
  const verdict = submission.verdict || "ACCEPTED";
  return (
    <>
      <button className="back-link" onClick={() => go("submissions")}>
        <Icon name="arrow" /> Submission history
      </button>
      <PageHead
        eyebrow={submission.id}
        title={submission.problem}
        description={`Submitted ${submission.time} in ${submission.lang}`}
        actions={
          <Button icon="edit" onClick={() => go("practice")}>
            Open in editor
          </Button>
        }
      />
      <div className="result-hero panel">
        <div>
          <span className={`verdict-icon ${verdict.toLowerCase()}`}>
            <Icon name={verdict === "ACCEPTED" ? "check" : "x"} size={30} />
          </span>
          <div>
            <small>Final verdict</small>
            <h2>{verdict.replaceAll("_", " ")}</h2>
            <p>
              {verdict === "ACCEPTED"
                ? "Your solution passed every test case."
                : "Your output did not match the expected result on one or more cases."}
            </p>
          </div>
        </div>
        <div className="result-metrics">
          <span>
            <small>Runtime</small>
            <b>{submission.runtime === "—" ? "42 ms" : submission.runtime}</b>
          </span>
          <span>
            <small>Peak memory</small>
            <b>{submission.memory === "—" ? "16.8 MB" : submission.memory}</b>
          </span>
          <span>
            <small>Cases passed</small>
            <b>{verdict === "ACCEPTED" ? "18 / 18" : "7 / 18"}</b>
          </span>
        </div>
      </div>
      <div className="submission-grid">
        <section className="panel">
          <div className="section-head">
            <h2>Source code</h2>
            <Badge kind="tag">{submission.lang}</Badge>
          </div>
          <pre className="source-code">{templates["Python 3"]}</pre>
        </section>
        <section className="panel cases-panel">
          <h2>Executed cases</h2>
          {[1, 2, 3, 4].map((i) => (
            <div className="case-result" key={i}>
              <span>
                <Icon name="check" />
                <b>Case {String(i).padStart(2, "0")}</b>
              </span>
              <Badge kind="ACCEPTED">PASSED</Badge>
              <span>{35 + i * 2} ms</span>
              <span>{(15.8 + i / 10).toFixed(1)} MB</span>
            </div>
          ))}
          <div className="safe-note">
            <Icon name="shield" />
            <span>Hidden inputs and expected outputs remain protected.</span>
          </div>
        </section>
      </div>
    </>
  );
}

function Progress({
  openSubmission,
  go,
}: {
  openSubmission: (s: (typeof submissions)[0]) => void;
  go: (r: Route) => void;
}) {
  return (
    <>
      <PageHead
        eyebrow="Your campaign"
        title="Progress dashboard"
        description="A clear view of your momentum, strengths, and next frontier."
        actions={<Button icon="refresh">Refresh data</Button>}
      />
      <div className="metric-grid">
        <div className="metric-card accent">
          <span className="metric-icon">
            <Icon name="check" />
          </span>
          <small>Problems solved</small>
          <b>34</b>
          <p>of 128 available</p>
          <div className="mini-progress">
            <i style={{ width: "27%" }} />
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-icon teal">
            <Icon name="terminal" />
          </span>
          <small>Attempted</small>
          <b>41</b>
          <p>7 still unresolved</p>
          <div className="mini-progress teal">
            <i style={{ width: "32%" }} />
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-icon green">
            <Icon name="trophy" />
          </span>
          <small>Acceptance rate</small>
          <b>86.9%</b>
          <p>+2.4% this month</p>
          <div className="mini-progress green">
            <i style={{ width: "87%" }} />
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-icon amber">
            <Icon name="code" />
          </span>
          <small>Submissions</small>
          <b>62</b>
          <p>12 this month</p>
          <div className="spark">
            {[30, 54, 42, 68, 55, 85, 74].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="panel difficulty-panel">
          <div className="section-head">
            <div>
              <h2>Difficulty breakdown</h2>
              <p>Challenges solved by level</p>
            </div>
            <span className="big-percent">27%</span>
          </div>
          {[
            ["EASY", 18, 42],
            ["MEDIUM", 13, 56],
            ["HARD", 3, 30],
          ].map((row) => (
            <div className="breakdown" key={String(row[0])}>
              <div>
                <Difficulty value={String(row[0])} />
                <span>
                  <b>{row[1]}</b> solved
                </span>
              </div>
              <div>
                <i className={String(row[0]).toLowerCase()} style={{ width: `${row[2]}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="panel tags-panel">
          <div className="section-head">
            <div>
              <h2>Strongest domains</h2>
              <p>Your most practiced categories</p>
            </div>
            <button>View all</button>
          </div>
          {[
            ["Arrays", 12, 88],
            ["Strings", 8, 72],
            ["Dynamic programming", 6, 58],
            ["Graphs", 5, 45],
            ["Trees", 3, 31],
          ].map(([n, c, w]) => (
            <div className="tag-row" key={n}>
              <span>{n}</span>
              <div>
                <i style={{ width: `${w}%` }} />
              </div>
              <b>{c}</b>
            </div>
          ))}
        </section>
      </div>
      <section className="panel recent">
        <div className="section-head">
          <div>
            <h2>Recent submissions</h2>
            <p>Your last five judgments</p>
          </div>
          <button onClick={() => go("submissions")}>
            View history <Icon name="chevron" />
          </button>
        </div>
        {submissions.slice(0, 4).map((s) => (
          <button onClick={() => openSubmission(s)} className="recent-row" key={s.id}>
            <span className="status-glyph">
              <Icon
                name={s.verdict === "ACCEPTED" ? "check" : s.status === "RUNNING" ? "refresh" : "x"}
              />
            </span>
            <span>
              <b>{s.problem}</b>
              <small className="mono">{s.id}</small>
            </span>
            <span>{s.lang}</span>
            <span>
              {s.status === "INTERNAL_ERROR" ? (
                <span className="system-text">System failure</span>
              ) : s.verdict ? (
                <Verdict value={s.verdict} />
              ) : (
                <Badge kind={s.status}>{s.status}</Badge>
              )}
            </span>
            <time>{s.time}</time>
            <Icon name="chevron" />
          </button>
        ))}
      </section>
    </>
  );
}

function AdminHead({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <>
      <div className="admin-banner">
        <Icon name="shield" />
        <span>Administrator workspace</span>
        <i>Authorized personnel only</i>
      </div>
      <PageHead
        eyebrow="Platform control"
        title={title}
        description={description}
        actions={actions}
      />
    </>
  );
}

function AdminProblems({
  go,
  setModal,
  notify,
  openTestCases,
}: {
  go: (r: Route) => void;
  setModal: (v: any) => void;
  notify: (s: string) => void;
  openTestCases: (p: (typeof problems)[0]) => void;
}) {
  const [selected, setSelected] = useState(
    problems.find((p) => p.status === "DRAFT") ?? problems[0],
  );
  const selectedIndex = problems.findIndex((p) => p.id === selected.id);
  const version = 4 + Math.max(selectedIndex, 0);
  const isPublished = selected.status === "PUBLISHED";
  const canManageTestCases = selected.status === "DRAFT";
  return (
    <>
      <AdminHead
        title="Problem management"
        description="Control challenge lifecycle, metadata, and public visibility."
        actions={
          <Button variant="primary" icon="plus" onClick={() => go("admin-problem-form")}>
            Create problem
          </Button>
        }
      />
      <div className="admin-split">
        <section className="table-card">
          <div className="compact-filter">
            <div className="search">
              <Icon name="search" />
              <input placeholder="Search problems…" />
            </div>
            <select>
              <option>All states</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
          <div className="admin-list">
            {problems.map((p) => (
              <button
                className={selected.id === p.id ? "selected" : ""}
                key={p.id}
                onClick={() => setSelected(p)}
              >
                <span>
                  <b>{p.title}</b>
                  <small className="mono">
                    {p.id} · v{4 + problems.findIndex((item) => item.id === p.id)}
                  </small>
                </span>
                <Difficulty value={p.difficulty} />
                <Badge kind={p.status}>{p.status}</Badge>
              </button>
            ))}
          </div>
        </section>
        <aside className="panel inspector">
          <div className="inspector-head">
            <div>
              <small className="mono">{selected.id}</small>
              <h2>{selected.title}</h2>
            </div>
            <Badge kind={selected.status}>{selected.status}</Badge>
          </div>
          <dl>
            <div>
              <dt>Lifecycle</dt>
              <dd>
                <Badge kind="ACCEPTED">ACTIVE</Badge>
              </dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>v{version}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>Jun 20, 2025</dd>
            </div>
            <div>
              <dt>Test cases</dt>
              <dd>18 total</dd>
            </div>
          </dl>
          <div className="inspector-actions">
            <Button icon="edit" onClick={() => go("admin-problem-form")}>
              Edit metadata
            </Button>
            <Button
              icon="settings"
              disabled={!canManageTestCases}
              onClick={() => openTestCases(selected)}
            >
              Manage test cases
            </Button>
            <small>
              {canManageTestCases
                ? "Test cases can be managed while this problem is an active draft."
                : "Unpublish this problem before changing test cases."}
            </small>
            <Button
              onClick={() => {
                setModal({
                  title: isPublished ? "Unpublish this problem?" : "Publish this problem?",
                  text: isPublished
                    ? "It will be removed from the public archive. Existing submissions are preserved."
                    : "It will become visible in the public archive and accept submissions.",
                  confirm: isPublished ? "Unpublish" : "Publish",
                  danger: isPublished,
                  onConfirm: () =>
                    notify(
                      isPublished
                        ? `${selected.id} unpublished and moved to draft.`
                        : `${selected.id} published to the public archive.`,
                    ),
                });
              }}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setModal({
                  title: "Deactivate this problem?",
                  text: "The problem will no longer accept submissions. All existing submissions and results will be preserved.",
                  confirm: "Deactivate",
                  danger: true,
                  onConfirm: () => notify(`${selected.id} deactivated.`),
                });
              }}
            >
              Deactivate
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}

function ProblemForm({ go, notify }: { go: (r: Route) => void; notify: (s: string) => void }) {
  return (
    <>
      <AdminHead
        title="Create problem"
        description="Define the challenge, constraints, limits, and supported languages."
      />
      <form
        className="panel admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          notify("Problem AR-129 created as draft.");
          go("admin-problems");
        }}
      >
        <div className="form-section">
          <span>01</span>
          <div>
            <h2>Challenge identity</h2>
            <p>Name and classify the problem.</p>
          </div>
        </div>
        <Field label="Problem title">
          <input required placeholder="e.g. Minimum Window Substring" />
        </Field>
        <div className="form-columns">
          <Field label="Difficulty">
            <select>
              <option>EASY</option>
              <option>MEDIUM</option>
              <option>HARD</option>
            </select>
          </Field>
          <Field label="Category">
            <select>
              <option>Arrays</option>
              <option>Graphs</option>
              <option>Dynamic Programming</option>
            </select>
          </Field>
        </div>
        <Field label="Tags" help="Press Enter to create a tag.">
          <input placeholder="Add tags…" />
        </Field>
        <div className="form-section">
          <span>02</span>
          <div>
            <h2>Problem specification</h2>
            <p>Write clear, participant-facing instructions.</p>
          </div>
        </div>
        <Field label="Statement">
          <textarea rows={6} placeholder="Describe the challenge…" />
        </Field>
        <div className="form-columns">
          <Field label="Input format">
            <textarea rows={4} />
          </Field>
          <Field label="Output format">
            <textarea rows={4} />
          </Field>
        </div>
        <Field label="Constraints">
          <textarea rows={4} className="mono" placeholder="2 ≤ n ≤ 10⁵" />
        </Field>
        <div className="form-section">
          <span>03</span>
          <div>
            <h2>Execution limits</h2>
            <p>Set resource boundaries and runtimes.</p>
          </div>
        </div>
        <div className="form-columns">
          <Field label="Time limit (ms)">
            <input type="number" defaultValue="2000" />
          </Field>
          <Field label="Memory limit (MB)">
            <input type="number" defaultValue="256" />
          </Field>
        </div>
        <Field label="Allowed languages">
          <div className="check-row">
            <label>
              <input type="checkbox" defaultChecked /> C++17
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Python 3
            </label>
          </div>
        </Field>
        <div className="sticky-actions">
          <Button onClick={() => go("admin-problems")}>Cancel</Button>
          <Button variant="primary" type="submit">
            Create draft
          </Button>
        </div>
      </form>
    </>
  );
}

function TestCases({
  problem,
  go,
  setModal,
  notify,
}: {
  problem: (typeof problems)[0];
  go: (r: Route) => void;
  setModal: (v: any) => void;
  notify: (s: string) => void;
}) {
  const version = 4 + problems.findIndex((p) => p.id === problem.id);
  return (
    <>
      <AdminHead
        title="Test case management"
        description={`${problem.title} · ${problem.id} · Draft version ${version}`}
        actions={
          <Button variant="primary" icon="plus" onClick={() => go("admin-case-form")}>
            Add test case
          </Button>
        }
      />
      <div className="warning-note">
        <Icon name="info" />
        <span>
          <b>Hidden case data is confidential.</b> It is visible here only to authorized
          administrators and never appears in participant views.
        </span>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Type</th>
              <th>Input preview</th>
              <th>Expected output</th>
              <th>Version</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["01", "SAMPLE", "4  |  2 7 11 15  |  9", "0 1"],
              ["02", "SAMPLE", "3  |  3 2 4  |  6", "1 2"],
              ["03", "HIDDEN", "10⁵ integers…", "142 8,992"],
              ["04", "HIDDEN", "2  |  −10⁹ 10⁹  |  0", "0 1"],
            ].map((r, i) => (
              <tr key={r[0]}>
                <td>
                  <span className="order-controls">
                    ≡ <b>{r[0]}</b>
                  </span>
                </td>
                <td>
                  <Badge kind={r[1]}>{r[1]}</Badge>
                </td>
                <td className="mono">{r[2]}</td>
                <td className="mono">{r[3]}</td>
                <td>v{2 + i}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => go("admin-case-form")} aria-label="Edit">
                      <Icon name="edit" />
                    </button>
                    <button
                      onClick={() =>
                        setModal({
                          title: "Change case visibility?",
                          text: `Changing this case to ${r[1] === "SAMPLE" ? "HIDDEN" : "SAMPLE"} will ${r[1] === "SAMPLE" ? "remove it from" : "expose it in"} the public problem statement.`,
                          confirm: "Change type",
                        })
                      }
                      aria-label="Change type"
                    >
                      <Icon name="refresh" />
                    </button>
                    <button
                      onClick={() => {
                        setModal({
                          title: "Delete this test case?",
                          text: "The case will be permanently removed and the remaining execution order will be refreshed.",
                          confirm: "Delete case",
                          danger: true,
                        });
                        notify("Test case selection updated.");
                      }}
                      aria-label="Delete"
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="reorder-footer">
          <span>Drag rows or use arrow keys to reorder cases.</span>
          <div>
            <Button>Cancel order</Button>
            <Button variant="primary">Save order</Button>
          </div>
        </div>
      </div>
    </>
  );
}

function TestCaseForm({
  problem,
  go,
  notify,
}: {
  problem: (typeof problems)[0];
  go: (r: Route) => void;
  notify: (s: string) => void;
}) {
  const [type, setType] = useState("SAMPLE");
  const version = 4 + problems.findIndex((p) => p.id === problem.id);
  return (
    <>
      <AdminHead
        title="Create test case"
        description={`${problem.title} · ${problem.id} · Draft version ${version}`}
      />
      <form
        className="panel focused-form case-form"
        onSubmit={(e) => {
          e.preventDefault();
          notify("Test case TC-019 created.");
          go("admin-cases");
        }}
      >
        <div className={`visibility-note ${type.toLowerCase()}`}>
          <Icon name={type === "SAMPLE" ? "info" : "lock"} />
          <span>
            <b>{type === "SAMPLE" ? "Public sample case" : "Protected hidden case"}</b>
            {type === "SAMPLE"
              ? "Input and expected output will appear in the public problem statement."
              : "Data is available to administrators and the judge only."}
          </span>
        </div>
        <div className="form-columns">
          <Field label="Case type">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>SAMPLE</option>
              <option>HIDDEN</option>
            </select>
          </Field>
          <Field label="Execution order">
            <input type="number" defaultValue="5" />
          </Field>
        </div>
        <Field label="Input data">
          <textarea className="mono" rows={9} placeholder={"4\n2 7 11 15\n9"} />
        </Field>
        <Field label="Expected output">
          <textarea className="mono" rows={5} placeholder="0 1" />
        </Field>
        <div className="form-actions">
          <Button onClick={() => go("admin-cases")}>Cancel</Button>
          <Button>Create and add another</Button>
          <Button variant="primary" type="submit">
            Create test case
          </Button>
        </div>
      </form>
    </>
  );
}

function AdminUsers({ setModal }: { setModal: (v: any) => void }) {
  const users = [
    ["USR-041", "akira", "akira@example.com", "ACTIVE", "Feb 12, 2024"],
    ["USR-087", "mira", "mira@domain.com", "ACTIVE", "Apr 03, 2024"],
    ["USR-114", "ren", "ren@domain.com", "LOCKED", "May 18, 2024"],
    ["USR-203", "sora", "sora@domain.com", "ACTIVE", "Sep 29, 2024"],
  ];
  const [selected, setSelected] = useState(users[1]);
  return (
    <>
      <AdminHead
        title="User management"
        description="Inspect account state and manage platform access."
      />
      <section className="filter-bar">
        <div className="search">
          <Icon name="search" />
          <input placeholder="Search username or email…" />
        </div>
        <select>
          <option>All account states</option>
          <option>Active</option>
          <option>Locked</option>
        </select>
      </section>
      <div className="admin-split users">
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u[0]}
                  onClick={() => setSelected(u)}
                  className={selected[0] === u[0] ? "selected clickable" : "clickable"}
                >
                  <td>
                    <b>{u[1]}</b>
                    <small className="mono block">{u[0]}</small>
                  </td>
                  <td>{u[2]}</td>
                  <td>
                    <Badge kind={u[3]}>{u[3]}</Badge>
                  </td>
                  <td>{u[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="panel inspector">
          <div className="profile-avatar small">{selected[1].slice(0, 2).toUpperCase()}</div>
          <h2>{selected[1]}</h2>
          <p>{selected[2]}</p>
          <Badge kind={selected[3]}>{selected[3]}</Badge>
          <dl>
            <div>
              <dt>User ID</dt>
              <dd className="mono">{selected[0]}</dd>
            </div>
            <div>
              <dt>Problems solved</dt>
              <dd>47</dd>
            </div>
            <div>
              <dt>Submissions</dt>
              <dd>93</dd>
            </div>
            <div>
              <dt>Last active</dt>
              <dd>12 minutes ago</dd>
            </div>
          </dl>
          <Button
            variant={selected[3] === "LOCKED" ? "secondary" : "danger"}
            icon={selected[3] === "LOCKED" ? "refresh" : "lock"}
            onClick={() =>
              setModal({
                title: `${selected[3] === "LOCKED" ? "Unlock" : "Lock"} @${selected[1]}?`,
                text:
                  selected[3] === "LOCKED"
                    ? "This account will regain access to the platform."
                    : "This account will be signed out and prevented from logging in.",
                confirm: selected[3] === "LOCKED" ? "Unlock account" : "Lock account",
                danger: selected[3] !== "LOCKED",
              })
            }
          >
            {selected[3] === "LOCKED" ? "Unlock account" : "Lock account"}
          </Button>
        </aside>
      </div>
    </>
  );
}

function AdminSubmissions() {
  const [selected, setSelected] = useState(submissions[0]);
  return (
    <>
      <AdminHead
        title="Submission management"
        description="Audit platform-wide judgments and execution results."
      />
      <section className="filter-bar multi">
        <div className="search">
          <Icon name="search" />
          <input placeholder="User or submission ID…" />
        </div>
        <select>
          <option>All problems</option>
        </select>
        <select>
          <option>All statuses</option>
        </select>
        <select>
          <option>All verdicts</option>
        </select>
      </section>
      <div className="admin-split submissions-admin">
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Submission</th>
                <th>Owner</th>
                <th>Problem</th>
                <th>Status / verdict</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  className={selected.id === s.id ? "selected clickable" : "clickable"}
                  onClick={() => setSelected(s)}
                >
                  <td className="mono">{s.id}</td>
                  <td>@{s.user}</td>
                  <td>
                    <b>{s.problem}</b>
                  </td>
                  <td>
                    {s.verdict ? (
                      <Verdict value={s.verdict} />
                    ) : (
                      <Badge kind={s.status}>{s.status.replace("_", " ")}</Badge>
                    )}
                  </td>
                  <td>{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="panel submission-inspector">
          <div className="inspector-head">
            <div>
              <small>Selected submission</small>
              <h2 className="mono">{selected.id}</h2>
            </div>
            {selected.verdict ? (
              <Verdict value={selected.verdict} />
            ) : (
              <Badge kind={selected.status}>{selected.status}</Badge>
            )}
          </div>
          <dl>
            <div>
              <dt>Owner</dt>
              <dd>
                <button className="text-link">@{selected.user}</button>
              </dd>
            </div>
            <div>
              <dt>Problem</dt>
              <dd>
                <button className="text-link">{selected.problem}</button>
              </dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{selected.lang}</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>{selected.runtime}</dd>
            </div>
            <div>
              <dt>Peak memory</dt>
              <dd>{selected.memory}</dd>
            </div>
          </dl>
          <h3>Source (read only)</h3>
          <pre className="source-code compact">
            {templates["Python 3"].split("\n").slice(0, 7).join("\n")}
          </pre>
          <div className="safe-note">
            <Icon name="shield" />
            <span>Hidden input and expected output are protected.</span>
          </div>
        </aside>
      </div>
    </>
  );
}

export default App;
