export interface DesignSystem {
  // Main colors
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Accent colors
  accent: string;
  accentForeground: string | null;
  
  // Destructive colors
  destructive: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Card colors
  card: string;
  cardForeground: string;
  
  // Border and input
  border: string;
  input: string;
  
  // Ring (focus indicator)
  ring: string;
}

// Strapi v5 Collection Type response structure
interface StrapiCollectionResponse {
  data: Array<{
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string | null;
    destructive: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getDesignSystem(): Promise<DesignSystem | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/design-systems`;
    
    console.log("🔍 Fetching design system from:", url);
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API request failed:", {
        status: res.status,
        statusText: res.statusText,
        response: errorText,
      });
      return null;
    }

    const json: StrapiCollectionResponse = await res.json();
    
    console.log("📦 Raw response:", JSON.stringify(json, null, 2));

    if (!json.data || json.data.length === 0) {
      console.warn("⚠️ No design system entries found");
      return null;
    }

    // Get the first published entry
    const entry = json.data[0];
    
    // Map Strapi flat structure to our DesignSystem interface
    const designSystem: DesignSystem = {
      background: entry.background,
      foreground: entry.foreground,
      primary: entry.primary,
      primaryForeground: entry.primaryForeground,
      secondary: entry.secondary,
      secondaryForeground: entry.secondaryForeground,
      accent: entry.accent,
      accentForeground: entry.accentForeground || entry.accent, // Fallback if null
      destructive: entry.destructive,
      muted: entry.muted,
      mutedForeground: entry.mutedForeground,
      card: entry.card,
      cardForeground: entry.cardForeground,
      border: entry.border,
      input: entry.input,
      ring: entry.ring,
    };

    console.log("✅ Design system fetched successfully");
    return designSystem;
  } catch (error) {
    console.error("💥 Failed to fetch design system:", error);
    return null;
  }
}