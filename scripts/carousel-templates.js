/**
 * 🎨 FishandTips - Carousel HTML Templates
 * 
 * Template HTML per generare immagini carousel Instagram
 * Stile: Foto Unsplash + Overlay professionale
 * Dimensioni: 1080x1350 (formato Instagram carousel)
 */

// ===== CONFIGURAZIONE STILI =====
const BRAND_COLORS = {
  primary: '#0c4a6e',      // Blu scuro
  secondary: '#0284c7',    // Blu chiaro
  accent: '#f97316',       // Arancione
  light: '#f0f9ff',        // Azzurro chiaro
  dark: '#0f172a',         // Quasi nero
  white: '#ffffff',
  overlay: 'rgba(12, 74, 110, 0.85)'
};

const FONTS = {
  heading: "'Poppins', 'Segoe UI', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif"
};

// ===== CSS BASE =====
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .slide {
    width: 1080px;
    height: 1350px;
    position: relative;
    overflow: hidden;
    font-family: ${FONTS.body};
  }
  
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  
  .content {
    position: relative;
    z-index: 3;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 60px;
    color: white;
  }
  
  .brand-tag {
    position: absolute;
    bottom: 40px;
    left: 60px;
    font-family: ${FONTS.heading};
    font-size: 28px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    z-index: 4;
  }
  
  .slide-indicator {
    position: absolute;
    bottom: 40px;
    right: 60px;
    display: flex;
    gap: 8px;
    z-index: 4;
  }
  
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
  }
  
  .dot.active {
    background: white;
  }
`;

// ===== TEMPLATE 1: HOOK SLIDE =====
export function hookSlideTemplate(data) {
  const { headline, subheadline, emoji, backgroundUrl, slideNumber, totalSlides } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${BASE_CSS}
    
    .hook-overlay {
      background: linear-gradient(
        180deg, 
        rgba(12, 74, 110, 0.3) 0%,
        rgba(12, 74, 110, 0.7) 50%,
        rgba(12, 74, 110, 0.95) 100%
      );
    }
    
    .hook-content {
      justify-content: flex-end;
      padding-bottom: 140px;
    }
    
    .hook-emoji {
      font-size: 80px;
      margin-bottom: 30px;
    }
    
    .hook-headline {
      font-family: ${FONTS.heading};
      font-size: 72px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: -2px;
    }
    
    .hook-subheadline {
      font-size: 36px;
      font-weight: 500;
      opacity: 0.9;
      line-height: 1.4;
    }
    
    .swipe-hint {
      position: absolute;
      bottom: 100px;
      right: 60px;
      font-size: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="slide">
    <img class="background-image" src="${backgroundUrl}" alt="background" />
    <div class="overlay hook-overlay"></div>
    <div class="content hook-content">
      <div class="hook-emoji">${emoji || '🎣'}</div>
      <h1 class="hook-headline">${headline}</h1>
      <p class="hook-subheadline">${subheadline}</p>
    </div>
    <div class="swipe-hint">SWIPE ➡️</div>
    <div class="brand-tag">@fishandtips.it</div>
    ${generateDots(slideNumber, totalSlides)}
  </div>
</body>
</html>
  `;
}

