// types/database.ts
// Hand-written to mirror supabase/migrations/*.sql exactly (column names,
// nullability, defaults). This is the generic passed to every
// `createClient<Database>()` call so query results are typed end to end. If
// you provision a real project and prefer generated types, replace this file
// with the output of `supabase gen types typescript` — the shape supabase-js
// expects is the same.

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          aliases: string[];
          dob: string;
          provider: string;
          program: "sleep_medicine" | "weight_management";
          phone: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          aliases?: string[];
          dob: string;
          provider: string;
          program: "sleep_medicine" | "weight_management";
          phone: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["patients"]["Insert"]>;
        Relationships: [];
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          specialty: string;
          clinic_days: string[];
          notes: string;
          related_workflow_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          specialty: string;
          clinic_days?: string[];
          notes?: string;
          related_workflow_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["providers"]["Insert"]>;
        Relationships: [];
      };
      open_loops: {
        Row: {
          id: string;
          user_id: string;
          patient_name: string;
          patient_dob: string;
          domain: "sleep_medicine" | "weight_management";
          category: string;
          title: string;
          description: string;
          status: "new" | "in_progress" | "waiting" | "completed" | "escalated";
          priority: "low" | "normal" | "high" | "urgent";
          provider: string;
          waiting_on: "patient" | "insurance" | "dream_sleep" | "labcorp" | "provider" | "other" | null;
          due_date: string | null;
          opened_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          patient_name: string;
          patient_dob: string;
          domain: "sleep_medicine" | "weight_management";
          category: string;
          title: string;
          description?: string;
          status: "new" | "in_progress" | "waiting" | "completed" | "escalated";
          priority: "low" | "normal" | "high" | "urgent";
          provider: string;
          waiting_on?: "patient" | "insurance" | "dream_sleep" | "labcorp" | "provider" | "other" | null;
          due_date?: string | null;
          opened_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["open_loops"]["Insert"]>;
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          open_loop_id: string;
          timestamp: string;
          action_type:
            | "call"
            | "voicemail"
            | "fax"
            | "email"
            | "documentation"
            | "status_change"
            | "follow_up_set"
            | "note";
          note: string;
          performed_by: string;
          attachment_name: string | null;
          attachment_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          open_loop_id: string;
          timestamp?: string;
          action_type:
            | "call"
            | "voicemail"
            | "fax"
            | "email"
            | "documentation"
            | "status_change"
            | "follow_up_set"
            | "note";
          note: string;
          performed_by: string;
          attachment_name?: string | null;
          attachment_path?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>;
        Relationships: [];
      };
      documentation_templates: {
        Row: {
          id: string;
          category: "patient_communication" | "sleep_medicine" | "weight_management" | "administrative";
          label: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fields: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          help: any;
          created_at: string;
        };
        Insert: {
          id: string;
          category: "patient_communication" | "sleep_medicine" | "weight_management" | "administrative";
          label: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fields?: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          help?: any;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documentation_templates"]["Insert"]>;
        Relationships: [];
      };
      documentation_history: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          category: "patient_communication" | "sleep_medicine" | "weight_management" | "administrative";
          timestamp: string;
          note_text: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          common: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          field_values: any;
          related_open_loop_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          template_id: string;
          category: "patient_communication" | "sleep_medicine" | "weight_management" | "administrative";
          timestamp?: string;
          note_text: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          common: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          field_values?: any;
          related_open_loop_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documentation_history"]["Insert"]>;
        Relationships: [];
      };
      workflow_runs: {
        Row: {
          id: string;
          user_id: string;
          workflow_id: string;
          patient_name: string;
          status: "in_progress" | "completed";
          completed_step_ids: string[];
          confirmed_info_items: string[];
          documentation_generated: boolean;
          generated_note_text: string | null;
          started_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string;
          workflow_id: string;
          patient_name: string;
          status?: "in_progress" | "completed";
          completed_step_ids?: string[];
          confirmed_info_items?: string[];
          documentation_generated?: boolean;
          generated_note_text?: string | null;
          started_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["workflow_runs"]["Insert"]>;
        Relationships: [];
      };
      clinic_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category:
            | "sleep_labs"
            | "dme_suppliers"
            | "laboratories"
            | "insurance_portals"
            | "referral_offices"
            | "internal_contacts";
          phone: string | null;
          fax: string | null;
          email: string | null;
          address: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          category:
            | "sleep_labs"
            | "dme_suppliers"
            | "laboratories"
            | "insurance_portals"
            | "referral_offices"
            | "internal_contacts";
          phone?: string | null;
          fax?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clinic_contacts"]["Insert"]>;
        Relationships: [];
      };
      communication_logs: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string;
          date: string;
          method: "call" | "fax" | "email" | "portal" | "in_person";
          summary: string;
          performer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          contact_id: string;
          date?: string;
          method: "call" | "fax" | "email" | "portal" | "in_person";
          summary: string;
          performer: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["communication_logs"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          entity: string;
          entity_id: string;
          action: "create" | "update" | "delete" | "status_change";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          previous_value: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          new_value: any;
          performed_by: string | null;
          created_at: string;
        };
        // audit_logs is trigger-written only — no Insert/Update the app ever performs.
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    // supabase-js's generic Database constraint (GenericSchema) requires
    // these keys to be present — even empty — or it silently falls back to
    // `never` for every Row/Insert/Update type, which is exactly the bug
    // that showed up here as "Object literal may only specify known
    // properties, and 'user_id' does not exist in type 'never[]'" once a
    // real query was type-checked. This project has no views, stored
    // procedures, or composite types, so all three are empty.
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
