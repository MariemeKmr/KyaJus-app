"use client";

// Cette page remplace entierement le layout racine en cas d'erreur critique.
// Elle est donc volontairement autonome, avec des styles en ligne, sans
// dependre des polices ou des classes Tailwind du reste de l'application.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF8F2",
          fontFamily: "system-ui, sans-serif",
          color: "#4A5568",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            backgroundImage: "linear-gradient(to right, #FF6B57, #FD9B56, #FCB355)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          KyaJus
        </span>
        <h1 style={{ marginTop: "1.5rem", fontSize: "1.25rem", color: "#2D3748" }}>
          Une erreur critique est survenue
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", maxWidth: "24rem" }}>
          Veuillez recharger la page. Si le probleme persiste, reessayez plus tard.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            border: "none",
            borderRadius: "0.5rem",
            backgroundColor: "#FF6B57",
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.625rem 1.25rem",
            cursor: "pointer",
          }}
        >
          Recharger
        </button>
      </body>
    </html>
  );
}
