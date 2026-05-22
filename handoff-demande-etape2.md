# Handoff — Système de demande de commande (étape 2 en cours)

## Préférences de travail (à respecter strictement)

- **Jamais de code sans autorisation explicite.**
- Changements **uniquement par trouve-et-remplace**, **un à la fois**, attendre OK avant le suivant.
- **Pas de solution sans analyse complète** au préalable.
- **Pas de romans.** Réponses courtes et directes.
- Chantal **ne parle pas en code**. Vulgariser, éviter le jargon technique.
- Ne pas poser de questions dont la réponse est déjà dans le brief.

---

## Contexte du projet

Site Univers Caresse (savonnerie artisanale). On bâtit un système de demande de commande **non transactionnel** : le client coche les produits qui l'intéressent, envoie sa liste, Chantal reprend contact pour valider délais, coûts et disponibilité avant tout engagement.

Règles de vocabulaire :
- Pas de « panier » (mot interdit, mauvaise connotation).
- Pas de possessifs (mon, ma, mes).
- Formulation officielle : **« Cochez si ce produit vous intéresse »**.

Tout le système est derrière un **flag `?test=1`** dans l'URL — invisible aux vrais clients tant que le flag n'est pas retiré.

Le brief complet original est dans `systeme-demande.md`.

---

## Plan global (7 étapes)

1. **Fondations** — fichier JS, localStorage, fonctions add/remove/quantité, flag `?test=1`. ✅
2. **Fiche produit** — titre « Cochez si ce produit vous intéresse » + une case à cocher par format dans la modal. ⬅️ **EN COURS**
3. **Cartes du catalogue** — **crochet** qui apparaît dans le point coloré quand au moins un format du produit est dans la liste.
4. **Bulle compteur** — élément fixé en haut qui affiche le nombre total d'items cochés.
5. **Modal de la liste** — affiche photo, nom, collection, format, prix, quantité ajustable (− 2 +), sous-total, bouton retirer.
6. **Formulaire de coordonnées** — nom, courriel, téléphone, code postal (obligatoires) + message (optionnel).
7. **Envoi** — appel à la nouvelle fonction backend `envoyerDemandeCommande`, page de confirmation avec mention des pourriels.

---

## État actuel

### Étape 1 — terminée

Fichier `js/main-demande.js` créé. Contient :
- Flag `DEMANDE_ACTIVE` lu depuis `?test=1` dans l'URL.
- Stockage dans `localStorage` sous la clé `uc_demande`.
- Fonctions : `chargerDemandeListe`, `sauvegarderDemandeListe`, `demandeCle`, `demandeAjouter`, `demandeRetirer`, `demandeChangerQuantite`, `demandeContient`, `demandeContientProduit`, `demandeNombreItems`, `demandeSousTotal`, `demandeVider`, `demandeRafraichirAffichage` (stub).
- Initialisation au `DOMContentLoaded` (charge la liste seulement si `DEMANDE_ACTIVE`).

⚠️ **Note de nommage** : initialement nommé `admin-demande.js` par erreur, **renommé en `main-demande.js`** parce que ça vit sur le site public, pas dans l'admin.

La balise `<script src="js/main-demande.js"></script>` a été ajoutée dans `index.html` après celle de `main.js`.

### Étape 2 — décisions prises, pas encore codée

Comportement attendu dans la modal produit :
- **Titre « Cochez si ce produit vous intéresse »** placé **au-dessus** de la zone prix/format actuelle dans le carré coloré (`modal-visuel-hex`).
- **Chaque format sur sa propre ligne**, avec une **case à cocher à la fin** de chaque ligne.
- Visible **uniquement** quand `DEMANDE_ACTIVE` est vrai. Sinon, la modal garde son comportement actuel intact.

Approche technique convenue :
1. Dans `main-demande.js` : ajouter une fonction qui s'occupe d'injecter le titre + les cases dans la modal.
2. Dans `main.js` : ajouter **une seule ligne** dans `ouvrirModal` pour appeler cette fonction.
3. CSS minimal directement dans `main-demande.js` (ne pas toucher à `style.css`).

Comportement des cases :
- Cocher → `demandeAjouter(...)` (ajoute une unité).
- Décocher → `demandeRetirer(...)` (retire complètement l'item, peu importe la quantité).
- À l'ouverture de la modal, état initial des cases lu via `demandeContient(...)` pour chaque format.

### Prochaine action concrète

Premier trouve-et-remplace à proposer : ajout de la nouvelle fonction dans `main-demande.js`. Présenter le code, attendre OK, puis enchaîner avec le trouve-et-remplace dans `main.js`.

---

## Fichiers de référence à demander à Chantal au besoin

- `index.html` — structure de la modal produit (`#modal-produit`, `#modal-visuel-hex`, `#modal-prix-format`, etc.).
- `js/main.js` — fonction `ouvrirModal(produit)` qui peuple la modal.
- `js/main-demande.js` — fichier de l'étape 1.
- `css/style.css` — pas encore fourni, à demander seulement si nécessaire.

## Points encore ouverts pour plus tard

- Position exacte de la bulle compteur selon les supports (étape 4).
- Formulation finale du texte explicatif et du courriel de confirmation client.
- Comment générer le lien de paiement Square depuis une commande dans l'admin.
