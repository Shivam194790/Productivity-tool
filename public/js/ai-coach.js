document.addEventListener('DOMContentLoaded', () => {
    const aiBtn = document.getElementById('get-ai-insight');
    const aiResult = document.getElementById('ai-result');
    const aiLoading = document.getElementById('ai-loading');
  
    // Safety check: if button doesn't exist on this page, stop.
    if (!aiBtn) return;
  
    aiBtn.addEventListener('click', async () => {
      console.log("AI Coach: Button clicked");
      
      // 1. UI Loading State
      aiBtn.disabled = true;
      aiBtn.innerText = "Analyzing...";
      aiLoading.style.display = 'block';
      aiResult.style.display = 'none';
  
      try {
        // 2. Request to Backend
        const response = await fetch('/api/ai-analysis', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
  
        // 3. Handle Response
        if (data.error) {
          // Use backticks (`) for HTML strings to avoid syntax errors
          aiResult.innerHTML = <span style="color: #ef4444;">Error: ${data.error}</span>;
        } else {
          aiResult.innerHTML = data.analysis;
        }
        
        aiResult.style.display = 'block';
        
      } catch (err) {
        console.error("AI Feature Error:", err);
        aiResult.innerHTML = <span style="color: #ef4444;">Connection failed. Please try again.</span>;
        aiResult.style.display = 'block';
      } finally {
        // 4. Reset UI
        aiBtn.disabled = false;
        aiBtn.innerText = "Analyze My Habits";
        aiLoading.style.display = 'none';
      }
    });
  });