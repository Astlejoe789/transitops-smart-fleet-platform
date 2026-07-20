# UI/UX Design System

## Typography

- **Primary Font**: Inter (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)

## Color Palette

| Token | Light Mode | Usage |
|-------|-----------|-------|
| Primary | `#3b82f6` (Blue 500) | CTA buttons, active states, links |
| Accent | `#22c55e` (Green 500) | Success states, positive metrics |
| Warning | `#f59e0b` (Amber 500) | Alerts, pending states |
| Danger | `#ef4444` (Red 500) | Errors, destructive actions |
| Surface | `#f8fafc` — `#020617` (Slate) | Backgrounds, cards, text |

## Component Library

Built with **shadcn/ui** — a collection of accessible, composable React components.

Initialize with:
```bash
npx shadcn@latest init
npx shadcn@latest add button card input table dialog
```

## Design Principles

1. **Clarity**: Information hierarchy should be immediately apparent
2. **Consistency**: Uniform patterns across all modules
3. **Responsiveness**: Mobile-first, works on all screen sizes
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Minimize layout shifts, optimize loading states
