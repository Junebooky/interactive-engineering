# Deep dive 11 · 도핑·PN 접합·다이오드 → MOSFET 선행 지식 (Senior verified)
CheckedAt: 2026-10-17 KST. **FACT CHECKED** qualitative claims crosschecked OpenStax University Physics 3 section 9.6–9.7 and MIT OCW 3.024 Lecture 18 (2013, diagrams pp. 4–7); exact numerical values below are **TOY MODEL**; real chip / junction / SKU data **NEEDS VERIFICATION**.

## Why this lesson now?
기존 01의 nMOS VGS/VDS 장면에서 '왜 Si가 원래 금속이 아니고 왜 실리콘 표면만 전하가 달라지는지' 모르는 초보자가 1T1C/FinFET/SiC까지 넘어갔다. 원인 질문을 **밴드→도핑→PN drift/diffusion→내장 전계→bias와 diode→절연막 너머 MOS field control**로 순환 없이 연결해야 한다. 신규 11은 번호 01보다 앞에 수강시킨다. 개념 선수 B01/B02/B07을 12 입문 10분 구간에서 제공하되 12 완성 전엔 11의 첫 화면에 마이크로 보충 카드 추가.

## 1. Semiconductor는 비어 있는 전자 거리가 아니다
- 결정의 전자 에너지 밴드와 bandgap. 상온 Si 밴드갭 대략 ~1.1eV (온도 의존); 도체처럼 전자가 무제한 움직이거나 완벽한 절연체 아님.
- donor 도핑된 n형의 다수 캐리어는 **전자**, acceptor 도핑된 p형의 다수 캐리어는 **정공**. 전자/정공 외 다른 소수 캐리어도 존재; 전하 중성인 재료 bulk를 “n쪽 전체는 음전하/p쪽 전체는 양전하”라고 그리지 않는다. 고정 이온 전하가 노출되는 지점은 접합 공간전하/공핍영역.
- 정공은 전자가 채우지 않은 상태의 이동을 **양의 유효 전하**로 표현한 준입자 개념(양전하를 띤 전자라는 뜻 아님). 전자·정공의 drift/diffusion을 실제 이동과 전류 부호로 분리.

## 2. P+N junction은 편향 없는 전원장치가 아니다
- 접합 직후 n-side 전자 diffusion n→p; p-side hole diffusion p→n; 재결합으로 n-side에는 양의 donor ion, p-side에는 음의 acceptor ion이 상대적으로 남고 **내장 E field는 n→p**. E가 만드는 drift와 농도기울기 diffusion이 정상상태 균형을 이뤄 **외부 net DC I = 0** (microscopic carriers stationary가 아님).
- OpenStax/MIT에 나오는 built-in potential Vbi는 equilibrium band bending으로 **외부 개방 전압계가 전지처럼 측정하는 0.714V 출력이 아님**. 금속 접촉과 electrochemical equilibrium/계면 장벽을 포함하면 이상 대칭 회로에서 유용한 순 DC 일은 못 한다.
- 공핍층 = **다수 이동 캐리어 농도 감소 근사**, literal 완전 empty region 아님. T, 전압, NA/ND 영향이 있다.
- Forward bias p+ n−: barrier Vbi−VA, W decreases; reverse bias p− n+: barrier increases and W increases. Ideal reverse I≈−Is but 실제 소자에는 생성/누설, breakdown at sufficient reverse bias. “다이오드 0.7V 아래 무조건 완전 0, 위는 무저항” 오개념 금지.

## 3. SI units and numeric validation
**Toy parameters:** Si abrupt, one-dimensional, non-degenerate, uniform doping, 300K equilibrium, low-level injection, no high-field, `NA=ND=1×10^16 cm^-3`, `ni=1×10^10 cm^-3` (rounded illustrative intrinsic concentration), `εSi=11.7×8.8541878128×10^-14 F/cm`, `q=1.602176634×10^-19 C`, `kB=1.380649×10^-23 J/K`. Rounding values are model inputs, **not any commercial wafer measurement**.
- `VT=kBT/q=0.025852 V`. `Vbi=VT ln(NA ND / ni²)=0.714317 V`. Dopant product and ni² both cm^-6 → ln() dimensionless; built-in voltage *not* diode turn-on guarantee.
- `W(VA)=√[(2 εSi/q)(1/NA+1/ND)(Vbi−VA)]` cm, only `VA<Vbi` and depletion approximation. forward `VA=+0.2V`: W≈0.364718µm; equilibrium 0V W≈0.429821µm; reverse `VA=−1V`: W≈0.665867µm. 1 cm =10,000µm. **Units:** ε F/cm / q C×(cm³)× V = cm², sqrt→cm. Symmetric NA=ND => xp=xn=W/2. Positive applied p-to-n terminal voltage sign explicit.
- **Unequal doping:** `NA*xp=ND*xn` from depletion charge neutrality, so lightly doped side has *larger* depletion penetration. Doubling dopant density **does not** universally halve W because Vbi also changes logarithmically; concentration profiles/temperature matter.
- Ideal diode toy with `Is=1pA`, `n=2` (empirical ideality choice), `I=Is (exp(VA/(nVT))-1)`. At 0V I=0; +0.3V I≈0.330nA, +0.4V I≈2.289nA; −1V ≈−1pA. At high current series resistance and self-heating break exponential; near reverse breakdown/low T it fails. **Important:** Shockley n=1 is standard ideal diffusion model, n=2 here is explicitly a didactic illustration of nonideality, not fitted to a particular device.

