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
			func: "pow",
			start: 5,
			pow: .8,
			derv: true,
			active(){
				return !hasUpgrade("a", 55)
			},
		},
		2: {
			func: "log",
			start: 10,
			mul: 10,
			active(){
				return !hasUpgrade("a", 55)
			},
		},
		3: {
			func: "pow",
			start: 1e4,
			pow: .5,
			derv: true
		},
	},
	b_eff: {
		1: {
			func: "log",
			start: 10,
			mul: 10,
			active(){
				return !hasUpgrade("c", 14)
			},
		},
		2: {
			func: "pow",
			start: 1000,
			pow: .8,
			derv: true
		},
	},
	c_eff: {
		1: {
			func: "pow",
			start: 30,
			pow: .8,
			derv: true
		},
	},
	b_upg11: {
		1: {
			func: "log",
			start: 10,
			mul: 10,
		},
		2: {
			func: "pow",
			start: 20,
			pow: .3,
			derv: true
		},
	},
	a_buy13: {
		1: {
			func: "log",
			start: 10,
			mul: 5,
			add: 5
		},
		2: {
			func: "pow",
			start: 15,
			pow: .3,
			derv: true
		}
	},
	a_buy32: {
		1: {
			func: "log",
			start: .5,
			add: Math.log10(2) + .5,
		},
		2: {
			func: "log",
			start: 1,
			add: 1,
		},
	},
	d_eff: {
		1: {
			func: "pow",
			start: 50,
			pow: .8,
			derv: true,
		},
	},
	b_chall: {
		1: {
			func: "pow",
			start: 100,
			pow: .5,
			derv: false,
		},
		2: {
			func: "pow",
			start: 200,
			pow: .5,
			derv: false,
		},
		3: {
			func: "pow",
			start: 300,
			pow: .5,
			derv: false,
		},
	},
	c_buy11: {
		1: {
			func: "pow",
			start: 1e30,
			pow: .5,
			derv: false,
		},
		2: {
			func: "pow",
			start: 1e50,
			pow: .5,
			derv: false,
		},
		3: {
			func: "log",
			start: 1e100,
			pow: 50,
		},
	},
	c_buy13: {
		1: {
			func: "pow",
			start: 3.5,
			pow: .5,
		},
		2: {
			func: "pow",
			start: 4,
			pow: .5,
		},
		3: {
			func: "pow",
			start: 4.1,
			pow: .5,
		},
		4: {
			func: "pow",
			start: 4.2,
			pow: .5,
		},
		5: {
			func: "pow",
			start: 4.3,
			pow: .5,
		},
		6: {
			func: "pow",
			start: 4.4,
			pow: .5,
		},
		7: {
			func: "pow",
			start: 4.5,
			pow: .5,
		},
	},
	c_buy21: {
		1: {
			func: "pow",
			start: 1e40,
			pow: .5,
		},
		2: {
			func: "log",
			start: 1e50,
			pow: 50 / Math.log10(50),
		},
		3: {
			func: "pow",
			start: 1e60,
			pow: .5,
		},
		4: {
			func: "log",
			start: 1e70,
			pow: 70 / Math.log10(70),
		},
		/*
		5: {
			func: "pow",
			start: 1e80,
			pow: .5,
		},
		6: {
			func: "log",
			start: 1e90,
			pow: 90 / Math.log10(90),
		},
		*/
	},
	c_buy22:{
		1: {
			func: "log",
			start: Decimal.pow(10, 1e4),
			pow: 1e4/4
		}
	},
	c_buy31: {
		1: {
			func: "log",
			start: new Decimal("1e500"),
			pow: 500 / Math.log10(500),
		},
	},
	c_buy33: {
		1: {
			func: "log",
			start: new Decimal(1e10),
			mul: 1e10 / Math.log10(1e10),
		},
		2: {
			func: "log",
			start: new Decimal(1e20),
			mul: 1e20 / Math.log10(1e20),
		},
	},
	d_buy21:{
		1: {
			func: "log",
			start: new Decimal("1e150"),
			pow: 150 / Math.log10(150),
			active(){
				return !hasMilestone("goalsii", 21) 
			},
		},
		2: {
			func: "pow",
			start: new Decimal("1e150"),
			pow: .99,
		},
	},
	d_buy22:{
		/*
		1: {
			func: "log",
			start: new Decimal("1e100"),
			pow: 50,
		},
		*/
	},
	d_buy33:{
		1: {
			func: "log",
			start: new Decimal(1),
			mult: .1,
			add: 1,
		},
	},
	e_eff:{
		1: {
			func: "pow",
			start: 1e100,
			pow: .9,
		},
	},
	e_buy22: {
		1: {
			func: "log",
			start: 1e100,
			pow: 50,
		},
	},
	e_buy32: {
	},
	f_eff:{
		
	},
	f_buy31: {
		1: {
			func: "pow",
			start: .1,
			pow: .7,
		},
		2: {
			func: "pow",
			start: 1,
			pow: .7,
		},
	},
	goalsii_eff: {
		1: {
			func: "pow",
			start: 1e18,
			pow: .5,
		},
		2: {
			func: "pow",
			start: 1e19,
			pow: .4,
		},
		3: {
			func: "pow",
			start: 1e20,
			pow: .3,
		},
	},
	g_buy12: {
		1: {
			func: "log",
			start: 1e100,
			pow: 50,
		},
	},
	g_buy22: {
		1: {
			func: "log",
			start: 1,
			add: 1,
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
	var v = [data[vars[0]], data[vars[1]], data[vars[2]], data[vars[3]], data.active]
	for (let i = 0; i < 5; i++) {
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
		console.log("there is no softcap at " + id)
		return x
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
