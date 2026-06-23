# KyaJus

Application de vente de jus frais et de packs, avec un espace de gestion
complet pour suivre les commandes, les depenses, les benefices et la
repartition entre investisseurs.

## Presentation

KyaJus combine une boutique publique orientee mobile et un back office de
gestion. La boutique permet aux visiteurs de commander des jus et des packs.
L'espace de gestion permet de suivre l'activite, de gerer les commandes et le
stock, et de piloter la partie financiere (revenus, cout des marchandises,
depenses, benefice net, montant a reinvestir et part de chaque investisseur).

## Roles

- SUPER_ADMIN : fixe le taux de reinvestissement et la part de chaque
  investisseur, et voit toute la finance.
- ADMIN : voit uniquement son propre benefice, pas celui des autres.
- VENDEUR : gere les commandes et le stock.
- VISITEUR : commande des jus et des packs.

## Logique financiere

Tout derive des prix saisis sur chaque produit (prix de vente et prix de
revient) :

```
Revenus             = somme des commandes payees
Cout des marchandises = somme des couts unitaires vendus
Marge brute         = Revenus moins Cout des marchandises
Benefice net        = Marge brute moins Depenses
Montant a reinvestir = Benefice net multiplie par le taux de reinvestissement
Benefice a repartir = Benefice net moins Montant a reinvestir
Part d'un investisseur = sa part en pourcentage du Benefice a repartir
```

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

Creer un fichier `.env` a la racine avec :

```
DATABASE_URL="postgresql://utilisateur:motdepasse@hote/base?sslmode=require"
AUTH_SECRET="votre_secret_genere"
```

Le secret peut etre genere avec `npx auth secret`.

## Base de donnees

Appliquer le schema et creer les tables :

```bash
npx prisma migrate dev
```

Inserer le compte super admin et le parametre financier initial :

```bash
npx prisma db seed
```

Compte cree par defaut :

```
Email        : superadmin@kyajus.sn
Mot de passe : superadmin123
```

Le mot de passe doit etre change apres la premiere connexion en production.

## Lancement

```bash
npm run dev
```

L'application est accessible sur http://localhost:3000. La connexion se fait
sur http://localhost:3000/connexion.

## Inspection de la base

```bash
npx prisma studio
```

## Structure du projet

```
prisma/            schema, migrations et seed
src/app/           pages et routes (App Router)
src/components/    composants reutilisables
src/lib/           client Prisma, calculs financiers, donnees des jus
src/types/         types TypeScript partages
```

## Auteur

Marieme Kamara
