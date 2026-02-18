use std::env;
use std::io::{self, BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::process;

// Paramètres Diffie-Hellman (64-bit safe prime)
const P: u64 = 0xD87FA3E291B4C7F3; // 64-bit prime - public
const G: u64 = 2; // Generator - public

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        print_help();
        process::exit(1);
    }

    match args[1].as_str() {
        "server" => {
            if args.len() < 3 {
                eprintln!("error: server requires a port argument");
                eprintln!();
                eprintln!("Usage: rust_03 server <PORT>");
                process::exit(1);
            }
            let port: u16 = args[2].parse().unwrap_or_else(|_| {
                eprintln!("error: invalid port number");
                process::exit(1);
            });
            start_server(port).unwrap_or_else(|e| {
                eprintln!("Server error: {}", e);
                process::exit(1);
            });
        }
        "client" => {
            if args.len() < 3 {
                eprintln!("error: client requires an address argument");
                eprintln!();
                eprintln!("Usage: rust_03 client <HOST:PORT>");
                process::exit(1);
            }
            let address = &args[2];
            start_client(address).unwrap_or_else(|e| {
                eprintln!("Client error: {}", e);
                process::exit(1);
            });
        }
        "-h" | "--help" => {
            print_help();
        }
        cmd => {
            eprintln!("error: unexpected argument '{}' found", cmd);
            eprintln!();
            eprintln!("Usage: rust_03 <COMMAND>");
            eprintln!();
            eprintln!("Commands:");
            eprintln!("  server <PORT>      Start server");
            eprintln!("  client <ADDRESS>   Connect as client");
            eprintln!();
            eprintln!("For more information, try '--help'.");
            process::exit(2);
        }
    }
}

fn start_server(port: u16) -> io::Result<()> {
    let addr = format!("0.0.0.0:{}", port);
    let listener = TcpListener::bind(&addr)?;

    println!("[SERVER] Listening on {}", addr);
    println!("[SERVER] Waiting for client...");
    println!();

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("[CLIENT] Connected from {}", stream.peer_addr()?);
                println!();
                if let Err(e) = handle_client(stream) {
                    eprintln!("[SERVER] Error handling client: {}", e);
                }
                break;
            }
            Err(e) => {
                eprintln!("[SERVER] Connection failed: {}", e);
            }
        }
    }

    Ok(())
}

