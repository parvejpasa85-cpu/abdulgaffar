/* =========================================================
   Abdul Gaffar — Digital Space
   Vanilla JS: cursor, navbar, mobile menu, scroll reveal, magnetic
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
      const hover = t.closest("a, button, .card-glow, .window");
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
            // stagger children slightly
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

  /* ---------- 5. Image fallback (only hide if truly broken) ---------- */
document.querySelectorAll(".moment img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.opacity = "0";   // পুরো hide না, শুধু fade out
    // fade out করলে নিচের span দেখাবে
  });
  img.addEventListener("load", () => {
    img.style.opacity = "1";
  });
});
  /* ---------- 6. Magnetic back-to-top button ---------- */
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

  /* ---------- 7. Subtle parallax on hero orbs ---------- */
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
  /* ---------- 8. Moments gallery — auto-load from folder + prefix ---------- */
(function initMoments() {
  const grid = document.getElementById("momentsGrid");
  const tabs = document.querySelectorAll(".moment-tabs .tab");
  if (!grid || !tabs.length) return;

  // কোন index গুলো "big" হবে (grid এ double width/height)
  const bigIndexes = [0, 5];

  function render(folder, prefix, count) {
    grid.innerHTML = "";
    for (let i = 1; i <= count; i++) {
      const src = `images/moments/${folder}/${prefix}${i}.jpg`;
      const isBig = bigIndexes.includes(i - 1);

      const div = document.createElement("div");
      div.className = "moment reveal" + (isBig ? " big" : "");

      const img = document.createElement("img");
      img.src = src;
      img.alt = `${prefix} ${i}`;
      img.loading = "lazy";
      img.onerror = () => { img.style.opacity = "0"; };
      img.onload = () => { img.style.opacity = "1"; };

      const span = document.createElement("span");
      span.textContent = `${prefix}${i}.jpg`;

      div.appendChild(img);
      div.appendChild(span);
      grid.appendChild(div);

      // reveal animation
      requestAnimationFrame(() => div.classList.add("in"));
    }
  }

  // Click handler
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      render(
        tab.dataset.folder,
        tab.dataset.prefix,
        parseInt(tab.dataset.count, 10)
      );
    });
  });

  // Initial render — first tab
  const first = tabs[0];
  render(first.dataset.folder, first.dataset.prefix, parseInt(first.dataset.count, 10));
})();
})();