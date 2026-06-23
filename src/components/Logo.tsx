import Image from "next/image";

export default function Logo({
  taille = "text-2xl",
  className = "",
  avecIcone = false,
  tailleIcone = 28,
}: {
  taille?: string;
  className?: string;
  avecIcone?: boolean;
  tailleIcone?: number;
}) {
  return (
   
      <span
        className={`font-display ${taille} leading-none bg-gradient-to-r from-[#FF6B57] via-[#FD9B56] to-[#FCB355] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(45,55,72,0.18)]`}
      >
        KyaJus
      </span>
  );
}
