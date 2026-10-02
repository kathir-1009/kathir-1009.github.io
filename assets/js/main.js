/* =========================================================================
   Kathiravan K — Portfolio
   Vanilla JS, no dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var root  = document.documentElement;
  var body  = document.body;
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------
     1. Theme toggle
     ------------------------------------------------------------------ */
  var themeToggle = $("#themeToggle");

  function currentTheme() { return root.getAttribute("data-theme"); }

  function syncToggleLabel() {
    if (!themeToggle) return;
    var dark = currentTheme() === "dark";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggleLabel();
    });
  }
  syncToggleLabel();

  /* ------------------------------------------------------------------
     2. Mobile navigation
     ------------------------------------------------------------------ */
  var burger   = $("#burger");
  var nav      = $("#nav");
  var navScrim = $("#navScrim");

  function setNav(open) {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    body.classList.toggle("nav-open", open);
    if (navScrim) navScrim.hidden = !open;
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setNav(burger.getAttribute("aria-expanded") !== "true");
    });
  }
  if (navScrim) {
    navScrim.addEventListener("click", function () { setNav(false); });
  }

  // Close the drawer after tapping a link (but not before the scroll starts)
  $$(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () { setNav(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  // Reset the drawer if the viewport grows back to desktop
  var mqDesktop = window.matchMedia("(min-width: 881px)");
  (mqDesktop.addEventListener
    ? mqDesktop.addEventListener.bind(mqDesktop, "change")
    : mqDesktop.addListener.bind(mqDesktop))(
    function (e) { if (e.matches) setNav(false); }
  );

  /* ------------------------------------------------------------------
     3. Sticky header, progress bar & back-to-top
     ------------------------------------------------------------------ */
  var header    = $("#header");
  var progress  = $("#progressBar");
  var toTop     = $("#toTop");

  var ticking = false;

  function onScroll() {
    var y   = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-stuck", y > 12);

    if (progress) {
      progress.style.width = (max > 0 ? Math.min((y / max) * 100, 100) : 0) + "%";
    }

    if (toTop) toTop.classList.toggle("is-visible", y > 520);

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: mqReduce.matches ? "auto" : "smooth"
      });
    });
  }

  /* ------------------------------------------------------------------
     4. Scroll-spy — highlight the active section in the nav
     ------------------------------------------------------------------ */
  var navLinks = $$(".nav__link");
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return null;
      return document.querySelector(id);
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0
    });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ------------------------------------------------------------------
     5. Reveal-on-scroll
     ------------------------------------------------------------------ */
  var revealables = $$(".reveal");

  if (!("IntersectionObserver" in window) || mqReduce.matches) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. Animated stat counters
     ------------------------------------------------------------------ */
  function animateCount(el) {
    var target   = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix   = el.getAttribute("data-suffix") || "";

    if (isNaN(target)) return;

    if (mqReduce.matches) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    var duration = 1500;
    var start    = null;

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  var counters = $$("[data-count]");

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      var countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      counters.forEach(function (el) { countObs.observe(el); });
    }
  }

  /* ------------------------------------------------------------------
     7. Copy-to-clipboard for the email address
     ------------------------------------------------------------------ */
  var EMAIL = "kkathiravanmrk@gmail.com";

  function flashCopied(btn) {
    var original = btn.getAttribute("aria-label");
    btn.classList.add("is-copied");
    btn.setAttribute("aria-label", "Email address copied");

    setTimeout(function () {
      btn.classList.remove("is-copied");
      if (original) btn.setAttribute("aria-label", original);
    }, 1800);
  }

  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var text = btn.getAttribute("data-copy") || EMAIL;

      // Clipboard API (needs a secure context), with a legacy fallback
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { flashCopied(btn); },
          function () { legacyCopy(text, btn); }
        );
      } else {
        legacyCopy(text, btn);
      }
    });
  });

  function legacyCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-9999px;opacity:0";
    document.body.appendChild(ta);
    ta.select();

    try {
      document.execCommand("copy");
      flashCopied(btn);
    } catch (e) {
      window.location.href = "mailto:" + text;
    }
    document.body.removeChild(ta);
  }

  /* ------------------------------------------------------------------
     8. Contact form -> composes an email (no backend)
     ------------------------------------------------------------------ */
  var form = $("#contactForm");
  var note = $("#formNote");

  var VALIDATORS = {
    name: function (v) { return v.trim().length >= 2 || "Please enter your name."; },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.";
    },
    subject: function (v) { return v.trim().length >= 3 || "Please add a subject."; },
    message: function (v) { return v.trim().length >= 10 || "Please write a little more (10+ characters)."; }
  };

  function validateField(input) {
    var rule  = VALIDATORS[input.name];
    var errEl = $('[data-error-for="' + input.name + '"]', input.form);
    var result = rule ? rule(input.value) : true;

    if (result === true) {
      input.classList.remove("has-error");
      input.setAttribute("aria-invalid", "false");
      if (errEl) errEl.textContent = "";
    } else {
      input.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = result;
    }
    return result === true;
  }

  if (form) {
    // Validate a field once it has been touched, then live-update
    $$("input, textarea", form).forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        if (input.classList.contains("has-error")) validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var inputs   = $$("input[required], textarea[required]", form);
      var allValid = true;
      var firstBad = null;

      inputs.forEach(function (input) {
        if (!validateField(input)) {
          allValid = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (!allValid) {
        if (firstBad) firstBad.focus();
        if (note) {
          note.classList.remove("is-ok");
          note.textContent = "Please fix the highlighted fields.";
        }
        return;
      }

      var data = {
        name:    $('[name="name"]', form).value.trim(),
        email:   $('[name="email"]', form).value.trim(),
        subject: $('[name="subject"]', form).value.trim(),
        message: $('[name="message"]', form).value.trim()
      };

      var body =
        data.message + "\n\n" +
        "— — — — — — — — — — — — — — —\n" +
        "From:    " + data.name + "\n" +
        "Email:   " + data.email + "\n";

      var href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(data.subject) +
        "&body="    + encodeURIComponent(body);

      if (note) {
        note.classList.add("is-ok");
        note.textContent = "Opening your email app…";
      }

      window.location.href = href;
    });
  }

  /* ------------------------------------------------------------------
     9. Footer year
     ------------------------------------------------------------------ */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

})();
