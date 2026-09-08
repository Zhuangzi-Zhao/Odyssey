import os
import re
import json

def parse_delta_str(s):
    deltas = {}
    items = re.split(r'[|｜,，\n]+', s)
    for it in items:
        it = it.strip()
        if not it:
            continue
        m = re.search(r'(食物|精神值|精神|运气|神恩|忠诚度|忠诚|船员数量|船员|亚裔船员)\s*([+-]?\d+)([%％]?)', it)
        if m:
            key_raw, val_raw, pct = m.groups()
            val = int(val_raw)
            if '食物' in key_raw:
                deltas['food'] = val
            elif '精神' in key_raw:
                deltas['sanity'] = val
            elif '运气' in key_raw or '神恩' in key_raw:
                deltas['luck'] = val
            elif '忠诚' in key_raw:
                deltas['loyalty'] = val
            elif '船员' in key_raw:
                if pct and abs(val) <= 50:
                    deltas['crew'] = int(round(30 * (val / 100.0)))
                else:
                    deltas['crew'] = val
    return deltas

def parse_condition(s):
    cond = {}
    m_luck = re.search(r'运气[≥>=高于]+(\d+)', s)
    if m_luck:
        cond['minLuck'] = int(m_luck.group(1))
    m_food = re.search(r'食物[≥>=高于]+(\d+)', s)
    if m_food:
        cond['minFood'] = int(m_food.group(1))
    m_san = re.search(r'精神[≥>=高于]+(\d+)', s)
    if m_san:
        cond['minSanity'] = int(m_san.group(1))
    m_loy = re.search(r'忠诚[≥>=高于]+(\d+)', s)
    if m_loy:
        cond['minLoyalty'] = int(m_loy.group(1))
    return cond if cond else None

