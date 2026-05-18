import Journal from "./Journal.jsx";
import { useState, useEffect, useRef } from "react";

const todayDate = new Date();
const TODAY_DAY = todayDate.getDate();
const IS_MARCH_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2;
const IS_APRIL_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 3;
const TODAY_APR_DAY = IS_APRIL_2026 ? todayDate.getDate() : null;

// ── 태그 간소화 (요청하신 3가지만 남김) ──
const DEFAULT_TAGS = [
  { id: "tag-react",   icon: "🌐", label: "React" },
  { id: "tag-toeic",   icon: "📗", label: "TOEIC" },
  { id: "tag-java",    icon: "☕", label: "자바프로그래밍" },
];

const BASE_TASKS_BY_DAY = {
  // ── 3/23(월) ──
  23: [
    { id:"t1",  text:"👩🏻‍💻 근로(오전): 전공 필기 가볍게 정리",             tagId:"tag-react" },
    { id:"t2",  text:"👩🏻‍💻 근로(오후): 전공 필기 계속 or 백준 1문제",        tagId:"tag-react" },
    { id:"t3",  text:"🎬 10~13강 (컴포넌트/JSX/조건부·리스트 렌더링)", tagId:"tag-react" },
  ],
  // ── 3/24(화) ──
  24: [
    { id:"t5",  text:"🎬 14~17강 (스타일링/Props/이벤트/State기초)",   tagId:"tag-react" },
    { id:"t6",  text:"🎧 오디오신호처리 수업 복습",                    tagId:"tag-java" },
  ],
  // ── 3/25(수) ──
  25: [
    { id:"t9",  text:"🎬 18~20강 (State심화/useReducer/useRef)",       tagId:"tag-react" },
    { id:"t10", text:"⚙️ 컴퓨터알고리즘 수업 복습",                    tagId:"tag-java" },
  ],
  // ── 3/26(목) ──
  26: [
    { id:"t13", text:"👩🏻‍💻 근로(오전): 전날 React 개념 복습",                tagId:"tag-react" },
    { id:"t14", text:"👩🏻‍💻 근로(오후): 오늘 수업 필기 정리 (그래픽스·디지털영상·알고리즘)", tagId:"tag-java" },
  ],
  // ── 3/27(금) ──
  27: [
    { id:"t16", text:"👩🏻‍💻 근로(오전): 전공 복습 or 백준 1문제",             tagId:"tag-java" },
    { id:"t19", text:"🐍 백준 Python 1문제",                                 tagId:"tag-java" },
  ],
  // ── 3/28(토) ──
  28: [
    { id:"t20", text:"🎬 21~25강 (useEffect/커스텀훅/최적화/Context)", tagId:"tag-react" },
  ],
  // ── 3/29(일) ──
  29: [
    { id:"t25", text:"🎬 짬날 때: 26~27강 (라우팅/React19) 가볍게",         tagId:"tag-react" },
  ],
  // ── 3/30(월) ──
  30: [
    { id:"t26", text:"👩🏻‍💻 근로(오전): 28~30강 완강 🎉 (이어폰 끼고!)",     tagId:"tag-react" },
    { id:"t27", text:"👩🏻‍💻 근로(오후): 완강 나머지 + 개념 메모",             tagId:"tag-react" },
  ],
  // ── 3/31(화) ──
  31: [
    { id:"t30", text:"📋 4월 계획 확인",                                     tagId:"tag-react" },
    { id:"t31", text:"📌 GitHub 커밋으로 3월 마무리 ✨",                     tagId:"tag-react" },
  ],
};

const APR_TASKS_BY_DAY = {
  // ── 4/2(목) ──
  2:  [
    { id:"a5",  text:"👩🏻‍💻 근로(오전): 전공 복습",                            tagId:"tag-java" },
    { id:"a6",  text:"👩🏻‍💻 근로(오후): 전공 복습 계속",                       tagId:"tag-java" },
  ],
  // ── 4/3(금) ──
  3:  [
    { id:"a8",  text:"👩🏻‍💻 근로(오전): 전공 복습",                            tagId:"tag-java" },
  ],
  // ── 4/6(월) ──
  6:  [
    { id:"a17", text:"👩🏻‍💻 근로(오전): ⚙️ 알고리즘 과제 체크",              tagId:"tag-java" },
    { id:"a18", text:"👩🏻‍💻 근로(오후): 전공 복습 계속",                       tagId:"tag-java" },
  ],
  // ── 4/9(목) ──
  9:  [
    { id:"a29", text:"👩🏻‍💻 근로(오전): ⚙️ 알고리즘 필기 정리",              tagId:"tag-java" },
    { id:"a30", text:"👩🏻‍💻 근로(오후): 📷 디지털영상·🎨 그래픽스 필기 정리", tagId:"tag-java" },
  ],
  // ── 4/10(금) ──
  10: [
    { id:"a32", text:"👩🏻‍💻 근로(오전): 🎧 오디오 과제 체크",                 tagId:"tag-java" },
  ],
  // ── 4/13(월) ──
  13: [
    { id:"a41", text:"👩🏻‍💻 근로(오전): ⚙️ 컴퓨터알고리즘 시험범위 1회독",  tagId:"tag-java" },
    { id:"a42", text:"👩🏻‍💻 근로(오후): ⚙️ 알고리즘 약점 정리",              tagId:"tag-java" },
  ],
  // ── 4/16(목) ──
  16: [
    { id:"a51", text:"👩🏻‍💻 근로(오전): 🎧 오디오신호처리 시험범위 1회독",   tagId:"tag-java" },
    { id:"a52", text:"👩🏻‍💻 근로(오후): 🎧 오디오 약점 정리",                tagId:"tag-java" },
  ],
  // ── 4/17(금) ──
  17: [
    { id:"a53", text:"👩🏻‍💻 근로(오전): ☕ 자바프로그래밍 시험범위 복습",    tagId:"tag-java" },
  ],
  // ── 4/20(월) ──
  20: [
    { id:"a60", text:"👩🏻‍💻 근로(오전): 시험 직전 최종 정리",                tagId:"tag-java" },
    { id:"a61", text:"👩🏻‍💻 근로(오후): 시험 직전 최종 정리 계속",            tagId:"tag-java" },
  ],
  // ── 4/27(월) ──
  27: [
    { id:"a70", text:"👩🏻‍💻 근로(오전): 🎬 React Query 개념 공부",            tagId:"tag-react" },
    { id:"a71", text:"👩🏻‍💻 근로(오후): 🎬 React Query 계속",                tagId:"tag-react" },
  ],
  // ── 4/30(목) ──
  30: [
    { id:"a82", text:"👩🏻‍💻 근로(오전): 4월 전체 회고 작성",                  tagId:"tag-react" },
    { id:"a83", text:"👩🏻‍💻 근로(오후): 5월 계획 초안",                      tagId:"tag-react" },
  ],
};

