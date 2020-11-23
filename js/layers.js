function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)

        for (let i = 0; i < LAYERS.length; i++){
                if (layers[LAYERS[i]].row == "side") continue
                gain = gain.times(layers[LAYERS[i]].effect())
        }

        if (hasUpgrade("a", 11)) gain = gain.times(upgradeEffect("a", 11))
        if (hasUpgrade("a", 12)) gain = gain.times(upgradeEffect("a", 12))
                                 gain = gain.times(getBuyableEffect("a", 11))
                                 gain = gain.times(getBuyableEffect("a", 23))
                                 gain = gain.times(getBuyableEffect("b", 11))

	return gain
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function canBuyMax(layer, id) {
	return false
}

function getBuyableEffect(layer, id){
        return layers[layer].buyables[id].effect()
}

function hasUnlockedRow(r){
        if (r == 4) return false
        if (r == 3) return hasUnlockedRow(4)   || false
        if (r == 2) return hasUnlockedRow(3)   || false
        if (r == 1) return hasUnlockedRow(2)   || false
        return false
}

function getsReset(layer, layerPrestiging) {
        order = LAYERS
        for (let i = 0; i < order.length; i++) {
                if (layers[LAYERS[i]].row == "side") continue
                if (layerPrestiging == order[i]) return false
                if (layer == order[i]) return true
        }
        return false
}

function hasUnlockedPast(layer){
        let on = false
        for (let i = 0; i < LAYERS.length; i++) {
                if (layers[LAYERS[i]].row == "side") continue
                if (on && layers[LAYERS[i]].layerShown()) return true
                if (layer == LAYERS[i]) on = true
        }
        return false
}

function getChallengeFactor(comps){
        let b1 = new Decimal(comps).pow(1.5).plus(1)
        if (b1.gt(10)) b1 = Decimal.pow(10, b1.div(10))
        if (b1.gt(1e10)) b1 = b1.tetrate(1.01) 
        return b1
}

function isBuyableActive(layer){
        if (layer == "d") return true
        if (layer == "c") return true
        if (layer == "b") return true
        if (inChallenge("b", 11)) return false
        if (layer == "a") return true
}

function isPrestigeEffectActive(layer){
        if (layer == "d") return true
        if (layer == "c") return true
        if (layer == "b") return true
        if (inChallenge("b", 21)) return false
        if (layer == "a") return true
}

function totalChallengeComps(layer){
        let a = challengeCompletions(layer, 11) || 0
        let b = challengeCompletions(layer, 12) || 0
        let c = challengeCompletions(layer, 21) || 0
        let d = challengeCompletions(layer, 22) || 0
        return a + b + c + d
}

var devSpeedUp = false


/*
bacteria
circles
doodles
eggs
fires
games
hooks
*/

//upgrade names:
// https://github.com/first20hours/google-10000-english/blob/master/google-10000-english.txt

