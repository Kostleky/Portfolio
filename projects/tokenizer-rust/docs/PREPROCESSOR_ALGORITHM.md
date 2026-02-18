# Module Preprocessing

## Objectif

Préparer le texte brut avant la tokenisation en le nettoyant et en le normalisant.

## Fonctionnalités

### Normalisation Unicode
Convertit les caractères accentués en leur forme de base :
- é → e
- à → a
- ç → c
- ñ → n

### Conversion en minuscules
Transforme tout le texte en minuscules pour uniformiser.

### Suppression de la ponctuation
Retire tous les caractères spéciaux et la ponctuation.

### Découpage en mots
Sépare le texte en liste de mots individuels.

## Utilisation

### Fonction principale : preprocess()

    use tokenizer_rs::preprocessor::preprocess;
    
    let words = preprocess("Les élèves apprennent!");
    // Retourne: ["les", "eleves", "apprennent"]

### Fonction avancée : preprocess_advanced()

Permet de contrôler si on garde les chiffres ou non :

    use tokenizer_rs::preprocessor::preprocess_advanced;
    
    // Garder les chiffres
    let words = preprocess_advanced("test123", true);
    // Retourne: ["test123"]
    
    // Supprimer les chiffres
    let words = preprocess_advanced("test123", false);
    // Retourne: ["test"]

## Exemples

### Texte avec accents

    Entrée : "Les élèves étudient à l'école"
    Sortie : ["les", "eleves", "etudient", "a", "l", "ecole"]

### Texte avec ponctuation

    Entrée : "Hello, world! How are you?"
    Sortie : ["hello", "world", "how", "are", "you"]

### Texte avec chiffres

    Entrée : "We are eating 3 apples"
    Sortie : ["we", "are", "eating", "3", "apples"]

### Texte avec caractères spéciaux

    Entrée : "test@email.com & special#chars"
    Sortie : ["test", "email", "com", "special", "chars"]

## Workflow dans le projet

    Texte brut
        ↓
    preprocess()
        ↓
    Mots nettoyés
        ↓
    BPE (module de Kilian)
        ↓
    Tokens

## Tests

    cargo test preprocessor

10 tests couvrent tous les cas d'usage.

## Dépendances

- unicode-normalization : Pour la normalisation Unicode
