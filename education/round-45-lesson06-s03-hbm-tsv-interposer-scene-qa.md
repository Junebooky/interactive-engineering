# A07 R45 · 2026-11-02 KST · Lesson06 S03 HBM TSV/interposer independent scene QA

**보고 대상 A06 · HANDOFF SENT · NEW P1 MAJOR_OPEN ×2 · no main merge/deploy.** This is source/code static review only, not a browser/device PASS.

## 1. Exact reviewed objects / scope
- A06 PR #7 HEAD `8ff859a03df86f421c1884b01787fc42d92a45e5`, canonical `education/lessons/06-hbm-chiplet-packaging.md` blob `7a40bec1c4ed23559916c64ad028f0fc640e7140`. Prior R11 **EDU_QA_PASS_SOURCE remains valid** for original manuscript; do not reopen resolved R8–R10 source blockers.
- A05 PR #56 HEAD `09870f4b4fcdc387151ec35d7afd82d81dd1f082`: `src/a05/package06/Package06SceneLab.tsx` blob `be54b9020ac3655f65b0433181c513508e415306`, `Package06SceneVisual.tsx` blob `6d5fd295d46e13285b7f05cb40beed08b2af4b1c`, `package06Model.ts` blob `7ee0b365d4dcd8052e4657e0c278286f3ff63833`. **A05 S03 changed-scene static review performed.** Prior R36 S01 answer leakage and S02/S04 numeric-grade P1s remain separate OPEN.
- A07 PR #14 pre-report HEAD `54725e7b980cac6fab1bd947cc04e400e2b19d75`; this report file is added afterward, so its new commit must not be mistaken for the reviewed A05/A06 code SHA.
- Primary manufacturer crosscheck (checked 2026-11-02): TSMC 3DFabric CoWoS official https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm — GPU/SoC and HBM are separate dies/stacks joined by high-density interconnect; CoWoS-S uses silicon interposer, CoWoS-R RDL interposer, CoWoS-L hybrid. This supports the manuscript's *qualitative* TSV-in-stack vs lateral package routing distinction. It does **not** validate an electrical link-up simulation or any product bandwidth. Actual HBM layer details, bump/TSV count, vendor-specific package performance unverified.

## 2. NEW P1 L06-R45-01 — scene's PRE text gives away S03 distinction
**Static reproduction:** `Package06SceneLab.tsx` renders `story.title`, `story.question`, `story.prediction` before the learner chooses prediction. For S03 these include `HBM의 TSV와 GPU 옆 인터포저`, `HBM 스택 내부 수직 연결과 옆 GPU 다이 사이 배선`, and `HBM 내부 TSV, GPU 옆 고밀도 인터포저 경로`. Those are the *two roles* that S03 `learningGoal` / `correctIncorrectCriteria` intend the learner to discover. `beforeVoice` is less explicit but asks about those already named paths. **SOURCE pre-answer disclosure in actual A05 scene code**, not an observed DOM/Voice execution. The A06 canonical pre-prediction prompt is more neutral, so do not relabel old source blocker OPEN.

**NEXT:A05, copy to use in title/question/prediction and `beforeVoice` / aria (before learner prediction):**
- PRE title: **“GPU와 여러 층의 메모리를 어떻게 연결할까요?”**
- PRE question: **“위아래로 쌓은 메모리와 옆에 놓인 GPU에는 같은 배선이 필요할까요?”**
- PRE prediction / Voice: **“메모리 층 사이와 GPU 옆 사이에 필요한 연결을 각각 골라 보세요. 먼저 예상하고 그림을 움직여 확인해요.”**
- AFTER observation only: **“HBM 안의 여러 DRAM 층은 TSV와 마이크로범프 등으로 수직 연결하고, 별도 GPU 다이와 HBM 스택은 인터포저·RDL 같은 고밀도 패키지 배선으로 이어질 수 있어요.”**
- Wrong same-die: **“GPU 계산 다이와 HBM 메모리는 보통 같은 실리콘 한 장이 아니에요. 서로 다른 다이의 위치를 다시 보세요.”**
- Wrong silicon-only: **“인터포저 역할을 하는 배선은 실리콘만 가능한 게 아니에요. RDL 방식도 비교해 보세요.”**
- Wrong UI=manufacturing: **“화면의 2.5D 그림과 실제 반도체 2.5D 패키징은 이름만 비슷해요. 실물 배선 구조를 살펴보세요.”**
- No expected TSV/interposer role or right answer in PRE DOM (including hidden answer markup), tooltips, aria-live, screen-reader labels, Voice queues, hints; AFTER gated by submitted prediction and actual observation.

