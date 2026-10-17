# A06 active research Question Bank · round 03 · 2026-10-17
Issue #6 / PR #7 · method: student WHY (>=5) + senior failure/measurement (>=5) → search → model → counterexample → easy rewrite → A05 handoff. Next round resumes from unchecked items; **no automatic background execution**.

## 입문자 10개 — '왜? 그럼? 직접!'
| Priority | 질문 | 답을 찾는 조작 | 다음 개념 |
|---|---|---|---|
| P0 | 1. DRAM을 읽기만 하는데 왜 전하가 변하죠? | BL precharge 0.5, Ccell:CBL 1:9, sense+restore | D02 심화·row buffer |
| P0 | 2. 서버 램을 많이 꽂으면 무조건 빨라져요? | 64bit×6400MT/s vs tRCD/tCL | DDR5·RDIMM·MRDIMM |
| P0 | 3. 휴대폰용이라던 LPDDR이 AI 서버에 왜 있어요? | HBM weight 6 슬롯/LPDDR KV 32 슬롯 배치 | SOCAMM2, HBM offloading |
| P0 | 4. CXL이면 멀리 있는 램도 HBM처럼 쓸 수 있나요? | hot/cold data local/remote 11 vs25 toy | NUMA·CXL 4.0 |
| P0 | 5. 서버 두 대가 자료를 주고받을 때 CPU가 다 복사해야 해요? | NIC DMA vs host copies | RDMA/GPUDirect |
| P0 | 6. 링크를 100Gb/s로 바꾸면 파일 1GB가 0.08초에 끝나나요? | serialization 0.08s + queue switch | Ethernet·optics |
| P0 | 7. 네 개 GPU가 다 계산하면 네트워크는 한 번만 쓰나요? | ring AllReduce t≥0.09375s toy | NCCL & GPU scale-out |
| P0 | 8. 저장 완료라고 했는데 정전 뒤 데이터가 사라질 수도 있어요? | ACK vs NAND commit + PLP toy | NVMe·eSSD persistence |
| P0 | 9. 평균 2ms인 SSD인데 왜 체감은 느린가요? | 95×1ms +5×20ms → avg1.95/p99=20 | QoS·tail latency |
| P0 | 10. GPU가 바쁠 때와 안 바쁠 때, 어떤 속도를 올려야 하나요? | 4TFLOP/s, 100GB/s roofline | memory-bound / compute-bound |
| P1 | 11. 냉각이 좋아지면 GPU도 자동으로 더 빨라지나요? | facility IT=1MW/PUE 1.4→1.2 | 전력·PUE·work/J |
| P1 | 12. GPU를 두 대로 늘렸는데 스위치 하나가 고장나면? | fail-over routes/redun switch | 시스템 가용성·SLA |

## 시니어 엔지니어 10개 — 반드시 반례와 측정 기준
| Priority | 질문 | 검증/반례·측정 | 현재 불확실성 |
|---|---|---|---|
| P0 | 1. `tRCD`와 cell full restore가 동시 완료되는가? | ACT→sense/row buffer vs tRAS/PRE, offset, PVT | 실제 JEDEC 세부 타이밍 미열람 |
| P0 | 2. DDR5 on-die ECC와 시스템/채널 ECC 고장 영역은? | fault injection: die vs link vs DIMM connector, CPU RAS | 플랫폼 ECC coverage SKU |
| P0 | 3. MRDIMM rank MUX가 latency/thermal에 미치는 영향은? | supported CPU/BIOS/PCB/MRCD/MDB, benchmark setup | 개별 RDIMM/MRDIMM 차이 |
| P0 | 4. SOCAMM2 KV cache offload의 break-even은? | actual context, batch, P99 TTFT, size, interconnect, watts/GB | Micron 내부 시험의 일반화 위험 |
| P0 | 5. CXL 4.0 '128GT/s'가 app 성능으로 보장되는가? | link width×encoding×flit×contention vs remote memory access | CXL spec eval license/실제품 |
| P0 | 6. RoCE PFC/ECN 정책이 p99 tail에 도움이 되는/악화되는 조건은? | switch ECN/PFC counters, HoL, queue, drops | 토폴로지/스위치 FW별 차이 |
| P0 | 7. NCCL 2(N−1)/N lower bound는 어디서 깨지나? | ring/tree/NVLS algorithm, switch oversubscription, startup latency | 실제 GPU/버퍼/링크 속도 |
| P0 | 8. eSSD PLP의 'acknowledged write' 계약은? | NVMe flush/FUA, volatile cache/metadata, power cut test | 모델별 펌웨어/보증 |
| P0 | 9. 평균/99th/99.999th를 같은 QD와 WAF에서 보고 있는가? | hot/cold mixed, GC steady-state, ECC retry, temp | 수명 전체 telemetry |
| P0 | 10. peak roofline 대비 실제 AI kernel 효율이 낮은 이유는? | Nsight compute roofline, occupancy, cache, batching | SKU/kernel compile |
| P1 | 11. PUE 개선이 고객용 tokens/kWh를 개선하는가? | measured GPU utilization/TTFT/p99 and facility energy | 업무부하·시설 측정시간 |
| P1 | 12. 2서버 1스위치의 공통 고장에 multi-switch failover가 충분한가? | failure-injection, repair time, config/state, checkpoint consistency | SLO/RTO/RPO 미확정 |

## 초보자/시니어 동시 teach-back QA
1. **1분**: 학생이 용어 없이 '왜 문제가 생겼는지' 말한다.
2. **중급**: 모델 입력 1개 바꿔 단위 식/관찰을 예측한다.
3. **심화**: 조건을 바꾸면 틀리는 반례 1개, 대안 1개, 무엇을 측정할지 제시한다.
4. **근거**: 제조사 광고 문장·표준 원문·peer-reviewed 논문을 구분, checkedAt/version/confidence 표시.
5. **문체**: 길고 단정적인 교과서 문장은 질문→가설→조작→관찰→왜?→다음 질문으로 전환.
6. **안전**: 임의 숫자는 TOY, 실제 하드웨어 값은 공인 데이터시트에서만.

## 결과 / 다음
이 라운드 출처 [07](../deep-dives/07-memory-systems.md), [08](../deep-dives/08-network-fabric.md), [09](../deep-dives/09-ssd-reliability.md), [10](../deep-dives/10-ai-systems.md), [02](../deep-dives/02-dram-sense-timing.md).
새 이슈 후보: RowHammer/TRR, GAA/CFET, PCIe 7.0, CXL memory hotplug, HBM4, CPO/OIF interop, low precision NVFP4, DRAM PIM/CIM, SSD ZNS, DRAM RAS error telemetry. 출시·표준 사양은 재검색 뒤 강좌 진입; 임의 제품 수치 금지.
