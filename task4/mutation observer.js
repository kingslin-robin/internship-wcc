function observeSongCreation() {
    const targetNode = document.body; // You can narrow this down to a specific container

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Example condition: look for elements containing "song" text
                        if (node.textContent && node.textContent.toLowerCase().includes("song")) {
                            console.log("🎵 New song detected:", node.textContent.trim());
                        }
                    }
                });
            }
        }
    });

    observer.observe(targetNode, {
        childList: true,      // Watch for added/removed elements
        subtree: true         // Include all descendants
    });

    console.log("✅ MutationObserver is now watching for new songs...");
}
observeSongCreation();
