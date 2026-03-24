import { useState, useEffect } from "react";

const DAY_LABELS = ["일","월","화","수","목","금","토"];
const MARCH_DAYS = Array.from({ length: 22 }, (_, i) => i + 10); // 3/10 ~ 3/31
const APRIL_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);  // 4/1 ~ 4/30

function getDayLabelMar(d) { return DAY_LABELS[new Date(2026, 2, d).getDay()]; }
function getDayLabelApr(d) { return DAY_LABELS[new Date(2026, 3, d).getDay()]; }
function isWeekendMar(d) { const w = new Date(2026, 2, d).getDay(); return w === 0 || w === 6; }
function isWeekendApr(d) { const w = new Date(2026, 3, d).getDay(); return w === 0 || w === 6; }

const todayDate = new Date();
const IS_MARCH = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2;
const IS_APRIL = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 3;
const TODAY_DAY = todayDate.getDate();

const STUDY_LEVELS = [
  { emoji: "🔥", label: "불타오름" },
  { emoji: "😊", label: "잘했어" },
  { emoji: "😐", label: "보통" },
  { emoji: "😴", label: "졸렸음" },
  { emoji: "💀", label: "망했다" },
];

const CONDITION_LEVELS = [
  { emoji: "✨", label: "최상" },
  { emoji: "😄", label: "좋음" },
  { emoji: "😌", label: "보통" },
  { emoji: "😔", label: "피곤" },
  { emoji: "🤒", label: "아픔" },
];

const MOOD_TAGS = ["집중잘됨🎯","뿌듯함🌟","힘들었지만함🥲","재밌었음😆","지루했음😑","발전한것같음📈","모르겠음🌀"];

