Hilomen, Christian A.            BSCS 3C
 
I selected sports(VOLLEYBALL) as the portfolio topic because:

Universal Appeal: Sports transcend age, culture, and geography
Visual Richness: Sports offer dynamic imagery and action-packed content
Educational Value: Demonstrates concepts like teamwork, discipline, and health
Interactive Potential: Natural fit for forms (registrations, interests, surveys)
Structured Content: Clear categories (team vs individual sports, skill levels)

1. Color Palette Rationale
    --primary-color: #1e40af;    /* Blue - Represents professionalism, trust */
    --secondary-color: #dc2626;  /* AquaBlue - Energy, passion, competition */
    --accent-color: #fbbf24;     /* Yellow - Achievement, medals, success */
    --neutral-color: #1f2937;    /* Dark Gray - Text, footer, stability */
Blue: Athletic apparel (jerseys), team colors, professional sports logos
Red: Competition, energy, urgency (like stopwatches, scoreboards)
G0ld/Yellow: Medals, trophies, winning moments
Gray: Provides balance and readability

2. Typography Strategy
Headings (Poppins): Bold, modern, energetic - reflects athleticism
Body Text (Roboto): Clean, readable, neutral - ensures accessibility
Hierarchy: Clear visual distinction between headings and content

3. Layout Structure
Header: Sticky navigation for easy access
Hero Sections: Full-width with gradient overlays for visual impact
Card Grid System: Organized content presentation
Footer: Consistent across all pages with essential info

FORM STRUCTURE PHILOSOPHY
Registration Form Design Principles
1. Progressive Disclosure
Forms are organized into logical sections:
(html)
1. Personal Information → 2. Experience Level → 3. Sports Interests → 4. Terms & Preferences
This reduces cognitive load and guides users through the process naturally.

2. Visual Form Sections
Each section is visually distinct:
.form-section {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 3px 15px rgba(0,0,0,0.08);
}

3. Radio Button Structure
Traditional radio buttons are transformed into interactive cards:
Clear visual hierarchy: Icons + bold labels + descriptions
Touch-friendly: Larger click areas for mobile users
State visibility: Selected option has distinct styling
Grouped layout: Grid system for organized presentation

4. Checkbox Structure (Multiple Selection)
Checkboxes follow a similar card-based approach:
Visual scanning: Sports icons aid quick recognition
Clear selection state: Checked items are obvious
Mobile optimization: Easy tap targets
Organized layout: Grid maintains alignment

5. Form Field Grouping
Fields are logically grouped:
<!-- Personal Info (grouped in pairs) -->
<div class="form-row">
    <div class="form-group">Full Name</div>
    <div class="form-group">Username</div>
</div>

<!-- Experience Level (single selection) -->
<div class="radio-group-enhanced">
    <!-- Radio cards here -->
</div>

<!-- Sports Interests (multiple selection) -->
<div class="checkbox-grid">
    <!-- Checkbox cards here -->
</div>

<!-- Terms (vertical list) -->
<div class="terms-section">
    <!-- Terms checkboxes -->
</div>