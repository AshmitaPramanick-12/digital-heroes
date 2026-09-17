import { useEffect, useState } from "react";

const charities = [
  {
    id: 1,
    name: "Golf for Good Foundation",
    description: "Supporting young people through sport, education and opportunity.",
    icon: "⛳",
  },
  {
    id: 2,
    name: "Hope & Care",
    description: "Helping families access healthcare, food and essential support.",
    icon: "❤️",
  },
  {
    id: 3,
    name: "Green Earth Initiative",
    description: "Protecting communities and restoring the natural environment.",
    icon: "🌱",
  },
];

const initialScores = [
  { date: "2026-09-15", score: 34 },
  { date: "2026-09-12", score: 29 },
  { date: "2026-09-08", score: 37 },
];

function App() {
  const [page, setPage] = useState("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [scores, setScores] = useState(() => {
    return JSON.parse(localStorage.getItem("dh_scores")) || initialScores;
  });

  const [charity, setCharity] = useState("Golf for Good Foundation");
  const [charityPercent, setCharityPercent] = useState(10);
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  const [users, setUsers] = useState([
    { name: "Ashmita Pramanick", email: "ashmita@example.com", status: "Active" },
    { name: "Rahul Sen", email: "rahul@example.com", status: "Active" },
    { name: "Priya Das", email: "priya@example.com", status: "Inactive" },
  ]);

  const [draw, setDraw] = useState({
    numbers: [7, 14, 22, 29, 35],
    pool: 12500,
    status: "Upcoming",
  });

  useEffect(() => {
    localStorage.setItem("dh_scores", JSON.stringify(scores));
  }, [scores]);

  const addScore = () => {
    if (!date || !score) {
      alert("Please enter date and score.");
      return;
    }

    const value = Number(score);

    if (value < 1 || value > 45) {
      alert("Stableford score must be between 1 and 45.");
      return;
    }

    if (scores.some((s) => s.date === date)) {
      alert("A score already exists for this date.");
      return;
    }

    const updated = [...scores, { date, score: value }]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setScores(updated);
    setScore("");
    setDate("");
  };

  const deleteScore = (selectedDate) => {
    setScores(scores.filter((s) => s.date !== selectedDate));
  };

  const runDraw = () => {
    const numbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 45) + 1
    );

    setDraw({
      ...draw,
      numbers: [...new Set(numbers)].slice(0, 5),
      status: "Published",
    });
  };

  const login = (isAdmin = false) => {
    setLoggedIn(true);
    setAdmin(isAdmin);
    setPage(isAdmin ? "admin" : "dashboard");
  };

  const logout = () => {
    setLoggedIn(false);
    setAdmin(false);
    setPage("home");
  };

  return (
    <div className="app">
      <Navbar
        page={page}
        setPage={setPage}
        loggedIn={loggedIn}
        admin={admin}
        logout={logout}
      />

      {page === "home" && <Home setPage={setPage} />}

      {page === "charities" && (
        <Charities
          charity={charity}
          setCharity={setCharity}
          setPage={setPage}
        />
      )}

      {page === "login" && <Login login={login} />}

      {page === "signup" && <Signup login={login} />}

      {page === "dashboard" && loggedIn && !admin && (
        <Dashboard
          scores={scores}
          charity={charity}
          charityPercent={charityPercent}
          setPage={setPage}
          draw={draw}
        />
      )}

      {page === "scores" && loggedIn && (
        <Scores
          scores={scores}
          score={score}
          date={date}
          setScore={setScore}
          setDate={setDate}
          addScore={addScore}
          deleteScore={deleteScore}
        />
      )}

      {page === "admin" && loggedIn && admin && (
        <Admin
          users={users}
          setUsers={setUsers}
          draw={draw}
          runDraw={runDraw}
        />
      )}

      {!loggedIn && page !== "home" && page !== "charities" &&
        page !== "login" && page !== "signup" && (
          <div className="center-box">
            <h2>Please log in</h2>
            <button onClick={() => setPage("login")}>Login</button>
          </div>
        )}
    </div>
  );
}