MICRO_CHAINS = {
    2: {
        'id': 'random_2',
        'num': '2',
        'title': '与海上民族海战',
        'chapter': '与海上民族海战',
        'env': 'sea',
        'landType': None,
        'isStormOrDisoriented': False,
        'icon': '⚔️',
        'text': '对方的船从雾中疾冲而出，甲板上站满了持弓的汉子。他们的首领用半生不熟的希腊语喊话：“留下三分之一的粮食，或者留下三分之一的命。”',
        'choices': [
            {
                'text': '交食物保平安',
                'hint': '留下粮食保全性命',
                'deltas': { 'food': -10 },
                'condition': None
            },
            {
                'text': '正面迎战',
                'hint': '拔剑迎敌，决不妥协',
                'deltas': {},
                'condition': None,
                'chain': {
                    'text': '你拔剑，浪打上甲板没过脚踝。海战没有退路。你劈开第一个人的盾，踹翻第二个人的腰。船队擦身而过，海面漂满碎桨与浮尸。',
                    'type': 'battle',
                    'outcomes': [
                        {
                            'title': '大胜',
                            'text': '你们以凌厉的阵型击溃了敌船，以较小代价夺回了战利品！',
                            'deltas': { 'crew': -2, 'food': 15 },
                            'baseWeight': 50
                        },
                        {
                            'title': '惨胜',
                            'text': '敌众我寡，搏杀异常惨烈，虽然击退了敌人，但付出了沉重伤亡。',
                            'deltas': { 'crew': -5, 'food': 10 },
                            'baseWeight': 50
                        }
                    ]
                }
            }
        ]
    },
    6: {
        'id': 'random_6',
        'num': '6',
        'title': '岛屿有人 · 与岛民陆地作战',
        'chapter': '岛屿有人 · 与岛民陆地作战',
        'env': 'land',
        'landType': 'human',
        'isStormOrDisoriented': False,
        'icon': '🏛️',
        'text': '他们在黎明前包抄了营地。你抓起盾牌，高喊“列阵”，船员们背靠背站成圆。你盯着对方首领的眼睛，提剑向前迈了一步。',
        'choices': [
            {
                'text': '正面迎战',
                'hint': '硬碰硬正面搏杀',
                'deltas': { 'crew': -1, 'food': 10 },
                'condition': None
            },
            {
                'text': '谈判求和',
                'hint': '交付少许给养平息干戈',
                'deltas': { 'food': -5 },
                'condition': None
            },
            {
                'text': '诱敌深入',
                'hint': '全军一心，设伏聚歼（需忠诚≥80）',
                'deltas': {},
                'condition': { 'minLoyalty': 80 },
                'chain': {
                    'text': '你提剑佯退，转身朝密林奔去。敌人大吼着挥刀追来，队形拉成一条长线。你突然停步，向左一闪——两侧灌木中你的船员暴起，将冲得太快、收不住脚的敌人卷入包围。刀刃崩响，血肉横飞，敌阵瞬间溃散成一片混乱的哀嚎。',
                    'type': 'battle',
                    'outcomes': [
                        {
                            'title': '大胜',
                            'text': '伏击战大获全胜，敌军溃散，斩获颇丰！',
                            'deltas': { 'crew': -1, 'food': 15 },
                            'baseWeight': 60
                        },
                        {
                            'title': '惨胜',
                            'text': '密林混战中敌军拼死反扑，虽全歼敌方但有弟兄倒在血泊中。',
                            'deltas': { 'crew': -3, 'food': 10 },
                            'baseWeight': 40
                        }
                    ]
                }
            }
        ]
    },
    11: {
        'id': 'random_11',
        'num': '11',
        'title': '船中瘟疫',
        'chapter': '船中瘟疫',
        'env': 'sea',
        'landType': None,
        'isStormOrDisoriented': False,
        'icon': '☣️',
        'text': '第一个人发热是在第三天。三天后，半个船舱的船员都在发颤，皮肤上出现暗红斑。你让人熏硫磺、焚烧药草。',
        'choices': [
            {
                'text': '休整治愈',
                'hint': '消耗大量药材与口粮全力施救',
                'deltas': { 'food': -10 },
                'condition': None
            },
            {
                'text': '隔离病患',
                'hint': '封锁下层舱室，壮士断腕',
                'deltas': { 'crew': -2 },
                'condition': None
            },
            {
                'text': '割破小臂以血献祭',
                'hint': '以凡人之血向深海诸神祈愿',
                'deltas': {},
                'condition': None,
                'chain': {
                    'text': '你拔刀划开左臂，鲜血涌出滴入海中，低声向神明祈愿——瘟疫退散。甲板上没有风，你的血在海上晕开，像黎明前最后一抹暗红色。船员们的目光落在你身上，有人跪了下去。海面泛起一阵细微的涟漪，像是有什么东西在深处回应了你。\n\n但你知道，诸神是否垂听你的献祭，取决于你的运气。',
                    'type': 'divine',
                    'outcomes': [
                        {
                            'title': '血祭蒙允',
                            'text': '微风骤起吹散了疫气，高烧的病患奇迹般退热苏醒，瘟疫平息！',
                            'deltas': { 'sanity': -5 },
                            'baseWeight': 50
                        },
                        {
                            'title': '血祭遭拒',
                            'text': '海面归于死寂，诸神未曾回应，疫病夺走了一名弟兄的性命。',
                            'deltas': { 'crew': -1, 'sanity': -10 },
                            'baseWeight': 50
                        }
                    ]
                }
            }
        ]
    },
    14: {
        'id': 'random_14',
        'num': '14',
        'title': '漂流祭品 · 被献祭的少年',
        'chapter': '漂流祭品 · 被献祭的少年',
        'env': 'sea',
        'landType': None,
        'isStormOrDisoriented': False,
        'icon': '🛶',
        'text': '你们在浅滩发现一只木筏，上面躺着一个裹白布的少年，手腕有勒痕。他醒来后冷笑了一声：“神不要我——我的死不值得。”',
        'choices': [
            {
                'text': '收留少年',
                'hint': '带上船作为船员，沾染异邦神祇厄运',
                'deltas': { 'crew': 1, 'luck': -5 },
                'condition': None
            },
            {
                'text': '将少年妥善安置',
                'hint': '赠予口粮置于岸上，积聚神恩',
                'deltas': { 'food': -5, 'luck': 5 },
                'condition': None
            },
            {
                'text': '询问情报',
                'hint': '盘问航路与城邦虚实（需运气≥80）',
                'deltas': {},
                'condition': { 'minLuck': 80 },
                'chain': {
                    'text': '你蹲下身，盯着那少年的眼睛：“你的城邦在哪个方向？附近可有避风的港湾？”他沉默了很久，目光越过你的肩膀望向海面，久到你觉得他已经成为了一座雕塑。海风吹过他裹身的白布，他终于抬起手，指向你从未留意过的一个方向。',
                    'type': 'luck',
                    'outcomes': [
                        {
                            'title': '知无不言',
                            'text': '少年吐露了隐藏的海流规律与避风海湾，神恩眷顾！',
                            'deltas': { 'luck': 5 },
                            'baseWeight': 60
                        },
                        {
                            'title': '缄口不言',
                            'text': '少年咬紧牙关，眼中唯有空洞与仇恨，再不肯多发一言。',
                            'deltas': {},
                            'baseWeight': 40
                        }
                    ]
                }
            }
        ]
    },
    16: {
        'id': 'random_16',
        'num': '16',
        'title': '陌生人求搭船',
        'chapter': '陌生人求搭船',
        'env': 'land',
        'landType': 'human',
        'isStormOrDisoriented': False,
        'icon': '🏛️',
        'text': '一个穿着破旧斗篷的人站在岸边招手。他说自己的船在风暴中沉没，愿意用一袋金币换一程船位。他的斗篷下有金属碰撞的声响——不像是金币。',
        'choices': [
            {
                'text': '同意搭船',
                'hint': '收下财货载他一程，船员心存疑虑',
                'deltas': { 'food': 5, 'loyalty': -5 },
                'condition': None
            },
            {
                'text': '拒绝搭船',
                'hint': '来路不明，置之不理驶离浅湾',
                'deltas': {},
                'condition': None
            },
            {
                'text': '仔细盘问',
                'hint': '剑拔弩张，强令验身（需忠诚≥60）',
                'deltas': {},
                'condition': { 'minLoyalty': 60 },
                'chain': {
                    'text': '你上前一步，盯着他的眼睛：“解开斗篷。”他愣了一下，手指攥紧领口，金属碰撞声更响了。你没有移开目光，手按上了剑柄。他慢慢松开手，斗篷滑落。',
                    'type': 'luck',
                    'outcomes': [
                        {
                            'title': '落难商人',
                            'text': '他的腰上挂着常见的铜器，你们款待了落难的商人，获得丰厚谢礼。',
                            'deltas': { 'food': 5 },
                            'baseWeight': 50
                        },
                        {
                            'title': '识破伪装',
                            'text': '他的腰上挂着染血的弯刀，你识破了海上民族刺客的诡计，全船士气大振！',
                            'deltas': { 'luck': 5 },
                            'baseWeight': 50
                        }
                    ]
                }
            }
        ]
    },
    17: {
        'id': 'random_17',
        'num': '17',
        'title': '海面浮油 · 鲸群迁徙',
        'chapter': '海面浮油 · 鲸群迁徙',
        'env': 'sea',
        'landType': None,
        'isStormOrDisoriented': False,
        'icon': '🐋',
        'text': '海水表面浮着一层暗色的油膜，远处有巨大的水柱喷向天空——一群鲸鱼正在前方迁徙。你们不得不绕行，却目睹了它们跃出水面的壮观景象。',
        'choices': [
            {
                'text': '绕行观赏',
                'hint': '绕行规避，目睹壮丽生灵提振心神',
                'deltas': { 'sanity': 5, 'food': -5 },
                'condition': None
            },
            {
                'text': '跟随鲸群',
                'hint': '冒进顺流，尾随海兽（需运气≥80）',
                'deltas': {},
                'condition': { 'minLuck': 80 },
                'chain': {
                    'text': '你们调整风帆，小心翼翼地跟随在庞大温和的鲸群后方。巨大的尾鳍拍击海浪，如同深海擂响的战鼓，水汽与阳光交织成一道道绚丽的彩虹。',
                    'type': 'luck',
                    'outcomes': [
                        {
                            'title': '伴航同行',
                            'text': '巨鲸护航破开波涛，船队平安穿过险恶暗流，诸神眷顾。',
                            'deltas': {},
                            'baseWeight': 50
                        },
                        {
                            'title': '逐浪撒网',
                            'text': '鲸群将大批海鱼赶向水面，水手们欢呼着撒下大网，收获满满口粮！',
                            'deltas': { 'food': 10 },
                            'baseWeight': 50
                        }
                    ]
                }
            }
        ]
    },
    23: {
        'id': 'random_23',
        'num': '23',
        'title': '风暴 · 失去补给',
        'chapter': '风暴 · 失去补给',
        'env': 'sea',
        'landType': None,
        'isStormOrDisoriented': True,
        'icon': '🌀',
        'text': '一个巨浪从侧面拍来，船身猛烈倾斜——绑在甲板上的几只水罐和粮袋滑入海中。你伸手去抓，只抓到一把湿漉漉的绳子。',
        'choices': [
            {
                'text': '接受损失',
                'hint': '任由粮袋沉入海底，以保全船安全',
                'deltas': { 'food': -10 },
                'condition': None
            },
            {
                'text': '派人打捞',
                'hint': '命精通水性的水手跃入狂澜抢捞',
                'deltas': {},
                'condition': None,
                'chain': {
                    'text': '你咬紧牙关，点了几个水性最好的船员。他们脱掉铠甲，咬着刀跳入翻涌的灰绿色海水中，浪头盖过他们的头顶，又把他们抛起来。你趴在船舷上，海水拍打你的脸，视野里只剩下两串气泡在暗涌中忽明忽灭——你忽然意识到，你不知道水下等着他们的是什么。可能是沉船遗骸中卡住的宝藏箱，可能是一只封着求救信的陶瓶，也可能是一具肿胀的、带着瘟疫气息的尸体。你握紧拳头，只能祈祷。',
                    'type': 'sea',
                    'outcomes': [
                        {
                            'title': '成功捕捞',
                            'text': '水手们顶着狂涛拼死抢救回了粮桶，物资得以挽回！',
                            'deltas': { 'food': 5 },
                            'baseWeight': 50
                        },
                        {
                            'title': '遭遇意外',
                            'text': '突来的暗涡将一名水手拖入深海，浪花转瞬吞噬了他。',
                            'deltas': { 'crew': -1 },
                            'baseWeight': 50
                        }
                    ]
                }
            }
        ]
    },
    52: {
        'id': 'random_52',
        'num': '52',
        'title': '舰队残骸',
        'chapter': '舰队残骸',
        'env': 'sea',
        'landType': None,
        'isStormOrDisoriented': False,
        'icon': '⛵',
        'text': '日落时分，你们的船队正沿着一条开阔航道缓缓前进。忽然，前方海面浮现出一大片散落的浮木，在晚霞中像一片被切开的血肉缓缓扩散。你透过逐渐变暗的光线辨认出那些残骸的轮廓——折断的桅杆、碎裂的龙骨、烧焦的帆布，还有一艘半沉的战舰，船身上插着三支折断的投矛，尾部的舵轮已经被烧成炭黑色。这曾经是一支舰队，现在它正在你眼前缓慢旋转，像一个不肯松口的承诺。',
        'choices': [
            {
                'text': '举行海葬仪式',
                'hint': '为同胞海葬哀悼（需食物≥60）',
                'deltas': { 'loyalty': 5, 'sanity': 5, 'food': -5 },
                'condition': { 'minFood': 60 }
            },
            {
                'text': '直接驶离',
                'hint': '不祥之地，全速驶离',
                'deltas': {},
                'condition': None
            },
            {
                'text': '搜索幸存者和物资',
                'hint': '攀上半沉残舰，搜寻物资与生者',
                'deltas': {},
                'condition': None,
                'chain': {
                    'text': '你乘小艇靠近那艘半沉的战舰，攀上倾斜的甲板时靴底踩在碎木屑上，发出细碎的声响。舱室的门敞开着，里面的一切都被翻得乱七八糟——水手们显然是在慌乱中弃船的。你拨开倒下的木架，在一只翻倒的木箱底部发现了一卷干燥的羊皮纸，纸上记录着他们最后的航程笔记，字迹从端正渐渐变得潦草——最后一页只剩血迹。',
                    'type': 'scavenge',
                    'outcomes': [
                        {
                            'title': '解救幸存者',
                            'text': '在半没入水下的密封气室中，你们找到了重获生机的落水同胞！',
                            'deltas': { 'crew': 2 },
                            'baseWeight': 35
                        },
                        {
                            'title': '补充物资',
                            'text': '搜出几桶未受海水浸染的干酪与肉脯，满载而归！',
                            'deltas': { 'food': 5 },
                            'baseWeight': 40
                        },
                        {
                            'title': '遭遇险情',
                            'text': '残舰龙骨突然断裂塌陷，所幸无人受重伤，万幸全身而退。',
                            'deltas': {},
                            'baseWeight': 25
                        }
                    ]
                }
            }
        ]
    }
}

