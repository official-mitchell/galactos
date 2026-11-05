/* 2026-11-04: MAX-1016 §4.6 section intake gate.
   npm run gate:section -- --section <id>
   Refuses --section all so this command never runs the 11-section matrix.

   Intake loop for a new mock (do this before editing the section):
   1. Save the mock at instructions/design/mocks/ (repo path; checklist shorthand
      design/mocks). Do not move the mocks already in that folder.
   2. Diff the mock against the section spec in
      instructions/prd/galactos-implementation-checklist.md and update that
      spec first.
   3. List new primitives. Add one to the diagram kit only if it is reused
      at least twice.
   4. Build with existing primitives. No new tokens without owner approval.
   5. Visual pass (not this gate): npm run shot -- --section <id> --mode both
      with --w/--h omitted, which is the four viewports in scripts/sections.mjs.
      Default motion on that harness is final (?motion=final).
   6. npm run compare -- --section <id>; fix; repeat. Stop after 5 passes.

   This gate then runs lint:tokens, test:type-floor when that script exists,
   and one ?motion=final snapshot through the existing shot harness
   (light, 1440×900). */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const section = readSection(process.argv.slice(2))

run('lint:tokens')
if (fs.existsSync(path.join(rootDir, 'tests/type-floor.spec.ts'))) run('test:type-floor')
run('shot', ['--section', section, '--mode', 'light', '--motion', 'final', '--w', '1440', '--h', '900'])

function readSection(argv) {
  let sectionId = 'hero'
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] !== '--section') continue
    sectionId = argv[i + 1]
    if (!sectionId || sectionId.startsWith('--')) fail('Pass --section <id>.')
  }
  if (sectionId === 'all') fail('gate:section refuses --section all. Pass one section id.')
  return sectionId
}

function run(script, extra = []) {
  console.log(`\n> npm run ${script}${extra.length ? ` -- ${extra.join(' ')}` : ''}`)
  const result = spawnSync('npm', ['run', script, ...(extra.length ? ['--', ...extra] : [])], {
    cwd: rootDir,
    stdio: 'inherit',
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
