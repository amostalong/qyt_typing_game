mod db;
mod models;
mod routes;

use axum::{
    routing::{get, post},
    Router,
};
use sqlx::SqlitePool;
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[tokio::main]
async fn main() {
    // 初始化日志
    tracing_subscriber::fmt::init();

    // 初始化数据库
    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:typing_kids.db".to_string());
    let pool: SqlitePool = db::init_pool(&db_url)
        .await
        .expect("数据库初始化失败");

    println!("🚀 打字练习服务器启动在 http://127.0.0.1:8080");
    println!("📋 API 列表:");
    println!("   GET  /api/health           - 健康检查");
    println!("   GET  /api/words            - 获取词库");
    println!("   POST /api/scores           - 提交成绩");
    println!("   GET  /api/scores/top       - 排行榜");
    println!("   GET  /api/scores/player/:name - 个人记录");

    // CORS 配置
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // 路由
    let app = Router::new()
        // 词库
        .route("/api/words", get(routes::words::get_words))
        // 成绩
        .route("/api/scores", post(routes::scores::submit_score))
        .route("/api/scores/top", get(routes::scores::get_top_scores))
        .route("/api/scores/player/:name", get(routes::scores::get_player_scores))
        // 健康检查
        .route("/api/health", get(routes::scores::health))
        .layer(cors)
        .with_state(pool);

    // 启动服务
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