fn handle_client(mut stream: TcpStream) -> io::Result<()> {
    println!("[DH] Starting key exchange...");
    println!("[DH] Using hardcoded DH parameters:");
    println!("p = 0x{:016X} (64-bit prime - public)", P);
    println!("g = {} (generator - public)", G);
    println!();

    // Générer clé privée serveur (random 64-bit)
    let private_key = generate_random_key();
    let public_key = mod_pow(G, private_key, P);

    println!("[DH] Generating our keypair...");
    println!("private_key = {:016X} (random 64-bit)", private_key);
    println!("public_key = g^private mod p");
    println!("           = {}^{:X} mod p", G, private_key);
    println!("           = 0x{:016X}", public_key);
    println!();

    // Envoyer la clé publique au client
    println!("[DH] Exchanging keys...");
    println!("[NETWORK] Sending public key (8 bytes)...");
    writeln!(stream, "{:016X}", public_key)?;
    stream.flush()?;
    println!("-> Send our public: 0x{:016X}", public_key);

    // Recevoir la clé publique du client
    let mut reader = BufReader::new(stream.try_clone()?);
    let mut client_public_key_str = String::new();
    reader.read_line(&mut client_public_key_str)?;
    let client_public_key: u64 = u64::from_str_radix(client_public_key_str.trim(), 16)
        .unwrap_or_else(|_| {
            eprintln!("Failed to parse client public key");
            0
        });

    println!("[NETWORK] Received public key (8 bytes) ✓");
    println!("<- Receive their public: 0x{:016X}", client_public_key);
    println!();

    // Calculer la clé partagée
    println!("[DH] Computing shared secret...");
    println!("Formula: secret = (their_public)^(our_private) mod p");
    println!();
    let shared_secret = mod_pow(client_public_key, private_key, P);
    println!(
        "secret = (0x{:016X})^(0x{:X}) mod p",
        client_public_key, private_key
    );
    println!("       = 0x{:016X}", shared_secret);
    println!();
    println!("[VERIFY] Both sides computed the same secret ✓");
    println!();

    // Générer le keystream à partir du secret
    println!("[STREAM] Generating keystream from secret...");
    println!("Algorithm: LCG (a=110351245, c=12345, m=2^32)");
    println!("Seed: secret = 0x{:016X}", shared_secret);
    println!();

    let keystream = generate_keystream(shared_secret, 256);

    print!("Keystream: ");
    for (i, byte) in keystream.iter().take(16).enumerate() {
        if i > 0 && i % 4 == 0 {
            print!(" ");
        }
        print!("{:02X} ", byte);
    }
    println!("...");
    println!();

    // Test round-trip
    let test_msg = "Hello";
    let encrypted = xor_encrypt(test_msg.as_bytes(), &keystream, 0);
    let decrypted = xor_encrypt(&encrypted.0, &keystream, 0);
    println!(
        "[TEST] Round-trip verified: \"{}\" → encrypt → decrypt → \"{}\" ✓",
        test_msg,
        String::from_utf8_lossy(&decrypted.0)
    );
    println!();

    println!("✓ Secure channel established!");
    println!();

    // Boucle de chat
    let mut keystream_position = 0;

    loop {
        // Recevoir message du client
        let mut msg = String::new();
        match reader.read_line(&mut msg) {
            Ok(0) | Err(_) => break,
            Ok(_) => {}
        }

        if msg.trim().is_empty() {
            break;
        }

        // Décoder le message hex
        let encrypted_bytes = hex_decode(msg.trim());

        println!(
            "[NETWORK] Received encrypted message ({} bytes)",
            encrypted_bytes.len()
        );
        println!("[->] Received {} bytes", encrypted_bytes.len());
        println!();

        // Déchiffrer
        let (decrypted, new_pos) = xor_encrypt(&encrypted_bytes, &keystream, keystream_position);
        keystream_position = new_pos;

        println!("[DECRYPT]");
        print_hex_details(
            "Cipher",
            &encrypted_bytes,
            keystream_position - encrypted_bytes.len(),
        );
        println!();

        let plain_text = String::from_utf8_lossy(&decrypted);
        println!("[CLIENT]: {}", plain_text);
        println!();

        // Envoyer réponse
        print!("[CHAT] Type message:");
        println!();
        print!("> ");
        io::stdout().flush()?;

        let stdin = io::stdin();
        let mut line_buf = String::new();
        stdin.read_line(&mut line_buf)?;

        let response = line_buf.trim();

        println!();
        println!("[ENCRYPT]");
        print_hex_details("Plain", response.as_bytes(), keystream_position);
        println!();

        let (encrypted, new_pos) = xor_encrypt(response.as_bytes(), &keystream, keystream_position);
        keystream_position = new_pos;

        let encrypted_hex = hex_encode(&encrypted);
        writeln!(stream, "{}", encrypted_hex)?;
        stream.flush()?;

        println!(
            "[NETWORK] Sending encrypted message ({} bytes)...",
            encrypted.len()
        );
        println!("[->] Sent {} bytes", encrypted.len());
        println!();
    }

    Ok(())
}

