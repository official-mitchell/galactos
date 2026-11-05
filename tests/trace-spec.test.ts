/* 2026-11-04: MAX-1006. Divergence cannot start before the last success beat plus the lag. */
import assert from 'node:assert/strict'
import test from 'node:test'
import { DIVERGENCE_LAG } from '../src/motion/tokens.ts'
import { traceOrderError, type TraceBeat } from '../src/motion/traceSpec.ts'
import { activeLoopCount, claimLoop, releaseLoop, resetLoops } from '../src/motion/loops.ts'
import { MOTION_PROPS } from '../src/motion/performance.ts'

const success: TraceBeat = { type: 'node', target: '#a', at: 0, dur: 0.4 }

test('divergence waits for the last success beat plus the lag', () => {
  const early: TraceBeat = { type: 'divergence', target: '#b', at: success.dur, dur: 0.4 }
  assert.match(traceOrderError([success, early]) ?? '', /divergence/)

  const held: TraceBeat = {
    type: 'divergence',
    target: '#b',
    at: success.dur + DIVERGENCE_LAG,
    dur: 0.4,
  }
  assert.equal(traceOrderError([success, held]), null)
})

test('beats must stay in order', () => {
  const backwards: TraceBeat = { type: 'label', target: '#b', at: -0.1, dur: 0.2 }
  assert.match(traceOrderError([success, backwards]) ?? '', /before/)
})

test('only one loop can be claimed', () => {
  resetLoops()
  const first = {}
  const second = {}
  assert.equal(claimLoop(first), true)
  assert.equal(claimLoop(second), false)
  assert.equal(activeLoopCount(), 1)
  releaseLoop(first)
  assert.equal(claimLoop(second), true)
  resetLoops()
})

test('motion props stay on the compositor list and never pin', () => {
  assert.deepEqual(MOTION_PROPS, ['x', 'y', 'scale', 'rotation', 'opacity', 'strokeDashoffset', 'clipPath'])
})
