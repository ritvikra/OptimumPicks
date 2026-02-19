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
  bookId?: string;
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



function computeBestOdds(g: AnyObj, bookIds: string[]): BookCell {
  const best: Partial<BookCell> = { 
    bookId: "best" 
  };
  const fields: (keyof BookCell)[] = ["spreadAway", "spreadHome", "totalOver", "totalUnder", "mlAway", "mlHome"];
  fields.forEach(field => {
    (best as any)[field] = { odds: -Infinity } as OddsEntry;
  });

  for (const bookId of bookIds) {
    const cell = parseBookCell(bookId, g?.markets?.[bookId]);
    fields.forEach(field => {
      const entry = cell[field as keyof BookCell] as OddsEntry | undefined;
      const bEntry = (best as any)[field] as OddsEntry;
      if (entry?.odds && entry.odds > bEntry.odds!) {
        bEntry.odds = entry.odds;
        bEntry.value = entry.value;
        bEntry.bookId = bookId;  // Track source book
      }
    });
  }

  return best as BookCell;
}


function fmtOdds(odds: number | null | undefined) {
  if (odds == null) return "—";
  return odds > 0 ? `+${odds}` : String(odds);
}

function fmtVal(v: number | null | undefined) {
  if (v == null) return "—";
  return v > 0 ? `+${v}` : String(v);
}

function fmtStartTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
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

  const spreadAway = pickBySide(spread, "away");
  const spreadHome = pickBySide(spread, "home");
  const totalOver = pickBySide(total, "over");
  const totalUnder = pickBySide(total, "under");
  const mlAway = pickBySide(moneyline, "away");
  const mlHome = pickBySide(moneyline, "home");

  return {
    bookId,
    spreadAway: spreadAway ? { ...spreadAway, bookId } : null,
    spreadHome: spreadHome ? { ...spreadHome, bookId } : null,
    totalOver: totalOver ? { ...totalOver, bookId } : null,
    totalUnder: totalUnder ? { ...totalUnder, bookId } : null,
    mlAway: mlAway ? { ...mlAway, bookId } : null,
    mlHome: mlHome ? { ...mlHome, bookId } : null,
  };
}

function TeamLine({
  label,
  value,
  oddsEntry,
  highlight = false,
}: {
  label: string;
  value: string;
  oddsEntry?: OddsEntry | null;
  highlight?: boolean;
}) {
  const odds = fmtOdds(oddsEntry?.odds);
  const bookName = bookNames[oddsEntry?.bookId || ""] || "";

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 0.5, alignItems: "center" }}>
      <Typography
        variant="caption"
        sx={{
          color: highlight ? "rgba(0, 255, 171, 0.9)" : "rgba(255, 255, 255, 0.75)",
          fontWeight: 300,
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "rgba(255, 255, 255, 0.85)",
          fontWeight: 500,
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          minWidth: 24,
          justifyContent: "center"
        }}
      >
        {value}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" ,alignItems: "center", gap: 0.25, ml: "auto" }}>
        <Chip
          label={odds}
          size="small"
          sx={{
            height: 22,
            justifyContent: "center",
            fontSize: "0.8rem",
            bgcolor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: odds.startsWith("+") ? "rgba(0, 255, 171, 0.9)" : "rgba(255, 133, 133, 0.9)",
            "& .MuiChip-label": { px: 0.7 },
          }}
        />
      </Box>
    </Box>
  );
}

function BestTeamLine({
  label,
  value,
  oddsEntry,
}: {
  label: string;
  value: string;
  oddsEntry: OddsEntry | null;
}) {
  const odds = fmtOdds(oddsEntry?.odds);
  const bookName = bookNames[oddsEntry?.bookId || ""] || "";

  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      gap: 1,
      height: 26
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="caption" sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)" }}>
          {value}
        </Typography>
      </Box>
      <Chip label={odds} size="small" sx={{ /* existing Chip sx */ }} />
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: "0.65rem", 
          color: "rgba(0,255,171,1)", 
          fontWeight: 700, 
          whiteSpace: "nowrap",
          minWidth: 60,
          textAlign: "center"
        }}
      >
        {bookName}
      </Typography>
    </Box>
  );
}

