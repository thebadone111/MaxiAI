import { useCallback, useRef } from 'react';
import Picture from './Picture.jsx';
import { useInView, useScrollProgress } from '../motion/hooks.js';
import { useIntroDone } from '../intro/state.js';

/*
 * The photo variant's media. Hard edges, no shadow, no radius — every
 * measurable premium reference site on Minifinans used border-radius: 0 on
 * photography, and so do we.
 */

// One element, two hooks: measured by useScrollProgress, marked in-view so
// the image only holds a compositor layer while it is on screen.
function useDriftRefs(progressRef, inViewRef) {
  return useCallback((el) => {
    progressRef.current = el;
    inViewRef.current = el;
  }, [progressRef, inViewRef]);
}

/**
 * A 4:5 photograph with a slow parallax drift (after Minifinans'
 * ParallaxFigure). The image is 124% of the frame so an edge is never
 * exposed. `hero` loads eagerly and settles from a slight zoom as the page
 * arrives.
 */
export function PhotoFigure({ photo, amount = 8, hero = false }) {
  const img = useRef(null);
  const arrived = useIntroDone();
  const progress = useScrollProgress((p) => {
    if (img.current) img.current.style.transform = `translate3d(0, ${((1 - 2 * p) * amount).toFixed(2)}%, 0)`;
  }, { rest: 0.5 });
  const inView = useInView();
  const setRefs = useDriftRefs(progress, inView);

  return (
    <div ref={setRefs} className={`absolute inset-0 overflow-hidden bg-stone ${hero && arrived ? 'is-in' : ''}`}>
      <div className={hero ? 'hero-photo absolute inset-0' : 'absolute inset-0'}>
        <Picture
          photo={photo}
          alt={photo.alt}
          imgRef={img}
          eager={hero}
          sizes="(min-width: 1280px) 480px, 38vw"
          className="will-move absolute inset-x-0 w-full object-cover"
          style={{ height: '124%', top: '-12%' }}
        />
      </div>
    </div>
  );
}

/** The photo inside the opening window of the home reveal scene. */
export function PhotoReveal({ photo, imgRef }) {
  return (
    <Picture
      photo={photo}
      alt={photo.alt}
      imgRef={imgRef}
      sizes="100vw"
      className="will-move h-full w-full object-cover"
    />
  );
}
