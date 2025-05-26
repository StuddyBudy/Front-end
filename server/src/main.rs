use axum::Router;
use tower_http::compression::CompressionLayer;

#[tokio::main]
async fn main() {
    // build our application with a route
    let app = Router::new()
        .fallback_service(tower_http::services::ServeDir::new("../frontend"))
        .layer(CompressionLayer::new());

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
