import Journal from "./Journal.jsx";
import { useState, useEffect, useRef } from "react";

const todayDate = new Date();
const TODAY_DAY = todayDate.getDate();
const IS_MARCH_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2;
const IS_APRIL_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 3;
const TODAY_APR_DAY = IS_APRIL_2026 ? todayDate.getDate() : null;

const DEFAULT_TAGS = [
  { id: "tag-lecture",   icon: "🎬", label: "얄코 강의" },
  { id: "tag-practice",  icon: "✏️", label: "직접 실습" },
  { id: "tag-algo",      icon: "🐍", label: "Python 알고리즘" },
  { id: "tag-nestjs",    icon: "🔁", label: "NestJS 복습" },
  { id: "tag-quiz",      icon: "📝", label: "퀴즈/정리" },
  { id: "tag-ca",        icon: "⚙️", label: "컴퓨터알고리즘" },
  { id: "tag-cg",        icon: "🎨", label: "컴퓨터그래픽스" },
  { id: "tag-dip",       icon: "📷", label: "디지털영상처리" },
  { id: "tag-audio",     icon: "🎧", label: "오디오신호처리" },
  { id: "tag-java",      icon: "☕", label: "자바프로그래밍" },
];

const BASE_TASKS_BY_DAY = {
  // ── 3/23(월) — 근로 09~17 ──
  23: [
    { id:"t1",  text:"👩🏻‍💻 근로(오전): 전공 필기 가볍게 정리",              tagId:"tag-quiz" },
    { id:"t2",  text:"👩🏻‍💻 근로(오후): 전공 필기 계속 or 백준 1문제",        tagId:"tag-quiz" },
    { id:"t3",  text:"🎬 10~13강 (컴포넌트/JSX/조건부·리스트 렌더링)", tagId:"tag-lecture" },
    { id:"t4",  text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  // ── 3/24(화) — 오디오(11시) 그래픽스(13~14시) ──
  24: [
    { id:"t5",  text:"🎬 14~17강 (스타일링/Props/이벤트/State기초)",   tagId:"tag-lecture" },
    { id:"t6",  text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-audio" },
    { id:"t7",  text:"🎨 컴퓨터그래픽스 수업 복습",                   tagId:"tag-cg" },
    { id:"t8",  text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  // ── 3/25(수) — 알고리즘(09~10시) 디지털영상(12~14시) ──
  25: [
    { id:"t9",  text:"🎬 18~20강 (State심화/useReducer/useRef)",       tagId:"tag-lecture" },
    { id:"t10", text:"⚙️ 컴퓨터알고리즘 수업 복습",                   tagId:"tag-ca" },
    { id:"t11", text:"📷 디지털영상처리 수업 복습",                    tagId:"tag-dip" },
    { id:"t12", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  // ── 3/26(목) — 근로 09~11·15~17 + 수업 + 알바 ──
  26: [
    { id:"t13", text:"👩🏻‍💻 근로(오전): 전날 React 개념 복습",                tagId:"tag-lecture" },
    { id:"t14", text:"👩🏻‍💻 근로(오후): 오늘 수업 필기 정리 (그래픽스·디지털영상·알고리즘)", tagId:"tag-quiz" },
    { id:"t15", text:"🐍 백준 Python 1문제 (근로 중)",                       tagId:"tag-algo" },
  ],
  // ── 3/27(금) — 근로 09~11 + 수업 + 알바 ──
  27: [
    { id:"t16", text:"👩🏻‍💻 근로(오전): 전공 복습 or 백준 1문제",             tagId:"tag-quiz" },
    { id:"t19", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  // ── 3/28(토) — 낮 집중 ──
  28: [
    { id:"t20", text:"🎬 21~25강 (useEffect/커스텀훅/최적화/Context)", tagId:"tag-lecture" },
    { id:"t21", text:"✏️ Context 다크모드 토글 실습",                  tagId:"tag-practice" },
    { id:"t22", text:"⚙️ 컴퓨터알고리즘 집중복습",                    tagId:"tag-ca" },
    { id:"t23", text:"📷 디지털영상처리 집중복습",                     tagId:"tag-dip" },
    { id:"t24", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  // ── 3/29(일) — 데이트 🌸 ──
  29: [
    { id:"t25", text:"🎬 짬날 때: 26~27강 (라우팅/React19) 가볍게",         tagId:"tag-lecture" },
  ],
  // ── 3/30(월) — 근로 09~17 ──
  30: [
    { id:"t26", text:"👩🏻‍💻 근로(오전): 28~30강 완강 🎉 (이어폰 끼고!)",     tagId:"tag-lecture" },
    { id:"t27", text:"👩🏻‍💻 근로(오후): 완강 나머지 + 개념 메모",             tagId:"tag-lecture" },
    { id:"t28", text:"📝 완강 회고 + 배운 개념 정리",                  tagId:"tag-quiz" },
    { id:"t29", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  // ── 3/31(화) ──
  31: [
    { id:"t30", text:"📋 4월 계획 확인",                                     tagId:"tag-quiz" },
    { id:"t31", text:"📌 GitHub 커밋으로 3월 마무리 ✨",                     tagId:"tag-quiz" },
    { id:"t32", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
};


// ── 4월 기본 태스크 ──
const APR_TASKS_BY_DAY = {
  // ── 1주차 4/1(수)~4/5(일) ──
  1:  [
    { id:"a1",  text:"⚙️ 컴퓨터알고리즘 수업 복습",                   tagId:"tag-ca" },
    { id:"a2",  text:"📷 디지털영상처리 수업 복습",                    tagId:"tag-dip" },
    { id:"a3",  text:"✏️ React 프로젝트 Vite 생성 + 레이아웃",        tagId:"tag-practice" },
    { id:"a4",  text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  2:  [
    { id:"a5",  text:"👩🏻‍💻 근로(오전): 전공 복습",                           tagId:"tag-quiz" },
    { id:"a6",  text:"👩🏻‍💻 근로(오후): 전공 복습 계속",                      tagId:"tag-quiz" },
    { id:"a7",  text:"🐍 백준 Python 1문제 (근로 중)",                       tagId:"tag-algo" },
  ],
  3:  [
    { id:"a8",  text:"👩🏻‍💻 근로(오전): 전공 복습",                           tagId:"tag-quiz" },
    { id:"a9",  text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-audio" },
    { id:"a10", text:"☕ 자바프로그래밍 수업 복습",                    tagId:"tag-java" },
    { id:"a11", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  4:  [
    { id:"a12", text:"✏️ React 핵심기능 1 구현 (목록/검색)",             tagId:"tag-practice" },
    { id:"a13", text:"🎨 컴퓨터그래픽스 집중복습",                      tagId:"tag-cg" },
    { id:"a14", text:"🎧 오디오신호처리 집중복습",                       tagId:"tag-audio" },
    { id:"a15", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  5:  [
    { id:"a16", text:"🌸 데이트 — 쉬기",                                    tagId:"tag-quiz" },
  ],
  // ── 2주차 4/6(월)~4/12(일) ──
  6:  [
    { id:"a17", text:"👩🏻‍💻 근로(오전): ⚙️ 알고리즘 과제 체크",              tagId:"tag-ca" },
    { id:"a18", text:"👩🏻‍💻 근로(오후): 전공 복습 계속",                      tagId:"tag-quiz" },
    { id:"a19", text:"✏️ React 핵심기능 2 (상세/추가/삭제)",           tagId:"tag-practice" },
    { id:"a20", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  7:  [
    { id:"a21", text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-audio" },
    { id:"a22", text:"🎨 컴퓨터그래픽스 수업 복습",                   tagId:"tag-cg" },
    { id:"a23", text:"✏️ coupang NestJS API 로컬 실행 + fetch 연결",   tagId:"tag-practice" },
    { id:"a24", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  8:  [
    { id:"a25", text:"⚙️ 컴퓨터알고리즘 수업 복습",                   tagId:"tag-ca" },
    { id:"a26", text:"📷 디지털영상처리 수업 복습",                    tagId:"tag-dip" },
    { id:"a27", text:"✏️ CORS 해결 + 상품 목록 API → 화면 출력",      tagId:"tag-practice" },
    { id:"a28", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  9:  [
    { id:"a29", text:"👩🏻‍💻 근로(오전): ⚙️ 알고리즘 필기 정리",              tagId:"tag-ca" },
    { id:"a30", text:"👩🏻‍💻 근로(오후): 📷 디지털영상·🎨 그래픽스 필기 정리", tagId:"tag-dip" },
    { id:"a31", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  10: [
    { id:"a32", text:"👩🏻‍💻 근로(오전): 🎧 오디오 과제 체크",                tagId:"tag-audio" },
    { id:"a33", text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-audio" },
    { id:"a34", text:"☕ 자바프로그래밍 수업 복습",                    tagId:"tag-java" },
    { id:"a35", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  11: [
    { id:"a36", text:"✏️ Tailwind CSS 적용",                            tagId:"tag-practice" },
    { id:"a37", text:"⚙️ 컴퓨터알고리즘 집중복습",                      tagId:"tag-ca" },
    { id:"a38", text:"☕ 자바프로그래밍 집중복습",                       tagId:"tag-java" },
    { id:"a39", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  12: [
    { id:"a40", text:"🌸 데이트 — 쉬기",                                    tagId:"tag-quiz" },
  ],
  // ── 3주차 4/13(월)~4/19(일) — 🚨 시험 2주 전! 전공 집중 ──
  13: [
    { id:"a41", text:"👩🏻‍💻 근로(오전): ⚙️ 컴퓨터알고리즘 시험범위 1회독",  tagId:"tag-ca" },
    { id:"a42", text:"👩🏻‍💻 근로(오후): ⚙️ 알고리즘 약점 정리",              tagId:"tag-ca" },
    { id:"a43", text:"📝 알고리즘 핵심 개념 정리",                     tagId:"tag-ca" },
    { id:"a44", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  14: [
    { id:"a45", text:"🎨 컴퓨터그래픽스 수업 복습",                   tagId:"tag-cg" },
    { id:"a46", text:"🎨 그래픽스 시험범위 정리",                      tagId:"tag-cg" },
    { id:"a47", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  15: [
    { id:"a48", text:"⚙️ 컴퓨터알고리즘 수업 복습",                   tagId:"tag-ca" },
    { id:"a49", text:"📷 디지털영상처리 시험범위 정리",                tagId:"tag-dip" },
    { id:"a50", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  16: [
    { id:"a51", text:"👩🏻‍💻 근로(오전): 🎧 오디오신호처리 시험범위 1회독",   tagId:"tag-audio" },
    { id:"a52", text:"👩🏻‍💻 근로(오후): 🎧 오디오 약점 정리",                tagId:"tag-audio" },
  ],
  17: [
    { id:"a53", text:"👩🏻‍💻 근로(오전): ☕ 자바프로그래밍 시험범위 복습",    tagId:"tag-java" },
    { id:"a54", text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-audio" },
    { id:"a55", text:"☕ 자바프로그래밍 수업 복습",                    tagId:"tag-java" },
  ],
  18: [
    { id:"a56", text:"📚 전과목 약점 정리 (1과목씩)",           tagId:"tag-quiz" },
    { id:"a57", text:"🎬 React 코드 읽기만 (가볍게)",              tagId:"tag-lecture" },
    { id:"a58", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  19: [
    { id:"a59", text:"🌸 데이트 — 쉬기",                                    tagId:"tag-quiz" },
  ],
  // ── 4주차 4/20(월)~4/26(일) — 🏫 중간고사 ──
  20: [
    { id:"a60", text:"👩🏻‍💻 근로(오전): 시험 직전 최종 정리",                tagId:"tag-quiz" },
    { id:"a61", text:"👩🏻‍💻 근로(오후): 시험 직전 최종 정리 계속",           tagId:"tag-quiz" },
    { id:"a62", text:"📝 약점 과목 집중 마무리",                       tagId:"tag-quiz" },
  ],
  21: [
    { id:"a63", text:"🏫 중간고사 — 컨디션 관리, 코딩 완전 휴식 🙏",        tagId:"tag-quiz" },
  ],
  22: [
    { id:"a64", text:"🏫 중간고사 — 코딩 완전 휴식 🙏",                     tagId:"tag-quiz" },
  ],
  23: [
    { id:"a65", text:"🏫 중간고사 — 코딩 완전 휴식 🙏",                     tagId:"tag-quiz" },
  ],
  24: [
    { id:"a66", text:"🏫 중간고사 — 코딩 완전 휴식 🙏",                     tagId:"tag-quiz" },
  ],
  25: [
    { id:"a67", text:"🎉 시험 끝! 컨디션 회복 + 중간 돌아보기",             tagId:"tag-quiz" },
    { id:"a68", text:"🐍 백준 Python 1문제 (복귀!)",                         tagId:"tag-algo" },
  ],
  26: [
    { id:"a69", text:"🌸 데이트 — 쉬기",                                    tagId:"tag-quiz" },
  ],
  // ── 5주차 4/27(월)~4/30(목) ──
  27: [
    { id:"a70", text:"👩🏻‍💻 근로(오전): 🎬 React Query 개념 공부",           tagId:"tag-lecture" },
    { id:"a71", text:"👩🏻‍💻 근로(오후): 🎬 React Query 계속",                tagId:"tag-lecture" },
    { id:"a72", text:"✏️ React Query useQuery 실습",                   tagId:"tag-practice" },
    { id:"a73", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  28: [
    { id:"a74", text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-audio" },
    { id:"a75", text:"🎨 컴퓨터그래픽스 수업 복습",                   tagId:"tag-cg" },
    { id:"a76", text:"☕ 자바 팀프로젝트 팀원과 킥오프",              tagId:"tag-java" },
    { id:"a77", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  29: [
    { id:"a78", text:"⚙️ 컴퓨터알고리즘 수업 복습",                   tagId:"tag-ca" },
    { id:"a79", text:"📷 디지털영상처리 수업 복습",                    tagId:"tag-dip" },
    { id:"a80", text:"✏️ React Query useMutation 실습",                tagId:"tag-practice" },
    { id:"a81", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
  30: [
    { id:"a82", text:"👩🏻‍💻 근로(오전): 4월 전체 회고 작성",                 tagId:"tag-quiz" },
    { id:"a83", text:"👩🏻‍💻 근로(오후): 5월 계획 초안",                       tagId:"tag-quiz" },
    { id:"a84", text:"📝 4월 회고 마무리 + GitHub 커밋",               tagId:"tag-quiz" },
    { id:"a85", text:"🐍 백준 Python 1문제",                                 tagId:"tag-algo" },
  ],
};

const APR_WEEKS_META = [
  { id:"apr-week1", label:"1주차", range:"4/1(수) ~ 4/5(일)",   month:"apr", theme:"✏️ React 프로젝트 시작",           themeDesc:"Vite 생성·레이아웃·핵심기능 1 / 전공 당일복습 유지",     color:"#8b5cf6", lightColor:"#f5f3ff", days:[1,2,3,4,5] },
  { id:"apr-week2", label:"2주차", range:"4/6(월) ~ 4/12(일)",  month:"apr", theme:"🔗 coupang 연결 + Tailwind",       themeDesc:"API 연동·CORS 해결·화면 출력 / 전공 과제 체크",          color:"#0ea5e9", lightColor:"#f0f9ff", days:[6,7,8,9,10,11,12] },
  { id:"apr-week3", label:"3주차", range:"4/13(월) ~ 4/19(일)", month:"apr", theme:"🚨 시험 2주 전! 전공 집중",        themeDesc:"전과목 1회독 + 시험범위 정리 / React 가볍게 유지",       color:"#ef4444", lightColor:"#fef2f2", days:[13,14,15,16,17,18,19] },
  { id:"apr-week4", label:"4주차", range:"4/20(월) ~ 4/26(일)", month:"apr", theme:"🏫 중간고사",                      themeDesc:"4/21~24 시험 — 코딩 완전 휴식 / 시험 후 회복",           color:"#f59e0b", lightColor:"#fffbeb", days:[20,21,22,23,24,25,26] },
  { id:"apr-week5", label:"5주차", range:"4/27(월) ~ 4/30(목)", month:"apr", theme:"🚀 React Query + 자바 팀프로젝트", themeDesc:"React Query 실습 / 팀프로젝트 킥오프 / 4월 회고",         color:"#10b981", lightColor:"#f0fdf4", days:[27,28,29,30] },
];
const WEEKS_META = [
  { id:"week1", label:"1주차", range:"3/23(월) ~ 3/29(일)", theme:"🎬 인강 완주 + 전공 당일복습",  themeDesc:"강의 10~27강 / 수업 당일 필기 / 근로 중 복습 / 알바 고려", color:"#ec4899", lightColor:"#fdf2f8", days:[23,24,25,26,27,28,29] },
  { id:"week2", label:"마무리", range:"3/30(월) ~ 3/31(화)", theme:"🎉 완강 + 4월 준비",           themeDesc:"28~30강 완강 / 완강 회고 / 4월 계획 확인",                 color:"#f59e0b", lightColor:"#fffbeb", days:[30,31] },
];
const ALL_BASE_TASKS = Object.values(BASE_TASKS_BY_DAY).flat();
const ALL_DAYS = Object.keys(BASE_TASKS_BY_DAY).map(Number);
const DAY_LABELS = ["일","월","화","수","목","금","토"];
const COLORS = ["#f59e0b","#ec4899","#10b981","#ef4444","#0ea5e9","#a855f7","#ec4899","#f97316"];

function getDayLabel(d) { return DAY_LABELS[new Date(2026,2,d).getDay()]; }
function getDayLabelApr(d) { return DAY_LABELS[new Date(2026,3,d).getDay()]; }
function isWeekendApr(d) { const w=new Date(2026,3,d).getDay(); return w===0||w===6; }
function isTodayApr(d) { return IS_APRIL_2026 && d===TODAY_APR_DAY; }
function isWeekend(d)   { const w=new Date(2026,2,d).getDay(); return w===0||w===6; }
function isToday(d)     { return IS_MARCH_2026 && d===TODAY_DAY; }
function getTodayLabel(){ return IS_MARCH_2026 ? `3/${TODAY_DAY}(${getDayLabel(TODAY_DAY)})` : null; }
function makeId()       { return `id-${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }
function makeConfetti(n=60){ return Array.from({length:n},(_,i)=>({ id:i, x:Math.random()*100, color:COLORS[Math.floor(Math.random()*COLORS.length)], size:Math.random()*8+5, delay:Math.random()*0.5, duration:Math.random()*1.5+1.5, shape:Math.random()>.5?"circle":"rect" })); }

export default function App() {
  // ── 태그 ──
  const [tags, setTags] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-tags") || "null") || DEFAULT_TAGS; }
    catch { return DEFAULT_TAGS; }
  });
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagIcon, setNewTagIcon]   = useState("🏷️");
  const [newTagLabel, setNewTagLabel] = useState("");

  // ── 할일 순서 (day → taskId[]) ──
  const [taskOrder, setTaskOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-task-order") || "{}"); }
    catch { return {}; }
  });
  // ── 커스텀 할일 ──
  const [customTasks, setCustomTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-custom-tasks") || "{}"); }
    catch { return {}; }
  });
  // ── 이동(미루기) ──
  const [moved, setMoved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-checklist-moved") || "{}"); }
    catch { return {}; }
  });
  // ── 체크 ──
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-checklist-v3") || "{}"); }
    catch { return {}; }
  });
  // ── 중요 표시 { taskId: true } ──
  const [important, setImportant] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-important") || "{}"); }
    catch { return {}; }
  });

  const [month, setMonth] = useState("mar"); // "mar" | "apr"
  const [openWeeks, setOpenWeeks] = useState({week1:true,week2:false,"apr-week1":false,"apr-week2":false,"apr-week3":false,"apr-week4":false,"apr-week5":false});
  const [tab, setTab]               = useState("all");
  const [moveModal, setMoveModal]   = useState(null);
  const [addState, setAddState]     = useState({});
  const [reorderMode, setReorderMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingText, setEditingText] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-editing-text") || "{}"); }
    catch { return {}; }
  });
  const [dragActiveId, setDragActiveId] = useState(null);
  const [confetti, setConfetti]     = useState([]);
  const [celebMsg, setCelebMsg]     = useState(null);
  const prevTodayDone = useRef(null);
  const prevAllDone   = useRef(null);
  const dragItem      = useRef(null);
  const dragOverItem  = useRef(null);

  useEffect(()=>{ try{localStorage.setItem("mio-tags",            JSON.stringify(tags));}          catch{} },[tags]);
  useEffect(()=>{ try{localStorage.setItem("mio-task-order",      JSON.stringify(taskOrder));}     catch{} },[taskOrder]);
  useEffect(()=>{ try{localStorage.setItem("mio-custom-tasks",    JSON.stringify(customTasks));}   catch{} },[customTasks]);
  useEffect(()=>{ try{localStorage.setItem("mio-checklist-moved", JSON.stringify(moved));}         catch{} },[moved]);
  useEffect(()=>{ try{localStorage.setItem("mio-checklist-v3",    JSON.stringify(checked));}       catch{} },[checked]);
  useEffect(()=>{ try{localStorage.setItem("mio-important",       JSON.stringify(important));}      catch{} },[important]);
  useEffect(()=>{ try{localStorage.setItem("mio-editing-text",    JSON.stringify(editingText));}    catch{} },[editingText]);

  useEffect(()=>{
    if(!IS_MARCH_2026) return;
    const wk = WEEKS_META.find(w=>w.days.includes(TODAY_DAY));
    if(wk) setOpenWeeks(p=>({...p,[wk.id]:true}));
  },[]);

  // ── 태그 추가 ──
  const addTag = () => {
    if(!newTagLabel.trim()) return;
    const id = `tag-${makeId()}`;
    setTags(p=>[...p, {id, icon:newTagIcon, label:newTagLabel.trim()}]);
    setNewTagIcon("🏷️"); setNewTagLabel(""); setShowTagInput(false);
  };
  const deleteTag = (id) => setTags(p=>p.filter(t=>t.id!==id));

  // ── 할일 순서 헬퍼: day의 정렬된 할일 반환 ──
  function getOrderedTasks(day) {
    const base    = (BASE_TASKS_BY_DAY[day]||[]);
    const custom  = (customTasks[day]||[]);
    const incoming= ALL_BASE_TASKS.filter(t=>moved[t.id]===day && !(BASE_TASKS_BY_DAY[day]||[]).find(b=>b.id===t.id));
    // 원래 할일 중 다른 날로 이동 안 된 것
    const staying = base.filter(t=>!(moved[t.id] && moved[t.id]!==day));

    // 전체 풀: 미룬것 먼저, 그다음 staying+custom 합쳐서 순서 적용
    const pool = [...incoming, ...staying, ...custom];
    const order = taskOrder[day];
    const orderMap = {};
    if(order) order.forEach((id,i)=>orderMap[id]=i);
    return [...pool].sort((a,b)=>{
      // 1순위: 중요 표시
      const aImp = !!important[a.id];
      const bImp = !!important[b.id];
      if(aImp && !bImp) return -1;
      if(!aImp && bImp) return 1;
      // 2순위: incoming(미룬 것)
      const aIn = !!incoming.find(t=>t.id===a.id);
      const bIn = !!incoming.find(t=>t.id===b.id);
      if(aIn && !bIn) return -1;
      if(!aIn && bIn) return 1;
      // 3순위: 사용자 지정 순서
      const ai = orderMap[a.id]??9999;
      const bi = orderMap[b.id]??9999;
      return ai-bi;
    });
  }

  // ── 드래그 ──
  const onDragStart = (e, day, taskId) => {
    dragItem.current = {day, id: taskId};
    setDragActiveId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };
  const onDragEnter = (e, day, taskId) => {
    e.preventDefault();
    if(!dragItem.current) return;
    if(dragItem.current.id === taskId) return;
    dragOverItem.current = {day, id: taskId};
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (e, day, taskId) => {
    e.preventDefault();
    if(!dragItem.current) return;
    if(dragItem.current.day !== day) return;
    const fromId = dragItem.current.id;
    const toId   = taskId;
    if(fromId === toId) return;
    const ordered = getOrderedTasks(day);
    const ids = ordered.map(t=>t.id);
    const fromIdx = ids.indexOf(fromId);
    const toIdx   = ids.indexOf(toId);
    if(fromIdx === -1 || toIdx === -1) return;
    const newIds = [...ids];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, fromId);
    setTaskOrder(p=>({...p, [day]: newIds}));
  };
  const onDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDragActiveId(null);
  };

  // ── 커스텀 할일 추가 ──
  const addCustomTask = (day) => {
    const s = addState[day]||{};
    if(!(s.text||"").trim()) return;
    const tag = tags.find(t=>t.id===s.tagId)||tags[0]||{icon:"➕",label:""};
    const newId = `custom-${makeId()}`;
    const newTask = { id:newId, text:`${tag.icon} ${s.text.trim()}`, tagId: tag.id };
    setCustomTasks(p=>({...p,[day]:[...(p[day]||[]),newTask]}));
    if(s.isImportant) setImportant(p=>({...p,[newId]:true}));
    setAddState(p=>({...p,[day]:{open:false,text:"",tagId:null,isImportant:false}}));
  };
  const deleteCustomTask = (day, taskId) => {
    setCustomTasks(p=>({...p,[day]:(p[day]||[]).filter(t=>t.id!==taskId)}));
    setChecked(p=>{ const n={...p}; delete n[taskId]; return n; });
    setTaskOrder(p=>({...p,[day]:(p[day]||[]).filter(id=>id!==taskId)}));
  };

  const toggle       = (id) => setChecked(p=>({...p,[id]:!p[id]}));
  const toggleImportant = (id) => setImportant(p=>({...p,[id]:!p[id]}));
  const toggleWeek   = (id) => setOpenWeeks(p=>({...p,[id]:!p[id]}));
  const openMoveModal= (taskId,taskText,fromDay) => setMoveModal({taskId,taskText,fromDay});
  const confirmMove  = (targetDay) => { if(!moveModal) return; setMoved(p=>({...p,[moveModal.taskId]:targetDay})); setMoveModal(null); };
  const cancelMove   = (taskId) => setMoved(p=>{ const n={...p}; delete n[taskId]; return n; });

  // ── 진행률 ──
  const allCustomFlat = Object.values(customTasks).flat();
  const allTasksCount = ALL_BASE_TASKS.length + allCustomFlat.length;
  const totalDone = [...ALL_BASE_TASKS, ...allCustomFlat].filter(t=>checked[t.id]).length;
  const progress  = Math.round((totalDone/allTasksCount)*100);

  const todayTasks = IS_MARCH_2026 ? (() => {
    const base = ALL_BASE_TASKS.filter(t=>{ const md=moved[t.id]; if(md) return md===TODAY_DAY; return (BASE_TASKS_BY_DAY[TODAY_DAY]||[]).find(b=>b.id===t.id); });
    return [...base,...(customTasks[TODAY_DAY]||[])];
  })() : [];
  const todayDone  = todayTasks.filter(t=>checked[t.id]).length;
  const allComplete= totalDone===allTasksCount && allTasksCount>0;

  // ── 축하 ──
  useEffect(()=>{
    if(prevTodayDone.current===null){prevTodayDone.current=todayDone;return;}
    if(todayTasks.length>0&&todayDone===todayTasks.length&&prevTodayDone.current<todayDone){
      setConfetti(makeConfetti(50)); setCelebMsg({type:"day",text:"오늘 할 일 완료! 🎉\n오늘도 고생했어 🌸"});
      setTimeout(()=>{setConfetti([]);setCelebMsg(null);},4000);
    }
    prevTodayDone.current=todayDone;
  },[todayDone]);
  useEffect(()=>{
    if(prevAllDone.current===null){prevAllDone.current=totalDone;return;}
    if(allComplete&&prevAllDone.current<totalDone){
      setConfetti(makeConfetti(120)); setCelebMsg({type:"all",text:"3월 전체 완료!!! 🎊\n진짜 대단해!! 🌸🌸🌸"});
      setTimeout(()=>{setConfetti([]);setCelebMsg(null);},6000);
    }
    prevAllDone.current=totalDone;
  },[totalDone,allComplete]);

  const PINK = "#db2777";
  const PINK_LIGHT = "#fdf2f8";

  return (<>
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Pretendard',-apple-system,sans-serif;background:linear-gradient(160deg,#fff0f6 0%,#fdf2f8 100%);}
      button,input,textarea{font-family:'Pretendard',-apple-system,sans-serif;}
      ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#f9a8d4;border-radius:99px;}
      .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
      .modal-box{background:white;border-radius:24px 24px 0 0;width:100%;max-width:480px;padding:24px 20px 40px;max-height:80vh;overflow-y:auto;}
      .day-btn{width:100%;border:1.5px solid #e5e7eb;background:#fafafa;border-radius:12px;padding:12px 16px;margin-bottom:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-family:'Pretendard',-apple-system,sans-serif;font-size:14px;font-weight:500;color:#374151;transition:all 0.15s;}
      .day-btn:hover{border-color:${PINK};background:#fdf2f8;color:${PINK};}
      @keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}
      .confetti-piece{position:fixed;top:-20px;z-index:999;pointer-events:none;animation:confetti-fall linear forwards;}
      @keyframes pop-in{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0;}60%{transform:translate(-50%,-50%) scale(1.1);opacity:1;}100%{transform:translate(-50%,-50%) scale(1);opacity:1;}}
      .celeb-msg{position:fixed;top:45%;left:50%;transform:translate(-50%,-50%);z-index:1000;pointer-events:none;text-align:center;background:white;border-radius:24px;padding:28px 36px;box-shadow:0 8px 40px rgba(219,39,119,0.25);animation:pop-in 0.4s cubic-bezier(.4,0,.2,1) forwards;white-space:pre-line;}
      @keyframes slide-down{0%{opacity:0;transform:translateY(-6px);}100%{opacity:1;transform:translateY(0);}}
      .slide-down{animation:slide-down 0.2s ease;}
      .task-row{transition:background 0.15s;}
      .task-row.dragging{opacity:0.35;}
      .drag-handle{
        cursor:grab;color:#d1d5db;font-size:18px;padding:2px 4px;
        touch-action:none;user-select:none;-webkit-user-drag:element;
        -webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;
        line-height:1;
      }
      .drag-handle:active{cursor:grabbing;color:#f9a8d4;}
    `}</style>

    {confetti.map(p=>(
      <div key={p.id} className="confetti-piece" style={{left:`${p.x}%`,width:p.shape==="circle"?p.size:p.size*0.7,height:p.shape==="circle"?p.size:p.size*1.4,background:p.color,borderRadius:p.shape==="circle"?"50%":"2px",animationDuration:`${p.duration}s`,animationDelay:`${p.delay}s`}}/>
    ))}
    {celebMsg&&(
      <div className="celeb-msg">
        <div style={{fontSize:celebMsg.type==="all"?48:36}}>{celebMsg.type==="all"?"🎊":"🎉"}</div>
        <div style={{fontSize:celebMsg.type==="all"?18:16,fontWeight:800,color:"#1e1b4b",marginTop:10,lineHeight:1.6}}>{celebMsg.text}</div>
      </div>
    )}

    <div style={{minHeight:"100vh",paddingBottom:48}}>

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,#f472b6 0%,${PINK} 100%)`,padding:"28px 20px 22px",color:"white",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 24px rgba(219,39,119,0.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontSize:11,fontWeight:500,opacity:0.75,letterSpacing:"0.05em"}}>📅 2026년 공부 플래너</div>
          <button onClick={()=>setTab("journal")} style={{border:"1.5px solid rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.15)",color:"white",borderRadius:99,padding:"4px 12px",fontSize:12,fontWeight:700,cursor:"pointer",backdropFilter:"blur(4px)",whiteSpace:"nowrap"}}>📓 학습일지</button>
        </div>
        <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",marginBottom:18,color:"white"}}>Study CheckList ✨</div>
        <div style={{background:"rgba(255,255,255,0.22)",borderRadius:99,height:8,marginBottom:7}}>
          <div style={{background:"white",height:"100%",borderRadius:99,width:`${progress}%`,transition:"width 0.5s cubic-bezier(.4,0,.2,1)"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:500,opacity:0.85,color:"white"}}>
          <span>전체 진행률</span>
          <span style={{fontWeight:700}}>{totalDone} / {allTasksCount}개 ({progress}%)</span>
        </div>
        {IS_MARCH_2026&&(
          <div style={{marginTop:14,background:"rgba(255,255,255,0.14)",borderRadius:12,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:500,color:"white"}}>✅ 오늘 ({getTodayLabel()}) 할 일</span>
            <span style={{fontSize:15,fontWeight:800,color:"white"}}>{todayDone} / {todayTasks.length} 완료</span>
          </div>
        )}
      </div>

      {/* 월 선택 탭 */}
      <div style={{display:"flex",gap:8,padding:"14px 16px 0",borderBottom:"1px solid #f1f5f9"}}>
        {[["mar","🌸 3월"],["apr","🌿 4월"]].map(([m,label])=>(
          <button key={m} onClick={()=>setMonth(m)} style={{padding:"8px 20px",borderRadius:"12px 12px 0 0",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.2s",background:month===m?"white":"transparent",color:month===m?"#db2777":"#9ca3af",boxShadow:month===m?"0 -2px 8px rgba(0,0,0,0.06)":""}}>{label}</button>
        ))}
      </div>

      {/* TAGS 범례 (가로 스크롤 + 추가) */}
      <div style={{padding:"14px 16px 4px"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6,scrollbarWidth:"none"}}>
          <style>{`.tag-scroll::-webkit-scrollbar{display:none;}`}</style>
          {tags.map(tag=>(
            <div key={tag.id} style={{display:"flex",alignItems:"center",gap:4,background:"white",borderRadius:99,padding:"5px 12px",fontSize:12,fontWeight:500,color:"#4b5563",boxShadow:"0 1px 4px rgba(0,0,0,0.07)",flexShrink:0}}>
              <span>{tag.icon}</span><span>{tag.label}</span>
              {!DEFAULT_TAGS.find(d=>d.id===tag.id)&&(
                <span onClick={()=>deleteTag(tag.id)} style={{marginLeft:2,cursor:"pointer",color:"#f9a8d4",fontSize:13,fontWeight:900}}>×</span>
              )}
            </div>
          ))}
          {/* 태그 추가 버튼 */}
          <button onClick={()=>setShowTagInput(p=>!p)} style={{flexShrink:0,padding:"5px 12px",borderRadius:99,border:`1.5px dashed ${PINK}`,background:"white",color:PINK,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
            {showTagInput?"✕":"+ 태그 추가"}
          </button>
        </div>
        {/* 태그 추가 입력 */}
        {showTagInput&&(
          <div className="slide-down" style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
            <input value={newTagIcon} onChange={e=>setNewTagIcon(e.target.value)} style={{width:44,textAlign:"center",border:`1.5px solid ${PINK}`,borderRadius:10,padding:"7px 6px",fontSize:18,outline:"none"}} maxLength={2} placeholder="🏷️"/>
            <input value={newTagLabel} onChange={e=>setNewTagLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} placeholder="태그 이름" style={{flex:1,border:`1.5px solid ${PINK}`,borderRadius:10,padding:"7px 12px",fontSize:13,outline:"none"}}/>
            <button onClick={addTag} style={{padding:"7px 14px",borderRadius:10,border:"none",background:PINK,color:"white",fontSize:13,fontWeight:700,cursor:"pointer"}}>추가</button>
          </div>
        )}
      </div>

      {/* TABS + 이동 버튼 */}
      <div style={{display:"flex",gap:8,padding:"12px 16px 8px",overflowX:"auto",alignItems:"center"}}>
        {[["all","📋 전체"],["today","🌅 오늘"],["undone","⏳ 미완료"],["moved","📦 미룬 할일"],["journal","📓 학습일지"]].map(([v,label])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 20px",borderRadius:99,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:tab===v?PINK:"white",color:tab===v?"white":"#6b7280",boxShadow:tab===v?`0 2px 14px rgba(219,39,119,0.35)`:"0 1px 4px rgba(0,0,0,0.08)"}}>{label}</button>
        ))}
        <div style={{flexShrink:0,marginLeft:"auto",display:"flex",gap:6}}>
          <button onClick={()=>{ setReorderMode(p=>!p); setEditMode(false); }} style={{padding:"8px 14px",borderRadius:99,border:`1.5px solid ${reorderMode?"#f59e0b":"#e5e7eb"}`,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:reorderMode?"#fffbeb":"white",color:reorderMode?"#d97706":"#9ca3af"}}>
            {reorderMode?"✅ 완료":"↕️ 이동"}
          </button>
          <button onClick={()=>{ setEditMode(p=>!p); setReorderMode(false); }} style={{padding:"8px 14px",borderRadius:99,border:`1.5px solid ${editMode?"#db2777":"#e5e7eb"}`,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:editMode?"#fdf2f8":"white",color:editMode?"#db2777":"#9ca3af"}}>
            {editMode?"✅ 완료":"✏️ 수정"}
          </button>
        </div>
      </div>

      {/* 미룬 할일 탭 */}
      {tab==="moved"&&(
        <div style={{padding:"8px 16px"}}>
          {Object.keys(moved).length===0?(
            <div style={{textAlign:"center",padding:"40px 20px",color:"#9ca3af",fontSize:14}}>미룬 할일이 없어요 🎉<br/><span style={{fontSize:12}}>할일 오른쪽 미루기 버튼을 눌러보세요</span></div>
          ):Object.entries(moved).map(([taskId,targetDay])=>{
            const task=ALL_BASE_TASKS.find(t=>t.id===taskId); if(!task) return null;
            return(
              <div key={taskId} style={{background:"white",borderRadius:14,padding:"14px 16px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#d97706",fontWeight:700,marginBottom:4}}>📦 3/{targetDay}({getDayLabel(targetDay)})로 이동됨</div>
                  <div style={{fontSize:14,color:"#374151",lineHeight:1.5}}>{task.text}</div>
                </div>
                <button onClick={()=>cancelMove(taskId)} style={{border:"none",background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>취소</button>
              </div>
            );
          })}
        </div>
      )}

      {tab==="journal"&&<Journal />}

      {/* WEEKS */}
      {month==="mar"&&tab!=="moved"&&tab!=="journal"&&(
        <div style={{padding:"8px 16px",display:"flex",flexDirection:"column",gap:12}}>
          {WEEKS_META.map(week=>{
            const wBaseTasks = week.days.flatMap(d=>BASE_TASKS_BY_DAY[d]||[]);
            const wCustom    = week.days.flatMap(d=>customTasks[d]||[]);
            const wAll       = [...wBaseTasks,...wCustom];
            const wDone      = wAll.filter(t=>checked[t.id]).length;
            const wPct       = Math.round((wDone/wAll.length)*100);
            const isOpen     = openWeeks[week.id];

            return(
              <div key={week.id} style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 2px 18px rgba(0,0,0,0.07)"}}>
                <button onClick={()=>toggleWeek(week.id)} style={{width:"100%",border:"none",background:week.lightColor,cursor:"pointer",padding:"16px 18px",borderLeft:`5px solid ${week.color}`,display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:800,color:week.color}}>{week.label}</span>
                      <span style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{week.range}</span>
                    </div>
                    <div style={{fontSize:15,fontWeight:800,color:"#1e1b4b",letterSpacing:"-0.03em",marginBottom:3}}>{week.theme}</div>
                    <div style={{fontSize:12,color:"#6b7280"}}>{week.themeDesc}</div>
                    <div style={{marginTop:10,background:"#e5e7eb",borderRadius:99,height:5}}>
                      <div style={{background:week.color,height:"100%",borderRadius:99,width:`${wPct}%`,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                  <div style={{textAlign:"center",minWidth:44}}>
                    <div style={{fontSize:19,fontWeight:900,color:week.color,letterSpacing:"-0.03em"}}>{wPct}%</div>
                    <div style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{wDone}/{wAll.length}</div>
                    <div style={{fontSize:14,marginTop:6,color:week.color,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s"}}>▼</div>
                  </div>
                </button>

                {isOpen&&(
                  <div style={{padding:"6px 12px 14px"}}>
                    {week.days.map(day=>{
                      const tdy = isToday(day);
                      const orderedTasks = getOrderedTasks(day);
                      const incoming = ALL_BASE_TASKS.filter(t=>moved[t.id]===day&&!(BASE_TASKS_BY_DAY[day]||[]).find(b=>b.id===t.id));

                      let filtered;
                      if(tab==="today")  filtered = tdy ? orderedTasks : [];
                      else if(tab==="undone") filtered = orderedTasks.filter(t=>!checked[t.id]);
                      else filtered = orderedTasks;
                      if(filtered.length===0&&tab==="today"&&!tdy) return null;

                      const dayDone = orderedTasks.filter(t=>checked[t.id]).length;
                      const allDone = orderedTasks.length>0&&dayDone===orderedTasks.length;
                      const wkd = isWeekend(day);
                      const addS = addState[day]||{};

                      return(
                        <div key={day} style={{margin:"8px 0",borderRadius:14,overflow:"hidden",border:tdy?`2px solid ${week.color}`:"1px solid #f1f5f9",background:tdy?week.lightColor:"#fafafa"}}>
                          {/* 날짜 헤더 */}
                          <div style={{padding:"10px 14px 6px",display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:42,height:42,borderRadius:13,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:tdy?week.color:wkd?"#fee2e2":"#f1f5f9",color:tdy?"white":wkd?"#ef4444":"#374151"}}>
                              <div style={{fontSize:16,fontWeight:800,lineHeight:1.1}}>{day}</div>
                              <div style={{fontSize:10,fontWeight:700}}>{getDayLabel(day)}</div>
                            </div>
                            <div style={{flex:1}}>
                              {tdy&&<span style={{fontSize:11,fontWeight:800,background:week.color,color:"white",borderRadius:99,padding:"2px 9px"}}>TODAY</span>}
                              {wkd&&!tdy&&<span style={{fontSize:11,fontWeight:600,color:"#ef4444"}}>주말 · 3~4시간</span>}
                              {!wkd&&!tdy&&<span style={{fontSize:11,fontWeight:500,color:"#9ca3af"}}>평일 · 1~2시간</span>}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{fontSize:12,fontWeight:700,color:allDone?"#10b981":"#9ca3af"}}>{allDone?"✅ 완료!":`${dayDone}/${orderedTasks.length}`}</div>
                              <button onClick={()=>setAddState(p=>({...p,[day]:{...addS,open:!addS.open,text:"",tagId:tags[0]?.id}}))} style={{width:28,height:28,borderRadius:8,border:"none",background:addS.open?week.color:"#f1f5f9",color:addS.open?"white":"#9ca3af",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",flexShrink:0}}>
                                {addS.open?"✕":"+"}
                              </button>
                            </div>
                          </div>

                          {/* 할일 추가 입력 */}
                          {addS.open&&(
                            <div className="slide-down" style={{padding:"0 14px 10px"}}>
                              {/* 태그 선택 */}
                              <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
                                {tags.map(tag=>(
                                  <button key={tag.id} onClick={()=>setAddState(p=>({...p,[day]:{...addS,tagId:tag.id}}))} style={{flexShrink:0,padding:"4px 10px",borderRadius:99,border:"1.5px solid",borderColor:addS.tagId===tag.id?week.color:"#e5e7eb",background:addS.tagId===tag.id?week.lightColor:"white",color:addS.tagId===tag.id?week.color:"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                                    {tag.icon} {tag.label}
                                  </button>
                                ))}
                              </div>
                              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                                <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",userSelect:"none"}}>
                                  <div onClick={()=>setAddState(p=>({...p,[day]:{...addS,isImportant:!addS.isImportant}}))} onMouseDown={e=>e.preventDefault()} style={{width:18,height:18,borderRadius:5,border:`2px solid ${addS.isImportant?"#f59e0b":"#d1d5db"}`,background:addS.isImportant?"#f59e0b":"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",flexShrink:0}}>
                                    {addS.isImportant&&<span style={{color:"white",fontSize:11,fontWeight:900,lineHeight:1}}>✓</span>}
                                  </div>
                                  <span style={{fontSize:12,fontWeight:600,color:addS.isImportant?"#d97706":"#9ca3af"}}>⭐ 중요 할일로 표시</span>
                                </label>
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <input value={addS.text||""} onChange={e=>setAddState(p=>({...p,[day]:{...addS,text:e.target.value}}))} onKeyDown={e=>e.key==="Enter"&&addCustomTask(day)} placeholder="할일 입력 후 Enter..." style={{flex:1,border:`1.5px solid ${week.color}`,borderRadius:10,padding:"8px 12px",fontSize:13,outline:"none",background:"white",color:"#374151"}} autoFocus/>
                                <button onClick={()=>addCustomTask(day)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:week.color,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0}}>추가</button>
                              </div>
                            </div>
                          )}

                          {/* 할일 목록 */}
                          <div style={{padding:"2px 14px 10px"}}>
                            {filtered.map((task,i)=>{
                              const isMoved    = !!moved[task.id];
                              const isIncoming = !!incoming.find(t=>t.id===task.id);
                              const isCustom   = task.id.startsWith("custom-");

                              return(
                                <div
                                  key={task.id}
                                  className={`task-row${dragActiveId===task.id?" dragging":""}`}
                                  draggable={reorderMode}
                                  onDragStart={reorderMode?(e=>onDragStart(e,day,task.id)):undefined}
                                  onDragEnter={reorderMode?(e=>onDragEnter(e,day,task.id)):undefined}
                                  onDragOver={reorderMode?onDragOver:undefined}
                                  onDrop={reorderMode?(e=>onDrop(e,day,task.id)):undefined}
                                  onDragEnd={reorderMode?onDragEnd:undefined}
                                  style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 6px",borderTop:i>0?"1px solid #f1f5f9":"none",cursor:reorderMode?"grab":"default",background:dragActiveId===task.id?"#fdf2f8":important[task.id]?"#fffbeb":"transparent",borderRadius:10,transition:"background 0.15s",WebkitUserSelect:"none",userSelect:"none",border:important[task.id]?"1.5px solid #fde68a":"1.5px solid transparent",marginBottom:important[task.id]?2:0}}
                                >
                                  {/* 드래그 핸들 - 이동 모드일 때만 표시 */}
                                  {reorderMode&&<span className="drag-handle">⠿</span>}

                                  {/* 체크박스 */}
                                  <div onClick={()=>toggle(task.id)} style={{width:22,height:22,borderRadius:7,flexShrink:0,marginTop:1,border:checked[task.id]?`2px solid ${week.color}`:"2px solid #d1d5db",background:checked[task.id]?week.color:"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                                    {checked[task.id]&&<span style={{color:"white",fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
                                  </div>

                                  {/* 텍스트 */}
                                  <div style={{flex:1}}>
                                    {isIncoming&&<div style={{fontSize:11,color:"#d97706",fontWeight:700,marginBottom:2}}>📦 미룬 할일</div>}
                                    {editMode ? (
                                      <input
                                        value={editingText[task.id] ?? task.text}
                                        onChange={e=>setEditingText(p=>({...p,[task.id]:e.target.value}))}
                                        style={{fontSize:14,fontWeight:500,color:"#1f2937",border:"none",borderBottom:"1.5px solid #db2777",background:"transparent",outline:"none",width:"100%",padding:"1px 0",fontFamily:"'Pretendard',-apple-system,sans-serif"}}
                                      />
                                    ) : (
                                      <span onClick={()=>toggle(task.id)} style={{fontSize:14,fontWeight:checked[task.id]?400:500,lineHeight:1.6,letterSpacing:"-0.01em",color:checked[task.id]?"#9ca3af":"#1f2937",textDecoration:checked[task.id]?"line-through":"none",transition:"all 0.15s",userSelect:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{editingText[task.id]??task.text}</span>
                                    )}
                                  </div>

                                  {/* 버튼들 */}
                                  <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                                    {/* ⭐ 중요 토글 */}
                                    {!reorderMode&&isCustom&&<button onClick={()=>toggleImportant(task.id)} style={{border:"none",background:"transparent",fontSize:15,cursor:"pointer",padding:"2px 3px",opacity:important[task.id]?1:0.25,transition:"all 0.15s",lineHeight:1}} title="중요 표시">⭐</button>}
                                    {isCustom&&(
                                      <button onClick={()=>deleteCustomTask(day,task.id)} style={{border:"none",background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"3px 7px",fontSize:11,fontWeight:700,cursor:"pointer"}}>삭제</button>
                                    )}
                                    {!checked[task.id]&&!isCustom&&(
                                      isMoved?(
                                        <button onClick={()=>cancelMove(task.id)} style={{border:"none",background:"#fef3c7",color:"#d97706",borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>취소</button>
                                      ):(
                                        <button onClick={()=>openMoveModal(task.id,task.text,day)} style={{border:"none",background:"#f3f4f6",color:"#6b7280",borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>미루기</button>
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4월 플래너 */}
      {month==="apr" && tab!=="moved" && tab!=="journal" && (
        <div style={{padding:"8px 16px",display:"flex",flexDirection:"column",gap:12}}>
          {APR_WEEKS_META.map(week=>{
            const wAll   = week.days.flatMap(d=>APR_TASKS_BY_DAY[d]||[]);
            const wCustom= week.days.flatMap(d=>(customTasks[`apr-${d}`]||[]));
            const wTasks = [...wAll,...wCustom];
            const wDone  = wTasks.filter(t=>checked[t.id]).length;
            const wPct   = wTasks.length>0?Math.round((wDone/wTasks.length)*100):0;
            const isOpen = openWeeks[week.id];
            return(
              <div key={week.id} style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 2px 18px rgba(0,0,0,0.07)"}}>
                <button onClick={()=>toggleWeek(week.id)} style={{width:"100%",border:"none",background:week.lightColor,cursor:"pointer",padding:"16px 18px",borderLeft:`5px solid ${week.color}`,display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:800,color:week.color}}>{week.label}</span>
                      <span style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{week.range}</span>
                    </div>
                    <div style={{fontSize:15,fontWeight:800,color:"#1e1b4b",letterSpacing:"-0.03em",marginBottom:3}}>{week.theme}</div>
                    <div style={{fontSize:12,color:"#6b7280"}}>{week.themeDesc}</div>
                    <div style={{marginTop:10,background:"#e5e7eb",borderRadius:99,height:5}}>
                      <div style={{background:week.color,height:"100%",borderRadius:99,width:`${wPct}%`,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                  <div style={{textAlign:"center",minWidth:44}}>
                    <div style={{fontSize:19,fontWeight:900,color:week.color}}>{wPct}%</div>
                    <div style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{wDone}/{wTasks.length}</div>
                    <div style={{fontSize:14,marginTop:6,color:week.color,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s"}}>▼</div>
                  </div>
                </button>
                {isOpen&&(
                  <div style={{padding:"6px 12px 14px"}}>
                    {week.days.map(day=>{
                      const dayKey = `apr-${day}`;
                      const tdy = isTodayApr(day);
                      const base = (APR_TASKS_BY_DAY[day]||[]);
                      const custom = (customTasks[dayKey]||[]);
                      const allTasksForDay = [...base,...custom];
                      let filtered;
                      if(tab==="today") filtered=tdy?allTasksForDay:[];
                      else if(tab==="undone") filtered=allTasksForDay.filter(t=>!checked[t.id]);
                      else filtered=allTasksForDay;
                      if(filtered.length===0&&tab==="today"&&!tdy) return null;
                      const dayDone=allTasksForDay.filter(t=>checked[t.id]).length;
                      const allDone=allTasksForDay.length>0&&dayDone===allTasksForDay.length;
                      const wkd=isWeekendApr(day);
                      const addS=addState[dayKey]||{};
                      return(
                        <div key={day} style={{margin:"8px 0",borderRadius:14,overflow:"hidden",border:tdy?`2px solid ${week.color}`:"1px solid #f1f5f9",background:tdy?week.lightColor:"#fafafa"}}>
                          <div style={{padding:"10px 14px 6px",display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:42,height:42,borderRadius:13,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:tdy?week.color:wkd?"#fee2e2":"#f1f5f9",color:tdy?"white":wkd?"#ef4444":"#374151"}}>
                              <div style={{fontSize:16,fontWeight:800,lineHeight:1.1}}>{day}</div>
                              <div style={{fontSize:10,fontWeight:700}}>{getDayLabelApr(day)}</div>
                            </div>
                            <div style={{flex:1}}>
                              {tdy&&<span style={{fontSize:11,fontWeight:800,background:week.color,color:"white",borderRadius:99,padding:"2px 9px"}}>TODAY</span>}
                              {wkd&&!tdy&&<span style={{fontSize:11,fontWeight:600,color:"#ef4444"}}>주말 · 3~4시간</span>}
                              {!wkd&&!tdy&&<span style={{fontSize:11,fontWeight:500,color:"#9ca3af"}}>평일 · 1~2시간</span>}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{fontSize:12,fontWeight:700,color:allDone?"#10b981":"#9ca3af"}}>{allDone?"✅ 완료!":`${dayDone}/${allTasksForDay.length}`}</div>
                              <button onClick={()=>setAddState(p=>({...p,[dayKey]:{...addS,open:!addS.open,text:"",tagId:tags[0]?.id}}))} style={{width:28,height:28,borderRadius:8,border:"none",background:addS.open?week.color:"#f1f5f9",color:addS.open?"white":"#9ca3af",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                                {addS.open?"✕":"+"}
                              </button>
                            </div>
                          </div>
                          {addS.open&&(
                            <div className="slide-down" style={{padding:"0 14px 10px"}}>
                              <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
                                {tags.map(tag=>(
                                  <button key={tag.id} onClick={()=>setAddState(p=>({...p,[dayKey]:{...addS,tagId:tag.id}}))} style={{flexShrink:0,padding:"4px 10px",borderRadius:99,border:"1.5px solid",borderColor:addS.tagId===tag.id?week.color:"#e5e7eb",background:addS.tagId===tag.id?week.lightColor:"white",color:addS.tagId===tag.id?week.color:"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                                    {tag.icon} {tag.label}
                                  </button>
                                ))}
                              </div>
                              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                                <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",userSelect:"none"}}>
                                  <div onClick={()=>setAddState(p=>({...p,[dayKey]:{...addS,isImportant:!addS.isImportant}}))} onMouseDown={e=>e.preventDefault()} style={{width:18,height:18,borderRadius:5,border:`2px solid ${addS.isImportant?"#f59e0b":"#d1d5db"}`,background:addS.isImportant?"#f59e0b":"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",flexShrink:0}}>
                                    {addS.isImportant&&<span style={{color:"white",fontSize:11,fontWeight:900,lineHeight:1}}>✓</span>}
                                  </div>
                                  <span style={{fontSize:12,fontWeight:600,color:addS.isImportant?"#d97706":"#9ca3af"}}>⭐ 중요 할일로 표시</span>
                                </label>
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <input value={addS.text||""} onChange={e=>setAddState(p=>({...p,[dayKey]:{...addS,text:e.target.value}}))} onKeyDown={e=>{if(e.key==="Enter"){const s=addState[dayKey]||{};if(!(s.text||"").trim())return;const tag=tags.find(t=>t.id===s.tagId)||tags[0]||{icon:"➕",label:""};const newId=`custom-${makeId()}`;const newTask={id:newId,text:`${tag.icon} ${s.text.trim()}`,tagId:tag.id};setCustomTasks(p=>({...p,[dayKey]:[...(p[dayKey]||[]),newTask]}));if(s.isImportant)setImportant(p=>({...p,[newId]:true}));setAddState(p=>({...p,[dayKey]:{open:false,text:"",tagId:null,isImportant:false}}));}}} placeholder="할일 입력 후 Enter..." style={{flex:1,border:`1.5px solid ${week.color}`,borderRadius:10,padding:"8px 12px",fontSize:13,outline:"none",background:"white",color:"#374151"}} autoFocus/>
                                <button onClick={()=>{const s=addState[dayKey]||{};if(!(s.text||"").trim())return;const tag=tags.find(t=>t.id===s.tagId)||tags[0]||{icon:"➕",label:""};const newId=`custom-${makeId()}`;const newTask={id:newId,text:`${tag.icon} ${s.text.trim()}`,tagId:tag.id};setCustomTasks(p=>({...p,[dayKey]:[...(p[dayKey]||[]),newTask]}));if(s.isImportant)setImportant(p=>({...p,[newId]:true}));setAddState(p=>({...p,[dayKey]:{open:false,text:"",tagId:null,isImportant:false}}));}} style={{padding:"8px 14px",borderRadius:10,border:"none",background:week.color,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0}}>추가</button>
                              </div>
                            </div>
                          )}
                          <div style={{padding:"2px 14px 10px"}}>
                            {filtered.map((task,i)=>{
                              const isCustom=task.id.startsWith("custom-");
                              return(
                                <div key={task.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 6px",borderTop:i>0?"1px solid #f1f5f9":"none",background:important[task.id]?"#fffbeb":"transparent",borderRadius:8,border:important[task.id]?"1.5px solid #fde68a":"1.5px solid transparent"}}>
                                  <div onClick={()=>toggle(task.id)} style={{width:22,height:22,borderRadius:7,flexShrink:0,marginTop:1,border:checked[task.id]?`2px solid ${week.color}`:"2px solid #d1d5db",background:checked[task.id]?week.color:"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                                    {checked[task.id]&&<span style={{color:"white",fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
                                  </div>
                                  <div style={{flex:1}}>
                                    {editMode?(
                                      <input value={editingText[task.id]??task.text} onChange={e=>setEditingText(p=>({...p,[task.id]:e.target.value}))} style={{fontSize:14,fontWeight:500,color:"#1f2937",border:"none",borderBottom:"1.5px solid #db2777",background:"transparent",outline:"none",width:"100%",padding:"1px 0",fontFamily:"'Pretendard',-apple-system,sans-serif"}}/>
                                    ):(
                                      <span onClick={()=>toggle(task.id)} style={{fontSize:14,fontWeight:checked[task.id]?400:500,lineHeight:1.6,color:checked[task.id]?"#9ca3af":"#1f2937",textDecoration:checked[task.id]?"line-through":"none",transition:"all 0.15s",userSelect:"none",cursor:"pointer"}}>{editingText[task.id]??task.text}</span>
                                    )}
                                  </div>
                                  <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                                    {!reorderMode&&isCustom&&<button onClick={()=>toggleImportant(task.id)} style={{border:"none",background:"transparent",fontSize:15,cursor:"pointer",padding:"2px 3px",opacity:important[task.id]?1:0.25,transition:"all 0.15s",lineHeight:1}}>⭐</button>}
                                    {isCustom&&<button onClick={()=>{setCustomTasks(p=>({...p,[dayKey]:(p[dayKey]||[]).filter(t=>t.id!==task.id)}));setChecked(p=>{const n={...p};delete n[task.id];return n;});}} style={{border:"none",background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"3px 7px",fontSize:11,fontWeight:700,cursor:"pointer"}}>삭제</button>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab==="all"&&month==="mar"&&(
        <div style={{margin:"8px 16px 0",background:"white",borderRadius:20,padding:"20px",boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:14,fontWeight:800,color:"#374151",letterSpacing:"-0.02em",marginBottom:14}}>💡 3월 공부 원칙</div>
          {["강의는 1.5배속 + 직접 손으로 따라치기 (복붙 금지)","모르면 구글 → 공식문서 → 강의 재수강 순서로","알고리즘은 Python으로 매일 1문제, 부담 없이 꾸준히","NestJS 복습은 '읽기'가 아니라 '설명할 수 있는지' 확인하기","AI 코드 생성 절대 금지 — 직접 만들어야 포폴이 됨"].map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:9,fontSize:13,lineHeight:1.6}}>
              <span style={{color:PINK,fontWeight:800,flexShrink:0}}>0{i+1}.</span>
              <span style={{color:"#4b5563",fontWeight:400}}>{tip}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{textAlign:"center",marginTop:28,fontSize:13,fontWeight:600,color:"#f9a8d4"}}>🌸 화이팅! 할 수 있어! 🌸</div>
    </div>

    {/* 날짜 이동 모달 */}
    {moveModal&&(
      <div className="modal-overlay" onClick={()=>setMoveModal(null)}>
        <div className="modal-box" onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:16,fontWeight:800,color:"#1e1b4b",marginBottom:6}}>📦 할일 미루기</div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:20,lineHeight:1.5,background:"#f9fafb",borderRadius:10,padding:"10px 12px"}}>{moveModal.taskText}</div>
          <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>어느 날로 미룰까요?</div>
          <div style={{maxHeight:"45vh",overflowY:"auto"}}>
            {ALL_DAYS.filter(d=>d>moveModal.fromDay).map(day=>(
              <button key={day} className="day-btn" onClick={()=>confirmMove(day)}>
                <span>3/{day} ({getDayLabel(day)})</span>
                <span style={{fontSize:12,color:"#9ca3af"}}>{isWeekend(day)?"주말":"평일"}</span>
              </button>
            ))}
          </div>
          <button onClick={()=>setMoveModal(null)} style={{width:"100%",marginTop:12,border:"none",background:"#f3f4f6",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,color:"#6b7280",cursor:"pointer"}}>취소</button>
        </div>
      </div>
    )}
  </>);
}