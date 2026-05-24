use axum::{extract::Query, Json};
use serde_json::json;
use crate::models::word::WordsQuery;

/// GET /api/words?level=1&category=english
///
/// 返回词库数据。这里直接使用内嵌的静态词库。
/// 生产环境可以改为从数据库读取。
pub async fn get_words(Query(q): Query<WordsQuery>) -> Json<serde_json::Value> {
    // 静态词库 - 和前端保持一致
    let words_data = build_words_data();

    match (q.level, q.category) {
        (Some(level), _) => {
            let level_data = words_data.iter().find(|l| l["id"] == level);
            Json(json!({
                "success": true,
                "data": level_data
            }))
        }
        (_, Some(category)) => {
            let filtered: Vec<_> = words_data
                .iter()
                .filter(|l| l["category"] == category)
                .collect();
            Json(json!({
                "success": true,
                "data": filtered
            }))
        }
        _ => {
            Json(json!({
                "success": true,
                "data": words_data
            }))
        }
    }
}

/// 构建静态词库数据
fn build_words_data() -> Vec<serde_json::Value> {
    vec![
        // 英文 L1
        level_json(1, "字母小星星", "一个个字母就像小星星", "english", "6-7岁", "⭐",
            0.3, 2500, 10, 100, 0,
            &letters('a'..='z')),
        // 英文 L2
        level_json(2, "大小写大冒险", "大小写字母都要认识", "english", "7-8岁", "🔤",
            0.5, 2200, 8, 150, 0,
            &mixed_letters()),
        // 英文 L3
        level_json(3, "单词小达人", "简单的英文单词", "english", "8-9岁", "🌿",
            0.5, 3000, 8, 200, 0,
            &simple_word_list()),
        // 英文 L4
        level_json(4, "词汇小高手", "常用的英文单词", "english", "9-11岁", "🌳",
            0.6, 3500, 6, 300, 0,
            &common_word_list()),
        // 英文 L5
        level_json(5, "拼词大挑战", "更长的英文单词", "english", "11-13岁", "🔥",
            0.7, 4000, 5, 400, 120,
            &advanced_word_list()),
        // 英文 L6
        level_json(6, "句子小作家", "完整的英文句子", "english", "13-16岁", "📝",
            0.6, 6000, 5, 500, 180,
            &english_sentence_list()),
        // 拼音 L1
        level_json(11, "声母小火车", "拼音声母练习", "pinyin", "6-7岁", "🚂",
            0.3, 2500, 10, 100, 0,
            &pinyin_initials()),
        // 拼音 L2
        level_json(12, "韵母小乐园", "拼音韵母练习", "pinyin", "7-8岁", "🎵",
            0.4, 2500, 10, 150, 0,
            &pinyin_finals()),
        // 拼音 L3
        level_json(13, "拼音小勇士", "完整拼音音节", "pinyin", "8-9岁", "🦸",
            0.5, 3000, 8, 200, 0,
            &pinyin_syllable_list()),
        // 拼音 L4
        level_json(14, "词语小博士", "拼音词语练习", "pinyin", "9-11岁", "📚",
            0.6, 4000, 6, 300, 0,
            &pinyin_word_list()),
        // 拼音 L5
        level_json(15, "句子小诗人", "拼音短句练习", "pinyin", "11-13岁", "✍️",
            0.6, 6000, 5, 400, 180,
            &pinyin_sentence_list()),
        // 拼音 L6
        level_json(16, "拼音总冠军", "拼音段落挑战", "pinyin", "13-16岁", "👑",
            0.55, 8000, 5, 500, 300,
            &pinyin_paragraph_list()),
    ]
}

fn level_json(
    id: u32, name: &str, desc: &str, category: &str,
    age: &str, icon: &str,
    speed: f64, interval: u64, lives: u32, target: u32, time_limit: u32,
    words: &[(&str, &str)],
) -> serde_json::Value {
    json!({
        "id": id,
        "name": name,
        "description": desc,
        "category": category,
        "ageRange": age,
        "icon": icon,
        "speed": speed,
        "spawnInterval": interval,
        "livesCount": lives,
        "targetScore": target,
        "timeLimit": time_limit,
        "words": words.iter().map(|(t, d)| json!({"text": t, "display": d})).collect::<Vec<_>>(),
    })
}

fn letters(range: std::ops::RangeInclusive<char>) -> Vec<(&'static str, &'static str)> {
    range.map(|c| {
        let s: &'static str = Box::leak(c.to_string().into_boxed_str());
        (s, s)
    }).collect()
}

