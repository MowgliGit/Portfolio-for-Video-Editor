//LOGOS
(() => {
  const track = document.getElementById("logoTrack");
  const belt = document.querySelector(".logo-belt");

  let x = 0; // current translateX (px)
  const speed = 15; // px per second
  let last = performance.now();
  let paused = false;

  // Pause/resume on hover (only for this belt)
  belt.addEventListener("mouseenter", () => (paused = true));
  belt.addEventListener("mouseleave", () => {
    paused = false;
    last = performance.now();
    requestAnimationFrame(tick);
  });

  // Wait for images so widths are correct, then fill + run
  const imgs = Array.from(track.querySelectorAll("img"));
  Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) =>
            img.addEventListener("load", res, { once: true })
          )
    )
  ).then(() => {
    prefill();
    requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
  });

  function gapPx() {
    const cs = getComputedStyle(track);
    return parseFloat(cs.columnGap || cs.gap || 0) || 0;
  }

  function trackWidth() {
    // sum widths + gaps for current children
    const children = Array.from(track.children);
    const total = children.reduce(
      (w, el) => w + el.getBoundingClientRect().width,
      0
    );
    const gaps = Math.max(0, children.length - 1) * gapPx();
    return total + gaps;
  }

  function beltWidth() {
    return belt.getBoundingClientRect().width;
  }

  // Duplicate children until the strip is at least 2× belt width (no empty space)
  function prefill() {
    let safety = 0;
    while (trackWidth() < beltWidth() * 2 && safety++ < 10) {
      Array.from(track.children).forEach((node) => {
        track.appendChild(node.cloneNode(true));
      });
    }
  }

  function onResize() {
    // If viewport grows, ensure we still have enough content
    prefill();
  }

  function tick(now) {
    if (paused) {
      last = now;
      return requestAnimationFrame(tick);
    }

    const dt = (now - last) / 1000;
    last = now;

    x -= speed * dt;
    track.style.transform = `translateX(${x}px)`;

    recycle();
    requestAnimationFrame(tick);
  }

  function recycle() {
    // Move as many logos as have fully left the view this frame (handles fast speeds)
    const g = gapPx();
    let first = track.firstElementChild;

    while (first) {
      const w = first.getBoundingClientRect().width;
      if (-x >= w + g) {
        track.appendChild(first);
        x += w + g; // keep visual position stable
        track.style.transform = `translateX(${x}px)`;
        first = track.firstElementChild; // check next
      } else {
        break;
      }
    }
  }
})();
//VIDEOS
// =======================
// 1) FIRST TRACK (top belt)
// =======================
(() => {
  const track = document.getElementById("logoFirstTrack");
  if (!track) return;

  const belt = track.closest(".video-belt");
  if (!belt) return;

  // 1. Wait for images so widths are correct
  const imgs = track.querySelectorAll("img");
  Promise.all(
    [...imgs].map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) =>
            img.addEventListener("load", res, { once: true })
          )
    )
  ).then(() => {
    // 2. If the row is too short, duplicate cards until it's long enough
    const gapPx = (() => {
      const cs = getComputedStyle(track);
      return parseFloat(cs.columnGap || cs.gap || 0) || 0;
    })();

    const measureTrack = () =>
      [...track.children].reduce(
        (w, el, i) => w + el.getBoundingClientRect().width + (i ? gapPx : 0),
        0
      );

    const beltW = belt.getBoundingClientRect().width;
    let safety = 0;
    while (measureTrack() < 2 * beltW && safety++ < 6) {
      [...track.children].forEach((node) =>
        track.appendChild(node.cloneNode(true))
      );
    }

    // 3. Animate + recycle
    let x = 0;
    const speed = 10; // px/s
    let last = performance.now();
    let paused = false;

    // If you WANT pause on hover, keep these 2 listeners:
    belt.addEventListener("mouseenter", () => {
      paused = true;
    });
    belt.addEventListener("mouseleave", () => {
      paused = false;
      last = performance.now();
      requestAnimationFrame(tick);
    });

    requestAnimationFrame(tick);

    function tick(now) {
      if (paused) {
        last = now;
        return requestAnimationFrame(tick);
      }

      const dt = (now - last) / 1000;
      last = now;

      x -= speed * dt;
      track.style.transform = `translateX(${x}px)`;

      recycle();
      requestAnimationFrame(tick);
    }

    function recycle() {
      let first = track.firstElementChild;
      while (first) {
        const w = first.getBoundingClientRect().width;
        if (-x >= w + gapPx) {
          track.appendChild(first);
          x += w + gapPx;
          track.style.transform = `translateX(${x}px)`;
          first = track.firstElementChild;
        } else break;
      }
    }
  });
})();

