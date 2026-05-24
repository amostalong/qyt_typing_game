import type { WordItem, Level } from '../types'

// ====== 词库 ======

// --- 英文词库 ---
const englishLetters: WordItem[] = 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => ({
  text: c, display: c
}))

const englishUpperLetters: WordItem[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
  text: c, display: c
}))

const englishMixedLetters: WordItem[] = [
  ...englishLetters,
  ...englishUpperLetters,
]

const simpleWords: WordItem[] = [
  'cat','dog','sun','run','big','red','hat','cup','bed','box',
  'pen','map','bus','egg','ant','owl','fox','pig','cow','hen',
  'bat','fly','joy','sky','top','fun','hot','wet','sad','win',
].map(w => ({ text: w, display: w }))

const commonWords: WordItem[] = [
  'apple','house','happy','green','water','light','tiger','smile',
  'bread','cloud','dance','earth','fruit','grass','heart','juice',
  'kitty','lemon','music','night','ocean','piano','queen','river',
  'stone','table','uncle','voice','watch','young','zebra','dream',
].map(w => ({ text: w, display: w }))

/** 简单 + 常用混合（过渡用） */
const simpleAndCommon: WordItem[] = [...simpleWords, ...commonWords]

const advancedWords: WordItem[] = [
  'beautiful','elephant','computer','mountain','birthday','champion',
  'dinosaur','engineer','football','gorgeous','homework','internet',
  'jellyfish','kingdom','language','mushroom','necklace','opposite',
  'penguin','question','rainbow','sandwich','tomorrow','umbrella',
  'vacation','wonderful','xylophone','yesterday','adventure','butterfly',
].map(w => ({ text: w, display: w }))

const englishSentences: WordItem[] = [
  { text: 'I like to play outside.', display: 'I like to play outside.' },
  { text: 'The cat is sleeping.', display: 'The cat is sleeping.' },
  { text: 'She has a red apple.', display: 'She has a red apple.' },
  { text: 'We go to school every day.', display: 'We go to school every day.' },
  { text: 'He can run very fast.', display: 'He can run very fast.' },
  { text: 'The sun is bright today.', display: 'The sun is bright today.' },
  { text: 'My dog likes to jump.', display: 'My dog likes to jump.' },
  { text: 'They are good friends.', display: 'They are good friends.' },
  { text: 'I want to learn more.', display: 'I want to learn more.' },
  { text: 'Let us have some fun!', display: 'Let us have some fun!' },
  { text: 'Birds sing in the tree.', display: 'Birds sing in the tree.' },
  { text: 'The fish swim in the river.', display: 'The fish swim in the river.' },
]

const englishParagraphs: WordItem[] = [
  { text: 'Once upon a time, there was a little rabbit who loved to explore the forest.', display: 'Once upon a time, there was a little rabbit who loved to explore the forest.' },
  { text: 'The sun rose over the mountains, painting the sky in shades of orange and pink.', display: 'The sun rose over the mountains, painting the sky in shades of orange and pink.' },
  { text: 'Learning to type fast is a super useful skill for school and future work.', display: 'Learning to type fast is a super useful skill for school and future work.' },
  { text: 'Reading books opens doors to magical worlds and exciting adventures beyond imagination.', display: 'Reading books opens doors to magical worlds and exciting adventures beyond imagination.' },
  { text: 'Good friends are like stars. You do not always see them, but you know they are always there.', display: 'Good friends are like stars. You do not always see them, but you know they are always there.' },
  { text: 'Every morning I wake up early and brush my teeth before breakfast.', display: 'Every morning I wake up early and brush my teeth before breakfast.' },
  { text: 'My favorite color is blue because it looks like the sky and the ocean.', display: 'My favorite color is blue because it looks like the sky and the ocean.' },
  { text: 'The little girl picked up a pretty flower and gave it to her mother.', display: 'The little girl picked up a pretty flower and gave it to her mother.' },
  { text: 'In the park, children are playing on the swings and sliding down the slide.', display: 'In the park, children are playing on the swings and sliding down the slide.' },
  { text: 'A wise old owl sits in the oak tree watching the stars come out at night.', display: 'A wise old owl sits in the oak tree watching the stars come out at night.' },
]

