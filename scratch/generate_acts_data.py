# scratch/generate_acts_data.py
# 自动生成四幕全新文学剧情数据库（基于 plot/ 真实文案）

def get_acts_and_knots(major_events_dict):
    story_acts = {
        "0": {
            "id": "prologue",
            "actNum": 0,
            "title": "序幕 · 启航之殇",
            "theme": "特洛伊撤离与卡法柔斯浩劫",
            "objective": "经历特洛伊火海与海神浩劫，从英雄回归普通人，立誓启航",
            "initialKnot": "knot_prologue_warrior_troy",
            "knots": [
                "knot_prologue_warrior_troy", "knot_prologue_warrior_storm",
                "knot_prologue_priest_troy", "knot_prologue_priest_storm", "knot_prologue_priest_lord_death",
                "knot_prologue_helmsman_troy", "knot_prologue_helmsman_storm", "knot_prologue_helmsman_lord_death",
                "knot_prologue_merchant_troy", "knot_prologue_merchant_storm", "knot_prologue_merchant_lord_death",
                "knot_prologue_beach_reflection"
            ]
        },
        "1": {
            "id": "act_1",
            "actNum": 1,
            "title": "第一幕 · 米拉托斯 · 神之问",
            "theme": "雅典娜的止战考验",
            "objective": "直面智慧女神的三重叩问，辨明生存、作战与放下的真谛",
            "initialKnot": "knot_act1_q1_how_survive",
            "knots": [
                "knot_act1_q1_how_survive",
                "knot_act1_q1_reef_straits",
                "knot_act1_q2_whom_fight",
                "knot_act1_q2_sandbar_survivors",
                "knot_act1_q3_put_down_sword",
                "knot_act1_q3_athena_temple"
            ]
        },
        "2": {
            "id": "act_2",
            "actNum": 2,
            "title": "第二幕 · 提那鲁斯 · 神之域",
            "theme": "赫尔墨斯的心灵迷宫",
            "objective": "穿越浓雾六重门，抵御贪婪、遗忘、执念与虚妄幻声",
            "initialKnot": "knot_act2_gate1_drinking",
            "knots": [
                "knot_act2_gate1_drinking",
                "knot_act2_gate2_forget_name",
                "knot_act2_gate3_broken_blade",
                "knot_act2_gate4_mirror",
                "knot_act2_gate5_shadow",
                "knot_act2_gate6_final_ferry"
            ]
        },
        "3": {
            "id": "act_3",
            "actNum": 3,
            "title": "第三幕 · 阿尔戈斯 · 神之书",
            "theme": "赫拉誓言碑与问心大殿",
            "objective": "在天后赫拉神庙立誓问心，经受同袍信任终极考验",
            "initialKnot": "knot_act3_oath_stele",
            "knots": [
                "knot_act3_oath_stele",
                "knot_act3_q1_whose",
                "knot_act3_q2_fear",
                "knot_act3_q3_faith",
                "knot_act3_q4_why_you",
                "knot_act3_q5_remember_oath",
                "knot_act3_temple_judgement"
            ]
        },
        "4": {
            "id": "epilogue",
            "actNum": 4,
            "title": "终章 · 故土归途",
            "theme": "菲埃克斯救赎与归乡",
            "objective": "向菲埃克斯国王陈情万劫史诗，踏上故土阿萨卡海滩",
            "initialKnot": "knot_epilogue_phaeacians",
            "knots": [
                "knot_epilogue_phaeacians",
                "knot_epilogue_home"
            ]
        }
    }

    knots = {
        # ==========================================
        # 序幕 · 贵族武领专属支线
        # ==========================================
        "knot_prologue_warrior_troy": {
            "id": "knot_prologue_warrior_troy",
            "act": 0, "stage": 0,
            "title": "特洛伊残烬 · 启航",
            "chapter": "序幕 · 启航（贵族武领）",
            "icon": "🔥",
            "image": "/img/重要配图/开端1.png",
            "env": "land", "landType": "human",
            "speaker": "阿卡亚领主",
            "objective": "整备战船，率同胞自特洛伊残烬拔锚启程",
            "text": "特洛伊在燃烧。\n你站在海滩上，灰烬落在你的肩甲上，像一场黑色的雪。十年了，木马破城，刀锋卷刃，你终于可以回家了。\n你回头望——燃烧的神庙、倒塌的城墙、堆满广场的尸体。你赢了。但你赢了之后才发现，胜利的味道和失败一模一样。\n兄弟们上了船，有人哭，有人笑。战利品堆满了船舱，铜器、黄金、织毯，还有刻着特洛伊徽记的银杯。你站在船尾，遥望你的城邦在的那个方向，顺风不过几天航程，但船载得太重、人待得太久，诸神不会高兴。\n你低头看了一眼甲板上的人们。粮草尚足，水手精干，风帆满张。你忍不住想，这样的阵容，什么风浪能挡得住？",
            "choices": [
                {
                    "text": "拔锚，启航！",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": 5 },
                    "resolutionText": "木桨劈开黑沉沉的海面，战船切开海水向北疾驰。海风灌满帆布，船身微微倾斜。特洛伊城墙在火光中一寸寸缩小，最终化作海天相接处的一粒炭火。归途易得，归己最难。",
                    "nextKnot": "knot_prologue_warrior_storm"
                }
            ]
        },
        "knot_prologue_warrior_storm": {
            "id": "knot_prologue_warrior_storm",
            "act": 0, "stage": 1,
            "title": "卡法柔斯海角 · 浩劫之怒",
            "chapter": "序幕 · 毁灭风暴",
            "icon": "🌊",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "旁白",
            "objective": "在海神波塞冬的雷霆狂澜中拼死维稳船身",
            "text": "船队驶入卡法柔斯海角时，天像被人从外面扣上了一只碗。海面泛起一层古铜色的光泽，桨叶发出奇怪的嗡鸣。舵柄在发烫，像有人从海底伸出一只手隔着龙骨在底下烧。\n海在你的眼前裂开了！两道巨浪左右合拢，整支舰队被拦腰截断，左边撞碎在礁石上，右边被浪墙吞没！闪电翻涌中，波塞冬手持三叉戟立于风暴正中——在神的面前，你的剑没有用，你的经验没有用，你的骄傲没有用。你什么都不是。",
            "choices": [
                {
                    "text": "感召雅典娜的神圣微光，借神恩与极致意志破浪突围",
                    "hint": "",
                    "condition": { "minLuck": 80, "minLoyalty": 80, "minSanity": 70 },
                    "triggerEnding": "hidden_safe_haven",
                    "unlockAchievement": "ach_caphireus_miracle",
                    "resolutionText": "神圣的微光自云层缝隙破空而降！波塞冬的三叉戟在神光前微微一滞。全船上下同仇敌忾，战船在灭顶浩劫中奇迹般穿透狂澜，未损一船一卒，乘着顺风笔直驶向故乡港湾！"
                },
                {
                    "text": "在甲板主持大局，命令船员全力划桨",
                    "hint": "",
                    "deltas": { "loyalty": 5, "crew": -2 },
                    "resolutionText": "你巍然立于颠簸倾覆的甲板上高声断喝，众船员被你的沉着稳住心神，拼死挥桨迎浪！虽然两名水手被巨浪卷走，但战船终究穿透了惊涛撞向浅滩。",
                    "nextKnot": "knot_prologue_beach_reflection"
                },
                {
                    "text": "亲自爬上断桅，割断缆绳，让船身重新恢复平衡",
                    "hint": "",
                    "deltas": { "sanity": 5, "food": -5 },
                    "resolutionText": "你顶着暴雨攀上折裂的断桅，挥利刃斩断死死缠绞的缆绳！重帆落入大海，战船重新恢复平衡，借着余势滑向荒凉沙滩。",
                    "nextKnot": "knot_prologue_beach_reflection"
                }
            ]
        },

        # ==========================================
        # 序幕 · 神谕祭司专属支线
        # ==========================================
        "knot_prologue_priest_troy": {
            "id": "knot_prologue_priest_troy",
            "act": 0, "stage": 0,
            "title": "神庙废墟 · 罪愆低语",
            "chapter": "序幕 · 启航（神谕祭司）",
            "icon": "👁️",
            "image": "/img/重要配图/开端1.png",
            "env": "land", "landType": "human",
            "speaker": "大祭司",
            "objective": "清点祭器，跟随领主登船启航",
            "text": "特洛伊在燃烧。\n你站在神庙残垣间，大祭司双手抠进焦黑石缝里颤抖喃喃：“我们犯下大错了……神将降下怒火……你们以为这是胜利，这是血债。赎罪，已经来不及了！”\n士兵们笑着扛起黄金奔向海滩，没有人回头看老人一眼。你的领主微笑着拍了拍你的肩：“向神明祈祷吧，赐我们回乡的路。”你想，这样的英雄必定受神垂青。战船破浪北行，夜深惊醒，大祭司那句“赎罪……已经来不及了”还在耳畔回响。",
            "choices": [
                {
                    "text": "紧握母亲给的旧挂坠，跟随领主拔锚启航",
                    "hint": "",
                    "deltas": { "luck": 5 },
                    "resolutionText": "木桨劈开黑沉沉的海面，战船向北疾驰。你回头望了一眼，神庙的余烬如黑雪无声落入海中。",
                    "nextKnot": "knot_prologue_priest_storm"
                }
            ]
        },
        "knot_prologue_priest_storm": {
            "id": "knot_prologue_priest_storm",
            "act": 0, "stage": 1,
            "title": "卡法柔斯海角 · 神怒审视",
            "chapter": "序幕 · 毁灭风暴",
            "icon": "🌊",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "旁白",
            "objective": "直面海神冷漠审视，在狂澜中求生",
            "text": "船队驶入卡法柔斯海角，两道巨浪将舰队截断！雷暴中波塞冬手持三叉戟立于风暴正中——那双眼里没有愤怒也没有仇恨，只有冷冰冰、漫不经心的审视，像在看一群蚂蚁。\n在神的面前，你的祈祷没有用，你的祭祀没有用，烧过的香念过的祷词都没有用。祂不在乎。",
            "choices": [
                {
                    "text": "感召雅典娜的神圣微光，借神恩与极致意志破浪突围",
                    "hint": "",
                    "condition": { "minLuck": 80, "minLoyalty": 80, "minSanity": 70 },
                    "triggerEnding": "hidden_safe_haven",
                    "unlockAchievement": "ach_caphireus_miracle",
                    "resolutionText": "神圣的微光自云层缝隙破空而降！波塞冬的三叉戟在神光前微微一滞。全船上下同仇敌忾，战船在灭顶浩劫中奇迹般穿透狂澜，未损一船一卒，乘着顺风笔直驶向故乡港湾！"
                },
                {
                    "text": "跪在甲板上，向波塞冬高声祈祷，恳求祂的怜悯",
                    "hint": "",
                    "deltas": { "luck": 10, "sanity": -5 },
                    "resolutionText": "你死死抓住船舷跪在颠簸的甲板上念出古老誓言，狂暴的风浪似乎在雷光中微微一滞。",
                    "nextKnot": "knot_prologue_priest_lord_death"
                },
                {
                    "text": "沉默着，尝试移动到安全的位置",
                    "hint": "",
                    "deltas": { "sanity": 5 },
                    "resolutionText": "你咬紧牙关手脚并用在倾斜的船板上爬向坚固的舱门，努力避开四处横飞的断木。",
                    "nextKnot": "knot_prologue_priest_lord_death"
                }
            ]
        },
        "knot_prologue_priest_lord_death": {
            "id": "knot_prologue_priest_lord_death",
            "act": 0, "stage": 2,
            "title": "英雄之殇 · 领主陨落",
            "chapter": "序幕 · 领主之死",
            "icon": "⚔️",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "英明领主",
            "objective": "承接领主遗志，指挥幸存船员脱险",
            "text": "一根断裂的桅杆砸下！领主猛冲过来将你推开，断木正中他的脊背。血涌出来浸透你的手臂，他留下了最后一句话：“我这一生……从没向神低过头。”\n他闭上了眼，眉头未皱，嘴角带着平静。你终于明白大祭司的话了——神惩罚你，只是因为你冒犯了祂的威严，祂只在乎你有没有低头。风浪更狂了！",
            "choices": [
                {
                    "text": "冲去保护祭祀用的圣物箱——那是祭司的本职",
                    "hint": "",
                    "deltas": { "luck": 10, "sanity": -5 },
                    "resolutionText": "你在翻滚的积水中扑倒护住圣物箱，青铜法器完好无损，冥冥中仿佛护佑着残船漂入浅湾。",
                    "nextKnot": "knot_prologue_beach_reflection"
                },
                {
                    "text": "接替领主的工作，指挥船员自救",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": 5 },
                    "resolutionText": "你合上领主的双眼霍然起身，替领主发出坚定号令！水手们在你的指引下砍缆保船，残船借风冲上沙滩。",
                    "nextKnot": "knot_prologue_beach_reflection"
                }
            ]
        },

        # ==========================================
        # 序幕 · 老辣舵手专属支线
        # ==========================================
        "knot_prologue_helmsman_troy": {
            "id": "knot_prologue_helmsman_troy",
            "act": 0, "stage": 0,
            "title": "触摸榫卯 · 二十年老木",
            "chapter": "序幕 · 启航（老辣舵手）",
            "icon": "🧭",
            "image": "/img/重要配图/开端1.png",
            "env": "land", "landType": "human",
            "speaker": "老舵手",
            "objective": "检查榫卯接缝，掌舵引领舰队起锚",
            "text": "特洛伊在燃烧。你蹲在船舷，用手掌感受每一道榫卯接缝。这艘船跟了你二十年，她比任何神都可靠。你不信神，只信季风、暗流、星辰和这双被咸水泡皱了的手。\n领主提着酒壶在你身边坐下：“等回了家，你带我去那片林子里打野猪，你欠我一只。”你咧嘴把酒壶还给他。你想，二十年了，这次你也要靠双手把大家平安带回去。\n但你注意到，风向变了，很轻很细，像有人在云层上伸手指调了调帆……",
            "choices": [
                {
                    "text": "握紧舵柄，下令开航",
                    "hint": "",
                    "deltas": { "sanity": 5 },
                    "resolutionText": "木桨切开黑浪，战船向北疾驰。熟悉的力量从龙骨传上来，像老友点头。三天之内必过海角。",
                    "nextKnot": "knot_prologue_helmsman_storm"
                }
            ]
        },
        "knot_prologue_helmsman_storm": {
            "id": "knot_prologue_helmsman_storm",
            "act": 0, "stage": 1,
            "title": "逆乱风浪 · 经验崩塌",
            "chapter": "序幕 · 毁灭风暴",
            "icon": "🌊",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "旁白",
            "objective": "面对反常逆浪，拼尽老舵手本领死守船舵",
            "text": "驶入卡法柔斯海角，风从西北来，浪从东南来——二十年来从无风浪逆行！舵柄发烫如火烧。海在眼前裂开，舰队被拦腰截断！闪电下波塞冬立于风暴正中。\n你半辈子不信神，祭坛前从不低头。可此刻你忽然发现，二十年的经验与自信，在神面前轻得像一片被风卷起的木屑。在神的面前，你的经验没有用，你的舵柄没有用，你的骄傲没有用。",
            "choices": [
                {
                    "text": "感召雅典娜的神圣微光，借神恩与极致意志破浪突围",
                    "hint": "",
                    "condition": { "minLuck": 80, "minLoyalty": 80, "minSanity": 70 },
                    "triggerEnding": "hidden_safe_haven",
                    "unlockAchievement": "ach_caphireus_miracle",
                    "resolutionText": "神圣的微光自云层缝隙破空而降！波塞冬的三叉戟在神光前微微一滞。全船上下同仇敌忾，战船在灭顶浩劫中奇迹般穿透狂澜，未损一船一卒，乘着顺风笔直驶向故乡港湾！"
                },
                {
                    "text": "咬牙稳住舵柄，尝试靠自己的经验带船冲出风暴",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": -5 },
                    "resolutionText": "你用整个身躯死死压住剧烈颤抖的舵柄，舵木几乎将皮肉磨穿，硬生生咬牙撑住了航向！",
                    "nextKnot": "knot_prologue_helmsman_lord_death"
                },
                {
                    "text": "松开舵柄，跪在船尾，第一次向神明祈祷祈求怜悯",
                    "hint": "",
                    "deltas": { "luck": 10, "sanity": -5 },
                    "resolutionText": "二十年从不低头的双手第一次松开舵柄跪伏，海浪稍滞片刻，但狂暴的狂风依然撕裂了主桅！",
                    "nextKnot": "knot_prologue_helmsman_lord_death"
                }
            ]
        },
        "knot_prologue_helmsman_lord_death": {
            "id": "knot_prologue_helmsman_lord_death",
            "act": 0, "stage": 2,
            "title": "染血青铜印章 · 孤舵负重",
            "chapter": "序幕 · 领主之死",
            "icon": "⚓",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "英明领主",
            "objective": "手握染血青铜印章，将残船带上陆地",
            "text": "断桅砸下！领主猛将你推开挡下致命撞击。“替我……把他们带回家。”他将一枚染血的青铜印章塞进你手里，“等回了家，记得带我去打野猪……你欠我一只。”\n他闭上了眼，平静如终于放下武器的人。你合上他的双眼，掌心的印章比舵柄更沉。舵柄让你控制方向，而这枚印章，从此承着所有还没死的人。",
            "choices": [
                {
                    "text": "继续掌舵冲向浅滩——保住活着的人，这是舵手的职责",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": 5 },
                    "resolutionText": "你擦去眼角血泪猛推舵柄，残破的战船顺着水流如利箭般扎入避风海滩！",
                    "nextKnot": "knot_prologue_beach_reflection"
                },
                {
                    "text": "跳入海中，试图打捞同伴们的遗物——带他们“回家”",
                    "hint": "",
                    "deltas": { "loyalty": 10, "food": -5 },
                    "resolutionText": "你纵身跳入翻滚的碎浪，打捞起战死兄弟的行囊与徽记，全船水手含泪相助将船拉上沙滩。",
                    "nextKnot": "knot_prologue_beach_reflection"
                }
            ]
        },

        # ==========================================
        # 序幕 · 随军富贾专属支线
        # ==========================================
        "knot_prologue_merchant_troy": {
            "id": "knot_prologue_merchant_troy",
            "act": 0, "stage": 0,
            "title": "黄金与账本 · 命之秤盘",
            "chapter": "序幕 · 启航（随军富贾）",
            "icon": "⚖️",
            "image": "/img/重要配图/开端1.png",
            "env": "land", "landType": "human",
            "speaker": "随军富贾",
            "objective": "核算辎重，随舰队拔锚开航",
            "text": "特洛伊在燃烧。战利品堆成小山，你一件件清点。十年来你掌管辎重，从没让全军挨过饿。领主笑说：“东西装不下就扔几箱金子下海。”你叹气没接话，因为你算过，扔掉金子换来的不过一顿饱饭的航程，而这片海还要走十天。\n战船启航向北，你忽然觉得脚底冰凉，海水正从板缝渗上来，战利品正在把船拽向海底。风里传来一句话：“你算得清账，算不清命。”",
            "choices": [
                {
                    "text": "锁好货箱，下令全速启航",
                    "hint": "",
                    "deltas": { "food": 5 },
                    "resolutionText": "木桨划破黑浪，战船向北破浪而去，吃水线沉重无比。",
                    "nextKnot": "knot_prologue_merchant_storm"
                }
            ]
        },
        "knot_prologue_merchant_storm": {
            "id": "knot_prologue_merchant_storm",
            "act": 0, "stage": 1,
            "title": "万金碎裂 · 神不交易",
            "chapter": "序幕 · 毁灭风暴",
            "icon": "🌊",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "旁白",
            "objective": "在货物撞碎与覆灭边缘做出抉择",
            "text": "卡法柔斯海角天如扣碗，沉重的战利品让木板发软。海在眼前裂开，舰队撞礁粉碎！闪电下波塞冬冷酷审视蝼蚁。你从没去过祭坛，你只负责把账算清，但此刻你忽然发现，算了十年的账在那道目光面前一文不值。在神的面前，你的账本没有用，你的黄金没有用。祂不会与你交易。",
            "choices": [
                {
                    "text": "感召雅典娜的神圣微光，借神恩与极致意志破浪突围",
                    "hint": "",
                    "condition": { "minLuck": 80, "minLoyalty": 80, "minSanity": 70 },
                    "triggerEnding": "hidden_safe_haven",
                    "unlockAchievement": "ach_caphireus_miracle",
                    "resolutionText": "神圣的微光自云层缝隙破空而降！波塞冬的三叉戟在神光前微微一滞。全船上下同仇敌忾，战船在灭顶浩劫中奇迹般穿透狂澜，未损一船一卒，乘着顺风笔直驶向故乡港湾！"
                },
                {
                    "text": "拼死抢救粮袋和淡水——活人比死物值钱",
                    "hint": "",
                    "deltas": { "loyalty": 5, "food": 10, "sanity": -5 },
                    "resolutionText": "你在摇晃剧烈的舱底拼命抱住粮食和淡水桶，食物得以保全，全船水手敬服不已！",
                    "nextKnot": "knot_prologue_merchant_lord_death"
                },
                {
                    "text": "把最重的几箱战利品推下海——救人必须减载",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": 5 },
                    "resolutionText": "黄金沉入海面溅起浪花，船身猛然浮起一尺，避开了致命的暗礁！",
                    "nextKnot": "knot_prologue_merchant_lord_death"
                }
            ]
        },
        "knot_prologue_merchant_lord_death": {
            "id": "knot_prologue_merchant_lord_death",
            "act": 0, "stage": 2,
            "title": "未结之账 · 欠下的一条命",
            "chapter": "序幕 · 领主之死",
            "icon": "⚖️",
            "image": "/img/重要配图/开端3.png",
            "env": "sea",
            "speaker": "英明领主",
            "objective": "承接领主嘱托，维系船队最后生机",
            "text": "断桅砸落，领主将你一把推开，断木砸碎了他的脊背。他将染血青铜印章塞进你手里：“替我……把账还清。等回了家，记得把我的那份，给我妻子送去。”\n你攥着印章合上他的双眼。第一次觉得它比钱袋更沉。钱袋里装的是账，这枚印章上，载的是还没死的人。",
            "choices": [
                {
                    "text": "在腰间系上领主的佩剑，组织船员绑紧船身",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": 5 },
                    "resolutionText": "你系紧染血长剑下达号令，水手们将绳索连结龙骨，将战船稳稳送向沙滩。",
                    "nextKnot": "knot_prologue_beach_reflection"
                },
                {
                    "text": "护住领主的遗体，不让他被风浪卷走",
                    "hint": "",
                    "deltas": { "loyalty": 10 },
                    "resolutionText": "你死死用身体护住领主的遗体任由浪花拍打，全船水手无不动容落泪，誓死同舟！",
                    "nextKnot": "knot_prologue_beach_reflection"
                }
            ]
        },

        # ==========================================
        # 序幕 · 海滩沉思（四角色共通收束节点）
        # ==========================================
        "knot_prologue_beach_reflection": {
            "id": "knot_prologue_beach_reflection",
            "act": 0, "stage": 3,
            "title": "海滩沉思 · 凡人之誓",
            "chapter": "序幕 · 海滩沉思",
            "icon": "🌅",
            "image": "/img/重要配图/开端2第二版.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "完成海滩沉思，重修战船，立誓以凡人之躯扬帆起航",
            "text": "风暴过去了。海面像一面碎裂的镜子，几百艘船、几千个人，只有你们这一艘靠了岸。你看着自己的双手，这双手沾过血、握过剑，还能在和平的日子里扶犁、牵起妻子的手吗？\n也许这场风暴真正的目的，不是摧毁舰队，而是摧毁你们心里那些关于战争的东西。当神把你们扔回海里的那一刻，你们才终于知道——你们不是英雄，不是征服者，你们只是一群想回家的普通人。而你要做的，是带着剩下的这些人，学会重新做一个普通人。",
            "choices": [
                {
                    "text": "扬帆，启航！放下剑的人，才有资格握住舵",
                    "hint": "",
                    "deltas": { "sanity": 10, "loyalty": 10 },
                    "unlockAchievement": "ach_steersman",
                    "resolutionText": "你召集剩余船员动手清理残骸、修补破陋的船板，换上粗壮的新桅，将战船重新推入大海。你握紧舵柄，迎着鱼肚白的海平线远航。长路自此始！",
                    "nextAct": 1
                }
            ]
        },

        # ==========================================
        # 第一幕 · 米拉托斯 · 神之问（雅典娜）
        # ==========================================
        "knot_act1_q1_how_survive": {
            "id": "knot_act1_q1_how_survive",
            "act": 1, "stage": 0,
            "title": "第一问：你靠什么活下来？",
            "chapter": "第一幕 · 米拉托斯 · 神之问",
            "icon": "⛵",
            "image": "/img/大事件配图/大事件1.png",
            "env": "sea",
            "speaker": "老渔夫",
            "objective": "回答老渔夫的生存叩问",
            "text": "特洛伊的灰烬沉入海底，战船修补得勉强能走。清晨，你在船头缆绳墩上发现了一个赤脚的老渔夫。“你从特洛伊来，”他转过头，眼睛亮得不像老人，“波塞冬没有杀死你，雅典娜没有抛弃你。但你靠什么活下来？剑，还是头脑？”",
            "choices": [
                {
                    "text": "靠剑。在特洛伊活了十年，靠的就是这双手和一把剑",
                    "hint": "",
                    "deltas": { "sanity": 5, "luck": -5 },
                    "setMemory": { "q1_answer": "sword" },
                    "resolutionText": "老渔夫点了点头：“海从不问落水的人带了多少金子，它只问你肯不肯松开手。”身影骤然消散在薄雾中。",
                    "nextKnot": "knot_act1_q1_reef_straits"
                },
                {
                    "text": "靠头脑。特洛伊不是靠蛮力破的，是靠木马",
                    "hint": "",
                    "deltas": { "luck": 5, "sanity": -5 },
                    "setMemory": { "q1_answer": "mind" },
                    "resolutionText": "老渔夫深深看了你一眼：“海从不问落水的人带了多少金子，它只问你肯不肯松开手。”随后化作海风不见。",
                    "nextKnot": "knot_act1_q1_reef_straits"
                },
                {
                    "text": "我不知道。我只是活下来了，不比死者更幸运",
                    "hint": "",
                    "deltas": {},
                    "setMemory": { "q1_answer": "unknown" },
                    "resolutionText": "老渔夫沉默良久，敲了敲船舷，留在舷上的一行字隐隐发亮：“海只问你肯不肯松开手。”",
                    "nextKnot": "knot_act1_q1_reef_straits"
                }
            ]
        },
        "knot_act1_q1_reef_straits": {
            "id": "knot_act1_q1_reef_straits",
            "act": 1, "stage": 1,
            "title": "暗流窄道 · 沉船与白骨",
            "chapter": "第一幕 · 礁石水道",
            "icon": "🪨",
            "image": "/img/大事件配图/大事件1.png",
            "env": "sea",
            "speaker": "老水手",
            "objective": "在险恶暗流礁石水道中选择通行之道",
            "text": "前方海面薄雾弥漫，礁石上挂着一面希腊战船的残帆，海面下隐现沉船残骸与散落的铜器木箱。但暗流如蛇打旋，唯一通道仅容一船穿过，两侧礁石上隐见前车之鉴的白骨。",
            "choices": [
                {
                    "text": "靠剑：指挥驾船强冲，用桨硬撑开礁石",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": -5 },
                    "resolutionText": "船员拼尽全力摇桨，船底刮过礁石发出刺耳的巨响，虽险险冲过窄道，但老水手们私下颇有怨言。",
                    "nextKnot": "knot_act1_q2_whom_fight"
                },
                {
                    "text": "靠头脑：放下小艇，用长索拉船缓缓靠近",
                    "hint": "",
                    "deltas": { "loyalty": 5, "food": -5 },
                    "resolutionText": "精熟水性的弟兄泅渡至石柱固定长索，全船同心协力拉引战船一寸寸安稳贴近，虽耗时耗力，却未伤一人。",
                    "nextKnot": "knot_act1_q2_whom_fight"
                },
                {
                    "text": "不靠近礁石，调转船头平稳绕行",
                    "hint": "",
                    "deltas": {},
                    "resolutionText": "你清醒地辨明了白骨的警示，克制住对沉船财货的贪念，带领船队平安绕过凶险海域。",
                    "nextKnot": "knot_act1_q2_whom_fight"
                }
            ]
        },
        "knot_act1_q2_whom_fight": {
            "id": "knot_act1_q2_whom_fight",
            "act": 1, "stage": 2,
            "title": "第二问：你为谁而战？",
            "chapter": "第一幕 · 米拉托斯 · 神之问",
            "icon": "⚔️",
            "image": "/img/大事件配图/大事件1.png",
            "env": "sea",
            "speaker": "年轻士兵",
            "objective": "直面战意与同袍守护的心灵抉择",
            "text": "傍晚船尾多了一名甲片锃亮的年轻士兵，长矛抵在船板上：“你活过了风暴与礁石。但你为谁而战？自己，还是船上的人？”",
            "choices": [
                {
                    "text": "为自己。活着回来首先为了自己，欠自己的命不欠任何人",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": -5 },
                    "setMemory": { "q2_answer": "self" },
                    "resolutionText": "士兵凭空消散，甲板上留下的银矛刻着铭文：“为自己挥剑的人，剑刃上刻的是自己的名字。”",
                    "nextKnot": "knot_act1_q2_sandbar_survivors"
                },
                {
                    "text": "为船上的人。我是船长，答应过把他们全须全尾带回去",
                    "hint": "",
                    "deltas": { "loyalty": 5, "sanity": -5 },
                    "setMemory": { "q2_answer": "crew" },
                    "resolutionText": "士兵目光微柔，化风而去。银矛上的字迹在月光下闪动：“为他人挥剑的人，剑刃上刻的是别人的名字。”",
                    "nextKnot": "knot_act1_q2_sandbar_survivors"
                },
                {
                    "text": "保持沉默。战争已结束，我只想回家",
                    "hint": "",
                    "deltas": {},
                    "setMemory": { "q2_answer": "silent" },
                    "resolutionText": "长矛在夜露中泛着微光，你没有给出承诺，但命运的刻刀已在暗中落笔。",
                    "nextKnot": "knot_act1_q2_sandbar_survivors"
                }
            ]
        },
        "knot_act1_q2_sandbar_survivors": {
            "id": "knot_act1_q2_sandbar_survivors",
            "act": 1, "stage": 3,
            "title": "沙洲残船 · 三日绝水者",
            "chapter": "第一幕 · 沙洲抉择",
            "icon": "🏝️",
            "image": "/img/大事件配图/大事件1.png",
            "env": "sea",
            "speaker": "落难同袍",
            "objective": "面对绝水遇难同胞的存亡抉择",
            "text": "前方的沙洲上横亘着一艘折成两截的巨船，十数名幸存者麻木地站着。一名汉子水没过膝走来：“我们从特洛伊另一艘船游过来的，三天没水了。带我们走可能撑不到下个岛，不带我们也不怪你，只是得让你知道。”两群人在烈日下互相对视。",
            "choices": [
                {
                    "text": "带他们走！放下小艇，把淡水和口粮分成更多份",
                    "hint": "",
                    "deltas": { "crew": 4, "food": -15, "loyalty": 5 },
                    "resolutionText": "小艇放下，你将一个个虚弱的兄弟拉上船。虽然粮水更加紧缺，但夜里低泣的感激声让冰冷的战船多了一份暖意。",
                    "nextKnot": "knot_act1_q3_put_down_sword"
                },
                {
                    "text": "留下一桶清水与几袋干粮，下令起锚离开",
                    "hint": "",
                    "deltas": { "sanity": -5, "loyalty": -5 },
                    "resolutionText": "你留下了仅能匀出的水粮，转过头去不再看他们枯槁的背影。在这片大海上你自身难保，但愧疚如铅块压上心头。",
                    "nextKnot": "knot_act1_q3_put_down_sword"
                }
            ]
        },
        "knot_act1_q3_put_down_sword": {
            "id": "knot_act1_q3_put_down_sword",
            "act": 1, "stage": 4,
            "title": "第三问：你能放下剑吗？",
            "chapter": "第一幕 · 米拉托斯 · 神之问",
            "icon": "🦉",
            "image": "/img/大事件配图/大事件1.png",
            "env": "sea",
            "speaker": "老妇人",
            "objective": "在黑袍老妇面前做出放下的决断",
            "text": "天色蔚蓝，甲板角落蜷缩着一位黑袍老妇，怀中抱着插有枯死橄榄枝的陶罐。“你活过了风暴、礁石与别人的选择。但你从特洛伊带回来的剑——你能放下它吗？”",
            "choices": [
                {
                    "text": "能。用它杀了十年人也倦了，想回家做一个不用剑的人",
                    "hint": "",
                    "deltas": { "luck": 5 },
                    "setMemory": { "put_down_sword": True },
                    "resolutionText": "老妇人放下陶罐翻入海中，空气中飘来雅典娜的声音：“剑能保护的东西，比你以为的也要少。”前方孤岛隐现神庙！",
                    "nextKnot": "knot_act1_q3_athena_temple"
                },
                {
                    "text": "不能。放下剑之后我什么都不是，剑是我仅剩的骨气",
                    "hint": "",
                    "deltas": { "sanity": 5 },
                    "setMemory": { "put_down_sword": False, "kept_sword": True },
                    "resolutionText": "老妇人叹息一声化作水汽，脑海中浮现叹息：“剑能保护的，远比你以为的更少。”前方孤岛荒庙耸立！",
                    "nextKnot": "knot_act1_q3_athena_temple"
                },
                {
                    "text": "我不知道。杀过人也救过人，不知剑是罪还是命",
                    "hint": "",
                    "deltas": {},
                    "setMemory": { "put_down_sword": False },
                    "resolutionText": "枯死的橄榄枝在风中轻颤，前方海岛上的石柱若隐若现。",
                    "nextKnot": "knot_act1_q3_athena_temple"
                }
            ]
        },
        "knot_act1_q3_athena_temple": {
            "id": "knot_act1_q3_athena_temple",
            "act": 1, "stage": 5,
            "majorId": "major_1",
            "title": "雅典娜荒庙 · 银杯与利刃",
            "chapter": "第一幕 · 止战试炼",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件1.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "在雅典娜荒庙圣坛前完成止战与救赎抉择",
            "text": "荒岛上矗立着雅典娜的神庙，内殿祭坛上放着被砸开锁的猫头鹰圣物箱，箱底划痕刻着：“你们拿走的，还回来。”你的舵手颤抖着拿出私藏的特洛伊猫头鹰银杯，与此同时，你腰间十年的特洛伊佩剑发烫，剑柄划痕如烧红的铁针亮起！",
            "choices": [
                {
                    "text": "接过银杯放入木箱合盖，解下佩剑横放祭坛之上",
                    "hint": "",
                    "deltas": { "luck": 15, "food": 20, "sanity": 10 },
                    "unlockAchievement": "ach_peacemaker",
                    "resolutionText": "剑刃触石的刹那，剑柄红痕熄灭，海风骤歇！船员在庙后发现了一口清冽甘甜的淡水井，装满所有木桶，冲刷了盾上的血与灰，欢声雷动！",
                    "nextAct": 2
                },
                {
                    "text": "把银杯收进怀里，把剑握在手中，转身走出神庙",
                    "hint": "",
                    "condition": { "requireMemory": "kept_sword", "hint": "需在前面至少一次坚决选择不放下剑方可选择" },
                    "deltas": {},
                    "triggerEnding": "death_land",
                    "resolutionText": "刚迈出庙门，海盗与流亡者自乱石伏击！船员未带兵刃被无情屠戮，老妇化身雅典娜冷言：“你放不下，他们就替你放下。”夺走的宝剑已架上你的喉咙！"
                }
            ]
        },

        # ==========================================
        # 第二幕 · 提那鲁斯 · 神之域（赫尔墨斯的迷宫）
        # ==========================================
        "knot_act2_gate1_drinking": {
            "id": "knot_act2_gate1_drinking",
            "act": 2, "stage": 0,
            "title": "第一门：饮川",
            "chapter": "第二幕 · 提那鲁斯 · 神之域",
            "icon": "🌊",
            "image": "/img/大事件配图/大事件2.png",
            "env": "sea",
            "speaker": "神使迷宫",
            "objective": "在浓雾水幕与甘泉前经受贪婪考验",
            "text": "战船驶入浓雾，灰色的雾墙将海天缝在一起。水幕化作两根水柱凭空升起，水幕后陈列着盛满清水的陶罐。全船干渴如焚。",
            "choices": [
                {
                    "text": "走进水幕，灌满所有水桶",
                    "hint": "",
                    "triggerEnding": "death_sea",
                    "resolutionText": "水很凉很甜，但空的容器却越来越多。水忽然漫过甲板，容器疯狂溢水，贪婪让战船沉入深渊！"
                },
                {
                    "text": "只灌一桶，其余的留给后来的人",
                    "hint": "",
                    "deltas": { "luck": 5, "loyalty": 5 },
                    "resolutionText": "一人一口传饮甘泉，克制与仁善让水幕缓缓散开，前方石墙隐现。",
                    "nextKnot": "knot_act2_gate2_forget_name"
                },
                {
                    "text": "不进水幕，克制干渴绕行",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": -5 },
                    "resolutionText": "虽喉咙冒烟，但谨慎让你避开了暗藏的玄机，带队绕过水门。",
                    "nextKnot": "knot_act2_gate2_forget_name"
                }
            ]
        },
        "knot_act2_gate2_forget_name": {
            "id": "knot_act2_gate2_forget_name",
            "act": 2, "stage": 1,
            "title": "第二门：忘名",
            "chapter": "第二幕 · 提那鲁斯 · 神之域",
            "icon": "🧱",
            "image": "/img/大事件配图/大事件2.png",
            "env": "sea",
            "speaker": "迷宫回响",
            "objective": "在铭刻之墙前经受留名虚妄考验",
            "text": "残破石墙立于海面，密密麻麻刻满历代航海者的名字。空灵的声音在雾中回响：“写下你的名字，世界会记住你。”",
            "choices": [
                {
                    "text": "在最大空白处用力刻下自己的名字",
                    "hint": "",
                    "deltas": { "loyalty": -10, "sanity": -5 },
                    "resolutionText": "刻下名字的瞬间，你惊恐地发现自己想不起身边舵手与副官的名字了！",
                    "nextKnot": "knot_act2_gate3_broken_blade"
                },
                {
                    "text": "不写自己的名字，写下死在卡法柔斯的船员名字",
                    "hint": "",
                    "deltas": { "loyalty": 10 },
                    "resolutionText": "你一笔一划写下同袍之名，风浪中未能安葬的遗憾在石壁上得到了安宁。",
                    "nextKnot": "knot_act2_gate3_broken_blade"
                },
                {
                    "text": "什么都不写，带领船员径直离开",
                    "hint": "",
                    "deltas": {},
                    "resolutionText": "石墙在身后无声崩解，虚名不羁于怀，战船驶向更深的迷雾。",
                    "nextKnot": "knot_act2_gate3_broken_blade"
                }
            ]
        },
        "knot_act2_gate3_broken_blade": {
            "id": "knot_act2_gate3_broken_blade",
            "act": 2, "stage": 2,
            "title": "第三门：断刃",
            "chapter": "第二幕 · 提那鲁斯 · 神之域",
            "icon": "⚔️",
            "image": "/img/大事件配图/大事件6.png",
            "env": "sea",
            "speaker": "迷宫回响",
            "objective": "在兵刃走廊尽头做出取舍决断",
            "text": "两侧珊瑚礁插满了密密麻麻的利刃，柄朝外刃朝内。走廊尽头悬崖上，赫然插着你从特洛伊带回来的那把旧剑！石头上刻着：“不放下武器的人，永远走不出这条走廊。”",
            "choices": [
                {
                    "text": "伸手握住剑柄，将它插回腰间",
                    "hint": "",
                    "triggerEnding": "death_sea",
                    "resolutionText": "走廊骤然在身后合拢，船和同伴全都不见了！你独坐悬崖绝壁，黑海浮满利刃，万劫不复。"
                },
                {
                    "text": "不拿剑，冒着被飞针利刃划破肩膀硬闯走廊",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": 5 },
                    "resolutionText": "肩膀被利刃划破鲜血淋漓，但你绝不回头，坚信剑能保护的东西远比人以为的少！",
                    "nextKnot": "knot_act2_gate4_mirror"
                },
                {
                    "text": "跪在悬崖边亲吻剑柄，松手扔进海里",
                    "hint": "",
                    "deltas": { "luck": 10 },
                    "resolutionText": "剑落入海中，两壁的兵刃纷纷锈蚀化为灰烬，海峡开阔！",
                    "nextKnot": "knot_act2_gate4_mirror"
                }
            ]
        },
        "knot_act2_gate4_mirror": {
            "id": "knot_act2_gate4_mirror",
            "act": 2, "stage": 3,
            "title": "第四门：照心",
            "chapter": "第二幕 · 提那鲁斯 · 神之域",
            "icon": "🪞",
            "image": "/img/大事件配图/大事件6.png",
            "env": "sea",
            "speaker": "镜中倒影",
            "objective": "在问心之镜面前剖白归乡的本质动机",
            "text": "海面上立着一面巨大的镜子，镜中的你开口说话，声音一模一样：“你为什么要回家？”",
            "choices": [
                {
                    "text": "“因为那是我的家。”",
                    "hint": "",
                    "deltas": { "sanity": -5 },
                    "resolutionText": "镜中的你冰冷嘲笑：“那是你的家吗？离开二十年了，家还认得你吗？”镜碎留痕。",
                    "nextKnot": "knot_act2_gate5_shadow"
                },
                {
                    "text": "“因为我答应过要把他们带回去。”",
                    "hint": "",
                    "deltas": { "loyalty": 10 },
                    "resolutionText": "镜中的你沉默片刻微微点头，镜子碎落海面化作满天月光。",
                    "nextKnot": "knot_act2_gate5_shadow"
                },
                {
                    "text": "不说话，伸手触碰镜面",
                    "hint": "",
                    "deltas": {},
                    "resolutionText": "指尖触碰瞬间镜面碎裂无痕，前路迷雾更深。",
                    "nextKnot": "knot_act2_gate5_shadow"
                }
            ]
        },
        "knot_act2_gate5_shadow": {
            "id": "knot_act2_gate5_shadow",
            "act": 2, "stage": 4,
            "majorId": "major_6",
            "title": "第五门：舍影",
            "chapter": "第二幕 · 提那鲁斯 · 神之域",
            "icon": "👤",
            "image": "/img/大事件配图/大事件6.png",
            "env": "sea",
            "speaker": "迷宫阴影",
            "objective": "面对无相黑影做出献祭抉择",
            "text": "石柱投下的黑色无相之影沉沉发问：“你们放下了名字、放下了剑、放下了自己，究竟还剩什么？把你们的影子给我，就可以出去了。”",
            "choices": [
                {
                    "text": "不给影子。“我们的影子只属于我们自己！”",
                    "hint": "",
                    "deltas": { "sanity": 10, "loyalty": 5 },
                    "resolutionText": "船员们拔出佩剑护在身周，阴影大笑隐退，你亲自掌舵劈开重雾！",
                    "nextKnot": "knot_act2_gate6_final_ferry"
                },
                {
                    "text": "把船长自己的影子给它。“我给你就足够了。”",
                    "hint": "",
                    "deltas": { "loyalty": 15, "sanity": 5 },
                    "resolutionText": "影子留在了原地化作你的替身，你感觉轻如羽毛，但你记得为什么在走，引领全船破关！",
                    "nextKnot": "knot_act2_gate6_final_ferry"
                },
                {
                    "text": "把船员的影子给它。“你想要谁的，我把他的影子给你。”",
                    "hint": "",
                    "triggerEnding": "death_sea",
                    "resolutionText": "船员们影子被抽走倒地化作沉重空壳，战船剧烈下沉被海水吞没，只留你一人在虚空溺毙！"
                }
            ]
        },
        "knot_act2_gate6_final_ferry": {
            "id": "knot_act2_gate6_final_ferry",
            "act": 2, "stage": 5,
            "title": "第六门：终渡",
            "chapter": "第二幕 · 提那鲁斯 · 神之域",
            "icon": "⛵",
            "image": "/img/大事件配图/大事件7.png",
            "env": "sea",
            "speaker": "摆渡人",
            "objective": "在摆渡人面前抉择未知开阔海域或迷雾幻音",
            "text": "持篙的摆渡人立于出口前，指向两个方向：左边是一片开阔海域，泛着淡淡阳光；右边是一片浓雾，雾里传来妻子温柔呼唤你名字的声音！",
            "choices": [
                {
                    "text": "向左走：驶向开阔海域，无畏未知继续前行",
                    "hint": "",
                    "deltas": { "luck": 10, "sanity": 5 },
                    "unlockAchievement": "ach_crossing_realms",
                    "resolutionText": "回家的路从来不是画在地图上的。是一道又一道浪，是每天醒来把舵柄往同一个方向再拧一度。只要继续走，故乡就在前方！",
                    "nextAct": 3
                },
                {
                    "text": "向右走：循浓雾中妻子的呼唤声而去",
                    "hint": "",
                    "triggerEnding": "death_sea",
                    "resolutionText": "你走进了永远走不到的幻象小屋，赫尔墨斯的声音在很远的地方叹息：“你放下了水，放下了剑，但放不下一个声音。”海拥抱了你。"
                }
            ]
        },

        # ==========================================
        # 第三幕 · 阿尔戈斯 · 神之书（赫拉誓言碑）
        # ==========================================
        "knot_act3_oath_stele": {
            "id": "knot_act3_oath_stele",
            "act": 3, "stage": 0,
            "title": "阿尔戈斯沙滩 · 誓言碑",
            "chapter": "第三幕 · 阿尔戈斯 · 神之书",
            "icon": "🪨",
            "image": "/img/大事件配图/大事件8.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "在海滩立碑刻下誓言",
            "text": "战船在阿尔戈斯平缓的沙滩靠岸。中央立着一块被风磨光的滚烫石碑，刻着：“刻下你的誓言。”碑前放着一把刻刀。你拿起它。",
            "choices": [
                {
                    "text": "刻下“归”字：你只想回家，忘掉一切",
                    "hint": "",
                    "deltas": { "loyalty": -5 },
                    "setMemory": { "oath": "gui" },
                    "resolutionText": "你刻下了“归”字，只想回到门后做回自己，却未发觉身后的同伴目光落寞。",
                    "nextKnot": "knot_act3_q1_whose"
                },
                {
                    "text": "刻下“渡”字：回家是一场修行，是渡人也是渡己",
                    "hint": "",
                    "deltas": { "loyalty": 10 },
                    "setMemory": { "oath": "du" },
                    "resolutionText": "你刻下了“渡”字，船员们站在身后，沉甸甸的信任化作前行的磐石！",
                    "nextKnot": "knot_act3_q1_whose"
                }
            ]
        },
        "knot_act3_q1_whose": {
            "id": "knot_act3_q1_whose",
            "act": 3, "stage": 1,
            "title": "赫拉神庙内殿 · 一问“谁的？”",
            "chapter": "第三幕 · 神之书内殿",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件8.png",
            "env": "land", "landType": "human",
            "speaker": "灰袍祭司",
            "objective": "回答特洛伊财货归属之问",
            "text": "内殿祭司手握刻刀在石板上刻下两个字问你船上那些特洛伊财宝：“谁的？”庭院里的船员在守卫长矛间静静聆听。",
            "choices": [
                {
                    "text": "“他们的。”（特洛伊人的）",
                    "hint": "",
                    "deltas": { "loyalty": -5, "luck": 5 },
                    "resolutionText": "你祈求神明宽恕战火罪愆，但庭院里的船员们攥紧拳头，怒火隐现。",
                    "nextKnot": "knot_act3_q2_fear"
                },
                {
                    "text": "“我们的。”（血汗换来的战利品）",
                    "hint": "",
                    "deltas": { "loyalty": 5 },
                    "resolutionText": "你说出这是兄弟们拿命换来的战利品，庭院里的船员挺直了腰膛！",
                    "nextKnot": "knot_act3_q2_fear"
                },
                {
                    "text": "“不重要了。”（若不能回家，财货毫无意义）",
                    "hint": "",
                    "deltas": {},
                    "resolutionText": "祭司用满是老茧的掌心抹平石板，沉吟无声。",
                    "nextKnot": "knot_act3_q2_fear"
                }
            ]
        },
        "knot_act3_q2_fear": {
            "id": "knot_act3_q2_fear",
            "act": 3, "stage": 2,
            "title": "赫拉神庙内殿 · 二问“怕吗？”",
            "chapter": "第三幕 · 神之书内殿",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件8.png",
            "env": "land", "landType": "human",
            "speaker": "灰袍祭司",
            "objective": "剖白内心最深处的畏惧",
            "text": "祭司在石板上刻下两个字，展示给你看：“怕吗？”风暴中断裂的桅杆与绝望的面孔重现心头。",
            "choices": [
                {
                    "text": "“怕过。”（坦诚脆弱，第一次意识到自己非不可战胜）",
                    "hint": "",
                    "deltas": { "sanity": 5 },
                    "resolutionText": "坦承畏惧的瞬间，胸口郁结的执念终于释然松开。",
                    "nextKnot": "knot_act3_q3_faith"
                },
                {
                    "text": "“没有。”（咬牙做全船的擎天支柱，不可露怯）",
                    "hint": "",
                    "deltas": { "loyalty": 5 },
                    "resolutionText": "你断然否认，庭院里的兄弟们听到了主心骨坚定的声音。",
                    "nextKnot": "knot_act3_q3_faith"
                }
            ]
        },
        "knot_act3_q3_faith": {
            "id": "knot_act3_q3_faith",
            "act": 3, "stage": 3,
            "title": "赫拉神庙内殿 · 三问“信？”",
            "chapter": "第三幕 · 神之书内殿",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件8.png",
            "env": "land", "landType": "human",
            "speaker": "灰袍祭司",
            "objective": "回答信仰与托付之问",
            "text": "石板上只有一个字：“信？”你在黑暗中闭上双眼，浮现出许多面孔与神迹。",
            "choices": [
                {
                    "text": "“信他们。”（闭眼浮现的是死死抱住桅杆的同伴）",
                    "hint": "",
                    "deltas": { "loyalty": 10 },
                    "resolutionText": "庭院里紧攥的拳头慢慢松开，信任如无声暖流蔓延全船。",
                    "nextKnot": "knot_act3_q4_why_you"
                },
                {
                    "text": "“信自己。”（活到今天靠的是只信自己）",
                    "hint": "",
                    "deltas": { "sanity": 5, "loyalty": -5 },
                    "resolutionText": "庭院一片死寂，水手们心头笼上一层被排斥的阴霾。",
                    "nextKnot": "knot_act3_q4_why_you"
                },
                {
                    "text": "“信神。”（漂泊至今未死就是最大的神迹）",
                    "hint": "",
                    "deltas": { "luck": 10 },
                    "resolutionText": "祭司神色微动，刻刀再次划过石板。",
                    "nextKnot": "knot_act3_q4_why_you"
                }
            ]
        },
        "knot_act3_q4_why_you": {
            "id": "knot_act3_q4_why_you",
            "act": 3, "stage": 4,
            "title": "赫拉神庙内殿 · 四问“为什么是你？”",
            "chapter": "第三幕 · 神之书内殿",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件8.png",
            "env": "land", "landType": "human",
            "speaker": "灰袍祭司",
            "objective": "面对领袖地位的终极诘问",
            "text": "刻刀更利更急，石板转过来：“为什么是你？”为什么是你当船长？为什么是你带领大家？",
            "choices": [
                {
                    "text": "“因为只能是我。”（换了别人早就死了，没有人能替）",
                    "hint": "",
                    "deltas": { "loyalty": -5 },
                    "resolutionText": "傲慢的独断在石壁间回荡，庭院里有人悄悄叹了口气。",
                    "nextKnot": "knot_act3_q5_remember_oath"
                },
                {
                    "text": "“因为该我扛。”（许多比我该站在此的人倒下了，担子落下了我就得扛）",
                    "hint": "",
                    "deltas": { "loyalty": 10 },
                    "resolutionText": "你微笑着望向庭院，兄弟们的目光与你相视无言，深沉滚烫。",
                    "nextKnot": "knot_act3_q5_remember_oath"
                }
            ]
        },
        "knot_act3_q5_remember_oath": {
            "id": "knot_act3_q5_remember_oath",
            "act": 3, "stage": 5,
            "title": "赫拉神庙内殿 · 五问“誓言还记得吗？”",
            "chapter": "第三幕 · 神之书内殿",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件8.png",
            "env": "land", "landType": "human",
            "speaker": "灰袍祭司",
            "objective": "回顾沙滩石碑誓言的终极兑现",
            "text": "祭司伸手指向殿外海滩立着的那块石碑。他在问你——沙滩上刻下的字，你还记得吗？还打算兑现吗？",
            "choices": [
                {
                    "text": "“我记得。”（坚守最初在石碑前刻下的本心）",
                    "hint": "",
                    "deltas": { "loyalty": 5 },
                    "resolutionText": "祭司推开沉重的殿门，海风与阳光再次落上你的肩头。",
                    "nextKnot": "knot_act3_temple_judgement"
                },
                {
                    "text": "“那是我刻的，但不是我选的。”（坦白内心的动摇与反思）",
                    "hint": "",
                    "deltas": { "sanity": 5 },
                    "resolutionText": "祭司轻轻拍了拍你的肩头，如同轻拍远方归来的游子。殿门开启。",
                    "nextKnot": "knot_act3_temple_judgement"
                }
            ]
        },
        "knot_act3_temple_judgement": {
            "id": "knot_act3_temple_judgement",
            "act": 3, "stage": 6,
            "majorId": "major_10",
            "title": "神庙阶前 · 忠诚裁决与归航双途",
            "chapter": "第三幕 · 归途抉择",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件10.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "走出神庙，在同伴环绕下做出最终归航路线抉择",
            "text": "走下神庙台阶，守卫退回墙边。战船重新补满了食物与淡水。你面对全船兄弟，眼前展开了终局的两条航路。",
            "choices": [
                {
                    "text": "走那条被光照亮的路，朝着夕阳驶去",
                    "hint": "",
                    "condition": { "minLoyalty": 35, "hint": "需全员忠诚稳固（≥35）方可维系统领" },
                    "deltas": { "food": 20, "sanity": 10, "loyalty": 10 },
                    "resolutionText": "光落在水面上碎成银鳞，船员们默默跟随。海风带着家乡的味道吹来，战船朝着夕阳全速归航！",
                    "nextAct": 4
                },
                {
                    "text": "驶入那片无风的海，让疲惫的船员们彻底歇息",
                    "hint": "",
                    "triggerEnding": "death_sea",
                    "resolutionText": "海水如床无声漫上甲板，船员闭目长眠不再醒来。“无风的海怎么能是回家的路呢？”海神将一切归于永寂。"
                },
                {
                    "text": "直面哗变同袍的刀锋（忠诚崩溃分支）",
                    "hint": "",
                    "condition": { "maxLoyalty": 34, "hint": "忠诚度崩溃时无可避免的流血兵变" },
                    "triggerEnding": "death_land",
                    "resolutionText": "庭院中众人拔刀相向，老舵手被断桨刺穿胸膛！你在同伴的刀兵与火星中倒在石碑前，残阳如血！"
                }
            ]
        },

        # ==========================================
        # 终章 · 菲埃克斯救赎与归乡
        # ==========================================
        "knot_epilogue_phaeacians": {
            "id": "knot_epilogue_phaeacians",
            "act": 4, "stage": 0,
            "majorId": "major_12",
            "title": "斯克里亚 · 援手",
            "chapter": "终章 · 斯克里亚 · 援手",
            "icon": "🏛️",
            "image": "/img/大事件配图/大事件12.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "向菲埃克斯国王陈情万劫史诗，整备踏上最后归途",
            "text": "与大海搏斗至最后一刻，你们被冲上斯克里亚岛的河口。少女的笑声惊醒了你们——瑙西卡娅公主向你们施以援手。国王在金碧辉煌的宫殿里听完你的万劫史诗：“明天，我亲自送你们回家。”",
            "choices": [
                {
                    "text": "感激菲埃克斯人的恩惠，整备行装踏上归船",
                    "hint": "",
                    "deltas": { "food": 30, "loyalty": 15 },
                    "resolutionText": "菲埃克斯的快船切开黎明的薄雾，将战利品与幸存的兄弟送向那片魂牵梦萦的故土沙滩！",
                    "nextKnot": "knot_epilogue_home"
                }
            ]
        },
        "knot_epilogue_home": {
            "id": "knot_epilogue_home",
            "act": 4, "stage": 1,
            "title": "踏上故土 · 阿萨卡海滩",
            "chapter": "终章 · 故土归途",
            "icon": "🏡",
            "image": "/img/重要配图/凯旋结局2.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "踏上故土阿萨卡海滩，完成漫长归途评定",
            "text": "晨雾散去，熟悉的石阶与橄榄树倒映在水面上。你的靴子深深踩进故乡的泥沙里。钟声在山坡上回荡，人群涌向海滩。十年特洛伊战火，十年漂泊沉浮——你，终于回家了！",
            "choices": [
                {
                    "text": "走下跳板，面向故乡人群张开双臂",
                    "hint": "",
                    "deltas": {},
                    "triggerFinalEnding": True
                }
            ]
        }
    }

    return story_acts, knots
