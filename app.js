const KEY='scoutedge-content-bot-history-v1';
let history=readHistory();
let activeId=history[0]?.id||null;
const el=(id)=>document.getElementById(id);

el('form').addEventListener('submit',async(e)=>{e.preventDefault();await generateDrafts();});
el('clear').addEventListener('click',()=>{if(confirm('Clear local draft history?')){history=[];activeId=null;saveHistory();render();}});
el('exportJson').addEventListener('click',()=>{const b=getBatch();if(!b)return message('Nothing to export.');download('scoutedge-drafts.json',JSON.stringify(b,null,2),'application/json');});
el('exportTxt').addEventListener('click',()=>{const b=getBatch();if(!b)return message('Nothing to export.');download('scoutedge-drafts.txt',b.drafts.map(d=>`[${d.platform.toUpperCase()}] ${d.status}\n${d.text}`).join('\n\n---\n\n'),'text/plain');});

async function generateDrafts(){
  const productUpdate=el('update').value.trim();
  const audience=el('audience').value;
  const tone=el('tone').value;
  const platforms=[...document.querySelectorAll('.checks input:checked')].map(x=>x.value);
  if(!productUpdate)return message('Enter a product update first.');
  if(!platforms.length)return message('Select at least one platform.');
  el('generate').disabled=true; message('Generating drafts...');
  try{
    const res=await fetch('/.netlify/functions/generate-content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productUpdate,audience,tone,platforms})});
    const data=await res.json();
    if(!res.ok)throw new Error(data.error||'Draft generation failed.');
    const batch={id:String(Date.now()),createdAt:new Date().toISOString(),productUpdate,audience,tone,drafts:(data.drafts||[]).map(d=>({platform:d.platform,text:d.text,status:'hold'}))};
    history.unshift(batch);activeId=batch.id;saveHistory();render();message('Drafts generated and saved locally.');
  }catch(err){message(err.message||'Unable to generate drafts.');}
  finally{el('generate').disabled=false;}
}

function render(){renderDrafts();renderHistory();}
function renderDrafts(){
  const box=el('drafts');const b=getBatch();
  if(!b||!b.drafts.length){box.innerHTML='Generate an update to see drafts.';return;}
  box.innerHTML=b.drafts.map((d,i)=>`<div class="draft"><div class="row"><strong>${safe(d.platform.toUpperCase())}</strong><span class="status">${safe(d.status)}</span></div><textarea data-index="${i}">${safe(d.text)}</textarea><div class="row"><button class="btn" data-status="approved" data-index="${i}">Approve</button><button class="btn" data-status="hold" data-index="${i}">Hold</button><button class="btn" data-status="rejected" data-index="${i}">Reject</button><button class="btn" data-copy="${i}">Copy</button></div></div>`).join('');
  box.querySelectorAll('textarea').forEach(t=>t.addEventListener('input',()=>{getBatch().drafts[Number(t.dataset.index)].text=t.value;saveHistory();}));
  box.querySelectorAll('[data-status]').forEach(btn=>btn.addEventListener('click',()=>{getBatch().drafts[Number(btn.dataset.index)].status=btn.dataset.status;saveHistory();renderDrafts();}));
  box.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const d=getBatch().drafts[Number(btn.dataset.copy)];await navigator.clipboard.writeText(d.text);message('Copied draft.');}));
}
function renderHistory(){
  const box=el('history');
  if(!history.length){box.innerHTML='<p class="muted">No saved drafts yet.</p>';return;}
  box.innerHTML=history.map(b=>`<button class="btn" style="display:block;width:100%;margin:8px 0;text-align:left" data-id="${b.id}">${safe(b.productUpdate.slice(0,70))}${b.productUpdate.length>70?'...':''}<br><small>${new Date(b.createdAt).toLocaleString()} · ${b.drafts.length} drafts</small></button>`).join('');
  box.querySelectorAll('[data-id]').forEach(btn=>btn.addEventListener('click',()=>{activeId=btn.dataset.id;renderDrafts();}));
}
function readHistory(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')||[]}catch{return[]}}
function saveHistory(){localStorage.setItem(KEY,JSON.stringify(history));}
function getBatch(){return history.find(x=>x.id===activeId)||history[0]||null;}
function message(t){el('msg').textContent=t;}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function safe(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}
render();
