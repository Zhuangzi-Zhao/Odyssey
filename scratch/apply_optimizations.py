import re
import os

print("=== Applying Plot & Knot Optimizations ===")

acts_file = 'scratch/generate_acts_data.py'
with open(acts_file, 'r', encoding='utf-8') as f:
    acts_content = f.read()

# 1. Add knot_easter_egg_caphireus_pass and knot_easter_egg_triumphant_landing
easter_egg_knots = '''
        # ==========================================
        # 序幕彩蛋线 · 卡法柔斯奇迹突破与顺风直接返乡
        # ==========================================
        "knot_easter_egg_caphireus_pass": {
            "id": "knot_easter_egg_caphireus_pass",
            "act": 0, "stage": 3,
            "title": "卡法柔斯奇迹 · 顺风彩蛋线",
            "chapter": "隐藏彩蛋 · 神佑捷径",
            "icon": "🕊️",
            "image": "/img/重要配图/开端1.png",
            "env": "sea",
            "speaker": "老水手",
            "objective": "顺利通过卡法柔斯海角，选择即刻归乡或巡游庆功",
            "text": "不可思议的奇迹！在你的英明决断下，战船奇迹般冲破了卡法柔斯海角的灭顶狂澜！\\n当最后一阵雷暴被甩在船尾，海面突然平静如镜，金色的晨曦穿透云层，洒在每一位安然无恙的同胞脸上。波塞冬的三叉戟悄然归隐深海，爱琴海向你们敞开了最为温和的怀抱。\\n老水手颤抖着手抚摸着完好无损的木榫，喜极而泣：“船长……我们绕过了所有厄运！海流正推着我们直奔阿萨卡！顺风只要两天……只要两天我们就能回到家乡！”\\n三十名同乡兄弟欢呼雷动，你们避开了十年的孤岛漂泊，创造了希腊联军绝无仅有的神迹！",
            "choices": [
                {
                    "text": "【直接返乡 · 凯旋抵港】满帆直航，驶入阿萨卡故土海滩",
                    "hint": "",
                    "triggerEnding": "caphireus_easter_egg_home",
                    "unlockAchievement": "ach_caphireus_miracle",
                    "resolutionText": "你下令全帆张开，战船劈开宁静如镜的碧波向西直航。顺风顺水，第三日清晨，阿萨卡的橄榄林在破晓金辉中映入眼帘！你做到了凡人未曾设想的神迹——完满归乡！"
                },
                {
                    "text": "【彩蛋整备 · 巡游庆功】在金光潋滟的避风湾痛饮庆功，享受诸神垂青",
                    "hint": "",
                    "deltas": { "food": 30, "sanity": 30, "luck": 30, "loyalty": 30 },
                    "resolutionText": "全船在平静的避风湾抛锚，开怀痛饮特洛伊的美酒！神恩与忠诚达到前所未有的顶峰。整备完毕后，战船在欢呼声中扬帆驶向故乡！",
                    "nextKnot": "knot_easter_egg_triumphant_landing"
                },
                {
                    "text": "【传奇雄心 · 转向未知远洋】“我们已见证神迹，但英雄的灵魂渴望更远的世界”",
                    "hint": "",
                    "deltas": { "sanity": 10, "luck": 10 },
                    "resolutionText": "你望向遥远外海奇异的迷雾，心潮澎湃。既然上天赐予全船完好无损的战力，你决定率领这支无敌之师，继续探索爱琴海深处隐秘的未知神域！",
                    "nextAct": 1
                }
            ]
        },
        "knot_easter_egg_triumphant_landing": {
            "id": "knot_easter_egg_triumphant_landing",
            "act": 0, "stage": 4,
            "title": "故土阿萨卡 · 黄金凯旋",
            "chapter": "隐藏彩蛋 · 凡人神迹",
            "icon": "🏛️",
            "image": "/img/重要配图/凯旋结局2.png",
            "env": "land", "landType": "human",
            "speaker": "旁白",
            "objective": "步下跳板，登上故土阿萨卡海滩",
            "text": "晨钟齐鸣！战船缓缓驶入阿萨卡石砌码头。\\n全城百姓惊愕而后狂喜地涌上海滩——出发时的三十名同胞一个不落全部站在甲板上，满载特洛伊的荣耀与给养，完好无损地踏上了故土！\\n你的妻子带着孩子穿过欢呼的人群向你奔来。这是整个希腊史诗中最不可思议的一页：凡人未受十年磨难，凭借至高智慧与决断，赢得了最圆满的归乡！",
            "choices": [
                {
                    "text": "【步下跳板，拥抱故土与家人】走下战船，步入温暖家门",
                    "hint": "",
                    "triggerEnding": "caphireus_easter_egg_home",
                    "unlockAchievement": "ach_caphireus_miracle",
                    "resolutionText": "你紧紧拥抱着妻子与孩子，耳畔回荡着同胞们的欢歌。爱与故土，就在脚下。"
                }
            ]
        },
'''

