(function () {
  const cards = Array.from(document.querySelectorAll(".vcard"));
  const iconPlay = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const iconPause = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';

  function setTag(card, text) {
    const tag = card.querySelector(".mute-tag");
    if (tag) tag.textContent = text;
  }

  function pauseOthers(except) {
    cards.forEach((card) => {
      const v = card.querySelector("video");
      if (v && v !== except) {
        v.pause();
        v.muted = true;
        const btn = card.querySelector(".ctrl");
        if (btn) btn.innerHTML = iconPlay;
        setTag(card, "Toca para oír");
      }
    });
  }

  cards.forEach((card) => {
    const video = card.querySelector("video");
    const btn = card.querySelector(".ctrl");
    if (!video || !btn) return;

    const playMuted = () => {
      video.muted = true;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      btn.innerHTML = iconPause;
      setTag(card, "Toca para oír");
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (video.paused) {
        pauseOthers(video);
        playMuted();
        return;
      }
      if (video.muted) {
        video.muted = false;
        setTag(card, "Con audio");
        return;
      }
      video.pause();
      video.muted = true;
      btn.innerHTML = iconPlay;
      setTag(card, "Toca para oír");
    });

    video.addEventListener("click", () => btn.click());
  });

  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector("video");
      const btn = entry.target.querySelector(".ctrl");
      if (!video) return;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        if (video.paused) {
          video.muted = true;
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
          if (btn) btn.innerHTML = iconPause;
        }
      } else if (!video.paused && video.muted) {
        video.pause();
        if (btn) btn.innerHTML = iconPlay;
      }
    });
  }, { threshold: [0, 0.6, 1] });

  cards.forEach((c) => io.observe(c));
})();
