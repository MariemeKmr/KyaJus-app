## KyaJus

Application de vente de jus frais et de packs, avec une boutique publique
orientee mobile et un espace de gestion complet : commandes, stock, depenses,
benefices et repartition entre investisseurs.

## Presentation

KyaJus combine une boutique en ligne et un back office. Les visiteurs commandent
des jus sans creer de compte et suivent leur commande avec leur numero et leur
telephone. L'equipe gere les commandes, encaisse, suit le stock, enregistre les
depenses et pilote la partie financiere.

## Fonctionnalites

Boutique publique :
- Catalogue des jus avec couleur signature ou photo
- Panier persistant et passage de commande sans compte
- Suivi de commande par numero et telephone, avec actualisation automatique

Espace vendeur :
- Gestion des commandes (statut, encaissement)
- Vente au comptoir, payee et livree immediatement

Espace admin :
- Produits (prix de vente, stock)
- Depenses, avec lots de production qui calculent le prix de revient automatiquement
- Commandes
- Investisseurs et repartition des benefices (super admin)
- Equipe et gestion des comptes (super admin)
- Parametres financiers, dont le taux de reinvestissement (super admin)
- Tableau de bord adapte au role

Comptes :
- Mot de passe provisoire facultatif, transmissible par WhatsApp ou email
- Choix obligatoire d'un nouveau mot de passe a la premiere connexion

## Roles

- SUPER_ADMIN : acces complet, fixe le taux de reinvestissement et les parts,
  gere les comptes, voit toute la finance.
- ADMIN : investisseur, voit uniquement son propre benefice.
- VENDEUR : gere les commandes et la vente au comptoir.
- VISITEUR : commande des jus et suit sa commande.

## Logique financiere

Le prix de revient de chaque jus est calcule automatiquement a partir du dernier
lot de production : total des depenses du lot divise par le nombre de bouteilles
produites. Le reste en decoule :

```
Revenus              = somme des commandes payees
Cout des marchandises = somme des couts unitaires vendus
Marge brute          = Revenus moins Cout des marchandises
Benefice net         = Marge brute moins Depenses generales
Montant a reinvestir = Benefice net multiplie par le taux
Benefice a repartir  = Benefice net moins Montant a reinvestir
Part d'un investisseur = sa part en pourcentage du Benefice a repartir
```

Les depenses de production ne sont jamais comptees deux fois : elles entrent dans
le cout des marchandises au moment de la vente, pas dans les depenses generales.

## Stack technique

- Next.js (App Router) et TypeScript
- Tailwind CSS
- Prisma 6 et PostgreSQL
- NextAuth (Auth.js) pour l'authentification et les roles
- Lucide pour les icones

## Prerequis

- Node.js 18 ou superieur
- Une base de donnees PostgreSQL (par exemple un projet Neon)

## Installation

```bash
npm install
```

## Variables d'environnement

Creer un fichier `.env` a la racine :

```
DATABASE_URL="postgresql://utilisateur:motdepasse@hote/base?sslmode=require"
AUTH_SECRET="votre_secret_genere"
```

Le secret peut etre genere avec `npx auth secret`.

## Base de donnees

Appliquer le schema :

```bash
npx prisma db push
npx prisma generate
```

Inserer les comptes par defaut, le parametre financier et les 12 jus :

```bash
npx prisma db seed
```

Comptes crees par defaut :

```
Super admin : superadmin@kyajus.sn / superadmin123
Vendeur     : vendeur@kyajus.sn / vendeur123
```

Ces mots de passe doivent etre changes en production.

## Lancement

```bash
npm run dev
```

La boutique est sur http://localhost:3000. La connexion a l'espace de gestion est
sur http://localhost:3000/connexion.

## Inspection de la base

```bash
npx prisma studio
```

## Structure du projet

```
prisma/               schema, migrations et seed
src/app/(public)/     boutique, panier, suivi, confirmation
src/app/admin/        espace admin et super admin
src/app/vendeur/      espace vendeur
src/components/       composants par espace
src/lib/              client Prisma, calculs, actions serveur, donnees des jus
src/types/            types TypeScript partages
```

## Auteur

Marieme Kamara
