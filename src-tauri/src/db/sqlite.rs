use sqlx::{SqlitePool, sqlite::{SqlitePoolOptions, SqliteConnectOptions}};
use crate::models::score::{ScoreRecord, SubmitScore};
use std::path::Path;

/// 初始化数据库连接池 (自动建表)
pub async fn init_pool(db_path: &Path) -> Result<SqlitePool, sqlx::Error> {
    let opts = SqliteConnectOptions::new()
        .filename(db_path)
        .create_if_missing(true)
        .journal_mode(sqlx::sqlite::SqliteJournalMode::Wal);
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(opts)
        .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            level_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0,
            accuracy INTEGER NOT NULL DEFAULT 0,
            wpm INTEGER NOT NULL DEFAULT 0,
            max_combo INTEGER NOT NULL DEFAULT 0,
            time_seconds INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(&pool)
    .await?;

    sqlx::query(
        r#"
        CREATE INDEX IF NOT EXISTS idx_scores_level ON scores(level_id);
        CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
        "#,
    )
    .execute(&pool)
    .await?;

    Ok(pool)
}

/// 插入成绩
pub async fn insert_score(pool: &SqlitePool, data: &SubmitScore) -> Result<ScoreRecord, sqlx::Error> {
    sqlx::query_as::<_, ScoreRecord>(
        r#"
        INSERT INTO scores (player_name, level_id, category, score, accuracy, wpm, max_combo, time_seconds)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
        "#,
    )
    .bind(&data.player_name)
    .bind(data.level_id as i64)
    .bind(&data.category)
    .bind(data.score as i64)
    .bind(data.accuracy as i64)
    .bind(data.wpm as i64)
    .bind(data.max_combo as i64)
    .bind(data.time_seconds as i64)
    .fetch_one(pool)
    .await
}

/// 获取排行榜
pub async fn get_top_scores(
    pool: &SqlitePool,
    level_id: Option<u32>,
    limit: u32,
) -> Result<Vec<ScoreRecord>, sqlx::Error> {
    if let Some(lid) = level_id {
        sqlx::query_as::<_, ScoreRecord>(
            r#"
            SELECT * FROM scores
            WHERE level_id = ?
            ORDER BY score DESC, accuracy DESC, wpm DESC
            LIMIT ?
            "#,
        )
        .bind(lid as i64)
        .bind(limit as i64)
        .fetch_all(pool)
        .await
    } else {
        sqlx::query_as::<_, ScoreRecord>(
            r#"
            SELECT * FROM scores
            ORDER BY score DESC, accuracy DESC, wpm DESC
            LIMIT ?
            "#,
        )
        .bind(limit as i64)
        .fetch_all(pool)
        .await
    }
}

/// 获取玩家个人记录
pub async fn get_player_records(
    pool: &SqlitePool,
    player_name: &str,
) -> Result<Vec<ScoreRecord>, sqlx::Error> {
    sqlx::query_as::<_, ScoreRecord>(
        r#"
        SELECT * FROM scores
        WHERE player_name = ?
        ORDER BY created_at DESC
        LIMIT 50
        "#,
    )
    .bind(player_name)
    .fetch_all(pool)
    .await
}
