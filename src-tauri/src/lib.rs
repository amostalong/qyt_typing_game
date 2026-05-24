mod db;
mod models;

use tauri::Manager;
use sqlx::SqlitePool;

/// 应用状态: 数据库连接池 (SqlitePool 本身是 Send+Sync)
struct AppState {
    db: SqlitePool,
}

// ====== Tauri 命令 ======

/// 提交成绩
#[tauri::command]
async fn submit_score(
    state: tauri::State<'_, AppState>,
    data: models::score::SubmitScoreArgs,
) -> Result<models::score::ScoreRecord, String> {
    let input: models::score::SubmitScore = data.into();
    db::insert_score(&state.db, &input)
        .await
        .map_err(|e| e.to_string())
}

/// 查询排行榜
#[tauri::command]
async fn get_top_scores(
    state: tauri::State<'_, AppState>,
    level_id: Option<u32>,
    limit: Option<u32>,
) -> Result<Vec<models::score::LeaderboardEntry>, String> {
    let limit = limit.unwrap_or(20);
    let records = db::get_top_scores(&state.db, level_id, limit)
        .await
        .map_err(|e| e.to_string())?;

    let entries: Vec<models::score::LeaderboardEntry> = records
        .iter()
        .enumerate()
        .map(|(i, r)| models::score::LeaderboardEntry {
            rank: i as i64 + 1,
            player_name: r.player_name.clone(),
            score: r.score,
            accuracy: r.accuracy,
            wpm: r.wpm,
        })
        .collect();

    Ok(entries)
}

/// 查询玩家个人记录
#[tauri::command]
async fn get_player_records(
    state: tauri::State<'_, AppState>,
    player_name: String,
) -> Result<Vec<models::score::ScoreRecord>, String> {
    db::get_player_records(&state.db, &player_name)
        .await
        .map_err(|e| e.to_string())
}

/// 健康检查
#[tauri::command]
async fn health() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "status": "ok",
        "service": "typing-kids-tauri",
        "version": "1.0.0"
    }))
}

// ====== 启动入口 ======

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // 数据库放在应用数据目录下
            let app_dir = app.path().app_data_dir().expect("无法获取应用数据目录");
            std::fs::create_dir_all(&app_dir).expect("无法创建应用数据目录");
            let db_path = app_dir.join("typing_kids.db");
            println!("📁 数据库路径: {}", db_path.display());

            let pool = tauri::async_runtime::block_on(async {
                db::init_pool(&db_path).await
            })
            .expect("数据库初始化失败");

            app.manage(AppState { db: pool });

            println!("✅ 数据库就绪");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            submit_score,
            get_top_scores,
            get_player_records,
            health,
        ])
        .run(tauri::generate_context!())
        .expect("启动失败");
}
