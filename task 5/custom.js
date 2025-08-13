(async () => {
    console.log("🎼 Starting automated song creation, playback, lyrics display, and download...");

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const waitFor = async (selector, timeout = 10000, container = document) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = container.querySelector(selector);
            if (el) return el;
            await delay(100);
        }
        return null;
    };

    const triggerClick = el => {
        if (!el) return;
        ["pointerdown", "mousedown", "mouseup", "click"].forEach(type =>
            el.dispatchEvent(new MouseEvent(type, { bubbles: true }))
        );
    };

    const setReactInput = (el, value) => {
        const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
    };

    // STEP 1: Fill song details
    const fillSongDetails = async () => {
        const lyricsField = await waitFor('textarea[data-testid="lyrics-input-textarea"]');
        const styleField = await waitFor('textarea[data-testid="tag-input-textarea"]');
        const titleField = await waitFor('input[placeholder="Enter song title"]');
        const createBtn = await waitFor('button[data-testid="create-button"]');

        if (!lyricsField || !styleField || !titleField || !createBtn) {
            throw new Error("❌ Missing one or more song creation fields.");
        }

        const lyricsText = `Under the streetlight, your eyes meet mine,
Every little moment feels frozen in time,
Your laugh’s like a melody, soft and true,
And my guitar’s just strumming the thought of you.

We’re dancing barefoot on the city stones,
Writing our story in a song of our own,
If the night keeps us here, I’ll play ‘til it’s through,
Every chord is a heartbeat that’s pulling me to you.`;

        setReactInput(lyricsField, lyricsText);
        setReactInput(styleField, "Pop, Acoustic, Shawn Mendes style, Guitar");
        setReactInput(titleField, "Streetlight Serenade");

        while (createBtn.disabled) {
            await delay(200);
        }
        triggerClick(createBtn);
        console.log("🎤 Song creation triggered!");
    };

    // STEP 2: Play the song and show lyrics
    const handlePlaybackAndLyrics = async () => {
        const playBtn = await waitFor('button[data-testid="play-button"]', 30000);
        if (playBtn) {
            triggerClick(playBtn);
            console.log("▶️ Song is now playing!");
        } else {
            console.warn("⚠️ Play button not found.");
        }

        const lyricsContainer = document.createElement("div");
        lyricsContainer.id = "lyrics-display";
        Object.assign(lyricsContainer.style, {
            position: "fixed",
            top: "50px",
            left: "20px",
            width: "300px",
            height: "80vh",
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            overflowY: "auto",
            zIndex: "9999",
            fontSize: "16px",
            lineHeight: "1.5"
        });
        lyricsContainer.innerText = document.querySelector('textarea[data-testid="lyrics-input-textarea"]')?.value || "No lyrics found.";
        document.body.appendChild(lyricsContainer);
        console.log("📜 Lyrics displayed.");
    };

    // STEP 3: Download MP3 automatically
    const downloadMP3 = async () => {
        console.log("💾 Waiting for MP3 link...");
        let mp3Btn;
        const start = Date.now();
        while (Date.now() - start < 20000) {
            mp3Btn = Array.from(document.querySelectorAll('button, [role="menuitem"], span'))
                .find(el => el.textContent && el.textContent.toLowerCase().includes("mp3 audio"));
            if (mp3Btn) break;
            await delay(500);
        }

        if (mp3Btn) {
            triggerClick(mp3Btn);
            console.log("⬇️ MP3 download triggered!");
        } else {
            console.warn("⚠️ MP3 option not found.");
        }
    };

    // RUN ALL
    try {
        await fillSongDetails();
        await handlePlaybackAndLyrics();
        await downloadMP3();
        console.log("✅ All steps completed successfully!");
    } catch (err) {
        console.error("❌ Error:", err);
    }
})();
