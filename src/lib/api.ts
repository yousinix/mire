import { z } from 'zod';
import * as generate from '../routes/api/generate/schema';
import type { RouteId } from '$app/types';

export type ApiEndpointSchema<
  TReq extends z.ZodTypeAny = z.ZodTypeAny,
  TRes extends z.ZodTypeAny = z.ZodTypeAny
> = {
  method: 'POST' | 'GET';
  request: TReq;
  response: TRes;
};

export type ApiSchema = Partial<Record<RouteId, ApiEndpointSchema>>;

const apiSchema = {
  '/api/generate': generate.schema
} as const satisfies ApiSchema;

/**
 * Returns a type-safe {@link fetch} function for the given API {@param route}.
 */
export function createFetch<T extends keyof typeof apiSchema>(route: T) {
  return (body: z.infer<(typeof apiSchema)[T]['request']>) => {
    const schema = apiSchema[route];
    const parsedBody = schema.request.parse(body);

    return fetch(route, {
      method: apiSchema[route].method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedBody)
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      return schema.response.parse(data);
    }) as Promise<z.infer<(typeof apiSchema)[T]['response']>>;
  };
}