addLayer("a", {
        name: "Amoebas", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#BB4C83",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Amoebas", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("a", 32)) x = x.times(3)

                x = x.plus(layers.a.buyables[21].effect())

                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(layers[LAYERS[i]].effect())
                        if (LAYERS[i] == "a") yet = true
                }

                if (hasUpgrade("a", 13)) x = x.times(upgradeEffect("a", 13))
                if (hasUpgrade("a", 14)) x = x.times(upgradeEffect("a", 14))
                if (hasUpgrade("a", 23)) x = x.times(2)
                                         x = x.times(getBuyableEffect("a", 12))
                if (hasUpgrade("b", 11)) x = x.times(upgradeEffect("b", 11))
                                         x = x.times(getBuyableEffect("a", 31))
                                         x = x.times(getBuyableEffect("b", 21))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("a")) return new Decimal(1)

                let amt = player.a.points

                let ret = amt.plus(1).sqrt()

                ret = softcap(ret, "a_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                player.a.best = player.a.best.max(player.a.points)
                if (hasUpgrade("a", 23)) {
                        player.a.points = player.a.points.plus(this.getResetGain().times(diff))
                        player.a.total = player.a.total.plus(this.getResetGain().times(diff))
                        player.a.autotimes += diff
                        if (player.a.autotimes > 3) player.a.autotimes = 3
                        if (player.a.autotimes > 1) {
                                player.a.autotimes += -1
                                player.a.times ++
                        }
                }
                if (hasUpgrade("b", 14)) {
                        let diffmult = 1
                        if (hasUpgrade("b", 45)) diffmult *= 2
                        player.a.abtime += diff * diffmult

                        if (player.a.abtime > 10) player.a.abtime = 10
                        if (player.a.abtime > 1) {
                                player.a.abtime += -1
                                let amt = 1
                                if (hasUpgrade("a", 35)) amt *= 10
                                if (hasUpgrade("b", 21)) {
                                        amt *= 2
                                        if (hasUpgrade("b", 22)) amt *= 2
                                        if (hasUpgrade("b", 23)) amt *= 2
                                        if (hasUpgrade("b", 24)) amt *= 2
                                        if (hasUpgrade("b", 25)) amt *= 2
                                }
                                if (hasUpgrade("b", 32)) {
                                        amt *= 2
                                        if (hasUpgrade("b", 31)) amt *= 2
                                        if (hasUpgrade("b", 33)) amt *= 2
                                        if (hasUpgrade("b", 34)) amt *= 2
                                        if (hasUpgrade("b", 35)) amt *= 2
                                }
                                if (layers.a.buyables[11].unlocked()) layers.a.buyables[11].buyMax(amt)
                                if (layers.a.buyables[12].unlocked()) layers.a.buyables[12].buyMax(amt)
                                if (layers.a.buyables[13].unlocked()) layers.a.buyables[13].buyMax(amt)
                                if (layers.a.buyables[21].unlocked()) layers.a.buyables[21].buyMax(amt)
                                if (layers.a.buyables[22].unlocked()) layers.a.buyables[22].buyMax(amt)
                                if (layers.a.buyables[23].unlocked()) layers.a.buyables[23].buyMax(amt)
                                if (layers.a.buyables[31].unlocked()) layers.a.buyables[31].buyMax(amt)
                                if (layers.a.buyables[32].unlocked()) layers.a.buyables[32].buyMax(amt)
                                if (layers.a.buyables[33].unlocked()) layers.a.buyables[33].buyMax(amt)
                        }
                } else {
                        player.a.abtime = 0
                }
                player.a.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "a", description: "Reset for Amoeba", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6)) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.a.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.a.time >= 2 && !hasUpgrade("a", 23)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "And",
                        description: "Amoebas boost point gain",
                        cost: new Decimal(2),
                        effect(){
                                if (inChallenge("b", 12)) return new Decimal(1)
                                
                                let exp = 3
                                if (hasUpgrade("a", 21)) exp += player.a.upgrades.length * .5

                                if (hasUpgrade("a", 44)) exp *= exp
                                if (hasUpgrade("c", 11)) exp *= 2

                                let ret = player.a.points.times(10).plus(20).log10().pow(exp)
                                return ret
                        },
                        unlocked(){
                                return player.a.best.gt(0) || hasUnlockedPast("a")
                        }
                },
                12: {
                        title: "A",
                        description: "Each Amoeba Upgrade doubles point gain",
                        cost: new Decimal(15),
                        effect(){
                                let base = 2
                                if (hasUpgrade("a", 25)) base += player.a.upgrades.length * .02

                                let exp = player.a.upgrades.length
                                if (hasUpgrade("a", 53)) exp *= player.a.upgrades.length
                                
                                return Decimal.pow(base, exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 11) || hasUnlockedPast("a")
                        }
                },
                13: {
                        title: "Are",
                        description: "Each Amoeba Upgrade multiplies Amoeba gain by 1.2",
                        cost: new Decimal(300),
                        effect(){
                                let exp = new Decimal(player.a.upgrades.length)
                                exp = exp.times(layers.a.buyables[13].effect())
                                return Decimal.pow(1.2, exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 12) || hasUnlockedPast("a")
                        }
                },
                14: {
                        title: "At",
                        description: "Amoebas boost Amoeba gain",
                        cost: new Decimal(1000),
                        effect(){
                                let exp = new Decimal(1)
                                if (hasUpgrade("a", 35)) exp = exp.times(3)
                                if (hasUpgrade("c", 12)) exp = exp.times(player.b.upgrades.length).max(exp)
                                return player.a.points.plus(10).log10().pow(exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 13) || hasUnlockedPast("a")
                        }
                },
                15: {
                        title: "As",
                        description: "Unlock the first Amoeba buyable",
                        cost: new Decimal(1500),
                        unlocked(){
                                return hasUpgrade("a", 14) || hasUnlockedPast("a")
                        }
                },
                21: {
                        title: "An",
                        description: "Each Amoeba upgrade adds .5 to the <b>And</b> exponent",
                        cost: new Decimal(5000),
                        effect(){
                                return 3 + player.a.upgrades.length
                        },
                        effectDisplay(){
                                return "3 -> " + format(3 + player.a.upgrades.length * .5, 1)
                        },
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(3) || hasUnlockedPast("a")
                        }
                },
                22: {
                        title: "About",
                        description: "Unlock the second Amoeba buyable",
                        cost: new Decimal(2e4),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(6) || hasUnlockedPast("a")
                        }
                },
                23: {
                        title: "Also",
                        description: "Remove the ability to prestige but gain 100% of Amoebas on prestige per second, also double Amoeba gain",
                        cost: new Decimal(3e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(2) || hasUnlockedPast("a")
                        }
                },
                24: {
                        title: "Am",
                        description: "<b>Any</b> gives free levels to <b>All</b>",
                        cost: new Decimal(15e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(3) || hasUnlockedPast("a")
                        }
                },
                25: {
                        title: "Add",
                        description: "Each Amoeba upgrade adds .02 to the <b>A</b> base",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(11) || hasUnlockedPast("a")
                        }
                },
                31: {
                        title: "Available",
                        description: "Unlock a third Amoeba buyable",
                        cost: new Decimal(1e7),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }
                },
                32: {
                        title: "Address",
                        description: "Cube base Amoeba gain",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }
                },
                33: {
                        title: "Area",
                        description: "Remove the first Amoeba effect softcap",
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("a", 32) || hasUnlockedPast("b")
                        }
                },
                34: {
                        title: "Action",
                        description: "Each <b>After</b> gives a free level to <b>All</b> and adds .01 to the base",
                        cost: new Decimal(3e50),
                        unlocked(){
                                return hasUpgrade("a", 33) || hasUnlockedPast("b")
                        }
                },
                35: {
                        title: "American",
                        description: "<b>Business</b> can buy 10, cube <b>At</b>, and Amoeba buyables cost nothing",
                        cost: new Decimal(1e54),
                        unlocked(){
                                return hasUpgrade("a", 34) || hasUnlockedPast("b")
                        }
                },
                41: {
                        title: "Art",
                        description: "Get a free <b>Access</b> level",
                        cost: new Decimal(1e88),
                        unlocked(){
                                return hasUpgrade("a", 35) || hasUnlockedPast("b")
                        }
                }, 
                42: {
                        title: "Another",
                        description: "<b>Account</b> gives free <b>Access</b> levels",
                        cost: new Decimal(1e195),
                        unlocked(){
                                return hasUpgrade("a", 41) || hasUnlockedPast("b")
                        }
                },
                43: {
                        title: "Article",
                        description: "<b>Account</b> adds .05 to the <b>Any</b> base",
                        cost: new Decimal(1e284),
                        unlocked(){
                                return hasUpgrade("a", 42) || hasUnlockedPast("b")
                        }
                },
                44: {
                        title: "Author",
                        description: "Square <b>And</b> exponent",
                        cost: new Decimal("5e524"),
                        unlocked(){
                                return hasUpgrade("a", 43) || hasUnlockedPast("b")
                        }
                },
                45: {
                        title: "Around",
                        description: "Each <b>Account</b> adds .01 to its base",
                        cost: new Decimal("1e568"),
                        unlocked(){
                                return hasUpgrade("a", 44) || hasUnlockedPast("b")
                        }
                },
                51: {
                        title: "Air",
                        description: "Each <b>Access</b> adds .01 to the <b>Any</b> base",
                        cost: new Decimal("5e1228"),
                        unlocked(){
                                return hasUpgrade("a", 45) || hasUnlockedPast("c")
                        }
                },
                52: {
                        title: "Accessories",
                        description: "<b>Account</b> adds levels to <b>After</b>",
                        cost: new Decimal("1e1654"),
                        unlocked(){
                                return hasUpgrade("a", 51) || hasUnlockedPast("c")
                        }
                },
                53: {
                        title: "Application",
                        description: "Unlock a seventh Amoeba buyable and raise <b>A</b> to the number of Amoeba upgrades",
                        cost: new Decimal("1e1797"),
                        unlocked(){
                                return hasUpgrade("a", 52) || hasUnlockedPast("c")
                        }
                },
                54: {
                        title: "Again",
                        description: "<b>Advanced</b> gives free levels to <b>Account</b>",
                        cost: new Decimal("1e1948"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }
                },
                55: {
                        title: "Above",
                        description: "Unlock a second Bacteria buyable and remove the second Amoeba effect softcap",
                        cost: new Decimal("1e4256"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }
                },
                /*
                act
                august
                america
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "All",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " points</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("a", 24)) {
                                        extra = true
                                        a += "<h3>Any</h3>, "
                                }
                                if (hasUpgrade("a", 34)) {
                                        extra = true
                                        a += "<h3>After</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 11)
                                return formatWhole(getBuyableAmount("a", 11)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 500
                                let b1 = 2
                                let b2 = 1.001
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 11).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(1)

                                let base = new Decimal(1.5)
                                if (hasUpgrade("a", 34)) base = base.plus(layers.a.buyables[13].total().div(100))
                                if (hasUpgrade("d", 11)) base = base.plus(layers.a.buyables[32].total())
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 11).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("a", 24)) ret = ret.plus(layers.a.buyables[12].total())
                                if (hasUpgrade("a", 34)) ret = ret.plus(layers.a.buyables[13].total())
                                ret = ret.plus(layers.b.buyables[11].total())
                                ret = ret.plus(layers.a.buyables[33].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[11] = player.a.buyables[11].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Math.log(bases[1])/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Math.log(bases[2])/Math.log(1.01)
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[11]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[11] = player.a.buyables[11].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        },
                },
                12: {
                        title: "Any",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Amoebas</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("b", 15)) {
                                        extra = true
                                        a += "<h3>After</h3>, "
                                }
                                if (hasUpgrade("b", 23)) {
                                        extra = true
                                        a += "<h3>Access</h3>, "
                                }
                                if (hasUpgrade("b", 24)) {
                                        extra = true
                                        a += "<h3>A Upgrades</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 12)
                                return formatWhole(getBuyableAmount("a", 12)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 1e4
                                let b1 = 3
                                let b2 = 1.005
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 12).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(1)
                                
                                let base = new Decimal(1.1)
                                if (hasUpgrade("b", 12)) base = base.plus(Decimal.div(player.b.upgrades.length, 10))
                                if (hasUpgrade("a", 43)) base = base.plus(layers.a.buyables[22].total().div(20))
                                if (hasUpgrade("a", 51)) base = base.plus(layers.a.buyables[21].total().div(100))
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 12).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 15)) ret = ret.plus(layers.a.buyables[13].total())
                                if (hasUpgrade("b", 23)) ret = ret.plus(layers.a.buyables[21].total())
                                if (hasUpgrade("b", 24)) ret = ret.plus(player.a.upgrades.length)
                                ret = ret.plus(layers.b.buyables[12].total())
                                ret = ret.plus(layers.a.buyables[33].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[12] = player.a.buyables[12].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Math.log(bases[1])/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Math.log(bases[2])/Math.log(1.01)
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[12]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[12] = player.a.buyables[12].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 22) || hasUnlockedPast("a")
                        },
                },
                13: {
                        title: "After",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: ^" + format(this.effect()) + " <h3>Are</h3> effect</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let scs = this.effect().gt(10)
                                let eformula = "<b><h2>Effect formula</h2>:<br>x^2*.3 + 1" + (scs ? " (softcapped)" : "") + "</b><br>"
                                let exformula = this.getExtraFormulaText()
                                
                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("b", 25)) {
                                        extra = true
                                        a += "<h3>Access</h3>, "
                                }
                                if (hasUpgrade("a", 52)) {
                                        extra = true
                                        a += "<h3>Account</h3>, "
                                }
                                if (hasUpgrade("c", 33)) {
                                        extra = true
                                        a += "<h3>Advanced</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 13)
                                return formatWhole(getBuyableAmount("a", 13)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                let b0 = 1e8
                                let b1 = 8
                                let b2 = 1.25
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 13).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effect(){
                                if (!isBuyableActive("a")) return new Decimal(1)

                                let x = this.total()
                                let ret = Decimal.pow(x, 2).times(.3).plus(1)
                                ret = softcap(ret, "a_buy13")
                                return ret
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 13).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 25)) ret = ret.plus(layers.a.buyables[21].total())
                                if (hasUpgrade("a", 52)) ret = ret.plus(layers.a.buyables[22].total())
                                ret = ret.plus(layers.a.buyables[33].total())
                                ret = ret.plus(layers.b.buyables[13].total())
                                if (hasUpgrade("c", 33)) ret = ret.plus(layers.a.buyables[23].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[13] = player.a.buyables[13].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Math.log(bases[1])/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Math.log(bases[2])/Math.log(1.01)
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[13]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[13] = player.a.buyables[13].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 31) || hasUnlockedPast("b")
                        },
                },
                21: {
                        title: "Access",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: +" + format(this.effect()) + " Amoeba gain exp</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "*x</b><br>"
                                let exformula = this.getExtraFormulaText()
                                
                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("a", 42)) {
                                        extra = true
                                        a += "<h3>Account</h3>, "
                                }
                                if (hasUpgrade("c", 13)) {
                                        extra = true
                                        a += "<h3>Advanced</h3>, "
                                }
                                if (hasUpgrade("b", 44)) {
                                        extra = true
                                        a += "<h3>Above</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 21)
                                return formatWhole(getBuyableAmount("a", 21)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 1e67
                                let b1 = 100
                                let b2 = 2
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 21).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(0)

                                let base = new Decimal(1)
                                base = base.plus(layers.a.buyables[32].effect())
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.times(base, x)
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 21).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("a", 41)) ret = ret.plus(1)
                                if (hasUpgrade("a", 42)) ret = ret.plus(layers.a.buyables[22].total())
                                if (hasUpgrade("c", 13)) ret = ret.plus(layers.a.buyables[23].total())
                                if (hasUpgrade("b", 44)) ret = ret.plus(layers.a.buyables[32].total())
                                ret = ret.plus(layers.a.buyables[33].total())
                                ret = ret.plus(layers.b.buyables[21].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[21] = player.a.buyables[21].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Math.log(bases[1])/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Math.log(bases[2])/Math.log(1.01)
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[21]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[21] = player.a.buyables[21].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 21) || hasUnlockedPast("b")
                        },
                },
                22: {
                        title: "Account",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: *" + format(this.effect()) + " Bacteria</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()
                                
                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("a", 54)) {
                                        extra = true
                                        a += "<h3>Advanced</h3>, "
                                }
                                if (hasUpgrade("b", 33)) {
                                        extra = true
                                        a += "<h3>Against</h3>, "
                                }
                                if (hasUpgrade("c", 32)) {
                                        extra = true
                                        a += "<h3>Account</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 22)
                                return formatWhole(getBuyableAmount("a", 22)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 1e149
                                let b1 = 1e4
                                let b2 = 5
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 22).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(1)
                                
                                let base = new Decimal(1.2)
                                if (hasUpgrade("a", 45)) base = base.plus(this.total().div(100))
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 22).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 31)) ret = ret.plus(1)
                                if (hasUpgrade("a", 54)) ret = ret.plus(layers.a.buyables[23].total())
                                if (hasUpgrade("b", 33)) ret = ret.plus(layers.a.buyables[31].total())
                                ret = ret.plus(layers.a.buyables[33].total())
                                if (hasUpgrade("c", 32)) ret = ret.plus(layers.a.buyables[32].total())
                                ret = ret.plus(layers.b.buyables[22].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[22] = player.a.buyables[22].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Math.log(bases[1])/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Math.log(bases[2])/Math.log(1.01)
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[22]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[22] = player.a.buyables[22].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        },
                },
                23: {
                        title: "Advanced",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " points</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("b", 42)) {
                                        extra = true
                                        a += "<h3>Against</h3>, "
                                }
                                if (hasUpgrade("c", 23)) {
                                        extra = true
                                        a += "<h3>Above</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 23)
                                return formatWhole(getBuyableAmount("a", 23)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e625")
                                let b1 = 1
                                let b2 = 7
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 23).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(1)
                                
                                let base = new Decimal(1e5)
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 23).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 42)) ret = ret.plus(layers.a.buyables[31].total())
                                if (hasUpgrade("c", 23)) ret = ret.plus(layers.a.buyables[32].total())
                                ret = ret.plus(layers.a.buyables[33].total())
                                ret = ret.plus(layers.b.buyables[23].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[23] = player.a.buyables[23].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[23]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[23] = player.a.buyables[23].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 12) || hasUnlockedPast("c")
                        },
                },
                31: {
                        title: "Against",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Amoebas</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("d", 14)) {
                                        extra = true
                                        a += "<h3>Above</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 31)
                                return formatWhole(getBuyableAmount("a", 31)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                let b0 = new Decimal("1e1805")
                                let b1 = new Decimal(1e5)
                                let b2 = 10
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 31).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(1)
                                
                                let base = new Decimal(1e5)
                                base = base.times(layers.b.buyables[22].effect())
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 31).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                ret = ret.plus(layers.b.challenges[12].rewardEffect())
                                ret = ret.plus(layers.a.buyables[33].total())
                                if (hasUpgrade("d", 14)) ret = ret.plus(layers.a.buyables[32].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[31] = player.a.buyables[31].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[31]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[31] = player.a.buyables[31].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        },
                },
                32: {
                        title: "Above",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: +" + format(this.effect(), 4) + " <h3>Access</h3> base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let scs = this.effect().gt(.5)
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "*x" + (scs ? " (softcapped)" : "") + "</b><br>"
                                let exformula = this.getExtraFormulaText()
                                
                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("d", 13)) {
                                        extra = true
                                        a += "<h3>D Upgrades</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 32)
                                return formatWhole(getBuyableAmount("a", 32)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e12086")
                                let b1 = new Decimal("1.5e99")
                                let b2 = 20
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 32).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(0)

                                let base = new Decimal(.01)
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                let ret = Decimal.times(base, x)

                                ret = softcap(ret, "a_buy32")

                                return ret
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 32).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                ret = ret.plus(layers.a.buyables[33].total())
                                if (hasUpgrade("d", 13)) ret = ret.plus(player.d.upgrades.length)
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[32] = player.a.buyables[32].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[32]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[32] = player.a.buyables[32].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 43) || hasUnlockedPast("c")
                        },
                },
                33: {
                        title: "Omnipotent I",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: +" + format(this.effect(), 4) + " <h3>B</h3> gain exp</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase(), 4) + "*x</b><br>"
                                let exformula = this.getExtraFormulaText()
                                
                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (false) {
                                        extra = true
                                        a += "<h3>nothing</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 33)
                                return formatWhole(getBuyableAmount("a", 33)) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e32099")
                                let b1 = Decimal.pow(10, 777)
                                let b2 = Decimal.pow(10, 22)
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("a", 33).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("a")) return new Decimal(0)

                                let base = new Decimal(.5)
                                if (hasUpgrade("b", 53)) base = base.plus(totalChallengeComps("b") / 10)
                                if (hasUpgrade("c", 35)) base = base.plus(layers.a.buyables[23].total().times(.0001))
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                let ret = Decimal.times(base, x)

                                return ret
                        },
                        canAfford(){
                                return player.a.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("a", 33).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("c", 31)) {
                                        ret = ret.plus(1)
                                        if (hasUpgrade("c", 32)) ret = ret.plus(1)
                                        if (hasUpgrade("c", 33)) ret = ret.plus(1)
                                        if (hasUpgrade("c", 34)) ret = ret.plus(1)
                                        if (hasUpgrade("c", 35)) ret = ret.plus(1)
                                }
                                ret = ret.plus(layers.b.challenges[21].rewardEffect())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.unlocked()) return 
                                if (!this.canAfford()) return
                                player.a.buyables[33] = player.a.buyables[33].plus(1)
                                
                                if (hasUpgrade("a", 35)) return 

                                player.a.points = player.a.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.a.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.a.buyables[33]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.a.buyables[33] = player.a.buyables[33].plus(diff)

                                if (hasUpgrade("a", 35) || diff.eq(0)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 51) || hasUnlockedPast("d")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("a", 23) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Amoebas is " + format(player.a.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("a")) return ""
                                                return "You have done " + formatWhole(player.a.times) + " Amoeba resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("a", 23)) return "You are gaining " + format(layers.a.getResetGain()) + " Amoebas per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.a.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("a", 23) && shiftDown) return "You are gaining " + format(layers.a.getResetGain()) + " Amoebas per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        },
                },
        },
        doReset(layer){
                if (layer == "a") player.a.time = 0
                if (!getsReset("a", layer)) return
                player.a.time = 0

                //upgrades
                let keep = []
                if (hasUpgrade("b", 13)) keep.push(11,12,13,14,15,21,22,23,24,25)
                if (hasUpgrade("b", 14)) keep.push(31,32,33,34,35,41,42,43,44,45)
                if (!hasUpgrade("c", 11)) player.a.upgrades = filter(player.a.upgrades, keep)

                //resources
                player.a.points = new Decimal(0)
                player.a.total = new Decimal(0)
                player.a.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.a.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("b", {
        name: "Bacteria", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#0B4CC3",
        branches: ["a"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Bacterias", // Name of prestige currency
        baseResource: "Amoebas", // Name of resource prestige is based on
        baseAmount() {return player.a.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("b") && player.b.best.eq(0)) ret = ret.min(1)

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e5)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("c", 25)) x = x.plus(1)
                if (hasUpgrade("d", 12)) x = x.plus(totalChallengeComps("b") ** 2)
                                         x = x.plus(layers.a.buyables[33].effect())
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(layers[LAYERS[i]].effect())
                        if (LAYERS[i] == "b") yet = true
                }

                x = x.times(layers.a.buyables[22].effect())
                x = x.times(layers.b.buyables[12].effect())

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("b")) return new Decimal(1)

                let amt = player.b.points

                let ret = amt.times(3).plus(1).sqrt()

                ret = softcap(ret, "b_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                player.b.best = player.b.best.max(player.b.points)
                if (hasUpgrade("b", 22)) {
                        player.b.points = player.b.points.plus(this.getResetGain().times(diff))
                        player.b.total = player.b.total.plus(this.getResetGain().times(diff))
                        player.b.autotimes += diff
                        if (player.b.autotimes > 3) player.b.autotimes = 3
                        if (player.b.autotimes > 1) {
                                player.b.autotimes += -1
                                player.b.times ++
                        }
                }
                if (hasUpgrade("b", 32)) {
                        let diffmult = 1
                        if (hasUpgrade("b", 45)) diffmult *= 2
                        player.b.abtime += diff * diffmult
                        
                        if (player.b.abtime > 10) player.b.abtime = 10
                        if (player.b.abtime > 1) {
                                player.b.abtime += -1
                                let amt = 1
                                if (hasUpgrade("b", 32)) {
                                        amt *= 2
                                        if (hasUpgrade("b", 31)) amt *= 2
                                        if (hasUpgrade("b", 33)) amt *= 2
                                        if (hasUpgrade("b", 34)) amt *= 2
                                        if (hasUpgrade("b", 35)) amt *= 2
                                }
                                if (layers.b.buyables[11].unlocked()) layers.b.buyables[11].buyMax(amt)
                                if (layers.b.buyables[12].unlocked()) layers.b.buyables[12].buyMax(amt)
                                if (layers.b.buyables[13].unlocked()) layers.b.buyables[13].buyMax(amt)
                                if (layers.b.buyables[21].unlocked()) layers.b.buyables[21].buyMax(amt)
                        }
                } else {
                        player.b.abtime = 0
                }
                player.b.time += diff
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "b", description: "Reset for Bacteria", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.a.best.gt(1e6) || player.b.best.gt(0) || hasUnlockedPast("b")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("b") || player.b.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.b.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.b.time >= 5 && !hasUpgrade("b", 22)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "By",
                        description: "Bacteria boosts Amoeba gain",
                        cost: new Decimal(2),
                        effect(){
                                let ret = player.b.points.plus(8).sqrt()
                                ret = softcap(ret, "b_upg11")

                                if (hasUpgrade("c", 11)) ret = ret.pow(2)
                                return ret
                        },
                        unlocked(){
                                return player.b.best.gte(1) || hasUnlockedPast("b")
                        }
                },
                12: {
                        title: "Be",
                        description: "Each Bacteria upgrade adds .1 to the <b>Any</b> gain base",
                        cost: new Decimal(3),
                        unlocked(){
                                return hasUpgrade("b", 11) || hasUnlockedPast("b")
                        }
                },
                13: {
                        title: "But",
                        description: "Keep the first two rows of Amoeba upgrades and unlock more",
                        cost: new Decimal(15),
                        unlocked(){
                                return hasUpgrade("b", 12) || hasUnlockedPast("b")
                        }
                },
                14: {
                        title: "Business",
                        description: "Keep the third and fourth rows of Amoeba upgrades and buy each Amoeba buyable once per second",
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }
                },
                15: {
                        title: "Been",
                        description: "<b>After</b> gives free levels to <b>Any</b>",
                        cost: new Decimal(5000),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }
                },
                21: {
                        title: "Back",
                        description: "<b>Business</b> can buy twice as much per this row upgrade and unlock a fourth Amoeba buyable",
                        cost: new Decimal(25000),
                        unlocked(){
                                return hasUpgrade("a", 35) || hasUnlockedPast("b")
                        }
                },
                22: {
                        title: "Buy",
                        description: "Remove the ability to prestige but gain 100% of Bacteria on prestige per second",
                        cost: new Decimal(5e4),
                        unlocked(){
                                return hasUpgrade("a", 41) || hasUnlockedPast("b")
                        }
                },
                23: {
                        title: "Best",
                        description: "Access gives free Any levels",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return hasUpgrade("b", 22) || hasUnlockedPast("b")
                        }
                },
                24: {
                        title: "Books",
                        description: "Unlock the fifth Amoeba buyable and each Amoeba upgrade gives a free <b>Any</b>",
                        cost: new Decimal(7e5),
                        unlocked(){
                                return hasUpgrade("b", 23) || hasUnlockedPast("b")
                        }
                },
                25: {
                        title: "Book",
                        description: "Access gives free After levels",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        }
                },
                31: {
                        title: "Before",
                        description: "Unlock a Bacteria buyable and get a free <b>Account</b>",
                        cost: new Decimal(1e15),
                        unlocked(){
                                return hasUpgrade("c", 13) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 31)
                },
                32: {
                        title: "Between",
                        description: "Autobuy <b>B</b> buyables once per second and each upgrade in this row allows <b>A</b> and <b>B</b> autobuyers to buy 2x more",
                        cost: new Decimal(5e68),
                        unlocked(){
                                return hasUpgrade("a", 54) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 32)
                },
                33: {
                        title: "Black",
                        description: "<b>Against</b> gives free <b>Account</b> levels",
                        cost: new Decimal(1e73),
                        unlocked(){
                                return hasUpgrade("a", 55) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 33)
                },
                34: {
                        title: "Being",
                        description: "<b>Based</b> gives free <b>Because</b> levels",
                        cost: new Decimal(3e173),
                        unlocked(){
                                return hasUpgrade("b", 33) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 34)
                },
                35: {
                        title: "Both",
                        description: "Unlock the first Bacteria challenge",
                        cost: new Decimal(5e180),
                        unlocked(){
                                return hasUpgrade("c", 14) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 35)
                },
                41: {
                        title: "Board",
                        description: "Each <b>All</b> adds .001 to <b>Based</b> base",
                        cost: new Decimal(1e196),
                        unlocked(){
                                return challengeCompletions("b", 11) >= 1 || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 41)
                },
                42: {
                        title: "Box",
                        description: "<b>Against</b> gives free <b>Advanced</b> levels",
                        cost: new Decimal(1e201),
                        unlocked(){
                                return hasUpgrade("b", 41) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 42)
                },
                43: {
                        title: "Better",
                        description: "Unlock the eigth Amoeba buyable",
                        cost: new Decimal("5e415"),
                        unlocked(){
                                return hasUpgrade("b", 42) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 43)
                },
                44: {
                        title: "Below",
                        description: "<b>Above</b> gives free <b>Access</b> levels",
                        cost: new Decimal("5e425"),
                        unlocked(){
                                return hasUpgrade("b", 43) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 44)
                },
                45: {
                        title: "Blog",
                        description: "<b>A</b> and <b>B</b> autobuyers trigger twice as often",
                        cost: new Decimal("5e476"),
                        unlocked(){
                                return (hasUpgrade("b", 44) && hasUpgrade("c", 15)) || hasUnlockedPast("c")
                        }, //hasUpgrade("b", 45)
                },
                51: {
                        title: "Browse",
                        description: "Unlock the final <b>A</b> buyable, <b>Omnipotent I</b>, which gives free levels to all <b>A</b> buyables",
                        cost: new Decimal("1e1104"),
                        unlocked(){
                                return hasUpgrade("c", 12) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 51)
                },
                52: {
                        title: "Building",
                        description: "Each <b>C</b> upgrade adds .2 to the <b>C</b> gain exponent and <b>B</b> buyables cost nothing",
                        cost: new Decimal("1e1252"),
                        unlocked(){
                                return hasUpgrade("b", 51) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 52)
                },
                53: {
                        title: "Blue",
                        description: "Unlock two <b>B</b> buyables and each <b>B</b> challenge completion adds .1 to the <b>Omnipotent I</b> base",
                        cost: new Decimal("1e1259"),
                        unlocked(){
                                return hasUpgrade("b", 52) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 53)
                },
                54: {
                        title: "Bill",
                        description: "<b>Become</b> gives free <b>Based</b> and <b>Because</b> levels",
                        cost: new Decimal("1e7576"),
                        unlocked(){
                                return hasUpgrade("c", 34) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 54)
                },
                55: {
                        title: "Bad",
                        description: "Unlock two new <b>B</b> buyables which both give free levels to <b>Baby</b> levels",
                        cost: new Decimal("1e11063"),
                        unlocked(){
                                return hasUpgrade("c", 35) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 55)
                },
                /*
                Basic
                Brand
                Bit
                Base
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Because",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " points</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("b", 34)) {
                                        extra = true
                                        a += "<h3>Based</h3>, "
                                }
                                if (hasUpgrade("b", 54)) {
                                        extra = true
                                        a += "<h3>Become</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 11)
                                return getBuyableAmount("b", 11) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 1e15
                                let b1 = 4
                                let b2 = 1.5
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("b", 11).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("b")) return new Decimal(1)

                                let base = new Decimal(1e20)
                                if (hasUpgrade("c", 21)) base = base.times(layers.a.buyables[12].total().max(1).pow(2))
                                base = base.times(layers.b.buyables[23].effect())
                                return base
                        },
                        effect(){
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.b.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("b", 11).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 34)) ret = ret.plus(layers.b.buyables[12].total())
                                if (hasUpgrade("b", 54)) ret = ret.plus(layers.b.buyables[13].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[11] = player.b.buyables[11].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.b.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.b.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.b.buyables[11]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)

                                player.b.buyables[11] = player.b.buyables[11].plus(diff)

                                if (hasUpgrade("b", 52) || diff.eq(0)) return 
                                player.b.points = player.b.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 31) || hasUnlockedPast("c")
                        },
                },
                12: {
                        title: "Based",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Bacteria</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>(" + format(this.effectBase()) + "+x)^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("c", 15)) {
                                        extra = true
                                        a += "<h3>B Upgrades</h3>, "
                                }
                                if (hasUpgrade("c", 34)) {
                                        extra = true
                                        a += "<h3>Baby</h3>, "
                                }
                                if (hasUpgrade("b", 54)) {
                                        extra = true
                                        a += "<h3>Become</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 12)
                                return getBuyableAmount("b", 12) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 1e71
                                let b1 = 10
                                let b2 = 2
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("b", 12).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let base = new Decimal(10)
                                if (hasUpgrade("b", 41)) base = base.plus(layers.a.buyables[11].total().div(1000))
                                return base
                        },
                        effect(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base.plus(x), x)
                        },
                        canAfford(){
                                return player.b.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("b", 12).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                ret = ret.plus(layers.b.challenges[11].rewardEffect())
                                if (hasUpgrade("c", 15)) ret = ret.plus(player.b.upgrades.length)
                                if (hasUpgrade("c", 34)) ret = ret.plus(layers.b.buyables[21].total())
                                if (hasUpgrade("b", 54)) ret = ret.plus(layers.b.buyables[13].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[12] = player.b.buyables[12].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.b.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.b.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.b.buyables[12]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.b.buyables[12] = player.b.buyables[12].plus(diff)

                                if (hasUpgrade("b", 52) || diff.eq(0)) return 
                                player.b.points = player.b.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 55) || hasUnlockedPast("c")
                        },
                },
                13: {
                        title: "Become",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Circles</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("c", 34)) {
                                        extra = true
                                        a += "<h3>Baby</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 13)
                                return getBuyableAmount("b", 13) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e1270")
                                let b1 = 1
                                let b2 = 5
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("b", 13).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let base = new Decimal(5)
                                return base
                        },
                        effect(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.b.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("b", 13).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("c", 34)) ret = ret.plus(layers.b.buyables[21].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[13] = player.b.buyables[13].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.b.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.b.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.b.buyables[13]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.b.buyables[13] = player.b.buyables[13].plus(diff)

                                if (hasUpgrade("b", 52) || diff.eq(0)) return 
                                player.b.points = player.b.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        },
                },
                21: {
                        title: "Baby",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Amoebas</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (hasUpgrade("b", 55)) {
                                        extra = true
                                        a += "<h3>Bank</h3>, "
                                        a += "<h3>Beauty</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 21)
                                return getBuyableAmount("b", 21) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e1421")
                                let b1 = 1e28
                                let b2 = 100
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("b", 21).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let base = new Decimal(1.11e111)
                                return base
                        },
                        effect(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.b.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("b", 21).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 55)) ret = ret.plus(layers.b.buyables[22].total())
                                if (hasUpgrade("b", 55)) ret = ret.plus(layers.b.buyables[23].total())
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[21] = player.b.buyables[21].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.b.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.b.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.b.buyables[21]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.b.buyables[21] = player.b.buyables[21].plus(diff)

                                if (hasUpgrade("b", 52) || diff.eq(0)) return 
                                player.b.points = player.b.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        },
                },
                22: {
                        title: "Bank",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Against base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^sqrt(x)</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (false) {
                                        extra = true
                                        a += "<h3>lul</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 22)
                                return getBuyableAmount("b", 22) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e11066")
                                let b1 = new Decimal("1e425")
                                let b2 = 1e10
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("b", 22).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let base = new Decimal(1e5)
                                return base
                        },
                        effect(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x.sqrt())
                        },
                        canAfford(){
                                return player.b.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("b", 22).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[22] = player.b.buyables[22].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.b.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.b.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.b.buyables[22]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.b.buyables[22] = player.b.buyables[22].plus(diff)

                                if (hasUpgrade("b", 52) || diff.eq(0)) return 
                                player.b.points = player.b.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        },
                },
                23: {
                        title: "Beauty",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " Because base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let exformula = this.getExtraFormulaText()

                                let end = shiftDown ? eformula + exformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getExtraFormulaText(){
                                let a = "<b><h2>Extra levels from</h2>:<br>"
                                let extra = false
                                if (false) {
                                        extra = true
                                        a += "<h3>lul</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 23)
                                return getBuyableAmount("b", 23) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = new Decimal("1e11487")
                                let b1 = new Decimal("1e154")
                                let b2 = 1e12
                                return [b0, b1, b2]
                        },
                        cost(add){
                                let x = getBuyableAmount("b", 23).plus(add)
                                let bases = this.getBases()
                                let base0 = bases[0]
                                let base1 = bases[1]
                                let base2 = bases[2]
                                let exp0 = 1
                                let exp1 = x
                                let exp2 = x.times(x)

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
                        },
                        effectBase(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let base = new Decimal(1e10)
                                return base
                        },
                        effect(){
                                if (!isBuyableActive("b")) return new Decimal(1)
                                
                                let x = this.total()
                                let base = this.effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.b.points.gte(this.cost())
                        },
                        total(){
                                return getBuyableAmount("b", 23).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[23] = player.b.buyables[23].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                let bases = this.getBases()
                                if (!this.unlocked()) return 
                                if (player.b.points.lt(bases[0])) return

                                // let exp2 = x.times(x)
                                let pttarget = player.b.points.div(bases[0]).log(1.01)
                                let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor
                                let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))
                                // let a = 1 this is constant so remove it

                                let target = c.times(a).times(4).plus(b * b).sqrt().minus(b).div(2).div(a).floor().plus(1)
                                //-b + sqrt(b*b+4*c*a)

                                let diff = target.minus(player.b.buyables[23]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                
                                player.b.buyables[23] = player.b.buyables[23].plus(diff)

                                if (hasUpgrade("b", 52) || diff.eq(0)) return 
                                player.b.points = player.b.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Big",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free <b>Based</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 11)
                                return Math.pow(c, 3) + c * 5
                        },
                        goal(){
                                let init = new Decimal("1e2456")
                                let factor = getChallengeFactor(challengeCompletions("b", 11))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("b", 35) || hasUnlockedPast("c")
                        },
                        currencyInternalName: "points",
                        completionLimit: 1000,
                },
                12: {
                        name: "Body",
                        challengeDescription: "<b>Big</b> and <b>And</b> effect is 1",
                        rewardDescription: "Give free <b>Against</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 12)
                                return Math.pow(c, 3) + c * 5
                        },
                        goal(){
                                let init = new Decimal("1e4992")
                                let factor = getChallengeFactor(challengeCompletions("b", 12))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 24) || hasUnlockedPast("c")
                        },
                        currencyInternalName: "points",
                        completionLimit: 1000,
                        countsAs: [11],
                },
                21: {
                        name: "Beach",
                        challengeDescription: "<b>Body</b> and all previous prestige effects are 1",
                        rewardDescription: "Give free <b>Omnipotent I</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 21)
                                return Math.pow(c, 3) + Math.pow(c, 2) * 5 + c * 9
                        },
                        goal(){
                                let init = new Decimal("1e14666")
                                let factor = getChallengeFactor(challengeCompletions("b", 21))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 33) || hasUnlockedPast("d")
                        },
                        currencyInternalName: "points",
                        completionLimit: 1000,
                        countsAs: [11, 12],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("b", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                let a = hasUnlockedPast("b") ? "" : "You have done " + formatWhole(player.b.times) + " Bacteria resets<br>"
                                                if (hasUpgrade("b", 22)) return a + "You are gaining " + format(layers.b.getResetGain()) + " Bacteria per second"
                                                return a + "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.b.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (!shiftDown || !hasUpgrade("b", 22)) return ""
                                                return "You are gaining " + format(layers.b.getResetGain()) + " Bacteria per second"
                                        }
                                ],
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("b", 31) || hasUnlockedPast("c")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("b")) + " Bacteria Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("b", 35) || hasUnlockedPast("c")
                        },
                },
        },
        doReset(layer){
                if (layer == "b") player.b.time = 0
                if (!getsReset("b", layer)) return
                player.b.time = 0

                //upgrades
                let keep = []
                if (hasUpgrade("c", 12)) keep.push(11,12,13,14,15,21,22,23,24,25,31,32,33,34,35)
                if (hasUpgrade("c", 15)) keep.push(41,42,43,44,45)
                if (!hasUpgrade("d", 11)) player.b.upgrades = filter(player.b.upgrades, keep)

                //resources
                player.b.points = new Decimal(0)
                player.b.total = new Decimal(0)
                player.b.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.b.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("c", {
        name: "Circles", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#CBCCC3",
        branches: ["b"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Circles", // Name of prestige currency
        baseResource: "Bacterias", // Name of resource prestige is based on
        baseAmount() {return player.b.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("c") && player.c.best.eq(0)) ret = ret.min(1)

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("c", 25)) x = x.plus(1)
                if (hasUpgrade("b", 52)) x = x.plus(player.c.upgrades.length * .2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(layers[LAYERS[i]].effect())
                        if (LAYERS[i] == "c") yet = true
                }

                if (hasUpgrade("c", 23)) x = x.times(player.c.upgrades.length).max(x)
                                         x = x.times(getBuyableEffect("b", 13))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("c")) return new Decimal(1)
                
                let amt = player.c.points

                let ret = amt.times(8).plus(1).sqrt()

                ret = softcap(ret, "c_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                player.c.best = player.c.best.max(player.c.points)
                if (hasUpgrade("c", 22)) {
                        player.c.points = player.c.points.plus(this.getResetGain().times(diff))
                        player.c.total = player.c.total.plus(this.getResetGain().times(diff))
                        player.c.autotimes += diff
                        if (player.c.autotimes > 3) player.c.autotimes = 3
                        if (player.c.autotimes > 1) {
                                player.c.autotimes += -1
                                player.c.times ++
                        }
                }
                if (false) {
                        player.c.abtime += diff
                        if (player.c.abtime > 10) player.c.abtime = 10
                } else {
                        player.c.abtime = 0
                }
                player.c.time += diff
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "c", description: "Reset for Circles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.b.best.gt(5e10) || player.c.best.gt(0) || hasUnlockedPast("c")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("c") || player.c.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.c.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.c.time >= 5 && !hasUpgrade("c", 22)
        },
        upgrades:{
                rows: 5,
                cols: 5,
                11: {
                        title: "Can",
                        description: "Keep all Amoeba upgrades, square <b>And</b> and <b>By</b>",
                        cost: new Decimal(3),
                        unlocked(){ 
                                return player.c.best.gte(4) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 11)
                },
                12: {
                        title: "Contact",
                        description: "Keep three rows of Bacteria upgrades, raise <b>At</b> effect to the number of Bacteria upgrades, and unlock a Amoeba buyable",
                        cost: new Decimal(3),
                        unlocked(){ 
                                return hasUpgrade("c", 11) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 12)
                },
                13: {
                        title: "Click",
                        description: "<b>Advanced</b> gives free <b>Access</b> levels",
                        cost: new Decimal(20),
                        unlocked(){ 
                                return hasUpgrade("c", 12) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 13)
                },
                14: {
                        title: "City",
                        description: "Remove the first Bacteria effect softcap",
                        cost: new Decimal(5e4),
                        unlocked(){ 
                                return hasUpgrade("b", 34) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 14)
                },
                15: {
                        title: "Copyright",
                        description: "Each Bacteria upgrade gives a free <b>Based</b> level and keep the fourth row of Bacteria upgrades",
                        cost: new Decimal(3e5),
                        unlocked(){ 
                                return player.ach.achievements.includes("34") || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 15)
                },
                21: {
                        title: "Company",
                        description: "Total <b>Any</b> buyables squared multiply <b>Because</b> base",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("b", 45) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 21)
                },
                22: {
                        title: "Company",
                        description: "Remove the ability to prestige but gain 100% of Circles on prestige per second",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("c", 21) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 22)
                },
                23: {
                        title: "Company",
                        description: "<b>Above</b> gives free <b>Advanced</b> levels and multiply Circle gain by the number of Circle upgrades",
                        cost: new Decimal(3e6),
                        unlocked(){ 
                                return hasUpgrade("c", 22) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 23)
                },
                24: {
                        title: "Could",
                        description: "Unlock the second Bacteria Challenge",
                        cost: new Decimal(5e7),
                        unlocked(){ 
                                return hasUpgrade("c", 23) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 24)
                },
                25: {
                        title: "Center",
                        description: "Add 1 to the <b>B</b> and <b>C</b> gain exponents",
                        cost: new Decimal(1e8),
                        unlocked(){ 
                                return challengeCompletions("b", 12) >= 1 || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 25)
                },
                31: {
                        title: "Comments",
                        description: "Gain a free <b>Omnipotent I</b> level per ugprade in this row",
                        cost: new Decimal(2e19),
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 31)
                },
                32: {
                        title: "Car",
                        description: "<b>Above</b> gives free <b>Account</b> levels",
                        cost: new Decimal(1e31),
                        unlocked(){ 
                                return player.ach.achievements.includes("43") || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 32)
                },
                33: {
                        title: "Community",
                        description: "Unlock a third <b>B</b> challenge and <b>Advanced</b> gives free <b>After</b> levels",
                        cost: new Decimal(2e79),
                        unlocked(){ 
                                return hasUpgrade("c", 32) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 33)
                },
                34: {
                        title: "Code",
                        description: "<b>Baby</b> gives free <b>Become</b> and <b>Based</b> levels",
                        cost: new Decimal(2e88),
                        unlocked(){ 
                                return hasUpgrade("c", 33) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 34)
                },
                35: {
                        title: "Check",
                        description: "Each <b>Advanced</b> adds .0001 to the <b>Omnipotent I</b> base",
                        cost: new Decimal(1e153),
                        unlocked(){ 
                                return hasUpgrade("c", 34) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 35)
                },

                /*
                Case
                County
                Care
                Computer
                Current
                Control
                Change
                */
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("c", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Circles is " + format(player.c.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("c")) return ""
                                                return "You have done " + formatWhole(player.c.times) + " Circle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("c", 22)) return "You are gaining " + format(layers.c.getResetGain()) + " Circles per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.c.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false || hasUnlockedPast("d")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("c")) + " Circle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false || hasUnlockedPast("d")
                        },
                },
        },
        doReset(layer){
                if (layer == "c") player.c.time = 0
                if (!getsReset("c", layer)) return
                player.c.time = 0

                //upgrades
                let keep = []
                if (hasUpgrade("d", 11)) keep.push(11,12,13,14,15,21,22,23,24,25,31,32,33,34,35)
                player.c.upgrades = filter(player.c.upgrades, keep)

                //resources
                player.c.points = new Decimal(0)
                player.c.total = new Decimal(0)
                player.c.best = new Decimal(0)

                //buyables
                let resetBuyables = [/*11, 12, 13*/]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.c.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("d", {
        name: "Doodles", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#003333",
        branches: ["c"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Doodles", // Name of prestige currency
        baseResource: "Circles", // Name of resource prestige is based on
        baseAmount() {return player.c.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let a = pts.div(div)
                if (a.lt(1)) return new Decimal(0)

                let ret = a.log10().times(pre).pow(exp).times(pst)

                if (!hasUnlockedPast("d") && player.d.best.eq(0)) ret = ret.min(1)

                return ret.floor()
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)

                let yet = false
                for (let i = 0; i < LAYERS.length; i++){
                        if (layers[LAYERS[i]].row == "side") continue
                        if (yet) x = x.times(layers[LAYERS[i]].effect())
                        if (LAYERS[i] == "d") yet = true
                }


                return x
        },
        effect(){
                if (!isPrestigeEffectActive("d")) return new Decimal(1)

                let amt = player.d.points

                let ret = amt.times(15).plus(1).sqrt()

                ret = softcap(ret, "d_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                player.d.best = player.d.best.max(player.d.points)
                if (false) {
                        player.d.points = player.d.points.plus(this.getResetGain().times(diff))
                        player.d.total = player.d.total.plus(this.getResetGain().times(diff))
                        player.d.autotimes += diff
                        if (player.d.autotimes > 3) player.d.autotimes = 3
                        if (player.d.autotimes > 1) {
                                player.d.autotimes += -1
                                player.d.times ++
                        }
                }
                if (false) {
                        player.d.abtime += diff
                        if (player.d.abtime > 10) player.d.abtime = 10
                } else {
                        player.d.abtime = 0
                }
                player.d.time += diff
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "d", description: "Reset for Doodles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.c.best.gt(5e10) || player.d.best.gt(0) || hasUnlockedPast("d")},
        prestigeButtonText(){
                let gain= this.getResetGain()
                let pts = this.baseAmount()
                let pre = this.getGainMultPre()
                let exp = this.getGainExp()
                let pst = this.getGainMultPost()
                let div = this.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6) && (hasUnlockedPast("d") || player.d.best.neq(0))) {
                        nextAt = "<br>Next at " + format(nextnum) + " " + this.baseResource
                        let ps = gain.div(player.c.time || 1)

                        if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                        else nextAt += "<br>" + format(ps) + "/s"
                }

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                return a + nextAt
        },
        canReset(){
                return this.getResetGain().gt(0) && player.d.time >= 5 && !false
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Do",
                        description: "Keep <b>B</b> and three rows of <b>C</b> upgrades and <b>Above</b> adds to the <b>All</b> base",
                        cost: new Decimal(4),
                        unlocked(){ 
                                return player.ach.achievements.includes("41") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 11)
                },
                12: {
                        title: "Date",
                        description: "<b>B</b> challenge completions squared add to the <b>B</b> gain formula exponent",
                        cost: new Decimal(4),
                        unlocked(){ 
                                return hasUpgrade("d", 11) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 12)
                },
                13: {
                        title: "Day",
                        description: "Each <b>D</b> upgrade gives a free <b>Above</b> level",
                        cost: new Decimal(500),
                        unlocked(){ 
                                return hasUpgrade("c", 32) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 13)
                },
                14: {
                        title: "Data",
                        description: "<b>Above</b> gives free <b>Against</b> levels",
                        cost: new Decimal(2000),
                        unlocked(){ 
                                return hasUpgrade("d", 13) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 14)
                },

                /*
                does

                */
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Doodles is " + format(player.d.best) : ""}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("d")) return ""
                                                return "You have done " + formatWhole(player.d.times) + " Doodle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (false) return "You are gaining " + format(layers.d.getResetGain()) + " Doodles per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.d.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false || hasUnlockedPast("d")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                return "You have completed " + formatWhole(totalChallengeComps("d")) + " Doodle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false || hasUnlockedPast("d")
                        },
                },
        },
        doReset(layer){
                if (layer == "d") player.d.time = 0
                if (!getsReset("d", layer)) return
                player.d.time = 0

                //upgrades
                let keep = []
                player.d.upgrades = filter(player.d.upgrades, keep)

                //resources
                player.d.points = new Decimal(0)
                player.d.total = new Decimal(0)
                player.d.best = new Decimal(0)

                //buyables
                let resetBuyables = [/*11, 12, 13*/]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.d.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("ach", {
        name: "Goals", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "⭑", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#FFC746",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Goals", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return new Decimal(0)
        },
        getBaseDiv(){
                let x = new Decimal(1)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                return x
        },
        effect(){
                return new Decimal(1)
        },
        effectDescription(){
                return ""
        },
        update(diff){
                player.ach.points = new Decimal(player.ach.achievements.length)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: {
                rows: 5,
                cols: 7,
                11: {
                        name: "One",
                        done(){
                                return PROGRESSION_MILESTONES[1]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[1]
                        },
                },
                12: {
                        name: "Two",
                        done(){
                                return PROGRESSION_MILESTONES[2]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[2]
                        },
                },
                13: {
                        name: "Three",
                        done(){
                                return PROGRESSION_MILESTONES[3]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[3]
                        },
                },
                14: {
                        name: "Four",
                        done(){
                                return PROGRESSION_MILESTONES[4]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[4]
                        },
                },
                15: {
                        name: "Five",
                        done(){
                                return PROGRESSION_MILESTONES[5]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[5]
                        },
                },
                16: {
                        name: "Six",
                        done(){
                                return PROGRESSION_MILESTONES[6]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[6]
                        },
                },
                17: {
                        name: "Seven",
                        done(){
                                return PROGRESSION_MILESTONES[7]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[7]
                        },
                },
                21: {
                        name: "Eight",
                        done(){
                                return PROGRESSION_MILESTONES[8]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[8]
                        },
                },
                22: {
                        name: "Nine",
                        done(){
                                return PROGRESSION_MILESTONES[9]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[9]
                        },
                },
                23: {
                        name: "Ten",
                        done(){
                                return PROGRESSION_MILESTONES[10]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[10]
                        },
                },
                24: {
                        name: "Eleven",
                        done(){
                                return PROGRESSION_MILESTONES[11]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[11]
                        },
                },
                25: {
                        name: "Twelve",
                        done(){
                                return PROGRESSION_MILESTONES[12]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[12]
                        },
                },
                26: {
                        name: "Thirteen",
                        done(){
                                return PROGRESSION_MILESTONES[13]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[13]
                        },
                },
                27: {
                        name: "Fourteen",
                        done(){
                                return PROGRESSION_MILESTONES[14]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[14]
                        },
                },
                31: {
                        name: "Fifteen",
                        done(){
                                return PROGRESSION_MILESTONES[15]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[15]
                        },
                },
                32: {
                        name: "Sixteen",
                        done(){
                                return PROGRESSION_MILESTONES[16]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[16]
                        },
                },
                33: {
                        name: "Seventeen",
                        done(){
                                return PROGRESSION_MILESTONES[17]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[17]
                        },
                },
                34: {
                        name: "Eighteen",
                        done(){
                                return PROGRESSION_MILESTONES[18]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[18]
                        },
                },
                35: {
                        name: "Nineteen",
                        done(){
                                return PROGRESSION_MILESTONES[19]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[19]
                        },
                },
                36: {
                        name: "Twenty",
                        done(){
                                return PROGRESSION_MILESTONES[20]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[20]
                        },
                },
                37: {
                        name: "Twenty-one",
                        done(){
                                return PROGRESSION_MILESTONES[21]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[21]
                        },
                },
                41: {
                        name: "Twenty-two",
                        done(){
                                return PROGRESSION_MILESTONES[22]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[22]
                        },
                },
                42: {
                        name: "Twenty-three",
                        done(){
                                return PROGRESSION_MILESTONES[23]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[23]
                        },
                },
                43: {
                        name: "Twenty-four",
                        done(){
                                return PROGRESSION_MILESTONES[24]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[24]
                        },
                },
                44: {
                        name: "Twenty-five",
                        done(){
                                return PROGRESSION_MILESTONES[25]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[25]
                        },
                },
                45: {
                        name: "Twenty-six",
                        done(){
                                return PROGRESSION_MILESTONES[26]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[26]
                        },
                },
                46: {
                        name: "Twenty-seven",
                        done(){
                                return PROGRESSION_MILESTONES[27]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[27]
                        },
                },
                47: {
                        name: "Twenty-eight",
                        done(){
                                return PROGRESSION_MILESTONES[28]()
                        },
                        tooltip() {
                                return "Get " + PROGRESSION_MILESTONES_TEXT[28]
                        },
                },
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "achievements"
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
})
