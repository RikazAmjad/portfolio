<USER_REQUEST>
# Task: Recreate David Estrada's Selected Work Scroll Animation for My Portfolio

## Objective

I want you to implement a sophisticated, scroll-driven Selected Work section in my existing personal software engineering portfolio.

**Primary visual and interaction reference:**
https://david-estrada.dev/

I've also provided a screen recording of the reference website. Use that recording as the primary visual reference for understanding the animation. Do not rely exclusively on the website's static appearance.

The goal is to reproduce the core interaction, composition, timing, and visual choreography of David Estrada's Selected Work section, while adapting its visual identity to my portfolio.

This is not a request to build conventional project cards, a project grid, or a basic fade-in-on-scroll section.

I specifically want the distinctive experience in which:
- Oversized typography establishes the Selected Work section.
- Website previews animate into the composition.
- Project previews overlap the oversized typography.
- The active project's preview expands and becomes prominent.
- The previous project moves away as another project preview enters.
- Project titles, descriptions, and supporting information change in coordination with the animation.
- The entire experience feels like a carefully choreographed editorial presentation.

The result should feel intentional, cinematic, responsive, and professionally engineered.

---

# 1. First: Understand the existing project

Before modifying anything, inspect my existing portfolio repository.

Project directory:
`D:/dev/projects/portfolio`

The project already uses:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Three.js
- React Three Fiber
- Drei
- Motion

The existing portfolio includes sections and components such as:
- Hero
- SelectedWorks
- Philosophy
- SocialProof
- ProjectModal
- MonolithCanvas

The actual file structure may have evolved, so inspect the current implementation rather than assuming these files are unchanged.

### Important instructions

1. Understand the current component hierarchy.
2. Locate the existing Selected Works implementation and its project data.
3. Understand the existing typography, colors, spacing, and global design system.
4. Identify how scrolling and smooth scrolling are currently implemented.
5. Check whether GSAP or ScrollTrigger is already installed.
6. Understand how the Three.js hero and other animated sections interact with the page.
7. Identify existing project screenshots, preview images, and assets.

Do not rebuild my portfolio from scratch.

Do not replace existing sections, redesign the entire website, or interfere with unrelated animations.

The task is to develop the Selected Work section within the existing architecture.

---

# 2. Understand the reference animation

Study the provided recording carefully.

The reference has a very distinctive composition.

### A. Oversized heading

The section begins with an enormous heading:

"Selected [icon] work"

The typography is:
- Extremely large.
- Heavy and bold.
- Black against a clean white background.
- Positioned horizontally across almost the entire viewport.
- The central icon sits inside a raised, rounded-square element.

The heading is an integral part of the composition, not a conventional section heading above a collection of cards.

Recreate this scale and visual dominance.

For my version:
- Use the existing portfolio typography where appropriate.
- Adapt the heading to my established visual identity.
- Preserve the oversized editorial composition.
- Do not copy the Upwork logo or its exact branding.
- Replace the Upwork icon with a distinctive, minimal graphic mark that belongs to my own portfolio.

The icon should feel like a designed part of the heading, not an emoji or an arbitrary decorative shape.

### B. Project preview animation

This is the most important part.

The reference does not display a regular grid of projects.

Instead, website screenshots enter the composition from different positions.

Observe the following behaviour in the recording:

1. The oversized heading initially occupies the main visual area.
2. The first project preview begins appearing beneath the heading, toward the left.
3. The preview progressively moves upward and becomes significantly larger.
4. The preview overlaps the heading.
5. Additional details of the project presentation become visible as the image expands.
6. The active project's title and description are presented underneath the main preview.
7. Supporting information and the project case-study link appear toward the opposite side.
8. As the user continues scrolling, the existing preview moves out of the main composition.
9. A new project preview enters, sometimes from the opposite side.
10. The new preview becomes the primary project while the project information changes accordingly.

The positioning is intentionally asymmetric.

Some project previews are positioned toward the left, others toward the right.

There are also smaller incoming preview elements that serve as visual teasers before becoming the main project.

This alternating composition is important. Do not position every preview in precisely the same location.

### C. Project information

The reference combines the visual preview with project information.

Each active project presentation should contain:

- Project title.
- Short, meaningful description.
- Relevant technologies or project categories.
- Optional year or project type, where existing data supports it.
- A clearly visible case-study or project link.

The project title is large and prominent.

The description is smaller and secondary.

The supporting information is subtle and should not compete with the project preview.

Project details should transition in coordination with the corresponding preview rather than changing independently.

---

# 3. Animation architecture

I recommend implementing this with GSAP and ScrollTrigger, using CSS positioning and transforms.

However, first inspect the existing animation dependencies and architecture.

Do not introduce unnecessary libraries if an existing solution already handles the same requirements effectively.

### Recommended structural architecture

Create a self-contained Selected Work presentation consisting of:

**SelectedWorksSection**
- Main section container.
- Scroll-driven animation timeline.
- Project sequence.

**HeadingLayer**
- Oversized Selected Work typography.
- Custom portfolio icon/mark.
- Positioning and layering.

**ProjectStage**
- Main preview presentation.
- Incoming preview.
- Outgoing preview.
- Layering and positioning.

**ProjectInformation**
- Active project title.
- Description.
- Technologies/categories.
- Case-study link.

**ScrollController**
- ScrollTrigger timeline.
- Animation progress.
- Project transitions.
- Responsive behaviour.

You may adjust this structure based on the existing project architecture. Avoid unnecessary component fragmentation.

### GSAP / ScrollTrigger behaviour

The desktop experience should use a coordinated, scroll-driven timeline.

Investigate the best implementation using:

- ScrollTrigger pinning.
- Scrubbed timeline progression.
- Coordinated `fromTo()` transitions.
- Individual animation timelines for preview layers.
- Appropriate easing for non-scroll-dependent transitions.
- Controlled z-index changes.
- Responsive animation values.

The animation should respond naturally to scroll position.

Scrolling downward should progressively reveal the work.

Scrolling upward should reverse the same animation cleanly.

Do not implement a collection of unrelated scroll-triggered animations that happen to overlap.

I want one coherent choreography.

### Suggested animation sequence

Treat these percentages as initial design targets, not fixed values. Adjust them through browser testing to match the reference.

| Timeline progress | Animation |
|---|---|
| 0–10% | Establish oversized heading and initial composition |
| 10–25% | First project preview enters beneath the heading |
| 25–40% | Preview moves upward, expands and overlaps typography |
| 40–50% | Project information becomes fully visible |
| 50–65% | First project transitions away and the next preview enters |
| 65–80% | Second preview becomes the primary presentation |
| 80–90% | Next project preview starts entering |
| 90–100% | Continue the project sequence and prepare the next transition |

Use a longer pinned scroll range if the number of projects requires it.

Do not force every project into an identical animation if a slight variation in direction and positioning produces a closer visual match.

---

# 4. Visual direction for my portfolio

I do not want to copy David Estrada's entire visual identity.

I want to borrow the interaction concept and adapt it to my established design direction.

My selected portfolio palette:

- Coral red: `#F7444E`
- Off-white: `#F7F8F3`
- Muted teal: `#78BCC4`
- Deep blue-green: `#002C3E`

### How to apply this palette

Use off-white as the primary background where appropriate.

Use deep blue-green for typography and visual contrast.

Use coral red sparingly for meaningful visual emphasis.

Use muted teal as a secondary accent.

The result should remain sophisticated and restrained.

Avoid:
- Generic gradient backgrounds.
- Excessive glassmorphism.
- Unnecessary glowing elements.
- Overly rounded cards.
- Floating pill-shaped technology labels.
- Generic AI-generated portfolio aesthetics.
- Excessive shadows.
- Random decorative shapes.
- Unnecessary animation effects added simply to make the section look complicated.

The reference works because its composition is strong and its typography is confident.

Preserve that design principle.

---

# 5. Project previews and actual portfolio content

Use the real projects and assets already available in my repository.

Inspect the existing project data before making changes.

Projects that may be suitable include:

- InMind / OMS: SaaS order management system for ecommerce operations.
- MadinaBites: Full-stack food ordering platform.
- AgenticArmor / GateKeeper AI: AI-assisted security and DevSecOps project.
- NGO donation platform, where existing portfolio content supports its inclusion.

These are examples, not an instruction to invent or force all four into the section.