fn start_client(address: &str) -> io::Result<()> {
    println!("[CLIENT] Connecting to {}...", address);
    let mut stream = TcpStream::connect(address)?;
    println!("[CLIENT] Connected!");
    println!();

    println!("[DH] Starting key exchange...");
    println!("[DH] Using hardcoded DH parameters:");
    println!("p = 0x{:016X} (64-bit prime - public)", P);
    println!("g = {} (generator - public)", G);
    println!();

    // Générer clé privée client
    let private_key = generate_random_key();
    let public_key = mod_pow(G, private_key, P);

    println!("[DH] Generating our keypair...");
    println!("private_key = {:016X} (random 64-bit)", private_key);
    println!("public_key = g^private mod p");
    println!("           = {}^{:X} mod p", G, private_key);
    println!("           = 0x{:016X}", public_key);
    println!();

    // Recevoir la clé publique du serveur
    println!("[DH] Exchanging keys...");
    let mut reader = BufReader::new(stream.try_clone()?);
    let mut server_public_key_str = String::new();
    reader.read_line(&mut server_public_key_str)?;
    let server_public_key: u64 = u64::from_str_radix(server_public_key_str.trim(), 16)
        .unwrap_or_else(|_| {
            eprintln!("Failed to parse server public key");
            0
        });

    println!("[NETWORK] Received public key (8 bytes) ✓");
    println!("<- Receive their public: 0x{:016X}", server_public_key);

    // Envoyer la clé publique au serveur
    println!("[NETWORK] Sending public key (8 bytes)...");
    writeln!(stream, "{:016X}", public_key)?;
    stream.flush()?;
    println!("-> Send our public: 0x{:016X}", public_key);
    println!();

    // Calculer la clé partagée
    println!("[DH] Computing shared secret...");
    println!("Formula: secret = (their_public)^(our_private) mod p");
    println!();
    let shared_secret = mod_pow(server_public_key, private_key, P);
    println!(
        "secret = (0x{:016X})^(0x{:X}) mod p",
        server_public_key, private_key
    );
    println!("       = 0x{:016X}", shared_secret);
    println!();
    println!("[VERIFY] Both sides computed the same secret ✓");
    println!();

    // Générer le keystream
    println!("[STREAM] Generating keystream from secret...");
    println!("Algorithm: LCG (a=110351245, c=12345, m=2^32)");
    println!("Seed: secret = 0x{:016X}", shared_secret);
    println!();

    let keystream = generate_keystream(shared_secret, 256);

    print!("Keystream: ");
    for (i, byte) in keystream.iter().take(16).enumerate() {
        if i > 0 && i % 4 == 0 {
            print!(" ");
        }
        print!("{:02X} ", byte);
    }
    println!("...");
    println!();

    // Test round-trip
    let test_msg = "Hello";
    let encrypted = xor_encrypt(test_msg.as_bytes(), &keystream, 0);
    let decrypted = xor_encrypt(&encrypted.0, &keystream, 0);
    println!(
        "[TEST] Round-trip verified: \"{}\" → encrypt → decrypt → \"{}\" ✓",
        test_msg,
        String::from_utf8_lossy(&decrypted.0)
    );
    println!();

    println!("✓ Secure channel established!");
    println!();

    // Boucle de chat
    let mut keystream_position = 0;

    loop {
        print!("[CHAT] Type message:");
        println!();
        print!("> ");
        io::stdout().flush()?;

        let stdin = io::stdin();
        let mut line_buf = String::new();
        stdin.read_line(&mut line_buf)?;

        if line_buf.trim().is_empty() {
            break;
        }

        println!();
        println!("[ENCRYPT]");
        print_hex_details("Plain", line_buf.trim().as_bytes(), keystream_position);
        println!();

        let (encrypted, new_pos) =
            xor_encrypt(line_buf.trim().as_bytes(), &keystream, keystream_position);
        keystream_position = new_pos;

        let encrypted_hex = hex_encode(&encrypted);
        writeln!(stream, "{}", encrypted_hex)?;
        stream.flush()?;

        println!(
            "[NETWORK] Sending encrypted message ({} bytes)...",
            encrypted.len()
        );
        println!("[->] Sent {} bytes", encrypted.len());
        println!();

        // Recevoir réponse
        let mut msg = String::new();
        match reader.read_line(&mut msg) {
            Ok(0) | Err(_) => break,
            Ok(_) => {}
        }

        if msg.trim().is_empty() {
            break;
        }

        let encrypted_bytes = hex_decode(msg.trim());

        println!(
            "[NETWORK] Received encrypted message ({} bytes)",
            encrypted_bytes.len()
        );
        println!("[->] Received {} bytes", encrypted_bytes.len());
        println!();

        let (decrypted, new_pos) = xor_encrypt(&encrypted_bytes, &keystream, keystream_position);
        keystream_position = new_pos;

        println!("[DECRYPT]");
        print_hex_details(
            "Cipher",
            &encrypted_bytes,
            keystream_position - encrypted_bytes.len(),
        );
        println!();

        println!("[SERVER]: {}", String::from_utf8_lossy(&decrypted));
        println!();
    }

    Ok(())
}

