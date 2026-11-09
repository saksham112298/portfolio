(function () {
  'use strict';

  var CATEGORIES = [
    { name: 'SaaS Animation',    blurb: 'App and SaaS-style product animation: clean UI motion that explains a product fast.' },
    { name: 'Motion Graphics',   blurb: 'Logo reveals, promos and kinetic type built for ads and reels.' },
    { name: '2D Animation',      blurb: 'Hand-crafted 2D characters, explainers and animated illustrations.' },
    { name: '3D Animation',      blurb: 'Products, objects and scenes brought to life in three dimensions.' },
    { name: 'Documentary Style', blurb: 'Story-led edits with cinematic pacing, captions and sound design.' }
  ];
  var WORKS = window.WORKS || [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  function observeReveals(root) {
    var els = (root || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
          el.style.transitionDelay = Math.min(sibs, 6) * 70 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero: timecode ---------- */
  var tcEl = document.getElementById('heroTimecode');
  if (tcEl && !reduceMotion) {
    var start = performance.now();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    (function tick(now) {
      var frames = Math.floor(((now - start) / 1000) * 24) % (16 * 24);
      var s = Math.floor(frames / 24), f = frames % 24;
      tcEl.textContent = '00:00:' + pad(s) + ':' + pad(f);
      requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- hero: waveform ---------- */
  function fillBars(el, count, minH, maxH, unit, alt) {
    if (!el) return;
    var html = '';
    for (var i = 0; i < count; i++) {
      var v = Math.abs(Math.sin(i * 0.55) * 0.6 + Math.sin(i * 0.19) * 0.4);
      var h = Math.round(minH + v * (maxH - minH));
      var cls = alt && i % 5 === 2 ? ' class="v"' : '';
      var delay = alt ? ';animation-delay:' + (i * 0.07).toFixed(2) + 's' : '';
      html += '<i' + cls + ' style="height:' + h + unit + delay + '"></i>';
    }
    el.innerHTML = html;
  }
  fillBars(document.getElementById('heroWave'), 70, 15, 95, '%', false);
  fillBars(document.getElementById('contactWave'), 34, 14, 58, 'px', true);

  /* ---------- hero: word rotator ---------- */
  var words = ['Motion', 'Edits', 'Animation', 'VFX', 'Stories'];
  var rot = document.querySelector('.word-rotator');
  if (rot && !reduceMotion) {
    var idx = 0;
    setInterval(function () {
      var cur = rot.querySelector('.word');
      idx = (idx + 1) % words.length;
      var next = document.createElement('span');
      next.className = 'word glow pre';
      next.textContent = words[idx];
      cur.classList.add('out');
      rot.appendChild(next);
      next.getBoundingClientRect();           // apply start position
      next.classList.remove('pre');
      setTimeout(function () { cur.remove(); }, 700);
    }, 2200);
    rot.style.position = 'relative';
    rot.style.display = 'grid';
  }

  /* ---------- showreel ---------- */
  var reel = window.SHOWREEL;
  var reelVideo = document.getElementById('reelVideo');
  var reelFrame = document.getElementById('reelFrame');
  var reelPlay = document.getElementById('reelPlay');
  if (reel && reelVideo) {
    reelVideo.src = reel.src;
    if (reel.poster) reelVideo.poster = reel.poster;
    if (reel.ratio === '16:9') reelFrame.style.aspectRatio = '16 / 9';
    if (reel.ratio === '9:16') { reelFrame.style.aspectRatio = '9 / 16'; reelFrame.style.maxWidth = '400px'; }
    // silent looping preview once it scrolls into view
    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (reelFrame.classList.contains('playing')) return;
          if (e.isIntersecting) { reelVideo.play().catch(function () {}); }
          else { reelVideo.pause(); }
        });
      }, { threshold: 0.4 }).observe(reelFrame);
    }
    reelPlay.addEventListener('click', function () {
      reelFrame.classList.add('playing');
      reelVideo.loop = false;
      reelVideo.muted = false;
      reelVideo.currentTime = 0;
      reelVideo.controls = true;
      reelVideo.play().catch(function () {});
    });
  }

  /* ---------- work tabs + cards ---------- */
  var tabsEl = document.getElementById('workTabs');
  var gridEl = document.getElementById('workGrid');
  var blurbEl = document.getElementById('workBlurb');

  function ratioClass(r) { return r === '9:16' ? 'r-v' : (r === '1:1' ? 'r-s' : 'r-h'); }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderTabs(active) {
    tabsEl.innerHTML = CATEGORIES.map(function (c, i) {
      var n = WORKS.filter(function (w) { return w.category === c.name; }).length;
      var sel = c.name === active;
      return '<button class="tab" type="button" role="tab" id="tab-' + i + '" aria-selected="' + sel + '" tabindex="' + (sel ? 0 : -1) + '" data-cat="' + esc(c.name) + '">' +
        esc(c.name) + (n ? ' <span class="count">' + n + '</span>' : '') + '</button>';
    }).join('');
  }

  function renderGrid(active) {
    var cat = CATEGORIES.filter(function (c) { return c.name === active; })[0];
    blurbEl.textContent = cat ? cat.blurb : '';
    var items = WORKS.filter(function (w) { return w.category === active; });
    var tabIndex = CATEGORIES.indexOf(cat);
    gridEl.setAttribute('aria-labelledby', 'tab-' + tabIndex);

    if (!items.length) {
      gridEl.innerHTML =
        '<div class="empty glass"><p>New ' + esc(active) + ' work is on the way. Want something like this made for you?</p>' +
        '<a class="btn btn-ghost btn-sm" href="https://wa.me/919084165033" target="_blank" rel="noopener">Ask me on WhatsApp</a></div>';
    } else {
      gridEl.innerHTML = items.map(function (w, i) {
        return '<article class="card glass ' + ratioClass(w.ratio) + '">' +
          '<button class="card-media" type="button" data-i="' + WORKS.indexOf(w) + '" aria-label="Play ' + esc(w.title) + '">' +
            (w.poster ? '<img src="' + esc(w.poster) + '" alt="" loading="lazy">' : '') +
            '<video muted loop playsinline preload="none" data-src="' + esc(w.src) + '"></video>' +
            '<span class="play-circle" aria-hidden="true"><svg class="ic" width="22" height="22" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>' +
          '</button>' +
          '<div class="card-info"><h3>' + esc(w.title) + '</h3>' +
            (w.description ? '<p>' + esc(w.description) + '</p>' : '') +
            '<span class="tag">' + esc(w.category) + ' · ' + esc(w.ratio || '16:9') + '</span></div>' +
        '</article>';
      }).join('');
      if (canHover && !reduceMotion) bindPreviews();
    }
    gridEl.classList.remove('swap');
    gridEl.getBoundingClientRect();
    gridEl.classList.add('swap');
  }

  function bindPreviews() {
    gridEl.querySelectorAll('.card').forEach(function (card) {
      var v = card.querySelector('video');
      card.addEventListener('mouseenter', function () {
        if (!v.src) v.src = v.getAttribute('data-src');
        v.play().then(function () { card.classList.add('previewing'); }).catch(function () {});
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('previewing');
        v.pause();
      });
    });
  }

  function select(name) { renderTabs(name); renderGrid(name); }

  if (tabsEl && gridEl) {
    var first = CATEGORIES.filter(function (c) {
      return WORKS.some(function (w) { return w.category === c.name; });
    })[0] || CATEGORIES[0];
    select(first.name);

    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (b) select(b.getAttribute('data-cat'));
    });
    tabsEl.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('.tab'));
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[n].getAttribute('data-cat'));
      tabsEl.querySelectorAll('.tab')[n].focus();
    });
    gridEl.addEventListener('click', function (e) {
      var m = e.target.closest('.card-media');
      if (m) openPlayer(WORKS[+m.getAttribute('data-i')]);
    });
  }

  /* ---------- player popup ---------- */
  var player = document.getElementById('player');
  var playerVideo = document.getElementById('playerVideo');
  var playerTitle = document.getElementById('playerTitle');

  function openPlayer(w) {
    if (!w) return;
    if (reelVideo && !reelVideo.paused) reelVideo.pause();
    playerTitle.textContent = w.title;
    playerVideo.src = w.src;
    if (w.poster) playerVideo.poster = w.poster;
    playerVideo.style.aspectRatio = w.ratio === '9:16' ? '9 / 16' : (w.ratio === '1:1' ? '1 / 1' : '16 / 9');
    if (typeof player.showModal === 'function') player.showModal();
    else window.open(w.src, '_blank');
    playerVideo.play().catch(function () {});
  }
  function closePlayer() {
    playerVideo.pause();
    playerVideo.removeAttribute('src');
    playerVideo.load();
    if (player.open) player.close();
  }
  if (player) {
    document.getElementById('playerClose').addEventListener('click', closePlayer);
    player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });
    player.addEventListener('close', function () { playerVideo.pause(); });
  }

  observeReveals();
})();
