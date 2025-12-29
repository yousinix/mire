import { z } from 'zod';
import * as generate from '../routes/api/generate/schema';
import type { RouteId } from '$app/types';

export type StreamEvent = {
  type: string;
  data: unknown;
};

export type StreamSchema<
  TReq extends z.ZodTypeAny = z.ZodTypeAny,
  TEvents extends z.ZodType<StreamEvent> = z.ZodType<StreamEvent>
> = {
  method: 'POST' | 'GET';
  request: TReq;
  events: TEvents;
};

type StreamSchemaMap = Partial<Record<RouteId, StreamSchema>>;

const streamSchema = {
  '/api/generate': generate.schema
} as const satisfies StreamSchemaMap;

type Route = keyof typeof streamSchema;
type RequestOf<T extends Route> = z.infer<(typeof streamSchema)[T]['request']>;
type EventsOf<T extends Route> = z.infer<(typeof streamSchema)[T]['events']>;

export type CreateStreamOptions<TRoute extends Route> = {
  onMutate?: () => void;
  onData?: (event: EventsOf<TRoute>) => void | Promise<void>;
};

export type CreateStreamResult<TRoute extends Route> = {
  mutate: (body: RequestOf<TRoute>) => Promise<void>;
  event: EventsOf<TRoute> | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * A type-safe helper, inspired from `svelte-query`, for streaming data.
 */
export function createStream<TRoute extends Route>(
  route: TRoute,
  options: CreateStreamOptions<TRoute> = {}
): CreateStreamResult<TRoute> {
  const schema = streamSchema[route] as StreamSchema;

  let event: EventsOf<TRoute> | null = $state(null);
  let error: string | null = $state(null);
  let isLoading = $state(false);

  const mutate = async (body: RequestOf<TRoute>) => {
    isLoading = true;
    event = null;
    error = null;

    try {
      const parsedBody = schema.request.parse(body);

      options.onMutate?.();
      const response = await fetch(route, {
        method: schema.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody)
      });

      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const json = line.slice(6); // Remove 'data: ' prefix
          const parsedEvent = JSON.parse(json) as EventsOf<TRoute>;
          const eventType = parsedEvent.type;

          event = parsedEvent;
          await options.onData?.(parsedEvent);

          if (eventType === 'done') {
            isLoading = false;
          }

          if (eventType === 'error') {
            isLoading = false;
            error = (parsedEvent.data as { message: string }).message;
          }
        }
      }

      isLoading = false;
    } catch (e) {
      console.error('Streaming error:', e);
      const err = e instanceof Error ? e : new Error('An unexpected error occurred');
      isLoading = false;
      error = err.message;
      return;
    }
  };

  return {
    mutate,
    get event() {
      return event;
    },
    get isLoading() {
      return isLoading;
    },
    get error() {
      return error;
    }
  };
}