const MAY_TASKS_BY_DAY = {
  18: [ // 월
    { id:"m1_new", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 암기",               tagId:"tag-toeic" },
    { id:"m2_new", text:"👩🏻‍💻 근로(오후): 🌐 React 공식문서",               tagId:"tag-react" },
    { id:"m1",     text:"📗 토익 파트별 유형 파악 (LC/RC 구조 이해)",       tagId:"tag-toeic" },
    { id:"m3",     text:"☕ 자바 팀프로젝트 현황 파악 + 역할 정리",         tagId:"tag-java" },
  ],
  19: [ // 화 (근로 삭제됨)
    { id:"m6",  text:"🌐 토익 공부 후: React 공식문서 — 컴포넌트",       tagId:"tag-react" },
  ],
  20: [ // 수
    { id:"m8",  text:"📗 LC Part 1~2 문제풀이 + 오답 정리",             tagId:"tag-toeic" },
    { id:"m11", text:"☕ 15시 자바 팀미팅",                             tagId:"tag-java" },
    { id:"m12", text:"🌐 React 공식문서 — Props & State",                tagId:"tag-react" },
  ],
  21: [ // 목
    { id:"m4_new", text:"👩🏻‍💻 근로(오전): 📗 토익 LC Part 1~2 유형 정리",  tagId:"tag-toeic" },
    { id:"m5_new", text:"👩🏻‍💻 근로(오후): 📗 토익 단어 30개 암기",         tagId:"tag-toeic" },
    { id:"m14",    text:"📗 RC Part 5 빈출 문법 정리 (품사/시제/태)",       tagId:"tag-toeic" },
    { id:"m17",    text:"🌐 React 공식문서 — useState 훅",                 tagId:"tag-react" },
  ],
  22: [ // 금 (오전 근로만)
    { id:"m19", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 30개 암기",          tagId:"tag-toeic" },
    { id:"m21", text:"☕ 자바 팀프로젝트 작업",                          tagId:"tag-java" },
  ],
  23: [ // 토
    { id:"m25", text:"☕ 자바프로그래밍 복습 + 프로젝트",          tagId:"tag-java" },
  ],
  24: [ // 일
    { id:"m27", text:"📗 토익 LC Part 3~4 유형 파악",                  tagId:"tag-toeic" },
    { id:"m28", text:"🌐 React 공식문서 — useEffect 훅",                tagId:"tag-react" },
  ],
  25: [ // 월
    { id:"m23_new", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 30개 암기",          tagId:"tag-toeic" },
    { id:"m24_new", text:"👩🏻‍💻 근로(오후): React 이벤트 처리",              tagId:"tag-react" },
    { id:"m31",     text:"📗 토익 RC Part 6~7 독해 유형 정리",               tagId:"tag-toeic" },
  ],
  26: [ // 화 (근로 삭제됨)
    { id:"m37", text:"🌐 React 공식문서 — 조건부 렌더링",                tagId:"tag-react" },
  ],
  27: [ // 수
    { id:"m39", text:"📗 LC Part 3~4 오답 분석",                       tagId:"tag-toeic" },
    { id:"m42", text:"☕ 15시 자바 팀미팅 + 프로젝트 마무리 점검",       tagId:"tag-java" },
    { id:"m43", text:"🌐 React 공식문서 — 리스트와 Key",                tagId:"tag-react" },
  ],
  28: [ // 목
    { id:"m35_new", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 30개 암기",          tagId:"tag-toeic" },
    { id:"m36_new", text:"👩🏻‍💻 근로(오후): 📗 LC Part 3~4 문제풀이",         tagId:"tag-toeic" },
    { id:"m45",     text:"📗 RC Part 6~7 문제풀이",                         tagId:"tag-toeic" },
    { id:"m48",     text:"🌐 React 공식문서 — 폼 다루기",                    tagId:"tag-react" },
  ],
  29: [ // 금 (오전 근로만)
    { id:"m50", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 30개 암기",          tagId:"tag-toeic" },
    { id:"m52", text:"☕ 자바 팀프로젝트 최종 작업",                      tagId:"tag-java" },
  ],
  30: [ // 토
    { id:"m56", text:"☕ 자바 팀프로젝트 마감 🎉",                        tagId:"tag-java" },
  ],
  31: [ // 일
    { id:"m58", text:"📗 토익 모의고사 오답 분석 + 취약 파트 정리",      tagId:"tag-toeic" },
    { id:"m59", text:"🌐 React 공식문서 — Context API",                tagId:"tag-react" },
  ],
};

const JUN_TASKS_BY_DAY = {
  1: [ // 월
    { id:"j4_new",  text:"👩🏻‍💻 근로(오전): 📗 토익 단어 30개 암기",          tagId:"tag-toeic" },
    { id:"j5_new",  text:"👩🏻‍💻 근로(오후): 📗 LC 파트별 미니테스트",         tagId:"tag-toeic" },
    { id:"j1",      text:"📗 토익 D-12 — RC 파트별 미니테스트",              tagId:"tag-toeic" },
    { id:"j2",      text:"🌐 React 공식문서 — Router 개념",                  tagId:"tag-react" },
  ],
  2: [ // 화 (근로 삭제됨)
    { id:"j8_new",  text:"📗 토익 RC 시간배분 연습",                         tagId:"tag-toeic" },
  ],
  3: [ // 수
    { id:"j11", text:"☕ 15시 자바 팀미팅 (마감 후 마무리 정리)",             tagId:"tag-java" },
  ],
  4: [ // 목
    { id:"j17_new", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 30개 암기",          tagId:"tag-toeic" },
    { id:"j18_new", text:"👩🏻‍💻 근로(오후): 📗 RC Part 7 속독 연습",          tagId:"tag-toeic" },
    { id:"j13",     text:"📗 토익 LC 받아쓰기 훈련 + 오답 정리",             tagId:"tag-toeic" },
  ],
  5: [ // 금 (오전 근로만)
    { id:"j20_new", text:"👩🏻‍💻 근로(오전): 실전모의고사 2회 풀기",           tagId:"tag-toeic" },
  ],
  6: [ // 토
    { id:"j23_new", text:"📗 모의고사 2회 오답 분석",                        tagId:"tag-toeic" },
  ],
  7: [ // 일
    { id:"j26_new", text:"📗 토익 D-5 — 실전감각 유지",                      tagId:"tag-toeic" },
  ],
  8: [ // 월
    { id:"j29_new", text:"👩🏻‍💻 근로(오전): 📗 토익 최종 단어 정리",          tagId:"tag-toeic" },
    { id:"j30_new", text:"👩🏻‍💻 근로(오후): 📗 토익 LC 최종 점검",            tagId:"tag-toeic" },
  ],
  9: [ // 화 (근로 삭제됨)
    { id:"j33_new", text:"📗 토익 RC 최종 점검",                             tagId:"tag-toeic" },
  ],
  11: [ // 목
    { id:"j42_new", text:"👩🏻‍💻 근로(오전): 📗 토익 D-1 가볍게 훑기",         tagId:"tag-toeic" },
    { id:"j43_new", text:"👩🏻‍💻 근로(오후): 기말 마무리",                      tagId:"tag-react" },
  ],
  12: [ // 금 (오전 근로만)
    { id:"j38_new", text:"👩🏻‍💻 근로(오전): 토익 전략 최종 점검",             tagId:"tag-toeic" },
  ],
  13: [ // 토
    { id:"j45", text:"🏆 토익 시험 D-day! 컨디션 최우선 🙏",             tagId:"tag-toeic" },
  ],
  14: [ // 일
    { id:"j46", text:"🎉 토익 끝! 푹 쉬기",                              tagId:"tag-react" },
  ],
  21: [
    { id:"j54", text:"🌐 React — 블로그/공식문서로 본격 스터디 시작",    tagId:"tag-react" },
  ],
  22: [
    { id:"j56", text:"🌐 React — 컴포넌트 직접 만들어보기",              tagId:"tag-react" },
  ],
  23: [
    { id:"j58", text:"🌐 React — hooks 실습 (useState/useEffect)",       tagId:"tag-react" },
  ],
  24: [
    { id:"j61", text:"🌐 React — React Router 실습",                     tagId:"tag-react" },
  ],
  25: [
    { id:"j63", text:"🌐 React — 미니 프로젝트 기획",                    tagId:"tag-react" },
  ],
  26: [
    { id:"j65", text:"🌐 React — 미니 프로젝트 시작",                    tagId:"tag-react" },
  ],
  27: [
    { id:"j67", text:"🌐 React — 미니 프로젝트 계속",                    tagId:"tag-react" },
  ],
  28: [
    { id:"j69", text:"🌐 React — 미니 프로젝트 마무리",                  tagId:"tag-react" },
  ],
  29: [
    { id:"j71", text:"🌐 React — 코드 리뷰 + 개선",                      tagId:"tag-react" },
  ],
  30: [
    { id:"j73", text:"📝 6월 전체 회고 + 7월 계획 초안",                 tagId:"tag-react" },
  ],
};

const ALL_BASE_TASKS_MAR = Object.values(BASE_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS_APR = Object.values(APR_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS_MAY = Object.values(MAY_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS_JUN = Object.values(JUN_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS = [...ALL_BASE_TASKS_MAR, ...ALL_BASE_TASKS_APR, ...ALL_BASE_TASKS_MAY, ...ALL_BASE_TASKS_JUN];

const WEEKS_META = [
  { id:"week1", label:"1주차", range:"3/23(월) ~ 3/29(일)", theme:"🎬 인강 완주 + 전공 당일복습",  themeDesc:"강의 10~27강 / 수업 당일 필기 / 근로 중 복습 / 알바 고려", color:"#ec4899", lightColor:"#fdf2f8", days:[23,24,25,26,27,28,29] },
  { id:"week2", label:"마무리", range:"3/30(월) ~ 3/31(화)", theme:"🎉 완강 + 4월 준비",            themeDesc:"28~30강 완강 / 완강 회고 / 4월 계획 확인",                 color:"#f59e0b", lightColor:"#fffbeb", days:[30,31] },
];
const APR_WEEKS_META = [
  { id:"apr-week1", label:"1주차", range:"4/1(수) ~ 4/5(일)",   month:"apr", theme:"✏️ React 프로젝트 시작",           themeDesc:"Vite 생성·레이아웃·핵심기능 1 / 전공 당일복습 유지",     color:"#8b5cf6", lightColor:"#f5f3ff", days:[2,3] },
  { id:"apr-week2", label:"2주차", range:"4/6(월) ~ 4/12(일)",  month:"apr", theme:"🔗 coupang 연결 + Tailwind",       themeDesc:"API 연동·CORS 해결·화면 출력 / 전공 과제 체크",          color:"#0ea5e9", lightColor:"#f0f9ff", days:[6,9,10] },
  { id:"apr-week3", label:"3주차", range:"4/13(월) ~ 4/19(일)", month:"apr", theme:"🚨 시험 2주 전! 전공 집중",        themeDesc:"전과목 1회독 + 시험범위 정리 / React 가볍게 유지",       color:"#ef4444", lightColor:"#fef2f2", days:[13,16,17] },
  { id:"apr-week4", label:"4주차", range:"4/20(월) ~ 4/26(일)", month:"apr", theme:"🏫 중간고사",                      themeDesc:"4/21~24 시험 — 코딩 완전 휴식 / 시험 후 회복",           color:"#f59e0b", lightColor:"#fffbeb", days:[20] },
  { id:"apr-week5", label:"5주차", range:"4/27(월) ~ 4/30(목)", month:"apr", theme:"🚀 React Query + 자바 팀프로젝트", themeDesc:"React Query 실습 / 팀프로젝트 킥오프 / 4월 회고",         color:"#10b981", lightColor:"#f0fdf4", days:[27,30] },
];
const MAY_WEEKS_META = [
  { id:"may-week1", label:"시작", range:"5/18(일)",              month:"may", theme:"🚀 5월 공부 시작!",              themeDesc:"토익 유형파악 / React 공식문서 시작 / 자바 현황 파악",        color:"#ec4899", lightColor:"#fdf2f8", days:[18] },
  { id:"may-week2", label:"4주차", range:"5/19(월) ~ 5/25(일)",  month:"may", theme:"📗 토익 LC+RC 기초 + React",     themeDesc:"LC Part 1~4 / RC Part 5~7 유형 / React 훅 공식문서",            color:"#8b5cf6", lightColor:"#f5f3ff", days:[19,20,21,22,23,24,25] },
  { id:"may-week3", label:"5주차", range:"5/26(월) ~ 5/31(토)",  month:"may", theme:"📗 토익 실전 + ☕ 자바 마감",    themeDesc:"모의고사 1회 + 오답분석 / 자바 팀프로젝트 최종 마감",            color:"#f59e0b", lightColor:"#fffbeb", days:[26,27,28,29,30,31] },
];
const JUN_WEEKS_META = [
  { id:"jun-week1", label:"1주차", range:"6/1(일) ~ 6/8(일)",   month:"jun", theme:"📗 토익 D-12 + 기말 준비",      themeDesc:"토익 실전모의고사 2회 / 전공 기말 1회독 시작",              color:"#0ea5e9", lightColor:"#f0f9ff", days:[1,2,3,4,5,6,7,8] },
  { id:"jun-week2", label:"2주차", range:"6/9(월) ~ 6/15(일)",  month:"jun", theme:"📗 토익 D-4 + 🏫 기말 집중",   themeDesc:"토익 최종 점검 / 6/13 토익 시험 🏆 / 기말 마무리",         color:"#ef4444", lightColor:"#fef2f2", days:[9,11,12,13,14] },
  { id:"jun-week4", label:"4주차", range:"6/20(금) ~ 6/30(월)", month:"jun", theme:"🎉 방학! React 본격 스터디",   themeDesc:"기말 끝 / React 미니 프로젝트 / 학기 회고",                 color:"#10b981", lightColor:"#f0fdf4", days:[21,22,23,24,25,26,27,28,29,30] },
];

const DAY_LABELS = ["일","월","화","수","목","금","토"];
const COLORS = ["#f59e0b","#ec4899","#10b981","#ef4444","#0ea5e9","#a855f7","#ec4899","#f97316"];

function getDayLabel(d) { return DAY_LABELS[new Date(2026,2,d).getDay()]; }
function getDayLabelApr(d) { return DAY_LABELS[new Date(2026,3,d).getDay()]; }
function getDayLabelMay(d) { return DAY_LABELS[new Date(2026,4,d).getDay()]; }
function getDayLabelJun(d) { return DAY_LABELS[new Date(2026,5,d).getDay()]; }
function isWeekend(d)   { const w=new Date(2026,2,d).getDay(); return w===0||w===6; }
function isWeekendApr(d) { const w=new Date(2026,3,d).getDay(); return w===0||w===6; }
function isWeekendMay(d) { const w=new Date(2026,4,d).getDay(); return w===0||w===6; }
function isWeekendJun(d) { const w=new Date(2026,5,d).getDay(); return w===0||w===6; }
function isToday(d)     { return IS_MARCH_2026 && d===TODAY_DAY; }
function isTodayApr(d) { return IS_APRIL_2026 && d===TODAY_APR_DAY; }
const IS_MAY_2026  = todayDate.getFullYear()===2026 && todayDate.getMonth()===4;
const IS_JUN_2026  = todayDate.getFullYear()===2026 && todayDate.getMonth()===5;
const TODAY_MAY_DAY = IS_MAY_2026 ? todayDate.getDate() : null;
const TODAY_JUN_DAY = IS_JUN_2026 ? todayDate.getDate() : null;
function isTodayMay(d) { return IS_MAY_2026 && d===TODAY_MAY_DAY; }
function isTodayJun(d) { return IS_JUN_2026 && d===TODAY_JUN_DAY; }
function getTodayLabel(){ return IS_MARCH_2026 ? `3/${TODAY_DAY}(${getDayLabel(TODAY_DAY)})` : null; }
function makeId()       { return `id-${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }
function makeConfetti(n=60){ return Array.from({length:n},(_,i)=>({ id:i, x:Math.random()*100, color:COLORS[Math.floor(Math.random()*COLORS.length)], size:Math.random()*8+5, delay:Math.random()*0.5, duration:Math.random()*1.5+1.5, shape:Math.random()>.5?"circle":"rect" })); }

export default function App() {
  const [tags, setTags] = useState(() => {
    try { 
      const saved = JSON.parse(localStorage.getItem("mio-tags")); 
      if (saved && saved.some(t => t.label === "얄코 강의")) {
          return DEFAULT_TAGS; // 이전 태그가 남아있다면 초기화
      }
      return saved || DEFAULT_TAGS;
    }
    catch { return DEFAULT_TAGS; }
  });
  
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagIcon, setNewTagIcon]   = useState("🏷️");
  const [newTagLabel, setNewTagLabel] = useState("");
  const [selectedTag, setSelectedTag] = useState(null); // 태그 필터링 상태 추가

  const [taskOrder, setTaskOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-task-order") || "{}"); } catch { return {}; }
  });
  const [customTasks, setCustomTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-custom-tasks") || "{}"); } catch { return {}; }
  });
  const [moved, setMoved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-checklist-moved") || "{}"); } catch { return {}; }
  });
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-checklist-v3") || "{}"); } catch { return {}; }
  });
  const [important, setImportant] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-important") || "{}"); } catch { return {}; }
  });

  const [month, setMonth] = useState("may");
  const [openWeeks, setOpenWeeks] = useState({week1:true,week2:false,"apr-week1":false,"apr-week2":false,"apr-week3":false,"apr-week4":false,"apr-week5":false,"may-week1":true,"may-week2":true,"may-week3":true,"jun-week1":true,"jun-week2":true,"jun-week4":true});
  const [tab, setTab]               = useState("all");
  const [moveModal, setMoveModal]   = useState(null);
  const [addState, setAddState]     = useState({});
  const [reorderMode, setReorderMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hiddenTasks, setHiddenTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-hidden-tasks") || "{}"); } catch { return {}; }
  });
  const [editingText, setEditingText] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mio-editing-text") || "{}"); } catch { return {}; }
  });
  const [dragActiveId, setDragActiveId] = useState(null);
  const [confetti, setConfetti]     = useState([]);
  const [celebMsg, setCelebMsg]     = useState(null);
  const prevTodayDone = useRef(null);
  const prevAllDone   = useRef(null);
  const dragItem      = useRef(null);
  const dragOverItem  = useRef(null);

  useEffect(()=>{ try{localStorage.setItem("mio-tags", JSON.stringify(tags));} catch{} },[tags]);
  useEffect(()=>{ try{localStorage.setItem("mio-task-order", JSON.stringify(taskOrder));} catch{} },[taskOrder]);
  useEffect(()=>{ try{localStorage.setItem("mio-custom-tasks", JSON.stringify(customTasks));} catch{} },[customTasks]);
  useEffect(()=>{ try{localStorage.setItem("mio-checklist-moved", JSON.stringify(moved));} catch{} },[moved]);
  useEffect(()=>{ try{localStorage.setItem("mio-checklist-v3", JSON.stringify(checked));} catch{} },[checked]);
  useEffect(()=>{ try{localStorage.setItem("mio-important", JSON.stringify(important));} catch{} },[important]);
  useEffect(()=>{ try{localStorage.setItem("mio-editing-text", JSON.stringify(editingText));} catch{} },[editingText]);
  useEffect(()=>{ try{localStorage.setItem("mio-hidden-tasks", JSON.stringify(hiddenTasks));} catch{} },[hiddenTasks]);

  const addTag = () => {
    if(!newTagLabel.trim()) return;
    const id = `tag-${makeId()}`;
    setTags(p=>[...p, {id, icon:newTagIcon, label:newTagLabel.trim()}]);
    setNewTagIcon("🏷️"); setNewTagLabel(""); setShowTagInput(false);
  };
  const deleteTag = (id) => {
    setTags(p=>p.filter(t=>t.id!==id));
    if (selectedTag === id) setSelectedTag(null);
  };

  // ── 할일 목록 정렬 및 필터 (월별 처리 지원) ──
  function getOrderedTasks(day, currentMonth) {
    let baseMap, allBaseTasks;
    if(currentMonth === "mar") { baseMap = BASE_TASKS_BY_DAY; allBaseTasks = ALL_BASE_TASKS_MAR; }
    else if(currentMonth === "apr") { baseMap = APR_TASKS_BY_DAY; allBaseTasks = ALL_BASE_TASKS_APR; }
    else if(currentMonth === "may") { baseMap = MAY_TASKS_BY_DAY; allBaseTasks = ALL_BASE_TASKS_MAY; }
    else { baseMap = JUN_TASKS_BY_DAY; allBaseTasks = ALL_BASE_TASKS_JUN; }

    const dayKey = currentMonth === "mar" ? day : `${currentMonth}-${day}`;
    const base = baseMap[day] || [];
    const custom = customTasks[dayKey] || [];
    
    const incoming = allBaseTasks.filter(t => moved[t.id] === day && !base.find(b=>b.id===t.id));
    const staying = base.filter(t => !(moved[t.id] && moved[t.id] !== day));

    let pool = [...incoming, ...staying, ...custom].filter(t=>!hiddenTasks[t.id]);
    
    // 태그 필터 적용
    if (selectedTag) {
      pool = pool.filter(t => t.tagId === selectedTag);
    }

    const order = taskOrder[dayKey];
    const orderMap = {};
    if(order) order.forEach((id,i)=>orderMap[id]=i);

    return pool.sort((a,b)=>{
      const aImp = !!important[a.id];
      const bImp = !!important[b.id];
      if(aImp && !bImp) return -1;
      if(!aImp && bImp) return 1;
      const aIn = !!incoming.find(t=>t.id===a.id);
      const bIn = !!incoming.find(t=>t.id===b.id);
      if(aIn && !bIn) return -1;
      if(!aIn && bIn) return 1;
      const ai = orderMap[a.id]??9999;
      const bi = orderMap[b.id]??9999;
      return ai-bi;
    });
  }

  // ── 드래그 앤 드롭 ──
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
  const onDrop = (e, day, taskId, currentMonth) => {
    e.preventDefault();
    if(!dragItem.current) return;
    if(dragItem.current.day !== day) return;
    const fromId = dragItem.current.id;
    const toId   = taskId;
    if(fromId === toId) return;
    
    const ordered = getOrderedTasks(day, currentMonth);
    const ids = ordered.map(t=>t.id);
    const fromIdx = ids.indexOf(fromId);
    const toIdx   = ids.indexOf(toId);
    if(fromIdx === -1 || toIdx === -1) return;
    
    const newIds = [...ids];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, fromId);
    
    const dayKey = currentMonth === "mar" ? day : `${currentMonth}-${day}`;
    setTaskOrder(p=>({...p, [dayKey]: newIds}));
  };
  const onDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDragActiveId(null);
  };

  const addCustomTask = (dayKey) => {
    const s = addState[dayKey]||{};
    if(!(s.text||"").trim()) return;
    const tag = tags.find(t=>t.id===s.tagId)||tags[0]||{icon:"➕",label:""};
    const newId = `custom-${makeId()}`;
    const newTask = { id:newId, text:`${tag.icon} ${s.text.trim()}`, tagId: tag.id };
    setCustomTasks(p=>({...p,[dayKey]:[...(p[dayKey]||[]),newTask]}));
    if(s.isImportant) setImportant(p=>({...p,[newId]:true}));
    setAddState(p=>({...p,[dayKey]:{open:false,text:"",tagId:null,isImportant:false}}));
  };
  
  const deleteCustomTask = (dayKey, taskId) => {
    setCustomTasks(p=>({...p,[dayKey]:(p[dayKey]||[]).filter(t=>t.id!==taskId)}));
    setChecked(p=>{ const n={...p}; delete n[taskId]; return n; });
    setTaskOrder(p=>({...p,[dayKey]:(p[dayKey]||[]).filter(id=>id!==taskId)}));
  };

  const toggle = (id) => setChecked(p=>({...p,[id]:!p[id]}));
  const deleteBasicTask = (taskId) => {
    setChecked(p=>{ const n={...p}; delete n[taskId]; return n; });
    setImportant(p=>{ const n={...p}; delete n[taskId]; return n; });
    setTaskOrder(p=>{ const n={...p}; Object.keys(n).forEach(d=>{ n[d]=(n[d]||[]).filter(id=>id!==taskId); }); return n; });
    setHiddenTasks(p=>({...p,[taskId]:true}));
  };
  
  const toggleWeek = (id) => setOpenWeeks(p=>({...p,[id]:!p[id]}));
  const openMoveModal= (taskId,taskText,fromDay) => setMoveModal({taskId,taskText,fromDay});
  const confirmMove  = (targetDay) => { if(!moveModal) return; setMoved(p=>({...p,[moveModal.taskId]:targetDay})); setMoveModal(null); };
  const cancelMove   = (taskId) => setMoved(p=>{ const n={...p}; delete n[taskId]; return n; });

  const allCustomFlat = Object.values(customTasks).flat();
  const visibleBaseTasks = ALL_BASE_TASKS.filter(t=>!hiddenTasks[t.id]);
  const allTasksCount = visibleBaseTasks.length + allCustomFlat.length;
  const totalDone = [...visibleBaseTasks, ...allCustomFlat].filter(t=>checked[t.id]).length;
  const progress  = Math.round((totalDone/(allTasksCount||1))*100);

  const PINK = "#db2777";

  return (<>
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Pretendard',-apple-system,sans-serif;background:linear-gradient(160deg,#fff0f6 0%,#fdf2f8 100%);}
      button,input,textarea{font-family:'Pretendard',-apple-system,sans-serif;}
      ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#f9a8d4;border-radius:99px;}
      .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
      .modal-box{background:white;border-radius:24px 24px 0 0;width:100%;max-width:480px;padding:24px 20px 40px;max-height:80vh;overflow-y:auto;}
      .day-btn{width:100%;border:1.5px solid #e5e7eb;background:#fafafa;border-radius:12px;padding:12px 16px;margin-bottom:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:500;color:#374151;transition:all 0.15s;}
      .day-btn:hover{border-color:${PINK};background:#fdf2f8;color:${PINK};}
      .celeb-msg{position:fixed;top:45%;left:50%;transform:translate(-50%,-50%);z-index:1000;pointer-events:none;text-align:center;background:white;border-radius:24px;padding:28px 36px;box-shadow:0 8px 40px rgba(219,39,119,0.25);white-space:pre-line;}
      .slide-down{animation:slide-down 0.2s ease;}
      @keyframes slide-down{0%{opacity:0;transform:translateY(-6px);}100%{opacity:1;transform:translateY(0);}}
      .task-row{transition:background 0.15s;}
      .task-row.dragging{opacity:0.35;}
      .drag-handle{
        cursor:grab;color:#d1d5db;font-size:18px;padding:2px 4px;
        touch-action:none;user-select:none;-webkit-user-drag:element;
        line-height:1;
      }
      .drag-handle:active{cursor:grabbing;color:#f9a8d4;}
    `}</style>

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
      </div>

      {/* 월 선택 탭 */}
      <div style={{display:"flex",gap:8,padding:"14px 16px 0",borderBottom:"1px solid #f1f5f9"}}>
        {[["mar","🌸 3월"],["apr","🌿 4월"],["may","☀️ 5월"],["jun","🌊 6월"]].map(([m,label])=>(
          <button key={m} onClick={()=>setMonth(m)} style={{padding:"8px 20px",borderRadius:"12px 12px 0 0",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.2s",background:month===m?"white":"transparent",color:month===m?"#db2777":"#9ca3af",boxShadow:month===m?"0 -2px 8px rgba(0,0,0,0.06)":""}}>{label}</button>
        ))}
      </div>

      {/* TAGS 범례 (필터 기능 추가됨) */}
      <div style={{padding:"14px 16px 4px"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6,scrollbarWidth:"none"}}>
          <style>{`.tag-scroll::-webkit-scrollbar{display:none;}`}</style>
          {tags.map(tag=>(
            <div 
              key={tag.id} 
              onClick={() => setSelectedTag(p => p === tag.id ? null : tag.id)}
              style={{
                display:"flex",alignItems:"center",gap:4,background:"white",borderRadius:99,padding:"5px 12px",fontSize:12,fontWeight:500,
                color:"#4b5563",boxShadow:"0 1px 4px rgba(0,0,0,0.07)",flexShrink:0, cursor:"pointer",
                border: selectedTag === tag.id ? `2px solid ${PINK}` : "2px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <span>{tag.icon}</span><span>{tag.label}</span>
              {!DEFAULT_TAGS.find(d=>d.id===tag.id)&&(
                <span onClick={(e)=>{e.stopPropagation(); deleteTag(tag.id);}} style={{marginLeft:2,color:"#f9a8d4",fontSize:13,fontWeight:900}}>×</span>
              )}
            </div>
          ))}
          <button onClick={()=>setShowTagInput(p=>!p)} style={{flexShrink:0,padding:"5px 12px",borderRadius:99,border:`1.5px dashed ${PINK}`,background:"white",color:PINK,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
            {showTagInput?"✕":"+ 태그 추가"}
          </button>
        </div>
        {showTagInput&&(
          <div className="slide-down" style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
            <input value={newTagIcon} onChange={e=>setNewTagIcon(e.target.value)} style={{width:44,textAlign:"center",border:`1.5px solid ${PINK}`,borderRadius:10,padding:"7px 6px",fontSize:18,outline:"none"}} maxLength={2} placeholder="🏷️"/>
            <input value={newTagLabel} onChange={e=>setNewTagLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} placeholder="태그 이름" style={{flex:1,border:`1.5px solid ${PINK}`,borderRadius:10,padding:"7px 12px",fontSize:13,outline:"none"}}/>
            <button onClick={addTag} style={{padding:"7px 14px",borderRadius:10,border:"none",background:PINK,color:"white",fontSize:13,fontWeight:700,cursor:"pointer"}}>추가</button>
          </div>
        )}
      </div>

      {/* TABS + 이동/수정 버튼 */}
      <div style={{display:"flex",gap:8,padding:"12px 16px 8px",overflowX:"auto",alignItems:"center"}}>
        {[["all","📋 전체"],["today","🌅 오늘"],["undone","⏳ 미완료"],["moved","📦 미룬 할일"],["journal","📓 학습일지"]].map(([v,label])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 20px",borderRadius:99,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:tab===v?PINK:"white",color:tab===v?"white":"#6b7280",boxShadow:tab===v?`0 2px 14px rgba(219,39,119,0.35)`:"0 1px 4px rgba(0,0,0,0.08)"}}>{label}</button>
        ))}
        <div style={{flexShrink:0,marginLeft:"auto",display:"flex",gap:6}}>
          <button 
            onClick={()=>{ setReorderMode(p=>!p); setEditMode(false); }} 
            disabled={!!selectedTag} // 필터링 중에는 드래그 비활성화
            style={{opacity: selectedTag ? 0.5 : 1, padding:"8px 14px",borderRadius:99,border:`1.5px solid ${reorderMode?"#f59e0b":"#e5e7eb"}`,cursor:selectedTag?"not-allowed":"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:reorderMode?"#fffbeb":"white",color:reorderMode?"#d97706":"#9ca3af"}}
          >
            {reorderMode?"✅ 완료":"↕️ 이동"}
          </button>
          <button onClick={()=>{ setEditMode(p=>!p); setReorderMode(false); }} style={{padding:"8px 14px",borderRadius:99,border:`1.5px solid ${editMode?"#db2777":"#e5e7eb"}`,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:editMode?"#fdf2f8":"white",color:editMode?"#db2777":"#9ca3af"}}>
            {editMode?"✅ 완료":"✏️ 수정"}
          </button>
        </div>
      </div>

      {/* ── 렌더링 영역 ── */}
      {tab==="moved" && (
        <div style={{padding:"8px 16px"}}>
          {Object.keys(moved).length===0?(
            <div style={{textAlign:"center",padding:"40px 20px",color:"#9ca3af",fontSize:14}}>미룬 할일이 없어요 🎉<br/><span style={{fontSize:12}}>할일 오른쪽 미루기 버튼을 눌러보세요</span></div>
          ):Object.entries(moved).map(([taskId,targetDay])=>{
            const task=ALL_BASE_TASKS.find(t=>t.id===taskId); if(!task) return null;
            return(
              <div key={taskId} style={{background:"white",borderRadius:14,padding:"14px 16px",marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#d97706",fontWeight:700,marginBottom:4}}>📦 {targetDay}일로 이동됨</div>
                  <div style={{fontSize:14,color:"#374151",lineHeight:1.5}}>{task.text}</div>
                </div>
                <button onClick={()=>cancelMove(taskId)} style={{border:"none",background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>취소</button>
              </div>
            );
          })}
        </div>
      )}

      {tab==="journal" && <Journal />}

      {tab!=="moved" && tab!=="journal" && (
        <div style={{padding:"8px 16px",display:"flex",flexDirection:"column",gap:12}}>
          {(() => {
            let weeksData = [];
            if (month === "mar") weeksData = WEEKS_META;
            else if (month === "apr") weeksData = APR_WEEKS_META;
            else if (month === "may") weeksData = MAY_WEEKS_META;
            else weeksData = JUN_WEEKS_META;

            return weeksData.map(week => {
              const isOpen = openWeeks[week.id];
              // 간단한 진행률 계산 (필터링되지 않은 전체 기준)
              const wTasks = week.days.flatMap(d => {
                const dayKey = month === "mar" ? d : `${month}-${d}`;
                return getOrderedTasks(d, month);
              });
              const wDone = wTasks.filter(t=>checked[t.id]).length;
              const wPct = wTasks.length > 0 ? Math.round((wDone/wTasks.length)*100) : 0;

              return (
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
                      <div style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{wDone}/{wTasks.length}</div>
                      <div style={{fontSize:14,marginTop:6,color:week.color,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s"}}>▼</div>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{padding:"6px 12px 14px"}}>
                      {week.days.map(day => {
                        const dayKey = month === "mar" ? day : `${month}-${day}`;
                        let tdy = false, wkd = false, dayLabel = "";
                        
                        if(month==="mar"){ tdy=isToday(day); wkd=isWeekend(day); dayLabel=getDayLabel(day); }
                        else if(month==="apr"){ tdy=isTodayApr(day); wkd=isWeekendApr(day); dayLabel=getDayLabelApr(day); }
                        else if(month==="may"){ tdy=isTodayMay(day); wkd=isWeekendMay(day); dayLabel=getDayLabelMay(day); }
                        else if(month==="jun"){ tdy=isTodayJun(day); wkd=isWeekendJun(day); dayLabel=getDayLabelJun(day); }

                        const orderedTasks = getOrderedTasks(day, month);
                        let filtered = orderedTasks;
                        
                        if(tab==="today") filtered = tdy ? filtered : [];
                        else if(tab==="undone") filtered = filtered.filter(t=>!checked[t.id]);
                        
                        if(filtered.length===0 && tab==="today" && !tdy) return null;

                        const dayDone = orderedTasks.filter(t=>checked[t.id]).length;
                        const allDone = orderedTasks.length>0 && dayDone===orderedTasks.length;
                        const addS = addState[dayKey]||{};

                        return (
                          <div key={day} style={{margin:"8px 0",borderRadius:14,overflow:"hidden",border:tdy?`2px solid ${week.color}`:"1px solid #f1f5f9",background:tdy?week.lightColor:"#fafafa"}}>
                            <div style={{padding:"10px 14px 6px",display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:42,height:42,borderRadius:13,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:tdy?week.color:wkd?"#fee2e2":"#f1f5f9",color:tdy?"white":wkd?"#ef4444":"#374151"}}>
                                <div style={{fontSize:16,fontWeight:800,lineHeight:1.1}}>{day}</div>
                                <div style={{fontSize:10,fontWeight:700}}>{dayLabel}</div>
                              </div>
                              <div style={{flex:1}}>
                                {tdy&&<span style={{fontSize:11,fontWeight:800,background:week.color,color:"white",borderRadius:99,padding:"2px 9px"}}>TODAY</span>}
                                {wkd&&!tdy&&<span style={{fontSize:11,fontWeight:600,color:"#ef4444"}}>주말 · 3~4시간</span>}
                                {!wkd&&!tdy&&<span style={{fontSize:11,fontWeight:500,color:"#9ca3af"}}>평일 · 1~2시간</span>}
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <div style={{fontSize:12,fontWeight:700,color:allDone?"#10b981":"#9ca3af"}}>{allDone?"✅ 완료!":`${dayDone}/${orderedTasks.length}`}</div>
                                <button onClick={()=>setAddState(p=>({...p,[dayKey]:{...addS,open:!addS.open,text:"",tagId:tags[0]?.id}}))} style={{width:28,height:28,borderRadius:8,border:"none",background:addS.open?week.color:"#f1f5f9",color:addS.open?"white":"#9ca3af",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                                  {addS.open?"✕":"+"}
                                </button>
                              </div>
                            </div>

                            {addS.open && (
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
                                  <input value={addS.text||""} onChange={e=>setAddState(p=>({...p,[dayKey]:{...addS,text:e.target.value}}))} onKeyDown={e=>e.key==="Enter"&&addCustomTask(dayKey)} placeholder="할일 입력 후 Enter..." style={{flex:1,border:`1.5px solid ${week.color}`,borderRadius:10,padding:"8px 12px",fontSize:13,outline:"none",background:"white",color:"#374151"}} autoFocus/>
                                  <button onClick={()=>addCustomTask(dayKey)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:week.color,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0}}>추가</button>
                                </div>
                              </div>
                            )}

                            <div style={{padding:"2px 14px 10px"}}>
                              {filtered.map((task,i)=>{
                                const isCustom = task.id.startsWith("custom-");
                                const isMoved = !!moved[task.id];

                                return (
                                  <div
                                    key={task.id}
                                    className={`task-row${dragActiveId===task.id?" dragging":""}`}
                                    draggable={reorderMode}
                                    onDragStart={reorderMode?(e=>onDragStart(e,day,task.id)):undefined}
                                    onDragEnter={reorderMode?(e=>onDragEnter(e,day,task.id)):undefined}
                                    onDragOver={reorderMode?onDragOver:undefined}
                                    onDrop={reorderMode?(e=>onDrop(e,day,task.id,month)):undefined}
                                    onDragEnd={reorderMode?onDragEnd:undefined}
                                    style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 6px",borderTop:i>0?"1px solid #f1f5f9":"none",cursor:reorderMode?"grab":"default",background:dragActiveId===task.id?"#fdf2f8":important[task.id]?"#fffbeb":"transparent",borderRadius:10,transition:"background 0.15s",WebkitUserSelect:"none",userSelect:"none",border:important[task.id]?"1.5px solid #fde68a":"1.5px solid transparent",marginBottom:important[task.id]?2:0}}
                                  >
                                    {reorderMode && <span className="drag-handle">⠿</span>}

                                    <div onClick={()=>toggle(task.id)} style={{width:22,height:22,borderRadius:7,flexShrink:0,marginTop:1,border:checked[task.id]?`2px solid ${week.color}`:"2px solid #d1d5db",background:checked[task.id]?week.color:"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                                      {checked[task.id]&&<span style={{color:"white",fontSize:13,fontWeight:900,lineHeight:1}}>✓</span>}
                                    </div>

                                    <div style={{flex:1}}>
                                      {editMode ? (
                                        <input
                                          value={editingText[task.id] ?? task.text}
                                          onChange={e=>setEditingText(p=>({...p,[task.id]:e.target.value}))}
                                          style={{fontSize:14,fontWeight:500,color:"#1f2937",border:"none",borderBottom:"1.5px solid #db2777",background:"transparent",outline:"none",width:"100%",padding:"1px 0"}}
                                        />
                                      ) : (
                                        <span onClick={()=>toggle(task.id)} style={{fontSize:14,fontWeight:checked[task.id]?400:500,lineHeight:1.6,color:checked[task.id]?"#9ca3af":"#1f2937",textDecoration:checked[task.id]?"line-through":"none",transition:"all 0.15s",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{editingText[task.id]??task.text}</span>
                                      )}
                                    </div>

                                    <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                                      {important[task.id]&&<span style={{fontSize:15,lineHeight:1}}>⭐</span>}
                                      {editMode&&isCustom&&<button onClick={()=>deleteCustomTask(dayKey,task.id)} style={{border:"none",background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"3px 7px",fontSize:11,fontWeight:700,cursor:"pointer"}}>삭제</button>}
                                      {editMode&&!isCustom&&<button onClick={()=>deleteBasicTask(task.id)} style={{border:"none",background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"3px 7px",fontSize:11,fontWeight:700,cursor:"pointer"}}>삭제</button>}
                                      {!editMode&&!checked[task.id]&&!isCustom&&(
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
            });
          })()}
        </div>
      )}

      {tab==="all" && month==="mar" && (
        <div style={{margin:"8px 16px 0",background:"white",borderRadius:20,padding:"20px",boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:14,fontWeight:800,color:"#374151",letterSpacing:"-0.02em",marginBottom:14}}>💡 공부 원칙</div>
          {["강의는 1.5배속 + 직접 손으로 따라치기 (복붙 금지)","모르면 구글 → 공식문서 → 강의 재수강 순서로","NestJS 복습은 '읽기'가 아니라 '설명할 수 있는지' 확인하기","AI 코드 생성 절대 금지 — 직접 만들어야 포폴이 됨"].map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:9,fontSize:13,lineHeight:1.6}}>
              <span style={{color:PINK,fontWeight:800,flexShrink:0}}>0{i+1}.</span>
              <span style={{color:"#4b5563",fontWeight:400}}>{tip}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{textAlign:"center",marginTop:28,fontSize:13,fontWeight:600,color:"#f9a8d4"}}>🌸 화이팅! 할 수 있어! 🌸</div>
    </div>

    {/* 날짜 이동 모달 (수정된 이동 로직 반영) */}
    {moveModal && (() => {
      let availableDays = [];
      if(month === "mar") availableDays = Object.keys(BASE_TASKS_BY_DAY).map(Number);
      if(month === "apr") availableDays = Object.keys(APR_TASKS_BY_DAY).map(Number);
      if(month === "may") availableDays = Object.keys(MAY_TASKS_BY_DAY).map(Number);
      if(month === "jun") availableDays = Object.keys(JUN_TASKS_BY_DAY).map(Number);

      return (
        <div className="modal-overlay" onClick={()=>setMoveModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:16,fontWeight:800,color:"#1e1b4b",marginBottom:6}}>📦 할일 미루기</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:20,lineHeight:1.5,background:"#f9fafb",borderRadius:10,padding:"10px 12px"}}>{moveModal.taskText}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>어느 날로 미룰까요? ({month.toUpperCase()}월)</div>
            <div style={{maxHeight:"45vh",overflowY:"auto"}}>
              {availableDays.filter(d=>d>moveModal.fromDay).map(day=>{
                let dLabel = ""; let wkd = false;
                if(month==="mar"){ dLabel=getDayLabel(day); wkd=isWeekend(day); }
                else if(month==="apr"){ dLabel=getDayLabelApr(day); wkd=isWeekendApr(day); }
                else if(month==="may"){ dLabel=getDayLabelMay(day); wkd=isWeekendMay(day); }
                else if(month==="jun"){ dLabel=getDayLabelJun(day); wkd=isWeekendJun(day); }

                return (
                  <button key={day} className="day-btn" onClick={()=>confirmMove(day)}>
                    <span>{day}일 ({dLabel})</span>
                    <span style={{fontSize:12,color:"#9ca3af"}}>{wkd?"주말":"평일"}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={()=>setMoveModal(null)} style={{width:"100%",marginTop:12,border:"none",background:"#f3f4f6",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,color:"#6b7280",cursor:"pointer"}}>취소</button>
          </div>
        </div>
      );
    })()}
  </>);
}