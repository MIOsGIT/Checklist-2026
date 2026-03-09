import Journal from "./Journal.jsx";
import { useState, useEffect, useRef } from "react";

const todayDate = new Date();
const TODAY_DAY = todayDate.getDate();
const IS_MARCH_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2;

const DEFAULT_TAGS = [
  { id: "tag-lecture",   icon: "🎬", label: "얄코 강의" },
  { id: "tag-practice",  icon: "✏️", label: "직접 실습" },
  { id: "tag-algo",      icon: "🐍", label: "Python 알고리즘" },
  { id: "tag-nestjs",    icon: "🔁", label: "NestJS 복습" },
  { id: "tag-quiz",      icon: "📝", label: "퀴즈/정리" },
  { id: "tag-custom",    icon: "➕", label: "직접 추가" },
];

const BASE_TASKS_BY_DAY = {
  6:  [
    { id:"t1",  text:"🎬 1강. 강의소개 (1분) 수강",           tagId:"tag-lecture" },
    { id:"t2",  text:"🎬 3강. 리액트를 배우는 이유 (6분)",     tagId:"tag-lecture" },
    { id:"t3",  text:"🎬 4강. DOM이란 무엇인가요? (11분)",     tagId:"tag-lecture" },
    { id:"t4",  text:"🎬 5강. 환경설정 (5분) + 직접 세팅",    tagId:"tag-lecture" },
    { id:"t5",  text:"📝 섹션1 퀴즈 풀기",                    tagId:"tag-quiz" },
    { id:"t6",  text:"🐍 Python 기초 훑기 — 입출력, 리스트, 딕셔너리", tagId:"tag-algo" },
  ],
  7:  [
    { id:"t7",  text:"🎬 7강. 프로젝트 생성하기 (8분)",        tagId:"tag-lecture" },
    { id:"t8",  text:"🎬 8강. 프로젝트 명령어 (7분)",          tagId:"tag-lecture" },
    { id:"t9",  text:"🎬 9강. 리액트 프로젝트 살펴보기 (8분)", tagId:"tag-lecture" },
    { id:"t10", text:"🐍 백준 Python 1문제 (C++ 문제 재풀이)", tagId:"tag-algo" },
  ],
  8:  [
    { id:"t11", text:"🎬 10강. 컴포넌트 기초 (8분)",           tagId:"tag-lecture" },
    { id:"t12", text:"🎬 11강. JSX 문법 기초 (7분)",           tagId:"tag-lecture" },
    { id:"t13", text:"✏️ 컴포넌트 & JSX 직접 손코딩 실습",    tagId:"tag-practice" },
    { id:"t14", text:"🎬 12강. 조건부·리스트 렌더링 (10분)",   tagId:"tag-lecture" },
    { id:"t15", text:"🎬 13강. JSX 속성과 스타일링 (11분)",    tagId:"tag-lecture" },
    { id:"t16", text:"📝 섹션2 퀴즈 풀기",                    tagId:"tag-quiz" },
    { id:"t17", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t18", text:"🔁 NestJS 스터디 레포 코드 흐름 읽기",  tagId:"tag-nestjs" },
  ],
  9:  [
    { id:"t19", text:"🔁 모르는 강의 재수강 or 보완",          tagId:"tag-nestjs" },
    { id:"t20", text:"✏️ 혼자 실습: 과일 목록 리스트 렌더링", tagId:"tag-practice" },
    { id:"t21", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t22", text:"🔁 NestJS — Module/Controller/Service 정리", tagId:"tag-nestjs" },
    { id:"t23", text:"📌 1주차 배운 내용 정리",                tagId:"tag-quiz" },
  ],
  10: [
    { id:"t24", text:"🎬 15강. 컴포넌트의 Props (10분)",       tagId:"tag-lecture" },
    { id:"t25", text:"🎬 16강. 이벤트 핸들링 (8분)",           tagId:"tag-lecture" },
    { id:"t26", text:"✏️ Props로 버튼 컴포넌트 만들기",        tagId:"tag-practice" },
    { id:"t27", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  11: [
    { id:"t28", text:"🎬 17강. State 기초 (12분)",             tagId:"tag-lecture" },
    { id:"t29", text:"🎬 18강. State 더 깊이 알기 (14분)",     tagId:"tag-lecture" },
    { id:"t30", text:"✏️ 카운터 앱 혼자 만들기 (AI 없이!)",   tagId:"tag-practice" },
    { id:"t31", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  12: [
    { id:"t32", text:"🎬 19강. useReducer (14분)",             tagId:"tag-lecture" },
    { id:"t33", text:"✏️ useState → useReducer 리팩토링",      tagId:"tag-practice" },
    { id:"t34", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t35", text:"🔁 coupang — TypeORM Entity 읽기",       tagId:"tag-nestjs" },
  ],
  13: [
    { id:"t36", text:"🎬 20강. useRef (10분)",                 tagId:"tag-lecture" },
    { id:"t37", text:"✏️ useRef로 input 포커스 제어",          tagId:"tag-practice" },
    { id:"t38", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t39", text:"🔁 coupang — 상품 CRUD API 코드 읽기",   tagId:"tag-nestjs" },
  ],
  14: [
    { id:"t40", text:"🔁 Props→State→useReducer 흐름 도식",   tagId:"tag-nestjs" },
    { id:"t41", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t42", text:"🔁 coupang — JWT 인증 흐름 정리",        tagId:"tag-nestjs" },
  ],
  15: [
    { id:"t43", text:"🎬 21강. 생명주기와 useEffect (17분)",   tagId:"tag-lecture" },
    { id:"t44", text:"✏️ 의존성 배열 직접 실험",               tagId:"tag-practice" },
    { id:"t45", text:"✏️ useEffect로 타이머 만들기",           tagId:"tag-practice" },
    { id:"t46", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t47", text:"🔁 kurly — coupang과 구조 차이 비교",    tagId:"tag-nestjs" },
  ],
  16: [
    { id:"t48", text:"🎬 22강. 커스텀 훅 (9분)",               tagId:"tag-lecture" },
    { id:"t49", text:"✏️ useFetch 커스텀 훅 만들기",           tagId:"tag-practice" },
    { id:"t50", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t51", text:"📌 2주차 훅 목록 + NestJS 복습 정리",    tagId:"tag-quiz" },
  ],
  17: [
    { id:"t52", text:"🎬 23강. 최적화 (7분)",                  tagId:"tag-lecture" },
    { id:"t53", text:"✏️ useMemo / useCallback 정리",          tagId:"tag-practice" },
    { id:"t54", text:"🐍 백준 Python 1문제 (실버 도전!)",      tagId:"tag-algo" },
    { id:"t55", text:"🔁 NestJS — Pipe, ValidationPipe 정리",  tagId:"tag-nestjs" },
  ],
  18: [
    { id:"t56", text:"📄 24강. React 19 Context 자료 읽기",    tagId:"tag-lecture" },
    { id:"t57", text:"🎬 25강. Context (8분)",                 tagId:"tag-lecture" },
    { id:"t58", text:"✏️ Context로 다크모드 토글 만들기",      tagId:"tag-practice" },
    { id:"t59", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  19: [
    { id:"t60", text:"🎬 26강. 라우팅 (10분)",                 tagId:"tag-lecture" },
    { id:"t61", text:"✏️ 페이지 이동 실습 (홈·상세·404)",      tagId:"tag-practice" },
    { id:"t62", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t63", text:"🔁 NestJS — TypeORM 관계 코드 읽기",     tagId:"tag-nestjs" },
  ],
  20: [
    { id:"t64", text:"🎬 27강. 리액트 19 추가기능 (8분)",      tagId:"tag-lecture" },
    { id:"t65", text:"📝 섹션3 퀴즈 풀기",                    tagId:"tag-quiz" },
    { id:"t66", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t67", text:"🔁 coupang/kurly — 환경변수 관리 확인",  tagId:"tag-nestjs" },
  ],
  21: [
    { id:"t68", text:"🎬 28강. 파이널 프로젝트 세팅 (6분)",    tagId:"tag-lecture" },
    { id:"t69", text:"🎬 29강. 컨텍스트·라우팅 설계 (9분)",   tagId:"tag-lecture" },
    { id:"t70", text:"✏️ 프로젝트 뼈대 직접 만들기",          tagId:"tag-practice" },
    { id:"t71", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  22: [
    { id:"t72", text:"🎬 30강. 페이지·컴포넌트 작성 (13분)",  tagId:"tag-lecture" },
    { id:"t73", text:"📝 섹션4 퀴즈 풀기",                    tagId:"tag-quiz" },
    { id:"t74", text:"🎉 완강! 혼자 설명 가능한 개념 목록",   tagId:"tag-quiz" },
    { id:"t75", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
    { id:"t76", text:"📌 3주차 NestJS 복습 + 완강 회고",       tagId:"tag-quiz" },
  ],
  23: [
    { id:"t77", text:"✏️ 프로젝트 주제 확정 & 구조 설계",     tagId:"tag-practice" },
    { id:"t78", text:"✏️ Vite로 React 프로젝트 생성",         tagId:"tag-practice" },
    { id:"t79", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  24: [
    { id:"t80", text:"✏️ Header, Footer, 레이아웃 컴포넌트",  tagId:"tag-practice" },
    { id:"t81", text:"✏️ React Router 라우팅 구조 잡기",      tagId:"tag-practice" },
    { id:"t82", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  25: [
    { id:"t83", text:"✏️ 핵심 기능 1 구현 (목록 조회/검색)",  tagId:"tag-practice" },
    { id:"t84", text:"⚠️ 막히면 구글 → 공식문서 (AI X)",      tagId:"tag-practice" },
    { id:"t85", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  26: [
    { id:"t86", text:"✏️ 핵심 기능 2 구현 (상세/추가/삭제)",  tagId:"tag-practice" },
    { id:"t87", text:"📌 GitHub 중간 커밋 push",               tagId:"tag-quiz" },
    { id:"t88", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  27: [
    { id:"t89", text:"✏️ coupang NestJS API 로컬 실행",        tagId:"tag-practice" },
    { id:"t90", text:"✏️ React에서 coupang API fetch 연결",    tagId:"tag-practice" },
    { id:"t91", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  28: [
    { id:"t92", text:"✏️ CORS 이슈 해결 (NestJS cors 설정)",  tagId:"tag-practice" },
    { id:"t93", text:"✏️ 상품 목록 API → React 화면 출력",    tagId:"tag-practice" },
    { id:"t94", text:"✏️ 로그인 폼 + JWT 연결 시도",          tagId:"tag-practice" },
    { id:"t95", text:"🔍 에러 메시지 검색해서 직접 해결",      tagId:"tag-practice" },
    { id:"t96", text:"🐍 백준 Python 1문제",                   tagId:"tag-algo" },
  ],
  29: [
    { id:"t97",  text:"✏️ 연결 기능 마무리 & 버그 수정",      tagId:"tag-practice" },
    { id:"t98",  text:"📌 README.md 업데이트 (스크린샷 포함)", tagId:"tag-quiz" },
    { id:"t99",  text:"📌 GitHub push 완료",                   tagId:"tag-quiz" },
    { id:"t100", text:"🐍 백준 Python 1문제",                  tagId:"tag-algo" },
  ],
  30: [
    { id:"t101", text:"📝 3월 회고 작성",                      tagId:"tag-quiz" },
    { id:"t102", text:"🐍 백준 Python 1문제",                  tagId:"tag-algo" },
  ],
  31: [
    { id:"t103", text:"📋 4월 계획 초안 작성",                 tagId:"tag-quiz" },
    { id:"t104", text:"📌 오늘의 코드 커밋으로 3월 마무리 🌸", tagId:"tag-quiz" },
    { id:"t105", text:"🐍 백준 Python 1문제",                  tagId:"tag-algo" },
  ],
};

const WEEKS_META = [
  { id:"week1", label:"1주차", range:"3/6(금) ~ 3/9(월)",   theme:"⚡ 섹션1·2 시작 + Python 적응",    themeDesc:"환경세팅, JSX·컴포넌트 기초 / Python 알고리즘 입문", color:"#ec4899", lightColor:"#fdf2f8", days:[6,7,8,9] },
  { id:"week2", label:"2주차", range:"3/10(화) ~ 3/16(월)", theme:"🧩 Props·State·훅 + NestJS 복습",  themeDesc:"Props, State, useReducer, useRef, useEffect / CRUD 복습", color:"#0ea5e9", lightColor:"#f0f9ff", days:[10,11,12,13,14,15,16] },
  { id:"week3", label:"3주차", range:"3/17(화) ~ 3/22(일)", theme:"🔗 최적화·Context·Router",         themeDesc:"최적화, Context, 라우팅 / TypeORM 관계·예외처리 복습",  color:"#10b981", lightColor:"#f0fdf4", days:[17,18,19,20,21,22] },
  { id:"week4", label:"4주차", range:"3/23(월) ~ 3/31(화)", theme:"🚀 혼자 만들기 + coupang 연결",   themeDesc:"강의 없이 혼자 프로젝트 → React + NestJS 풀스택",        color:"#f59e0b", lightColor:"#fffbeb", days:[23,24,25,26,27,28,29,30,31] },
];

const ALL_BASE_TASKS = Object.values(BASE_TASKS_BY_DAY).flat();
const ALL_DAYS = Object.keys(BASE_TASKS_BY_DAY).map(Number);
const DAY_LABELS = ["일","월","화","수","목","금","토"];
const COLORS = ["#f59e0b","#ec4899","#10b981","#ef4444","#0ea5e9","#a855f7","#ec4899","#f97316"];

function getDayLabel(d) { return DAY_LABELS[new Date(2026,2,d).getDay()]; }
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

  const [openWeeks, setOpenWeeks]   = useState({week1:true,week2:false,week3:false,week4:false});
  const [tab, setTab]               = useState("all");
  const [moveModal, setMoveModal]   = useState(null);
  const [addState, setAddState]     = useState({}); // {[day]: {open,text,tagId}}
  const [confetti, setConfetti]     = useState([]);
  const [celebMsg, setCelebMsg]     = useState(null);
  const prevTodayDone = useRef(null);
  const prevAllDone   = useRef(null);
  // drag
  const dragItem      = useRef(null); // {day, id}
  const dragOverItem  = useRef(null);

  useEffect(()=>{ try{localStorage.setItem("mio-tags",            JSON.stringify(tags));}          catch{} },[tags]);
  useEffect(()=>{ try{localStorage.setItem("mio-task-order",      JSON.stringify(taskOrder));}     catch{} },[taskOrder]);
  useEffect(()=>{ try{localStorage.setItem("mio-custom-tasks",    JSON.stringify(customTasks));}   catch{} },[customTasks]);
  useEffect(()=>{ try{localStorage.setItem("mio-checklist-moved", JSON.stringify(moved));}         catch{} },[moved]);
  useEffect(()=>{ try{localStorage.setItem("mio-checklist-v3",    JSON.stringify(checked));}       catch{} },[checked]);

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
    if(!order) return pool;
    const orderMap = {};
    order.forEach((id,i)=>orderMap[id]=i);
    // 순서에 없는 건 맨 뒤
    return [...pool].sort((a,b)=>{
      const ai = orderMap[a.id]??9999;
      const bi = orderMap[b.id]??9999;
      // incoming은 항상 앞
      const aIn = !!incoming.find(t=>t.id===a.id);
      const bIn = !!incoming.find(t=>t.id===b.id);
      if(aIn && !bIn) return -1;
      if(!aIn && bIn) return 1;
      return ai-bi;
    });
  }

  // ── 드래그 ──
  const onDragStart = (day, taskId) => { dragItem.current = {day, id:taskId}; };
  const onDragEnter = (day, taskId) => { dragOverItem.current = {day, id:taskId}; };
  const onDragEnd   = () => {
    if(!dragItem.current || !dragOverItem.current) return;
    if(dragItem.current.day !== dragOverItem.current.day) { dragItem.current=null; dragOverItem.current=null; return; }
    const day = dragItem.current.day;
    const ordered = getOrderedTasks(day);
    const ids = ordered.map(t=>t.id);
    const fromIdx = ids.indexOf(dragItem.current.id);
    const toIdx   = ids.indexOf(dragOverItem.current.id);
    if(fromIdx===-1||toIdx===-1||fromIdx===toIdx){ dragItem.current=null; dragOverItem.current=null; return; }
    const newIds = [...ids];
    newIds.splice(fromIdx,1);
    newIds.splice(toIdx,0,dragItem.current.id);
    setTaskOrder(p=>({...p,[day]:newIds}));
    dragItem.current=null; dragOverItem.current=null;
  };

  // ── 커스텀 할일 추가 ──
  const addCustomTask = (day) => {
    const s = addState[day]||{};
    if(!(s.text||"").trim()) return;
    const tag = tags.find(t=>t.id===(s.tagId||"tag-custom"))||tags[tags.length-1];
    const newTask = { id:`custom-${makeId()}`, text:`${tag.icon} ${s.text.trim()}`, tagId: tag.id };
    setCustomTasks(p=>({...p,[day]:[...(p[day]||[]),newTask]}));
    setAddState(p=>({...p,[day]:{open:false,text:"",tagId:null}}));
  };
  const deleteCustomTask = (day, taskId) => {
    setCustomTasks(p=>({...p,[day]:(p[day]||[]).filter(t=>t.id!==taskId)}));
    setChecked(p=>{ const n={...p}; delete n[taskId]; return n; });
    setTaskOrder(p=>({...p,[day]:(p[day]||[]).filter(id=>id!==taskId)}));
  };

  const toggle       = (id) => setChecked(p=>({...p,[id]:!p[id]}));
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
      .task-row{transition:opacity 0.15s;}
      .task-row.dragging{opacity:0.4;}
      .drag-handle{cursor:grab;color:#d1d5db;font-size:16px;padding:0 4px;touch-action:none;user-select:none;}
      .drag-handle:active{cursor:grabbing;}
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
        <div style={{fontSize:11,fontWeight:500,opacity:0.75,letterSpacing:"0.05em",marginBottom:4}}>📅 2026년 3월 공부 플래너</div>
        <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",marginBottom:18,color:"white"}}>Study CheckList 🌸</div>
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

      {/* TABS */}
      <div style={{display:"flex",gap:8,padding:"12px 16px 8px",overflowX:"auto"}}>
        {[["all","📋 전체"],["today","🌅 오늘"],["undone","⏳ 미완료"],["moved","📦 미룬 할일"],["journal","📓 학습일지"]].map(([v,label])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 20px",borderRadius:99,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:tab===v?PINK:"white",color:tab===v?"white":"#6b7280",boxShadow:tab===v?`0 2px 14px rgba(219,39,119,0.35)`:"0 1px 4px rgba(0,0,0,0.08)"}}>{label}</button>
        ))}
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
      {tab!=="moved"&&tab!=="journal"&&(
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
                              const taskTag    = tags.find(t=>t.id===task.tagId);

                              return(
                                <div
                                  key={task.id}
                                  className={`task-row${dragItem.current?.id===task.id?" dragging":""}`}
                                  draggable
                                  onDragStart={()=>onDragStart(day,task.id)}
                                  onDragEnter={()=>onDragEnter(day,task.id)}
                                  onDragEnd={onDragEnd}
                                  onDragOver={e=>e.preventDefault()}
                                  style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderTop:i>0?"1px solid #f1f5f9":"none",cursor:"default"}}
                                >
                                  {/* 드래그 핸들 */}
                                  <span className="drag-handle" title="드래그해서 순서 변경">⠿</span>

                                  {/* 체크박스 */}
                                  <div onClick={()=>toggle(task.id)} style={{width:22,height:22,borderRadius:7,flexShrink:0,marginTop:1,border:checked[task.id]?`2px solid ${week.color}`:"2px solid #d1d5db",background:checked[task.id]?week.color:"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                                    {checked[task.id]&&<span style={{color:"white",fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
                                  </div>

                                  {/* 텍스트 */}
                                  <div style={{flex:1}}>
                                    {isIncoming&&<div style={{fontSize:11,color:"#d97706",fontWeight:700,marginBottom:2}}>📦 미룬 할일</div>}
                                    {taskTag&&<span style={{fontSize:10,background:"#f3f4f6",color:"#6b7280",borderRadius:99,padding:"1px 6px",fontWeight:600,marginRight:5}}>{taskTag.icon} {taskTag.label}</span>}
                                    <span onClick={()=>toggle(task.id)} style={{fontSize:14,fontWeight:checked[task.id]?400:500,lineHeight:1.6,letterSpacing:"-0.01em",color:checked[task.id]?"#9ca3af":"#1f2937",textDecoration:checked[task.id]?"line-through":"none",transition:"all 0.15s",userSelect:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{task.text}</span>
                                  </div>

                                  {/* 버튼들 */}
                                  <div style={{display:"flex",gap:4,flexShrink:0}}>
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

      {tab==="all"&&(
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