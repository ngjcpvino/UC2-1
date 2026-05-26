# Handoff — Refonte du suivi des commandes (brainstorm, pas encore codé)

## Préférences de travail (à respecter STRICTEMENT)

- **Jamais de code sans autorisation explicite.**
- Changements **uniquement par trouve-et-remplace**, **un seul à la fois**, attendre OK avant le suivant.
- **Pas de solution sans analyse complète** au préalable.
- **Réponses COURTES.** Chantal a dit plusieurs fois « tu vas trop vite / tu écris trop ». Aller doucement, une idée à la fois.
- Chantal **ne parle pas en code**. Vulgariser, zéro jargon.
- **Pas de diagrammes Mermaid** : elle a dit que c'est difficile à lire. Elle préfère une **numérotation en arborescence** (1, 2-1, 2-2, 2-3…).
- Réutiliser son CSS / ses variables / ses fonctions existantes au lieu d'en réinventer.
- Mode de travail du moment : **on jase, on n'a encore rien codé.** Ne pas se précipiter vers le code. Elle décante.

---

## Où on en est

Le système public de **demande de commande** (étapes 1 à 7) est **terminé et en ligne** (le `?test=1` a été retiré, `DEMANDE_ACTIVE = true`). Une demande du site crée déjà une commande **« En attente »** dans l'admin (via `envoyerDemandeCommande_v2` dans le Code.gs), avec client + items + totaux remplis, et envoie un courriel à Chantal + un courriel de confirmation au client.

**Nouveau chantier (en réflexion) : rendre le traitement d'une commande facile et sans en échapper.** Rien n'est codé. C'est un brainstorm.

---

## Le besoin de Chantal (dans ses mots)

- Une fois la demande arrivée, elle trouve **laborieux** de : vérifier le stock, répondre au client, transformer en commande/vente.
- Le but du site, c'est de **vendre sans être présente** (donc le paiement à distance est au cœur, pas un extra).
- Elle a **peur d'en oublier / d'en perdre** une avec la simple page actuelle.
- Ça doit être **facile, efficace, et facile à suivre** de son côté (voir d'un coup d'œil où chaque commande est rendue).

---

## La vision retenue (à bâtir plus tard)

### Affichage du stock
- Dans une commande, voir le **stock de produits prêts à côté de chaque produit**, pour savoir d'un coup d'œil si la commande est complétable.
- Idéalement aussi visible dans la **liste** des commandes (pour trier sans toutes les ouvrir). À commencer par la **fiche d'abord** (choix pas encore confirmé).
- Source de données : **lots de produits finis** (pas les ingrédients). La fonction serveur `getLotsDisponibles` existe déjà et est déjà utilisée par « Convertir en vente ». Donc affichage probablement **sans changement serveur**.

