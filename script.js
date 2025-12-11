// Free Fire Booster - Main JavaScript File
// Centralizado com todas as funcionalidades do site

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initializeMobileMenu();
  initializeTooltips();
  initializeCopyButtons();
  initializeNotifications();
  
  // Page-specific initializations
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  switch(currentPage) {
    case 'index.html':
      initHomePage();
      break;
    case 'sensibilidade.html':
      initSensitivityPage();
      break;
    case 'otimizacao.html':
      initOptimizationPage();
      break;
    case 'videos.html':
      initVideosPage();
      break;
    case 'gerar-nick.html':
      initNickGeneratorPage();
      break;
    case 'gerar-bio.html':
      initBioGeneratorPage();
      break;
    case 'dicas.html':
      initTipsPage();
      break;
    case 'configurador.html':
      initHUDConfiguratorPage();
      break;
    case 'rank.html':
      initRankPage();
      break;
  }
  
  // Initialize analytics
  initializeAnalytics();
});

// ============================================
// CORE FUNCTIONS
// ============================================

function initializeMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

function initializeTooltips() {
  // Create tooltip container
  const tooltipContainer = document.createElement('div');
  tooltipContainer.id = 'tooltip-container';
  tooltipContainer.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    max-width: 250px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  document.body.appendChild(tooltipContainer);
  
  // Add tooltip functionality to elements
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltipText = this.getAttribute('data-tooltip');
      tooltipContainer.textContent = tooltipText;
      tooltipContainer.style.opacity = '1';
      
      const rect = this.getBoundingClientRect();
      tooltipContainer.style.left = (rect.left + (rect.width / 2)) + 'px';
      tooltipContainer.style.top = (rect.top - 10) + 'px';
      tooltipContainer.style.transform = 'translate(-50%, -100%)';
    });
    
    element.addEventListener('mouseleave', function() {
      tooltipContainer.style.opacity = '0';
    });
  });
}

function initializeCopyButtons() {
  document.addEventListener('click', function(e) {
    // Check if clicked element or parent is a copy button
    let copyButton = e.target.closest('.copy-btn, [data-copy], [onclick*="copy"]');
    
    if (copyButton && !copyButton.closest('a')) { // Adicionado: evitar links
      e.preventDefault();
      e.stopPropagation(); // Impedir propagação do evento
      
      // Verificar se é um botão de ação específica
      const isActionButton = copyButton.hasAttribute('onclick') && 
                            !copyButton.getAttribute('onclick').includes('copyToClipboard');
      
      if (isActionButton) {
        return; // Deixar o evento onclick original funcionar
      }
      
      // Get text to copy
      let textToCopy = '';
      
      if (copyButton.hasAttribute('data-copy')) {
        textToCopy = copyButton.getAttribute('data-copy');
      } else if (copyButton.previousElementSibling && copyButton.previousElementSibling.value) {
        textToCopy = copyButton.previousElementSibling.value;
      } else if (copyButton.previousElementSibling && copyButton.previousElementSibling.textContent) {
        textToCopy = copyButton.previousElementSibling.textContent;
      } else if (copyButton.parentElement.previousElementSibling) {
        textToCopy = copyButton.parentElement.previousElementSibling.textContent;
      }
      
      // Clean up text if needed
      textToCopy = textToCopy.trim();
      
      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    }
  });
}

function copyToClipboard(text, customMessage = '') {
  // Create temporary textarea
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  
  // Select and copy
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification(customMessage || 'Copiado para a área de transferência!', 'success');
    } else {
      showNotification('Erro ao copiar. Tente novamente.', 'error');
    }
  } catch (err) {
    // Fallback to Clipboard API
    navigator.clipboard.writeText(text).then(
      () => showNotification(customMessage || 'Copiado para a área de transferência!', 'success'),
      () => showNotification('Erro ao copiar. Tente novamente.', 'error')
    );
  }
  
  // Clean up
  document.body.removeChild(textarea);
}

