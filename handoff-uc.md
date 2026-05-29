# Handoff — Univers Caresse (admin)
### État du projet + méthode de travail à respecter

> À lire en entier avant de commencer. La **méthode de travail** (section 1) passe avant tout le reste. Chantal dirige. On avance par petites touches, en douceur.

---

## 1. MÉTHODE DE TRAVAIL — à respecter STRICTEMENT

1.1 **Jamais de code sans autorisation explicite.** On propose, on attend le OK.

1.2 **Changements uniquement par trouve-et-remplace**, **un seul à la fois**, et on **attend le OK** avant de passer au suivant.

1.3 **Avant tout trouve-et-remplace : redemander la version à jour du fichier.** Les fichiers évoluent entre les sessions ; il faut matcher le texte exact.

1.4 **Pas de solution sans analyse complète au préalable.** Si une info manque (un fichier, une fonction), on la demande avant de proposer quoi que ce soit. On ne devine pas.

1.5 **Réutiliser l'existant** : CSS, variables, fonctions, classes déjà en place. **Objectif : réduire le CSS, pas le gonfler.** Améliorer un style partagé une seule fois plutôt que de copier-coller par section.

1.6 **Réponses COURTES. Une idée à la fois.** Pas de roman.

1.7 **Zéro jargon. Vulgariser.** Chantal ne parle pas en code. Expliquer en mots simples ce qu'on fait et pourquoi.

1.8 **Pas de listes à choix multiples** dans la conversation (elle déteste ça). Parler normalement, en phrases.

1.9 **Pas de diagrammes Mermaid.** Numérotation en arborescence (1, 1.1…).

1.10 **Pas de maquette** sauf demande.

1.11 **Elle teste seulement quand elle publie.** Donc on peut enchaîner les trouve-et-remplace sans test entre les deux, sur son OK. Si une étape dépend d'une autre (ex. un bouton qui appelle une fenêtre pas encore créée), la prévenir de ne pas tester entre-temps.

1.12 **Ne JAMAIS décider de son emploi du temps.** Elle choisit le rythme et l'ordre.

1.13 **Ton** : doux, encourageant, court. Célébrer ce qui est fait. Honnête si quelque chose dérape, sans s'aplatir ni s'excuser à répétition. Revenir au concret.

---

## 2. CONTEXTE

Site **Univers Caresse** (savonnerie artisanale). Admin construite sur **Google Sheets + Apps Script** (`Code.gs`). Front en HTML/CSS/JS classique, un seul `style.css` partagé public + admin.

**Republier après un changement :**
- `Code.gs` modifié → **nouveau déploiement** Apps Script.
- HTML / CSS / JS modifié → **republier le site**.

**Flux d'une commande** : demande du site → « En attente » → **Compléter** (sort le stock + envoie la proposition par courriel/texto) → « En attente de paiement » → **Paiement reçu** (crée la vente) → « À expédier » → « Terminée ».

---

## 3. CE QUI A ÉTÉ FAIT DANS CETTE SESSION

3.1 **Tuile « Univers » de l'accueil admin** affichait « — ». Corrigé dans `admin.js` : la case `hero-stat-univers` est maintenant remplie à partir de `donneesRegroupements.length`, aux deux endroits (`chargerDonneesInitiales` et `afficherStatsAccueil`).

3.2 **Espacement des fiches uniformisé.** La fiche Collections avait une règle spéciale (flex colonne, `gap: 12px`) qui la faisait « respirer » ; les autres non. Ajouté dans `style.css` les mêmes règles pour `#fiche-gamme`, `#fiche-famille`, `#fiche-regroupement` (et `#fiche-recette`), via `:not(.cache)`, et `margin-bottom: 0` sur leurs `.form-panel`.

3.3 **Espacement des formulaires d'édition uniformisé** de la même façon : `#form-collections`, `#form-gammes`, `#form-familles`, `#form-regroupements`, `#form-recettes`.

3.4 **Relooking des gammes dans la fiche collection.** En améliorant le **style partagé** `.fiche-ligne-item` (carte avec barre verte à gauche, fond `--primary-04`, hover qui glisse) et `.fiche-ligne-nom` (police de titres, vert). Aucun style par section.

3.5 **Bouton « Fermer »** ajouté en **premier** bouton dans le bandeau du bas des 4 fiches (Collections, Gammes, Familles, Univers), réutilisant `bouton bouton-contour`.

3.6 **Lisibilité du bouton contour.** `.bouton-contour` passait du beige pâle (illisible sur blanc) au **gris**. Améliore aussi tous les boutons « Annuler ».

3.7 **Médiathèque réparée (popup ET page).** Cause : une session précédente avait regroupé le style des cartes sous `.carte` et **commenté l'ancien `.collection-carte`**, mais la médiathèque utilisait encore l'ancien nom → photos géantes sans cadre. Corrigé dans `admin-mediatheque.js` : les deux gabarits de carte (`medFiltrer` et `filtrerMediatheque`) utilisent maintenant `.carte` / `.carte-bg` / `.carte-contenu` / `.carte-titre` / `.carte-slogan`. **Zéro nouveau CSS.**

