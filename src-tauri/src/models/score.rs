use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

/// 提交成绩参数 (前端传来)
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmitScoreArgs {
    pub player_name: String,
    pub level_id: u32,
    pub category: String,
    pub score: u32,
    pub accuracy: u32,
    pub wpm: u32,
    pub max_combo: u32,
    pub time_seconds: u32,
}

/// 提交成绩 (数据库层用)
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

impl From<SubmitScoreArgs> for SubmitScore {
    fn from(a: SubmitScoreArgs) -> Self {
        Self {
            player_name: a.player_name,
            level_id: a.level_id,
            category: a.category,
            score: a.score,
            accuracy: a.accuracy,
            wpm: a.wpm,
            max_combo: a.max_combo,
            time_seconds: a.time_seconds,
        }
    }
}

/// 成绩记录
#[derive(Debug, Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
pub struct LeaderboardEntry {
    pub rank: i64,
    pub player_name: String,
    pub score: i64,
    pub accuracy: i64,
    pub wpm: i64,
}