function initializeNotifications() {
  // Create notification container
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'notification-container';
  notificationContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
  `;
  document.body.appendChild(notificationContainer);
}

function showNotification(message, type = 'info', duration = 3000) {
  const notificationContainer = document.getElementById('notification-container');
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                 type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                 type === 'warning' ? 'rgba(245, 158, 11, 0.9)' : 
                 'rgba(59, 130, 246, 0.9)'};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease;
    border-left: 4px solid ${type === 'success' ? '#22c55e' : 
                         type === 'error' ? '#ef4444' : 
                         type === 'warning' ? '#f59e0b' : 
                         '#3b82f6'};
  `;
  
  // Add icon based on type
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Auto remove after duration
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
  
  // Add CSS animations if not already present
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

function initializeAnalytics() {
  // Basic page view tracking
  const pageName = document.title || window.location.pathname;
  console.log(`Free Fire Booster - Página visitada: ${pageName}`);
  
  // Optional: Add Google Analytics or similar here
  // Example:
  // if (window.gtag) {
  //   gtag('event', 'page_view', {
  //     page_title: pageName,
  //     page_location: window.location.href
  //   });
  // }
}

// ============================================
// PAGE-SPECIFIC INITIALIZATIONS
// ============================================

function initHomePage() {
  // Quick tip generator
  const tips = [
    "Use fones de ouvido para ouvir passos dos inimigos",
    "Ajuste sua sensibilidade gradualmente até encontrar o ideal",
    "Treine no modo treino antes de jogar ranqueada",
    "Use cobertura sempre que possível",
    "Comunique-se com seu squad usando o chat de voz",
    "Aprenda os pontos de queda mais seguros",
    "Mantenha seu HUD organizado para melhor controle",
    "Use granadas para forçar inimigos a saírem da cobertura",
    "Aprenda a usar diferentes tipos de armas",
    "Atualize seu dispositivo regularmente para melhor performance"
  ];
  
  function showRandomTip() {
    if (document.getElementById('tipDisplay')) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      document.getElementById('tipDisplay').textContent = randomTip;
    }
  }
  
  // Quick nick generator
  function generateQuickNick() {
    const nameInput = document.getElementById('quickNick');
    if (!nameInput) return;
    
    const name = nameInput.value.trim();
    if (!name) {
      showNotification('Digite um nome primeiro!', 'warning');
      return;
    }
    
    const symbols = ['☆', '꧁', '༺', '≛', '乂', '♛', '㊣', '⍣', '卐', '乇', '刀', 'ﾑ', '乃'];
    const symbol1 = symbols[Math.floor(Math.random() * symbols.length)];
    const symbol2 = symbols[Math.floor(Math.random() * symbols.length)];
    
    const nick = `${symbol1}${name}${symbol2}`;
    
    copyToClipboard(nick, `Nick "${nick}" copiado!`);
  }
  
  // Attach event listeners
  if (document.getElementById('tipDisplay')) {
    showRandomTip();
    document.addEventListener('click', function(e) {
      if (e.target.closest('[onclick*="showRandomTip"]')) {
        showRandomTip();
      }
    });
  }
  
  if (document.getElementById('quickNick')) {
    document.addEventListener('click', function(e) {
      if (e.target.closest('[onclick*="generateQuickNick"]')) {
        generateQuickNick();
      }
    });
    
    // Enter key support
    document.getElementById('quickNick').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        generateQuickNick();
      }
    });
  }
}

function initSensitivityPage() {
  const generateBtn = document.getElementById('generateSensitivity');
  const copyAndroidBtn = document.getElementById('copyAndroidAll');
  const copyIphoneBtn = document.getElementById('copyIphoneAll');
  
  if (generateBtn) {
    generateBtn.addEventListener('click', generateSensitivities);
  }
  
  if (copyAndroidBtn) {
    copyAndroidBtn.addEventListener('click', () => copyAllSensitivities('android'));
  }
  
  if (copyIphoneBtn) {
    copyIphoneBtn.addEventListener('click', () => copyAllSensitivities('iphone'));
  }
  
  // Generate initial sensitivities on page load
  setTimeout(() => {
    if (document.querySelector('#android-tbody') && 
        document.querySelector('#android-tbody').children.length === 0) {
      generateSensitivities();
    }
  }, 500);
}