// =========================
// 2) SECOND TRACK (bottom belt)
// =========================
(() => {
  const track = document.getElementById("logoSecondTrack");
  if (!track) return;

  const belt = track.closest(".video-belt");
  if (!belt) return;

  // 1. Wait for images
  const imgs = track.querySelectorAll("img");
  Promise.all(
    [...imgs].map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) =>
            img.addEventListener("load", res, { once: true })
          )
    )
  ).then(() => {
    const gapPx = (() => {
      const cs = getComputedStyle(track);
      return parseFloat(cs.columnGap || cs.gap || 0) || 0;
    })();

    const measureTrack = () =>
      [...track.children].reduce(
        (w, el, i) => w + el.getBoundingClientRect().width + (i ? gapPx : 0),
        0
      );

    const beltW = belt.getBoundingClientRect().width;
    let safety = 0;
    while (measureTrack() < 2 * beltW && safety++ < 6) {
      [...track.children].forEach((node) =>
        track.appendChild(node.cloneNode(true))
      );
    }

    let x = 0;
    const speed = 20; // faster row
    let last = performance.now();
    let paused = false;

    belt.addEventListener("mouseenter", () => {
      paused = true;
    });
    belt.addEventListener("mouseleave", () => {
      paused = false;
      last = performance.now();
      requestAnimationFrame(tick);
    });

    requestAnimationFrame(tick);

    function tick(now) {
      if (paused) {
        last = now;
        return requestAnimationFrame(tick);
      }

      const dt = (now - last) / 1000;
      last = now;

      x -= speed * dt;
      track.style.transform = `translateX(${x}px)`;

      recycle();
      requestAnimationFrame(tick);
    }

    function recycle() {
      let first = track.firstElementChild;
      while (first) {
        const w = first.getBoundingClientRect().width;
        if (-x >= w + gapPx) {
          track.appendChild(first);
          x += w + gapPx;
          track.style.transform = `translateX(${x}px)`;
          first = track.firstElementChild;
        } else break;
      }
    }
  });
})();

// =========================
// 3) VIDEO PLAY / CLOSE
// =========================
(() => {
  document.addEventListener("click", function (e) {
    const playBtn = e.target.closest(".play");
    const closeBtn = e.target.closest(".close-btn");

    if (playBtn) {
      handlePlay(playBtn);
    }

    if (closeBtn) {
      handleClose(closeBtn);
    }
  });

  function handlePlay(playBtn) {
    const card = playBtn.closest(".video-card");
    if (!card) return;

    const videoId = card.dataset.videoId;
    const thumb = card.querySelector(".video-thumb");
    const iframeBox = card.querySelector(".iframe-box");
    const closeBtn = card.querySelector(".close-btn");

    if (!videoId || !thumb || !iframeBox || !closeBtn) return;

    // If already playing, do nothing
    if (iframeBox.firstChild) return;

    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube-nocookie.com/embed/" +
      videoId +
      "?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1";
    iframe.allow =
      "autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";

    iframeBox.innerHTML = "";
    iframeBox.appendChild(iframe);

    thumb.style.display = "none";
    iframeBox.style.display = "block";
    closeBtn.style.display = "block";
    playBtn.style.display = "none";
  }

  function handleClose(closeBtn) {
    const card = closeBtn.closest(".video-card");
    if (!card) return;

    const thumb = card.querySelector(".video-thumb");
    const iframeBox = card.querySelector(".iframe-box");
    const playBtn = card.querySelector(".play");

    if (!thumb || !iframeBox || !playBtn) return;

    iframeBox.innerHTML = "";
    iframeBox.style.display = "none";

    thumb.style.display = "block";
    playBtn.style.display = "grid";
    closeBtn.style.display = "none";
  }
})();
//code for counter
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".dice-num");
  const section = document.querySelector(".section-counter");

  if (!section || counters.length === 0) return;

  // Save target values and reset to 0
  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/\D/g, ""), 10) || 0;
    counter.dataset.target = target;
    counter.textContent = "0";
  });

  // Animate all counters
  const startCounters = () => {
    counters.forEach((counter) => animateCounter(counter));
  };

  const animateCounter = (el) => {
    const target = Number(el.dataset.target) || 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString(); // adds 1,068 format

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger when section is in view
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters();
          obs.unobserve(entry.target); // run only once
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
});
//ABOUT US CONTENT
// ABOUT PAGE – VIDEO PLAY LOGIC
