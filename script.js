/* =========================================================
   Abdul Gaffar — Digital Space
   Vanilla JS: cursor, navbar, mobile menu, scroll reveal, gallery, music filter
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Custom cursor ---------- */
  const ring = document.getElementById("cursorRing");
  const dot = document.getElementById("cursorDot");
  const isFine = window.matchMedia("(pointer: fine)").matches;

  if (isFine && ring && dot) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";

      const t = e.target;
      const hover = t.closest("a, button, .card-glow, .window, .music-item, .cred-row");
      ring.classList.toggle("hover", !!hover);
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();
  } else {
    if (ring) ring.style.display = "none";
    if (dot) dot.style.display = "none";
  }

  /* ---------- 2. Navbar scroll state ---------- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. Mobile menu toggle ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.remove("open"))
    );
  }

  /* ---------- 4. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = Math.min(i * 40, 240);
            setTimeout(() => entry.target.classList.add("in"), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 5. Magnetic back-to-top button ---------- */
  const magnetic = document.querySelector(".magnetic");
  if (magnetic && isFine) {
    magnetic.addEventListener("mousemove", (e) => {
      const r = magnetic.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      magnetic.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    magnetic.addEventListener("mouseleave", () => {
      magnetic.style.transform = "translate(0, 0)";
    });
  }

  /* ---------- 6. Subtle parallax on hero orbs ---------- */
  if (isFine) {
    const orbs = document.querySelectorAll(".orb");
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    });
  }

  /* ---------- 7. Moments gallery — hardcoded file list ---------- */
  (function initMoments() {
    const grid = document.getElementById("momentsGrid");
    const tabs = document.querySelectorAll(".moment-tabs .tab");
    if (!grid || !tabs.length) return;

    const DATA = {
      rajshahi: {
        base: "assets/images/moments/rajshahi_photos/",
        files: [
          "rajshahi1.jpg",
          "rajshahi2.jpg",
          "rajshahi3.jpg",
          "rajshahi4.jpg",
          "rajshahi5.jpg",
          "rajshahi6.jpg",
        ],
      },
      visits: {
        base: "assets/images/moments/photos/visits/",
        files: [
          "5thaug24.jpeg",
          "bookfair1.jpeg",
          "bookfair2.jpeg",
          "bookfair3.jpeg",
          "chillox1.jpeg",
          "chillox2.jpeg",
          "chillox3.jpeg",
          "nationalmuseumvisit.jpeg",
          "raj-me_tanvir_mridul.jpeg",
          "tsc.jpeg",
        ],
      },
      hostel: {
        base: "assets/images/moments/photos/hostel_related/",
        files: [
          "hostel1.jpeg",
          "hostel2.jpeg",
          "hostel3.jpeg",
          "hostel4.jpeg",
          "hostel5.jpeg",
          "hostel6.jpeg",
          "hostel7.jpeg",
          "hostel8.jpeg",
        ],
      },
      college: {
        base: "assets/images/moments/photos/college_related/",
        files: [
          "clgfr1.jpeg",
          "clgfr2.jpeg",
          "clgfr3.jpeg",
          "clgfr4.jpeg",
          "clgfr5.jpeg",
          "clgfr6.jpeg",
          "clgfr7.jpeg",
          "clgfr8.jpeg",
          "clgfr9.jpeg",
          "clgfr10.jpeg",
        ],
      },
      self: {
        base: "assets/images/moments/photos/self/",
        files: [
          "me1.jpeg",
          "me2.jpeg",
          "me3.jpeg",
          "me4.jpeg",
          "me5.jpeg",
          "me6.jpeg",
          "me7.jpeg",
          "me8.jpeg",
          "me9.jpeg",
          "me10.jpeg",
          "me11.jpeg",
        ],
      },
      university: {
        base: "assets/images/moments/university_photos/",
        files: ["ruet1.jpg", "ruet2.jpg", "ruet3.jpg", "ruet4.jpg"],
      },
      ndc: {
        base: "assets/images/moments/college/",
        files: [
          "ndc1.jpg",
          "ndc2.jpg",
          "ndc3.jpg",
          "ndc4.jpg",
          "ndc5.jpg",
          "ndc6.jpg",
          "ndc7.JPG",
          "ndc8.jpg",
        ],
      },
    };

    function render(tabKey) {
      const data = DATA[tabKey];
      if (!data) return;

      grid.innerHTML = "";
      data.files.forEach((file) => {
        const src = data.base + file;

        const div = document.createElement("div");
        div.className = "moment reveal";

        const img = document.createElement("img");
        img.src = src;
        img.alt = file.replace(/\.[^.]+$/, "");
        img.loading = "lazy";
        img.onerror = () => {
          console.warn("[moment] missing:", src);
          img.style.opacity = "0";
        };
        img.onload = () => {
          img.style.opacity = "1";
        };

        const span = document.createElement("span");
        span.textContent = file;

        div.appendChild(img);
        div.appendChild(span);
        grid.appendChild(div);

        requestAnimationFrame(() => div.classList.add("in"));
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        render(tab.dataset.tab);
      });
    });

    render(tabs[0].dataset.tab);
  })();

  /* ---------- 8. Music filter (All / Bangla / English / Hindi / Urdu) ---------- */
  (function initMusicFilter() {
    const filterBtns = document.querySelectorAll(".music-filter .filter-btn");
    const items = document.querySelectorAll(".music-item");
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        items.forEach((item) => {
          const lang = item.dataset.lang;
          if (filter === "all" || lang === filter) {
            item.classList.remove("hidden");
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  })();
    /* ---------- 9. Hero carousel (coverflow) ---------- */
  (function initHeroCarousel() {
    const stage = document.getElementById("carouselStage");
    const dotsWrap = document.getElementById("carouselDots");
    if (!stage || !dotsWrap) return;

    // ⬇️ এখানে তোমার ৫টা ছবি দাও — 순서대로
    const IMAGES = [
      "assets/images/moments/abdul_gaffar_casual_picture.JPG",
      "assets/images/moments/abdulgaffar_formal_picture.jpg",
      "assets/images/moments/photos/self/me1.jpeg",
      "assets/images/moments/photos/self/me2.jpeg",
      "assets/images/moments/photos/self/me3.jpeg",
    ];

    const N = IMAGES.length;
    const slides = [];
    let currentIndex = 0;
    let autoTimer = null;

    // Create slides
    IMAGES.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.dataset.index = i;

      const img = document.createElement("img");
      img.src = src;
      img.alt = `Hero ${i + 1}`;
      img.draggable = false;

      slide.appendChild(img);
      stage.appendChild(slide);
      slides.push(slide);
    });

    // Create dots
    IMAGES.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to image ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll(".carousel-dot");

    // Position helpers
    function positionFor(offset) {
      // offset: 0 = center, ±1 = near, ±2 = far, else hidden
      const half = Math.floor(N / 2);
      let o = offset;
      // wrap into range [-half, half]
      while (o > half) o -= N;
      while (o < -half) o += N;

      if (o === 0) return "pos-center";
      if (o === 1) return "pos-near-right";
      if (o === -1) return "pos-near-left";
      if (o === 2) return "pos-far-right";
      if (o === -2) return "pos-far-left";
      return "pos-hidden";
    }

    function update() {
      slides.forEach((slide, i) => {
        let offset = i - currentIndex;
        // wrap offset to shortest path
        const half = Math.floor(N / 2);
        if (offset > half) offset -= N;
        if (offset < -half) offset += N;

        // remove all pos-* classes
        slide.className = "carousel-slide " + positionFor(offset);
      });

      dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
    }

    function next() {
      currentIndex = (currentIndex + 1) % N;
      update();
    }
    function prev() {
      currentIndex = (currentIndex - 1 + N) % N;
      update();
    }
    function goTo(i) {
      currentIndex = i;
      update();
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 3200);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }
    function restartAuto() {
      startAuto();
    }

    // Pause on hover (nice UX)
    const carousel = document.getElementById("heroCarousel");
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    // Keyboard arrows (accessibility)
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") { next(); restartAuto(); }
      if (e.key === "ArrowLeft") { prev(); restartAuto(); }
    });

    // Init
    update();
    startAuto();
  })();
})();