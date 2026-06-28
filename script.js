const page = document.documentElement.dataset.page || 'index';
const progress = document.getElementById('scrollProgress');
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');

function updateProgress(){
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if(progress) progress.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateProgress);
updateProgress();

document.querySelectorAll('.main-nav a').forEach(link => {
  if(link.dataset.page === page) link.classList.add('active');
  link.addEventListener('click', () => {
    mainNav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded','false');
  });
});

menuButton?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.13});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const previewText = document.getElementById('cardPreview');
document.querySelectorAll('[data-preview]').forEach(btn => {
  btn.addEventListener('mouseenter', () => previewText && (previewText.textContent = btn.dataset.preview));
  btn.addEventListener('focus', () => previewText && (previewText.textContent = btn.dataset.preview));
});

const dossierData = {
  jade:{
    img:'assets/jade.png', role:'OUTGOING STUDENT · SOCIAL ALL-ROUNDER', name:'Jade',
    lore:'Everyone knows Jade. She seems balanced, likeable, and naturally good at everything, but her confidence is built on public approval. Criticism does not just hurt her score; it shakes the image she works so hard to protect.',
    advantage:'Friend-related events have a high chance of success.',
    weakness:'Sanity decreases faster when facing criticism.',
    trait:'Public Image affects the chance of success in social events.',
    roleText:'Use interpersonal resources, but protect sanity.',
    card:'Smile Through It', cardText:'Resolve a social crisis, but lose Sanity.'
  },
  kevin:{
    img:'assets/kevin.png', role:'SPORTY STUDENT · DEFENSIVE COMEBACK CHARACTER', name:'Kevin',
    lore:'Kevin is energetic, outgoing, and supported by a stable family. He solves problems by moving first and thinking while doing, but traditional studying drains him faster than anyone expects.',
    advantage:'High resilience reduces most value decreases except Academic Performance.',
    weakness:'Academic Performance increases are reduced by 25%.',
    trait:'Recover: after a failure, the next successful action gains a bonus.',
    roleText:'Absorb pressure, recover from mistakes, and use momentum to survive.',
    card:'Training Discipline', cardText:'Convert Energy into Focus and reduce the next study penalty.'
  },
  william:{
    img:'assets/william.png', role:'TOP STUDENT · HIGH RISK HIGH REWARD', name:'William',
    lore:'William is the student teachers trust automatically. He learns fast and performs well, but his self-worth is tied too closely to success. A small failure can feel like proof that everything is falling apart.',
    advantage:'Learning Result +50%; strongest in study-related events.',
    weakness:'Any value decrease increases by 20% when failing to succeed.',
    trait:'Perfectionist: success streaks restore a small amount of Sanity.',
    roleText:'Win quickly through academic power, but avoid failure spirals.',
    card:'Hyperfocus', cardText:'Greatly boost the next study action, but block Rest and Social cards temporarily.'
  }
};
function setDossier(key){
  const d = dossierData[key]; if(!d) return;
  const image = document.getElementById('dossierImage');
  if(image){ image.src = d.img; image.alt = `${d.name} character art`; }
  const map = {
    dossierRole:d.role, dossierName:d.name, dossierLore:d.lore,
    dossierAdvantage:d.advantage, dossierWeakness:d.weakness,
    dossierTrait:d.trait, dossierRoleText:d.roleText
  };
  Object.entries(map).forEach(([id,text])=>{ const el=document.getElementById(id); if(el) el.textContent=text; });
  const sig = document.getElementById('signatureCard');
  if(sig) sig.innerHTML = `<span>Signature Card</span><b>${d.card}</b><p>${d.cardText}</p>`;
  document.querySelectorAll('[data-dossier]').forEach(b => b.classList.toggle('active', b.dataset.dossier === key));
}
document.querySelectorAll('[data-dossier]').forEach(btn => btn.addEventListener('click', () => setDossier(btn.dataset.dossier)));

