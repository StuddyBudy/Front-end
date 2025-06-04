use axum::{
    Router,
    extract::Request,
    http::header,
    middleware::{self, Next},
};
use tower_http::compression::CompressionLayer;
use tower_livereload::LiveReloadLayer;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    #[cfg(feature = "clerk")]
    let config = clerk_rs::ClerkConfiguration::new(None, None, None, None);
    #[cfg(feature = "clerk")]
    let clerk = clerk_rs::Clerk::new(config);

    let app = Router::new()
        .fallback_service(tower_http::services::ServeDir::new("./frontend"))
        .layer(LiveReloadLayer::new().reload_interval(std::time::Duration::from_millis(50)))
        .layer(middleware::from_fn(|req: Request, next: Next| async move {
            let mut res = next.run(req).await;
            res.headers_mut().remove(header::CACHE_CONTROL);

            res
        }))
        .layer(CompressionLayer::new());

    #[cfg(feature = "clerk")]
    let app = app.layer(clerk_rs::validators::axum::ClerkLayer::new(
        clerk_rs::jwks::MemoryCacheJwksProvider::new(clerk),
        None,
        true,
    ));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}
