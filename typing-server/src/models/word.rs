use serde::{Deserialize, Serialize};

/// 词条
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WordItem {
    pub text: String,
    pub display: String,
}

/// 难度等级
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Level {
    pub id: u32,
    pub name: String,
    pub description: String,
    pub category: String,       // "english" | "pinyin"
    pub age_range: String,      // "6-7岁"
    pub icon: String,
    pub speed: f64,
    pub spawn_interval: u64,    // ms
    pub lives_count: u32,
    pub target_score: u32,
    pub time_limit: u32,        // seconds, 0 = unlimited
    pub words: Vec<WordItem>,
}

/// 词库请求参数
#[derive(Debug, Deserialize)]
pub struct WordsQuery {
    pub level: Option<u32>,
    pub category: Option<String>,
}
