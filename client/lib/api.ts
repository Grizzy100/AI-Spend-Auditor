import type {
  AuditFormState,
  CreateAuditResponse,
  GetReportResponse,
  LeadPayload,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  /** Submit audit form — returns shareId */
  createAudit: (data: Omit<AuditFormState, 'tools'> & { tools: Omit<import('@/types').ToolEntry, 'id'>[] }) =>
    apiFetch<CreateAuditResponse>('/audit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Fetch public report by shareId */
  getReport: (shareId: string) =>
    apiFetch<GetReportResponse>(`/report/${shareId}`),

  /** Capture lead after showing results */
  captureLead: (data: LeadPayload) =>
    apiFetch<{ success: boolean; message: string }>('/lead', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
