//! Module de l'algorithme BPE (Byte Pair Encoding)
//! Responsable: Kilian
//!
//! Ce module implémente l'algorithme BPE qui apprend un vocabulaire
//! de sous-mots en fusionnant itérativement les paires les plus fréquentes.

#![allow(clippy::upper_case_acronyms)]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Structure principale pour l'algorithme BPE
#[derive(Serialize, Deserialize, Debug)]
pub struct BPE {
    /// Liste ordonnée des fusions (token1, token2) apprises durant l'entraînement
    /// L'ordre est important car il reflète la priorité des fusions
    merges: Vec<(String, String)>,

    /// Vocabulaire final : ensemble unique de tous les tokens possibles
    /// Utilisé pour validation et statistiques
    vocab: Vec<String>,
}

impl BPE {
    /// Crée une nouvelle instance BPE vide
    ///
    /// # Exemple
    /// ```
    /// let bpe = BPE::new();
    /// ```
    pub fn new() -> Self {
        Self {
            merges: Vec::new(),
            vocab: Vec::new(),
        }
    }

    /// Entraîne le modèle BPE sur un corpus
    ///
    /// # Arguments
    /// * `corpus` - Liste de mots préprocessés (déjà nettoyés par preprocessor.rs)
    /// * `num_merges` - Nombre de fusions à effectuer (taille du vocabulaire)
    ///
    /// # Exemple
    /// ```
    /// let mut bpe = BPE::new();
    /// let corpus = vec!["chat".to_string(), "chien".to_string()];
    /// bpe.train(&corpus, 10);
    /// ```
    pub fn train(&mut self, corpus: &[String], num_merges: usize) {
        println!("Début de l'entraînement BPE avec {} fusions", num_merges);

        // Étape 1: Découper chaque mot en caractères individuels
        let mut words = self.split_into_chars(corpus);

        println!(
            "Corpus initial: {} mots, {} tokens totaux",
            words.len(),
            words.iter().map(|w| w.len()).sum::<usize>()
        );

        // Étape 2: Boucle d'apprentissage - effectuer num_merges fusions
        for i in 0..num_merges {
            // Compter toutes les paires adjacentes dans le corpus actuel
            let pair_counts = self.count_pairs(&words);

            if pair_counts.is_empty() {
                println!("Plus de paires à fusionner après {} itérations", i);
                break;
            }

            // Trouver la paire la plus fréquente
            if let Some((best_pair, count)) = self.get_most_frequent_pair(&pair_counts) {
                println!(
                    "Fusion #{}: ({}, {}) → {} occurrences",
                    i + 1,
                    best_pair.0,
                    best_pair.1,
                    count
                );

                // Fusionner cette paire dans tout le corpus
                words = self.merge_pair(&words, &best_pair);

                // Sauvegarder cette fusion
                self.merges.push(best_pair);
            } else {
                break;
            }
        }

        // Étape 3: Construire le vocabulaire final
        self.build_vocab(&words);

        println!(
            "Entraînement terminé: {} fusions, {} tokens uniques",
            self.merges.len(),
            self.vocab.len()
        );
    }

    /// Découpe le corpus en caractères individuels
    ///
    /// # Arguments
    /// * `corpus` - Liste de mots
    ///
    /// # Retourne
    /// Un Vec de Vec<String> où chaque mot est représenté comme une liste de caractères
    ///
    /// # Exemple
    /// ```
    /// ["chat"] → [["c", "h", "a", "t"]]
    /// ```
    fn split_into_chars(&self, corpus: &[String]) -> Vec<Vec<String>> {
        corpus
            .iter()
            .map(|word| word.chars().map(|c| c.to_string()).collect())
            .collect()
    }

