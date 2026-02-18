//! CLI pour le tokenizer BPE
//! Responsable: Kilian

mod bpe;
mod preprocessor;
mod tokenizer;
mod vocabulary;

use clap::{Parser, Subcommand};
use std::fs;
use std::path::Path;

use crate::bpe::BPE;
use crate::preprocessor::preprocess;
use crate::tokenizer::Tokenizer;

/// Tokenizer BPE en Rust
#[derive(Parser)]
#[command(name = "tokenizer-rs")]
#[command(about = "Un tokenizer BPE complet", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Entraîner le tokenizer sur un corpus
    Train {
        /// Chemin vers le fichier corpus
        #[arg(value_name = "FILE")]
        corpus: String,

        /// Nombre de fusions BPE
        #[arg(short, long, default_value = "100")]
        merges: usize,
    },

    /// Encoder du texte en IDs
    Encode {
        /// Texte à encoder
        text: String,
    },

    /// Décoder des IDs en texte
    Decode {
        /// IDs à décoder (séparés par des espaces)
        ids: Vec<u32>,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Train { corpus, merges } => {
            train_command(&corpus, merges);
        }
        Commands::Encode { text } => {
            encode_command(&text);
        }
        Commands::Decode { ids } => {
            decode_command(&ids);
        }
    }
}

/// Commande train : entraîne le tokenizer
fn train_command(corpus_path: &str, num_merges: usize) {
    println!("Entraînement du tokenizer");
    println!("Corpus : {}", corpus_path);
    println!("Nombre de fusions : {}", num_merges);
    println!();

    // Étape 1 : Lire le corpus
    let content =
        fs::read_to_string(corpus_path).expect("Erreur : impossible de lire le fichier corpus");

    // Étape 2 : Préprocesser chaque ligne
    println!("Preprocessing du corpus...");
    let mut all_words = Vec::new();
    for line in content.lines() {
        let words = preprocess(line);
        all_words.extend(words);
    }
    println!("{} mots après preprocessing", all_words.len());

    // Étape 3 : Entraîner BPE
    println!("Entraînement BPE...");
    let mut bpe = BPE::new();
    bpe.train(&all_words, num_merges);
    println!("{} fusions apprises", bpe.get_merges().len());

    // Étape 4 : Construire le vocabulaire
    println!("Construction du vocabulaire...");
    let bpe_tokens = bpe.encode(&all_words);
    let mut tokenizer = Tokenizer::new();
    tokenizer.build_vocabulary(&bpe_tokens);
    println!("{} tokens dans le vocabulaire", tokenizer.vocab_size());

    // Étape 5 : Sauvegarder les modèles
    println!("Sauvegarde des modèles...");
    bpe.save("bpe_model.json")
        .expect("Erreur lors de la sauvegarde du BPE");
    tokenizer
        .vocabulary
        .save("vocabulary.json")
        .expect("Erreur lors de la sauvegarde du vocabulaire");

    println!();
    println!("Entraînement terminé !");
    println!("   - bpe_model.json");
    println!("   - vocabulary.json");
}

/// Commande encode : encode du texte
fn encode_command(text: &str) {
    println!("Encodage du texte : \"{}\"", text);
    println!();

    // Vérifier que les modèles existent
    if !Path::new("bpe_model.json").exists() || !Path::new("vocabulary.json").exists() {
        println!("Erreur : modèles non trouvés !");
        println!("   Lancez d'abord : cargo run -- train data/corpus.txt");
        return;
    }

    // Charger les modèles
    println!("Chargement des modèles...");
    let bpe = BPE::load("bpe_model.json").expect("Erreur lors du chargement du BPE");
    let mut tokenizer = Tokenizer::new();
    tokenizer.vocabulary = vocabulary::Vocabulary::load("vocabulary.json")
        .expect("Erreur lors du chargement du vocabulaire");

    // Préprocesser
    let words = preprocess(text);
    println!("Après preprocessing : {} mots → {:?}", words.len(), words);

    // Appliquer BPE
    let bpe_tokens = bpe.encode(&words);
    println!("Après BPE : {} tokens → {:?}", bpe_tokens.len(), bpe_tokens);

    // Calculer le taux de compression
    let compression_rate = if !words.is_empty() {
        ((words.len() as f32 - bpe_tokens.len() as f32) / words.len() as f32) * 100.0
    } else {
        0.0
    };
    
    if compression_rate > 0.0 {
        println!("Compression : {:.1}%", compression_rate);
    } else {
        println!("Expansion : {:.1}% (mots rares décomposés)", compression_rate.abs());
    }

    // Encoder en IDs
    let ids = tokenizer.encode(&bpe_tokens);
    println!();
    println!("IDs encodés : {:?}", ids);
}


/// Commande decode : décode des IDs
fn decode_command(ids: &[u32]) {
    println!("Décodage des IDs : {:?}", ids);
    println!();

    // Vérifier que le vocabulaire existe
    if !Path::new("vocabulary.json").exists() {
        println!("Erreur : vocabulary.json non trouvé !");
        println!("   Lancez d'abord : cargo run -- train data/corpus.txt");
        return;
    }

    // Charger le vocabulaire
    println!("Chargement du vocabulaire...");
    let mut tokenizer = Tokenizer::new();
    tokenizer.vocabulary = vocabulary::Vocabulary::load("vocabulary.json")
        .expect("Erreur lors du chargement du vocabulaire");

    // Décoder
    let tokens = tokenizer.decode(ids);
    println!("Tokens décodés : {:?}", tokens);
    println!();
    println!("Texte : {}", tokens.join(" "));
}
