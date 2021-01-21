let modInfo = {
	name: "The Prestige Chain",
	id: "prestigechain",
	author: "pg132",
	pointsName: "points",
	discordName: "pg132#7975",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    	offlineLimit: 0,   
	// In seconds, so the current 0 is 0 seconds
    	initialStartPoints: new Decimal (0) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: ".8.3 Aeronautical",
	name: "",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",
					"getTokenToMedalGain",
					"getAllPrior",
					"succChance",
					"resetPrior",
					"doSearch",
					"doEdges",
					"doCenters",
					"attemptFinish",
					"getBonusLocks",
					"getRebirthExp2",
					]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

function showGenPoints(){
	return player.points.max(10).log10().max(10).log10().lt(5)
}

function showCurrency(a){
	return a.max(10).log10().max(10).log10().lt(5)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	undulating: true,
	lastSave: new Date().getTime(),
}}

PROGRESSION_MILESTONES = {
	1:() => player.a.upgrades.length >= 1                || hasAchievement("ach", 11),
	2:() => player.a.upgrades.length >= 3                || hasAchievement("ach", 12),
	3:() => player.a.upgrades.length >= 6                || hasAchievement("ach", 13),
	4:() => getBuyableAmount("a", 12).gte(2)             || hasAchievement("ach", 14),
	5:() => player.a.points.gte(1e6)                     || hasAchievement("ach", 15),
	6:() => player.b.upgrades.length >= 1                || hasAchievement("ach", 16),
	7:() => player.a.upgrades.length >= 13               || hasAchievement("ach", 17),
	8:() => player.b.upgrades.length >= 6                || hasAchievement("ach", 21),
	9:() => player.a.upgrades.length >= 16               || hasAchievement("ach", 22),
	10:() => player.b.points.gt(5e10)                    || hasAchievement("ach", 23),
	11:() => player.c.points.gte(3)                      || hasAchievement("ach", 24),
	12:() => player.c.upgrades.length >= 3               || hasAchievement("ach", 25),
	13:() => getBuyableAmount("a", 31).gte(4)            || hasAchievement("ach", 26),
	14:() => player.b.upgrades.length >= 12              || hasAchievement("ach", 27),
	15:() => player.b.upgrades.length >= 14              || hasAchievement("ach", 31),
	16:() => player.c.upgrades.length >= 4               || hasAchievement("ach", 32),
	17:() => challengeCompletions("b", 11) >= 1          || hasAchievement("ach", 33),
	18:() => player.b.upgrades.length >= 19              || hasAchievement("ach", 34),
	19:() => player.c.upgrades.length >= 7               || hasAchievement("ach", 35),
	20:() => challengeCompletions("b", 12) >= 1          || hasAchievement("ach", 36),
	21:() => player.c.points.gte(5e10)                   || hasAchievement("ach", 37),
	22:() => player.d.points.gte(5)                      || hasAchievement("ach", 41),
	23:() => player.b.upgrades.length >= 22              || hasAchievement("ach", 42),
	24:() => getBuyableAmount("b", 21).gte(2)            || hasAchievement("ach", 43),
	25:() => player.d.upgrades.length >= 4               || hasAchievement("ach", 44),
	26:() => totalChallengeComps("b") >= 8               || hasAchievement("ach", 45),
	27:() => totalChallengeComps("b") >= 11              || hasAchievement("ach", 46),
	28:() => getBuyableAmount("b", 23).gte(2)            || hasAchievement("ach", 47),
	29:() => layers.d.getResetGain().gte(25500)          || hasAchievement("ach", 51),
	30:() => getBuyableAmount("c", 11).gte(5)            || hasAchievement("ach", 52),
	31:() => getBuyableAmount("b", 31).gte(1)            || hasAchievement("ach", 53),
	32:() => player.c.upgrades.length >= 18              || hasAchievement("ach", 54),
	33:() => totalChallengeComps("c") >= 1               || hasAchievement("ach", 55),
	34:() => player.c.upgrades.length >= 20              || hasAchievement("ach", 56),
	35:() => totalChallengeComps("c") >= 2               || hasAchievement("ach", 57),
	36:() => player.e.points.gte(2)                      || hasAchievement("ach", 61),
	37:() => player.e.points.gte(200)                    || hasAchievement("ach", 62),
	38:() => totalChallengeComps("c") >= 3               || hasAchievement("ach", 63),
	39:() => totalChallengeComps("c") >= 5               || hasAchievement("ach", 64),
	40:() => totalChallengeComps("b") >= 56              || hasAchievement("ach", 65),
	41:() => totalChallengeComps("b") >= 61              || hasAchievement("ach", 66),
	42:() => player.e.upgrades.length >= 2               || hasAchievement("ach", 67),
	43:() => totalChallengeComps("c") >= 9               || hasAchievement("ach", 71),
	44:() => totalChallengeComps("c") >= 13              || hasAchievement("ach", 72),
	45:() => totalChallengeComps("c") >= 14              || hasAchievement("ach", 73),
	46:() => getBuyableAmount("d", 11).gte(14)           || hasAchievement("ach", 74),
	47:() => getBuyableAmount("d", 13).gte(6)            || hasAchievement("ach", 75),
	48:() => totalChallengeComps("c") >= 15              || hasAchievement("ach", 76),
	49:() => totalChallengeComps("c") >= 17              || hasAchievement("ach", 77),
	50:() => totalChallengeComps("c") >= 19              || hasAchievement("ach", 81),
	51:() => totalChallengeComps("c") >= 22              || hasAchievement("ach", 82),
	52:() => totalChallengeComps("c") >= 34              || hasAchievement("ach", 83),
	53:() => player.f.times >= 1                         || hasAchievement("ach", 84),
	54:() => player.goalsii.tokens.best["01"].gte(1)     || hasAchievement("ach", 85),
	55:() => player.goalsii.tokens.best["02"].gte(1)     || hasAchievement("ach", 86),
	56:() => player.goalsii.tokens.best["10"].gte(1)     || hasAchievement("ach", 87),
	57:() => player.goalsii.tokens.best["11"].gte(1)     || hasAchievement("ach", 91),
	58:() => player.goalsii.tokens.best["12"].gte(1)     || hasAchievement("ach", 92),
	59:() => player.goalsii.tokens.best["20"].gte(1)     || hasAchievement("ach", 93),
	60:() => player.goalsii.tokens.best["21"].gte(1)     || hasAchievement("ach", 94),
	61:() => player.goalsii.tokens.best["22"].gte(1)     || hasAchievement("ach", 95),
	62:() => player.goalsii.tokens.best["03"].gte(1)     || hasAchievement("ach", 96),
	63:() => player.goalsii.tokens.best["13"].gte(1)     || hasAchievement("ach", 97),
	64:() => player.goalsii.tokens.best["23"].gte(1)     || hasAchievement("ach",101),
	65:() => player.goalsii.tokens.best["30"].gte(1)     || hasAchievement("ach",102),
	66:() => player.goalsii.tokens.best["31"].gte(1)     || hasAchievement("ach",103),
	67:() => player.goalsii.tokens.best["32"].gte(1)     || hasAchievement("ach",104),
	68:() => player.goalsii.tokens.best["33"].gte(1)     || hasAchievement("ach",105),
	69:() => getBuyableAmount("b", 11).gte(1e20)         || hasAchievement("ach",106),
	70:() => getBuyableAmount("b", 12).gte(1e20)         || hasAchievement("ach",107),
	71:() => player.goalsii.tokens.best["04"].gte(1)     || hasAchievement("ach",111),
	72:() => player.goalsii.tokens.best["14"].gte(1)     || hasAchievement("ach",112),
	73:() => player.goalsii.tokens.best["24"].gte(1)     || hasAchievement("ach",113),
	74:() => player.goalsii.tokens.best["34"].gte(1)     || hasAchievement("ach",114),
	75:() => player.goalsii.tokens.best["40"].gte(1)     || hasAchievement("ach",115),
	76:() => player.goalsii.tokens.best["41"].gte(1)     || hasAchievement("ach",116),
	77:() => player.goalsii.tokens.best["42"].gte(1)     || hasAchievement("ach",117),
	78:() => player.goalsii.tokens.best["43"].gte(1)     || hasAchievement("ach",121),
	79:() => player.goalsii.tokens.best["44"].gte(1)     || hasAchievement("ach",122),
	80:() => player.f.best.gte(1e58)                     || hasAchievement("ach",123),
	81:() => player.g.best.gte(2)                        || hasAchievement("ach",124),
	82:() => player.g.best.gte(20)                       || hasAchievement("ach",125),
	83:() => player.g.clickableAmounts[11].gte(2)        || hasAchievement("ach",126),
	84:() => player.g.clickableAmounts[21].gte(4)        || hasAchievement("ach",127),
	85:() => layers.g.clickables.getChargesPerMinute()>19|| hasAchievement("ach",131),
	86:() => player.g.partialTally.gte(75)               || hasAchievement("ach",132),
	87:() => player.g.completedTally.gte(11)             || hasAchievement("ach",133),
	88:() => player.g.completedTally.gte(13)             || hasAchievement("ach",134),
	89:() => player.g.completedTally.gte(16)             || hasAchievement("ach",135),
	90:() => player.g.completedTally.gte(50)             || hasAchievement("ach",136),
	91:() => player.g.completedTally.gte(100)            || hasAchievement("ach",137),
	92:() => player.g.completedTally.gte(400)            || hasAchievement("ach",141),
	93:() => player.g.completedTally.gte(450)            || hasAchievement("ach",142),
	94:() => player.g.completedTally.gte(500)            || hasAchievement("ach",143),
	95:() => player.g.completedTally.gte(550)            || hasAchievement("ach",144),
	96:() => player.g.completedTally.gte(600)            || hasAchievement("ach",145),
	97:() => player.g.completedTally.gte(650)            || hasAchievement("ach",146),
	98:() => player.g.completedTally.gte(700)            || hasAchievement("ach",147),
	99:() => player.h.points.gte(3)                      || hasAchievement("ach",151),
	100:()=> player.h.points.gte(30)                     || hasAchievement("ach",152),
	101:()=> challengeCompletions("f", 11) >= 1          || hasAchievement("ach",153),
	102:()=> totalChallengeComps("f") >= 3               || hasAchievement("ach",154),
	103:()=> totalChallengeComps("f") >= 6               || hasAchievement("ach",155),
	104:()=> totalChallengeComps("f") >= 10              || hasAchievement("ach",156),
	105:()=> totalChallengeComps("f") >= 15              || hasAchievement("ach",157),
	106:()=> totalChallengeComps("f") >= 21              || hasAchievement("ach",161),
	107:()=> totalChallengeComps("f") >= 28              || hasAchievement("ach",162),
	108:()=> player.i.best.gte(1)                        || hasAchievement("ach",163),
	109:()=> player.i.best.gte(10)                       || hasAchievement("ach",164),
	110:()=> player.i.best.gte(100)                      || hasAchievement("ach",165),
	111:()=> totalChallengeComps("f") >= 36              || hasAchievement("ach",166),
	112:()=> totalChallengeComps("f") >= 45              || hasAchievement("ach",167),
	113:()=> totalChallengeComps("f") >= 55              || hasAchievement("ach",171),
	114:()=> totalChallengeComps("f") >= 66              || hasAchievement("ach",172),
	115:()=> totalChallengeComps("f") >= 78              || hasAchievement("ach",173),
	116:()=> totalChallengeComps("f") >= 91              || hasAchievement("ach",174),
	117:()=> totalChallengeComps("f") >= 105             || hasAchievement("ach",175),
	118:()=> totalChallengeComps("f") >= 120             || hasAchievement("ach",176),
	119:()=> totalChallengeComps("f") >= 136             || hasAchievement("ach",177),
	120:()=> player.j.puzzle.bestExp.gte(1)              || hasAchievement("ach",181),
	121:()=> player.j.puzzle.bestExp.gte(3)              || hasAchievement("ach",182),
	122:()=> player.j.puzzle.bestExp.gte(9)              || hasAchievement("ach",183),
	123:()=> player.j.puzzle.bestExp.gte(27)             || hasAchievement("ach",184),
	124:()=> player.j.puzzle.bestExp.gte(81)             || hasAchievement("ach",185),
	125:()=> player.j.puzzle.bestExp.gte(243)            || hasAchievement("ach",186),
	126:()=> player.j.puzzle.bestExp.gte(729)            || hasAchievement("ach",187),
	127:()=> player.j.puzzle.finished >= 7                || hasAchievement("ach",191),
	128:()=> player.j.puzzle.finished >= 9                || hasAchievement("ach",192),
	129:()=> player.j.puzzle.finished >= 11               || hasAchievement("ach",193),
	130:()=> player.j.puzzle.finished >= 13               || hasAchievement("ach",194),
	131:()=> player.j.puzzle.finished >= 15               || hasAchievement("ach",195),
	132:()=> player.j.puzzle.finished >= 17               || hasAchievement("ach",196),
	133:()=> player.j.puzzle.finished >= 19               || hasAchievement("ach",197),
	134:()=> totalChallengeComps("f") >= 153             || hasAchievement("ach",201),
	135:()=> totalChallengeComps("f") >= 171             || hasAchievement("ach",202),
	136:()=> totalChallengeComps("f") >= 190             || hasAchievement("ach",203),
	137:()=> totalChallengeComps("f") >= 210             || hasAchievement("ach",204),
	138:()=> totalChallengeComps("h") >= 1               || hasAchievement("ach",205),
	139:()=> totalChallengeComps("h") >= 3               || hasAchievement("ach",206),
	140:()=> totalChallengeComps("h") >= 6               || hasAchievement("ach",207),
	141:()=> player.j.puzzle.finished >= 21               || hasAchievement("ach",211),
	142:()=> player.j.puzzle.finished >= 23               || hasAchievement("ach",212),
	143:()=> player.j.puzzle.finished >= 25               || hasAchievement("ach",213),
	144:()=> player.j.puzzle.finished >= 27               || hasAchievement("ach",214),
	145:()=> player.j.puzzle.finished >= 29               || hasAchievement("ach",215),
	146:()=> player.j.puzzle.finished >= 31               || hasAchievement("ach",216),
	147:()=> player.j.puzzle.finished >= 33               || hasAchievement("ach",217),
	148:()=> totalChallengeComps("h") >= 10              || hasAchievement("ach",221),
	149:()=> totalChallengeComps("h") >= 15              || hasAchievement("ach",222),
	150:()=> totalChallengeComps("h") >= 21              || hasAchievement("ach",223),
	151:()=> totalChallengeComps("h") >= 28              || hasAchievement("ach",224),
	152:()=> totalChallengeComps("h") >= 36              || hasAchievement("ach",225),
	153:()=> totalChallengeComps("h") >= 45              || hasAchievement("ach",226),
	154:()=> totalChallengeComps("h") >= 55              || hasAchievement("ach",227),
	155:()=> player.j.puzzle.finished >= 50               || hasAchievement("ach",231),
	156:()=> player.j.puzzle.finished >= 55               || hasAchievement("ach",232),
	157:()=> player.j.puzzle.finished >= 60               || hasAchievement("ach",233),
	158:()=> player.j.puzzle.finished >= 65               || hasAchievement("ach",234),
	159:()=> player.j.puzzle.finished >= 70               || hasAchievement("ach",235),
	160:()=> player.j.puzzle.finished >= 75               || hasAchievement("ach",236),
	161:()=> player.j.puzzle.finished >= 80               || hasAchievement("ach",237),
	162:()=> player.j.puzzle.finished >= 85               || hasAchievement("ach",241),
	163:()=> player.j.puzzle.finished >= 90               || hasAchievement("ach",242),
	164:()=> player.j.puzzle.finished >= 95               || hasAchievement("ach",243),
	165:()=> player.j.puzzle.finished >= 100              || hasAchievement("ach",244),
	166:()=> player.j.puzzle.finished >= 105              || hasAchievement("ach",245),
	167:()=> player.j.puzzle.finished >= 110              || hasAchievement("ach",246),
	168:()=> player.j.puzzle.finished >= 115              || hasAchievement("ach",247),
	169:()=> player.j.puzzle.finished >= 120              || hasAchievement("ach",251),
	170:()=> player.j.puzzle.finished >= 130              || hasAchievement("ach",252),
	171:()=> player.j.puzzle.finished >= 140              || hasAchievement("ach",253),
	172:()=> player.j.puzzle.finished >= 150              || hasAchievement("ach",254),
	173:()=> player.j.puzzle.finished >= 160              || hasAchievement("ach",255),
	174:()=> player.j.puzzle.finished >= 170              || hasAchievement("ach",256),
	175:()=> player.j.puzzle.finished >= 180              || hasAchievement("ach",257),
	176:()=> totalChallengeComps("h") >= 66              || hasAchievement("ach",261),
	177:()=> totalChallengeComps("h") >= 78              || hasAchievement("ach",262),
	178:()=> totalChallengeComps("h") >= 91              || hasAchievement("ach",263),
	179:()=> totalChallengeComps("h") >= 105             || hasAchievement("ach",264),
	180:()=> totalChallengeComps("h") >= 120             || hasAchievement("ach",265),
	181:()=> totalChallengeComps("h") >= 136             || hasAchievement("ach",266),
	182:()=> totalChallengeComps("h") >= 153             || hasAchievement("ach",267),
	183:()=> player.j.puzzle.finished >= 250              || hasAchievement("ach",271),
	184:()=> player.j.puzzle.finished >= 260              || hasAchievement("ach",272),
	185:()=> player.j.puzzle.finished >= 270              || hasAchievement("ach",273),
	186:()=> player.j.puzzle.finished >= 280              || hasAchievement("ach",274),
	187:()=> player.j.puzzle.finished >= 290              || hasAchievement("ach",275),
	188:()=> player.j.puzzle.finished >= 300              || hasAchievement("ach",276),
	189:()=> player.j.puzzle.finished >= 310              || hasAchievement("ach",277),
	190:()=> player.j.puzzle.finished >= 400              || hasAchievement("ach",281),
	191:()=> player.j.puzzle.finished >= 500              || hasAchievement("ach",282),
	192:()=> player.j.puzzle.finished >= 700              || hasAchievement("ach",283),
	193:()=> player.j.puzzle.finished >= 1000             || hasAchievement("ach",284),
	194:()=> player.k.lock.resources[11].gt(0)           || hasAchievement("ach",285),
	195:()=> player.k.lock.resources[12].gt(0)           || hasAchievement("ach",286),
	196:()=> player.k.lock.resources[13].gt(0)           || hasAchievement("ach",287),
	197:()=> player.k.lock.resources[14].gt(0)           || hasAchievement("ach",291),
	198:()=> player.k.lock.resources[15].gt(0)           || hasAchievement("ach",292),
	199:()=> player.k.lock.resources[21].gt(0)           || hasAchievement("ach",293),
	200:()=> player.k.lock.resources[22].gt(0)           || hasAchievement("ach",294),
	201:()=> player.k.lock.resources[23].gt(0)           || hasAchievement("ach",295),
	202:()=> player.k.lock.resources[24].gt(0)           || hasAchievement("ach",296),
	203:()=> player.k.lock.resources[25].gt(0)           || hasAchievement("ach",297),
	204:()=> player.j.puzzle.finished >= 1500             || hasAchievement("ach",301),
	205:()=> player.j.puzzle.finished >= 2000             || hasAchievement("ach",302),
	206:()=> player.j.puzzle.finished >= 2500             || hasAchievement("ach",303),
	207:()=> player.j.puzzle.finished >= 3000             || hasAchievement("ach",304),
	208:()=> player.j.puzzle.finished >= 3500             || hasAchievement("ach",305),
	209:()=> player.j.puzzle.finished >= 4000             || hasAchievement("ach",306),
	210:()=> player.j.puzzle.finished >= 4500             || hasAchievement("ach",307),
	211:()=> player.k.lock.repeatables[51].gte(1)        || hasAchievement("ach",311),
	212:()=> player.k.lock.repeatables[52].gte(1)        || hasAchievement("ach",312),
	213:()=> player.k.lock.repeatables[53].gte(1)        || hasAchievement("ach",313),
	214:()=> player.k.lock.repeatables[53].gte(3)        || hasAchievement("ach",314),
	215:()=> player.k.lock.repeatables[53].gte(6)        || hasAchievement("ach",315),
	216:()=> player.k.lock.repeatables[54].gte(1)        || hasAchievement("ach",316),
	217:()=> player.k.lock.repeatables[55].gte(1)        || hasAchievement("ach",317),
	218:()=> player.k.lock.repeatables[55].gte(3)        || hasAchievement("ach",321),
	219:()=> player.k.lock.repeatables[55].gte(6)        || hasAchievement("ach",322),
	220:()=> player.k.lock.repeatables[55].gte(10)       || hasAchievement("ach",323),
	221:()=> player.k.lock.repeatables[55].gte(15)       || hasAchievement("ach",324),
	222:()=> player.k.lock.repeatables[55].gte(21)       || hasAchievement("ach",325),
	223:()=> player.k.lock.repeatables[55].gte(28)       || hasAchievement("ach",326),
	224:()=> player.k.lock.repeatables[55].gte(36)       || hasAchievement("ach",327),
	225:()=> player.j.puzzle.finished >= 5000             || hasAchievement("ach",331),
	226:()=> player.j.puzzle.finished >= 6000             || hasAchievement("ach",332),
	227:()=> player.j.puzzle.finished >= 7000             || hasAchievement("ach",333),
	228:()=> player.j.puzzle.finished >= 8000             || hasAchievement("ach",334),
	229:()=> player.j.puzzle.finished >= 9000             || hasAchievement("ach",335),
	230:()=> player.j.puzzle.finished >= 10e3             || hasAchievement("ach",336),
	231:()=> totalChallengeComps("h") >= 171             || hasAchievement("ach",337),
	232:()=> player.j.puzzle.finished >= 11e3             || hasAchievement("ach",341),
	233:()=> player.j.puzzle.finished >= 12e3             || hasAchievement("ach",342),
	234:()=> player.j.puzzle.finished >= 13e3             || hasAchievement("ach",343),
	235:()=> player.j.puzzle.finished >= 14e3             || hasAchievement("ach",344),
	236:()=> player.j.puzzle.finished >= 15e3             || hasAchievement("ach",345),
	237:()=> player.j.puzzle.finished >= 16e3             || hasAchievement("ach",346),
	238:()=> totalChallengeComps("h") >= 190             || hasAchievement("ach",347),
	239:()=> player.k.lock.repeatables[55].gte(45)       || hasAchievement("ach",351),
	240:()=> player.k.lock.repeatables[55].gte(55)       || hasAchievement("ach",352),
	241:()=> player.k.lock.repeatables[55].gte(66)       || hasAchievement("ach",353),
	242:()=> player.k.lock.repeatables[55].gte(78)       || hasAchievement("ach",354),
	243:()=> player.k.lock.repeatables[55].gte(91)       || hasAchievement("ach",355),
	244:()=> player.k.lock.repeatables[55].gte(105)      || hasAchievement("ach",356),
	245:()=> totalChallengeComps("h") >= 210             || hasAchievement("ach",357),
	246:()=> player.j.puzzle.finished >= 17e3             || hasAchievement("ach",361),
	247:()=> player.j.puzzle.finished >= 18e3             || hasAchievement("ach",362),
	248:()=> player.j.puzzle.finished >= 19e3             || hasAchievement("ach",363),
	249:()=> player.j.puzzle.finished >= 20e3             || hasAchievement("ach",364),
	250:()=> player.j.puzzle.finished >= 21e3             || hasAchievement("ach",365),
	251:()=> player.j.puzzle.finished >= 22e3             || hasAchievement("ach",366),
	252:()=> totalChallengeComps("h") >= 231             || hasAchievement("ach",367),
	253:()=> player.j.puzzle.finished >= 23e3             || hasAchievement("ach",371),
	254:()=> player.j.puzzle.finished >= 24e3             || hasAchievement("ach",372),
	255:()=> player.j.puzzle.finished >= 25e3             || hasAchievement("ach",373),
	256:()=> player.j.puzzle.finished >= 26e3             || hasAchievement("ach",374),
	257:()=> player.j.puzzle.finished >= 27e3             || hasAchievement("ach",375),
	258:()=> player.j.puzzle.finished >= 28e3             || hasAchievement("ach",376),
	259:()=> totalChallengeComps("h") >= 253             || hasAchievement("ach",377),
	260:()=> player.j.puzzle.finished >= 29e3             || hasAchievement("ach",381),
	261:()=> player.j.puzzle.finished >= 30e3             || hasAchievement("ach",382),
	262:()=> player.j.puzzle.finished >= 31e3             || hasAchievement("ach",383),
	263:()=> player.j.puzzle.finished >= 32e3             || hasAchievement("ach",384),
	264:()=> player.j.puzzle.finished >= 33e3             || hasAchievement("ach",385),
	265:()=> player.j.puzzle.finished >= 34e3             || hasAchievement("ach",386),
	266:()=> totalChallengeComps("h") >= 276             || hasAchievement("ach",387),
}

