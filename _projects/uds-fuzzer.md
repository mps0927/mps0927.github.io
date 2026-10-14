---
title: 차량용 UDS Fuzzer 개발
order: 1
period: '2025'
organization: WhiteHat School 3기 · 팀 프로젝트
detail_title: 팀 결과
detail_body: |
  - ECU 내부 상태를 직접 계측하기 어려운 실차 환경에서 진단 응답과 DTC를 통한 이상 관찰. ECU별 UDS ID·지원 서비스 분석 및 테스트 입력 구성.
  - **팀 실험** 약 3만 건의 테스트케이스 실행, 602건의 Fail 확인. Level 2·3 재현 실험에서 95% 이상의 재현율 기록.
  - ISO/SAE 21434의 TARA를 활용한 차량 위협·위험도 분석.
---

- **내용** Audi A5 실차 ECU의 UDS 진단 인터페이스를 테스트하는 퍼저 개발.
- **역할** UDS Fuzzer 개발 및 CAN 송수신 데이터 분석. CAN ID–ECU–차량 기능 매핑, DTC를 활용한 Fail Detection 단계 측정 아이디어 제시.
- **차별점** 테스트 전후 DTC 변화, Expected Response를 함께 확인하는 4단계 분류.
- **기술** CAN, ISO-TP, UDS, DTC.
- **도구** Python, python-can, can-isotp, TSmaster
