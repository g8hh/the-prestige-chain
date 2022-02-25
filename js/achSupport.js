function getColRowCode(det, base = 7){
        let tens = Math.floor((det-1)/base) + 1
        let extra = det % base == 0 ? base : det % base
        return 10 * tens + extra
}

function getNumberName(n){ //currently only works up to 100
        if (n < 100) return getNumberNameLT100(n)
        if (n < 1000) {
                if (n % 100 == 0) return getNumberNameLT100(n / 100) + " Hundred"
                let hun = getNumberName(Math.floor(n / 100)) + " Hundred and "
                return hun + getNumberNameLT100(n % 100)
        }
}

function getNumberNameLT100(n){
        let units = {
                1: "One",
                2: "Two",
                3: "Three",
                4: "Four",
                5: "Five",
                6: "Six",
                7: "Seven",
                8: "Eight",
                9: "Nine",
        }
        let tens = {
                2: "Twenty",
                3: "Thirty",
                4: "Forty",
                5: "Fifty",
                6: "Sixty",
                7: "Seventy",
                8: "Eighty",
                9: "Ninety",
        }
        let forced = {
                10: "Ten",
                11: "Eleven",
                12: "Twelve",
                13: "Thirteen",
                14: "Fourteen",
                15: "Fifteen",
                16: "Sixteen",
                17: "Seventeen",
                18: "Eighteen", 
                19: "Nineteen",
        }
        if (forced[n] != undefined) return forced[n]
        if (n == 0) return "Zero"
        if (n % 10 == 0) return tens[n/10]
        if (n < 10) return units[n]
        return tens[Math.floor(n/10)] + "-" + units[n % 10].toLowerCase()
}

function getAchStuffFromNumber(n){
        let name = getNumberName(n)
        let done = function(){
                return hasAchievement("ach", getColRowCode(n)) || PROGRESSION_MILESTONES[n]() 
        }
        let tooltip = function(){
                return "Get " + PROGRESSION_MILESTONES_TEXT[n]
        }
        let unlocked 
        if (n <= 53) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return true
                }
        } else if (n <= 98) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                }
        } else if (n <= 119) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("g")
                }
        } else if (n <= 154) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("i")
                }
        } else if (n <= 266) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("j")
                }
        } else if (n <= 280) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("k")
                }
        } else if (n <= 336) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("l")
                }
        } else if (n <= Infinity) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUpgrade("m", 23) || hasUnlockedPast("m")
                }
        } 
        return {name: name, done: done, tooltip: tooltip, unlocked: unlocked}
}

function getFirstNAchData(n){
        let obj = {}
        for (i = 1; i <= n; i++){
                obj[getColRowCode(i)] = getAchStuffFromNumber(i)
        }
        obj.rows = Math.ceil(n / 7)
        obj.cols = 7
        return obj
}

function hasCompletedFirstNRows(n){
	for (i = 1; i <= n; i++){
		for (j = 1; j <= 7; j++){
			x = String(i) + String(j)
			if (layers.ach.achievements[x] == undefined) return false
			if (!hasAchievement("ach", x)) return false
		}
	}
	return true
}


