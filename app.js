// ---- Seed verses (add the rest later up to 72) ----
const VERSES = [
 {id:1, verse_gr:"Πρῶτον μὲν θεοὺς ἀθανάτους, ὡς νόμος ἐστίν, τίμα·",
  verse_en:"First, honor the immortal gods, as the law ordains.",
  commentary:"Η τιμή δεν είναι φόβος· είναι τάξη. Η ψυχή μπαίνει σε ευθεία όταν αναγνωρίζει κάτι ανώτερο από την ορμή της.",
  practice:"Σήμερα, τίμησε με πράξη μία αρχή που εκτιμάς (αλήθεια, δικαιοσύνη, μέτρο)."},
 {id:2, verse_gr:"Τίμα καὶ τὸν ὅρκον·",
  verse_en:"Honor also your oath.",
  commentary:"Ο λόγος μας είναι μέτρο δυνάμεως. Ό,τι υπόσχεσαι σε διαμορφώνει.",
  practice:"Γράψε μία μικρή υπόσχεση για σήμερα και κράτησέ την συνειδητά."},
 {id:3, verse_gr:"Τίμα καὶ τοὺς ἥρωας καὶ τοὺς γονεῖς.",
  verse_en:"Honor heroes and your parents.",
  commentary:"Ευγνωμοσύνη στην αρχή που σε έφερε ως εδώ. Παίρνω το καλό, διακόπτω το άτοπο.",
  practice:"Στείλε ένα μήνυμα ευγνωμοσύνης σε έναν άνθρωπο που σε στήριξε."},
 {id:5, verse_gr:"Μετά δὲ τῶν ἄλλων πᾶσιν ἔρρωσο φίλοις.",
  verse_en:"Be steadfast with your friends.",
  commentary:"Φιλία = σταθερότητα. Μίλα ευθέως, βοήθα νηφάλια.",
  practice:"Κράτησε μία μικρή υπόσχεση σε φίλο σήμερα."},
 {id:8, verse_gr:"Μηδὲν ἄγαν.",
  verse_en:"Nothing in excess.",
  commentary:"Το μέτρο δεν σκοτώνει το πάθος—το εξαγνίζει.",
  practice:"Διάλεξε ένα σημείο υπερβολής και μείωσέ το κατά 20%."},
 {id:11, verse_gr:"Μη πρὶν τὸν ὕπνον… τρὶς ἕκαστα ἔργα ἡμέρας ἐπισκόπει·",
  verse_en:"Before sleep, examine thrice the deeds of the day.",
  commentary:"Τριπλή εξέταση: (1) Τί έπραξα καλά; (2) Πού ξέφυγα; (3) Τι θα διορθώσω αύριο;",
  practice:"Γράψε 1 καλό, 1 λάθος, 1 διόρθωση πριν τον ύπνο."},
 {id:14, verse_gr:"Μάθε σιγᾶν ὅταν δεῖ.",
  verse_en:"Learn to be silent when it is time.",
  commentary:"Η σιωπή είναι δύναμη. Σταμάτα μισή πρόταση νωρίτερα.",
  practice:"Άφησε 3'' σιωπή πριν απαντήσεις."},
 {id:24, verse_gr:"Μὴ φθόνει·",
  verse_en:"Do not envy.",
  commentary:"Ο φθόνος κοιτά έξω και χάνει τον δρόμο μέσα.",
  practice:"Μετέτρεψε ένα τσίμπημα φθόνου σε ευχή."},
 {id:35, verse_gr:"Μὴ σὺν ὀργῇ μηδὲν πράσσε·",
  verse_en:"Do nothing in anger.",
  commentary:"Δεν αρνούμαστε το συναίσθημα—αναστέλλουμε την πράξη.",
  practice:"Όταν ανέβει η οργή, μέτρα 10 αναπνοές πριν απαντήσεις."},
 {id:48, verse_gr:"Φίλοις ἀεί ἀληθεύε.",
  verse_en:"Always speak truth to your friends.",
  commentary:"Η αλήθεια είναι φάρμακο—δώρησέ την με τρυφερότητα.",
  practice:"Πες μία καθαρή αλήθεια με καλοσύνη σε έναν φίλο σήμερα."}
];

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2,'0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const load = (k,def) => JSON.parse(localStorage.getItem(k) || JSON.stringify(def));
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));

let ENTRIES = load('gv.entries', []);     // [{id,good,poor,corr,createdAt}]
let TIMES   = load('gv.times', {morning:"09:00", evening:"22:00"});

// ---------- daily verse ----------
function todayVerse(){
  const dayOfYear = (d=>Math.floor((d - new Date(d.getFullYear(),0,0))/86400000))(new Date());
  return VERSES[(dayOfYear-1) % VERSES.length];
}

// ---------- tabs ----------
document.querySelectorAll('.tab').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['today','journal','settings'].forEach(id=>$('#'+id).classList.add('hidden'));
    $('#'+btn.dataset.tab).classList.remove('hidden');
    if(btn.dataset.tab==='journal') renderEntries();
    if(btn.dataset.tab==='today') updateToday();
  };
});

