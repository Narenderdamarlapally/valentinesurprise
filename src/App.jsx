import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [answered, setAnswered] = useState(null); // null | yes | no
  const cardRef = useRef(null);
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

  function moveNoButton(cursorX, cursorY) {
    const c = cardRef.current;
    const n = noRef.current;
    if (!c || !n) return;
    if (isTouch) return; // don't move on touch devices
    if (movingRef.current) return; // prevent repeated rapid moves
    movingRef.current = true;
    setTimeout(() => (movingRef.current = false), MOVE_COOLDOWN);
    const crect = c.getBoundingClientRect();
    // prefer offset dimensions for button
    const btnWidth = n.offsetWidth || n.getBoundingClientRect().width || 80;
    const btnHeight = n.offsetHeight || n.getBoundingClientRect().height || 40;

    const padding = 12;
    const minLeft = padding;
    const minTop = padding;
    const maxLeft = Math.max(0, crect.width - btnWidth - padding);
    const maxTop = Math.max(0, crect.height - btnHeight - padding);

    // current center of the button
    const nrect = n.getBoundingClientRect();
    const nCenterX = nrect.left - crect.left + btnWidth / 2;
    const nCenterY = nrect.top - crect.top + btnHeight / 2;

    // direction away from cursor
    const dx = nCenterX - cursorX;
    const dy = nCenterY - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    // move distance proportional to card size
    const moveDist = Math.max(crect.width, crect.height) * 0.35;
    let newCenterX = Math.round(nCenterX + nx * moveDist);
    let newCenterY = Math.round(nCenterY + ny * moveDist);

    // clamp center so button stays fully inside
    newCenterX = Math.min(Math.max(newCenterX, minLeft + btnWidth / 2), maxLeft + btnWidth / 2);
    newCenterY = Math.min(Math.max(newCenterY, minTop + btnHeight / 2), maxTop + btnHeight / 2);

    const left = Math.round(newCenterX - btnWidth / 2);
    const top = Math.round(newCenterY - btnHeight / 2);

    setDetached(true);
    // slight delay to ensure CSS transition applies after detaching
    setTimeout(() => setNoPos({ left: `${left}px`, top: `${top}px` }), 20);
  }

  function handleMouseMove(e) {
    // Move the No button only when the cursor is close to it
    const c = cardRef.current;
    const n = noRef.current;
    if (!c || !n) return;
    const crect = c.getBoundingClientRect();
    const nrect = n.getBoundingClientRect();

    const cursorX = e.clientX - crect.left;
    const cursorY = e.clientY - crect.top;
    // compute distance from cursor to the NO button rectangle (0 if inside)
    const btnLeft = nrect.left - crect.left;
    const btnTop = nrect.top - crect.top;
    const btnRight = btnLeft + nrect.width;
    const btnBottom = btnTop + nrect.height;

    const dxRect = Math.max(btnLeft - cursorX, 0, cursorX - btnRight);
    const dyRect = Math.max(btnTop - cursorY, 0, cursorY - btnBottom);
    const rectDist = Math.sqrt(dxRect * dxRect + dyRect * dyRect);

    const THRESHOLD = 110; // pixels — triggers when cursor is near the button rect
    if (rectDist < THRESHOLD) {
      // pass cursor position relative to card
      moveNoButton(cursorX, cursorY);
    }
  }

  function handleYes() {
    setAnswered('yes');
    setDisplayName('NAVYA');
  }

  return (
    <div className="valentine-app">
      <div className="card" ref={cardRef} onMouseMove={handleMouseMove}>
        {answered === null && (
          <>
            <h1>Will you be my Valentine?</h1>
            {/* <p className="subtitle">Only click <strong>Yes</strong> if you mean it.</p> */}
<p>click <strong>Yes</strong> to promise to love, cherish, and grow together, or click <strong>No</strong> to be honest."</p>

            <div className="buttons">
              <button className="btn yes" onClick={handleYes}>Yes</button>

              {!detached && (
                <button
                  className="btn no"
                  ref={noRef}
                  {...(isTouch ? { onClick: () => setAnswered('no'), tabIndex: 0 } : { tabIndex: -1, 'aria-hidden': true })}
                >
                  No
                </button>
              )}

              {detached && (
                <button
                  className="btn no"
                  ref={noRef}
                  style={{ position: 'absolute', left: noPos.left, top: noPos.top }}
                  {...(isTouch ? { onClick: () => setAnswered('no'), tabIndex: 0 } : { tabIndex: -1, 'aria-hidden': true })}
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
