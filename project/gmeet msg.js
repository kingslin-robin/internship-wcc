(function () {
  const seenMsgs = new Set();

  // --- Extract structured chat when panel is open ---
  function extractMessage(node) {
    try {
      const wrapper = node.closest(".Ss4fHf");
      const name = wrapper?.querySelector(".poVWob")?.innerText || "Unknown";
      const time = wrapper?.querySelector(".MuzmKe")?.innerText || "";
      const text = node.innerText?.trim() || "";
      const id =
        node.closest("[data-message-id]")?.getAttribute("data-message-id") ||
        `${name}-${time}-${text}`;
      return { id, name, time, text };
    } catch {
      return null;
    }
  }

  function checkChatPanel(mutations) {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          // Single message
          if (node.matches("[jsname='dTKtvb']")) {
            const msg = extractMessage(node);
            if (msg && !seenMsgs.has(msg.id)) {
              console.log(`💬 ${msg.time} ${msg.name}: ${msg.text}`);
              seenMsgs.add(msg.id);
            }
          }
          // Multiple inside wrapper
          node.querySelectorAll?.("[jsname='dTKtvb']").forEach(el => {
            const msg = extractMessage(el);
            if (msg && !seenMsgs.has(msg.id)) {
              console.log(`💬 ${msg.time} ${msg.name}: ${msg.text}`);
              seenMsgs.add(msg.id);
            }
          });
        }
      });
    });
  }

  // --- Extract fallback messages from hidden aria-live popup ---
  function checkAnnouncements(mutations) {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.hasAttribute("data-announce-message")) {
          const raw = node.getAttribute("data-announce-message");
          if (raw && !seenMsgs.has(raw)) {
            const parts = raw.split(":\n");
            const name = parts[0]?.trim() || "Unknown";
            const text = parts[1]?.trim() || "";
            console.log(`💬 ${name}: ${text}`);
            seenMsgs.add(raw);
          }
        }
      });
    });
  }

  // --- Attach observers ---
  const chatContainer = document.querySelector("[jsname='xySENc']");
  if (chatContainer) {
    new MutationObserver(checkChatPanel).observe(chatContainer, {
      childList: true,
      subtree: true,
    });
    console.log("✅ Chat panel observer attached");
  } else {
    console.warn("⚠️ Chat panel not found (will still use popup mode)");
  }

  new MutationObserver(checkAnnouncements).observe(document.body, {
    childList: true,
    subtree: true,
  });
  console.log("✅ Chat popup observer attached");
})();