'use client';

type Props = {
  produto: any;
  mainImage: string;
  setMainImage: (img: string) => void;
};

export default function ProductGallery({
  produto,
  mainImage,
  setMainImage,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-2xl overflow-hidden bg-[#F9F3EF]">
        <img
          src={mainImage || produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {produto.imagens.length > 1 && (
        <div className="flex gap-3">
          {produto.imagens.map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                mainImage === img
                  ? 'border-[#F4845F]'
                  : 'border-transparent'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}