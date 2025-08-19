(async function autoSongMakerAndDownloader() {
  console.log("🎶 Automation started...");

  // === Utility Functions ===
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const queryWait = async (selector, timeout = 10000, scope = document) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const found = scope.querySelector(selector);
      if (found) return found;
      await delay(200);
    }
    return null;
  };

  const fireClick = (el) => {
    ["pointerdown", "mousedown", "mouseup", "click"].forEach(type => {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
    });
  };

  const setInputValue = (el, val) => {
    const proto = el.tagName === "TEXTAREA"
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // === Step 1: Fill Form ===
  const songTitle = "Eternal Flame";

  const titleInput = await queryWait('input[placeholder="Enter song title"]');
  if (titleInput) {
    setInputValue(titleInput, songTitle);
    console.log("✅ Title set!");
  }

  const lyricsInput = await queryWait('textarea[data-testid="lyrics-input-textarea"]');
  if (lyricsInput) {
    setInputValue(lyricsInput, `Through the fire, love will remain,
An endless light, an eternal flame.
Whispers of hope in the midnight air,
A promise forever, beyond despair.`);
    console.log("✅ Lyrics set!");
  }

  const tagsInput = await queryWait('textarea[data-testid="tag-input-textarea"]');
  if (tagsInput) {
    setInputValue(tagsInput, "rock, symphonic, ballad");
    console.log("✅ Styles set!");
  }

  const createBtn = await queryWait('button[data-testid="create-button"]');
  if (createBtn && !createBtn.disabled) {
    createBtn.click();
    console.log("🎯 Song creation triggered!");
  } else {
    console.error("❌ Could not find active Create button!");
    return;
  }

  // === Step 2: Watch for Row Creation ===
  console.log("👀 Waiting for new song row...");

  const workspaceEl = await queryWait('.custom-scrollbar-transparent.flex-1.overflow-y-auto');
  if (!workspaceEl) {
    console.error("❌ Workspace not found!");
    return;
  }

  const rowObs = new MutationObserver((mutList) => {
    for (const mut of mutList) {
      for (const added of mut.addedNodes) {
        if (added.nodeType === 1 && added.matches('[role="row"]')) {
          const rowLabel = added.getAttribute("aria-label");
          if (rowLabel === songTitle) {
            console.log(`🎵 Song row "${songTitle}" detected!`);

            // === Step 3: Watch Publish Button in This Row ===
            const pubObs = new MutationObserver(async (mutations) => {
              for (const m of mutations) {
                for (const node of m.addedNodes) {
                  if (node.nodeType === 1) {
                    const spans = node.querySelectorAll("button span");
                    for (const s of spans) {
                      if (s.textContent.trim() === "Publish") {
                        console.log(`✅ Publish button found for "${songTitle}"`);

                        // Grab data
                        const finalTitle = document.querySelector('input[placeholder="Enter song title"]')?.value || "(untitled)";
                        const finalLyrics = document.querySelector('textarea[data-testid="lyrics-input-textarea"]')?.value || "(no lyrics)";
                        console.log("📌 Final Data:", { finalTitle, finalLyrics });

                        // === Step 4: Trigger Download Menu ===
                        const optionsBtn = added.querySelector('button[aria-label="More Options"]');
                        if (optionsBtn) {
                          fireClick(optionsBtn);
                          await delay(400);

                          const downloadMenu = await queryWait('[data-testid="download-sub-trigger"]', 5000, added)
                            || Array.from(document.querySelectorAll("span, button"))
                              .find(el => el.textContent.trim().toLowerCase() === "download");

                          if (downloadMenu) {
                            fireClick(downloadMenu);
                            console.log("⬇ Download menu opened");
                            await delay(400);

                            const mp3Btn = Array.from(document.querySelectorAll("button, [role='menuitem'], span"))
                              .find(el => el.textContent.toLowerCase().includes("mp3 audio"));
                            if (mp3Btn) {
                              fireClick(mp3Btn);
                              console.log("🎼 MP3 option selected");
                              await delay(400);

                              const confirmBtn = Array.from(document.querySelectorAll("button"))
                                .find(el => el.textContent.toLowerCase().includes("download anyway"));
                              if (confirmBtn) {
                                fireClick(confirmBtn);
                                console.log("✅ Download confirmed!");
                              }
                            }
                          }
                        }

                        pubObs.disconnect();
                        return;
                      }
                    }
                  }
                }
              }
            });

            pubObs.observe(added, { childList: true, subtree: true });
            rowObs.disconnect();
          }
        }
      }
    }
  });

  rowObs.observe(workspaceEl, { childList: true, subtree: true });

})();
