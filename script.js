(() => {
  const $ = (id) => document.getElementById(id);
  const birthday = new Date('2026-11-29T00:00:00+05:30').getTime();
  const gate = $('secretGate'), form = $('unlockForm'), input = $('secretInput');
  const site = document.querySelector('.site-shell');
  const ids = ['welcome','countdown','windowMoment','celebration','giftReveal','letter','finalStep','shareSurprise'];
  document.body.classList.add('is-locked');
  let currentStage = 0;
  const pad = n => String(n).padStart(2,'0');
  function updateGateClock(){
    const left = Math.max(0,birthday-Date.now());
    const vals = [Math.floor(left/86400000),Math.floor(left/3600000)%24,Math.floor(left/60000)%60,Math.floor(left/1000)%60];
    ['gateDays','gateHours','gateMinutes','gateSeconds'].forEach((id,i)=>$(id).textContent=pad(vals[i]));
    if(Date.now()>=birthday){
      $('gateKicker').textContent='THE DAY IS FINALLY HERE';
      $('gateTitle').innerHTML='Happy Birthday, <em>Affu.</em>';
      $('gateCopy').innerHTML='Your little birthday universe is ready.<br>Enter the secret word to open it.';
      $('gateCountdown').hidden=true; form.hidden=false;
      $('gateHint').textContent='Your secret word is ready when you are.';
    }
  }
  updateGateClock(); setInterval(updateGateClock,1000);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(Date.now()<birthday){updateGateClock();return;}
    if(input.value.trim().toUpperCase()!=='AFFU'){
      $('gateHint').textContent='That word does not match. Try again.';
      $('gateHint').classList.add('error'); input.value=''; return;
    }
    document.body.classList.remove('is-locked'); gate.classList.add('unlocked');
    site.classList.add('journey-mode'); activateStage(0);
    $('cinematicWash')?.classList.add('play'); setTimeout(()=>$('cinematicWash')?.classList.remove('play'),2400);
    window.scrollTo({top:0,behavior:'smooth'});
  });
  function activateStage(index){
    currentStage=Math.max(0,Math.min(ids.length-1,index));
    ids.forEach((id,i)=>{const el=$(id); if(el){el.classList.toggle('active',i===currentStage);el.setAttribute('aria-hidden',i===currentStage?'false':'true');}});
    window.scrollTo({top:0,behavior:'smooth'});
    if(ids[currentStage]==='shareSurprise') makeQr();
    if(ids[currentStage]==='finalStep') confetti();
  }
  document.querySelectorAll('.journey-next').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.next; const idx=ids.indexOf(id); if(idx>=0)activateStage(idx+1);
  }));
  $('beginBtn')?.addEventListener('click',()=>activateStage(1));
  // The in-page countdown remains useful after the gate opens.
  function updateMainClock(){const left=Math.max(0,birthday-Date.now());const vals=[Math.floor(left/86400000),Math.floor(left/3600000)%24,Math.floor(left/60000)%60,Math.floor(left/1000)%60];['days','hours','minutes','seconds'].forEach((id,i)=>{if($(id))$(id).textContent=pad(vals[i]);});if(left===0&&$('countdownMessage'))$('countdownMessage').textContent='Today is your day. Let the celebration begin!';}
  updateMainClock();setInterval(updateMainClock,1000);
  const scene=document.querySelector('.window-scene');
  function openWindow(){scene?.classList.add('open');if($('windowHint'))$('windowHint').textContent='A sky full of possibilities, just for you ✨';}
  $('openWindowBtn')?.addEventListener('click',openWindow);$('shutterLeft')?.addEventListener('click',openWindow);$('shutterRight')?.addEventListener('click',openWindow);
  let candlesOut=false;
  $('blowBtn')?.addEventListener('click',()=>{candlesOut=!candlesOut;$('flames')?.classList.toggle('off',candlesOut);$('cakeCaption').textContent=candlesOut?'Wish sent into the universe, Affu ✨':'Make a wish, Affu ✨';$('blowBtn').textContent=candlesOut?'Light the candles again':'Blow out the candles';if(candlesOut)confetti();});
  $('confettiBtn')?.addEventListener('click',confetti);
  function confetti(){const chars=['✦','✧','♡','✺','·'];for(let i=0;i<45;i++){const el=document.createElement('span');el.className='confetti';el.textContent=chars[Math.floor(Math.random()*chars.length)];el.style.left=Math.random()*100+'vw';el.style.animationDuration=(2.5+Math.random()*3)+'s';el.style.fontSize=(10+Math.random()*15)+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),6000);}}
  $('giftBox')?.addEventListener('click',()=>{$('giftBox').classList.add('open');$('giftBox').setAttribute('aria-expanded','true');$('giftMessage').hidden=false;confetti();});
  $('envelopeBtn')?.addEventListener('click',()=>{const btn=$('envelopeBtn');const open=btn.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));$('letterContent').hidden=!open;$('envelopeHint').textContent=open?'A little note, just for you ♡':'Tap the envelope to open your letter';});
  $('againBtn')?.addEventListener('click',()=>{confetti();activateStage(0);});
  $('soundToggle')?.addEventListener('click',()=>{const b=$('soundToggle');const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.textContent=on?'♫ SOUND ON':'♫ SOUND OFF';});
  function makeQr(){const url=location.href;const target=$('birthdayQr');if(!target||target.dataset.ready)return;if(window.QRCode){target.innerHTML='';new QRCode(target,{text:url,width:170,height:170,colorDark:'#171b2b',colorLight:'#ffffff'});target.dataset.ready='1';$('qrPlaceholder').hidden=true;$('qrStatus').textContent='Scan to open Affu’s birthday universe.';}else $('qrStatus').textContent='QR library is unavailable. You can still copy the website link.';}
  $('copyLinkBtn')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);$('qrStatus').textContent='Website link copied!';}catch(e){$('qrStatus').textContent=location.href;}});
})();