// ===== TEMPLATE 2: CONTENT SLIDE (Tips/Errori) =====
export function contentSlideTemplate(data) {
  const { headline, body, highlight, emoji, backgroundUrl, slideNumber, totalSlides } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${BASE_CSS}
    
    .content-overlay {
      background: linear-gradient(
        180deg,
        rgba(12, 74, 110, 0.5) 0%,
        rgba(12, 74, 110, 0.92) 40%,
        rgba(12, 74, 110, 0.98) 100%
      );
    }
    
    .content-slide {
      justify-content: center;
      align-items: flex-start;
    }
    
    .content-number {
      font-family: ${FONTS.heading};
      font-size: 24px;
      font-weight: 600;
      color: ${BRAND_COLORS.accent};
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .content-headline {
      font-family: ${FONTS.heading};
      font-size: 56px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 40px;
    }
    
    .content-body {
      font-size: 32px;
      line-height: 1.6;
      opacity: 0.95;
      max-width: 90%;
    }
    
    .content-highlight {
      margin-top: 50px;
      padding: 30px 40px;
      background: rgba(249, 115, 22, 0.2);
      border-left: 5px solid ${BRAND_COLORS.accent};
      font-size: 28px;
      font-weight: 600;
      font-style: italic;
    }
    
    .content-emoji {
      position: absolute;
      top: 60px;
      right: 60px;
      font-size: 60px;
    }
  </style>
</head>
<body>
  <div class="slide">
    <img class="background-image" src="${backgroundUrl}" alt="background" />
    <div class="overlay content-overlay"></div>
    <div class="content content-slide">
      <div class="content-emoji">${emoji || '💡'}</div>
      <h2 class="content-headline">${headline}</h2>
      <p class="content-body">${body}</p>
      ${highlight ? `<div class="content-highlight">"${highlight}"</div>` : ''}
    </div>
    <div class="brand-tag">@fishandtips.it</div>
    ${generateDots(slideNumber, totalSlides)}
  </div>
</body>
</html>
  `;
}

// ===== TEMPLATE 3: CTA SLIDE =====
export function ctaSlideTemplate(data) {
  const { headline, body, actions, backgroundUrl, slideNumber, totalSlides } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${BASE_CSS}
    
    .cta-overlay {
      background: linear-gradient(
        180deg,
        rgba(12, 74, 110, 0.6) 0%,
        rgba(12, 74, 110, 0.95) 100%
      );
    }
    
    .cta-content {
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .cta-headline {
      font-family: ${FONTS.heading};
      font-size: 52px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 30px;
    }
    
    .cta-body {
      font-size: 28px;
      opacity: 0.9;
      margin-bottom: 50px;
      max-width: 80%;
    }
    
    .cta-actions {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }
    
    .cta-action {
      font-size: 32px;
      font-weight: 600;
      padding: 20px 50px;
      background: rgba(255,255,255,0.15);
      border-radius: 50px;
      backdrop-filter: blur(10px);
    }
    
    .cta-action.primary {
      background: ${BRAND_COLORS.accent};
      color: white;
    }
    
    .cta-logo {
      margin-top: 60px;
      font-family: ${FONTS.heading};
      font-size: 48px;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <div class="slide">
    <img class="background-image" src="${backgroundUrl}" alt="background" />
    <div class="overlay cta-overlay"></div>
    <div class="content cta-content">
      <h2 class="cta-headline">${headline}</h2>
      <p class="cta-body">${body}</p>
      <div class="cta-actions">
        ${(actions || ['💾 Salva', '👆 Seguici']).map((action, i) => 
          `<div class="cta-action ${i === 0 ? 'primary' : ''}">${action}</div>`
        ).join('')}
      </div>
      <div class="cta-logo">🎣 FishandTips.it</div>
    </div>
    ${generateDots(slideNumber, totalSlides)}
  </div>
</body>
</html>
  `;
}

// ===== TEMPLATE 4: COMPARISON SLIDE =====
export function comparisonSlideTemplate(data) {
  const { leftTitle, leftContent, rightTitle, rightContent, backgroundUrl, slideNumber, totalSlides } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${BASE_CSS}
    
    .comparison-overlay {
      background: rgba(12, 74, 110, 0.92);
    }
    
    .comparison-content {
      justify-content: center;
      gap: 40px;
    }
    
    .comparison-title {
      font-family: ${FONTS.heading};
      font-size: 40px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 40px;
    }
    
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      width: 100%;
    }
    
    .comparison-box {
      padding: 40px;
      border-radius: 20px;
      text-align: center;
    }
    
    .comparison-box.wrong {
      background: rgba(239, 68, 68, 0.3);
      border: 3px solid #ef4444;
    }
    
    .comparison-box.right {
      background: rgba(34, 197, 94, 0.3);
      border: 3px solid #22c55e;
    }
    
    .comparison-box-title {
      font-family: ${FONTS.heading};
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .comparison-box-content {
      font-size: 26px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="slide">
    <img class="background-image" src="${backgroundUrl}" alt="background" />
    <div class="overlay comparison-overlay"></div>
    <div class="content comparison-content">
      <h2 class="comparison-title">❌ vs ✅</h2>
      <div class="comparison-grid">
        <div class="comparison-box wrong">
          <h3 class="comparison-box-title">❌ ${leftTitle}</h3>
          <p class="comparison-box-content">${leftContent}</p>
        </div>
        <div class="comparison-box right">
          <h3 class="comparison-box-title">✅ ${rightTitle}</h3>
          <p class="comparison-box-content">${rightContent}</p>
        </div>
      </div>
    </div>
    <div class="brand-tag">@fishandtips.it</div>
    ${generateDots(slideNumber, totalSlides)}
  </div>
</body>
</html>
  `;
}

// ===== TEMPLATE 5: FACT/STAT SLIDE =====
export function factSlideTemplate(data) {
  const { bigNumber, unit, description, backgroundUrl, slideNumber, totalSlides } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${BASE_CSS}
    
    .fact-overlay {
      background: linear-gradient(
        135deg,
        rgba(12, 74, 110, 0.9) 0%,
        rgba(2, 132, 199, 0.85) 100%
      );
    }
    
    .fact-content {
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .fact-number {
      font-family: ${FONTS.heading};
      font-size: 180px;
      font-weight: 800;
      line-height: 1;
      color: ${BRAND_COLORS.accent};
    }
    
    .fact-unit {
      font-family: ${FONTS.heading};
      font-size: 48px;
      font-weight: 600;
      margin-top: -20px;
      margin-bottom: 40px;
    }
    
    .fact-description {
      font-size: 36px;
      line-height: 1.5;
      max-width: 80%;
      opacity: 0.95;
    }
  </style>
</head>
<body>
  <div class="slide">
    <img class="background-image" src="${backgroundUrl}" alt="background" />
    <div class="overlay fact-overlay"></div>
    <div class="content fact-content">
      <div class="fact-number">${bigNumber}</div>
      <div class="fact-unit">${unit}</div>
      <p class="fact-description">${description}</p>
    </div>
    <div class="brand-tag">@fishandtips.it</div>
    ${generateDots(slideNumber, totalSlides)}
  </div>
</body>
</html>
  `;
}

// ===== HELPER: Genera indicatori slide =====
function generateDots(current, total) {
  const dots = [];
  for (let i = 1; i <= total; i++) {
    dots.push(`<div class="dot ${i === current ? 'active' : ''}"></div>`);
  }
  return `<div class="slide-indicator">${dots.join('')}</div>`;
}

// ===== FUNZIONE PRINCIPALE: Genera HTML per tutte le slide =====
export function generateAllSlideHTML(carousel, photos) {
  const slides = [];
  const totalSlides = carousel.slides.length;
  
  carousel.slides.forEach((slide, index) => {
    const backgroundUrl = photos[index]?.url || photos[0]?.url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1080';
    
    let html;
    
    switch (slide.type) {
      case 'hook':
        html = hookSlideTemplate({
          ...slide,
          backgroundUrl,
          slideNumber: index + 1,
          totalSlides
        });
        break;
        
      case 'cta':
        html = ctaSlideTemplate({
          ...slide,
          backgroundUrl,
          slideNumber: index + 1,
          totalSlides
        });
        break;
        
      case 'comparison':
        html = comparisonSlideTemplate({
          ...slide,
          backgroundUrl,
          slideNumber: index + 1,
          totalSlides
        });
        break;
        
      case 'fact':
        html = factSlideTemplate({
          ...slide,
          backgroundUrl,
          slideNumber: index + 1,
          totalSlides
        });
        break;
        
      default: // 'content'
        html = contentSlideTemplate({
          ...slide,
          backgroundUrl,
          slideNumber: index + 1,
          totalSlides
        });
    }
    
    slides.push({
      slideNumber: index + 1,
      type: slide.type,
      html,
      backgroundUrl
    });
  });
  
  return slides;
}

export default {
  hookSlideTemplate,
  contentSlideTemplate,
  ctaSlideTemplate,
  comparisonSlideTemplate,
  factSlideTemplate,
  generateAllSlideHTML,
  BRAND_COLORS
};

