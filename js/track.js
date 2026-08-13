requireStudent();

function renderTrackerProgress(status){
  const steps = ['SUBMITTED', 'IN REVIEW', 'IN PROGRESS', 'RESOLVED'];
  const currentIndex = steps.indexOf((status||'').toUpperCase());
  
  return `
  <div class="tracker-steps">
    ${steps.map((step, idx) => {
      let stateClass = '';
      if (idx < currentIndex) stateClass = 'completed';
      else if (idx === currentIndex) stateClass = 'active';
      
      let icon = '<i class="fa-solid fa-circle"></i>';
      if (idx === 0) icon = '<i class="fa-solid fa-file-lines"></i>';
      if (idx === 1) icon = '<i class="fa-solid fa-eye"></i>';
      if (idx === 2) icon = '<i class="fa-solid fa-gears"></i>';
      if (idx === 3) icon = '<i class="fa-solid fa-circle-check"></i>';
      if (idx < currentIndex) icon = '<i class="fa-solid fa-check"></i>';

      return `
        <div class="tracker-step ${stateClass}">
          <div class="step-icon">${icon}</div>
          <div class="step-label">${step}</div>
        </div>
      `;
    }).join('')}
  </div>
  `;
}

function trackComplaint(e){
  e.preventDefault();
  const id=document.getElementById('trackId').value.trim().toUpperCase();
  const c=getComplaints().find(x=>x.id===id);
  const el=document.getElementById('trackResult');
  
  if(!c){
    el.innerHTML='<section class="card" style="text-align:center;"><i class="fa-solid fa-circle-xmark" style="font-size:2.5rem; color:var(--danger); margin-bottom:10px;"></i><p class="message">No complaint found matching ID "'+escapeHtml(id)+'". Please verify and try again.</p></section>';
    return;
  }

  el.innerHTML=`<section class="card">
    <div class="section-title">
      <div>
        <span class="eyebrow"><i class="fa-solid fa-ticket"></i> ${escapeHtml(c.id)}</span>
        <h2 style="font-size:1.4rem; margin-top:2px;">${escapeHtml(c.title)}</h2>
      </div>
      <span class="badge ${c.priority.toLowerCase()}"><i class="fa-solid fa-circle-exclamation"></i> ${c.priority}</span>
    </div>

    ${renderTrackerProgress(c.status)}

    <div class="detail-grid" style="margin-top:24px;">
      <div class="detail"><b><i class="fa-solid fa-location-dot"></i> Location</b>${escapeHtml(c.location)}</div>
      <div class="detail"><b><i class="fa-solid fa-tag"></i> Category</b>${escapeHtml(c.category)}</div>
      <div class="detail"><b><i class="fa-solid fa-user-gear"></i> Assigned Team</b>${escapeHtml(c.assigned)}</div>
      <div class="detail"><b><i class="fa-solid fa-clock"></i> Date Filed</b>${new Date(c.createdAt).toLocaleString([], {dateStyle:'medium', timeStyle:'short'})}</div>
    </div>

    <div style="margin-top:16px;">
      <b style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Issue Description</b>
      <p style="margin-top:6px; background:var(--bg-subtle); padding:14px; border-radius:var(--radius-md);">${escapeHtml(c.description)}</p>
    </div>

    ${c.image?`<div style="margin-top:16px;"><b style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted);">Attached Image</b><br><img src="${c.image}" class="preview" alt="Complaint Image"></div>`:''}
  </section>`;
}

function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