// --- 拼音词库 ---
const pinyinInitials: WordItem[] = [
  'b','p','m','f','d','t','n','l',
  'g','k','h','j','q','x',
  'zh','ch','sh','r','z','c','s',
  'y','w',
].map(p => ({ text: p, display: p }))

const pinyinFinals: WordItem[] = [
  { text: 'a', display: 'a (啊)' }, { text: 'o', display: 'o (哦)' },
  { text: 'e', display: 'e (鹅)' }, { text: 'i', display: 'i (衣)' },
  { text: 'u', display: 'u (乌)' }, { text: 'ü', display: 'ü (鱼)' },
  { text: 'ai', display: 'ai (爱)' }, { text: 'ei', display: 'ei (诶)' },
  { text: 'ui', display: 'ui (威)' }, { text: 'ao', display: 'ao (奥)' },
  { text: 'ou', display: 'ou (欧)' }, { text: 'iu', display: 'iu (优)' },
  { text: 'ie', display: 'ie (耶)' }, { text: 'üe', display: 'üe (约)' },
  { text: 'er', display: 'er (儿)' },
  { text: 'an', display: 'an (安)' }, { text: 'en', display: 'en (恩)' },
  { text: 'in', display: 'in (因)' }, { text: 'un', display: 'un (温)' },
  { text: 'ün', display: 'ün (晕)' },
  { text: 'ang', display: 'ang (昂)' }, { text: 'eng', display: 'eng (鞥)' },
  { text: 'ing', display: 'ing (英)' }, { text: 'ong', display: 'ong (轰)' },
]

const pinyinSyllables: WordItem[] = [
  { text: 'ba', display: 'ba (八)' }, { text: 'pa', display: 'pa (爬)' },
  { text: 'ma', display: 'ma (妈)' }, { text: 'fa', display: 'fa (发)' },
  { text: 'da', display: 'da (大)' }, { text: 'ta', display: 'ta (他)' },
  { text: 'na', display: 'na (拿)' }, { text: 'la', display: 'la (拉)' },
  { text: 'ga', display: 'ga (嘎)' }, { text: 'ka', display: 'ka (卡)' },
  { text: 'ha', display: 'ha (哈)' },
  { text: 'ji', display: 'ji (鸡)' }, { text: 'qi', display: 'qi (七)' },
  { text: 'xi', display: 'xi (西)' },
  { text: 'zhi', display: 'zhi (知)' }, { text: 'chi', display: 'chi (吃)' },
  { text: 'shi', display: 'shi (师)' }, { text: 'ri', display: 'ri (日)' },
  { text: 'zi', display: 'zi (字)' }, { text: 'ci', display: 'ci (词)' },
  { text: 'si', display: 'si (四)' },
  { text: 'bo', display: 'bo (波)' }, { text: 'po', display: 'po (泼)' },
  { text: 'mo', display: 'mo (摸)' }, { text: 'fo', display: 'fo (佛)' },
  { text: 'de', display: 'de (的)' }, { text: 'te', display: 'te (特)' },
  { text: 'ne', display: 'ne (呢)' }, { text: 'le', display: 'le (了)' },
  { text: 'ge', display: 'ge (哥)' }, { text: 'ke', display: 'ke (科)' },
  { text: 'he', display: 'he (喝)' },
  { text: 'gu', display: 'gu (姑)' }, { text: 'ku', display: 'ku (哭)' },
  { text: 'hu', display: 'hu (呼)' },
  { text: 'zhu', display: 'zhu (猪)' }, { text: 'chu', display: 'chu (出)' },
  { text: 'shu', display: 'shu (书)' }, { text: 'ru', display: 'ru (如)' },
  { text: 'zu', display: 'zu (组)' }, { text: 'cu', display: 'cu (粗)' },
  { text: 'su', display: 'su (苏)' },
  { text: 'ju', display: 'ju (句)' }, { text: 'qu', display: 'qu (去)' },
  { text: 'xu', display: 'xu (需)' },
  { text: 'nü', display: 'nü (女)' }, { text: 'lü', display: 'lü (绿)' },
]

