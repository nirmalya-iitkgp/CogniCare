# NeuroPulse Diagnostics

NeuroPulse Diagnostics is an interactive health and cognitive assessment platform designed for everyday users across seven human life stages. It presents twenty-eight diagnostic games in a clean, full-height light-mode 7-part hero experience featuring bespoke vector line art illustrations and tailored light color palettes.

---

## 7-Part Hero Life Stages & Artistic Line Art

1. **Infants (0–3 years)**: Soft teal palette (`#0d9488`) · Celestial crescent moon, sleeping infant in botanical swaddling folds, dandelion fluffs, and wooden developmental alphabet blocks.
   - *Games*: Tiny Touch, Novelty Peek, Sound Hop, Hide & Seek
2. **Toddlers (4–6 years)**: Warm amber palette (`#d97706`) · Dynamic origami crane taking flight, wind swirl ribbons, child discovery silhouette, and painter's palette of primary forms.
   - *Games*: Space Pilot, Color Safari, Pattern Simon, Tracing Master
3. **Children (7–12 years)**: Sky azure palette (`#2563eb`) · Da Vinci sketchbook armillary sphere, triangular prism light refraction rays, contemplative student profile, and open folio book.
   - *Games*: Rule Switcher, Color Clash, Block Stacker, Shape Matcher
4. **Teens (13–18 years)**: Electric violet palette (`#7c3aed`) · Hellenic Hermes kinetic runner with velocity speed rays, winged heels, precision chronometer dial, and cardiogram pulse.
   - *Games*: Reflex Grid, Speedometer, Card Decks, Logic Matrix
5. **Young Adults (19–30 years)**: Fresh emerald palette (`#059669`) · Editorial contour profile, synaptic neural constellation lattice, golden ratio calipers, and botanical monstera frond.
   - *Games*: Life Canvas, Calm State, Rhythm Math, Memory Scan
6. **Adults (31–60 years)**: Deep sapphire palette (`#4f46e5`) · Humphrey visual field perimetry polar grid, architectonic profile, harmonic soundwave curves, and navigation compass rose.
   - *Games*: Star Field, Radar Operator, Pathfinder, Tone Tuner
7. **Seniors (61+ years)**: Gentle rose palette (`#e11d48`) · Dignified elder profile, Zen Enso balance tremor spiral, antique Roman numeral clock dial (11:10 target), and ginkgo longevity leaves.
   - *Games*: Speed Tapper, Steady Hand, Market Manager, Clock Drawing

---

## Clean UI Architecture & Screen Optimization

- **Desktop (1024px+)**: Exact 7-way vertical split slices with fluid accordion expansion on hover/select, persistent full viewport fit (`h-dvh`), and zero vertical scrollbar spill.
- **Tablet (640px–1023px)**: Responsive accordion presenting games in an ergonomic 2-column grid (`grid-cols-2`) with watermark line-art framing.
- **Mobile Phones (< 640px)**: Compact, touch-friendly accordion rows with $\ge 44$px interactive targets, dynamic viewport calculation (`h-dvh`), and smooth vertical scrolling.
- **Artistic Vector Line Art**: Scalable SVG graphics with organic curves, subtle gradient fills, and allegorical life motifs replacing raster images.
- **Light Color Palettes**: Individual light background gradients tailored for each stage, paired with high-contrast typography and subtle 1px dividers.
- **Search in Header**: Live search bar positioned in the top right header, expanding the matching stage and highlighting games in real-time.
- **Immediate Play**: 1-click test launcher with millisecond reaction timers, normative percentiles, and printable scorecards.

---

## Testing & Quality Assurance

Automated unit and security tests cover clinical registry invariants, normative scoring algorithms, reaction latency moments, and red-pill/blue-pill boundary sanitization:

```bash
# Automated tests
npm test

# Development server
npm run dev

# Production build
npm run build
```
