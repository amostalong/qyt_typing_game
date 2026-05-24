use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

/// 提交成绩
#[derive(Debug, Deserialize)]
pub struct SubmitScore {
    pub player_name: String,
    pub level_id: u32,
    pub category: String,
    pub score: u32,
    pub accuracy: u32,
    pub wpm: u32,
    pub max_combo: u32,
    pub time_seconds: u32,
}

/// 成绩记录
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct ScoreRecord {
    pub id: i64,
    pub player_name: String,
    pub level_id: i64,
    pub category: String,
    pub score: i64,
    pub accuracy: i64,
    pub wpm: i64,
    pub max_combo: i64,
    pub time_seconds: i64,
    pub created_at: NaiveDateTime,
}

/// 排行榜条目
#[derive(Debug, Serialize)]
pub struct LeaderboardEntry {
    pub rank: i64,
    pub player_name: String,
    pub score: i64,
    pub accuracy: i64,
    pub wpm: i64,
    pub level_name: String,
}

/// 排行榜查询
#[derive(Debug, Deserialize)]
pub struct TopQuery {
    pub level_id: Option<u32>,
    pub limit: Option<u32>,
}
