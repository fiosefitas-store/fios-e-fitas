

export type Tamanho = {
  nome: string;
  cm: string;
};

export type Cor = {
  nome: string;
  imagem?: string;
  cores?: string[];
  custom?: boolean;
};

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  tamanhos: Tamanho[];
  cores: Cor[];
};