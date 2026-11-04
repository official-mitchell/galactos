/* 2026-11-03: MAX-999 dev fixture. Renders one Section per sections.ts id for the Playwright check. */

import { sections } from '../../content/sections'
import { Container } from './Container'
import { Rule } from './Rule'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'
import { Split } from './Split'

export function LayoutFixture() {
  return (
    <div data-layout-fixture="">
      {sections.map((entry) => (
        <Section
          key={entry.id}
          id={entry.id}
          act={entry.act}
          number={entry.number}
          variant={entry.act === 'I' ? 'emphasis' : 'base'}
        >
          <Container>
            <SectionHeader
              eyebrow={`${entry.number} / ${entry.label.toUpperCase()}`}
              title={entry.label}
              lede={entry.component}
            />
            <Split
              ratio="45/55"
              stickyLeft
              left={<p className="text-body">{entry.act}</p>}
              right={<p className="text-meta">{entry.id}</p>}
            />
            <Rule />
          </Container>
        </Section>
      ))}
    </div>
  )
}
