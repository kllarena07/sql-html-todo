use actix_web::{App, HttpServer, Responder, web};
use actix_files as fs;
use std::path::PathBuf;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 8080;
    println!("Server started on port {}", port);

    HttpServer::new(|| {
        App::new()
            .service(fs::Files::new("/", "./src")
                .index_file("index.html")
                .show_files_listing())
    })
    .bind(("127.0.0.1", port))?
    .workers(2)
    .run()
    .await
}