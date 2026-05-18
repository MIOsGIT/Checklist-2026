import Journal from "./Journal.jsx";
import { useState, useEffect, useRef } from "react";

const todayDate = new Date();
const TODAY_DAY = todayDate.getDate();
const IS_MARCH_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 2;
const IS_APRIL_2026 = todayDate.getFullYear() === 2026 && todayDate.getMonth() === 3;
const TODAY_APR_DAY = IS_APRIL_2026 ? todayDate.getDate() : null;

// ── 태그 3개로 고정 ──
const DEFAULT_TAGS = [
  { id: "tag-react",   icon: "🌐", label: "React" },
  { id: "tag-toeic",   icon: "📗", label: "TOEIC" },
  { id: "tag-java",    icon: "☕", label: "자바프로그래밍" },
];

// (3, 4월 데이터는 유지하되 생략 없이 포함)
const BASE_TASKS_BY_DAY = {
  // ── 3/23(월) ──
  23: [
    { id:"t1",  text:"👩🏻‍💻 근로(오전): 전공 필기 가볍게 정리", tagId:"tag-java" },
    { id:"t2",  text:"👩🏻‍💻 근로(오후): 전공 필기 계속", tagId:"tag-java" },
  ],
  // ── 3/24(화) ──
  24: [
    { id:"t5",  text:"🎬 React 기초 훑어보기", tagId:"tag-react" },
  ],
  // ── 3/25(수) ──
  25: [
    { id:"t9",  text:"🎬 React State 개념 복습", tagId:"tag-react" },
  ],
  // ── 3/26(목) ──
  26: [
    { id:"t13", text:"👩🏻‍💻 근로(오전): 전날 React 개념 복습", tagId:"tag-react" },
    { id:"t14", text:"👩🏻‍💻 근로(오후): 오늘 수업 필기 정리", tagId:"tag-java" },
  ],
  // ── 3/27(금) ──
  27: [
    { id:"t16", text:"👩🏻‍💻 근로(오전): 전공 복습", tagId:"tag-java" },
  ],
  // ── 3/30(월) ──
  30: [
    { id:"t26", text:"👩🏻‍💻 근로(오전): 3월 마무리 정리", tagId:"tag-react" },
    { id:"t27", text:"👩🏻‍💻 근로(오후): 4월 계획 세우기", tagId:"tag-react" },
  ],
};

const APR_TASKS_BY_DAY = {
  2:  [{ id:"a5", text:"👩🏻‍💻 근로(오전): 전공 복습", tagId:"tag-java" }, { id:"a6", text:"👩🏻‍💻 근로(오후): 복습 계속", tagId:"tag-java" }],
  3:  [{ id:"a8", text:"👩🏻‍💻 근로(오전): 전공 복습", tagId:"tag-java" }],
  6:  [{ id:"a17", text:"👩🏻‍💻 근로(오전): 알고리즘", tagId:"tag-java" }, { id:"a18", text:"👩🏻‍💻 근로(오후): 복습 계속", tagId:"tag-java" }],
  9:  [{ id:"a29", text:"👩🏻‍💻 근로(오전): 필기 정리", tagId:"tag-java" }, { id:"a30", text:"👩🏻‍💻 근로(오후): 필기 정리", tagId:"tag-java" }],
  10: [{ id:"a32", text:"👩🏻‍💻 근로(오전): 오디오 과제", tagId:"tag-java" }],
  13: [{ id:"a41", text:"👩🏻‍💻 근로(오전): 시험범위 1회독", tagId:"tag-java" }, { id:"a42", text:"👩🏻‍💻 근로(오후): 약점 정리", tagId:"tag-java" }],
  16: [{ id:"a51", text:"👩🏻‍💻 근로(오전): 시험범위 1회독", tagId:"tag-java" }, { id:"a52", text:"👩🏻‍💻 근로(오후): 약점 정리", tagId:"tag-java" }],
  17: [{ id:"a53", text:"👩🏻‍💻 근로(오전): 시험범위 복습", tagId:"tag-java" }],
  20: [{ id:"a60", text:"👩🏻‍💻 근로(오전): 직전 최종 정리", tagId:"tag-java" }, { id:"a61", text:"👩🏻‍💻 근로(오후): 직전 정리", tagId:"tag-java" }],
  27: [{ id:"a70", text:"👩🏻‍💻 근로(오전): React Query 개념", tagId:"tag-react" }, { id:"a71", text:"👩🏻‍💻 근로(오후): 실습", tagId:"tag-react" }],
  30: [{ id:"a82", text:"👩🏻‍💻 근로(오전): 4월 회고", tagId:"tag-react" }, { id:"a83", text:"👩🏻‍💻 근로(오후): 5월 초안", tagId:"tag-react" }],
};

