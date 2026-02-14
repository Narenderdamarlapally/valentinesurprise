import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [answered, setAnswered] = useState(null); // null | yes | no
  const containerRef = useRef(null);
  const noRef = useRef(null);
  const [noPos, setNoPos] = useState({ left: '55%', top: '60%' });
  const [detached, setDetached] = useState(false);
  const movingRef = useRef(false);
  const MOVE_COOLDOWN = 1800; // ms - should match CSS transition duration + small buffer
  const [isTouch, setIsTouch] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    // ensure noPos cleared initially (buttons side-by-side)
    setNoPos({ left: '55%', top: '60%' });
    // detect touch devices and disable evasive behavior there
    const touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    setIsTouch(!!touch);
  }, []);

  function moveNoButton() {
    const c = containerRef.current;
    const n = noRef.current;
    if (!c || !n) return;
    if (isTouch) return; // don't move on touch devices
    if (movingRef.current) return; // prevent repeated rapid moves
    movingRef.current = true;
    setTimeout(() => (movingRef.current = false), MOVE_COOLDOWN);
    const crect = c.getBoundingClientRect();
    const nrect = n.getBoundingClientRect();

    const padding = 20;
    const maxLeft = crect.width - nrect.width - padding;
    const maxTop = crect.height - nrect.height - padding;
    // detach the No button from the flow and position it at a random safe place
    const left = Math.max(padding, Math.random() * maxLeft);
    const top = Math.max(padding, Math.random() * maxTop);
    setDetached(true);
    // slight delay to ensure CSS transition applies after detaching
    setTimeout(() => setNoPos({ left: `${left}px`, top: `${top}px` }), 20);
  }

  function handleMouseMove(e) {
    // Move the No button only when the cursor is close to it
    const c = containerRef.current;
    const n = noRef.current;
    if (!c || !n) return;
    const crect = c.getBoundingClientRect();
    const nrect = n.getBoundingClientRect();

    const cursorX = e.clientX - crect.left;
    const cursorY = e.clientY - crect.top;
    const nCenterX = nrect.left - crect.left + nrect.width / 2;
    const nCenterY = nrect.top - crect.top + nrect.height / 2;

    const dx = cursorX - nCenterX;
    const dy = cursorY - nCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const THRESHOLD = 100; // pixels
    if (dist < THRESHOLD) {
      moveNoButton();
    }
  }

  function handleYes() {
    setAnswered('yes');
    setDisplayName('NAVYA');
  }

  return (
    <div className="valentine-app" ref={containerRef} onMouseMove={handleMouseMove}>
      <div className="card">
        {answered === null && (
          <>
            <h1>Will you be my Valentine?</h1>
            {/* <p className="subtitle">Only click <strong>Yes</strong> if you mean it.</p> */}
<p>click <strong>Yes</strong> to promise to love, cherish, and grow together, or click <strong>No</strong> to be honest."</p>

            <div className="buttons">
              <button className="btn yes" onClick={handleYes}>Yes</button>

              {!detached && (
                <button className="btn no" ref={noRef} tabIndex={-1} aria-hidden="true">No</button>
              )}

              {detached && (
                <button
                  className="btn no"
                  ref={noRef}
                  style={{ position: 'absolute', left: noPos.left, top: noPos.top }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  No
                </button>
              )}
            </div>
          </>
        )}

        {answered === 'yes' && (
          <div className="result">
            <h2>{displayName}</h2>
            <p className="thank">Thank you, my wife ❤️</p>

            <div className="quotes">
              <p>“You are my today and all of my tomorrows.”</p>
              <p>“I love you not only for what you are, but for what I am when I am with you.”</p>
              <p>“Every moment with you is a beautiful dream come true.”</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
