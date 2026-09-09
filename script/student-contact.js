(() => {
  const contactPanel = document.getElementById("student-contact");
  if (!contactPanel) return;

  const sessionKey = "uniLiftKNUSTStudentInviteShown";
  const intro = contactPanel.querySelector(".student-contact-intro");
  const topics = contactPanel.querySelector(".student-contact-topics");
  const closeButton = contactPanel.querySelector(".student-contact-close");
  const startButton = contactPanel.querySelector(".student-contact-start");
  const backButton = contactPanel.querySelector(".student-contact-back");
  const whatsappNumber = "233509304981";
  let hasShown = sessionStorage.getItem(sessionKey) === "true";
  let hideTimer;

  function hidePanel() {
    window.clearTimeout(hideTimer);
    contactPanel.classList.remove("is-visible");
    contactPanel.setAttribute("aria-hidden", "true");
  }

  function showPanel() {
    if (hasShown) return;
    hasShown = true;
    sessionStorage.setItem(sessionKey, "true");
    contactPanel.classList.add("is-visible");
    contactPanel.setAttribute("aria-hidden", "false");
    hideTimer = window.setTimeout(hidePanel, 8000);
  }

  function showWhenNearPageBottom() {
    const pageBottom = window.scrollY + window.innerHeight;
    const bottomThreshold = Math.max(240, window.innerHeight * 0.2);
    const isNearBottom =
      pageBottom >= document.documentElement.scrollHeight - bottomThreshold;

    if (isNearBottom) showPanel();
  }

  function showTopics() {
    window.clearTimeout(hideTimer);
    intro.hidden = true;
    topics.hidden = false;
  }

  function showIntro() {
    intro.hidden = false;
    topics.hidden = true;
    hideTimer = window.setTimeout(hidePanel, 8000);
  }

  function openWhatsApp(topic) {
    const messages = {
      admissions: "Hi, I would like to ask a KNUST student about admissions.",
      programmes:
        "Hi, I would like to ask a KNUST student about programmes and courses.",
      accommodation:
        "Hi, I would like to ask a KNUST student about accommodation.",
      "campus-life":
        "Hi, I would like to ask a KNUST student about campus life.",
      fees: "Hi, I would like to ask a KNUST student about fees and school costs.",
      other:
        "Hi, I am interested in KNUST and have another question for a current student.",
    };
    const message = messages[topic] || messages.other;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  closeButton.addEventListener("click", hidePanel);
  startButton.addEventListener("click", showTopics);
  backButton.addEventListener("click", showIntro);
  contactPanel.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => openWhatsApp(button.dataset.topic));
  });

  if (hasShown) return;
  window.addEventListener("scroll", showWhenNearPageBottom, { passive: true });
  showWhenNearPageBottom();
})();
