# A06 senior deep dive 10 — roofline, KV residency, PUE, data-center resilience
CheckedAt: 2026-10-17 · research triangulation: NVIDIA hardware-friendly model post Jul 2026, Micron LPDDR/SOCAMM2, Uptime Institute PUE, NVIDIA GPUDirect, NVM Express.

## System first — two workloads with different timelines
**Inference:** incoming query NIC → CPU scheduling/preprocessing → model already resident in GPU HBM/GDDR (or cold load eSSD/DDR/etc) → prefill → autoregressive decode→KV grows, may be cached/offloaded depending on architecture → NIC response. User-visible TTFT, inter-token gap, throughput, p95/p99 and energy/request must be tracked separately.
**Training:** data pipeline/ETL → GPU/accelerator compute → activation/gradient exchange via NIC/scale-up → optimizer update → periodic checkpoint to eSSD/remote storage. This path may stress SSD write endurance and collective network differently from inference.
**Not all systems** use the same CPU/GPU HBM/eSSD/network stack. Integrated memory, remote pool, direct GPU storage options and multi-node topology change the shape.

## Roofline quantitative verification
- Operational intensity I=FLOPs / bytes moved from modeled memory level. P≤min(Ppeak, I×BW). peak=4TFLOP/s, BW=100GB/s => ridge 40 FLOP/B; at I=10 =>1TFLOP/s, I=80 =>4 TFLOP/s. BW=200GB/s =>ridge20 FLOP/B. Data movement through L1/L2/HBM/PCIe/SSD are **different roofs**, cannot freely swap numbers.
- Actual kernels could fall below roof due to launch overhead, inadequate parallelism, instruction mix, bank conflicts, occupancy/synchronization; roofline **upper bound** ≠ app latency.
- batch↑ may increase arithmetic intensity and throughput but may hurt per-request latency and memory footprint, depends on scheduler.

## KV cache and memory
- For generic decoder transformer with keys/values per token, rough size = 2×layers×kvHeads×headDim×tokens×batch×bytesPerElement. For GQA/MQA kvHeads≠QHeads; quantization/padding/block fragmentation affect actual. This is a rough capacity relation, **not a universal hardware footprint**.
- KV offloading LPDDR/SOCAMM2 or host DDR/CXL can expand capacity but increases movement; model weights already resident often do not reload from eSSD every output token. Micron vendor SOCAMM2 TTFT improvement claims have specific test configuration and are not general truth.

## PUE and carbon/energy
- PUE convention is **annual/measurement-period energy** facility/IT, dimensionless. Toy PUE ratio of instantaneous power when same time period and steady operation: PIT 1MW, PUE1.4→Pfacility1.4MW overhead0.4MW; PUE1.2→1.2MW overhead0.2MW. Reduction in overhead **does not directly change IT processing speed or chip FLOP/W**.
- Workload efficiency requires requests/kWh, goodput, tail latency, accelerator utilization, water use and energy source/carbon intensity in proper scope; operational CUE/WUE also different metrics. Uptime Institute stresses PUE cannot substitute utilization metrics.
- Rack/PSU/UPS/cooling/VRM losses/fault domains and duplicate power/cooling paths affect both energy and availability.

## Failure scenarios and observability
- Single shared top-of-rack switch causes 2 servers to lose remote reachability upon its failure; alternate paths/redundant ToR/failover are system design options, not free guarantee of uptime.
- SSD PLP handles local device-specific in-flight write scenarios, not model-serving network availability or globally consistent replicas/checkpoints.
- Observability: compare network p99, GPU utilization, memory BW, PCIe I/O, flash p99, power meter, IT/facility energy, cold-start ratio, TTFT/inter-token gap. Root cause depends on workload and window.

## Beginner conversion
① “GPU가 아무리 빨라도 왜 멈춰 있을까요?” ② data-rate/roofline slider + prefill/decode + PUE and failure toggles. ③ "한 요청의 TTFT/p99이 나빠졌는데 GPU는 바쁘지 않다. 어디를 먼저 측정하고 무엇을 바꿀까?"—counterexample and tradeoff answer.

## Sources
- [A1] https://developer.nvidia.com/blog/ai-model-co-design-hardware-friendly-llm-design/ (NVIDIA Jul 2026) high for roofline intro, vendor-specific best-practice context
- [A2] https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md (NCCL AllReduce) high
- [A3] https://www.micron.com/products/memory/lpddr-modules/socamm (Micron SOCAMM2 tests) medium for marketed speed, high for existence
- [A4] https://journal.uptimeinstitute.com/ask-the-expert-qa-follow-up-with-uptime-institute-cto-chris-brown/ (Uptime PUE distinction) high
- [A5] https://journal.uptimeinstitute.com/capacity-allocation-and-the-next-generation-of-ai-era-kpis/ (Uptime May 2026 PUE caveat) high
- [A6] https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/23.9.0/gpu-operator-rdma.html (GDS) high mechanism
- [A7] https://nvmexpress.org/specification/nvm-express-base-specification/ (NVMe 2.4) high standard version
**Unresolved:** site real PUE/WUE/carbon data; actual request GPU kernels, power/latency instrumentation, redundancy fault injection. Must not claim these toy effects as actual measured results.
