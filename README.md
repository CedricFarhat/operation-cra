# Opération CRA

Application permettant d'ajouter, d'éditer et de supprimer des activités pour 3 agents.

## Lancer l'application

Installez les dépendances:

```bash
npm install
```

Puis lancez l'application:

```bash
ng serve
```

## Utilisation

Cliquez sur les heures du calendrier pour délencher une modal qui vous permettra d'ajouter une activité.

Vous pouvez cliquer sur l'icône de poubelle pour supprimer l'activité (appelé Event dans le code) ou cliquer sur
le crayon pour l'éditer.

Vous pouvez utiliser le drag and drop pour manipuler les activités.

Lorsque vous prenez du repos cela consomme vos congés restants.


## Aller plus loin

Voici les améliorations possibles pour l'application (nécessite plus de temps):

- Plus grande couverture de tests (je n'ai pas tout testé car ça serait trop long)

- Faire une modal générique pour l'ajout et la modification et la mettre dans shared (pour l'instant il y'en a deux, ça fait une redondance de code)

- Gérer le regain de congés lorsqu'on supprime des congés

- Gérer la date de début qui peut être supérieur à la date de fin dans la modal

- Ajouter Tailwind pour se passer du css

- Passer en Angular 18 lorsque ngrx signals sera passé en 18
