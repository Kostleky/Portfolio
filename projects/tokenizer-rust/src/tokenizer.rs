//! Module du tokenizer principal
//! Responsable: Refael
//!
//! Ce module gère l'encodage (tokens → IDs) et le décodage (IDs → tokens)
//! en utilisant le vocabulaire construit.

use crate::vocabulary::{UNKNOWN_TOKEN, Vocabulary};

/// Structure principale du tokenizer
pub struct Tokenizer {
    /// Vocabulaire avec mapping bidirectionnel token ↔ ID
    pub vocabulary: Vocabulary,
}

impl Tokenizer {
    /// Crée un nouveau tokenizer avec un vocabulaire vide
    ///
    /// # Exemple
    /// ```
    /// let tokenizer = Tokenizer::new();
    /// ```
    pub fn new() -> Self {
        Self {
            vocabulary: Vocabulary::new(),
        }
    }

    /// Construit le vocabulaire à partir d'une liste de tokens
    ///
    /// # Arguments
    /// * `tokens` - Liste de tokens à ajouter au vocabulaire
    ///
    /// # Exemple
    /// ```
    /// let mut tokenizer = Tokenizer::new();
    /// let tokens = vec!["hello".to_string(), "world".to_string()];
    /// tokenizer.build_vocabulary(&tokens);
    /// ```
    pub fn build_vocabulary(&mut self, tokens: &[String]) {
        for token in tokens {
            self.vocabulary.add_token(token);
        }
    }

    /// Encode une liste de tokens en IDs
    ///
    /// # Arguments
    /// * `tokens` - Liste de tokens à encoder
    ///
    /// # Retourne
    /// Vec<u32> - Liste d'IDs correspondants
    ///
    /// # Exemple
    /// ```
    /// let ids = tokenizer.encode(&["hello".to_string()]);
    /// ```
    pub fn encode(&self, tokens: &[String]) -> Vec<u32> {
        tokens
            .iter()
            .map(|token| {
                self.vocabulary
                    .get_id(token)
                    .unwrap_or_else(|| self.vocabulary.get_id(UNKNOWN_TOKEN).unwrap())
            })
            .collect()
    }

    /// Décode une liste d'IDs en tokens
    ///
    /// # Arguments
    /// * `ids` - Liste d'IDs à décoder
    ///
    /// # Retourne
    /// Vec<String> - Liste de tokens correspondants
    ///
    /// # Exemple
    /// ```
    /// let tokens = tokenizer.decode(&);[1][2]
    /// ```
    pub fn decode(&self, ids: &[u32]) -> Vec<String> {
        ids.iter()
            .map(|id| {
                self.vocabulary
                    .get_token(*id)
                    .unwrap_or_else(|| UNKNOWN_TOKEN.to_string())
            })
            .collect()
    }

    /// Retourne la taille du vocabulaire
    pub fn vocab_size(&self) -> usize {
        self.vocabulary.size()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tokenizer_new() {
        let tokenizer = Tokenizer::new();
        // Le vocabulaire devrait contenir au moins le token [UNK]
        assert!(tokenizer.vocab_size() > 0);
    }

    #[test]
    fn test_build_vocabulary() {
        let tokens = vec!["hello".to_string(), "world".to_string(), "test".to_string()];
        let mut tokenizer = Tokenizer::new();
        tokenizer.build_vocabulary(&tokens);

        // Vérifier que les tokens sont dans le vocabulaire
        assert!(tokenizer.vocabulary.get_id("hello").is_some());
        assert!(tokenizer.vocabulary.get_id("world").is_some());
        assert!(tokenizer.vocabulary.get_id("test").is_some());
    }

    #[test]
    fn test_encoding_decoding() {
        let tokens = vec![
            "I".to_string(),
            "am".to_string(),
            "eating".to_string(),
            "an".to_string(),
            "apple".to_string(),
        ];

        let mut tokenizer = Tokenizer::new();
        tokenizer.build_vocabulary(&tokens);

        let encoded = tokenizer.encode(&tokens);
        let decoded = tokenizer.decode(&encoded);

        assert_eq!(tokens, decoded);
    }

    #[test]
    fn test_unknown_token_encoding() {
        let tokenizer = Tokenizer::new();
        let unknown_tokens = vec!["this_does_not_exist".to_string()];

        let encoded = tokenizer.encode(&unknown_tokens);
        let unknown_id = tokenizer.vocabulary.get_id(UNKNOWN_TOKEN).unwrap();

        assert_eq!(encoded[0], unknown_id);
    }

    #[test]
    fn test_unknown_token_decoding() {
        let tokenizer = Tokenizer::new();
        let unknown_tokens = vec!["nonexistent".to_string()];

        let encoded = tokenizer.encode(&unknown_tokens);
        let decoded = tokenizer.decode(&encoded);

        assert_eq!(decoded[0], UNKNOWN_TOKEN.to_string());
    }

    #[test]
    fn test_mixed_known_unknown() {
        let mut tokenizer = Tokenizer::new();
        tokenizer.build_vocabulary(&vec!["hello".to_string()]);

        let tokens = vec!["hello".to_string(), "unknown".to_string()];
        let encoded = tokenizer.encode(&tokens);
        let decoded = tokenizer.decode(&encoded);

        assert_eq!(decoded[0], "hello");
        assert_eq!(decoded[1], UNKNOWN_TOKEN);
    }

    #[test]
    fn test_empty_input() {
        let tokenizer = Tokenizer::new();
        let empty: Vec<String> = vec![];

        let encoded = tokenizer.encode(&empty);
        let decoded = tokenizer.decode(&[]);

        assert!(encoded.is_empty());
        assert!(decoded.is_empty());
    }
}
