//! Module de preprocessing et normalisation du texte
//! Responsable: Eliott
//!
//! Ce module prépare le texte brut avant tokenization en :
//! - Normalisant les caractères Unicode
//! - Convertissant en minuscules
//! - Nettoyant la ponctuation
//! - Découpant en mots

use unicode_normalization::UnicodeNormalization;

/// Prétraite le texte brut pour le rendre prêt à être tokenisé
///
/// # Arguments
/// * `input_text` - Texte brut à prétraiter
///
/// # Retourne
/// Vec<String> - Liste de mots nettoyés et normalisés
///
/// # Exemple
/// ```
/// let words = preprocess("Les élèves apprennent!");
/// // Retourne: ["les", "eleves", "apprennent"]
/// ```
pub fn preprocess(input_text: &str) -> Vec<String> {
    // Étape 1 : Normalisation Unicode - décompose les accents (é → e + accent)
    // Puis filtre pour garder uniquement les caractères de base (pas les accents)
    let text_normalized: String = input_text
        .nfd()
        .filter(|c| {
            // Garder uniquement les caractères qui ne sont pas des accents/marques
            // On exclut les catégories Unicode Mn (Nonspacing_Mark) et Mc (Spacing_Mark)
            matches!(
                unicode_normalization::char::canonical_combining_class(*c),
                0
            )
        })
        .collect();

    // Étape 2 : Conversion en minuscules
    let text_lower = text_normalized.to_lowercase();

    // Étape 3 : Nettoyage - garder uniquement lettres, chiffres et espaces
    let text_cleaned: String = text_lower
        .chars()
        .map(|ch| {
            if ch.is_alphanumeric() {
                ch
            } else {
                ' ' // Remplacer ponctuation par espace
            }
        })
        .collect();

    // Étape 4 : Découpage en mots et filtrage des chaînes vides
    text_cleaned
        .split_whitespace()
        .map(|word| word.to_string())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_preprocess_basic() {
        let input_text = "The mouse has been eaten by the cat.";
        assert_eq!(
            preprocess(input_text),
            vec!["the", "mouse", "has", "been", "eaten", "by", "the", "cat"]
        );
    }

    #[test]
    fn test_preprocess_empty() {
        let tokens = preprocess("");
        assert!(
            tokens.is_empty(),
            "Les tokens doivent être vides pour une chaîne vide"
        );
    }

    #[test]
    fn test_preprocess_with_numbers() {
        let tokens = preprocess("We are eating 3 apples, and 3 oranges.");
        assert_eq!(
            tokens,
            vec!["we", "are", "eating", "3", "apples", "and", "3", "oranges"]
        );
    }

    #[test]
    fn test_preprocess_unicode() {
        // Test de normalisation Unicode
        let tokens = preprocess("Les élèves étudient à l'école");
        assert_eq!(tokens, vec!["les", "eleves", "etudient", "a", "l", "ecole"]);
    }

    #[test]
    fn test_preprocess_punctuation() {
        let tokens = preprocess("Hello, world! How are you?");
        assert_eq!(tokens, vec!["hello", "world", "how", "are", "you"]);
    }

    #[test]
    fn test_preprocess_multiple_spaces() {
        let tokens = preprocess("word1    word2     word3");
        assert_eq!(tokens, vec!["word1", "word2", "word3"]);
    }

    #[test]
    fn test_preprocess_special_chars() {
        let tokens = preprocess("test@email.com & special#chars$here");
        // Tous les caractères spéciaux sont remplacés par des espaces
        assert_eq!(
            tokens,
            vec!["test", "email", "com", "special", "chars", "here"]
        );
    }

    #[test]
    fn test_preprocess_mixed_case() {
        let tokens = preprocess("ThIs Is MiXeD CaSe");
        assert_eq!(tokens, vec!["this", "is", "mixed", "case"]);
    }
}