Use the actual project information and available screenshots.

### Preview requirements

Each project should have a high-quality visual preview.

Prioritize:
1. Actual screenshots of the deployed project.
2. Existing project preview assets.
3. Existing desktop/mobile screenshots if available.

Do not use:
- Random stock images.
- Generated website screenshots pretending to be real projects.
- Unrelated placeholder photographs.
- Fabricated project content.

When both desktop and mobile screenshots exist, consider combining them into a layered composition, inspired by the reference.

For example:
- Primary desktop website screenshot.
- Smaller mobile screenshot layered alongside it.
- Controlled overlap and depth.

Only use this treatment when the assets genuinely exist and the composition benefits from it.

The image should communicate the actual project, not merely decorate the page.

---

# 6. Positioning and composition

The project preview and heading should feel like parts of the same visual composition.

Do not use a conventional card layout.

For desktop, use an absolute-positioned or otherwise carefully controlled project stage where appropriate.

The main preview should occupy a substantial portion of the viewport, roughly 50–60% of the available width as an initial reference.

Its dimensions and position should change according to the animation stage.

Important considerations:

- Large preview entering from below or from the side.
- Preview moving upward into the main visual area.
- Deliberate overlapping with oversized typography.
- Alternating left/right presentation.
- Smaller incoming project teaser.
- Outgoing project moving beyond the visible composition.
- Project information remaining legible.
- Controlled stacking order.
- Clipping at the section boundary where necessary.

Do not make the screenshots unnecessarily small.

The reference uses large website previews that are visually recognizable.

Maintain a clean relationship between the heading, project image, title and description.

---

# 7. Smooth scrolling and existing animation integration

My portfolio already has an animated 3D environment and motion-based interactions.

Check whether Lenis or another smooth-scrolling implementation exists.

If Lenis is already integrated:
- Preserve it.
- Ensure its scroll updates are synchronized correctly with ScrollTrigger.
- Avoid duplicate animation loops.
- Avoid introducing competing scroll controllers.
- Verify that pinning behaves correctly with the existing scrolling implementation.

If the project already has a shared animation utility or provider, use it where appropriate.

The new section must not interfere with:
- Hero animations.
- Three.js rendering.
- Existing section transitions.
- Navbar behaviour.
- Other scroll-triggered elements.

Use proper GSAP context management and cleanup.

Avoid memory leaks, duplicate triggers after remounting, and unnecessary React state updates on every scroll frame.

---

# 8. Responsive behaviour

The desktop composition is the primary reference, but the implementation must work well on tablets and mobile devices.

### Desktop

Preserve the full experience:
- Oversized typography.
- Layered previews.
- Asymmetric positioning.
- Scroll-driven transitions.
- Overlapping elements.
- Full project information.

### Tablet

Adjust:
- Heading scale.
- Preview dimensions.
- Animation distance.
- Positioning.
- Scroll duration.

Avoid clipping important content.

### Mobile

Do not blindly shrink the desktop design.

Redesign the composition responsively while retaining its identity.

Requirements:
- Readable project heading.
- Prominent project preview.
- Appropriate image proportions.
- Clear project title and description.
- Accessible links.
- Less complicated overlapping.
- No horizontal overflow.

Evaluate whether pinned animation is beneficial on mobile.

If pinning produces an awkward or excessively long scrolling experience, switch to a natural vertical presentation with lighter entrance and transition effects.

The mobile version should still feel designed, not like a broken desktop fallback.

---

# 9. Performance and accessibility

This section will contain large visual assets and scroll animations, so performance matters.

Implement:

- Next.js Image where appropriate.
- Correct image dimensions and aspect ratios.
- Optimized image formats.
- Lazy loading for non-active previews.
- Sensible loading priorities.
- GPU-friendly transform and opacity animations.
- Reduced unnecessary repaints.
- Proper GSAP cleanup.
- `prefers-reduced-motion` support.
- Semantic HTML.
- Accessible link labels.
- Keyboard-accessible project navigation.

Do not animate expensive properties unnecessarily.

Do not load every large project image eagerly.

For reduced-motion users, offer a clean static project presentation or a substantially simplified transition.

The animation must not be essential to understanding the project content.

---

# 10. Implementation requirements

