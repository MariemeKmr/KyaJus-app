// Couleur signature de chaque jus, utilisee comme accent sur les cartes
// produit, les etiquettes et les halos. Le fond neutre reste dominant,
// la couleur ne sert que de touche.
export const couleursJus: Record<string, string> = {
  "Bouye lait": "#F3E9D8", // beige blanchatre
  "Bouye goyave": "#E6C9BB", // beige rose
  "Bouye bissap": "#E35D6B", // rose tirant sur le rouge
  Bissap: "#7C2238", // rouge vin
  "Bissap blanc": "#E5D5C3", // marron tres clair
  Ginger: "#D8B56A", // jaune pale marronne
  Ditakh: "#7ED957", // vert fluo
  Citron: "#D2D84A", // vert jaune
  Tamarin: "#6B4226", // marron fonce
  Maad: "#F97316", // orange vibrant
  Pasteque: "#E8556A", // rouge rose
  Orange: "#F9A23A", // orange classique
};

// Jus dont la couleur signature est tres claire et necessite une fine
// bordure pour rester visible sur un fond clair.
export const jusCouleurClaire = new Set<string>([
  "Bouye lait",
  "Bissap blanc",
]);
