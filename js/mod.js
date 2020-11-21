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
	num: ".1.1 First Steps",
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
	1:() => player.a.upgrades.length >= 1,
	2:() => player.a.upgrades.length >= 3,
	3:() => player.a.upgrades.length >= 6,
}

PROGRESSION_MILESTONES_TEXT = {
	1: "one Amoeba upgrade",
	2: "three Amoeba upgrades",
	3: "six Amoeba upgrades",
}

function progressReachedNum(){
	if (typeof player == "undefined") return "You might have a bug, if this disappears its fine"
	a = 0
	b = 0
	for (i in PROGRESSION_MILESTONES) {
		b ++
		if (PROGRESSION_MILESTONES[i]() == true) a ++
	}
	return "You have done " + formatWhole(a) + "/" + formatWhole(b) + " of the milestones"
}

function nextMilestone(){
	for (i in PROGRESSION_MILESTONES) {
		if (PROGRESSION_MILESTONES[i]() == false) return "The next is at " + PROGRESSION_MILESTONES_TEXT[i]
	}
	return ""
}

// Display extra things at the top of the page
var displayThings = [
	"This may be incorrect: Last updated 10:47 PM pacific 11.20",
	function(){
		return shiftDown ? "Shift is down" : ""
	},
	"Endgame: All milestones",
	function(){
		return progressReachedNum() + "<br>" + nextMilestone()
	}
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