### Réservation (réversible)
- Bouton **« Réserver les produits »** qui **gèle le stock** (l'inventaire baisse pour tout le monde → évite de promettre le même savon à deux clientes).
- La réservation **n'est pas une vente**. Si ça ne se conclut pas → le stock **revient**.
- ⚠️ **Piège technique à gérer** : réserver puis vendre ne doit **jamais** enlever le stock deux fois. (Le modèle de données reste à décider — voir « À trancher ».)

### Priorisation
- Traitement **par ordre d'arrivée** (premier arrivé, premier servi) **par défaut**.
- **Exception** : si une commande manque trop de produits mais qu'une autre est complétable, Chantal fait celle qui est complétable d'abord.
- Une commande non complétable **reste « En attente »** ; elle y revient quand un lot finit sa cure ou qu'elle en refait.

### Les 4 blocs (la structure de suivi qu'elle veut)
Elle préfère des **blocs séparés** (pas des couleurs, pas une seule grande liste). Une commande **descend** d'un bloc à l'autre à mesure qu'elle agit.

- **1. Entrantes** — viennent d'arriver. Action : réserver le stock → préparer la **proposition** (produits + frais de livraison + lien de paiement Square) → **Envoyer au client** (texte générique à rédiger plus tard).
- **2. En cours** — proposition envoyée. **3 possibilités** :
  - **2-1. Paiement reçu** → passe à « À expédier ».
  - **2-2. Pas de réponse** → bouton **Rappel**, qui **inscrit la date du rappel** sur la commande (« Rappel envoyé le ___ »), possiblement le nombre de rappels. Idée : faire ressortir celles qui traînent depuis X jours.
  - **2-3. Changement à la commande** → retour à la **réservation**, ajuster (ajouter/enlever des produits), **le stock réservé suit** (réserve plus / libère), puis **renvoyer la proposition**. Le stock reste réservé pendant l'ajustement.
- **3. À expédier** — payée, à préparer.
- **4. Terminées** — expédiée / faite (discret).
- **+ Annulées** — une commande peut mourir en chemin (depuis n'importe quel bloc). Le stock réservé **se libère**, la commande va dans un coin discret « Annulées / classées » (pas un 5e bloc bien en vue).

### « Proposition » (pas une vente)
- Ce n'est **pas** une vente : c'est une **proposition** (produits gelés + livraison) que la cliente accepte et **paie** avant l'expédition.
- Pas encore décidé : nouveau document **ou** simple changement de statut de la commande.

### Paiement
- Chantal vend surtout en personne (chez elle / au marché) via l'**app Square sur iPhone**. Mais le but du chantier, c'est de **vendre à distance**.
- Plan : envoyer un **lien de paiement Square** (ou facture Square) par courriel ; la cliente paie en ligne.
- **Comment le « payé » revient dans le système** : pas tranché. Pour commencer, **Chantal clique « Payée »** quand elle voit le paiement (manuel). Automatiser via Square plus tard (à vérifier si Square peut prévenir le système — technique).

### Le « coucou » par texto (anti-pourriel)
- Pour éviter que la proposition se perde dans les indésirables : envoyer un **petit texto** en même temps que le courriel.
- Décision : **version gratuite, manuelle**. Comme Chantal travaille sur iPhone, un bouton ouvrirait l'app **Messages avec le texto déjà écrit + le numéro de la cliente** ; elle tape Envoyer. (Comme l'envoi de sa facture.)
- Envoi **automatique** = service externe **payant** → écarté pour l'instant.
- Note : marche seulement depuis le téléphone (pas l'ordi), ce qui convient.

---

## À trancher quand on reprendra (pas encore décidé)

- Le stock dans la **fiche seulement** d'abord, ou **aussi dans la liste**.
- Le **modèle de réservation** (le « comment » technique, sans double-comptage du stock) — à concevoir ensemble, en vulgarisant.
- « Proposition » = nouveau document **ou** statut de commande.
- Paiement qui rentre **manuel** (clic) au début ; **auto Square** plus tard.
- Jusqu'où vont les **rappels** (combien, après combien de jours).
- Le bloc **2 « En cours »** : une seule étape ou sous-cas distincts.

---

## Premier morceau suggéré quand elle sera prête (le plus sûr)

**Afficher le stock de produits prêts à côté de chaque produit, dans la fiche d'une commande** (vert = assez / orange = pas assez / rouge = rien). Lecture seule, ne touche pas à l'inventaire → **zéro risque de bris**, et c'est le socle de tout le reste. Réutilise `getLotsDisponibles` (déjà appelée par « Convertir en vente »). **Faire une analyse complète d'abord, puis proposer UN trouve-et-remplace, attendre OK.**

---

## Fichiers de référence (à redemander à Chantal, version à jour, avant tout trouve-et-remplace)

- `js/admin-commandes.js` — gère la liste, la fiche, la création/édition, « Convertir en vente », statuts. **Fonctions clés** : `chargerCommandes`, `voirDetailCommande` (c'est là qu'on afficherait le stock + les nouveaux boutons), `convertirCommandeEnVente` (montre déjà comment lire `getLotsDisponibles` et associer un lot à chaque ligne), `changerStatutCommande`, `annulerCommande`.
- `Code.gs` (Apps Script) — backend. Fonctions utiles : `getCommandesEntete_v2`, `getCommandesLignes_v2`, `getLots_v2`, `getLotsDisponibles_v2`, `finaliserVente_v2`, `envoyerDemandeCommande_v2`. Statuts de commande existants : « En attente », « Prête », « Annulée ».
- Le **HTML de l'admin** de la section commandes (les blocs `#fiche-commande`, `#form-commande`, `#tableau-commandes`, etc.) — à demander si on touche à l'affichage.
- `css/style.css` — réutiliser ses variables (`--primary`, `--danger`, `--accent`, `--beige`, etc.) et sa classe utilitaire `.cache`.

---

## Ton à garder

Doux, encourageant, court. Elle avance par petites touches (« on va par possibilités », « à voir, pas certaine »). La laisser décanter, ne jamais bousculer, célébrer ce qui est déjà fait.
