function autoClickCreateIfFilled() {
    // Step 1: Find the textarea
    const textarea = document.querySelector('.custom-textarea');
    
    // Step 2: Check if it exists and has content
    if (textarea && textarea.value.trim() !== "") {
        // Step 3: Find the Create button
        const createBtn = document.querySelector('button[data-testid="create-button"]');
        
        if (createBtn) {
            createBtn.click();
            console.log("✅ Create button clicked!");
        } else {
            console.error("❌ Create button not found!");
        }
    } else {
        console.warn("⚠️ No text entered in the song description field.");
    }
}
autoClickCreateIfFilled();