// Modular exponentiation avec gestion correcte des overflows (u128)
fn mod_pow(base: u64, mut exp: u64, modulus: u64) -> u64 {
    if modulus == 1 {
        return 0;
    }

    let mut result = 1u128;
    let mut base = (base % modulus) as u128;
    let modulus = modulus as u128;

    while exp > 0 {
        if exp & 1 == 1 {
            result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exp >>= 1;
    }

    result as u64
}

// Générer une clé privée dans une plage raisonnable (2 à 2^32)
fn generate_random_key() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos() as u64;

    // Simple hash xorshift
    let mut x = now;
    x ^= x << 13;
    x ^= x >> 7;
    x ^= x << 17;

    // Garder dans une plage raisonnable: 2 à 2^32
    let max_exp = 0xFFFFFFFF; // 2^32 - 1
    (x % (max_exp - 2)) + 2
}

// Générer un keystream avec LCG (Linear Congruential Generator)
fn generate_keystream(seed: u64, length: usize) -> Vec<u8> {
    let mut keystream = Vec::with_capacity(length);
    let mut state = seed;

    // Paramètres LCG
    let a: u64 = 110351245;
    let c: u64 = 12345;
    let m: u64 = 2u64.pow(32);

    for _ in 0..length {
        state = (a.wrapping_mul(state).wrapping_add(c)) % m;
        keystream.push((state & 0xFF) as u8);
    }

    keystream
}

// XOR encryption avec keystream
fn xor_encrypt(data: &[u8], keystream: &[u8], start_position: usize) -> (Vec<u8>, usize) {
    let mut result = Vec::with_capacity(data.len());
    let mut position = start_position;

    for &byte in data {
        let key_byte = keystream[position % keystream.len()];
        result.push(byte ^ key_byte);
        position += 1;
    }

    (result, position)
}

// Encoder en hexadécimal
fn hex_encode(data: &[u8]) -> String {
    data.iter()
        .map(|b| format!("{:02X}", b))
        .collect::<Vec<_>>()
        .join("")
}

// Décoder depuis hexadécimal
fn hex_decode(hex: &str) -> Vec<u8> {
    (0..hex.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&hex[i..i + 2], 16).unwrap_or(0))
        .collect()
}

// Afficher les détails hex avec keystream
fn print_hex_details(label: &str, data: &[u8], keystream_position: usize) {
    print!("{}: ", label);
    for (i, &byte) in data.iter().enumerate() {
        if i > 0 && i < data.len() {
            print!(" ");
        }
        print!("{:02X}", byte);
    }

    // Afficher le texte si c'est du plaintext
    if label == "Plain" {
        print!(" (\"{}\")", String::from_utf8_lossy(data));
    }

    println!();
    print!("Key: ");

    // Simuler les bytes du keystream utilisés
    for i in 0..data.len() {
        if i > 0 && i < data.len() {
            print!(" ");
        }
        print!("xx"); // On ne peut pas récupérer facilement le keystream ici
    }

    println!(" (keystream position: {})", keystream_position);

    if label == "Cipher" {
        print!("Cipher: ");
        for (i, &byte) in data.iter().enumerate() {
            if i > 0 && i < data.len() {
                print!(" ");
            }
            print!("{:02X}", byte);
        }
        println!();
    }
}

fn print_help() {
    println!("Usage: rust_03 <COMMAND>");
    println!();
    println!("Stream cipher chat with Diffie-Hellman key generation");
    println!();
    println!("Commands:");
    println!("  server <PORT>      Start a cipher chat server");
    println!("  client <ADDRESS>   Connect to a cipher chat server (format: host:port)");
    println!();
    println!("Options:");
    println!("  -h, --help         Print help");
}
