import { useEffect, useMemo, useState } from "react";

function Chip({ children }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: 12,
      padding: "2px 8px",
      borderRadius: 999,
      border: "1px solid #ddd",
      marginRight: 6
    }}>
      {children}
    </span>
  );
}

export default function App() {
  const [allDogs, setAllDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    size: "",
    kidFriendly: false,
  });

  // Load local JSON (served from /public)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("./dogs.json");
        const data = await res.json();
        setAllDogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let data = allDogs;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      data = data.filter(
        d => d.name.toLowerCase().includes(q) ||
             (d.location ?? "").toLowerCase().includes(q)
      );
    }
    if (filters.size) data = data.filter(d => d.size === filters.size);
    if (filters.kidFriendly) data = data.filter(d => d.kidFriendly === true);
    return data;
  }, [allDogs, filters]);

  return (
    <main className="container">
      <header className="header">
        <h1>Dog Finder</h1>
        <p className="sub">Search for adoptable dogs by qualities.</p>
      </header>

      <section className="filters">
        <input
          className="input"
          placeholder="Search name or location…"
          value={filters.q}
          onChange={e => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          className="select"
          value={filters.size}
          onChange={e => setFilters({ ...filters, size: e.target.value })}
        >
          <option value="">Size (any)</option>
          <option value="xs">XS</option>
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
          <option value="xl">XL</option>
        </select>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.kidFriendly}
            onChange={e => setFilters({ ...filters, kidFriendly: e.target.checked })}
          />
          Kid-friendly only
        </label>
      </section>

      <hr className="rule" />

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p>No matches. Try clearing filters.</p>
      ) : (
        <section className="grid">
          {filtered.map(d => (
            <article key={d.id} className="card">
              <h3 className="card-title">{d.name}</h3>
              <p className="muted">{d.location}</p>
              <div style={{ margin: "8px 0 12px" }}>
                <Chip>Size: {d.size.toUpperCase()}</Chip>
                <Chip>Kid-friendly: {d.kidFriendly ? "Yes" : "No"}</Chip>
              </div>
              <p className="desc">{d.description}</p>
            </article>
          ))}
        </section>
      )}

      <footer className="footer">
        <span className="muted">{filtered.length} result(s)</span>
      </footer>
    </main>
  );
}