// ---------- Today ----------
function updateToday(){
  const v = todayVerse();
  $('#verseId').textContent = `Verse ${v.id}`;
  $('#verseGR').textContent = v.verse_gr;
  $('#verseEN').textContent = v.verse_en;
  $('#commentary').textContent = v.commentary;
  $('#practice').textContent = v.practice;
  $('#streakText').textContent = `Streak: ${streak()} days`;
}
$('#btnReview').onclick=()=>{
  document.querySelector('[data-tab="journal"]').click();
  setTimeout(()=>$('#good').focus(),100);
};
$('#btnExport').onclick=()=>{
  const md = exportMarkdown();
  const blob = new Blob([md],{type:'text/markdown'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `GoldenVerses_Journal_${iso(new Date())}.md`;
  a.click();
};
$('#btnShare').onclick=()=>shareQuote();

// ---------- Journal ----------
function upsertToday(g,p,c){
  const id = iso(new Date());
  const i = ENTRIES.findIndex(e=>e.id===id);
  if(i>=0){ ENTRIES[i].good=g; ENTRIES[i].poor=p; ENTRIES[i].corr=c; }
  else ENTRIES.unshift({id,good:g,poor:p,corr:c,createdAt:new Date().toISOString()});
  save('gv.entries', ENTRIES);
  updateToday(); renderEntries();
}
function entryFor(dateISO){ return ENTRIES.find(e=>e.id===dateISO); }
function streak(){
  let d = new Date(), count=0;
  while(true){
    const id = iso(d); const e = entryFor(id);
    if(!e) break;
    if(!(e.good||e.poor||e.corr)) break;
    count++;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1);
  }
  return count;
}
function renderEntries(){
  const box = $('#entries');
  if(!ENTRIES.length){ box.innerHTML = `<p class="small">No entries yet.</p>`; return; }
  box.innerHTML = ENTRIES.map(e=>`
    <div class="card">
      <div class="small">${e.id}</div>
      ${e.good?`<div>✅ ${e.good}</div>`:''}
      ${e.poor?`<div>⚠️ ${e.poor}</div>`:''}
      ${e.corr?`<div>🔁 ${e.corr}</div>`:''}
    </div>
  `).join('');
}
$('#reviewForm').onsubmit=(ev)=>{
  ev.preventDefault();
  upsertToday($('#good').value.trim(), $('#poor').value.trim(), $('#corr').value.trim());
  alert('Saved. Good night 🌙');
  $('#good').value=$('#poor').value=$('#corr').value='';
};
$('#clearToday').onclick=()=>{
  $('#good').value=$('#poor').value=$('#corr').value='';
};

// ---------- Settings / Calendar (.ics) ----------
$('#tMorning').value = TIMES.morning;
$('#tEvening').value = TIMES.evening;
$('#tMorning').onchange = e => { TIMES.morning=e.target.value; save('gv.times',TIMES); };
$('#tEvening').onchange = e => { TIMES.evening=e.target.value; save('gv.times',TIMES); };

$('#btnICS').onclick=()=>{
  const ics = makeICS(TIMES.morning, TIMES.evening);
  const blob = new Blob([ics], {type:'text/calendar'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'GoldenVerses_Reminders.ics';
  a.click();
  alert('Open the file and add both daily reminders to your Calendar.');
};
function makeICS(morn, eve){
  const uid = ()=>Math.random().toString(36).slice(2);
  const vevent = (hour, title, body)=>[
    'BEGIN:VEVENT',
    `UID:${uid()}@goldenverses`,
    `DTSTART:${dtToday(hour)}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${title}`,
    `DESCRIPTION:${body}`,
    'END:VEVENT'
  ].join('\n');
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GoldenVerses//EN',
    vevent(morn,'Golden Verse','Read today’s verse & carry one practice.'),
    vevent(eve,'Pythagorean Review','Three steps: well done • off course • correction.'),
    'END:VCALENDAR'
  ].join('\n');
}
function dtToday(hhmm){
  const [h,m] = hhmm.split(':').map(Number);
  const d = new Date();
  const p = n=>String(n).padStart(2,'0');
  // floating local time so Calendar repeats daily at local time
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(h)}${p(m)}00`;
}

// ---------- Export Markdown ----------
function exportMarkdown(){
  const lines = ['# Golden Verses – Journal\n'];
  ENTRIES.forEach(e=>{
    lines.push(`## ${e.id}\n`);
    if(e.good) lines.push(`- ✅ ${e.good}`);
    if(e.poor) lines.push(`- ⚠️ ${e.poor}`);
    if(e.corr) lines.push(`- 🔁 ${e.corr}`);
    lines.push('');
  });
  return lines.join('\n');
}

// ---------- Share quote as image ----------
function shareQuote(){
  const v = todayVerse();
  const canvas = $('#shareCanvas'); const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const grd = ctx.createLinearGradient(0,0,W,H);
  grd.addColorStop(0,'#0b0b0c'); grd.addColorStop(1,'#2a2b30');
  ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff'; ctx.font='bold 48px Georgia';
  wrapText(ctx, v.verse_gr, 100, 220, W-200, 60);
  ctx.fillStyle='rgba(255,255,255,.85)'; ctx.font='28px Georgia';
  wrapText(ctx, v.verse_en, 100, 520, W-200, 40);
  ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='22px Georgia';
  ctx.fillText('Golden Verses • A.P. Vresland', 100, H-120);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a'); a.href=url; a.download=`Verse_${v.id}.png`; a.click();
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' '); let line=''; let yy=y;
  for(let n=0;n<words.length;n++){
    const test = line+words[n]+' ';
    if(ctx.measureText(test).width>maxWidth){
      ctx.fillText(line, x, yy); line=words[n]+' '; yy+=lineHeight;
    } else line=test;
  }
  ctx.fillText(line,x,yy);
}

// ---------- boot ----------
updateToday(); renderEntries();
