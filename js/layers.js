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

                return x
        },
        effect(){
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
                if (hasUpgrade("a", 23)) {
                        player.a.points = player.a.points.plus(this.getResetGain().times(diff))
                        player.a.best = player.a.best.max(player.a.points)
                        player.a.total = player.a.total.plus(this.getResetGain().times(diff))
                        player.a.autotimes += diff
                        if (player.a.autotimes > 3) player.a.autotimes = 3
                        if (player.a.autotimes > 1) {
                                player.a.autotimes += -1
                                player.a.times ++
                        }
                }
                if (hasUpgrade("b", 14)) {
                        player.a.abtime += diff
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
                                layers.a.buyables[11].buyMax(amt)
                                layers.a.buyables[12].buyMax(amt)
                                layers.a.buyables[13].buyMax(amt)
                                layers.a.buyables[21].buyMax(amt)
                                layers.a.buyables[22].buyMax(amt)
                        }
                } else {
                        player.a.abtime = 0
                }
                player.a.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
                return this.getResetGain().gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "And",
                        description: "Amoebas boost point gain",
                        cost: new Decimal(2),
                        effect(){
                                let exp = 3
                                if (hasUpgrade("a", 21)) exp += player.a.upgrades.length * .5

                                if (hasUpgrade("a", 44)) exp *= exp

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
                                
                                return Decimal.pow(base, player.a.upgrades.length)
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
                        title: "Area",
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
                        cost: new Decimal(1e197),
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
                //advanced
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
                                return getBuyableAmount("a", 11) + "+" + formatWhole(extra)
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
                                let base = new Decimal(1.5)
                                if (hasUpgrade("a", 34)) base = base.plus(layers.a.buyables[13].total().div(100))
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

                                if (hasUpgrade("a", 35)) return 
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
                                        a += "<h3>Amoeba Upgrades</h3>, "
                                }
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 12)
                                return getBuyableAmount("a", 12) + "+" + formatWhole(extra)
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
                                let base = new Decimal(1.1)
                                if (hasUpgrade("b", 12)) base = base.plus(Decimal.div(player.b.upgrades.length, 10))
                                if (hasUpgrade("a", 43)) base = base.plus(layers.a.buyables[22].total().div(20))
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

                                if (hasUpgrade("a", 35)) return 
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
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 13)
                                return getBuyableAmount("a", 13) + "+" + formatWhole(extra)
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

                                if (hasUpgrade("a", 35)) return 
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
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 21)
                                return getBuyableAmount("a", 21) + "+" + formatWhole(extra)
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
                                let base = new Decimal(1)
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

                                if (hasUpgrade("a", 35)) return 
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
                                if (!extra) return ""
                                return a.slice(0,a.length-2)
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("a", 22)
                                return getBuyableAmount("a", 22) + "+" + formatWhole(extra)
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

                                if (hasUpgrade("a", 35)) return 
                                player.a.points = player.a.points.sub(this.cost(-1)).max(0)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
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
                                                return ""
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
                player.a.upgrades = filter(player.a.upgrades, keep)

                //resources
                player.a.points = new Decimal(0)
                player.a.total = new Decimal(0)
                player.a.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21]
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

                return x
        },
        effect(){
                let amt = player.b.points

                let ret = amt.plus(1).sqrt()

                ret = softcap(ret, "b_eff")

                return ret
        },
        effectDescription(){
                let eff = this.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                if (hasUpgrade("b", 22)) {
                        player.b.points = player.b.points.plus(this.getResetGain().times(diff))
                        player.b.best = player.b.best.max(player.b.points)
                        player.b.total = player.b.total.plus(this.getResetGain().times(diff))
                        player.b.autotimes += diff
                        if (player.b.autotimes > 3) player.b.autotimes = 3
                        if (player.b.autotimes > 1) {
                                player.b.autotimes += -1
                                player.b.times ++
                        }
                }
                if (false) {
                        player.b.abtime += diff
                        if (player.b.abtime > 10) player.b.abtime = 10
                } else {
                        player.b.abtime = 0
                }
                player.b.time += diff
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
                return this.getResetGain().gt(0)
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
                        description: "Keep the third and fourht rows of Amoeba upgrades and buy each Amoeba buyable once per second",
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

                //before
                //because
                //between
                //based
                //black
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "b1",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " points</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 11)
                                return getBuyableAmount("b", 11) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 500
                                let b1 = 2
                                let b2 = 1.001
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
                                let base = new Decimal(1.5)
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
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[11] = player.b.buyables[11].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                return
                                /*
                                if (player.i.points.lt(10)) return
                                if (player.i.points.lt(20)) {
                                        layers.i.buyables[11].buy()
                                        return
                                }
                                let base1 = (hasIUpg(22) ? 1 : 2 / 1.01) 
                                //this wont quite work if we are buying the very first one and only the very first one

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(10).log(1.01)
                                let bfactor = Math.log(base1)/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor - 1
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                target = target.min(5e5)

                                let diff = target.minus(player.i.buyables[11]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.i.buyables[11] = player.i.buyables[11].plus(diff)
                                */
                        },
                        unlocked(){ 
                                return false || hasUnlockedPast("b")
                        },
                },
                12: {
                        title: "b2",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + this.getAmountDisplay() + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " idfk</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Bacteria</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getAmountDisplay(){
                                let extra = this.extra()
                                if (extra.eq(0)) return getBuyableAmount("b", 12)
                                return getBuyableAmount("b", 12) + "+" + formatWhole(extra)
                        },
                        getBases(){
                                //currently an example
                                let b0 = 1e4
                                let b1 = 3
                                let b2 = 1.005
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
                                let base = new Decimal(1.1)
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
                                return getBuyableAmount("b", 12).plus(this.extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.b.buyables[12] = player.b.buyables[12].plus(1)
                                player.b.points = player.b.points.minus(cost)
                        },
                        buyMax(maximum){
                                return
                                /*
                                if (player.i.points.lt(10)) return
                                if (player.i.points.lt(20)) {
                                        layers.i.buyables[11].buy()
                                        return
                                }
                                let base1 = (hasIUpg(22) ? 1 : 2 / 1.01) 
                                //this wont quite work if we are buying the very first one and only the very first one

                                // let exp2 = x.times(x)
                                let pttarget = player.a.points.div(10).log(1.01)
                                let bfactor = Math.log(base1)/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget
                                let b = bfactor - 1
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                target = target.min(5e5)

                                let diff = target.minus(player.i.buyables[11]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.i.buyables[11] = player.i.buyables[11].plus(diff)
                                */
                        },
                        unlocked(){ 
                                return false || hasUnlockedPast("b")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("b", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (hasUnlockedPast("b")) return ""
                                                return "You have done " + formatWhole(player.b.times) + " Bacteria resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (hasUpgrade("b", 22)) return "You are gaining " + format(layers.b.getResetGain()) + " Bacteria per second"
                                                return ""
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
                                return false || hasUnlockedPast("c")
                        },
                },
        },
        doReset(layer){
                if (layer == "b") player.b.time = 0
                if (!getsReset("b", layer)) return
                player.b.time = 0

                //upgrades
                let keep = []
                player.b.upgrades = filter(player.b.upgrades, keep)

                //resources
                player.b.points = new Decimal(0)
                player.b.total = new Decimal(0)
                player.b.best = new Decimal(0)

                //buyables
                let resetBuyables = [/*11, 12, 13*/]
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

                return x
        },
        effect(){
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
                if (false) {
                        player.c.points = player.c.points.plus(this.getResetGain().times(diff))
                        player.c.best = player.c.best.max(player.c.points)
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
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
                return this.getResetGain().gt(0)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}],
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
                                                if (false) return "You are gaining " + format(layers.c.getResetGain()) + " Circles per second"
                                                return ""
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
                                return false || hasUnlockedPast("c")
                        },
                },
        },
        doReset(layer){
                if (layer == "c") player.c.time = 0
                if (!getsReset("c", layer)) return
                player.c.time = 0

                //upgrades
                let keep = []
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


addLayer("ach", {
        name: "Milestones", // This is optional, only used in a few places, If absent it just uses the layer id.
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
        resource: "Milestones", // Name of prestige currency
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
