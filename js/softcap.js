/*

This code is taken from NG+++ on which I, pg132, am a contributor

*/

/*
To make a new softcap using this function
1) Create an element of softcap_data which contains
  - The name of it (string, used in displays only)
  - Integers starting from 1 which are dicts
    - These dicts contains a function name, starting value
      and other variables from softcap_vars based on which function you choose
2) Add to getSoftcapAmtFromId like the other functions, except after the =>
   put whatever function takes the output result of said softcap (to see which ones were active)
3a) In updateSoftcapStatsTab add a entry like the others with a name
3b) Go to index.html and find were all the others are stored and store it in a similar fasion
4) Smile :)
*/

var softcap_data = {
	a_eff: {
		1: {
			func: "log",
			start: 10,
			mul: 10,
		},
	},
}

var softcap_vars = {
	pow: ["start", "pow", "derv"],
	log: ["pow", "mul", "add", "start"],
}

var softcap_funcs = {
	pow(x, start, pow, derv = false) {
		x = Decimal.div(x, start).pow(pow)
		if (derv && pow != 0) x = x.sub(1).div(pow).add(1)
		x = x.times(start)
		return x
	},
	log(x, pow = 1, mul = 1, add = 0) { 
		let x2 = Decimal.pow(x.log10().times(mul).add(add), pow)
		return Decimal.min(x, x2)
	},
}

function do_softcap(x, data, num) {
	var data = data[num]
	if (data === undefined) return "stop"

	var func = data.func
	var vars = softcap_vars[func]

	var start = 0
	var v = [data[vars[0]], data[vars[1]], data[vars[2]], data.start]
	for (let i = 0; i < 4; i++) {
		if (typeof v[i] == "function") v[i] = v[i]()
		if (vars[i] == "start") start = v[i]
	}
	
	if (v[4] === false) return x 

	var canSoftcap = false
	if (!start || x.gt(start)) canSoftcap = true

	if (canSoftcap) return softcap_funcs[func](x, v[0], v[1], v[2])
	return "stop"
}

function softcap(x, id) { 
	x = new Decimal(x)
	var data = softcap_data[id]

	if (data == undefined) {
		console.log("your thing broke at" + id)
		return
	}

	var sc = 1
	var stopped = false
	while (true) {
		var y = do_softcap(x, data, sc)
		sc++
		if (y !== "stop") x = y
		else break
	}
	return x
}

/*

function getSoftcapName(id){
	return softcap_data[id]["name"] || "yeet fix bugs pls"
}

function getSoftcapAmtFromId(id){
	return { // for amount
		dt_log: () => getDilTimeGainPerSecond().max(1).log10(), 
	}[id]()
}

function hasSoftcapStarted(id, num){
	let l = id.length
	let check = { 
		idbase: tmp.ngp3,
	}

	if (check[id] !== undefined && !check[id]) return false
	
	let amt = getSoftcapAmtFromId(id)
	
	return hasSoftcapStartedArg(id, num, amt)
}

function hasSoftcapStartedArg(id, num, arg){
	let a = softcap_data[id][num].active
	if (a != undefined) {
		if (typeof a == "function") a = a()
		if (a == false) return false
	}
	return Decimal.gt(arg, softcap_data[id][num].start)
}

function hasAnySoftcapStarted(id){
	for (let i = 1; i <= numSoftcapsTotal(id); i++){
		if (hasSoftcapStarted(id, i)) return true
	}
	return false
}

function numSoftcapsTotal(id){
	let a = Object.keys(softcap_data[id])
	let b = 0
	for (let i = 0; i <= a.length; i++){
		if (!isNaN(parseInt(a[i]))) b ++
		// if the name is an integer add to b
	}
	return b
}

function softcapShorten(x){
	if (typeof x == "number" && x < 1000 && x % 1 == 0) return x
	if (x > 1) return format(x, 3)
	if (x == 1) return 1
	else return format(x)
}

function getSoftcapStringEffect(id, num, namenum){
	let data = softcap_data[id][num]
	if (namenum == undefined) namenum = num
	if (data == undefined) return "Nothing, prb bug."
	let name = (getSoftcapName(id) || id) + " #" + namenum + "."

	var func = data.func
	var vars = softcap_vars[func]

	var v = [data[vars[0]], data[vars[1]], data[vars[2]]]
	for (let i = 0; i < 3; i++) if (typeof v[i] == "function") v[i] = v[i]()
	
	if (func == "pow"){
		let inside = "Start: " + softcapShorten(v[0]) + ", Exponent: " + softcapShorten(v[1])
		if (shiftDown) inside += (v[2] ? ", and keeps " : ", and does not keep ") + "smoothness at softcap start"
		return "Softcap of " + name + " " + inside + "."
	}
	if (func == "log"){ // vars ["pow", "mul", "add"]
		let mult = (v[1] != undefined && Decimal.neq(v[1], 1)) ? ", Times: " + softcapShorten(v[1]) : ""
		let add = ""
		if (v[2] != undefined) {
			if (typeof v[2] != "number" || v[2] > 0) add = (v[2] != undefined && Decimal.neq(v[2], 0)) ? ", Plus: " + softcapShorten(v[2]) : ""
			else add = (v[2] != undefined) ? ", Minus: " + softcapShorten(-1*v[2]) : ""
		}
		let inside = "Log base 10" + mult + add + ", to the Power of " + softcapShorten(v[0])
		end = " "
		if (data.start) end = " Start: " + softcapShorten(data.start) + ", "
		return "Softcap of " + name + end + inside + "."
	} 
	return "oops someone messed up"
}

function getInnerHTMLSoftcap(id){
	let n = numSoftcapsTotal(id)
	let s = ""
	if (!hasSoftcapStarted(id, 1)) return ""
	let c = 1
	let amt = getSoftcapAmtFromId(id)
	for (let i = 1; i <= n; i++) {
		if (hasSoftcapStartedArg(id, i, amt)) {
			s += getSoftcapStringEffect(id, i, c) + "<br>"
			c ++
		}
	}
	return s + "<br><br>"
}

function updateSoftcapStatsTab(){
	let names = {
		dt_log: "softcap_dt",
	}
	let n = Object.keys(names)
	let anyActive = false

	for (let i = 0; i < n.length; i++){
		let elname = names[n[i]]
		if (hasAnySoftcapStarted(n[i])) {  
			document.getElementById(elname).style = "display:block"
			document.getElementById(elname).innerHTML = getInnerHTMLSoftcap(n[i])

			anyActive = true
		} else {
			document.getElementById(elname).style = "display:none"
		}
	}

	document.getElementById("softcapsbtn").style.display = anyActive ? "" : "none"
}
*/
