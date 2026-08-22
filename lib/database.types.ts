export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          external_id: number | null;
          title: string;
          slug: string;
          description: string;
          price: string;
          category: string;
          image_url: string;
          rating: string;
          rating_count: number;
          is_published: boolean;
          archived_at: string | null;
          synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          external_id?: number | null;
          title: string;
          slug: string;
          description?: string;
          price: number;
          category: string;
          image_url: string;
          rating?: number;
          rating_count?: number;
          is_published?: boolean;
          archived_at?: string | null;
          synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "customer" | "admin";
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          role?: "customer" | "admin";
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      product_sync_runs: {
        Row: {
          id: string;
          source: string;
          status: "success" | "partial" | "error";
          fetched_count: number;
          upserted_count: number;
          error_count: number;
          details: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          source?: string;
          status: "success" | "partial" | "error";
          fetched_count?: number;
          upserted_count?: number;
          error_count?: number;
          details?: Json;
          created_by?: string | null;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "product_sync_runs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
