
export class FiveSixCalculator {
    public ELEMENT_CHARACTERISTICS: any = {
        wood: {
            name: '木',
            property: '生发、舒展',
            organs: '肝、胆',
            balancedTraits: ['有活力', '创造力', '果断', '有主见'],
            imbalanceTendencies: {
                excess: ['肝火旺', '急躁易怒', '头痛'],
                deficiency: ['肝气郁结', '犹豫不决', '抑郁胁痛']
            },
            missingImplication: '木主升发、疏泄、条达。缺失则肝气生发无力，机体条达失序，易见肢体僵硬或血行迟滞。',
            missingRisk: '肝胆失调 · 筋骨不利',
            personalityTrait: '执行力不足，性格趋向保守，容易产生无力感。'
        },
        fire: {
            name: '火',
            property: '温热、上升',
            organs: '心、小肠',
            balancedTraits: ['热情开朗', '善于沟通', '有领导力'],
            imbalanceTendencies: {
                excess: ['心火亢盛', '心烦失眠', '口舌生疮'],
                deficiency: ['心气不足', '心悸怔忡', '精神萎靡']
            },
            missingImplication: '火主温热、神明。缺失则心阳不振，血脉温煦失职，易见形寒肢冷，神识虚浮。',
            missingRisk: '心神不宁 · 血脉瘀滞',
            personalityTrait: '情感平淡，缺乏内在驱动力，社交意愿较低。'
        },
        earth: {
            name: '土',
            property: '运化、承载',
            organs: '脾、胃',
            balancedTraits: ['稳重踏实', '诚信', '包容', '有耐心'],
            imbalanceTendencies: {
                excess: ['脾胃积滞', '腹胀', '痰湿内盛'],
                deficiency: ['脾气虚弱', '消化不良', '湿气困脾', '疲乏']
            },
            missingImplication: '土主受纳、运化。缺失则中焦化源枯竭，肌肉失养，易见消瘦乏力，运化停滞。',
            missingRisk: '脾胃虚弱 · 运化无力',
            personalityTrait: '思维跳跃但缺乏落地，容易产生不安全感。'
        },
        metal: {
            name: '金',
            property: '肃降、收敛',
            organs: '肺、大肠',
            balancedTraits: ['逻辑清晰', '原则性强', '自律', '整洁'],
            imbalanceTendencies: {
                excess: ['肺气壅滞', '咳嗽痰多', '便秘', '悲忧固执'],
                deficiency: ['肺气不足', '气短声低', '易感冒', '缺乏决断']
            },
            missingImplication: '金主收敛、卫外。缺失则肺失宣降，皮毛开合失度，极易感邪，抗压耐受力差。',
            missingRisk: '肺气虚弱 · 易感外邪',
            personalityTrait: '处事缺乏章法，容易陷入琐碎，情绪耐受度低。'
        },
        water: {
            name: '水',
            property: '润下、闭藏',
            organs: '肾、膀胱',
            balancedTraits: ['智慧深邃', '冷静', '有洞察力', '有毅力'],
            imbalanceTendencies: {
                excess: ['肾寒水泛', '畏寒肢冷', '水肿', '恐惧冷漠'],
                deficiency: ['肾气亏虚', '腰膝酸软', '失眠健忘', '焦虑恐惧']
            },
            missingImplication: '水主滋润、封藏。缺失则肾精能量封藏不足，骨髓失充，易见腰膝酸软，早衰或精力不济。',
            missingRisk: '肾精亏虚 · 封藏失职',
            personalityTrait: '胆小易惊，意志力薄弱，缺乏长期坚持的韧劲。'
        }
    };