Do not stop after producing an analysis, animation proposal, or static mockup.

Actually implement the section in the existing repository.

Work in the following order:

**Phase 1 — Reference reconstruction**

Study the provided recording and identify the important visual states, positions, overlaps, project transitions and heading proportions.

**Phase 2 — Existing project audit**

Inspect the current implementation, existing components, project data, image assets and scrolling architecture.

**Phase 3 — Desktop implementation**

Build the complete desktop experience using real project content.

**Phase 4 — Responsive implementation**

Implement and test tablet and mobile layouts separately.

**Phase 5 — Integration**

Ensure compatibility with the existing portfolio design, smooth scrolling, 3D hero and other animations.

**Phase 6 — Browser verification**

Run the portfolio locally and inspect the actual result in the browser.

Do not rely exclusively on code inspection.

---

# 11. Browser verification and quality control

Use the available browser automation or browser interaction tools.

Inspect the section at multiple scroll positions.

Verify the following:

1. The initial heading composition.
2. The first preview entering.
3. The main preview expanding.
4. The overlap between image and typography.
5. Project information appearing.
6. The next preview entering.
7. The outgoing preview leaving.
8. The transitions reversing when scrolling upward.
9. The final project transition.
10. The section exit and transition to the next portfolio section.

Test at approximately these viewport sizes:

- 1440 × 900
- 1280 × 800
- 1024 × 768
- 768 × 1024
- 390 × 844

Check for:
- Unexpected horizontal scrolling.
- Text clipping.
- Images covering important information.
- Incorrect z-index.
- Broken scroll pinning.
- Animation jumps.
- Flickering.
- Layout shifts.
- Poor mobile positioning.
- Conflicts with existing smooth scrolling.

Capture screenshots of the initial, intermediate and final animation states.

If the result looks different from the recording, adjust the implementation rather than accepting the first working version.

---

# 12. Design quality expectations

This is an important part of my personal portfolio.

I do not want a result that is technically functional but visually ordinary.

The implementation should demonstrate:
- Strong visual hierarchy.
- Excellent typography.
- Precise image placement.
- Well-considered spacing.
- Smooth transitions.
- A consistent visual identity.
- Professional presentation of real projects.
- Careful responsive behaviour.

The animation should feel like a designed interaction, not an assortment of effects.

Avoid adding unnecessary elements simply because they are easy to animate.

**Reference fidelity is more important than adding extra effects.**

First reproduce the interaction and composition convincingly. Then refine the aesthetic to fit my portfolio.

---

# 13. Final deliverables

After implementation, provide:

1. A summary of the changes.
2. The components created or modified.
3. The animation implementation approach.
4. Any dependencies added and why.
5. How the existing project data and images were reused.
6. Desktop and mobile verification results.
7. Screenshots of the final implementation at important animation states.
8. Any outstanding limitations.

Do not modify unrelated sections or silently remove existing portfolio functionality.

## Final instruction

Treat David Estrada's Selected Work section and the supplied screen recording as the interaction reference.

Treat my existing portfolio as the source of truth for architecture, project content, typography and brand identity.

I want the final result to feel like a highly polished, custom-engineered portfolio experience that captures the distinctive scroll choreography of the reference while remaining unmistakably my own.

**Inspect → Reconstruct → Implement → Integrate → Browser-test → Refine.**

Do not stop at the first implementation. Visually verify and refine until the result is convincing.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-11-01T17:04:19+05:00.

The user's current state is as follows:
Active Document: d:\dev\projects\portfolio\src\components\sections\PhilosophySection.tsx (LANGUAGE_UNSPECIFIED)
Cursor is on line: 140
Other open documents:
- d:\dev\projects\portfolio\src\components\ui\3d-gallery-photography.tsx (LANGUAGE_UNSPECIFIED)
- d:\dev\projects\portfolio\src\components\ui\3d-gallery-photography-demo.tsx (LANGUAGE_UNSPECIFIED)
- d:\dev\projects\portfolio\src\components\canvas\CharacterCanvas.tsx (LANGUAGE_UNSPECIFIED)
- d:\dev\projects\portfolio\src\components\sections\HeroSection.tsx (LANGUAGE_UNSPECIFIED)
- d:\dev\projects\portfolio\src\app\globals.css (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>