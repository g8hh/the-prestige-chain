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
	num: ".5.4 Avalanche",
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
					]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
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
	53: "F reset once",
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
	"Check the change log!",
	"Endgame: Join",
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
	m1 = "v.5.4"
	m2 = "- Implemented Success Chance and Attempt Speed"
	m3 = "- Implemented Puzzle reset"
	m4 = "- Created three upgrades that don't do anything yet"
	m5 = "- Created a reasonable details page [give suggestions]"
	m6 = "- Now display placing success chance"


	let part1 = [a1, a2, a3, a4, a5, a6, ""]
	let part2 = [b1, b2, b3, b4, b5, "", b6, b7, "", b8, b9, b10, "", b11, b12, ""]
	let part3 = [c1, c2, c3, c4, c5, ""]
	let part4 = [d1, d2, d3, d4, d5, d6, d7, ""]
	let part5 = [e1, e2, e3, e4, ""]
	let part6 = [f1, f2, f3, f4, ""]
	let part7 = [g1, g2, g3, g4, ""]
	let part8 = [h1, h2, h3, "", h4, h5, ""]
	let part9 = [j1, j2, j3, j4, ""]
	let part10= [k1, k2, k3, ""]
	let part11= [l1, l2, l3, ""]
	let part12= [m1, m2, m3, ""]
	let part13= [n1, n2, n3, n4, n5, n6, n7, "", n8, n9, ""]
	let part14= [m1, m2, m3, m4, m5, m6, ""]

	let final1 = [part10, part9, part8, part7, part6, part5, part4, part3, part2, part1]
	let final2 = [part14, part13, part12, part11]

	return final2.concat(final1)
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