    private STEM_TO_MOTION: any = { '甲': '土运太过', '己': '土运不及', '乙': '金运不及', '庚': '金运太过', '丙': '水运太过', '辛': '水运不及', '丁': '木运不及', '壬': '木运太过', '戊': '火运太过', '癸': '火运不及' };
    private BRANCH_TO_SITIAN: any = { '子': '少阴君火', '午': '少阴君火', '丑': '太阴湿土', '未': '太阴湿土', '寅': '少阳相火', '申': '少阳相火', '卯': '阳明燥金', '酉': '阳明燥金', '辰': '太阳寒水', '戌': '太阳寒水', '巳': '厥阴风木', '亥': '厥阴风木' };
    private SITIAN_TO_ZAIQUAN: any = { '厥阴风木': '少阳相火', '少阴君火': '阳明燥金', '太阴湿土': '太阳寒水', '少阳相火': '厥阴风木', '阳明燥金': '少阴君火', '太阳寒水': '太阴湿土' };
    private MAIN_QI = ['厥阴风木', '少阴君火', '少阳相火', '太阴湿土', '阳明燥金', '太阳寒水'];
    private GUEST_QI_ORDER = ['厥阴风木', '少阴君火', '太阴湿土', '少阳相火', '阳明燥金', '太阳寒水'];

    public calculateEnergy(birthDate: Date, hour?: string, gender?: string, symptoms?: any) {
        const lunarInfo = this.getLunarInfo(birthDate);
        const factors = this.calculateFactors(lunarInfo, birthDate);
        const energy = this.calculateFiveElementsEnergy(factors);
        const analysis = this.analyzeConstitution(energy, symptoms);

        return { energy, factors, ...analysis };
    }

    private getLunarInfo(birthDate: Date) {
        const year = birthDate.getFullYear();
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        let lunarYear = year;
        if (month === 1 || (month === 2 && day < 5)) lunarYear = year - 1;
        const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        const stemIdx = (lunarYear - 4) % 10;
        const branchIdx = (lunarYear - 4) % 12;
        return { heavenlyStem: stems[stemIdx >= 0 ? stemIdx : stemIdx + 10], earthlyBranch: branches[branchIdx >= 0 ? branchIdx : branchIdx + 12] };
    }

    private calculateFactors(lunarInfo: any, solarDate: Date) {
        const m = solarDate.getMonth() + 1;
        const d = solarDate.getDate();
        const siTian = this.BRANCH_TO_SITIAN[lunarInfo.earthlyBranch];
        const yearMotion = this.STEM_TO_MOTION[lunarInfo.heavenlyStem];
        return {
            yearMotion,
            siTian,
            zaiQuan: this.SITIAN_TO_ZAIQUAN[siTian],
            mainQi: this.getMainQiBySolarDate(m, d),
            guestQi: this.getGuestQi(siTian, m, d),
            mainYun: this.getMainYunBySolarDate(m, d),
            guestYun: this.getGuestYun(yearMotion, m, d)
        };
    }

    private getMainQiBySolarDate(m: number, d: number) {
        if ((m === 1 && d >= 20) || (m === 2) || (m === 3 && d <= 20)) return '厥阴风木';
        if ((m === 3 && d >= 21) || (m === 4) || (m === 5 && d <= 20)) return '少阴君火';
        if ((m === 5 && d >= 21) || (m === 6) || (m === 7 && d <= 22)) return '少阳相火';
        if ((m === 7 && d >= 23) || (m === 8) || (m === 9 && d <= 22)) return '太阴湿土';
        if ((m === 9 && d >= 23) || (m === 10) || (m === 11 && d <= 21)) return '阳明燥金';
        return '太阳寒水';
    }

    private getMainYunBySolarDate(m: number, d: number) {
        if ((m === 1 && d >= 20) || (m === 2) || (m === 3) || (m === 4 && d <= 2)) return '木';
        if ((m === 4 && d >= 3) || (m === 5) || (m === 6 && d <= 15)) return '火';
        if ((m === 6 && d >= 16) || (m === 7) || (m === 8 && d <= 28)) return '土';
        if ((m === 8 && d >= 29) || (m === 9) || (m === 10) || (m === 11 && d <= 10)) return '金';
        return '水';
    }

