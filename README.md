# Starbucks — Un café. Votre moment.

Projet de portfolio indépendant réalisé pour **Kilian Berardino**. Une expérience e-commerce en français inspirée de Starbucks : interface responsive, personnalisation, panier, inscription, connexion, commandes et fidélité de démonstration.

**Aucune affiliation avec Starbucks. Aucun paiement réel. Les prix, cafés, horaires et récompenses sont fictifs.**

## Démarrer en une commande

Prérequis : **Node.js 24 ou version ultérieure**. Aucun paquet npm à télécharger, aucune clé API nécessaire.

Dans le dossier extrait :

```bash
node server/index.mjs
```

Ouvrir **http://127.0.0.1:3000** dans le navigateur. `npm start` est équivalent. Ne pas ouvrir directement `public/index.html` : l’interface utilise l’API du serveur.

```bash
npm run dev   # redémarrage du serveur lors des modifications
npm test      # tests de l’API et de la base de données
```

Sous Windows, si PowerShell bloque `npm.ps1`, utiliser `npm.cmd start` / `npm.cmd test`, ou les commandes Node directement :

```powershell
node --watch server/index.mjs
node --test tests/api.test.mjs
```

## Fonctionnalités

- Accueil avec campagne automne, produits favoris, fidélité et section éditoriale.
- Catalogue de dix produits, recherche et six catégories.
- Personnalisation : Tall, Grande, Venti, quatre laits, shot supplémentaire et quantité.
- Panier persistant sur le navigateur, modification des quantités, retrait d’articles.
- Trois cafés fictifs, sélection du retrait et plan illustratif.
- Inscription, connexion et déconnexion avec cookie de session HttpOnly.
- Commandes persistantes en SQLite, historique personnel et étoiles calculées depuis les commandes.
- Calcul des montants côté serveur en centimes : le navigateur ne peut pas imposer ses prix.
- Pages histoire, présentation du projet et confidentialité.
- Navigation au clavier, focus visible, modales avec gestion du focus, réduction des animations.

## Essayer le parcours

1. Ouvrir le menu et personnaliser un produit.
2. Ajouter au panier et choisir un café fictif.
3. Cliquer sur « Se connecter pour commander », puis créer un compte de test (e-mail de test, mot de passe dédié d’au moins dix caractères).
4. Valider la commande de démonstration.
5. Consulter l’historique et le solde d’étoiles dans le compte.

Aucun compte préchargé, aucun mot de passe de démonstration partagé. Les données se créent lors de l’utilisation.

## Structure

| Fichier | Rôle |
| --- | --- |
| `public/index.html` | Point d’entrée accessible et métadonnées |
| `public/app.js` | Navigation, rendu des pages, panier et appels API |
| `public/components.js` | Icônes, illustrations SVG et fonctions de présentation |
| `public/style.css` | Design responsive, modales, panier et états interactifs |
| `server/index.mjs` | Serveur HTTP Node.js, fichiers statiques et en-têtes |
| `server/api.mjs` | Authentification et logique métier |
| `server/catalog.mjs` | Catalogue, prix et cafés fictifs |
| `server/database.mjs` | Adaptateur SQLite natif de Node.js |
| `server/schema.sql` | Tables et index de la base |
| `tests/api.test.mjs` | Tests métier, sécurité et persistance |

Les données sont conservées dans `data/coffee.sqlite`, créé automatiquement. Ce dossier est exclu de Git et de l’archive livrée. Arrêter le serveur avant toute sauvegarde ou suppression de la base.

## API

| Méthode | Route | Usage |
| --- | --- | --- |
| GET | `/api/health` | État du service |
| GET | `/api/catalog` | Produits, options et cafés |
| POST | `/api/auth/register` | Inscription : name, email, password |
| POST | `/api/auth/login` | Connexion : email, password |
| POST | `/api/auth/logout` | Déconnexion |
| GET | `/api/me` | Profil et étoiles, ou user: null |
| GET | `/api/orders` | Historique du compte connecté |
| POST | `/api/orders` | Création d’une commande simulée |

Exemple de corps pour une commande :

```json
{
  "store": "centre",
  "items": [
    {"id":"pumpkin","size":"Grande","milk":"Avoine","extra":true,"quantity":1}
  ]
}
```

## Choix techniques et sécurité

- JavaScript natif organisé en modules ES : aucun téléchargement nécessaire pour exécuter le projet.
- Node.js HTTP et SQLite natif, requêtes paramétrées.
- PBKDF2-SHA-256 avec sel aléatoire, 100 000 itérations ; aucune conservation du mot de passe en clair.
- Jetons de session aléatoires, hachés dans la base, durée de sept jours. Cookie HttpOnly, SameSite=Lax, Secure lorsque l’origine est HTTPS.
- Vérification de l’origine pour les écritures, limitation des tentatives de connexion, validation des choix et quantités.
- Historique filtré par l’utilisateur connecté, contenu utilisateur échappé à l’affichage, CSP et en-tête nosniff.

Projet de démonstration, pas une plateforme commerciale : pas de paiement, de stock, d’envoi d’e-mails, de validation d’e-mail ou de récupération de mot de passe. Le programme d’étoiles ne distribue aucune récompense. Un lancement commercial nécessiterait notamment une revue de sécurité, une politique de conservation et des mécanismes de gestion des comptes.

## Hébergement Node.js

Compatible avec un hébergement qui exécute Node.js 24+ et fournit un disque persistant. Conserver `data/` sur ce disque. Un hébergement uniquement statique ne peut pas exécuter cette API. Une seule instance Node est prévue pour ce projet SQLite.

Variables d’environnement disponibles :

| Variable | Valeur par défaut | Usage |
| --- | --- | --- |
| `PORT` | `3000` | Port d’écoute |
| `HOST` | `127.0.0.1` | Utiliser `0.0.0.0` sur un hébergeur qui le demande |
| `DATABASE_PATH` | `data/coffee.sqlite` | Emplacement persistant de SQLite |
| `PUBLIC_ORIGIN` | Origine HTTP locale | Origine HTTPS exacte derrière un reverse proxy |

Définir `PUBLIC_ORIGIN=https://votre-domaine.example` derrière un proxy HTTPS pour les cookies Secure et la vérification d’origine. Ne pas exposer le serveur directement sur Internet sans HTTPS.

## Crédits et visuels

Design et code réalisés pour le portfolio de Kilian Berardino. Les marques Starbucks restent la propriété de leurs titulaires. Photographies de campagne chargées depuis les sources publiques suivantes ; elles nécessitent une connexion et peuvent changer :

- https://www.starbucks.com/ — campagne automne et photographie « Free refills ».
- https://cloudassets.starbucks.com/ — domaine de diffusion des photographies.

Les illustrations de produits sont des SVG intégrés créés pour ce projet, et ne sont pas des photos contractuelles. Une alternative visuelle est prévue si les grandes photographies ne se chargent pas. Les polices système fonctionnent hors ligne.

## Vérification de cette livraison

Tests automatisés exécutables avec `node --test tests/api.test.mjs` : authentification, recalcul des prix, isolation des comptes, rejet des entrées invalides, contrôle d’origine, limitation des tentatives, cookies HTTPS et persistance après réouverture de SQLite.

L’environnement de création a empêché les connexions réseau locales du navigateur et la publication distante. Le serveur démarre, la logique API a été testée directement avec de vraies Request/Response et SQLite ; la validation visuelle dans le navigateur reste à effectuer sur votre machine.
