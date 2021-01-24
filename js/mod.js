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
	num: ".8.11 Topographic",
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
		let a = "Endgame: 1e234 Maps"
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
	bs1= "v.8.4"
	bs2= "- Added a Key challenge"
	bs3= "- Added 2 Key upgrades"
	bs4= "- Gave Message an additional effect"
	bt1= "v.8.5"
	bt2= "- Added a two achievement rows"
	bt3= "- Moved the achievement requirements data to its own file"
	bt4= "- Fixed a bug with you having over 2e5 rebirths/games getting reset every tick"
	bt5= "- Made a generalized buyable function"
	bt6= "- General theme of minimizing mess in layers.js and mod.js"
	bt7= "- Changed around the changelog a bit (should be obvious)"
	bt8= "v.8.5.1"
	bt9= "- Fixed a bug with Bulk Amount not costing knowledge"
	bu1= "v.8.6"
	bu2= "- Added a Key upgrade"
	bu3= "- Fixed above allowing for bulk rebirth purchases"
	bu4= "- Fixed Keith cost and description"
	bv1= "v.8.7"
	bv2= "- Hid lots of lock displays after 1ee9 Locks to aviod lag"
	bv3= "- Added a Key upgrade"
	bv4= "- Changed Kate and Keith"
	bv5= "- Fixed the error text display"
	bw1= "v.8.8"
	bw2= "- Hid more lock displays after 1ee9 Locks to aviod lag"
	bw3= "- Added a Key challenge"
	bw4= "- Added a Key upgrade"
	bw5= "- Added two rows of achievements"
	bw6= "v.8.8.1"
	bw7= "- Fixed Karen cost"
	bw8= "- Fixed Kenya description"
	bw9= "- Added more notifications when saves break"
	bx1= "v.8.9"
	bx2= "- Buffed Kick"
	bx3= "- Added 2 Lemon upgrades"
	by1= "v.8.10"
	by2= "- Made the Figure, Games, and Heart upgrade autobuyers bulk buy"
	by3= "- Created prestigeSupport.js and generalSupport.js"
	by4= "- Moved a bunch of functions to help code readablility"
	by5= "- Added a bunch of stuff to hopefully fix things going negative"
	by6= "v.8.10.1"
	by7= "- Fix a bug with displaying tiny chances"
	bz1= "v.8.11"
	bz2= "- Added a Lemon upgrade"
	bz3= "- Decreased the costs of l31 and l32"
	bz4= "- Added a display for the number of locks and mines after 1ee9 Keys"
	bz5= "- Added a row of achievements"
	bz6= "- Added a way to passively do Heart challenges"

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
	let part68= [bs1,bs2,bs3,bs4, ""]
	let part69= [bt1,bt2,bt3,bt4,bt5,bt6,bt7, "",bt8,bt9, ""]
	let part70= [bu1,bu2,bu3,bu4, ""]
	let part71= [bv1,bv2,bv3,bv4,bv5, ""]
	let part72= [bw1,bw2,bw3,bw4,bw5, "",bw6,bw7,bw8,bw9, ""]
	let part73= [bx1,bx2,bx3, ""]
	let part74= [by1,by2,by3,by4,by5, "",by6,by7, ""]
	let part75= [bz1,bz2,bz3,bz4,bz5,bz6, ""]
	
	// MAKE SURE TO ADD THEM

	let final1 = [part10,  part9,  part8,  part7,  part6,  part5,  part4,  part3,  part2,  part1]
	let final2 = [part20, part19, part18, part17, part16, part15, part14, part13, part12, part11]
	let final3 = [part30, part29, part28, part27, part26, part25, part24, part23, part22, part21]
	let final4 = [part40, part39, part38, part37, part36, part35, part34, part33, part32, part31]
	let final5 = [part50, part49, part48, part47, part46, part45, part44, part43, part42, part41]
	let final6 = [part60, part59, part58, part57, part56, part55, part54, part53, part52, part51]
	let final7 = [part70, part69, part68, part67, part66, part65, part64, part63, part62, part61]
	let final8 = [part75, part74, part73, part72, part71]

	let start = [["Hold Shift to see the full changelog!", shiftDown ? "" : "Currrently showing the 5 most recent entries", ""]]
	let end = final8.concat(final7).concat(final6).concat(final5).concat(final4).concat(final3).concat(final2).concat(final1)

	if (!shiftDown) return start.concat(end.slice(0, 5))

	return start.concat(end)
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

