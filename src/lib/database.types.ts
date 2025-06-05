export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cursos: {
        Row: {
          id: number
          titulo: string
          descricao: string
          ordem: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          titulo: string
          descricao: string
          ordem?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          titulo?: string
          descricao?: string
          ordem?: number
          created_at?: string
          updated_at?: string
        }
      }
      aulas: {
        Row: {
          id: number
          curso_id: number
          titulo: string
          descricao: string
          video_url: string
          conteudo_texto: string
          ordem: number
          duracao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          curso_id: number
          titulo: string
          descricao?: string
          video_url: string
          conteudo_texto: string
          ordem?: number
          duracao: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          curso_id?: number
          titulo?: string
          descricao?: string
          video_url?: string
          conteudo_texto?: string
          ordem?: number
          duracao?: string
          created_at?: string
          updated_at?: string
        }
      }
      modulos: {
        Row: {
          id: number
          curso_id: number
          titulo: string
          descricao: string
          ordem: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          curso_id: number
          titulo: string
          descricao: string
          ordem?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          curso_id?: number
          titulo?: string
          descricao?: string
          ordem?: number
          created_at?: string
          updated_at?: string
        }
      }
      conclusoes: {
        Row: {
          id: number
          aula_id: number
          navegador_anon_id: string
          data_conclusao: string
        }
        Insert: {
          id?: number
          aula_id: number
          navegador_anon_id: string
          data_conclusao?: string
        }
        Update: {
          id?: number
          aula_id?: number
          navegador_anon_id?: string
          data_conclusao?: string
        }
      }
    }
  }
}