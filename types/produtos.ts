

export type Tamanho = {
  nome: string;
  cm: string;
};

export type Cor = {
  nome: string;
  imagem?: string;
};

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  tamanhos: Tamanho[];
  cores: Cor[];
};