# Reprise — ce qui a été décidé et fait

## Décisions tranchées cette session

**1. Le courriel de proposition = UNE SEULE fonction qui contient tout.**
- On retravaille la fonction existante `envoyerProposition_v2`, on n'en crée pas d'autres.
- Elle contient tout le contenu possible (boutons du #1, 2 parties + lien vers la page des #2/#3).
- On règle ensuite **ce qui s'affiche** selon le cas de stock (tout / pas tout / rien).
- Approche retenue : **tout mettre dans la fonction, puis régler l'affichage** (pas « assembler les morceaux »). Pas 15 fonctions, pas 15 courriels.

**2. La page d'atterrissage = UNE SEULE page qui contient tout.**
- Même logique : tout le contenu sur une page (modifier 1.b, annuler 1.d, info + choix partie 2 + paiement des #2/#3), puis on règle l'affichage par cas.
- Deux exceptions qui partent ailleurs par choix :
  - « J'ai une question » → section Contact existante
  - « payer » (#1) → directement Square

**3. Nom et place de la page.**
- Nom interne de la section : **`section-coupdecoeur`**.
- Placée **avant** la section « Merci » (Merci reste la dernière).

## Fait

**Étape 1 de la branche 1.b — la coquille de la page d'atterrissage.**
- Bloc HTML ajouté dans `index.html`, **avant** le commentaire `<!-- SECTION MERCI -->`.
- Contenu de la coquille :
  - une entête dans le décor habituel (« Vos coups de cœur »)
  - une zone vide `#coupdecoeur-commande` (la commande s'affichera ici plus tard)
  - une zone cachée `#coupdecoeur-bloque` (message « plus modifiable » + bouton Fermer, à remplir plus tard)
- C'est une coquille vide : elle ne s'affiche pas tant qu'on ne la branche pas. Aucun serveur, aucune logique.

## En suspens (pas touché)

- Le nom du statut « à refaire » (#2/#3) — à trancher quand on arrivera aux #2/#3.

## Prochaine étape

**Étape 2 de 1.b — lire le numéro de commande** (CMD-XXXX) transporté dans l'adresse du lien, au chargement de la page. Mot exact dans l'adresse à choisir à ce moment-là.
