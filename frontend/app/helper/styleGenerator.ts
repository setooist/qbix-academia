import { DesignSystem } from "@/app/lib/design";

/**
 * Converts hex color to a format that works with Tailwind
 */
function normalizeColor(color: string | null): string {
  if (!color) return '#000000'; // Fallback for null colors
  
  // Remove # if present and re-add it
  const cleanHex = color.replace('#', '');
  return `#${cleanHex}`;
}

export function generateCssVariables(ds: DesignSystem): string {
  return `
    :root {
      --background: ${normalizeColor(ds.background)};
      --foreground: ${normalizeColor(ds.foreground)};
      --primary: ${normalizeColor(ds.primary)};
      --primary-foreground: ${normalizeColor(ds.primaryForeground)};
      --secondary: ${normalizeColor(ds.secondary)};
      --secondary-foreground: ${normalizeColor(ds.secondaryForeground)};
      --accent: ${normalizeColor(ds.accent)};
      --accent-foreground: ${normalizeColor(ds.accentForeground)};
      --destructive: ${normalizeColor(ds.destructive)};
      --muted: ${normalizeColor(ds.muted)};
      --muted-foreground: ${normalizeColor(ds.mutedForeground)};
      --card: ${normalizeColor(ds.card)};
      --card-foreground: ${normalizeColor(ds.cardForeground)};
      --border: ${normalizeColor(ds.border)};
      --input: ${normalizeColor(ds.input)};
      --ring: ${normalizeColor(ds.ring)};
    }
  `.trim();
}

// Helper function to generate inline styles for client components
export function generateInlineStyles(ds: DesignSystem): Record<string, string> {
  return {
    '--background': normalizeColor(ds.background),
    '--foreground': normalizeColor(ds.foreground),
    '--primary': normalizeColor(ds.primary),
    '--primary-foreground': normalizeColor(ds.primaryForeground),
    '--secondary': normalizeColor(ds.secondary),
    '--secondary-foreground': normalizeColor(ds.secondaryForeground),
    '--accent': normalizeColor(ds.accent),
    '--accent-foreground': normalizeColor(ds.accentForeground),
    '--destructive': normalizeColor(ds.destructive),
    '--muted': normalizeColor(ds.muted),
    '--muted-foreground': normalizeColor(ds.mutedForeground),
    '--card': normalizeColor(ds.card),
    '--card-foreground': normalizeColor(ds.cardForeground),
    '--border': normalizeColor(ds.border),
    '--input': normalizeColor(ds.input),
    '--ring': normalizeColor(ds.ring),
  } as Record<string, string>;
}