const pinyinWords: WordItem[] = [
  { text: 'mama', display: 'māma (妈妈)' },
  { text: 'baba', display: 'bàba (爸爸)' },
  { text: 'xuexiao', display: 'xuéxiào (学校)' },
  { text: 'laoshi', display: 'lǎoshī (老师)' },
  { text: 'pengyou', display: 'péngyǒu (朋友)' },
  { text: 'dongwu', display: 'dòngwù (动物)' },
  { text: 'shuiguo', display: 'shuǐguǒ (水果)' },
  { text: 'taiyang', display: 'tàiyáng (太阳)' },
  { text: 'yueliang', display: 'yuèliàng (月亮)' },
  { text: 'xingxing', display: 'xīngxīng (星星)' },
  { text: 'kuaile', display: 'kuàilè (快乐)' },
  { text: 'meili', display: 'měilì (美丽)' },
  { text: 'yonggan', display: 'yǒnggǎn (勇敢)' },
  { text: 'congming', display: 'cōngmíng (聪明)' },
  { text: 'zhongguo', display: 'zhōngguó (中国)' },
  { text: 'shijie', display: 'shìjiè (世界)' },
  { text: 'kexue', display: 'kēxué (科学)' },
  { text: 'yinyue', display: 'yīnyuè (音乐)' },
  { text: 'tushu', display: 'túshū (图书)' },
  { text: 'yundong', display: 'yùndòng (运动)' },
]

const pinyinSentences: WordItem[] = [
  { text: 'wo ai xue xi', display: 'wǒ ài xué xí (我爱学习)' },
  { text: 'jin tian tian qi zhen hao', display: 'jīn tiān tiān qì zhēn hǎo (今天天气真好)' },
  { text: 'wo men qu gong yuan wan', display: 'wǒ men qù gōng yuán wán (我们去公园玩)' },
  { text: 'xiao mao zai shui jiao', display: 'xiǎo māo zài shuì jiào (小猫在睡觉)' },
  { text: 'ta shi wo zui hao de peng you', display: 'tā shì wǒ zuì hǎo de péng yǒu (他是我最好的朋友)' },
  { text: 'wo xi huan kan shu he hua hua', display: 'wǒ xǐ huān kàn shū hé huà huà (我喜欢看书和画画)' },
  { text: 'ma ma zuo le hao chi de dan gao', display: 'mā ma zuò le hǎo chī de dàn gāo (妈妈做了好吃的蛋糕)' },
  { text: 'yong gan de xiao peng you bu ku', display: 'yǒng gǎn de xiǎo péng yǒu bù kū (勇敢的小朋友不哭)' },
  { text: 'xiao gou zai yuan zi li pao lai pao qu', display: 'xiǎo gǒu zài yuàn zi lǐ pǎo lái pǎo qù (小狗在院子里跑来跑去)' },
  { text: 'wo he jie jie yi qi fang feng zheng', display: 'wǒ hé jiě jiě yì qǐ fàng fēng zhēng (我和姐姐一起放风筝)' },
  { text: 'yu guo tian qing cai hong chu lai le', display: 'yǔ guò tiān qíng cǎi hóng chū lái le (雨过天晴彩虹出来了)' },
  { text: 'lao shi shuo duo du shu neng zhang zhi shi', display: 'lǎo shī shuō duō dú shū néng zhǎng zhī shí (老师说多读书能涨知识)' },
]

const pinyinParagraphs: WordItem[] = [
  { text: 'chun tian lai le hua er kai le xiao niao zai shu shang chang ge', display: '春天来了，花儿开了，小鸟在树上唱歌' },
  { text: 'wo you yi ge meng xiang zhang da yi hou yao dang yi ming ke xue jia', display: '我有一个梦想，长大以后要当一名科学家' },
  { text: 'du shu shi yi jian hen you qu de shi qing neng rang wo men xue dao hen duo zhi shi', display: '读书是一件很有趣的事情，能让我们学到很多知识' },
  { text: 'mei tian jian chi duan lian shen ti cai neng jian jian kang kang de cheng zhang', display: '每天坚持锻炼，身体才能健健康康地成长' },
  { text: 'xue xi da zi xu yao duo lian xi cong jian dan de zi mu kai shi', display: '学习打字需要多练习，从简单的字母开始' },
  { text: 'xiao peng you men yi qi zai jiao shi li du shu xie zi hua hua', display: '小朋友们一起在教室里读书写字画画' },
  { text: 'jia li yang le yi zhi ke ai de xiao mao ta zong shi ai shui lan jiao', display: '家里养了一只可爱的小猫，它总是爱睡懒觉' },
  { text: 'xing qi tian ba ba dai wo qu le ke ji guan kan le huo jian biao yan', display: '星期天爸爸带我去看了科技馆，看了火箭表演' },
  { text: 'wo yuan wang tian kong kan jian bai yun you de xiang mian hua tang', display: '我望天空看见白云，有的像棉花糖' },
  { text: 'dong tian dao le xue hua cong tian shang piao xia lai di shang yi pian bai', display: '冬天到了，雪花从天上飘下来，地上一片白' },
]