## 4. A senior's failure / measurement tests
- Reverse leakage versus temperature/reverse bias, current floor/noise, bias instrument compliance, ESD and breakdown, avalanche/tunneling and parasitic capacitance. Measure IV with signed polarity and log(|I|) with separate sign tag (log(negative current) undefined).
- C-V depletion width and 1/C² vs V profiling measure doping under junction assumptions; high dopant gradients, abrupt approximation violation, contacts and traps change measurement.
- E field/wider W vs minority carrier injection: **larger depletion width does not alone determine all diode forward/reverse current**; injection/diffusion, generation-recombination, contact resistance matter.
- A standalone PN junction does not form MOSFET's inversion channel; MOS gate electrical-field control occurs across oxide without intended DC gate current. MOSFET contains p/n junctions at source/drain with substrate, but its channel operation and diode are not interchangeable.
- LED/photodiodes/solar cells are *different uses* of carrier generation/recombination and optical absorption; PN electron-hole toy arrow alone cannot predict luminous efficiency. Power SiC/GaN often use different junction/device structures and high-field/trap constraints.

## 5. Lesson 11 source triangulation / source ledger
| ref | publisher/url | role & checkedAt | confident scope | boundaries |
|---|---|---|---|---|
| PN-A | MIT OpenCourseWare lecture 18, 2013 https://ocw.mit.edu/courses/3-024-electronic-optical-and-magnetic-properties-of-materials-spring-2013/833afa926e598523708318bdf7d6a4ed_MIT3_024S13_2012lec18.pdf | 2026-10-17, academic slides pp4,5,7 visually examined | high: neutrality, Vbi, depletion width, bias | 1D depletion approximation/temperature/toy values not silicon device specification |
| PN-B | OpenStax 9.7 https://openstax.org/books/university-physics-volume-3/pages/9-7-semiconductor-devices | 2026-10-17, open university textbook | high: p/n junction qualitative, drift/diffusion/diode | oversimplifies reverse leakage/turn-on, use MIT for formulas |
| PN-C | OpenStax 9.6 https://openstax.org/books/university-physics-volume-3/pages/9-6-semiconductors-and-doping | 2026-10-17, band/doping | high for donor/acceptor & holes | **Warning**: section's one statement incorrectly describes p-type majority as electrons; correct it using p=holes and independent PN lecture before teaching |
| PN-D | MIT OCW 6.012 2009 https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/resources/lec5/ | 2026-10-17, institute course summary | medium: corroborating course coverage | full lecture body not independently read this round |
| PN-E | Georgia Tech ECE3080 https://alan.ece.gatech.edu/ECE3080/Lectures/ECE3080-L-11a-P-N%20Junction%201.pdf | 2026-10-17, additional theoretical lecture | medium: Shockley form | body not fully page-verified, do not quote exact page |
Original MIT diagram is **not copied into authored visuals**, A05 must draw own explanatory view with scientific sign controls. Any unsourced exact Si material parameter besides explicitly toy rounded values → NEEDS VERIFICATION.

## 6. Explain and teach back
Dry: "접합 형성 시 확산에 의한 공간전하 영역이 형성되고 built-in potential이 나타난다."
Friendly: "n형과 p형을 붙이자마자 전자가 움직이더니, 어느 순간 흐름이 균형을 이루네요. 뭘 만든 걸까요? 직접 만나게 해봐요."
Test: 초보→평형에서 왜 I=0 말하기, 중급→0.43 vs 0.36/0.67µm 계산·그림, 시니어→Vbi를 배터리라고 쓰면 왜 틀리는지/정확한 C–V 또는 I–V 실험법 설명.
NEXT: **12 회로 기초** 제작과 **14 MOS capacitor** 연구 순서; 기존 M01 연결해 'nMOS 절연막 넘어 전계, PN diode와 다른 제어' 대비.