## 3. NEW P1 L06-R45-02 — stale TSV evidence can PASS while current HBM stack is unconnected
**Exact static reproduction sequence at A05 HEAD:**
1. Select either S03 prediction, enabling controls.
2. Click `GDDR board PCB` → evidence `board`; `HBM DRAM stack` → `stack`; `TSV ON` → `tsv`.
3. Click `GPU+HBM interposer`. `topology(v)` calls `change({...state,topology:v,tsv:false}, ...)`, **turning TSV OFF**, while `seen` still includes historical `tsv`.
4. Click `실리콘 interposer` and `RDL interposer`, collecting `interposer-silicon` and `interposer-RDL`; choose correct WHY.
5. `gradePackage06('hbm-tsv-interposer', seen, 'tsv-internal-interposer-sideways')` checks only historical strings `['board','stack','interposer-silicon','interposer-RDL','tsv']` and WHY, **never checks current `state.tsv` or a complete physically valid observation snapshot**. It can return `passed:true` although final `state.topology='interposer',state.tsv=false`; `interconnect()` then reports `insideHbm='vertical-link-not-yet-enabled'`. The SVG still shows the GPU↔HBM lateral interposer line, which can be read as an operational complete path. **Actual runtime not executed; pure code path demonstrates grading inconsistency.**
6. Even changing topology again after valid proof leaves the old evidence until scene re-entry; `change()` resets feedback but does not invalidate dependent proof.

**NEXT:A05 code fix:** Separate `visitedCases` (historical comparisons) from **case-scoped validated physical evidence**. Require an immutable `observedCases[]` record with `{topology,tsv,interposerKind,studentPrediction,observedPath,validity}`, at least board and HBM stack and a complete `topology='interposer' && tsv===true` case, plus silicon/RDL comparisons; `gradePackage06` must consume these validated snapshots or a typed state, not only visited keys. On topology switch, explicitly mark `STACK_VERTICAL_PATH_INCOMPLETE` until the TSV toy path is enabled; do not render an active end-to-end GPU→all-HBM-layers link or award pass with `tsv=false`. Distinguish physical **toy** path, not actual link training; HBM package implementation variants exist.
- WRONG no-TSV: **“옆으로 가는 배선은 보이지만 메모리 층 사이 길은 아직 연결하지 않았어요. 스택 내부도 확인해 보세요.”**
- WRONG mixing roles: **“메모리 층을 위아래로 잇는 길과 GPU 옆으로 이어지는 길을 따로 확인해 보세요.”**
- FIRST-CORRECT: valid predicted + observed complete interposer+TSV toy case and two distinct physical comparisons + correct WHY must pass **without forced wrong**.
- Negative: visited `tsv` then switched topology resets current TSV false ⇒ **FAIL**; `interposer` only and no stack vertical path ⇒ **FAIL**; wrong WHY ⇒ **FAIL**. Validate actual SVG path state, status/aria, Voice, 320/375px, keyboard, reduced motion at the **new A05 HEAD**.

## 4. Evidence ledger — strict separation
- [x] A07 independent **source+scene static inspection** of the exact blobs above; manufacturer primary source crosscheck. **Qualitative physics/source distinctions PASS_SOURCE**, S03 **A05_SCENE_EDU_MAJOR_OPEN**.
- [x] External **A05 PR#56 HEAD `09870f4...` CI #39042498701 SUCCESS** metadata. Existing A05 standalone Chromium #39042355484 is prior owner-reported and **not an A07-run test**, nor a negative test for these new cases.
- [x] External **A02 PR#73 HEAD `9a11f0b9af4f2c6481c2a3f09a4e285b6da91bfb` CI #39141327025 / Chromium #39141327036 SUCCESS** for **other scope only**, not Lesson06 official app E2E.
- [ ] A07 direct Chromium / rendered DOM/aria/live-region/actual Voice audio / screenshot comparison **NOT RUN**.
- [ ] A05 corrected scene new HEAD + matching Chromium negative/positive test and CI **NOT PROVIDED**.
- [ ] A02 official Lesson06 real app E2E, progress/persistence and keyboard/Voice/aria at own tested SHA **NOT RUN/NOT VERIFIED**.
- [ ] Actual iPhone/Safari, ko-KR audible TTS, screen-reader/AT, novice learner, real HBM package/hardware test **NOT RUN**.
- [ ] Owner explicit approval for main merge/deploy **RELEASE_HOLD**.

## 5. Handoff / priority / unlock
- [ ] **P1 NEXT:A05** repair PRE copy and S03 evidence/path/grade, add own exact code SHA + negative/first-correct Chromium/CI/Voice/aria logs; directly report to A06/A07 and card #31.
- [ ] **P1 NEXT:A06** approve teaching wording/contract, amend canonical source only if its scene contract requires extra fields, return **new source blob** if changed; do not revoke prior original-source PASS for unrelated scopes.
- [ ] **P1 NEXT:A07** independently re-review exact corrected A05 SHA, match own code and CI evidence, award scene-source PASS only if both issues resolved.
- [ ] **P1 NEXT:A02** integrate exact corrected A05 scene into official app and execute own E2E; owner real device/student and explicit release authorization.
- **HANDOFF SENT → A06 Issue #6 / A06 manuscript PR #7 / A07 PR #14 / A05 technical PR #56 / shared board #21 / individual card #31.** No duplicate reopening of R36 P1s, no main merge/deploy.
