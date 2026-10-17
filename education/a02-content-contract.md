# A06 → A02 Lesson Engine Content Contract v0.1
검토일 2026-10-17 · A02 [PR #5](https://github.com/Junebooky/interactive-engineering/pull/5) HEAD: 766339b78d79026e755b770108f9e8524497ac72 · 타입 기준 src/types/index.ts. 앱 코드는 미수정.

## 현재 계약
Lesson = id, courseId, slug, title, subtitle, description, category, steps.
LessonStep = id, title, stepType, storyLead, prompt, detailExplanation?, whyExplanation?, simulatorType?, initialParams?, controls?, rules?, successMessage?, successVoice?, voice?, hints?.
StepType = INTRO/CONCEPT/PREDICT/MANIPULATE/CHECK/FEEDBACK/HELP/EXPLAIN/APPLY/COMPLETE.
SimulatorType = **현재는** mosfet/ohmsLaw/gears/inverter. DRAM·GPU·NAND 신규 scene은 아직 미지원.
ValidationRule = targetKey/operator(eq, gte, lte, between, near)/expected/tolerance?/feedbackIfFail/voiceIfFail?.
현재 빈 rules는 자동 통과될 수 있으므로 예측 전 자동 정답 표시 및 제출 없는 완료 처리에 유의.

## A06 field to A02 field
| A06 | PR #5 타입 | 통합시 검토 |
|---|---|---|
| learningGoal / priorKnowledge | Lesson.description / 상세 설명 | 사전 선수 상태 메타데이터는 현재 없음 |
| storyHook / question | storyLead / prompt | 짧은 displayText로 분리 |
| prediction | stepType=PREDICT 존재 | 예측 저장·제출/정답 비노출 계약 추가 필요 |
| learnerAction / modelInputs | controls / initialParams | A05 scene props와 상태 연동 |
| expectedObservation | Why/scene 시각 | 정답 제시 이전은 중립적 관찰 |
| correctIncorrectCriteria | rules[] | 수치 rule 외 인과/선택 판정과 연동 |
| misconceptions | feedbackIfFail | 오답 유형별 조건/복수 원인 분기 확장 |
| hints | hints[1..3] | 그대로 3단계 |
| explanation | detailExplanation/whyExplanation | 예상·조작 완료 후 공개 |
| nextHook | 다음 Step storyLead | 마지막은 다음 레슨 hook |
| displayText/speechText | title/prompt + voice.intro/explanation | 원고를 음성용으로 재문장화 |
| physicsAssumptions/sourceRefs | 타입 미존재 | 별도 메타데이터 확장 필요 |
| sceneId | simulatorType 네 종류만 | 신규 scene registry 또는 SceneSpec 필요 |

## 호환성/작업 분리
- 01의 첫 3 Scene은 기존 MOSFET/저항형 inverter 모델의 교육적 개정 스펙, 마지막 CMOS는 신규 씬. 02~04 모든 Scene은 A02 구현 전인 **교육 명세**.
- A02 PR #5 MOSFET Vth=0.7V는 toy, Vin=5V 저항부하 inverter의 Vout≈0.45V. nMOS ON=출력1 혹은 완전 단락 0V 식 문구 금지.
- A02는 content schema/엔진과 런타임 통합 책임, A05는 장면, A06은 레슨·원리·Voice 책임. 문서 인계가 바로 앱 적용을 의미하지 않음.
- 필요 변경: prediction state, 예측 후 검증, concept 자동패스 UX, sourceRefs/assumptions 표시, new simulator dispatch, 모바일 Voice 이벤트 문구. 최신 A02 head 변경 시 문서 재검증.
