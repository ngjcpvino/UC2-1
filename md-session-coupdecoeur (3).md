# REPRISE — page « coup de cœur »

Coller au début d'une nouvelle conversation, avec : `index.html`, `main-demande.js`, `main.js`, `Code.gs` (ou ses fichiers découpés).

---

## ⚠ COMMENT TRAVAILLER AVEC MOI (lire en premier, respecter à la lettre)
- **Sois bref.** Pas d'analyse déroulée. Le code ne m'intéresse pas — ne me l'explique pas.
- **Un seul changement à la fois**, en format **« Trouve ceci » / « Remplace par ceci »**. Puis tu attends mon **OK**.
- **Ne me refais JAMAIS répéter** ce qui est déjà écrit ci-dessous : c'est décidé.
- **Pas de question dont la réponse est déjà ici.** Si tu dois vraiment demander, **une seule** question claire.
- Aucun code sans mon OK. On ne bâtit pas sur une supposition : si tu as besoin d'un fichier, demande-le **en une phrase**.

---

## ÉTAT EXACT (ce qui marche / ce qui reste)
- Backend `getCommandePublique_v2` : **fonctionne**, ligne ajoutée dans `doPost`, Apps Script redéployé. Renvoie `{ success, statut, lignes }` — lignes enrichies (nom, photo, gamme, collection). Aucune donnée personnelle.
- Front (`main-demande.js`, bloc « Étape 3 ») : au chargement avec `?cmd=CMD-XXXX`, il lit la commande via `appelAPIPost('getCommandePublique', { cmd_id })` puis **ouvre le vieux modal** des coups de cœur. ⚠ **C'était une béquille de test** — à remplacer.
- Étape 1 (coquille `section-coupdecoeur` avant « Merci ») et étape 2 (lecture du `?cmd=`) : **faites**.

## CE QU'IL RESTE À CODER (le prochain bloc)
Remplacer la fin du bloc « Étape 3 » pour que, au lieu d'ouvrir le modal :
1. Si `res.statut !== 'En attente de paiement'` → afficher dans `#coupdecoeur-bloque` le message **« Cette commande ne peut plus être modifiée. »** + un bouton **Fermer** (retour à l'accueil). Ne rien afficher d'autre, pas de modal.
2. Sinon (modifiable) → afficher la commande **dans la page**, zone `#coupdecoeur-commande` (PAS le modal) : produits, quantités, total.

C'est **un seul bloc** à reprendre dans `main-demande.js`. Le mécanisme de lecture marche déjà ; il ne reste qu'à brancher statut + affichage page.

## DÉCISIONS DÉJÀ PRISES (ne pas re-demander)
- **Une seule page d'atterrissage** = la section `section-coupdecoeur`. **Jamais le modal** pour ce parcours.
- Message unique pour tout statut non modifiable : **« Cette commande ne peut plus être modifiée. »** (pas de message différent par statut).
- Modifiable **seulement** si statut = « En attente de paiement ».
- Numéro dans le lien : `?cmd=CMD-XXXX`.
- Le courriel de proposition = **une seule fonction** (`envoyerProposition_v2`) qui contient tout, affichage réglé par cas. La page = **une seule page** qui contient tout. (Boutons du courriel = le tout dernier morceau, étape 7.)

## SUITE (ordre, après le bloc ci-dessus)
- **Étape 6** — renvoi de la liste modifiée : nouvelle fonction serveur, garder le gel, statut **« À retravailler »**. NE PAS appeler `envoyerDemandeCommande` (elle crée une commande neuve).
- **Étape 7 (dernier)** — boutons dans le courriel (« Modifier ou annuler », « J'ai une question »). Harnais test déjà prêt (voir plus bas).

## EN SUSPENS (pas maintenant)
- Nom du statut « à refaire » (#2/#3).
- Côté admin (Chantal) : deux versions côte à côte, écran de préparation, statuts au tableau.

## REPÈRES TECHNIQUES
- Front public ↔ serveur via **`appelAPIPost(action, data)`** (POST → traité par `doPost`).
- `section-coupdecoeur` contient deux zones : `#coupdecoeur-commande` (la commande) et `#coupdecoeur-bloque` (message « plus modifiable » + Fermer, cachée par défaut via `class="cache"`).
- Harnais test du courriel (pour l'étape 7) : copie `envoyerProposition_v2test`, bouton « Envoyer au client test » → front `envoyerPropositionTest` → dispatcher `envoyerPropositiontest` (**petit t**) → `envoyerProposition_v2test`. Fonctionne, en dormance.
- Tout changement dans Code.gs ne s'applique en ligne qu'après **redéploiement (nouvelle version)**.
