document.addEventListener("DOMContentLoaded", () => {
  const bgLayer = document.getElementById('scroll-bg');
  const sections = document.querySelectorAll('header, section, main');

  // 1. SCROLL BACKGROUND ENGINE
  if (sections.length > 0 && bgLayer) {
    const firstBg = sections[0].getAttribute('data-bg');
    if (firstBg) {
      bgLayer.style.backgroundImage = `url('${firstBg}')`;
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newBg = entry.target.getAttribute('data-bg');
        if (newBg) {
          bgLayer.style.backgroundImage = `url('${newBg}')`;
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));

  // 2. SMOOTH SCROLL FOR NAVIGATION
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. IMAGE PREVIEW LOGIC (Updated with Delete functionality)
  const photoInput = document.getElementById('photo-input');
  const previewGrid = document.getElementById('preview-grid');

  if (photoInput && previewGrid) {
    photoInput.addEventListener('change', function() {
      previewGrid.innerHTML = ''; // Clear existing previews
      
      Array.from(this.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Create container
            const div = document.createElement('div');
            div.className = 'preview-item';
            
            // Create image
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "Preview";
            
            // Create delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.innerHTML = '×';
            delBtn.title = "Remove photo";
            
            // Delete click event
            delBtn.addEventListener('click', (event) => {
              event.preventDefault();
              div.style.transform = 'scale(0)';
              div.style.opacity = '0';
              setTimeout(() => {
                div.remove();
              }, 300);
            });

            div.appendChild(img);
            div.appendChild(delBtn);
            previewGrid.appendChild(div);
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  // 4. WAITLIST FORM LOGIC
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const container = document.getElementById('waitlist-container');
      
      waitlistForm.style.transition = 'opacity 0.4s ease';
      waitlistForm.style.opacity = '0';
      
      setTimeout(() => {
        container.innerHTML = `
          <div style="text-align:center; padding: 40px; animation: fadeIn 0.8s ease forwards;">
            <h3 class="section-title" style="text-align:center;">You're on the list!</h3>
            <p class="large-text" style="font-size: 1.2rem; opacity: 0.9;">We'll reach out as soon as a slot opens. Welcome to the future of heritage.</p>
            <div style="font-size: 4rem; margin-top: 20px;">✉️</div>
          </div>`;
      }, 400);
    });
  }

  // 5. UPLOAD PROCESSING ANIMATION
  const processBtn = document.getElementById('process-btn');
  const privacyNote = document.querySelector('.privacy-note');

  if (processBtn) {
    processBtn.addEventListener('click', () => {
      const screen = document.getElementById('processing-screen');
      const status = document.getElementById('status-text');
      const subStatus = document.getElementById('sub-status');
      const loader = document.getElementById('loader');
      const check = document.getElementById('check');
      const doneBtn = document.getElementById('done-btn');

      if(privacyNote) privacyNote.style.display = 'none';
      screen.style.display = 'flex';

      setTimeout(() => { 
        status.innerText = "Encoding Traditions..."; 
        subStatus.innerText = "Mapping facial features and speech patterns.";
      }, 2000);

      setTimeout(() => {
        status.innerText = "Legacy Secured.";
        subStatus.innerText = "Your family's wisdom is now part of the eternal archive.";
        loader.style.display = 'none';
        check.style.display = 'block';
        doneBtn.style.display = 'inline-block';
      }, 4500);
    });
  }
});

// Animation Helper
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .preview-item { transition: transform 0.3s ease, opacity 0.3s ease; }
`;
document.head.appendChild(style);