const eventData = {
  exam:{
    type:'School Event', title:'Exam Week',
    desc:'Academic pressure rises and every hour feels like a tradeoff between progress and collapse.',
    lore:'The hallway becomes quieter during exam week. Desks turn into small islands, conversations shrink into formula reviews, and every unfinished page feels heavier than the last. The player must decide whether to keep pushing, ask for help, or protect their sanity before the final test arrives.',
    choices:'Cram for extra Academic progress, take a Rest card to recover Sanity, ask classmates for notes, or sacrifice one subject to protect another.',
    consequence:'Strong performance unlocks confidence and teacher trust. Overworking may trigger Burnout Night, reduced Energy, or a future criticism event.',
    jade:'Can borrow notes and organize study groups, but underperforming damages Public Image.',
    kevin:'Needs Energy-based discipline cards to overcome reduced study efficiency.',
    william:'Can clear the event quickly, but one mistake activates heavier failure damage.'
  },
  project:{
    type:'Friends Event', title:'Group Project Crisis',
    desc:'Your group project deadline is close, but one teammate has not finished their part.',
    lore:'The group chat is full of seen messages and no actual files. The deadline is tomorrow, and everyone silently waits for someone else to become the responsible one. The player can protect the group, confront the missing teammate, or carry the work alone.',
    choices:'Coordinate the group, directly confront the missing teammate, ask the teacher for an extension, or finish the missing section yourself.',
    consequence:'Solving it well improves Relationship and Academic. Carrying too much work increases Stress and may create resentment later.',
    jade:'Can coordinate teammates and calm the group, but the failure becomes public if the presentation goes badly.',
    kevin:'Can push progress through action and morale, but his Academic efficiency is lower.',
    william:'Can finish the content quickly, but gains more pressure from carrying everyone.'
  },
  family:{
    type:'Family Event', title:'Expectation Talk',
    desc:'A normal dinner becomes a future-planning interview about grades, college, and identity.',
    lore:'The conversation starts with a casual question about school, then slowly turns into grades, rankings, future plans, and whether the player is doing enough. The table is familiar, but the pressure feels like another exam.',
    choices:'Stay quiet, explain your own plan, promise to improve, or ask for emotional support instead of advice.',
    consequence:'A good response can restore Energy or lower Stress. A bad response may reduce Sanity and trigger future family events.',
    jade:'Family conflict hurts more because home is not her safe place.',
    kevin:'Stable family support reduces damage and may restore Energy.',
    william:'Supportive expectations still become pressure because he fears disappointing people.'
  },
  criticism:{
    type:'School Event', title:"Teacher's Criticism",
    desc:'Feedback is given publicly. The event tests whether the character can separate correction from shame.',
    lore:'A teacher points out a mistake in front of the class. Some students look away, some whisper, and the room suddenly feels smaller. The feedback may be useful, but the way it lands depends on the character’s insecurity.',
    choices:'Accept the correction, defend yourself, laugh it off, or turn the embarrassment into motivation.',
    consequence:'Handling it well improves Focus. Handling it poorly damages Sanity, Public Image, or future Academic confidence.',
    jade:'Most vulnerable because criticism directly damages Public Image.',
    kevin:'Takes less overall damage but may lose Academic motivation.',
    william:'Transforms criticism into pressure; failure penalties become much heavier.'
  },
  shift:{
    type:'Friends Event', title:'Relationship Shift',
    desc:'Someone in the friend group becomes distant, and nobody explains why.',
    lore:'A seat is taken before you arrive. A joke happens just outside your hearing. Nothing dramatic happens, but the shape of the friend group changes. The player must decide whether to ask directly, pretend not to notice, or invest in other relationships.',
    choices:'Ask what changed, ignore the distance, spend Energy rebuilding trust, or step back to protect Sanity.',
    consequence:'Direct action may repair the relationship, but forcing the issue can lower Public Image or create conflict.',
    jade:'Can investigate socially, but overreacting hurts Sanity.',
    kevin:'Can use openness to recover trust, but may miss hidden tension.',
    william:'May not notice the issue early because social events are not his main strength.'
  },
  application:{
    type:'Family Event', title:'Application Talk',
    desc:'Your future becomes a negotiation between ambition, family expectation, and personal limits.',
    lore:'The player is asked to choose a path before they feel ready. High school selection, college applications, extracurricular records, and family expectations all become part of the same conversation. The future feels less like a dream and more like a deadline.',
    choices:'Aim higher, choose a safer path, negotiate with family, or postpone the decision and focus on current survival.',
    consequence:'Ambitious choices can unlock advanced opportunities. Unsafe choices increase Stress and may create long-term pressure.',
    jade:'Tries to present a confident image even when uncertain.',
    kevin:'Needs to prove that his path is more than grades.',
    william:'Has strong options but the fear of making the wrong choice increases pressure.'
  },
  anniversary:{
    type:'School Event', title:'School Anniversary',
    desc:'A celebration turns into extra responsibility, rehearsals, and public performance.',
    lore:'The school calls it a celebration, but students experience it as another deadline: rehearsals, booths, speeches, posters, and teachers asking for volunteers. The event is colorful on the outside and exhausting behind the scenes.',
    choices:'Volunteer for visibility, stay behind the scenes, help friends, or protect Energy by refusing extra tasks.',
    consequence:'Public success improves Relationship and Public Image. Too many responsibilities may cause Energy collapse before the next academic event.',
    jade:'Can shine socially and gain Public Image, but overcommitting makes criticism more dangerous.',
    kevin:'Can handle physical tasks and team work efficiently.',
    william:'Can organize details well but may become frustrated by chaotic teamwork.'
  },
  burnout:{
    type:'Personal Event', title:'Burnout Night',
    desc:'You finally stop moving, and everything catches up.',
    lore:'It is late. The desk is still full, the phone is still buzzing, and the player realizes they are not tired from one task but from the entire semester. This event does not ask “Can you do more?” It asks “What breaks if you do?”',
    choices:'Sleep now, doom-scroll to escape, force one more study session, or message someone for support.',
    consequence:'Resting may cost Academic progress but prevents collapse. Forcing progress may trigger a major Sanity penalty next round.',
    jade:'May hide exhaustion to keep her image intact, making the crash sharper later.',
    kevin:'Can recover faster if he chooses rest, but loses momentum if he avoids the problem.',
    william:'Can still study effectively, but the failure penalty becomes extremely risky.'
  },
  club:{
    type:'Friends Event', title:'Club Competition',
    desc:'Team spirit meets public ranking.',
    lore:'A club event should be fun, but ranking turns it into a second report card. Teammates expect commitment, teachers expect results, and friends expect the player to still be normal afterward.',
    choices:'Push for victory, protect team morale, reduce personal workload, or sacrifice preparation for academics.',
    consequence:'Winning boosts Relationship and unlocks Opportunity cards. Losing can damage morale but may teach recovery.',
    jade:'Can motivate the team and manage social pressure, but public loss hurts image.',
    kevin:'Strongest in high-energy team events and can trigger Recover after setbacks.',
    william:'Can learn strategy quickly, but may struggle when success depends on team emotions.'
  }
};
function setEvent(key){
  const d=eventData[key]; if(!d) return;
  const title=document.getElementById('eventTitle');
  const desc=document.getElementById('eventDesc');
  const grid=document.getElementById('outcomeGrid');
  const type=document.getElementById('eventTypeLabel');
  const lore=document.getElementById('eventLore');
  const choices=document.getElementById('eventChoices');
  const consequence=document.getElementById('eventConsequence');
  if(type) type.textContent=d.type;
  if(title) title.textContent=d.title;
  if(desc) desc.textContent=d.desc;
  if(lore) lore.textContent=d.lore;
  if(choices) choices.textContent=d.choices;
  if(consequence) consequence.textContent=d.consequence;
  if(grid) grid.innerHTML = `<div><b>Jade</b><span>${d.jade}</span></div><div><b>Kevin</b><span>${d.kevin}</span></div><div><b>William</b><span>${d.william}</span></div>`;
  document.querySelectorAll('[data-event]').forEach(card => card.classList.toggle('active', card.dataset.event === key));
}
document.querySelectorAll('[data-event]').forEach(card => card.addEventListener('click', () => setEvent(card.dataset.event)));
setEvent('exam');

const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.pin-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.type === filter ? '' : 'none';
    });
  });
});

const roleInput = document.getElementById('roleInput');
document.querySelectorAll('[data-job]').forEach(btn => btn.addEventListener('click', () => { if(roleInput) roleInput.value = btn.dataset.job; }));
document.getElementById('applicationForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Concept application saved. This form is a prototype for the showcase website.');
});
