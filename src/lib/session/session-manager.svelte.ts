import { onMount } from 'svelte';
import { type SessionData, Session, SESSION_PREFIX } from './session';

export function createSessionManager() {
  let current: Session | null = $state(null);
  let sessions: Session[] = $state([]);

  onMount(() => {
    sessions = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(SESSION_PREFIX)) continue;

      const item = localStorage.getItem(key);
      if (!item) continue;

      const session = new Session(JSON.parse(item), key);
      sessions.push(session);
    }
  });

  return {
    get current() {
      return current;
    },
    get sessions() {
      return sessions;
    },
    load(key: string) {
      const session = sessions.find((s) => s.key === key);
      if (!session) return;
      current = session;
    },
    new(data: Omit<SessionData, 'createdAt'>) {
      const now = Date.now();
      current = new Session(
        {
          ...data,
          createdAt: now
        },
        `${SESSION_PREFIX}-${now}`
      );

      current.save();
      sessions.unshift(current);
    },
    reset() {
      current = null;
    }
  };
}
