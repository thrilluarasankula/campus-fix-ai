requireAdmin();

function getStatusTag(status){
  const s=(status||'SUBMITTED').toUpperCase();
  if(s==='SUBMITTED') return `<span class="status-tag status-submitted"><i class="fa-solid fa-circle-dot"></i> Submitted</span>`;
  if(s==='IN REVIEW') return `<span class="status-tag status-in-review"><i class="fa-solid fa-eye"></i> In Review</span>`;
  if(s==='IN PROGRESS') return `<span class="status-tag status-in-progress"><i class="fa-solid fa-gears"></i> In Progress</span>`;
  if(s==='RESOLVED') return `<span class="status-tag status-resolved"><i class="fa-solid fa-circle-check"></i> Resolved</span>`;
  return `<span class="status-tag">${escapeHtml(s)}</span>`;
}

function renderAdmin(){
  const all=getComplaints();
  document.getElementById('aTotal').textContent=all.length;
  document.getElementById('aPending').textContent=all.filter(c=>c.status==='SUBMITTED'||c.status==='IN REVIEW').length;
  document.getElementById('aProgress').textContent=all.filter(c=>c.status==='IN PROGRESS').length;
  document.getElementById('aResolved').textContent=all.filter(c=>c.status==='RESOLVED').length;
  
  const q=(document.getElementById('search').value||'').toLowerCase();
  const sf=document.getElementById('statusFilter').value,pf=document.getElementById('priorityFilter').value;
  const rows=all.filter(c=>(sf==='ALL'||c.status===sf)&&(pf==='ALL'||c.priority===pf)&&(!q||[c.id,c.title,c.location,c.category,c.description].join(' ').toLowerCase().includes(q)));
  
  document.getElementById('adminList').innerHTML=rows.length?rows.map(c=>`<div class="admin-row">
    <b><i class="fa-solid fa-hashtag"></i> ${c.id}</b>
    <div><b style="color:var(--text-primary);">${escapeHtml(c.title)}</b><br><small class="muted"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(c.location)}</small></div>
    <span><i class="fa-solid fa-layer-group"></i> ${escapeHtml(c.category)}</span>
    <div><span class="badge ${c.priority.toLowerCase()}">${c.priority}</span></div>
    <div>${getStatusTag(c.status)}</div>
    <button class="btn secondary small" onclick="openComplaint('${c.id}')"><i class="fa-solid fa-pen-to-square"></i> Manage</button>
  </div>`).join(''):'<div style="text-align:center; padding:30px;"><p class="muted"><i class="fa-solid fa-magnifying-glass" style="font-size:1.8rem; margin-bottom:8px;"></i><br>No matching complaints found.</p></div>';
}

function openComplaint(id){
  const c=getComplaints().find(x=>x.id===id);if(!c)return;
  document.getElementById('modalContent').innerHTML=`
  <div style="margin-bottom:16px;">
    <p class="eyebrow"><i class="fa-solid fa-ticket"></i> ${c.id}</p>
    <h2 style="font-size:1.4rem; font-weight:800; color:var(--text-primary);">${escapeHtml(c.title)}</h2>
  </div>
  
  <div class="detail-grid">
    <div class="detail"><b>Student</b><i class="fa-solid fa-user"></i> ${escapeHtml(c.studentName)}<br><small class="muted">${escapeHtml(c.studentEmail)}</small></div>
    <div class="detail"><b>Location</b><i class="fa-solid fa-location-dot"></i> ${escapeHtml(c.location)}</div>
    <div class="detail"><b>Category</b><i class="fa-solid fa-tag"></i> ${escapeHtml(c.category)}</div>
    <div class="detail"><b>Priority Level</b><span class="badge ${c.priority.toLowerCase()}">${c.priority}</span></div>
  </div>
  
  <div style="margin: 16px 0;">
    <b style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Issue Description</b>
    <p style="margin-top:6px; background:var(--bg-subtle); padding:14px; border-radius:var(--radius-md);">${escapeHtml(c.description)}</p>
  </div>
  
  ${c.image?`<div style="margin:16px 0;"><b style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted);">Attached Photo</b><br><img src="${c.image}" class="preview" alt="Complaint photo"></div>`:''}
  
  <div style="border-top:1px solid var(--border-light); padding-top:18px; margin-top:20px;">
    <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:12px;"><i class="fa-solid fa-sliders"></i> Update Status & Assignment</h3>
    <label><i class="fa-solid fa-signal"></i> Update Status</label>
    <select id="editStatus">
      ${['SUBMITTED','IN REVIEW','IN PROGRESS','RESOLVED'].map(s=>`<option ${c.status===s?'selected':''}>${s}</option>`).join('')}
    </select>
    
    <label><i class="fa-solid fa-user-gear"></i> Assign Maintenance Team</label>
    <select id="editAssigned">
      ${['Unassigned','Electrical Maintenance','Plumbing Team','Cleaning Team','IT Support','Furniture Team','Security Team'].map(s=>`<option ${c.assigned===s?'selected':''}>${s}</option>`).join('')}
    </select>
    
    <button class="btn primary full" onclick="updateComplaint('${c.id}')"><i class="fa-solid fa-check"></i> Save Changes</button>
  </div>`;
  document.getElementById('modal').classList.remove('hidden');
}

function updateComplaint(id){
  const data=getComplaints(),c=data.find(x=>x.id===id);if(!c)return;
  c.status=document.getElementById('editStatus').value;
  c.assigned=document.getElementById('editAssigned').value;
  saveComplaints(data);
  closeModal();
  renderAdmin();
}

function closeModal(){document.getElementById('modal').classList.add('hidden')}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
renderAdmin();
