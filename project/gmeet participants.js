(function () {
  const seen = new Set();

  function getParticipants() {
    return [...document.querySelectorAll('[role="listitem"][aria-label]')]
      .map(el => el.getAttribute("aria-label").split("—")[0].trim());
  }

  function checkParticipants() {
    const names = getParticipants();

    // Detect joins
    names.forEach(name => {
      if (!seen.has(name)) {
        console.log("🟢 Joined:", name);
        seen.add(name);
      }
    });

    // Detect leaves
    [...seen].forEach(name => {
      if (!names.includes(name)) {
        console.log("🔴 Left:", name);
        seen.delete(name);
      }
    });
  }

  const target = document.querySelector('[role="list"]');
  if (target) {
    new MutationObserver(checkParticipants)
      .observe(target, { childList: true, subtree: true });
    checkParticipants();
  } else {
    console.warn("⚠️ Couldn't find participants panel. Please open the 'People' tab first.");
  }
})();