fn mixed_letters() -> Vec<(&'static str, &'static str)> {
    let mut v = vec![];
    for c in 'a'..='z' { let s: &'static str = Box::leak(c.to_string().into_boxed_str()); v.push((s, s)); }
    for c in 'A'..='Z' { let s: &'static str = Box::leak(c.to_string().into_boxed_str()); v.push((s, s)); }
    v
}

fn simple_word_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("cat","cat"),("dog","dog"),("sun","sun"),("run","run"),("big","big"),
        ("red","red"),("hat","hat"),("cup","cup"),("bed","bed"),("box","box"),
        ("pen","pen"),("map","map"),("bus","bus"),("egg","egg"),("ant","ant"),
        ("owl","owl"),("fox","fox"),("pig","pig"),("cow","cow"),("hen","hen"),
        ("bat","bat"),("fly","fly"),("joy","joy"),("sky","sky"),("top","top"),
        ("fun","fun"),("hot","hot"),("wet","wet"),("sad","sad"),("win","win"),
    ]
}

fn common_word_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("apple","apple"),("house","house"),("happy","happy"),("green","green"),
        ("water","water"),("light","light"),("tiger","tiger"),("smile","smile"),
        ("bread","bread"),("cloud","cloud"),("dance","dance"),("earth","earth"),
        ("fruit","fruit"),("grass","grass"),("heart","heart"),("juice","juice"),
        ("kitty","kitty"),("lemon","lemon"),("music","music"),("night","night"),
        ("ocean","ocean"),("piano","piano"),("queen","queen"),("river","river"),
        ("stone","stone"),("table","table"),("uncle","uncle"),("voice","voice"),
        ("watch","watch"),("young","young"),("zebra","zebra"),("dream","dream"),
    ]
}

fn advanced_word_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("beautiful","beautiful"),("elephant","elephant"),("computer","computer"),
        ("mountain","mountain"),("birthday","birthday"),("champion","champion"),
        ("dinosaur","dinosaur"),("engineer","engineer"),("football","football"),
        ("gorgeous","gorgeous"),("homework","homework"),("internet","internet"),
        ("jellyfish","jellyfish"),("kingdom","kingdom"),("language","language"),
        ("mushroom","mushroom"),("necklace","necklace"),("opposite","opposite"),
        ("penguin","penguin"),("question","question"),("rainbow","rainbow"),
        ("sandwich","sandwich"),("tomorrow","tomorrow"),("umbrella","umbrella"),
        ("vacation","vacation"),("wonderful","wonderful"),("xylophone","xylophone"),
        ("yesterday","yesterday"),("adventure","adventure"),("butterfly","butterfly"),
    ]
}

fn english_sentence_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("I like to play outside.","I like to play outside."),
        ("The cat is sleeping.","The cat is sleeping."),
        ("She has a red apple.","She has a red apple."),
        ("We go to school every day.","We go to school every day."),
        ("He can run very fast.","He can run very fast."),
        ("The sun is bright today.","The sun is bright today."),
        ("My dog likes to jump.","My dog likes to jump."),
        ("They are good friends.","They are good friends."),
        ("I want to learn more.","I want to learn more."),
        ("Let us have some fun!","Let us have some fun!"),
    ]
}

fn pinyin_initials() -> Vec<(&'static str, &'static str)> {
    vec![
        ("b","b"),("p","p"),("m","m"),("f","f"),("d","d"),("t","t"),
        ("n","n"),("l","l"),("g","g"),("k","k"),("h","h"),
        ("j","j"),("q","q"),("x","x"),
        ("zh","zh"),("ch","ch"),("sh","sh"),("r","r"),
        ("z","z"),("c","c"),("s","s"),("y","y"),("w","w"),
    ]
}

fn pinyin_finals() -> Vec<(&'static str, &'static str)> {
    vec![
        ("a","a (啊)"),("o","o (哦)"),("e","e (鹅)"),
        ("i","i (衣)"),("u","u (乌)"),("ü","ü (鱼)"),
        ("ai","ai (爱)"),("ei","ei (诶)"),("ui","ui (威)"),
        ("ao","ao (奥)"),("ou","ou (欧)"),("iu","iu (优)"),
        ("ie","ie (耶)"),("üe","üe (约)"),("er","er (儿)"),
        ("an","an (安)"),("en","en (恩)"),("in","in (因)"),
        ("un","un (温)"),("ün","ün (晕)"),
        ("ang","ang (昂)"),("eng","eng (鞥)"),
        ("ing","ing (英)"),("ong","ong (轰)"),
    ]
}