export default function Journal() {
  const [journalMonth, setJournalMonth] = useState(IS_APRIL ? "apr" : "mar");
  const [selectedDay, setSelectedDay] = useState(() => {
    if (IS_MARCH) return MARCH_DAYS.includes(TODAY_DAY) ? TODAY_DAY : 10;
    if (IS_APRIL) return TODAY_DAY;
    return 10;
  });
  const [view, setView] = useState("write");
  const [expandedDays, setExpandedDays] = useState({});
  const [journals, setJournals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-journal-v1") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem("mio-journal-v1", JSON.stringify(journals)); }
    catch {}
  }, [journals]);

  // 월 바꾸면 날짜도 리셋
  const handleMonthChange = (m) => {
    setJournalMonth(m);
    if (m === "mar") {
      setSelectedDay(IS_MARCH && MARCH_DAYS.includes(TODAY_DAY) ? TODAY_DAY : 10);
    } else {
      setSelectedDay(IS_APRIL ? TODAY_DAY : 1);
    }
  };

  const days     = journalMonth === "mar" ? MARCH_DAYS : APRIL_DAYS;
  const monthNum = journalMonth === "mar" ? "03" : "04";
  const getDayLabel = journalMonth === "mar" ? getDayLabelMar : getDayLabelApr;
  const isWeekend   = journalMonth === "mar" ? isWeekendMar  : isWeekendApr;
  const isToday = (d) => journalMonth === "mar" ? (IS_MARCH && d === TODAY_DAY) : (IS_APRIL && d === TODAY_DAY);
  const monthLabel  = journalMonth === "mar" ? "3월" : "4월";

  const key   = `2026-${monthNum}-${String(selectedDay).padStart(2, "0")}`;
  const entry = journals[key] || { study: null, condition: null, tags: [], memo: "" };

  const update = (field, value) => {
    setJournals(p => ({ ...p, [key]: { ...entry, [field]: value } }));
  };

  const toggleTag = (tag) => {
    const tags = entry.tags || [];
    update("tags", tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  };

  const filledDays = days.filter(d => {
    const k = `2026-${monthNum}-${String(d).padStart(2, "0")}`;
    const j = journals[k];
    return j && (j.study || j.condition || j.memo);
  });

  const PINK = "#db2777";

  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}>

      {/* 월 선택 탭 */}
      <div style={{ display: "flex", gap: 8, padding: "16px 16px 8px" }}>
        {[["mar", "🌸 3월"], ["apr", "🌿 4월"]].map(([m, label]) => (
          <button key={m} onClick={() => handleMonthChange(m)} style={{
            flex: 1, padding: "9px", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 13, fontFamily: "'Pretendard', sans-serif",
            background: journalMonth === m ? PINK : "white",
            color: journalMonth === m ? "white" : "#9ca3af",
            boxShadow: journalMonth === m ? "0 2px 12px rgba(219,39,119,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
            transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      {/* 뷰 전환 */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 8px" }}>
        <button onClick={() => setView("write")} style={{
          flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer",
          fontWeight: 700, fontSize: 14, fontFamily: "'Pretendard', sans-serif",
          background: view === "write" ? PINK : "white",
          color: view === "write" ? "white" : "#6b7280",
          boxShadow: view === "write" ? "0 2px 12px rgba(219,39,119,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
          transition: "all 0.2s"
        }}>✏️ 일지 쓰기</button>
        <button onClick={() => setView("list")} style={{
          flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer",
          fontWeight: 700, fontSize: 14, fontFamily: "'Pretendard', sans-serif",
          background: view === "list" ? PINK : "white",
          color: view === "list" ? "white" : "#6b7280",
          boxShadow: view === "list" ? "0 2px 12px rgba(219,39,119,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
          transition: "all 0.2s"
        }}>📚 지난 일지 {filledDays.length > 0 && `(${filledDays.length})`}</button>
      </div>

      {/* ── 일지 작성 뷰 ── */}
      {view === "write" && (
        <div style={{ padding: "0 16px 24px" }}>

          {/* 날짜 선택 */}
          <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 10 }}>📅 날짜 선택</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {days.map(d => {
                const k = `2026-${monthNum}-${String(d).padStart(2, "0")}`;
                const hasEntry = journals[k] && (journals[k].study || journals[k].memo);
                const isSel = d === selectedDay;
                const isTdy = isToday(d);
                return (
                  <button key={d} onClick={() => setSelectedDay(d)} style={{
                    minWidth: 44, height: 52, borderRadius: 12, border: "none",
                    cursor: "pointer", flexShrink: 0, position: "relative",
                    background: isSel ? PINK : isTdy ? "#fdf2f8" : "white",
                    color: isSel ? "white" : isWeekend(d) ? "#ef4444" : "#374151",
                    boxShadow: isSel ? "0 2px 10px rgba(219,39,119,0.35)" : "0 1px 3px rgba(0,0,0,0.07)",
                    fontFamily: "'Pretendard', sans-serif", transition: "all 0.15s"
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>{d}</div>
                    <div style={{ fontSize: 9, fontWeight: 600 }}>{getDayLabel(d)}</div>
                    {hasEntry && (
                      <div style={{ position: "absolute", top: 4, right: 5, width: 6, height: 6, borderRadius: "50%", background: isSel ? "white" : PINK }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 날짜 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.03em" }}>
              {monthLabel} {selectedDay}일 ({getDayLabel(selectedDay)})
            </span>
            {isToday(selectedDay) && (
              <span style={{ marginLeft: 8, fontSize: 12, background: PINK, color: "white", borderRadius: 99, padding: "2px 8px", fontWeight: 700 }}>TODAY</span>
            )}
          </div>

          {/* 학습도 */}
          <div style={{ background: "white", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>📊 오늘 학습도는?</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
              {STUDY_LEVELS.map(l => (
                <button key={l.emoji} onClick={() => update("study", entry.study === l.emoji ? null : l.emoji)} style={{
                  flex: 1, padding: "10px 4px", borderRadius: 12, border: "2px solid",
                  borderColor: entry.study === l.emoji ? PINK : "#f1f5f9",
                  background: entry.study === l.emoji ? "#fdf2f8" : "white",
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "'Pretendard', sans-serif"
                }}>
                  <div style={{ fontSize: 22 }}>{l.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: entry.study === l.emoji ? PINK : "#9ca3af", marginTop: 4 }}>{l.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 컨디션 */}
          <div style={{ background: "white", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>💪 오늘 컨디션은?</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
              {CONDITION_LEVELS.map(l => (
                <button key={l.emoji} onClick={() => update("condition", entry.condition === l.emoji ? null : l.emoji)} style={{
                  flex: 1, padding: "10px 4px", borderRadius: 12, border: "2px solid",
                  borderColor: entry.condition === l.emoji ? "#0ea5e9" : "#f1f5f9",
                  background: entry.condition === l.emoji ? "#f0f9ff" : "white",
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "'Pretendard', sans-serif"
                }}>
                  <div style={{ fontSize: 22 }}>{l.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: entry.condition === l.emoji ? "#0ea5e9" : "#9ca3af", marginTop: 4 }}>{l.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 태그 */}
          <div style={{ background: "white", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>🏷️ 오늘 느낌 (여러 개 가능)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOOD_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: "6px 12px", borderRadius: 99, border: "1.5px solid",
                  borderColor: (entry.tags || []).includes(tag) ? PINK : "#e5e7eb",
                  background: (entry.tags || []).includes(tag) ? "#fdf2f8" : "white",
                  color: (entry.tags || []).includes(tag) ? PINK : "#6b7280",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Pretendard', sans-serif", transition: "all 0.15s"
                }}>{tag}</button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div style={{ background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>📝 오늘 배운 것 / 느낀 것</div>
            <textarea
              value={entry.memo || ""}
              onChange={e => update("memo", e.target.value)}
              placeholder={"오늘 뭘 배웠는지, 어떤 게 어려웠는지,\n내일은 뭘 할지 자유롭게 써봐요 🌸"}
              style={{
                width: "100%", minHeight: 140, border: "1.5px solid #e5e7eb",
                borderRadius: 12, padding: "12px 14px", fontSize: 14,
                fontFamily: "'Pretendard', -apple-system, sans-serif",
                lineHeight: 1.7, color: "#374151", resize: "none",
                outline: "none", boxSizing: "border-box", background: "#fafafa"
              }}
              onFocus={e => e.target.style.borderColor = PINK}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
            <div style={{ textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 6 }}>자동 저장됨 💾</div>
          </div>
        </div>
      )}

      {/* ── 지난 일지 목록 ── */}
      {view === "list" && (
        <div style={{ padding: "0 16px 24px" }}>
          {filledDays.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{monthLabel} 일지가 아직 없어요</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>오늘 일지를 먼저 써볼까요? 🌸</div>
            </div>
          ) : (
            [...filledDays].reverse().map(d => {
              const k = `2026-${monthNum}-${String(d).padStart(2, "0")}`;
              const j = journals[k] || {};
              const isTdy = isToday(d);
              return (
                <div key={d} style={{
                  background: "white", borderRadius: 16, marginBottom: 10,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  borderLeft: `4px solid ${isTdy ? PINK : "#e5e7eb"}`,
                  overflow: "hidden"
                }}>
                  {/* 헤더 — 항상 보임, 클릭하면 펼치기/접기 */}
                  <div onClick={() => setExpandedDays(p => ({...p, [k]: !p[k]}))} style={{ padding: "16px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>
                        {monthLabel} {d}일 ({getDayLabel(d)})
                      </span>
                      {isTdy && <span style={{ fontSize: 11, background: PINK, color: "white", borderRadius: 99, padding: "1px 7px", fontWeight: 700 }}>TODAY</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {j.study && <span style={{ fontSize: 18 }}>{j.study}</span>}
                      {j.condition && <span style={{ fontSize: 18 }}>{j.condition}</span>}
                      <span style={{ fontSize: 12, color: "#9ca3af", transition: "transform 0.2s", display: "inline-block", transform: expandedDays[k] ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </div>
                  </div>
                  {/* 펼쳐진 내용 */}
                  {expandedDays[k] && (
                    <div style={{ padding: "0 18px 16px", borderTop: "1px solid #f1f5f9" }}>
                      {(j.tags || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, margin: "12px 0 10px" }}>
                          {j.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 11, background: "#fdf2f8", color: PINK, borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {j.memo ? (
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap", marginTop: (j.tags||[]).length ? 0 : 12 }}>
                          {j.memo}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: "#d1d5db", marginTop: 12 }}>메모 없음</div>
                      )}
                      <div onClick={() => { setSelectedDay(d); setView("write"); }} style={{ marginTop: 12, fontSize: 11, color: PINK, fontWeight: 600, cursor: "pointer", textAlign: "right" }}>✏️ 편집하기 →</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}