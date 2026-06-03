# Reprise — page « coup de cœur » (modifier/annuler une commande)

À coller au début d'une nouvelle conversation, avec : `index.html`, `main-demande.js`, `main.js`, `Code.gs` (uc2).

## Règles de travail (rappel)
- Aucun code sans mon OK. Par trouve-et-remplace, un changement à la fois.
- Parle en clair, pas en jargon. Scénarios en puces.
- Pas de solution sans analyse complète. On ne bâtit jamais sur une supposition.
- **On bâtit les vrais morceaux qui restent — pas de preuves jetables.**
- Sois court. Une question à la fois.

## Décisions tranchées
1. **Le courriel de proposition = UNE seule fonction** (`envoyerProposition_v2`) qui contient tout, et on règle l'affichage selon le cas de stock (tout / pas tout / rien). Approche : tout mettre, puis régler l'affichage.
2. **La page d'atterrissage = UNE seule page** qui contient tout (modifier 1.b, annuler 1.d, info+choix+paiement des #2/#3), affichage réglé par cas. Exceptions : « J'ai une question » → section Contact ; « payer » (#1) → Square.
3. **Méthode de construction sûre : dupliquer → tester → remplacer.** On travaille sur une copie, bouton test dans le formulaire, et on remplace le vrai à la fin.
4. Page nommée **`section-coupdecoeur`**, placée **avant** la section « Merci ».
5. Numéro de commande transporté dans le lien : **`?cmd=CMD-XXXX`**.

## Découverte importante
Le document supposait que « lire une commande » existait déjà côté serveur. **Faux en partie** : `getCommandesLignes` lit bien une seule commande, mais le statut n'existait que via `getCommandesEntete` qui renvoie **TOUTES** les commandes (fuite de données sur une page publique). → On a créé une fonction dédiée **`getCommandePublique_v2`** qui renvoie **seulement** le statut + les lignes (enrichies : nom, photo, gamme, collection). Aucune donnée personnelle. Lecture seule.

## Ce qui est FAIT
- **Harnais test du courriel** (pour la toute fin, étape 7) : copie `envoyerProposition_v2test`, bouton « Envoyer au client test » → `envoyerPropositionTest` (front) → dispatcher `envoyerPropositiontest` (**petit t**) → `envoyerProposition_v2test`. Fonctionne. En dormance jusqu'à l'étape des boutons courriel (le dernier morceau).
- **Étape 1** — coquille `section-coupdecoeur` dans `index.html` (avant « Merci ») : entête + zone `#coupdecoeur-commande` + zone cachée `#coupdecoeur-bloque`.
- **Étape 2** — lecture du `?cmd=` au chargement (dans `main-demande.js`) : ouvre la section. ✅ testé.
- **Backend** — fonction `getCommandePublique_v2` collée dans `Code.gs` (renvoie statut + lignes enrichies) + ligne dispatcher dans `doPost`.
- **Front (étape 3)** — bloc dans `main-demande.js` qui appelle `getCommandePublique`, charge la commande dans `demandeListe` et ouvre la modale de coups de cœur existante.

## BLOQUÉ ICI (à régler en reprenant)
En testant `?cmd=CMD-0007`, la zone affiche : **« Réponse : Action inconnue : getCommandePublique »**.
- Ça veut dire que la **version déployée** de l'Apps Script ne contient pas la ligne dispatcher.
- À vérifier : la ligne `else if (action === 'getCommandePublique')  result = getCommandePublique_v2(data);` est bien dans `doPost` (orthographe exacte, grand C, grand P).
- **Action probable : redéployer une NOUVELLE version APRÈS avoir ajouté la ligne** (un redéploiement fait avant ne la contient pas), puis recharger `?cmd=CMD-0007`.
- Le bloc front affiche déjà la cause exacte dans `#coupdecoeur-commande` (version « qui parle »), à garder le temps de débloquer.

## Prochaines étapes (ordre)
- Débloquer le serveur ci-dessus → la commande doit s'afficher dans la liste de coups de cœur (= **étape 5**, affichage qui reste).
- **Étape 4** — vérifier le statut : modifiable seulement si « En attente de paiement », sinon message + bouton Fermer (utiliser la zone `#coupdecoeur-bloque`).
- **Étape 6** — renvoi de la liste modifiée : nouvelle fonction serveur, garder le gel, statut « À retravailler ». (Ne PAS appeler `envoyerDemandeCommande` qui crée une commande neuve.)
- **Étape 7 (dernier)** — boutons dans le courriel (« Modifier ou annuler », « J'ai une question »), via le harnais test déjà prêt.

## En suspens (pas maintenant)
- Nom du statut « à refaire » (#2/#3) — à trancher en arrivant aux #2/#3.
- Côté admin (Chantal) : deux versions côte à côte, écran de préparation, statuts dans le tableau — après le côté client.

## Repères techniques utiles
- Le front public parle au serveur via **`appelAPIPost(action, data)`** (déjà utilisé pour `envoyerDemandeCommande`).
- `demandeListe` = la liste de coups de cœur (dans `main-demande.js`) ; `demandeOuvrirModalListe()` ouvre la modale ; `sauvegarderDemandeListe()` sauve.
- Les lignes de commande ne contiennent que `pro_id` — c'est `getCommandePublique_v2` qui ajoute nom/photo/gamme/collection côté serveur (évite de dépendre du catalogue côté front).
