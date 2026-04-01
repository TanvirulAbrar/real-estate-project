export interface FallbackProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  property_type: string;
  listing_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  status: string;
  agent_id: string;
  created_at: string;
  images: Array<{
    id: string;
    url: string;
    type: "file" | "link";
    name: string;
  }>;
  syncStatus: "pending";
  failureReason: string;
}

export class FallbackStorage {
  private static readonly STORAGE_KEY = "pendingProperties";

  static saveProperty(
    property: Omit<
      FallbackProperty,
      "id" | "agent_id" | "created_at" | "syncStatus" | "failureReason"
    >,
    agentId: string,
    reason: string,
  ): FallbackProperty {
    const fallbackProperty: FallbackProperty = {
      ...property,
      id: Date.now().toString(),
      agent_id: agentId,
      created_at: new Date().toISOString(),
      syncStatus: "pending",
      failureReason: reason,
    };

    const storedProperties = this.getAllProperties();
    storedProperties.push(fallbackProperty);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedProperties));

    return fallbackProperty;
  }

  static getAllProperties(): FallbackProperty[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading fallback storage:", error);
      return [];
    }
  }

  static removeProperty(id: string): boolean {
    try {
      const properties = this.getAllProperties();
      const filtered = properties.filter((p) => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Error removing from fallback storage:", error);
      return false;
    }
  }

  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getPendingCount(): number {
    return this.getAllProperties().length;
  }
}
