export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      crawl_history: {
        Row: {
          crawled_at: string
          crawler_name: string
          created_at: string
          hash: string
          id: number
          updated_at: string
          url: string
        }
        Insert: {
          crawled_at: string
          crawler_name: string
          created_at?: string
          hash: string
          id?: number
          updated_at?: string
          url: string
        }
        Update: {
          crawled_at?: string
          crawler_name?: string
          created_at?: string
          hash?: string
          id?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      crawl_metadata: {
        Row: {
          crawled_at: string | null
          crawler_name: string | null
          created_at: string
          error_message: string | null
          error_type: string | null
          id: number
          output_hash: string | null
          parse_attempt_count: number | null
          parsed_at: string | null
          parser_name: string | null
          processing_time_ms: number | null
          status: string
          updated_at: string
          url: string
          url_hash: string
        }
        Insert: {
          crawled_at?: string | null
          crawler_name?: string | null
          created_at?: string
          error_message?: string | null
          error_type?: string | null
          id?: number
          output_hash?: string | null
          parse_attempt_count?: number | null
          parsed_at?: string | null
          parser_name?: string | null
          processing_time_ms?: number | null
          status: string
          updated_at?: string
          url: string
          url_hash: string
        }
        Update: {
          crawled_at?: string | null
          crawler_name?: string | null
          created_at?: string
          error_message?: string | null
          error_type?: string | null
          id?: number
          output_hash?: string | null
          parse_attempt_count?: number | null
          parsed_at?: string | null
          parser_name?: string | null
          processing_time_ms?: number | null
          status?: string
          updated_at?: string
          url?: string
          url_hash?: string
        }
        Relationships: []
      }
      crawled_event: {
        Row: {
          capacity: number | null
          contact_phone: string | null
          crawl_metadata_id: number
          created_at: string
          description: string | null
          end_date: string
          extra_data: Json | null
          id: number
          institution_name: string
          name: string
          participation_fee: number | null
          registration_methods: string[] | null
          registration_sessions: Json | null
          source_name: string
          source_url: string
          start_date: string
          target_residence: string | null
          timetable: Json | null
          updated_at: string
          venue_description: string | null
          venue_type: Database["public"]["Enums"]["venue_type"] | null
        }
        Insert: {
          capacity?: number | null
          contact_phone?: string | null
          crawl_metadata_id: number
          created_at?: string
          description?: string | null
          end_date: string
          extra_data?: Json | null
          id?: number
          institution_name: string
          name: string
          participation_fee?: number | null
          registration_methods?: string[] | null
          registration_sessions?: Json | null
          source_name: string
          source_url: string
          start_date: string
          target_residence?: string | null
          timetable?: Json | null
          updated_at?: string
          venue_description?: string | null
          venue_type?: Database["public"]["Enums"]["venue_type"] | null
        }
        Update: {
          capacity?: number | null
          contact_phone?: string | null
          crawl_metadata_id?: number
          created_at?: string
          description?: string | null
          end_date?: string
          extra_data?: Json | null
          id?: number
          institution_name?: string
          name?: string
          participation_fee?: number | null
          registration_methods?: string[] | null
          registration_sessions?: Json | null
          source_name?: string
          source_url?: string
          start_date?: string
          target_residence?: string | null
          timetable?: Json | null
          updated_at?: string
          venue_description?: string | null
          venue_type?: Database["public"]["Enums"]["venue_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_crawl_metadata"
            columns: ["crawl_metadata_id"]
            isOneToOne: true
            referencedRelation: "crawl_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_event_review: {
        Row: {
          category: string | null
          crawled_event_id: number
          created_at: string
          id: number
          is_for_seniors: boolean | null
          note: string
          refined_name: string | null
          tags: string[] | null
          updated_at: string
          venue_address: string | null
          venue_admin_districts: Json | null
          venue_location: unknown
        }
        Insert: {
          category?: string | null
          crawled_event_id: number
          created_at?: string
          id?: number
          is_for_seniors?: boolean | null
          note: string
          refined_name?: string | null
          tags?: string[] | null
          updated_at?: string
          venue_address?: string | null
          venue_admin_districts?: Json | null
          venue_location?: unknown
        }
        Update: {
          category?: string | null
          crawled_event_id?: number
          created_at?: string
          id?: number
          is_for_seniors?: boolean | null
          note?: string
          refined_name?: string | null
          tags?: string[] | null
          updated_at?: string
          venue_address?: string | null
          venue_admin_districts?: Json | null
          venue_location?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "fk_crawled_event"
            columns: ["crawled_event_id"]
            isOneToOne: true
            referencedRelation: "crawled_event"
            referencedColumns: ["id"]
          },
        ]
      }
      district: {
        Row: {
          created_at: string
          id: number
          level: number
          name: string
          parent_district_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          level: number
          name: string
          parent_district_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          level?: number
          name?: string
          parent_district_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "district"
            columns: ["parent_district_id"]
            isOneToOne: false
            referencedRelation: "district"
            referencedColumns: ["id"]
          },
        ]
      }
      pe_district: {
        Row: {
          district_id: number
          id: number
          pe_id: number
        }
        Insert: {
          district_id: number
          id?: number
          pe_id: number
        }
        Update: {
          district_id?: number
          id?: number
          pe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_district"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "district"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_public_event"
            columns: ["pe_id"]
            isOneToOne: false
            referencedRelation: "public_event"
            referencedColumns: ["id"]
          },
        ]
      }
      pe_registration_session: {
        Row: {
          close_dt: string | null
          id: number
          open_dt: string | null
          pe_id: number
        }
        Insert: {
          close_dt?: string | null
          id?: number
          open_dt?: string | null
          pe_id: number
        }
        Update: {
          close_dt?: string | null
          id?: number
          open_dt?: string | null
          pe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_public_event"
            columns: ["pe_id"]
            isOneToOne: false
            referencedRelation: "public_event"
            referencedColumns: ["id"]
          },
        ]
      }
      pe_tag: {
        Row: {
          id: number
          pe_id: number
          tag: string
        }
        Insert: {
          id?: number
          pe_id: number
          tag: string
        }
        Update: {
          id?: number
          pe_id?: number
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_public_event"
            columns: ["pe_id"]
            isOneToOne: false
            referencedRelation: "public_event"
            referencedColumns: ["id"]
          },
        ]
      }
      pe_timetable_slot: {
        Row: {
          day: number
          end_time: string
          id: number
          pe_id: number
          start_time: string
        }
        Insert: {
          day: number
          end_time: string
          id?: number
          pe_id: number
          start_time: string
        }
        Update: {
          day?: number
          end_time?: string
          id?: number
          pe_id?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_public_event"
            columns: ["pe_id"]
            isOneToOne: false
            referencedRelation: "public_event"
            referencedColumns: ["id"]
          },
        ]
      }
      public_event: {
        Row: {
          capacity: number | null
          category: Database["public"]["Enums"]["event_category"]
          contact_phone: string | null
          crawled_event_id: number
          created_at: string
          description: string | null
          end_date: string
          id: number
          institution_name: string
          name: string
          participation_fee: number | null
          refined_name: string
          registration_methods:
            | Database["public"]["Enums"]["registration_method"][]
            | null
          source_url: string
          start_date: string
          target_residence: string | null
          updated_at: string
          uuid: string
          venue_address: string | null
          venue_location: unknown
          venue_name: string | null
          venue_type: Database["public"]["Enums"]["venue_type"] | null
        }
        Insert: {
          capacity?: number | null
          category: Database["public"]["Enums"]["event_category"]
          contact_phone?: string | null
          crawled_event_id: number
          created_at?: string
          description?: string | null
          end_date: string
          id?: number
          institution_name: string
          name: string
          participation_fee?: number | null
          refined_name: string
          registration_methods?:
            | Database["public"]["Enums"]["registration_method"][]
            | null
          source_url: string
          start_date: string
          target_residence?: string | null
          updated_at?: string
          uuid?: string
          venue_address?: string | null
          venue_location?: unknown
          venue_name?: string | null
          venue_type?: Database["public"]["Enums"]["venue_type"] | null
        }
        Update: {
          capacity?: number | null
          category?: Database["public"]["Enums"]["event_category"]
          contact_phone?: string | null
          crawled_event_id?: number
          created_at?: string
          description?: string | null
          end_date?: string
          id?: number
          institution_name?: string
          name?: string
          participation_fee?: number | null
          refined_name?: string
          registration_methods?:
            | Database["public"]["Enums"]["registration_method"][]
            | null
          source_url?: string
          start_date?: string
          target_residence?: string | null
          updated_at?: string
          uuid?: string
          venue_address?: string | null
          venue_location?: unknown
          venue_name?: string | null
          venue_type?: Database["public"]["Enums"]["venue_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_crawled_event"
            columns: ["crawled_event_id"]
            isOneToOne: true
            referencedRelation: "crawled_event"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string | null
          id: number
          profile_image_url: string | null
          uid: string
          updated_at: string
          username: string
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          profile_image_url?: string | null
          uid: string
          updated_at?: string
          username: string
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          profile_image_url?: string | null
          uid?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_favorite: {
        Row: {
          created_at: string
          id: number
          pe_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          pe_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          pe_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_public_event"
            columns: ["pe_id"]
            isOneToOne: false
            referencedRelation: "public_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      username_prefix: {
        Row: {
          created_at: string | null
          id: number
          prefix: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          prefix: string
        }
        Update: {
          created_at?: string | null
          id?: number
          prefix?: string
        }
        Relationships: []
      }
      username_suffix: {
        Row: {
          created_at: string | null
          id: number
          suffix: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          suffix: string
        }
        Update: {
          created_at?: string | null
          id?: number
          suffix?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      filter_public_event: {
        Args: {
          f_categories?: Database["public"]["Enums"]["event_category"][]
          f_created_at_cursor?: string
          f_districts?: number[]
          f_id_cursor?: number
          f_limit?: number
          f_max_fee?: number
          f_min_fee?: number
          f_registration_status?: string
          f_tags?: string[]
        }
        Returns: {
          created_at: string
          id: number
        }[]
      }
    }
    Enums: {
      event_category:
        | "lecture"
        | "exhibition"
        | "experience"
        | "performance"
        | "festival"
      registration_method:
        | "online"
        | "on_site"
        | "telephone"
        | "email"
        | "external_website"
      venue_type: "offline" | "online" | "hybrid"
      weekday: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      event_category: [
        "lecture",
        "exhibition",
        "experience",
        "performance",
        "festival",
      ],
      registration_method: [
        "online",
        "on_site",
        "telephone",
        "email",
        "external_website",
      ],
      venue_type: ["offline", "online", "hybrid"],
      weekday: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    },
  },
} as const
