# Handoff — Système de demande de commande (étapes 2, 3, 4 faites — étape 5 à venir)

## Préférences de travail (à respecter strictement)

- **Jamais de code sans autorisation explicite.**
- Changements **uniquement par trouve-et-remplace**, **un à la fois**, attendre OK avant le suivant (sauf si Chantal demande explicitement plusieurs pas d'un coup).
- **Pas de solution sans analyse complète** au préalable.
- **Pas de romans.** Réponses courtes et directes.
- Chantal **ne parle pas en code**. Vulgariser, éviter le jargon.
- Ne pas poser de questions dont la réponse est déjà dans le brief.
- **Réutiliser son CSS existant** (variables, classes utilitaires) au lieu d'en réinventer. Valeurs en dur = à éviter.

---

## Contexte du projet

Site Univers Caresse (savonnerie artisanale). Système de demande de commande **non transactionnel** : le client coche les produits qui l'intéressent, envoie sa liste, Chantal reprend contact pour valider délais, coûts et disponibilité avant tout engagement.

Règles de vocabulaire :
- Pas de « panier » (mot interdit).
- Pas de possessifs (mon, ma, mes).
- Formulation officielle : **« Cochez si ce produit vous intéresse »**.

Tout est derrière le **flag `?test=1`** dans l'URL — invisible aux vrais clients tant que le flag n'est pas retiré.

---

## Décision importante survenue en cours de route

Le handoff initial disait « CSS minimal directement dans `main-demande.js`, ne pas toucher à `style.css` ». **Cette décision a été inversée.** Tout le CSS du système vit maintenant dans **`style.css`**, avec les **variables existantes** de Chantal (`--blanc`, `--blanc-pur-50`, `--danger`, `--texte-82`, `--noir-30`, etc.). Le `main-demande.js` n'injecte plus aucun style. La fonction `demandeStyleCases` qui injectait du CSS a été **supprimée**.

**Thème visuel retenu : le cœur.** Pas de crochet/case classique.

---

## Plan global (7 étapes)

1. **Fondations** — fichier JS, localStorage, fonctions, flag `?test=1`. ✅
2. **Fiche produit** — cases dans la modal. ✅
3. **Cartes du catalogue** — cœur rouge sur la carte. ✅
4. **Bulle compteur** — cœur rouge avec le nombre dedans. ✅ (à tester après commit)
5. **Modal de la liste** — ⬅️ **PROCHAINE ÉTAPE**
6. **Formulaire de coordonnées** — nom, courriel, téléphone, code postal + message optionnel.
7. **Envoi** — `envoyerDemandeCommande`, page de confirmation (mention pourriels).

---

## État détaillé par fichier

### `js/main-demande.js`

Fonctions de base (étape 1, inchangées) : `chargerDemandeListe`, `sauvegarderDemandeListe`, `demandeCle`, `demandeAjouter`, `demandeRetirer`, `demandeChangerQuantite`, `demandeContient`, `demandeContientProduit`, `demandeNombreItems`, `demandeSousTotal`, `demandeVider`.

Évolutions étapes 2-4 :
- **`demandeInjecterCasesModal(produit)`** — construit le titre + une ligne par format (prix + format + cœur cliquable) dans `#modal-visuel-hex`, et **cache** `#modal-prix-format` (pour ne pas répéter les prix). Ne fait rien si `!DEMANDE_ACTIVE`.
- **`demandeRafraichirAffichage()`** — n'est plus un stub. Fait deux choses : (a) ajoute/retire la classe `demande-coche` sur chaque `.carte-produit[data-pro-id]` selon `demandeContientProduit`, (b) met à jour la bulle compteur (nombre + affiche/cache).
- **Init `DOMContentLoaded`** — charge la liste, **crée la bulle** (`#demande-bulle` avec un `<span class="demande-bulle-nb">` dedans, classe `cache` au départ), puis appelle `demandeRafraichirAffichage()`.

### `js/main.js` (4 petits ajouts seulement)

- `carteProduit` : ajout de l'attribut **`data-pro-id="${p.pro_id}"`** sur la `.carte-produit`.
- `ouvrirModal` : **une ligne** avant l'ouverture → `if (typeof demandeInjecterCasesModal === 'function') demandeInjecterCasesModal(produit);`
- `construireCatalogue` : **une ligne** à la fin → `if (typeof demandeRafraichirAffichage === 'function') demandeRafraichirAffichage();`
- `afficherPageRegroupements` : **une ligne** à la fin (même appel).

### `css/style.css` (tout avec ses variables)

Ajoutées après `.modal-prix-format` :
- `.demande-cases`, `.demande-cases-titre` (font-weight 400, **aligné à gauche**), `.demande-case-ligne`, `.demande-case-texte`, `.demande-case-coeur` (vide = `--blanc-pur-50`), `.demande-case-coeur.coche` (plein = `--blanc`).

Ajoutées après `.carte-couleur-dot` :
- `.carte-produit.demande-coche .carte-couleur-dot` (cercle rendu transparent) + `::after` (cœur `♥` rouge `--danger`, halo blanc pour la lisibilité sur photo).

Ajoutées après `.demande-case-coeur.coche` :
- `.demande-bulle` (fixée `top:16px; left:24px; z-index:150`), `::before` (cœur `♥` `--danger`), `.demande-bulle-nb` (nombre blanc, centré), `:hover`.

### `index.html`

Aucun changement aux étapes 2-4. La balise `<script src="js/main-demande.js"></script>` (après `main.js`) date de l'étape 1.

---

## Comportements clés à connaître

- Les cœurs de la **modal** : `♡` vide / `♥` plein, en **blanc**, toute la ligne est cliquable. Cocher → `demandeAjouter`, décocher → `demandeRetirer`.
- Le cœur sur la **carte** : remplace le petit cercle quand le produit a **au moins un format** choisi. Revient en cercle si on retire tout.
- La **bulle** : cœur rouge avec le nombre dedans, en haut à gauche (choisi pour éviter les liens de menu sur ordi et le burger flottant sur mobile). Apparaît seulement si nombre ≥ 1. Réutilise la classe utilitaire **`.cache`** existante pour s'afficher/se cacher.
- La bulle affiche `demandeNombreItems()` = **nombre de formats distincts choisis** (lignes), pas la somme des quantités. À changer si Chantal veut le total des quantités.

---

## Prochaine action concrète (étape 5)

Modal de la liste : afficher photo, nom, collection, format, prix, quantité ajustable (− 2 +), sous-total, bouton retirer. **Cliquer sur la bulle (`#demande-bulle`) doit ouvrir cette modal** — aucun gestionnaire de clic n'est encore branché sur la bulle.

Aborder l'étape avec une analyse complète d'abord, puis premier trouve-et-remplace, attendre OK.

---

## Points encore ouverts pour plus tard

- Brancher le clic de la bulle vers la modal de liste (étape 5).
- Comportement de la bulle au défilement sur mobile (elle reste fixe pour l'instant — non caché au scroll comme le burger).
- Tailles / couleurs des cœurs : ajustables au goût.
- Formulation finale du texte explicatif et du courriel de confirmation client (étape 7).
- Générer le lien de paiement Square depuis une commande dans l'admin.

---

## Fichiers de référence (déjà fournis dans la session précédente)

`index.html`, `js/main.js`, `js/main-demande.js`, `css/style.css` — demander la version à jour si besoin avant tout trouve-et-remplace (pour matcher le texte exact).
