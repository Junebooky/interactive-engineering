# Lesson24 시니어 팩트·반례 노트: ADC 샘플링/양자화 · MEMS 차동 정전용량 · 광전수신 · LED/레이저 링크
> A06 takeover R33 · 확인 2026-10-18 KST · **AUTHOR research synthesis; A07 independent physical/science/education source QA PENDING** · [#66](https://github.com/Junebooky/interactive-engineering/issues/66). Product spec, standard compliance, instrument verification or actual optical performance not certified. Core [learner source](../lessons/24-adc-mems-photodiode-led-laser.md).

## 왜 이 다섯 주제를 연결하나?
AI 데이터센터의 디지털 GPU에는 현실 세계를 만나기 위한 아날로그 센서, ADC/전력 모니터, 고속 광모듈 및 수신기가 존재한다. 교실 안에서는 실제 5-step 부품이 하나의 직렬 제품 보드에 실제 결합된다는 오해를 피해야 한다. ADC/MEMS는 센싱·제어 입문, 광다이오드/LED/laser는 수신·발신과 30의 CPO 개념 연결이며 **같은 제품 신호 경로를 전부 그대로 묘사한 것이 아니다**.

### 24-S01 · 시간 표본: 나이퀴스트와 혼동 주파수
- **공식 출처:** Analog Devices [Aliasing](https://www.analog.com/en/resources/glossary/aliasing.html) [R1], [anti-alias filter FAQ](https://www.analog.com/en/resources/faqs/FAQ_antialiasing_filter.html) [R2], [baseband vs bandpass note](https://www.analog.com/en/resources/technical-articles/2022/07/16/09/20/basics-of-bandlimited-sampling-and-aliasing.html) [R10].
- 이상적 제로위상 코사인 연속파 `x(t)=cos(2π f t)`, `t=n/fs`: `f=700`, `fs=1000`이면 `cos(2π·.7n)=cos(2π·.3n)`; 스펙트럼상 alias는 300Hz. `fs=2000`이면700Hz가 fs/2=1000Hz 아래. **1k samples/s ⇒ Nyquist zone DC~500Hz, 2k ⇒ DC~1kHz.**
- **검산:** 300Hz @1k→300Hz;700Hz@1k→300Hz;700Hz@2k→700Hz. f=fs/2 exactly phase-dependent degeneracy at Nyquist frequency, outside toy. Sensor sampling must satisfy desired baseband + prefilter suppressing unwanted above-Nyquist. Bandpass deliberate undersampling exists—sample rate alone no blanket impossibility.
- **반례/오개념:** sampled waveform ambiguity does not literally change input physics; no model for harmonic content, jitter/aperture, discrete spectrum finite observation window, filter roll-off or reconstruction. Higher fs alone does not cure analog input noise.

### 24-S02 · 진폭 표본: 코드 폭과 ENOB는 다르다
- **공식 출처:** ADI [ADC/DAC types and terms](https://www.analog.com/en/resources/technical-articles/types-of-adcs-and-dacs.html) [R3], [Effective Number of Bits Calculator Tutorial](https://www.analog.com/en/resources/design-notes/effective-number-of-bits-calculator-tutorial.html) [R4]. Quantization is finite amplitude resolution separate from sampling time.
- 균등 단극성 교사용 model `levels=2^N`, `q=Vref/2^N`. At Vref3.3: N8⇒256, q=12.890625mV; N12⇒4096, q=.8056640625mV. At Vref2.5: N8 q=9.765625mV;N12 q=.6103515625mV. Clamp/out-of-range, differential/offset coding and converter topology NOT_MODELED.
- **중요:** LSB bin size vs endpoint mapping. `maxCode=2^N−1`; ideal max code NOT full Vref analog endpoint. `q/2` quantization error idealized nearest-value model possible inside unsaturated range; actual ENOB from SINAD and bandwidth, distortion, INL/DNL, reference noise and jitter not inferred from N.
- **반례:** more bits can still have poorer real usable noise performance; Vref3.3 increases q compared with 2.5 at same N; sample rate and number of levels independent.

### 24-S03 · MEMS 정전용량 차동으로 가속도 읽기
- **공식 출처:** ST [AIS2120SX](https://www.st.com/en/mems-and-sensors/ais2120sx.html) [R5] describes proof mass displacement related to differential sensing capacitance, then motion→acceleration. Its per-SKU full scale and digital output spec not used as toy nominal.
- Toy symmetric sensor `Cleft=2pF+k*a`; `Cright=2pF−k*a`; difference `2*k*a`, `a:0|1|2 g`, `k:.02|.04pF/g`. **Independent** controls model sensor acceleration and readout sensitivity; 1g/.02⇒Cleft2.02/Cright1.98/Δ.04pF;2g/.02⇒2.04/1.96/Δ.08;2g/.04⇒2.08/1.92/Δ.16.
- **물리 범위:** this linear relation is a local calibration equation, not the capacitance law for arbitrary displacement; real structure `C≈εA/d`, springs/mass damping, resonance, thermal offset and non-linearity, gravity orientation, cross-axis, calibration required. Differential Δ.08pF may be either 2g*k.02 or1g*k.04. 'g' acceleration not grams mass; no vehicle product fitness claim.
- **반례:** MEMS can be piezoresistive or other physical sensor types. Accelerometer readings can include gravity by orientation; direct DC digital measurement requires electronics.

### 24-S04 · 빛 수신과 광전류: 파장별 응답도
- **공식 출처:** Hamamatsu [WITS guide](https://hub.hamamatsu.com/us/en/technical-notes/detector-selection/the-wits-guide-to-selecting-a-photodetector.html) [R6] explicitly defines responsivity in A/W as electrical photocurrent divided by incident optical W at wavelength; [Si products](https://www.hamamatsu.com/us/en/product/optical-sensors/photodiodes/si-photodiodes.html) [R7] show per-detector dark current/capacitance/speed/spectral sensitivity.
- Toy `Iphoto[A]=Popt[W]*R[A/W]`. Popt0.5|1mW;R .3|.6 A/W; `Iphoto[mA]=Popt[mW]*R[A/W]` (numeric direct). Cases .5×.3=.15mA;1×.3=.3mA;1×.6=.6mA. No actual device parameters, bias, selected wavelength or noise introduced; R independent axis illustrative of **different wavelength/device response**, not instantaneous knob one can change on silicon without hardware/wavelength changes.
- **반례:** responsivity depends on λ, photodiode capacitance/bandwidth, dark current, shot noise, TIA and front-end. This is not an analog-to-digital ready bit nor BER, neither 'photo-current' always photo-voltaic-only nor 'reverse bias necessary universally'. LED/laser reverse function concept is different physics.

### 24-S05 · 광원 원리 ≠ 전체 링크 보장
- **교육/산업 출처:** [Open University optical source & detectors](https://www.open.edu/openlearn/mod/oucontent/view.php?id=3435&section=2.1) [R8] distinguishes LED and laser light sources, coupling/spectral width; [Cisco fiber dB reference](https://www.cisco.com/c/en/us/support/docs/optical/synchronous-digital-hierarchy-sdh/29000-db-29000.html) [R9] defines power loss in dB = 10log10(Pin/Pout). `Pout=Pin·10^(−lossdB/10)`.
- Independent two toy inputs: **fiber-launched** optical power `launchPowerMw:1|2`, passive total `loss:3|6 dB`. Results1/3→.5011872336mW,1/6→.2511886432mW,2/3→1.0023744673mW,2/6→.5023772863mW. 3dB ~1/2 and6dB ~1/4; not linear 'subtract 3mW' or 3dB exactly factor2. This assumes no optical amplification and deliberately **does not** simulate coupling/polarization/dispersion/data modulation.
- **광원 메커니즘:** LED predominantly spontaneous recombination optical emission; laser diode stimulated emission with optical feedback, typically narrower spectrum/more directional. Saying laser inherently zero BER, any LED cannot communicate, or optical power guaranteed receiver sensitivity is false. The toy **launch** value is after coupling (not wallplug/electrical power), so no LED-vs-laser output penalty injected under the hood.
- **Safety:** no eye-safety class/power settings/DIY laser driver or physical beam exposure instructions; classroom purely 2.5D no actual light output. Laser compliance requires specialist expertise and equipment standards outside this manuscript.

## 시니어 질문 10개 / 사전 대응
1. **입력 외대역 필터 없이 왜 alias를 정확히 분리할 수 있나?** 못한다. 기저대역 가정과 필터가 필요하다.
2. **2×Nyquist만 맞추면 실제 ADC 복구?** 완전 band-limit/ideal sampler/phase requirements absent; transition margin needed.
3. **비트 폭이 12이면 12-bit 정확도?** 아닐 수 있다. SINAD/ENOB, offset, INL, noise separately.
4. **Full-scale code가 Vref endpoint?** toy bin width gives maxCode=4095 and endpoint limit model separate.
5. **MEMS 0.08pF는 단일 가속도인가?** k와 교정이 없으면 여러 조합이 같다.
6. **MEMS capacitance exactly linear?** 근접한 작동점 근사, actual 1/d nonlinear, damping.
7. **1mW×0.6 A/W = 0.6 A?** 단위를 엄격히 확인;0.0006 A =0.6mA.
8. **Responsivity 독립 손잡이를 현장에서 돌릴 수 있나?** 학습 비교용 device/wavelength parameter이며 보편적 physical knob 아님.
9. **3dB는 half exactly?** 10^(−.3)≈.5012, exact half ≈3.0103dB.
10. **도착 광파워만으로 BER/p99/laser eye safety 보장?** No. receiver sensitivity, modulation, wavelength, dispersion, optical/electrical noise, qualification all excluded.

## 수치 QA: 모델 변경 실측 아님
| Scene | 입력축1 | 입력축2 | 관측/확인 | 금지 주장 |
|---|---|---|---|---|
|24-S01|f300/700 Hz|fs1000/2000s⁻¹|700@1000 aliases 300Hz|원본 파형이 물리적으로 300Hz가 됨|
|24-S02|bits8/12|Vref2.5/3.3V|3.3/4096=.805664mV|12비트면12비트 실측 정확도|
|24-S03|accel0/1/2g|k.02/.04pF/g|2g/.04→Δ.16pF|교정 없이 실제센서 g 확정|
|24-S04|light.5/1mW|R.3/.6A/W|1×.6=.6mA|광출력이 그대로 수신 BER 0|
|24-S05|launched1/2mW|loss3/6dB|2/6≈.502377mW|레이저라 링크 보장|

## A07 독립 검수 요청 및 미해결
- [x] A06 research source link cross-check 7 public original sources families Analog Devices, ST, Hamamatsu, Open University, Cisco and maths hand recomputation. No source claims those toy numeric values were measured.
- [ ] A07 science reviewer must inspect immutable exact source **two blob SHA** (once published), first-correct/answer gating/5 neutral Korean Voices/15 m1–3 cause-specific feedback, actual 2-axis typed numerical test or report MAJOR to [#66](https://github.com/Junebooky/interactive-engineering/issues/66), A06 [#6](https://github.com/Junebooky/interactive-engineering/issues/6). Author does not self-certify.
- [ ] P2 production A05/engineering should make artifact check for keyboard, mobile320/375, Voice fallback + true aria semantics + desktop, with published tested HEAD, never use these source numbers as lab QA evidence; A02 app evidence separate. [ ] Owner physical device/actual audible Korean/Safari/laser safety and deployment approval HOLD.
- [ ] P2 future Lesson30 transceiver/optical connector/CPO production standards require fresh official standards and measured SKU-specific numbers; never infer a link speed or fiber length from this toy passive power budget.