function BookOddsCell({
  cell,
  awayAbbr,
  homeAbbr,
  isBest = false,
}: {
  cell: BookCell;
  awayAbbr: string;
  homeAbbr: string;
  isBest?: boolean;
}) {
  const LineComponent = isBest ? BestTeamLine : TeamLine;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      {/* Spread */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <LineComponent 
          label={awayAbbr} 
          value={fmtVal(cell.spreadAway?.value)} 
          oddsEntry={cell.spreadAway ?? null} 
        />
        <LineComponent 
          label={homeAbbr} 
          value={fmtVal(cell.spreadHome?.value)} 
          oddsEntry={cell.spreadHome ?? null} 
        />
      </Box>

      {/* Total */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <LineComponent 
          label="O" 
          value={fmtVal(cell.totalOver?.value)} 
          oddsEntry={cell.totalOver ?? null} 
        />
        <LineComponent 
          label="U" 
          value={fmtVal(cell.totalUnder?.value)} 
          oddsEntry={cell.totalUnder ?? null} 
        />
      </Box>

      {/* Moneyline */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <LineComponent 
          label={awayAbbr} 
          value=" " 
          oddsEntry={cell.mlAway ?? null} 
        />
        <LineComponent 
          label={homeAbbr} 
          value=" " 
          oddsEntry={cell.mlHome ?? null} 
        />
      </Box>
    </Box>
  );
}



// WARNING: Placeholder mapping (assumed order; not authoritative)
const bookNames: Record<string, string> = {
  "15": "DraftKings",
  "30": "FanDuel",
  "68": "BetRivers",
  "79": "Unibet",

  "270": "BetMGM",
  "282": "Caesars",
  "1797": "bet365",
  "279": "Fanatics",
  "2988": "BetMGM",
  "75": "Caesars",
  "123": "BetRivers",
  "71": "FanDuel",
};


const NFLOdds: React.FC = () => {
  const [data, setData] = useState<AnyObj>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/nflodds.json", { 
          cache: "no-store",  // Always fresh; or "no-cache" for validation
          headers: { "Cache-Control": "no-cache" }
        });        
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

  const bestCells = useMemo(() => 
    games.map((g: AnyObj) => computeBestOdds(g, bookIds)), 
    [games, bookIds]
  );
  

 /* const bestSpread = (games) => {
    let best = 10000000;
    for (const g of games){
      for (const book of bookIds) {
        const cell = parseBookCell(book, g.markets.book);
        if ( cell.spreadAway < best) {
          best =  cell.spreadAway;
        }
      }
    }
    return best;
    };
    */

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
        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>Loading NFL odds…</Typography>
      </Box>
    );
  }

  // NFL season runs Sept–Feb; before September = off-season
  const isOffSeason = new Date().getMonth() < 8; // 0–7 = Jan–Aug
  if (isOffSeason) {
    return (
      <Paper
        sx={{
          p: 3,
          background: "rgba(0, 0, 0, 0.4)",
          color: "rgba(255, 255, 255, 0.85)",
          boxShadow: "none",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Season is over</Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
          NFL odds will return when the season resumes in September.
        </Typography>
      </Paper>
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
        overflowX: "auto",
        overflowY: "auto",
        flex: 1,
        WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        '&::-webkit-scrollbar': {
          height: '8px',
        },
      }}
    >
      <Table aria-label="nfl odds table" stickyHeader sx={{ 
        fontSize: { xs: "0.65em", sm: "0.8em" }, 
        minWidth: { xs: '800px', sm: 'auto' },
        transform: { xs: 'scale(0.85)', sm: 'scale(1)' },
        transformOrigin: 'top left',
      }}>
        <TableHead>
          <TableRow sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)" 
            }}>
            <TableCell
              sx={{
                position: { xs: "static", sm: "sticky" },
                left: { xs: "auto", sm: 0 },
                zIndex: { xs: 1, sm: 3 },
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                letterSpacing: "1px",
                fontWeight: 300,
                width: { xs: 120, sm: 180 },
                minWidth: { xs: 120, sm: 180 },
                background: "rgb(0, 0, 0)",
              }}
            >
              GAME
            </TableCell>
            <TableCell
              sx={{
                position: { xs: "static", sm: "sticky" },
                left: { xs: "auto", sm: 180 },
                zIndex: { xs: 1, sm: 3 },
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                letterSpacing: "1px",
                fontWeight: 500,
                width: { xs: 200, sm: 300 },
                minWidth: { xs: 200, sm: 300 },
                background: "rgb(24, 68, 53)",
              }}
            >
              BEST ODDS
            </TableCell>
            {bookIds.map((bookId) => (
              <TableCell
                key={bookId}
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  letterSpacing: "1px",
                  fontWeight: 300,
                  minWidth: { xs: 180, sm: 220 },
                  background: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {bookNames[bookId] || `BOOK {bookId}`}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {games.map((g: AnyObj, index:number) => {
            const away = g?.teams?.find((t: AnyObj) => t.id === g.away_team_id);
            const home = g?.teams?.find((t: AnyObj) => t.id === g.home_team_id);

            const awayName = away?.display_name ?? "Away";
            const homeName = home?.display_name ?? "Home";
            const awayAbbr = away?.abbr ?? "AWY";
            const homeAbbr = home?.abbr ?? "HME";
            const bestCell = bestCells[index];
            return (
              <TableRow
                key={g.id}
                sx={{
                  "&:nth-of-type(odd) > td": { backgroundColor: "rgb(20, 20, 20)" },
                  "&:nth-of-type(even) > td": { backgroundColor: "rgb(9, 9, 9)" },
                  "&:hover > td": { backgroundColor: "rgb(20, 20, 20)" },
                  borderBottom: "none",
                  transition: "background 0.2s ease",
                }}
              >
                <TableCell sx={{ 
                  position: { xs: "static", sm: "sticky" }, 
                  left: { xs: "auto", sm: 0 }, 
                  zIndex: { xs: 1, sm: 3 }, 
                  border: "none", 
                  py: { xs: 1, sm: 2 }, 
                  verticalAlign: "top",
                  width: { xs: 120, sm: 180 },
                  minWidth: { xs: 120, sm: 180 },
                  borderRight: "1px solid rgba(255,255,255,0.08)", 
                  background: "rgb(0, 0, 0)",
                }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>
                      {awayName} @ {homeName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: 300, fontSize: "0.7rem" }}>
                      {fmtStartTime(g?.start_time)}
                    </Typography>
                    {/* Horizontal labels */}
                  </Box>
                </TableCell>

                <TableCell sx={{
                  position: { xs: "static", sm: "sticky" },
                  left: { xs: "auto", sm: 180 },
                  zIndex: { xs: 1, sm: 3 }, 
                  borderRight: "1px solid rgba(255,255,255,0.08)", 
                  py: { xs: 1, sm: 2 }, 
                  verticalAlign: "top", 
                  justifySelf: "baseline",
                  width: { xs: 200, sm: 300 },
                  minWidth: { xs: 200, sm: 300 },
                  backgroundColor: "rgb(0, 30, 0) !important",  // Green tint for "best" - override row colors
                  "&:hover": {
                    backgroundColor: "rgb(0, 30, 0) !important",  // Maintain green on hover
                  }
                }}>
                  <Typography variant="caption" sx={{ color: "rgba(0,255,171,0.9)", fontSize: "0.65rem", letterSpacing: 1 }}>
                  </Typography>
                  <BookOddsCell cell={bestCell} awayAbbr={awayAbbr} homeAbbr={homeAbbr} isBest/>
                </TableCell>


                {bookIds.map((bookId) => {
                  const cell = parseBookCell(bookId, g?.markets?.[bookId]);
                  const hasAnything =
                    cell.spreadAway || cell.spreadHome || cell.totalOver || cell.totalUnder || cell.mlAway || cell.mlHome;

                  return (
                    <TableCell key={bookId} sx={{ paddingRight: { xs: "5px", sm: "10px" }, py: { xs: 1, sm: 2 }, verticalAlign: "top", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
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

export default NFLOdds;

