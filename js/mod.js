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
	num: ".1.4 The Second Step",
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
	10:() => player.b.points.gt(5e10) || hasUnlockedPast("c"),
	11:() => player.c.points.gte(3) || hasUnlockedPast("c"),
	12:() => player.c.upgrades.length >= 3 || hasUnlockedPast("c"),
	13:() => getBuyableAmount("a", 31).gte(4) || hasUnlockedPast("c"),
	14:() => player.b.upgrades.length >= 12 || hasUnlockedPast("c"),
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
	"This may be incorrect: Last updated 7:52 PM pacific 11.21",
	function (){
		let a = "Endgame: All milestones"
		if (progressReachedNum() == Object.keys(PROGRESSION_MILESTONES).length) a += " (done!)"
		return a + " & e4256 Amoebas"
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

