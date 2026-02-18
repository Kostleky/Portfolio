//! Module de gestion du vocabulaire
//! Responsable: Refael

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Token spécial pour les mots inconnus
pub const UNKNOWN_TOKEN: &str = "[UNK]";

/// Token spécial pour le padding
pub const PAD_TOKEN: &str = "[PAD]";

/// Structure pour gérer le vocabulaire bidirectionnel
#[derive(Serialize, Deserialize, Debug)]
pub struct Vocabulary {
    /// Mapping token → ID
    pub conversion_token_to_id: HashMap<String, u32>,
    /// Mapping ID → token (pour le décodage)
    pub conversion_id_to_token: HashMap<u32, String>,
    /// Prochain ID disponible
    next_id: u32,
}

impl Vocabulary {
    /// Crée un nouveau vocabulaire vide avec tokens spéciaux
    pub fn new() -> Self {
        let mut vocab = Self {
            conversion_token_to_id: HashMap::new(),
            conversion_id_to_token: HashMap::new(),
            next_id: 0,
        };

        // Ajouter les tokens spéciaux
        vocab.add_token(UNKNOWN_TOKEN);
        vocab.add_token(PAD_TOKEN);

        vocab
    }

    /// Ajoute un token au vocabulaire s'il n'existe pas déjà
    ///
    /// # Arguments
    /// * `token` - Le token à ajouter
    pub fn add_token(&mut self, token: &str) {
        if !self.conversion_token_to_id.contains_key(token) {
            let id = self.next_id;
            self.conversion_token_to_id.insert(token.to_string(), id);
            self.conversion_id_to_token.insert(id, token.to_string());
            self.next_id += 1;
        }
    }

    /// Récupère l'ID d'un token
    ///
    /// # Arguments
    /// * `token` - Le token à chercher
    ///
    /// # Retourne
    /// Option<u32> - L'ID du token ou None si inconnu
    pub fn get_id(&self, token: &str) -> Option<u32> {
        self.conversion_token_to_id.get(token).copied()
    }

    /// Récupère le token correspondant à un ID
    ///
    /// # Arguments
    /// * `id` - L'ID à chercher
    ///
    /// # Retourne
    /// Option<String> - Le token ou None si ID invalide
    pub fn get_token(&self, id: u32) -> Option<String> {
        self.conversion_id_to_token.get(&id).cloned()
    }

    /// Retourne le nombre de tokens dans le vocabulaire
    pub fn size(&self) -> usize {
        self.conversion_token_to_id.len()
    }

    /// Sauvegarde le vocabulaire dans un fichier JSON
    pub fn save(&self, path: &str) -> Result<(), std::io::Error> {
        use std::fs::File;
        use std::io::Write;

        let json = serde_json::to_string_pretty(self).map_err(std::io::Error::other)?;

        let mut file = File::create(path)?;
        file.write_all(json.as_bytes())?;

        println!("Vocabulaire sauvegardé dans {}", path);
        Ok(())
    }

    /// Charge un vocabulaire depuis un fichier JSON
    pub fn load(path: &str) -> Result<Self, std::io::Error> {
        use std::fs::File;
        use std::io::Read;

        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;

        let vocabulary: Vocabulary =
            serde_json::from_str(&contents).map_err(std::io::Error::other)?;

        println!("Vocabulaire chargé depuis {}", path);
        Ok(vocabulary)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vocabulary_new() {
        let vocab = Vocabulary::new();
        // Devrait contenir [UNK] et [PAD]
        assert_eq!(vocab.size(), 2);
        assert!(vocab.get_id(UNKNOWN_TOKEN).is_some());
        assert!(vocab.get_id(PAD_TOKEN).is_some());
    }

    #[test]
    fn test_add_token() {
        let mut vocab = Vocabulary::new();
        vocab.add_token("hello");
        vocab.add_token("world");

        assert_eq!(vocab.size(), 4); // [UNK], [PAD], hello, world
        assert!(vocab.get_id("hello").is_some());
        assert!(vocab.get_id("world").is_some());
    }

    #[test]
    fn test_add_duplicate_token() {
        let mut vocab = Vocabulary::new();
        vocab.add_token("test");
        let id1 = vocab.get_id("test").unwrap();

        vocab.add_token("test"); // Ajouter à nouveau
        let id2 = vocab.get_id("test").unwrap();

        assert_eq!(id1, id2); // Même ID
        assert_eq!(vocab.size(), 3); // [UNK], [PAD], test
    }

    #[test]
    fn test_get_id_and_token() {
        let mut vocab = Vocabulary::new();
        vocab.add_token("test");

        let id = vocab.get_id("test").unwrap();
        let token = vocab.get_token(id).unwrap();

        assert_eq!(token, "test");
    }

    #[test]
    fn test_get_unknown_token() {
        let vocab = Vocabulary::new();
        assert!(vocab.get_id("nonexistent").is_none());
    }

    #[test]
    fn test_get_invalid_id() {
        let vocab = Vocabulary::new();
        assert!(vocab.get_token(9999).is_none());
    }

    #[test]
    fn test_save_load() {
        let mut vocab = Vocabulary::new();
        vocab.add_token("hello");
        vocab.add_token("world");

        let path = "test_vocabulary.json";
        vocab.save(path).unwrap();

        let loaded_vocab = Vocabulary::load(path).unwrap();

        assert_eq!(vocab.size(), loaded_vocab.size());
        assert_eq!(vocab.get_id("hello"), loaded_vocab.get_id("hello"));
        assert_eq!(vocab.get_id("world"), loaded_vocab.get_id("world"));

        // Nettoyer
        std::fs::remove_file(path).unwrap();
    }
}
