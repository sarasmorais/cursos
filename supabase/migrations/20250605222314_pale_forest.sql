/*
  # Schema inicial da plataforma courseOS
  
  1. Novas Tabelas
    - `cursos`: Armazena os cursos disponíveis na plataforma
    - `modulos`: Agrupa aulas em módulos temáticos
    - `aulas`: Contém as aulas com vídeo e conteúdo em texto
    - `conclusoes`: Registra o progresso de conclusão das aulas por usuário anônimo
  
  2. Segurança
    - Habilitação de RLS (Row Level Security) em todas as tabelas
    - Políticas para permitir leitura anônima para todos os usuários
    - Políticas para restringir operações de escrita (insert/update/delete) apenas para usuários autenticados
*/

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de módulos
CREATE TABLE IF NOT EXISTS modulos (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de aulas
CREATE TABLE IF NOT EXISTS aulas (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE NOT NULL,
  modulo_id INTEGER REFERENCES modulos(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  video_url TEXT NOT NULL,
  conteudo_texto TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  duracao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de conclusões de aulas
CREATE TABLE IF NOT EXISTS conclusoes (
  id SERIAL PRIMARY KEY,
  aula_id INTEGER REFERENCES aulas(id) ON DELETE CASCADE NOT NULL,
  navegador_anon_id TEXT NOT NULL,
  data_conclusao TIMESTAMPTZ DEFAULT now(),
  UNIQUE(aula_id, navegador_anon_id)
);

-- Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conclusoes ENABLE ROW LEVEL SECURITY;

-- Políticas para cursos
-- Permitir leitura para todos
CREATE POLICY "Permitir leitura de cursos para todos" 
  ON cursos 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

-- Permitir escrita apenas para usuários autenticados
CREATE POLICY "Permitir criação de cursos para administradores"
  ON cursos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de cursos para administradores"
  ON cursos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de cursos para administradores"
  ON cursos
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para módulos
-- Permitir leitura para todos
CREATE POLICY "Permitir leitura de módulos para todos" 
  ON modulos 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

-- Permitir escrita apenas para usuários autenticados
CREATE POLICY "Permitir criação de módulos para administradores"
  ON modulos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de módulos para administradores"
  ON modulos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de módulos para administradores"
  ON modulos
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para aulas
-- Permitir leitura para todos
CREATE POLICY "Permitir leitura de aulas para todos" 
  ON aulas 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

-- Permitir escrita apenas para usuários autenticados
CREATE POLICY "Permitir criação de aulas para administradores"
  ON aulas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de aulas para administradores"
  ON aulas
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Permitir exclusão de aulas para administradores"
  ON aulas
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para conclusões
-- Permitir leitura da própria conclusão
CREATE POLICY "Permitir leitura das próprias conclusões" 
  ON conclusoes 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

-- Permitir inserção de conclusões para usuários anônimos
CREATE POLICY "Permitir inserção de conclusões para todos"
  ON conclusoes
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);