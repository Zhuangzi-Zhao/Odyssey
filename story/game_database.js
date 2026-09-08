// story/game_database.js
// 完整奥德赛游戏数据库（职业、大事件、祭祀、52随机事件、见闻录、结局与成就）

const GAME_DATABASE = {
  "CLASSES": {
    "warrior": {
      "id": "warrior",
      "name": "贵族武领",
      "title": "阿卡亚领主",
      "icon": "⚔️",
      "desc": "来自伯罗奔尼撒的世袭贵族，治军严明，精于海陆搏杀。虽不受神明偏爱，但部下敬服，战斗收益极高。",
      "initialResources": {
        "food": 75,
        "sanity": 80,
        "luck": 50,
        "crew": 30,
        "loyalty": 85
      },
      "weights": {
        "loyaltyLossRate": 0.75,
        "battleGainRate": 1.25,
        "divineWrathRate": 1.25,
        "foodDecayRate": 1.0,
        "sanityDecayRate": 1.0,
        "sacrificeBonus": 0,
        "stormLossRate": 1.0
      }
    },
    "priest": {
      "id": "priest",
      "name": "神谕祭司",
      "title": "德尔斐信使",
      "icon": "👁️",
      "desc": "受神庙启蒙的盲眼神官，深谙诸神脾性与天兆。祭祀成效显著且基础成功率+15%，理智抗性高，但体魄较弱。",
      "initialResources": {
        "food": 65,
        "sanity": 90,
        "luck": 75,
        "crew": 30,
        "loyalty": 70
      },
      "weights": {
        "loyaltyLossRate": 1.0,
        "battleGainRate": 0.9,
        "divineWrathRate": 0.8,
        "foodDecayRate": 1.15,
        "sanityDecayRate": 0.8,
        "sacrificeBonus": 15,
        "sacrificeGainRate": 1.3,
        "stormLossRate": 1.0
      }
    },
    "helmsman": {
      "id": "helmsman",
      "name": "老辣舵手",
      "title": "爱琴海向导",
      "icon": "🧭",
      "desc": "航海二十年的老船长，辨识季风暗礁，不惧风浪。暴风雨损失降低30%，迷航概率大幅衰减。",
      "initialResources": {
        "food": 70,
        "sanity": 75,
        "luck": 45,
        "crew": 30,
        "loyalty": 80
      },
      "weights": {
        "loyaltyLossRate": 1.0,
        "battleGainRate": 1.0,
        "divineWrathRate": 1.0,
        "foodDecayRate": 1.0,
        "sanityDecayRate": 0.9,
        "sacrificeBonus": 0,
        "stormLossRate": 0.7,
        "stormChainChanceRate": 0.6
      }
    },
    "merchant": {
      "id": "merchant",
      "name": "随军富贾",
      "title": "辎重司铎",
      "icon": "⚖️",
      "desc": "掌管舰队战利品与粮饷的巨贾，深谙贸易与搜刮，物资充裕。与岛民交易额外增益35%，但水手易生猜忌。",
      "initialResources": {
        "food": 90,
        "sanity": 70,
        "luck": 40,
        "crew": 30,
        "loyalty": 75
      },
      "weights": {
        "loyaltyLossRate": 1.15,
        "battleGainRate": 0.8,
        "divineWrathRate": 1.1,
        "foodDecayRate": 0.9,
        "sanityDecayRate": 1.0,
        "sacrificeBonus": -5,
        "tradeGainRate": 1.35,
        "stormLossRate": 1.0
      }
    }
  },
  "PROLOGUE": {
    "id": "prologue",
    "chapter": "开篇 · 启航",
    "icon": "🔥",
    "env": "land",
    "landType": "human",
    "speaker": "旁白",
    "text": "特洛伊在燃烧。你站在海滩上，灰烬落在你的肩甲上，像一场黑色的雪。十年了，木马破城，刀锋卷刃，你终于可以回家了。\n你回头望——燃烧的神庙、倒塌的城墙、堆满广场的尸体。你赢了。但你赢了之后才发现，胜利的味道和失败一模一样。\n木桨劈开黑沉沉的海面，船首切开特洛伊的海水向北驶去。你即将踏上归途，这条属于漂泊者的路。“归途易得，归己最难。”",
    "choices": [
      {
        "text": "在海滩宰杀公牛祭海，祈求波塞冬顺风",
        "hint": "消耗食物，获得神恩庇佑",
        "deltas": {
          "food": -10,
          "luck": 15,
          "loyalty": 5
        },
        "condition": null
      },
      {
        "text": "抓紧时间拔锚启航，全员趁夜色冲入主航道",
        "hint": "保留食物，迅速入海",
        "deltas": {
          "food": 0,
          "sanity": -5,
          "luck": -5
        },
        "condition": null
      }
    ]
  },
  "ENDINGS": {
    "survivor": {
      "id": "survivor",
      "achievement": "上岸",
      "title": "【上岸 · 极少数船员】",
      "tag": "悲壮结局 ★★★☆☆",
      "icon": "⚓",
      "desc": "船撞上浅滩时你跪倒在沙地上，脸贴着故乡的泥土，鼻子里灌进某种你几乎已经忘记的味道。你的身后只有稀稀落落的脚步声——每一双靴子踩在沙上都像一个迟到的葬礼。老狗冲下来，跑得歪歪扭扭。妻子看着你，又看看你身后那几张残缺的脸，没哭，没喊，只说：“进屋吧，汤还热着。”你跨过门槛，你知道那些沉在海底的人也在看着你。你合上门。你也不需要再出海了。“我回来了。”"
    },
    "return": {
      "id": "return",
      "achievement": "回家",
      "title": "【回家 · 中等船员】",
      "tag": "温暖结局 ★★★★☆",
      "icon": "🏡",
      "desc": "船在晨雾中靠岸，身后是几十张信任的脸庞。水没过脚踝，你扶着一个个兄弟踏上故乡的沙滩。你数了数，不多，但够用了，够组成一支歌。山坡上亮起火光，涌下来的人群把沙滩挤满了。你的妻子递给你一碗酒，只说了一句话：“你尽力了。”你完成了一次真正意义上的回家——不仅是你自己的，也是他们每一个人的。"
    },
    "triumphant": {
      "id": "triumphant",
      "achievement": "凯旋",
      "title": "【凯旋 · 众多船员】",
      "tag": "传奇史诗 ★★★★★",
      "icon": "👑",
      "desc": "船队压过海平线的时候，码头上的人多得像一场战争。旌旗翻卷，鼓声震天，整支船队甲板上堆满了黄金与战利品。兄弟们站在你身后站成一片沉默的森林。全城的钟声敲响，你接过妻子的金杯，面向黑压压的人群举杯：“为归途，为家乡！”波涛没能留下我们，风暴没能留下我们，诸神也没能留下我们。我们跨过了冥河，站在了自己的土地上！"
    },
    "death_sea": {
      "id": "death_sea",
      "achievement": "魂归海洋",
      "title": "【死亡 · 海上冥国】",
      "tag": "深海沉沦 ☠️☆☆☆☆",
      "icon": "💀",
      "desc": "海水灌进喉咙，咸得像血。你往下沉，看见幽暗的水底泛着一层微光。老水手说过：人死的时候，灵魂会顺着海流飘向冥国。你不后悔上船，不后悔选择回家。你听见海在耳边哼唱一首古老的歌，轻得像晚安，暖得像炉火。靠岸那一刻你终于明白——归途从来不在海里。它在心里。“众神编织苦难，是为了让后人有一首歌可以唱。”"
    },
    "death_land": {
      "id": "death_land",
      "achievement": "魂归大地",
      "title": "【死亡 · 陆上冥国】",
      "tag": "残阳折戟 ☠️☆☆☆☆",
      "icon": "⚔️",
      "desc": "血从伤口涌出来，温热地浸透了你的战袍。你跪下去，脸贴着地面，闻到草根被压倒后的涩味。你不后悔拔剑，不后悔选择战斗。你听见大地在脚下哼唱一首古老的歌，沉得像鼓声，像父亲在炉火旁哼过的调子。倒下去的那一刻你终于明白——归途从来不在路上。它在心里。“人无法躲过自己的命运，但可以选择如何面对它。”"
    }
  },
  "MAJOR_EVENTS": [
    {
      "id": "major_1",
      "title": "大事件一：伊斯马罗斯 · 贪欲",
      "quote": "“我攻陷了城市，杀了居民，我们娶了他们的妻子，掠了许多财富，把它们分给众人。” —— 卷九",
      "text": "基科涅斯的城墙在你面前崩塌。你命令撤离，但你的部下不信风暴会来得这么快——他们围着篝火分饮美酒，醉眼望着战利品笑。待到黎明，基科涅斯人从山脊涌来，如潮水吞没沙滩。你砍断缆绳，带着半船人仓皇出逃，身后是同伴的惨叫沉入血泊。贪欲，是归途上第一个教唆你停下的声音。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "crew": -20,
            "loyalty": -10
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_2",
      "title": "大事件二：忘忧果岛 · 遗忘",
      "quote": "“他们中的任何人如果尝了这种果实，便不再想回来报告，也不想返回故里。” —— 卷九",
      "text": "海风吹来一股甜腻的香气。岛上的人面容慵懒，笑着递给你一枚紫红色的果实——咬一口，便忘记故乡的石墙与妻子的织机。你的船员一个接一个瘫倒在树下，眼神空茫，喃喃说“何必回去”。你亲手把他们拖上船，绳索勒进腋下，他们挣扎着哭喊“放开我”。果实并不苦，苦的是清醒的人。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "sanity": -10,
            "loyalty": -20
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_3",
      "title": "大事件三：独眼巨人 · 刺目",
      "quote": "“你既然问起我的光荣名字，我将告诉你……我是奥德修斯。” —— 卷九",
      "text": "洞穴深处弥漫着羊膻与血腥。独眼巨人用巨石封住洞口，抓起你的同伴像摘葡萄一样塞进嘴里——骨碎声在石壁上回荡。你躲在阴影里，手中攥着削尖的木桩，炭火将它烧得通红。巨人醉卧如小山，鼾声撼动地面。你举桩刺入那只独眼，滚烫的液体喷溅在你脸上。逃上船后，你朝岸边大喊：“记住刺瞎你的人是（玩家名字）！”——你赢了巨人，却输给了骄傲。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "⚡",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "sanity": -10,
            "crew": -20
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_4",
      "title": "大事件四：风神岛 · 风袋",
      "quote": "“他们立即把风袋解开，各种狂风立即迸发，转瞬把他们又吹向海上，使他们流着眼泪，远离自己的故乡。” —— 卷十",
      "text": "埃俄罗斯将风暴收进一只牛皮袋，缚紧袋口交给你，又吹起西风送你归航。这些日夜，你亲自掌舵不肯合眼。直到故乡的山影浮现在海平线上——你终于松懈了片刻，倒在甲板上睡去。醒来时，狂风从船舱中炸裂，天海颠倒，浪墙高如山岳。你的船员们惊恐地望着那只被割开的空袋子，手中还攥着想象中的金子。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "food": -20,
            "crew": -10
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_5",
      "title": "大事件五：食人巨人 · 覆灭",
      "quote": "“他用那些人作了一顿令人伤心的晚餐。” —— 卷十",
      "text": "莱斯特律戈涅斯人的港湾如巨瓮般闭合。巨人从崖顶掷下巨石，船只像蛋壳般碎裂，船员被长叉刺穿擎起，尖叫着消失在巨口之中。船队顷刻间只剩你脚下这一艘。你挥剑砍断缆绳，单桨划出港湾，身后海面漂满碎木与染血的布条。你回头望了一眼——除了海风，什么都没有了。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "crew": -30
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_6",
      "title": "大事件六：喀耳刻 · 变猪",
      "quote": "“她把他们赶进猪圈，给他们橡子和山茱萸果，那是猪常卧在地上吃的食物。” —— 卷十",
      "text": "埃埃亚岛的林间升起炊烟。女巫喀耳刻笑脸相迎，端出乳酪、蜂蜜与醇酒——你的部下饮下后，顷刻间长出鬃毛，四肢着地，嘴里发出猪的哼叫。你握剑冲入厅堂，赫尔墨斯在途中截住你，递上一株黑色根茎的草药：“吃了它，她的魔药便伤不了你。”你逼迫喀耳刻解除魔法，那些猪变回人形伏地痛哭。但你也在岛上住满了一年——因为有些诱惑，你明知危险，仍会停留。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "sanity": -20
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_7",
      "title": "大事件七：冥府 · 预言",
      "quote": "“你想回去，但会遭到另一番艰险。” —— 卷十一",
      "text": "你凿开土地，以黑羊之血召引亡魂。先知忒瑞西阿斯的魂影从黑暗中浮起，杖触血泊开口：“你想回家——但太阳神的神牛不可触碰。你若守不住，全船覆灭；只有你一人，赤裸漂流，回到你的城邦。”亡母的幽魂也来了，她问你为何还漂泊在外，家中妻子如何苦等。你三次想拥抱她，双臂三次穿过虚空。冥府教会你一件事：活着的人，要珍惜还能拥抱的每一双手。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "sanity": -10,
            "luck": 10
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_8",
      "title": "大事件八：塞壬 · 自缚",
      "quote": "“你自己如果想听歌唱，可以叫同伴们把你站立，把手脚绑在快船桅杆的支架上。” —— 卷十二",
      "text": "海面上浮出翠绿的岛屿，歌声从礁石间渗出来——丝绸般滑入耳中，唱的是你母亲唤你乳名，是你妻子在灯下织布，是你儿子第一次喊“父亲”。你的骨头酥了，眼泪无端流下。你命令船员将你牢牢绑在桅杆上，“绑紧些，无论我怎样哀求，都不要松开。”船驶过那片海域时，你挣扎着、嘶吼着、哭喊着要扑向海中——绳索嵌入血肉，一滴一滴，落在甲板上。",
      "env": "sea",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "sanity": -20,
            "crew": -1
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_9",
      "title": "大事件九：斯库拉与卡律布狄斯 · 牺牲",
      "quote": "“她就这样把他们从船尾拖走，可怜的同伴们，他们仰头朝我呼喊，最后一次向我呼唤他们的名字。” —— 卷十二",
      "text": "左边是漩涡，深不见底，海水倒灌成无底之洞，连杉树都吞得下；右边是悬崖，洞中藏着六头海怪，每个头一口叼走一个人。你知道必须选。你选右边——因为你可以牺牲少数人，保全多数人。巨怪的头颅探出，六声惨叫同时响起，你的六名同伴被悬在半空，手臂向你伸来。你看着他们的眼睛，下令全速划桨。这就是掌舵者的代价：你选择了谁活，就等于选择了谁死。",
      "env": "sea",
      "specialNote": "注意：忠诚度低于百分之三十这里直接选左边——死亡结局",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "crew": -10,
            "loyalty": -10
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_10",
      "title": "大事件十：太阳神牛 · 覆灭",
      "quote": "“他们宰了太阳神赫利俄斯的牛群，他立即向宙斯大发雷霆。” —— 卷十二",
      "text": "特里那基亚岛上，金色的神牛悠闲啃草。你反复警告：谁也不能碰这些牛。但暴风困住船队一个月，粮食告罄，你的部下趁你睡着时宰杀了最肥壮的那头。你醒来时，烤肉的香气飘满海滩，太阳神在云中怒吼：“宙斯，为我复仇！”雷电劈碎桅杆，海水吞没所有面孔——你的同伴一个个沉入漩涡，手臂划着最后的弧线。幸存的人抱着碎裂的龙骨，在无边的大海上漂浮，祈祷着众神息怒。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "⚡",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "food": -30,
            "crew": -50
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_11",
      "title": "大事件十一：卡吕普索 · 七年",
      "quote": "“他正坐在海边哭泣，像往日一样，用泪水、叹息和痛苦折磨自己的心灵。” —— 卷五",
      "text": "你被冲上奥杰吉亚岛的沙滩时，神女卡吕普索救了你。她用蜜酒喂养你，用香膏涂抹你的伤口，用温热的身体陪你度过无数个夜晚。她说：“留下吧，忘记你来时的路。我会给你永生，让你永远不会老去、不会病痛、不会死在海上。”你起初摇头，日复一日望着海平线。后来你不再摇头了，只是沉默。月复一月，年复一年，你习惯了她的怀抱，习惯了岛屿的四季，习惯了不再数日子。直到某一天，你走到海边坐下，盯着远方的海面看了很久，忽然发现自己已经记不清妻子的脸。你痛哭起来，眼泪砸在沙上，一声一声，像锤子敲进石头里。永生？你宁愿要故乡的一捧尘土。你忘了从哪里来，但从未忘了自己是谁。最终，赫尔墨斯踏浪而来，传令放行。你砍树造筏，头也不回地驶向大海。",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "sanity": -30,
            "luck": 10
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "major_12",
      "title": "大事件十二：斯克里亚 · 援手",
      "quote": "“你从远方来到我们的城市和国土，不用再忍受任何苦难，我们会送你回去。” —— 卷七",
      "text": "木筏被波塞冬的巨浪撕碎，你赤身漂流两天两夜，被冲上斯克里亚岛的河口。你浑身是伤，用树叶蔽体，爬进灌木丛中昏睡。睡梦中被少女们的笑声惊醒——国王的女儿瑙西卡娅正在河边洗衣。你从树丛中走出，满身泥沙，却用最庄重的言辞向她求助。她给了你食物、衣裳、引你入宫。国王听完你的故事后说：“明天，我亲自送你回家。”",
      "env": "land",
      "specialNote": "",
      "isMajor": true,
      "icon": "🏛️",
      "choices": [
        {
          "text": "依循命数，沉着面对挑战",
          "hint": "面对命运的裁决",
          "deltas": {
            "food": 30,
            "luck": 20
          },
          "condition": null
        },
        {
          "text": "向同伴发出号令，拼死求生",
          "hint": "消耗体力，保全大局",
          "deltas": {
            "food": -10,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    }
  ],
  "SACRIFICES": [
    {
      "id": "sacrifice_1",
      "title": "一、祭祀 · 波塞冬 · 平息风暴",
      "god": "波塞冬",
      "icon": "🏛️",
      "prayer": "你命人牵出那头纯黑的公牛，四蹄在甲板上慌乱地蹬踏，牛角被月桂花环缠绕。刀刃划过喉咙的瞬间，你捧着流出的热血倾入海中，朝着铅灰色的天空高喊：“地动之神，黑发的波塞冬——我献上这头没有杂色的公牛，求你平息你的怒火。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "luck": 5,
        "loyalty": 5
      },
      "greatReward": {
        "luck": 9,
        "loyalty": 9
      }
    },
    {
      "id": "sacrifice_2",
      "title": "二、祭祀 · 雅典娜 · 求赐智慧",
      "god": "雅典娜",
      "icon": "🏛️",
      "prayer": "你献上的是一头没有伤疤的白色母羊，角上缠绕着橄榄枝。刀刃切开脖颈时，你口中默念的不仅仅是祷词——“灰眸的宙斯之女，你从未离开过我的船舷。请告诉我，下一步该踩在哪块石头上。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "sanity": 10,
        "luck": 5
      },
      "greatReward": {
        "sanity": 18,
        "luck": 9
      }
    },
    {
      "id": "sacrifice_3",
      "title": "三、祭祀 · 宙斯 · 乞求风暴止息",
      "god": "宙斯",
      "icon": "🏛️",
      "prayer": "你挣扎着爬向船头，颤抖的手将最后一头白牛的颈动脉割开，血液在暴雨中瞬间被冲散。你仰头大喊：“天父宙斯，云层的汇集者！我奥德修斯在你面前低头——请收回你的雷电，给我一个归家的机会。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "sanity": 5,
        "luck": 10
      },
      "greatReward": {
        "sanity": 9,
        "luck": 18
      }
    },
    {
      "id": "sacrifice_4",
      "title": "四、祭祀 · 阿波罗 · 祈求指引",
      "god": "阿波罗",
      "icon": "🏛️",
      "prayer": "你以月桂枝蘸水洒向祭坛石，献上一头角上缠着月桂枝的白色山羊——“光明之神，远射的阿波罗，请让迷雾散去，让我看见北方的星辰、东方的礁石、让我辨认这张海图上哪个标记靠近家乡。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "sanity": 5,
        "luck": 10
      },
      "greatReward": {
        "sanity": 9,
        "luck": 18
      }
    },
    {
      "id": "sacrifice_5",
      "title": "五、祭祀 · 赫耳墨斯 · 祈求通商",
      "god": "赫耳墨斯",
      "icon": "🏛️",
      "prayer": "你以蜜糖涂抹祭肉，点燃香草。赫耳墨斯是穿行于边界的神，是谈判者的庇护人——“长翅膀的神使，请让我的言辞如你的脚步般敏捷，让这些岛民的眼睛看到我带来的价值，而非我携带的刀剑。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "food": 10,
        "luck": 5
      },
      "greatReward": {
        "food": 18,
        "luck": 9
      }
    },
    {
      "id": "sacrifice_6",
      "title": "六、祭祀 · 得墨忒耳 · 祈求粮食",
      "god": "得墨忒耳",
      "icon": "🏛️",
      "prayer": "你捧着从船底搜刮出的最后一捧大麦，走到岸上的田野边，将麦粒撒向泥土——“金发的得墨忒耳，你让大地从冬日的荒芜中苏醒。我们需要的量很小——只要够活着撑到下一座城邦就好。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "food": 10,
        "sanity": 5
      },
      "greatReward": {
        "food": 18,
        "sanity": 9
      }
    },
    {
      "id": "sacrifice_7",
      "title": "七、祭祀 · 阿尔忒弥斯 · 狩猎祈求",
      "god": "阿尔忒弥斯",
      "icon": "🏛️",
      "prayer": "你带着弓箭手走到林边空地上，点燃月桂叶，献上一只雌鹿的初乳涂过的麦饼——“箭矢的射手，鹿群的女主人，我进入你的领地不是为了炫耀武力，而是为了养活船上的人。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "food": 10,
        "sanity": 5
      },
      "greatReward": {
        "food": 18,
        "sanity": 9
      }
    },
    {
      "id": "sacrifice_8",
      "title": "八、祭祀 · 阿瑞斯 · 战前求胜",
      "god": "阿瑞斯",
      "icon": "🏛️",
      "prayer": "你在战前献上一头红褐色的公牛，以火焰焚烧它的股骨与油脂——“执矛的阿瑞斯，战场上的铁面神！请让我们的剑比敌人的更快，让我们的盾比他们的更硬。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "luck": 5,
        "loyalty": 10
      },
      "greatReward": {
        "luck": 9,
        "loyalty": 18
      }
    },
    {
      "id": "sacrifice_9",
      "title": "九、祭祀 · 阿佛洛狄忒 · 祈求船员团结",
      "god": "阿佛洛狄忒",
      "icon": "🏛️",
      "prayer": "你在船头设下小小的香案，摆上蜂蜜、石榴与桃金娘花——“金冠的阿佛洛狄忒，你掌管人心中的爱意与柔软。请让我的船员们放下彼此的怨怼，让他们记住我们是同一条船上的人。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "sanity": 5,
        "loyalty": 10
      },
      "greatReward": {
        "sanity": 9,
        "loyalty": 18
      }
    },
    {
      "id": "sacrifice_10",
      "title": "十、祭祀 · 哈得斯 · 祈求亡魂安宁",
      "god": "哈得斯",
      "icon": "🏛️",
      "prayer": "你在冥府的入口处掘出一道浅沟，浇入蜜奶与葡萄酒，洒下大麦粉——“掌管亡灵的主宰，我与已逝的同伴们已言归于好。请关紧你的大门，不要让他们的魂影追随我的船尾。让生者前行，死者安眠。”",
      "cost": {
        "food": 5
      },
      "baseRate": 50,
      "standardReward": {
        "sanity": 10,
        "luck": 5
      },
      "greatReward": {
        "sanity": 18,
        "luck": 9
      }
    }
  ],
  "RANDOM_EVENTS": [
    {
      "id": "random_1",
      "num": "一",
      "title": "岛屿有人·与岛民贸易",
      "chapter": "第一章 · 岛屿有人·与岛民贸易",
      "env": "land",
      "landType": "human",
      "isStormOrDisoriented": false,
      "icon": "🏛️",
      "text": "岸边摆满了陶罐与铜器，岛民们赤足站在浅滩上，手中举着染色的织物与干鱼。你走上前，掂了掂手中从特洛伊带回的银杯。没有共同的语言，只有点头与反复比划。",
      "choices": [
        {
          "text": "用战利品换食物",
          "hint": "1、用战利品换食物：食物 +5%",
          "deltas": {
            "food": 5
          },
          "condition": null
        },
        {
          "text": "用战利品换药品",
          "hint": "用战利品换药品：食物 -5% | 忠诚 +10%",
          "deltas": {
            "food": 10,
            "loyalty": 10
          },
          "condition": {
            "minLoyalty": 80
          }
        }
      ]
    },
    {
      "id": "random_2",
      "num": "二",
      "title": "与海上民族海战",
      "chapter": "第二章 · 与海上民族海战",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "对方的船从雾中疾冲而出，甲板上站满了持弓的汉子。他们的首领用半生不熟的希腊语喊话：“留下三分之一的粮食，或者留下三分之一的命。”",
      "choices": [
        {
          "text": "交食物保平安",
          "hint": "1、交食物保平安：食物 -10%",
          "deltas": {
            "food": -10
          },
          "condition": null
        },
        {
          "text": "大胜",
          "hint": "1、大胜（判定）船员 -2 | 食物 +15%",
          "deltas": {
            "food": 15,
            "crew": -2
          },
          "condition": null
        },
        {
          "text": "惨胜",
          "hint": "2、惨胜（判定）船员 -5 | 食物 +10%",
          "deltas": {
            "food": 10,
            "crew": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_3",
      "num": "三",
      "title": "岛屿无人 · 捕猎",
      "chapter": "第三章 · 岛屿无人 · 捕猎",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "你带着弓箭手深入岛内，野山羊在溪对岸低头喝水。三支箭同时离弦。傍晚，篝火在沙滩上燃起，烤肉滴落的油脂在火星中滋滋作响。",
      "choices": [
        {
          "text": "单独狩猎",
          "hint": "1、单独狩猎：食物 +5%",
          "deltas": {
            "food": 5
          },
          "condition": null
        },
        {
          "text": "集体狩猎",
          "hint": "集体狩猎：食物 +10% | 精神 -5%",
          "deltas": {
            "food": 10,
            "sanity": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_4",
      "num": "四",
      "title": "不探索岛屿·无风停航",
      "chapter": "第四章 · 不探索岛屿·无风停航",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "海面静如铜镜，船帆低垂，寸步难行。你收桨入舱，所有人靠着船舷坐下。有人补帆，有人打盹，有人在削一根断桨。你坐在船头，双腿垂在舷外，阳光晒得眼皮发烫，耳边只有船板吱呀轻响。海上最珍贵的不是顺风，是什么都不用做的这一刻。",
      "choices": [
        {
          "text": "休整等待起风",
          "hint": "1、休整等待起风：食物 -5% | 精神 +5%",
          "deltas": {
            "food": -5,
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "组织检修船体",
          "hint": "2、组织检修船体：食物 -5％| 运气 +5%（忠诚高于80％解锁）",
          "deltas": {
            "food": -5,
            "luck": 5
          },
          "condition": {
            "minLoyalty": 80
          }
        }
      ]
    },
    {
      "id": "random_5",
      "num": "五",
      "title": "挽救落难的士兵",
      "chapter": "第五章 · 挽救落难的士兵",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "一个男人紧紧抱着残木，嘴唇发紫，眼睛半闭，已经漂了两天。你们将他捞上甲板，剥去湿衣，裹上羊毛毯。他睁开眼，第一句话是：“城邦……还在吗？”",
      "choices": [
        {
          "text": "收留漂流者",
          "hint": "1、 收留漂流者：船员 +1",
          "deltas": {
            "crew": 1
          },
          "condition": null
        },
        {
          "text": "将漂流者妥善安置",
          "hint": "将漂流者妥善安置：食物 -5％| 运气 +5%",
          "deltas": {
            "food": -5,
            "luck": 5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_6",
      "num": "六",
      "title": "岛屿有人·与岛民陆地作战",
      "chapter": "第六章 · 岛屿有人·与岛民陆地作战",
      "env": "land",
      "landType": "human",
      "isStormOrDisoriented": false,
      "icon": "🏛️",
      "text": "他们在黎明前包抄了营地。你抓起盾牌，高喊“列阵”，船员们背靠背站成圆。你盯着对方首领的眼睛，提剑向前迈了一步。",
      "choices": [
        {
          "text": "正面迎战",
          "hint": "1、正面迎战：船员 -1 | 食物 +10%",
          "deltas": {
            "food": 10,
            "crew": -1
          },
          "condition": null
        },
        {
          "text": "谈判求和",
          "hint": "谈判求和：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "诱敌深入（忠诚高于80％解锁）",
          "hint": "诱敌深入（忠诚高于80％解锁）",
          "deltas": {},
          "condition": {
            "minLoyalty": 80
          }
        },
        {
          "text": "大胜",
          "hint": "1、大胜（判定）船员 -1 | 食物 +15%",
          "deltas": {
            "food": 15,
            "crew": -1
          },
          "condition": null
        },
        {
          "text": "惨胜",
          "hint": "2、惨胜（判定）船员 -3 | 食物 +10%",
          "deltas": {
            "food": 10,
            "crew": -3
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_7",
      "num": "七",
      "title": "发现海难遗骸 · 宝藏与诅咒",
      "chapter": "第七章 · 发现海难遗骸 · 宝藏与诅咒",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "船桨碰到一块浮板，再往前，更多碎片漂过来。船员们从水下捞起一只铜箱，里面是金币与宝石。箱底刻着一行蚀刻文字——那是某个被诸神沉没的船队的标记。",
      "choices": [
        {
          "text": "拿走财物",
          "hint": "1、 拿走财物：食物 +5% | 运气 -5%",
          "deltas": {
            "food": 5,
            "luck": -5
          },
          "condition": null
        },
        {
          "text": "原样放回",
          "hint": "原样放回：运气 +5%",
          "deltas": {
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "祭祀诸神",
          "hint": "祭祀诸神：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_8",
      "num": "八",
      "title": "海上遇难者 · 真假难辨",
      "chapter": "第八章 · 海上遇难者 · 真假难辨",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "你们捞起一个浑身伤口的人，他醒来后先用陌生的语言哭喊，忽然转为流利的希腊语。他的故事太完整了，握剑的手茧出卖了他。",
      "choices": [
        {
          "text": "收留他",
          "hint": "1、收留他：船员 +1 | 忠诚 -5%",
          "deltas": {
            "crew": 1,
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "拒绝收留",
          "hint": "2、拒绝收留：无变化",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_9",
      "num": "九",
      "title": "漂流瓶 · 求救信",
      "chapter": "第九章 · 漂流瓶 · 求救信",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "渔网捞起一只陶瓶，里面是求救信：“我被囚于石塔……请告诉我的妻子……”去救他，意味着偏离航线；不去，那个人可能永远消失在海图上。",
      "choices": [
        {
          "text": "前往救援",
          "hint": "1、前往救援：忠诚度 +5% （概率遭遇大事件8、9 、海上民族）",
          "deltas": {
            "loyalty": 5
          },
          "condition": null
        },
        {
          "text": "放弃救援",
          "hint": "2、放弃救援：无变化",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_10",
      "num": "十",
      "title": "幻象岛屿 · 海市蜃楼",
      "chapter": "第十章 · 幻象岛屿 · 海市蜃楼",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "前方出现一座岛——绿树成荫，沙滩洁白。航行半个时辰后，它既不靠近也不远离。老水手说：“那是饿鬼岛——你朝它走一天，它离你一天；只有不看它，它才会消失。”",
      "choices": [
        {
          "text": "坚持追逐",
          "hint": "1、坚持追逐：食物 -5% （概率遭遇大事件8、9 、海上民族）",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "放弃追逐",
          "hint": "2、放弃追逐：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "祭祀破除幻象",
          "hint": "3、祭祀破除幻象：运气+10% | 食物 -5%（食物高于80%解锁）",
          "deltas": {
            "food": -5,
            "luck": 10
          },
          "condition": {
            "minFood": 80
          }
        }
      ]
    },
    {
      "id": "random_11",
      "num": "十一",
      "title": "船中瘟疫",
      "chapter": "第十一章 · 船中瘟疫",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "第一个人发热是在第三天。三天后，半个船舱的船员都在发颤，皮肤上出现暗红斑。你让人熏硫磺、焚烧药草。",
      "choices": [
        {
          "text": "休整治愈",
          "hint": "1、休整治愈： 船员痊愈 | 食物-10%",
          "deltas": {
            "food": -10
          },
          "condition": null
        },
        {
          "text": "隔离病患",
          "hint": "2、隔离病患： 船员-1—3人（判定）",
          "deltas": {
            "crew": -1
          },
          "condition": null
        },
        {
          "text": "割破小臂以血献祭",
          "hint": "3、割破小臂以血献祭",
          "deltas": {},
          "condition": null
        },
        {
          "text": "但你知道，诸神是否垂听你的献祭，取决于你的运气。",
          "hint": "但你知道，诸神是否垂听你的献祭，取决于你的运气。",
          "deltas": {},
          "condition": null
        },
        {
          "text": "血祭蒙允",
          "hint": "1、血祭蒙允（判定）：船员痊愈 | 精神值 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "血祭遭拒",
          "hint": "2、血祭遭拒（判定）：船员 -1人  | 精神值 -10%",
          "deltas": {
            "sanity": -10,
            "crew": -1
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_12",
      "num": "十二",
      "title": "海中巨兽 · 非敌非友",
      "chapter": "第十二章 · 海中巨兽 · 非敌非友",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🦈",
      "text": "海水隆起，一头巨大的黑影在笼罩整个船底。你和船员们握紧了手中的剑，但它没有撞你们，只是缓缓游在旁边。半个时辰后，它沉入深海。",
      "choices": [
        {
          "text": "保持航向",
          "hint": "1、保持航向： 精神值 -5% | 运气 +5%",
          "deltas": {
            "sanity": -5,
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "变向躲避",
          "hint": "变向躲避：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "献祭以表敬意",
          "hint": "献祭以表敬意：食物 -5% | 运气 +10%（食物高于80%解锁）",
          "deltas": {
            "food": -5,
            "luck": 10
          },
          "condition": {
            "minFood": 80
          }
        }
      ]
    },
    {
      "id": "random_13",
      "num": "十三",
      "title": "暴风雨后 · 星辰重认",
      "chapter": "第十三章 · 暴风雨后 · 星辰重认",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "风暴持续三天。云层裂开时，星空全换了——没有大熊座，没有猎户座。年轻船员哭喊：“我们被吹到世界尽头了。”老水手指着一颗极暗的星：“那是我们的北。”",
      "choices": [
        {
          "text": "依靠老水手的经验",
          "hint": "1、 依靠老水手的经验：精神值 -5% | 运气 +5%",
          "deltas": {
            "sanity": -5,
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "顺风漂流等待",
          "hint": "顺风漂流等待：食物 -5%（概率遭遇大事件8、9 、海上民族）",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_14",
      "num": "十四",
      "title": "漂流祭品 · 被献祭的少年",
      "chapter": "第十四章 · 漂流祭品 · 被献祭的少年",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "你们在浅滩发现一只木筏，上面躺着一个裹白布的少年，手腕有勒痕。他醒来后冷笑了一声：“神不要我——我的死不值得。”",
      "choices": [
        {
          "text": "收留少年",
          "hint": "1、 收留少年：船员 +1 | 运气 -5%",
          "deltas": {
            "luck": -5,
            "crew": 1
          },
          "condition": null
        },
        {
          "text": "将少年妥善安置",
          "hint": "将少年妥善安置：食物 -5%| 运气 +5%",
          "deltas": {
            "food": -5,
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "询问情报（运气高于80%解锁）",
          "hint": "询问情报（运气高于80%解锁）",
          "deltas": {},
          "condition": {
            "minLuck": 80
          }
        },
        {
          "text": "（跳转）你蹲下身，盯着那少年的眼睛",
          "hint": "（跳转）你蹲下身，盯着那少年的眼睛：“你的城邦在哪个方向？附近可有避风的港湾？”他沉默了很久，目光越过你的肩膀望向海面，久到你觉得他已经成为了一座雕塑。海风吹过他裹身的白布，他终于抬起手，指向你从未留意过的一个方向。",
          "deltas": {},
          "condition": null
        },
        {
          "text": "知无不言",
          "hint": "1、知无不言（判定成功）：运气 +5%（概率遭遇大事件1、12）",
          "deltas": {
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "缄口不言",
          "hint": "2、缄口不言（判定失败）：无变化",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_15",
      "num": "十五",
      "title": "平静之夜 · 水手故事",
      "chapter": "第十五章 · 平静之夜 · 水手故事",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "泊在无名海岸，风平浪息，水手们轮流讲起家乡传说——沉入海底的城市、变成海豚的女祭司。你望着星空，想起故乡的那些夜晚。",
      "choices": [
        {
          "text": "默默聆听",
          "hint": "1、默默聆听：精神值 +5%",
          "deltas": {
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "讲述特洛伊真实经历",
          "hint": "2、讲述特洛伊真实经历：忠诚度 +10% | 精神值 -5%",
          "deltas": {
            "sanity": -5,
            "loyalty": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_16",
      "num": "十六",
      "title": "陌生人求搭船",
      "chapter": "第十六章 · 陌生人求搭船",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "一个穿着破旧斗篷的人站在岸边招手。他说自己的船在风暴中沉没，愿意用一袋金币换一程船位。他的斗篷下有金属碰撞的声响——不像是金币。",
      "choices": [
        {
          "text": "同意搭船",
          "hint": "1、 同意搭船：食物 +5% | 忠诚度 -5% （判定是否转向海上民族）",
          "deltas": {
            "food": 5,
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "拒绝搭船",
          "hint": "拒绝搭船：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "仔细盘问（忠诚高于60％解锁）",
          "hint": "仔细盘问（忠诚高于60％解锁）",
          "deltas": {},
          "condition": {
            "minLoyalty": 60
          }
        },
        {
          "text": "（跳转）你上前一步，盯着他的眼睛",
          "hint": "（跳转）你上前一步，盯着他的眼睛：“解开斗篷。”他愣了一下，手指攥紧领口，金属碰撞声更响了。你没有移开目光，手按上了剑柄。他慢慢松开手，斗篷滑落。",
          "deltas": {},
          "condition": null
        },
        {
          "text": "他的腰上挂着常见的铜器，你们款待了落难的商人",
          "hint": "1、他的腰上挂着常见的铜器，你们款待了落难的商人：食物+5%",
          "deltas": {
            "food": 5
          },
          "condition": null
        },
        {
          "text": "他的腰上挂着染血的弯刀，你识破了海上民族的诡计",
          "hint": "2、他的腰上挂着染血的弯刀，你识破了海上民族的诡计：运气+5%",
          "deltas": {
            "luck": 5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_17",
      "num": "十七",
      "title": "海面浮油 · 鲸群迁徙",
      "chapter": "第十七章 · 海面浮油 · 鲸群迁徙",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "海水表面浮着一层暗色的油膜，远处有巨大的水柱喷向天空——一群鲸鱼正在前方迁徙。你们不得不绕行，却目睹了它们跃出水面的壮观景象。",
      "choices": [
        {
          "text": "绕行观赏",
          "hint": "1、绕行观赏： 精神值 +5% | 食物 -5%",
          "deltas": {
            "food": -5,
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "跟随鲸群（运气高于80%解锁）",
          "hint": "2、跟随鲸群（运气高于80%解锁）",
          "deltas": {},
          "condition": {
            "minLuck": 80
          }
        },
        {
          "text": "伴航同行",
          "hint": "1、伴航同行：无变化（概率遭遇大事件1、8、9 、12、海上民族）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "逐浪撒网",
          "hint": "2、逐浪撒网：食物+10%",
          "deltas": {
            "food": 10
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_18",
      "num": "十八",
      "title": "悬崖上的烽火",
      "chapter": "第十八章 · 悬崖上的烽火",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "夜晚的海面突然亮起火光，一明一灭——那似乎是请求救援的信号。但你没有收到过任何关于这里有友军的消息。",
      "choices": [
        {
          "text": "前往探查",
          "hint": "1、前往探查：（概率遭遇全部陆上大事件 、大事件12概率最小）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "无视火光",
          "hint": "2、无视火光：无变化",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_19",
      "num": "十九",
      "title": "洋流突变 · 被带离航道",
      "chapter": "第十九章 · 洋流突变 · 被带离航道",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌫️",
      "text": "船突然开始加速——海水正飞速涌向东南方向，你们的桨无法撼动激流。洋流将你们带离原定航向，送向一片完全陌生的海域。",
      "choices": [
        {
          "text": "停留等洋流平息并原路返回",
          "hint": "1、停留等洋流平息并原路返回：食物 -10%",
          "deltas": {
            "food": -10
          },
          "condition": null
        },
        {
          "text": "顺流航行",
          "hint": "2、顺流航行：无变化（概率遭遇大事件8、9、海上民族）",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_20",
      "num": "二十",
      "title": "偷窃事件 · 猜忌蔓延",
      "chapter": "第二十章 · 偷窃事件 · 猜忌蔓延",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "某天清早，一袋干粮不见了。没人承认。你让所有人站在甲板上，看着彼此的眼睛。沉默比风暴更可怕。",
      "choices": [
        {
          "text": "集体搜身",
          "hint": "1、 集体搜身：忠诚度 -10%",
          "deltas": {
            "loyalty": -10
          },
          "condition": null
        },
        {
          "text": "不予追究",
          "hint": "不予追究：忠诚度 -5%",
          "deltas": {
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "仔细调查",
          "hint": "仔细调查：精神 -5% | 忠诚度 +10%（忠诚高于60%解锁）",
          "deltas": {
            "sanity": -5,
            "loyalty": 10
          },
          "condition": {
            "minLoyalty": 60
          }
        }
      ]
    },
    {
      "id": "random_21",
      "num": "二十一",
      "title": "流星陨落",
      "chapter": "第二十一章 · 流星陨落",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌠",
      "text": "夜空中一道光划过，坠入远方的海面，比星光更亮，比雷电更安静。老水手说那是神明落下的信物。",
      "choices": [
        {
          "text": "视为吉兆",
          "hint": "1、视为吉兆：精神 +5%",
          "deltas": {
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "开始祭祀",
          "hint": "2、开始祭祀：食物 -5% （转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_22",
      "num": "二十二",
      "title": "浓雾 · 迷失",
      "chapter": "第二十二章 · 浓雾 · 迷失",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌫️",
      "text": "雾从四面升起，白得像浸了水的羊毛。五步之外看不见船头。所有人都放轻了声音，连桨都慢慢划——生怕惊动雾里藏着的东西。",
      "choices": [
        {
          "text": "下锚等待雾散",
          "hint": "1、 下锚等待雾散：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "低速缓慢航行",
          "hint": "低速缓慢航行：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_23",
      "num": "二十三",
      "title": "风暴·失去补给",
      "chapter": "第二十三章 · 风暴·失去补给",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌀",
      "text": "一个巨浪从侧面拍来，船身猛烈倾斜——绑在甲板上的几只水罐和粮袋滑入海中。你伸手去抓，只抓到一把湿漉漉的绳子。",
      "choices": [
        {
          "text": "接受损失",
          "hint": "1、接受损失：食物 -10%",
          "deltas": {
            "food": -10
          },
          "condition": null
        },
        {
          "text": "派人打捞",
          "hint": "派人打捞：（概率遭遇随机事件7、9、11）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "成功捕捞",
          "hint": "1、成功捕捞（判定）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "遭遇意外",
          "hint": "2、遭遇意外（判定）：船员-1",
          "deltas": {
            "crew": -1
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_24",
      "num": "二十四",
      "title": "飞鸟引路",
      "chapter": "第二十四章 · 飞鸟引路",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "一群海鸟从东南方向飞来，盘旋在你们船头上方，鸣叫着、折返着，像在示意什么。老水手说：“跟着鸟走，它们知道哪里有陆地。”",
      "choices": [
        {
          "text": "跟随飞鸟",
          "hint": "1、跟随飞鸟：可能遭遇岛屿随机事件、大事件8、9 与海上民族",
          "deltas": {},
          "condition": null
        },
        {
          "text": "不变航向",
          "hint": "2、不变航向：无变化",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_25",
      "num": "二十五",
      "title": "荒岛泉眼 · 清甜淡水",
      "chapter": "第二十五章 · 荒岛泉眼 · 清甜淡水",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "你在一座长满灌木的荒岛上发现了一眼泉，水从石缝中渗出，清冽甘甜。你的船员们扑上去埋头痛饮。",
      "choices": [
        {
          "text": "装满水罐",
          "hint": "1、装满水罐：精神值 +5%",
          "deltas": {
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "扎营休整",
          "hint": "扎营休整：精神值 +10% | 食物-5%",
          "deltas": {
            "food": -5,
            "sanity": 10
          },
          "condition": null
        },
        {
          "text": "在泉边留下祭品",
          "hint": "在泉边留下祭品：运气 +5% | 食物-5%",
          "deltas": {
            "food": -5,
            "luck": 5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_26",
      "num": "二十六",
      "title": "海藻陷阱 · 船底缠绕",
      "chapter": "第二十六章 · 海藻陷阱 · 船底缠绕",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "船速突然减慢，桨像插进了泥里。密密麻麻的海藻缠住了龙骨，厚得像一张网。全船的人趴在船舷上用刀割、用手扯，折腾了大半天才脱身。",
      "choices": [
        {
          "text": "原地休整",
          "hint": "1、原地休整：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "直接启航",
          "hint": "2、直接启航：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_27",
      "num": "二十七",
      "title": "夜梦神谕",
      "chapter": "第二十七章 · 夜梦神谕",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "你在船舱中沉沉睡去，梦见一个穿金袍的人站在海面上，背对着你。他没有回头，只说了句什么，可你已经记不清了。",
      "choices": [
        {
          "text": "顺其自然",
          "hint": "1、 顺其自然： 运气 +5%",
          "deltas": {
            "luck": 5,
            "loyalty": 5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "祭祀神明： 食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_28",
      "num": "二十八",
      "title": "火山喷发 · 远方红光",
      "chapter": "第二十八章 · 火山喷发 · 远方红光",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "午夜时分，南方的海平线骤然亮起一道暗红色的光，像大地裂开了一条缝。半个时辰后，你们听见了沉闷的轰鸣声，船板微微颤动。一座沉睡的火山苏醒了。",
      "choices": [
        {
          "text": "改变航向全速远离",
          "hint": "1、改变航向全速远离：无变化（概率遭遇大事件8、9、海上民族）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "观望后再决定",
          "hint": "2、观望后再决定：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_29",
      "num": "二十九",
      "title": "海豚引路",
      "chapter": "第二十九章 · 海豚引路",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🐬",
      "text": "一群海豚从船底浮上来，银灰色的背脊在阳光下闪闪发亮。它们在船头两侧游弋，时而跃出水面，时而潜入水底。你握紧舵柄，看着那些光滑的背脊劈开海浪，不紧不慢地引着你们穿过一片暗礁密布的海域。待你们安全通过，它们一个转身，消失在了深蓝之中。",
      "choices": [
        {
          "text": "继续航行",
          "hint": "1、继续航行：无影响",
          "deltas": {},
          "condition": null
        },
        {
          "text": "投食感谢",
          "hint": "2、投食感谢：运气 +5% | 食物 -5%",
          "deltas": {
            "food": -5,
            "luck": 5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_30",
      "num": "三十",
      "title": "天边彩虹",
      "chapter": "第三十章 · 天边彩虹",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "暴雨过后，一道彩虹横跨天际。船员们纷纷仰头看着，有人跪了下去。在古老的传说里，彩虹是神明与人之间的桥梁，是信使驻足的地方。你望着那道彩色的弧线，忽然觉得连日来的疲惫都轻了一些。",
      "choices": [
        {
          "text": "默默欣赏",
          "hint": "1、默默欣赏：精神值 +5%",
          "deltas": {
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "2、祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_31",
      "num": "三十一",
      "title": "发现古代墓葬",
      "chapter": "第三十一章 · 发现古代墓葬",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "你们刚上岸，一个船员一脚踩空，陷进了松软的土里——下面是一间石砌的墓室。火把照进去，里面散落着陶器、铜镜和一副腐朽的骸骨，手指上还戴着一枚刻着海浪纹的银戒。有人想拿走戒指，有人说动死者之物会遭诅咒。你站在墓室口，火光在骸骨的眼窝里跳动了一下。",
      "choices": [
        {
          "text": "拿走财物",
          "hint": "1、拿走财物：食物 +5% | 运气 -5%",
          "deltas": {
            "food": 5,
            "luck": -5
          },
          "condition": null
        },
        {
          "text": "直接离开",
          "hint": "2、直接离开：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "封回墓室",
          "hint": "3、封回墓室：运气 +5% （忠诚高于60%解锁）",
          "deltas": {
            "luck": 5
          },
          "condition": {
            "minLoyalty": 60
          }
        }
      ]
    },
    {
      "id": "random_32",
      "num": "三十二",
      "title": "船员争执 · 拔刀相向",
      "chapter": "第三十二章 · 船员争执 · 拔刀相向",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "收帆时，两个桨手因一块木板起了争执，一个说该修船首，一个说该补船尾。他们涨红了脸，刀出了鞘。周围的人纷纷退开，没人敢上前。你走过去，站在两人中间。海风吹过，帆布啪啪作响。你看着这两个被海困太久快要疯掉的年轻人。这一刻，船上的敌人不是风暴，不是海怪——是彼此。",
      "choices": [
        {
          "text": "强势镇压掌控局面",
          "hint": "1、强势镇压掌控局面：精神 +5% | 忠诚 -5%",
          "deltas": {
            "sanity": 5,
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "施以恩惠化解仇恨",
          "hint": "2、施以恩惠化解仇恨：忠诚 +5% | 食物 -5%",
          "deltas": {
            "food": -5,
            "loyalty": 5
          },
          "condition": null
        },
        {
          "text": "怀柔劝说",
          "hint": "3、怀柔劝说：忠诚度 +5% （忠诚高于60%解锁）",
          "deltas": {
            "loyalty": 5
          },
          "condition": {
            "minLoyalty": 60
          }
        }
      ]
    },
    {
      "id": "random_33",
      "num": "三十三",
      "title": "海面磷光",
      "chapter": "第三十三章 · 海面磷光",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "夜深无月，船行过一片幽暗的水域。忽然，船底亮起星星点点的蓝光，像无数萤火虫沉入海底。你探头望去——船桨划过的地方，水面泛起一圈圈银蓝色的涟漪，拖着长长的尾巴。整个海面像倒扣过来的星空，每一条波纹都在发光。船员们趴在船舷上，伸出手去捞那些光点，却只捞起一捧冰凉的水。有人轻声说，这是海中仙女洒下的泪珠。你望着那片寂静的荧光海面，觉得世上还有比战争更古老、更美的东西。",
      "choices": [
        {
          "text": "撒网捕鱼",
          "hint": "1、撒网捕鱼：食物 +5%",
          "deltas": {
            "food": 5
          },
          "condition": null
        },
        {
          "text": "欣赏美景",
          "hint": "2、欣赏美景：精神 +5%",
          "deltas": {
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "3、祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_34",
      "num": "三十四",
      "title": "岛屿祭坛 · 未名神明",
      "chapter": "第三十四章 · 岛屿祭坛 · 未名神明",
      "env": "land",
      "landType": "monster",
      "isStormOrDisoriented": false,
      "icon": "👁️",
      "text": "密林深处，藤蔓覆盖着一座古老的石砌祭坛，年代久远得连青苔都已经干涸成褐色的斑纹。祭坛上没有神像，没有铭文，只有一只粗陶碗，碗底残留着一层黑色的灰烬——不知是几十年前的祭品，还是几百年前的火种。你站在祭坛前，林中寂静，连鸟鸣都停了。你感觉到有什么东西在注视着你，古老、沉默，比奥林匹斯山上的名字更早。你犹豫了一下，该在这座祭坛上留下祭品，还是该转身离开？无论你做什么，这片密林都会记住你。",
      "choices": [
        {
          "text": "献上祭品",
          "hint": "1、献上祭品：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        },
        {
          "text": "转身离开",
          "hint": "2、转身离开：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "维护神坛",
          "hint": "3、维护神坛：运气 +10% |食物 -5%（食物高于80%解锁）",
          "deltas": {
            "food": -5,
            "luck": 10
          },
          "condition": {
            "minFood": 80
          }
        }
      ]
    },
    {
      "id": "random_35",
      "num": "三十五",
      "title": "船上老兵 · 旧伤复发",
      "chapter": "第三十五章 · 船上老兵 · 旧伤复发",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "一位老兵躺在船舱里，腿上的旧伤在潮湿的海风中重新溃烂，散发出腐肉的气味。他脸色灰白，汗水浸透了身下的褥子。你坐在他身边，握着他粗糙的手——这双手替你撑过桨、挡过刀、在风暴中死死抓住舵轮不肯松开。他睁开眼，看着你，嘴唇翕动了几下，声音弱得像风吹过桅顶：“船长……我还能撑到靠岸吗？”",
      "choices": [
        {
          "text": "全力救治",
          "hint": "1、全力救治：食物 -5% | 忠诚度 +5%（食物高于60%解锁）",
          "deltas": {
            "food": -5,
            "loyalty": 5
          },
          "condition": {
            "minFood": 60
          }
        },
        {
          "text": "任其自然",
          "hint": "2、任其自然：船员 -1",
          "deltas": {
            "crew": -1
          },
          "condition": null
        },
        {
          "text": "就近靠岸",
          "hint": "3、就近靠岸：（概率遭遇全部陆上大事件 、大事件12概率最小）",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_36",
      "num": "三十六",
      "title": "海面日食 · 天穹异变",
      "chapter": "第三十六章 · 海面日食 · 天穹异变",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "正午时分，日光毫无征兆地暗淡下去。你抬头——一轮黑影正缓缓吞噬太阳的边缘，天空从蔚蓝褪成铅灰，又从铅灰沉入墨色。星辰在青天白日中浮现，海面泛起一层诡异的古铜色光泽。船员们纷纷跪倒，有人在颤抖，有人在祈祷。海鸟惊叫着坠入水中。整个天地像被一只无形的手攥住了咽喉，安静得只剩下心跳声。",
      "choices": [
        {
          "text": "冷静观察，等待天光恢复",
          "hint": "1、冷静观察，等待天光恢复：精神值 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "下令敲击铜盾驱散黑暗",
          "hint": "2、下令敲击铜盾驱散黑暗：精神值 +5%（忠诚高于60%解锁）",
          "deltas": {
            "sanity": 5
          },
          "condition": {
            "minLoyalty": 60
          }
        },
        {
          "text": "祭祀神明",
          "hint": "3、祭祀神明：食物-5%（转向阿波罗祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_37",
      "num": "三十七",
      "title": "海中捞罐 · 意外之获",
      "chapter": "第三十七章 · 海中捞罐 · 意外之获",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "渔网拖上来的时候异常沉重，你以为是条大鱼。结果网底是一只半人高的陶罐，封口处涂着蜜蜡，缠着被海水浸透的棕绳。撬开一看，里面是满满的上好橄榄油，油面上还浮着几片干薄荷叶——在这个船上，一罐油比一罐金子更值钱。",
      "choices": [
        {
          "text": "将橄榄油分给船员食用",
          "hint": "1、将橄榄油分给船员食用：忠诚 +5%",
          "deltas": {
            "loyalty": 5
          },
          "condition": null
        },
        {
          "text": "将橄榄油用于祭祀储备",
          "hint": "2、将橄榄油用于祭祀储备：运气 +5%",
          "deltas": {
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "封好罐口留作食物储备",
          "hint": "3、封好罐口留作食物储备：食物 +5%",
          "deltas": {
            "food": 5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_38",
      "num": "三十八",
      "title": "漂流浮木 · 大海的馈赠",
      "chapter": "第三十八章 · 漂流浮木 · 大海的馈赠",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "船侧漂来一根巨大的浮木，被海浪打磨得光滑如骨，上面缠着灰色的藤壶与海藻。你命人用钩子拖近，发现它是一棵完整的松树树干——木质依然坚硬，没有腐朽的痕迹。有人提议劈了当柴烧，有人说可以做一根新桅杆。",
      "choices": [
        {
          "text": "劈作柴火",
          "hint": "1、劈作柴火：精神 +5%",
          "deltas": {
            "sanity": 5
          },
          "condition": null
        },
        {
          "text": "维修船体",
          "hint": "2、维修船体：运气 +5%",
          "deltas": {
            "luck": 5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_39",
      "num": "三十九",
      "title": "雷暴 · 桅杆断裂",
      "chapter": "第三十九章 · 雷暴 · 桅杆断裂",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌀",
      "text": "一道闪电劈在桅杆顶上，刺眼的电光瞬间吞噬了你的视野。紧接着是一声炸裂的巨响——主桅杆从中间折断，像一截被掰断的骨头，带着燃烧的帆布砸向甲板。火星四溅，浓烟翻滚，船员们尖叫着扑向火焰。等一切平息下来，你站在残破的桅杆旁，抬头望天。雨水砸在你的脸上，冰冷刺骨。",
      "choices": [
        {
          "text": "暂停航行，清理甲板",
          "hint": "1、 暂停航行，清理甲板：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "紧急修复，继续航行",
          "hint": "2、 紧急修复，继续航行：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_40",
      "num": "四十",
      "title": "海鸟来袭 · 偷食与惊扰",
      "chapter": "第四十章 · 海鸟来袭 · 偷食与惊扰",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "一群灰白色的海鸟从天而降，密密麻麻地落在船帆与船舷上，尖喙撕扯着悬挂的鱼干和晾晒的肉条。你冲过去挥舞剑鞘驱赶，鸟群尖叫着盘旋而起，翅膀拍打声震耳欲聋。等它们散去，甲板上只剩被啄烂的残渣、满地的鸟粪和几根脱落的灰色羽毛。",
      "choices": [
        {
          "text": "清理残局，抢救食物",
          "hint": "1、 清理残局，抢救食物：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "射杀鸟群",
          "hint": "2、 射杀鸟群：食物 +10% | 精神值 -5%（运气高于60%解锁）",
          "deltas": {
            "food": 10,
            "sanity": -5
          },
          "condition": {
            "minLuck": 60
          }
        }
      ]
    },
    {
      "id": "random_41",
      "num": "四十一",
      "title": "船体渗水 · 暗伤隐忧",
      "chapter": "第四十一章 · 船体渗水 · 暗伤隐忧",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌫️",
      "text": "你闻到一股不寻常的潮气——不是海风带来的那种，是从船底渗出来的，带着腐烂木材的酸味。你掀开底舱的木板，水已经没过了脚踝，冰冷刺骨。透过浑浊的海水隐约能看到一道从龙骨缝隙处蔓延开的细长裂纹，像一根缓缓吞下水痕的黑色血管。你蹲下身，指尖触到水面，冰凉从指尖爬到后颈。这艘船在你看不见的地方，悄悄开始散了。",
      "choices": [
        {
          "text": "立即抢修",
          "hint": "1、立即抢修：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "停航修理",
          "hint": "2、停航修理：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "就近靠岸",
          "hint": "3、就近靠岸：（概率遭遇全部陆上大事件 、大事件12概率最小）",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_42",
      "num": "四十二",
      "title": "思虑过重·力竭昏迷",
      "chapter": "第四十二章 · 思虑过重·力竭昏迷",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "你已经连续几天没有睡过一个完整的觉了。每一次闭眼，都会被浪声、雷声、特洛伊的喊杀声、桅杆的吱嘎声拽回甲板上。你靠在舵柄旁，眼皮重得像灌了铅，视线里海平线开始模糊、晃动、分裂成三条。你的手下走过来，握住舵柄说：“你去睡，我来替你。”你没有回答，因为你的耳朵里灌满了自己的心跳声。倒下前的一瞬，你看见他的嘴在动，但什么都听不见了。",
      "choices": [
        {
          "text": "休息静养，权力移交",
          "hint": "1、休息静养，权力移交：忠诚 -5%",
          "deltas": {
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "强行支撑，继续掌舵",
          "hint": "2、强行支撑，继续掌舵：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "3、祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_43",
      "num": "四十三",
      "title": "暴晒干渴 · 淡水告急",
      "chapter": "第四十三章 · 暴晒干渴 · 淡水告急",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "连续七天没有下雨。太阳像一块烧红的铁板钉在头顶，把甲板晒得开裂，连桅杆摸上去都烫手。你们的淡水存量在一天天蒸发，最后一桶水的水位已经低到桶底。一个年轻的桨手趴在船舷边，伸舌头舔舐船板上凝结的露珠。你看着他的背影，意识到一个比风暴更残酷的事实正在逼近——风暴好歹有尽头，而这片无云的天空，看不到任何尽头。",
      "choices": [
        {
          "text": "严格分配淡水，减少饮水",
          "hint": "1、严格分配淡水，减少饮水：忠诚 -5%",
          "deltas": {
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "就近靠岸",
          "hint": "2、就近靠岸：（概率遭遇全部陆上大事件 、大事件12概率最小）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "3、祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_44",
      "num": "四十四",
      "title": "浮尸载舟 · 瘟疫之兆",
      "chapter": "第四十四章 · 浮尸载舟 · 瘟疫之兆",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "你们在晨雾中发现一艘小船，没有帆，没有桨，船上堆着六具尸体，面朝上，面色灰白。老水手凑近看了看，低声说了一句：“瘟疫。”你勒紧了领口，但海风已经把那艘船的气息吹了过来——某种介于腐烂和药草之间的气味，让你后颈的寒毛一根根竖了起来。你意识到，这艘船也许不仅仅是一艘浮尸船，它可能来自你们即将靠岸的方向，也可能把什么东西留在了你们经过的水域里。",
      "choices": [
        {
          "text": "焚毁小船后快速通过",
          "hint": "1、焚毁小船后快速通过：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "折返，远离此地",
          "hint": "2、折返，远离此地：食物 -5%（概率遭遇大事件8、9、海上民族）",
          "deltas": {
            "food": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_45",
      "num": "四十五",
      "title": "深夜低语 · 暗礁传音",
      "chapter": "第四十五章 · 深夜低语 · 暗礁传音",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌫️",
      "text": "夜深无风，海面平整得不像真的。你忽然听见一个声音从船底传来——低沉的，像是有人在水中说话，每一个词都被海水泡得发胀。你趴在船舷上听了几遍，隐约听出一句完整的：“…礁石上有一面盾牌，刻着你的名字…”你抬起头，前方的海面泛着一种不自然的暗蓝色。船上所有人都听到了那个声音——从那些据说藏在暗礁群中、靠吞食回声活着的古老东西那里传来的。你握紧舵柄，发现自己正在驶向一个海图上不存在的位置，而身后所有的星座都沉默不语。",
      "choices": [
        {
          "text": "朝声音来源方向探查",
          "hint": "1、朝声音来源方向探查：（概率触发所有大事件）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "改变航向",
          "hint": "2、改变航向：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        },
        {
          "text": "原地休整",
          "hint": "3、原地休整：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_46",
      "num": "四十六",
      "title": "岛礁哨塔 · 烽烟示警",
      "chapter": "第四十六章 · 岛礁哨塔 · 烽烟示警",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "你远远看见一座陡峭崖壁上的石砌哨塔，塔顶正冒着黑烟——不是炊烟那种缓缓散开的烟，而是一道又直又浓的、笔直刺向天空的烟柱。在海上，这种烟只有一种含义：危险警告。但你的淡水已经低到桶底，再不下船补给，全船都要渴死。你盯着那道烟柱，它一动不动，像是被钉在天空里，目光都烧得发烫——危险和必要，此刻站在同一条船上，等着你向其中一侧倾斜。",
      "choices": [
        {
          "text": "冒险靠岸",
          "hint": "1、冒险靠岸：（概率触发所有除12外的陆上大事件）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "放弃靠岸",
          "hint": "2、放弃靠岸：忠诚 -5%",
          "deltas": {
            "loyalty": -5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "3、祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_47",
      "num": "四十七",
      "title": "荒岛炊烟",
      "chapter": "第四十七章 · 荒岛炊烟",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "清晨，船的前方出现一座岛——密林苍翠，沙滩洁白，一座洁白的小屋坐落在山坡上，屋顶升起一缕细细的炊烟。空气里飘来烤面包和蜂蜜的香气。你的船员们开始放下桨，有人已经站到了船舷边，眼神发直，像是被什么拽住了视线。那座岛太安静了，连海鸟的叫声都没有，但它的海岸线看起来柔软得像一张敞开的床。你的手停在舵柄上——你知道海上没有这样的好事，但你的双脚却好像已经不受控制。",
      "choices": [
        {
          "text": "远离岛屿",
          "hint": "1、远离岛屿：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "派人侦察",
          "hint": "2、派人侦察（判定）：船员-2 或 食物+10%",
          "deltas": {
            "food": 10,
            "crew": -2
          },
          "condition": null
        },
        {
          "text": "直接登陆（概率触发所有陆上大事件、12概率最小）",
          "hint": "3、直接登陆（概率触发所有陆上大事件、12概率最小）",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_48",
      "num": "四十八",
      "title": "废弃港口 · 空船林立",
      "chapter": "第四十八章 · 废弃港口 · 空船林立",
      "env": "land",
      "landType": "human",
      "isStormOrDisoriented": false,
      "icon": "🏛️",
      "text": "你发现一个隐蔽的海湾，港口里停着七八艘完好无损的船，船帆齐整，缆绳系得一丝不苟，像是昨天才靠岸的——但码头上一个人也没有。你登上其中一艘，舱内的桌子上还摆着吃了一半的面包和酒碗，酒水干涸在碗底，面包上落了一层灰白色的霉。这里像所有人同时放下手中的事情，忽然消失了。你合上舱门时，木轴发出生涩的转动声，声音在空荡荡的港口里回荡了许久。",
      "choices": [
        {
          "text": "远离港口",
          "hint": "1、远离港口：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "派人侦察",
          "hint": "2、派人侦察（判定）：船员-2 或 食物+10%",
          "deltas": {
            "food": 10,
            "crew": -2
          },
          "condition": null
        },
        {
          "text": "直接登陆（概率触发所有陆上大事件、12概率最小）",
          "hint": "3、直接登陆（概率触发所有陆上大事件、12概率最小）",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_49",
      "num": "四十九",
      "title": "血月倒影",
      "chapter": "第四十九章 · 血月倒影",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": true,
      "icon": "🌫️",
      "text": "你从睡梦中被唤醒，发现整个船舱浸在一层暗红色的光芒里。爬到甲板上，你看见一轮巨大的血月低悬在海面上，把整片海域染成锈红。海面纹丝不动，桨叶划过水面时不发出任何声响。你感觉到一种凝滞的寂静落在你肩头，像是有什么东西正在云层后面俯视着你们，正在安静地等待你们在红色海面上转弯或停下。",
      "choices": [
        {
          "text": "向血月航行",
          "hint": "1、向血月航行：（概率遭遇大事件8、9、海上民族）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "远离血月",
          "hint": "2、远离血月：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "祭祀神明",
          "hint": "3、祭祀神明：食物 -5%（转向祭祀事件、精神高于60%解锁）",
          "deltas": {
            "food": -5
          },
          "condition": {
            "minSanity": 60
          }
        }
      ]
    },
    {
      "id": "random_50",
      "num": "五十",
      "title": "鲨海求生",
      "chapter": "第五十章 · 鲨海求生",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🦈",
      "text": "船尾的海水忽然沸腾起来，几道暗灰色的背鳍切开水面，绕着你们的船缓缓打转。有人往海里扔了一块吃剩的骨头，水花翻涌间，你看见一条鲨鱼翻身露出白腹，一口咬碎骨骼，随即被同伴挤开。它们不吃骨头，但闻到了船上可能有的血腥。老水手靠在船舷边低声说了一句：“要是有人落水，它们会把那人撕成碎片。所以别出声，也别流血。”",
      "choices": [
        {
          "text": "保持安静、等待鲨群散开",
          "hint": "1、保持安静、等待鲨群散开：精神 -5%",
          "deltas": {
            "sanity": -5
          },
          "condition": null
        },
        {
          "text": "投喂肉块诱饵、快速驶离",
          "hint": "2、投喂肉块诱饵、快速驶离：食物 -5%",
          "deltas": {
            "food": -5
          },
          "condition": null
        }
      ]
    },
    {
      "id": "random_51",
      "num": "五十一",
      "title": "洞穴壁画 · 先民的航路",
      "chapter": "第五十一章 · 洞穴壁画 · 先民的航路",
      "env": "land",
      "landType": "uninhabited",
      "isStormOrDisoriented": false,
      "icon": "🏝️",
      "text": "你们在一座荒岛深处的洞穴里发现了一面巨大的壁画，赭红色的颜料画满了整片岩壁——船只、海浪、手持三叉戟的巨大人影、一串朝同一个方向蜿蜒排列的圆点。那些圆点像一串脚印，又像一座岛屿的清单，沿着海岸线向西北延伸。你盯着壁画看了很久，意识到这不是祭神的图画，是一张地图。",
      "choices": [
        {
          "text": "临摹壁画",
          "hint": "1、临摹壁画：运气+5%",
          "deltas": {
            "luck": 5
          },
          "condition": null
        },
        {
          "text": "按壁画航行",
          "hint": "2、按壁画航行：（概率触发所有大事件、12概率最小）",
          "deltas": {},
          "condition": null
        }
      ]
    },
    {
      "id": "random_52",
      "num": "五十二",
      "title": "舰队残骸",
      "chapter": "第五十二章 · 舰队残骸",
      "env": "sea",
      "landType": null,
      "isStormOrDisoriented": false,
      "icon": "🌊",
      "text": "日落时分，你们的船队正沿着一条开阔航道缓缓前进。忽然，前方海面浮现出一大片散落的浮木，在晚霞中像一片被切开的血肉缓缓扩散。你透过逐渐变暗的光线辨认出那些残骸的轮廓——折断的桅杆、碎裂的龙骨、烧焦的帆布，还有一艘半沉的战舰，船身上插着三支折断的投矛，尾部的舵轮已经被烧成炭黑色。这曾经是一支舰队，现在它正在你眼前缓慢旋转，像一个不肯松口的承诺。",
      "choices": [
        {
          "text": "举行海葬仪式",
          "hint": "1、举行海葬仪式：忠诚、精神+5% |食物 -5%（食物高于60%解锁）",
          "deltas": {
            "food": -5,
            "sanity": 5
          },
          "condition": {
            "minFood": 60
          }
        },
        {
          "text": "直接驶离",
          "hint": "2、直接驶离：无变化",
          "deltas": {},
          "condition": null
        },
        {
          "text": "搜索幸存者和物资",
          "hint": "3、搜索幸存者和物资（判定）",
          "deltas": {},
          "condition": null
        },
        {
          "text": "解救幸存者",
          "hint": "1、解救幸存者：船员+1到3",
          "deltas": {
            "crew": 1
          },
          "condition": null
        },
        {
          "text": "补充物资",
          "hint": "2、补充物资：食物+5%",
          "deltas": {
            "food": 5
          },
          "condition": null
        },
        {
          "text": "概率遭遇大事件5、9、10、海上民族",
          "hint": "3、概率遭遇大事件5、9、10、海上民族",
          "deltas": {},
          "condition": null
        }
      ]
    }
  ],
  "SIGHTS": [
    {
      "id": "sight_1",
      "title": "见闻1：沉钟鸣响 · 水下城邦",
      "text": "你们在无风的海面上停泊时，所有人同时听见了一声钟响——沉，闷，像是从极深的水底传上来的，隔着几百腕尺的海水依然能感觉到胸腔的震动。你趴在船舷上望下去，幽蓝的海水深处隐约有一片形状规整的阴影，像是倒塌的拱顶，又像是一排被海藻覆盖的石柱。钟声不是来自某座岛，而是来自脚下这片深不可测的海。你意识到自己正泊在一座消失的城邦上方，它正在你的脚下沉睡。那些曾经在这里走过街道、贩卖鱼货、在日落时分关上木窗的人，如今早已连名字都不剩了。只有钟声还在，像一个不肯闭上的嘴。",
      "icon": "📜"
    },
    {
      "id": "sight_2",
      "title": "见闻2：礁石上的王座",
      "text": "你在退潮时看见一块礁石顶端被磨平了，像一把椅子的坐面，两侧还有矮矮的扶手，被海风侵蚀了不知多少年。没有铭文，没有标记，不知道是谁坐在这里，也不知道他为什么要坐在这样一片荒芜的海中央，面朝永远不变的浪。你盯着它看了很久，忽然觉得那不是王座，是某个人故意留下来的记号——他的国已经沉了，但他不肯走，就坐在那里，把自己坐成了礁石。",
      "icon": "📜"
    },
    {
      "id": "sight_3",
      "title": "见闻3：飞鸟",
      "text": "清晨，一只白色的海鸟落在你的船舷上，脚上系着一根细细的红绳，绳子的另一端已经断了，断口参差不齐。它看着你，歪了歪头，像是认错了人。你伸手想解下那根红绳，它却忽然展翅飞走了，绕着桅杆转了三圈，然后朝着太阳的方向飞去。你不知道它来自哪里，也不知道它要找谁。但你忽然想，也许这世界上所有的信使都在送一封永远送不到的信。",
      "icon": "📜"
    },
    {
      "id": "sight_4",
      "title": "见闻4：灯塔废墟 · 守夜人的最后一日",
      "text": "你在一座荒岛的岬角上发现了一座灯塔，底部已经塌了一半，石缝里长满了干枯的荆棘。塔顶的铁笼还悬在那里，像是仍然囚禁着光明。你走进去时，脚下的石板发出空洞的回响——下面有东西。你撬开石板，发现一卷羊皮纸，上面只有一行字：“我守了四十七年，今晚换你来。”落款处没有名字。你把它放回了原处，仔细地合上石板。四十七年不是一段可以轻易带走的东西。",
      "icon": "📜"
    },
    {
      "id": "sight_5",
      "title": "见闻5：两枚硬币 · 冥河的船资",
      "text": "你的渔网拖上一只紧闭的陶罐，里面没有遗骨，只有两枚银币，面朝下，肩并肩躺在一起。这种放法只有一种人会用——那些替死者付过渡费的人，他们不把钱放在死者嘴上，而是放在一只罐子里，然后沉入海中，意思是：如果冥河涨潮，这钱随水漂去，谁捡到谁替他给卡戎。你握着两枚银币，发现上面的刻纹已经被水蚀得很浅了，但你仍然能看见一张面孔——不是神，不是王，是一张普通的、长着胡须的老人的脸。你看了一会儿，把银币放了回去，重新封好罐口，投回海中。他的船资已经等了够久。",
      "icon": "📜"
    },
    {
      "id": "sight_6",
      "title": "见闻6：船舷刻痕 · 谁来过的记号",
      "text": "你在修补船舷时，发现木板内侧有一排刻痕，粗粗细细，深浅不一，像是有很多人用刀刃在上面划下过自己的记号。有的刻着名字的首字母，有的刻着一只船锚，有的刻着一个你从没见过的符号——一个圆环中间加一道横线，像是一扇被关上的门。你数了数，密密麻麻，已经数不清了。但你知道，每一道都是一个人在这条船上留下的痕迹。你忽然想起这艘船不是你造的，你已经不是第一个坐在这个舵位上的人了。你伸手摸了摸其中一道刻痕，刀锋很浅，年代久远，指尖却仍在微微发烫。有人在你的故事之前，就曾坐在这里想过同一件事。",
      "icon": "📜"
    },
    {
      "id": "sight_7",
      "title": "见闻7：雾中诸神 · 沉默的目光",
      "text": "那是浓雾最重的一个早晨，你站在船头，看见雾中隐约立着几个高大的影子——轮廓清晰，却始终不散。你揉了揉眼睛，它们还在。它们的比例不对，腰身太直，肩线太平，像一座座被风削歪的崖壁。老水手低声说了一句：“别喊它们。”有船员似乎本来想问为什么，但话到嘴边又咽了回去。你忽然明白，你看见的不是人，也不是神——是这片海自己站起来看了你一眼。",
      "icon": "📜"
    },
    {
      "id": "sight_8",
      "title": "见闻8：特洛伊的盐 · 战争的余味",
      "text": "风转向的时候，你闻到一股熟悉的味道——烧过的木料、干涸的血、灰尘和汗水混在一起的涩味。那是特洛伊的味道。你转头望去，海面上什么也没有，但那股味道却持续了很久，像是被风从很远很远的地方带过来的。你最终没有找到它的来处，但你知道，有些味道是永远不会散掉的，它们会在某个无风的午后重新浮起来，贴在你和所有经历过那段历史的人的鼻腔后壁。",
      "icon": "📜"
    },
    {
      "id": "sight_9",
      "title": "见闻9：返乡者 · 无法被认出的脸",
      "text": "你靠岸时遇到了一个老人，他问你从哪来，你说是从海上回来的。他点了点头，又问：“你认识一个叫（玩家名字）的人吗？”你愣了一下，还没来得及回应。”他叹了口气：“人们说他走了二十年了，他的狗都死了三茬了。”说完他转身走了，没有问你叫什么，没有问你是不是来自特洛伊，没有问你是不是他等的那个人。你看着他走远，忽然觉得——也许这个世界上最大的孤独不是没有人认出你，而是有人已经认出你了，但他不敢说，怕认错。",
      "icon": "📜"
    },
    {
      "id": "sight_10",
      "title": "见闻10：海平线 · 永不抵达的地方",
      "text": "你在黄昏时望着海平线，它把天和水裁开，锋利得像一刀切的。你忽然意识到，你其实从来没有真正到达过海平线——你朝它走了二十年，它退了二十年，永远隔着同一段距离。也许所有的远航都是这样的。你以为自己在接近什么，其实只是在用一生证明有些东西是永远追不上的。但你还是会继续划下去，因为回家的方向就是海平线延伸的方向，你一步踏进水里，它就向后闪避一步；你每一次靠岸，它都在更远的地方重新现身。可你还在划——也许不是为了抵达，只是为了证明你还在往那个方向走。",
      "icon": "📜"
    },
    {
      "id": "sight_11",
      "title": "见闻11：群星沉默 · 我们只是路过",
      "text": "你躺在甲板上仰望星空，辨认出那些在海上被千万人看了千年的星辰——猎户在南方斜挎着腰带，大熊绕着天顶缓缓打转，它们和十年前你在家乡山顶仰望时一模一样。你忽然意识到，这些星星比你见过的任何一座城、任何一场战役都要古老，它们在特洛伊建立之前就在那里了，在第一批桨手把船推出沙地之前就在那里了，在你出生之前、在你祖父出生之前、在人类第一次学会对着海面哭泣之前就在那里了。你忽然觉得，自己在风浪中拼死守护的一切——家园、荣耀、活着的运气——在这些沉默的光点下面，轻得像一片坠落的灰烬。你认识它们，它们却从未认识你。明天你会继续掌舵、继续划桨、继续为食物和淡水争执，就像你的祖先做过的那样。但此刻你忽然想，也许一辈子生活在自己家乡的星空下、从未见过另一片夜空的人，并不知道自己有多渺小。而你此刻正躺在甲板上，被无边无际的陌生包裹着，终于知道这片海不是为你准备的。",
      "icon": "📜"
    },
    {
      "id": "sight_12",
      "title": "见闻12：岸边的矛尖 · 战争的孩子",
      "text": "你在一片无名的沙滩上发现了一支斜插在沙里的矛尖，锈得发红，木杆已经烂掉了一半，只有刃尖还露出地面，像一株长错了地方的铁草。你蹲下来想拔它，却发现它插得很深——不是用力掷进去的，是被人插进土里的，插得很深、很用力，像某个人做完某件事之后把东西留在那里，再也没回来取过。你忽然想，能拿起这支矛的人，已经不在了。但你不知道那个人的名字，不知道他有多高，不知道他死的时候几岁，不知道他有没有妻子和孩子在等他。不知道那根矛上有没有沾过血。你把它留在了原地。它已经不需要主人了。",
      "icon": "📜"
    }
  ],
  "ACHIEVEMENTS": [
    {
      "id": "ach_start",
      "category": "启程与归来",
      "name": "启航",
      "icon": "🔥",
      "hint": "开启新的远航，率队自特洛伊余烬中拔锚启程。",
      "desc": "特洛伊的硝烟渐渐沉入海平线，三十名同胞把身家性命交到了你的手中。",
      "quote": "“归途易得，归己最难。”"
    },
    {
      "id": "ach_end_survivor",
      "category": "启程与归来",
      "name": "上岸",
      "icon": "⚓",
      "hint": "达成【上岸 · 极少数船员】结局。",
      "desc": "残破的船骸撞上浅滩，身后只有稀落的几双靴子踩上故土泥沙。",
      "quote": "“进屋吧，汤还热着。”"
    },
    {
      "id": "ach_end_return",
      "category": "启程与归来",
      "name": "回家",
      "icon": "🏡",
      "hint": "达成【回家 · 中等船员】结局。",
      "desc": "晨雾散尽，你扶着忠勇的弟兄踏上故土，万家灯火在山坡上点亮。",
      "quote": "“你完成了一次真正意义上的回家。”"
    },
    {
      "id": "ach_end_triumphant",
      "category": "启程与归来",
      "name": "凯旋",
      "icon": "👑",
      "hint": "达成【凯旋 · 众多船员】传奇结局（船员≥22，忠诚≥65，理智≥50）。",
      "desc": "战船满载荣耀与生还的兄弟，整座城邦鸣钟欢呼你的名字。",
      "quote": "“我们跨过了冥河，站在了自己的土地上！”"
    },
    {
      "id": "ach_end_death_sea",
      "category": "启程与归来",
      "name": "魂归海洋",
      "icon": "💀",
      "hint": "在远航中遭遇船员尽墨或理智彻底归零的绝境。",
      "desc": "幽暗的海流将破损的龙骨托向深渊，水手们化作古老海歌的一段回响。",
      "quote": "“众神编织苦难，是为了让后人有一首歌可以唱。”"
    },
    {
      "id": "ach_end_death_land",
      "category": "启程与归来",
      "name": "魂归大地",
      "icon": "⚔️",
      "hint": "在远航中遭遇全船忠诚崩塌兵变。",
      "desc": "刀剑在血阳下折断，你不后悔选择战斗，只是归途终于永远留在了路上。",
      "quote": "“人无法躲过自己的命运，但可以选择如何面对它。”"
    },
    {
      "id": "ach_major_1",
      "category": "史诗大事件",
      "name": "贪欲的回响",
      "icon": "🏛️",
      "hint": "经历大事件一：伊斯马罗斯 · 掠夺与反噬。",
      "desc": "城邦的黄金美酒诱惑人心，但贪婪必然引来长矛与复仇的号角。",
      "quote": "“我主张赶快逃走，可是这些愚蠢的人不肯听从。” —— 卷九"
    },
    {
      "id": "ach_major_2",
      "category": "史诗大事件",
      "name": "甜蜜的遗忘",
      "icon": "🍇",
      "hint": "经历大事件二：忘忧果岛 · 遗忘。",
      "desc": "甘甜的果肉能抹去一切乡愁与苦难，唯有清醒之人备受煎熬。",
      "quote": "“他们中的任何人如果尝了这种果实，便不再想回来报告，也不想返回故里。” —— 卷九"
    },
    {
      "id": "ach_major_3",
      "category": "史诗大事件",
      "name": "独眼之血",
      "icon": "👁️",
      "hint": "经历大事件三：独眼巨人 · 刺目。",
      "desc": "在幽暗血腥的洞窟中以灼热木桩刺瞎狂暴巨人，却唤醒了海神的震怒。",
      "quote": "“记住刺瞎你的人是奥德修斯！” —— 卷九"
    },
    {
      "id": "ach_major_4",
      "category": "史诗大事件",
      "name": "埃俄罗斯的馈赠",
      "icon": "💨",
      "hint": "经历大事件四：风神岛 · 封风。",
      "desc": "九重狂风被收拢于金绳牛皮袋中，距离家乡仅一箭之遥，猜忌却撕裂了一切。",
      "quote": "“狂暴的风暴冲出来，把他们重新卷向大海，远离故土。” —— 卷十"
    },
    {
      "id": "ach_major_5",
      "category": "史诗大事件",
      "name": "食人的港湾",
      "icon": "🪨",
      "hint": "经历大事件五：莱斯特律戈涅斯 · 绝境。",
      "desc": "巨石如雨倾泻而下，木碎骨裂，那是大海对冒进者最残忍的杀戮。",
      "quote": "“他们像叉鱼一样把人叉起来，带回去当作可口的饭食。” —— 卷十"
    },
    {
      "id": "ach_major_6",
      "category": "史诗大事件",
      "name": "橡子与魔药",
      "icon": "🧪",
      "hint": "经历大事件六：喀耳刻 · 变形。",
      "desc": "蜜酒混杂着使人忘记乡土的魔药，唯有神赐的白花能斩断魔女的咒术。",
      "quote": "“她用手杖敲打他们，把他们关进猪圈；他们全变成了猪的模样。” —— 卷十"
    },
    {
      "id": "ach_major_7",
      "category": "史诗大事件",
      "name": "死者的忠告",
      "icon": "🕯️",
      "hint": "经历大事件七：冥府召魂 · 预言。",
      "desc": "黑羊之血引来阴间无数飘荡的游魂，盲眼先知说出了归途最沉重的戒律。",
      "quote": "“即使你本人得以逃脱，你也将在晚年痛苦地回到故乡，丧失全部同伴。” —— 卷十一"
    },
    {
      "id": "ach_major_8",
      "category": "史诗大事件",
      "name": "塞壬的挽歌",
      "icon": "🎶",
      "hint": "经历大事件八：塞壬海妖 · 诱惑。",
      "desc": "白骨堆上的魔音比美酒更甜，将自己死死缚在桅杆上，方能听见神性的歌声。",
      "quote": "“快来吧，光荣的奥德修斯……停下你的船，听听我们的歌声。” —— 卷十二"
    },
    {
      "id": "ach_major_9",
      "category": "史诗大事件",
      "name": "掌舵者的决断",
      "icon": "🌀",
      "hint": "经历大事件九：斯库拉与卡律布狄斯 · 抉择。",
      "desc": "左侧是大漩涡吞噬整条战船，右侧是六头妖兽各攫一人——指挥官必须做出生死的割舍。",
      "quote": "“失去六个伙伴，总比全船覆没要好。” —— 卷十二"
    },
    {
      "id": "ach_major_10",
      "category": "史诗大事件",
      "name": "太阳神的审判",
      "icon": "🐂",
      "hint": "经历大事件十：特里纳基亚岛 · 太阳神的牛。",
      "desc": "饥饿迫使水手对神圣牛群举起屠刀，穿透肉块的雷鸣预示着全军覆没的审判。",
      "quote": "“他们杀死了高悬天空的太阳神的牛，太阳神夺去了他们回归的日子。” —— 卷一"
    },
    {
      "id": "ach_major_11",
      "category": "史诗大事件",
      "name": "卡吕普索的囚笼",
      "icon": "🏝️",
      "hint": "经历大事件十一：奥古吉亚岛 · 七年。",
      "desc": "长生不老与仙岛美景无法填补心中的空虚，英雄面向汪洋泪流满面。",
      "quote": "“他的眼睛从没有干过眼泪，他甜蜜的生命在思念故乡中渐渐消磨。” —— 卷五"
    },
    {
      "id": "ach_major_12",
      "category": "史诗大事件",
      "name": "斯克里亚的援手",
      "icon": "⛵",
      "hint": "经历大事件十二：斯克里亚岛 · 归程。",
      "desc": "善良好客的费阿基亚人备下快船，沉睡之中，你终于被安全送抵故乡海湾。",
      "quote": "“船飞快地向前奔跑，即使天上飞得最快的鹰也赶不上它。” —— 卷十三"
    },
    {
      "id": "ach_first_sight",
      "category": "见闻与历程",
      "name": "沉默的见证者",
      "icon": "📜",
      "hint": "首次在航行中发现并解锁一篇航海见闻录。",
      "desc": "你看见了海上那些从未被写进航海日志的东西——从今往后，风在你眼中有了另一层含义。",
      "quote": "“海水在月光下泛着铅灰色的微光，仿佛古老神祇垂下的眼眸。”"
    },
    {
      "id": "ach_all_sights",
      "category": "见闻与历程",
      "name": "尘世之眼·行路之书",
      "icon": "📖",
      "hint": "在多局历程中点亮全部 12 卷航海见闻录。",
      "desc": "尘世之眼阅尽潮汐之下的所有沉默，行路之书载满风浪之中的所有回声。",
      "quote": "“整座爱琴海的波涛与诗韵，皆已被你收录入怀。”"
    },
    {
      "id": "ach_first_dice",
      "category": "见闻与历程",
      "name": "命运的骰子",
      "icon": "🎲",
      "hint": "首次在游戏中触发概率或祭祀掷骰判定。",
      "desc": "你第一次把命运交给风浪。它落定之前，你听见自己的呼吸和浪的节奏叠在了一起。",
      "quote": "“骰子滚过黑曜石台面，声响如同命运的齿轮扣合。”"
    },
    {
      "id": "ach_first_sacrifice",
      "category": "见闻与历程",
      "name": "第一声祷词",
      "icon": "🕊️",
      "hint": "在祈神祭坛举行任意一次神明祭祀。",
      "desc": "你开口的时候，海浪声矮了一寸——像是苍穹弯下腰来，听着你的诉求。",
      "quote": "“青烟穿透铅云，凡人向奥林匹斯山送去了誓约。”"
    },
    {
      "id": "ach_first_battle",
      "category": "见闻与历程",
      "name": "血与铁的初遇",
      "icon": "⚔️",
      "hint": "首次经历遭遇战、海战或登陆搏杀事件。",
      "desc": "血溅上盔甲的时候，你第一次尝到了归途的另一种咸味。",
      "quote": "“青铜盾牌铿锵撞击，战火的余温从未远离。”"
    },
    {
      "id": "ach_first_sea_people",
      "category": "见闻与历程",
      "name": "海上来客",
      "icon": "🗡️",
      "hint": "首次遭遇神秘凶悍的海上民族舰队。",
      "desc": "那些在城邦中流传了多年的流言终于有了面孔——海上来客不是传说，是刀锋。",
      "quote": "“黑帆划破晨雾，不请自来的掠夺者亮出了弯刀。”"
    },
    {
      "id": "ach_luck_up",
      "category": "见闻与历程",
      "name": "神目一瞥",
      "icon": "✨",
      "hint": "在事件或祭祀中首次使神恩（幸运值）获得提升。",
      "desc": "风忽然转向的那一瞬间，你知道——云层之上有谁短暂地低下了头，看了一眼你的帆。",
      "quote": "“诸神并未遗忘这片海域，恩典如同金色的微光。”"
    },
    {
      "id": "ach_all_majors",
      "category": "见闻与历程",
      "name": "不朽之名",
      "icon": "🌟",
      "hint": "在历次远航中完整经历并点亮全部 12 幕史诗主线大事件。",
      "desc": "你走完了诸神为你铺设的十二重门。从此，神的名字被写在云上，你的名字被刻在海里。",
      "quote": "“荷马的盲眼所注视的一切史诗，都已在你的甲板上演绎。”"
    },
    {
      "id": "ach_low_food",
      "category": "极限逆境",
      "name": "尽粮枯舟",
      "icon": "🍖",
      "hint": "单局中食物储备降低至 10 点以下。",
      "desc": "船还在走，但粮食已经先于归途抵达了尽头。",
      "quote": "“最后一块干酪分尽，水手们的眼眶深陷如枯井。”"
    },
    {
      "id": "ach_low_loyalty",
      "category": "极限逆境",
      "name": "断缆无声",
      "icon": "⛓️",
      "hint": "单局中船员忠诚度降低至 10% 以下。",
      "desc": "那根连接你与所有人的绳子，不知何时已经断了。",
      "quote": "“甲板上鸦雀无声，每一双低垂的眼睛都在黑暗中审视着船长。”"
    },
    {
      "id": "ach_low_sanity",
      "category": "极限逆境",
      "name": "忘川倒影",
      "icon": "🌀",
      "hint": "单局中精神理智降低至 10 点以下。",
      "desc": "你看着海面，深渊也在望着你。",
      "quote": "“耳畔回荡着亲人的幻听与海妖的呢喃，现实正在崩解。”"
    },
    {
      "id": "ach_low_crew",
      "category": "极限逆境",
      "name": "孤帆独行",
      "icon": "👤",
      "hint": "单局中存活船员人数缩减至 3 人及以下。",
      "desc": "桅杆上还剩一面帆，船上静得只剩自己的脚步声。",
      "quote": "“昔日划桨如飞的三十张坐席，如今大多空荡寂静。”"
    },
    {
      "id": "ach_low_luck",
      "category": "极限逆境",
      "name": "无恩之海",
      "icon": "🌑",
      "hint": "单局中神恩眷顾降低至 10 点以下。",
      "desc": "海不再宽恕，神收回了祂放在你船底的那只手，如今你是自己浮着的。",
      "quote": "“无论向哪座神庙叩拜，铅灰色的云海只以雷霆冷笑作答。”"
    },
    {
      "id": "ach_egg_poet",
      "category": "命运彩蛋",
      "name": "琴杖之律",
      "icon": "🎵",
      "hint": "在单局中至少完成一次大事件并成功抵达任意一个结局。",
      "desc": "三千年前，吟游诗人用木杖敲击地面，长—短—短，那是六步格的行进节奏。三千年后，你的船划开了同样的声音，像海浪一层一层叠在旧浪上。你不是在航行，你在被唱进一首比你更老、也会比你活得更久的歌里。",
      "quote": "“一首比你更老、也会比你活得更久的歌。”"
    },
    {
      "id": "ach_egg_argos",
      "category": "命运彩蛋",
      "name": "阿尔戈斯之眼",
      "icon": "🐕",
      "hint": "在求助事件中至少一次选择善意救助与信任陌生人。",
      "desc": "那条老狗在垃圾堆上等了二十年，等一个所有人都说不会再回来的人。它是唯一一个不用语言就认出你的人。而你，选择相信陌生人——不是因为他们可信，是因为你还愿意相信这个世界上有比证据更老的东西。",
      "quote": "“这世上，总有些东西比算计与证据更古老。”"
    },
    {
      "id": "ach_egg_siren_crew",
      "category": "命运彩蛋",
      "name": "被歌声带走的人",
      "icon": "🧜",
      "hint": "在大事件八塞壬海妖中经历失去水手。",
      "desc": "那个船员来自另一片海岸。塞壬的歌声绕过你，绕过所有人，径直找到了他。他走的时候，脸上是你从未见过的平静。你知道，他终于上岸了。",
      "quote": "“他走的时候脸上带着平静，他终于上岸了。”"
    },
    {
      "id": "ach_egg_weaver",
      "category": "命运彩蛋",
      "name": "织布的人",
      "icon": "🧶",
      "hint": "在旅途中累计选择至少两次“停留观察”、“休整等待”类选项。",
      "desc": "等待奥德修斯回乡的佩涅洛佩织了二十年布，白天织，夜里拆。你每次停下来等风、等雾散、等潮汐转向——而在海的另一头，也有人等待着你。你停下来等过太多次了，久到你的船尾也开始拖着一根看不见的线。没有人在另一头扯它，但你知道有人正握着线头，不肯放手。",
      "quote": "“有人正握着线头，不肯放手。”"
    },
    {
      "id": "ach_egg_wooden_horse",
      "category": "命运彩蛋",
      "name": "木马的心脏",
      "icon": "🐎",
      "hint": "在遭遇战中至少一次选择用智策、伪装或盘问克敌制胜。",
      "desc": "你站在特洛伊城外时，以为奥德修斯的木马是你一生中最大的谎言。后来你才发现——你对自己说的谎比它大得多。“很快就到家了。”“我还撑得住”那匹木马早已裂在沙滩上，而你还在用同样的谎言划桨，等一个终于可以对自己说真话的日子。",
      "quote": "“那匹木马早已裂在沙滩上，而你还在用同样的谎言划桨。”"
    },
    {
      "id": "ach_sail_day_15",
      "category": "远航里程",
      "name": "与海共舞",
      "icon": "🌊",
      "hint": "单局在危机四伏的爱琴海中存活航行超过 15 天。",
      "desc": "破烂的帆布经受住了数十道巨浪的洗礼，大海的呼吸已成为全船的本能。",
      "quote": "“航向永无休止，但你的罗盘从未偏移。”"
    },
    {
      "id": "ach_sail_day_20",
      "category": "远航里程",
      "name": "望尽归途",
      "icon": "🌅",
      "hint": "成功航抵第 20 天故土海湾，完成全部旅程。",
      "desc": "二十个日夜的搏杀与漂泊，故乡的橄榄林终于在金色的破晓中显露轮廓。",
      "quote": "“二十天的苦难，铸就了一曲永不磨灭的凡人史诗。”"
    }
  ]
};

module.exports = GAME_DATABASE;
