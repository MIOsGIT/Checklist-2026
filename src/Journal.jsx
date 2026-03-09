    import { useState, useEffect } from "react";

    const DAY_LABELS = ["일","월","화","수","목","금","토"];
    const MARCH_DAYS = Array.from({ length: 26 }, (_, i) => i + 6); // 3/6 ~ 3/31

    function getDayLabel(day) { return DAY_LABELS[new Date(2026, 2, day).getDay()]; }
    function isWeekend(day) { const d = new Date(2026, 2, day).getDay(); return d === 0 || d === 6; }

    const todayDate = new Date();
    const TODAY_DAY = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2
    ? todayDate.getDate()
    : 9; // 기본값

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
    const [selectedDay, setSelectedDay] = useState(
        MARCH_DAYS.includes(TODAY_DAY) ? TODAY_DAY : 9
    );
    const [view, setView] = useState("write"); // "write" | "list"
    const [journals, setJournals] = useState(() => {
        try { return JSON.parse(localStorage.getItem("mio-journal-v1") || "{}"); }
        catch { return {}; }
    });

    useEffect(() => {
        try { localStorage.setItem("mio-journal-v1", JSON.stringify(journals)); }
        catch {}
    }, [journals]);

    const key = `2026-03-${String(selectedDay).padStart(2, "0")}`;
    const entry = journals[key] || { study: null, condition: null, tags: [], memo: "" };

    const update = (field, value) => {
        setJournals(p => ({
        ...p,
        [key]: { ...entry, [field]: value }
        }));
    };

    const toggleTag = (tag) => {
        const tags = entry.tags || [];
        update("tags", tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
    };

    const filledDays = MARCH_DAYS.filter(d => {
        const k = `2026-03-${String(d).padStart(2, "0")}`;
        const j = journals[k];
        return j && (j.study || j.condition || j.memo);
    });

    return (
        <div style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}>

        {/* 상단 뷰 전환 */}
        <div style={{ display: "flex", gap: 8, padding: "16px 16px 8px" }}>
            <button onClick={() => setView("write")} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, fontFamily: "'Pretendard', sans-serif",
            background: view === "write" ? "#7c3aed" : "white",
            color: view === "write" ? "white" : "#6b7280",
            boxShadow: view === "write" ? "0 2px 12px rgba(124,58,237,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
            transition: "all 0.2s"
            }}>✏️ 오늘 일지 쓰기</button>
            <button onClick={() => setView("list")} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, fontFamily: "'Pretendard', sans-serif",
            background: view === "list" ? "#7c3aed" : "white",
            color: view === "list" ? "white" : "#6b7280",
            boxShadow: view === "list" ? "0 2px 12px rgba(124,58,237,0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
            transition: "all 0.2s"
            }}>📚 지난 일지 보기 {filledDays.length > 0 && `(${filledDays.length})`}</button>
        </div>

        {/* ── 일지 작성 뷰 ── */}
        {view === "write" && (
            <div style={{ padding: "0 16px 24px" }}>

            {/* 날짜 선택 */}
            <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 10 }}>📅 날짜 선택</div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                {MARCH_DAYS.map(d => {
                    const k = `2026-03-${String(d).padStart(2, "0")}`;
                    const hasEntry = journals[k] && (journals[k].study || journals[k].memo);
                    const isTdy = d === TODAY_DAY;
                    const isSel = d === selectedDay;
                    return (
                    <button key={d} onClick={() => setSelectedDay(d)} style={{
                        minWidth: 44, height: 52, borderRadius: 12, border: "none",
                        cursor: "pointer", flexShrink: 0, position: "relative",
                        background: isSel ? "#7c3aed" : isTdy ? "#eef2ff" : "white",
                        color: isSel ? "white" : isWeekend(d) ? "#ef4444" : "#374151",
                        boxShadow: isSel ? "0 2px 10px rgba(124,58,237,0.35)" : "0 1px 3px rgba(0,0,0,0.07)",
                        fontFamily: "'Pretendard', sans-serif",
                        transition: "all 0.15s"
                    }}>
                        <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>{d}</div>
                        <div style={{ fontSize: 9, fontWeight: 600 }}>{getDayLabel(d)}</div>
                        {hasEntry && (
                        <div style={{ position: "absolute", top: 4, right: 5, width: 6, height: 6, borderRadius: "50%", background: isSel ? "white" : "#7c3aed" }} />
                        )}
                    </button>
                    );
                })}
                </div>
            </div>

            {/* 날짜 헤더 */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.03em" }}>
                3월 {selectedDay}일 ({getDayLabel(selectedDay)})
                </span>
                {selectedDay === TODAY_DAY && (
                <span style={{ marginLeft: 8, fontSize: 12, background: "#7c3aed", color: "white", borderRadius: 99, padding: "2px 8px", fontWeight: 700 }}>TODAY</span>
                )}
            </div>

            {/* 학습도 */}
            <div style={{ background: "white", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>📊 오늘 학습도는?</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                {STUDY_LEVELS.map(l => (
                    <button key={l.emoji} onClick={() => update("study", entry.study === l.emoji ? null : l.emoji)} style={{
                    flex: 1, padding: "10px 4px", borderRadius: 12, border: "2px solid",
                    borderColor: entry.study === l.emoji ? "#7c3aed" : "#f1f5f9",
                    background: entry.study === l.emoji ? "#faf5ff" : "white",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "'Pretendard', sans-serif"
                    }}>
                    <div style={{ fontSize: 22 }}>{l.emoji}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: entry.study === l.emoji ? "#7c3aed" : "#9ca3af", marginTop: 4 }}>{l.label}</div>
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

            {/* 오늘의 태그 */}
            <div style={{ background: "white", borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>🏷️ 오늘 느낌 (여러 개 가능)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {MOOD_TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} style={{
                    padding: "6px 12px", borderRadius: 99, border: "1.5px solid",
                    borderColor: (entry.tags || []).includes(tag) ? "#7c3aed" : "#e5e7eb",
                    background: (entry.tags || []).includes(tag) ? "#faf5ff" : "white",
                    color: (entry.tags || []).includes(tag) ? "#7c3aed" : "#6b7280",
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
                    outline: "none", boxSizing: "border-box",
                    background: "#fafafa"
                }}
                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <div style={{ textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                자동 저장됨 💾
                </div>
            </div>
            </div>
        )}

        {/* ── 지난 일지 목록 뷰 ── */}
        {view === "list" && (
            <div style={{ padding: "0 16px 24px" }}>
            {filledDays.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>아직 작성된 일지가 없어요</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>오늘 일지를 먼저 써볼까요? 🌸</div>
                </div>
            ) : (
                [...filledDays].reverse().map(d => {
                const k = `2026-03-${String(d).padStart(2, "0")}`;
                const j = journals[k] || {};
                return (
                    <div key={d} onClick={() => { setSelectedDay(d); setView("write"); }} style={{
                    background: "white", borderRadius: 16, padding: "16px 18px", marginBottom: 10,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)", cursor: "pointer",
                    borderLeft: `4px solid ${d === TODAY_DAY ? "#7c3aed" : "#e5e7eb"}`,
                    transition: "all 0.15s"
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>
                            3/{d} ({getDayLabel(d)})
                        </span>
                        {d === TODAY_DAY && <span style={{ fontSize: 11, background: "#7c3aed", color: "white", borderRadius: 99, padding: "1px 7px", fontWeight: 700 }}>TODAY</span>}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                        {j.study && <span style={{ fontSize: 20 }}>{j.study}</span>}
                        {j.condition && <span style={{ fontSize: 20 }}>{j.condition}</span>}
                        </div>
                    </div>
                    {(j.tags || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                        {j.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 11, background: "#f3f0ff", color: "#7c3aed", borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>{tag}</span>
                        ))}
                        </div>
                    )}
                    {j.memo ? (
                        <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {j.memo}
                        </div>
                    ) : (
                        <div style={{ fontSize: 12, color: "#d1d5db" }}>메모 없음</div>
                    )}
                    <div style={{ marginTop: 8, fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>눌러서 편집 →</div>
                    </div>
                );
                })
            )}
            </div>
        )}
        </div>
    );
    }