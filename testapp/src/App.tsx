import { useEffect, useMemo, useState } from "react";

type AnyObj = any;

function formatOdds(odds: number | null | undefined) {
  if (odds == null) return "—";
  return odds > 0 ? `+${odds}` : String(odds);
}
function formatSpreadValue(v: number | null | undefined) {
  if (v == null) return "—";
  return v > 0 ? `+${v}` : String(v);
}

function parseSpreadRowsForGame(game: AnyObj) {
  const marketsByBook = game?.markets || {};
  const rows: Array<{ bookId: number; away: AnyObj; home: AnyObj }> = [];

  for (const [bookId, bookMarkets] of Object.entries(marketsByBook)) {
    const spread = (bookMarkets as AnyObj)?.event?.spread || [];
    const away = spread.find((x: AnyObj) => x.side === "away") || null;
    const home = spread.find((x: AnyObj) => x.side === "home") || null;
    rows.push({ bookId: Number(bookId), away, home });
  }

  rows.sort((a, b) => a.bookId - b.bookId);
  return rows;
}

export default function App() {
  const [data, setData] = useState<AnyObj>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/scoreboard");
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
        setData(JSON.parse(text));
      } catch (e: any) {
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  // IMPORTANT: derive memoized values unconditionally (even if data is null)
  const game = data?.games?.[0] ?? null;

  const awayTeam = useMemo(() => {
    if (!game) return null;
    return game.teams?.find((t: AnyObj) => t.id === game.away_team_id) ?? null;
  }, [game]);

  const homeTeam = useMemo(() => {
    if (!game) return null;
    return game.teams?.find((t: AnyObj) => t.id === game.home_team_id) ?? null;
  }, [game]);

  const rows = useMemo(() => {
    if (!game) return [];
    return parseSpreadRowsForGame(game);
  }, [game]);

  // now early returns are safe
  if (err) return <pre style={{ padding: 16 }}>Error: {err}</pre>;
  if (!data) return <div style={{ padding: 16 }}>Loading…</div>;
  if (!game) return <pre style={{ padding: 16 }}>No games in response.</pre>;

  return (
    <div style={{ padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h2 style={{ margin: "0 0 12px" }}>
        {awayTeam?.display_name} @ {homeTeam?.display_name}
      </h2>

      <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: 8 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={thLeft} />
              {rows.map((r) => (
                <th key={r.bookId} style={thCenter}>
                  Book {r.bookId}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={tdLeft}>{awayTeam?.display_name}</td>
              {rows.map((r) => (
                <td key={r.bookId} style={tdCell}>
                  {r.away ? (
                    <div style={cellBox}>
                      <div style={{ fontWeight: 700 }}>{formatSpreadValue(r.away.value)}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{formatOdds(r.away.odds)}</div>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td style={tdLeft}>{homeTeam?.display_name}</td>
              {rows.map((r) => (
                <td key={r.bookId} style={tdCell}>
                  {r.home ? (
                    <div style={cellBox}>
                      <div style={{ fontWeight: 700 }}>{formatSpreadValue(r.home.value)}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{formatOdds(r.home.odds)}</div>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thLeft: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};
const thCenter: React.CSSProperties = {
  textAlign: "center",
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};
const tdLeft: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #f1f1f1",
  whiteSpace: "nowrap",
};
const tdCell: React.CSSProperties = {
  padding: 8,
  borderBottom: "1px solid #f1f1f1",
  textAlign: "center",
};
const cellBox: React.CSSProperties = {
  display: "inline-block",
  minWidth: 70,
  padding: "10px 8px",
  border: "1px solid #e6e6e6",
  borderRadius: 10,
  background: "#f7f7f7",
  lineHeight: 1.1,
};