function Navbar({ page, setPage, loggedIn, admin, logout }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setPage("home")}>
        DIGITAL<span>HEROES</span>
      </div>

      <div className="navlinks">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("charities")}>Charity</button>

        {loggedIn && !admin && (
          <>
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={() => setPage("scores")}>Scores</button>
          </>
        )}

        {loggedIn && admin && (
          <button onClick={() => setPage("admin")}>Admin</button>
        )}

        {!loggedIn ? (
          <>
            <button className="login-btn" onClick={() => setPage("login")}>
              Login
            </button>
            <button className="primary" onClick={() => setPage("signup")}>
              Join Now
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

function Home({ setPage }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="badge">PLAY • WIN • GIVE BACK</div>

          <h1>
            Your game can
            <br />
            <span>change lives.</span>
          </h1>

          <p>
            Track your golf performance, enter monthly prize draws,
            and direct part of your subscription to a charity you care about.
          </p>

          <div className="hero-buttons">
            <button className="primary big" onClick={() => setPage("signup")}>
              Start Playing →
            </button>
            <button className="secondary big" onClick={() => setPage("charities")}>
              Explore Charities
            </button>
          </div>

          <div className="trust">
            <div><strong>40%</strong><small>Jackpot pool</small></div>
            <div><strong>10%</strong><small>Minimum charity</small></div>
            <div><strong>5</strong><small>Scores tracked</small></div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-top">
            <span>MONTHLY DRAW</span>
            <span className="live">● LIVE</span>
          </div>

          <h3>September Prize Pool</h3>
          <div className="money">₹12,500</div>

          <div className="numbers">
            {[7, 14, 22, 29, 35].map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>

          <div className="pool-row">
            <span>5 Match</span><strong>₹5,000</strong>
          </div>
          <div className="pool-row">
            <span>4 Match</span><strong>₹4,375</strong>
          </div>
          <div className="pool-row">
            <span>3 Match</span><strong>₹3,125</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span>HOW IT WORKS</span>
          <h2>Three simple steps.</h2>
        </div>

        <div className="steps">
          <div className="feature">
            <div className="feature-icon">01</div>
            <h3>Subscribe</h3>
            <p>Choose a monthly or yearly plan and select a charity.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">02</div>
            <h3>Play your game</h3>
            <p>Keep your latest five Stableford scores updated.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">03</div>
            <h3>Win & give back</h3>
            <p>Join monthly draws while supporting a cause you choose.</p>
          </div>
        </div>
      </section>

      <section className="impact">
        <div>
          <span>THE BIGGER PICTURE</span>
          <h2>Your subscription has an impact.</h2>
          <p>
            Every subscriber directs at least 10% of their subscription
            toward a charity. You choose the cause. We handle the rest.
          </p>
        </div>

        <button className="primary" onClick={() => setPage("charities")}>
          Find your cause →
        </button>
      </section>
    </main>
  );
}

function Login({ login }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="badge">WELCOME BACK</div>
        <h1>Log in.</h1>
        <p>Access your scores, draws and charity impact.</p>

        <input placeholder="Email address" />
        <input type="password" placeholder="Password" />

        <button className="primary full" onClick={() => login(false)}>
          Login as Subscriber
        </button>

        <button className="admin-demo" onClick={() => login(true)}>
          Demo: Login as Admin
        </button>
      </div>
    </div>
  );
}

function Signup({ login }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="badge">JOIN DIGITAL HEROES</div>
        <h1>Create account.</h1>
        <p>Start tracking, winning and giving back.</p>

        <input placeholder="Full name" />
        <input placeholder="Email address" />
        <input type="password" placeholder="Password" />

        <select>
          <option>Monthly — ₹500/month</option>
          <option>Yearly — ₹5,000/year</option>
        </select>

        <select>
          {charities.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="primary full" onClick={() => login(false)}>
          Create Account
        </button>
      </div>
    </div>
  );
}

function Charities({ charity, setCharity, setPage }) {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <span>MAKE AN IMPACT</span>
          <h1>Choose your cause.</h1>
          <p>At least 10% of your subscription goes to a charity you choose.</p>
        </div>
      </div>

      <div className="charity-grid">
        {charities.map((c) => (
          <div
            className={`charity-card ${
              charity === c.name ? "selected" : ""
            }`}
            key={c.id}
          >
            <div className="charity-icon">{c.icon}</div>
            <h2>{c.name}</h2>
            <p>{c.description}</p>

            <button
              className={charity === c.name ? "selected-btn" : "secondary"}
              onClick={() => {
                setCharity(c.name);
                setPage("dashboard");
              }}
            >
              {charity === c.name ? "✓ Selected" : "Choose charity"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function Dashboard({ scores, charity, charityPercent, setPage, draw }) {
  return (
    <main className="page">
      <div className="dashboard-head">
        <div>
          <span>MEMBER DASHBOARD</span>
          <h1>Welcome back, Ashmita.</h1>
        </div>
        <div className="active-pill">● Subscription Active</div>
      </div>

      <div className="stats">
        <div className="stat">
          <small>SUBSCRIPTION</small>
          <strong>Active</strong>
          <span>Renews 17 Oct 2026</span>
        </div>

        <div className="stat">
          <small>CHARITY</small>
          <strong>{charity}</strong>
          <span>{charityPercent}% contribution</span>
        </div>

        <div className="stat">
          <small>PRIZE POOL</small>
          <strong>₹12,500</strong>
          <span>September draw</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <span>PERFORMANCE</span>
              <h2>Latest scores</h2>
            </div>
            <button className="secondary" onClick={() => setPage("scores")}>
              Manage
            </button>
          </div>

          {scores.map((s) => (
            <div className="score-row" key={s.date}>
              <div>
                <strong>{s.score}</strong>
                <span>Stableford</span>
              </div>
              <span>{s.date}</span>
            </div>
          ))}
        </div>

        <div className="panel draw-panel">
          <span>NEXT DRAW</span>
          <h2>September Draw</h2>

          <div className="numbers">
            {draw.numbers.map((n, i) => (
              <div key={i}>{n}</div>
            ))}
          </div>

          <strong className="draw-money">₹12,500</strong>
          <p>Current prize pool</p>

          <div className="active-pill">{draw.status}</div>
        </div>
      </div>

      <div className="impact-mini">
        <span>YOUR CHARITY IMPACT</span>
        <h2>₹50 contributed this month</h2>
        <p>You're helping {charity} make a difference.</p>
      </div>
    </main>
  );
}

function Scores({
  scores,
  score,
  date,
  setScore,
  setDate,
  addScore,
  deleteScore,
}) {
  return (
    <main className="page">
      <div className="page-header">
        <span>PERFORMANCE</span>
        <h1>Your scores.</h1>
        <p>Only your latest five Stableford scores are retained.</p>
      </div>

      <div className="score-layout">
        <div className="panel">
          <div className="panel-head">
            <div>
              <span>ADD SCORE</span>
              <h2>Enter a round</h2>
            </div>
          </div>

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Stableford score</label>
          <input
            type="number"
            min="1"
            max="45"
            placeholder="1–45"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />

          <button className="primary full" onClick={addScore}>
            Add Score
          </button>

          <p className="hint">
            One score per date. Adding a sixth score automatically removes
            the oldest score.
          </p>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <span>YOUR LAST 5</span>
              <h2>Score history</h2>
            </div>
            <strong>{scores.length}/5</strong>
          </div>

          {scores.map((s) => (
            <div className="score-row" key={s.date}>
              <div>
                <strong>{s.score}</strong>
                <span>Stableford</span>
              </div>

              <span>{s.date}</span>

              <button
                className="delete"
                onClick={() => deleteScore(s.date)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Admin({ users, setUsers, draw, runDraw }) {
  const [tab, setTab] = useState("overview");

  return (
    <main className="page">
      <div className="dashboard-head">
        <div>
          <span>CONTROL CENTRE</span>
          <h1>Admin dashboard.</h1>
        </div>
        <div className="admin-pill">ADMIN</div>
      </div>

      <div className="admin-tabs">
        {["overview", "users", "draw", "winners"].map((t) => (
          <button
            className={tab === t ? "tab-active" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="stats">
            <div className="stat">
              <small>TOTAL USERS</small>
              <strong>1,248</strong>
              <span>+8.4% this month</span>
            </div>
            <div className="stat">
              <small>PRIZE POOL</small>
              <strong>₹12,500</strong>
              <span>September</span>
            </div>
            <div className="stat">
              <small>CHARITY TOTAL</small>
              <strong>₹8,760</strong>
              <span>This month</span>
            </div>
            <div className="stat">
              <small>PENDING</small>
              <strong>3</strong>
              <span>Winner reviews</span>
            </div>
          </div>

          <div className="panel">
            <span>SYSTEM STATUS</span>
            <h2>Everything is operational.</h2>
            <div className="status-list">
              <p>✓ Subscription engine</p>
              <p>✓ Score management</p>
              <p>✓ Charity system</p>
              <p>✓ Draw engine</p>
              <p>✓ Winner verification</p>
            </div>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="panel">
          <span>USER MANAGEMENT</span>
          <h2>Subscribers</h2>

          {users.map((u, i) => (
            <div className="user-row" key={i}>
              <div>
                <strong>{u.name}</strong>
                <span>{u.email}</span>
              </div>
              <span className="active-pill">{u.status}</span>
              <button
                className="secondary"
                onClick={() => {
                  const copy = [...users];
                  copy[i].status =
                    copy[i].status === "Active" ? "Inactive" : "Active";
                  setUsers(copy);
                }}
              >
                Toggle
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "draw" && (
        <div className="panel">
          <span>DRAW MANAGEMENT</span>
          <h2>September monthly draw</h2>

          <div className="numbers large">
            {draw.numbers.map((n, i) => (
              <div key={i}>{n}</div>
            ))}
          </div>

          <p>Prize pool: <strong>₹12,500</strong></p>

          <button className="primary" onClick={runDraw}>
            Run / Publish Draw
          </button>
        </div>
      )}

      {tab === "winners" && (
        <div className="panel">
          <span>WINNER VERIFICATION</span>
          <h2>Pending submissions</h2>

          <div className="winner-row">
            <div>
              <strong>Rahul Sen</strong>
              <span>5-number match • September</span>
            </div>
            <span className="pending">Pending</span>
            <button className="primary">Approve</button>
          </div>

          <div className="winner-row">
            <div>
              <strong>Priya Das</strong>
              <span>4-number match • September</span>
            </div>
            <span className="pending">Pending</span>
            <button className="primary">Approve</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;