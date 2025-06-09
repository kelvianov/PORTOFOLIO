document.addEventListener("DOMContentLoaded", () => {

  // ================= CERTIFICATE MODAL =================
  const certificateImages = [
    'img/sp1.jpg',
    'img/sp2.jpg',
    'img/sp3.jpg',
    'img/sp4.jpg',
    'img/sp5.jpg',
    'img/sp6.jpg',
  ];
  
  let currentImageIndex = 0;
  
  window.openModal = function(imgSrc) {
    const certificateModal = document.getElementById("certificateModal");
    const modalImg = document.getElementById("modalImg");
  
    certificateModal.style.display = "block";
    currentImageIndex = certificateImages.indexOf(imgSrc);
    modalImg.src = imgSrc;
    document.body.classList.add("no-scroll");
    
  };
  
  window.closeModal = function() {
    const certificateModal = document.getElementById("certificateModal");
    certificateModal.style.display = "none";
    document.body.classList.remove("no-scroll");
  };
  
  window.changeImage = function(direction) {
    currentImageIndex = (currentImageIndex + direction + certificateImages.length) % certificateImages.length;
    document.getElementById("modalImg").src = certificateImages[currentImageIndex];
  };
  
  // ================= TYPEWRITER ANIMATION =================
  const aboutSection = document.getElementById("about");
  const typewriterSection = document.querySelectorAll(".typewriter");
  let isTyping = false;
  let hasTypedOnce = false; // Track if animation has run once
  let typingIntervals = []; // Store all typing intervals
  let originalTexts = []; // Store original text content
  
  // Store original text content
  typewriterSection.forEach((el, index) => {
    originalTexts[index] = el.innerHTML;
    el.innerHTML = "";
    el.style.visibility = "visible";
  });
  
  function startTypewriter() {
    if (isTyping || hasTypedOnce) return; // Prevent multiple instances and re-runs
    isTyping = true;
    hasTypedOnce = true; // Mark as having run once
    
    let currentElementIndex = 0;
    
    function typeNextElement() {
      if (currentElementIndex >= typewriterSection.length || !isTyping) {
        return; // All elements typed or animation stopped
      }
      
      const el = typewriterSection[currentElementIndex];
      const fullText = originalTexts[currentElementIndex];
      
      // Parse HTML untuk mendapatkan struktur yang benar
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = fullText;
      
      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_ALL,
        null,
        false
      );
      
      let node;
      let textMap = [];
      
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const text = node.textContent;
          const isStrong = node.parentElement.tagName === 'STRONG';
          
          for (let i = 0; i < text.length; i++) {
            textMap.push({
              char: text[i],
              isStrong: isStrong
            });
          }
        }
      }
      
      el.innerHTML = "";
      let i = 0;
      
      const typing = setInterval(() => {
        if (i < textMap.length && isTyping) {
          let currentHTML = "";
          let inStrong = false;
          
          for (let j = 0; j <= i; j++) {
            if (textMap[j].isStrong && !inStrong) {
              currentHTML += "<strong>";
              inStrong = true;
            } else if (!textMap[j].isStrong && inStrong) {
              currentHTML += "</strong>";
              inStrong = false;
            }
            currentHTML += textMap[j].char;
          }
          
          if (inStrong) {
            currentHTML += "</strong>";
          }
          
          el.innerHTML = currentHTML;
          i++;
        } else {
          clearInterval(typing);
          
          if (isTyping) {
            // Wait a bit before starting next element
            setTimeout(() => {
              currentElementIndex++;
              typeNextElement(); // Start next element
            }, 800); // 800ms delay between paragraphs
          }
        }
      }, 30);
      
      typingIntervals.push(typing);
    }
    
    // Start with first element
    typeNextElement();
  }
  
  function stopTypewriter() {
    isTyping = false;
    
    // Clear all intervals and timeouts
    typingIntervals.forEach(interval => {
      clearInterval(interval);
      clearTimeout(interval);
    });
    typingIntervals = [];
    
    // DON'T reset text content - keep the typed text visible
    // This ensures text remains when user scrolls away and comes back
  }
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // User entered about section - start typewriter (only if hasn't run before)
        startTypewriter();
      } else {
        // User left about section - stop typewriter but keep text
        stopTypewriter();
      }
    });
  }, { 
    threshold: 0.3, // Trigger when 30% of section is visible
    rootMargin: '-10% 0px -10% 0px' // Add some margin for better control
  });
  
  if (aboutSection) observer.observe(aboutSection);
  
  // ================= GSAP SCROLL ANIMATION =================
  gsap.registerPlugin(ScrollTrigger);
  
  document.querySelectorAll('section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 1000%",
        toggleActions: "play none none reverse"
      }
    });
  });
  
  // ================= CONTACT MODAL =================
  const contactModal = document.getElementById('contactModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const contactForm = document.getElementById('modalContactForm');
  const contactFormFeedback = document.getElementById('modalFormFeedback');
   function openContactModal() {
    contactModal.style.display = 'flex';
    contactModal.removeAttribute('aria-hidden');
    contactModal.inert = false;
    document.body.classList.add('modal-open'); // Prevent body scrolling

    // Set email otomatis & readonly saat modal dibuka
    const emailInput = contactModal.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.value = 'kelvianov10@gmail.com';
      emailInput.readOnly = true;
    }
  
    const firstInput = contactModal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
  }
  
  function closeContactModal() {
    contactModal.style.display = 'none';
    contactModal.setAttribute('aria-hidden', 'true');
    contactModal.inert = true;
    document.body.classList.remove('modal-open'); // Re-enable body scrolling
  }
  
  if (contactModal && openBtn && closeBtn && contactForm) {
    openBtn.addEventListener('click', openContactModal);
  
    closeBtn.addEventListener('click', () => {
      closeContactModal();
      contactFormFeedback.textContent = '';
    });
  
    // Removed click outside to close functionality
    // Modal can only be closed by clicking the X button
  
    const inputs = contactForm.querySelectorAll('input, textarea');
  
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '#ccc';
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.textContent = '';
          errorMsg.style.display = 'none';
        }
      });
    });
  
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Override email supaya tetap email kamu
      const emailInput = contactForm.querySelector('input[type="email"]');
      if (emailInput) {
        emailInput.value = 'kelvianov10@gmail.com';
      }
  
      contactFormFeedback.textContent = '';
      let isValid = true;
  
      inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (!input.checkValidity()) {
          isValid = false;
          input.style.borderColor = '#e74c3c';
          errorMsg.textContent = input.validationMessage;
          errorMsg.style.display = 'block';
        } else if (input.value.length < (input.minLength || 0)) {
          isValid = false;
          input.style.borderColor = '#e74c3c';
          errorMsg.textContent = `Please enter at least ${input.minLength} characters`;
          errorMsg.style.display = 'block';
        } else {
          input.style.borderColor = '#ccc';
          errorMsg.textContent = '';
          errorMsg.style.display = 'none';
        }
      });
  
      if (isValid) {
        const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-4.mp3");
        audio.volume = 0.4;
        audio.play().catch((err) => {
          console.warn("Suara tidak bisa diputar:", err);
        });
  
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            Swal.fire({
              title: 'Message Sent!',
              text: 'Thanks for contacting me! I will get back to you soon.',
              icon: 'success',
              confirmButtonText: 'OK',
              background: '#f5f5f5',
              color: '#333',
              iconColor: '#333',
              showClass: {
                popup: 'swal2-show animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'swal2-hide animate__animated animate__fadeOutUp'
              },
              timer: 2000,
              timerProgressBar: true
            }).then(() => {
              closeContactModal();
              contactForm.reset();
            });
          } else {
            Swal.fire('Oops!', 'Gagal mengirim. Silakan coba lagi nanti.', 'error');
          }
        })
        .catch(() => {
          Swal.fire('Oops!', 'Terjadi kesalahan jaringan.', 'error');
        });
  
        
  
      }//jangan di hapus
    });//jangan di hapus
  }//jangan di hapus
  
  }); // end DOMContentLoaded