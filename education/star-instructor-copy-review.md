# A07 Star Instructor Copy & Lesson Flow Review · Round 01
**Usage** Paste into A06's original lesson, then A05 scene and A02 app copies from the same approved story SHA. Keep three layers: (1) very short **before prediction**, (2) **after learner observes**, (3) expandable '왜?' senior explanation. The `pre-prediction` title, hint, Voice and accessible text **must not give away the answer**. This is actionable editorial copy, **not** a direct mutation of A06 source.

## M01 MOSFET → NOT (4 scenes)
### M01-S01 `mosfet-field`
- **Pre title/UI:** `보이지 않는 손으로 전기 스위치를 조작해 볼까요?` / `게이트 전압 0·0.6·1.2V 중 어디서 표면이 가장 크게 달라질지 먼저 골라 보세요.`
- **Pre Voice:** `스위치를 손으로 누르지 않고 켤 방법이 있을까요? 먼저 숫자 하나를 고르고, 게이트 전압을 움직여 보세요.`
- **After observation:** `게이트의 전기장은 절연막을 통과하지만, 전자가 막을 뚫고 건너가는 건 아니에요. 표면 바로 아래의 전하 분포가 달라져요.`
- **Why/condition:** `p형 실리콘, 산화막, 반전층`은 B00-C 복습 링크. `Vth=0.7V` 장채널 toy; 문턱은 실제 소자마다 달라지고 아래에서도 `VDS>0`이면 미세한 전류 가능. 전자 통과 그림 금지.
- **Teach-back:** `전자들이 모인 위치는 산화막 안일까요, 실리콘 표면일까요?`

### M01-S02 `mosfet-current`
- **Problem in current title / Voice:** `길은 열렸는데, 전류가 왜 0일까요?` and `채널이 있는데도 전류가 0이에요` **pre-answer**.
- **Pre title/UI:** `전류가 흐르려면 무엇이 하나 더 필요할까요?` / `같은 채널에서 VDS 0V와 1V를 비교해 보세요. 어느 쪽 전류계가 움직일까요?`
- **Pre Voice:** `길이 있다는 사실만으로 전류가 흐를까요? 양쪽 전압을 같게 해 보고, 차이도 줘 보세요.`
- **After:** `길을 만드는 게 VGS라면, 그 길을 따라 순 전류가 흐르게 하는 조건은 VDS예요. 포화는 ‘전류 0’이 아니에요.`
- **Why/condition:** 전자 이동 소스→드레인과 관습전류 드레인→소스 구별(본 실험의 양의 VDS), 포화 곡선은 정해진 장채널 toy.
- **Teach-back:** `VGS만 올리고 VDS를 0으로 두면 왜 순 전류계가 0일까요?`

### M01-S03 `nmos-resistor-inverter`
- **Problem:** `nMOS가 ON인데 출력은 왜 LOW일까요?` **reveals prediction** in headline, likewise A02 prompt `0.45V(LOW)` before action.
- **Pre title/UI:** `스위치가 켜지면 출력은 HIGH일까요, LOW일까요?` / `위에는 저항, 아래에는 nMOS가 있어요. 입력을 5V로 바꾸기 전에 출력을 예상해 보세요.`
- **Pre Voice:** `입력 선과 출력 선이 꼭 같은 전압이어야 할까요? 출력선이 어디로 연결되는지 따라가 볼까요?`
- **After:** `이번 회로에서는 아래 스위치가 켜지면 출력이 접지 쪽으로 내려가요. 계산상 약 0.45V이므로 이 예에서는 LOW로 읽습니다.`
- **Why/condition:** `Vout≈5×0.98/(10+0.98)=0.446V` with 10kΩ+toy 0.98kΩ; 실제 수신 회로의 VIH/VIL 조건까지 자동 보장하지 않음. 저항형과 CMOS의 별개 토폴로지.
- **Teach-back:** `전류를 내리는 스위치가 켜졌을 때 출력 전압은 어느 쪽 전원에 더 가까울까요?`

### M01-S04 `cmos-not-gate`
- **Pre title/UI:** `저항을 다른 트랜지스터로 바꾸면?` / `위에는 pMOS, 아래에는 nMOS. 입력 0과 1에서 누가 켜질지 먼저 골라 보세요.`
- **Pre Voice:** `방금은 저항이 출력선을 위로 끌었어요. 이번엔 위에도 스위치를 달았습니다. 두 스위치가 어떻게 바뀔지 예상해 보세요.`
- **After:** `입력이 0이면 위쪽 pMOS가, 1이면 아래쪽 nMOS가 주로 도통하죠. 그래서 출력은 반대로 나타나요.`
- **Why/condition:** 둘의 threshold/pMOS 종류를 짧게 선수복습; 안정 상태 이상 CMOS의 직접 관통 경로는 작지만 실제 누설/전환 전력 존재.
- **Teach-back:** `CMOS 인버터의 두 트랜지스터와 DRAM 1T1C는 같은 구조일까요?`