    private getGuestQi(siTian: string, m: number, d: number) {
        const siTianIndex = this.GUEST_QI_ORDER.indexOf(siTian);
        if (siTianIndex === -1) return '未知';
        const mainQi = this.getMainQiBySolarDate(m, d);
        const mainQiIndex = this.MAIN_QI.indexOf(mainQi);
        let guestIndex = (siTianIndex + (mainQiIndex - 2 + 6)) % 6;
        return this.GUEST_QI_ORDER[guestIndex];
    }

    private getGuestYun(yearMotion: string, m: number, d: number) {
        let element = '';
        if (yearMotion.includes('木')) element = '木';
        else if (yearMotion.includes('火')) element = '火';
        else if (yearMotion.includes('土')) element = '土';
        else if (yearMotion.includes('金')) element = '金';
        else if (yearMotion.includes('水')) element = '水';
        const elements = ['木', '火', '土', '金', '水'];
        const startIndex = elements.indexOf(element);
        const mainYun = this.getMainYunBySolarDate(m, d);
        const mainIndex = elements.indexOf(mainYun);
        return elements[(startIndex + mainIndex) % 5];
    }

    private calculateFiveElementsEnergy(factors: any) {
        const energy: any = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const add = (f: string) => {
            if (f.includes('木') || f === '木') energy.wood += 1;
            if (f.includes('火') || f === '火') energy.fire += 1;
            if (f.includes('土') || f === '土') energy.earth += 1;
            if (f.includes('金') || f === '金') energy.metal += 1;
            if (f.includes('水') || f === '水') energy.water += 1;
        };
        Object.values(factors).forEach((f: any) => add(f));
        const energyValues = Object.values(energy) as number[];
        const total: number = energyValues.reduce((a: number, b: number) => a + b, 0);
        Object.keys(energy).forEach(k => {
            const currentVal = energy[k] as number;
            energy[k] = total > 0 ? Math.round((currentVal / total) * 100) : 20;
        });
        return energy;
    }

    private analyzeConstitution(energy: any, symptoms: any) {
        const elementsSorted = Object.entries(energy).sort((a: any, b: any) => (b[1] as number) - (a[1] as number));
        const zeroEls = Object.entries(energy).filter(e => (e[1] as number) < 5);
        const isBalanced = zeroEls.length === 0;
        const typeString = isBalanced ? '均衡型' : `多${this.ELEMENT_CHARACTERISTICS[elementsSorted[0][0]].name}缺${zeroEls.map(e => this.ELEMENT_CHARACTERISTICS[e[0]].name).join('')}型`;
        const constitutionString = isBalanced ? '和气' : '气禀';

        const missingImplications = zeroEls.map(e => ({
            name: this.ELEMENT_CHARACTERISTICS[e[0]].name,
            desc: this.ELEMENT_CHARACTERISTICS[e[0]].missingImplication,
            personality: this.ELEMENT_CHARACTERISTICS[e[0]].personalityTrait
        }));
        
        const advantageImplications = elementsSorted.filter(e => (e[1] as number) > 15).map(e => ({
            name: this.ELEMENT_CHARACTERISTICS[e[0]].name,
            traits: this.ELEMENT_CHARACTERISTICS[e[0]].balancedTraits
        }));
        
        const risksFromMissing = zeroEls.map(e => this.ELEMENT_CHARACTERISTICS[e[0]].missingRisk);
        const currentHealth = this.processSymptoms(symptoms, risksFromMissing);

        return {
            type: typeString,
            constitution: constitutionString,
            missingDetails: missingImplications,
            advantageDetails: advantageImplications,
            isBalanced,
            currentStatus: currentHealth,
            advice: this.getStructuredAdvice(zeroEls, elementsSorted, energy)
        };
    }