function initOptimizationPage() {
  // Device selector functionality
  const deviceBtns = document.querySelectorAll('.device-btn');
  const deviceSections = document.querySelectorAll('.device-section');
  
  if (deviceBtns.length > 0) {
    deviceBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const device = this.getAttribute('data-device');
        
        // Update active button
        deviceBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding section
        deviceSections.forEach(section => {
          section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${device}-section`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      });
    });
  }
  
  // Copy optimization tips functionality
  document.addEventListener('click', function(e) {
    if (e.target.closest('[onclick*="copyAllOptimization"]')) {
      const device = e.target.closest('[onclick*="copyAllOptimization"]').getAttribute('onclick').match(/'([^']+)'/)[1];
      copyAllOptimization(device);
    }
  });
  
  // Expand/collapse advanced sections
  document.querySelectorAll('.advanced-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.toggle('expanded');
        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
      }
    });
  });
}

function initVideosPage() {
  // Already implemented in videos.html
  // This function is a placeholder for additional video page functionality
  console.log('Videos page initialized');
}

function initNickGeneratorPage() {
  // Symbol library for nick generation
  const nickSymbols = {
    normal: ['★', '☆', '⚡', '♛', '♚', '☯', '☣', '✪', '✯', '❖', '⚝', '࿐', '•', 'ᴮᴼˢˢ'],
    aggressive: ['☠', '⚔', '🛡', '💀', '🔥', 'ⓀⒾⓁⓁⒺⓇ', '†', '✞', '卐', '刀', '乃', 'ﾑ', '乇'],
    cool: ['꧁', '꧂', '༺', '༻', '『', '』', '【', '】', '〖', '〗', '≛', '⍣', '๖ۣۜ', '乂', '◥▶◀◤'],
    pro: ['☬', '༒', '₦', 'Ї', 'ℑ', '₳', 'ᴮᵒˢˢ', 'ᴄᴏᴏʟ', 'ᴘʀᴏ', 'ɢᴀᴍᴇʀ', 'ʟᴇɢᴇɴᴅ', 'ᴍᴀꜱᴛᴇʀ'],
    minimal: ['.', '-', '_', '|', '/', '\\', '~', '=', '+', '×', '·']
  };
  
  const letterStyles = {
    smallCaps: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴸᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ',
    circled: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
    fullWidth: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
    script: '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'
  };
  
  let currentStyle = 'normal';
  let currentQuantity = 20;
  let generatedNicks = [];
  
  // Style buttons
  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentStyle = this.getAttribute('data-style');
    });
  });
  
  // Quantity buttons
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentQuantity = parseInt(this.getAttribute('data-qty'));
    });
  });
  
  // Generate nicks button
  const generateBtn = document.getElementById('generateNicksBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateNicks);
  }
  
  // Copy all nicks button
  const copyAllBtn = document.getElementById('copyAllNicksBtn');
  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', function() {
      if (generatedNicks.length === 0) {
        showNotification('Gere nicks primeiro!', 'warning');
        return;
      }
      
      const text = generatedNicks.join('\n');
      copyToClipboard(text, `${generatedNicks.length} nicks copiados!`);
    });
  }
  
  // Clear nicks button
  const clearBtn = document.getElementById('clearNicksBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (generatedNicks.length === 0) {
        return;
      }
      
      if (confirm('Deseja limpar todos os nicks gerados?')) {
        document.getElementById('nickResults').innerHTML = '';
        document.getElementById('resultsSection').style.display = 'none';
        generatedNicks = [];
        showNotification('Nicks limpos com sucesso!', 'success');
      }
    });
  }
  
  // Load more nicks button
  const loadMoreBtn = document.getElementById('loadMoreNicksBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      const input = document.getElementById('nickInput').value.trim();
      if (!input) {
        showNotification('Digite um nome primeiro!', 'warning');
        return;
      }
      
      generateMoreNicks(input, 10);
    });
  }
  
  // Symbol buttons
  document.querySelectorAll('.symbol-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const symbol = this.getAttribute('data-symbol');
      copyToClipboard(symbol, `Símbolo "${symbol}" copiado!`);
      
      // Update preview
      const preview = document.getElementById('symbolPreview');
      if (preview) {
        preview.textContent = symbol;
        preview.style.animation = 'none';
        setTimeout(() => {
          preview.style.animation = 'highlight 0.5s ease';
        }, 10);
      }
    });
  });
  
  // Initialize copy buttons for examples
  document.querySelectorAll('.copy-example-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const text = this.getAttribute('data-copy');
      copyToClipboard(text, `Nick "${text}" copiado!`);
    });
  });
  
  // Enter key to generate
  const nickInput = document.getElementById('nickInput');
  if (nickInput) {
    nickInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        generateNicks();
      }
    });
  }
  
  // Animation for symbol preview
  const style = document.createElement('style');
  style.textContent = `
    @keyframes highlight {
      0% { background: rgba(0, 217, 255, 0.1); }
      100% { background: transparent; }
    }
  `;
  document.head.appendChild(style);
  
  function generateNicks() {
    const input = document.getElementById('nickInput').value.trim();
    if (!input) {
      showNotification('Digite um nome ou palavra!', 'warning');
      return;
    }
    
    generatedNicks = [];
    document.getElementById('nickResults').innerHTML = '';
    
    generateMoreNicks(input, currentQuantity);
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
  
  function generateMoreNicks(baseName, quantity) {
    const container = document.getElementById('nickResults');
    if (!container) return;
    
    for (let i = 0; i < quantity; i++) {
      let nick = '';
      const symbols = nickSymbols[currentStyle];
      
      // Decide pattern: prefix, suffix, or both
      const pattern = Math.floor(Math.random() * 5);
      
      switch(pattern) {
        case 0: // Prefix only
          nick = getRandomSymbol(symbols) + stylizeName(baseName);
          break;
        case 1: // Suffix only
          nick = stylizeName(baseName) + getRandomSymbol(symbols);
          break;
        case 2: // Both sides
          nick = getRandomSymbol(symbols) + stylizeName(baseName) + getRandomSymbol(symbols);
          break;
        case 3: // Multiple symbols
          nick = getRandomSymbol(symbols) + getRandomSymbol(symbols) + 
                 stylizeName(baseName) + getRandomSymbol(symbols);
          break;
        case 4: // Special formatting
          nick = applySpecialFormat(baseName, currentStyle);
          break;
      }
      
      // Sometimes add numbers
      if (Math.random() > 0.7) {
        nick += Math.floor(Math.random() * 999);
      }
      
      generatedNicks.push(nick);
      
      // Create nick element
      const nickElement = document.createElement('div');
      nickElement.className = 'nick-item';
      nickElement.innerHTML = `
        <div class="nick-text">${nick}</div>
        <button class="btn btn-sm copy-btn" data-copy="${nick}">
          <i class="fas fa-copy"></i> Copiar
        </button>
      `;
      
      container.appendChild(nickElement);
    }
    
    // Update count
    const countElement = document.getElementById('nickCount');
    if (countElement) {
      countElement.textContent = generatedNicks.length;
    }
    
    // Re-initialize copy buttons for new nicks
    initializeCopyButtons();
  }
  
  function getRandomSymbol(symbolArray) {
    return symbolArray[Math.floor(Math.random() * symbolArray.length)];
  }
  
  function stylizeName(name) {
    // Sometimes apply letter styling
    if (Math.random() > 0.5) {
      const style = Object.keys(letterStyles)[Math.floor(Math.random() * Object.keys(letterStyles).length)];
      return applyLetterStyle(name.toUpperCase(), style);
    }
    
    // Sometimes add random case
    if (Math.random() > 0.7) {
      return name.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
    }
    
    return name;
  }
  
  function applyLetterStyle(text, style) {
    // Simple implementation
    if (style === 'smallCaps') {
      return text.toLowerCase();
    } else if (style === 'circled') {
      return text.split('').map(c => c + '⃝').join('');
    }
    return text;
  }
  
  function applySpecialFormat(name, style) {
    const formats = {
      aggressive: `☠${name.toUpperCase()}☠`,
      cool: `꧁${name}꧂`,
      pro: `༒${name}༒`,
      minimal: `_${name}_`
    };
    
    return formats[style] || `★${name}★`;
  }
}

function initBioGeneratorPage() {
  let currentColor = '#00d9ff';
  let currentFormat = 'bold-color';
  let currentBio = '';
  
  // Color picker
  const colorPicker = document.getElementById('colorPicker');
  const colorCode = document.querySelector('.color-code');
  
  if (colorPicker && colorCode) {
    colorPicker.addEventListener('input', function() {
      currentColor = this.value;
      colorCode.textContent = this.value;
      colorCode.style.color = this.value;
    });
  }
  
  // Format buttons
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFormat = this.getAttribute('data-format');
    });
  });
  
  // Generate bio button
  const generateBtn = document.getElementById('generateBioBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateBio);
  }
  
  // Copy bio button
  const copyBtn = document.getElementById('copyBioBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyBioCode);
  }
  
  // Preview bio button
  const previewBtn = document.getElementById('previewBioBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', previewBio);
  }
  
  // Use template buttons
  document.querySelectorAll('.use-template-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const text = this.getAttribute('data-text');
      document.getElementById('bioInput').value = text;
      generateBio();
    });
  });
  
  // Set color buttons
  document.querySelectorAll('.set-color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      document.getElementById('colorPicker').value = color;
      currentColor = color;
      document.querySelector('.color-code').textContent = color;
      document.querySelector('.color-code').style.color = color;
    });
  });
  
  // Copy example buttons
  document.querySelectorAll('.copy-example-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const code = this.getAttribute('data-code');
      copyToClipboard(code, 'Bio copiada para a área de transferência!');
    });
  });
  
  // Enter key to generate bio
  const bioInput = document.getElementById('bioInput');
  if (bioInput) {
    bioInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        generateBio();
      }
    });
  }
  
  function generateBio() {
    const bioText = document.getElementById('bioInput').value.trim();
    if (!bioText) {
      showNotification('Digite uma bio primeiro!', 'warning');
      return;
    }
    
    currentBio = bioText;
    previewBio();
  }
  
  function previewBio() {
    const bioText = document.getElementById('bioInput').value.trim();
    if (!bioText) {
      showNotification('Digite uma bio primeiro!', 'warning');
      return;
    }
    
    // Remove # from color
    const cleanColor = currentColor.replace('#', '');
    
    // Generate code based on format
    let code = '';
    switch(currentFormat) {
      case 'bold':
        code = `[c][b]${bioText}`;
        break;
      case 'italic':
        code = `[c][i]${bioText}`;
        break;
      case 'underline':
        code = `[c][u]${bioText}`;
        break;
      case 'bold-color':
      default:
        code = `[c][b][${cleanColor}]${bioText}`;
        break;
    }
    
    // Update preview
    const preview = document.getElementById('bioPreview');
    if (preview) {
      preview.innerHTML = `
        <div class="bio-display" style="color: ${currentColor}; font-weight: ${currentFormat.includes('bold') ? 'bold' : 'normal'}; font-style: ${currentFormat === 'italic' ? 'italic' : 'normal'}; text-decoration: ${currentFormat === 'underline' ? 'underline' : 'none'};">
          ${bioText}
        </div>
      `;
    }
    
    // Update code
    const codeElement = document.getElementById('bioCode');
    if (codeElement) {
      codeElement.textContent = code;
    }
    
    // Show preview section
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
      previewSection.style.display = 'block';
      setTimeout(() => {
        previewSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
    
    // Store for copying
    window.currentBioCode = code;
    
    showNotification('Bio gerada com sucesso!', 'success');
  }
  
  function copyBioCode() {
    const bioText = document.getElementById('bioInput').value.trim();
    if (!bioText) {
      showNotification('Gere uma bio primeiro!', 'warning');
      return;
    }
    
    if (!window.currentBioCode) {
      previewBio();
    }
    
    copyToClipboard(window.currentBioCode, 'Código da bio copiado!');
  }
}

function initTipsPage() {
  // Category filters
  document.querySelectorAll('.tip-category').forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      filterTips(category);
      
      // Update active button
      document.querySelectorAll('.tip-category').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('tipSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchTips(this.value);
    });
    
    // Add search button functionality
    const searchBtn = document.querySelector('[onclick*="searchTips"]');
    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        searchTips(searchInput.value);
      });
    }
  }
  
  // Save tip buttons
  document.querySelectorAll('.save-tip').forEach(button => {
    button.addEventListener('click', function() {
      const tipId = this.getAttribute('data-tip-id');
      saveTip(tipId);
    });
  });
  
  // Load saved tips on page load
  updateSavedTipsDisplay();
}

function initHUDConfiguratorPage() {
  // This function is a placeholder as HUD configurator
  // has its own extensive JavaScript in configurador.html
  console.log('HUD Configurator page initialized');
}

function initRankPage() {
  // Rank data
  const rankData = [
    { id: 'bronze1', name: 'Bronze I', color: '#CD7F32', points: 0, next: 100 },
    { id: 'bronze2', name: 'Bronze II', color: '#CD7F32', points: 100, next: 200 },
    { id: 'bronze3', name: 'Bronze III', color: '#CD7F32', points: 200, next: 300 },
    { id: 'silver1', name: 'Prata I', color: '#C0C0C0', points: 300, next: 450 },
    { id: 'silver2', name: 'Prata II', color: '#C0C0C0', points: 450, next: 600 },
    { id: 'silver3', name: 'Prata III', color: '#C0C0C0', points: 600, next: 750 },
    { id: 'silver4', name: 'Prata IV', color: '#C0C0C0', points: 750, next: 900 },
    { id: 'gold1', name: 'Ouro I', color: '#FFD700', points: 900, next: 1100 },
    { id: 'gold2', name: 'Ouro II', color: '#FFD700', points: 1100, next: 1300 },
    { id: 'gold3', name: 'Ouro III', color: '#FFD700', points: 1300, next: 1500 },
    { id: 'gold4', name: 'Ouro IV', color: '#FFD700', points: 1500, next: 1700 },
    { id: 'platinum1', name: 'Platina I', color: '#00CED1', points: 1700, next: 2000 },
    { id: 'platinum2', name: 'Platina II', color: '#00CED1', points: 2000, next: 2300 },
    { id: 'platinum3', name: 'Platina III', color: '#00CED1', points: 2300, next: 2600 },
    { id: 'platinum4', name: 'Platina IV', color: '#00CED1', points: 2600, next: 2900 },
    { id: 'diamond1', name: 'Diamante I', color: '#B9F2FF', points: 2900, next: 3400 },
    { id: 'diamond2', name: 'Diamante II', color: '#B9F2FF', points: 3400, next: 3900 },
    { id: 'diamond3', name: 'Diamante III', color: '#B9F2FF', points: 3900, next: 4400 },
    { id: 'diamond4', name: 'Diamante IV', color: '#B9F2FF', points: 4400, next: 4900 },
    { id: 'heroic', name: 'Heróico', color: '#FF4500', points: 4900, next: 6000 },
    { id: 'grandmaster', name: 'Mestre', color: '#800080', points: 6000, next: 8000 },
    { id: 'challenger', name: 'Desafiante', color: '#FF0000', points: 8000, next: null }
  ];
  
  // Generate ranks display
  function generateRanksDisplay() {
    const ranksContainer = document.getElementById('ranksContainer');
    const rankTrack = document.querySelector('.rank-track');
    
    if (!ranksContainer || !rankTrack) return;
    
    // Clear containers
    ranksContainer.innerHTML = '';
    rankTrack.innerHTML = '';
    
    // Create rank cards
    rankData.forEach(rank => {
      // Create rank card for grid
      const rankCard = document.createElement('div');
      rankCard.className = 'rank-card';
      rankCard.innerHTML = `
        <div class="rank-icon" style="background: ${rank.color}">
          <i class="fas fa-${getRankIcon(rank.id)}"></i>
        </div>
        <div class="rank-info">
          <h3>${rank.name}</h3>
          <p>${rank.points} - ${rank.next || '∞'} pontos</p>
          ${rank.next ? `<div class="rank-progress-bar"><div class="progress" style="width: 0%"></div></div>` : ''}
        </div>
      `;
      ranksContainer.appendChild(rankCard);
      
      // Create rank item for track
      const rankItem = document.createElement('div');
      rankItem.className = 'rank-track-item';
      rankItem.innerHTML = `
        <div class="track-rank" style="background: ${rank.color}">
          ${rank.name.split(' ')[0].charAt(0)}
        </div>
        <div class="track-label">${rank.name}</div>
      `;
      rankTrack.appendChild(rankItem);
    });
  }
  
  function getRankIcon(rankId) {
    if (rankId.includes('bronze')) return 'seedling';
    if (rankId.includes('silver')) return 'star';
    if (rankId.includes('gold')) return 'crown';
    if (rankId.includes('platinum')) return 'gem';
    if (rankId.includes('diamond')) return 'diamond';
    if (rankId.includes('heroic')) return 'fire';
    if (rankId.includes('grandmaster')) return 'chess-queen';
    if (rankId.includes('challenger')) return 'trophy';
    return 'question';
  }
  
  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const rank = this.getAttribute('data-rank');
      
      // Update active button
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding tab
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      const targetTab = document.getElementById(`${rank}-tab`);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });
  
  // Initialize ranks display
  generateRanksDisplay();
  
  // Calculate rank progress
  const calculateBtn = document.querySelector('[onclick*="calculateRankProgress"]');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateRankProgress);
  }
  
  function calculateRankProgress() {
    const currentRankId = document.getElementById('currentRank')?.value;
    const currentPoints = parseInt(document.getElementById('currentPoints')?.value || 0);
    const targetRankId = document.getElementById('targetRank')?.value;
    const avgPoints = parseInt(document.getElementById('avgPoints')?.value || 15);
    
    if (!currentRankId || !targetRankId) {
      showNotification('Selecione os ranks para calcular!', 'warning');
      return;
    }
    
    // Find rank data
    const currentRank = rankData.find(r => r.id === currentRankId);
    const targetRank = rankData.find(r => r.id === targetRankId);
    
    if (!currentRank || !targetRank) {
      showNotification('Erro: Rank não encontrado!', 'error');
      return;
    }
    
    // Calculate points needed
    let pointsNeeded = 0;
    
    if (currentRank.points === targetRank.points) {
      // Same rank tier
      if (currentPoints < currentRank.next) {
        pointsNeeded = currentRank.next - currentPoints;
      }
    } else {
      // Different ranks
      // Points from current rank to next
      if (currentPoints < currentRank.next) {
        pointsNeeded += currentRank.next - currentPoints;
      }
      
      // Points for intermediate ranks
      const currentIndex = rankData.findIndex(r => r.id === currentRankId);
      const targetIndex = rankData.findIndex(r => r.id === targetRankId);
      
      for (let i = currentIndex + 1; i < targetIndex; i++) {
        const rank = rankData[i];
        pointsNeeded += rank.next - rank.points;
      }
      
      // Points for target rank (if not challenger)
      if (targetRank.next) {
        pointsNeeded += targetRank.next - targetRank.points;
      }
    }
    
    // Calculate matches needed
    const matchesNeeded = Math.ceil(pointsNeeded / avgPoints);
    
    // Calculate time needed (20 minutes per match)
    const timeMinutes = matchesNeeded * 20;
    const timeHours = Math.floor(timeMinutes / 60);
    const timeDays = Math.floor(timeHours / 24);
    
    let timeText = '';
    if (timeDays > 0) {
      timeText = `${timeDays} dias`;
    } else if (timeHours > 0) {
      timeText = `${timeHours} horas`;
    } else {
      timeText = `${timeMinutes} minutos`;
    }
    
    // Determine difficulty
    let difficulty = 'Fácil';
    let difficultyColor = '#4ade80';
    
    if (matchesNeeded > 100) {
      difficulty = 'Muito Difícil';
      difficultyColor = '#ef4444';
    } else if (matchesNeeded > 50) {
      difficulty = 'Difícil';
      difficultyColor = '#f59e0b';
    } else if (matchesNeeded > 25) {
      difficulty = 'Média';
      difficultyColor = '#eab308';
    }
    
    // Generate tip
    let tip = '';
    if (matchesNeeded > 100) {
      tip = 'Considere aumentar seu K/D ratio para ganhar mais pontos por partida.';
    } else if (matchesNeeded > 50) {
      tip = 'Jogue em squad com amigos para melhorar suas chances de vitória.';
    } else if (matchesNeeded > 25) {
      tip = 'Mantenha a consistência e evite perder muitos pontos em derrotas.';
    } else {
      tip = 'Você está perto! Mantenha o foco e evite riscos desnecessários.';
    }
    
    // Update results
    const pointsNeededEl = document.getElementById('pointsNeeded');
    const matchesNeededEl = document.getElementById('matchesNeeded');
    const timeNeededEl = document.getElementById('timeNeeded');
    const difficultyEl = document.getElementById('difficulty');
    const resultTipEl = document.getElementById('resultTip');
    
    if (pointsNeededEl) pointsNeededEl.textContent = pointsNeeded;
    if (matchesNeededEl) matchesNeededEl.textContent = matchesNeeded;
    if (timeNeededEl) timeNeededEl.textContent = timeText;
    if (difficultyEl) {
      difficultyEl.textContent = difficulty;
      difficultyEl.style.color = difficultyColor;
    }
    if (resultTipEl) resultTipEl.textContent = tip;
    
    // Show results
    const resultsSection = document.getElementById('calculatorResults');
    if (resultsSection) {
      resultsSection.style.display = 'block';
      setTimeout(() => {
        resultsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
    
    showNotification('Cálculo realizado com sucesso!', 'success');
  }
}

// ============================================
// SENSITIVITY GENERATOR FUNCTIONS
// ============================================

function generateSensitivities() {
  const androidCount = 20;
  const iphoneCount = 20;
  
  // Generate Android sensitivities
  const androidData = generateDeviceSensitivities(androidCount, 'Android');
  renderSensitivityTable('android', androidData);
  
  // Generate iPhone sensitivities
  const iphoneData = generateDeviceSensitivities(iphoneCount, 'iPhone');
  renderSensitivityTable('iphone', iphoneData);
  
  // Store for copy all
  window.lastAndroidSensitivities = androidData;
  window.lastIphoneSensitivities = iphoneData;
  
  showNotification(`${androidCount} Android e ${iphoneCount} iPhone gerados com sucesso!`, 'success');
}

function generateDeviceSensitivities(count, device) {
  const data = [];
  
  for (let i = 1; i <= count; i++) {
    // Novos parâmetros: 150-200 para todas as miras
    const baseValue = 150; // Mínimo
    const variation = 50; // 150-200
    
    data.push({
      index: i,
      geral: Math.floor(baseValue + Math.random() * variation),
      reddot: Math.floor(baseValue + Math.random() * variation),
      mira2x: Math.floor(baseValue + Math.random() * variation),
      mira4x: Math.floor(baseValue + Math.random() * variation),
      awm: Math.floor(baseValue + Math.random() * variation),
      dpi: Math.floor(500 + Math.random() * 940) // 500-1440
    });
  }
  
  return data;
}

function renderSensitivityTable(device, data) {
  const tbody = document.getElementById(`${device}-tbody`);
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>#${item.index}</strong></td>
      <td><span class="value-highlight">${item.geral}</span></td>
      <td>${item.reddot}</td>
      <td>${item.mira2x}</td>
      <td>${item.mira4x}</td>
      <td>${item.awm}</td>
      <td>${item.dpi}</td>
      <td>
        <button class="btn btn-sm copy-btn" 
                data-copy="${formatSensitivityText(item, device === 'android' ? 'Android' : 'iPhone')}">
          <i class="fas fa-copy"></i> Copiar
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Re-initialize copy buttons for new items
  initializeCopyButtons();
}

function formatSensitivityText(item, device) {
  return `#${item.index} ${device} | Geral: ${item.geral} | Red Dot: ${item.reddot} | 2x: ${item.mira2x} | 4x: ${item.mira4x} | AWM: ${item.awm} | DPI: ${item.dpi}`;
}

function copyAllSensitivities(device) {
  const data = device === 'android' ? window.lastAndroidSensitivities : window.lastIphoneSensitivities;
  const deviceName = device === 'android' ? 'Android' : 'iPhone';
  
  if (!data || data.length === 0) {
    showNotification('Gere as sensibilidades primeiro!', 'warning');
    return;
  }
  
  const text = data.map(item => formatSensitivityText(item, deviceName)).join('\n');
  copyToClipboard(text, `Todas as sensibilidades ${deviceName} copiadas!`);
}

// ============================================
// OPTIMIZATION FUNCTIONS
// ============================================

function copyAllOptimization(device) {
  let text = '';
  
  if (device === 'android') {
    text = `OTIMIZAÇÃO COMPLETA ANDROID - FREE FIRE BOOSTER

🎮 CONFIGURAÇÕES BÁSICAS:
1. Ative o modo de alto desempenho nas configurações do sistema
2. Feche todos os aplicativos em segundo plano antes de jogar
3. No modo desenvolvedor, desative todas as animações
4. Reduza a resolução gráfica para melhorar FPS
5. Jogue em ambientes frescos para evitar superaquecimento
6. Use conexão Wi-Fi estável para reduzir lag
7. Mantenha Android e Free Fire sempre atualizados
8. Limpe o cache do Free Fire em Configurações > Apps

⚙️ CONFIGURAÇÕES AVANÇADAS:
- FPS Máximo: 60 FPS (ou máximo que seu dispositivo suportar)
- Qualidade Gráfica: Smooth (Suave)
- Sombreamento: Desativado
- Anti-Aliasing: Desativado
- Brilho: 70-80%
- Texturas: Médio ou Baixo
- Efeitos: Desativados ou Baixos

🔋 OTIMIZAÇÃO DE BATERIA:
1. Carregue o dispositivo até 80-90% antes de jogar
2. Use modo avião durante partidas (se jogando com Wi-Fi)
3. Reduza o brilho da tela para 50-60%
4. Desative vibração do dispositivo
5. Use carregador original para melhor desempenho

📶 OTIMIZAÇÃO DE REDE:
1. Conecte-se ao roteador 5GHz se disponível
2. Evite paredes entre o dispositivo e o roteador
3. Use DNS preferencial (Google: 8.8.8.8)
4. Reinicie o roteador periodicamente
5. Evite downloads durante as partidas

🛠️ DICAS EXTRAS:
• Use cooler externo em sessões longas
• Remova capas durante o jogo para melhor resfriamento
• Desative notificações durante as partidas
• Use modo jogo se disponível no seu dispositivo
• Faça limpeza regular do cache do sistema`;
  } else if (device === 'iphone') {
    text = `OTIMIZAÇÃO COMPLETA IPHONE - FREE FIRE BOOSTER

🍎 CONFIGURAÇÕES BÁSICAS iOS:
1. Ative o modo Não Perturbe durante partidas
2. Feche todos os apps em segundo plano
3. Reduza o brilho da tela para economizar bateria
4. Ative Redução de Movimento em Acessibilidade
5. Desative atualizações automáticas de apps
6. Não jogue enquanto o iPhone está carregando
7. Desative Wi-Fi ou dados móveis se não estiver usando
8. Reinicie o iPhone antes de sessões longas de jogo

⚙️ CONFIGURAÇÕES NO FREE FIRE (iOS):
- Qualidade Gráfica: Smooth (Suave)
- FPS: Máximo (60 ou 120 dependendo do modelo)
- Sombreamento: Baixo
- Efeitos: Médio
- Resolução: 100%
- Anti-Aliasing: Desativado
- Campo de Visão: 90-100

🔋 OTIMIZAÇÃO DE BATERIA iOS:
1. Carregue até 80% para preservar saúde da bateria
2. Use modo de baixo consumo durante partidas
3. Desative busca em segundo plano de emails
4. Reduza tempo de bloqueio de tela para 30 segundos
5. Desative localização para apps desnecessários

📶 OTIMIZAÇÃO DE REDE iOS:
1. Use Wi-Fi 5GHz para menor latência
2. Resetar configurações de rede periodicamente
3. Desative Wi-Fi Assist em Ajustes > Celular
4. Use DNS privado para melhor estabilidade
5. Evite áreas com muitas redes Wi-Fi

🎮 DICAS PARA IPAD:
• Use suporte para melhor ergonomia
• Ative o modo jogo se disponível
• Mantenha iOS sempre atualizado
• Use capas que facilitem o resfriamento
• Evite usar enquanto carrega

🛠️ DICAS EXTRAS:
• Use Airplane Mode com Wi-Fi ligado
• Limpe cache do Free Fire regularmente
• Desative notificações push durante jogos
• Use fones Bluetooth de baixa latência
• Mantenha pelo menos 10GB de espaço livre`;
  } else if (device === 'pc') {
    text = `OTIMIZAÇÃO COMPLETA EMULADOR PC - FREE FIRE BOOSTER

💻 CONFIGURAÇÕES BÁSICAS:
1. Aloque pelo menos 4GB de RAM para o emulador
2. Aloque 4 núcleos de CPU para melhor performance
3. Use o modo de alta performance no emulador
4. Use resolução 1280x720 no emulador
5. Configure o emulador para 60 FPS ou mais
6. Configure controles de teclado e mouse
7. Use conexão com cabo Ethernet para menos lag
8. Ative VT (Virtualization Technology) na BIOS

⚙️ CONFIGURAÇÕES POR EMULADOR:
- Gameloop: 4GB RAM, 4 núcleos - Use versão oficial
- BlueStacks 5: 4GB RAM, 4 núcleos - Ative alta performance
- LDPlayer: 4GB RAM, 4 núcleos - Use versão 64-bit
- NoxPlayer: 3GB RAM, 2 núcleos - Bom para PCs fracos
- Memu Play: 3GB RAM, 2 núcleos - Leve e rápido

🖥️ OTIMIZAÇÃO DO WINDOWS:
1. Desative efeitos visuais do Windows
2. Feche programas desnecessários em segundo plano
3. Use modo de alto desempenho no plano de energia
4. Atualize drivers de vídeo regularmente
5. Desative antivírus durante sessões de jogo

🎮 CONFIGURAÇÕES DE CONTROLE:
• Sensibilidade do mouse: 800-1600 DPI
• Polling rate: 1000Hz
• Use teclas personalizadas para ações rápidas
• Configure atalhos para itens de cura
• Use teclado mecânico para melhor resposta

📶 OTIMIZAÇÃO DE REDE PC:
1. Use cabo Ethernet CAT6 ou superior
2. Configure QoS no roteador para priorizar tráfego de jogos
3. Use DNS de jogos (Cloudflare: 1.1.1.1)
4. Desative atualizações do Windows durante jogos
5. Use conexão dedicada apenas para jogos

🛠️ DICAS AVANÇADAS:
• Overclock leve da GPU se souber fazer
• Use MSI Afterburner para monitorar performance
• Mantenha temperatura da GPU abaixo de 80°C
• Faça limpeza física do PC regularmente
• Use SSD para o emulador e o jogo

🎯 CONFIGURAÇÕES IN-GAME:
• Gráficos: Suave
• FPS: Máximo
• Sombreamento: Desativado
• Efeitos: Mínimo
• Campo de Visão: 90
• Renderização: 100%`;
  }
  
  copyToClipboard(text, `Otimizações ${device.toUpperCase()} copiadas!`);
}

// ============================================
// TIPS PAGE FUNCTIONS
// ============================================

function filterTips(category) {
  const allTips = document.querySelectorAll('.tip-card');
  
  allTips.forEach(tip => {
    if (category === 'all' || tip.getAttribute('data-category') === category) {
      tip.style.display = 'block';
      tip.style.animation = 'fadeIn 0.3s ease';
    } else {
      tip.style.display = 'none';
    }
  });
  
  // Add fadeIn animation if not present
  if (!document.getElementById('fadeInAnimation')) {
    const style = document.createElement('style');
    style.id = 'fadeInAnimation';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

function searchTips(query) {
  const allTips = document.querySelectorAll('.tip-card');
  const lowercaseQuery = query.toLowerCase();
  
  allTips.forEach(tip => {
    const text = tip.textContent.toLowerCase();
    if (text.includes(lowercaseQuery)) {
      tip.style.display = 'block';
      tip.style.animation = 'fadeIn 0.3s ease';
    } else {
      tip.style.display = 'none';
    }
  });
}

function saveTip(tipId) {
  // Get saved tips from localStorage
  let savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
  
  // Check if already saved
  if (savedTips.includes(tipId)) {
    // Remove if already saved
    savedTips = savedTips.filter(id => id !== tipId);
    showNotification('Dica removida dos favoritos');
    
    // Update button
    const button = document.querySelector(`.save-tip[data-tip-id="${tipId}"]`);
    if (button) {
      button.innerHTML = '<i class="far fa-bookmark"></i> Salvar';
      button.classList.remove('saved');
    }
  } else {
    // Add to saved
    savedTips.push(tipId);
    showNotification('Dica salva nos favoritos!');
    
    // Update button
    const button = document.querySelector(`.save-tip[data-tip-id="${tipId}"]`);
    if (button) {
      button.innerHTML = '<i class="fas fa-bookmark"></i> Salvo';
      button.classList.add('saved');
    }
  }
  
  // Save back to localStorage
  localStorage.setItem('savedTips', JSON.stringify(savedTips));
  
  // Update saved tips display
  updateSavedTipsDisplay();
}

function updateSavedTipsDisplay() {
  const savedTipsContainer = document.getElementById('savedTipsContainer');
  if (!savedTipsContainer) return;
  
  const savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
  
  if (savedTips.length === 0) {
    savedTipsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <i class="fas fa-bookmark" style="font-size: 3rem; opacity: 0.3; margin-bottom: 16px;"></i>
        <p style="color: var(--muted);">Nenhuma dica salva ainda</p>
        <p style="color: rgba(255,255,255,0.4); font-size: 14px; margin-top: 10px;">
          Clique no botão "Salvar" nas dicas para adicioná-las aqui
        </p>
      </div>
    `;
    return;
  }
  
  // Get saved tip elements
  let savedTipsHTML = '<div class="saved-tips-grid">';
  
  savedTips.forEach(tipId => {
    // Find the tip in the page
    const tipElement = document.querySelector(`.tip-card [data-tip-id="${tipId}"]`);
    if (tipElement) {
      const tipCard = tipElement.closest('.tip-card');
      if (tipCard) {
        savedTipsHTML += tipCard.outerHTML;
      }
    }
  });
  
  savedTipsHTML += '</div>';
  savedTipsContainer.innerHTML = savedTipsHTML;
  
  // Re-attach event listeners to saved tips
  savedTipsContainer.querySelectorAll('.save-tip').forEach(button => {
    button.addEventListener('click', function() {
      const tipId = this.getAttribute('data-tip-id');
      saveTip(tipId);
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

window.copyToClipboard = copyToClipboard;
window.showNotification = showNotification;
window.generateSensitivities = generateSensitivities;
window.copyAllSensitivities = copyAllSensitivities;
window.copyAllOptimization = copyAllOptimization;
window.filterTips = filterTips;
window.searchTips = searchTips;
window.saveTip = saveTip;
window.updateSavedTipsDisplay = updateSavedTipsDisplay;

// Make sure functions are available when page loads
setTimeout(() => {
  if (typeof generateSensitivities === 'function') {
    window.generateSensitivities = generateSensitivities;
  }
}, 100);