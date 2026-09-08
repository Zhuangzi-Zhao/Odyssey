// story/odyssey_script.js
/**
 * 奥德赛：归乡之路 - 核心海陆交替剧情剧本数据
 * 
 * 航海循环结构：
 * 序幕 -> [海 1] 怒海逆流 -> [陆 1 · 无人岛] 赫尔墨斯泉 -> [海 2] 塞壬之雾 -> 
 * [陆 2 · 人类岛] 色雷斯商港 -> [海 3] 卡律布狄斯漩涡 -> [陆 3 · 怪物神域] 喀耳刻魔境与神牛 -> 
 * [海 4] 终章破晓海峡 -> 终局结算
 */

const STORY_NODES = {
  // ================= 0. 序幕 (特洛伊启航) =================
  "prologue_start": {
    id: "prologue_start",
    chapter: "序幕 · 特洛伊的余烬",
    env: "land",
    landType: "human",
    envLabel: "特洛伊废墟",
    speaker: "旁白",
    icon: "🔥",
    text: "特洛伊巍峨的城墙在烈火与浓烟中化为焦土。阿伽门农与奥德修斯的大舰队已各自拔锚启航。你作为来自爱琴海东岸小城邦的领主，凝望着沙滩上唯一的黑漆战船与紧随身侧的30名同乡弟兄。十年苦战终告结束，但横亘在你们与家园之间的，是变幻莫测的愤怒之海。",
    choices: [
      {
        text: "在海滩宰杀最好的公牛，向海神波塞冬虔诚献祭",
        hint: "消耗食物，获得海神庇佑与船员安心",
        deltas: { food: -15, sanity: 10, luck: 25, loyalty: 10, crew: 0 },
        nextNodeId: "prologue_sacrificed"
      },
      {
        text: "粮食紧缺，将公牛风干储备，抓紧时间拔锚启航",
        hint: "保留口粮，但可能冒犯神明",
        deltas: { food: 15, sanity: 0, luck: -20, loyalty: -5, crew: 0 },
        nextNodeId: "prologue_spared"
      }
    ]
  },

  "prologue_sacrificed": {
    id: "prologue_sacrificed",
    chapter: "序幕 · 海神的注视",
    env: "sea",
    landType: null,
    envLabel: "近岸浅海",
    speaker: "大副 埃尔佩诺",
    icon: "🌊",
    text: "“首领，公牛的浓烟笔直升入蓝天，海浪似乎变得柔和了！”水手们见你敬畏神明，心中的惶恐消散了大半。黑漆战船划破平静的蔚蓝海面，驶向爱琴海的第一道深水航路。",
    choices: [
      {
        text: "升起风帆，驶向怒海主航道",
        deltas: { food: -5, sanity: 0, luck: 0, loyalty: 0, crew: 0 },
        nextNodeId: "sea_01_currents"
      }
    ]
  },

  "prologue_spared": {
    id: "prologue_spared",
    chapter: "序幕 · 不安的逆风",
    env: "sea",
    landType: null,
    envLabel: "近岸浅海",
    speaker: "旁白",
    icon: "💨",
    text: "战船满载着沉甸甸的风干肉驶出浅滩。然而刚离岸数里，海面上便刮起了一阵怪异的逆向阴风，海水呈现出不祥的墨黑色，仿佛深渊深处有一双冷酷的眼睛在审视着这艘缺乏敬意的战船。",
    choices: [
      {
        text: "命水手顶风划桨，强行切入主航道",
        deltas: { food: -10, sanity: -10, luck: -5, loyalty: -5, crew: 0 },
        nextNodeId: "sea_01_currents"
      }
    ]
  },

  // ================= 1. 海上事件 1：怒海逆流与海神初怒 =================
  "sea_01_currents": {
    id: "sea_01_currents",
    chapter: "第一幕 · 怒海逆流与波塞冬的阴影",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🌊",
    text: "战船驶入外海，天空骤然压下铁灰色的滚滚阴云。两股狂暴的暗流在龙骨下方猛烈对冲，木质船体发出令人牙酸的嘎吱声。水手们拼尽全力拉动沉重的橡木桨，但战船依然被狂暴的海流逼向未知的礁石浅滩！",
    choices: [
      {
        text: "命全体水手同节奏奋力倒桨，顺应水流借力转向开阔海域",
        hint: "沉着调度，全员平安但消耗大量体力",
        deltas: { food: -10, sanity: -5, luck: 0, loyalty: 5, crew: 0 },
        nextNodeId: "land_01_uninhabited_start"
      },
      {
        text: "【神恩】向海神高声祈祷，将一桶香醇葡萄酒倾入激流平息狂澜",
        hint: "需要神恩幸运 ≥ 40",
        condition: { minLuck: 40 },
        deltas: { food: -5, sanity: 10, luck: 15, loyalty: 15, crew: 0 },
        nextNodeId: "land_01_uninhabited_start"
      },
      {
        text: "强行升满双帆强行破浪！",
        hint: "冒险突破，可能导致水手落海受伤",
        deltas: { food: 0, sanity: -15, luck: -10, loyalty: -10, crew: -1 },
        nextNodeId: "land_01_uninhabited_start"
      }
    ]
  },

  // ================= 2. 陆上事件 1 (无人岛屿)：赫尔墨斯泉与古老残骸 =================
  "land_01_uninhabited_start": {
    id: "land_01_uninhabited_start",
    chapter: "第二幕 · 赫尔墨斯的隐秘荒岛",
    env: "land",
    landType: "uninhabited",
    envLabel: "无人荒岛",
    speaker: "大副 埃尔佩诺",
    icon: "🏝️",
    text: "冲出逆流后，战船搁浅在一座静谧的无人海岛沙滩上。岛上古木参天，空无一人，唯有一道清澈见底的山泉从大理石岩壁中奔涌而出。在不远处的礁石旁，还赫然横陈着一艘数年前失事的古希腊战船残骸。",
    choices: [
      {
        text: "全员下船搜集淡水与野果，并在沙滩生火休整一天",
        hint: "充分补充食物，极大抚平全员理智",
        deltas: { food: 25, sanity: 20, luck: 5, loyalty: 10, crew: 0 },
        nextNodeId: "land_01_rest_done"
      },
      {
        text: "带领精锐搜寻沉船残骸，撬开被海藻覆盖的生锈货箱",
        hint: "搜寻可能发现的遗留物资与黄金，但有意外风险",
        deltas: { food: 35, sanity: 0, luck: -5, loyalty: 15, crew: 0 },
        nextNodeId: "land_01_salvage_done"
      },
      {
        text: "只快速装满五桶淡水，不耽搁片刻立刻拔锚启航",
        hint: "谨慎行事，补充少量给养",
        deltas: { food: 10, sanity: 5, luck: 0, loyalty: -5, crew: 0 },
        nextNodeId: "sea_02_sirens_start"
      }
    ]
  },

  "land_01_rest_done": {
    id: "land_01_rest_done",
    chapter: "第二幕 · 荒岛清泉的滋养",
    env: "land",
    landType: "uninhabited",
    envLabel: "无人荒岛",
    speaker: "旁白",
    icon: "🍇",
    text: "清冽甘甜的泉水洗净了水手们干裂的唇齿与满身盐霜。在绿树阴凉下，众人安稳睡了一整夜，十年来被特洛伊杀戮所折磨的神经得到了久违的舒缓。",
    choices: [
      {
        text: "整理行装，战船重新入海",
        deltas: { food: -5, sanity: 0, luck: 0, loyalty: 0, crew: 0 },
        nextNodeId: "sea_02_sirens_start"
      }
    ]
  },

  "land_01_salvage_done": {
    id: "land_01_salvage_done",
    chapter: "第二幕 · 沉船遗宝",
    env: "land",
    landType: "uninhabited",
    envLabel: "无人荒岛",
    speaker: "水手长 提莫斯",
    icon: "🪙",
    text: "“首领！残船货舱里有密封完好的橄榄油、谷物，还有一袋色雷斯金币！”水手们兴奋地将物资搬上甲板，对你的眼光赞不绝口。",
    choices: [
      {
        text: "将战利品妥善封存，拔锚启航",
        deltas: { food: -5, sanity: 0, luck: 0, loyalty: 0, crew: 0 },
        nextNodeId: "sea_02_sirens_start"
      }
    ]
  },

  // ================= 3. 海上事件 2：塞壬迷雾与惑心之歌 =================
  "sea_02_sirens_start": {
    id: "sea_02_sirens_start",
    chapter: "第三幕 · 塞壬的迷雾暗礁",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🌫️",
    text: "航行数日后，海面再次弥漫起浓厚白雾。空气中忽然飘来空灵曼妙的歌声，唱诵着你童年时故乡橄榄树下的誓言与母亲温暖的呼唤。数名年轻水手眼神涣散，扔下船桨，脚步踉跄地朝着遍布白骨的暗礁船舷走去……",
    choices: [
      {
        text: "命全员用蜂蜡封住双耳，以粗绳将自己绑在桅杆上盲划破雾",
        hint: "稳妥破局，全员平安但消耗意志",
        deltas: { food: -5, sanity: -10, luck: 5, loyalty: 10, crew: 0 },
        nextNodeId: "sea_02_sirens_safe"
      },
      {
        text: "拔出青铜短剑，以严厉军令与怒喝强行制止众人",
        hint: "粗暴制止，恐有水手因精神失常落海",
        deltas: { food: -5, sanity: -25, luck: 0, loyalty: -15, crew: -2 },
        nextNodeId: "sea_02_sirens_force"
      },
      {
        text: "【神恩】向智慧女神雅典娜祈祷，敲击青铜盾牌高唱战神赞歌",
        hint: "需要神恩幸运 ≥ 45",
        condition: { minLuck: 45 },
        deltas: { food: -5, sanity: 20, luck: 15, loyalty: 20, crew: 0 },
        nextNodeId: "sea_02_sirens_divine"
      }
    ]
  },

  "sea_02_sirens_safe": {
    id: "sea_02_sirens_safe",
    chapter: "第三幕 · 破雾而出",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "✨",
    text: "蜂蜡隔绝了蛊惑的魔音。虽然你在桅杆上饱受精神煎熬，但凭借坚韧的意志，战船安然冲出了塞壬的暗礁区。水手们为你解开绳索，眼中满是敬佩。",
    choices: [
      {
        text: "清点人数，驶向前方泛着炊烟的海岸",
        deltas: { food: -5, sanity: 5, luck: 0, loyalty: 5, crew: 0 },
        nextNodeId: "land_02_human_start"
      }
    ]
  },

  "sea_02_sirens_force": {
    id: "sea_02_sirens_force",
    chapter: "第三幕 · 惨痛的代价",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🩸",
    text: "剑刃的寒光震醒了大部分人，但依然有两名发狂的同乡跃入了冰冷的海水，被迷雾中的黑影拖入深渊。哀痛与恐慌在甲板上蔓延开来。",
    choices: [
      {
        text: "默默为亡者祈祷，向前方的人类海港靠拢",
        deltas: { food: -5, sanity: -10, luck: -5, loyalty: -10, crew: 0 },
        nextNodeId: "land_02_human_start"
      }
    ]
  },

  "sea_02_sirens_divine": {
    id: "sea_02_sirens_divine",
    chapter: "第三幕 · 圣歌庇护",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🛡️",
    text: "盾牌碰撞的铿锵战音瞬间撕碎了海妖的虚妄幻音！金色的阳光穿透白雾，水手们群情振奋，划桨速度倍增，战船如离弦之箭破雾而出！",
    choices: [
      {
        text: "借着神圣顺风全速驶向前方城邦海港",
        deltas: { food: -5, sanity: 10, luck: 5, loyalty: 10, crew: 0 },
        nextNodeId: "land_02_human_start"
      }
    ]
  },

  // ================= 4. 陆上事件 2 (人类岛屿)：色雷斯商港与外邦抉择 =================
  "land_02_human_start": {
    id: "land_02_human_start",
    chapter: "第四幕 · 色雷斯人的伊斯马罗斯港",
    env: "land",
    landType: "human",
    envLabel: "人类城邦",
    speaker: "旁白",
    icon: "🏛️",
    text: "战船驶入了一处繁华的人类城邦外港——色雷斯人的伊斯马罗斯商港。码头上商贾云集，堆满了谷物、葡萄酒与腌肉，酒馆里聚集着许多在战争中流落至此的希腊流浪老兵。港口的卫兵正警惕地注视着你们这些全副武装的归客。",
    choices: [
      {
        text: "以礼相待，拿出特洛伊战利黄金与港口总督公平交易大量粮食",
        hint: "花费财物获得充足粮食与葡萄酒，全员安稳",
        deltas: { food: 35, sanity: 10, luck: 10, loyalty: 10, crew: 0 },
        nextNodeId: "land_02_trade_done"
      },
      {
        text: "前往酒馆出资招募4名经验丰富的流浪水手入伍补充战力",
        hint: "补充【船员人数 +4】，但新老水手磨合略微损耗忠诚",
        deltas: { food: -10, sanity: 0, luck: 0, loyalty: -5, crew: 4 },
        nextNodeId: "land_02_recruit_done"
      },
      {
        text: "色雷斯人防备松懈，趁夜拔剑突袭码头仓库掠夺全部物资！",
        hint: "极大抢掠粮食，但可能引发卫兵激烈血战",
        deltas: { food: 50, sanity: -15, luck: -25, loyalty: 15, crew: -3 },
        nextNodeId: "land_02_raid_done"
      }
    ]
  },

  "land_02_trade_done": {
    id: "land_02_trade_done",
    chapter: "第四幕 · 友善的集市",
    env: "land",
    landType: "human",
    envLabel: "人类城邦",
    speaker: "总督 狄奥墨得斯",
    icon: "🤝",
    text: "“愿宙斯庇佑讲求信义的勇士！”港口总督收下金币，命人送来了最新鲜的面包与三大桶醇香美酒。水手们在码头饱餐一顿，士气高昂。",
    choices: [
      {
        text: "补充完毕，乘风扬帆驶向大洋",
        deltas: { food: -5, sanity: 5, luck: 5, loyalty: 5, crew: 0 },
        nextNodeId: "sea_03_charybdis_start"
      }
    ]
  },

  "land_02_recruit_done": {
    id: "land_02_recruit_done",
    chapter: "第四幕 · 新鲜血液",
    env: "land",
    landType: "human",
    envLabel: "人类城邦",
    speaker: "大副 埃尔佩诺",
    icon: "👥",
    text: "四名身材魁梧的阿卡亚老兵加入了队伍，战船的划桨座再次坐满。虽然需要时间磨合信任，但战船的航速与御险能力显著提升。",
    choices: [
      {
        text: "分配战位，整装起航",
        deltas: { food: -5, sanity: 0, luck: 0, loyalty: 0, crew: 0 },
        nextNodeId: "sea_03_charybdis_start"
      }
    ]
  },

  "land_02_raid_done": {
    id: "land_02_raid_done",
    chapter: "第四幕 · 染血的港湾",
    env: "land",
    landType: "human",
    envLabel: "人类城邦",
    speaker: "旁白",
    icon: "⚔️",
    text: "火光撕破了夜空。你们虽然成功夺取了满船的粮食，但城邦守军的反击让三名同乡倒在血泊中。战船在漫天飞舞的火箭与诅咒声中仓皇驶出海港。",
    choices: [
      {
        text: "包扎伤口，全速逃离这片敌对海域",
        deltas: { food: -5, sanity: -10, luck: -10, loyalty: -5, crew: 0 },
        nextNodeId: "sea_03_charybdis_start"
      }
    ]
  },

  // ================= 5. 海上事件 3：斯库拉峭壁与卡律布狄斯大漩涡 =================
  "sea_03_charybdis_start": {
    id: "sea_03_charybdis_start",
    chapter: "第五幕 · 斯库拉与卡律布狄斯之渊",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🌀",
    text: "海峡两侧是直插云霄的绝壁。左侧峭壁洞穴中盘踞着生有六首十二足的嗜血海妖斯库拉，右侧则是大海巨妖卡律布狄斯那张吞吐万顷狂涛的深渊大漩涡！狂风呼啸，巨浪如山，双重死局就在眼前！",
    choices: [
      {
        text: "抛弃一半沉重物资减重，命全体水手咬牙逆流强冲漩涡边缘！",
        hint: "大幅消耗粮食，全员拼死一搏",
        deltas: { food: -30, sanity: -10, luck: 0, loyalty: 10, crew: -1 },
        nextNodeId: "sea_03_jettison_done"
      },
      {
        text: "偏向斯库拉峭壁一侧全速划行，以短兵弓箭与海怪搏杀",
        hint: "避免被吸入漩涡，但必定付出惨重人员伤亡",
        deltas: { food: -5, sanity: -25, luck: -10, loyalty: -15, crew: -5 },
        nextNodeId: "sea_03_scylla_done"
      },
      {
        text: "【神迹】高举战船图腾，向海神献上海洋誓约与船长的传家金冠",
        hint: "需要神恩幸运 ≥ 55",
        condition: { minLuck: 55 },
        deltas: { food: -5, sanity: 25, luck: 20, loyalty: 25, crew: 0 },
        nextNodeId: "sea_03_miracle_done"
      }
    ]
  },

  "sea_03_jettison_done": {
    id: "sea_03_jettison_done",
    chapter: "第五幕 · 险死还生",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "⛵",
    text: "丢弃沉重粮箱与黄金后，黑漆战船轻盈如飞鸟。在漩涡合拢的最后一刹那，战船呼啸着冲出了绝壁死地！虽然粮食见底，但绝大多数兄弟活了下来！",
    choices: [
      {
        text: "眺望前方漂浮着紫色薄雾的神秘海岛",
        deltas: { food: 0, sanity: 5, luck: 5, loyalty: 5, crew: 0 },
        nextNodeId: "land_03_monster_start"
      }
    ]
  },

  "sea_03_scylla_done": {
    id: "sea_03_scylla_done",
    chapter: "第五幕 · 峭壁浴血",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🩸",
    text: "斯库拉的六只巨首如闪电般自洞穴中探出，一口咬碎了五名勇士。在鲜血与悲鸣中，战船凭借极速冲过了海峡，幸存者们瘫软在满是血迹的甲板上，心有余悸。",
    choices: [
      {
        text: "强忍悲痛，驶向前方的大陆",
        deltas: { food: -5, sanity: -15, luck: -5, loyalty: -10, crew: 0 },
        nextNodeId: "land_03_monster_start"
      }
    ]
  },

  "sea_03_miracle_done": {
    id: "sea_03_miracle_done",
    chapter: "第五幕 · 神恩开道",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "👑",
    text: "当镶嵌红宝石的王冠沉入深渊的一瞬，狂怒的海水竟奇迹般裂开一条平稳的水道！两只巨大的海豚在船头跃起引路，战船沐浴在神圣的微光中，毫发无损地掠过漩涡！",
    choices: [
      {
        text: "乘着神风驶向前方神秘神域",
        deltas: { food: 0, sanity: 20, luck: 10, loyalty: 20, crew: 0 },
        nextNodeId: "land_03_monster_start"
      }
    ]
  },

  // ================= 6. 陆上事件 3 (怪物/神域岛屿)：喀耳刻魔境与太阳神牛 =================
  "land_03_monster_start": {
    id: "land_03_monster_start",
    chapter: "第六幕 · 埃埃亚岛的魔女与太阳神圣牛",
    env: "land",
    landType: "monster",
    envLabel: "危险神域",
    speaker: "旁白",
    icon: "👁️",
    text: "战船停靠在神秘的埃埃亚岛。森林深处的宫殿里传出织布机的幽幽声响与美酒的甜香，魔女喀耳刻手捧掺有遗忘魔药的蜜酒在殿前迎候；而在后山的山谷中，漫山遍野游荡着毛色纯金、体格硕大的太阳神阿波罗圣牛——那是凡人绝对不可触碰的神明禁忌！",
    choices: [
      {
        text: "饥寒交迫，水手们拔剑冲入山谷捕杀太阳神圣牛烤肉充饥！",
        hint: "完全回满食物，但将招致天降神罚（幸运暴跌）",
        deltas: { food: 50, sanity: 10, luck: -45, loyalty: 20, crew: 0 },
        nextNodeId: "land_03_slaughter_done"
      },
      {
        text: "严禁伤害神牛！带队进宫与魔女喀耳刻斗智，饮用神赐解毒草破解法术",
        hint: "需要神恩幸运 ≥ 50 或 理智 ≥ 60",
        condition: { minLuck: 50 },
        deltas: { food: 25, sanity: 20, luck: 20, loyalty: 15, crew: 0 },
        nextNodeId: "land_03_circe_win"
      },
      {
        text: "心怀恐惧，命众人闭紧双眼，仅在岸边割取野草树皮充饥，绝不踏入海岛半步",
        hint: "忍受饥饿，勉强保全理智与神明敬畏",
        deltas: { food: -15, sanity: -10, luck: 10, loyalty: -15, crew: 0 },
        nextNodeId: "land_03_flee_done"
      }
    ]
  },

  "land_03_slaughter_done": {
    id: "land_03_slaughter_done",
    chapter: "第六幕 · 致命的狂宴",
    env: "land",
    landType: "monster",
    envLabel: "危险神域",
    speaker: "水手长 提莫斯",
    icon: "🥩",
    text: "“吃吧！吃个痛快！”水手们大快朵颐。然而当烤肉在铁签上滋滋作响时，被剥皮的生肉竟然发出了凄厉的牛鸣！天空中金色的太阳骤然转为暴怒的血红……",
    choices: [
      {
        text: "怀着深深的恐惧连夜推船下水逃亡",
        deltas: { food: -5, sanity: -15, luck: -10, loyalty: 0, crew: 0 },
        nextNodeId: "sea_04_final_strait"
      }
    ]
  },

  "land_03_circe_win": {
    id: "land_03_circe_win",
    chapter: "第六幕 · 魔女的敬畏",
    env: "land",
    landType: "monster",
    envLabel: "危险神域",
    speaker: "魔女 喀耳刻",
    icon: "✨",
    text: "“凡人，你的智慧与神圣庇佑令我惊叹。”魔女收起魔杖，敬重你的坚毅与节制。她解除了幻象，赠予你整整三箱不腐的仙粮与通往故乡海峡的秘密海图！",
    choices: [
      {
        text: "接受馈赠，扬帆驶向最终归途",
        deltas: { food: 20, sanity: 15, luck: 10, loyalty: 15, crew: 0 },
        nextNodeId: "sea_04_final_strait"
      }
    ]
  },

  "land_03_flee_done": {
    id: "land_03_flee_done",
    chapter: "第六幕 · 战栗的克制",
    env: "land",
    landType: "monster",
    envLabel: "危险神域",
    speaker: "大副 埃尔佩诺",
    icon: "💨",
    text: "水手们嚼着苦涩的树皮，肚子咕咕作响，但谁也不敢违抗神明的戒律。战船在夜幕掩护下悄无声息地滑入外海，避开了魔女的毒手。",
    choices: [
      {
        text: "咬紧牙关，驶向最后的归乡航道",
        deltas: { food: -5, sanity: -5, luck: 5, loyalty: -5, crew: 0 },
        nextNodeId: "sea_04_final_strait"
      }
    ]
  },

  // ================= 7. 海上事件 4 (终章航段)：故土海峡与破晓之光 =================
  "sea_04_final_strait": {
    id: "sea_04_final_strait",
    chapter: "终章 · 故土海峡的破晓逆潮",
    env: "sea",
    landType: null,
    envLabel: "海上航段",
    speaker: "旁白",
    icon: "🏰",
    text: "历经千难万险，前方海平线上终于露出了熟悉的青翠山丘与城邦灯塔——那是你们阔别整整十年的家园！然而在进入海湾的最后一道窄峡中，狂暴的逆潮正在猛烈冲刷防波堤。弟兄们已精疲力竭，战船也已伤痕累累。",
    choices: [
      {
        text: "全员拼尽最后一丝力气划桨，吹响归乡的牛角号冲入海港！",
        hint: "进入最终结局全面结算",
        deltas: { food: 0, sanity: 10, luck: 0, loyalty: 10, crew: 0 },
        nextNodeId: "trigger_ending_calculation"
      }
    ]
  }
};