if "knot_easter_egg_caphireus_pass" not in acts_content:
    target_pos = acts_content.find('"knot_act1_q1_how_survive": {')
    if target_pos != -1:
        acts_content = acts_content[:target_pos] + easter_egg_knots + '\n        ' + acts_content[target_pos:]
        print("[OK] Added Easter Egg knots")

# 2. Update Prologue Storm knots with class-specific choices
warrior_choice = '''                {
                    "text": "【武领军阵】组织甲士结成长矛盾阵加固龙骨，逆波前冲！",
                    "hint": "",
                    "condition": { "requiredClass": "warrior", "minLoyalty": 60 },
                    "resolutionText": "“阿卡亚的勇士，随我顶住！”你拔出精铜巨剑刺入甲板稳固身形，号令全员排开盾阵！全船受你豪气感召，同心协力以战阵之势死死扼制狂澜！战船借着排浪飞跃暗礁，奇迹般突破了卡法柔斯海角！",
                    "nextKnot": "knot_easter_egg_caphireus_pass"
                },'''

if "【武领军阵】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_prologue_warrior_storm": {\n            "id": "knot_prologue_warrior_storm",\n            "act": 0, "stage": 1,\n            "title": "卡法柔斯海角 · 浩劫之怒",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "在海神波塞冬的雷霆狂澜中拼死维稳船身",\n            "text": "船队驶入卡法柔斯海角时，天像被人从外面扣上了一只碗。海面泛起一层古铜色的光泽，桨叶发出奇怪的嗡鸣。舵柄在发烫，像有人从海底伸出一只手隔着龙骨在底下烧。\\n海在你的眼前裂开了！两道巨浪左右合拢，整支舰队被拦腰截断，左边撞碎在礁石上，右边被浪墙吞没！闪电翻涌中，波塞冬手持三叉戟立于风暴正中——在神的面前，你的剑没有用，你的经验没有用，你的骄傲没有用。你什么都不是。",\n            "choices": [\n                {',
        '"knot_prologue_warrior_storm": {\n            "id": "knot_prologue_warrior_storm",\n            "act": 0, "stage": 1,\n            "title": "卡法柔斯海角 · 浩劫之怒",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "在海神波塞冬的雷霆狂澜中拼死维稳船身",\n            "text": "船队驶入卡法柔斯海角时，天像被人从外面扣上了一只碗。海面泛起一层古铜色的光泽，桨叶发出奇怪的嗡鸣。舵柄在发烫，像有人从海底伸出一只手隔着龙骨在底下烧。\\n海在你的眼前裂开了！两道巨浪左右合拢，整支舰队被拦腰截断，左边撞碎在礁石上，右边被浪墙吞没！闪电翻涌中，波塞冬手持三叉戟立于风暴正中——在神的面前，你的剑没有用，你的经验没有用，你的骄傲没有用。你什么都不是。",\n            "choices": [\n' + warrior_choice + '\n                {'
    )
    print("[OK] Added warrior storm choice")

priest_choice = '''                {
                    "text": "【大祭司祷祝】高举神杖沟通风暴之灵，以血奉献祈得神风护佑！",
                    "hint": "",
                    "condition": { "requiredClass": "priest", "minSanity": 60 },
                    "resolutionText": "你划破手掌将热血洒向怒涛，高举神杖高声咏唱古老的宁海颂歌！金色的神圣微光撕开暗云，波塞冬的三叉戟在神光前微微一滞。海风瞬间转向，战船借神风奇迹般穿透狂澜，顺利突破卡法柔斯！",
                    "nextKnot": "knot_easter_egg_caphireus_pass"
                },'''

if "【大祭司祷祝】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_prologue_priest_storm": {\n            "id": "knot_prologue_priest_storm",\n            "act": 0, "stage": 1,\n            "title": "卡法柔斯海角 · 神怒审视",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "直面海神冷漠审视，在狂澜中求生",\n            "text": "船队驶入卡法柔斯海角，两道巨浪将舰队截断！雷暴中波塞冬手持三叉戟立于风暴正中——那双眼里没有愤怒也没有仇恨，只有冷冰冰、漫不经心的审视，像在看一群蚂蚁。\\n在神的面前，你的祈祷没有用，你的祭祀没有用，烧过的香念过的祷词都没有用。祂不在乎。",\n            "choices": [\n                {',
        '"knot_prologue_priest_storm": {\n            "id": "knot_prologue_priest_storm",\n            "act": 0, "stage": 1,\n            "title": "卡法柔斯海角 · 神怒审视",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "直面海神冷漠审视，在狂澜中求生",\n            "text": "船队驶入卡法柔斯海角，两道巨浪将舰队截断！雷暴中波塞冬手持三叉戟立于风暴正中——那双眼里没有愤怒也没有仇恨，只有冷冰冰、漫不经心的审视，像在看一群蚂蚁。\\n在神的面前，你的祈祷没有用，你的祭祀没有用，烧过的香念过的祷词都没有用。祂不在乎。",\n            "choices": [\n' + priest_choice + '\n                {'
    )
    print("[OK] Added priest storm choice")

helmsman_choice = '''                {
                    "text": "【老舵手绝技】迎头逆切九重巨浪，借暴风反作用力强行抢风调头！",
                    "hint": "",
                    "condition": { "requiredClass": "helmsman", "minSanity": 55 },
                    "resolutionText": "你凭借二十年老舵手对海流脾性的直觉，双手死死卡住舵柄，迎着千钧浪头反向斜切！战船宛如飞鱼般轻巧掠过致命暗礁，借着回旋风暴的反冲力猛冲出海角险境，驶入开阔平静海域！",
                    "nextKnot": "knot_easter_egg_caphireus_pass"
                },'''

if "【老舵手绝技】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_prologue_helmsman_storm": {\n            "id": "knot_prologue_helmsman_storm",\n            "act": 0, "stage": 1,\n            "title": "逆浪与反常 · 经验崩塌",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "面对反常逆浪，拼尽老舵手本领死守船舵",\n            "text": "驶入卡法柔斯海角，风从西北来，浪从东南来——二十年来从无风浪逆行！舵柄发烫如火烧。海在眼前裂开，舰队被拦腰截断！闪电下波塞冬立于风暴正中。\\n你半辈子不信神，祭坛前从不低头。可此刻你忽然发现，二十年的经验与自信，在神面前轻得像一片被风卷起的木屑。在神的面前，你的经验没有用，你的舵柄没有用，你的骄傲没有用。",\n            "choices": [\n                {',
        '"knot_prologue_helmsman_storm": {\n            "id": "knot_prologue_helmsman_storm",\n            "act": 0, "stage": 1,\n            "title": "逆浪与反常 · 经验崩塌",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "面对反常逆浪，拼尽老舵手本领死守船舵",\n            "text": "驶入卡法柔斯海角，风从西北来，浪从东南来——二十年来从无风浪逆行！舵柄发烫如火烧。海在眼前裂开，舰队被拦腰截断！闪电下波塞冬立于风暴正中。\\n你半辈子不信神，祭坛前从不低头。可此刻你忽然发现，二十年的经验与自信，在神面前轻得像一片被风卷起的木屑。在神的面前，你的经验没有用，你的舵柄没有用，你的骄傲没有用。",\n            "choices": [\n' + helmsman_choice + '\n                {'
    )
    print("[OK] Added helmsman storm choice")

merchant_choice = '''                {
                    "text": "【富贾断腕】抛弃所有特洛伊金银压舱，以轻舟极速掠浪滑翔！",
                    "hint": "",
                    "condition": { "requiredClass": "merchant", "minFood": 55 },
                    "resolutionText": "“钱财乃身外之物，活命才是根本！”你果断命人将满舱最沉重的青铜器与金币抛入深海。战船吃水瞬间大减，身轻如燕，借着涌浪腾跃越过卡法柔斯咆哮的浅滩，安然冲出风暴！",
                    "nextKnot": "knot_easter_egg_caphireus_pass"
                },'''

if "【富贾断腕】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_prologue_merchant_storm": {\n            "id": "knot_prologue_merchant_storm",\n            "act": 0, "stage": 1,\n            "title": "万金碎裂 · 神不交易",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "在货物撞碎与覆灭边缘做出抉择",\n            "text": "卡法柔斯海角天如扣碗，沉重的战利品让木板发软。海在眼前裂开，舰队撞礁粉碎！闪电下波塞冬冷酷审视蝼蚁。你从没去过祭坛，你只负责把账算清，但此刻你忽然发现，算了十年的账在那道目光面前一文不值。在神的面前，你的账本没有用，你的黄金没有用。祂不会与你交易。",\n            "choices": [\n                {',
        '"knot_prologue_merchant_storm": {\n            "id": "knot_prologue_merchant_storm",\n            "act": 0, "stage": 1,\n            "title": "万金碎裂 · 神不交易",\n            "chapter": "序幕 · 毁灭风暴",\n            "icon": "🌊",\n            "image": "/img/重要配图/开端3.png",\n            "env": "sea",\n            "speaker": "旁白",\n            "objective": "在货物撞碎与覆灭边缘做出抉择",\n            "text": "卡法柔斯海角天如扣碗，沉重的战利品让木板发软。海在眼前裂开，舰队撞礁粉碎！闪电下波塞冬冷酷审视蝼蚁。你从没去过祭坛，你只负责把账算清，但此刻你忽然发现，算了十年的账在那道目光面前一文不值。在神的面前，你的账本没有用，你的黄金没有用。祂不会与你交易。",\n            "choices": [\n' + merchant_choice + '\n                {'
    )
    print("[OK] Added merchant storm choice")

# 3. Add class choices to knot_act1_q1_how_survive
act1_q1_class_choices = '''                {
                    "text": "【武领之道】靠血战与军令。十年来以阿卡亚战阵保全同袍，刀刃向外，盾牌向内",
                    "hint": "",
                    "condition": { "requiredClass": "warrior" },
                    "deltas": { "loyalty": 10, "sanity": 5 },
                    "setMemory": { "q1_answer": "warrior_discipline" },
                    "resolutionText": "老渔夫微微颔首：“兵者以令立身。你的剑若为同袍而挥，它便不会斩向自己的脊梁。”老渔夫化作清风散去。",
                    "nextKnot": "knot_act1_q1_reef_straits"
                },
                {
                    "text": "【祭司之道】靠神谕与清净。顺应诸神旨意，以洁净之心抚平波涛与灾殃",
                    "hint": "",
                    "condition": { "requiredClass": "priest" },
                    "deltas": { "luck": 10, "sanity": 10 },
                    "setMemory": { "q1_answer": "priest_divine" },
                    "resolutionText": "老渔夫眼眸如星辉闪动：“敬神者不溺于傲慢。记住这一炉香烟的微光，它能穿透幽冥。”老渔夫化风不见。",
                    "nextKnot": "knot_act1_q1_reef_straits"
                },
                {
                    "text": "【老舵之道】靠知风与掌舵。敬畏大海的每一道浪，顺应洋流而生，绝不与天角力",
                    "hint": "",
                    "condition": { "requiredClass": "helmsman" },
                    "deltas": { "sanity": 10, "loyalty": 5 },
                    "setMemory": { "q1_answer": "helmsman_tack" },
                    "resolutionText": "老渔夫拍了拍斑驳的船舷：“好舵手懂得浪的脾气。大海从不战胜顺应它的人。”老渔夫笑着散入薄雾。",
                    "nextKnot": "knot_act1_q1_reef_straits"
                },
                {
                    "text": "【富贾之道】靠筹谋与衡平。算清每一份给养与损耗，以契约与实利保全全员生机",
                    "hint": "",
                    "condition": { "requiredClass": "merchant" },
                    "deltas": { "food": 10, "loyalty": 10 },
                    "setMemory": { "q1_answer": "merchant_balance" },
                    "resolutionText": "老渔夫拈须微笑：“算得清利害的人，才能分得清死生。但别忘了，最贵重的东西往往没有标价。”",
                    "nextKnot": "knot_act1_q1_reef_straits"
                },'''

if "【武领之道】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_act1_q1_how_survive": {\n            "id": "knot_act1_q1_how_survive",\n            "act": 1, "stage": 0,\n            "title": "第一问：你靠什么活下来？",\n            "chapter": "第一幕 · 米拉托斯 · 神之问",\n            "icon": "⚓",\n            "image": "/img/大事件配图/大事件1.png",\n            "env": "sea",\n            "speaker": "老渔夫",\n            "objective": "回答老渔夫的生存叩问",\n            "text": "特洛伊的灰烬沉入海底，战船修补得勉强能走。清晨，你在船头缆绳墩上发现了一个赤脚的老渔夫。“你从特洛伊来，”他转过头，眼睛亮得不像老人，“波塞冬没有杀死你，雅典娜没有抛弃你。但你靠什么活下来？剑，还是头脑？”",\n            "choices": [\n                {',
        '"knot_act1_q1_how_survive": {\n            "id": "knot_act1_q1_how_survive",\n            "act": 1, "stage": 0,\n            "title": "第一问：你靠什么活下来？",\n            "chapter": "第一幕 · 米拉托斯 · 神之问",\n            "icon": "⚓",\n            "image": "/img/大事件配图/大事件1.png",\n            "env": "sea",\n            "speaker": "老渔夫",\n            "objective": "回答老渔夫的生存叩问",\n            "text": "特洛伊的灰烬沉入海底，战船修补得勉强能走。清晨，你在船头缆绳墩上发现了一个赤脚的老渔夫。“你从特洛伊来，”他转过头，眼睛亮得不像老人，“波塞冬没有杀死你，雅典娜没有抛弃你。但你靠什么活下来？剑，还是头脑？”",\n            "choices": [\n' + act1_q1_class_choices + '\n                {'
    )
    print("[OK] Added Act 1 Q1 class choices")

# 4. Add class choices to knot_act1_q2_sandbar_survivors
act1_q2_class_choices = '''                {
                    "text": "【武领重诺】“希腊勇士不弃同袍！”接他们登船并整编入阵，同生共死",
                    "hint": "",
                    "condition": { "requiredClass": "warrior" },
                    "deltas": { "crew": 5, "food": -10, "loyalty": 15 },
                    "resolutionText": "你拔剑划沙立誓，号令战船抛缆接应！三十名弟兄齐心合力，将虚弱的同袍悉数背上甲板。士气如虹，军威大震！",
                    "nextKnot": "knot_act1_q3_put_down_sword"
                },
                {
                    "text": "【祭司祝水】以圣水为受难者解渴祈福，神明必看顾施予庇佑之舟",
                    "hint": "",
                    "condition": { "requiredClass": "priest" },
                    "deltas": { "crew": 4, "luck": 15, "sanity": 10, "food": -10 },
                    "resolutionText": "你手持圣杯走下浅滩，为每一个干渴的灵魂分饮净水。神光隐隐，善行受纳，全船人精神大振！",
                    "nextKnot": "knot_act1_q3_put_down_sword"
                },
                {
                    "text": "【老舵收编】“都是海里讨饭的苦兄弟！”清理下层舱位，安置他们同舟共济",
                    "hint": "",
                    "condition": { "requiredClass": "helmsman" },
                    "deltas": { "crew": 4, "loyalty": 10, "sanity": 5, "food": -10 },
                    "resolutionText": "你亲自跳入齐腰深的海水，将落难弟兄逐一托上舢板，老水手们的默契相助让两拨人迅速融为一体！",
                    "nextKnot": "knot_act1_q3_put_down_sword"
                },
                {
                    "text": "【商契共生】定下互助契约：分出救急口粮换取他们全力摇桨加速航行",
                    "hint": "",
                    "condition": { "requiredClass": "merchant" },
                    "deltas": { "crew": 4, "loyalty": 10, "food": -5 },
                    "resolutionText": "你公平明晰地分派了干粮与水壶，落难水手们感激涕零，甘愿立誓成为最卖力的桨手以报救命之恩！",
                    "nextKnot": "knot_act1_q3_put_down_sword"
                },'''

if "【武领重诺】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_act1_q2_sandbar_survivors": {\n            "id": "knot_act1_q2_sandbar_survivors",\n            "act": 1, "stage": 3,\n            "title": "沙洲残船 · 三日绝水者",\n            "chapter": "第一幕 · 沙洲抉择",\n            "icon": "🏝️",\n            "image": "/img/大事件配图/大事件1.png",\n            "env": "sea",\n            "speaker": "落难同袍",\n            "objective": "面对绝水遇难同胞的存亡抉择",\n            "text": "前方的沙洲上横亘着一艘折成两截的巨船，十数名幸存者麻木地站着。一名汉子水没过膝走来：“我们从特洛伊另一艘船游过来的，三天没水了。带我们走可能撑不到下个岛，不带我们也不怪你，只是得让你知道。”两群人在烈日下互相对视。",\n            "choices": [\n                {',
        '"knot_act1_q2_sandbar_survivors": {\n            "id": "knot_act1_q2_sandbar_survivors",\n            "act": 1, "stage": 3,\n            "title": "沙洲残船 · 三日绝水者",\n            "chapter": "第一幕 · 沙洲抉择",\n            "icon": "🏝️",\n            "image": "/img/大事件配图/大事件1.png",\n            "env": "sea",\n            "speaker": "落难同袍",\n            "objective": "面对绝水遇难同胞的存亡抉择",\n            "text": "前方的沙洲上横亘着一艘折成两截的巨船，十数名幸存者麻木地站着。一名汉子水没过膝走来：“我们从特洛伊另一艘船游过来的，三天没水了。带我们走可能撑不到下个岛，不带我们也不怪你，只是得让你知道。”两群人在烈日下互相对视。",\n            "choices": [\n' + act1_q2_class_choices + '\n                {'
    )
    print("[OK] Added Act 1 Q2 class choices")

# 5. Add class choices to knot_act2_gate1_drinking
act2_gate1_class_choices = '''                {
                    "text": "【武领克制】以刚毅军纪严令全军戒绝暴饮，仅以随身皮囊匀取数口润喉",
                    "hint": "",
                    "condition": { "requiredClass": "warrior" },
                    "deltas": { "sanity": 10, "loyalty": 10 },
                    "resolutionText": "你横刀立于水幕前，严明的战时纪律震慑住躁动。全船将士克制贪欲，水幕在敬佩的叹息声中悄然隐退。",
                    "nextKnot": "knot_act2_gate2_forget_name"
                },
                {
                    "text": "【祭司净泉】默念净水神咒，向赫尔墨斯供奉第一捧清泉后适量取用",
                    "hint": "",
                    "condition": { "requiredClass": "priest" },
                    "deltas": { "luck": 15, "sanity": 10 },
                    "resolutionText": "你以银匙向虚空献祭甘泉，神使的迷雾骤然化作金光散开，水幕恭顺退避！",
                    "nextKnot": "knot_act2_gate2_forget_name"
                },
                {
                    "text": "【老舵警觉】深知海雾幽泉诡谲，取一小桶清水并严令全员绝不暴饮沉沦",
                    "hint": "",
                    "condition": { "requiredClass": "helmsman" },
                    "deltas": { "sanity": 10, "loyalty": 5 },
                    "resolutionText": "老舵手的谨慎经验救了全船！甘甜之泉未化作催命的涡流，水幕平缓落下引出明路。",
                    "nextKnot": "knot_act2_gate2_forget_name"
                },
                {
                    "text": "【商贾定额】按人头严格精确分水，绝不多盛一滴触动迷宫杀机",
                    "hint": "",
                    "condition": { "requiredClass": "merchant" },
                    "deltas": { "food": 10, "sanity": 10 },
                    "resolutionText": "你取出量器毫厘不爽地分配泉水，冷静的算筹破除了贪婪幻阵，水柱消散于无形。",
                    "nextKnot": "knot_act2_gate2_forget_name"
                },'''

if "【武领克制】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_act2_gate1_drinking": {\n            "id": "knot_act2_gate1_drinking",\n            "act": 2, "stage": 0,\n            "title": "第一门：饮川",\n            "chapter": "第二幕 · 提那鲁斯 · 神之域",\n            "icon": "🌊",\n            "image": "/img/大事件配图/大事件2.png",\n            "env": "sea",\n            "speaker": "神使迷宫",\n            "objective": "在浓雾水幕与甘泉前经受贪婪考验",\n            "text": "战船驶入浓雾，灰色的雾墙将海天缝在一起。水幕化作两根水柱凭空升起，水幕后陈列着盛满清水的陶罐。全船干渴如焚。",\n            "choices": [\n                {',
        '"knot_act2_gate1_drinking": {\n            "id": "knot_act2_gate1_drinking",\n            "act": 2, "stage": 0,\n            "title": "第一门：饮川",\n            "chapter": "第二幕 · 提那鲁斯 · 神之域",\n            "icon": "🌊",\n            "image": "/img/大事件配图/大事件2.png",\n            "env": "sea",\n            "speaker": "神使迷宫",\n            "objective": "在浓雾水幕与甘泉前经受贪婪考验",\n            "text": "战船驶入浓雾，灰色的雾墙将海天缝在一起。水幕化作两根水柱凭空升起，水幕后陈列着盛满清水的陶罐。全船干渴如焚。",\n            "choices": [\n' + act2_gate1_class_choices + '\n                {'
    )
    print("[OK] Added Act 2 Gate 1 class choices")

# 6. Add class choices to knot_act3_oath_stele
act3_oath_class_choices = '''                {
                    "text": "【武领誓约】刻下“同生共死”：必携全船同胞血战到底，全须全尾回家",
                    "hint": "",
                    "condition": { "requiredClass": "warrior" },
                    "deltas": { "loyalty": 15, "sanity": 5 },
                    "setMemory": { "oath": "warrior_oath" },
                    "resolutionText": "石碑碎屑飞溅，你刻下了武者的铁血之誓！全船兄弟振臂高呼，誓死追随！",
                    "nextKnot": "knot_act3_q1_whose"
                },
                {
                    "text": "【祭司誓约】刻下“虔敬如初”：以清净仁心顺应天命，不负神明眷顾",
                    "hint": "",
                    "condition": { "requiredClass": "priest" },
                    "deltas": { "luck": 15, "sanity": 10 },
                    "setMemory": { "oath": "priest_oath" },
                    "resolutionText": "刻刀如行云流水，古老祭司的圣字散发着淡淡的金辉，诸神的注视仿佛化作护佑的暖风。",
                    "nextKnot": "knot_act3_q1_whose"
                },
                {
                    "text": "【老舵誓约】刻下“矢志不偏”：哪怕沧海桑田，手中木舵永不偏航",
                    "hint": "",
                    "condition": { "requiredClass": "helmsman" },
                    "deltas": { "loyalty": 10, "sanity": 10 },
                    "setMemory": { "oath": "helmsman_oath" },
                    "resolutionText": "你以握舵二十年的茧手用力刻下永不偏移的罗盘之印，老水手们目光如铁，信心倍增！",
                    "nextKnot": "knot_act3_q1_whose"
                },
                {
                    "text": "【富贾誓约】刻下“千金散尽”：散尽特洛伊财帛，只求带弟兄们重见故土炊烟",
                    "hint": "",
                    "condition": { "requiredClass": "merchant" },
                    "deltas": { "loyalty": 20, "food": 5 },
                    "setMemory": { "oath": "merchant_oath" },
                    "resolutionText": "石碑上刻下商贾舍金取义的重誓，船员们相视而笑，贪恋财货的戾气一扫而空！",
                    "nextKnot": "knot_act3_q1_whose"
                },'''

if "【武领誓约】" not in acts_content:
    acts_content = acts_content.replace(
        '"knot_act3_oath_stele": {\n            "id": "knot_act3_oath_stele",\n            "act": 3, "stage": 0,\n            "title": "阿尔戈斯沙滩 · 誓言碑",\n            "chapter": "第三幕 · 阿尔戈斯 · 神之书",\n            "icon": "🪨",\n            "image": "/img/大事件配图/大事件8.png",\n            "env": "land", "landType": "human",\n            "speaker": "旁白",\n            "objective": "在海滩立碑刻下誓言",\n            "text": "战船在阿尔戈斯平缓的沙滩靠岸。中央立着一块被风磨光的滚烫石碑，刻着：“刻下你的誓言。”碑前放着一把刻刀。你拿起它。",\n            "choices": [\n                {',
        '"knot_act3_oath_stele": {\n            "id": "knot_act3_oath_stele",\n            "act": 3, "stage": 0,\n            "title": "阿尔戈斯沙滩 · 誓言碑",\n            "chapter": "第三幕 · 阿尔戈斯 · 神之书",\n            "icon": "🪨",\n            "image": "/img/大事件配图/大事件8.png",\n            "env": "land", "landType": "human",\n            "speaker": "旁白",\n            "objective": "在海滩立碑刻下誓言",\n            "text": "战船在阿尔戈斯平缓的沙滩靠岸。中央立着一块被风磨光的滚烫石碑，刻着：“刻下你的誓言。”碑前放着一把刻刀。你拿起它。",\n            "choices": [\n' + act3_oath_class_choices + '\n                {'
    )
    print("[OK] Added Act 3 Oath Stone class choices")

with open(acts_file, 'w', encoding='utf-8') as f:
    f.write(acts_content)

print("[OK] Saved updated generate_acts_data.py")

