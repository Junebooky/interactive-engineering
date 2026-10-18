import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {A05ConceptStructureVisual,A05_CONCEPT_META,A05_CONCEPT_VISUAL_IDS,type A05ConceptVisualId} from './A05ConceptStructureVisual';
import './preview.css';
function Preview(){
 const [selected,setSelected]=useState<A05ConceptVisualId>('circuit-intro');
 return <main className="a05-concept-preview" lang="ko">
  <header><div className="chip">A05 · A03 V3 · P0 구조 개념 실험실</div>
  <h1>공학 개념 구조를 먼저 살펴봐요</h1>
  <p>수치를 예측하기 전에는 원리의 배치만 보여줍니다. 결과값·정답·성능 수치는 이 그림에 없습니다.</p></header>
  <nav aria-label="공학 주제 선택" className="concept-topic-list">
   {A05_CONCEPT_VISUAL_IDS.map(id=><button type="button" key={id} aria-pressed={selected===id}
    onClick={()=>setSelected(id)}>{A05_CONCEPT_META[id].title}</button>)}
  </nav>
  <section className="concept-preview-body" aria-label="현재 선택한 구조 개념">
   <A05ConceptStructureVisual visualId={selected}/>
  </section>
  <footer>동일한 모형을 A02의 CONCEPT 단계에서 사용할 수 있도록 분리했습니다. 실험 상태와 학습 진도는 A02가 제어합니다.</footer>
 </main>;
}
const target=document.getElementById('root');if(target)createRoot(target).render(<Preview/>);