PROGRESSION_MILESTONES_TEXT = {
	1: "1 Amoeba upgrade",
	2: "3 Amoeba upgrades",
	3: "6 Amoeba upgrades",
	4: "2 Any buyables",
	5: "1e6 Amoebas",
	6: "1 Bacteria upgrade",
	7: "13 Amoeba upgrades",
	8: "6 Bacteria upgrades",
	9: "16 Amoeba upgrades",
	10: "5e10 Bacteria",
	11: "3 Circles",
	12: "3 Circle upgrades",
	13: "4 Against levels",
	14: "12 Bacteria upgrades",
	15: "14 Bacteria upgrades",
	16: "4 Circle upgrades",
	17: "1 Big completion",
	18: "19 Bacteria upgrades",
	19: "7 Circle upgrades",
	20: "1 Body completion",
	21: "5e10 Circles",
	22: "5 Doodles",
	23: "22 Bacteria upgrades",
	24: "2 Baby buyables",
	25: "4 Doodle upgrades",
	26: "8 Bacteria challenge completions",
	27: "11 Bacteria challenge completions",
	28: "2 Beauty buyables",
	29: "25,500 Doodles at once",
	30: "5 Case buyables",
	31: "1 Basic buyables",
	32: "18 Circle upgrades",
	33: "1 Circle challenge completions",
	34: "20 Circle upgrades",
	35: "2 Circle challenge completions",
	36: "2 Eggs",
	37: "200 Eggs",
	38: "3 Circle challenge completions",
	39: "5 Circle challenge completions",
	40: "56 Bacteria challenge completions",
	41: "61 Bacteria challenge completions",
	42: "2 Egg upgrades",
	43: "9 Circle challenge completions",
	44: "13 Circle challenge completions",
	45: "14 Circle challenge completions",
	46: "14 Department buyables",
	47: "6 Delivery buyables",
	48: "15 Circle challenge completions",
	49: "17 Circle challenge completions",
	50: "19 Circle challenge completions",
	51: "22 Circle challenge completions",
	52: "34 Circle challenge completions",
	53: "one Feature",
	54: "a 01 token",
	55: "a 02 token",
	56: "a 10 token",
	57: "a 11 token",
	58: "a 12 token",
	59: "a 20 token",
	60: "a 21 token",
	61: "a 22 token",
	62: "a 03 token",
	63: "a 13 token",
	64: "a 23 token",
	65: "a 30 token",
	66: "a 31 token",
	67: "a 32 token",
	68: "a 33 token",
	69: "1e20 Because levels",
	70: "1e20 Based levels",
	71: "a 04 token",
	72: "a 14 token",
	73: "a 24 token",
	74: "a 34 token",
	75: "a 40 token",
	76: "a 41 token",
	77: "a 42 token",
	78: "a 43 token",
	79: "a 44 token",
	80: "1e58 Features",
	81: "2 Games",
	82: "20 Games",
	83: "two levels of Tetris",
	84: "Quake to 40%",
	85: "20 charges per minute",
	86: "75 completed devs",
	87: "11 completed games",
	88: "13 completed games",
	89: "16 completed games",
	90: "50 completed games",
	91: "100 completed games",
	92: "400 completed games",
	93: "450 completed games",
	94: "500 completed games",
	95: "550 completed games",
	96: "600 completed games",
	97: "650 completed games",
	98: "700 completed games",
	99: "3 Hearts",
	100:"30 Hearts",
	101:"One Files completion",
	102:"3 Feature challenge completions",
	103:"6 Feature challenge completions",
	104:"10 Feature challenge completions",
	105:"15 Feature challenge completions",
	106:"21 Feature challenge completions",
	107:"28 Feature challenge completions",
	108:"1 Idea",
	109:"10 Ideas",
	110:"100 Ideas",
	111:"36 Feature challenge completions",
	112:"45 Feature challenge completions",
	113:"55 Feature challenge completions",
	114:"66 Feature challenge completions",
	115:"78 Feature challenge completions",
	116:"91 Feature challenge completions",
	117:"105 Feature challenge completions",
	118:"120 Feature challenge completions",
	119:"136 Feature challenge completions",
	120:"1 exp",
	121:"3 exp",
	122:"9 exp",
	123:"27 exp",
	124:"81 exp",
	125:"243 exp",
	126:"729 exp",
	127:"7 puzzle completions at once",
	128:"9 puzzle completions at once",
	129:"11 puzzle completions at once",
	130:"13 puzzle completions at once",
	131:"15 puzzle completions at once",
	132:"17 puzzle completions at once",
	133:"19 puzzle completions at once",
	134:"153 Feature challenge completions",
	135:"171 Feature challenge completions",
	136:"190 Feature challenge completions",
	137:"210 Feature challenge completions",
	138:"1 Heart challenge completion",
	139:"3 Heart challenge completions",
	140:"6 Heart challenge completions",
	141:"21 puzzle completions at once",
	142:"23 puzzle completions at once",
	143:"25 puzzle completions at once",
	144:"27 puzzle completions at once",
	145:"29 puzzle completions at once",
	146:"31 puzzle completions at once",
	147:"33 puzzle completions at once",
	148:"10 Heart challenge completion",
	149:"15 Heart challenge completions",
	150:"21 Heart challenge completions",
	151:"28 Heart challenge completion",
	152:"36 Heart challenge completions",
	153:"45 Heart challenge completions",
	154:"55 Heart challenge completion",
	155:"50 puzzle completions at once",
	156:"55 puzzle completions at once",
	157:"60 puzzle completions at once",
	158:"65 puzzle completions at once",
	159:"70 puzzle completions at once",
	160:"75 puzzle completions at once",
	161:"80 puzzle completions at once",
	162:"85 puzzle completions at once",
	163:"90 puzzle completions at once",
	164:"95 puzzle completions at once",
	165:"100 puzzle completions at once",
	166:"105 puzzle completions at once",
	167:"110 puzzle completions at once",
	168:"115 puzzle completions at once",
	169:"120 puzzle completions at once",
	170:"130 puzzle completions at once",
	171:"140 puzzle completions at once",
	172:"150 puzzle completions at once",
	173:"160 puzzle completions at once",
	174:"170 puzzle completions at once",
	175:"180 puzzle completions at once",
	176:"66 Heart challenge completion",
	177:"78 Heart challenge completions",
	178:"91 Heart challenge completions",
	179:"105 Heart challenge completion",
	180:"120 Heart challenge completions",
	181:"136 Heart challenge completions",
	182:"153 Heart challenge completion",
	183:"250 puzzle completions at once",
	184:"260 puzzle completions at once",
	185:"270 puzzle completions at once",
	186:"280 puzzle completions at once",
	187:"290 puzzle completions at once",
	188:"300 puzzle completions at once",
	189:"310 puzzle completions at once",
	190:"400 puzzle completions at once",
	191:"500 puzzle completions at once",
	192:"700 puzzle completions at once",
	193:"1000 puzzle completions at once",
	194:"one Iron",
	195:"one Silver",
	196:"one Gold",
	197:"one Bronze",
	198:"one Copper",
	199:"one Tin",
	200:"one Titanium",
	201:"one Tungsten",
	202:"one Aluminum",
	203:"one Osmium",
	204:"1500 puzzle completions at once",
	205:"2000 puzzle completions at once",
	206:"2500 puzzle completions at once",
	207:"3000 puzzle completions at once",
	208:"3500 puzzle completions at once",
	209:"4000 puzzle completions at once",
	210:"4500 puzzle completions at once",
	211:"one Basic Lock",
	212:"one Diamond Lock",
	213:"one Advanced Lock",
	214:"three Advanced Locks",
	215:"six Advanced Locks",
	216:"one Master Lock",
	217:"one Grandmaster Lock",
	218:"three Grandmaster Locks",
	219:"six Grandmaster Locks",
	220:"ten Grandmaster Locks",
	221:"fifteen Grandmaster Locks",
	222:"twenty-one Grandmaster Locks",
	223:"twenty-eight Grandmaster Locks",
	224:"thirty-six Grandmaster Locks",
	225:"5000 puzzle completions at once",
	226:"6000 puzzle completions at once",
	227:"7000 puzzle completions at once",
	228:"8000 puzzle completions at once",
	229:"9000 puzzle completions at once",
	230:"10000 puzzle completions at once",
	231:"171 Heart challenge completions",
	232:"11000 puzzle completions at once",
	233:"12000 puzzle completions at once",
	234:"13000 puzzle completions at once",
	235:"14000 puzzle completions at once",
	236:"15000 puzzle completions at once",
	237:"16000 puzzle completions at once",
	238:"190 Heart challenge completions",
	239:"45 Grandmaster Locks",
	240:"55 Grandmaster Locks",
	241:"66 Grandmaster Locks",
	242:"78 Grandmaster Locks",
	243:"91 Grandmaster Locks",
	244:"105 Grandmaster Locks",
	245:"210 Heart challenge completions",
	246:"17000 puzzle completions at once",
	247:"18000 puzzle completions at once",
	248:"19000 puzzle completions at once",
	249:"20000 puzzle completions at once",
	250:"21000 puzzle completions at once",
	251:"22000 puzzle completions at once",
	252:"231 Heart challenge completions",
	253:"23000 puzzle completions at once",
	254:"24000 puzzle completions at once",
	255:"25000 puzzle completions at once",
	256:"26000 puzzle completions at once",
	257:"27000 puzzle completions at once",
	258:"28000 puzzle completions at once",
	259:"253 Heart challenge completions",
	260:"29000 puzzle completions at once",
	261:"30000 puzzle completions at once",
	262:"31000 puzzle completions at once",
	263:"32000 puzzle completions at once",
	264:"33000 puzzle completions at once",
	265:"34000 puzzle completions at once",
	266:"276 Heart challenge completions",
}