PROGRESSION_MILESTONES = {
	1:   () => player.a.upgrades.length >= 1,
	2:   () => player.a.upgrades.length >= 3,
	3:   () => player.a.upgrades.length >= 6,
	4:   () => getBuyableAmount("a", 12).gte(2),
	5:   () => player.a.points.gte(1e6),
	6:   () => player.b.upgrades.length >= 1,
	7:   () => player.a.upgrades.length >= 13,
	8:   () => player.b.upgrades.length >= 6,
	9:   () => player.a.upgrades.length >= 16,
	10:  () => player.b.points.gt(5e10),
	11:  () => player.c.points.gte(3),
	12:  () => player.c.upgrades.length >= 3,
	13:  () => getBuyableAmount("a", 31).gte(4),
	14:  () => player.b.upgrades.length >= 12,
	15:  () => player.b.upgrades.length >= 14,
	16:  () => player.c.upgrades.length >= 4,
	17:  () => challengeCompletions("b", 11) >= 1,
	18:  () => player.b.upgrades.length >= 19,
	19:  () => player.c.upgrades.length >= 7,
	20:  () => challengeCompletions("b", 12) >= 1,
	21:  () => player.c.points.gte(5e10),
	22:  () => player.d.points.gte(5),
	23:  () => player.b.upgrades.length >= 22,
	24:  () => getBuyableAmount("b", 21).gte(2),
	25:  () => player.d.upgrades.length >= 4,
	26:  () => totalChallengeComps("b") >= 8,
	27:  () => totalChallengeComps("b") >= 11,
	28:  () => getBuyableAmount("b", 23).gte(2),
	29:  () => layers.d.getResetGain().gte(25500),
	30:  () => getBuyableAmount("c", 11).gte(5),
	31:  () => getBuyableAmount("b", 31).gte(1),
	32:  () => player.c.upgrades.length >= 18,
	33:  () => totalChallengeComps("c") >= 1,
	34:  () => player.c.upgrades.length >= 20,
	35:  () => totalChallengeComps("c") >= 2,
	36:  () => player.e.points.gte(2),
	37:  () => player.e.points.gte(200),
	38:  () => totalChallengeComps("c") >= 3,
	39:  () => totalChallengeComps("c") >= 5,
	40:  () => totalChallengeComps("b") >= 56,
	41:  () => totalChallengeComps("b") >= 61,
	42:  () => player.e.upgrades.length >= 2,
	43:  () => totalChallengeComps("c") >= 9,
	44:  () => totalChallengeComps("c") >= 13,
	45:  () => totalChallengeComps("c") >= 14,
	46:  () => getBuyableAmount("d", 11).gte(14),
	47:  () => getBuyableAmount("d", 13).gte(6),
	48:  () => totalChallengeComps("c") >= 15,
	49:  () => totalChallengeComps("c") >= 17,
	50:  () => totalChallengeComps("c") >= 19,
	51:  () => totalChallengeComps("c") >= 22,
	52:  () => totalChallengeComps("c") >= 34,
	53:  () => player.f.times >= 1,
	54:  () => player.goalsii.tokens.best["01"].gte(1),
	55:  () => player.goalsii.tokens.best["02"].gte(1),
	56:  () => player.goalsii.tokens.best["10"].gte(1),
	57:  () => player.goalsii.tokens.best["11"].gte(1),
	58:  () => player.goalsii.tokens.best["12"].gte(1),
	59:  () => player.goalsii.tokens.best["20"].gte(1),
	60:  () => player.goalsii.tokens.best["21"].gte(1),
	61:  () => player.goalsii.tokens.best["22"].gte(1),
	62:  () => player.goalsii.tokens.best["03"].gte(1),
	63:  () => player.goalsii.tokens.best["13"].gte(1),
	64:  () => player.goalsii.tokens.best["23"].gte(1),
	65:  () => player.goalsii.tokens.best["30"].gte(1),
	66:  () => player.goalsii.tokens.best["31"].gte(1),
	67:  () => player.goalsii.tokens.best["32"].gte(1),
	68:  () => player.goalsii.tokens.best["33"].gte(1),
	69:  () => getBuyableAmount("b", 11).gte(1e20),
	70:  () => getBuyableAmount("b", 12).gte(1e20),
	71:  () => player.goalsii.tokens.best["04"].gte(1),
	72:  () => player.goalsii.tokens.best["14"].gte(1),
	73:  () => player.goalsii.tokens.best["24"].gte(1),
	74:  () => player.goalsii.tokens.best["34"].gte(1),
	75:  () => player.goalsii.tokens.best["40"].gte(1),
	76:  () => player.goalsii.tokens.best["41"].gte(1),
	77:  () => player.goalsii.tokens.best["42"].gte(1),
	78:  () => player.goalsii.tokens.best["43"].gte(1),
	79:  () => player.goalsii.tokens.best["44"].gte(1),
	80:  () => player.f.best.gte(1e58),
	81:  () => player.g.best.gte(2),
	82:  () => player.g.best.gte(20),
	83:  () => player.g.clickableAmounts[11].gte(2),
	84:  () => player.g.clickableAmounts[21].gte(4),
	85:  () => layers.g.clickables.getChargesPerMinute() >= 20,
	86:  () => player.g.partialTally.gte(75),
	87:  () => player.g.completedTally.gte(11),
	88:  () => player.g.completedTally.gte(13),
	89:  () => player.g.completedTally.gte(16),
	90:  () => player.g.completedTally.gte(50),
	91:  () => player.g.completedTally.gte(100),
	92:  () => player.g.completedTally.gte(400),
	93:  () => player.g.completedTally.gte(450),
	94:  () => player.g.completedTally.gte(500),
	95:  () => player.g.completedTally.gte(550),
	96:  () => player.g.completedTally.gte(600),
	97:  () => player.g.completedTally.gte(650),
	98:  () => player.g.completedTally.gte(700),
	99:  () => player.h.points.gte(3),
	100: ()=> player.h.points.gte(30),
	101: ()=> challengeCompletions("f", 11) >= 1,
	102: ()=> totalChallengeComps("f") >= 3,
	103: ()=> totalChallengeComps("f") >= 6,
	104: ()=> totalChallengeComps("f") >= 10,
	105: ()=> totalChallengeComps("f") >= 15,
	106: ()=> totalChallengeComps("f") >= 21,
	107: ()=> totalChallengeComps("f") >= 28,
	108: ()=> player.i.best.gte(1),
	109: ()=> player.i.best.gte(10),
	110: ()=> player.i.best.gte(100),
	111: ()=> totalChallengeComps("f") >= 36,
	112: ()=> totalChallengeComps("f") >= 45,
	113: ()=> totalChallengeComps("f") >= 55,
	114: ()=> totalChallengeComps("f") >= 66,
	115: ()=> totalChallengeComps("f") >= 78,
	116: ()=> totalChallengeComps("f") >= 91,
	117: ()=> totalChallengeComps("f") >= 105,
	118: ()=> totalChallengeComps("f") >= 120,
	119: ()=> totalChallengeComps("f") >= 136,
	120: ()=> player.j.puzzle.bestExp.gte(1),
	121: ()=> player.j.puzzle.bestExp.gte(3),
	122: ()=> player.j.puzzle.bestExp.gte(9),
	123: ()=> player.j.puzzle.bestExp.gte(27),
	124: ()=> player.j.puzzle.bestExp.gte(81),
	125: ()=> player.j.puzzle.bestExp.gte(243),
	126: ()=> player.j.puzzle.bestExp.gte(729),
	127: ()=> player.j.puzzle.finished >= 7,
	128: ()=> player.j.puzzle.finished >= 9,
	129: ()=> player.j.puzzle.finished >= 11,
	130: ()=> player.j.puzzle.finished >= 13,
	131: ()=> player.j.puzzle.finished >= 15,
	132: ()=> player.j.puzzle.finished >= 17,
	133: ()=> player.j.puzzle.finished >= 19,
	134: ()=> totalChallengeComps("f") >= 153,
	135: ()=> totalChallengeComps("f") >= 171,
	136: ()=> totalChallengeComps("f") >= 190,
	137: ()=> totalChallengeComps("f") >= 210,
	138: ()=> totalChallengeComps("h") >= 1,
	139: ()=> totalChallengeComps("h") >= 3,
	140: ()=> totalChallengeComps("h") >= 6,
	141: ()=> player.j.puzzle.finished >= 21,
	142: ()=> player.j.puzzle.finished >= 23,
	143: ()=> player.j.puzzle.finished >= 25,
	144: ()=> player.j.puzzle.finished >= 27,
	145: ()=> player.j.puzzle.finished >= 29,
	146: ()=> player.j.puzzle.finished >= 31,
	147: ()=> player.j.puzzle.finished >= 33,
	148: ()=> totalChallengeComps("h") >= 10,
	149: ()=> totalChallengeComps("h") >= 15,
	150: ()=> totalChallengeComps("h") >= 21,
	151: ()=> totalChallengeComps("h") >= 28,
	152: ()=> totalChallengeComps("h") >= 36,
	153: ()=> totalChallengeComps("h") >= 45,
	154: ()=> totalChallengeComps("h") >= 55,
	155: ()=> player.j.puzzle.finished >= 50,
	156: ()=> player.j.puzzle.finished >= 55,
	157: ()=> player.j.puzzle.finished >= 60,
	158: ()=> player.j.puzzle.finished >= 65,
	159: ()=> player.j.puzzle.finished >= 70,
	160: ()=> player.j.puzzle.finished >= 75,
	161: ()=> player.j.puzzle.finished >= 80,
	162: ()=> player.j.puzzle.finished >= 85,
	163: ()=> player.j.puzzle.finished >= 90,
	164: ()=> player.j.puzzle.finished >= 95,
	165: ()=> player.j.puzzle.finished >= 100,
	166: ()=> player.j.puzzle.finished >= 105,
	167: ()=> player.j.puzzle.finished >= 110,
	168: ()=> player.j.puzzle.finished >= 115,
	169: ()=> player.j.puzzle.finished >= 120,
	170: ()=> player.j.puzzle.finished >= 130,
	171: ()=> player.j.puzzle.finished >= 140,
	172: ()=> player.j.puzzle.finished >= 150,
	173: ()=> player.j.puzzle.finished >= 160,
	174: ()=> player.j.puzzle.finished >= 170,
	175: ()=> player.j.puzzle.finished >= 180,
	176: ()=> totalChallengeComps("h") >= 66,
	177: ()=> totalChallengeComps("h") >= 78,
	178: ()=> totalChallengeComps("h") >= 91,
	179: ()=> totalChallengeComps("h") >= 105,
	180: ()=> totalChallengeComps("h") >= 120,
	181: ()=> totalChallengeComps("h") >= 136,
	182: ()=> totalChallengeComps("h") >= 153,
	183: ()=> player.j.puzzle.finished >= 250,
	184: ()=> player.j.puzzle.finished >= 260,
	185: ()=> player.j.puzzle.finished >= 270,
	186: ()=> player.j.puzzle.finished >= 280,
	187: ()=> player.j.puzzle.finished >= 290,
	188: ()=> player.j.puzzle.finished >= 300,
	189: ()=> player.j.puzzle.finished >= 310,
	190: ()=> player.j.puzzle.finished >= 400,
	191: ()=> player.j.puzzle.finished >= 500,
	192: ()=> player.j.puzzle.finished >= 700,
	193: ()=> player.j.puzzle.finished >= 1000,
	194: ()=> player.k.lock.resources[11].gt(0),
	195: ()=> player.k.lock.resources[12].gt(0),
	196: ()=> player.k.lock.resources[13].gt(0),
	197: ()=> player.k.lock.resources[14].gt(0),
	198: ()=> player.k.lock.resources[15].gt(0),
	199: ()=> player.k.lock.resources[21].gt(0),
	200: ()=> player.k.lock.resources[22].gt(0),
	201: ()=> player.k.lock.resources[23].gt(0),
	202: ()=> player.k.lock.resources[24].gt(0),
	203: ()=> player.k.lock.resources[25].gt(0),
	204: ()=> player.j.puzzle.finished >= 1500,
	205: ()=> player.j.puzzle.finished >= 2000,
	206: ()=> player.j.puzzle.finished >= 2500,
	207: ()=> player.j.puzzle.finished >= 3000,
	208: ()=> player.j.puzzle.finished >= 3500,
	209: ()=> player.j.puzzle.finished >= 4000,
	210: ()=> player.j.puzzle.finished >= 4500,
	211: ()=> player.k.lock.repeatables[51].gte(1),
	212: ()=> player.k.lock.repeatables[52].gte(1),
	213: ()=> player.k.lock.repeatables[53].gte(1),
	214: ()=> player.k.lock.repeatables[53].gte(3),
	215: ()=> player.k.lock.repeatables[53].gte(6),
	216: ()=> player.k.lock.repeatables[54].gte(1),
	217: ()=> player.k.lock.repeatables[55].gte(1),
	218: ()=> player.k.lock.repeatables[55].gte(3),
	219: ()=> player.k.lock.repeatables[55].gte(6),
	220: ()=> player.k.lock.repeatables[55].gte(10),
	221: ()=> player.k.lock.repeatables[55].gte(15),
	222: ()=> player.k.lock.repeatables[55].gte(21),
	223: ()=> player.k.lock.repeatables[55].gte(28),
	224: ()=> player.k.lock.repeatables[55].gte(36),
	225: ()=> player.j.puzzle.finished >= 5000,
	226: ()=> player.j.puzzle.finished >= 6000,
	227: ()=> player.j.puzzle.finished >= 7000,
	228: ()=> player.j.puzzle.finished >= 8000,
	229: ()=> player.j.puzzle.finished >= 9000,
	230: ()=> player.j.puzzle.finished >= 10e3,
	231: ()=> totalChallengeComps("h") >= 171,
	232: ()=> player.j.puzzle.finished >= 11e3,
	233: ()=> player.j.puzzle.finished >= 12e3,
	234: ()=> player.j.puzzle.finished >= 13e3,
	235: ()=> player.j.puzzle.finished >= 14e3,
	236: ()=> player.j.puzzle.finished >= 15e3,
	237: ()=> player.j.puzzle.finished >= 16e3,
	238: ()=> totalChallengeComps("h") >= 190,
	239: ()=> player.k.lock.repeatables[55].gte(45),
	240: ()=> player.k.lock.repeatables[55].gte(55),
	241: ()=> player.k.lock.repeatables[55].gte(66),
	242: ()=> player.k.lock.repeatables[55].gte(78),
	243: ()=> player.k.lock.repeatables[55].gte(91),
	244: ()=> player.k.lock.repeatables[55].gte(105),
	245: ()=> totalChallengeComps("h") >= 210,
	246: ()=> player.j.puzzle.finished >= 17e3,
	247: ()=> player.j.puzzle.finished >= 18e3,
	248: ()=> player.j.puzzle.finished >= 19e3,
	249: ()=> player.j.puzzle.finished >= 20e3,
	250: ()=> player.j.puzzle.finished >= 21e3,
	251: ()=> player.j.puzzle.finished >= 22e3,
	252: ()=> totalChallengeComps("h") >= 231,
	253: ()=> player.j.puzzle.finished >= 23e3,
	254: ()=> player.j.puzzle.finished >= 24e3,
	255: ()=> player.j.puzzle.finished >= 25e3,
	256: ()=> player.j.puzzle.finished >= 26e3,
	257: ()=> player.j.puzzle.finished >= 27e3,
	258: ()=> player.j.puzzle.finished >= 28e3,
	259: ()=> totalChallengeComps("h") >= 253,
	260: ()=> player.j.puzzle.finished >= 29e3,
	261: ()=> player.j.puzzle.finished >= 30e3,
	262: ()=> player.j.puzzle.finished >= 31e3,
	263: ()=> player.j.puzzle.finished >= 32e3,
	264: ()=> player.j.puzzle.finished >= 33e3,
	265: ()=> player.j.puzzle.finished >= 34e3,
	266: ()=> totalChallengeComps("h") >= 276,
	267: ()=> totalChallengeComps("k") >= 1,
	268: ()=> totalChallengeComps("k") >= 3,
	269: ()=> totalChallengeComps("k") >= 6,
	270: ()=> totalChallengeComps("k") >= 10,
	271: ()=> totalChallengeComps("k") >= 15,
	272: ()=> totalChallengeComps("k") >= 21,
	273: ()=> totalChallengeComps("h") >= 300,
	274: ()=> totalChallengeComps("k") >= 28,
	275: ()=> totalChallengeComps("k") >= 36,
	276: ()=> totalChallengeComps("k") >= 45,
	277: ()=> totalChallengeComps("k") >= 55,
	278: ()=> totalChallengeComps("k") >= 66,
	279: ()=> totalChallengeComps("k") >= 78,
	280: ()=> totalChallengeComps("h") >= 325,
	281: ()=> player.k.lock.repeatables[82].gte(15),
	282: ()=> totalChallengeComps("h") >= 351,
	283: ()=> player.k.lock.repeatables[82].gte(21),
	284: ()=> totalChallengeComps("h") >= 378,
	285: ()=> player.k.lock.repeatables[82].gte(28),
	286: ()=> totalChallengeComps("h") >= 406,
	287: ()=> player.k.lock.repeatables[82].gte(36),
	288: ()=> totalChallengeComps("h") >= 435,
	289: ()=> player.k.lock.repeatables[82].gte(45),
	290: ()=> totalChallengeComps("h") >= 465,
	291: ()=> player.k.lock.repeatables[82].gte(55),
	292: ()=> totalChallengeComps("h") >= 496,
	293: ()=> player.k.lock.repeatables[82].gte(66),
	294: ()=> totalChallengeComps("h") >= 528,
	295: ()=> totalChallengeComps("h") >= 561,
	296: ()=> totalChallengeComps("h") >= 595,
	297: ()=> totalChallengeComps("h") >= 630,
	298: ()=> totalChallengeComps("h") >= 666,
	299: ()=> totalChallengeComps("h") >= 703,
	300: ()=> totalChallengeComps("h") >= 741,
	301: ()=> totalChallengeComps("h") >= 780,
	302: ()=> totalChallengeComps("h") >= 820,
	303: ()=> totalChallengeComps("h") >= 861,
	304: ()=> totalChallengeComps("h") >= 903,
	305: ()=> totalChallengeComps("k") >= 091,
	306: ()=> totalChallengeComps("k") >= 105,
	307: ()=> totalChallengeComps("k") >= 120,
	308: ()=> totalChallengeComps("k") >= 136,
	309: ()=> totalChallengeComps("k") >= 153,
	310: ()=> totalChallengeComps("k") >= 171,
	311: ()=> totalChallengeComps("k") >= 190,
	312: ()=> totalChallengeComps("k") >= 210,
	313: ()=> totalChallengeComps("k") >= 231,
	314: ()=> totalChallengeComps("k") >= 253,
	315: ()=> totalChallengeComps("k") >= 276,
	316: ()=> totalChallengeComps("k") >= 300,
	317: ()=> totalChallengeComps("k") >= 325,
	318: ()=> totalChallengeComps("k") >= 351,
	319: ()=> totalChallengeComps("k") >= 378,
	320: ()=> totalChallengeComps("k") >= 406,
	321: ()=> totalChallengeComps("k") >= 435,
	322: ()=> totalChallengeComps("k") >= 465,
	323: ()=> player.k.lock.repeatables[82].gte(78),
	324: ()=> player.k.lock.repeatables[82].gte(91),
	325: ()=> player.k.lock.repeatables[82].gte(105),
	326: ()=> player.k.lock.repeatables[82].gte(120),
	327: ()=> player.k.lock.repeatables[82].gte(136),
	328: ()=> player.k.lock.repeatables[82].gte(153),
	329: ()=> player.k.lock.repeatables[82].gte(171),
	330: ()=> player.m.totalStonesUnlocked >= 1, 
	331: ()=> player.m.totalStonesUnlocked >= 2, 
	332: ()=> player.m.totalStonesUnlocked >= 3, 
	333: ()=> player.m.totalStonesUnlocked >= 4, 
	334: ()=> player.m.totalStonesUnlocked >= 5, 
	335: ()=> player.m.totalStonesUnlocked >= 6, 
	336: ()=> player.m.totalStonesUnlocked >= 7, 
	337: ()=> player.m.totalStonesUnlocked >= 8, 
	338: ()=> player.m.totalStonesUnlocked >= 9, 
	339: ()=> player.m.totalStonesUnlocked >= 10, 
	340: ()=> player.m.totalStonesUnlocked >= 11, 
	341: ()=> player.m.totalStonesUnlocked >= 12, 
	342: ()=> player.m.totalStonesUnlocked >= 13, 
	343: ()=> player.m.totalStonesUnlocked >= 14,
	344: ()=> totalChallengeComps("h") >= 946,
	345: ()=> totalChallengeComps("h") >= 990,
	346: ()=> totalChallengeComps("h") >= 1035,
	347: ()=> player.m.totalStonesUnlocked >= 15, 
	348: ()=> player.m.totalStonesUnlocked >= 16, 
	349: ()=> player.m.totalStonesUnlocked >= 17, 
	350: ()=> player.m.totalStonesUnlocked >= 18, 
	351: ()=> player.m.totalStonesUnlocked >= 19, 
	352: ()=> player.m.totalStonesUnlocked >= 20, 
	353: ()=> player.m.totalStonesUnlocked >= 21, 
	354: ()=> player.m.totalStonesUnlocked >= 22, 
	355: ()=> player.m.totalStonesUnlocked >= 23, 
	356: ()=> player.m.totalStonesUnlocked >= 24, 
	357: ()=> player.m.totalStonesUnlocked >= 25, 
	358: ()=> totalChallengeComps("k") >= 496,
	359: ()=> player.m.totalStonesUnlocked >= 26, 
	360: ()=> player.m.totalStonesUnlocked >= 27, 
	361: ()=> player.m.totalStonesUnlocked >= 28, 
	362: ()=> player.m.totalStonesUnlocked >= 29, 
	363: ()=> player.m.totalStonesUnlocked >= 30, 
	364: ()=> player.m.totalStonesUnlocked >= 31, 
	365: ()=> totalChallengeComps("h") >= 1081,
	366: ()=> player.m.totalStonesUnlocked >= 32, 
	367: ()=> player.m.totalStonesUnlocked >= 33, 
	368: ()=> player.m.totalStonesUnlocked >= 34, 
	369: ()=> player.m.totalStonesUnlocked >= 35, 
	370: ()=> player.m.totalStonesUnlocked >= 36, 
	371: ()=> player.m.totalStonesUnlocked >= 37, 
	372: ()=> totalChallengeComps("k") >= 528,
	373: ()=> totalChallengeComps("k") >= 561,
	374: ()=> totalChallengeComps("h") >= 1128,
	375: ()=> totalChallengeComps("h") >= 1176,
	376: ()=> totalChallengeComps("h") >= 1225,
	377: ()=> totalChallengeComps("h") >= 1275,
	378: ()=> totalChallengeComps("k") >= 595,
	379: ()=> player.m.totalStonesUnlocked >= 38, 
	380: ()=> player.m.totalStonesUnlocked >= 39, 
	381: ()=> player.m.totalStonesUnlocked >= 40, 
	382: ()=> player.m.totalStonesUnlocked >= 41, 
	383: ()=> player.m.totalStonesUnlocked >= 42, 
	384: ()=> player.m.totalStonesUnlocked >= 43, 
	385: ()=> player.m.totalStonesUnlocked >= 44, 
}

