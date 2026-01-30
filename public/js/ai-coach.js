document.addEventListener('DOMContentLoaded', () => {
    const aiBtn = document.getElementById('get-ai-insight');
    const aiResult = document.getElementById('ai-result');
    const aiLoading = document.getElementById('ai-loading');
  
    if (!aiBtn || !aiResult) {
        console.error("AI Elements not found in DOM");
        return;
    }
  
    aiBtn.addEventListener('click', async () => {
      console.log("AI Coach: Button clicked. Sending request...");
      
      // 1. UI Loading State
      aiBtn.disabled = true;
      aiBtn.innerHTML = "Analyzing...";
      if(aiLoading) aiLoading.style.display = 'block';
      
      // Hide previous result while loading
      aiResult.style.display = 'none';
      aiResult.innerHTML = '';
  
      try {
        // 2. Request to Backend
        const response = await fetch('/api/ai-analysis', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log("Response Status:", response.status);

        // Check if server returned 404 (Route not found)
        if (response.status === 404) {
            throw new Error("Server route not found. Did you restart the server?");
        }

        const data = await response.json();
        console.log("Data received:", data);
  
        // 3. Handle Response
        aiResult.style.display = 'block'; // Make sure container is visible
        
        if (data.error) {
          aiResult.innerHTML = `<div style="color: #ff4444; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 5px;">⚠️ Error: ${data.error}</div>`;
        } else if (data.analysis) {
          // Force text color to white to ensure visibility against dark backgrounds
          aiResult.innerHTML = `<div style="color: #ffffff; line-height: 1.6;">${data.analysis}</div>`;
        } else {
          aiResult.innerHTML = `<div style="color: #ffcc00;">⚠️ Received empty response from AI. Try again.</div>`;
        }
        
      } catch (err) {
        console.error("AI Feature Error:", err);
        aiResult.style.display = 'block';
        aiResult.innerHTML = `<div style="color: #ff4444; padding: 10px; border: 1px solid #ff4444; border-radius: 5px;">
            <strong>Connection Failed:</strong> ${err.message}
        </div>`;
      } finally {
        // 4. Reset UI
        aiBtn.disabled = false;
        aiBtn.innerHTML = "✨ Analyze My Habits";
        if(aiLoading) aiLoading.style.display = 'none';
      }
    });
});