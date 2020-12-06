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
	num: ".3.9.2 Salvaged Wasteland",
	name: "",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",
					"getTokenToMedalGain",
					"getAllPrior"]

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
	1:() => player.a.upgrades.length >= 1            || hasAchievement("ach", 11),
	2:() => player.a.upgrades.length >= 3            || hasAchievement("ach", 12),
	3:() => player.a.upgrades.length >= 6            || hasAchievement("ach", 13),
	4:() => getBuyableAmount("a", 12).gte(2)         || hasAchievement("ach", 14),
	5:() => player.a.points.gte(1e6)                 || hasAchievement("ach", 15),
	6:() => player.b.upgrades.length >= 1            || hasAchievement("ach", 16),
	7:() => player.a.upgrades.length >= 13           || hasAchievement("ach", 17),
	8:() => player.b.upgrades.length >= 6            || hasAchievement("ach", 21),
	9:() => player.a.upgrades.length >= 16           || hasAchievement("ach", 22),
	10:() => player.b.points.gt(5e10)                || hasAchievement("ach", 23),
	11:() => player.c.points.gte(3)                  || hasAchievement("ach", 24),
	12:() => player.c.upgrades.length >= 3           || hasAchievement("ach", 25),
	13:() => getBuyableAmount("a", 31).gte(4)        || hasAchievement("ach", 26),
	14:() => player.b.upgrades.length >= 12          || hasAchievement("ach", 27),
	15:() => player.b.upgrades.length >= 14          || hasAchievement("ach", 31),
	16:() => player.c.upgrades.length >= 4           || hasAchievement("ach", 32),
	17:() => challengeCompletions("b", 11) >= 1      || hasAchievement("ach", 33),
	18:() => player.b.upgrades.length >= 19          || hasAchievement("ach", 34),
	19:() => player.c.upgrades.length >= 7           || hasAchievement("ach", 35),
	20:() => challengeCompletions("b", 12) >= 1      || hasAchievement("ach", 36),
	21:() => player.c.points.gte(5e10)               || hasAchievement("ach", 37),
	22:() => player.d.points.gte(5)                  || hasAchievement("ach", 41),
	23:() => player.b.upgrades.length >= 22          || hasAchievement("ach", 42),
	24:() => getBuyableAmount("b", 21).gte(2)        || hasAchievement("ach", 43),
	25:() => player.d.upgrades.length >= 4           || hasAchievement("ach", 44),
	26:() => totalChallengeComps("b") >= 8           || hasAchievement("ach", 45),
	27:() => totalChallengeComps("b") >= 11          || hasAchievement("ach", 46),
	28:() => getBuyableAmount("b", 23).gte(2)        || hasAchievement("ach", 47),
	29:() => layers.d.getResetGain().gte(25500)      || hasAchievement("ach", 51),
	30:() => getBuyableAmount("c", 11).gte(5)        || hasAchievement("ach", 52),
	31:() => getBuyableAmount("b", 31).gte(1)        || hasAchievement("ach", 53),
	32:() => player.c.upgrades.length >= 18          || hasAchievement("ach", 54),
	33:() => totalChallengeComps("c") >= 1           || hasAchievement("ach", 55),
	34:() => player.c.upgrades.length >= 20          || hasAchievement("ach", 56),
	35:() => totalChallengeComps("c") >= 2           || hasAchievement("ach", 57),
	36:() => player.e.points.gte(2)                  || hasAchievement("ach", 61),
	37:() => player.e.points.gte(200)                || hasAchievement("ach", 62),
	38:() => totalChallengeComps("c") >= 3           || hasAchievement("ach", 63),
	39:() => totalChallengeComps("c") >= 5           || hasAchievement("ach", 64),
	40:() => totalChallengeComps("b") >= 56          || hasAchievement("ach", 65),
	41:() => totalChallengeComps("b") >= 61          || hasAchievement("ach", 66),
	42:() => player.e.upgrades.length >= 2           || hasAchievement("ach", 67),
	43:() => totalChallengeComps("c") >= 9           || hasAchievement("ach", 71),
	44:() => totalChallengeComps("c") >= 13          || hasAchievement("ach", 72),
	45:() => totalChallengeComps("c") >= 14          || hasAchievement("ach", 73),
	46:() => getBuyableAmount("d", 11).gte(14)       || hasAchievement("ach", 74),
	47:() => getBuyableAmount("d", 13).gte(6)        || hasAchievement("ach", 75),
	48:() => totalChallengeComps("c") >= 15          || hasAchievement("ach", 76),
	49:() => totalChallengeComps("c") >= 17          || hasAchievement("ach", 77),
	50:() => totalChallengeComps("c") >= 19          || hasAchievement("ach", 81),
	51:() => totalChallengeComps("c") >= 22          || hasAchievement("ach", 82),
	52:() => totalChallengeComps("c") >= 34          || hasAchievement("ach", 83),
	53:() => player.f.times >= 1                     || hasAchievement("ach", 84),
	54:() => player.goalsii.tokens.best["01"].gte(1) || hasAchievement("ach", 85),
	55:() => player.goalsii.tokens.best["02"].gte(1) || hasAchievement("ach", 86),
	56:() => player.goalsii.tokens.best["10"].gte(1) || hasAchievement("ach", 87),
	57:() => player.goalsii.tokens.best["11"].gte(1) || hasAchievement("ach", 91),
	58:() => player.goalsii.tokens.best["12"].gte(1) || hasAchievement("ach", 92),
	59:() => player.goalsii.tokens.best["20"].gte(1) || hasAchievement("ach", 93),
	60:() => player.goalsii.tokens.best["21"].gte(1) || hasAchievement("ach", 94),
	61:() => player.goalsii.tokens.best["22"].gte(1) || hasAchievement("ach", 95),
	62:() => player.goalsii.tokens.best["03"].gte(1) || hasAchievement("ach", 96),
	63:() => player.goalsii.tokens.best["13"].gte(1) || hasAchievement("ach", 97),
	64:() => player.goalsii.tokens.best["23"].gte(1) || hasAchievement("ach",101),
	65:() => player.goalsii.tokens.best["30"].gte(1) || hasAchievement("ach",102),
	66:() => player.goalsii.tokens.best["31"].gte(1) || hasAchievement("ach",103),
	67:() => player.goalsii.tokens.best["32"].gte(1) || hasAchievement("ach",104),
	68:() => player.goalsii.tokens.best["33"].gte(1) || hasAchievement("ach",105),
	69:() => getBuyableAmount("b", 11).gte(1e20)     || hasAchievement("ach",106),
	70:() => getBuyableAmount("b", 12).gte(1e20)     || hasAchievement("ach",107),
	71:() => player.goalsii.tokens.best["04"].gte(1) || hasAchievement("ach",111),
	72:() => player.goalsii.tokens.best["14"].gte(1) || hasAchievement("ach",112),
	73:() => player.goalsii.tokens.best["24"].gte(1) || hasAchievement("ach",113),
	74:() => player.goalsii.tokens.best["34"].gte(1) || hasAchievement("ach",114),
	75:() => player.goalsii.tokens.best["40"].gte(1) || hasAchievement("ach",115),
	76:() => player.goalsii.tokens.best["41"].gte(1) || hasAchievement("ach",116),
	77:() => player.goalsii.tokens.best["42"].gte(1) || hasAchievement("ach",117),
	78:() => player.goalsii.tokens.best["43"].gte(1) || hasAchievement("ach",121),
	79:() => player.goalsii.tokens.best["44"].gte(1) || hasAchievement("ach",122),
	80:() => player.f.best.gte(1e58)                 || hasAchievement("ach",123),
}

/*
A: 5
B: 5
C: 11 (currently)
*/

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
	"This may be incorrect: Last updated 12:52 PM pacific 12.06",
	function (){
		return "Endgame: 2 G resets " + (player.g.best.gte(2) ? "(done)" : "(not done)")
		/*
		let a = "Endgame: All goals"
		if (player.ach.achievements.length == Object.keys(PROGRESSION_MILESTONES).length) {
			a += " (done!)"
		} else a += " (not done)"
		return a + " & 1 00 token"
		*/
	},
]

// Determines when the game "ends"
function isEndgame() {
	return false
}


// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 1000 // in ms
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

