(function () {
  const memory = new Map();

  const store = {
    get(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        return memory.has(key) ? memory.get(key) : null;
      }
    },
    set(key, value) {
      memory.set(key, value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        /* Private mode and full storage still keep the session in memory. */
      }
    }
  };

  document.querySelectorAll(".field-error, #quiz-error").forEach(function (el) {
    el.setAttribute("aria-live", "polite");
  });

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopNav = window.matchMedia("(min-width: 860px)");

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: motion.matches ? "auto" : "smooth", block: "start" });
  }

  const header = document.querySelector(".header-bar");
  const progress = document.getElementById("progress");
  const navPanel = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...navPanel.querySelectorAll("a")];

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function syncNavInert() {
    const open = navPanel.classList.contains("is-open");
    navPanel.inert = !desktopNav.matches && !open;
  }

  function syncLock() {
    const pause = document.getElementById("pause");
    const locked = navPanel.classList.contains("is-open") || (pause && !pause.hidden);
    document.body.classList.toggle("lock", locked);
  }

  function closeMenu(restore) {
    const wasOpen = navPanel.classList.contains("is-open");
    navPanel.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    syncNavInert();
    syncLock();
    if (wasOpen && restore) navToggle.focus();
  }

  function openMenu() {
    navPanel.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    syncNavInert();
    syncLock();
    const first = navPanel.querySelector("a");
    if (first) first.focus();
  }

  navToggle.addEventListener("click", function () {
    if (navPanel.classList.contains("is-open")) closeMenu(false);
    else openMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu(false);
    });
  });

  desktopNav.addEventListener("change", function () {
    if (desktopNav.matches) closeMenu(false);
    syncNavInert();
  });
  syncNavInert();

  document.addEventListener("keydown", function (event) {
    if (!navPanel.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeMenu(true);
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = [navToggle, ...navLinks];
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const sections = ["conviction", "sanctuary", "community", "partner"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const current = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          const on = link.getAttribute("href") === "#" + entry.target.id;
          if (on) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (section) { current.observe(section); });

    if (!motion.matches) {
      const reveal = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.add("reveal");
        reveal.observe(el);
      });
    }
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];

  function showPanel(id, focusTab) {
    tabs.forEach(function (tab) {
      const on = tab.getAttribute("aria-controls") === id;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      if (on && focusTab) tab.focus();
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== id;
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      showPanel(tab.getAttribute("aria-controls"), false);
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      showPanel(tabs[next].getAttribute("aria-controls"), true);
    });
  });

  const pause = document.getElementById("pause");
  const pauseDialog = pause.querySelector(".pause-dialog");
  let pauseReturn = null;

  function openPause() {
    pauseReturn = document.activeElement;
    pause.hidden = false;
    syncLock();
    pauseDialog.focus();
  }

  function closePause(restore) {
    pause.hidden = true;
    syncLock();
    if (restore && pauseReturn && typeof pauseReturn.focus === "function") pauseReturn.focus();
  }

  document.getElementById("open-pause").addEventListener("click", openPause);
  document.getElementById("pause-close").addEventListener("click", function () {
    closePause(true);
  });
  document.getElementById("pause-enter").addEventListener("click", function () {
    closePause(false);
    showPanel("panel-evaluation", false);
    scrollToEl(document.getElementById("sanctuary"));
  });

  pause.addEventListener("keydown", function (event) {
    if (pause.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePause(true);
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = [...pauseDialog.querySelectorAll("button")];
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === pauseDialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const QUESTIONS = [
    { theme: "attention", prompt: "I turn toward God before I turn toward my phone." },
    { theme: "scripture", prompt: "Scripture has a real place in my week." },
    { theme: "awareness", prompt: "I notice when hurry is crowding out prayer." },
    { theme: "rest", prompt: "I can rest without calling rest a failure." },
    { theme: "community", prompt: "Someone else knows how my faith is actually going." },
    { theme: "digital", prompt: "My screens leave room for the people in the room." },
    { theme: "gratitude", prompt: "I practice gratitude, not only when life is easy." },
    { theme: "vocation", prompt: "I can name how my work or studies belong to God." }
  ];

  const CHOICES = [
    { value: 1, label: "Rarely" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Often" },
    { value: 4, label: "Steadily" }
  ];

  const PRACTICES = {
    attention: {
      title: "The first turning",
      text: "Tomorrow, pray or sit in silence before you touch your phone. Ten minutes counts."
    },
    scripture: {
      title: "One living page",
      text: "Choose a single psalm and read it slowly this week, before messages, three times."
    },
    awareness: {
      title: "A midday question",
      text: "At the middle of the day, ask where hurry replaced prayer. Then take two quiet minutes."
    },
    rest: {
      title: "An hour without proving anything",
      text: "Put one unhurried hour on the calendar. Do not fill it with catch-up. Let it be received."
    },
    community: {
      title: "Tell one true thing",
      text: "This week, tell one trusted person how your walk with God is actually going."
    },
    digital: {
      title: "A dock for the device",
      text: "During your next meal and your next prayer, put the phone in another room."
    },
    gratitude: {
      title: "One sentence at night",
      text: "Before sleep, write a single sentence of thanks specific enough that yesterday’s would not do."
    },
    vocation: {
      title: "Offer the work",
      text: "In the morning, name the task in front of you and offer it to God in one sentence."
    }
  };

  const THEME_LABEL = {
    attention: "Attention",
    scripture: "Scripture",
    awareness: "Awareness of hurry",
    rest: "Rest",
    community: "Honest company",
    digital: "Digital boundaries",
    gratitude: "Gratitude",
    vocation: "Work offered to God"
  };

  const PORTRAITS = [
    {
      max: 2.2,
      name: "Awakening",
      text: "You are at the start of a turn. This is not a verdict. It is a doorway. God is not asking you to become impressive. He is asking you to come back."
    },
    {
      max: 3.15,
      name: "Returning",
      text: "Some rhythms are already yours. The work now is to protect them. Hurry will unmake a good intention if the day has no edges."
    },
    {
      max: 4,
      name: "Rooted",
      text: "Your days have a center. Stay tender. The next obedience may be to walk with someone who is just beginning, without rushing them."
    }
  ];

  const quizTitle = document.getElementById("quiz-title");
  const quizChoices = document.getElementById("quiz-choices");
  const quizCount = document.getElementById("quiz-count");
  const quizBar = document.getElementById("quiz-bar");
  const quizError = document.getElementById("quiz-error");
  const quizStep = document.getElementById("quiz-step");
  const quizResult = document.getElementById("quiz-result");
  const quizBack = document.getElementById("quiz-back");
  const quizNext = document.getElementById("quiz-next");

  let answers = [];
  let quizIndex = 0;

  function validAnswers(list) {
    return Array.isArray(list) && list.length <= QUESTIONS.length && list.every(function (n) {
      return n === 1 || n === 2 || n === 3 || n === 4;
    });
  }

  function compute(list) {
    const totals = {};
    const counts = {};
    QUESTIONS.forEach(function (question, index) {
      totals[question.theme] = (totals[question.theme] || 0) + list[index];
      counts[question.theme] = (counts[question.theme] || 0) + 1;
    });
    let lowest = null;
    Object.keys(totals).forEach(function (theme) {
      const avg = totals[theme] / counts[theme];
      if (!lowest || avg < lowest.avg) lowest = { theme: theme, avg: avg };
    });
    const mean = list.reduce(function (sum, value) { return sum + value; }, 0) / list.length;
    const portrait = PORTRAITS.find(function (item) { return mean <= item.max; }) || PORTRAITS[PORTRAITS.length - 1];
    return {
      portrait: portrait.name,
      portraitText: portrait.text,
      theme: lowest.theme,
      practice: PRACTICES[lowest.theme]
    };
  }

  function saveQuiz(done) {
    store.set("rp.quiz", { answers: answers.slice(), index: quizIndex, done: done });
  }

  function renderQuestion(focus) {
    const question = QUESTIONS[quizIndex];
    quizTitle.textContent = question.prompt;
    quizCount.textContent = (quizIndex + 1) + " of " + QUESTIONS.length;
    quizBar.style.width = ((quizIndex / QUESTIONS.length) * 100) + "%";
    quizChoices.replaceChildren();
    CHOICES.forEach(function (choice) {
      const label = document.createElement("label");
      label.className = "choice";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "journey";
      input.value = String(choice.value);
      if (answers[quizIndex] === choice.value) input.checked = true;
      const span = document.createElement("span");
      span.textContent = choice.label;
      label.append(input, span);
      quizChoices.append(label);
    });
    quizError.hidden = true;
    quizBack.hidden = quizIndex === 0;
    quizNext.textContent = quizIndex === QUESTIONS.length - 1 ? "See my portrait" : "Continue";
    if (focus) quizTitle.focus();
  }

  function showResult(focus) {
    const result = compute(answers);
    quizStep.hidden = true;
    quizResult.hidden = false;
    quizBar.style.width = "100%";
    quizCount.textContent = "Complete";
    quizResult.replaceChildren();

    const kicker = document.createElement("p");
    kicker.className = "eyebrow portrait-kicker";
    kicker.textContent = "Your portrait";

    const title = document.createElement("h4");
    title.className = "portrait-name";
    title.id = "portrait-title";
    title.tabIndex = -1;
    title.textContent = result.portrait;

    const copy = document.createElement("p");
    copy.textContent = result.portraitText;

    const thinLabel = document.createElement("p");
    thinLabel.className = "thin-label";
    thinLabel.textContent = "The thinnest place";

    const thinName = document.createElement("p");
    thinName.className = "thin-name";
    thinName.textContent = THEME_LABEL[result.theme];

    const practiceTitle = document.createElement("p");
    practiceTitle.className = "thin-label";
    practiceTitle.textContent = result.practice.title;

    const practice = document.createElement("p");
    practice.textContent = result.practice.text;

    const actions = document.createElement("div");
    actions.className = "result-actions";

    const shape = document.createElement("button");
    shape.type = "button";
    shape.className = "btn btn-primary";
    shape.textContent = "Shape this into my day";
    shape.addEventListener("click", function () {
      applyPortraitToPlan(result.theme);
      showPanel("panel-plan", false);
      scrollToEl(document.getElementById("panel-plan"));
    });

    const again = document.createElement("button");
    again.type = "button";
    again.className = "btn btn-text";
    again.textContent = "Begin again";
    again.addEventListener("click", function () {
      answers = [];
      quizIndex = 0;
      quizResult.hidden = true;
      quizStep.hidden = false;
      saveQuiz(false);
      renderQuestion(true);
    });

    actions.append(shape, again);

    if (result.theme === "community") {
      const wall = document.createElement("button");
      wall.type = "button";
      wall.className = "btn btn-ghost";
      wall.textContent = "Visit the wall";
      wall.addEventListener("click", function () {
        scrollToEl(document.getElementById("community"));
      });
      actions.append(wall);
    }

    quizResult.append(kicker, title, copy, thinLabel, thinName, practiceTitle, practice, actions);
    if (focus) title.focus();
    saveQuiz(true);
  }

  quizNext.addEventListener("click", function () {
    const selected = quizChoices.querySelector("input:checked");
    if (!selected) {
      quizError.hidden = false;
      quizError.textContent = "Choose the line that feels most true.";
      return;
    }
    answers[quizIndex] = Number(selected.value);
    if (quizIndex === QUESTIONS.length - 1) {
      showResult(true);
      return;
    }
    quizIndex += 1;
    saveQuiz(false);
    renderQuestion(true);
  });

  quizBack.addEventListener("click", function () {
    if (quizIndex === 0) return;
    quizIndex -= 1;
    saveQuiz(false);
    renderQuestion(true);
  });

  const savedQuiz = store.get("rp.quiz");
  if (savedQuiz && validAnswers(savedQuiz.answers) && savedQuiz.done && savedQuiz.answers.length === QUESTIONS.length) {
    answers = savedQuiz.answers.slice();
    showResult(false);
  } else if (savedQuiz && validAnswers(savedQuiz.answers)) {
    answers = savedQuiz.answers.slice();
    quizIndex = Math.min(savedQuiz.index || 0, QUESTIONS.length - 1);
    renderQuestion(false);
  } else {
    renderQuestion(false);
  }

  const wake = document.getElementById("wake");
  const focus = document.getElementById("focus");
  const planFields = {
    stillness: document.getElementById("opt-stillness"),
    scripture: document.getElementById("opt-scripture"),
    examen: document.getElementById("opt-examen"),
    gratitude: document.getElementById("opt-gratitude"),
    dock: document.getElementById("opt-dock")
  };
  const timeline = document.getElementById("timeline");
  const planNote = document.getElementById("plan-note");
  const planStatus = document.getElementById("plan-status");

  function formatTime(total) {
    const mins = ((total % 1440) + 1440) % 1440;
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 || 12;
    return h12 + ":" + String(m).padStart(2, "0") + " " + suffix;
  }

  function formatDur(mins) {
    if (mins % 60 === 0) {
      const hours = mins / 60;
      return hours === 1 ? "1 hour" : hours + " hours";
    }
    return mins + " min";
  }

  function readPlan() {
    return {
      wake: Number(wake.value),
      focus: Number(focus.value),
      stillness: planFields.stillness.checked,
      scripture: planFields.scripture.checked,
      examen: planFields.examen.checked,
      gratitude: planFields.gratitude.checked,
      dock: planFields.dock.checked
    };
  }

  function buildPlan(state) {
    const blocks = [];
    let cursor = state.wake;
    function add(mins, title, kind) {
      blocks.push({ start: cursor, mins: mins, title: title, kind: kind });
      cursor += mins;
    }
    add(10, "Wake and rise", "life");
    if (state.stillness) add(20, "Stillness, before any screen", "spirit");
    if (state.scripture) add(15, "Scripture", "spirit");
    add(25, "Prepare for work or class", "life");
    add(state.focus, "Focused work or study", "work");
    if (state.examen) add(10, "Midday examen", "spirit");
    add(40, "A real meal", "life");
    add(state.focus, "Afternoon work or study", "work");
    add(20, "Close the workday", "life");
    if (state.gratitude) add(10, "Evening gratitude", "spirit");
    if (state.dock) {
      const dockAt = Math.max(cursor + 15, 21 * 60 + 30);
      blocks.push({ start: dockAt, mins: 0, title: "Phone on the dock for the night", kind: "spirit" });
    }
    return blocks;
  }

  function renderPlan(message) {
    const state = readPlan();
    const blocks = buildPlan(state);
    timeline.replaceChildren();
    blocks.forEach(function (block) {
      const item = document.createElement("li");
      item.className = "block";
      const time = document.createElement("time");
      time.textContent = formatTime(block.start);
      const body = document.createElement("div");
      const title = document.createElement("p");
      title.className = "block-title";
      title.textContent = block.title;
      body.append(title);
      if (block.mins) {
        const dur = document.createElement("p");
        dur.className = "block-dur";
        dur.textContent = formatDur(block.mins);
        body.append(dur);
      }
      const dot = document.createElement("span");
      dot.className = "dot dot-" + block.kind;
      dot.setAttribute("aria-hidden", "true");
      item.append(time, body, dot);
      timeline.append(item);
    });

    const commitment = store.get("rp.commitment");
    if (commitment === "sabbath") {
      planNote.hidden = false;
      planNote.textContent = "This week also includes a Sabbath scroll: one evening with the feeds closed.";
    } else {
      planNote.hidden = true;
      planNote.textContent = "";
    }

    if (message) planStatus.textContent = message;
    store.set("rp.plan", state);
  }

  const savedPlan = store.get("rp.plan");
  if (savedPlan && typeof savedPlan === "object") {
    if (wake.querySelector('option[value="' + savedPlan.wake + '"]')) wake.value = String(savedPlan.wake);
    if (focus.querySelector('option[value="' + savedPlan.focus + '"]')) focus.value = String(savedPlan.focus);
    Object.keys(planFields).forEach(function (key) {
      if (typeof savedPlan[key] === "boolean") planFields[key].checked = savedPlan[key];
    });
  }

  document.getElementById("plan-form").addEventListener("change", function (event) {
    const commitment = store.get("rp.commitment");
    if (commitment === "stillness" && !planFields.stillness.checked) clearCommitment();
    if (commitment === "dock" && !planFields.dock.checked) clearCommitment();
    renderPlan("Your day is kept on this device.");
    if (event.target && event.target.id) {
      /* status already set */
    }
  });

  function applyPortraitToPlan(theme) {
    const map = {
      attention: { key: "stillness", note: "Morning stillness is on, so the first minutes are kept." },
      scripture: { key: "scripture", note: "Scripture is placed at the start of your day." },
      awareness: { key: "examen", note: "A midday examen is on your plan." },
      digital: { key: "dock", note: "The night dock is on your plan." },
      gratitude: { key: "gratitude", note: "Evening gratitude closes your plan." },
      vocation: { key: "stillness", note: "Begin with stillness, and offer the day’s work there." },
      rest: { key: null, note: "Your portrait asks for an hour that proves nothing. Shorten a focus block if the day is too full." },
      community: { key: null, note: "Your portrait asks for honest company. When you are ready, leave a note on the wall." }
    };
    const item = map[theme];
    if (item && item.key && planFields[item.key]) planFields[item.key].checked = true;
    renderPlan(item ? item.note : "Your day is kept on this device.");
  }

  const practiceNames = {
    stillness: "The First Hour",
    dock: "The Dock",
    sabbath: "The Sabbath Scroll"
  };
  const practiceButtons = [...document.querySelectorAll(".practice")];
  const commitmentEl = document.getElementById("commitment");

  function paintCommitment(id) {
    practiceButtons.forEach(function (button) {
      const on = button.dataset.practice === id;
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.textContent = on ? "Keeping this" : "Keep this for seven days";
    });
    if (!id) {
      commitmentEl.hidden = true;
      commitmentEl.textContent = "";
      return;
    }
    commitmentEl.hidden = false;
    commitmentEl.textContent = "This week you are keeping " + practiceNames[id] + ".";
  }

  function clearCommitment() {
    store.set("rp.commitment", null);
    paintCommitment(null);
    renderPlan("Your day is kept on this device.");
  }

  function setCommitment(id) {
    store.set("rp.commitment", id);
    paintCommitment(id);
    if (id === "stillness") planFields.stillness.checked = true;
    if (id === "dock") planFields.dock.checked = true;
    const note = id === "sabbath"
      ? "The Sabbath scroll is kept for this week: one evening with the feeds closed."
      : practiceNames[id] + " is on your day.";
    renderPlan(note);
  }

  practiceButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = button.dataset.practice;
      if (store.get("rp.commitment") === id) clearCommitment();
      else setCommitment(id);
    });
  });

  const savedCommitment = store.get("rp.commitment");
  if (practiceNames[savedCommitment]) paintCommitment(savedCommitment);
  renderPlan(savedPlan ? "Your day is kept on this device." : "Your day updates as you choose. It stays on this device.");

  const KIND_LABEL = {
    prayer: "Prayer",
    gratitude: "Gratitude",
    accountability: "Accountability"
  };

  const wallForm = document.getElementById("wall-form");
  const wallFeed = document.getElementById("wall-feed");
  const wallEmpty = document.getElementById("wall-empty");
  const wallText = document.getElementById("wall-text");
  const wallCount = document.getElementById("wall-count");
  const wallKind = document.getElementById("wall-kind");
  const wallName = document.getElementById("wall-name");
  let wallFilter = "all";

  function createNote(entry) {
    const article = document.createElement("article");
    article.className = "note";
    article.dataset.kind = entry.kind;
    const text = document.createElement("p");
    text.className = "note-text";
    text.textContent = entry.text;
    const meta = document.createElement("p");
    meta.className = "note-meta";
    const name = document.createElement("span");
    name.className = "note-name";
    name.textContent = entry.name;
    const tag = document.createElement("span");
    tag.className = "note-tag";
    tag.textContent = KIND_LABEL[entry.kind] || entry.kind;
    const when = document.createElement("span");
    when.className = "note-when";
    when.textContent = entry.when;
    meta.append(name, tag, when);
    article.append(text, meta);
    return article;
  }

  function applyWallFilter() {
    const notes = [...wallFeed.querySelectorAll(".note")];
    let shown = 0;
    notes.forEach(function (note) {
      const ok = wallFilter === "all" || note.dataset.kind === wallFilter;
      note.hidden = !ok;
      if (ok) shown += 1;
    });
    wallEmpty.hidden = shown !== 0;
  }

  const savedNotes = store.get("rp.wall");
  if (Array.isArray(savedNotes)) {
    savedNotes.forEach(function (entry) {
      if (!entry || !KIND_LABEL[entry.kind] || typeof entry.text !== "string") return;
      wallFeed.prepend(createNote(entry));
    });
  }

  wallText.addEventListener("input", function () {
    wallCount.textContent = wallText.value.length + " / 180";
  });

  document.querySelectorAll(".filter").forEach(function (button) {
    button.addEventListener("click", function () {
      wallFilter = button.dataset.filter;
      document.querySelectorAll(".filter").forEach(function (item) {
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      applyWallFilter();
    });
  });

  function setFieldError(input, errorId, message) {
    const error = document.getElementById(errorId);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.hidden = false;
      error.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      error.hidden = true;
      error.textContent = "";
    }
  }

  wallForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const kindOk = Boolean(KIND_LABEL[wallKind.value]);
    const text = wallText.value.trim();
    setFieldError(wallKind, "wall-kind-error", kindOk ? "" : "Choose prayer, gratitude, or accountability.");
    setFieldError(wallText, "wall-text-error", text.length < 8 ? "Write at least a short sentence." : "");
    if (!kindOk || text.length < 8) {
      (kindOk ? wallText : wallKind).focus();
      return;
    }
    const entry = {
      name: wallName.value.trim() || "A friend",
      kind: wallKind.value,
      text: text,
      when: "Just now"
    };
    const existing = Array.isArray(store.get("rp.wall")) ? store.get("rp.wall") : [];
    existing.push(entry);
    store.set("rp.wall", existing.slice(-40));
    wallFeed.prepend(createNote(entry));
    wallForm.reset();
    wallCount.textContent = "0 / 180";
    setFieldError(wallKind, "wall-kind-error", "");
    setFieldError(wallText, "wall-text-error", "");
    applyWallFilter();
    const first = wallFeed.querySelector(".note");
    if (first) first.scrollIntoView({ behavior: motion.matches ? "auto" : "smooth", block: "nearest" });
  });

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showSuccess(form, success, textId, message) {
    document.getElementById(textId).textContent = message;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  function bindRevise(form, success, buttonId) {
    document.getElementById(buttonId).addEventListener("click", function () {
      success.hidden = true;
      form.hidden = false;
      const first = form.querySelector("input, select, textarea");
      if (first) first.focus();
    });
  }

  const prayForm = document.getElementById("pray-form");
  const praySuccess = document.getElementById("pray-success");
  prayForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("pray-email");
    const name = document.getElementById("pray-name").value.trim();
    const ok = EMAIL.test(email.value.trim());
    setFieldError(email, "pray-email-error", ok ? "" : "Add an email so the notes know where to go.");
    if (!ok) {
      email.focus();
      return;
    }
    const list = Array.isArray(store.get("rp.pray")) ? store.get("rp.pray") : [];
    list.push({ name: name, email: email.value.trim() });
    store.set("rp.pray", list);
    const who = name ? name : "friend";
    showSuccess(
      prayForm,
      praySuccess,
      "pray-success-text",
      "Thank you, " + who + ". You are on the intercessory list. The notes will stay short. Kept on this device."
    );
  });
  bindRevise(prayForm, praySuccess, "pray-revise");

  const FUND_LABEL = {
    hosting: "website hosting",
    resources: "digital resources",
    materials: "material production"
  };
  const giveForm = document.getElementById("give-form");
  const giveSuccess = document.getElementById("give-success");
  const giveAmount = document.getElementById("give-amount");
  const giveSummary = document.getElementById("give-summary");
  const fundButtons = [...document.querySelectorAll(".fund")];
  const presetButtons = [...document.querySelectorAll(".preset")];
  let selectedFund = null;

  function money(value) {
    const hasCents = Math.round(value * 100) % 100 !== 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  function currentRhythm() {
    const selected = giveForm.querySelector('input[name="rhythm"]:checked');
    return selected ? selected.value : "once";
  }

  function parsedAmount() {
    const raw = giveAmount.value.replace(/[$,\s]/g, "");
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : NaN;
  }

  function updateSummary() {
    const amount = parsedAmount();
    presetButtons.forEach(function (button) {
      const match = amount === Number(button.dataset.amount);
      button.setAttribute("aria-pressed", match ? "true" : "false");
    });
    if (!selectedFund || amount === null || Number.isNaN(amount)) {
      giveSummary.textContent = "Choose a gift to see it gathered here.";
      return;
    }
    const rhythm = currentRhythm() === "monthly" ? "monthly partnership" : "one-time gift";
    giveSummary.textContent = "A " + rhythm + " of " + money(amount) + " for " + FUND_LABEL[selectedFund] + ".";
  }

  fundButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedFund = button.dataset.fund;
      fundButtons.forEach(function (item) {
        const on = item === button;
        item.setAttribute("aria-pressed", on ? "true" : "false");
        item.querySelector(".fund-state").textContent = on ? "Selected" : "";
      });
      giveAmount.value = button.dataset.amount;
      const rhythm = giveForm.querySelector('input[name="rhythm"][value="' + button.dataset.rhythm + '"]');
      if (rhythm) rhythm.checked = true;
      document.getElementById("give-fund-error").hidden = true;
      updateSummary();
    });
  });

  presetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      giveAmount.value = button.dataset.amount;
      setFieldError(giveAmount, "give-amount-error", "");
      updateSummary();
    });
  });

  giveAmount.addEventListener("input", updateSummary);
  giveForm.querySelectorAll('input[name="rhythm"]').forEach(function (input) {
    input.addEventListener("change", updateSummary);
  });

  giveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const fundError = document.getElementById("give-fund-error");
    const amount = parsedAmount();
    const name = document.getElementById("give-name");
    const email = document.getElementById("give-email");
    let firstInvalid = null;

    if (!selectedFund) {
      fundError.hidden = false;
      fundError.textContent = "Choose hosting, digital resources, or material production.";
      firstInvalid = fundButtons[0];
    } else {
      fundError.hidden = true;
    }

    const amountOk = typeof amount === "number" && amount >= 1 && amount <= 1000000;
    setFieldError(giveAmount, "give-amount-error", amountOk ? "" : "Enter an amount of at least $1.");
    if (!amountOk && !firstInvalid) firstInvalid = giveAmount;

    const nameOk = name.value.trim().length >= 2;
    setFieldError(name, "give-name-error", nameOk ? "" : "Add the name that should accompany the pledge.");
    if (!nameOk && !firstInvalid) firstInvalid = name;

    const emailOk = EMAIL.test(email.value.trim());
    setFieldError(email, "give-email-error", emailOk ? "" : "Add an email so we know who pledged.");
    if (!emailOk && !firstInvalid) firstInvalid = email;

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const pledge = {
      fund: selectedFund,
      amount: amount,
      rhythm: currentRhythm(),
      name: name.value.trim(),
      email: email.value.trim()
    };
    const list = Array.isArray(store.get("rp.give")) ? store.get("rp.give") : [];
    list.push(pledge);
    store.set("rp.give", list);
    const rhythm = pledge.rhythm === "monthly" ? "monthly partnership" : "one-time gift";
    showSuccess(
      giveForm,
      giveSuccess,
      "give-success-text",
      "Thank you, " + pledge.name + ". A " + rhythm + " of " + money(amount) + " for " + FUND_LABEL[selectedFund] + " is recorded. Kept on this device. No card was charged."
    );
    fundButtons.forEach(function (item) { item.hidden = false; });
    document.querySelector(".funds").hidden = true;
    fundError.hidden = true;
  });

  document.getElementById("give-revise").addEventListener("click", function () {
    giveSuccess.hidden = true;
    giveForm.hidden = false;
    document.querySelector(".funds").hidden = false;
    const current = fundButtons.find(function (button) { return button.dataset.fund === selectedFund; });
    if (current) current.focus();
    else fundButtons[0].focus();
  });

  const SERVE = {
    writer: {
      label: "Writer",
      hint: "Writers shape essays, prayers, and short guides for people who are busy and still want God.",
      placeholder: "What kind of writing draws you — reflections, prayers, or guides?"
    },
    designer: {
      label: "Designer",
      hint: "Designers make interfaces and printed pieces that feel like rest, not another feed.",
      placeholder: "Where do you love to bring calm — print, interface, or identity?"
    },
    technologist: {
      label: "Technologist",
      hint: "Technologists tend the quiet systems that keep the sanctuary fast, private, and reliable.",
      placeholder: "What could you tend — the site, the tools, or the systems behind them?"
    }
  };

  const serveForm = document.getElementById("serve-form");
  const serveSuccess = document.getElementById("serve-success");
  const serveHint = document.getElementById("serve-hint");
  const serveNote = document.getElementById("serve-note");
  const serveRoles = [...serveForm.querySelectorAll('input[name="role"]')];

  serveRoles.forEach(function (input) {
    input.addEventListener("change", function () {
      const role = SERVE[input.value];
      if (!role) return;
      serveHint.textContent = role.hint;
      serveNote.placeholder = role.placeholder;
      document.getElementById("serve-role-error").hidden = true;
    });
  });

  serveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("serve-name");
    const email = document.getElementById("serve-email");
    const availability = document.getElementById("serve-availability");
    const roleInput = serveForm.querySelector('input[name="role"]:checked');
    const roleError = document.getElementById("serve-role-error");
    let firstInvalid = null;

    const nameOk = name.value.trim().length >= 2;
    setFieldError(name, "serve-name-error", nameOk ? "" : "Add your name so we know who is offering.");
    if (!nameOk) firstInvalid = name;

    const emailOk = EMAIL.test(email.value.trim());
    setFieldError(email, "serve-email-error", emailOk ? "" : "Add an email where we can reply.");
    if (!emailOk && !firstInvalid) firstInvalid = email;

    if (!roleInput) {
      roleError.hidden = false;
      roleError.textContent = "Choose Writers, Designers, or Technologists.";
      if (!firstInvalid) firstInvalid = serveRoles[0];
    } else {
      roleError.hidden = true;
    }

    const availabilityOk = Boolean(availability.value);
    setFieldError(availability, "serve-availability-error", availabilityOk ? "" : "Choose the time you can give.");
    if (!availabilityOk && !firstInvalid) firstInvalid = availability;

    const note = serveNote.value.trim();
    setFieldError(serveNote, "serve-note-error", note.length < 10 ? "Tell us, briefly, how you would like to help." : "");
    if (note.length < 10 && !firstInvalid) firstInvalid = serveNote;

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const offer = {
      name: name.value.trim(),
      email: email.value.trim(),
      role: roleInput.value,
      availability: availability.value,
      note: note
    };
    const list = Array.isArray(store.get("rp.serve")) ? store.get("rp.serve") : [];
    list.push(offer);
    store.set("rp.serve", list);
    const role = SERVE[offer.role];
    showSuccess(
      serveForm,
      serveSuccess,
      "serve-success-text",
      "Thank you, " + offer.name + ". Your offer to serve as a " + role.label + " is matched to that path. Kept on this device."
    );
  });
  bindRevise(serveForm, serveSuccess, "serve-revise");
})();
