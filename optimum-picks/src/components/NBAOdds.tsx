import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";

type AnyObj = any;

type OddsEntry = {
  side: "home" | "away" | "over" | "under";
  odds?: number;
  value?: number;
};

type BookCell = {
  bookId: string; // key in markets object, e.g. "15"
  spreadAway?: OddsEntry | null;
  spreadHome?: OddsEntry | null;
  totalOver?: OddsEntry | null;
  totalUnder?: OddsEntry | null;
  mlAway?: OddsEntry | null;
  mlHome?: OddsEntry | null;
};

function fmtOdds(odds: number | null | undefined) {
  if (odds == null) return "—";
  return odds > 0 ? `+${odds}` : String(odds);
}

function fmtVal(v: number | null | undefined) {
  if (v == null) return "—";
  return v > 0 ? `+${v}` : String(v);
}

function pickBySide(arr: OddsEntry[] | undefined, side: OddsEntry["side"]) {
  if (!Array.isArray(arr)) return null;
  return arr.find((x) => x?.side === side) ?? null;
}

function parseBookCell(bookId: string, marketsForBook: AnyObj): BookCell {
  const ev = marketsForBook?.event ?? {};
  const spread: OddsEntry[] = ev.spread ?? [];
  const total: OddsEntry[] = ev.total ?? [];
  const moneyline: OddsEntry[] = ev.moneyline ?? [];

  return {
    bookId,
    spreadAway: pickBySide(spread, "away"),
    spreadHome: pickBySide(spread, "home"),
    totalOver: pickBySide(total, "over"),
    totalUnder: pickBySide(total, "under"),
    mlAway: pickBySide(moneyline, "away"),
    mlHome: pickBySide(moneyline, "home"),
  };
}

function TeamLine({
  label,
  value,
  odds,
  highlight = false,
}: {
  label: string;
  value: string;
  odds: string;
  highlight?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: highlight ? "rgba(0, 255, 171, 0.9)" : "rgba(255, 255, 255, 0.75)",
          fontWeight: 300,
          fontSize: "0.7rem",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "rgba(255, 255, 255, 0.85)",
          fontWeight: 500,
          fontSize: "0.7rem",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>

      <Chip
        label={odds}
        size="small"
        sx={{
          height: 22,
          fontSize: "0.7rem",
          bgcolor: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: odds.startsWith("+") ? "rgba(0, 255, 171, 0.9)" : "rgba(255, 133, 133, 0.9)",
          "& .MuiChip-label": { px: 0.75 },
        }}
      />
    </Box>
  );
}

function BookOddsCell({
  cell,
  awayAbbr,
  homeAbbr,
}: {
  cell: BookCell;
  awayAbbr: string;
  homeAbbr: string;
}) {
  // Compact "stacked" display per book: Spread, Total, ML.
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      {/* Spread */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.65rem", letterSpacing: "0.8px" }}
        >
          SPREAD
        </Typography>
        <TeamLine
          label={awayAbbr}
          value={fmtVal(cell.spreadAway?.value)}
          odds={fmtOdds(cell.spreadAway?.odds)}
        />
        <TeamLine
          label={homeAbbr}
          value={fmtVal(cell.spreadHome?.value)}
          odds={fmtOdds(cell.spreadHome?.odds)}
        />
      </Box>

      {/* Total */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.65rem", letterSpacing: "0.8px" }}
        >
          TOTAL
        </Typography>
        <TeamLine
          label="O"
          value={fmtVal(cell.totalOver?.value)}
          odds={fmtOdds(cell.totalOver?.odds)}
        />
        <TeamLine
          label="U"
          value={fmtVal(cell.totalUnder?.value)}
          odds={fmtOdds(cell.totalUnder?.odds)}
        />
      </Box>

      {/* Moneyline */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.65rem", letterSpacing: "0.8px" }}
        >
          ML
        </Typography>
        <TeamLine label={awayAbbr} value=" " odds={fmtOdds(cell.mlAway?.odds)} />
        <TeamLine label={homeAbbr} value=" " odds={fmtOdds(cell.mlHome?.odds)} />
      </Box>
    </Box>
  );
}

const NBAOdds: React.FC = () => {
  const [data, setData] = useState<AnyObj>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/scoreboard.json ");
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 180)}`);
        const json = JSON.parse(text);
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(String(e?.message || e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const games = useMemo(() => (Array.isArray(data?.games) ? data.games : []), [data]);

  // Determine which books exist (union across all games), so header columns stay consistent.
  const bookIds = useMemo(() => {
    const s = new Set<string>();
    for (const g of games) {
      const m = g?.markets || {};
      for (const k of Object.keys(m)) s.add(k);
    }
    return Array.from(s).sort((a, b) => Number(a) - Number(b));
  }, [games]);

  if (err) {
    return (
      <Paper
        sx={{
          p: 2,
          background: "rgba(0, 0, 0, 0.4)",
          color: "rgba(255, 255, 255, 0.85)",
          boxShadow: "none",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Typography sx={{ color: "rgba(255, 133, 133, 0.9)" }}>Error</Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
          {err}
        </Typography>
      </Paper>
    );
  }

  if (!data) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2 }}>
        <CircularProgress size={18} />
        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>Loading NBA odds…</Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        background: "rgba(0, 0, 0, 0.4)",
        color: "rgba(255, 255, 255, 0.85)",
        boxShadow: "none",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Table aria-label="nba odds table" stickyHeader>
        <TableHead>
          <TableRow sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <TableCell
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.75rem",
                letterSpacing: "1px",
                fontWeight: 300,
                width: 260,
                background: "rgba(0, 0, 0, 0.5)",
              }}
            >
              GAME
            </TableCell>

            {bookIds.map((bookId) => (
              <TableCell
                key={bookId}
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                  fontWeight: 300,
                  minWidth: 220,
                  background: "rgba(0, 0, 0, 0.5)",
                }}
              >
                BOOK {bookId}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {games.map((g: AnyObj) => {
            const away = g?.teams?.find((t: AnyObj) => t.id === g.away_team_id);
            const home = g?.teams?.find((t: AnyObj) => t.id === g.home_team_id);

            const awayName = away?.display_name ?? "Away";
            const homeName = home?.display_name ?? "Home";
            const awayAbbr = away?.abbr ?? "AWY";
            const homeAbbr = home?.abbr ?? "HME";

            return (
              <TableRow
                key={g.id}
                sx={{
                  "&:nth-of-type(odd)": { background: "rgba(0, 0, 0, 0.2)" },
                  "&:nth-of-type(even)": { background: "rgba(255, 255, 255, 0.02)" },
                  "&:hover": { background: "rgba(255, 255, 255, 0.05)" },
                  borderBottom: "none",
                  transition: "background 0.2s ease",
                }}
              >
                <TableCell sx={{ border: "none", py: 2, verticalAlign: "top" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>
                      {awayName} @ {homeName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: 300, fontSize: "0.7rem" }}
                    >
                      {awayAbbr} vs {homeAbbr} • {g?.start_time ?? ""}
                    </Typography>
                  </Box>
                </TableCell>

                {bookIds.map((bookId) => {
                  const cell = parseBookCell(bookId, g?.markets?.[bookId]);
                  const hasAnything =
                    cell.spreadAway || cell.spreadHome || cell.totalOver || cell.totalUnder || cell.mlAway || cell.mlHome;

                  return (
                    <TableCell key={bookId} sx={{ border: "none", py: 2, verticalAlign: "top" }}>
                      {hasAnything ? (
                        <BookOddsCell cell={cell} awayAbbr={awayAbbr} homeAbbr={homeAbbr} />
                      ) : (
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NBAOdds;