/**
 * 结局定义数据库
 */
const ENDINGS = {
  // 完美结局
  "triumphant": {
    id: "triumphant",
    title: "【英雄凯旋 · 不朽传奇】",
    tag: "史诗结局 ★★★★★",
    icon: "👑",
    desc: "你以卓越的统率力、对神明的敬畏以及在海陆险境中的非凡决断，带领绝大部分同胞兄弟冲破重重死局，满载荣耀归乡！城邦的长老与臣民为你加冕月桂冠，你的海陆历险将与奥德修斯的史诗一同传唱千年！"
  },
  // 普通胜利
  "survivor": {
    id: "survivor",
    title: "【残破的归客 · 悲壮回响】",
    tag: "普通结局 ★★★☆☆",
    icon: "⚓",
    desc: "残破不堪的战船终于靠上了故土的沙滩。你虽然活着回到了家园，但同袍弟兄伤亡过半，物资匮乏。望着故乡熟悉的橄榄林与满头白发的亲人，你知道，爱琴海上的狂澜与孤岛噩梦将伴随你的一生。"
  },
  // 兵变失败
  "mutiny": {
    id: "mutiny",
    title: "【深海兵变 · 绝望的背叛】",
    tag: "覆灭结局 ☠️☆☆☆☆",
    icon: "⚔️",
    desc: "长期饥饿、无休止的恐惧与暴虐专断彻底摧垮了水手们的信任。在距离故土仅剩一日航程的深夜，绝望的同袍拔出佩剑逼近船长室……你被捆绑沉入大海，战船在混乱中撞碎在不知名的暗礁之上。"
  },
  // 幽灵船
  "ghost_ship": {
    id: "ghost_ship",
    title: "【永恒迷航 · 爱琴海幽灵】",
    tag: "灾厄结局 ☠️☆☆☆☆",
    icon: "💀",
    desc: "所有的同伴都在饥荒、海妖魔音与无情巨浪中倒下。当战船在晨雾中无声漂入故乡港湾时，甲板上只有挂满海藻的白骨与静默的风帆。你们回到了故土，但无人能够回应亲人热切的呼唤。"
  },
  // 狂乱
  "madness": {
    id: "madness",
    title: "【深渊低语 · 狂乱之舟】",
    tag: "疯狂结局 ☠️☆☆☆☆",
    icon: "👁️",
    desc: "直视深海异象与魔女诅咒的代价是理智的彻底崩解。战船驶入了无人知晓的虚无死海，水手们在胡言乱语中将武器挥向彼此，最终沉入了波塞冬最深邃的冰冷渊薮。"
  }
};

module.exports = {
  STORY_NODES,
  ENDINGS
};
