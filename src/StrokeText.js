import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initStrokeText(element, options = {}) {
  const {
    text = element.innerText || 'Draw Attention',
    strokeColor = '#A78BFA',
    fillColor = '#F8FAFC',
    strokeWidth = 1.4,
    drawDuration = 1.6,
    fillDelay = 0.2,
    stagger = 0.05,
    ease = 'power2.out',
    trigger = 'mount', // 'hover', 'scroll', 'loop', 'mount'
    fillMode = 'wipe', // 'fade', 'wipe', 'none'
    fontSize = 128,
    fontWeight = 800,
    letterSpacing = -4,
    reverse = false,
  } = options;

  element.innerHTML = '';
  element.classList.add('stroke-text');
  if (trigger === 'hover') element.classList.add('stroke-text--hover');

  const rawId = Math.random().toString(36).substring(2, 9);
  const wipeId = `stroke-text-wipe-${rawId}`;
  
  // Set basic styles
  element.style.setProperty('--stroke-text-height', `${Math.round(fontSize * 1.3)}px`);
  
  const characters = Array.from(text);
  const dash = Math.max(fontSize * 7, 200);

  const fontStyle = `font-size: ${fontSize}px; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing}px; font-family: var(--font-playfair);`;

  // Build SVG structure
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('class', 'stroke-text__svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');
  
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.setAttribute('id', wipeId);
  clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
  const wipeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  clipPath.appendChild(wipeRect);
  defs.appendChild(clipPath);
  if (fillMode === 'wipe') {
    svg.appendChild(defs);
  }

  const strokeGroup = document.createElementNS("http://www.w3.org/2000/svg", "text");
  strokeGroup.setAttribute('class', 'stroke-text__stroke');
  strokeGroup.setAttribute('x', '0');
  strokeGroup.setAttribute('y', '0');
  strokeGroup.setAttribute('fill', 'none');
  strokeGroup.setAttribute('stroke', strokeColor);
  strokeGroup.setAttribute('stroke-width', strokeWidth);
  strokeGroup.setAttribute('stroke-linejoin', 'round');
  strokeGroup.setAttribute('stroke-linecap', 'round');
  strokeGroup.style.cssText = fontStyle;

  const fillGroup = document.createElementNS("http://www.w3.org/2000/svg", "text");
  fillGroup.setAttribute('class', 'stroke-text__fill');
  fillGroup.setAttribute('x', '0');
  fillGroup.setAttribute('y', '0');
  fillGroup.setAttribute('fill', fillColor);
  fillGroup.setAttribute('stroke', 'none');
  fillGroup.style.cssText = fontStyle;
  if (fillMode === 'wipe') {
    fillGroup.setAttribute('clip-path', `url(#${wipeId})`);
  }

  characters.forEach((char, index) => {
    const strokeTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    strokeTspan.setAttribute('data-stroke-char', '');
    strokeTspan.textContent = char === ' ' ? '\u00A0' : char; // preserve spaces
    strokeGroup.appendChild(strokeTspan);

    const fillTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    fillTspan.setAttribute('data-fill-char', '');
    fillTspan.textContent = char === ' ' ? '\u00A0' : char;
    fillGroup.appendChild(fillTspan);
  });

  svg.appendChild(strokeGroup);
  svg.appendChild(fillGroup);
  element.appendChild(svg);

  // Measure BBox after fonts load
  const measure = () => {
    let bbox;
    try {
      bbox = strokeGroup.getBBox();
    } catch {
      return null;
    }
    if (!bbox || !bbox.width) return null;
    
    const pad = Math.max(Number(strokeWidth) || 1, fontSize * 0.1);
    const box = {
      x: bbox.x - pad,
      y: bbox.y - pad,
      width: bbox.width + pad * 2,
      height: bbox.height + pad * 2
    };
    
    svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
    if (fillMode === 'wipe') {
      wipeRect.setAttribute('x', box.x);
      wipeRect.setAttribute('y', box.y);
      wipeRect.setAttribute('height', box.height);
    }
    return box;
  };

  const initAnimation = (box) => {
    const strokes = gsap.utils.toArray(element.querySelectorAll('[data-stroke-char]'));
    const fills = gsap.utils.toArray(element.querySelectorAll('[data-fill-char]'));
    const fillEnabled = fillMode !== 'none';
    const useWipe = fillEnabled && fillMode === 'wipe';
    const fillDuration = Math.max(0.4, drawDuration * 0.5);
    const staggerConfig = reverse ? { each: stagger, from: 'end' } : stagger;
    
    const setStart = () => {
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (useWipe) gsap.set(wipeRect, { attr: { width: 0 } });
    };

    const build = () => {
      setStart();
      const tl = gsap.timeline({
        paused: true,
        repeat: trigger === 'loop' ? -1 : 0,
        repeatDelay: trigger === 'loop' ? 0.9 : 0,
        defaults: { overwrite: 'auto' }
      });

      tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);

      if (useWipe && box) {
        tl.to(
          wipeRect,
          { attr: { width: box.width }, duration: fillDuration, ease: 'power2.inOut' },
          drawDuration + fillDelay
        );
      } else if (fillEnabled) {
        tl.to(
          fills,
          { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig },
          drawDuration + fillDelay
        );
      }
      return tl;
    };

    let timeline = build();
    
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(strokes, { strokeDashoffset: 0 });
      gsap.set(fills, { opacity: 1 });
      if (useWipe && box) gsap.set(wipeRect, { attr: { width: box.width } });
      return;
    }

    if (trigger === 'hover') {
      element.addEventListener('pointerenter', () => {
        timeline.kill();
        timeline = build();
        timeline.play(0);
      });
    } else if (trigger === 'scroll') {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 82%',
        once: true,
        onEnter: () => timeline.play(0)
      });
    } else {
      timeline.play(0);
    }
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      // Small timeout to ensure rendering layout is computed
      setTimeout(() => {
        const box = measure();
        if (box) initAnimation(box);
      }, 50);
    });
  } else {
    setTimeout(() => {
      const box = measure();
      if (box) initAnimation(box);
    }, 200);
  }
}
