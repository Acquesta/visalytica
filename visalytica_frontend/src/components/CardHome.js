import Link from "next/link";
import Image from 'next/image';

function CardHome({ nome, imagem, alt, href = "#" }) {
  return (
    <Link href={href} className="flex flex-1 justify-center">
      <div className="flex h-full w-full cursor-pointer flex-col items-center justify-between gap-3 xs:gap-4 sm:gap-4 md:gap-4 rounded-2xl xs:rounded-3xl sm:rounded-3xl md:rounded-[42px] border-2 border-cinza p-4 xs:p-5 sm:p-6 md:p-8 transition-transform duration-300 ease-in-out hover:scale-[1.02] min-h-[200px] xs:min-h-[220px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-[300px]">
        
        {/* Imagem */}
        <div className="relative flex-1 w-full min-h-[120px] xs:min-h-[130px] sm:min-h-[150px] md:min-h-[170px] lg:min-h-[180px]">
          <Image
            src={imagem}
            alt={alt}
            fill={true}
            style={{
              objectFit: "cover",
              borderRadius: "16px",
            }}
            className="xs:rounded-[18px] sm:rounded-2xl md:rounded-[22px]"
          />
        </div>
        
        {/* Título */}
        <div className="flex justify-center items-center px-2">
          <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[36px] uppercase text-azul font-black text-center leading-tight">
            {nome}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default CardHome;