    /// Compte toutes les paires adjacentes de tokens dans le corpus
    ///
    /// # Arguments
    /// * `words` - Corpus tokenisé
    ///
    /// # Retourne
    /// HashMap avec (token1, token2) → nombre d'occurrences
    fn count_pairs(&self, words: &[Vec<String>]) -> HashMap<(String, String), usize> {
        let mut pairs = HashMap::new();

        // Parcourir chaque mot
        for word in words {
            // Parcourir les paires adjacentes dans ce mot
            for i in 0..word.len().saturating_sub(1) {
                let pair = (word[i].clone(), word[i + 1].clone());
                *pairs.entry(pair).or_insert(0) += 1;
            }
        }

        pairs
    }

    /// Trouve la paire la plus fréquente
    ///
    /// # Arguments
    /// * `pair_counts` - HashMap des paires et leurs fréquences
    ///
    /// # Retourne
    /// Option contenant la paire la plus fréquente et son compte
    fn get_most_frequent_pair(
        &self,
        pair_counts: &HashMap<(String, String), usize>,
    ) -> Option<((String, String), usize)> {
        pair_counts
            .iter()
            .max_by_key(|(_, count)| *count)
            .map(|(pair, &count)| (pair.clone(), count))
    }

    /// Fusionne une paire spécifique dans tout le corpus
    ///
    /// # Arguments
    /// * `words` - Corpus tokenisé
    /// * `pair` - Paire à fusionner
    ///
    /// # Retourne
    /// Nouveau corpus avec toutes les occurrences de la paire fusionnées
    ///
    /// # Exemple
    /// ```
    /// [["c", "h", "a", "t"]] + fusion ("c", "h")
    /// → [["ch", "a", "t"]]
    /// ```
    fn merge_pair(&self, words: &[Vec<String>], pair: &(String, String)) -> Vec<Vec<String>> {
        words
            .iter()
            .map(|word| {
                let mut new_word = Vec::new();
                let mut i = 0;

                while i < word.len() {
                    // Si on trouve la paire à fusionner
                    if i < word.len() - 1 && word[i] == pair.0 && word[i + 1] == pair.1 {
                        // Fusionner les deux tokens
                        new_word.push(format!("{}{}", pair.0, pair.1));
                        i += 2; // Sauter les deux tokens fusionnés
                    } else {
                        // Garder le token tel quel
                        new_word.push(word[i].clone());
                        i += 1;
                    }
                }

                new_word
            })
            .collect()
    }

    /// Construit le vocabulaire final à partir des tokens du corpus
    ///
    /// # Arguments
    /// * `words` - Corpus tokenisé final
    fn build_vocab(&mut self, words: &[Vec<String>]) {
        use std::collections::HashSet;

        let mut unique_tokens = HashSet::new();

        // Collecter tous les tokens uniques
        for word in words {
            for token in word {
                unique_tokens.insert(token.clone());
            }
        }

        // Convertir en Vec et trier pour cohérence
        self.vocab = unique_tokens.into_iter().collect();
        self.vocab.sort();
    }

    /// Encode un nouveau texte en appliquant les fusions apprises
    ///
    /// # Arguments
    /// * `words` - Mots préprocessés à encoder
    ///
    /// # Retourne
    /// Vec de tokens après application de toutes les fusions
    ///
    /// # Exemple
    /// ```
    /// let tokens = bpe.encode(&["chat".to_string()]);
    /// // Retourne par exemple: ["ch", "at"]
    /// ```
    pub fn encode(&self, words: &[String]) -> Vec<String> {
        // Découper en caractères
        let mut tokenized_words = self.split_into_chars(words);

        // Appliquer toutes les fusions dans l'ordre
        for merge in &self.merges {
            tokenized_words = self.merge_pair(&tokenized_words, merge);
        }

        // Aplatir en une seule liste de tokens
        tokenized_words.into_iter().flatten().collect()
    }

    /// Retourne la liste des fusions apprises
    pub fn get_merges(&self) -> &Vec<(String, String)> {
        &self.merges
    }

