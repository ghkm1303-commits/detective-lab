import React, { useEffect, useRef, useState } from 'react';
import './CloudAssistant.css';

function CloudAssistant({ message }) {
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);

  const [blinking, setBlinking] = useState(false);
  const [bubbleText, setBubbleText] = useState(message || '');
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const target = useRef({ rx: 0, ry: 0 });
  const current = useRef({ rx: 0, ry: 0 });
  const pupil = useRef({ x: 0, y: 0 });
  const currentPupil = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const bubbleTimeout = useRef(null);
  const blinkTimeout = useRef(null);

  // Affiche le message contextuel de l'écran à chaque changement
  useEffect(() => {
    if (!message) return;
    setBubbleText(message);
    setBubbleVisible(true);
    clearTimeout(bubbleTimeout.current);
    bubbleTimeout.current = setTimeout(() => setBubbleVisible(false), 3200);
    return () => clearTimeout(bubbleTimeout.current);
  }, [message]);

  // Suivi de la souris → tilt 3D + parallax des yeux
  useEffect(() => {
    function handleMouseMove(e) {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      target.current.ry = Math.max(-1, Math.min(1, dx)) * 16;
      target.current.rx = Math.max(-1, Math.min(1, -dy)) * 12;
      pupil.current.x = Math.max(-1, Math.min(1, dx)) * 6;
      pupil.current.y = Math.max(-1, Math.min(1, dy)) * 6;
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Boucle d'animation (lerp vers la cible à chaque frame)
  useEffect(() => {
    function lerp(a, b, t) { return a + (b - a) * t; }
    function tick() {
      current.current.rx = lerp(current.current.rx, target.current.rx, 0.08);
      current.current.ry = lerp(current.current.ry, target.current.ry, 0.08);
      currentPupil.current.x = lerp(currentPupil.current.x, pupil.current.x, 0.15);
      currentPupil.current.y = lerp(currentPupil.current.y, pupil.current.y, 0.15);

      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg)`;
      }
      if (eyeLRef.current && eyeRRef.current) {
        const t = `translate(${currentPupil.current.x}px, ${currentPupil.current.y}px)`;
        eyeLRef.current.style.transform = t;
        eyeRRef.current.style.transform = t;
      }
      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // Clignement aléatoire périodique
  useEffect(() => {
    function scheduleBlink() {
      const delay = 2200 + Math.random() * 3000;
      blinkTimeout.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 140);
      }, delay);
    }
    scheduleBlink();
    return () => clearTimeout(blinkTimeout.current);
  }, []);

  return (
    <div className="ca-stage" ref={stageRef}>
      <div className="ca-scale">
        <div className="ca-cloud-wrap ca-floater" ref={wrapRef}>
          <div className="ca-cloud-shape ca-shade"></div>
          <div className="ca-cloud-shape ca-fill"></div>

          <div className={`ca-bubble ${bubbleVisible ? 'ca-show' : ''}`}>{bubbleText}</div>

          <div className="ca-face">
            <div className="ca-eyes">
              <div className={`ca-eye ${blinking ? 'ca-blink' : ''}`} ref={eyeLRef}></div>
              <div className={`ca-eye ${blinking ? 'ca-blink' : ''}`} ref={eyeRRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CloudAssistant;