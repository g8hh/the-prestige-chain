function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)

        for (let i = 0; i < LAYERS.length; i++){
                gain = gain.times(layers[LAYERS[i]].effect())
        }

        if (hasUpgrade("a", 11)) gain = gain.times(upgradeEffect("a", 11))

	return gain
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function canBuyMax(layer, id) {
	return false
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
        }},
        color: "#BB4C83",
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Amoebas", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = layers.a.baseAmount()
                let pre = layers.a.getGainMultPre()
                let exp = layers.a.getGainExp()
                let pst = layers.a.getGainMultPost()
                let div = layers.a.getBaseDiv()

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

                return x
        },
        effect(){
                let amt = player.a.points

                let ret = amt.plus(1).sqrt()

                ret = softcap(ret, "a_eff")

                return ret
        },
        effectDescription(){
                let eff = layers.a.effect()
                let a = "which buffs point and all previous prestige gain by "

                return a + format(eff) + "."
        },
        update(diff){
                if (false) {
                        player.a.points = player.a.points.plus(layers.a.getResetGain().times(diff))
                        player.a.best = player.a.best.max(player.a.points)
                        player.a.total = player.a.total.plus(layers.a.getResetGain().times(diff))
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
                let gain = layers.a.getResetGain()
                let pts = layers.a.baseAmount()
                let pre = layers.a.getGainMultPre()
                let exp = layers.a.getGainExp()
                let pst = layers.a.getGainMultPost()
                let div = layers.a.getBaseDiv()

                let nextnum = Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(div).ceil()

                let nextAt = ""
                if (gain.lt(1e6)) nextAt = "<br>Next at " + format(nextnum) + " points"

                let a = "Reset for " + formatWhole(gain) + " Amoebas"

                return a + nextAt
        },
        canReset(){
                return layers.a.getResetGain().gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "And",
                        description: "Amoebas boost point gain",
                        cost: new Decimal(2),
                        effect(){
                                let ret = player.a.points.times(10).plus(1).log10().pow(3)
                                return ret
                        },
                        unlocked(){
                                return true
                        }
                },
                12: {
                        title: "A", //next is are
                        description: "idkyet",
                        cost: new Decimal(15),
                        effect(){
                                return new Decimal(0)
                                let ret = player.a.points.times(10).plus(1).log10().pow(3)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("a", 11)
                        }
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "name",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + getBuyableAmount("a", 11) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(this.effect()) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(this.cost()) + " Amoebas</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(this.effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        getBases(){
                                //currently an example
                                let b0 = 10
                                let b1 = 3
                                let b2 = 1.01
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

                                return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2))
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
                                return false
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                "prestige-button",
                                ["display-text",
                                        function() {return shiftDown ? "Your best Amoebas is " + format(player.a.best) : ""}],
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
                                return false // for now
                        },
                },
        },
        doReset(layer){
                if (!getsReset("a", layer)) return

                //upgrades
                let keep = []
                player.a.upgrades = filter(player.a.upgrades, keep)

                //resources
                player.a.points = new Decimal(0)
                player.a.total = new Decimal(0)
                player.a.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.a.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