def parse_random_events():
    with open('story/04_随机事件.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    blocks = text.split('----------------------------------------\n')[1:]
    raw_events = []
    
    for i in range(0, len(blocks), 2):
        if i+1 >= len(blocks):
            break
        header = blocks[i].strip()
        body = blocks[i+1].strip()
        
        # Clean leading numbers if any remain
        m = re.match(r'^(?:随机事件)?([一二三四五六七八九十百]+|[0-9]+)[、:：\s]*(.*)', header)
        if m:
            num = m.group(1)
            title = m.group(2).strip()
        else:
            num = str(i//2 + 1)
            title = header
        
        title = re.sub(r'\s*·\s*', ' · ', title)
        raw_events.append({
            'num': num,
            'title': title,
            'body': body
        })

    parsed_events = []
    for idx, e in enumerate(raw_events, 1):
        if idx in MICRO_CHAINS:
            parsed_events.append(MICRO_CHAINS[idx])
            continue
        lines = [l.strip() for l in e['body'].split('\n') if l.strip()]
        title = e['title']
        
        env = 'sea'
        land_type = None
        is_storm = False
        icon = '⛵'
        
        if title == '不探索岛屿 · 无风停航':
            env = 'sea'
            icon = '⛵'
            land_type = None
        elif any(k in title for k in ['岛', '陆地', '墓葬', '荒岛', '壁画', '港口', '哨塔', '陌生人', '水手故事', '烽火']):
            env = 'land'
            icon = '🏝️'
            if any(k in title for k in ['有人', '城邦', '陌生人', '哨塔', '炊烟', '烽火']):
                land_type = 'human'
                icon = '🏛️'
            elif any(k in title for k in ['祭坛', '神明', '怪', '幻象', '壁画']):
                land_type = 'monster'
                icon = '👁️'
            else:
                land_type = 'uninhabited'
                icon = '🏝️'
        else:
            env = 'sea'
            icon = '🌊'
            if any(k in title for k in ['风暴', '雾', '雷暴', '洋流', '迷失', '血月', '暗礁', '渗水']):
                is_storm = True
                icon = '🌀' if '风暴' in title or '雷暴' in title else '🌫️'
            elif '巨兽' in title or '海怪' in title or '鲨' in title:
                icon = '🦈'
            elif '海豚' in title:
                icon = '🐬'
            elif '流星' in title:
                icon = '🌠'

        narrative_lines = []
        choice_lines = []
        is_choice_part = False
        
        for l in lines:
            if '【数值变化】' in l or re.match(r'^\d+、', l) or '祭祀' in l or '用战利品' in l or '强买强卖' in l or '正面迎战' in l or '谈判' in l or '单独狩猎' in l or '集体狩猎' in l:
                is_choice_part = True
            if not is_choice_part:
                narrative_lines.append(l)
            else:
                choice_lines.append(l)

        narrative_text = '\n'.join(narrative_lines) if narrative_lines else lines[0]
        
        choices = []
        for cl in choice_lines:
            cl_clean = cl.replace('【数值变化】', '').strip()
            if not cl_clean:
                continue
            m_opt = re.match(r'^(\d+、)?(.*)', cl_clean)
            line_str = m_opt.group(2).strip()
            
            deltas = parse_delta_str(cl_clean)
            cond = parse_condition(cl_clean)
            
            opt_title = re.split(r'[:：]|（|【|\|', line_str)[0].strip()
            if opt_title.startswith('1、') or opt_title.startswith('2、') or opt_title.startswith('3、'):
                opt_title = opt_title[2:].strip()
            
            # Clean jump notes and sequence numbers from hint
            clean_hint = re.sub(r'^\d+、\s*', '', cl_clean).strip()
            clean_hint = re.sub(r'（(?:概率遭遇|概率触发|判定是否转向|转向(?:阿波罗)?祭祀事件|跳转)[^）]*）', '', clean_hint).strip()
            clean_hint = re.sub(r'[:：]\s*$', '：无变化', clean_hint).strip()
            if not clean_hint:
                clean_hint = opt_title

            if len(opt_title) > 0 and len(opt_title) < 25 and not opt_title.startswith('食物') and not opt_title.startswith('精神') and not opt_title.startswith('运气') and not opt_title.startswith('忠诚') and not opt_title.startswith('船员'):
                choices.append({
                    'text': opt_title,
                    'hint': clean_hint,
                    'deltas': deltas,
                    'condition': cond
                })
            else:
                if choices and deltas:
                    for k, v in deltas.items():
                        choices[-1]['deltas'][k] = v
                if choices and cond:
                    choices[-1]['condition'] = cond

        if len(choices) == 0:
            choices = [
                {
                    'text': '顺应时势，谨慎应对',
                    'hint': '平安渡过',
                    'deltas': { 'food': -5, 'sanity': 5 },
                    'condition': None
                },
                {
                    'text': '严整军纪，全力处置',
                    'hint': '消耗体力，维护忠诚',
                    'deltas': { 'food': -5, 'loyalty': 5 },
                    'condition': None
                }
            ]
        elif len(choices) == 1:
            choices.append({
                'text': '暂且按兵不动，观察形势',
                'hint': '保持戒备',
                'deltas': { 'food': -5, 'sanity': 0 },
                'condition': None
            })

        parsed_events.append({
            'id': f'random_{idx}',
            'num': str(idx),
            'title': title,
            'chapter': title,
            'env': env,
            'landType': land_type,
            'isStormOrDisoriented': is_storm,
            'icon': icon,
            'text': narrative_text,
            'choices': choices
        })

    return parsed_events

def build_all():
    classes = {
        "warrior": {
            "id": "warrior",
            "name": "贵族武领",
            "title": "阿卡亚领主",
            "icon": "⚔️",
            "desc": "来自伯罗奔尼撒的世袭贵族，治军严明，精于海陆搏杀。虽不受神明偏爱，但部下敬服，战斗收益极高。",
            "initialResources": { "food": 75, "sanity": 80, "luck": 50, "crew": 30, "loyalty": 85 },
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
            "initialResources": { "food": 65, "sanity": 90, "luck": 75, "crew": 30, "loyalty": 70 },
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
            "initialResources": { "food": 70, "sanity": 75, "luck": 45, "crew": 30, "loyalty": 80 },
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
            "initialResources": { "food": 90, "sanity": 70, "luck": 40, "crew": 30, "loyalty": 75 },
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
    }

    prologue = {
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
                "deltas": { "food": -10, "luck": 15, "loyalty": 5 },
                "condition": None
            },
            {
                "text": "抓紧时间拔锚启航，全员趁夜色冲入主航道",
                "hint": "保留食物，迅速入海",
                "deltas": { "food": 0, "sanity": -5, "luck": -5 },
                "condition": None
            }
        ]
    }

    endings = {
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
        },
        "death_charybdis": {
            "id": "death_charybdis",
            "achievement": "卡律布狄斯的怀抱",
            "title": "【死亡结局 · 吞没】",
            "tag": "漩涡之渊 ☠️☆☆☆☆",
            "icon": "🌀",
            "desc": "你选择了左侧。海浪拍打礁石的声音越来越响，像千万根手指同时敲击船底。你的桨手们拼尽全力稳住方向，但水流在变快，船开始不听使唤，正在被一种你从未见过的力量拖着向一侧滑去。你低头看的时候，海水已经不再是海水了——它形成了一个巨大的、缓慢旋转的圆，像一头沉睡的野兽终于翻了个身，张开了一个深不见底的、泛着泡沫的喉咙。你终于想起来了那是什么。你听说过它的名字。你站在船头，听见自己的船员在身后大声呼喊着什么，但你听不清了——涡流的声音太深、太沉、像是整个海都在说话。你最后看见的是桅杆倾斜、天空旋转成一道裂缝。然后海水合上了。"
        }
    }

    # 解析主线大事件 (基于合并后的 02_主线大事件.txt)
    with open('story/02_主线大事件.txt', 'r', encoding='utf-8') as f:
        p2_text = f.read()

    blocks = [b.strip() for b in p2_text.split('----------------------------------------') if b.strip() and not b.strip().startswith('======')]

    major_events = []
    for i in range(0, len(blocks), 2):
        if i+1 >= len(blocks):
            break
        title_block = blocks[i].strip()
        body_block = blocks[i+1].strip()

        title = title_block.split('\n')[0].strip()

        intro_m = re.search(r'【前置文案】\s*(.*?)(?=【选项[AB]】|【事件正文】|$)', body_block, re.DOTALL)
        intro = intro_m.group(1).strip() if intro_m else ""

        opt_a_m = re.search(r'【选项A】\s*([^\n]+)', body_block)
        opt_a_raw = opt_a_m.group(1).strip() if opt_a_m else ""

        opt_b_m = re.search(r'【选项B】\s*([^\n]+)', body_block)
        opt_b_raw = opt_b_m.group(1).strip() if opt_b_m else ""

        body_m = re.search(r'【事件正文】\s*(.*?)(?=【原文】|$)', body_block, re.DOTALL)
        aftermath = body_m.group(1).strip() if body_m else ""

        quote_m = re.search(r'【原文】\s*([^\n]+)', body_block)
        quote = quote_m.group(1).strip() if quote_m else ""

        delta_m = re.search(r'【数值变化】\s*([^\n]+)', body_block)
        delta_raw = delta_m.group(1).strip() if delta_m else ""
        main_deltas = parse_delta_str(delta_raw)

        event_idx = len(major_events) + 1
        env = 'sea' if event_idx in [8, 9] else 'land'
        icon = "⚡" if event_idx in [3, 5, 9, 10] else ("🌊" if event_idx == 8 else "🏛️")
        land_type = None
        if env == 'land':
            if event_idx in [1, 4, 12]:
                land_type = 'human'
            elif event_idx in [3, 5, 6, 10, 11]:
                land_type = 'monster'
            else:
                land_type = 'uninhabited'

        # 根据事件定制双分支选项（去除所有跳转括注与大事件数字序号）
        choices = []
        if event_idx == 1:
            choices = [
                {
                    "text": "靠岸，突袭港口",
                    "hint": "掠夺物资，面对基科涅斯人的反噬",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "不打扰这座城邦",
                    "hint": "克制贪欲，平稳绕行",
                    "deltas": {},
                    "condition": None
                }
            ]
        elif event_idx == 2:
            choices = [
                {
                    "text": "登岸休整，让船员补充食物",
                    "hint": "沉沦遗忘，涉足异乡",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "下令驶离这片水域",
                    "hint": "警惕异香，拔锚离开",
                    "deltas": {},
                    "condition": None
                }
            ]
        elif event_idx == 3:
            choices = [
                {
                    "text": "在岛屿外围搜索食物",
                    "hint": "外围搜寻：食物+5%",
                    "deltas": { "food": 5 },
                    "condition": None
                },
                {
                    "text": "进入山洞探查情况",
                    "hint": "步入幽暗洞穴，探寻巨人巢穴",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                }
            ]
        elif event_idx == 4:
            choices = [
                {
                    "text": "前往岛屿",
                    "hint": "登岛拜谒风神埃俄罗斯",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "绕过岛屿，继续前进",
                    "hint": "避开神秘之岛，继续前进",
                    "deltas": {},
                    "condition": None
                }
            ]
        elif event_idx == 5:
            choices = [
                {
                    "text": "驶入港湾避风休整",
                    "hint": "驶入港湾避风休整",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "绕开港湾，寻找其他避风港",
                    "hint": "察觉崖顶阴影，迅速离开",
                    "deltas": {},
                    "condition": None
                }
            ]
        elif event_idx == 6:
            choices = [
                {
                    "text": "派人登岛寻找食物",
                    "hint": "派人登岛寻找食物与水源",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "绕过岛屿，继续前行",
                    "hint": "压制饥欲，强行开船：忠诚-5%",
                    "deltas": { "loyalty": -5 },
                    "condition": None
                }
            ]
        elif event_idx == 7:
            choices = [
                {
                    "text": "靠岸探查",
                    "hint": "靠岸举行仪式，召引亡魂",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "绕过海岸，继续航行",
                    "hint": "远离死地荒岸，继续航行",
                    "deltas": {},
                    "condition": None
                }
            ]
        elif event_idx == 8:
            choices = [
                {
                    "text": "靠近小岛探查",
                    "hint": "靠近小岛，聆听塞壬歌声",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "不靠近小岛，继续航行",
                    "hint": "封堵双耳，疾驰而过",
                    "deltas": {},
                    "condition": None
                }
            ]
        elif event_idx == 9:
            choices = [
                {
                    "text": "沿右侧悬崖航行",
                    "hint": "牺牲少数人保全大局，直面斯库拉",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "沿左侧礁石边缘航行",
                    "hint": "驶向大漩涡卡律布狄斯",
                    "deltas": {},
                    "triggerEnding": "death_charybdis",
                    "condition": None
                }
            ]
        elif event_idx == 10:
            choices = [
                {
                    "text": "登岛搜索淡水与食物",
                    "hint": "登岛搜索补给，面对神牛",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "绕过岛屿，继续前行",
                    "hint": "严防触怒天神：忠诚-5%",
                    "deltas": { "loyalty": -5 },
                    "condition": None
                }
            ]
        elif event_idx == 11:
            choices = [
                {
                    "text": "接过碗，喝下那口水",
                    "hint": "饮下甘泉，接受神女挽留",
                    "deltas": main_deltas,
                    "resolutionText": aftermath,
                    "quote": quote,
                    "condition": None
                },
                {
                    "text": "推开碗，找回自己的船与船员",
                    "hint": "唤醒神智，拒绝温柔乡：忠诚+5%",
                    "deltas": { "loyalty": 5 },
                    "condition": None
                }
            ]
        elif event_idx == 12:
            choices = [
                {
                    "text": "向瑙西卡娅公主庄重求助",
                    "hint": "觐见国王，获得终局指引：食物+30% | 运气+20%",
                    "deltas": { "food": 30, "luck": 20 },
                    "condition": None
                },
                {
                    "text": "感激菲埃克斯人的恩惠，整备归航",
                    "hint": "接受款待与资助，修缮船只准备返乡：食物+20% | 忠诚+15%",
                    "deltas": { "food": 20, "loyalty": 15 },
                    "condition": None
                }
            ]

        major_events.append({
            "id": f"major_{event_idx}",
            "title": title,
            "chapter": f"大事件 · {title}",
            "quote": quote,
            "intro": intro,
            "text": intro if intro else aftermath,
            "aftermath": aftermath,
            "env": env,
            "landType": land_type,
            "isMajor": True,
            "icon": icon,
            "choices": choices
        })

    with open('story/03_神明祭祀.txt', 'r', encoding='utf-8') as f:
        p3_text = f.read()
    
    sac_blocks = p3_text.split('----------------------------------------\n')[1:]
    sacrifices = []
    
    for i in range(0, len(sac_blocks), 2):
        if i+1 >= len(sac_blocks):
            break
        s_title = sac_blocks[i].strip()
        s_body = sac_blocks[i+1].strip()
        lines = [l.strip() for l in s_body.split('\n') if l.strip()]
        
        prayer = lines[0] if lines else ""
        deltas = parse_delta_str(lines[1]) if len(lines) > 1 else { "luck": 10 }
        
        god_name = "诸神"
        m_god = re.search(r'祭祀\s*·\s*([^·\s]+)', s_title)
        if m_god:
            god_name = m_god.group(1)
        
        sacrifices.append({
            "id": f"sacrifice_{len(sacrifices)+1}",
            "title": s_title,
            "god": god_name,
            "icon": "🏛️",
            "prayer": prayer,
            "cost": { "food": 5 },
            "baseRate": 50,
            "standardReward": deltas,
            "greatReward": { k: int(v * 1.8) if v > 0 else v for k, v in deltas.items() }
        })

    random_events = parse_random_events()

    with open('story/05_航海见闻录.txt', 'r', encoding='utf-8') as f:
        p5_text = f.read()
    
    sight_blocks = p5_text.split('----------------------------------------\n')[1:]
    sights = []
    for i in range(0, len(sight_blocks), 2):
        if i+1 >= len(sight_blocks):
            break
        s_title = sight_blocks[i].strip()
        s_text = sight_blocks[i+1].strip()
        sights.append({
            "id": f"sight_{len(sights)+1}",
            "title": s_title,
            "text": s_text,
            "icon": "📜"
        })

    achievements = [
        # 1. 启程与归来 (7)
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
            "desc": "船在晨雾中靠岸，你带着信任你的兄弟们踏上故乡，完成真正的归乡。",
            "quote": "“你尽力了。”"
        },
        {
            "id": "ach_end_triumphant",
            "category": "启程与归来",
            "name": "凯旋",
            "icon": "👑",
            "hint": "达成【凯旋 · 众多船员】完美史诗结局。",
            "desc": "战船满载荣耀与战利品驶入故土港湾，钟声齐鸣，史诗传颂不朽。",
            "quote": "“我们跨过了冥河，站在了自己的土地上！”"
        },
        {
            "id": "ach_end_death_sea",
            "category": "启程与归来",
            "name": "魂归海洋",
            "icon": "💀",
            "hint": "达成【死亡 · 海上冥国】深海沉沦结局。",
            "desc": "冰冷的海水灌入胸膛，你与战船沉入海底，灵魂顺着洋流飘向冥国。",
            "quote": "“众神编织苦难，是为了让后人有一首歌可以唱。”"
        },
        {
            "id": "ach_end_death_land",
            "category": "启程与归来",
            "name": "魂归大地",
            "icon": "⚔️",
            "hint": "达成【死亡 · 陆上冥国】残阳折戟结局。",
            "desc": "热血浸透战袍，你倒在异邦的礁石上，脸颊贴着冰冷的泥土。",
            "quote": "“人无法躲过自己的命运，但可以选择如何面对它。”"
        },
        {
            "id": "ach_end_death_charybdis",
            "category": "启程与归来",
            "name": "卡律布狄斯的怀抱",
            "icon": "🌀",
            "hint": "在斯库拉与卡律布狄斯的抉择中选择沿左侧礁石边缘航行，被大漩涡吞没。",
            "desc": "你低头看的时候，海水已经形成了一个巨大的、缓慢旋转的圆，泛着泡沫的喉咙将一切吞入深渊。",
            "quote": "“涡流的声音太深、太沉、像是整个海都在说话。”"
        },

        # 2. 荷马史诗大事件 (12)
        {
            "id": "ach_major_1",
            "category": "史诗大事件",
            "name": "贪欲的回响",
            "icon": "🏛️",
            "hint": "经历史诗大事件：伊斯马罗斯 · 掠夺与反噬。",
            "desc": "城邦的黄金美酒诱惑人心，但贪婪必然引来长矛与复仇的号角。",
            "quote": "“我主张赶快逃走，可是这些愚蠢的人不肯听从。” —— 卷九"
        },
        {
            "id": "ach_major_2",
            "category": "史诗大事件",
            "name": "甜蜜的遗忘",
            "icon": "🍇",
            "hint": "经历史诗大事件：忘忧果岛 · 遗忘。",
            "desc": "甘甜的果肉能抹去一切乡愁与苦难，唯有清醒之人备受煎熬。",
            "quote": "“他们中的任何人如果尝了这种果实，便不再想回来报告，也不想返回故里。” —— 卷九"
        },
        {
            "id": "ach_major_3",
            "category": "史诗大事件",
            "name": "独眼之血",
            "icon": "👁️",
            "hint": "经历史诗大事件：独眼巨人 · 刺目。",
            "desc": "在幽暗血腥的洞窟中以灼热木桩刺瞎狂暴巨人，却唤醒了海神的震怒。",
            "quote": "“记住刺瞎你的人是奥德修斯！” —— 卷九"
        },
        {
            "id": "ach_major_4",
            "category": "史诗大事件",
            "name": "埃俄罗斯的馈赠",
            "icon": "💨",
            "hint": "经历史诗大事件：风神岛 · 封风。",
            "desc": "九重狂风被收拢于金绳牛皮袋中，距离家乡仅一箭之遥，猜忌却撕裂了一切。",
            "quote": "“狂暴的风暴冲出来，把他们重新卷向大海，远离故土。” —— 卷十"
        },
        {
            "id": "ach_major_5",
            "category": "史诗大事件",
            "name": "食人的港湾",
            "icon": "🪨",
            "hint": "经历史诗大事件：食人巨人 · 绝境。",
            "desc": "巨石如雨倾泻而下，木碎骨裂，那是大海对冒进者最残忍的杀戮。",
            "quote": "“他们像叉鱼一样把人叉起来，带回去当作可口的饭食。” —— 卷十"
        },
        {
            "id": "ach_major_6",
            "category": "史诗大事件",
            "name": "橡子与魔药",
            "icon": "🧪",
            "hint": "经历史诗大事件：喀耳刻 · 变形。",
            "desc": "蜜酒混杂着使人忘记乡土的魔药，唯有神赐的白花能斩断魔女的咒术。",
            "quote": "“她用手杖敲打他们，把他们关进猪圈；他们全变成了猪的模样。” —— 卷十"
        },
        {
            "id": "ach_major_7",
            "category": "史诗大事件",
            "name": "死者的忠告",
            "icon": "🕯️",
            "hint": "经历史诗大事件：冥府召魂 · 预言。",
            "desc": "黑羊之血引来阴间无数飘荡的游魂，盲眼先知说出了归途最沉重的戒律。",
            "quote": "“你想回去，但会遭到另一番艰险。” —— 卷十一"
        },
        {
            "id": "ach_major_8",
            "category": "史诗大事件",
            "name": "塞壬的挽歌",
            "icon": "🎵",
            "hint": "经历史诗大事件：塞壬歌声 · 自缚。",
            "desc": "将自身死死缚于桅杆之上，任由摄人心魄的歌声撕扯理智与血肉。",
            "quote": "“你自己如果想听歌唱，可以叫同伴们把你站立，把手脚绑在快船桅杆的支架上。” —— 卷十二"
        },
        {
            "id": "ach_major_9",
            "category": "史诗大事件",
            "name": "掌舵者的决断",
            "icon": "⚓",
            "hint": "经历史诗大事件：斯库拉与卡律布狄斯 · 抉择。",
            "desc": "在吞噬万物的漩涡与六首海怪的尖牙之间，你做出了残酷却必要的牺牲。",
            "quote": "“这就是掌舵者的代价：你选择了谁活，就等于选择了谁死。” —— 卷十二"
        },
        {
            "id": "ach_major_10",
            "category": "史诗大事件",
            "name": "太阳神的审判",
            "icon": "☀️",
            "hint": "经历史诗大事件：太阳神牛 · 审判。",
            "desc": "饥饿最终击穿了敬畏，烤肉在火中哀鸣，太阳神的雷霆惩罚如期而至。",
            "quote": "“他们宰了太阳神赫利俄斯的牛群，他立即向宙斯大发雷霆。” —— 卷十二"
        },
        {
            "id": "ach_major_11",
            "category": "史诗大事件",
            "name": "卡吕普索的囚笼",
            "icon": "🌺",
            "hint": "经历史诗大事件：卡吕普索 · 囚笼。",
            "desc": "永生与神女的怀抱不能抚平思乡的痛楚，凡人的泪水终究滴落于故土的尘埃。",
            "quote": "“他正坐在海边哭泣，像往日一样，用泪水、叹息和痛苦折磨自己的心灵。” —— 卷五"
        },
        {
            "id": "ach_major_12",
            "category": "史诗大事件",
            "name": "斯克里亚的援手",
            "icon": "🤝",
            "hint": "经历史诗大事件：斯克里亚 · 援手。",
            "desc": "在异乡王宫中道尽十年流亡辛酸，仁慈的菲埃克斯人为你铺平了最后的归途。",
            "quote": "“你从远方来到我们的城市和国土，不用再忍受任何苦难，我们会送你回去。” —— 卷七"
        },

        # 3. 见闻与历程 (8)
        {
            "id": "ach_first_sight",
            "category": "见闻与历程",
            "name": "沉默的见证者",
            "icon": "📜",
            "hint": "首次获得任意 1 篇航海见闻录。",
            "desc": "你看见了海上那些从未被写进航海日志的东西——从今往后，风在你眼中有了另一层含义。",
            "quote": "“风浪之下，皆是凡人未曾听闻的故事。”"
        },
        {
            "id": "ach_all_sights",
            "category": "见闻与历程",
            "name": "尘世之眼 · 行路之书",
            "icon": "📖",
            "hint": "点亮全部 12 篇《航海见闻录》图鉴。",
            "desc": "尘世之眼阅尽潮汐之下的所有沉默，行路之书载满风浪之中的所有回声。",
            "quote": "“大海再无秘密，你已成为爱琴海的掌卷人。”"
        },
        {
            "id": "ach_first_dice",
            "category": "见闻与历程",
            "name": "命运的骰子",
            "icon": "🎲",
            "hint": "首次触发并完成一次随机概率或命运判定。",
            "desc": "你第一次把命运交给风浪。它落定之前，你听见自己的呼吸和浪的节奏叠在了一起。",
            "quote": "“命运的掷骰永无定数，唯有掌舵者迎浪而上。”"
        },
        {
            "id": "ach_first_sacrifice",
            "category": "见闻与历程",
            "name": "第一声祷词",
            "icon": "🕊️",
            "hint": "首次在奥林匹斯诸神祭坛举行祭祀祈福。",
            "desc": "你开口的时候，海浪声矮了一寸——像是苍穹弯下腰来，听着你的诉求。",
            "quote": "“凡人的一缕青烟，连系着奥林匹斯的注视。”"
        },
        {
            "id": "ach_first_battle",
            "category": "见闻与历程",
            "name": "血与铁的初遇",
            "icon": "⚔️",
            "hint": "首次在随机航程中触发正面战斗决策。",
            "desc": "血溅上盔甲的时候，你第一次尝到了归途的另一种咸味。",
            "quote": "“刀光所向，不退半步。”"
        },
        {
            "id": "ach_first_sea_people",
            "category": "见闻与历程",
            "name": "海上来客",
            "icon": "🛶",
            "hint": "首次遭遇外邦战船或海上民族事件。",
            "desc": "那些在城邦中流传了多年的流言终于有了面孔——海上来客不是传说，是刀锋。",
            "quote": "“青铜之剑在浪头上相遇，唯有胜者能继续航行。”"
        },
        {
            "id": "ach_first_luck_gain",
            "category": "见闻与历程",
            "name": "神目一瞥",
            "icon": "✨",
            "hint": "首次通过决策或奇遇增加神恩幸运值。",
            "desc": "风忽然转向的那一瞬间，你知道——云层之上有谁短暂地低下了头，看了一眼你的帆。",
            "quote": "“神恩微茫，却如破云之光。”"
        },
        {
            "id": "ach_all_majors",
            "category": "见闻与历程",
            "name": "不朽之名",
            "icon": "👑",
            "hint": "点亮全部 12 幕荷马史诗大事件图鉴。",
            "desc": "你走完了诸神为你铺设的十二重门。从此，神的名字被写在云上，你的名字被刻在海里。",
            "quote": "“你的史诗将被吟游诗人代代传唱，永不磨灭。”"
        },

        # 4. 极境成就 (5)
        {
            "id": "ach_limit_food",
            "category": "极境成就",
            "name": "尽粮枯舟",
            "icon": "🌾",
            "hint": "在食物储备低于 10 点时顽强航行存活。",
            "desc": "船还在走，但粮食已经先于归途抵达了尽头。饥饿像一把钝刀在腹中翻搅。",
            "quote": "“咽下海风与苦涩，舵手仍未松开双臂。”"
        },
        {
            "id": "ach_limit_loyalty",
            "category": "极境成就",
            "name": "断缆无声",
            "icon": "⛓️",
            "hint": "在船员忠诚度低于 10 点时苦苦维持舰队不散。",
            "desc": "那根连接你与所有人的绳子，不知何时已经断了。阴冷的目光在暗处流转。",
            "quote": "“船长背对水手站立，刀锋半寸出鞘。”"
        },
        {
            "id": "ach_limit_sanity",
            "category": "极境成就",
            "name": "忘川倒影",
            "icon": "🌀",
            "hint": "在精神理智低于 10 点时抵抗癫狂与幻象。",
            "desc": "你看着海面，深渊也在望着你。海水倒映出的不是天空，而是死者的呼唤。",
            "quote": "“理智崩塌的边缘，故乡是唯一仅存的锚。”"
        },
        {
            "id": "ach_limit_crew",
            "category": "极境成就",
            "name": "孤帆独行",
            "icon": "⛵",
            "hint": "在存活船员低于 3 人时独自驾船穿行于风暴。",
            "desc": "桅杆上还剩一面残破的帆，船上静得只剩自己的脚步声与海鸥的哀鸣。",
            "quote": "“一人一舟，向着夕阳下的故土死命划桨。”"
        },
        {
            "id": "ach_limit_luck",
            "category": "极境成就",
            "name": "无恩之海",
            "icon": "⛈️",
            "hint": "在神恩幸运低于 10 点时挑战诸神厄运。",
            "desc": "海不再宽恕，神收回了祂放在你船底的那只手，如今你是自己浮着的。",
            "quote": "“即便被奥林匹斯弃绝，凡人亦要靠双桨踏碎浪涛。”"
        },

        # 5. 命运彩蛋 (5)
        {
            "id": "ach_egg_poet",
            "category": "命运彩蛋",
            "name": "琴杖之律",
            "icon": "🪕",
            "hint": "经历至少一次经典史诗大事件，并完成任意一个航程结局。",
            "desc": "三千年前，吟游诗人用木杖敲击地面，长—短—短，那是六步格的行进节奏。三千年后，你的船划开了同样的声音，像海浪一层一层叠在旧浪上。你不是在航行，你在被唱进一首比你更老、也会比你活得更久的歌里。",
            "quote": "“你不是在航行，你在被唱进一首比你更老的歌里。”"
        },
        {
            "id": "ach_egg_argos",
            "category": "命运彩蛋",
            "name": "阿尔戈斯之眼",
            "icon": "🐕",
            "hint": "在漂流者、少年或陌生人求助事件中，至少一次选择信任与救助。",
            "desc": "那条老狗在垃圾堆上等了二十年，等一个所有人都说不会再回来的人。它是唯一一个不用语言就认出你的人。而你，选择相信陌生人——不是因为他们可信，是因为你还愿意相信这个世界上有比证据更老的东西。",
            "quote": "“你还愿意相信这个世界上有比证据更老的东西。”"
        },
        {
            "id": "ach_egg_siren_crew",
            "category": "命运彩蛋",
            "name": "被歌声带走的人",
            "icon": "🌊",
            "hint": "在塞壬歌声的考验中直面魔音，有船员被歌声带走。",
            "desc": "那个船员来自另一片海岸。塞壬的歌声绕过你，绕过所有人，径直找到了他。他走的时候，脸上是你从未见过的平静。你知道，他终于上岸了。",
            "quote": "“他走的时候，脸上是你从未见过的平静。”"
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

        # 6. 远航里程 (2)
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

    db_obj = {
        "CLASSES": classes,
        "PROLOGUE": prologue,
        "ENDINGS": endings,
        "MAJOR_EVENTS": major_events,
        "SACRIFICES": sacrifices,
        "RANDOM_EVENTS": random_events,
        "SIGHTS": sights,
        "ACHIEVEMENTS": achievements
    }

    js_code = "// story/game_database.js\n// 完整奥德赛游戏数据库（职业、大事件、祭祀、52随机事件、见闻录、结局与成就）\n\n"
    js_code += "const GAME_DATABASE = " + json.dumps(db_obj, ensure_ascii=False, indent=2) + ";\n\n"
    js_code += "module.exports = GAME_DATABASE;\n"

    with open('story/game_database.js', 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"Successfully generated story/game_database.js! Size: {len(js_code)} bytes.")

if __name__ == '__main__':
    build_all()
