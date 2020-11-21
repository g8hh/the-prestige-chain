function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)

        for (let i = 0; i < LAYERS.length; i++){
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
                if (layerPrestiging == order[i]) return false
                if (layer == order[i]) return true
        }
        return false
}

function hasUnlockedPast(layer){
        let on = false
        for (let i = 0; i < LAYERS.length; i++) {
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
                if (false) {
                        player.a.abtime += diff
                        if (player.a.abtime > 10) player.a.abtime = 10
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
                                return Decimal.pow(1.2, player.a.upgrades.length)
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
                                return player.a.points.plus(10).log10()
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
                                return "3 -> " + formatWhole(3 + player.a.upgrades.length * .5)
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
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
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
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.a.buyables[11] = player.a.buyables[11].plus(1)
                                player.a.points = player.a.points.minus(cost)
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
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
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
                                return ret
                        },
                        buy(){
                                let cost = this.cost()
                                if (!this.canAfford()) return
                                player.a.buyables[12] = player.a.buyables[12].plus(1)
                                player.a.points = player.a.points.minus(cost)
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
                                return hasUpgrade("a", 22) || hasUnlockedPast("a")
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
                                        function() {return "You have done " + formatWhole(player.a.times) + " Amoeba resets"}],
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
                                "blank", 
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
                player.a.upgrades = filter(player.a.upgrades, keep)

                //resources
                player.a.points = new Decimal(0)
                player.a.total = new Decimal(0)
                player.a.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12/*, 13*/]
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
                        if (yet) x = x.times(layers[LAYERS[i]].effect())
                        if (LAYERS[i] == "b") yet = true
                }

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
                if (false) {
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
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + " idk</b><br>"
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
                                ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {return shiftDown ? "Your best Amoebas is " + format(player.a.best) : ""}],
                                ["display-text",
                                        function() {return "You have done " + formatWhole(player.b.times) + " Bacteria resets"}],
                                ["display-text",
                                        function() {
                                                if (false) return "You are gaining " + format(layers.a.getResetGain()) + " Amoebas per second"
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
                                return false || hasUnlockedPast("b")
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
                let resetBuyables = [11, 12, 13]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.a.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