// ====== 等级定义 ======
//
// 设计原则：
//  - 每个分类至少 10 关
//  - speed 逐关递增，增量 ≈0.05/关（让玩家感到"快了那么一点点"）
//  - spawnInterval 随单词变长而增大（给足够时间阅读长词）
//  - livesCount 随难度递减（从 10 → 4）
//  - targetScore 递增鞭策进步

export const levels: Level[] = [
  // ========== 英文路径（12关） ==========
  // speed: 0.15 → 0.55
  {
    id: 1, name: '字母小星星', description: '认识 26 个小写字母',
    category: 'english', ageRange: '6-7岁', icon: '⭐',
    speed: 0.15, spawnInterval: 3000, livesCount: 10, targetScore: 100, timeLimit: 0,
    words: englishLetters,
  },
  {
    id: 2, name: '字母小达人', description: '小写字母打快点',
    category: 'english', ageRange: '6-7岁', icon: '✨',
    speed: 0.20, spawnInterval: 2600, livesCount: 10, targetScore: 120, timeLimit: 0,
    words: englishLetters,
  },
  {
    id: 3, name: '大小写大冒险', description: '大小写字母混着来',
    category: 'english', ageRange: '7-8岁', icon: '🔤',
    speed: 0.25, spawnInterval: 2500, livesCount: 8, targetScore: 150, timeLimit: 0,
    words: englishMixedLetters,
  },
  {
    id: 4, name: '单词入门', description: '三个字母的简单单词',
    category: 'english', ageRange: '8-9岁', icon: '🌱',
    speed: 0.25, spawnInterval: 3500, livesCount: 8, targetScore: 180, timeLimit: 0,
    words: simpleWords,
  },
  {
    id: 5, name: '单词小达人', description: '拼出更多小单词',
    category: 'english', ageRange: '8-9岁', icon: '🌿',
    speed: 0.30, spawnInterval: 3000, livesCount: 8, targetScore: 200, timeLimit: 0,
    words: simpleWords,
  },
  {
    id: 6, name: '单词小高手', description: '简单 + 常用词混合',
    category: 'english', ageRange: '9-10岁', icon: '🌳',
    speed: 0.35, spawnInterval: 3000, livesCount: 7, targetScore: 250, timeLimit: 0,
    words: simpleAndCommon,
  },
  {
    id: 7, name: '词汇小勇士', description: '常用英文词汇量挑战',
    category: 'english', ageRange: '9-11岁', icon: '💪',
    speed: 0.40, spawnInterval: 3000, livesCount: 6, targetScore: 300, timeLimit: 0,
    words: commonWords,
  },
  {
    id: 8, name: '拼词大挑战', description: '挑战更长的单词',
    category: 'english', ageRange: '11-13岁', icon: '🔥',
    speed: 0.45, spawnInterval: 3500, livesCount: 5, targetScore: 400, timeLimit: 120,
    words: advancedWords,
  },
  {
    id: 9, name: '极速拼词王', description: '长单词高速下落!',
    category: 'english', ageRange: '11-13岁', icon: '⚡',
    speed: 0.50, spawnInterval: 3000, livesCount: 5, targetScore: 450, timeLimit: 120,
    words: advancedWords,
  },
  {
    id: 10, name: '句子小作家', description: '完整的英文句子',
    category: 'english', ageRange: '13-14岁', icon: '📝',
    speed: 0.50, spawnInterval: 5000, livesCount: 5, targetScore: 500, timeLimit: 180,
    words: englishSentences,
  },
  {
    id: 11, name: '句子小诗人', description: '更快的英文句子',
    category: 'english', ageRange: '13-15岁', icon: '✍️',
    speed: 0.55, spawnInterval: 4500, livesCount: 4, targetScore: 550, timeLimit: 180,
    words: englishSentences,
  },
  {
    id: 12, name: '段落总冠军', description: '长篇英文终极挑战',
    category: 'english', ageRange: '14-16岁', icon: '🏆',
    speed: 0.55, spawnInterval: 5500, livesCount: 5, targetScore: 600, timeLimit: 300,
    words: englishParagraphs,
  },

  // ========== 拼音路径（10关） ==========
  // speed: 0.15 → 0.65
  {
    id: 21, name: '声母小火车', description: '认识拼音声母',
    category: 'pinyin', ageRange: '6-7岁', icon: '🚂',
    speed: 0.15, spawnInterval: 3000, livesCount: 10, targetScore: 80, timeLimit: 0,
    words: pinyinInitials,
  },
  {
    id: 22, name: '声母快打', description: '声母打字加速',
    category: 'pinyin', ageRange: '6-7岁', icon: '💨',
    speed: 0.20, spawnInterval: 2500, livesCount: 10, targetScore: 100, timeLimit: 0,
    words: pinyinInitials,
  },
  {
    id: 23, name: '韵母小乐园', description: '学习拼音韵母',
    category: 'pinyin', ageRange: '7-8岁', icon: '🎵',
    speed: 0.25, spawnInterval: 2800, livesCount: 10, targetScore: 120, timeLimit: 0,
    words: pinyinFinals,
  },
  {
    id: 24, name: '韵母加速赛', description: '韵母打字加速',
    category: 'pinyin', ageRange: '7-8岁', icon: '🎶',
    speed: 0.30, spawnInterval: 2500, livesCount: 8, targetScore: 150, timeLimit: 0,
    words: pinyinFinals,
  },
  {
    id: 25, name: '拼音小勇士', description: '完整拼音音节',
    category: 'pinyin', ageRange: '8-9岁', icon: '🦸',
    speed: 0.30, spawnInterval: 3000, livesCount: 8, targetScore: 200, timeLimit: 0,
    words: pinyinSyllables,
  },
  {
    id: 26, name: '拼读挑战', description: '音节打字加速',
    category: 'pinyin', ageRange: '8-9岁', icon: '🎯',
    speed: 0.40, spawnInterval: 2800, livesCount: 7, targetScore: 250, timeLimit: 0,
    words: pinyinSyllables,
  },
  {
    id: 27, name: '词语小博士', description: '拼音词语练习',
    category: 'pinyin', ageRange: '9-11岁', icon: '📚',
    speed: 0.45, spawnInterval: 3500, livesCount: 6, targetScore: 300, timeLimit: 0,
    words: pinyinWords,
  },
  {
    id: 28, name: '词语风暴', description: '更快的拼音词语',
    category: 'pinyin', ageRange: '9-11岁', icon: '🌪️',
    speed: 0.55, spawnInterval: 3000, livesCount: 6, targetScore: 350, timeLimit: 120,
    words: pinyinWords,
  },
  {
    id: 29, name: '句子小诗人', description: '拼音短句练习',
    category: 'pinyin', ageRange: '11-13岁', icon: '✍️',
    speed: 0.55, spawnInterval: 5000, livesCount: 5, targetScore: 400, timeLimit: 180,
    words: pinyinSentences,
  },
  {
    id: 30, name: '终极拼音王', description: '拼音段落终极挑战',
    category: 'pinyin', ageRange: '13-16岁', icon: '👑',
    speed: 0.65, spawnInterval: 5500, livesCount: 5, targetScore: 500, timeLimit: 300,
    words: pinyinParagraphs,
  },
]

/** 根据分类获取等级列表 */
export function getLevelsByCategory(category: 'english' | 'pinyin'): Level[] {
  return levels.filter(l => l.category === category)
}

/** 根据 id 获取等级 */
export function getLevelById(id: number): Level | undefined {
  return levels.find(l => l.id === id)
}
