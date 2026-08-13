const user=requireStudent();
document.getElementById('studentName').textContent=user.name;

function getCategoryIcon(cat){
  switch((cat||'').toLowerCase()){
    case 'electrical': return '<i class="fa-solid fa-bolt" style="color:#eab308;"></i> Electrical';
    case 'plumbing': return '<i class="fa-solid fa-faucet-drip" style="color:#06b6d4;"></i> Plumbing';
    case 'cleaning': return '<i class="fa-solid fa-broom" style="color:#8b5cf6;"></i> Cleaning';
    case 'network': return '<i class="fa-solid fa-wifi" style="color:#3b82f6;"></i> Network';
    case 'furniture': return '<i class="fa-solid fa-chair" style="color:#f97316;"></i> Furniture';
    case 'security': return '<i class="fa-solid fa-shield-cat" style="color:#ef4444;"></i> Security';
    default: return '<i class="fa-solid fa-wrench"></i> Other';
  }
}

function getStatusTag(status){
  const s=(status||'SUBMITTED').toUpperCase();
  if(s==='SUBMITTED') return `<span class="status-tag status-submitted"><i class="fa-solid fa-circle-dot"></i> Submitted</span>`;
  if(s==='IN REVIEW') return `<span class="status-tag status-in-review"><i class="fa-solid fa-eye"></i> In Review</span>`;
  if(s==='IN PROGRESS') return `<span class="status-tag status-in-progress"><i class="fa-solid fa-gears"></i> In Progress</span>`;
  if(s==='RESOLVED') return `<span class="status-tag status-resolved"><i class="fa-solid fa-circle-check"></i> Resolved</span>`;
  return `<span class="status-tag">${escapeHtml(s)}</span>`;
}

function renderStudent(){
  const list=getComplaints().filter(c=>c.studentEmail===user.email);
  document.getElementById('total').textContent=list.length;
  document.getElementById('pending').textContent=list.filter(c=>c.status==='SUBMITTED'||c.status==='IN REVIEW').length;
  document.getElementById('progress').textContent=list.filter(c=>c.status==='IN PROGRESS').length;
  document.getElementById('resolved').textContent=list.filter(c=>c.status==='RESOLVED').length;
  
  const el=document.getElementById('complaintList');
  if(!list.length){
    el.innerHTML='<div style="text-align:center; padding: 40px 20px;"><i class="fa-solid fa-clipboard-check" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i><p class="muted">No complaints yet. Click "Report a Problem" above to get started.</p></div>';
    return;
  }
  
  el.innerHTML=list.map(c=>`<div class="complaint">
    <div class="complaint-head">
      <div>
        <div class="complaint-title">${escapeHtml(c.title)}</div>
        <div class="meta-line">
          <span><i class="fa-solid fa-hashtag"></i> ${escapeHtml(c.id)}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(c.location)}</span>
        </div>
      </div>
      <span class="badge ${c.priority.toLowerCase()}"><i class="fa-solid fa-circle-exclamation"></i> ${c.priority}</span>
    </div>
    <p style="margin: 12px 0; color: var(--text-secondary);">${escapeHtml(c.description)}</p>
    ${c.image?`<img src="${c.image}" class="preview" alt="Attachment">`:''}
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-light); flex-wrap:wrap; gap: 10px;">
      <div>${getCategoryIcon(c.category)} · ${getStatusTag(c.status)}</div>
      <small class="muted"><i class="fa-solid fa-user-gear"></i> ${escapeHtml(c.assigned)} · <i class="fa-regular fa-clock"></i> ${formatDate(c.createdAt)}</small>
    </div>
  </div>`).join('');
}
function formatDate(d){return new Date(d).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
renderStudent();
