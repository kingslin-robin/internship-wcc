function autoFillDescription() {
    const textarea = document.querySelector('textarea.custom-textarea');
    if (textarea) {
        textarea.value = "A slow, rain-washed piano melody drifts through an empty room — each note carrying the weight of a hoodie once borrowed, never returned. The warmth is gone, but its ghost still lingers in the folds of memory.";
        
        // Trigger an input event so the app detects the change
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        console.log("Textarea not found.");
    }
}
autoFillDescription();
