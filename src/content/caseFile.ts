/* 2026-11-03: MAX-1001 single case file.
   2026-11-03: no invented trace id. Times are milliseconds. */

export type CaseStepStatus = 'completed' | 'ok' | 'closed' | 'not-completed' | 'divergence'

export type CaseStep = {
  id: string
  system: string
  action: string
  detail: string
  tMs: number
  tag: string | null
  status: CaseStepStatus
}

export const caseFile = {
  trace: {
    caseId: '2026-CS-004821',
    started: '2026-01-02T09:14:33Z',
    observer: 'galactos-verifier-v2',
  },
  amount: '$48.00',
  renewalDate: '2026-02-02',
  steps: [
    {
      id: 'step-intent',
      system: 'CONVERSATION',
      action: 'Request understood.',
      detail: 'Customer asks to cancel and refund.',
      tMs: 0,
      tag: null,
      status: 'completed',
    },
    {
      id: 'step-policy',
      system: 'POLICY',
      action: 'Policy retrieved.',
      detail: 'Policy lookup returned the cancellation rule.',
      tMs: 142,
      tag: null,
      status: 'ok',
    },
    {
      id: 'step-payment',
      system: 'PAYMENT API',
      action: 'Refund action accepted.',
      detail: 'Payment API returned 200. Amount is the case amount.',
      tMs: 388,
      tag: '200 OK',
      status: 'ok',
    },
    {
      id: 'step-ticket',
      system: 'SUPPORT SYSTEM',
      action: 'Ticket closed.',
      detail: 'Support ticket marked closed.',
      tMs: 640,
      tag: 'Case closed',
      status: 'closed',
    },
    {
      id: 'step-subscription',
      system: 'SUBSCRIPTION AUTHORITY',
      action: 'Subscription still active.',
      detail: 'Next renewal still scheduled.',
      tMs: 640,
      tag: null,
      status: 'divergence',
    },
  ] satisfies CaseStep[],
}