    /// Sauvegarde le modèle BPE dans un fichier JSON
    ///
    /// # Arguments
    /// * `path` - Chemin du fichier de sauvegarde
    pub fn save(&self, path: &str) -> Result<(), std::io::Error> {
        use std::fs::File;
        use std::io::Write;

        let json = serde_json::to_string_pretty(self).map_err(std::io::Error::other)?;

        let mut file = File::create(path)?;
        file.write_all(json.as_bytes())?;

        println!("Modèle BPE sauvegardé dans {}", path);
        Ok(())
    }

    /// Charge un modèle BPE depuis un fichier JSON
    ///
    /// # Arguments
    /// * `path` - Chemin du fichier à charger
    pub fn load(path: &str) -> Result<Self, std::io::Error> {
        use std::fs::File;
        use std::io::Read;

        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;

        let bpe: BPE = serde_json::from_str(&contents).map_err(std::io::Error::other)?;

        println!("Modèle BPE chargé depuis {}", path);
        Ok(bpe)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bpe_new() {
        let bpe = BPE::new();
        assert_eq!(bpe.merges.len(), 0);
        assert_eq!(bpe.vocab.len(), 0);
    }

    #[test]
    fn test_split_into_chars() {
        let bpe = BPE::new();
        let corpus = vec!["chat".to_string(), "chien".to_string()];
        let chars = bpe.split_into_chars(&corpus);

        assert_eq!(chars.len(), 2);
        assert_eq!(chars[0], vec!["c", "h", "a", "t"]);
        assert_eq!(chars[1], vec!["c", "h", "i", "e", "n"]);
    }

    #[test]
    fn test_count_pairs() {
        let bpe = BPE::new();
        let words = vec![
            vec![
                "c".to_string(),
                "h".to_string(),
                "a".to_string(),
                "t".to_string(),
            ],
            vec![
                "c".to_string(),
                "h".to_string(),
                "i".to_string(),
                "e".to_string(),
                "n".to_string(),
            ],
        ];

        let pairs = bpe.count_pairs(&words);

        // La paire ("c", "h") apparaît 2 fois
        assert_eq!(pairs.get(&("c".to_string(), "h".to_string())), Some(&2));
    }

    #[test]
    fn test_merge_pair() {
        let bpe = BPE::new();
        let words = vec![vec![
            "c".to_string(),
            "h".to_string(),
            "a".to_string(),
            "t".to_string(),
        ]];

        let merged = bpe.merge_pair(&words, &("c".to_string(), "h".to_string()));

        assert_eq!(merged[0], vec!["ch", "a", "t"]);
    }

    #[test]
    fn test_train_simple() {
        let mut bpe = BPE::new();
        let corpus = vec![
            "chat".to_string(),
            "chien".to_string(),
            "chaton".to_string(),
        ];

        bpe.train(&corpus, 5);

        // Vérifier qu'on a bien appris des fusions
        assert!(bpe.merges.len() > 0);
        assert!(bpe.vocab.len() > 0);

        // La paire "ch" devrait être fusionnée en premier (la plus fréquente)
        assert_eq!(bpe.merges[0], ("c".to_string(), "h".to_string()));
    }

    #[test]
    fn test_encode() {
        let mut bpe = BPE::new();
        let corpus = vec!["chat".to_string(), "chien".to_string()];

        bpe.train(&corpus, 3);

        let encoded = bpe.encode(&["chat".to_string()]);

        // Après entraînement, "chat" devrait être encodé avec moins de 4 tokens
        assert!(encoded.len() <= 4);
    }

    #[test]
    fn test_save_load() {
        let mut bpe = BPE::new();
        let corpus = vec!["test".to_string()];
        bpe.train(&corpus, 2);

        // Sauvegarder
        let path = "test_bpe.json";
        bpe.save(path).unwrap();

        // Charger
        let loaded_bpe = BPE::load(path).unwrap();

        assert_eq!(bpe.merges, loaded_bpe.merges);
        assert_eq!(bpe.vocab, loaded_bpe.vocab);

        // Nettoyer
        std::fs::remove_file(path).unwrap();
    }
}