PROGRESSION_MILESTONES_TEXT = {
	1:   "1 Amoeba upgrade",
	2:   "3 Amoeba upgrades",
	3:   "6 Amoeba upgrades",
	4:   "2 Any buyables",
	5:   "1e6 Amoebas",
	6:   "1 Bacteria upgrade",
	7:   "13 Amoeba upgrades",
	8:   "6 Bacteria upgrades",
	9:   "16 Amoeba upgrades",
	10:  "5e10 Bacteria",
	11:  "3 Circles",
	12:  "3 Circle upgrades",
	13:  "4 Against levels",
	14:  "12 Bacteria upgrades",
	15:  "14 Bacteria upgrades",
	16:  "4 Circle upgrades",
	17:  "1 Big completion",
	18:  "19 Bacteria upgrades",
	19:  "7 Circle upgrades",
	20:  "1 Body completion",
	21:  "5e10 Circles",
	22:  "5 Doodles",
	23:  "22 Bacteria upgrades",
	24:  "2 Baby buyables",
	25:  "4 Doodle upgrades",
	26:  "8 Bacteria challenge completions",
	27:  "11 Bacteria challenge completions",
	28:  "2 Beauty buyables",
	29:  "25,500 Doodles at once",
	30:  "5 Case buyables",
	31:  "1 Basic buyables",
	32:  "18 Circle upgrades",
	33:  "1 Circle challenge completions",
	34:  "20 Circle upgrades",
	35:  "2 Circle challenge completions",
	36:  "2 Eggs",
	37:  "200 Eggs",
	38:  "3 Circle challenge completions",
	39:  "5 Circle challenge completions",
	40:  "56 Bacteria challenge completions",
	41:  "61 Bacteria challenge completions",
	42:  "2 Egg upgrades",
	43:  "9 Circle challenge completions",
	44:  "13 Circle challenge completions",
	45:  "14 Circle challenge completions",
	46:  "14 Department buyables",
	47:  "6 Delivery buyables",
	48:  "15 Circle challenge completions",
	49:  "17 Circle challenge completions",
	50:  "19 Circle challenge completions",
	51:  "22 Circle challenge completions",
	52:  "34 Circle challenge completions",
	53:  "one Feature",
	54:  "a 01 token",
	55:  "a 02 token",
	56:  "a 10 token",
	57:  "a 11 token",
	58:  "a 12 token",
	59:  "a 20 token",
	60:  "a 21 token",
	61:  "a 22 token",
	62:  "a 03 token",
	63:  "a 13 token",
	64:  "a 23 token",
	65:  "a 30 token",
	66:  "a 31 token",
	67:  "a 32 token",
	68:  "a 33 token",
	69:  "1e20 Because levels",
	70:  "1e20 Based levels",
	71:  "a 04 token",
	72:  "a 14 token",
	73:  "a 24 token",
	74:  "a 34 token",
	75:  "a 40 token",
	76:  "a 41 token",
	77:  "a 42 token",
	78:  "a 43 token",
	79:  "a 44 token",
	80:  "1e58 Features",
	81:  "2 Games",
	82:  "20 Games",
	83:  "two levels of Tetris",
	84:  "Quake to 40%",
	85:  "20 charges per minute",
	86:  "75 completed devs",
	87:  "11 completed games",
	88:  "13 completed games",
	89:  "16 completed games",
	90:  "50 completed games",
	91:  "100 completed games",
	92:  "400 completed games",
	93:  "450 completed games",
	94:  "500 completed games",
	95:  "550 completed games",
	96:  "600 completed games",
	97:  "650 completed games",
	98:  "700 completed games",
	99:  "3 Hearts",
	100: "30 Hearts",
	101: "One Files completion",
	102: "3 Feature challenge completions",
	103: "6 Feature challenge completions",
	104: "10 Feature challenge completions",
	105: "15 Feature challenge completions",
	106: "21 Feature challenge completions",
	107: "28 Feature challenge completions",
	108: "1 Idea",
	109: "10 Ideas",
	110: "100 Ideas",
	111: "36 Feature challenge completions",
	112: "45 Feature challenge completions",
	113: "55 Feature challenge completions",
	114: "66 Feature challenge completions",
	115: "78 Feature challenge completions",
	116: "91 Feature challenge completions",
	117: "105 Feature challenge completions",
	118: "120 Feature challenge completions",
	119: "136 Feature challenge completions",
	120: "1 exp",
	121: "3 exp",
	122: "9 exp",
	123: "27 exp",
	124: "81 exp",
	125: "243 exp",
	126: "729 exp",
	127: "7 puzzle completions at once",
	128: "9 puzzle completions at once",
	129: "11 puzzle completions at once",
	130: "13 puzzle completions at once",
	131: "15 puzzle completions at once",
	132: "17 puzzle completions at once",
	133: "19 puzzle completions at once",
	134: "153 Feature challenge completions",
	135: "171 Feature challenge completions",
	136: "190 Feature challenge completions",
	137: "210 Feature challenge completions",
	138: "1 Heart challenge completion",
	139: "3 Heart challenge completions",
	140: "6 Heart challenge completions",
	141: "21 puzzle completions at once",
	142: "23 puzzle completions at once",
	143: "25 puzzle completions at once",
	144: "27 puzzle completions at once",
	145: "29 puzzle completions at once",
	146: "31 puzzle completions at once",
	147: "33 puzzle completions at once",
	148: "10 Heart challenge completion",
	149: "15 Heart challenge completions",
	150: "21 Heart challenge completions",
	151: "28 Heart challenge completion",
	152: "36 Heart challenge completions",
	153: "45 Heart challenge completions",
	154: "55 Heart challenge completion",
	155: "50 puzzle completions at once",
	156: "55 puzzle completions at once",
	157: "60 puzzle completions at once",
	158: "65 puzzle completions at once",
	159: "70 puzzle completions at once",
	160: "75 puzzle completions at once",
	161: "80 puzzle completions at once",
	162: "85 puzzle completions at once",
	163: "90 puzzle completions at once",
	164: "95 puzzle completions at once",
	165: "100 puzzle completions at once",
	166: "105 puzzle completions at once",
	167: "110 puzzle completions at once",
	168: "115 puzzle completions at once",
	169: "120 puzzle completions at once",
	170: "130 puzzle completions at once",
	171: "140 puzzle completions at once",
	172: "150 puzzle completions at once",
	173: "160 puzzle completions at once",
	174: "170 puzzle completions at once",
	175: "180 puzzle completions at once",
	176: "66 Heart challenge completion",
	177: "78 Heart challenge completions",
	178: "91 Heart challenge completions",
	179: "105 Heart challenge completion",
	180: "120 Heart challenge completions",
	181: "136 Heart challenge completions",
	182: "153 Heart challenge completion",
	183: "250 puzzle completions at once",
	184: "260 puzzle completions at once",
	185: "270 puzzle completions at once",
	186: "280 puzzle completions at once",
	187: "290 puzzle completions at once",
	188: "300 puzzle completions at once",
	189: "310 puzzle completions at once",
	190: "400 puzzle completions at once",
	191: "500 puzzle completions at once",
	192: "700 puzzle completions at once",
	193: "1000 puzzle completions at once",
	194: "one Iron",
	195: "one Silver",
	196: "one Gold",
	197: "one Coal",
	198: "one Copper",
	199: "one Tin",
	200: "one Titanium",
	201: "one Tungsten",
	202: "one Aluminum",
	203: "one Osmium",
	204: "1500 puzzle completions at once",
	205: "2000 puzzle completions at once",
	206: "2500 puzzle completions at once",
	207: "3000 puzzle completions at once",
	208: "3500 puzzle completions at once",
	209: "4000 puzzle completions at once",
	210: "4500 puzzle completions at once",
	211: "one Basic Lock",
	212: "one Diamond Lock",
	213: "one Advanced Lock",
	214: "three Advanced Locks",
	215: "six Advanced Locks",
	216: "one Master Lock",
	217: "one Grandmaster Lock",
	218: "three Grandmaster Locks",
	219: "six Grandmaster Locks",
	220: "ten Grandmaster Locks",
	221: "fifteen Grandmaster Locks",
	222: "twenty-one Grandmaster Locks",
	223: "twenty-eight Grandmaster Locks",
	224: "thirty-six Grandmaster Locks",
	225: "5000 puzzle completions at once",
	226: "6000 puzzle completions at once",
	227: "7000 puzzle completions at once",
	228: "8000 puzzle completions at once",
	229: "9000 puzzle completions at once",
	230: "10000 puzzle completions at once",
	231: "171 Heart challenge completions",
	232: "11000 puzzle completions at once",
	233: "12000 puzzle completions at once",
	234: "13000 puzzle completions at once",
	235: "14000 puzzle completions at once",
	236: "15000 puzzle completions at once",
	237: "16000 puzzle completions at once",
	238: "190 Heart challenge completions",
	239: "45 Grandmaster Locks",
	240: "55 Grandmaster Locks",
	241: "66 Grandmaster Locks",
	242: "78 Grandmaster Locks",
	243: "91 Grandmaster Locks",
	244: "105 Grandmaster Locks",
	245: "210 Heart challenge completions",
	246: "17000 puzzle completions at once",
	247: "18000 puzzle completions at once",
	248: "19000 puzzle completions at once",
	249: "20000 puzzle completions at once",
	250: "21000 puzzle completions at once",
	251: "22000 puzzle completions at once",
	252: "231 Heart challenge completions",
	253: "23000 puzzle completions at once",
	254: "24000 puzzle completions at once",
	255: "25000 puzzle completions at once",
	256: "26000 puzzle completions at once",
	257: "27000 puzzle completions at once",
	258: "28000 puzzle completions at once",
	259: "253 Heart challenge completions",
	260: "29000 puzzle completions at once",
	261: "30000 puzzle completions at once",
	262: "31000 puzzle completions at once",
	263: "32000 puzzle completions at once",
	264: "33000 puzzle completions at once",
	265: "34000 puzzle completions at once",
	266: "276 Heart challenge completions",
	267: "1 Key challenge completion",
	268: "3 Key challenge completions",
	269: "6 Key challenge completions",
	270: "10 Key challenge completions",
	271: "15 Key challenge completions",
	272: "21 Key challenge completions",
	273: "300 Heart challenge completions",
	274: "28 Key challenge completion",
	275: "36 Key challenge completions",
	276: "45 Key challenge completions",
	277: "55 Key challenge completions",
	278: "66 Key challenge completions",
	279: "78 Key challenge completions",
	280: "325 Heart challenge completions",
	281: "15 Diamond Keys",
	282: "351 Heart challenge completions",
	283: "21 Diamond Keys",
	284: "378 Heart challenge completions",
	285: "28 Diamond Keys",
	286: "406 Heart challenge completions",
	287: "36 Diamond Keys",
	288: "435 Heart challenge completions",
	289: "45 Diamond Keys",
	290: "465 Heart challenge completions",
	291: "55 Diamond Keys",
	292: "496 Heart challenge completions",
	293: "66 Diamond Keys",
	294: "528 Heart challenge completions",
	295: "561 Heart challenge completions",
	296: "595 Heart challenge completions",
	297: "630 Heart challenge completions",
	298: "666 Heart challenge completions",
	299: "703 Heart challenge completions",
	300: "741 Heart challenge completions",
	301: "780 Heart challenge completions",
	302: "820 Heart challenge completions",
	303: "861 Heart challenge completions",
	304: "903 Heart challenge completions",
	305: "91 Key challenge completions",
	306: "105 Key challenge completions",
	307: "120 Key challenge completions",
	308: "136 Key challenge completions",
	309: "153 Key challenge completions",
	310: "171 Key challenge completions",
	311: "190 Key challenge completions",
	312: "210 Key challenge completions",
	313: "231 Key challenge completions",
	314: "253 Key challenge completions",
	315: "276 Key challenge completions",
	316: "300 Key challenge completions",
	317: "325 Key challenge completions",
	318: "351 Key challenge completions",
	319: "378 Key challenge completions",
	320: "406 Key challenge completions",
	321: "435 Key challenge completions",
	322: "465 Key challenge completions",
	323: "78 Diamond Keys",
	324: "91 Diamond Keys",
	325: "105 Diamond Keys",
	326: "120 Diamond Keys",
	327: "136 Diamond Keys",
	328: "153 Diamond Keys",
	329: "171 Diamond Keys",
	330: "a stone unlocked",
	331: "2 stones unlocked",
	332: "3 stones unlocked",
	333: "4 stones unlocked",
	334: "5 stones unlocked",
	335: "6 stones unlocked",
	336: "7 stones unlocked",
	337: "8 stones unlocked",
	338: "9 stones unlocked",
	339: "10 stones unlocked",
	340: "11 stones unlocked",
	341: "12 stones unlocked",
	342: "13 stones unlocked",
	343: "14 stones unlocked",
	344: "946 Heart challenge completions",
	345: "990 Heart challenge completions",
	346: "1035 Heart challenge completions",
	347: "15 stones unlocked", 
	348: "16 stones unlocked", 
	349: "17 stones unlocked", 
	350: "18 stones unlocked", 
	351: "19 stones unlocked", 
	352: "20 stones unlocked", 
	353: "21 stones unlocked", 
	354: "22 stones unlocked", 
	355: "23 stones unlocked", 
	356: "24 stones unlocked", 
	357: "25 stones unlocked", 
	358: "496 Key challenge completions",
	359: "26 stones unlocked", 
	360: "27 stones unlocked", 
	361: "28 stones unlocked", 
	362: "29 stones unlocked", 
	363: "30 stones unlocked", 
	364: "31 stones unlocked", 
	365: "1081 Heart challenge completions",
	366: "32 stones unlocked", 
	367: "33 stones unlocked", 
	368: "34 stones unlocked", 
	369: "35 stones unlocked", 
	370: "36 stones unlocked", 
	371: "37 stones unlocked", 
	372: "528 Key challenge completions",
	373: "561 Key challenge completions",
	374: "1128 Heart challenge completions",
	375: "1176 Heart challenge completions",
	376: "1225 Heart challenge completions",
	377: "1275 Heart challenge completions",
	378: "595 Key challenge completions",
	379: "38 stones unlocked", 
	380: "39 stones unlocked", 
	381: "40 stones unlocked", 
	382: "41 stones unlocked", 
	383: "42 stones unlocked", 
	384: "43 stones unlocked", 
	385: "44 stones unlocked", 
}