fn pinyin_syllable_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("ba","ba (八)"),("pa","pa (爬)"),("ma","ma (妈)"),("fa","fa (发)"),
        ("da","da (大)"),("ta","ta (他)"),("na","na (拿)"),("la","la (拉)"),
        ("ga","ga (嘎)"),("ka","ka (卡)"),("ha","ha (哈)"),
        ("ji","ji (鸡)"),("qi","qi (七)"),("xi","xi (西)"),
        ("zhi","zhi (知)"),("chi","chi (吃)"),("shi","shi (师)"),("ri","ri (日)"),
        ("zi","zi (字)"),("ci","ci (词)"),("si","si (四)"),
        ("bo","bo (波)"),("po","po (泼)"),("mo","mo (摸)"),("fo","fo (佛)"),
        ("de","de (的)"),("te","te (特)"),("ne","ne (呢)"),("le","le (了)"),
        ("ge","ge (哥)"),("ke","ke (科)"),("he","he (喝)"),
        ("gu","gu (姑)"),("ku","ku (哭)"),("hu","hu (呼)"),
        ("zhu","zhu (猪)"),("chu","chu (出)"),("shu","shu (书)"),("ru","ru (如)"),
        ("zu","zu (组)"),("cu","cu (粗)"),("su","su (苏)"),
        ("ju","ju (句)"),("qu","qu (去)"),("xu","xu (需)"),
        ("nü","nü (女)"),("lü","lü (绿)"),
    ]
}

fn pinyin_word_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("mama","māma (妈妈)"),("baba","bàba (爸爸)"),
        ("xuexiao","xuéxiào (学校)"),("laoshi","lǎoshī (老师)"),
        ("pengyou","péngyǒu (朋友)"),("dongwu","dòngwù (动物)"),
        ("shuiguo","shuǐguǒ (水果)"),("taiyang","tàiyáng (太阳)"),
        ("yueliang","yuèliàng (月亮)"),("xingxing","xīngxīng (星星)"),
        ("kuaile","kuàilè (快乐)"),("meili","měilì (美丽)"),
        ("yonggan","yǒnggǎn (勇敢)"),("congming","cōngmíng (聪明)"),
        ("zhongguo","zhōngguó (中国)"),("shijie","shìjiè (世界)"),
        ("kexue","kēxué (科学)"),("yinyue","yīnyuè (音乐)"),
        ("tushu","túshū (图书)"),("yundong","yùndòng (运动)"),
    ]
}

fn pinyin_sentence_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("wo ai xue xi","wǒ ài xué xí (我爱学习)"),
        ("jin tian tian qi zhen hao","jīn tiān tiān qì zhēn hǎo (今天天气真好)"),
        ("wo men qu gong yuan wan","wǒ men qù gōng yuán wán (我们去公园玩)"),
        ("xiao mao zai shui jiao","xiǎo māo zài shuì jiào (小猫在睡觉)"),
        ("ta shi wo zui hao de peng you","tā shì wǒ zuì hǎo de péng yǒu (他是我最好的朋友)"),
        ("wo xi huan kan shu he hua hua","wǒ xǐ huān kàn shū hé huà huà (我喜欢看书和画画)"),
        ("ma ma zuo le hao chi de dan gao","mā ma zuò le hǎo chī de dàn gāo (妈妈做了好吃的蛋糕)"),
        ("yong gan de xiao peng you bu ku","yǒng gǎn de xiǎo péng yǒu bù kū (勇敢的小朋友不哭)"),
    ]
}

fn pinyin_paragraph_list() -> Vec<(&'static str, &'static str)> {
    vec![
        ("chun tian lai le hua er kai le xiao niao zai shu shang chang ge", "春天来了，花儿开了，小鸟在树上唱歌"),
        ("wo you yi ge meng xiang zhang da yi hou yao dang yi ming ke xue jia", "我有一个梦想，长大以后要当一名科学家"),
        ("du shu shi yi jian hen you qu de shi qing neng rang wo men xue dao hen duo zhi shi", "读书是一件很有趣的事情，能让我们学到很多知识"),
        ("mei tian jian chi duan lian shen ti cai neng jian jian kang kang de cheng zhang", "每天坚持锻炼，身体才能健健康康地成长"),
    ]
}
