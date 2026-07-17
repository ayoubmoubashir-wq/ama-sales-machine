/* =========================================================
   AMA Automations — script.js
   Vanilla JS only. No frameworks, no build step.
   Sections:
     1. Loader
     2. Particle network + mouse-reactive lighting
     3. Card spotlight hover effect
     4. Scroll reveal animations
     5. Animated counters
     6. Ripple button effect
     7. Guided consultation experience
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     1. LOADER
     Hides the loading screen once the page has fully loaded,
     with a small minimum-display time so it never flashes.
     ------------------------------------------------------- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    setTimeout(function () {
      loader.classList.add("is-hidden");
    }, 900);
  });

  /* -------------------------------------------------------
     2. PARTICLE NETWORK + MOUSE-REACTIVE LIGHTING
     A lightweight canvas particle field that drifts slowly
     and brightens / connects near the visitor's cursor.
     ------------------------------------------------------- */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let widthPx, heightPx;

  function resizeCanvas() {
    widthPx = canvas.width = window.innerWidth;
    heightPx = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(90, Math.floor((widthPx * heightPx) / 18000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * widthPx,
        y: Math.random() * heightPx,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, widthPx, heightPx);

    // Update + draw each particle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > widthPx) p.vx *= -1;
      if (p.y < 0 || p.y > heightPx) p.vy *= -1;

      // Distance to mouse — particles near the cursor glow brighter
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distToMouse = Math.hypot(dx, dy);
      const lit = Math.max(0, 1 - distToMouse / 220);

      ctx.beginPath();
      ctx.fillStyle = `rgba(0,229,255,${0.25 + lit * 0.6})`;
      ctx.arc(p.x, p.y, p.r + lit * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Connect nearby particles with faint lines
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener("resize", function () {
    resizeCanvas();
    createParticles();
  });
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* -------------------------------------------------------
     3. CARD SPOTLIGHT HOVER EFFECT
     Tracks the cursor position over each service card and
     feeds it into CSS custom properties (--x / --y) that
     the .card-spotlight radial-gradient reads from.
     ------------------------------------------------------- */
  document.querySelectorAll(".glow-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", e.clientX - rect.left + "px");
      card.style.setProperty("--y", e.clientY - rect.top + "px");
    });
  });

  /* -------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     Fades + rises any .reveal element into view the first
     time it enters the viewport.
     ------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* -------------------------------------------------------
     5. ANIMATED COUNTERS
     Counts each .stat-number upward from 0 to its target
     value once its stat card scrolls into view.
     ------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".stat-number").forEach(function (el) {
    counterObserver.observe(el);
  });

  /* -------------------------------------------------------
     6. RIPPLE BUTTON EFFECT
     Adds a Material-style expanding ripple from the click
     point on any .btn-ripple element.
     ------------------------------------------------------- */
  document.querySelectorAll(".btn-ripple").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 650);
    });
  });

  /* -------------------------------------------------------
     7. GUIDED CONSULTATION EXPERIENCE
     A scripted, non-AI question flow presented as a chat.
     Answers are reviewed, then POSTed as JSON to the n8n
     webhook defined in config.js.
     ------------------------------------------------------- */
  const questions = [
    { key: "Name", text: "Hi! Let's get your automation plan started. What's your name?" },
    { key: "Country", text: "Great to meet you. What country is your business based in?" },
    { key: "Business Type", text: "What kind of business do you run?" },
    { key: "Automation Needed", text: "What would you most like to automate?" },
    { key: "Current Tools", text: "What tools do you currently use day to day (CRM, calendar, etc.)?" },
    { key: "Monthly Leads", text: "Roughly how many leads or clients do you handle per month?" },
    { key: "Budget", text: "What budget range are you working with?" },
    { key: "Preferred Contact", text: "Last one — how should we reach you? (email or phone)" }
  ];

  let currentStep = 0;
  const answers = {};

  const consultation = document.getElementById("consultation");
  const chatPanel = document.getElementById("chatPanel");
  const reviewPanel = document.getElementById("reviewPanel");
  const successPanel = document.getElementById("successPanel");
  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const reviewList = document.getElementById("reviewList");
  const reviewStatus = document.getElementById("reviewStatus");

  function openConsultation() {
    consultation.hidden = false;
    document.body.style.overflow = "hidden";
    resetConsultation();
    askQuestion(0);
  }

  function closeConsultation() {
    consultation.hidden = true;
    document.body.style.overflow = "";
  }

  function resetConsultation() {
    currentStep = 0;
    for (const k in answers) delete answers[k];
    chatWindow.innerHTML = "";
    chatPanel.hidden = false;
    reviewPanel.hidden = true;
    successPanel.hidden = true;
    chatInput.disabled = false;
    chatInput.value = "";
    updateProgress(0);
  }

  function updateProgress(step) {
    const pct = ((step + 1) / questions.length) * 100;
    progressFill.style.width = Math.min(pct, 100) + "%";
    progressLabel.textContent = step < questions.length
      ? `Question ${step + 1} of ${questions.length}`
      : "Almost done";
  }

  // Renders a bot message with a brief "typing" indicator first,
  // then a character-by-character typing animation for the text.
  function askQuestion(index) {
    updateProgress(index);
    const typingBubble = document.createElement("div");
    typingBubble.className = "msg bot typing";
    typingBubble.innerHTML = "<span></span><span></span><span></span>";
    chatWindow.appendChild(typingBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(function () {
      typingBubble.remove();
      const bubble = document.createElement("div");
      bubble.className = "msg bot";
      chatWindow.appendChild(bubble);
      typeText(bubble, questions[index].text);
    }, 500);
  }

  // Simple typewriter effect: reveals one character at a time.
  function typeText(el, text) {
    let i = 0;
    chatInput.disabled = true;
    const speed = 18;
    (function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        i++;
        setTimeout(type, speed);
      } else {
        chatInput.disabled = false;
        chatInput.focus();
      }
    })();
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = chatInput.value.trim();
    if (!value || chatInput.disabled) return;

    const userBubble = document.createElement("div");
    userBubble.className = "msg user";
    userBubble.textContent = value;
    chatWindow.appendChild(userBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    answers[questions[currentStep].key] = value;
    chatInput.value = "";
    currentStep++;

    if (currentStep < questions.length) {
      setTimeout(function () {
        askQuestion(currentStep);
      }, 350);
    } else {
      chatInput.disabled = true;
      setTimeout(showReview, 500);
    }
  });

  function showReview() {
    reviewList.innerHTML = "";
    questions.forEach(function (q) {
      const li = document.createElement("li");
      li.innerHTML = `<span>${q.key}</span><span>${escapeHtml(answers[q.key] || "—")}</span>`;
      reviewList.appendChild(li);
    });
    reviewStatus.textContent = "";
    chatPanel.hidden = true;
    reviewPanel.hidden = false;
    updateProgress(questions.length - 1);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  document.getElementById("editAnswers").addEventListener("click", function () {
    reviewPanel.hidden = true;
    chatPanel.hidden = false;
    chatInput.disabled = false;
    chatInput.focus();
  });

  // Sends the collected answers to the n8n webhook defined in
  // config.js. Falls back to a friendly demo message if the
  // webhook is unreachable or hasn't been configured yet.
  document.getElementById("submitAnswers").addEventListener("click", async function () {
    reviewStatus.textContent = "Sending…";
    try {
      if (!WEBHOOK_URL || WEBHOOK_URL === "YOUR_N8N_WEBHOOK") {
        throw new Error("Webhook not configured");
      }
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers)
      });
      reviewStatus.textContent = "Sent successfully.";
    } catch (err) {
      reviewStatus.textContent = "Demo mode — add your webhook in config.js to send for real.";
    }
    setTimeout(function () {
      reviewPanel.hidden = true;
      successPanel.hidden = false;
    }, 700);
  });

  document.getElementById("returnHome").addEventListener("click", closeConsultation);
  document.getElementById("closeConsultation").addEventListener("click", closeConsultation);
  consultation.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeConsultation();
  });

  document.querySelectorAll("[data-open-consultation]").forEach(function (btn) {
    btn.addEventListener("click", openConsultation);
  });
})();
