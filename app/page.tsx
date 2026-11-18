"use client";

import { useEffect, useState } from "react";
import {
  Activity, ArrowRight, AudioLines, BrainCircuit, Check, ChevronDown,
  CircleHelp, Eye, FileText, LockKeyhole, Menu, Mic, MicOff, ShieldCheck,
  Sparkles, Waves, X
} from "lucide-react";

type Tab = "visual" | "linguistic" | "fusion";
type SpeechRecognitionLike = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void;
};
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const faqs = [
  ["Apakah NEUROSCREEN AI mendiagnosis depresi?", "Tidak. NEUROSCREEN AI merupakan konsep alat bantu skrining dan penelitian. Hasilnya tidak menggantikan evaluasi psikolog, psikiater, atau tenaga profesional yang kompeten."],
  ["Apakah suara dianalisis sebagai modalitas tersendiri?", "Tidak dalam rancangan ini. Suara digunakan melalui fitur voice-to-text. Hasil transkripsi diproses sebagai data linguistik, sehingga arsitektur tetap memiliki dua modalitas: visual dan teks."],
  ["Apakah prototipe ini sudah menggunakan model AI?", "Belum. Project ini adalah frontend interaktif. Model visual, model NLP, multimodal fusion, dan backend belum terhubung. Tidak ada prediksi kesehatan mental yang dihasilkan."],
  ["Apakah jawaban demo disimpan?", "Tidak. Teks demo hanya berada di browser selama halaman dibuka dan tidak dikirim ke server atau database."],
  ["Bagaimana data pengguna akan dilindungi pada versi produksi?", "Implementasi produksi harus memiliki persetujuan yang jelas, pembatasan akses, enkripsi, kebijakan retensi dan penghapusan data, serta persetujuan etik yang sesuai sebelum pengumpulan data penelitian."]
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("visual");
  const [demoOpen, setDemoOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"typed" | "voice">("typed");
  const [typed, setTyped] = useState("");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [speechMessage, setSpeechMessage] = useState("Belum ada transkripsi.");
  const [preview, setPreview] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const currentText = inputMode === "typed" ? typed : transcript;

  useEffect(() => {
    document.body.style.overflow = demoOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [demoOpen]);

  function startSpeech() {
    if (typeof window === "undefined") return;
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) {
      setSpeechMessage("Browser ini belum mendukung Web Speech API. Silakan ketik jawaban.");
      return;
    }
    const recognition = new Speech();
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const part = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += part + " ";
        else interimText += part;
      }
      if (finalText) setTranscript((old) => `${old} ${finalText}`.trim());
      setSpeechMessage(interimText ? `Mengenali: ${interimText}` : "Transkripsi diperbarui.");
    };
    recognition.onerror = (event: any) => {
      setSpeechMessage(`Transkripsi tidak dapat dilanjutkan (${event.error}). Coba ketik jawaban.`);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    try {
      recognition.start();
      setListening(true);
      setSpeechMessage("Mendengarkan… izinkan akses mikrofon jika diminta.");
      (window as any).__nsRecognition = recognition;
    } catch {
      setSpeechMessage("Tidak dapat memulai mikrofon. Periksa izin browser.");
      setListening(false);
    }
  }

  function stopSpeech() {
    try { (window as any).__nsRecognition?.stop(); } catch {}
    setListening(false);
  }

  function scrollTo(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <header className="topbar">
        <div className="nav-inner">
          <a className="brand" href="#home" aria-label="NEUROSCREEN AI home">
            <span className="brand-mark"><Activity size={21} /></span>
            <span>NEUROSCREEN <b>AI</b></span>
          </a>
          <nav className="desktop-nav">
            <a href="#about">Tentang</a><a href="#technology">Teknologi</a><a href="#workflow">Alur</a><a href="#faq">FAQ</a>
          </nav>
          <button className="button button-primary nav-cta" onClick={() => setDemoOpen(true)}>Coba demo <ArrowRight size={16} /></button>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Buka navigasi">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
        {mobileMenu && <div className="mobile-nav">
          {["about", "technology", "workflow", "faq"].map((id) => <button key={id} onClick={() => scrollTo(id)}>{({about:"Tentang",technology:"Teknologi",workflow:"Alur",faq:"FAQ"} as any)[id]}</button>)}
          <button onClick={() => {setMobileMenu(false);setDemoOpen(true);}}>Coba demo</button>
        </div>}
      </header>

      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> MULTIMODAL MENTAL HEALTH SCREENING CONCEPT</div>
          <h1>Memahami pola.<br /><em>Mendukung</em> kepedulian.</h1>
          <p className="hero-description">NEUROSCREEN AI adalah konsep platform skrining awal berbasis kecerdasan buatan yang mengeksplorasi pola perilaku visual dan ekspresi linguistik untuk mendukung kesadaran kesehatan mental mahasiswa.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => setDemoOpen(true)}>Jelajahi pengalaman <ArrowRight size={17} /></button>
            <button className="button button-outline" onClick={() => scrollTo("technology")}>Pelajari teknologi</button>
          </div>
          <div className="hero-points"><span><Check size={15}/> Dua modalitas</span><span><Check size={15}/> Explainable AI</span><span><Check size={15}/> Privacy-conscious</span></div>
        </div>

        <div className="hero-visual">
          <div className="visual-topline"><div><span className="tiny-label">NEUROSCREEN / SYSTEM</span><h3>Multimodal overview</h3></div><span className="concept-pill">CONCEPT PREVIEW</span></div>
          <div className="signal-grid">
            <div className="signal-card"><div className="signal-icon"><Eye size={24}/></div><span className="signal-kicker">MODALITY 01</span><h4>Visual signals</h4><p>Facial behavior &amp; head movement</p><div className="signal-line"><span style={{width:"72%"}}/></div></div>
            <div className="signal-card"><div className="signal-icon"><AudioLines size={24}/></div><span className="signal-kicker">MODALITY 02</span><h4>Linguistic signals</h4><p>Written or transcribed responses</p><div className="signal-line"><span style={{width:"86%"}}/></div></div>
          </div>
          <div className="fusion-card"><div className="fusion-heading"><span>PROCESSING ARCHITECTURE</span><span>01 — 03</span></div><div className="fusion-flow"><span>Visual encoder</span><b>+</b><span>Text encoder</span><b>→</b><strong>Fusion</strong></div><p>Representasi dari dua modalitas digabungkan untuk eksplorasi pola secara komplementer.</p></div>
          <div className="visual-foot"><span className="status-dot"/> Research prototype <span className="foot-divider">·</span> Not a diagnostic tool</div>
          <div className="orb orb-one"/><div className="orb orb-two"/>
        </div>
      </section>

      <section className="trust-strip"><div><strong>01</strong><span>Visual modality</span></div><div><strong>02</strong><span>Linguistic modality</span></div><div><strong>XAI</strong><span>Explainable AI</span></div></section>

      <section className="content-section section-shell" id="about">
        <div className="section-heading centered"><span className="eyebrow">WHY NEUROSCREEN?</span><h2>Skrining yang lebih kontekstual</h2><p>Pengalaman emosional tidak selalu mudah diungkapkan melalui satu jenis sinyal. NEUROSCREEN mengeksplorasi pendekatan multimodal untuk memahami pola ekspresi dan bahasa secara lebih menyeluruh.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><div className="feature-icon mint"><Eye/></div><h3>Perspektif visual</h3><p>Mengeksplorasi fitur perilaku wajah dan gerakan kepala dalam konteks sesi skrining.</p></article>
          <article className="feature-card"><div className="feature-icon blue"><FileText/></div><h3>Konteks linguistik</h3><p>Mengolah jawaban tertulis atau hasil transkripsi suara sebagai representasi bahasa.</p></article>
          <article className="feature-card"><div className="feature-icon violet"><BrainCircuit/></div><h3>Interpretabilitas</h3><p>Mengupayakan penjelasan fitur yang berkontribusi pada keluaran model.</p></article>
        </div>
      </section>

      <section className="technology-section" id="technology">
        <div className="section-shell">
          <div className="section-heading"><span className="eyebrow">TECHNOLOGY</span><h2>Dua modalitas. Satu pendekatan.</h2><p>Pilih salah satu cabang untuk melihat gambaran teknologi yang direncanakan.</p></div>
          <div className="technology-layout">
            <div className="tab-list" role="tablist" aria-label="Modalitas teknologi">
              <button className={tab==="visual"?"tab active":"tab"} onClick={()=>setTab("visual")}><span>01</span> Visual <ArrowRight size={16}/></button>
              <button className={tab==="linguistic"?"tab active":"tab"} onClick={()=>setTab("linguistic")}><span>02</span> Linguistik <ArrowRight size={16}/></button>
              <button className={tab==="fusion"?"tab active":"tab"} onClick={()=>setTab("fusion")}><span>03</span> Fusion &amp; XAI <ArrowRight size={16}/></button>
            </div>
            <div className="technology-panel">
              {tab==="visual" && <><div className="tech-copy"><span className="eyebrow">VISUAL FEATURE EXTRACTION</span><h3>Membaca pola perilaku visual</h3><p>Cabang visual dirancang untuk mengekstraksi fitur seperti Facial Action Units, facial landmarks, dan head pose dari rekaman video. Representasi temporal dapat dipelajari menggunakan encoder sekuensial.</p><div className="tech-tags"><span>Facial Action Units</span><span>Landmarks</span><span>Head pose</span></div></div><div className="tech-illustration"><div className="face-frame"><Eye size={47}/><span className="scan-line"/></div><strong>Video → Feature extraction</strong><p>AUs · Landmarks · Head pose</p><div className="embedding-box">Temporal visual embedding</div></div></>}
              {tab==="linguistic" && <><div className="tech-copy"><span className="eyebrow">NATURAL LANGUAGE PROCESSING</span><h3>Memahami konteks jawaban</h3><p>Pengguna dapat mengetik jawaban atau mengucapkannya melalui voice-to-text. Hasil akhirnya berupa teks yang diproses oleh model bahasa, dengan IndoBERT sebagai kandidat jika data dan bahasa latihnya sesuai.</p><div className="tech-tags"><span>Typed text</span><span>Voice-to-text</span><span>IndoBERT candidate</span></div></div><div className="tech-illustration"><div className="chat-bubbles"><span>Bagaimana perasaanmu?</span><span className="reply">Saya ingin bercerita…</span></div><strong>Text / Voice-to-text</strong><p>Speech recognition → transcript</p><div className="embedding-box">Language embedding</div></div></>}
              {tab==="fusion" && <><div className="tech-copy"><span className="eyebrow">MULTIMODAL FUSION &amp; EXPLAINABILITY</span><h3>Menggabungkan dan menjelaskan</h3><p>Representasi visual dan linguistik dari peserta dan sesi yang sama dapat digabungkan. Interpretasi mengeksplorasi kontribusi fitur masing-masing modalitas tanpa menyimpulkan diagnosis dari satu ekspresi atau kalimat.</p><div className="tech-tags"><span>Feature fusion</span><span>Model evaluation</span><span>XAI</span></div></div><div className="tech-illustration"><div className="fusion-circles"><span><Eye/></span><b>+</b><span><FileText/></span></div><strong>Multimodal fusion</strong><p>Visual embedding + text embedding</p><div className="embedding-box">Prediction · XAI interpretation</div></div></>}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section section-shell" id="workflow">
        <div className="section-heading centered"><span className="eyebrow">HOW IT WORKS</span><h2>Alur pengalaman pengguna</h2><p>Gambaran alur yang direncanakan untuk platform skrining.</p></div>
        <div className="workflow-grid">
          {[
            [<LockKeyhole key="a"/>, "STEP 01", "Persetujuan", "Pengguna memahami tujuan, batasan, dan kebijakan privasi."],
            [<Waves key="b"/>, "STEP 02", "Pengumpulan data", "Sesi visual dan jawaban linguistik dikumpulkan dengan persetujuan."],
            [<BrainCircuit key="c"/>, "STEP 03", "Analisis AI", "Model memproses fitur dan mengeksplorasi kontribusi kedua modalitas."],
            [<FileText key="d"/>, "STEP 04", "Hasil skrining", "Informasi skrining disajikan beserta batasan dan arahan bantuan."]
          ].map(([icon,step,title,desc],i)=><article className="workflow-card" key={i}><span className="step-label">{step}</span><div className="workflow-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></article>)}
        </div>
      </section>

      <section className="demo-banner"><div className="section-shell demo-banner-inner"><div><span className="eyebrow">TRY THE INTERFACE CONCEPT</span><h2>Kenali alur input linguistik</h2><p>Coba antarmuka demonstrasi untuk mengetik atau mentranskripsikan jawaban suara. Ini hanya simulasi pengalaman input, bukan pemeriksaan kesehatan mental.</p></div><button className="button button-light" onClick={()=>setDemoOpen(true)}>Buka demo input <ArrowRight size={17}/></button></div></section>

      <section className="content-section section-shell" id="responsibility">
        <div className="section-heading"><span className="eyebrow">PRIVACY &amp; RESPONSIBILITY</span><h2>Teknologi dengan tanggung jawab</h2></div>
        <div className="responsibility-grid">
          <article><div className="responsibility-icon"><ShieldCheck/></div><h3>Persetujuan pengguna</h3><p>Pengumpulan data harus didahului informasi yang jelas dan persetujuan yang diberikan secara sadar.</p></article>
          <article><div className="responsibility-icon"><LockKeyhole/></div><h3>Perlindungan data</h3><p>Data visual dan linguistik termasuk data sensitif. Sistem produksi membutuhkan pengamanan, pembatasan akses, dan kebijakan retensi.</p></article>
          <article><div className="responsibility-icon"><CircleHelp/></div><h3>Bukan diagnosis</h3><p>Keluaran AI tidak menggantikan evaluasi profesional. Hasil harus dipahami secara hati-hati.</p></article>
        </div>
      </section>

      <section className="faq-section" id="faq"><div className="section-shell faq-layout"><div><span className="eyebrow">FAQ</span><h2>Pertanyaan<br/>yang sering diajukan</h2><p>Informasi singkat mengenai tujuan dan batasan prototipe.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><div className="faq-item" key={q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}>{q}<ChevronDown className={openFaq===i?"rotated":""} size={19}/></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>

      <footer className="footer"><div className="section-shell footer-inner"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Activity size={20}/></span><span>NEUROSCREEN <b>AI</b></span></a><p>Multimodal AI · Research prototype</p><span>© 2026 NEUROSCREEN AI. A screening concept, not a diagnostic service.</span></div></footer>

      {demoOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setDemoOpen(false);}}><section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
        <div className="modal-header"><div><span className="eyebrow">INTERACTIVE PROTOTYPE</span><h2 id="demo-title">Demo input linguistik</h2></div><button className="icon-button" onClick={()=>setDemoOpen(false)} aria-label="Tutup demo"><X/></button></div>
        <div className="notice"><ShieldCheck size={18}/><span>Simulasi antarmuka. Tidak ada hasil analisis depresi atau prediksi AI yang dihasilkan. Jawaban tidak dikirim ke server.</span></div>
        <div className="input-tabs"><button className={inputMode==="typed"?"selected":""} onClick={()=>{setInputMode("typed");setPreview(false);}}>Tulis jawaban</button><button className={inputMode==="voice"?"selected":""} onClick={()=>{setInputMode("voice");setPreview(false);}}>Voice-to-text</button></div>
        {inputMode==="typed" ? <div className="input-area"><label htmlFor="typed-answer">Contoh pertanyaan reflektif</label><p>Bagaimana pengalamanmu menjalani aktivitas perkuliahan belakangan ini?</p><textarea id="typed-answer" value={typed} onChange={e=>{setTyped(e.target.value);setPreview(false);}} placeholder="Tuliskan jawabanmu di sini…" rows={5}/></div> :
        <div className="input-area"><label>Voice-to-text Bahasa Indonesia</label><p>Tekan tombol untuk memulai transkripsi suara melalui fitur browser, jika didukung dan diizinkan.</p><button className={listening?"button button-stop":"button button-primary"} onClick={listening?stopSpeech:startSpeech}>{listening?<><MicOff size={17}/> Hentikan transkripsi</>:<><Mic size={17}/> Mulai transkripsi</>}</button><div className="speech-status"><span className={listening?"status-dot pulse":""}/>{speechMessage}</div><textarea value={transcript} onChange={e=>{setTranscript(e.target.value);setPreview(false);}} placeholder="Hasil transkripsi akan muncul di sini…" rows={4}/><small>Fitur pengenalan suara bergantung pada dukungan browser dan koneksi internet. Periksa kebijakan browser sebelum menggunakannya untuk data sensitif.</small></div>}
        <div className="modal-bottom"><span>{currentText.length} karakter</span><button className="button button-primary" onClick={()=>setPreview(true)}>Lihat preview input <ArrowRight size={16}/></button></div>
        {preview&&<div className="preview-box"><strong>Preview teks (lokal)</strong><p>{currentText.trim()||"Belum ada teks untuk ditampilkan."}</p><small>Teks hanya ditampilkan pada demo ini, tidak dikirim ke model.</small></div>}
      </section></div>}
    </main>
  );
}
