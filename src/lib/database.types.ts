// Generated from the Supabase "Profiler" project. Regenerate with `npm run gen:types`.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      applicants: {
        Row: {
          city: string
          company_id: string
          cover_letter_path: string | null
          created_at: string
          email: string
          experience: number
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string
          resume_path: string | null
          skills: string[]
          source: string
          talent_pool: boolean
          updated_at: string
        }
        Insert: {
          city?: string
          company_id?: string
          cover_letter_path?: string | null
          created_at?: string
          email: string
          experience?: number
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string
          resume_path?: string | null
          skills?: string[]
          source?: string
          talent_pool?: boolean
          updated_at?: string
        }
        Update: {
          city?: string
          company_id?: string
          cover_letter_path?: string | null
          created_at?: string
          email?: string
          experience?: number
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string
          resume_path?: string | null
          skills?: string[]
          source?: string
          talent_pool?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicants_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string
          company_id: string
          country: string
          created_at: string
          id: string
          name: string
          postal_code: string
          state: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          company_id?: string
          country: string
          created_at?: string
          id?: string
          name: string
          postal_code?: string
          state: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          company_id?: string
          country?: string
          created_at?: string
          id?: string
          name?: string
          postal_code?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_applicants: {
        Row: {
          answers: Json
          applicant_id: string
          created_at: string
          id: string
          notes: string | null
          opening_id: string | null
          rating: number
          source: string
          stage: Database["public"]["Enums"]["applicant_stage"]
          updated_at: string
        }
        Insert: {
          answers?: Json
          applicant_id: string
          created_at?: string
          id?: string
          notes?: string | null
          opening_id?: string | null
          rating?: number
          source?: string
          stage?: Database["public"]["Enums"]["applicant_stage"]
          updated_at?: string
        }
        Update: {
          answers?: Json
          applicant_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          opening_id?: string | null
          rating?: number
          source?: string
          stage?: Database["public"]["Enums"]["applicant_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opening_applicants_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opening_applicants_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
        ]
      }
      openings: {
        Row: {
          code: string
          company_id: string
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string
          experience: string
          id: string
          industry: string
          location_id: string | null
          remote: boolean
          status: Database["public"]["Enums"]["opening_status"]
          template_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          code?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string
          experience?: string
          id?: string
          industry?: string
          location_id?: string | null
          remote?: boolean
          status?: Database["public"]["Enums"]["opening_status"]
          template_id?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string
          experience?: string
          id?: string
          industry?: string
          location_id?: string | null
          remote?: boolean
          status?: Database["public"]["Enums"]["opening_status"]
          template_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "openings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "openings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "screening_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string
          created_at: string
          designation: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id: string
          created_at?: string
          designation?: string
          email: string
          first_name?: string
          id: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          designation?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          options: string[]
          position: number
          required: boolean
          template_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: string[]
          position?: number
          required?: boolean
          template_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: string[]
          position?: number
          required?: boolean
          template_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "screening_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_templates: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "screening_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      applications: {
        Row: {
          applicant_id: string | null
          city: string | null
          created_at: string | null
          email: string | null
          experience: number | null
          first_name: string | null
          full_name: string | null
          id: string | null
          last_name: string | null
          notes: string | null
          opening_code: string | null
          opening_id: string | null
          opening_status: Database["public"]["Enums"]["opening_status"] | null
          opening_title: string | null
          phone: string | null
          rating: number | null
          resume_path: string | null
          skills: string[] | null
          source: string | null
          stage: Database["public"]["Enums"]["applicant_stage"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      opening_pipeline_counts: {
        Row: {
          opening_id: string | null
          stage: Database["public"]["Enums"]["applicant_stage"] | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opening_applicants_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "openings"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_status_counts: {
        Row: {
          status: Database["public"]["Enums"]["opening_status"] | null
          total: number | null
        }
        Relationships: []
      }
      pipeline_stage_counts: {
        Row: {
          stage: Database["public"]["Enums"]["applicant_stage"] | null
          total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      applicant_stage:
        | "new"
        | "shortlisted"
        | "interviewed"
        | "offered"
        | "hired"
        | "rejected"
        | "talentpool"
      opening_status: "published" | "internal" | "unpublished"
      user_role: "admin" | "recruiter" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])> =
  (PublicSchema["Tables"] & PublicSchema["Views"])[T] extends { Row: infer R } ? R : never

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T] extends { Update: infer U } ? U : never

export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]

export const Constants = {
  public: {
    Enums: {
      applicant_stage: ["new", "shortlisted", "interviewed", "offered", "hired", "rejected", "talentpool"],
      opening_status: ["published", "internal", "unpublished"],
      user_role: ["admin", "recruiter", "viewer"],
    },
  },
} as const