function progressReachedNum(){
	let a = 0
	for (i in PROGRESSION_MILESTONES) {
		if (PROGRESSION_MILESTONES[i]() == true) a ++
	}
	return a
}

function progressReachedText(){
	return "You have done " + formatWhole(progressReachedNum()) + "/" + formatWhole(Object.keys(PROGRESSION_MILESTONES).length) + " of the milestones"
}

function nextMilestone(){
	for (i in PROGRESSION_MILESTONES) {
		if (PROGRESSION_MILESTONES[i]() == false) return "The next is at " + PROGRESSION_MILESTONES_TEXT[i]
	}
	return ""
}

// Display extra things at the top of the page
var displayThings = [
	function(){
		if (!showGenPoints()) return ""
		return "(" + format(getPointGen()) + "/sec)"
	},
	function(){
		let a = "Endgame: 2e13 Maps"
		return player.autosave ? a : a + ". Warning: autosave is off"
	},
	function(){
		let a = new Date().getTime() - player.lastSave
		return "Last save was " + formatTime(a/1000) + " ago"
	}
]

// Determines when the game "ends"
function isEndgame() {
	return false
}

function maxTickLength() {
	return 1000 // in ms
}

function getChangeLogText(){
	a1 = "v.4.9"
	a2 = "- Made the game run significantly faster"
	a3 = "- No longer calculates the text to display things when you are not on the tab"
	a4 = "- No longer updates temp when doing a reset every time (3 instead of 10 at endgame)"
	a5 = "- Added the first Game buyable, Gives"
	a6 = "- Added a Game upgrade which is QoL"
	b1 = "v.4.10"
	b2 = "- Added Game buyable, Guidelines"
	b3 = "- Added Feature challenge, Federal"
	b4 = "- Added two achievements"
	b5 = "- Added two Game and two Idea upgrades"
	b6 = "v.4.10.1"
	b7 = "- Fixed a progression bug"
	b8 = "v.4.10.2"
	b9 = "- Fix a bug where autocompleted rebirth I's does not reset progressions to 0%"
	b10= "- Rebalance wrt above"
	b11= "v.4.10.3"
	b12= "- Fixed a typo and rebalanced because of it"
	c1 = "v.4.11"
	c2 = "- Finished Item"
	c3 = "- Added a Game and three medal upgrades"
	c4 = "- Added a Game buyable"
	c5 = "- Gave Going a hardcap at 5e7 (50 Million) successful devs"
	d1 = "v.4.12"
	d2 = "- Implemented Rebirth III and Schrier"
	d3 = "- Fixed a bug where you can get charge softlocked"
	d4 = "- Made some code optimizations to make the game run ever so slightly faster"
	d5 = "- Softcaps completed devs to Base G Gain"
	d6 = "- Make Pac-Mac and Asteriods more effeicient in bulk buying"
	d7 = "- Made the changelog better :)"
	e1 = "v.4.13"
	e2 = "- Added two F buyables"
	e3 = "- Added two Medal, two Heart, one Idea, and the final Game upgrades"
	e4 = "- Added QoL for Rebirth III"
	f1 = "v.4.14"
	f2 = "- Added two G buyables"
	f3 = "- Added three Idea upgrades"
	f4 = "- Fixed a bug with Feature challenge completion disply"
	g1 = "v.4.15"
	g2 = "- Added a G buyables and two F buyables"
	g3 = "- Added five Heart upgrades"
	g4 = "- Created four new achievements"
	h1 = "v.4.16"
	h2 = "- Added a G buyable"
	h3 = "- Added a Heart upgrade and two Idea upgrades"
	h4 = "v.4.16.1"
	h5 = "- Fixed a hotkey bug"
	j1 = "v.4.17"
	j2 = "- Added a G buyable"
	j3 = "- Added two Heart upgrades and a Idea upgrade"
	j4 = "- Prepared for J which I need name suggestions for"
	k1 = "v.5"
	k2 = "- Added Jigsaw"
	k3 = "- Added a Jigsaw milestone"
	k4 = "- Fixed bugs with prestige resets"
	l1 = "v.5.1"
	l2 = "- Added three Jigsaw milestones"
	l3 = "- Added a hotkey under 0"
	m1 = "v.5.2"
	m2 = "- Started the Puzzle feature"
	m3 = "- Added a clickable"
	n1 = "v.5.3"
	n2 = "- Implemented lots of the Puzzle feature"
	n3 = "- Implemented filtering"
	n4 = "- Implemented building edges"
	n5 = "- Implemented building centers"
	n6 = "- Implemented finishing"
	n7 = "- Implemented two knowledge based upgrades"
	n8 = "v.5.3.2"
	n9 = "- Fixed a bug with attempt speed"
	o1 = "v.5.4"
	o2 = "- Implemented Success Chance and Attempt Speed"
	o3 = "- Implemented Puzzle reset"
	o4 = "- Created three upgrades that don't do anything yet"
	o5 = "- Created a reasonable details page"
	o6 = "- Now display placing success chance"
	p1 = "v.5.5"
	p2 = "- Added a hotkey for comma and period (left/right subtabs)"
	p3 = "- Added the final G buyable and three H buyables"
	p4 = "- Added an H upgrade and implemented three Puzzle upgrades"
	p5 = "- Added a display for puzzles completed this reset"
	p6 = "- Slight changes to details page [give suggestions for more]"
	p7 = "v.5.5.1"
	p8 = "- Fix a bug with puzzle upgrades"
	q1 = "v.5.6"
	q2 = "- Added an H buyable"
	q3 = "- Added a repeatable puzzle upgrade"
	q4 = "- Added a normal puzzle upgrade"
	q5 = "- Implemented Bulk Amount"
	q6 = "- Added a new row of achievements"
	r1 = "v.5.7"
	r2 = "- Removed 140+ instances of a function being called when its value was already stored"
	r3 = "- Removed 10+ instances of calculating display text without displaying it"
	r4 = "- Added a Shift+[Letter] hotkey to jump to that tab"
	r5 = "- Added a Shift+, and Shift+. to move to the left-most/right-most tab"
	r6 = "- Code cleanup (.pow10(); created generalized functions; various other small things)"
	s1 = "v.5.8"
	s2 = "- Added a 60s cooldown for puzzle resetting"
	s3 = "- Implemented Larger Puzzle" 
	s4 = "- Added a 0 hotkey for puzzle resetting"
	s5 = "- Added Rebirth IV and hotkey (4)"
	s6 = "- Added two puzzle upgrades"
	s7 = "- Removed 40+ instances of calculating things instead of just recalling them"
	s8 = "v.5.8.1"
	s9 = "- Fixed Larger Puzzle cost scaling"
	t1 = "v.5.9"
	t2 = "- Added 3 puzzle upgrades (one repeatable)"
	t3 = "- Added 3 Idea upgrades" 
	t4 = "- Added a H buyable"
	t5 = "- Added a row of achievements"
	t6 = "- Various other small QoL changes, typo fixes, display fixes"
	t7 = "v.5.9.1"
	t8 = "- Fixed a bug that killed the game"
	u1 = "v.5.10"
	u2 = "- Added 2 puzzle upgrades"
	u3 = "- Added an Idea upgrade" 
	u4 = "- Added a H challenge"
	u5 = "- Added a row of achievements"
	v1 = "v.5.11"
	v2 = "- Added a Puzzle upgrade"
	v3 = "- Added an Idea upgrade"
	v4 = "- Added a progress bar for puzzles"
	v5 = "- Added three settings two of which are naive and one which is smart"
	v6 = "- Added an estimated time remaining display on the progress bar"
	v7 = "v.5.11.1"
	v8 = "- Fixed Hi goals"
	v9 = "- Fixed a small error in the progress bar [not taking finding into account]"
	w1 = "v.5.12"
	w2 = "- Made all hotkeys toggleable and fixed their ui"
	w3 = "- Added an Idea upgrade and a Heart upgrade"
	w4 = "- Added a puzzle upgrade"
	w5 = "- Made the progress bar longer (550 -> 650)"
	w6 = "- Added a Jigsaw milestone (it is qol)"
	x1 = "v.5.13"
	x2 = "- Font change!"
	x3 = "- Added a Heart challenge"
	x4 = "- Early game balancing"
	x5 = "- Fixed bug where achievement milestones were being given too early"
	x6 = "v.5.13.2"
	x7 = "- Buff Jigsaw -> Puzzle speed effect"
	x8 = "v.5.13.3"
	x9 = "- Fix progress bar completion formula"
	y1 = "v.5.14"
	y2 = "- Added a row of achievements"
	y3 = "- Added two Heart buyables"
	y4 = "- Added two Heart upgrades and four Idea upgrades"
	y5 = "- Added two Jigsaw upgrades and a Jigsaw milestone"
	y6 = "v.5.14.1"
	y7 = "- Fixed a bug"
	z1 = "v.5.15"
	z2 = "- Added a row of achievements"
	z3 = "- Added a Jigsaw milestone"
	z4 = "- Fixed a bug with shift + [ hotkey"
	z5 = "- Changed the bugged save display"
	aa1= "v.5.16"
	aa2= "- Added a Heart buyable"
	aa3= "- Added 2 Jigsaw and 2 Puzzle upgrades"
	aa4= "- Fixed a bug with resetting puzzle values"
	aa5= "- Added a backup font for those who don't have Optima [TNR]"
	ab1= "v.5.17"
	ab2= "- Added 2 Jigsaw upgrades"
	ab3= "- Changed a Jigsaw upgrade [joint]"
	ab4= "- Some small balance/formula changes"
	ab5= "v.5.17.1"
	ab6= "- Some small balance changes"
	ab7= "- Added details for reset^2"
	ab8= "- Small bugfixes"
	ac1= "v.5.18"
	ac2= "- Added Reset^2"
	ac3= "- Readded Inconsolata if Optima isn't available"
	ad1= "v.5.19"
	ad2= "- Made it possible to do 2 Reset^2's"
	ad3= "- Added 3 Jigsaw upgrades"
	ae1= "v.6"
	ae2= "- Added Keys"
	ae3= "- Added two key milestones"
	af1= "v.6.1"
	af2= "- Buffed Know and Key"
	af3= "- Fixed reset puzzle hotkey"
	af4= "- Buffed the first reset^2, and added some QoL that I forgot"
	af5= "- Added shift to see bulk amount"
	af6= "- Small balance changes regarding Keys"
	ag1= "v.6.2"
	ag2= "- Made the achievement handeling code a function [cut 1500 lines of code]"
	ag3= "- Added a row of achievement"
	ag4= "- Added a Heart buyable and Heart Challenge"
	ag5= "- Added 2 Key milestones"
	ag6= "- Small balance changes regarding Keys"
	ah1= "v.6.3"
	ah2= "- Added 4 Idea upgrades"
	ah3= "- Added 3 Key milestones"
	ah4= "- Added passive Key gain"
	ah5= "- Added more QoL regarding puzzles"
	ah6= "- Due to inaccuracies and irrelavence removed 'Best!' display of puzzle upgrades"
	ah7= "v.6.3.1"
	ah8= "- Fixed a bug when disping efficiency when you have less than 1e6 Attempt Speed levels"
	ai1= "v.6.4"
	ai2= "- Added 2 Jigsaw upgrades"
	ai3= "- Added a Key milestones"
	ai4= "- Added an achievement row"
	ai5= "- Fixed first resource of a layer display bug"
	aj1= "v.6.5"
	aj2= "- Made the puzzle placing more streamlined [i.e. runs faster]"
	aj3= "- Added 3 Jigsaw upgrades"
	aj4= "- Game should now run signficantly faster on older devices"
	aj5= "- Fixed hotkey display and added number of unlocked hotkeys display"
	ak1= "v.6.6"
	ak2= "- Added an achievement row"
	ak3= "- Added 3 Key upgrades"
	ak4= "- Added a Key milestone"
	ak5= "- Fixed a bug with which mode you were on"
	ak6= "- Fixed a bug with the third row of jigsaw upgrades displaying too early"
	ak7= "- Fixed Jay display (all but 3 => all but 5)"
	ak8= "v.6.6.1"
	ak9= "- Fixed+cleaned up info page"
	ak10="- Fixed a bug when doing 0 attempts"
	al1= "v.6.7"
	al2= "- Added four Key upgrades"
	al3= "- Added a Key milestone"
	am1= "v.6.8"
	am2= "- Added 2 Jigsaw upgrades, and one Idea buyable"
	am3= "- Added a Heart challenge"
	am4= "- MASSIVE code optimization for layers being unlocked [160ms/t -> .3ms/t]"
	am5= "v.6.8.1"
	am6= "- Fixed a bug with above e300 knowledge"
	an1= "v.6.9"
	an2= "- Added a Idea buyable"
	an3= "- Added two Jigsaw upgrades"
	an4= "- Added two achievement rows [26 and 27]"
	an5= "- Possible fixed a bug with scrolling?"
	an6= "- Made Success Chance and Attempt Speed bulk buying fast for larger numbers"
	ao1= "v.6.10"
	ao2= "- Added an Idea buyable"
	ao3= "- Added a Jigsaw upgrades"
	ao4= "- Added a Puzzle upgrade"
	ao5= "- Added a Key milestone"
	ap1= "v.6.11"
	ap2= "- Started locks"
	aq1= "v.6.12"
	aq2= "- Continued locks"
	ar1= "v.6.13"
	ar2= "- Continued locks"
	ar3= "- Fixed a bug with how bulk success chance was calculated [speed from 50ms to 3ms at endgame]"
	ar4= "- Fixes some issues with Success Chance being unpurchaseable at low levels of knowldege"
	ar5= "- Game still running at 70ms on my computer, ideal is <50ms"
	ar6= "- Added an undulating color feature [added a way to disable it in info]"
	ar7= "- Applied an undulating color feature to Locks [nothing before yet, or probably ever]"
	ar8= "- Added a Save hotkey [control + s]"
	ar9= "- Added two locks"
	as1= "v.6.14"
	as2= "- Added two Puzzle upgrades"
	as3= "- Added a Key milestone"
	as4= "- Added a save button in the info tab"
	as5= "- Added three locks"
	as6= "- Removed the ctrl display for Locks"
	as7= "- Now the game notifies you when you can buy a puzzle upgrade/repeatable"
	at1= "v.6.15"
	at2= "- Added an Idea buyable"
	at3= "- Added four locks"
	at4= "- Added a puzzle upgrade"
	at5= "- Balancing, next up is Osmium effect and Osmium Lock"
	au1= "v.6.16"
	au2= "- Added three rows of achievements"
	au3= "- Added a lock"
	au4= "- Added two Key upgrades"
	av1= "v.7"
	av2= "- Added Lemons"
	av3= "- Added 9 Lemon milestones"
	av4= "- Added an Idea buyable"
	av5= "- Added a Key milestone"
	av6= "- Added a Key upgrade"
	av7= "- Made the game run slightly faster"
	aw1= "v.7.1"
	aw2= "- Added an Idea buyable"
	aw3= "- Added a Key milestone"
	aw4= "- Unlock a Lock and a Lemon milestone"
	ax1= "v.7.2"
	ax2= "- Added a Lock"
	ax3= "- Added three Lemon upgrades"
	ax4= "- Renamed totalKeys to totalLocks, as the function returns the number of locks, not keys"
	ay1= "v.7.3"
	ay2= "- Added a Lock"
	ay3= "- Added a Key upgrade"
	az1= "v.7.4"
	az2= "- Added 3 Jigsaw upgrades"
	az3= "- Added a Key upgrade"
	az4= "- Put a hardcap for rebirths at 200,000"
	az5= "- Added an achievement row [31st]"
	az6= "- Small rephrasing for challenges due to them not being reset by default, but are reset initially upon medal reset"
	bb1= "v.7.5"
	bb2= "- Added two Jigsaw upgrades"
	bb3= "- Added a Lock"
	bb4= "- Fixed a bug with total locks not counting the third row (this should be a good 10x buff at endgame)"
	bb5= "- Small code cleanups"
	bc1= "v.7.6"
	bc2= "- Added two Key upgrades"
	bd1= "v.7.7"
	bd2= "- Added the final lock"
	bd3= "- Added 2 Lemon upgrades"
	be1= "v.7.8"
	be2= "- Added 2 Lemon upgrades"
	be3= "- Added 3 Jigsaw buyables"
	be4= "- Added an Idea buyable"
	be5= "- Added two rows of achievements"
	bf1= "v.7.9"
	bf2= "- Added a Lemon upgrades"
	bf3= "- Added an Idea buyables"
	bf4= "- Added a Jigsaw buyable"
	bf5= "- Added three Key upgrades"
	bf6= "- Added Keys, and the first two keys"
	bg1= "v.7.10"
	bg2= "- Added two Keys"
	bg3= "- Added a puzzle repeatable"
	bh1= "v.7.11"
	bh2= "- Added an achievement row"
	bh3= "- Added a puzzle repeatable"
	bi1= "v.7.12"
	bi2= "- Added a Key"
	bi3= "- Added a puzzle repeatable"
	bj1= "v.7.13"
	bj2= "- Added a Key"
	bj3= "- Added a puzzle repeatable"
	bj4= "- Added a Key upgrade"
	bk1= "v.7.14"
	bk2= "- Added a Jigsaw buyable"
	bk3= "- Added three keys"
	bk4= "- Fixed a bug which gave you progress upon reload"
	bk5= "- Added a Key upgrade"
	bk6= "- Made bulk Larger Puzzle"
	bl1= "v.7.15"
	bl2= "- Added a puzzle upgrade"
	bl3= "- Added a key"
	bl4= "- Added a challenge"
	bl5= "- Improved Puzzle QoL later on"
	bm1= "v.7.16"
	bm2= "- Added a lemon milestone "
	bm3= "- Added a key"
	bm4= "- Added three achievement rows"
	bm5= "- Notification is not shown in Keys if the mines/locks/keys are being autobought"
	bn1= "v.7.17"
	bn2= "- Added a Key Challenge"
	bn3= "- Added a Lemon upgrade"
	bo1= "v.8"
	bo2= "- Added Maps"
	bo3= "- Added a Jigsaw buyable"
	bo4= "- Added 3 Map milestones"
	bp1= "v.8.1"
	bp2= "- Added a Key"
	bp3= "- Added 3 Map upgrades"
	bp4= "- Added 2 Map milestones"
	bq1= "v.8.2"
	bq2= "- Added a achievement row"
	bq3= "- Added a Map upgrade"
	br1= "v.8.3"
	br2= "- Added a Map upgrade"
	br3= "- Fixed a bug with time displays; I used +[thing] instead of .plus([thing])"
	br4= "- Fixed formatting when number is small <10^-9"
	br5= "- Added a way to hide achievement rows to reduce scrolling (kept upon reload)"
	br6= "- Fixed J notification when automation is unlocked"


	let part1 = [a1, a2, a3, a4, a5, a6, ""]
	let part2 = [b1, b2, b3, b4, b5, "", b6, b7, "", b8, b9, b10, "", b11, b12, ""]
	let part3 = [c1, c2, c3, c4, c5, ""]
	let part4 = [d1, d2, d3, d4, d5, d6, d7, ""]
	let part5 = [e1, e2, e3, e4, ""]
	let part6 = [f1, f2, f3, f4, ""]
	let part7 = [g1, g2, g3, g4, ""]
	let part8 = [h1, h2, h3, "", h4, h5, ""]
	let part9 = [j1, j2, j3, j4, ""] //SKIPPED I lmaooo
	let part10= [k1, k2, k3, ""]
	let part11= [l1, l2, l3, ""]
	let part12= [m1, m2, m3, ""]
	let part13= [n1, n2, n3, n4, n5, n6, n7, "", n8, n9, ""]
	let part14= [o1, o2, o3, o4, o5, o6, ""]
	let part15= [p1, p2, p3, p4, p5, p6, "", p7, p8, ""]
	let part16= [q1, q2, q3, q4, q5, q6, ""]
	let part17= [r1, r2, r3, r4, r5, r6, ""]
	let part18= [s1, s2, s3, s4, s5, s6, s7, "", s8, s9, ""]
	let part19= [t1, t2, t3, t4, t5, t6, "", t7, t8, ""]
	let part20= [u1, u2, u3, u4, u5, ""]
	let part21= [v1, v2, v3, v4, v5, v6, "", v7, v8, v9, ""]
	let part22= [w1, w2, w3, w4, w5, w6, ""]
	let part23= [x1, x2, x3, x4, x5, "", x6, x7, "", x8, x9, ""]
	let part24= [y1, y2, y3, y4, y5, "", y6, y7, ""]
	let part25= [z1, z2, z3, z4, z5, ""]
	let part26= [aa1,aa2,aa3,aa4,aa5, ""]
	let part27= [ab1,ab2,ab3,ab4, "",ab5,ab6,ab7,ab8, ""]
	let part28= [ac1,ac2,ac3, ""]
	let part29= [ad1,ad2,ad3, ""]
	let part30= [ae1,ae2,ae3, ""]
	let part31= [af1,af2,af3,af4,af5,af6, ""]
	let part32= [ag1,ag2,ag3,ag4,ag5,ag6, ""]
	let part33= [ah1,ah2,ah3,ah4,ah5,ah6, "",ah7,ah8, ""]
	let part34= [ai1,ai2,ai3,ai4,ai5, ""]
	let part35= [aj1,aj2,aj3,aj4,aj5, ""]
	let part36= [ak1,ak2,ak3,ak4,ak5,ak6,ak7, "",ak8,ak9,ak10, ""]
	let part37= [al1,al2,al3, ""]
	let part38= [am1,am2,am3,am4, "",am5,am6,""]
	let part39= [an1,an2,an3,an4,an5,an6, ""]
	let part40= [ao1,ao2,ao3,ao4,ao5, ""]
	let part41= [ap1,ap2, ""]
	let part42= [aq1,aq2, ""]
	let part43= [ar1,ar2,ar3,ar4,ar5,ar6,ar7,ar8,ar9, ""]
	let part44= [as1,as2,as3,as4,as5,as6,as7, ""]
	let part45= [at1,at2,at3,at4,at5, ""]
	let part46= [au1,au2,au3,au4, ""]
	let part47= [av1,av2,av3,av4,av5,av6,av7, ""]
	let part48= [aw1,aw2,aw3,aw4, ""]
	let part49= [ax1,ax2,ax3,ax4, ""]
	let part50= [ay1,ay2,ay3, ""]
	let part51= [az1,az2,az3,az4,az5,az6, ""]
	let part52= [bb1,bb2,bb3,bb4,bb5, ""]
	let part53= [bc1,bc2, ""]
	let part54= [bd1,bd2,bd3, ""]
	let part55= [be1,be2,be3,be4,be5, ""]
	let part56= [bf1,bf2,bf3,bf4,bf5,bf6, ""]
	let part57= [bg1,bg2,bg3, ""]
	let part58= [bh1,bh2,bh3, ""]
	let part59= [bi1,bi2,bi3, ""]
	let part60= [bj1,bj2,bj3,bj4, ""]
	let part61= [bk1,bk2,bk3,bk4,bk5,bk6, ""]
	let part62= [bl1,bl2,bl3,bl4,bl5, ""]
	let part63= [bm1,bm2,bm3,bm4,bm5, ""]
	let part64= [bo1,bo2,bo3,bo4, ""]
	let part65= [bp1,bp2,bp3,bp4, ""]
	let part66= [bq1,bq2,bq3, ""]
	let part67= [br1,br2,br3,br4,br5,br6, ""]
	// MAKE SURE TO ADD THEM

	let final1 = [part10,  part9,  part8,  part7,  part6,  part5,  part4,  part3,  part2,  part1]
	let final2 = [part20, part19, part18, part17, part16, part15, part14, part13, part12, part11]
	let final3 = [part30, part29, part28, part27, part26, part25, part24, part23, part22, part21]
	let final4 = [part40, part39, part38, part37, part36, part35, part34, part33, part32, part31]
	let final5 = [part50, part49, part48, part47, part46, part45, part44, part43, part42, part41]
	let final6 = [part60, part59, part58, part57, part56, part55, part54, part53, part52, part51]
	let final7 = [part67, part66, part65, part64, part63, part62, part61]

	return final7.concat(final6).concat(final5).concat(final4).concat(final3).concat(final2).concat(final1)
}

var controlDown = false
var shiftDown = false

window.addEventListener('keydown', function(event) {
	if (event.keyCode == 16) shiftDown = true;
	if (event.keyCode == 17) controlDown = true;
}, false);

window.addEventListener('keyup', function(event) {
	if (event.keyCode == 16) shiftDown = false;
	if (event.keyCode == 17) controlDown = false;
}, false);

