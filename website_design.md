<high_level_design>
1. **Brand & Art Direction Overview**
   * Clean, modern design with a dreamy sky/cloud background that conveys innovation and elevation
   * Minimalist interface with focus on the central search/input area
   * Professional yet approachable aesthetic that inspires startup founders
   * Card-based layout showcasing AI-generated pitch examples
   * Subtle gradients and smooth transitions throughout

2. **Color Palette** (Clone Exactly)
   | Token | HEX / RGB | Usage | Notes |
   |-------|-----------|-------|-------|
   | Primary Purple | #8B5CF6 | Logo, CTAs, accent elements | Main brand color |
   | Background Sky | #6366F1 to #8B5CF6 | Main background gradient | Dreamy sky effect |
   | Card Background | #1F1F1F | Project cards, input areas | Dark contrast |
   | Text White | #FFFFFF | Primary text, headlines | High contrast |
   | Text Gray | #9CA3AF | Secondary text, descriptions | Subtle text |
   | Button Primary | #8B5CF6 | Primary buttons | Matches logo |
   | Button Secondary | #374151 | Secondary actions | Neutral dark |

3. **Typography Scale** (Clone Exactly)
   * Primary: Inter or similar sans-serif font family
   * Hero headline: 64px, font-weight 700, italic style
   * Subheadline: 18px, font-weight 400
   * Card titles: 16px, font-weight 600
   * Body text: 14px, font-weight 400
   * Button text: 14px, font-weight 500

4. **Spacing & Layout Grid** (Clone Exactly)
   * Container max-width: 1200px
   * Grid gap between cards: 24px
   * Padding: 24px on sides, 48px top/bottom
   * Card padding: 20px
   * Button padding: 12px 24px

5. **Visual Effects & Treatments** (Clone Exactly)
   * Background: Linear gradient with cloud imagery overlay
   * Card shadows: 0 4px 20px rgba(0,0,0,0.2)
   * Border radius: 12px for cards, 8px for buttons
   * Input focus states with purple glow
   * Smooth hover transitions (0.2s ease)

6. **Component Styles** (Clone Exactly)
   * Navigation: Fixed header with logo, social links, and auth buttons
   * Search input: Dark background with purple accent and microphone icon
   * Category tabs: Rounded pills with active state highlighting
   * Project cards: Dark background with hover effects and video previews
   * Footer: Simple links centered at bottom

7. **Site sections** (Clone Exactly)
   * Navigation Header
   * Hero Section with main headline and search input
   * Category Tabs (Basic Pitch, Full Pitch Site, VC-Ready Export)
   * Featured Pitch Examples Grid
   * Footer with links
</high_level_design>

<sections>
  <clone_section>
    <file_path>src/components/sections/navigation.tsx</file_path>
    <design_instructions>
      Clone the top navigation bar with VCR logo (purple gradient), social media icons (Discord, X, LinkedIn), and authentication buttons (Log in, Sign up), maintaining the exact spacing, typography, and styling from the reference design but adapting content for the AI pitch generator branding.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/hero.tsx</file_path>
    <design_instructions>
      Clone the hero section with dreamy cloud background, large italic headline "Generate Your Pitch Deck", subtitle about AI-powered investor presentations, and the central dark search input area with microphone icon and "Describe your startup idea..." placeholder text, maintaining exact typography, spacing and visual effects.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/category-tabs.tsx</file_path>
    <design_instructions>
      Clone the category navigation tabs below the search input, replacing "Landing Pages", "Web Apps", "Portfolio Websites" with "Basic Pitch ($10)", "Full Pitch Site ($29)", "VC-Ready Export ($79)", maintaining the exact pill-style design, spacing, and hover states from the reference.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/pitch-examples.tsx</file_path>
    <design_instructions>
      Clone the grid of example project cards, replacing them with AI-generated pitch deck examples (e.g., "FinTech Startup", "Healthcare AI", "Climate Tech", "B2B SaaS"), maintaining the exact card design with dark backgrounds, rounded corners, hover effects, and the same grid layout and spacing as the reference design.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/footer.tsx</file_path>
    <design_instructions>
      Clone the simple footer section with centered links, replacing "Privacy Policy" and "Terms of Service" with relevant links for the VCR pitch generator service, maintaining the exact typography, spacing, and positioning from the reference design.
    </design_instructions>
  </clone_section>
</sections>