## D02 DRAM 1T1C (4 scenes)
### D02-S01 `dram-write`
- **Pre title/UI:** `전하를 넣고 문을 닫으면 어떻게 될까요?` / `BL에 1을 준비한 뒤 WL을 열어 보세요. 마지막에 BL을 0으로 바꾸면 어떻게 될지 먼저 예상해요.`
- **Pre Voice:** `비트라인은 데이터를 옮기는 길, 워드라인은 문을 여는 신호예요. 문을 닫으면 남아 있는 전하는 어떻게 될까요?`
- **After:** `문을 열 때 셀에 전하를 저장하고, 닫으면 외부 선에서 잠시 떨어져 있어요. '영원히'는 아니에요.`
- **Why/condition:** 1T1C capacitor is passive/volatile; 0/1 normalized voltage are ideal abstraction; don't say closed transistor 'perfect insulator'.
- **Teach-back:** `BL만 움직일 때 셀이 항상 함께 바뀌는 건 왜 아닐까요?`

### D02-S02 `dram-sense-restore` **MAJOR leakage**
- **Current issue:** `promptVoice` is dynamic outcome-bearing `senseVoice` **even before** `prediction`: the Voice says `0.55`, '올라가고' while the question asks the learner to predict that direction.
- **Pre title/UI:** `아주 작은 기억을 어떻게 읽을까요?` / `BL이 절반 전압으로 준비됐어요. 저장값 1을 연결하면 조금 올라갈까요, 내려갈까요?`
- **Pre Voice (use only until prediction):** `작은 커패시터가 큰 비트라인과 연결되면 무슨 일이 생길까요? 어느 쪽으로 움직일지 먼저 골라 보세요.`
- **After (bit1):** `1을 읽었더니 BL이 0.50에서 0.55×VDD로 살짝 올랐어요. 센스앰프가 이 작은 차이를 키우고, 연결된 셀도 함께 복원해요.`
- **After (bit0):** `0을 읽었더니 BL이 0.50에서 0.45×VDD로 살짝 내려갔어요. 센스앰프는 이 방향을 판별해 0으로 키우고 셀도 복원해요.`
- **Middle-frame UI:** `가상 중간 프레임: BL은 논리 전압을 향해 변하고, 셀 전하도 이미 복원 중이에요. 화면 값은 실제 시간 파형이 아니에요.`
- **Why/condition:** `Vshared=(Cc·Vcell+Cb·Vpre)/(Cc+Cb)`, `Cc:Cb=1:9`, `Vpre=0.5×VDD`, `Δ=±0.05×VDD`, **toy ratio**. '센스 구동'과 '셀 복원 완료' are teaching snapshots, not distinct physical commands. In a conceptual illustration explain differential reference/BLB or a reference line.
- **Teach-back:** `읽으면서 셀 전압도 바뀌었다면, 저장 상태를 지키려면 무엇을 해야 할까요?`
- **Implementation rule:** before prediction, neither Voice nor detail accordion nor aria/status text can expose the selected bit's sign or value; after prediction, `cellBit=0/1` changes readout and audio together.

### D02-S03 `dram-leak-refresh`
- **Pre title/UI:** `읽지도 않았는데 기억이 변한다면?` / `가상 시간을 움직이기 전에 셀 전압이 그대로일지 예상해 보세요.`
- **Pre Voice:** `잠깐 적어 둔 기억도 시간이 지나면 흐릿해질까요? 시간을 직접 움직여서 살펴봐요.`
- **After:** `전하가 새면 1과 0을 구별할 여유가 줄어들어요. 데이터를 잃기 전에 주기적으로 다시 써야 해요.`
- **Why/condition:** only a `stored 1` linear leakage toy; simulated 0–2 is not ms, all-cell universal retention or 0-cell behavior.
- **Teach-back:** `전원이 켜져 있어도 DRAM이 새로고침이 필요한 까닭은?`

### D02-S04 `dram-row-bank`
- **Pre title/UI:** `두 요청, 꼭 한 줄로 기다려야 할까요?` / `A/B를 한 뱅크와 두 뱅크에 배치하면 내부 작업이 어떻게 바뀔지 예상하세요.`
- **Pre Voice:** `주방의 화구가 하나일 때와 둘일 때처럼 생각해 봐요. 그래도 서빙하는 길은 하나일 수 있겠죠?`
- **After:** `뱅크가 다르면 내부 준비를 겹칠 수 있어요. 하지만 외부로 데이터를 보내는 길이 무한히 늘어나는 건 아니에요.`
- **Why/condition:** `0–2` toy time slots each, excludes shared I/O, activation and refresh timing. Not unconditional 2× sustained BW.
- **Teach-back:** `같은 뱅크와 다른 뱅크의 차이, 공유 버스의 한계를 각각 말해 볼까요?`

## Assessment / audio gates for A05 and A02
1. **Before prediction**: neutral title, story lead, prompt, tooltip, screen-reader label and TTS. Hide answers, calculated outputs and detailed explanation, not merely SVG.
2. **After prediction**: let learner change parameter and observe explicit numerical/visual state; don't award credit for clicking alone.
3. **After observation**: reveal quantified scientific model, condition-specific misconceptions and sequential 3-step hints; after teach-back expose why/next hook.
4. Apply **same approved A06 story SHA** to A05 standalone and A02 integrated app; build tests that read rendered DOM and actual speech-request text. Never claim browser QA completed based on these proposed copies.
