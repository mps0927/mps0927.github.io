# 이재우
영문 이름: Jaewoo Lee
이메일: mps0927@gmail.com
GitHub: https://github.com/mps0927

## 소개
- 차량 보안에 관심있는 취준생입니다
- 최근 CTF, AI for Security, Security for AI에 관심이 생겨 공부하는 중입니다...

## 약력
- 단국대학교 소프트웨어학과 졸업.
- BoB 15기 보안컨설팅 트랙 참여.

## 프로젝트

### 차량용 UDS Fuzzer 개발
기간: 2025
소속: WhiteHat School 3기 · 팀 프로젝트
- 내용: Audi A5 실차 ECU의 UDS 진단 인터페이스를 테스트하는 퍼저 개발.
- 역할: UDS Fuzzer 개발 및 CAN 송수신 데이터 분석. CAN ID–ECU–차량 기능 매핑, DTC를 활용한 Fail Detection 단계 측정 아이디어 제시.
- 차별점: 테스트 전후 DTC 변화, Expected Response를 함께 확인하는 4단계 분류.
- 기술: CAN, ISO-TP, UDS, DTC.
- 도구: Python, python-can, can-isotp, TSmaster

#### 팀 결과
- ECU 내부 상태를 직접 계측하기 어려운 실차 환경에서 진단 응답과 DTC를 통한 이상 관찰. ECU별 UDS ID·지원 서비스 분석 및 테스트 입력 구성.
- 팀 실험: 약 3만 건의 테스트케이스 실행, 602건의 Fail 확인. Level 2·3 재현 실험에서 95% 이상의 재현율 기록.
- ISO/SAE 21434의 TARA를 활용한 차량 위협·위험도 분석.

### Steer-by-Wire 조향 피드백 검증
기간: 2026
소속: 모비우스 SW 부트캠프 · AUTOSAR Classic 팀 PBL
- 내용: AUTOSAR Classic 기반 조향 피드백·고속 통신 시나리오 구현·검증.
- 역할: 조향 피드백 메시지의 CRC 기반 통신 오류 검출 로직 구현.
- 기술: AUTOSAR Classic, C
- 도구·환경: 현대오토에버 mobilgene

### 임보디드 AI·Agent 공격 연구
기간: 2026
소속: BoB 15기 보안컨설팅 · 팀 프로젝트
상태: 진행 중
- 내용: Physical AI·AI Agent의 인식·계획·행동 과정에 대한 보안 연구.
- 역할: 새로운 공격 벡터·공격 방법론 탐색 및 실험 설계 중.
- 기술·방법: AI Agent 동작 흐름 분석, 공격 표면 분석 및 재현 실험 검토 중.

## CTF

### LISAthon (리사톤)
기간: 2025
소속: 순천향대학교 · 모빌리티 사이버보안 대회
결과: 본선

## 논문

### 실차 환경 UDS 퍼징을 위한 DTC 기반 다층적 Fail Detection 기법
기간: 2026.05
소속: 한국자동차공학회 2026 춘계학술대회 논문집 · 공동저자
- 실차 UDS 퍼징 결과의 이상 수준을 진단 응답·DTC 변화로 구분하는 Fail Detection 기법.
[한국자동차공학회](https://ksae.org/journal_list/search_index.php?mode=view&sid=59409)
[DBpia](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12895372)

## 학력

### 단국대학교
기간: 2020.03 — 2026.02
소속: SW융합대학 소프트웨어학과 · 공학사 · 졸업
학점: 3.96 / 4.5
- 운영체제보안, 정보보호이론, 모바일보안, 시큐어코딩 등 이수.

## 교육·부트캠프

### Best of the Best 15기
기간: 2026.07 — 현재
소속: 한국정보기술연구원(KITRI) · 보안컨설팅 트랙
상태: 교육 중
- 교육 내용: 개인정보 관리체계 진단, 침해 사고 대응, 웹 모의해킹, AI for Security
- 프로젝트: 임보디드 AI·Agent 시스템 필터 솔루션 개발
- 역할: 새로운 공격 벡터 탐색 및 공격문 제작

### 모비우스 SW 부트캠프 1기
기간: 2025.09 — 2026.03
소속: 현대모비스 · 멋쟁이사자처럼
- 교육 내용: C, Python, 운영체제, ISO/SAE21434, UNR.155등..
- 프로젝트: 현대오토에버 mobilgene을 활용한 Steer-by-Wire 조향 피드백·고속 통신 시나리오 PBL 참여.
- 역할: 조향 피드백 메시지의 CRC 기반 통신 오류 검출 로직 구현.

### IoT 보안인증 심화교육
기간: 2025.08.20 — 08.22
소속: 한국인터넷진흥원(KISA) · 한국정보보호교육센터(KISEC)
- 교육내용: IoT 보안인증 기준에 따른 보안시험·취약점 분석 학습.
- 도구: Binwalk(펌웨어 구조 확인 및 파일시스템 추출 실습.), Firmwalker(추출한 파일시스템의 설정 파일·보안 점검 항목 검색), Ghidra·IDA( 펌웨어 바이너리 정적 분석)

### WhiteHat School 3기
기간: 2025.03 — 2025.09
소속: 한국정보기술연구원(KITRI)
- r교육내용: 시스템·웹·모바일 보안 기초, CAN·ISO-TP·UDS 진단 통신 학습.
- 도구: Python, python-can, can-isotp
- 프로젝트·역할: Audi A5 대상 UDS Fuzzer 개발·CAN 데이터 분석. DTC 기반 Fail Detection 단계 측정 아이디어 제시.

## 활동·자격

### 단국대학교 보안·개발 동아리 Aegis
구분: 동아리
- 보안 TechTalk, Dreamhack 문제풀이 스터디·CTF, 코딩교육 봉사 활동.
- 활동기간: 2021.03 — 2022.02, 2024.03 — 2025.08.
- 봉사활동 담당 임원: 2024.09 — 2025.03.

### 네트워크관리사 2급
기간: 2021.12
소속: 한국정보통신자격협회
