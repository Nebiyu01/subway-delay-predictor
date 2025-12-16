import { useEffect, useRef } from 'react';

const HEARTBEAT_THROTTLE_MS = 60_000 * 3;
const WINDOW_EVENTS: Array<keyof WindowEventMap> = [
  'focus',
  'pointerdown',
  'pointermove',
  'keydown',
  'scroll',
  'touchstart',
];
const DOCUMENT_EVENTS: Array<keyof DocumentEventMap> = ['visibilitychange'];

export function useDevServerHeartbeat() {
  const lastHeartbeatRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const maybeSendHeartbeat = () => {
      if (document.hidden) return;

      const now = Date.now();
      if (now - lastHeartbeatRef.current < HEARTBEAT_THROTTLE_MS) {
        return;
      }

      lastHeartbeatRef.current = now;
      fetch('/', { method: 'GET', cache: 'no-store' }).catch(() => {
        // no-op: this endpoint only keeps the dev server warm
      });
    };

    const startHeartbeatListeners = () => {
      WINDOW_EVENTS.forEach((event) =>
        window.addEventListener(event, maybeSendHeartbeat, { passive: true })
      );
      DOCUMENT_EVENTS.forEach((event) => document.addEventListener(event, maybeSendHeartbeat));
    };

    const stopHeartbeatListeners = () => {
      WINDOW_EVENTS.forEach((event) => window.removeEventListener(event, maybeSendHeartbeat));
      DOCUMENT_EVENTS.forEach((event) =>
        document.removeEventListener(event, maybeSendHeartbeat)
      );
    };

    startHeartbeatListeners();
    maybeSendHeartbeat();

    return () => {
      stopHeartbeatListeners();
    };
  }, []);
}