// ── 5월 (근로 중 LC 원천 차단 적용) ──
const MAY_TASKS_BY_DAY = {
  // [3주차: 5/18(월) ~ 5/24(일)]
  18: [ // 월 (근로)
    { id:"m1", text:"👩🏻‍💻 근로(오전): 📗 토익 단어 50개 암기 (눈으로)", tagId:"tag-toeic" },
    { id:"m2", text:"👩🏻‍💻 근로(오후): 🌐 React 공식문서 튜토리얼 정독", tagId:"tag-react" },
    { id:"m3", text:"☕ 자바 팀프로젝트 현황 파악 및 역할 분담", tagId:"tag-java" },
  ],
  19: [ // 화 (자유)
    { id:"m4", text:"📗 토익 RC Part 5, 6 문법 뽀개기", tagId:"tag-toeic" },
    { id:"m5", text:"🌐 React 공식문서 - State와 Props 실습", tagId:"tag-react" },
  ],
  20: [ // 수 (자유)
    { id:"m6", text:"📗 토익 LC Part 3, 4 쉐도잉 연습", tagId:"tag-toeic" },
    { id:"m7", text:"🌐 React Hooks (useState) 블로그 아티클 정리", tagId:"tag-react" },
    { id:"m8", text:"☕ 15시 자바 팀미팅", tagId:"tag-java" },
  ],
  21: [ // 목 (근로/알바)
    { id:"m9", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 RC 단어 복습 및 오답 정리", tagId:"tag-toeic" },
    { id:"m10", text:"👩🏻‍💻 근로 짬날 때: 🌐 React 기술 블로그 스크랩", tagId:"tag-react" },
  ],
  22: [ // 금 (근로/알바)
    { id:"m11", text:"👩🏻‍💻 근로(오전): 📗 토익 Part 7 속독 요령 및 단어 정리", tagId:"tag-toeic" },
    { id:"m12", text:"☕ 오후 집중: 자바 팀프로젝트 핵심 로직 구현", tagId:"tag-java" },
  ],
  23: [ // 토 (알바)
    { id:"m13", text:"📗 오전 집중: 토익 실전 모의고사 1회 (시간엄수)", tagId:"tag-toeic" },
    { id:"m14", text:"☕ 자바 팀프로젝트 개별 작업", tagId:"tag-java" },
  ],
  24: [ // 일 (자유)
    { id:"m15", text:"📗 모의고사 1회 오답노트 및 LC 약점 분석", tagId:"tag-toeic" },
    { id:"m16", text:"🌐 React 공식문서 - useEffect 실습해보기", tagId:"tag-react" },
  ],

  // [4주차: 5/25(월) ~ 5/31(일)]
  25: [ // 월 (근로)
    { id:"m17", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 단어 50개 암기 및 문법 정리", tagId:"tag-toeic" },
    { id:"m18", text:"☕ 자바 팀플 코드 리뷰 및 피드백 반영", tagId:"tag-java" },
  ],
  26: [ // 화 (자유)
    { id:"m19", text:"📗 토익 RC 기출문제 1세트 풀기", tagId:"tag-toeic" },
    { id:"m20", text:"🌐 React Router 개념 공식문서/블로그 학습", tagId:"tag-react" },
  ],
  27: [ // 수 (자유)
    { id:"m21", text:"📗 토익 LC 기출문제 1세트 집중 풀기", tagId:"tag-toeic" },
    { id:"m22", text:"☕ 자바 팀플 최종 병합 준비", tagId:"tag-java" },
  ],
  28: [ // 목 (근로/알바)
    { id:"m23", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 RC 오답노트 및 단어 반복 (LC제외)", tagId:"tag-toeic" },
  ],
  29: [ // 금 (근로/알바)
    { id:"m24", text:"👩🏻‍💻 근로(오전): 📗 토익 Part 7 지문 독해 훈련", tagId:"tag-toeic" },
    { id:"m25", text:"☕ 오후 집중: 자바 팀프로젝트 버그 수정", tagId:"tag-java" },
  ],
  30: [ // 토 (알바)
    { id:"m26", text:"📗 오전 집중: 토익 실전 모의고사 2회 풀기", tagId:"tag-toeic" },
  ],
  31: [ // 일 (자유)
    { id:"m27", text:"📗 모의고사 2회 LC/RC 꼼꼼한 오답 분석", tagId:"tag-toeic" },
    { id:"m28", text:"☕ 자바 팀프로젝트 최종본 점검 🚀", tagId:"tag-java" },
  ],
};

// ── 6월 (근로 중 LC 원천 차단 적용) ──
const JUN_TASKS_BY_DAY = {
  // [1주차: 6/1(월) ~ 6/7(일)]
  1: [ // 월 (근로)
    { id:"j1", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 단어 50개 및 RC Part 5 오답 확인", tagId:"tag-toeic" },
    { id:"j2", text:"☕ 기말고사 시험범위 파악 및 계획 세우기", tagId:"tag-java" },
  ],
  2: [ // 화 (자유)
    { id:"j3", text:"📗 밀린 토익 LC 오답 듣기 및 900+ 문법 정리", tagId:"tag-toeic" },
    { id:"j4", text:"☕ 전공 기말고사 1회독 시작", tagId:"tag-java" },
  ],
  3: [ // 수 (자유)
    { id:"j5", text:"📗 토익 LC 패러프레이징 단어 정리 및 쉐도잉", tagId:"tag-toeic" },
    { id:"j6", text:"☕ 전공 기말고사 1회독 계속", tagId:"tag-java" },
  ],
  4: [ // 목 (근로/알바)
    { id:"j7", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 RC Part 5 100제 풀기", tagId:"tag-toeic" },
  ],
  5: [ // 금 (근로/알바)
    { id:"j8", text:"👩🏻‍💻 근로(오전): 📗 토익 RC 약점 파트 집중 보완", tagId:"tag-toeic" },
    { id:"j9", text:"☕ 오후 집중: 전공 과목 핵심 요약", tagId:"tag-java" },
  ],
  6: [ // 토 (알바)
    { id:"j10", text:"📗 오전 집중: 토익 실전 모의고사 3회 (시간엄수)", tagId:"tag-toeic" },
  ],
  7: [ // 일 (자유)
    { id:"j11", text:"📗 모의고사 3회 오답 분석 (LC 중점)", tagId:"tag-toeic" },
    { id:"j12", text:"☕ 전공 기말고사 2회독", tagId:"tag-java" },
  ],

  // [2주차: 6/8(월) ~ 6/14(일)]
  8: [ // 월 (근로)
    { id:"j13", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 자주 틀리는 단어장 반복 (눈으로)", tagId:"tag-toeic" },
  ],
  9: [ // 화 (자유)
    { id:"j14", text:"📗 토익 RC Part 7 하프 모의고사", tagId:"tag-toeic" },
    { id:"j15", text:"☕ 기말고사 기출문제 풀이", tagId:"tag-java" },
  ],
  10: [ // 수 (자유)
    { id:"j16", text:"📗 토익 LC 하프 모의고사", tagId:"tag-toeic" },
    { id:"j17", text:"☕ 기말고사 오답 정리", tagId:"tag-java" },
  ],
  11: [ // 목 (근로/알바)
    { id:"j18", text:"👩🏻‍💻 근로(오전/오후): 📗 토익 D-3 멘탈 관리 및 기출단어 암기", tagId:"tag-toeic" },
  ],
  12: [ // 금 (근로/알바)
    { id:"j19", text:"👩🏻‍💻 근로(오전): 📗 토익 RC 시간 단축 집중 훈련 (LC제외)", tagId:"tag-toeic" },
    { id:"j20", text:"☕ 오후: 전공 요약 암기 + 토익 LC 가벼운 마무리", tagId:"tag-java" },
  ],
  13: [ // 토 (알바)
    { id:"j21", text:"📗 오전 집중: 가벼운 LC 듣기 및 컨디션 조절", tagId:"tag-toeic" },
  ],
  14: [ // 일 (자유)
    { id:"j22", text:"🏆 토익 정기시험! 900점 가자 🔥", tagId:"tag-toeic" },
  ],

  // [3주차: 6/15(월) ~ 6/21(일)] - 16~19일 기말고사
  15: [ // 월 (근로)
    { id:"j23", text:"👩🏻‍💻 근로(오전/오후): ☕ 기말고사 D-1 전과목 총정리", tagId:"tag-java" },
  ],
  16: [ { id:"j24", text:"🏫 기말고사 1일차 - 파이팅!", tagId:"tag-java" } ],
  17: [ { id:"j25", text:"🏫 기말고사 2일차", tagId:"tag-java" } ],
  18: [ { id:"j26", text:"🏫 기말고사 3일차", tagId:"tag-java" } ],
  19: [ { id:"j27", text:"🏫 기말고사 4일차 (마지막)", tagId:"tag-java" } ],
  20: [ { id:"j28", text:"🎉 오전: 기말 끝! 푹 쉬기 (17시 알바 가기 전까지)", tagId:"tag-react" } ],
  21: [ { id:"j29", text:"🌐 React 공식문서 기반 미니 프로젝트 기획", tagId:"tag-react" } ],

  // [4주차: 6/22(월) ~ 6/28(일)]
  22: [ // 월 (근로)
    { id:"j30", text:"👩🏻‍💻 근로 중: 🌐 React 공식문서 컴포넌트 개념 복습", tagId:"tag-react" },
    { id:"j31", text:"🌐 귀가 후: 프로젝트 세팅 및 레이아웃", tagId:"tag-react" }
  ],
  23: [ { id:"j32", text:"🌐 React 상태관리(useState/Context) 적용", tagId:"tag-react" } ],
  24: [ { id:"j33", text:"🌐 React API 연동 및 데이터 패칭 실습", tagId:"tag-react" } ],
  25: [ { id:"j34", text:"👩🏻‍💻 근로(오전/오후): 🌐 React 관련 블로그 아티클 스크랩", tagId:"tag-react" } ],
  26: [
    { id:"j35", text:"👩🏻‍💻 근로(오전): 🌐 아티클 읽기 및 개념 정리", tagId:"tag-react" },
    { id:"j36", text:"🌐 오후 집중: 리팩토링 및 커스텀 훅 분리", tagId:"tag-react" },
  ],
  27: [ { id:"j37", text:"🌐 오전: React 프로젝트 UI 폴리싱 및 버그 수정", tagId:"tag-react" } ],
  28: [ { id:"j38", text:"🌐 미니 프로젝트 최종 완성 및 GitHub 배포 🚀", tagId:"tag-react" } ],

  // [5주차: 6/29(월) ~ 6/30(화)]
  29: [ { id:"j39", text:"👩🏻‍💻 근로(오전/오후): 🌐 개발 블로그에 프로젝트 회고 작성", tagId:"tag-react" } ],
  30: [ { id:"j40", text:"📝 6월 최종 마무리 및 7월 방향성 세우기", tagId:"tag-react" } ],
};

// 배열 평탄화
const ALL_BASE_TASKS_MAR = Object.values(BASE_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS_APR = Object.values(APR_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS_MAY = Object.values(MAY_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS_JUN = Object.values(JUN_TASKS_BY_DAY).flat();
const ALL_BASE_TASKS = [...ALL_BASE_TASKS_MAR, ...ALL_BASE_TASKS_APR, ...ALL_BASE_TASKS_MAY, ...ALL_BASE_TASKS_JUN];

const WEEKS_META = [
  { id:"week1", label:"1주차", range:"3/23(월) ~ 3/29(일)", theme:"🎬 기본 복습", themeDesc:"전공 당일 복습", color:"#ec4899", lightColor:"#fdf2f8", days:[23,24,25,26,27,28,29] },
  { id:"week2", label:"2주차", range:"3/30(월) ~ 3/31(화)", theme:"🎉 3월 마무리", themeDesc:"마무리 및 4월 준비", color:"#f59e0b", lightColor:"#fffbeb", days:[30,31] },
];
const APR_WEEKS_META = [
  { id:"apr-week1", label:"1주차", range:"4/1(수) ~ 4/5(일)", month:"apr", theme:"✏️ 4월 시작", themeDesc:"전공 당일복습 유지", color:"#8b5cf6", lightColor:"#f5f3ff", days:[2,3] },
  { id:"apr-week2", label:"2주차", range:"4/6(월) ~ 4/12(일)", month:"apr", theme:"🔗 4월 2주차", themeDesc:"전공 과제 체크", color:"#0ea5e9", lightColor:"#f0f9ff", days:[6,9,10] },
  { id:"apr-week3", label:"3주차", range:"4/13(월) ~ 4/19(일)", month:"apr", theme:"🚨 시험 전 집중", themeDesc:"시험범위 정리", color:"#ef4444", lightColor:"#fef2f2", days:[13,16,17] },
  { id:"apr-week4", label:"4주차", range:"4/20(월) ~ 4/26(일)", month:"apr", theme:"🏫 중간고사", themeDesc:"시험 후 회복", color:"#f59e0b", lightColor:"#fffbeb", days:[20] },
  { id:"apr-week5", label:"5주차", range:"4/27(월) ~ 4/30(목)", month:"apr", theme:"🚀 4월 마무리", themeDesc:"4월 회고", color:"#10b981", lightColor:"#f0fdf4", days:[27,30] },
];
const MAY_WEEKS_META = [
  { id:"may-week3", label:"3주차", range:"5/18(월) ~ 5/24(일)", month:"may", theme:"🚀 토익 900+ / React 공식문서 시작", themeDesc:"단어/LC/RC 집중, React 튜토리얼 읽기, 자바 시작", color:"#ec4899", lightColor:"#fdf2f8", days:[18,19,20,21,22,23,24] },
  { id:"may-week4", label:"4주차", range:"5/25(월) ~ 5/31(일)", month:"may", theme:"📗 실전 모의고사 + 자바 프로젝트 마감", themeDesc:"토익 모의고사 풀이, 자바 최종 제출", color:"#8b5cf6", lightColor:"#f5f3ff", days:[25,26,27,28,29,30,31] },
];
const JUN_WEEKS_META = [
  { id:"jun-week1", label:"1주차", range:"6/1(월) ~ 6/7(일)", month:"jun", theme:"📚 기말 대비 시작 + 토익 실전", themeDesc:"전공 1회독, 토익 오답노트 보완", color:"#0ea5e9", lightColor:"#f0f9ff", days:[1,2,3,4,5,6,7] },
  { id:"jun-week2", label:"2주차", range:"6/8(월) ~ 6/14(일)", month:"jun", theme:"🏆 6/14 토익 시험 + 기말 집중", themeDesc:"목표 900점 달성! 기말고사 요약정리", color:"#ef4444", lightColor:"#fef2f2", days:[8,9,10,11,12,13,14] },
  { id:"jun-week3", label:"3주차", range:"6/15(월) ~ 6/21(일)", month:"jun", theme:"🏫 6/16~19 기말고사", themeDesc:"시험 잘 마무리하고 푹 쉬기", color:"#f59e0b", lightColor:"#fffbeb", days:[15,16,17,18,19,20,21] },
  { id:"jun-week4", label:"4주차", range:"6/22(월) ~ 6/28(일)", month:"jun", theme:"🌐 React 미니 프로젝트", themeDesc:"공식문서 기반으로 직접 만들어보기", color:"#10b981", lightColor:"#f0fdf4", days:[22,23,24,25,26,27,28] },
  { id:"jun-week5", label:"5주차", range:"6/29(월) ~ 6/30(화)", month:"jun", theme:"✨ 6월 회고", themeDesc:"기술 블로그 회고 및 7월 계획", color:"#6366f1", lightColor:"#e0e7ff", days:[29,30] },
];

const DAY_LABELS = ["일","월","화","수","목","금","토"];
const COLORS = ["#f59e0b","#ec4899","#10b981","#ef4444","#0ea5e9","#a855f7","#ec4899","#f97316"];

function getDayLabel(d) { return DAY_LABELS[new Date(2026,2,d).getDay()]; }
function getDayLabelApr(d) { return DAY_LABELS[new Date(2026,3,d).getDay()]; }
function getDayLabelMay(d) { return DAY_LABELS[new Date(2026,4,d).getDay()]; }
function getDayLabelJun(d) { return DAY_LABELS[new Date(2026,5,d).getDay()]; }

// 요일에 따른 라벨링 함수 (월 근로, 목 근로/알바, 금 근로/알바, 토 알바)
function getScheduleBadge(monthIndex, day) {
  const dw = new Date(2026, monthIndex, day).getDay();
  if (dw === 1) return { text: "월 · 근로", color: "#6b7280" }; // 월
  if (dw === 4) return { text: "목 · 근로/알바", color: "#6b7280" }; // 목
  if (dw === 5) return { text: "금 · 근로/알바", color: "#6b7280" }; // 금
  if (dw === 6) return { text: "토 · 알바", color: "#3b82f6" }; // 토
  if (dw === 0) return { text: "일 · 자유공부", color: "#ef4444" }; // 일
  return { text: "화/수 · 개인공부", color: "#374151" }; // 화, 수
}

function isToday(d)     { return IS_MARCH_2026 && d===TODAY_DAY; }
function isTodayApr(d) { return IS_APRIL_2026 && d===TODAY_APR_DAY; }
const IS_MAY_2026  = todayDate.getFullYear()===2026 && todayDate.getMonth()===4;
const IS_JUN_2026  = todayDate.getFullYear()===2026 && todayDate.getMonth()===5;
const TODAY_MAY_DAY = IS_MAY_2026 ? todayDate.getDate() : null;
const TODAY_JUN_DAY = IS_JUN_2026 ? todayDate.getDate() : null;
function isTodayMay(d) { return IS_MAY_2026 && d===TODAY_MAY_DAY; }
function isTodayJun(d) { return IS_JUN_2026 && d===TODAY_JUN_DAY; }
function makeId()       { return `id-${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }
function makeConfetti(n=60){ return Array.from({length:n},(_,i)=>({ id:i, x:Math.random()*100, color:COLORS[Math.floor(Math.random()*COLORS.length)], size:Math.random()*8+5, delay:Math.random()*0.5, duration:Math.random()*1.5+1.5, shape:Math.random()>.5?"circle":"rect" })); }

export default function App() {
  const [tags, setTags] = useState(() => {
    try { 
      const saved = JSON.parse(localStorage.getItem("mio-tags")); 
      if (saved && saved.length !== 3) return DEFAULT_TAGS;
      return saved || DEFAULT_TAGS;
    } catch { return DEFAULT_TAGS; }
  });
  
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagIcon, setNewTagIcon]   = useState("🏷️");
  const [newTagLabel, setNewTagLabel] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

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
  const [openWeeks, setOpenWeeks] = useState({week1:true,week2:false,"apr-week1":false,"apr-week2":false,"apr-week3":false,"apr-week4":false,"apr-week5":false,"may-week3":true,"may-week4":true,"jun-week1":true,"jun-week2":true,"jun-week3":true,"jun-week4":true,"jun-week5":true});
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
    
    if (selectedTag) pool = pool.filter(t => t.tagId === selectedTag);

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

  let currentMonthBaseTasks = [];
  if (month === "mar") currentMonthBaseTasks = ALL_BASE_TASKS_MAR;
  else if (month === "apr") currentMonthBaseTasks = ALL_BASE_TASKS_APR;
  else if (month === "may") currentMonthBaseTasks = ALL_BASE_TASKS_MAY;
  else if (month === "jun") currentMonthBaseTasks = ALL_BASE_TASKS_JUN;

  const currentVisibleBaseTasks = currentMonthBaseTasks.filter(t=>!hiddenTasks[t.id]);
  const currentMonthCustomTasks = Object.keys(customTasks)
    .filter(k => {
      if(month === "mar") return !k.includes("-");
      return k.startsWith(month + "-");
    })
    .flatMap(k => customTasks[k]);

  let allMonthTasks = [...currentVisibleBaseTasks, ...currentMonthCustomTasks];
  if (selectedTag) allMonthTasks = allMonthTasks.filter(t => t.tagId === selectedTag);

  const monthTotalCount = allMonthTasks.length;
  const monthTotalDone = allMonthTasks.filter(t=>checked[t.id]).length;
  const progress = monthTotalCount > 0 ? Math.round((monthTotalDone / monthTotalCount) * 100) : 0;

  const PINK = "#db2777";
  const monthLabelText = { mar: "3월", apr: "4월", may: "5월", jun: "6월" }[month];
  const monthIdxMap = { mar: 2, apr: 3, may: 4, jun: 5 };

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
      <div style={{background:`linear-gradient(135deg,#f472b6 0%,${PINK} 100%)`,padding:"28px 20px 22px",color:"white",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 24px rgba(219,39,119,0.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontSize:11,fontWeight:500,opacity:0.75,letterSpacing:"0.05em"}}>📅 2026년 집중 공부 플래너</div>
          <button onClick={()=>setTab("journal")} style={{border:"1.5px solid rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.15)",color:"white",borderRadius:99,padding:"4px 12px",fontSize:12,fontWeight:700,cursor:"pointer",backdropFilter:"blur(4px)",whiteSpace:"nowrap"}}>📓 학습일지</button>
        </div>
        <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",marginBottom:18,color:"white"}}>Study CheckList ✨</div>
        <div style={{background:"rgba(255,255,255,0.22)",borderRadius:99,height:8,marginBottom:7}}>
          <div style={{background:"white",height:"100%",borderRadius:99,width:`${progress}%`,transition:"width 0.5s cubic-bezier(.4,0,.2,1)"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:500,opacity:0.85,color:"white"}}>
          <span>{monthLabelText} 전체 진행률 {selectedTag ? "(필터됨)" : ""}</span>
          <span style={{fontWeight:700}}>{monthTotalDone} / {monthTotalCount}개 ({progress}%)</span>
        </div>
      </div>

      <div style={{display:"flex",gap:8,padding:"14px 16px 0",borderBottom:"1px solid #f1f5f9"}}>
        {[["mar","🌸 3월"],["apr","🌿 4월"],["may","☀️ 5월"],["jun","🌊 6월"]].map(([m,label])=>(
          <button key={m} onClick={()=>{setMonth(m); setSelectedTag(null);}} style={{padding:"8px 20px",borderRadius:"12px 12px 0 0",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.2s",background:month===m?"white":"transparent",color:month===m?"#db2777":"#9ca3af",boxShadow:month===m?"0 -2px 8px rgba(0,0,0,0.06)":""}}>{label}</button>
        ))}
      </div>

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
                <span onClick={(e)=>{e.stopPropagation(); deleteTag(tag.id);}} style={{marginLeft:4,color:"#f9a8d4",fontSize:13,fontWeight:900}}>×</span>
              )}
            </div>
          ))}
          <button onClick={()=>setShowTagInput(p=>!p)} style={{flexShrink:0,padding:"5px 12px",borderRadius:99,border:`1.5px dashed ${PINK}`,background:"white",color:PINK,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
            {showTagInput?"✕":"+ 추가"}
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

      <div style={{display:"flex",gap:8,padding:"12px 16px 8px",overflowX:"auto",alignItems:"center"}}>
        {[["all","📋 전체"],["today","🌅 오늘"],["undone","⏳ 미완료"],["moved","📦 미룬 할일"],["journal","📓 학습일지"]].map(([v,label])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"8px 20px",borderRadius:99,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:tab===v?PINK:"white",color:tab===v?"white":"#6b7280",boxShadow:tab===v?`0 2px 14px rgba(219,39,119,0.35)`:"0 1px 4px rgba(0,0,0,0.08)"}}>{label}</button>
        ))}
        <div style={{flexShrink:0,marginLeft:"auto",display:"flex",gap:6}}>
          <button 
            onClick={()=>{ setReorderMode(p=>!p); setEditMode(false); }} 
            disabled={!!selectedTag} 
            style={{opacity: selectedTag ? 0.5 : 1, padding:"8px 14px",borderRadius:99,border:`1.5px solid ${reorderMode?"#f59e0b":"#e5e7eb"}`,cursor:selectedTag?"not-allowed":"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:reorderMode?"#fffbeb":"white",color:reorderMode?"#d97706":"#9ca3af"}}
          >
            {reorderMode?"✅ 완료":"↕️ 이동"}
          </button>
          <button onClick={()=>{ setEditMode(p=>!p); setReorderMode(false); }} style={{padding:"8px 14px",borderRadius:99,border:`1.5px solid ${editMode?"#db2777":"#e5e7eb"}`,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.2s",background:editMode?"#fdf2f8":"white",color:editMode?"#db2777":"#9ca3af"}}>
            {editMode?"✅ 완료":"✏️ 수정"}
          </button>
        </div>
      </div>

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
              const wTasks = week.days.flatMap(d => getOrderedTasks(d, month));
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
                        let tdy = false, dayLabel = "";
                        
                        if(month==="mar"){ tdy=isToday(day); dayLabel=getDayLabel(day); }
                        else if(month==="apr"){ tdy=isTodayApr(day); dayLabel=getDayLabelApr(day); }
                        else if(month==="may"){ tdy=isTodayMay(day); dayLabel=getDayLabelMay(day); }
                        else if(month==="jun"){ tdy=isTodayJun(day); dayLabel=getDayLabelJun(day); }

                        const badge = getScheduleBadge(monthIdxMap[month], day);

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
                              <div style={{width:42,height:42,borderRadius:13,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:tdy?week.color:badge.color==="#ef4444"?"#fee2e2":"#f1f5f9",color:tdy?"white":badge.color}}>
                                <div style={{fontSize:16,fontWeight:800,lineHeight:1.1}}>{day}</div>
                                <div style={{fontSize:10,fontWeight:700}}>{dayLabel}</div>
                              </div>
                              <div style={{flex:1}}>
                                {tdy&&<span style={{fontSize:11,fontWeight:800,background:week.color,color:"white",borderRadius:99,padding:"2px 9px",marginRight:4}}>TODAY</span>}
                                <span style={{fontSize:11,fontWeight:600,color:badge.color}}>{badge.text}</span>
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

      {tab==="all" && (
        <div style={{margin:"8px 16px 0",background:"white",borderRadius:20,padding:"20px",boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:14,fontWeight:800,color:"#374151",letterSpacing:"-0.02em",marginBottom:14}}>💡 5~6월 공부 원칙</div>
          {["React는 인강 대신 공식문서/블로그 위주로 직접 찾아가며 실습",
            "목,금,토 알바(17시~) 가기 전에는 무조건 공부 분량 다 채우기!",
            "이어폰을 낄 수 없는 근로 중(월,목,금)에는 단어 암기 및 눈으로 푸는 독해 위주",
            "토익 900+을 위해 주말에는 무조건 실전 모의고사 1회 이상 풀기",
            "기말고사는 2주 전(6월초)부터 전공 1회독 시작하기"].map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:9,fontSize:13,lineHeight:1.6}}>
              <span style={{color:PINK,fontWeight:800,flexShrink:0}}>0{i+1}.</span>
              <span style={{color:"#4b5563",fontWeight:400}}>{tip}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{textAlign:"center",marginTop:28,fontSize:13,fontWeight:600,color:"#f9a8d4"}}>🌸 토익 900, 기말고사 모두 화이팅! 🌸</div>
    </div>

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
            <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>어느 날로 미룰까요? ({monthLabelText})</div>
            <div style={{maxHeight:"45vh",overflowY:"auto"}}>
              {availableDays.filter(d=>d>moveModal.fromDay).map(day=>{
                let dLabel = "";
                if(month==="mar") dLabel=getDayLabel(day);
                else if(month==="apr") dLabel=getDayLabelApr(day);
                else if(month==="may") dLabel=getDayLabelMay(day);
                else if(month==="jun") dLabel=getDayLabelJun(day);
                
                const badge = getScheduleBadge(monthIdxMap[month], day);

                return (
                  <button key={day} className="day-btn" onClick={()=>confirmMove(day)}>
                    <span>{day}일 ({dLabel})</span>
                    <span style={{fontSize:12,color:badge.color}}>{badge.text}</span>
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