    private getStructuredAdvice(zeroEls: any[], elements: any[], energy: any) {
        // Find main deficiency
        let adviceKey = '平衡';
        if (zeroEls.some(e => e[0] === 'wood')) adviceKey = '木运不及';
        else if (zeroEls.some(e => e[0] === 'fire')) adviceKey = '火运不及';
        else if (zeroEls.some(e => e[0] === 'earth')) adviceKey = '土运不及';
        else if (zeroEls.some(e => e[0] === 'metal')) adviceKey = '金运不及';
        else if (zeroEls.some(e => e[0] === 'water')) adviceKey = '水运不及';

        const ADVICE_MAP: any = {
            '木运不及': {
                core: '滋水涵木（补肾以助肝），直接补益肝血。',
                goals: ['缓解眼干涩与筋骨僵硬', '提升睡眠质量（11点前入睡）', '改善情绪急躁'],
                season: '春季是养肝的最佳时机。',
                diet: [
                    '多吃绿色食物（木行本色）：菠菜、西兰花、芹菜、韭菜、芥蓝、黄瓜、绿豆等。',
                    '多吃酸味食物（酸入肝）：柠檬、山楂、乌梅、橙子、猕猴桃、醋（适量）。',
                    '补益肝血：猪肝、鸡肝、枸杞、桑葚、黑芝麻、当归、何首乌。',
                    '禁忌：避免过量饮酒和油腻食物，以免加重肝脏负担。'
                ],
                lifestyle: [
                    '作息：夜卧早起，保证23点前入睡（肝经当令）。',
                    '运动：伸展类运动，如瑜伽、太极拳、八段锦。多去公园、森林吸收“木气”。',
                    '穴位：按揉太冲穴（疏肝解郁）、三阴交（调肝补肾）。'
                ],
                emotion: '多鼓励自己，培养积极向上的心态，避免生闷气。'
            },
            '火运不及': {
                core: '补益心阳心血，温通经脉。',
                goals: ['改善手脚冰凉', '增强心脏供血能力', '提升社交活力'],
                season: '夏季是养心的关键时期。',
                diet: [
                    '多吃红色食物（火行本色）：红枣、红豆、西红柿、胡萝卜、草莓、牛羊肉。',
                    '多吃苦味食物（苦入心）：苦瓜、莲子心、绿茶、杏仁。',
                    '温补心阳：肉桂、生姜、桂圆、人参、当归。',
                    '禁忌：避免过度食用生冷寒凉（冰淇淋、冷饮）。'
                ],
                lifestyle: [
                    '作息：夜卧早起，中午小憩（午时心经当令）。',
                    '运动：温和有氧（快走、慢跑），微汗即止，避免大汗淋漓。',
                    '穴位：按揉内关穴（温通心阳）、劳宫穴（宁心安神）。'
                ],
                emotion: '多参与社交，培养爱好，听欢快音乐，保持心情愉悦。'
            },
            '土运不及': {
                core: '健脾益气，燥湿和胃。',
                goals: ['改善消化不良与腹胀', '增强肌肉力量', '调理气血生化之源'],
                season: '长夏（夏秋之交）是养脾的重点时期。',
                diet: [
                    '多吃黄色食物（土行本色）：小米、玉米、南瓜、黄豆、红薯。',
                    '多吃甘味食物（甘入脾）：大枣、蜂蜜、山药、薏米、芡实。',
                    '健脾益气：党参、白术、茯苓、白扁豆。',
                    '禁忌：避免甜腻、油腻和生冷食物。'
                ],
                lifestyle: [
                    '作息：规律作息，避免熬夜。饭后百步走。',
                    '运动：腹部按摩，核心训练（平板支撑），散步。',
                    '穴位：按揉足三里、三阴交，艾灸中脘穴。'
                ],
                emotion: '减少思虑，活在当下。冥想安定心神。'
            },
            '金运不及': {
                core: '补益肺气，滋阴润燥。',
                goals: ['增强呼吸道免疫力', '改善皮肤干燥', '提升抗压能力'],
                season: '秋季是养肺的黄金时间。',
                diet: [
                    '多吃白色食物（金行本色）：梨、银耳、百合、山药、白萝卜、莲藕。',
                    '多吃辛味食物（辛入肺）：生姜、洋葱、大蒜（适量宣肺）。',
                    '滋阴润肺：沙参、麦冬、川贝、蜂蜜。',
                    '禁忌：秋季避过辣（耗气），减少吸烟粉尘。'
                ],
                lifestyle: [
                    '作息：早卧早起。',
                    '运动：呼吸运动（瑜伽腹式呼吸、太极），登山。',
                    '穴位：按揉太渊穴（补肺气）、合谷穴（宣通鼻窍）。'
                ],
                emotion: '练习深呼吸，接触积极乐观的人事，避免悲伤。'
            },
            '水运不及': {
                core: '滋补肾阴，温补肾阳。',
                goals: ['改善腰膝酸软', '提升记忆力与精力', '缓解畏寒症状'],
                season: '冬季是补肾的最佳时节。',
                diet: [
                    '多吃黑色食物（水行本色）：黑豆、黑米、黑芝麻、黑木耳、桑葚。',
                    '多吃咸味食物（咸入肾）：海带、紫菜、牡蛎（适量）。',
                    '补肾填精：核桃、枸杞、山药、杜仲、熟地黄。',
                    '禁忌：避过咸，避熬夜（伤肾精）。'
                ],
                lifestyle: [
                    '作息：早卧晚起，必待日光，保证充足睡眠。',
                    '运动：避剧烈运动大汗。宜散步、站桩、打坐。',
                    '穴位：按揉/艾灸太溪穴、涌泉穴。'
                ],
                emotion: '减少恐惧，保存精神，避免过度惊吓。'
            },
            '平衡': {
                core: '中庸之道，顺势而为。',
                goals: ['维持阴阳平衡', '增强免疫力', '适应四季变化'],
                season: '顺应四季变化，微调养生。',
                diet: ['五色五味养五脏，饮食多样均衡，粗细搭配。', '食饮有节，定时定量，每餐七分饱。'],
                lifestyle: ['作息规律，动静结合。', '定期进行经络按摩。', '睡前泡脚，调和气血。'],
                emotion: '保持平和心态，不偏不倚。'
            }
        };

        const plan = ADVICE_MAP[adviceKey];
        
        // Add dynamic timeline logic for dashboard
        plan.timeline = [
            { time: '08:30', title: '【晨间仪式】', desc: '固本培元，启动阳气。', type: '仪式' },
            { time: '10:30', title: '【工间理气】', desc: '按揉穴位，疏通经络。', type: '功法' },
            { time: '12:00', title: '【能量午餐】', desc: '均衡饮食，运化脾胃。', type: '食疗' },
            { time: '15:30', title: '【静心冥想】', desc: '调和神气，缓解压力。', type: '冥想' },
            { time: '17:30', title: '【收工固元】', desc: '封藏能量，回归自我。', type: '仪式' }
        ];

        return plan;
    }

    private processSymptoms(data: any, innateRisks: string[]) {
        if (!data) return { score: 100, risks: innateRisks, summary: '形神兼备' };
        const risks = [...innateRisks];
        let score = 100;
        
        // Process survey data
        const symptomsCount = 
            (data.q1?.filter((x: string) => !x.includes('无')).length || 0) +
            (data.q2?.filter((x: string) => !x.includes('无')).length || 0) +
            (data.q3?.filter((x: string) => !x.includes('无')).length || 0) +
            (data.q4?.filter((x: string) => !x.includes('良好')).length || 0) +
            (data.q5?.filter((x: string) => !x.includes('正常')).length || 0);

        score -= (symptomsCount * 5);
        
        // Add specific risks based on answers
        if (data.q1?.some((x: string) => x.includes('僵硬'))) risks.push('颈肩气滞');
        if (data.q4?.some((x: string) => x.includes('失眠'))) risks.push('心神失养');
        if (data.q5?.some((x: string) => x.includes('消化'))) risks.push('脾胃不和');

        return {
            score: Math.max(60, score),
            risks: Array.from(new Set(risks)).slice(0, 4),
            summary: score > 85 ? '形神兼备' : score > 70 ? '稍有滞涩' : '气机紊乱'
        };
    }
}
