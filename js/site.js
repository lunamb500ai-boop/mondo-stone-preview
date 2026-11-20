/* Mondo Stone — shared script. No dependencies. */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  /* Mobile menu */
  var toggle = doc.querySelector('.menu-toggle');
  var nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Scroll reveal (skipped when reduced motion is requested) */
  var reveals = doc.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* Work filters */
  var filters = doc.querySelectorAll('.filter');
  var status = doc.getElementById('filter-status');
  function applyFilter(cat) {
    var shown = 0;
    doc.querySelectorAll('.card[data-cats]').forEach(function (card) {
      var match = cat === 'all' || card.getAttribute('data-cats').split(' ').indexOf(cat) !== -1;
      card.hidden = !match;
      if (match) { shown++; card.classList.add('is-in'); }
    });
    filters.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === cat ? 'true' : 'false'); });
    if (status) { status.textContent = 'Showing ' + shown + (shown === 1 ? ' photo' : ' photos'); }
  }
  if (filters.length) {
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-filter');
        applyFilter(cat);
        try { history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat); } catch (e) {}
      });
    });
    var initial = (location.hash || '').replace('#', '');
    if (initial && doc.querySelector('.filter[data-filter="' + initial + '"]')) { applyFilter(initial); }
  }

  /* Lightbox */
  var triggers = Array.prototype.slice.call(doc.querySelectorAll('[data-lightbox]'));
  if (triggers.length && typeof HTMLDialogElement !== 'undefined') {
    var icon = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var dlg = doc.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML =
      '<div class="lb-bar"><span class="lb-count" aria-live="polite"></span><div class="lb-nav">' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Previous photo">' + icon('M15 5l-7 7 7 7') + '</button>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Next photo">' + icon('M9 5l7 7-7 7') + '</button>' +
      '<button type="button" class="lb-btn lb-close" aria-label="Close photo viewer">' + icon('M5 5l14 14M19 5L5 19') + '</button>' +
      '</div></div><div class="lb-stage"><img alt=""></div><p class="lb-caption"></p>';
    doc.body.appendChild(dlg);
    var img = dlg.querySelector('img'), cap = dlg.querySelector('.lb-caption'), count = dlg.querySelector('.lb-count');
    var list = [], idx = 0, opener = null;
    var show = function (i) {
      idx = (i + list.length) % list.length;
      var t = list[idx];
      img.src = t.getAttribute('data-lightbox');
      img.alt = t.querySelector('img') ? t.querySelector('img').alt : '';
      cap.textContent = t.getAttribute('data-caption') || '';
      count.textContent = (idx + 1) + ' / ' + list.length;
    };
    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        list = triggers.filter(function (x) { var c = x.closest('.card'); return !c || !c.hidden; });
        opener = t;
        show(list.indexOf(t));
        dlg.showModal();
        dlg.querySelector('.lb-close').focus();
      });
    });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb-stage')) { dlg.close(); } });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(idx - 1); }
      if (e.key === 'ArrowRight') { show(idx + 1); }
    });
    dlg.addEventListener('close', function () { img.removeAttribute('src'); if (opener) { opener.focus(); } });
  }

  /* Enquiry form: validate, then — until a real form endpoint is set — open the visitor's email app with the details filled in. */
  var form = doc.getElementById('enquiry-form');
  if (form) {
    var statusBox = doc.getElementById('form-status');
    var setError = function (field, msg) {
      var wrap = field.closest('.field');
      var old = wrap.querySelector('.error');
      if (old) { old.remove(); }
      if (msg) {
        field.setAttribute('aria-invalid', 'true');
        var s = doc.createElement('span');
        s.className = 'error'; s.id = field.id + '-error'; s.textContent = msg;
        wrap.appendChild(s);
        field.setAttribute('aria-describedby', s.id);
      } else {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
      }
    };
    var check = function (field) {
      var v = field.value.trim(), msg = '';
      if (field.required && !v) { msg = 'Please fill this in.'; }
      else if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg = 'That email address doesn’t look right — check for typos.'; }
      else if (field.type === 'tel' && v && v.replace(/\D/g, '').length < 8) { msg = 'Please enter a full phone number, including area code.'; }
      setError(field, msg);
      return !msg;
    };
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    fields.forEach(function (f) { f.addEventListener('blur', function () { if (f.value || f.hasAttribute('aria-invalid')) { check(f); } }); });
    form.addEventListener('submit', function (e) {
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) {
        e.preventDefault();
        statusBox.textContent = 'Please check the ' + (bad.length === 1 ? 'field' : bad.length + ' fields') + ' marked below.';
        bad[0].focus();
        return;
      }
      var action = form.getAttribute('action');
      if (!action || action === '#') {
        e.preventDefault();
        var val = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
        var body = ['Name: ' + val('name'), 'Phone: ' + val('phone'), 'Email: ' + val('email'), 'Suburb: ' + val('suburb'), 'Job type: ' + val('job_type'), 'Photos or plans: ' + val('photos'), '', val('message')].join('\n');
        var to = form.getAttribute('data-mailto');
        location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Stone enquiry — ' + (val('job_type') || 'general')) + '&body=' + encodeURIComponent(body);
        statusBox.textContent = 'Your email app should now open with your enquiry ready to send. If it doesn’t, call us on 0407 299 259.';
      }
    });
  }
})();
