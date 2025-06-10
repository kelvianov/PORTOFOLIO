document.addEventListener("DOMContentLoaded", () => {

  // ================= CERTIFICATE MODAL =================
  const certificateImages = [
    'img/sp1.jpg',
    'img/sp2.jpg',
    'img/sp3.jpg',
    'img/sp4.jpg',
    'img/sp5.jpg',
    'img/sp6.jpg',
    'img/sp7.jpg',
    'img/sp8.jpg',
    'img/sp9.jpg',
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
  
  // ================= KEYBOARD NAVIGATION FOR CERTIFICATE MODAL =================
  document.addEventListener('keydown', function(event) {
    const certificateModal = document.getElementById("certificateModal");
    
    // Only handle keyboard events when certificate modal is open
    if (certificateModal.style.display === "block") {
      switch(event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          changeImage(-1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          changeImage(1);
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
      }
    }
  });
  
  // ================= TYPEWRITER ANIMATION =================
  const aboutSection = document.getElementById("about");
  const typewriterSection = document.querySelectorAll(".typewriter");
  let isTyping = false;
  let typingIntervals = []; // Store all typing intervals
  let originalTexts = []; // Store original text content
  let typingProgress = []; // Track progress for each paragraph
  let isCompleted = false; // Track if all animations are completed
  
  // Store original text content and initialize progress
  typewriterSection.forEach((el, index) => {
    originalTexts[index] = el.innerHTML;
    el.innerHTML = "";
    el.style.visibility = "visible";
    typingProgress[index] = 0; // Initialize progress for each paragraph
  });
  
  function startTypewriter() {
    if (isTyping || isCompleted) return; // Prevent multiple instances, but allow resume if not completed
    isTyping = true;
    
    // Find the first paragraph that hasn't completed typing
    let currentElementIndex = 0;
    while (currentElementIndex < typewriterSection.length && 
           typingProgress[currentElementIndex] === originalTexts[currentElementIndex].length) {
      currentElementIndex++;
    }
    
    // If all paragraphs are completed, don't restart
    if (currentElementIndex >= typewriterSection.length) {
      isCompleted = true;
      return;
    }
    
    function typeNextElement() {
      if (currentElementIndex >= typewriterSection.length || !isTyping) {
        if (currentElementIndex >= typewriterSection.length) {
          isCompleted = true; // Mark as fully completed
        }
        return; // All elements typed or animation stopped
      }
      
      const el = typewriterSection[currentElementIndex];
      const fullText = originalTexts[currentElementIndex];
      
      // If this paragraph is already completed, move to next
      if (typingProgress[currentElementIndex] >= fullText.length) {
        currentElementIndex++;
        typeNextElement();
        return;
      }
      
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
      
      // Start from the last position for this paragraph
      let i = typingProgress[currentElementIndex];
      
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
          typingProgress[currentElementIndex] = i; // Update progress
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
    
    // Start with the current element that needs typing
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
        // User entered about section - start/resume typewriter animation
        startTypewriter();
      } else {
        // User left about section - stop typewriter but keep progress
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
  
  // ================= HIDE CONTACT ME BUTTON ON CONTACT SECTION (MOBILE ONLY) =================
  const contactSection = document.getElementById('contact');
  const openModalBtn = document.getElementById('openModalBtn');
  if (contactSection && openModalBtn) {
    const contactBtnObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Only hide on mobile (768px and below)
        if (window.innerWidth <= 768) {
          if (entry.isIntersecting) {
            openModalBtn.style.display = 'none';
          } else {
            openModalBtn.style.display = 'block';
          }
        } else {
          // On desktop, always show the button
          openModalBtn.style.display = 'block';
        }
      });
    }, {
      threshold: 0.2 // 20% of contact section visible triggers hide
    });
    
    contactBtnObserver.observe(contactSection);
    
    // Also listen for window resize to handle device orientation changes
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        // On desktop, always show button
        openModalBtn.style.display = 'block';
      } else {
        // On mobile, check if we're in contact section
        const rect = contactSection.getBoundingClientRect();
        const isInContact = rect.top < window.innerHeight && rect.bottom > 0;
        openModalBtn.style.display = isInContact ? 'none' : 'block';
      }
    });
  }
  
  }); // end DOMContentLoaded