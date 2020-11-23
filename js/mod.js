let modInfo = {
	name: "The Prestige Chain",
	id: "prestigechain",
	author: "pg132",
	pointsName: "points",
	discordName: "pg132#7975",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    	offlineLimit: 10/3600,   
	// In hours, so the current (10/3600) is 10 seconds
    	initialStartPoints: new Decimal (0) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: ".1.9 The First Trials",
	name: "",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

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
	1:() => player.a.upgrades.length >= 1 || hasUnlockedPast("a"),
	2:() => player.a.upgrades.length >= 3 || hasUnlockedPast("a"),
	3:() => player.a.upgrades.length >= 6 || hasUnlockedPast("a"),
	4:() => getBuyableAmount("a", 12).gte(2) || hasUnlockedPast("a"),
	5:() => player.a.points.gte(1e6) || hasUnlockedPast("a"),
	6:() => player.b.upgrades.length >= 1 || hasUnlockedPast("b"),
	7:() => player.a.upgrades.length >= 13 || hasUnlockedPast("b"),
	8:() => player.b.upgrades.length >= 6 || hasUnlockedPast("b"),
	9:() => player.a.upgrades.length >= 16 || hasUnlockedPast("b"),
	10:() => player.b.points.gt(5e10) || hasUnlockedPast("b"),
	11:() => player.c.points.gte(3) || hasUnlockedPast("c"),
	12:() => player.c.upgrades.length >= 3 || hasUnlockedPast("c"),
	13:() => getBuyableAmount("a", 31).gte(4) || hasUnlockedPast("c"),
	14:() => player.b.upgrades.length >= 12 || hasUnlockedPast("c"),
	15:() => player.b.upgrades.length >= 14 || hasUnlockedPast("c"),
	16:() => player.c.upgrades.length >= 4 || hasUnlockedPast("c"),
	17:() => challengeCompletions("b", 11) >= 1 || hasUnlockedPast("c"),
	18:() => player.b.upgrades.length >= 19 || hasUnlockedPast("c"),
	19:() => player.c.upgrades.length >= 7 || hasUnlockedPast("c"),
	20:() => challengeCompletions("b", 12) >= 1 || hasUnlockedPast("c"),
	21:() => player.c.points.gte(5e10) || hasUnlockedPast("c"),
	22:() => player.d.points.gte(5) || hasUnlockedPast("d"),
	23:() => player.b.upgrades.length >= 22 || hasUnlockedPast("d"),
	24:() => getBuyableAmount("b", 21).gte(2) || hasUnlockedPast("d"),
	25:() => player.d.upgrades.length >= 4 || hasUnlockedPast("d"),
	26:() => totalChallengeComps("b") >= 8 || hasUnlockedPast("d"),
	27:() => totalChallengeComps("b") >= 11 || hasUnlockedPast("d"),
	28:() => getBuyableAmount("b", 23).gte(2) || hasUnlockedPast("d"),
	29:() => layers.d.getResetGain().gte(26500) || hasUnlockedPast("d"),
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
	24: "22 Baby buyables",
	25: "4 Doodle upgrades",
	26: "8 Bacteria challenge completions",
	27: "11 Bacteria challenge completions",
	28: "2 Beauty buyables",
	29: "26,500 Doodles at once",
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
	"This may be incorrect: Last updated 12:11 PM pacific 11.23",
	function (){
		let a = "Endgame: All goals"
		if (player.ach.achievements.length == Object.keys(PROGRESSION_MILESTONES).length) {
			a += " (done!)"
		} else a += " (not done)"
		return a + " & 5e5 Doodles"
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

