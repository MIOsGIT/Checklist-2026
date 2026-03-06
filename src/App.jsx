import { useState, useEffect } from "react";

const todayDate  = new Date();
const TODAY_DAY  = todayDate.getDate();
const IS_MARCH_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2;

const WEEKS = [
  {
    id: "week1", label: "1주차", range: "3/6(금) ~ 3/9(월)",
    theme: "⚡ 섹션1·2 시작 + 알고리즘 Python 적응",
    themeDesc: "환경세팅, JSX·컴포넌트 기초 / Python 알고리즘 입문",
    color: "#6366f1", lightColor: "#eef2ff",
    days: [
      { day: 6, tasks: [
        { id: "t1",  text: "🎬 1강. 강의소개 (1분) 수강" },
        { id: "t2",  text: "🎬 3강. 리액트를 배우는 이유 (6분) 수강" },
        { id: "t3",  text: "🎬 4강. DOM이란 무엇인가요? (11분) 수강" },
        { id: "t4",  text: "🎬 5강. 실습을 위한 환경설정 (5분) + 직접 세팅" },
        { id: "t5",  text: "📝 섹션1 퀴즈 풀기" },
        { id: "t6",  text: "🐍 Python 기초 훑기 — C++과 다른 문법 정리 (입출력, 리스트, 딕셔너리)" },
      ]},
      { day: 7, tasks: [
        { id: "t7",  text: "🎬 7강. 프로젝트 생성하기 (8분) + 직접 생성" },
        { id: "t8",  text: "🎬 8강. 프로젝트 명령어 사용하기 (7분) 수강" },
        { id: "t9",  text: "🎬 9강. 리액트 프로젝트 살펴보기 (8분) 수강" },
        { id: "t10", text: "🐍 백준 Python 1문제 (C++로 풀었던 문제 Python으로 재풀이)" },
      ]},
      { day: 8, tasks: [
        { id: "t11", text: "🎬 10강. 컴포넌트 기초 (8분) 수강" },
        { id: "t12", text: "🎬 11강. JSX 문법 기초 (7분) 수강" },
        { id: "t13", text: "✏️ 컴포넌트 & JSX 직접 손코딩 실습" },
        { id: "t14", text: "🎬 12강. 조건부 렌더링과 리스트 렌더링 (10분) 수강" },
        { id: "t15", text: "🎬 13강. JSX 속성과 스타일링 (11분) 수강" },
        { id: "t16", text: "📝 섹션2 퀴즈 풀기" },
        { id: "t17", text: "🐍 백준 Python 1문제" },
        { id: "t18", text: "🔁 NestJS 스터디 레포 열어보기 — 코드 흐름 다시 읽기 (30분)" },
      ]},
      { day: 9, tasks: [
        { id: "t19", text: "🔁 이번 주 모르는 강의 재수강 or 보완" },
        { id: "t20", text: "✏️ 혼자 실습: 과일 목록 리스트 렌더링으로 출력하기" },
        { id: "t21", text: "🐍 백준 Python 1문제" },
        { id: "t22", text: "🔁 NestJS — Module / Controller / Service 구조 다시 정리" },
        { id: "t23", text: "📌 1주차 배운 내용 정리" },
      ]},
    ]
  },
  {
    id: "week2", label: "2주차", range: "3/10(화) ~ 3/16(월)",
    theme: "🧩 Props·State·훅 기초 + NestJS 복습",
    themeDesc: "Props, 이벤트, State, useReducer, useRef, useEffect / NestJS CRUD 복습",
    color: "#0ea5e9", lightColor: "#f0f9ff",
    days: [
      { day: 10, tasks: [
        { id: "t24", text: "🎬 15강. 컴포넌트의 Props (10분) 수강" },
        { id: "t25", text: "🎬 16강. 이벤트 핸들링 (8분) 수강" },
        { id: "t26", text: "✏️ Props로 버튼 컴포넌트 만들어보기" },
        { id: "t27", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 11, tasks: [
        { id: "t28", text: "🎬 17강. State 기초 (12분) 수강" },
        { id: "t29", text: "🎬 18강. State 더 깊이 알기 (14분) 수강" },
        { id: "t30", text: "✏️ 카운터 앱 혼자 만들어보기 (AI 없이!)" },
        { id: "t31", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 12, tasks: [
        { id: "t32", text: "🎬 19강. useReducer (14분) 수강" },
        { id: "t33", text: "✏️ useState → useReducer 리팩토링 실습" },
        { id: "t34", text: "🐍 백준 Python 1문제" },
        { id: "t35", text: "🔁 coupang 레포 열기 — TypeORM Entity 구조 다시 읽기" },
      ]},
      { day: 13, tasks: [
        { id: "t36", text: "🎬 20강. useRef (10분) 수강" },
        { id: "t37", text: "✏️ useRef로 input 포커스 제어 실습" },
        { id: "t38", text: "🐍 백준 Python 1문제" },
        { id: "t39", text: "🔁 coupang — 상품 CRUD API 코드 흐름 다시 따라가기" },
      ]},
      { day: 14, tasks: [
        { id: "t40", text: "🔁 주간 복습: Props→State→useReducer 흐름 도식 그리기" },
        { id: "t41", text: "🐍 백준 Python 1문제" },
        { id: "t42", text: "🔁 coupang — JWT 인증 흐름 (Guard, Strategy, Passport) 다시 정리" },
      ]},
      { day: 15, tasks: [
        { id: "t43", text: "🎬 21강. 생명주기와 useEffect (17분) 수강" },
        { id: "t44", text: "✏️ 의존성 배열 직접 실험 ([], [값], 없음 비교)" },
        { id: "t45", text: "✏️ useEffect로 타이머 만들어보기" },
        { id: "t46", text: "🐍 백준 Python 1문제" },
        { id: "t47", text: "🔁 kurly 레포 열기 — coupang과 구조 차이 비교해보기" },
      ]},
      { day: 16, tasks: [
        { id: "t48", text: "🎬 22강. 커스텀 훅 (9분) 수강" },
        { id: "t49", text: "✏️ useFetch 커스텀 훅 직접 만들어보기" },
        { id: "t50", text: "🐍 백준 Python 1문제" },
        { id: "t51", text: "📌 2주차 훅 목록 + NestJS 복습 내용 정리" },
      ]},
    ]
  },
  {
    id: "week3", label: "3주차", range: "3/17(화) ~ 3/22(일)",
    theme: "🔗 최적화·Context·Router + NestJS 심화 복습",
    themeDesc: "최적화, Context, 라우팅 / TypeORM 관계·예외처리 복습",
    color: "#10b981", lightColor: "#f0fdf4",
    days: [
      { day: 17, tasks: [
        { id: "t52", text: "🎬 23강. 최적화 (7분) 수강" },
        { id: "t53", text: "✏️ useMemo / useCallback 언제 쓰는지 정리" },
        { id: "t54", text: "🐍 백준 Python 1문제 (실버 도전 시작)" },
        { id: "t55", text: "🔁 NestJS — Pipe, ValidationPipe 개념 다시 정리" },
      ]},
      { day: 18, tasks: [
        { id: "t56", text: "📄 24강. React 19 Context 수정사항 자료 읽기" },
        { id: "t57", text: "🎬 25강. Context (8분) 수강" },
        { id: "t58", text: "✏️ Context로 다크모드 토글 직접 만들어보기" },
        { id: "t59", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 19, tasks: [
        { id: "t60", text: "🎬 26강. 라우팅 (10분) 수강" },
        { id: "t61", text: "✏️ 페이지 이동 실습 (홈·상세·404 페이지)" },
        { id: "t62", text: "🐍 백준 Python 1문제" },
        { id: "t63", text: "🔁 NestJS — TypeORM 관계 (OneToMany, ManyToOne) 코드 다시 읽기" },
      ]},
      { day: 20, tasks: [
        { id: "t64", text: "🎬 27강. 리액트 19 추가기능 (8분) 수강" },
        { id: "t65", text: "📝 섹션3 퀴즈 풀기" },
        { id: "t66", text: "🐍 백준 Python 1문제" },
        { id: "t67", text: "🔁 coupang/kurly — 환경변수(.env) 관리 방식 다시 확인" },
      ]},
      { day: 21, tasks: [
        { id: "t68", text: "🎬 28강. 파이널 프로젝트 세팅 및 뼈대 (6분) 수강" },
        { id: "t69", text: "🎬 29강. 데이터 매니징·컨텍스트·라우팅 설계 (9분) 수강" },
        { id: "t70", text: "✏️ 강의 따라 프로젝트 뼈대 직접 만들기" },
        { id: "t71", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 22, tasks: [
        { id: "t72", text: "🎬 30강. 페이지들과 컴포넌트들 작성 (13분) 수강" },
        { id: "t73", text: "📝 섹션4 퀴즈 풀기" },
        { id: "t74", text: "🎉 완강! 혼자 설명할 수 있는 개념 목록 작성" },
        { id: "t75", text: "🐍 백준 Python 1문제" },
        { id: "t76", text: "📌 3주차 NestJS 복습 + React 완강 회고 정리" },
      ]},
    ]
  },
  {
    id: "week4", label: "4주차", range: "3/23(월) ~ 3/31(화)",
    theme: "🚀 혼자 만들기 + coupang API 연결",
    themeDesc: "강의 없이 혼자 프로젝트 → React + NestJS 풀스택 연결",
    color: "#f59e0b", lightColor: "#fffbeb",
    days: [
      { day: 23, tasks: [
        { id: "t77", text: "✏️ 프로젝트 주제 확정 & 컴포넌트 구조 설계 (종이에 그려보기)" },
        { id: "t78", text: "✏️ Vite로 React 프로젝트 새로 생성" },
        { id: "t79", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 24, tasks: [
        { id: "t80", text: "✏️ Header, Footer, 메인 레이아웃 컴포넌트 작성" },
        { id: "t81", text: "✏️ React Router로 라우팅 구조 잡기" },
        { id: "t82", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 25, tasks: [
        { id: "t83", text: "✏️ 핵심 기능 1개 구현 (목록 조회 or 검색)" },
        { id: "t84", text: "⚠️ 막히면 구글 → 공식문서 순서로 (AI 의존 X)" },
        { id: "t85", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 26, tasks: [
        { id: "t86", text: "✏️ 핵심 기능 2개 구현 (상세보기 or 추가/삭제)" },
        { id: "t87", text: "📌 GitHub에 중간 커밋 push (커밋 메시지 신경쓰기!)" },
        { id: "t88", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 27, tasks: [
        { id: "t89", text: "✏️ coupang NestJS API 서버 로컬에서 띄워보기" },
        { id: "t90", text: "✏️ React에서 coupang API fetch 연결 시도" },
        { id: "t91", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 28, tasks: [
        { id: "t92", text: "✏️ CORS 이슈 해결 (NestJS cors 설정 추가)" },
        { id: "t93", text: "✏️ 상품 목록 API → React 화면에 출력" },
        { id: "t94", text: "✏️ 로그인 폼 UI 만들고 JWT 연결 시도" },
        { id: "t95", text: "🔍 에러 메시지 검색해서 직접 해결" },
        { id: "t96", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 29, tasks: [
        { id: "t97",  text: "✏️ 연결된 기능 마무리 & 버그 수정" },
        { id: "t98",  text: "📌 README.md 업데이트 (스크린샷, 기술스택 포함)" },
        { id: "t99",  text: "📌 GitHub push 완료" },
        { id: "t100", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 30, tasks: [
        { id: "t101", text: "📝 3월 회고 작성 (배운 것 / 아직 모르는 것 / 4월 목표)" },
        { id: "t102", text: "🐍 백준 Python 1문제" },
      ]},
      { day: 31, tasks: [
        { id: "t103", text: "📋 4월 계획 초안 작성 (NestJS 심화 or Tailwind CSS)" },
        { id: "t104", text: "📌 오늘의 코드 커밋으로 3월 마무리 🌸" },
        { id: "t105", text: "🐍 백준 Python 1문제" },
      ]},
    ]
  }
];

// 모든 날짜 목록 (이동 대상용)
const ALL_DAYS = WEEKS.flatMap(w => w.days.map(d => d.day));
const ALL_TASKS_FLAT = WEEKS.flatMap(w => w.days.flatMap(d => d.tasks));
const DAY_LABELS = ["일","월","화","수","목","금","토"];

function getDayLabel(day) {
  return DAY_LABELS[new Date(2026, 2, day).getDay()];
}
function isWeekend(day) {
  const d = new Date(2026, 2, day).getDay();
  return d === 0 || d === 6;
}
function isToday(day) {
  return IS_MARCH_2026 && day === TODAY_DAY;
}
function getTodayLabel() {
  if (!IS_MARCH_2026) return null;
  return `3/${TODAY_DAY}(${getDayLabel(TODAY_DAY)})`;
}

export default function App() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-checklist-v3") || "{}"); }
    catch { return {}; }
  });
  // 이동된 할일: { taskId: targetDay }
  const [moved, setMoved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-checklist-moved") || "{}"); }
    catch { return {}; }
  });
  const [openWeeks, setOpenWeeks] = useState({ week1: true, week2: false, week3: false, week4: false });
  const [tab, setTab] = useState("all");
  // 이동 모달 상태
  const [moveModal, setMoveModal] = useState(null); // { taskId, taskText, fromDay }

  useEffect(() => {
    try { localStorage.setItem("mio-checklist-v3", JSON.stringify(checked)); }
    catch {}
  }, [checked]);

  useEffect(() => {
    try { localStorage.setItem("mio-checklist-moved", JSON.stringify(moved)); }
    catch {}
  }, [moved]);

  useEffect(() => {
    if (!IS_MARCH_2026) return;
    const weekId = WEEKS.find(w => w.days.some(d => d.day === TODAY_DAY))?.id;
    if (weekId) setOpenWeeks(p => ({ ...p, [weekId]: true }));
  }, []);

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const toggleWeek = (id) => setOpenWeeks(p => ({ ...p, [id]: !p[id] }));

  const openMoveModal = (taskId, taskText, fromDay) => {
    setMoveModal({ taskId, taskText, fromDay });
  };

  const confirmMove = (targetDay) => {
    if (!moveModal) return;
    setMoved(p => ({ ...p, [moveModal.taskId]: targetDay }));
    setMoveModal(null);
  };

  const cancelMove = (taskId) => {
    setMoved(p => {
      const next = { ...p };
      delete next[taskId];
      return next;
    });
  };

  // 특정 날짜에 표시할 태스크 계산 (원래 + 이동된 것)
  function getTasksForDay(originalDay, originalTasks) {
    // 원래 이 날의 태스크 중 다른 날로 이동 안 된 것
    const staying = originalTasks.filter(t => !(moved[t.id] && moved[t.id] !== originalDay));
    // 다른 날에서 이 날로 이동된 것
    const incoming = ALL_TASKS_FLAT.filter(t => moved[t.id] === originalDay && !originalTasks.find(ot => ot.id === t.id));
    return { staying, incoming };
  }

  const totalDone = ALL_TASKS_FLAT.filter(t => checked[t.id]).length;
  const progress = Math.round((totalDone / ALL_TASKS_FLAT.length) * 100);
  const todayTasks = IS_MARCH_2026
    ? ALL_TASKS_FLAT.filter(t => {
        const movedDay = moved[t.id];
        if (movedDay) return movedDay === TODAY_DAY;
        return WEEKS.flatMap(w => w.days.filter(d => d.day === TODAY_DAY).flatMap(d => d.tasks)).find(tt => tt.id === t.id);
      })
    : [];
  const todayDone = todayTasks.filter(t => checked[t.id]).length;

  const LEGEND = [
    { icon: "🎬", label: "얄코 강의" },
    { icon: "✏️", label: "직접 실습" },
    { icon: "🐍", label: "Python 알고리즘" },
    { icon: "🔁", label: "NestJS 복습" },
    { icon: "📝", label: "퀴즈/정리" },
  ];

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Pretendard', -apple-system, sans-serif; background: linear-gradient(160deg, #fdf4ff 0%, #f0f4ff 100%); }
        button { font-family: 'Pretendard', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 99px; }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          z-index: 200; display: flex; align-items: flex-end; justify-content: center;
        }
        .modal-box {
          background: white; border-radius: 24px 24px 0 0;
          width: 100%; max-width: 480px; padding: 24px 20px 40px;
          max-height: 80vh; overflow-y: auto;
        }
        .day-btn {
          width: 100%; border: 1.5px solid #e5e7eb; background: #fafafa;
          border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;
          cursor: pointer; display: flex; justify-content: space-between; align-items: center;
          font-family: 'Pretendard', -apple-system, sans-serif;
          font-size: 14px; font-weight: 500; color: #374151;
          transition: all 0.15s;
        }
        .day-btn:hover { border-color: #7c3aed; background: #faf5ff; color: #7c3aed; }
        .moved-badge {
          font-size: 11px; background: #fef3c7; color: #d97706;
          border-radius: 99px; padding: 2px 8px; font-weight: 700;
        }
      `}</style>

      <div style={{ fontFamily: "'Pretendard', -apple-system, sans-serif", minHeight: "100vh", paddingBottom: 48 }}>

        {/* HEADER */}
        <div style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
          padding: "28px 20px 22px", color: "white",
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 4px 24px rgba(124,58,237,0.3)"
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.75, letterSpacing: "0.05em", marginBottom: 4 }}>
            📅 2026년 3월 공부 플래너
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 18 }}>
            React 스터디 체크리스트 🌸
          </div>
          <div style={{ background: "rgba(255,255,255,0.22)", borderRadius: 99, height: 8, marginBottom: 7 }}>
            <div style={{ background: "white", height: "100%", borderRadius: 99, width: `${progress}%`, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, opacity: 0.85 }}>
            <span>전체 진행률</span>
            <span style={{ fontWeight: 700 }}>{totalDone} / {ALL_TASKS_FLAT.length}개 ({progress}%)</span>
          </div>
          {IS_MARCH_2026 && (
            <div style={{ marginTop: 14, background: "rgba(255,255,255,0.14)", borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>✅ 오늘 ({getTodayLabel()}) 할 일</span>
              <span style={{ fontSize: 15, fontWeight: 800 }}>{todayDone} / {todayTasks.length} 완료</span>
            </div>
          )}
        </div>

        {/* LEGEND */}
        <div style={{ padding: "14px 16px 4px", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {LEGEND.map(l => (
            <div key={l.icon} style={{ background: "white", borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 500, color: "#4b5563", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: 5, alignItems: "center" }}>
              <span>{l.icon}</span><span>{l.label}</span>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px 8px", overflowX: "auto" }}>
          {[["all","📋 전체"],["today","🌅 오늘"],["undone","⏳ 미완료"],["moved","📦 미룬 할일"]].map(([v, label]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              padding: "8px 20px", borderRadius: 99, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.2s",
              background: tab === v ? "#7c3aed" : "white",
              color: tab === v ? "white" : "#6b7280",
              boxShadow: tab === v ? "0 2px 14px rgba(124,58,237,0.35)" : "0 1px 4px rgba(0,0,0,0.08)",
            }}>{label}</button>
          ))}
        </div>

        {/* 미룬 할일 탭 */}
        {tab === "moved" && (
          <div style={{ padding: "8px 16px" }}>
            {Object.keys(moved).length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: 14 }}>
                미룬 할일이 없어요 🎉<br/>
                <span style={{ fontSize: 12 }}>할일을 길게 눌러서 날짜를 이동할 수 있어요</span>
              </div>
            ) : (
              Object.entries(moved).map(([taskId, targetDay]) => {
                const task = ALL_TASKS_FLAT.find(t => t.id === taskId);
                if (!task) return null;
                return (
                  <div key={taskId} style={{ background: "white", borderRadius: 14, padding: "14px 16px", marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#d97706", fontWeight: 700, marginBottom: 4 }}>
                        📦 3/{targetDay}({getDayLabel(targetDay)})로 이동됨
                      </div>
                      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{task.text}</div>
                    </div>
                    <button onClick={() => cancelMove(taskId)} style={{
                      border: "none", background: "#fee2e2", color: "#ef4444",
                      borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0
                    }}>취소</button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* WEEKS */}
        {tab !== "moved" && (
          <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {WEEKS.map(week => {
              const wTasks = week.days.flatMap(d => d.tasks);
              const wDone  = wTasks.filter(t => checked[t.id]).length;
              const wPct   = Math.round((wDone / wTasks.length) * 100);
              const isOpen = openWeeks[week.id];

              return (
                <div key={week.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 18px rgba(0,0,0,0.07)" }}>
                  <button onClick={() => toggleWeek(week.id)} style={{
                    width: "100%", border: "none", background: week.lightColor,
                    cursor: "pointer", padding: "16px 18px",
                    borderLeft: `5px solid ${week.color}`,
                    display: "flex", alignItems: "center", gap: 14, textAlign: "left"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: week.color }}>{week.label}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{week.range}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.03em", marginBottom: 3 }}>{week.theme}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{week.themeDesc}</div>
                      <div style={{ marginTop: 10, background: "#e5e7eb", borderRadius: 99, height: 5 }}>
                        <div style={{ background: week.color, height: "100%", borderRadius: 99, width: `${wPct}%`, transition: "width 0.4s" }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 44 }}>
                      <div style={{ fontSize: 19, fontWeight: 900, color: week.color, letterSpacing: "-0.03em" }}>{wPct}%</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{wDone}/{wTasks.length}</div>
                      <div style={{ fontSize: 14, marginTop: 6, color: week.color, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>▼</div>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "6px 12px 14px" }}>
                      {week.days.map(dayObj => {
                        const tdy = isToday(dayObj.day);
                        const { staying, incoming } = getTasksForDay(dayObj.day, dayObj.tasks);
                        const allTasksForDay = [...staying, ...incoming];

                        let filtered;
                        if (tab === "today") filtered = tdy ? allTasksForDay : [];
                        else if (tab === "undone") filtered = allTasksForDay.filter(t => !checked[t.id]);
                        else filtered = allTasksForDay;

                        if (filtered.length === 0) return null;

                        const dayDone = allTasksForDay.filter(t => checked[t.id]).length;
                        const allDone = dayDone === allTasksForDay.length;
                        const wkd = isWeekend(dayObj.day);

                        return (
                          <div key={dayObj.day} style={{
                            margin: "8px 0", borderRadius: 14, overflow: "hidden",
                            border: tdy ? `2px solid ${week.color}` : "1px solid #f1f5f9",
                            background: tdy ? week.lightColor : "#fafafa",
                          }}>
                            <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                background: tdy ? week.color : wkd ? "#fee2e2" : "#f1f5f9",
                                color: tdy ? "white" : wkd ? "#ef4444" : "#374151"
                              }}>
                                <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1 }}>{dayObj.day}</div>
                                <div style={{ fontSize: 10, fontWeight: 700 }}>{getDayLabel(dayObj.day)}</div>
                              </div>
                              <div style={{ flex: 1 }}>
                                {tdy  && <span style={{ fontSize: 11, fontWeight: 800, background: week.color, color: "white", borderRadius: 99, padding: "2px 9px" }}>TODAY</span>}
                                {wkd && !tdy && <span style={{ fontSize: 11, fontWeight: 600, color: "#ef4444" }}>주말 · 3~4시간</span>}
                                {!wkd && !tdy && <span style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af" }}>평일 · 1~2시간</span>}
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: allDone ? "#10b981" : "#9ca3af" }}>
                                {allDone ? "✅ 완료!" : `${dayDone}/${allTasksForDay.length}`}
                              </div>
                            </div>
                            <div style={{ padding: "2px 14px 10px" }}>
                              {filtered.map((task, i) => {
                                const isMoved = !!moved[task.id];
                                const isIncoming = incoming.find(t => t.id === task.id);
                                return (
                                  <div key={task.id} style={{
                                    display: "flex", alignItems: "flex-start", gap: 10,
                                    padding: "10px 0",
                                    borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
                                  }}>
                                    {/* 체크박스 */}
                                    <div onClick={() => toggle(task.id)} style={{
                                      width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                                      border: checked[task.id] ? `2px solid ${week.color}` : "2px solid #d1d5db",
                                      background: checked[task.id] ? week.color : "white",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      transition: "all 0.15s", cursor: "pointer",
                                      WebkitTapHighlightColor: "transparent"
                                    }}>
                                      {checked[task.id] && <span style={{ color: "white", fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                                    </div>
                                    {/* 텍스트 */}
                                    <div style={{ flex: 1 }}>
                                      {isIncoming && (
                                        <div style={{ fontSize: 11, color: "#d97706", fontWeight: 700, marginBottom: 2 }}>📦 다른 날에서 이동됨</div>
                                      )}
                                      <span onClick={() => toggle(task.id)} style={{
                                        fontSize: 14, fontWeight: checked[task.id] ? 400 : 500,
                                        lineHeight: 1.6, letterSpacing: "-0.01em",
                                        color: checked[task.id] ? "#9ca3af" : "#1f2937",
                                        textDecoration: checked[task.id] ? "line-through" : "none",
                                        transition: "all 0.15s", userSelect: "none", cursor: "pointer",
                                        WebkitTapHighlightColor: "transparent"
                                      }}>{task.text}</span>
                                    </div>
                                    {/* 이동 버튼 */}
                                    {!checked[task.id] && (
                                      isMoved ? (
                                        <button onClick={() => cancelMove(task.id)} style={{
                                          border: "none", background: "#fef3c7", color: "#d97706",
                                          borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700,
                                          cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap"
                                        }}>취소</button>
                                      ) : (
                                        <button onClick={() => openMoveModal(task.id, task.text, dayObj.day)} style={{
                                          border: "none", background: "#f3f4f6", color: "#6b7280",
                                          borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700,
                                          cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap"
                                        }}>미루기</button>
                                      )
                                    )}
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

        {/* TIPS */}
        {tab === "all" && (
          <div style={{ margin: "8px 16px 0", background: "white", borderRadius: 20, padding: "20px", boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#374151", letterSpacing: "-0.02em", marginBottom: 14 }}>💡 3월 공부 원칙</div>
            {[
              "강의는 1.5배속 + 직접 손으로 따라치기 (복붙 금지)",
              "모르면 구글 → 공식문서 → 강의 재수강 순서로",
              "알고리즘은 Python으로 매일 1문제, 부담 없이 꾸준히",
              "NestJS 복습은 '읽기'가 아니라 '설명할 수 있는지' 확인하기",
              "AI 코드 생성 절대 금지 — 직접 만들어야 포폴이 됨",
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, fontSize: 13, lineHeight: 1.6 }}>
                <span style={{ color: "#7c3aed", fontWeight: 800, flexShrink: 0 }}>0{i + 1}.</span>
                <span style={{ color: "#4b5563", fontWeight: 400 }}>{tip}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 28, fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>
          🌸 화이팅! 할 수 있어! 🌸
        </div>
      </div>

      {/* 날짜 이동 모달 */}
      {moveModal && (
        <div className="modal-overlay" onClick={() => setMoveModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1e1b4b", marginBottom: 6 }}>📦 할일 미루기</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.5, background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
              {moveModal.taskText}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>어느 날로 미룰까요?</div>
            <div style={{ maxHeight: "45vh", overflowY: "auto" }}>
              {ALL_DAYS.filter(d => d > moveModal.fromDay).map(day => (
                <button key={day} className="day-btn" onClick={() => confirmMove(day)}>
                  <span>3/{day} ({getDayLabel(day)})</span>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{isWeekend(day) ? "주말" : "평일"}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setMoveModal(null)} style={{
              width: "100%", marginTop: 12, border: "none", background: "#f3f4f6",
              borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700,
              color: "#6b7280", cursor: "pointer"
            }}>취소</button>
          </div>
        </div>
      )}
    </>
  );
}