3.8 **Menu déroulant nav** : trop étroit → texte sur 2 lignes. Ajouté `white-space: nowrap` sur `.nav-dropdown-item` (le menu s'élargit juste ce qu'il faut). Puis, comme le menu de droite touchait le bord, les déroulants s'ouvrent vers la **gauche** (`right: 0; left: auto` sur `.nav-dropdown`).

3.9 **Barres de défilement masquées partout** (3 visibles en même temps). Ajouté après le reset : `* { scrollbar-width: none; -ms-overflow-style: none; }` et `*::-webkit-scrollbar { display: none; width: 0; height: 0; }`. Le défilement fonctionne toujours. *(S'applique aussi au site public, même fichier.)*

3.10 **Choix du mode de paiement à « Paiement reçu »** *(en test au moment d'écrire)*. Avant, c'était « square » en dur. Maintenant le bouton ouvre une petite fenêtre (`#modal-mode-paiement-cmd`, dans `index.html`) avec **Square / Virement Interac / Comptant**. `paiementRecu` ouvre la fenêtre ; `confirmerPaiementCommande(mode)` appelle `creerVenteDepuisCommande` avec le mode choisi. Valeurs enregistrées : `square`, `interac`, `argent` (= les clés déjà utilisées ailleurs, pour rester cohérent).

---

## 4. DÉTAILS TECHNIQUES UTILES À SE RAPPELER

4.1 `.form-panel` est caché par défaut. Il s'affiche soit avec la classe `visible`, soit parce qu'il est dans la grande liste de sélecteurs `#... .form-panel { display: block; }` du `style.css`.

4.2 Les **fiches** (`#fiche-gamme`, `#fiche-famille`, `#fiche-regroupement`, `#fiche-recette`) se montrent en **retirant `.cache`** (deviennent `display:flex` grâce aux règles ajoutées). La fiche Collections (`#fiche-collection`), elle, utilise la classe **`.visible`**.

4.3 **Système de cartes unifié `.carte`.** L'ancien `.collection-carte` est **commenté** dans le CSS. Si une autre page (listes gammes / familles / univers) affiche encore des photos « géantes », c'est la même cause : du JS qui utilise encore l'ancien nom. Solution : migrer ce JS vers `.carte`.

4.4 **Mode de paiement** : stocké **brut** dans `Ventes_Entete_v2` et **affiché brut** dans la liste des ventes (colonne Paiement). Clés en usage : `square`, `argent` (comptant), `plus-tard`, `square-manuel`, + `interac` (nouveau). Si un jour on veut de jolies étiquettes (« Comptant » au lieu de « argent »), c'est dans `afficherTableauVentes` de `admin-ventes.js`, et ça toucherait toutes les ventes.

4.5 `creerVenteDepuisCommande_v2` (Code.gs) enregistre `data.mode_paiement || 'square'` sans validation → accepte n'importe quelle chaîne.

4.6 `Commandes_Entete_v2`, colonnes ajoutées : **M** `note_proposition`, **N** `lien_square`, **O** `livraison`, **P** `date_proposition`.

4.7 `sms:` ne s'ouvre **que depuis un clic direct** (pas après un `await`).

---

## 5. « SI » RESTANTS (à reprendre un à la fois, au rythme de Chantal)

- ✅ *Mode de paiement à confirmer* (Square / Interac / comptant) — fait, en validation.
- **Corriger et renvoyer** la proposition après le 1ᵉʳ envoi — limité aux **coordonnées** (PAS aux items : le stock est déjà sorti).
- **Pastille orange** (stock partiel) — quoi faire ?
- **Pastille rouge** (rien en stock) — la commande reste « En attente ».
- **Cliente ne répond pas** — bouton Rappel.
- **Cliente annule** après sortie du stock → **retourner le stock**.
- **Cliente modifie** la commande au retour.

---

## 6. FICHIERS DE RÉFÉRENCE
*(toujours redemander la version à jour avant un trouve-et-remplace)*

- `index.html` — sections admin, fiches, formulaires, fenêtres modales.
- `css/style.css` — source unique, public + admin.
- `js/main.js` — site public + appels API (`appelAPI`, `appelAPIPost`, `CONFIG`).
- `js/admin.js` — init admin, navigation, stats d'accueil.
- `js/admin-commandes.js` — commandes : liste, fiche, compléter, `paiementRecu`, `confirmerPaiementCommande`, `textoProposition`.
- `js/admin-ventes.js` — ventes, `finaliserVente`, Square, factures courriel/texto.
- `js/admin-collections.js` — collections + gammes de la collection.
- `js/admin-mediatheque.js` — médiathèque (page + popup sélecteur).
- `Code.gs` — back-end Apps Script (`creerVenteDepuisCommande_v2`, `updateCommandeComplete_v2`, `sortirStockCommande_v2`, `envoyerProposition_v2`, etc.).

---

*Bon travail, et surtout : douceur, petites touches, une chose à la fois. Chantal paie pour ce service et mérite qu'on l'écoute.*
