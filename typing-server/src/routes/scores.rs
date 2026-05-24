use axum::{extract::{Query, State}, Json};
use serde_json::json;
use sqlx::SqlitePool;

use crate::models::score::{SubmitScore, TopQuery};
use crate::db;

/// POST /api/scores
pub async fn submit_score(
    State(pool): State<SqlitePool>,
    Json(data): Json<SubmitScore>,
) -> Json<serde_json::Value> {
    match db::insert_score(&pool, &data).await {
        Ok(record) => Json(json!({
            "success": true,
            "data": record,
        })),
        Err(e) => Json(json!({
            "success": false,
            "error": e.to_string(),
        })),
    }
}

/// GET /api/scores/top?level_id=1&limit=10
pub async fn get_top_scores(
    State(pool): State<SqlitePool>,
    Query(q): Query<TopQuery>,
) -> Json<serde_json::Value> {
    let limit = q.limit.unwrap_or(20);
    match db::get_top_scores(&pool, q.level_id, limit).await {
        Ok(records) => {
            let ranked: Vec<_> = records
                .iter()
                .enumerate()
                .map(|(i, r)| json!({
                    "rank": i as i64 + 1,
                    "player_name": r.player_name,
                    "score": r.score,
                    "accuracy": r.accuracy,
                    "wpm": r.wpm,
                }))
                .collect();
            Json(json!({ "success": true, "data": ranked }))
        }
        Err(e) => Json(json!({
            "success": false,
            "error": e.to_string(),
        })),
    }
}

/// GET /api/scores/player/:name
pub async fn get_player_scores(
    State(pool): State<SqlitePool>,
    axum::extract::Path(name): axum::extract::Path<String>,
) -> Json<serde_json::Value> {
    match db::get_player_records(&pool, &name).await {
        Ok(records) => Json(json!({
            "success": true,
            "data": records,
        })),
        Err(e) => Json(json!({
            "success": false,
            "error": e.to_string(),
        })),
    }
}

/// GET /api/health
pub async fn health() -> Json<serde_json::Value> {
    Json(json!({
        "status": "ok",
        "service": "typing-kids-server",
        "version": "1.0.0",
    }))
}
