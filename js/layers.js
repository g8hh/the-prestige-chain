function getPointGen() {
	let gain = new Decimal(1)

        for (let i = 0; i < LAYERS.length; i++){
                if (layers[LAYERS[i]].row == "side") continue
                gain = gain.times(tmp[LAYERS[i]].effect)
        }

        if (hasUpgrade("a", 11))  gain = gain.times(upgradeEffect("a", 11))
        if (hasUpgrade("a", 12))  gain = gain.times(upgradeEffect("a", 12))
                                  gain = gain.times(getBuyableEffect("a", 11))
                                  gain = gain.times(getBuyableEffect("a", 23))
                                  gain = gain.times(getBuyableEffect("b", 11))
        if (hasUpgrade("c", 51))  gain = gain.times(100)
                                  gain = gain.times(tmp.goalsii.effect)
        if (hasUpgrade("h", 15))  gain = gain.times(Decimal.pow(tmp.h.effect, 1000))

        gain = gain.pow(getPointGenExp())

        if (inChallenge("f", 22)) gain = doDilation(gain, .9)

	return gain
}

function getPointGenExp(){
        let exp = new Decimal(1)
        if (inChallenge("b", 22)) exp = exp.div(2)
        exp = exp.times(Decimal.pow(.9, getChallengeDepth(2)))
        exp = exp.times(CURRENT_BUYABLE_EFFECTS["g31"])
        return exp
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function filterout(list, remove){
        return list.filter(x => !remove.includes(x))
}

function canBuyMax(layer, id) {
	return false
}

function getBuyableEffect(layer, id){
        return tmp[layer].buyables[id].effect
}

function getsReset(layer, layerPrestiging) {
        if (layerPrestiging == "goalsii"){
                return ["a", "b", "c", "d", "e", "f"].includes(layer)
        }
        order = LAYERS
        for (let i = 0; i < order.length; i++) {
                if (layers[LAYERS[i]].row == "side") continue
                if (layerPrestiging == order[i]) return false
                if (layer == order[i]) return true
        }
        return false
}

function getNextLayer(l){
        x = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",]
        return x[x.indexOf(l) + 1]
}

var HAS_UNLOCKED_PAST = {}

function updateUnlockedPast(){
        let l = filterout(Object.keys(layers).reverse(), ["ach", "ghostONE", "ghostTWO", "goalsii"])
        for (asd in l){
                i = l[asd]
                j = getNextLayer(i)
                if (layers[i].layer == "side") continue
                HAS_UNLOCKED_PAST[i] = layers[j] != undefined && (layers[j].layerShown() || hasUnlockedPast(j))
                if (i == "f") HAS_UNLOCKED_PAST[i] = HAS_UNLOCKED_PAST[i] || layers.goalsii.layerShown()
        }
}

function hasUnlockedPast(layer){
        if (layers[layer] == undefined) return false
        return HAS_UNLOCKED_PAST[layer]
}

function getChallengeFactor(comps){
        let b1 = new Decimal(comps).pow(1.5).plus(1)
        if (b1.gt(10)) b1 = b1.div(10).pow10()
        if (b1.gt(1e10)) b1 = b1.tetrate(1.01) 
        if (b1.gt(1e16)) b1 = b1.tetrate(1.01) 
        if (b1.gt(1e200)) b1 = b1.tetrate(1.0001)
        if (b1.gt(1e250)) b1 = b1.tetrate(1.0011)
        if (b1.gt("1ee3")) b1 = b1.tetrate(1.0001)
        if (b1.gt("1e5e3")) b1 = b1.tetrate(1.0002)
        return b1
}

function isBuyableActive(layer, thang){
        if (layer == "k") return true
        if (layer == "j") return true
        if (layer == "i") return true
        if (layer == "h") return true
        if (inChallenge("h", 11)) return false
        if (layer == "g") return true
        if (layer == "f") return true
        if (inChallenge("f", 11)) return false
        if (layer == "e") return true
        if (layer == "d") return true
        let depth = getChallengeDepth(3)
        if (depth > 2) return thang%10 != 1
        if (layer == "c") return true
        if (inChallenge("c", 11)) return false
        if (depth > 1) return thang%10 != 1
        if (layer == "b") return true
        if (inChallenge("b", 11)) return false
        if (depth > 0) return thang%10 != 1
        if (layer == "a") return true
}

function isPrestigeEffectActive(layer){
        if (layer == "k") return true
        if (layer == "j") return true
        if (layer == "i") return true
        if (layer == "h") return !inChallenge("h", 22)
        if (layer == "g") return true
        if (layer == "f") return true
        if (layer == "e") return !inChallenge("h", 21)
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

function getABBulk(layer){
        let amt = new Decimal(1)
        if (hasUpgrade("e", 11))           amt = amt.times(Decimal.max(player.ach.achievements.length, 1))
        if (hasUpgrade("d", 35))           amt = amt.times(100)
        if (hasUpgrade("e", 23))           amt = amt.times(100)
        if (hasMilestone("ach", 4))        amt = amt.times(100)
        if (hasMilestone("goalsii", 0))    amt = amt.times(10)
        if (hasMilestone("goalsii", 1))    amt = amt.times(10)
        if (hasMilestone("goalsii", 8))    amt = amt.times(player.goalsii.points.max(1))
        if (hasMilestone("goalsii", 11))   amt = amt.times(Decimal.pow(2, player.goalsii.milestones.length))
        if (layer == "a") {
                if (hasUpgrade("a", 35)) amt = amt.times(10)
                if (hasUpgrade("b", 21)) {
                        amt = amt.times(2)
                        if (hasUpgrade("b", 22)) amt = amt.times(2)
                        if (hasUpgrade("b", 23)) amt = amt.times(2)
                        if (hasUpgrade("b", 24)) amt = amt.times(2)
                        if (hasUpgrade("b", 25)) amt = amt.times(2)
                }
                if (hasUpgrade("b", 32)) {
                        amt = amt.times(2)
                        if (hasUpgrade("b", 31)) amt = amt.times(2)
                        if (hasUpgrade("b", 33)) amt = amt.times(2)
                        if (hasUpgrade("b", 34)) amt = amt.times(2)
                        if (hasUpgrade("b", 35)) amt = amt.times(2)
                }
                if (hasUpgrade("c", 41)) amt = amt.times(10)
                return amt
        }
        if (layer == "b") {
                if (hasUpgrade("b", 32)) {
                        amt = amt.times(2)
                        if (hasUpgrade("b", 31)) amt = amt.times(2)
                        if (hasUpgrade("b", 33)) amt = amt.times(2)
                        if (hasUpgrade("b", 34)) amt = amt.times(2)
                        if (hasUpgrade("b", 35)) amt = amt.times(2)
                }
                if (hasUpgrade("c", 41)) amt = amt.times(2)
                return amt
        }
        if (layer == "c"){
                return amt
        }
        if (layer == "d"){
                return amt
        }
        if (layer == "e"){
                return amt
        }
        if (layer == "f"){
                return amt
        }
        if (layer == "g"){
                return amt
        }
        if (layer == "h"){
                return amt
        }
        return amt
}

function getABSpeed(layer){
        let diffmult = 1
        if (hasUpgrade("e", 22)) diffmult *= 2
        if (hasUpgrade("e", 24)) diffmult *= 3
        if (hasMilestone("goalsii", 0)) diffmult *= 3
        if (layer == "a"){
                if (hasUpgrade("b", 45)) diffmult *= 2
        }
        if (layer == "b"){
                if (hasUpgrade("b", 45)) diffmult *= 2
        }
        if (layer == "c"){
                if (hasUpgrade("d", 41)) diffmult *= 3
        }
        if (layer == "d"){
                if (hasUpgrade("e", 21)) diffmult *= 3
        }
        return diffmult/(player.devSpeed || 1)
}

function getPrestigeGainChangeExp(layer){
        let exp = new Decimal(1)
        if (["a", "b", "c", "d", "e", "f"].includes(layer)) {
                exp = exp.times(Decimal.pow(.985, getChallengeDepth(1)))
                if (hasMilestone("g", 1)) exp = exp.times(1.001)
        }       
        if (layer == "f") {
                exp = exp.times(Decimal.pow(.9, getChallengeDepth(2) + getChallengeDepth(4)))
        }
        if (layer == "e"){
                exp = exp.times(Decimal.pow(.9, getChallengeDepth(2)))
                exp = exp.times(Decimal.pow(.8, getChallengeDepth(3)))
                if (hasUpgrade("goalsii", 14) && getChallengeDepth(4) > 0) exp = exp.times(2)
        }
        if (layer == "a") {
                if (hasUpgrade("i", 14)) exp = exp.times(Decimal.pow(1.1, player.i.upgrades.length))
                if (inChallenge("c", 12)) exp = exp.div(2)
        }
        return exp
}

function doDilation(amt, exp){
        if (amt.lt(10)) return amt
        return amt.log10().pow(exp).pow10()
}

function getDilationExp(layer){
        let ret = new Decimal(1)
        if (inChallenge("f", 12)) {
                if (["a", "b", "c", "d", "e"].includes(layer)) ret = ret.times(.9)
        }
        return ret
}


function doPrestigeGainChange(amt, layer){
        let exp = getPrestigeGainChangeExp(layer)
        amt = amt.pow(exp)
        amt = doDilation(amt, getDilationExp(layer))
        return amt
}

function getMaxBuyablesAmount(layer){
        let ret = Decimal.pow(10, 20)
        if (layer == "a") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
        if (layer == "b") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
        if (layer == "c") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
        if (layer == "d") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
        if (layer == "e") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
        if (layer == "f") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
        if (layer == "g") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
        }
       
        
        return ret
}

function getPrestigeName(layer){
        return {
                a: "Amoebas",
                b: "Bacterias",
                c: "Circles",
                d: "Doodles",
                e: "Eggs",
                f: "Features",
                g: "Games",
                h: "Hearts",
                i: "Ideas",
                j: "Jigsaws",
        }[layer]
}

function getTimesRequired(chance, r1){
        chance = new Decimal(chance)
        if (chance.gte(1)) return 1
        if (chance.lte(0)) return Infinity
        if (r1 == undefined) r1 = Math.random()
        //we want (1-chance)^n < r1
        let n
        if (chance.log10().gt(-5)){
                n = Decimal.ln(r1).div(Math.log(1-chance))
        } else {
                n = Decimal.ln(1/r1).div(chance)
        }
        //log(1-chance) of r2
        return Math.floor(n.toNumber()) + 1
}

function changeDist(r1, t){
        /*
        x -> 1/2 + (x-1/2)^(2t-1) * 2 ^ (2t-2)
        */
        if (t > 400) return .5
        return 1/2 + ((r1-1/2)**(2*t-1)) * (2**(2*t-2))
}

function getNumFinished(chance, pleft, attempts, ptotal){
        /*
        The chance with 1 left is chance
        pleft is the number of pieces left, 
        return [the number of pieces unfinished, moves left]
        */
        chance = new Decimal(chance)
        if (attempts == 0) return [pleft, attempts]
        if (chance.gte(1)) {
                if (attempts > pleft) return [0, attempts-pleft]
                return [pleft-attempts, 0]
        }
        if (chance.lte(0)) return [pleft, 0]
        let r1 = Math.random()
        r1 = changeDist(r1, ptotal) //because I say so
        let c2 = function(x){return x * (x + 1) / 2}
        /*
        NEED: attemps < Decimal.ln(1/r1).div(chance)
        attempts / ln(1/r1) < 1 / chance
        ln(1/r1) / attempts > chance
        -ln(r1) / attempts / [basechance] > 1/(c2(left) - c2(left-rem)) [RHS is steps done]
        1/LHS < ll/2 + l/2 - (ll/2 - lm + mm/2 + l/2 - m/2) 
        1/LHS < l/2 + lm - mm/2 - l/2 + m/2
        1/LHS < -1/2 (m^2) + (l + 1/2) (m)
            < (m)(l-m/2+1/2)
        LHS > 1/(l - m/2 + 1/2)
        l - m/2 + 1/2 > 1 / LHS
        - m/2 = 1/LHS - l - 1/2
        m = -2/LHS + 2l + 1

        */

        if (chance.div(attempts).log10().gt(-5)) {
                /*
                ln(1/r1) > total chance
                LHS > 1-(1-basechance) ^ (1/runs)
                if (runs) goes down then (1/runs) goes up then (1-e)^(1/runs) goes DOWN
                so LHS needs to be larger
                */
                lhs = r1

                target = Decimal.minus(1, lhs)
                // (1-basechance) ^ (1/runs) > target
                // Math.log(Math.E) = 1
                target = Math.log(target.toNumber())
                // (1/runs) * ln(1-basechance) > target (above)
                target = target * Math.log(1-chance.toNumber()) 
                // (1/runs) < target (above)
                RUNS = 1/target

                let STEPS = Math.floor(attempts/RUNS)

                //RUNS is how many units it takes to do the final one i.e. div = 1
                
                if (STEPS >= c2(pleft)) {
                        let unitsUsed = Math.ceil(RUNS * c2(pleft))
                        return [0, attempts - unitsUsed]
                }
                let l = pleft
                RET = -1/2 + Math.sqrt(1/4 - 2 * STEPS + l * l + l)
                RET = Math.ceil(RET)
                return [RET, 0]

        } else {
                lhs = Decimal.ln(r1).times(-1)
                lhs = lhs.div(attempts)
                lhs = lhs.div(chance)

                maxSteps = Decimal.div(1, lhs)
                if (maxSteps.gt(c2(pleft))){
                        // below: lhs = -ln(r1) / attempts / chance
                        let used = c2(pleft)
                        // below: lhs = -ln(r1) / attempts
                        used = chance.times(used)
                        used = used.div(-Math.log(r1))
                        // ^ is lhs = 1/attempts
                        attemptUsedFinal = used.pow(-1).ceil()
                        return [0, attempts - attemptUsedFinal]
                } else {
                        /*
                        SOLVE: maxSteps = ll/2 + l/2 - RET*RET/2 - RET/2
                        2maxsteps = ll + l - RET**2 - RET
                        RET**2 + RET + (2*maxsteps - ll - l) = 0
                        RET = -1 + sqrt(1-4(2*maxsteps - ll - l)) / 2
                        -4ac = -4(1)(2*maxsteps - ll - l)
                        RET is ceiled
                        */
                        maxSteps = maxSteps.toNumber()
                        let l = pleft
                        RET = -1/2 + Math.sqrt(1/4 - 2 * maxSteps + l * l + l)
                        RET = Math.ceil(RET)
                        return [RET, 0]
                        
                }
        }


}

function getGeneralizedPrestigeGain(layer){
        let pts = tmp[layer].baseAmount
        let pre = tmp[layer].getGainMultPre
        let exp = tmp[layer].getGainExp
        let pst = tmp[layer].getGainMultPost
        let div = tmp[layer].getBaseDiv

        let a = pts.div(div)
        if (a.lt(1)) return new Decimal(0)

        let ret = a.log10().times(pre).pow(exp).times(pst)

        ret = doPrestigeGainChange(ret, layer)

        if (player[layer].best.eq(0) && !hasUnlockedPast(layer)) ret = ret.min(1)

        return ret.floor()
}

function getGeneralizedInitialPostMult(layer){
        let x = new Decimal(1)
        let yet = false
        for (let i = 0; i < LAYERS.length; i++){
                if (layers[LAYERS[i]].row == "side") continue
                if (yet) x = x.times(tmp[LAYERS[i]].effect)
                if (LAYERS[i] == layer) yet = true
        }
        return x
}

function handleGeneralizedBuyableAutobuy(diff, layer){
        player[layer].abtime += diff * getABSpeed(layer)

        if (player[layer].abtime > 10) player[layer].abtime = 10
        if (player[layer].abtime > 1) {
                player[layer].abtime += -1
                let amt = getABBulk(layer)
                if (tmp[layer].buyables[11] && tmp[layer].buyables[11].unlocked) layers[layer].buyables[11].buyMax(amt)
                if (tmp[layer].buyables[12] && tmp[layer].buyables[12].unlocked) layers[layer].buyables[12].buyMax(amt)
                if (tmp[layer].buyables[13] && tmp[layer].buyables[13].unlocked) layers[layer].buyables[13].buyMax(amt)
                if (tmp[layer].buyables[21] && tmp[layer].buyables[21].unlocked) layers[layer].buyables[21].buyMax(amt)
                if (tmp[layer].buyables[22] && tmp[layer].buyables[22].unlocked) layers[layer].buyables[22].buyMax(amt)
                if (tmp[layer].buyables[23] && tmp[layer].buyables[23].unlocked) layers[layer].buyables[23].buyMax(amt)
                if (tmp[layer].buyables[31] && tmp[layer].buyables[31].unlocked) layers[layer].buyables[31].buyMax(amt)
                if (tmp[layer].buyables[32] && tmp[layer].buyables[32].unlocked) layers[layer].buyables[32].buyMax(amt)
                if (tmp[layer].buyables[33] && tmp[layer].buyables[33].unlocked) layers[layer].buyables[33].buyMax(amt)
        }
}

function getGeneralizedEffectDisplay(layer){
        if (player.tab != layer) return ""
        let eff = tmp[layer].effect
        let a = "which buffs point and all previous prestige gain by "

        return a + format(eff) + "."
}

function getGeneralizedPrestigeButtonText(layer){
        if (player.tab != layer) return ""
        let gain= tmp[layer].getResetGain
        let pts = tmp[layer].baseAmount
        let pre = tmp[layer].getGainMultPre
        let exp = tmp[layer].getGainExp
        let pst = tmp[layer].getGainMultPost
        let div = tmp[layer].getBaseDiv

        let nextnum = gain.plus(1).div(pst).root(exp).div(pre).pow10().times(div).ceil()

        let nextAt = ""
        if (gain.lt(1e6) && !(player[layer].best.eq(0) && !hasUnlockedPast(layer))) {
                nextAt = "<br>Next at " + format(nextnum) + " " + layers[layer].baseResource
                let ps = gain.div(player[layer].time || 1)

                if (ps.lt(1000/3600)) nextAt += "<br>" + format(ps.times(3600)) + "/h"
                else if (ps.lt(1000/60)) nextAt += "<br>" + format(ps.times(60)) + "/m"
                else nextAt += "<br>" + format(ps) + "/s"
        }
        if (player[layer].best.eq(0) && !hasUnlockedPast(layer) && gain.eq(0)){
                nextAt = "<br>Get " + format(pre.pow(-1).pow10().times(div)) + " " + layers[layer].baseResource + " for the first " + layers[layer].resource.slice(0,-1)
        }

        let a = "Reset for " + formatWhole(gain) + " " + layers[layer].resource

        return a + nextAt
}

function mergeSort(l, comp = function(a,b){return a<=b}){
        let k = l.length
        if (k == 1) return l
        let d = Math.floor(k/2)
        let a = mergeSort(l.slice(0,d)) 
        let b = mergeSort(l.slice(d))
        let apt = 0
        let bpt = 0
        let j = []
        while (true){
                if (comp(a[apt], b[bpt])) {
                        j.push(a[apt])
                        apt ++
                } else {
                        j.push(b[bpt])
                        bpt ++
                }
                if (apt == d){
                        return j.concat(b.slice(bpt))
                }
                if (bpt == k-d){
                        return j.concat(a.slice(apt))
                }
        }
}

/*
function tryRandListThang(n){
        let l = []
        for (let i = 0; i < n; i ++){
                l.push(Math.random())
        }
        l = mergeSort(l)
        let p = 1
        let k1 = n
        let k2 = 0
        let c = 0
        while (c < 100){
                c ++ 
                if (l[k2] < 1/k1) {
                        p *= l[k2] * k1
                        k1 --
                        k2 ++
                } else {
                        return p
                }
        }
        return "k"
}

function ranthingmult(n,k){
        let sumsofar = 0
        for (adasd = 0; adasd < k; adasd++){
                sumsofar += 1/tryRandListThang(n)
        }
        return sumsofar/k
}
*/

var devSpeedUp = false

// upgrade names: https://github.com/first20hours/google-10000-english/blob/master/google-10000-english.txt

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
                return getGeneralizedPrestigeGain("a")
        },
        getBaseDiv(){
                let x = new Decimal(1)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("a", 32)) x = x.times(3)

                x = x.plus(tmp.a.buyables[21].effect)
                x = x.plus(getGoalChallengeReward("00"))

                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("a")

                if (hasUpgrade("a", 13)) x = x.times(upgradeEffect("a", 13))
                if (hasUpgrade("a", 14)) x = x.times(upgradeEffect("a", 14))
                if (hasUpgrade("a", 23)) x = x.times(2)
                                         x = x.times(getBuyableEffect("a", 12))
                if (hasUpgrade("b", 11)) x = x.times(upgradeEffect("b", 11))
                                         x = x.times(getBuyableEffect("a", 31))
                                         x = x.times(getBuyableEffect("b", 21))
                                         x = x.times(getBuyableEffect("c", 23))
                                         x = x.times(tmp.goalsii.effect)

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("a")) return new Decimal(1)

                let amt = player.a.points

                let exp = new Decimal(.5)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["f32"])

                let ret = amt.plus(1).pow(exp)

                ret = softcap(ret, "a_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("a")
        },
        update(diff){
                player.a.best = player.a.best.max(player.a.points)
                if (hasUpgrade("a", 23)) {
                        player.a.points = player.a.points.plus(tmp.a.getResetGain.times(diff))
                        player.a.total = player.a.total.plus(tmp.a.getResetGain.times(diff))
                        player.a.autotimes += diff
                        if (player.a.autotimes > 3) player.a.autotimes = 3
                        if (player.a.autotimes > 1) {
                                player.a.autotimes += -1
                                player.a.times ++
                        }
                }
                if (hasUpgrade("b", 14) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "a")
                } else {
                        player.a.abtime = 0
                }
                player.a.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "]", description: "]: Buy max of all upgrades", 
                        onPress(){
                                let l =  ["a", "b", "c", "d", "e", "goalsii", "f", "g", "h", "i", "j"]
                                let trylist = [11, 12, 13, 14, 15, 
                                        21, 22, 23, 24, 25,
                                        31, 32, 33, 34, 35,
                                        41, 42, 43, 44, 45,
                                        51, 52, 53, 54, 55,]
                                for (j in l){
                                        i = l[j] //i is our layer
                                        if (layers[i] == undefined) continue
                                        for (k in trylist) {
                                                //if we have the upgrade continue
                                                if (hasUpgrade(i, trylist[k])) continue
                                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                                //if the upgrade is undefined continue
                                                
                                                //if we dont have it, try to buy it 
                                                buyUpgrade(i, trylist[k])
                                        }
                                }
                        }
                },
                {key: "a", description: "A: Reset for Amoeba", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+A", description: "Shift+A: Go to Amoebas", onPress(){
                                showTab("a")
                        }
                },
                {key: ",", description: ",: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: ".", description: ".: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "shift+<", description: "Shift+,: Move all the way to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getUnlockedSubtabs(l)[0]
                        }
                },
                {key: "shift+>", description: "Shift+.: Move all the way to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[k.length-1]
                        }
                },
        ],
        layerShown(){return true},
        prestigeButtonText(){
                if (hasUpgrade("a", 23)) return ""
                return getGeneralizedPrestigeButtonText("a")
        },
        canReset(){
                return player.a.time >= 2 && !hasUpgrade("a", 23) && tmp.a.getResetGain.gt(0)
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
                        cost: new Decimal(100),
                        effect(){
                                let exp = new Decimal(player.a.upgrades.length)
                                exp = exp.times(tmp.a.buyables[13].effect)
                                return Decimal.pow(1.2, exp)
                        },
                        unlocked(){
                                return hasUpgrade("a", 12) || hasUnlockedPast("a")
                        }
                },
                14: {
                        title: "At",
                        description: "Amoebas boost Amoeba gain",
                        cost: new Decimal(300),
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
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("a", 14) || hasUnlockedPast("a")
                        }
                },
                21: {
                        title: "An",
                        description: "Each Amoeba upgrade adds .5 to the <b>And</b> exponent",
                        cost: new Decimal(2500),
                        effect(){
                                return 3 + player.a.upgrades.length
                        },
                        effectDisplay(){
                                if (player.tab != "a") return ""
                                return "3 -> " + format(3 + player.a.upgrades.length * .5, 1)
                        },
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(3) || hasUnlockedPast("a")
                        }
                },
                22: {
                        title: "About",
                        description: "Unlock the second Amoeba buyable",
                        cost: new Decimal(1e4),
                        unlocked(){
                                return getBuyableAmount("a", 11).gte(5) || hasUnlockedPast("a")
                        }
                },
                23: {
                        title: "Also",
                        description: "Double Amoeba gain and remove the ability to prestige but gain 100% of Amoebas on prestige per second",
                        cost: new Decimal(3e4),
                        unlocked(){
                                return getBuyableAmount("a", 12).gte(1) || hasUnlockedPast("a")
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
                                return getBuyableAmount("a", 11).gte(10) || hasUnlockedPast("a")
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
                        cost: new Decimal(1e50),
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
                        cost: new Decimal(1e86),
                        unlocked(){
                                return hasUpgrade("b", 21) || hasUnlockedPast("b")
                        }
                }, 
                42: {
                        title: "Another",
                        description: "<b>Account</b> gives free <b>Access</b> levels",
                        cost: new Decimal(5e194),
                        unlocked(){
                                return hasUpgrade("b", 25) || hasUnlockedPast("b")
                        }
                },
                43: {
                        title: "Article",
                        description: "Per <b>Account</b> add .05 to the <b>Any</b> base",
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
                        description: "Each <b>Account</b> adds .01 to its base and double <b>B</b> gain",
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
                                return hasUpgrade("c", 11) || hasUnlockedPast("c")
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
                        title: "Act",
                        description: "Unlock a second Bacteria buyable and remove the second Amoeba effect softcap",
                        cost: new Decimal("1e4256"),
                        unlocked(){
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        }
                },
                /*
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
                                return getBuyableDisplay("a", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a11"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 11)
                        },
                        total(){
                                return getBuyableAmount("a", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 11)
                        },
                        buy(){
                                buyManualBuyable("a", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        },
                },
                12: {
                        title: "Any",
                        display(){
                                return getBuyableDisplay("a", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a12"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 12)
                        },
                        total(){
                                return getBuyableAmount("a", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 12)
                        },
                        buy(){
                                buyManualBuyable("a", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 22) || hasUnlockedPast("a")
                        },
                },
                13: {
                        title: "After",
                        display(){
                                return getBuyableDisplay("a", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a13"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 13)
                        },
                        total(){
                                return getBuyableAmount("a", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 13)
                        },
                        buy(){
                                buyManualBuyable("a", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 31) || hasUnlockedPast("b")
                        },
                },
                21: {
                        title: "Access",
                        display(){
                                return getBuyableDisplay("a", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a21"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 21)
                        },
                        total(){
                                return getBuyableAmount("a", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 21)
                        },
                        buy(){
                                buyManualBuyable("a", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 21) || hasUnlockedPast("b")
                        },
                },
                22: {
                        title: "Account",
                        display(){
                                return getBuyableDisplay("a", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a22"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 22)
                        },
                        total(){
                                return getBuyableAmount("a", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 22)
                        },
                        buy(){
                                buyManualBuyable("a", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 24) || hasUnlockedPast("b")
                        },
                },
                23: {
                        title: "Advanced",
                        display(){
                                return getBuyableDisplay("a", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a23"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 23)
                        },
                        total(){
                                return getBuyableAmount("a", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 23)
                        },
                        buy(){
                                buyManualBuyable("a", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 12) || hasUnlockedPast("c")
                        },
                },
                31: {
                        title: "Against",
                        display(){
                                return getBuyableDisplay("a", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a31"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 31)
                        },
                        total(){
                                return getBuyableAmount("a", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 31)
                        },
                        buy(){
                                buyManualBuyable("a", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 53) || hasUnlockedPast("c")
                        },
                },
                32: {
                        title: "Above",
                        display(){
                                return getBuyableDisplay("a", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a32"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 32)
                        },
                        total(){
                                return getBuyableAmount("a", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 32)
                        },
                        buy(){
                                buyManualBuyable("a", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 43) || hasUnlockedPast("c")
                        },
                },
                33: {
                        title: "Omnipotent I",
                        display(){
                                return getBuyableDisplay("a", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["a33"]
                        },
                        canAfford(){
                                return canAffordBuyable("a", 33)
                        },
                        total(){
                                return getBuyableAmount("a", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("a", 33)
                        },
                        buy(){
                                buyManualBuyable("a", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("a", 33, maximum)
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
                                        function() {
                                                if (player.tab != "a") return ""
                                                return shiftDown ? "Your best Amoebas is " + format(player.a.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "a") return ""
                                                if (hasUnlockedPast("a")) return ""
                                                return "You have done " + formatWhole(player.a.times) + " Amoeba resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "a") return ""
                                                if (hasUpgrade("a", 23)) return "You are gaining " + format(tmp.a.getResetGain) + " Amoebas per second"
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
                                                if (player.tab != "a") return ""
                                                if (hasUpgrade("a", 23) && shiftDown) return "You are gaining " + format(tmp.a.getResetGain) + " Amoebas per second"
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
                player.a.times = 0

                if (!hasMilestone("ach", 1)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("b", 13)) keep.push(11,12,13,14,15,21,22,23,24,25)
                        if (hasUpgrade("b", 14)) keep.push(31,32,33,34,35,41,42,43,44,45)
                        if (hasMilestone("goalsii", 2)) keep.push(23)
                        if (!hasUpgrade("c", 11)) player.a.upgrades = filter(player.a.upgrades, keep)
                }

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
        name: "Bacteria",
        symbol: "B",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Bacterias",
        baseResource: "Amoebas",
        baseAmount() {return player.a.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("b")
        },
        getBaseDiv(){
                let x = new Decimal(1e5)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("c", 25)) x = x.plus(1)
                if (hasUpgrade("d", 12)) x = x.plus(totalChallengeComps("b") ** 2)
                                         x = x.plus(tmp.a.buyables[33].effect)
                                         x = x.plus(getGoalChallengeReward("00"))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                x = x.times(tmp.c.buyables[21].effect)
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("b")

                x = x.times(tmp.a.buyables[22].effect)
                x = x.times(tmp.b.buyables[12].effect)
                x = x.times(tmp.goalsii.effect)
                if (hasUpgrade("a", 45)) x = x.times(2)

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
                return getGeneralizedEffectDisplay("b")
        },
        update(diff){
                player.b.best = player.b.best.max(player.b.points)
                if (hasUpgrade("b", 22)) {
                        player.b.points = player.b.points.plus(tmp.b.getResetGain.times(diff))
                        player.b.total = player.b.total.plus(tmp.b.getResetGain.times(diff))
                        player.b.autotimes += diff
                        if (player.b.autotimes > 3) player.b.autotimes = 3
                        if (player.b.autotimes > 1) {
                                player.b.autotimes += -1
                                player.b.times ++
                        }
                }
                if (hasUpgrade("b", 32) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "b")
                } else {
                        player.b.abtime = 0
                }
                player.b.time += diff
        },
        row: 1,
        hotkeys: [
                {key: "b", description: "B: Reset for Bacteria", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+B", description: "Shift+B: Go to Bacteria", onPress(){
                                showTab("b")
                        }
                },
        ],
        layerShown(){return player.a.best.gt(1e6) || player.b.best.gt(0) || hasUnlockedPast("b")},
        prestigeButtonText(){
                if (hasUpgrade("b", 22)) return ""
                return getGeneralizedPrestigeButtonText("b")
        },
        canReset(){
                return player.b.time >= 5 && !hasUpgrade("b", 22) && tmp.b.getResetGain.gt(0)
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
                        cost: new Decimal(500),
                        unlocked(){
                                return hasUpgrade("b", 13) || hasUnlockedPast("b")
                        }
                },
                15: {
                        title: "Been",
                        description: "<b>After</b> gives free levels to <b>Any</b>",
                        cost: new Decimal(3000),
                        unlocked(){
                                return hasUpgrade("b", 14) || hasUnlockedPast("b")
                        }
                },
                21: {
                        title: "Back",
                        description: "<b>Business</b> can buy twice as much per this row upgrade and unlock a fourth Amoeba buyable",
                        cost: new Decimal(15000),
                        unlocked(){
                                return hasUpgrade("a", 35) || hasUnlockedPast("b")
                        }
                },
                22: {
                        title: "Buy",
                        description: "Remove the ability to prestige but gain 100% of Bacteria on prestige per second",
                        cost: new Decimal(3e4),
                        unlocked(){
                                return hasUpgrade("a", 41) || hasUnlockedPast("b")
                        }
                },
                23: {
                        title: "Best",
                        description: "<b>Access</b> gives free <b>Any</b> levels",
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
                        cost: new Decimal(2e6),
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
                        description: "Unlock the eighth Amoeba buyable",
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
                        description: "Unlock two new <b>B</b> buyables which both give free levels to <b>Baby</b>",
                        cost: new Decimal("1e10964"),
                        unlocked(){
                                return hasUpgrade("c", 35) || hasUnlockedPast("d")
                        }, //hasUpgrade("b", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Because",
                        display(){
                                return getBuyableDisplay("b", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b11"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 11)
                        },
                        total(){
                                return getBuyableAmount("b", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 11)
                        },
                        buy(){
                                buyManualBuyable("b", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 31) || hasUnlockedPast("c")
                        },
                },
                12: {
                        title: "Based",
                        display(){
                                return getBuyableDisplay("b", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b12"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 12)
                        },
                        total(){
                                return getBuyableAmount("b", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 1)
                        },
                        buy(){
                                buyManualBuyable("b", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("a", 55) || hasUnlockedPast("c")
                        },
                },
                13: {
                        title: "Become",
                        display(){
                                return getBuyableDisplay("b", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b13"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 13)
                        },
                        total(){
                                return getBuyableAmount("b", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 13)
                        },
                        buy(){
                                buyManualBuyable("b", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        },
                },
                21: {
                        title: "Baby",
                        display(){
                                return getBuyableDisplay("b", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b21"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 21)
                        },
                        total(){
                                return getBuyableAmount("b", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 21)
                        },
                        buy(){
                                buyManualBuyable("b", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        },
                },
                22: {
                        title: "Bank",
                        display(){
                                return getBuyableDisplay("b", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b22"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 22)
                        },
                        total(){
                                return getBuyableAmount("b", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 22)
                        },
                        buy(){
                                buyManualBuyable("b", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        },
                },
                23: {
                        title: "Beauty",
                        display(){
                                return getBuyableDisplay("b", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b23"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 23)
                        },
                        total(){
                                return getBuyableAmount("b", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 23)
                        },
                        buy(){
                                buyManualBuyable("b", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("b", 55) || hasUnlockedPast("d")
                        },
                },
                31: {
                        title: "Basic",
                        display(){
                                return getBuyableDisplay("b", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b31"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 31)
                        },
                        total(){
                                return getBuyableAmount("b", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 31)
                        },
                        buy(){
                                buyManualBuyable("b", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 24) || hasUnlockedPast("d")
                        },
                },
                32: {
                        title: "Brand",
                        display(){
                                return getBuyableDisplay("b", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b32"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 32)
                        },
                        total(){
                                return getBuyableAmount("b", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 32)
                        },
                        buy(){
                                buyManualBuyable("b", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 44) || hasUnlockedPast("d")
                        },
                },
                33: {
                        title: "Omnipotent II",
                        display(){
                                return getBuyableDisplay("b", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["b33"]
                        },
                        canAfford(){
                                return canAffordBuyable("b", 33)
                        },
                        total(){
                                return getBuyableAmount("b", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("b", 33)
                        },
                        buy(){
                                buyManualBuyable("b", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("b", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 51) || hasUnlockedPast("e")
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
                                let ret = Math.pow(c, 3) + c * 5
                                ret = softcap(ret, "b_chall")
                                return Math.floor(ret)
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
                        completionLimit: 20,
                },
                12: {
                        name: "Body",
                        challengeDescription: "<b>Big</b> and <b>And</b> effect is 1",
                        rewardDescription: "Give free <b>Against</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 12)
                                let ret = Math.pow(c, 3) + c * 5
                                ret = softcap(ret, "b_chall")
                                return Math.floor(ret)
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
                        completionLimit: 20,
                        countsAs: [11],
                },
                21: {
                        name: "Beach",
                        challengeDescription: "<b>Body</b> and all previous prestige effects are 1",
                        rewardDescription: "Give free <b>Omnipotent I</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("b", 21)
                                let ret = Math.pow(c, 3) + Math.pow(c, 2) * 5 + c * 9
                                ret = softcap(ret, "b_chall")
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e14538")
                                let factor = getChallengeFactor(challengeCompletions("b", 21))
                                factor = factor.pow(.9636)
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 33) || hasUnlockedPast("d")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11, 12],
                },
                22: {
                        name: "Bit",
                        challengeDescription: "<b>Beach</b> and square root point gain",
                        rewardDescription: "Add to the <b>D</b> gain exponent",
                        rewardEffect(){
                                let c = challengeCompletions("b", 22)
                                let ret = c * c * .1 + c * 1
                                ret = softcap(ret, "b_chall")
                                return ret
                        },
                        goal(){
                                let init = Decimal.pow(10, 72e6)
                                let factor = getChallengeFactor(challengeCompletions("b", 22))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 51) || hasUnlockedPast("e")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11, 12, 21],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("b", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "b") return ""
                                                let a = hasUnlockedPast("b") ? "" : "You have done " + formatWhole(player.b.times) + " Bacteria resets<br>"
                                                if (hasUpgrade("b", 22)) return a + "You are gaining " + format(tmp.b.getResetGain) + " Bacteria per second"
                                                return a + "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.b.time)) + ")" 
                                        },
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
                                                if (player.tab != "b") return ""
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "b") return ""
                                                if (!shiftDown || !hasUpgrade("b", 22)) return ""
                                                return "You are gaining " + format(tmp.b.getResetGain) + " Bacteria per second"
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
                                                if (player.tab != "b") return ""
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "b") return ""
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
                player.b.times = 0

                if (!hasMilestone("ach", 2)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("c", 12)) keep.push(11,12,13,14,15,21,22,23,24,25,31,32,33,34,35)
                        if (hasUpgrade("c", 15)) keep.push(41,42,43,44,45)
                        if (hasMilestone("goalsii", 3)) keep.push(22)
                        if (!hasUpgrade("d", 11)) player.b.upgrades = filter(player.b.upgrades, keep)
                }

                //resources
                player.b.points = new Decimal(0)
                player.b.total = new Decimal(0)
                player.b.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.b.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("c", {
        name: "Circles",
        symbol: "C",
        position: 0,
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
        requires: new Decimal(0),
        resource: "Circles",
        baseResource: "Bacterias",
        baseAmount() {return player.b.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("c")
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("c", 25)) x = x.plus(1)
                if (hasUpgrade("b", 52)) x = x.plus(player.c.upgrades.length * .2)
                x = x.plus(tmp.b.buyables[32].effect)
                x = x.plus(getGoalChallengeReward("00"))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("c")

                if (hasUpgrade("c", 23)) x = x.times(player.c.upgrades.length).max(x)
                                         x = x.times(getBuyableEffect("b", 13))
                                         x = x.times(tmp.goalsii.effect)
                                         x = x.times(getBuyableEffect("c", 32))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("c")) return new Decimal(1)
                
                let amt = player.c.points

                let ret = amt.times(8).plus(1).sqrt()

                ret = softcap(ret, "c_eff")

                ret = ret.times(tmp.c.buyables[12].effect)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("c")
        },
        update(diff){
                let data = player.c

                data.best = data.best.max(data.points)
                if (hasUpgrade("c", 22)) {
                        data.points = player.c.points.plus(tmp.c.getResetGain.times(diff))
                        data.total = player.c.total.plus(tmp.c.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("e", 11) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "c")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "c", description: "C: Reset for Circles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+C", description: "Shift+C: Go to Circles", onPress(){
                                showTab("c")
                        }
                },
        ],
        layerShown(){return player.b.best.gt(1e10) || player.c.best.gt(0) || hasUnlockedPast("c")},
        prestigeButtonText(){
                if (hasUpgrade("c", 22)) return ""
                return getGeneralizedPrestigeButtonText("c")
        },
        canReset(){
                return player.c.time >= 5 && !hasUpgrade("c", 22) && tmp.c.getResetGain.gt(0)
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
                        title: "County",
                        description: "Remove the ability to prestige but gain 100% of Circles on prestige per second",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("c", 21) || hasUnlockedPast("c")
                        }, //hasUpgrade("c", 22)
                },
                23: {
                        title: "Care",
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
                                return hasUpgrade("b", 53) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 31)
                },
                32: {
                        title: "Car",
                        description: "<b>Above</b> gives free <b>Account</b> levels",
                        cost: new Decimal(1e31),
                        unlocked(){ 
                                return player.ach.achievements.includes("43") || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 32)
                },
                33: {
                        title: "Community",
                        description: "Unlock a third <b>B</b> challenge and <b>Advanced</b> gives free <b>After</b> levels",
                        cost: new Decimal(2e79),
                        unlocked(){ 
                                return hasUpgrade("c", 32) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 33)
                },
                34: {
                        title: "Code",
                        description: "<b>Baby</b> gives free <b>Become</b> and <b>Based</b> levels",
                        cost: new Decimal(2e88),
                        unlocked(){ 
                                return hasUpgrade("c", 33) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 34)
                },
                35: {
                        title: "Check",
                        description: "Each <b>Advanced</b> adds .0001 to the <b>Omnipotent I</b> base",
                        cost: new Decimal(1e152),
                        unlocked(){ 
                                return hasUpgrade("c", 34) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 35)
                },
                41: {
                        title: "Computer",
                        description: "<b>Basic</b> gives free <b>Bank</b> and <b>Beauty</b> levels and <b>B</b> and <b>A</b> autobuyers can buy 10x more",
                        cost: new Decimal("1e584"),
                        unlocked(){ 
                                return player.ach.achievements.includes("53") || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 41)
                },
                42: {
                        title: "Current",
                        description: "<b>Bank</b> gives free <b>Become</b> levels",
                        cost: new Decimal("1e685"),
                        unlocked(){ 
                                return hasUpgrade("d", 24) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 42)
                },
                43: {
                        title: "Control",
                        description: "<b>Basic</b> gives free <b>Baby</b> levels and unlock a <b>C</b> challenge",
                        cost: new Decimal("1e942"),
                        unlocked(){ 
                                return hasUpgrade("c", 42) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 43)
                },
                44: {
                        title: "Class",
                        description: "<b>Basic</b> gives free <b>Omntipotent I</b> levels and unlock a <b>B</b> buyable",
                        cost: new Decimal("1e1046"),
                        unlocked(){ 
                                return hasUpgrade("c", 43) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 44)
                },
                45: {
                        title: "Children",
                        description: "<b>Brand</b> gives free <b>Basic</b> and <b>Beauty</b> levels and unlock a <b>C</b> buyable",
                        cost: new Decimal("2e1151"),
                        unlocked(){ 
                                return hasUpgrade("c", 44) || hasUnlockedPast("d")
                        }, //hasUpgrade("c", 45)
                },
                51: {
                        title: "Content",
                        description: "Unlock <b>Omnipotent II</b> which gives free levels to all <b>B</b> buyables, unlock the final <b>B</b> challenge, and gain 100x points",
                        cost: new Decimal("2e2674"),
                        unlocked(){ 
                                return hasAchievement("ach", 62) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 51)
                },
                52: {
                        title: "Customer",
                        description: "<b>Country</b> gives free levels to <b>Call</b> and <b>Case</b>",
                        cost: new Decimal("1e5443"),
                        unlocked(){ 
                                return hasUpgrade("d", 31) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 52)
                },
                53: {
                        title: "College",
                        description: "<b>Compare</b> gives free levels to <b>Call</b> and <b>Case</b>",
                        cost: new Decimal("1e34974"),
                        unlocked(){ 
                                return hasUpgrade("d", 32) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 53)
                },
                54: {
                        title: "Course",
                        description: "<b>Card</b> gives free levels to <b>Omnipotent II</b> and <b>Compare</b>",
                        cost: new Decimal("1e100012"),
                        unlocked(){ 
                                return hasUpgrade("d", 33) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 54)
                },
                55: {
                        title: "Credit",
                        description: "<b>Canada</b> gives free levels to <b>Omnipotent II</b> and <b>Compare</b> and unlock a <b>C</b> challange",
                        cost: new Decimal("1e826733"),
                        unlocked(){ 
                                return hasUpgrade("d", 35) || hasUnlockedPast("e")
                        }, //hasUpgrade("c", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Case",
                        display(){
                                return getBuyableDisplay("c", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c11"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 11)
                        },
                        total(){
                                return getBuyableAmount("c", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 11)
                        },
                        buy(){
                                buyManualBuyable("c", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        },
                },
                12: {
                        title: "Call",
                        display(){
                                return getBuyableDisplay("c", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c12"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 12)
                        },
                        total(){
                                return getBuyableAmount("c", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 12)
                        },
                        buy(){
                                buyManualBuyable("c", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("c", 45) || hasUnlockedPast("d")
                        },
                },
                13: {
                        title: "Country",
                        display(){
                                return getBuyableDisplay("c", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c13"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 13)
                        },
                        total(){
                                return getBuyableAmount("c", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 13)
                        },
                        buy(){
                                buyManualBuyable("c", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 31) || hasUnlockedPast("e")
                        },
                },
                21: {
                        title: "Compare",
                        display(){
                                return getBuyableDisplay("c", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c21"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 21)
                        },
                        total(){
                                return getBuyableAmount("c", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 21)
                        },
                        buy(){
                                buyManualBuyable("c", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 21, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("d", 31) && hasUpgrade("d", 32)) || hasUnlockedPast("e")
                        },
                },
                22: {
                        title: "Card",
                        display(){
                                return getBuyableDisplay("c", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c22"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 22)
                        },
                        total(){
                                return getBuyableAmount("c", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 22)
                        },
                        buy(){
                                buyManualBuyable("c", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 22, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("d", 31) && hasUpgrade("d", 33)) || hasUnlockedPast("e")
                        },
                },
                23: {
                        title: "Canada",
                        display(){
                                return getBuyableDisplay("c", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c23"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 23)
                        },
                        total(){
                                return getBuyableAmount("c", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 23)
                        },
                        buy(){
                                buyManualBuyable("c", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 23, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("d", 31) && hasUpgrade("d", 34)) || hasUnlockedPast("e")
                        },
                },
                31: {
                        title: "Conditions",
                        display(){
                                return getBuyableDisplay("c", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c31"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 31)
                        },
                        total(){
                                return getBuyableAmount("c", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 31)
                        },
                        buy(){
                                buyManualBuyable("c", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                32: {
                        title: "Category",
                        display(){
                                return getBuyableDisplay("c", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c32"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 32)
                        },
                        total(){
                                return getBuyableAmount("c", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 32)
                        },
                        buy(){
                                buyManualBuyable("c", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 32, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 8) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
                33: {
                        title: "Omnipotent III",
                        display(){
                                return getBuyableDisplay("c", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["c33"]
                        },
                        canAfford(){
                                return canAffordBuyable("c", 33)
                        },
                        total(){
                                return getBuyableAmount("c", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("c", 33)
                        },
                        buy(){
                                buyManualBuyable("c", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("c", 33, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 15) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Change",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Multiply <b>Bank</b> base",
                        rewardEffect(){
                                let c = challengeCompletions("c", 11)
                                let exp = c
                                if (c >= 2) exp += c
                                let ret = Decimal.pow(100, exp)
                                return ret
                        },
                        goal(){
                                let init = Decimal.pow(10, 4473)
                                let factor = getChallengeFactor(challengeCompletions("c", 11))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 43) || hasUnlockedPast("d")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                },
                12: {
                        name: "Categories",
                        challengeDescription: "<b>Change</b> and square root <b>A</b> gain",
                        rewardDescription: "Give free <b>Canada</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("c", 12)
                                let ret = (c) * (c + 10) * (c + 11) / 6
                                return ret
                        },
                        goal(){
                                let init = Decimal.pow(10, 34136600)
                                let factor = getChallengeFactor(challengeCompletions("c", 12))
                                return init.pow(factor)
                        },
                        unlocked(){
                                return hasUpgrade("c", 55) || hasUnlockedPast("e")
                        },
                        currencyInternalName: "points",
                        completionLimit: 20,
                        countsAs: [11],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("c", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                return shiftDown ? "Your best Circles is " + format(player.c.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (hasUnlockedPast("c")) return ""
                                                return "You have done " + formatWhole(player.c.times) + " Circle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (hasUpgrade("c", 22)) return "You are gaining " + format(tmp.c.getResetGain) + " Circles per second"
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
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (!shiftDown || !hasUpgrade("c", 22)) return ""
                                                return "You are gaining " + format(tmp.c.getResetGain) + " Circles per second"
                                        }
                                ],
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("c")) + " Circle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("c", 43) || hasUnlockedPast("d")
                        },
                },
        },
        doReset(layer){
                if (layer == "c") player.c.time = 0
                if (!getsReset("c", layer)) return
                player.c.time = 0
                player.c.times = 0

                if (!hasMilestone("ach", 3)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("d", 11)) keep.push(11,12,13,14,15,21,22,23,24,25,31,32,33,34,35)
                        if (hasMilestone("goalsii", 4)) keep.push(22)
                        if (!hasUpgrade("e", 11)) player.c.upgrades = filter(player.c.upgrades, keep)
                }

                //resources
                player.c.points = new Decimal(0)
                player.c.total = new Decimal(0)
                player.c.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.c.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("d", {
        name: "Doodles",
        symbol: "D",
        position: 0,
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
        color: "#306363",
        branches: ["c"],
        requires: new Decimal(0),
        resource: "Doodles",
        baseResource: "Circles",
        baseAmount() {return player.c.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("d")
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("d", 25)) x = x.plus(1)
                x = x.plus(tmp.b.challenges[22].rewardEffect)
                x = x.plus(getGoalChallengeReward("00"))
                if (hasUpgrade("goalsii", 14)) x = x.plus(100 * player.goalsii.upgrades.length)
                x = x.plus(getBuyableEffect("e", 23))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                if (hasUpgrade("goalsii", 14)) x = x.times(100 * player.goalsii.upgrades.length + 1)
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("d")

                x = x.times(tmp.c.buyables[22].effect)
                x = x.times(tmp.d.buyables[11].effect)
                x = x.times(tmp.goalsii.effect)


                return x
        },
        effect(){
                if (!isPrestigeEffectActive("d")) return new Decimal(1)

                let amt = player.d.points

                let exp = new Decimal(.5)
                exp = exp.plus(getGoalChallengeReward("02"))

                let ret = amt.times(15).plus(1).pow(exp)

                ret = softcap(ret, "d_eff")


                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("d")
        },
        update(diff){
                let data = player.d
                
                data.best = data.best.max(data.points)
                if (hasUpgrade("d", 22)) {
                        data.points = data.points.plus(tmp.d.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.d.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("e", 14) || hasMilestone("goalsii", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "d")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 3,
        hotkeys: [
                {key: "d", description: "D: Reset for Doodles", onPress(){if (canReset(this.layer)) doReset(this.layer)}},                      
                {key: "shift+D", description: "Shift+D: Go to Doodles", onPress(){
                                showTab("d")
                        }
                },
        ],
        layerShown(){return player.c.best.gt(5e10) || player.d.best.gt(0) || hasUnlockedPast("d")},
        prestigeButtonText(){
                if (hasUpgrade("d", 22)) return ""
                return getGeneralizedPrestigeButtonText("d")
        },
        canReset(){
                return player.d.time >= 5 && !hasUpgrade("d", 22) && tmp.d.getResetGain.gt(0)
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
                15: {
                        title: "Does",
                        description: "<b>Beauty</b> gives free <b>Bank</b> levels",
                        cost: new Decimal(5e4),
                        unlocked(){ 
                                return player.ach.achievements.includes("47") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 15)
                },
                21: {
                        title: "Days",
                        description: "Each <b>Become</b> adds .01 to its base",
                        cost: new Decimal(15e4),
                        unlocked(){ 
                                return player.ach.achievements.includes("51") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 21)
                },
                22: {
                        title: "Development",
                        description: "Remove the ability to prestige but gain 100% of Doodles on prestige per second and unlock a <b>C</b> buyable",
                        cost: new Decimal(5e5),
                        unlocked(){ 
                                return hasUpgrade("d", 21) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 22)
                },
                23: {
                        title: "Details",
                        description: "<b>Case</b> gives free <b>Omnipotent I</b> levels",
                        cost: new Decimal(5e6),
                        unlocked(){ 
                                return hasUpgrade("d", 22) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 23)
                },
                24: {
                        title: "Did",
                        description: "<b>Become</b> gives free <b>Against</b> levels and unlock the seventh <b>B</b> buyable",
                        cost: new Decimal(5e6),
                        unlocked(){ 
                                return hasUpgrade("d", 23) || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 24)
                },
                25: {
                        title: "Design",
                        description: "<b>Call</b> gives free <b>Case</b> levels and one to the <b>D</b> gain exponent",
                        cost: new Decimal(5e8),
                        unlocked(){ 
                                return player.ach.achievements.includes("57") || hasUnlockedPast("d")
                        }, //hasUpgrade("d", 25)
                },
                31: {
                        title: "Down",
                        description: "Each upgrade in this row unlocks a <b>C</b> buyable and <b>Brand</b> gives free <b>Bank</b> levels",
                        cost: new Decimal(5e28),
                        unlocked(){ 
                                return player.ach.achievements.includes("63") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 31)
                },
                32: {
                        title: "Download",
                        description: "Per <b>Omnipotent I</b> squared add 1 to <b>Based</b> base",
                        cost: new Decimal(1e42),
                        unlocked(){ 
                                return player.ach.achievements.includes("64") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 32)
                },
                33: {
                        title: "Directory",
                        description: "<b>Compare</b> gives free <b>Country</b> levels",
                        cost: new Decimal(1e77),
                        unlocked(){ 
                                return hasUpgrade("c", 53) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 33)
                },
                34: {
                        title: "During",
                        description: "<b>Compare</b> gives free <b>Brand</b> levels",
                        cost: new Decimal(1e246),
                        unlocked(){ 
                                return hasUpgrade("e", 12) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 34)
                },
                35: {
                        title: "Digital",
                        description: "<b>Canada</b> gives free <b>Card</b> levels and all autobuyers buy 100x more",
                        cost: new Decimal("1e314"),
                        unlocked(){ 
                                return player.ach.achievements.includes("71") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 35)
                },
                41: {
                        title: "Description",
                        description: "<b>Department</b> gives free <b>Brand</b> levels and <b>C</b> autobuyers buy 3x faster",
                        cost: new Decimal("1e619"),
                        unlocked(){ 
                                return player.ach.achievements.includes("74") || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 41)
                },
                42: {
                        title: "Different",
                        description: "<b>Department</b> gives free <b>Basic</b> and <b>Beauty</b> levels",
                        cost: new Decimal("1e619"),
                        unlocked(){ 
                                return hasUpgrade("d", 41) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 42)
                },
                43: {
                        title: "Discussion",
                        description: "<b>Conditions</b> gives free <b>Card</b> and <b>Canada</b> levels",
                        cost: new Decimal("1e778"),
                        unlocked(){ 
                                return hasUpgrade("d", 42) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 43)
                },
                44: {
                        title: "Display",
                        description: "<b>Delivery</b> gives free <b>December</b> levels",
                        cost: new Decimal("5e1667"),
                        unlocked(){ 
                                return hasUpgrade("e", 14) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 44)
                },
                45: {
                        title: "Daily",
                        description: "<b>Director</b> gives free <b>Delivery</b> levels",
                        cost: new Decimal("1e2333"),
                        unlocked(){ 
                                return hasUpgrade("e", 15) || hasUnlockedPast("e")
                        }, //hasUpgrade("d", 45)
                },
                51: {
                        title: "Done",
                        description: "Unlock a <b>D</b> buyable",
                        cost: new Decimal("1e305977"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("g", 15) || hasUnlockedPast("g")
                        }, //hasUpgrade("d", 51)
                },
                52: {
                        title: "District",
                        description: "Each upgrade multiplies base <b>G</b> gain by 1.01",
                        cost: new Decimal("1e305999"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 51) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 52)
                },
                53: {
                        title: "Downloads",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e307059"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 52) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 53)
                },
                54: {
                        title: "Document",
                        description: "Increase the <b>G</b> effect exponent by +.1",
                        cost: new Decimal("1e307113"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 53) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 54)
                },
                55: {
                        title: "Deals",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e310424"),
                        currencyLayer: "f",
                        currencyInternalName: "points",
                        currencyDisplayName: "Features",
                        unlocked(){ 
                                return hasUpgrade("d", 54) || hasUnlockedPast("g")
                        }, // hasUpgrade("d", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Department",
                        display(){
                                return getBuyableDisplay("d", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d11"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 11)
                        },
                        total(){
                                return getBuyableAmount("d", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 11)
                        },
                        buy(){
                                buyManualBuyable("d", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                12: {
                        title: "December",
                        display(){
                                return getBuyableDisplay("d", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d12"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 12)
                        },
                        total(){
                                return getBuyableAmount("d", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 12)
                        },
                        buy(){
                                buyManualBuyable("d", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                13: {
                        title: "Delivery",
                        display(){
                                return getBuyableDisplay("d", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d13"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 13)
                        },
                        total(){
                                return getBuyableAmount("d", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 13)
                        },
                        buy(){
                                buyManualBuyable("d", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                21: {
                        title: "Drive",
                        display(){
                                return getBuyableDisplay("d", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d21"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 21)
                        },
                        total(){
                                return getBuyableAmount("d", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 21)
                        },
                        buy(){
                                buyManualBuyable("d", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 21, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("e", 13) && hasUpgrade("e", 14)) || hasUnlockedPast("e")
                        },
                },
                22: {
                        title: "Director",
                        display(){
                                return getBuyableDisplay("d", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d22"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 22)
                        },
                        total(){
                                return getBuyableAmount("d", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 22)
                        },
                        buy(){
                                buyManualBuyable("d", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 22, maximum)
                        },
                        unlocked(){ 
                                return (hasUpgrade("e", 13) && hasUpgrade("e", 15)) || hasUnlockedPast("e")
                        },
                },
                23: {
                        title: "Due",
                        display(){
                                return getBuyableDisplay("d", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d23"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 23)
                        },
                        total(){
                                return getBuyableAmount("d", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 23)
                        },
                        buy(){
                                buyManualBuyable("d", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 23, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 21) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
                31: {
                        title: "Database",
                        display(){
                                return getBuyableDisplay("d", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d31"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 31)
                        },
                        total(){
                                return getBuyableAmount("d", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 31)
                        },
                        buy(){
                                buyManualBuyable("d", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 31, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 24) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
                32: {
                        title: "Done",
                        display(){
                                return getBuyableDisplay("d", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d32"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 32)
                        },
                        total(){
                                return getBuyableAmount("d", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 32)
                        },
                        buy(){
                                buyManualBuyable("d", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 32, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("g", 4) || hasUnlockedPast("g")
                        },
                },
                33: {
                        title: "Omnipotent IV",
                        display(){
                                return getBuyableDisplay("d", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["d33"]
                        },
                        canAfford(){
                                return canAffordBuyable("d", 33)
                        },
                        total(){
                                return getBuyableAmount("d", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("d", 33)
                        },
                        buy(){
                                buyManualBuyable("d", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("d", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("d", 51) || hasUnlockedPast("g")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("d", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                return shiftDown ? "Your best Doodles is " + format(player.d.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (hasUnlockedPast("d")) return ""
                                                return "You have done " + formatWhole(player.d.times) + " Doodle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (hasUpgrade("d", 22)) return "You are gaining " + format(tmp.d.getResetGain) + " Doodles per second"
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
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                return "Each buyable gives free levels to all previous layers corresponding buyable"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                if (!shiftDown || !hasUpgrade("d", 22)) return ""
                                                return "You are gaining " + format(tmp.d.getResetGain) + " Doodles per second"
                                        }
                                ],
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("e", 13) || hasUnlockedPast("e")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "d") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("d")) + " Doodle Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false
                        },
                },
        },
        doReset(layer){
                if (layer == "d") player.d.time = 0
                if (!getsReset("d", layer)) return
                player.d.time = 0
                player.d.times = 0

                if (!hasMilestone("ach", 5)) {
                        //upgrades
                        let keep = []
                        if (hasMilestone("goalsii", 5)) keep.push(22)
                        if (!hasUpgrade("e", 11)) player.d.upgrades = filter(player.d.upgrades, keep)
                }

                //resources
                player.d.points = new Decimal(0)
                player.d.total = new Decimal(0)
                player.d.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.d.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})


addLayer("e", {
        name: "Eggs",
        symbol: "E",
        position: 0,
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
        color: "#FFFFCC",
        branches: ["d"],
        requires: new Decimal(0),
        resource: "Eggs",
        baseResource: "Doodles",
        baseAmount() {return player.d.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("e")
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("e", 25)) x = x.plus(1)
                x = x.plus(getGoalChallengeReward("00"))
                let l = player.goalsii.milestones.length
                if (hasMilestone("goalsii", 11)) x = x.plus(l*l*.01)
                x = x.plus(getGoalChallengeReward("23"))
                x = x.plus(getGoalChallengeReward("33"))
                x = x.plus(getBuyableEffect("e", 12))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(.5)
                x = x.times(getGoalChallengeReward("31"))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("e")

                x = x.times(tmp.goalsii.effect)
                x = x.times(getGoalChallengeReward("21"))
                if (hasMilestone("goalsii", 18)) {
                        let b = Math.max(1, player.ach.achievements.length)
                        x = x.times(Decimal.pow(b, b))
                }
                x = x.times(getBuyableEffect("e", 11))
                x = x.times(getBuyableEffect("d", 23))


                return x
        },
        effect(){
                if (!isPrestigeEffectActive("e")) return new Decimal(1)

                let amt = player.e.points
                let exp = new Decimal(2)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["f33"])
                exp = exp.times(CURRENT_BUYABLE_EFFECTS["h33"])

                let ret = amt.times(24).plus(1).pow(exp)

                if (!hasMilestone("k", 3)) ret = softcap(ret, "e_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("e")
        },
        update(diff){
                let data = player.e

                data.best = data.best.max(data.points)
                if (hasUpgrade("e", 22)) {
                        data.points = data.points.plus(tmp.e.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.e.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasMilestone("goalsii", 20)) {
                        handleGeneralizedBuyableAutobuy(diff, "e")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 4,
        hotkeys: [
                {key: "e", description: "E: Reset for Eggs", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+E", description: "Shift+E: Go to Eggs", onPress(){
                                showTab("e")
                        }
                },
        ],
        layerShown(){return player.d.best.gt(5e10) || player.e.best.gt(0) || hasUnlockedPast("e")},
        prestigeButtonText(){
                if (hasUpgrade("e", 22)) return ""
                return getGeneralizedPrestigeButtonText("e")
        },
        canReset(){
                return player.e.time >= 5 && !hasUpgrade("e", 22) && tmp.e.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Email",
                        description: "Keep <b>C</b> and <b>D</b> upgrades, autobuy <b>C</b> buyables once per second, and multiply all autobuyer bulk by the number of goals",
                        cost: new Decimal(10),
                        unlocked(){ 
                                return player.ach.achievements.includes("61") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 11)
                },
                12: {
                        title: "Each",
                        description: "<b>Card</b> gives free <b>Country</b> and <b>Call</b> level and <b>C</b> buyables cost nothing",
                        cost: new Decimal(1e5),
                        unlocked(){ 
                                return hasUpgrade("c", 54) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 12)
                },
                13: {
                        title: "Education",
                        description: "Unlock a <b>C</b> buyable and each upgrade in this row unlocks a <b>D</b> buyable",
                        cost: new Decimal(1e6),
                        unlocked(){ 
                                return player.ach.achievements.includes("73") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 13)
                },
                14: {
                        title: "Even",
                        description: "<b>Delivery</b> gives free <b>Department</b> buyables and autobuy <b>D</b> buyables once per second",
                        cost: new Decimal(1e6),
                        unlocked(){ 
                                return player.ach.achievements.includes("75") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 14)
                },
                15: {
                        title: "End",
                        description: "<b>Drive</b> gives free <b>December</b> and <b>Delivery</b> buyables",
                        cost: new Decimal(1e6),
                        unlocked(){ 
                                return player.ach.achievements.includes("75") || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 15)
                },
                21: {
                        title: "Events",
                        description: "<b>December</b> gives free <b>Department</b> levels and gain a free <b>Drive</b> level and triple <b>D</b> autobuyer speed",
                        cost: new Decimal(3e6),
                        unlocked(){ 
                                return hasUpgrade("d", 45) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 21)
                },
                22: {
                        title: "Every",
                        description: "Remove the ability to prestige but gain 100% of Eggs on prestige per second and all autobuyers work 2x faster",
                        cost: new Decimal(1e7),
                        unlocked(){ 
                                return hasUpgrade("e", 21) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 22)
                },
                23: {
                        title: "English",
                        description: "<b>Director</b> gives free <b>December</b> levels and all autobuyers buy 100x more",
                        cost: new Decimal(1e9),
                        unlocked(){ 
                                return hasUpgrade("e", 22) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 23)
                },
                24: {
                        title: "Estate",
                        description: "<b>Director</b> gives free <b>Drive</b> levels and all autobuyers buy 3x faster",
                        cost: new Decimal(3e9),
                        unlocked(){ 
                                return hasUpgrade("e", 23) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 24)
                },
                25: {
                        title: "Equipment",
                        description: "Add one to the <b>Director</b> base and <b>E</b> gain exponent",
                        cost: new Decimal(1e10),
                        unlocked(){ 
                                return hasUpgrade("e", 24) || hasUnlockedPast("e")
                        }, //hasUpgrade("e", 25)
                },
                31: {
                        title: "Edition",
                        description: "Each upgrade multiplies base <b>G</b> gain by 1.1",
                        cost: new Decimal("1e32684"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("g", 21) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 31)
                },
                32: {
                        title: "Electronics",
                        description: "Unlock a fully completed effect",
                        cost: new Decimal("1e34851"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 31) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 32)
                },
                33: {
                        title: "Environment",
                        description: "Square <b>Edition</b>",
                        cost: new Decimal("1e38276"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 32) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 33)
                },
                34: {
                        title: "Ever",
                        description: "Square <b>Edition</b>",
                        cost: new Decimal("1e39436"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 33) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 34)
                },
                35: {
                        title: "Early",
                        description: "Gain one free Rebirth level",
                        cost: new Decimal("1e45201"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 34) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 35)
                },
                41: {
                        title: "Either",
                        description: "Raise Charge gain ^1.1",
                        cost: new Decimal("1e46297"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("g", 22) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 41)
                },
                42: {
                        title: "Else",
                        description: "Raise the successfully deved boosted to Features to the 20",
                        cost: new Decimal("1e46653"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 41) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 42)
                },
                43: {
                        title: "Europe",
                        description: "Square the successfully deved boosted to Max Charges",
                        cost: new Decimal("1e47094"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 42) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 43)
                },
                44: {
                        title: "Edit",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e49220"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 43) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 44)
                },
                45: {
                        title: "Economic",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e49590"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 44) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 45)
                },
                51: {
                        title: "Everything",
                        description: "Unlock an <b>E</b> buyable",
                        cost: new Decimal("1e50660"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("g", 23) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 51)
                },
                52: {
                        title: "Error",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e53691"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 51) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 52)
                },
                53: {
                        title: "Engineering",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e54074"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 52) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 53)
                },
                54: {
                        title: "Enough",
                        description: "ln(Charges) multiplies base <b>G</b> gain",
                        cost: new Decimal("1e54456"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 53) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 54)
                },
                55: {
                        title: "Effects",
                        description: "Each <b>G</b> upgrade multiplies base medal gain by 12 and adds 34 to the exponent",
                        cost: new Decimal("1e54456"),
                        currencyLayer: "g",
                        currencyInternalName: "points",
                        currencyDisplayName: "Games",
                        unlocked(){
                                return hasUpgrade("e", 54) || hasUnlockedPast("g")
                        }, // hasUpgrade("e", 55)
                },

                /*
                
                environmental
                entry
                european
                employment
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Experience",
                        display(){
                                return getBuyableDisplay("e", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e11"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 11)
                        },
                        total(){
                                return getBuyableAmount("e", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 11)
                        },
                        buy(){
                                buyManualBuyable("e", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 11, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 19) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                12: {
                        title: "East",
                        display(){
                                return getBuyableDisplay("e", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e12"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 12)
                        },
                        total(){
                                return getBuyableAmount("e", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 12)
                        },
                        buy(){
                                buyManualBuyable("e", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 12, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                13: {
                        title: "Example",
                        display(){
                                return getBuyableDisplay("e", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e13"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 13)
                        },
                        total(){
                                return getBuyableAmount("e", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 13)
                        },
                        buy(){
                                buyManualBuyable("e", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 13, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("goalsii", 24) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                21: {
                        title: "Easy",
                        display(){
                                return getBuyableDisplay("e", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e21"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 21)
                        },
                        total(){
                                return getBuyableAmount("e", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 21)
                        },
                        buy(){
                                buyManualBuyable("e", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                22: {
                        title: "Event",
                        display(){
                                return getBuyableDisplay("e", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e22"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 22)
                        },
                        total(){
                                return getBuyableAmount("e", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 22)
                        },
                        buy(){
                                buyManualBuyable("e", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                23: {
                        title: "Enter",
                        display(){
                                return getBuyableDisplay("e", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e23"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 23)
                        },
                        total(){
                                return getBuyableAmount("e", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 23)
                        },
                        buy(){
                                buyManualBuyable("e", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 23) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                31: {
                        title: "Energy",
                        display(){
                                return getBuyableDisplay("e", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e31"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 31)
                        },
                        total(){
                                return getBuyableAmount("e", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 31)
                        },
                        buy(){
                                buyManualBuyable("e", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 24) || hasUnlockedPast("g")
                        },
                },
                32: {
                        title: "Entertainment",
                        display(){
                                return getBuyableDisplay("e", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e32"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 32)
                        },
                        total(){
                                return getBuyableAmount("e", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 32)
                        },
                        buy(){
                                buyManualBuyable("e", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 25) || hasUnlockedPast("g")
                        },
                },
                33: {
                        title: "Omnipotent V",
                        display(){
                                return getBuyableDisplay("e", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["e33"]
                        },
                        canAfford(){
                                return canAffordBuyable("e", 33)
                        },
                        total(){
                                return getBuyableAmount("e", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("e", 33)
                        },
                        buy(){
                                buyManualBuyable("e", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("e", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("e", 51) || hasUnlockedPast("g")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("e", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                return shiftDown ? "Your best Eggs is " + format(player.e.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                if (hasUnlockedPast("e")) return ""
                                                return "You have done " + formatWhole(player.e.times) + " Egg resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                if (hasUpgrade("e", 22)) return "You are gaining " + format(tmp.e.getResetGain) + " Eggs per second"
                                                return "There is a five second cooldown for prestiging (" + format(Math.max(0, 5-player.e.time)) + ")" 
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
                                                if (player.tab != "e") return ""
                                                if (!hasUpgrade("e", 22)) return ""
                                                if (!shiftDown) return ""
                                                return "You are gaining " + format(tmp.e.getResetGain) + " Eggs per second"
                                        },
                                        //{"font-size": "20px"}
                                ], 
                                "buyables"],
                        unlocked(){
                                return hasMilestone("goalsii", 19) || hasUnlockedPast("g") || player.g.best.gt(0)
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "e") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("e")) + " Egg Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return false
                        },
                },
        },
        doReset(layer){
                if (layer == "e") player.e.time = 0
                if (!getsReset("e", layer)) return
                player.e.time = 0
                player.e.times = 0

                if (!hasMilestone("ach", 6)) {
                        //upgrades
                        let keep = []
                        if (hasMilestone("goalsii", 6)) keep.push(22)
                        player.e.upgrades = filter(player.e.upgrades, keep)
                }

                //resources
                player.e.points = new Decimal(0)
                player.e.total = new Decimal(0)
                player.e.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.e.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("f", {
        name: "Features",
        symbol: "F",
        position: 0,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                bestc44: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#660099",
        branches: ["e"],
        requires: new Decimal(0),
        resource: "Features",
        baseResource: "Eggs",
        baseAmount() {return player.e.points.floor()},
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("f")
        },
        getBaseDiv(){
                let x = new Decimal(1e11)
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                x = x.plus(getGoalChallengeReward("00"))
                x = x.plus(getGoalChallengeReward("30"))
                if (hasMilestone("ach", 6)) x = x.plus(1.5)
                if (hasUpgrade("goalsii", 13)) x = x.plus(0.2 * player.goalsii.upgrades.length)
                x = x.plus(CURRENT_GAMES_EFFECTS["rebirth"]["F gain exponent"][0])
                if (hasUpgrade("f", 25)) x = x.plus(player.f.upgrades.length ** 2)
                if (hasUpgrade("h", 11)) x = x.plus(78 * player.h.upgrades.length)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["f12"])
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1/3)
                x = x.times(getGoalChallengeReward("13"))
                if (hasMilestone("goalsii", 14)) x = x.times(player.goalsii.points.plus(10).log10())
                x = x.times(player.e.best.max(10).log10().pow(getGoalChallengeReward("24")))
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Base F gain"][0])
                if (hasUpgrade("h", 11)) x = x.times(Decimal.pow(90, player.h.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("f")

                x = x.times(tmp.goalsii.effect)
                x = x.times(getBuyableEffect("c", 33))
                x = x.times(upgradeEffect("goalsii", 15))
                if (hasUpgrade("goalsii", 24) && getChallengeDepth(4) > 0) {
                        x = x.times(Decimal.pow(1.25, player.goalsii.upgrades.length ** 2))
                }
                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Features"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["complete"]["Features"][0])

                x = x.times(CURRENT_BUYABLE_EFFECTS["f11"])

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("f")) return new Decimal(1)

                let amt = player.f.points

                let exp = new Decimal(tmp.f.challenges[12].rewardEffect)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["f22"])

                let ret = amt.times(4).plus(1).pow(exp)


                if (ret.gt(10)) ret = ret.pow(2).div(10)
                if (ret.gt(1000)) ret = ret.pow(2).div(1000)

                ret = softcap(ret, "f_eff")

                if (inChallenge("f", 21)) ret = doDilation(ret, .9)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("f")
        },
        update(diff){
                let data = player.f

                data.best = data.best.max(data.points)
                if (player.goalsii.currentChallenge == "44"){
                        data.bestc44 = data.bestc44.max(data.points)
                }
                if (hasMilestone("goalsii", 9)) {
                        data.points = data.points.plus(tmp.f.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.f.getResetGain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("h", 14) ) {
                        handleGeneralizedBuyableAutobuy(diff, "f")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 5,
        hotkeys: [
                {key: "f", description: "F: Reset for Features", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+F", description: "Shift+F: Go to Features", onPress(){
                                showTab("f")
                        }
                },
        ],
        layerShown(){return player.e.best.gt(5e13) || player.f.best.gt(0) || hasUnlockedPast("f")},
        prestigeButtonText(){
                if (hasMilestone("goalsii", 9)) return ""
                return getGeneralizedPrestigeButtonText("f")
        },
        canReset(){
                return player.f.time >= 2 && !hasMilestone("goalsii", 9) && tmp.f.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "For",
                        description: "Keep this upgrade and make <b>G</b> gain based on best <b>F</b>",
                        cost: new Decimal("1e10533"),
                        unlocked(){ 
                                return player.g.rebirths[1] >= 16 || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 11)
                },
                12: {
                        title: "From",
                        description: "Remove the successful dev boost to Feature gain softcap",
                        cost: new Decimal("1e13524"),
                        unlocked(){ 
                                return hasUpgrade("f", 11) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 12)
                },
                13: {
                        title: "Free",
                        description: "Remove the successful dev boost to Medal gain softcap",
                        cost: new Decimal("1e14099"),
                        unlocked(){ 
                                return hasUpgrade("f", 12) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 13)
                },
                14: {
                        title: "First",
                        description: "Remove the successful dev boost to Game gain softcap",
                        cost: new Decimal("1e14746"),
                        unlocked(){ 
                                return hasUpgrade("f", 13) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 14)
                },
                15: {
                        title: "Find",
                        description: "Multiply base <b>G</b> gain by 1.15",
                        cost: new Decimal("1e26221"),
                        unlocked(){ 
                                return hasUpgrade("f", 14) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 15)
                },
                21: {
                        title: "Full",
                        description: "Each upgrade in this row unlocks a rebirth reward",
                        cost: new Decimal("1e28545"),
                        unlocked(){ 
                                return hasUpgrade("f", 15) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 21)
                },
                22: {
                        title: "Forum",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e45342"),
                        unlocked(){ 
                                return hasUpgrade("f", 21) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 22)
                },
                23: {
                        title: "Family",
                        description: "Raise charge gain ^1.1 and buff Base G gain from rebirths",
                        cost: new Decimal("1e53420"),
                        unlocked(){ 
                                return hasUpgrade("f", 22) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 23)
                },
                24: {
                        title: "File",
                        description: "Per upgrade squared add one to <b>G</b> gain exponent",
                        cost: new Decimal("1e61495"),
                        unlocked(){ 
                                return hasUpgrade("f", 23) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 24)
                },
                25: {
                        title: "Found",
                        description: "Per upgrade squared add one to <b>F</b> gain exponent",
                        cost: new Decimal("1e78988"),
                        unlocked(){ 
                                return hasUpgrade("f", 24) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 25)
                },
                31: {
                        title: "Following",
                        description: "Per upgrade multiply base <b>G</b> gain by 1.01",
                        cost: new Decimal("1e99330"),
                        unlocked(){ 
                                return hasUpgrade("f", 25) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 31)
                },
                32: {
                        title: "Form",
                        description: "Remove the G gain exponent softcap",
                        cost: new Decimal("1e109555"),
                        unlocked(){ 
                                return hasUpgrade("f", 31) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 32)
                },
                33: {
                        title: "Food",
                        description: "Once per second attempt to Rebirth I",
                        cost: new Decimal("1e130130"),
                        unlocked(){ 
                                return hasUpgrade("f", 32) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 33)
                },
                34: {
                        title: "Features",
                        description: "You can also autobuy the first four games",
                        cost: new Decimal("1e136640"),
                        unlocked(){ 
                                return hasUpgrade("f", 33) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 34)
                },
                35: {
                        title: "Forums",
                        description: "Goals multiply base <b>G</b> gain",
                        cost: new Decimal("1e149215"),
                        unlocked(){ 
                                return hasUpgrade("f", 34) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 35)
                },
                41: {
                        title: "Friend",
                        description: "Raise charge gain ^1.1",
                        cost: new Decimal("1e190803"),
                        unlocked(){ 
                                return hasUpgrade("f", 35) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 41)
                },
                42: {
                        title: "Feedback",
                        description: "Each upgrade adds 1 to the Medal gain exponent",
                        cost: new Decimal("1e206577"),
                        unlocked(){ 
                                return hasUpgrade("f", 41) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 42)
                },
                43: {
                        title: "Financial",
                        description: "Always act as if you are in medal challenge 00",
                        cost: new Decimal("1e216218"),
                        unlocked(){ 
                                return hasUpgrade("f", 42) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 43)
                },
                44: {
                        title: "Field",
                        description: "Per upgrade squared multiply base <b>G</b> gain by 1.001",
                        cost: new Decimal("1e226195"),
                        unlocked(){ 
                                return hasUpgrade("f", 43) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 44)
                },
                45: {
                        title: "Few",
                        description: "log(Games) boosts base medal gain",
                        cost: new Decimal("1e245725"),
                        unlocked(){ 
                                return hasUpgrade("f", 44) || hasUnlockedPast("g")
                        }, // hasUpgrade("f", 45)
                },
                51: {
                        title: "Fax",
                        description: "<b>February</b> gives free <b>Four</b> levels",
                        cost: new Decimal("1e1147300"),
                        unlocked(){ 
                                return hasUpgrade("f", 45) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 51)
                },
                52: {
                        title: "Format",
                        description: "<b>Future</b> gives free <b>Four</b> levels and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e2134765"),
                        unlocked(){ 
                                return hasUpgrade("g", 34) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 52)
                },
                53: {
                        title: "Fun",
                        description: "Raise the rebirth to Games effect ^50",
                        cost: new Decimal("1e7082300"),
                        unlocked(){ 
                                return hasUpgrade("h", 23) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 53)
                },
                54: {
                        title: "Five",
                        description: "Per <b>F</b> challenge act as if you have .5% less rebirths",
                        cost: new Decimal("1e41236e3"),
                        unlocked(){ 
                                return hasUpgrade("g", 45) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 54)
                },
                55: {
                        title: "France",
                        description: "Raise rebirth base Game gain effect ^1.5 and act as if you have 20% less rebirths",
                        cost: new Decimal("1e63758400"),
                        unlocked(){ 
                                return hasUpgrade("f", 54) || hasUnlockedPast("h")
                        }, // hasUpgrade("f", 55)
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Four",
                        display(){
                                return getBuyableDisplay("f", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f11"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 11)
                        },
                        total(){
                                return getBuyableAmount("f", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 11)
                        },
                        buy(){
                                buyManualBuyable("f", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 34) || hasUnlockedPast("h")
                        },
                },
                12: {
                        title: "February",
                        display(){
                                return getBuyableDisplay("f", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f12"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 12)
                        },
                        total(){
                                return getBuyableAmount("f", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 12)
                        },
                        buy(){
                                buyManualBuyable("f", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 15) || hasUnlockedPast("h")
                        },
                },
                13: {
                        title: "Future",
                        display(){
                                return getBuyableDisplay("f", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f13"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 13)
                        },
                        total(){
                                return getBuyableAmount("f", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 13)
                        },
                        buy(){
                                buyManualBuyable("f", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 21) || hasUnlockedPast("h")
                        },
                },
                21: {
                        title: "Friends",
                        display(){
                                return getBuyableDisplay("f", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f21"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 21)
                        },
                        total(){
                                return getBuyableAmount("f", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 21)
                        },
                        buy(){
                                buyManualBuyable("f", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("f", 52) || hasUnlockedPast("h")
                        },
                },
                22: {
                        title: "Front",
                        display(){
                                return getBuyableDisplay("f", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f22"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 22)
                        },
                        total(){
                                return getBuyableAmount("f", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 22)
                        },
                        buy(){
                                buyManualBuyable("f", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 11) || hasUnlockedPast("i")
                        },
                },
                23: {
                        title: "Final",
                        display(){
                                return getBuyableDisplay("f", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f23"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 23)
                        },
                        total(){
                                return getBuyableAmount("f", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 23)
                        },
                        buy(){
                                buyManualBuyable("f", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 44) || hasUnlockedPast("i")
                        },
                },
                31: {
                        title: "Finance",
                        display(){
                                return getBuyableDisplay("f", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f31"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 31)
                        },
                        total(){
                                return getBuyableAmount("f", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 31)
                        },
                        buy(){
                                buyManualBuyable("f", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 45) || hasUnlockedPast("i")
                        },
                },
                32: {
                        title: "Fast",
                        display(){
                                return getBuyableDisplay("f", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f32"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 32)
                        },
                        total(){
                                return getBuyableAmount("f", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 32)
                        },
                        buy(){
                                buyManualBuyable("f", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 33) || hasUnlockedPast("i")
                        },
                },
                33: {
                        title: "Omnipotent VI",
                        display(){
                                return getBuyableDisplay("f", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["f33"]
                        },
                        canAfford(){
                                return canAffordBuyable("f", 33)
                        },
                        total(){
                                return getBuyableAmount("f", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("f", 33)
                        },
                        buy(){
                                buyManualBuyable("f", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("f", 33, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 34) || hasUnlockedPast("i")
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Files",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free <b>February</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("f", 11)
                                let ret = Math.pow(c, 3) + c * 31
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e114270e3")
                                let factor = getChallengeFactor(challengeCompletions("f", 11))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e3975e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("h", 15) || hasUnlockedPast("h")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                },
                12: {
                        name: "Film",
                        challengeDescription: "<b>Files</b> and dilate all previous prestige gain ^.9",
                        rewardDescription: "Raise the <b>F</b> effect to a power",
                        rewardEffect(){
                                let c = challengeCompletions("f", 12)
                                let exp = new Decimal(.5)
                                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["g32"])

                                let ret = Decimal.pow(c + 1, exp)
                                return ret
                        },
                        goal(){
                                let init = new Decimal("1e20876e3")
                                let factor = getChallengeFactor(challengeCompletions("f", 12))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e4012e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("g", 33) || hasUnlockedPast("h")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                        countsAs: [11],
                },
                21: {
                        name: "Further",
                        challengeDescription: "<b>Film</b> and dilate <b>F</b> effect ^.9",
                        rewardDescription: "Raise the <b>G</b> effect to a power",
                        rewardEffect(){
                                let c = challengeCompletions("f", 21)
                                let ret = Math.pow(c + 1, .25)
                                return ret
                        },
                        goal(){
                                let init = new Decimal("1e18560e3")
                                let factor = getChallengeFactor(challengeCompletions("f", 21))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e1602e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("g", 35) || hasUnlockedPast("h")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                        countsAs: [11, 12],
                },
                22: {
                        name: "Federal",
                        challengeDescription: "<b>Further</b> and dilate point gain ^.9",
                        rewardDescription: "Boost base <b>G</b> gain",
                        rewardEffect(){
                                let c = challengeCompletions("f", 22)
                                let base = new Decimal(2)
                                base = base.plus(CURRENT_BUYABLE_EFFECTS["g21"])
                                let ret = Decimal.pow(base, c)
                                return ret
                        },
                        goal(){
                                let c = challengeCompletions("f", 22)
                                let init = new Decimal("1e160154e3")
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                if (c == 2) factor = new Decimal(3.788)
                                return init.times(Decimal.pow("1e3820e3", factor))
                        },
                        unlocked(){
                                return hasUpgrade("i", 12) || hasUnlockedPast("i")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("g", 55)) ret += 5
                                if (hasUpgrade("h", 34)) ret += player.i.upgrades.length
                                if (player.j.puzzle.upgrades.includes(51)) ret += 5
                                if (hasUpgrade("j", 24)) ret ++

                                return ret
                        },
                        countsAs: [11, 12, 21],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("goalsii", 9) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                return shiftDown ? "Your best Features is " + format(player.f.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                if (hasUnlockedPast("f")) return ""
                                                return "You have done " + formatWhole(player.f.times) + " Feature resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                if (hasMilestone("goalsii", 9)) return "You are gaining " + format(tmp.f.getResetGain) + " Features per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.f.time)) + ")" 
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
                                return hasUpgrade("goalsii", 34) || hasUnlockedPast("h")
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "f") return ""
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                               if (player.tab != "f") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("f")) + " Feature Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("h", 15) || hasUnlockedPast("h")
                        },
                },
        },
        doReset(layer){
                if (layer == "f") player.f.time = 0
                if (!getsReset("f", layer)) return
                player.f.time = 0
                player.f.times = 0

                if (!hasMilestone("h", 7) && !hasMilestone("i", 5) && !hasMilestone("k", 1)) {
                        //upgrades
                        let keep = []
                        if (hasUpgrade("f", 11)) keep.push(11)
                        player.f.upgrades = filter(player.f.upgrades, keep)
                }

                //resources
                player.f.points = new Decimal(0)
                player.f.total = new Decimal(0)
                player.f.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.f.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("ach", {
        name: "Goals",
        symbol: "⭑", 
        position: 1,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                bestOverGoalsii: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#FFC746",
        branches: ["goalsii"],
        requires: new Decimal(0),
        resource: "Goals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
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
                let data = player.ach
                data.points = new Decimal(data.achievements.length).max(data.points)
                data.best = data.best.max(data.points)
                data.bestOverGoalsii = data.bestOverGoalsii.max(data.best)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: getFirstNAchData(189), //Object.keys(PROGRESSION_MILESTONES).length
        milestones: {
                1: {
                        requirementDescription(){
                                return "<b>Life</b><br>Requires: " + formatWhole(tmp.ach.milestones[1].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>A</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[1].req)
                        },
                        req(){
                                let a = 30
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                2: {
                        requirementDescription() {
                                return "<b>The Universe</b><br>Requires: " + formatWhole(tmp.ach.milestones[2].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>B</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[2].req)
                        },
                        req(){
                                let a = 36
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                3: {
                        requirementDescription(){
                                return "<b>And Everything</b><br>Requires: " + formatWhole(tmp.ach.milestones[3].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>C</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[3].req)
                        },
                        req(){
                                let a = 49
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                4: {
                        requirementDescription() {
                                return "<b>Tell me and I forget</b><br>Requires: " + formatWhole(tmp.ach.milestones[4].req) + " Goals"
                        }, 
                        effectDescription: "All autobuyers buy 100x more",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[4].req)
                        },
                        req(){
                                let a = 52
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                5: {
                        requirementDescription() {
                                return "<b>Teach me and I remember</b><br>Requires: " + formatWhole(tmp.ach.milestones[5].req) + " Goals"
                        }, 
                        effectDescription: "You permanently keep all <b>D</b> upgrades",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[5].req)
                        },
                        req(){
                                let a = 70
                                if (hasMilestone("goalsii", 7)) a /= 2
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                6: {
                        requirementDescription() {
                                return "<b>Involve me and I learn</b><br>Requires: " + formatWhole(tmp.ach.milestones[6].req) + " Goals (needs Eighty or in Challenge 4)"
                        }, 
                        effectDescription: "You permanently keep all <b>E</b> upgrades and add 1.5 to the <b>F</b> gain exponent",
                        done(){
                                return player.ach.points.gte(tmp.ach.milestones[6].req) && (getChallengeDepth(4) > 0 || hasAchievement("ach", 123))
                        },
                        req(){
                                let a = 69
                                return new Decimal(a).floor()
                        },
                        unlocked(){
                                return true
                        },
                },
                //
                //Benjamin Franklin
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "main-display-goals",
                                "achievements",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Milestones": {
                        content: [
                                "main-display-goals",
                                "milestones",
                        ],
                        unlocked(){
                                return player.ach.points.gte(28) || player.goalsii.times > 0
                        },
                },
        },
        doReset(layer){
                if (layers[layer].row != "side") return 
                if (layer == "ach") return
                if (hasMilestone("i", 1)) return 

                let data = player.ach

                let remove = [
                        "11", "12", "13", "14", "15", "16", "17", 
                        "21", "22", "23", "24", "25", "26", "27", 
                        "31", "32", "33", "34", "35", "36", "37", 
                        "41", "42", "43", "44", "45", "46", "47", 
                        "51", "52", "53", "54", "55", "56", "57", 
                        "61", "62", "63", "64", "65", "66", "67", 
                        "71", "72", "73", "74", "75", "76", "77", 
                        "81", "82", "83", "84"]

                data.achievements = filterout(data.achievements, remove)
                data.best = new Decimal(0)
                data.points = new Decimal(0)

                let keep = []
                data.milestones = filter(data.milestones, keep)
                updateAchievements("ach")
                updateMilestones("ach")
        },
})

addLayer("ghostONE", {
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {} },
        color: "#CC66CC",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Medals", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return new Decimal(0)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
        ],
        layerShown(){return "ghost"},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                "clickables",
                        ],
                        unlocked(){
                                return false
                        },
                },
        },
})

addLayer("ghostTWO", {
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {} },
        color: "#CC66CC",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Medals", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return new Decimal(0)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
        ],
        layerShown(){return "ghost"},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                "clickables",
                        ],
                        unlocked(){
                                return false
                        },
                },
        },
})

addLayer("goalsii", {
        name: "Goals II",
        symbol: "✦",
        position: 3,
        startData() { 
                let a = {}
                let b = {}
                let c = {}
                let d = {}
                let e = {}
                let l = ["00", "01", "02", "03", "04",
                         "10", "11", "12", "13", "14",
                         "20", "21", "22", "23", "24",
                         "30", "31", "32", "33", "34",
                         "40", "41", "42", "43", "44",
                        ]
                for (j in l){
                        i = l[j]
                        a[i] = new Decimal(0)
                        b[i] = new Decimal(0)
                        c[i] = new Decimal(0)
                        d[i] = 0
                        e[i] = new Decimal(0)
                }
                return {
                        unlocked: true,
                        abtime: 0,
                        time: 0,
                        times: 0,
                        challtimes: d,
                        autotimes: 0,
                        autobuyA: false,
                        autobuyB: false,
                        autobuyC: false,
                        autobuyD: false,
                        autobuyE: false,
                        abupgstime: 0,
                        currentChallenge: "00",
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        bestOnce: new Decimal(0),
                        tokens: {
                                points: a,
                                best: b,
                                total: c,
                                copy: e,
                        },
                }
        },
        color: "#CC66CC",
        branches: ["ach"],
        requires: new Decimal(0),
        resource: "Medals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
        getResetGain() {
                let a 
                if (player.f.best.eq(0)) a = new Decimal(0)
                else a = new Decimal(1)

                let b = player.f.best.max(1).log10().div(9.5).plus(1)

                if (getChallengeDepth(3) > 0) b = b.minus(2).max(0)

                a = a.times(b)

                if (a.lt(1)) return new Decimal(0)

                let pre = tmp.goalsii.getGainMultPre
                let exp = tmp.goalsii.getGainExp
                let pst = tmp.goalsii.getGainMultPost

                let ret = a.times(pre).pow(exp).times(pst)

                if (ret.gt(1e4) && !hasMilestone("g", 10)) ret = ret.div(1e4).sqrt().times(1e4)

                return ret.floor()
        },
        getGainExp(){
                let x = new Decimal(1)
                if (hasMilestone("goalsii", 13)) x = x.plus(1)
                if (hasUpgrade("f", 42)) x = x.plus(player.f.upgrades.length)
                if (hasUpgrade("e", 55)) x = x.plus(player.g.upgrades.length * 34)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["f23"])
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                if (hasUpgrade("f", 45)) x = x.times(player.g.points.max(10).log10())
                if (hasUpgrade("e", 55)) x = x.times(player.g.upgrades.length * 12)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                x = x.times(getGoalChallengeReward("31"))
                x = x.times(getGoalChallengeReward("41"))
                if (hasMilestone("g", 1)) x = x.times(2)
                if (hasMilestone("g", 3)) x = x.times(Decimal.pow(1.5, player.g.milestones.length))
                if (hasUpgrade("goalsii", 24)) x = x.times(Decimal.pow(1.1, player.goalsii.upgrades.length))
                x = x.times(CURRENT_BUYABLE_EFFECTS["e32"])
                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Medals"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Medals"][0])
                if (hasMilestone("g", 14)) {
                        x = x.times(Decimal.pow(2, player.g.milestones.length))
                }
                if (hasUpgrade("goalsii", 34)) x = x.times(10)
                return x
        },
        effect(){
                if (inChallenge("h", 12)) return new Decimal(1)

                let amt = player.goalsii.points

                let ret = amt.times(3).plus(1)

                if (ret.gt(1e1))  ret = ret.pow(2).div(1e1)
                if (ret.gt(1e2))  ret = ret.pow(2).div(1e2)
                if (ret.gt(1e4))  ret = ret.pow(2).div(1e4)
                if (ret.gt(1e8))  ret = ret.pow(2).div(1e8)

                if (hasMilestone("goalsii", 6)) ret = ret.times(2)

                ret = softcap(ret, "goalsii_eff")

                ret = ret.times(getBuyableEffect("e", 22))
                if (hasUpgrade("goalsii", 23)) ret = ret.pow(2)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("goalsii")
        },
        update(diff){
                let data = player.goalsii
                let gain = tmp.goalsii.getResetGain

                data.best = data.best.max(data.points)
                for (i in data.tokens.best){
                        data.tokens.best[i] = data.tokens.best[i].max(data.tokens.points[i])
                        data.tokens.copy[i] = data.tokens.points[i]
                }
                if (hasUpgrade("goalsii", 22)) {
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.bestOnce = data.bestOnce.max(gain)
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (false) {
                        data.abtime += diff
                        if (data.abtime > 10) data.abtime = 10
                        if (data.abtime > 1) {
                                data.abtime += -1
                        }
                } else {
                        data.abtime = 0
                }
                data.time += diff
                data.abupgstime += diff

                if (data.abupgstime > 10) data.abupgstime = 10
                if (data.abupgstime < 1) return
                data.abupgstime += -1

                //Autobuy A-E 
                let l =  ["a", "b", "c", "d", "e"]
                let l2 = ["A", "B", "C", "D", "E"]
                let trylist = [11, 12, 13, 14, 15, 
                               21, 22, 23, 24, 25,
                               31, 32, 33, 34, 35,
                               41, 42, 43, 44, 45,
                               51, 52, 53, 54, 55,]
                for (j in l){
                        i = l[j] //i is our layer
                        let can = data["autobuy" + l2[j]] && hasMilestone("goalsii", String(Number(j) + 2))
                        // check if the ab is on and unlocked
                        if (!can) continue
                        for (k in trylist) {
                                //if we have the upgrade continue
                                if (hasUpgrade(i, trylist[k])) continue
                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                
                                //if we dont have it, try to buy it and then break, so we only buy one
                                buyUpgrade(i, trylist[k])
                                if (!hasMilestone("goalsii", 8)) break
                        }
                }
                
                if (hasMilestone("goalsii", 18)) {
                        completeMaxPossibleChallenges("b")
                        completeMaxPossibleChallenges("c")
                }

                if (hasUpgrade("goalsii", 22)) {
                        layers.goalsii.onPrestige(gain)
                }
        },
        row: "side",
        hotkeys: [
                {key: "[", description: "[: Reset for Medals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+{", description: "Shift+[: Go to Medals", onPress(){
                                showTab("goalsii")
                        }
                },
        ],
        layerShown(){return player.goalsii.times > 0 || player.f.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")},
        prestigeButtonText(){
                if (player.tab != "goalsii") return ""
                let b = ""
                if (player.goalsii.times > 0) b = "This will keep you in the same challenge <br>"

                let gain = tmp.goalsii.getResetGain

                let a = "Reset for " + formatWhole(gain) + " " + this.resource

                let mid = ""
                if (!hasMilestone("goalsii", 12)) mid += " " + player.goalsii.currentChallenge

                a += "<br> and " + formatWhole(this.getTokenToMedalGain(gain)) + mid + " tokens"

                return b + a
        },
        canReset(){
                return player.f.best.gt(0) && tmp.goalsii.getResetGain.gt(0)
        },
        clickables: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                if (player.goalsii.tokens.best["00"].gt(0)) return "<h3 style='color: #13ACDF'>00</h3>"
                                return "<h3 style='color: #C03000'>00</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["00"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("00"), 4) + " to<br>"
                                let c = "all prior prestige gain exponents"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset || player.goalsii.currentChallenge != "00"
                        },
                        onClick(){
                                if (!this.canClick()) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "00"
                                player.goalsii.times ++
                        },
                },
                12: {
                        title(){
                                if (player.goalsii.tokens.best["01"].gt(0)) return "<h3 style='color: #13ACDF'>01</h3>"
                                return "<h3 style='color: #C03000'>01</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["01"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("01").times(100), 4) + "<br>"
                                let c = "/100 to <b>Country</b> and <b>Omnipotent I</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["00"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "01"
                                player.goalsii.times ++
                        },
                },
                13: {
                        title(){
                                if (player.goalsii.tokens.best["02"].gt(0)) return "<h3 style='color: #13ACDF'>02</h3>"
                                return "<h3 style='color: #C03000'>02</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["02"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("02"), 4) + " to<br>"
                                let c = "Doodle effect exponent"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["01"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "02"
                                player.goalsii.times ++
                        },
                },
                14: {
                        title(){
                                if (player.goalsii.tokens.best["03"].gt(0)) return "<h3 style='color: #13ACDF'>03</h3>"
                                return "<h3 style='color: #C03000'>03</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["03"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("03"), 4) + " to<br>"
                                let c = "<b>Delivery</b> and <b>December</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["02"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "03"
                                player.goalsii.times ++
                        },
                },
                15: {
                        title(){
                                if (player.goalsii.tokens.best["04"].gt(0)) return "<h3 style='color: #13ACDF'>04</h3>"
                                return "<h3 style='color: #C03000'>04</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["04"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("04"), 4) + "<br>"
                                let c = "to <b>Experience</b> and <b>Card</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["03"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "04"
                                player.goalsii.times ++
                        },
                },
                21: {
                        title(){
                                if (player.goalsii.tokens.best["10"].gt(0)) return "<h3 style='color: #13ACDF'>10</h3>"
                                return "<h3 style='color: #C03000'>10</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["10"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("10")) + "<br>"
                                let c = "Free <b>Director</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["00"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "10"
                                player.goalsii.times ++
                        },
                },
                22: {
                        title(){
                                if (player.goalsii.tokens.best["11"].gt(0)) return "<h3 style='color: #13ACDF'>11</h3>"
                                return "<h3 style='color: #C03000'>11</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["11"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("11")) + "<br>"
                                let c = "Free <b>Omnipotent II</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["10"].gt(0) && player.goalsii.tokens.best["01"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "11"
                                player.goalsii.times ++
                        },
                },
                23: {
                        title(){
                                if (player.goalsii.tokens.best["12"].gt(0)) return "<h3 style='color: #13ACDF'>12</h3>"
                                return "<h3 style='color: #C03000'>12</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["12"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("12")) + "<br>"
                                let c = "Free <b>Category</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["11"].gt(0) && player.goalsii.tokens.best["02"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "12"
                                player.goalsii.times ++
                        },
                },
                24: {
                        title(){
                                if (player.goalsii.tokens.best["13"].gt(0)) return "<h3 style='color: #13ACDF'>13</h3>"
                                return "<h3 style='color: #C03000'>13</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["13"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("13"), 4) + " <br>to "
                                let c = "base <b>F</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["12"].gt(0) && player.goalsii.tokens.best["03"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "13"
                                player.goalsii.times ++
                        },
                },
                25: {
                        title(){
                                if (player.goalsii.tokens.best["14"].gt(0)) return "<h3 style='color: #13ACDF'>14</h3>"
                                return "<h3 style='color: #C03000'>14</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["14"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("14")) + "<br>"
                                let c = "free <b>Experience</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["13"].gt(0) && player.goalsii.tokens.best["04"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "14"
                                player.goalsii.times ++
                        },
                },
                31: {
                        title(){
                                if (player.goalsii.tokens.best["20"].gt(0)) return "<h3 style='color: #13ACDF'>20</h3>"
                                return "<h3 style='color: #C03000'>20</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["20"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("20"), 4) + "<br>"
                                let c = "to <b>Department</b><br>base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["10"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "20"
                                player.goalsii.times ++
                        },
                },
                32: {
                        title(){
                                if (player.goalsii.tokens.best["21"].gt(0)) return "<h3 style='color: #13ACDF'>21</h3>"
                                return "<h3 style='color: #C03000'>21</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["21"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: x" + format(getGoalChallengeReward("21")) + "<br>"
                                let c = "<b>Egg</b> gain and <b>Account</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["20"].gt(0) && player.goalsii.tokens.best["11"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "21"
                                player.goalsii.times ++
                        },
                },
                33: {
                        title(){
                                if (player.goalsii.tokens.best["22"].gt(0)) return "<h3 style='color: #13ACDF'>22</h3>"
                                return "<h3 style='color: #C03000'>22</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["22"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("22")) + "<br>"
                                let c = "free <b>Drive</b><br>levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["21"].gt(0) && player.goalsii.tokens.best["12"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "22"
                                player.goalsii.times ++
                        },
                },
                34: {
                        title(){
                                if (player.goalsii.tokens.best["23"].gt(0)) return "<h3 style='color: #13ACDF'>23</h3>"
                                return "<h3 style='color: #C03000'>23</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["23"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("23"), 4) + " to<br>"
                                let c = "<b>E</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["22"].gt(0) && player.goalsii.tokens.best["13"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "23"
                                player.goalsii.times ++
                        },
                },
                35: {
                        title(){
                                if (player.goalsii.tokens.best["24"].gt(0)) return "<h3 style='color: #13ACDF'>24</h3>"
                                return "<h3 style='color: #C03000'>24</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["24"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: log(eggs)^" + format(getGoalChallengeReward("24"), 4) + "<br>"
                                let c = "boosts base <b>F</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["23"].gt(0) && player.goalsii.tokens.best["14"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "24"
                                player.goalsii.times ++
                        },
                },
                41: {
                        title(){
                                if (player.goalsii.tokens.best["30"].gt(0)) return "<h3 style='color: #13ACDF'>30</h3>"
                                return "<h3 style='color: #C03000'>30</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["30"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("30"), 4) + " to<br>"
                                let c = "<b>F</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["20"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "30"
                                player.goalsii.times ++
                        },
                },
                42: {
                        title(){
                                if (player.goalsii.tokens.best["31"].gt(0)) return "<h3 style='color: #13ACDF'>31</h3>"
                                return "<h3 style='color: #C03000'>31</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["31"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("31"), 4) + " to<br>"
                                let c = "medal and base <b>E</b> gain"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["30"].gt(0) && player.goalsii.tokens.best["21"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "31"
                                player.goalsii.times ++
                        },
                },
                43: {
                        title(){
                                if (player.goalsii.tokens.best["32"].gt(0)) return "<h3 style='color: #13ACDF'>32</h3>"
                                return "<h3 style='color: #C03000'>32</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["32"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("32"), 4) + " to<br>"
                                let c = "<b>Director</b> base per <b>Director</b>"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["31"].gt(0) && player.goalsii.tokens.best["22"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "32"
                                player.goalsii.times ++
                        },
                },
                44: {
                        title(){
                                if (player.goalsii.tokens.best["33"].gt(0)) return "<h3 style='color: #13ACDF'>33</h3>"
                                return "<h3 style='color: #C03000'>33</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["33"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("33"), 2) + " to<br>"
                                let c = "<b>E</b> gain exp"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["32"].gt(0) && player.goalsii.tokens.best["23"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "33"
                                player.goalsii.times ++
                        },
                },
                45: {
                        title(){
                                if (player.goalsii.tokens.best["34"].gt(0)) return "<h3 style='color: #13ACDF'>34</h3>"
                                return "<h3 style='color: #C03000'>34</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["34"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: /" + format(getGoalChallengeReward("34")) + "<br>"
                                let c = "<b>East</b> cost and <b>Due</b> linear scaling"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["33"].gt(0) && player.goalsii.tokens.best["24"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "34"
                                player.goalsii.times ++
                        },
                },
                51: {
                        title(){
                                if (player.goalsii.tokens.best["40"].gt(0)) return "<h3 style='color: #13ACDF'>40</h3>"
                                return "<h3 style='color: #C03000'>40</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["40"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("40")) + "<br>"
                                let c = "free <b>Example</b> and <b>Database</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["30"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "40"
                                player.goalsii.times ++
                        },
                },
                52: {
                        title(){
                                if (player.goalsii.tokens.best["41"].gt(0)) return "<h3 style='color: #13ACDF'>41</h3>"
                                return "<h3 style='color: #C03000'>41</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["41"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: *" + format(getGoalChallengeReward("41")) + " to<br>"
                                let c = "medal gain and <b>Department</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["40"].gt(0) && player.goalsii.tokens.best["31"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "41"
                                player.goalsii.times ++
                        },
                },
                53: {
                        title(){
                                if (player.goalsii.tokens.best["42"].gt(0)) return "<h3 style='color: #13ACDF'>42</h3>"
                                return "<h3 style='color: #C03000'>42</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["42"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + format(getGoalChallengeReward("42"), 4) + " to<br>"
                                let c = "<b>Omnipotent III</b> base"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["41"].gt(0) && player.goalsii.tokens.best["32"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "42"
                                player.goalsii.times ++
                        },
                },
                54: {
                        title(){
                                if (player.goalsii.tokens.best["43"].gt(0)) return "<h3 style='color: #13ACDF'>43</h3>"
                                return "<h3 style='color: #C03000'>43</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["43"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("43")) + "<br>"
                                let c = "free <b>Easy</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["42"].gt(0) && player.goalsii.tokens.best["33"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "43"
                                player.goalsii.times ++
                        },
                },
                55: {
                        title(){
                                if (player.goalsii.tokens.best["44"].gt(0)) return "<h3 style='color: #13ACDF'>44</h3>"
                                return "<h3 style='color: #C03000'>44</h3>"
                        },
                        display(){
                                if (player.tab != "goalsii") return ""
                                let a = "<h3 style='color: #AC4600'>Tokens</h3>: " + formatWhole(player.goalsii.tokens.points["44"]) + "<br>"
                                let b = "<h3 style='color: #00FF66'>Reward</h3>: +" + formatWhole(getGoalChallengeReward("44")) + "<br>"
                                let c = "free <b>Enter</b> levels"
                                return a + b + c
                        },
                        unlocked(){
                                return player.goalsii.times > 0 || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        canClick(){
                                if (player.tab != "goalsii") return false
                                return tmp.goalsii.canReset && player.goalsii.tokens.best["43"].gt(0) && player.goalsii.tokens.best["34"].gt(0)
                        },
                        onClick(){
                                if (!tmp.goalsii.canReset) return 
                                let gain = layers.goalsii.getResetGain()
                                layers.goalsii.onPrestige(gain)
                                addPoints("goalsii", gain)
                                doReset("goalsii", true)
                                player.goalsii.currentChallenge = "44"
                                player.goalsii.times ++
                        },
                },
        },
        milestones: {
                0: {
                        requirementDescription: "<b>άλφα (Alpha)</b><br>Requires: 1 Medal", 
                        effectDescription: "Autobuyers are 3x faster and buy 10x more",
                        done(){
                                return player.goalsii.points.gte(1)
                        },
                        unlocked(){
                                return true
                        },
                }, // hasMilestone("goalsii", 0)
                1: {
                        requirementDescription: "<b>βήτα (Beta)</b><br>Requires: 2 Medals", 
                        effectDescription: "You keep all autobuyers and they buy 10x more",
                        done(){
                                return player.goalsii.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 0) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 1)
                2: {
                        requirementDescription: "<b>γάμμα (Gamma)</b><br>Requires: 3 Medals", 
                        effectDescription: "Automatically buy <b>A</b> upgrades, <b>A</b> buyables don't cost anything, and keep <b>Also</b>",
                        done(){
                                return player.goalsii.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 1) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyA"]]
                }, // hasMilestone("goalsii", 2)
                3: {
                        requirementDescription: "<b>δέλτα (Delta)</b><br>Requires: 5 Medals", 
                        effectDescription: "Automatically buy <b>B</b> upgrades, <b>B</b> buyables don't cost anything, and keep <b>Buy</b>",
                        done(){
                                return player.goalsii.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 2) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyB"]]
                }, // hasMilestone("goalsii", 3)
                4: {
                        requirementDescription: "<b>έψιλον (Epsilon)</b><br>Requires: 7 Medals", 
                        effectDescription: "Automatically buy <b>C</b> upgrades, <b>C</b> buyables don't cost anything, and keep <b>County</b>",
                        done(){
                                return player.goalsii.points.gte(7)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 3) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyC"]]
                }, // hasMilestone("goalsii", 4)
                5: {
                        requirementDescription: "<b>ζήτα (Zeta)</b><br>Requires: 11 Medals", 
                        effectDescription: "Automatically buy <b>D</b> upgrades, <b>D</b> buyables don't cost anything, and keep <b>Development</b>",
                        done(){
                                return player.goalsii.points.gte(11)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 4) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyD"]]
                }, // hasMilestone("goalsii", 5)
                6: {
                        requirementDescription: "<b>ήτα (Eta)</b><br>Requires: 15 Medals", 
                        effectDescription: "Automatically buy <b>E</b> upgrades, keep <b>Every</b>, and double Medal effect",
                        done(){
                                return player.goalsii.points.gte(15)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 5) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                        toggles: [["goalsii", "autobuyE"]]
                }, // hasMilestone("goalsii", 6)
                7: {
                        requirementDescription: "<b>θήτα (Theta)</b><br>Requires: 22 Medals", 
                        effectDescription: "The first five <b>Goal</b> milestones require half as many goals to unlock",
                        done(){
                                return player.goalsii.points.gte(22)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 6) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 7)
                8: {
                        requirementDescription: "<b>ιώτα (Iota)</b><br>Requires: 1 11 Token", 
                        effectDescription: "The above autobuyers can bulk and unlock a <b>C</b> buyable and buyable autobuyers bulk is multiplied by medals",
                        done(){
                                return player.goalsii.tokens.best["11"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 8)
                9: {
                        requirementDescription: "<b>κάππα (Kappa)</b><br>Requires: 1 22 Token", 
                        effectDescription: "Remove the ability to <b>F</b> reset but gain 100% of Features on prestige per second",
                        done(){
                                return player.goalsii.tokens.best["22"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 8) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 9)
                10: {
                        requirementDescription: "<b>λάμβδα (Lambda)</b><br>Requires: 1 03 Token", 
                        effectDescription: "<b>Category</b> gives free <b>Conditions</b> and <b>Canada</b> levels",
                        done(){
                                return player.goalsii.tokens.best["03"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 9) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 10)
                11: {
                        requirementDescription: "<b>μυ (Mu)</b><br>Requires: 20 03 Tokens", 
                        effectDescription: "Per milestone squared add .01 to the <b>E</b> gain exponent and each milestone lets the buyable autobuyer buy 2x more",
                        done(){
                                return player.goalsii.tokens.best["03"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 10) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 11)
                12: {
                        requirementDescription: "<b>νυ (Nu)</b><br>Requires: 20 13 Tokens", 
                        effectDescription: "Upon completing a challenge you get tokens for all challenges to the left and above",
                        done(){
                                return player.goalsii.tokens.best["13"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 11) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 12)
                13: {
                        requirementDescription: "<b>ξι (Xi)</b><br>Requires: 3 23 Token", 
                        effectDescription: "Add one to the medal gain exponent (1 -> 2)",
                        done(){
                                return player.goalsii.tokens.best["23"].gte(3)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 12) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 13)
                14: {
                        requirementDescription: "<b>όμικρον (Omicron)</b><br>Requires: 20 31 Token", 
                        effectDescription(){
                                if (player.tab != "goalsii") return ""
                                let a = "log10(10+medals) boosts base <b>F</b> gain, currently: "
                                return a + format(player.goalsii.points.max(10).log10(), 4)
                        },
                        done(){
                                return player.goalsii.tokens.best["31"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 13) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 14)
                15: {
                        requirementDescription: "<b>πι (Pi)</b><br>Requires: 3 32 Tokens", 
                        effectDescription: "Unlock <b>Omnipotent III</b> which gives free levels to all <b>C</b> buyables",
                        done(){
                                return player.goalsii.tokens.best["32"].gte(3)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 14) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 15)
                16: {
                        requirementDescription: "<b>ρώ (Rho)</b><br>Requires: 20 32 Tokens", 
                        effectDescription: "Each milestone adds .1 to the <b>Omnipotent III</b> base and gives two free levels",
                        done(){
                                return player.goalsii.tokens.best["32"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 15) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 16)
                18: {
                        requirementDescription: "<b>σίγμα (Sigma)</b><br>Requires: 10 33 Tokens", 
                        effectDescription(){
                                if (player.tab != "goalsii") return ""
                                let a = "Once per second, automatically complete <b>B</b> and <b>C</b> challenges if you have enough points and Goals^Goals multiply <b>E</b> gain, currently: "
                                let b = Math.max(1, player.ach.achievements.length)
                                return a + format(Decimal.pow(b, b))
                        },
                        done(){
                                return player.goalsii.tokens.best["33"].gte(10)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 16) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 18) 
                19: {
                        requirementDescription: "<b>ταυ (Tau)</b><br>Requires: 1 04 Tokens", 
                        effectDescription: "Unlock an <b>E</b> buyable and <b>Drive</b> gives free <b>Department</b> levels",
                        done(){
                                return player.goalsii.tokens.best["04"].gte(1)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 18) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 19) 
                20: {
                        requirementDescription: "<b>ύψιλον (Upsilon)</b><br>Requires: 4 04 Tokens", 
                        effectDescription: "Autobuy <b>E</b> buyables once per second and <b>Experience</b> gives free <b>Director</b> levels",
                        done(){
                                return player.goalsii.tokens.best["04"].gte(4)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 19) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 20) 
                21: {
                        requirementDescription: "<b>φι (Phi)</b><br>Requires: 16 04 Tokens", 
                        effectDescription: "Unlock a <b>D</b> buyable, remove <b>Drive</b>'s logarithimic softcap, and get a free <b>Experience</b> level",
                        done(){
                                return player.goalsii.tokens.best["04"].gte(16)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 20) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 21) 
                22: {
                        requirementDescription: "<b>χι (Chi)</b><br>Requires: 20 14 Tokens", 
                        effectDescription: "Unlock a <b>E</b> buyable, <b>Due</b> gives free <b>Drive</b> and <b>Director</b> levels, and remove <b>Experience</b> linear scaling",
                        done(){
                                return player.goalsii.tokens.best["14"].gte(20)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 22) 
                23: {
                        requirementDescription: "<b>ψι (Psi)</b><br>Requires: 50 24 Tokens", 
                        effectDescription: "<b>East</b> gives free <b>Experience</b> and <b>Due</b> levels, remove <b>East</b> linear scaling, and get a free <b>East</b> level per milestone",
                        done(){
                                return player.goalsii.tokens.best["24"].gte(50)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 23)
                24: {
                        requirementDescription: "<b>ωμέγα (Omega)</b><br>Requires: 10 34 Tokens", 
                        effectDescription: "Unlock a <b>E</b> and <b>D</b> buyable, <b>E</b> buyables cost nothing, each goal adds .002 to the <b>East</b> base, and unlock upgrades",
                        done(){
                                return player.goalsii.tokens.best["34"].gte(10)
                        },
                        unlocked(){
                                return hasMilestone("goalsii", 23) || player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("goalsii", 24)
                //https://en.wikipedia.org/wiki/Greek_alphabet
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Artin",
                        description: "<b>Example</b> gives free <b>East</b> levels and each upgrade adds .01 to the <b>East</b> base",
                        cost: new Decimal(6660),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return true || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 11)
                },
                12: {
                        title: "Bernard",
                        description: "<b>Example</b> gives free <b>Experience</b> levels and challenge 34 reward effects <b>Example</b>",
                        cost: new Decimal(3330),
                        currencyDisplayName: "<br><b style='color: #6600FF'>01</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "01"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 11)  || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 12)
                },
                13: {
                        title: "Cauchy",
                        description: "Each upgrade adds .02 to the <b>Example</b> base and .2 to the <b>F</b> gain exponent",
                        cost: new Decimal(5000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>02</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "02"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 12) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 13)
                },
                14: {
                        title: "Diophantine",
                        description: "Square <b>E</b> gain in challenge 4 and each upgrade adds 100 to the <b>D</b> gain exponent and base gain",
                        cost: new Decimal(2000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>03</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "03"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 13) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 14)
                },
                15: {
                        title: "Erdős",
                        description: "Upgrades make medals multiply <b>F</b> gain",
                        cost: new Decimal(1000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>04</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "04"
                        },
                        effect(){
                                let base = player.goalsii.best.plus(1)
                                let exp = Math.sqrt(player.goalsii.upgrades.length) / 3
                                return Decimal.pow(base, exp) 
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 14) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 15)
                },
                21: {
                        title: "Fermat",
                        description: "Each upgrade in this row unlocks an <b>E</b> buyable",
                        cost: new Decimal(20),
                        currencyDisplayName: "<br><b style='color: #6600FF'>42</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "42"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 15) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 21)
                },
                22: {
                        title: "Gödel",
                        description: "Gain tokens and medals per second as if you prestiged",
                        cost: new Decimal(20),
                        currencyDisplayName: "<br><b style='color: #6600FF'>43</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "43"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 21) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 22)
                },
                23: {
                        title: "Hilbert",
                        description: "Square medal effect and <b>Easy</b> gives free <b>Example</b> levels",
                        cost: new Decimal(1000),
                        currencyDisplayName: "<br><b style='color: #6600FF'>43</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "43"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 22) || player.g.best.gt(0) || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 23)
                },
                24: {
                        title: "Iwasawa",
                        description: "Per upgrade, gain 1.1x medals and gain 1.25^upgrades more <b>F</b> in challenge 4",
                        cost: new Decimal(500),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasMilestone("g", "4") || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 24)
                },
                25: {
                        title: "Jacobsin",
                        description: "Start with 1e5 medals",
                        cost: new Decimal(1e3),
                        currencyDisplayName: "<br><b style='color: #6600FF'>44</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "44"
                        },
                        unlocked(){ 
                                return hasMilestone("g", "6") || hasUnlockedPast("g")
                        }, // hasUpgrade("goalsii", 25)
                },
                31: {
                        title: "Kempe",
                        description: "The 16 games that give progress bulk complete automatically so long as you have the games",
                        cost: new Decimal("1e4098"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 13) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 31)
                },
                32: {
                        title: "Laplace",
                        description: "Each upgrade multiplies base <b>G</b> gain by 1.1 and double <b>Gold</b> speed",
                        cost: new Decimal("1e4099"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 31) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 32)
                },
                33: {
                        title: "Mandelbrot",
                        description: "Each upgrade raises charge gain ^1.1 and double <b>Gold</b> speed",
                        cost: new Decimal("1e4125"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 32) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 33)
                },
                34: {
                        title: "Noether",
                        description: "Unlock an <b>F</b> buyable, double <b>Gold</b> speed, and gain 10x medals",
                        cost: new Decimal("1e4128"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 33) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 34)
                },
                35: {
                        title: "Oppenheim",
                        description: "<b>Four</b> gives free <b>Omnipotent V</b> levels",
                        cost: new Decimal("1e4129"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 34) || hasUnlockedPast("h")
                        }, // hasUpgrade("goalsii", 35)
                },
                41: {
                        title: "Poisson",
                        description: "Per upgrade add 1 to the <b>H</b> gain exponent",
                        cost: new Decimal("5e186621"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("g", 54) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 41)
                },
                42: {
                        title: "Russell",
                        description: "Per upgrade act as if you have 2% less rebirths",
                        cost: new Decimal("1e186645"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 41) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 42)
                },
                43: {
                        title: "Schrier",
                        description: "Unlock Rebirth III",
                        cost: new Decimal("1e14159e3"),
                        currencyDisplayName: "<br><b style='color: #6600FF'>00</b> Tokens",
                        currencyLocation(){
                                return player.goalsii.tokens.copy
                        },
                        currencyInternalName(){
                                return "00"
                        },
                        unlocked(){ 
                                return hasUpgrade("goalsii", 42) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 43)
                },
                44: {
                        title: "Turing",
                        description: "<b>Goal</b> gives free <b>Guidelines</b> levels and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e23266e3"),
                        unlocked(){ 
                                return hasUpgrade("goalsii", 43) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 44)
                },
                45: {
                        title: "Ufimtsev",
                        description: "Automatically bulk buy Rebirth II and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e28689e3"),
                        unlocked(){ 
                                return hasUpgrade("goalsii", 44) || hasUnlockedPast("i")
                        }, // hasUpgrade("goalsii", 45)
                },

                // 
                

                /*
                
                Villiani
                Wiles
                Xi
                Yin
                Zhao
                */
                
        },
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text", "This resets all prior Goals and all layers before and including F"],
                                ["display-text", "Click a button below to enter a challenge", function (){ return !player.goalsii.best.gt(0) ? {'display': 'none'} : {}}],
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        return "You are currently in challenge <h3 style = 'color: #CC00FF'>" + player.goalsii.currentChallenge + "</h3>"
                                }],
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        return getChallengeDepth(3) == 0 ? "" : "You have " + format(player.f.points) + " features"
                                }],
                                "prestige-button",
                                "clickables",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Details": {
                        content: [
                                "main-display",
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        return "You are currently in challenge <h3 style = 'color: #CC00FF'>" + player.goalsii.currentChallenge + "</h3>"
                                }],
                                ["display-text", function() {
                                        if (player.tab != "goalsii") return ""
                                        let a = "That means you have the following effects due to challenges: " 
                                        if (getChallengeDepth(1) == 0) return ""
                                        a += "<br>Prestige Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.985, getChallengeDepth(1)), 4) + "</h3>"
                                        if (getChallengeDepth(2) == 0) return a
                                        a += ", Feature Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.9, getChallengeDepth(2) + getChallengeDepth(4)), 4) + "</h3>"
                                        a += ", Point Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.9, getChallengeDepth(2)), 4) + "</h3>"
                                        a += ", <br>Egg Gain: <h3 style = 'color: #CC00FF'>^" + format(Decimal.pow(.9, getChallengeDepth(2)).times(Decimal.pow(.8, getChallengeDepth(3))), 4) + "</h3>"
                                        if (getChallengeDepth(3) == 0) return a
                                        a += ",<br>First column buyables have no effect in the first <h3 style = 'color: #CC00FF'>" + formatWhole(Math.min(getChallengeDepth(3), 4)) + "</h3> layers"
                                        if (getChallengeDepth(4) == 0) return a
                                        a += ",<br>You get no extra buyables in the first <h3 style = 'color: #CC00FF'>" + formatWhole(getChallengeDepth(4)) + "</h3> layers"
                                        return a
                                }],
                                ["display-text", function(){
                                        if (player.tab != "goalsii") return ""
                                        let a = `<br><br>
                                        <h2 style = 'color: #CC0033'>Explanation</h2><h2>:</h2> <br><br>

                                        Each challenge has a reward, and upon claiming said reward<br>
                                        all prior unlocked main layers are totally reset, and goals are also reset<br>
                                        <br>
                                        There are 5 challenges, and the first is nothing<br>
                                        <br>
                                        Challenge AB means you are in Challenge A twice and Challenge B once<br>
                                        For example Challenge 03 means you are in challenge 0 twice and challenge 3 once<br>
                                        <br>
                                        The Challenge table is as follows:<br>
                                        00, 01, 02, 03, 04<br>
                                        10, 11, 12, 13, 14<br>
                                        20, 21, 22, 23, 24<br>
                                        30, 31, 32, 33, 34<br>
                                        40, 41, 42, 43, 44<br>
                                        <br>
                                        Each completion gives tokens<br>
                                        The following only applies to layers unlocked before Goals II<br>
                                        C0: Nothing<br>
                                        C1: Raise all prestige gains ^.985 + C0<br>
                                        C2: Raise point, Egg, and Feature gain ^.9 + C1<br>
                                        C3: First column buyables do not give effects in the first n layers<br> and raise <b>Egg</b> gain ^.8 + 2xC2<br>
                                        C4: No buyables give free levels to buyables in the first n layers<br> and raise <b>Feature</b> gain ^.9 + 3xC3<br>
                                        <br>
                                        You can only enter challenges if you can medal reset, or if you aren't in challenge 00,<br>
                                        and want to enter challenge 00 to avoid softlocking <br>
                                        To unlock the ability to enter a given challenge you need to have gotten<br> at least one token for the challenge
                                        to the left and above<br>
                                        <br><br>
                                        Complete a challenge by medal resetting, which requires <b>F</b> resetting at least once.<br>
                                        To get tokens in challenge 3 you need at least 1e19 Features.<br>
                                        <br>
                                        Completion of a challenge gives a token to that "upgrade" which gives an effect<br>
                                        You get tokens per reset based on Medals gained, with the base gain being 1
                                        <br><br><br><br>`
                                        return a
                                        },
                                ],
                        ],
                        unlocked(){
                                return player.goalsii.best.gt(0) || tmp.g.layerShown
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return player.goalsii.times > 1 || tmp.g.layerShown
                        },
                },
                "Upgrades": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                                if (player.tab != "goalsii") return ""
                                                return "Upgrades require a certain number of tokens, but do not cost tokens"
                                        },
                                ],
                                "upgrades",
                        ],
                        unlocked(){
                                return hasMilestone("goalsii", 24) || tmp.g.layerShown
                        },
                },
        },
        doReset(layer){
                if (["a","b","c","d","e","f","ach","goalsii"].includes(layer)) return
                if (hasMilestone("i", 1)) return

                let data = player.goalsii

                let init = hasUpgrade("goalsii", 25) ? 1e5: 0

                data.points   = new Decimal(init)
                data.best     = new Decimal(init)
                data.total    = new Decimal(init)
                data.bestOnce = new Decimal(0)
                if (!hasMilestone("g", 8)) data.currentChallenge = "00"
                data.times = 0
                let keep2 = []
                for (i = 0; i < Math.min(25, player.g.times); i++){
                        if (!hasMilestone("g", 5)) break
                        keep2.push([
                                11, 12, 13, 14, 15,
                                21, 22, 23, 24, 25,
                                31, 32, 33, 34, 35,
                                41, 42, 43, 44, 45,
                                51, 52, 53, 54, 55,
                        ][i])
                }
                if (!hasUpgrade("g", 14)) data.upgrades = filter(data.upgrades, keep2)
                let keep1 = []
                if (hasMilestone("g", 2)) {
                        let qw = Math.min(25, player.g.times * 3)
                        let all = [
                                 "0",  "1",  "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9",
                                "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                                "20", "21", "22", "23", "24"
                        ]
                        for (i = 0; i < qw; i ++){
                                keep1.push(all[i])
                        }
                }
                if (!hasUpgrade("g", 14)) data.milestones = filter(data.milestones, keep1)
                let remove1 = [
                        "11", "12", "13", "14", "15", "16", "17", 
                        "21", "22", "23", "24", "25", "26", "27", 
                        "31", "32", "33", "34", "35", "36", "37", 
                        "41", "42", "43", "44", "45", "46", "47", 
                        "51", "52", "53", "54", "55", "56", "57", 
                        "61", "62", "63", "64", "65", "66", "67", 
                        "71", "72", "73", "74", "75", "76", "77", 
                        "81", "82", "83", "84", "85", "86", "87", 
                        "91", "92", "93", "94", "95", "96", "97", 
                        "101","102","103","104","105","106","107", 
                        "111","112","113","114","115","116","117", 
                        "121","122","123"]
                player.ach.achievements = filterout(player.ach.achievements, remove1)
                player.ach.milestones = []
                player.f.bestc44 = new Decimal(0)
                player.ach.points = new Decimal(0)
                updateAchievements("ach")
                updateMilestones("ach")

                let k = ["a", "b", "c", "d", "e"]
                for (abcd in k){
                        i = k[abcd]
                        z = player[i].challenges
                        if (z == undefined) continue
                        for (j in z){
                                z[j] = 0
                        }
                }

                if (hasMilestone("g", 8)) return
                if (hasUpgrade("g", 14)) return

                let a = {}
                let b = {}
                let c = {}
                let e = {}
                let l = ["00", "01", "02", "03", "04",
                         "10", "11", "12", "13", "14",
                         "20", "21", "22", "23", "24",
                         "30", "31", "32", "33", "34",
                         "40", "41", "42", "43", "44",
                        ]
                let initTokens = hasMilestone("g", 7) ? 1 : 0
                for (j in l){
                        i = l[j]
                        a[i] = new Decimal(initTokens)
                        b[i] = new Decimal(initTokens)
                        c[i] = new Decimal(initTokens)
                        e[i] = new Decimal(initTokens)
                }

                data.tokens = {
                                points: a,
                                best: b,
                                total: c,
                                copy: e,
                        }
        },
        getTokenToMedalGain(gain){
                if (getChallengeDepth(3) > 0 && player.f.best.lt(1e19)) return new Decimal(0)
                return gain.times(2).pow(.75).floor()
        },
        getAllPrior(chall){
                if (chall == undefined) chall = player.goalsii.currentChallenge
                let a = Number(chall.slice(0,1))
                let b = Number(chall.slice(1,2))
                let l = []
                for (i = 0; i <= a; i ++){
                        for (j = 0; j <= b; j ++){
                                l.push(String(i)+String(j)) 
                        }
                }
                return l
        },
        onPrestige(gain){
                gain = this.getTokenToMedalGain(gain)
                let data = player.goalsii.tokens
                let chall = player.goalsii.currentChallenge
                let toAdd = [chall]
                if (hasMilestone("goalsii", 12)) toAdd = this.getAllPrior()

                for (i in toAdd) {
                        c = toAdd[i]
                        data.points[c] = data.points[c].plus(gain)
                        data.total[c]  = data.total[c].plus(gain)
                }
        },
})

addLayer("g", {
        name: "Games",
        symbol: "G",
        position: 0,
        startData() { 
                let l = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54]
                let b = {}
                for (j in l){
                        b[l[j]] = new Decimal(0)
                }
                
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        clickableAmounts: b,
                        charges: new Decimal(3),
                        chargesMax: new Decimal(10),
                        chargesTime: 0,
                        partialTally: 0,
                        completedTally: 0,
                        rebirths: {
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                        },
                        autodev: false,
                        autotime: 0,
                }
        },
        color: "#996600",
        branches: ["f"],
        requires: new Decimal(0),
        resource: "Games",
        baseResource: "Features",
        baseAmount() {
                if (hasUpgrade("f", 11)) return player.f.best
                return player.f.bestc44.floor()
        },
        type: "custom",
        getResetGain() {
                if (tmp.g.baseAmount.lt(1e19)) return new Decimal(0)
                return getGeneralizedPrestigeGain("g")
        },
        getBaseDiv(){
                let x = new Decimal(1e9)
                return x
        },
        getGainExp(){
                let x = new Decimal(1.5)
                if (hasMilestone("g", 10)) x = x.plus(player.g.partialTally.min(5e7).times(.01))
                x = x.plus(CURRENT_GAMES_EFFECTS["partial"]["G Gain exponent"][0])
                if (hasUpgrade("f", 24)) x = x.plus(player.f.upgrades.length ** 2)
                if (hasUpgrade("g", 25)) x = x.plus(6 * player.g.upgrades.length)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["g11"])
                x = x.plus(CURRENT_BUYABLE_EFFECTS["h11"])
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1/10)
                if (hasMilestone("g", 15)) x = x.times(2)
                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Base G Gain"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Base G Gain"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["complete"]["Base G Gain"][0])
                if (hasMilestone("g", 20)) x = x.times(3)
                if (hasUpgrade("f", 15)) x = x.times(1.15)
                if (hasUpgrade("f", 31)) x = x.times(Decimal.pow(1.01, player.f.upgrades.length))
                if (hasUpgrade("f", 44)) x = x.times(Decimal.pow(1.001, player.f.upgrades.length ** 2))
                if (hasUpgrade("f", 35)) x = x.times(player.ach.points.max(1))
                if (hasUpgrade("g", 13)) x = x.times(Decimal.pow(2, player.g.upgrades.length))
                if (hasUpgrade("d", 52)) x = x.times(Decimal.pow(1.01, player.d.upgrades.length))
                if (hasUpgrade("e", 31)) {
                        let a = player.e.upgrades.length
                        if (hasUpgrade("e", 33)) a *= 2
                        if (hasUpgrade("e", 34)) a *= 2
                        x = x.times(Decimal.pow(1.1, a))
                }
                x = x.times(getBuyableEffect("e", 33))
                if (hasUpgrade("e", 54)) x = x.times(player.g.charges.max(3).ln())
                if (hasUpgrade("g", 25)) x = x.times(Decimal.pow(5, player.g.upgrades.length))
                if (hasUpgrade("h", 12)) x = x.times(Decimal.pow(2, player.h.upgrades.length))
                if (hasUpgrade("goalsii", 32)) x = x.times(Decimal.pow(1.1, player.goalsii.upgrades.length))
                if (hasUpgrade("g", 33)) x = x.times(Decimal.pow(2, totalChallengeComps("f")))
                if (hasMilestone("i", 3)) x = x.times(Decimal.pow(2, player.i.milestones.length))
                x = x.times(tmp.f.challenges[22].rewardEffect)
                x = x.times(CURRENT_BUYABLE_EFFECTS["g12"])
                x = x.times(CURRENT_BUYABLE_EFFECTS["h31"])
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("g")

                x = x.times(CURRENT_GAMES_EFFECTS["partial"]["Games"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["complete"]["Games"][0])
                x = x.times(CURRENT_GAMES_EFFECTS["rebirth"]["Games"][0])
                if (hasMilestone("g", 13)) x = x.times(Decimal.sqrt(Decimal.max(player.g.charges, 1)))

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("g")) return new Decimal(1)

                let amt = player.g.best

                let exp = new Decimal(3)
                if (hasMilestone("g", 14)) exp = exp.times(2)
                if (hasUpgrade("d", 54)) exp = exp.plus(.1)
                exp = exp.times(tmp.f.challenges[21].rewardEffect)

                let ret = amt.times(4).plus(1).pow(exp)

                //ret = softcap(ret, "g_eff")


                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("g")
        },
        getMaxCharges(){
                let ret = new Decimal(10)
                if (hasMilestone("g", 11)) ret = ret.plus(90)
                ret = ret.plus(CURRENT_GAMES_EFFECTS["partial"]["Max Charges"][0])
                if (hasMilestone("g", 18)) ret = ret.times(3)
                if (hasMilestone("g", 21)) ret = ret.times(6)
                if (hasMilestone("g", 23)){
                        ret = ret.times(Decimal.pow(2, tmp.g.clickables.getPrimaryRebirths))
                }
                if (hasUpgrade("g", 12)) ret = ret.pow(1.3)
                if (hasMilestone("h", 3)) ret = ret.pow(Decimal.pow(1.1, player.h.milestones.length))
                return ret.floor()
        },
        update(diff){
                let data = player.g

                data.best = data.best.max(data.points)
                if (hasMilestone("g", 9)) {
                        let gain = tmp.g.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("g", 51)) {
                        handleGeneralizedBuyableAutobuy(diff, "g")
                } else {
                        data.abtime = 0
                }
                let cpm = tmp.g.clickables.getChargesPerMinute
                if (cpm > 0 && data.charges.lt(data.chargesMax)) {
                        data.chargesTime += diff
                        let a = data.chargesTime > Decimal.div(60, cpm)
                        let b = cpm.gt(1e10)
                        if (a || b)  {
                                let x = cpm.times(data.chargesTime/60).floor()
                                if (!b) {
                                        data.chargesTime += Decimal.div(x, cpm).times(-60).toNumber()
                                } else {
                                        data.chargesTime = 0
                                }
                                data.charges = data.charges.plus(x)
                                if (data.charges.gt(data.chargesMax)) data.charges = data.chargesMax
                        }
                } else {
                        data.chargesTime = 0
                }

                let rb = player.g.rebirths[1]

                data.completedTally = Decimal.times(16, rb)
                
                data.partialTally = Decimal.times(160, rb * (rb+1) / 2)
                for (i in data.clickableAmounts){
                        if (["11","12","13","14"].includes(i)) continue
                        j = data.clickableAmounts[i]
                        if (j.eq(tmp.g.clickables.getCompletionsReq)) {
                                data.completedTally = data.completedTally.plus(1)
                        }
                        data.partialTally = data.partialTally.plus(j)
                }

                data.chargesMax = tmp.g.getMaxCharges

                if (hasMilestone("g", 19) && data.autodev){
                        let diffmult = 1
                        if (hasUpgrade("goalsii", 32)) diffmult *= 2
                        if (hasUpgrade("goalsii", 33)) diffmult *= 2
                        if (hasUpgrade("goalsii", 34)) diffmult *= 2
                        data.autotime += diff * diffmult
                        if (data.autotime > 10) data.autotime = 10
                        if (data.autotime > 1){
                                data.autotime += -1
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]

                                if (hasUpgrade("f", 34)) l.push(11,12,13,14)

                                for (j in l){
                                        layers.g.clickables[l[j]].onClick(true)
                                }
                                if (hasUpgrade("f", 33)) layers.g.clickables[15].onClick()
                                if (hasUpgrade("g", 51)) layers.g.clickables[25].onClick()
                                if (hasUpgrade("h", 32)) layers.g.clickables[35].onClick()
                                if (player.j.puzzle.upgrades.includes(42)) layers.g.clickables[45].onClick()
                        }
                } else {
                        data.autotime = 0
                }

                if (hasMilestone("i", 8)) {
                        cmr = tmp.g.clickables.getCurrentMaxRebirths
                        let diff = cmr - player.g.rebirths[1]
                        player.g.rebirths[1] = cmr 
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                if (hasUpgrade("goalsii", 45)) {
                        let diff = Math.floor(player.g.rebirths[1]/10) - player.g.rebirths[2]
                        player.g.rebirths[2] += Math.max(diff, 0)
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                if (hasUpgrade("h", 52)) {
                        let diff = Math.floor(player.g.rebirths[2]/10) - player.g.rebirths[3]
                        player.g.rebirths[3] += Math.max(diff, 0)
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                if (false) {
                        let diff = Math.floor(player.g.rebirths[3]/10) - player.g.rebirths[4]
                        player.g.rebirths[4] += Math.max(diff, 0)
                        if (diff > 0){
                                for (i in data.clickableAmounts){
                                        if (["11","12","13","14"].includes(i)) continue
                                        data.clickableAmounts[i] = new Decimal(0)
                                }
                        }
                }

                data.time += diff
        },
        row: 6,
        hotkeys: [
                {key: "g", description: "G: Reset for Games", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+G", description: "Shift+G: Go to Games", onPress(){
                                showTab("g")
                        }
                },
                {key: "0", description: "0: Attempt to dev all games once", onPress(){
                                let data = layers.g.clickables
                                let b = [11, 12, 13, 14,
                                        21, 22, 23, 24,
                                        31, 32, 33, 34,
                                        41, 42, 43, 44,
                                        51, 52, 53, 54,]
                                for (i = 0; i < 20; i++){
                                        let data2 = data[b[i]]
                                        if (data2.canClick()) data2.onClick()
                                }
                        }
                },
        ],
        layerShown(){return player.goalsii.tokens.best["44"].gt(0) || player.g.best.gt(0) || hasUnlockedPast("g")},
        prestigeButtonText(){
                if (hasMilestone("g", 9)) return ""
                return getGeneralizedPrestigeButtonText("g")
        },
        canReset(){
                return player.g.time >= 2 && !hasMilestone("g", 9) && tmp.g.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Get</b><br>Requires: 1 Games", 
                        effectDescription: "Raise all prior prestige gain ^1.001 and double medal gain",
                        done(){
                                return player.g.points.gte(1)
                        },
                        unlocked(){
                                return true
                        },
                }, // hasMilestone("g", 1)
                2: {
                        requirementDescription: "<b>Go</b><br>Requires: 2 Games", 
                        effectDescription: "Each <b>G</b> reset allows you to keep three medal milestones",
                        done(){
                                return player.g.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("g", 1) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 2)
                3: {
                        requirementDescription: "<b>Good</b><br>Requires: 3 Games", 
                        effectDescription: "Each <b>G</b> milestone multiplies medal gain by 1.5",
                        done(){
                                return player.g.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("g", 2) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 3)
                4: {
                        requirementDescription: "<b>Group</b><br>Requires: 4 Games", 
                        effectDescription: "Unlock a Medal upgrade and unlock a <b>D</b> buyable",
                        done(){
                                return player.g.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("g", 3) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 4)
                5: {
                        requirementDescription: "<b>General</b><br>Requires: 5 Games", 
                        effectDescription: "Each <b>G</b> reset allows you to keep one Medal upgrade",
                        done(){
                                return player.g.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("g", 4) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 5)
                6: {
                        requirementDescription: "<b>Great</b><br>Requires: 6 Games", 
                        effectDescription: "Unlock a Medal upgrade",
                        done(){
                                return player.g.points.gte(6)
                        },
                        unlocked(){
                                return hasMilestone("g", 5) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 6)
                7: {
                        requirementDescription: "<b>Government</b><br>Requires: 10 Games", 
                        effectDescription: "Start with one of each token",
                        done(){
                                return player.g.points.gte(10)
                        },
                        unlocked(){
                                return hasMilestone("g", 6) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 7)
                8: {
                        requirementDescription: "<b>Guide</b><br>Requires: 13 Games", 
                        effectDescription: "Game resetting no longer forces you into challenge 00, keep tokens, and unlock Games",
                        done(){
                                return player.g.points.gte(13)
                        },
                        unlocked(){
                                return hasMilestone("g", 7) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 8)
                9: {
                        requirementDescription: "<b>Gallery</b><br>Requires: 40% Completion on Portal", 
                        effectDescription: "Remove the ability to prestige but gain 100% of Games on prestige per second",
                        done(){
                                return player.g.clickableAmounts[31].gte(4) || player.g.rebirths[1] > 0
                        },
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 9)
                10: {
                        requirementDescription: "<b>Going</b><br>Requires: 72 Successful devs", 
                        effectDescription: "Remove the medal gain softcap and each successful dev adds .01 to the <b>G</b> gain exponent (up to 5e7)",
                        done(){
                                return player.g.partialTally.gte(72)
                        },
                        unlocked(){
                                return hasMilestone("g", 9) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 10)
                11: {
                        requirementDescription: "<b>Got</b><br>Requires: 77 Successful devs", 
                        effectDescription: "Your maximum charges is 100 and raise charge gain per minute ^1.2",
                        done(){
                                return player.g.partialTally.gte(77)
                        },
                        unlocked(){
                                return hasMilestone("g", 10) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 11)
                12: {
                        requirementDescription: "<b>Give</b><br>Requires: 2 Completed games", 
                        effectDescription: "Raise charge gain per minute ^1.2 and hold shift to attempt buy 10 clickables",
                        done(){
                                return player.g.completedTally.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("g", 11) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 12)
                13: {
                        requirementDescription: "<b>Girls</b><br>Requires: 8 Completed games", 
                        effectDescription: "Raise charge gain per minute ^1.2 and sqrt(Charges) multiplies <b>G</b> gain",
                        done(){
                                return player.g.completedTally.gte(8)
                        },
                        unlocked(){
                                return hasMilestone("g", 12) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 13)
                14: {
                        requirementDescription: "<b>Gift</b><br>Requires: 136 Successful devs", 
                        effectDescription: "Square <b>G</b> effect and double medal gain per milestone",
                        done(){
                                return player.g.partialTally.gte(136)
                        },
                        unlocked(){
                                return hasMilestone("g", 13) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 14)
                15: {
                        requirementDescription: "<b>Groups</b><br>Requires: 138 Successful devs", 
                        effectDescription: "Unlock Game Rebirth and double base <b>G</b> gain",
                        done(){
                                return player.g.partialTally.gte(138)
                        },
                        unlocked(){
                                return hasMilestone("g", 14) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 15)
                16: {
                        requirementDescription: "<b>Given</b><br>Requires: 300 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1",
                        done(){
                                return player.g.partialTally.gte(300)
                        },
                        unlocked(){
                                return hasMilestone("g", 15) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 16)
                17: {
                        requirementDescription: "<b>Garden</b><br>Requires: 400 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and shift can bulk 10x more",
                        done(){
                                return player.g.partialTally.gte(400)
                        },
                        unlocked(){
                                return hasMilestone("g", 16) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 17)
                18: {
                        requirementDescription: "<b>Green</b><br>Requires: 470 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1, triple maximum charges, and attempting to dev a game no longer costs games",
                        done(){
                                return player.g.partialTally.gte(470)
                        },
                        unlocked(){
                                return hasMilestone("g", 17) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 18)
                19: {
                        requirementDescription: "<b>Gold</b><br>Requires: 950 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and be able to automatically attempt to bulk dev each game once per second",
                        done(){
                                return player.g.partialTally.gte(950)
                        },
                        unlocked(){
                                return hasMilestone("g", 18) || hasUnlockedPast("g")
                        },
                        toggles: [["g", "autodev"]]
                }, // hasMilestone("g", 19)
                20: {
                        requirementDescription: "<b>Gifts</b><br>Requires: 1590 Successful devs", 
                        effectDescription: "Raise charge gain ^1.1 and triple base <b>G</b> gain and you can bulk 4x more",
                        done(){
                                return player.g.partialTally.gte(1590)
                        },
                        unlocked(){
                                return hasMilestone("g", 19) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 20)
                21: {
                        requirementDescription: "<b>Getting</b><br>Requires: 4470 Successful devs", 
                        effectDescription: "Raise charge gain ^1.2 and 6x max charges",
                        done(){
                                return player.g.partialTally.gte(4470)
                        },
                        unlocked(){
                                return hasMilestone("g", 20) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 21)
                22: {
                        requirementDescription: "<b>Global</b><br>Requires: 7 Rebirth I", 
                        effectDescription: "Raise charge gain ^1.1 and the first four games do not cost charges",
                        done(){
                                return player.g.rebirths[1] >= 7
                        },
                        unlocked(){
                                return hasMilestone("g", 21) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 22)
                23: {
                        requirementDescription: "<b>Germany</b><br>Requires: 8 Rebirth I", 
                        effectDescription: "Raise charge gain ^1.1, deving costs 10x less charges, and each Rebirth doubles max charges",
                        done(){
                                return player.g.rebirths[1] >= 8
                        },
                        unlocked(){
                                return hasMilestone("g", 22) || hasUnlockedPast("g")
                        },
                }, // hasMilestone("g", 23)
                
        },
        clickables: {
                rows: 5,
                cols: 5,
                getChargesPerMinuteExp(){
                        let exp = 1
                        if (hasMilestone("g", 11)) exp *= 1.2
                        if (hasMilestone("g", 12)) exp *= 1.2
                        if (hasMilestone("g", 13)) exp *= 1.2
                        if (hasMilestone("g", 16)) exp *= 1.1
                        if (hasMilestone("g", 17)) exp *= 1.1
                        if (hasMilestone("g", 18)) exp *= 1.1
                        if (hasMilestone("g", 19)) exp *= 1.1
                        if (hasMilestone("g", 20)) exp *= 1.1
                        if (hasMilestone("g", 21)) exp *= 1.2
                        if (hasMilestone("g", 22)) exp *= 1.1
                        if (hasMilestone("g", 23)) exp *= 1.1
                        if (hasUpgrade("f", 22))   exp *= 1.1
                        if (hasUpgrade("f", 23))   exp *= 1.1
                        if (hasUpgrade("f", 41))   exp *= 1.1
                        if (hasUpgrade("d", 53))   exp *= 1.1
                        if (hasUpgrade("d", 55))   exp *= 1.1
                        if (hasUpgrade("e", 41))   exp *= 1.1
                        if (hasUpgrade("e", 44))   exp *= 1.1
                        if (hasUpgrade("e", 45))   exp *= 1.1
                        if (hasUpgrade("e", 52))   exp *= 1.1
                        if (hasUpgrade("e", 53))   exp *= 1.1
                        if (hasMilestone("h", 1))  exp *= 1.1 
                        if (hasUpgrade("goalsii", 33)) {
                                                   exp *= Math.pow(1.1, player.goalsii.upgrades.length)
                        }
                        if (player.j.puzzle.upgrades.includes(31)) {
                                                   exp *= 50
                        }
                        return exp
                },
                getChargesPerMinute(){
                        let data = player.g.clickableAmounts
                        let a = data[11].plus(data[12])
                        let b = data[13].plus(data[14])
                        let base = a.plus(b)
                        if (hasMilestone("i", 4)) base = base.plus(100)
                        if (hasMilestone("h", 1)) base = base.plus(2)
                        if (hasMilestone("h", 5)) base = base.plus(player.h.milestones.length)
                        if (hasMilestone("h", 6)) base = base.plus(player.h.milestones.length ** 2)
                        if (hasMilestone("h", 3)) base = base.times(1.2)
                        
                        let exp = tmp.g.clickables.getChargesPerMinuteExp
                        let mult = new Decimal(1)
                        if (hasMilestone("h", 2)) mult = mult.times(2)
                        
                        let ret = Decimal.pow(base, exp).times(mult)

                        return ret
                },
                getGlobalChanceFactor(){
                        let ret = 1
                        if (hasMilestone("h", 1)) ret *= 2
                        if (hasMilestone("h", 7)) ret *= 5
                        return ret
                },
                succChance(x, change = 1, maxone = true){
                        let div = tmp.g.clickables.getCompletionsReq
                        let ret = Decimal.minus(1, x.div(div)).pow(2).times(change).times(tmp.g.clickables.getGlobalChanceFactor)               
                        if (maxone) ret = ret.min(1)
                        return ret
                },
                getEffectivePartialDevs(){
                        return CURRENT_GAMES_VALUES["partial"]
                },
                getAllPartialEffects(){
                        return CURRENT_GAMES_EFFECTS["partial"]
                },
                getEffectiveCompletedDevs(){
                        return CURRENT_GAMES_VALUES["complete"]
                },
                getAllCompletedEffects(){
                        return CURRENT_GAMES_EFFECTS["complete"]
                },
                getEffectiveRebirths(){
                        return CURRENT_GAMES_VALUES["rebirth"]
                },
                getRebirthEffects(){
                        return CURRENT_GAMES_EFFECTS["rebirth"]
                },
                getAttemptAmount(force = false){
                        let ret = new Decimal(1)
                        if (!shiftDown && !force) return ret
                        if (hasMilestone("g", 12)) ret = ret.times(10)
                        if (hasMilestone("g", 17)) ret = ret.times(10)
                        if (hasMilestone("g", 20)) ret = ret.times(4)
                        ret = ret.times(CURRENT_GAMES_EFFECTS["rebirth"]["Manual Bulk"][0])
                        if (hasMilestone("h", 2)) ret = ret.times(10)
                        return ret 
                },
                getPrimaryRebirths(actamt = false){ 
                        let data = player.g.rebirths
                        if (actamt) return data[1]
                        return data[1] + 10 * data[2] + 100 * data[3] + 1e3 * data[4] + 1e4 * data[5] 
                },
                getRebirthExp2(a){
                        let r = a || player.g.rebirths[1]
                        if (typeof r == "object") r = r.toNumber()
                        let exp2 = 1.45
                        if (r >= 8) exp2 += .005 * Math.min(r - 8, 10)
                        if (r >= 13) exp2 += .014 * Math.min(r - 13, 5) ** 2
                        if (r >= 21) exp2 += .01 * (r - 21)
                        return exp2
                },
                getRebirthActingScaler(){
                        let r = 1
                        if (hasUpgrade("h", 23)) r *= Math.pow(.99, player.g.upgrades.length)
                        if (hasUpgrade("g", 44)) r *= Math.pow(.98, player.h.upgrades.length)
                        if (hasUpgrade("f", 54)) r *= Math.pow(.995, totalChallengeComps("f"))
                        if (hasUpgrade("i", 12)) r *= Math.pow(.97, player.i.upgrades.length)
                        if (hasUpgrade("f", 55)) r *= .8
                        if (hasUpgrade("g", 54)) r *= .9
                        if (hasUpgrade("goalsii", 42)) r *= Math.pow(.98, player.goalsii.upgrades.length)
                        if (hasUpgrade("h", 33)) r *= Math.pow(.998, totalChallengeComps("f"))
                        if (hasMilestone("j", 3)) r *= Math.pow(.96, player.j.milestones.length)
                        if (player.j.puzzle.upgrades.includes(32)) r *= Math.pow(.95, player.j.puzzle.upgrades.length)
                        return r
                },
                getRebirthCostIncrease(){
                        let r = player.g.rebirths[1]
                        r *= tmp.g.clickables.getRebirthActingScaler
                        let exp2 = this.getRebirthExp2(r)
                        let exp = Decimal.pow(r, exp2)
                        return Decimal.pow(1e18, exp)
                },
                getCurrentMaxRebirths(){
                        let g = player.g.points
                        if (g.lte(0)) return 0
                        
                        let a = 1
                        let r = tmp.g.clickables.getRebirthActingScaler
                        g = g.log10().div(18)

                        let up = true
                        while (up) {
                                if (g.gte(Decimal.pow(a * r, this.getRebirthExp2(a * r)))) a *= 2
                                else up = false 
                        }
                        a = a / 2
                        let count = a
                        while (a > 1) {
                                a = a/2
                                let b = (a + count) * r
                                if (g.gte(Decimal.pow(b, this.getRebirthExp2(b)))) count += a
                        }
                        return count + 1
                },
                getCompletionsReq(){
                        let ret = 10 + 10 * player.g.rebirths[1]
                        return ret
                },
                getChargeComsumption(){
                        let rb = player.g.rebirths[1]
                        let ret = Decimal.pow(10, Decimal.pow(rb, .8))
                        if (hasMilestone("g", 23)) ret = ret.div(10)
                        return ret.floor()
                }, 
                11: {
                        title(){
                                return "<h3 style='color: #903000'>Tetris</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Cost</h3>: " + formatWhole(tmp.g.clickables[11].cost) + " Games<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[11]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return Decimal.pow(2, player.g.clickableAmounts[11]).times(10)
                        },
                        canClick(){
                                return player.g.points.gte(this.cost()) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let data = player.g
                                
                                let maxGames = data.points.gte(10) ? data.points.div(10).log(2).plus(1).floor() : data.clickableAmounts[11]
                                let maxCharges = data.charges
                                let attempts = layers.g.clickables.getAttemptAmount(force)
                                
                                let target = maxGames.sub(data.clickableAmounts[11]).max(0).min(maxCharges).min(attempts)

                                player.g.clickableAmounts[11] = player.g.clickableAmounts[11].plus(target)
                                if (target.gt(0) && !hasUpgrade("g", 21)) player.g.points = player.g.points.minus(this.cost().div(2)).max(0)
                                if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(target).max(0)
                        },
                },
                12: {
                        title(){
                                return "<h3 style='color: #903000'>Pac-man</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Cost</h3>: " + format(tmp.g.clickables[12].cost) + " Medals<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[12]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return Decimal.pow(10, player.g.clickableAmounts[12].pow(2)).times(1e8)
                        },
                        canClick(){
                                return player.goalsii.points.gte(tmp.g.clickables[12].cost) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let data = player.g
                                
                                let maxMedals = player.goalsii.points.gte(1e8) ? player.goalsii.points.div(1e8).log(10).root(2).plus(1).floor() : data.clickableAmounts[12]
                                let maxCharges = data.charges
                                let attempts = layers.g.clickables.getAttemptAmount(force)
                                
                                let target = maxMedals.sub(data.clickableAmounts[12]).max(0).min(maxCharges).min(attempts)

                                player.g.clickableAmounts[12] = player.g.clickableAmounts[12].plus(target)
                                let nc = Decimal.pow(10, player.g.clickableAmounts[12].minus(1).pow(2)).times(1e8)
                                if (target.gt(0)) player.goalsii.points = player.goalsii.points.minus(nc).max(0)
                                if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(target).max(0)
                        },
                },
                13: {
                        title(){
                                return "<h3 style='color: #903000'>Asteroids</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>: " + formatWhole(tmp.g.clickables[13].cost) + " Goals<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[13]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return 82 + player.g.clickableAmounts[13].sqrt().times(3).floor().toNumber()
                        },
                        canClick(){
                                return player.ach.points.gte(tmp.g.clickables[13].cost) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let data = player.g
                                let pts = player.ach.points
                                
                                let maxMedals = pts.gte(82) ? pts.minus(82).plus(1).div(3).pow(2).ceil() : data.clickableAmounts[13]
                                let maxCharges = data.charges
                                let attempts = layers.g.clickables.getAttemptAmount(force)
                                
                                let target = maxMedals.sub(data.clickableAmounts[13]).max(0).min(maxCharges).min(attempts)

                                player.g.clickableAmounts[13] = player.g.clickableAmounts[13].plus(target)
                                if (!hasMilestone("g", 22)) player.g.charges = player.g.charges.minus(target).max(0)
                        },
                },
                14: {
                        title(){
                                return "<h3 style='color: #903000'>Half life</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + format(tmp.g.clickables[14].cost) + " Features<br>"
                                let b = "<h3 style='color: #00CC66'>Gives</h3>: " + formatWhole(player.g.clickableAmounts[14]) + " charges per minute"
                                let c = ""
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return Decimal.pow(1e10, player.g.clickableAmounts[14].pow(1.5)).times("1e1900")
                        },
                        canClick(){
                                return player.f.points.gte(tmp.g.clickables[14].cost) && (player.g.charges.gte(1) || hasMilestone("g", 22))
                        },
                        onClick(force = false){
                                let maximum = layers.g.clickables.getAttemptAmount(force)
                                if (!hasMilestone("g", 22)) maximum = maximum.min(player.g.charges)
                                let g = player.f.points
                                if (g.lt("1e1900")) return    
                                
                                let target = g.div("1e1900").log10().div(10).root(1.5).floor().plus(1)

                                let diff = target.minus(player.g.clickableAmounts[14])
                                
                                if (diff.lte(0)) return
                                
                                diff = diff.min(maximum)

                                player.g.charges = player.g.charges.minus(diff)
                                let postcost = Decimal.pow(1e10, player.g.clickableAmounts[14].minus(1).pow(1.5)).times("1e1900")
                                player.f.points = player.f.points.minus(postcost)
                                player.g.clickableAmounts[14] = player.g.clickableAmounts[14].plus(diff)
                        },
                },
                21: {
                        title(){
                                return "<h3 style='color: #903000'>Quake</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[21].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[21].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[21]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[21].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[21].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 21

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                22: {
                        title(){
                                return "<h3 style='color: #903000'>Minecraft</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[22].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[22].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[22]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g")                    },
                        cost(){
                                return player.g.clickableAmounts[22].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[22].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 22

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                23: {
                        title(){
                                return "<h3 style='color: #903000'>GTA V</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[23].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[23].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[23]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g") 
                        },
                        cost(){
                                return player.g.clickableAmounts[23].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[23].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 23

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                24: {
                        title(){
                                return "<h3 style='color: #903000'>FIFA</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[24].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[24].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[24]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let a = player.g.clickableAmounts[11].gt(0) && player.g.clickableAmounts[12].gt(0) && player.g.clickableAmounts[13].gt(0) && player.g.clickableAmounts[14].gt(0)
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[24].plus(3).pow(2).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[24].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 24

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                31: {
                        title(){
                                return "<h3 style='color: #903000'>Portal</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[31].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[31].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[31]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[31].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[31].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 31

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                32: {
                        title(){
                                return "<h3 style='color: #903000'>Pokemon</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[32].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[32].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[32]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[32].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[32].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 32

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                33: {
                        title(){
                                return "<h3 style='color: #903000'>Diablo</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[33].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[33].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[33]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[33].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[33].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 33

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                34: {
                        title(){
                                return "<h3 style='color: #903000'>Terraria</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[34].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[34].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[34]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[21].gt(0) && player.g.clickableAmounts[22].gt(0) && player.g.clickableAmounts[23].gt(0) && player.g.clickableAmounts[24].gt(0)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[34].plus(3).pow(3).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[34].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 34

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                41: {
                        title(){
                                return "<h3 style='color: #903000'>Roblox</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[41].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[41].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[41]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[41].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[41].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 41

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                42: {
                        title(){
                                return "<h3 style='color: #903000'>Autochess</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[42].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[42].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[42]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[42].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[42].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 42

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                43: {
                        title(){
                                return "<h3 style='color: #903000'>Pong</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[43].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[43].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[43]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[43].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[43].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 43

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                44: {
                        title(){
                                return "<h3 style='color: #903000'>Dota 2</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[44].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[44].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[44]).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                let b = tmp.g.clickables.getPrimaryRebirths > 0
                                let a = player.g.clickableAmounts[31].gt(6) && player.g.clickableAmounts[32].gt(6) && player.g.clickableAmounts[33].gt(6) && player.g.clickableAmounts[34].gt(6)
                                return a || b || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[44].plus(5).pow(6).div(4).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[44].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 44

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                51: {
                        title(){
                                return "<h3 style='color: #903000'>Snake</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[51].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[51].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[51], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[51].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[51].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 51

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                52: {
                        title(){
                                return "<h3 style='color: #903000'>WoW</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[52].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[52].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[52], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[52].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[52].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 52

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                53: {
                        title(){
                                return "<h3 style='color: #903000'>TFT</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[53].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[53].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[53], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[53].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[53].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 53

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                54: {
                        title(){
                                return "<h3 style='color: #903000'>Valorant</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Costs</h3>: " + formatWhole(tmp.g.clickables[54].cost) + " Games<br>"
                                if (hasUpgrade("goalsii", 31)) return a
                                let b = "<h3 style='color: #00CC66'>Completion</h3>: " + format(player.g.clickableAmounts[54].times(100).div(tmp.g.clickables.getCompletionsReq)) + "%"
                                let c = ""
                                if (shiftDown) c = "<br>Chance to succeed:<br>" + formatChances(layers.g.clickables.succChance(player.g.clickableAmounts[54], .1).min(1).times(100)) + "%"
                                return a + b + c
                        },
                        unlocked(){
                                return hasAchievement("ach", 133) || hasUnlockedPast("g")
                        },
                        cost(){
                                return player.g.clickableAmounts[54].times(4).plus(9).pow(7).times(tmp.g.clickables.getRebirthCostIncrease).floor()
                        },
                        canClick(){
                                let a = player.g.points.gte(this.cost())
                                let b = player.g.charges.gte(tmp.g.clickables.getChargeComsumption)
                                let c = player.g.clickableAmounts[54].lt(tmp.g.clickables.getCompletionsReq)
                                return a && b && c && tmp.g.clickables.getChargesPerMinute.gt(0)
                        },
                        onClick(force = false){
                                let b = 0
                                let remaining = layers.g.clickables.getAttemptAmount(force)
                                let data = player.g
                                let id = 54

                                if (!hasUpgrade("goalsii", 31)) {
                                        while (b < 1000){
                                                b ++ 
                                                if (!this.canClick()) break 
                                                let chance = layers.g.clickables.succChance(data.clickableAmounts[id])
                                                let cc = tmp.g.clickables.getChargeComsumption
                                                let cost = this.cost()

                                                let times = getTimesRequired(chance)
                                                // the random chance factor
                                                let maxCharges = data.charges.div(cc).floor()
                                                // max num at current charges
                                                let maxGames = data.points.div(cost).floor()
                                                //max num at current games

                                                let target = Decimal.min(times, maxCharges).min(maxGames).min(remaining)
                                                //max num overall
                                                
                                                remaining = remaining.minus(target) //how many bulks left
                                                if (!hasMilestone("g", 18)) {
                                                        data.points = data.points.sub(cost.times(target)).max(0)
                                                } // remove games
                                                data.charges = data.charges.minus(cc.times(target))
                                                //remove charges

                                                if (target != times) break
                                                //didnt do it enough times
                                                
                                                //if did do enough, add one
                                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                        } 
                                }
                                else {
                                        if (this.cost().lte(data.points)) {
                                                data.clickableAmounts[id] = new Decimal(tmp.g.clickables.getCompletionsReq)
                                        }
                                }
                        },
                },
                15: {
                        title(){
                                return "<h3 style='color: #903000'>Rebirth I</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>: 16 Games at 100%<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[1])
                                return a + b
                        },
                        unlocked(){
                                return hasMilestone("g", 15) || hasUnlockedPast("g")
                        },
                        canClick(){
                                let gdata = player.g
                                rb = player.g.rebirths[1]
                                let a = gdata.partialTally.gte(Decimal.times(160, (rb + 1) * (rb + 2) / 2))
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[15].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption())
                                data.rebirths[1] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
                                let data = player.g
                                let data1 = data.clickableAmounts
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]
                                for (j in l){
                                        i = l[j]
                                        data1[i] = new Decimal(0)
                                }
                                data.charges = new Decimal(3)
                        },
                },
                25: {
                        title(){
                                return "<h3 style='color: #903000'>Rebirth II</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>:" + formatWhole(tmp.g.clickables[25].cost) + " Rebirth I<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[2])
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("g", 32) || hasUnlockedPast("h")
                        },
                        cost(){
                                return 10 + 10 * player.g.rebirths[2]
                        },
                        canClick(){
                                let gdata = player.g
                                let a = new Decimal(gdata.rebirths[1]).gte(this.cost())
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[25].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption())
                                data.rebirths[2] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
                                let data = player.g
                                let data1 = data.clickableAmounts
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]
                                for (j in l){
                                        i = l[j]
                                        data1[i] = new Decimal(0)
                                }
                                data.charges = new Decimal(3)
                                if (!hasMilestone("i", 2)) data.rebirths[1] = layers.g.getStartingRebirth(1)
                        },
                },
                35: {
                        title(){
                                return "<h3 style='color: #903000'>Rebirth III</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>:" + formatWhole(tmp.g.clickables[35].cost) + " Rebirth II<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[3])
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("goalsii", 43) || hasUnlockedPast("i")
                        },
                        cost(){
                                return 10 + 10 * player.g.rebirths[3]
                        },
                        canClick(){
                                let gdata = player.g
                                let a = new Decimal(gdata.rebirths[2]).gte(this.cost())
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[35].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption())
                                data.rebirths[3] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
                                let data = player.g
                                let data1 = data.clickableAmounts
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]
                                for (j in l){
                                        i = l[j]
                                        data1[i] = new Decimal(0)
                                }
                                data.charges = new Decimal(3)
                                if (!(player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done)) data.rebirths[2] = layers.g.getStartingRebirth(2)
                                if (!hasMilestone("i", 2)) data.rebirths[1] = layers.g.getStartingRebirth(1)
                        },
                },
                45: {
                        title(){
                                return "<h3 style='color: #903000'>Rebirth IV</h3>"
                        },
                        display(){
                                if (player.tab != "g") return ""
                                let a = "<h3 style='color: #D070C0'>Requires</h3>:" + formatWhole(tmp.g.clickables[45].cost) + " Rebirth III<br>"
                                let b = "<h3 style='color: #00CC66'>Times</h3>: " + formatWhole(player.g.rebirths[4])
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(41) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        cost(){
                                return 10 + 10 * player.g.rebirths[4]
                        },
                        canClick(){
                                let gdata = player.g
                                let a = new Decimal(gdata.rebirths[3]).gte(this.cost())
                                let b = gdata.charges.gte(layers.g.clickables.getChargeComsumption())
                                return a && b && tmp.g.clickables.getChargesPerMinute.gt(0) && tmp.g.clickables[45].unlocked
                        },
                        onClick(force = false){
                                let data = player.g
                                if (!this.canClick()) return 
                                data.charges = data.charges.minus(layers.g.clickables.getChargeComsumption())
                                data.rebirths[4] += 1
                                this.resetPrior()
                        },
                        resetPrior(){
                                let data = player.g
                                let data1 = data.clickableAmounts
                                let l = [21, 22, 23, 24,
                                         31, 32, 33, 34,
                                         41, 42, 43, 44,
                                         51, 52, 53, 54,]
                                for (j in l){
                                        i = l[j]
                                        data1[i] = new Decimal(0)
                                }
                                data.charges = new Decimal(3)
                                if (!(player.j.puzzle.upgrades.includes(42) || player.j.puzzle.reset2.done)) data.rebirths[3] = layers.g.getStartingRebirth(3)
                                if (!(player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done)) data.rebirths[2] = layers.g.getStartingRebirth(2)
                                if (!hasMilestone("i", 2)) data.rebirths[1] = layers.g.getStartingRebirth(1)
                        },
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Girl",
                        description: "Each upgrade adds 1 to effective rebirths",
                        cost: new Decimal("1e26697"),
                        unlocked(){
                                return hasUpgrade("f", 45) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 11)
                12: {
                        title: "Golf",
                        description: "Max charges ^1.3",
                        cost: new Decimal("1e26697"),
                        unlocked(){
                                return hasUpgrade("g", 11) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 12)
                13: {
                        title: "Google",
                        description: "Per upgrade double base <b>G</b> gain",
                        cost: new Decimal("1e26697"),
                        unlocked(){
                                return hasUpgrade("g", 12) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 13)
                14: {
                        title: "Growth",
                        description: "Keep all Medal upgrades, milestones, and tokens",
                        cost: new Decimal("1e29511"),
                        unlocked(){
                                return hasUpgrade("g", 13) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 14)
                15: {
                        title: "Gas",
                        description: "Unlock a row of <b>D</b> upgrades",
                        cost: new Decimal("2e30086"),
                        unlocked(){
                                return hasUpgrade("g", 14) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 15)
                21: {
                        title: "Glass",
                        description: "Unlock a row of <b>E</b> upgrades and <b>Tetris</b> no longer costs games",
                        cost: new Decimal("1e32090"),
                        unlocked(){
                                return hasUpgrade("d", 55) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 21)
                22: {
                        title: "Ground",
                        description: "Unlock another row of <b>E</b> upgrades",
                        cost: new Decimal("1e45604"),
                        unlocked(){
                                return hasUpgrade("e", 35) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 22)
                23: {
                        title: "Guides",
                        description: "Unlock another row of <b>E</b> upgrades",
                        cost: new Decimal("1e49960"),
                        unlocked(){
                                return hasUpgrade("e", 45) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 23)
                24: {
                        title: "Grand",
                        description: "Square the successfully deved boosted to Max Charges",
                        cost: new Decimal("1e64436"),
                        unlocked(){
                                return hasUpgrade("e", 55) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 24)
                25: {
                        title: "Greater",
                        description: "Per <b>G</b> upgrade multiply base <b>G</b> gain by 5 and add 6 to the <b>G</b> gain exponent",
                        cost: new Decimal("1e65250"),
                        unlocked(){
                                return hasUpgrade("g", 24) || hasUnlockedPast("g")
                        },
                }, // hasUpgrade("g", 25)
                31: {
                        title: "Guest",
                        description: "<b>Future</b> gives free <b>February</b> levels and each file completion gives a free <b>Future</b> level",
                        cost: new Decimal("1e123123"),
                        unlocked(){
                                return hasUpgrade("h", 22) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 31)
                32: {
                        title: "Graphics",
                        description: "Unlock <b>Rebirth II</b>",
                        cost: new Decimal("1e131820"),
                        unlocked(){
                                return hasUpgrade("g", 31) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 32)
                33: {
                        title: "Grade",
                        description: "Unlock a second <b>F</b> challenge and each <b>F</b> challenge completion multiplies base <b>G</b> gain by 2",
                        cost: new Decimal("1e142444"),
                        unlocked(){
                                return hasUpgrade("g", 32) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 33)
                34: {
                        title: "German",
                        description: "Each <b>Film</b> gives an effective rebirth",
                        cost: new Decimal("1e165350"),
                        unlocked(){
                                return hasUpgrade("g", 33) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 34)
                35: {
                        title: "Goods",
                        description: "Upgrades multiply <b>Future</b> base and add .1 to <b>February</b> base and unlock a new <b>F</b> challenge",
                        cost: new Decimal("1e172721"),
                        unlocked(){
                                return hasUpgrade("g", 34) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 35)
                41: {
                        title: "Gets",
                        description: "<b>Friends</b> gives free <b>Future</b> levels and raise completed games to Features boost ^500",
                        cost: new Decimal("1e333777"),
                        unlocked(){
                                return hasUpgrade("f", 53) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 41)
                42: {
                        title: "Georgia",
                        description: "<b>Friends</b> gives free <b>February</b> levels and raise completed games to Games boost ^50",
                        cost: new Decimal("1e360300"),
                        unlocked(){
                                return hasUpgrade("g", 41) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 42)
                43: {
                        title: "Grant",
                        description: "Each rebirth I adds .01 to <b>Friends</b> base and gives a free <b>Friends</b> level",
                        cost: new Decimal("1e418100"),
                        unlocked(){
                                return hasUpgrade("g", 42) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 43)
                44: {
                        title: "Goes",
                        description: "Per <b>H</b> upgrade act as if you have 2% less rebirths",
                        cost: new Decimal("1e474400"),
                        unlocked(){
                                return hasUpgrade("g", 43) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 44)
                45: {
                        title: "Galleries",
                        description: "Start with (9 * Rebirth II) Rebirth I upon reset",
                        cost: new Decimal("1e781400"),
                        unlocked(){
                                return hasUpgrade("g", 44) || hasUnlockedPast("h")
                        },
                }, // hasUpgrade("g", 45)
                51: {
                        title: "Guy",
                        description: "Automatically buy <b>G</b> buyables and <b>Rebirth II</b>",
                        cost: new Decimal("1e3525e3"),
                        unlocked(){
                                return hasUpgrade("i", 11) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 51)
                52: {
                        title: "Gear",
                        description: "Each <b>I</b> upgrade adds .001 to the <b>Guidelines</b> base",
                        cost: new Decimal("1e5157e3"),
                        unlocked(){
                                return hasUpgrade("i", 12) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 52)
                53: {
                        title: "Giving",
                        description: "<b>Guidelines</b> gives free <b>Gives</b> levels and <b>Front</b> gives free <b>Friends</b> levels",
                        cost: new Decimal("1e7072e3"),
                        unlocked(){
                                return hasUpgrade("g", 52) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 53)
                54: {
                        title: "Graduate",
                        description: "Act as if you have 10% less rebirths and unlock a row of medal upgrades",
                        cost: new Decimal("1e11048e3"),
                        unlocked(){
                                return hasUpgrade("i", 13) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 54)
                55: {
                        title: "Generally",
                        description: "You can complete 5 more of each <b>F</b> challenge",
                        cost: new Decimal("1e222807e3"),
                        unlocked(){
                                return hasUpgrade("g", 54) || hasUnlockedPast("i")
                        },
                }, // hasUpgrade("g", 55)
                

                /*  
                guitar
                goals
                gave

                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Gives",
                        display(){
                                return getBuyableDisplay("g", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g11"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 11)
                        },
                        total(){
                                return getBuyableAmount("g", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 11)
                        },
                        buy(){
                                buyManualBuyable("g", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 11) || hasUnlockedPast("i")
                        },
                },
                12: {
                        title: "Guidelines",
                        display(){
                                return getBuyableDisplay("g", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g12"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 12)
                        },
                        total(){
                                return getBuyableAmount("g", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 12)
                        },
                        buy(){
                                buyManualBuyable("g", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 12) || hasUnlockedPast("i")
                        },
                },
                13: {
                        title: "Goal",
                        display(){
                                return getBuyableDisplay("g", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g13"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 13)
                        },
                        total(){
                                return getBuyableAmount("g", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 13)
                        },
                        buy(){
                                buyManualBuyable("g", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 13) || hasUnlockedPast("i")
                        },
                },
                21: {
                        title: "Generation",
                        display(){
                                return getBuyableDisplay("g", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g21"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 21)
                        },
                        total(){
                                return getBuyableAmount("g", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 21)
                        },
                        buy(){
                                buyManualBuyable("g", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 14) || hasUnlockedPast("i")
                        },
                },
                22: {
                        title: "Guarantee",
                        display(){
                                return getBuyableDisplay("g", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g22"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 22)
                        },
                        total(){
                                return getBuyableAmount("g", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 22)
                        },
                        buy(){
                                buyManualBuyable("g", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 22, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 15) || hasUnlockedPast("i")
                        },
                },
                23: {
                        title: "Growing",
                        display(){
                                return getBuyableDisplay("g", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g23"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 23)
                        },
                        total(){
                                return getBuyableAmount("g", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 23)
                        },
                        buy(){
                                buyManualBuyable("g", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 23, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 35) || hasUnlockedPast("i")
                        },
                },
                31: {
                        title: "Generated",
                        display(){
                                return getBuyableDisplay("g", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g31"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 31)
                        },
                        total(){
                                return getBuyableAmount("g", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 31)
                        },
                        buy(){
                                buyManualBuyable("g", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("i", 23) || hasUnlockedPast("i")
                        },
                },
                32: {
                        title: "Guys",
                        display(){
                                return getBuyableDisplay("g", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g32"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 32)
                        },
                        total(){
                                return getBuyableAmount("g", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 32)
                        },
                        buy(){
                                buyManualBuyable("g", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 32, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("h", 44) || hasUnlockedPast("i")
                        },
                },
                33: {
                        title: "Omnipotent VII",
                        display(){
                                return getBuyableDisplay("g", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["g33"]
                        },
                        canAfford(){
                                return canAffordBuyable("g", 33)
                        },
                        total(){
                                return getBuyableAmount("g", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("g", 33)
                        },
                        buy(){
                                buyManualBuyable("g", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("g", 33, maximum)
                        },
                        unlocked(){ 
                                return player.j.puzzle.upgrades.includes(32) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("g", 9) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                return shiftDown ? "Your best Games is " + format(player.g.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                if (hasUnlockedPast("g")) return ""
                                                return "You have done " + formatWhole(player.g.times) + " Game resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                if (hasMilestone("g", 9)) return "You are gaining " + format(tmp.g.getResetGain) + " Games per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.g.time)) + ")" 
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
                                return hasUpgrade("g", 11) || hasUnlockedPast("i")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return player.g.best.gt(0) || hasUnlockedPast("g")
                        },
                },
                "Games": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                let a = "You have " + format(player.g.points) + " games, "
                                                let b = format(player.goalsii.points) + " medals, "
                                                let c = formatWhole(player.ach.points) + " goals, and "
                                                let d = format(player.f.points) + " features."
                                                if (hasUpgrade("goalsii", 31)) return a + b + c + d
                                                let e = ""
                                                let sd = tmp.g.clickables.getAttemptAmount
                                                if (!shiftDown) e = "<br>Press shift to see success chances."
                                                else if (sd.gt(1)) e = "<br>You have shift down to bulk up to " + formatWhole(sd) + "."
                                                return a + b + c + d + e
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                let cpm = tmp.g.clickables.getChargesPerMinute
                                                let a = "You have " + formatWhole(player.g.charges) + "/" + formatWhole(player.g.chargesMax)
                                                let b = ""
                                                if (cpm < 1e5) b = " charges and are gaining " + format(cpm) + " per minute"
                                                else b = " charges and are gaining " + format(cpm.div(60)) + " per second"
                                                let c = ""
                                                if (cpm > 0 && cpm < 1e5) {
                                                        c = " (next in " + format(Math.max(60/cpm -player.g.chargesTime, 0)) + "s)"
                                                }
                                                return a + b + c +"."
                                        }
                                ],
                                "clickables",
                        ],
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                },
                "Details": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                let a = `<h2 style = 'color: #CC0033'>Explanation</h2><h2>:</h2><br>
                                                There are twenty games which progressively unlock. <br>
                                                Clicking a game will consume a charge.<br>
                                                For the first row, you no matter what will gain a level, <br>
                                                but for subsequent rows you have a non-zero chance of failing and gaining nothing.<br>
                                                This fail rate is purely based on how much progress you have made so far.<br><br>
                                                The first row of games each generate one charge per minute.<br>
                                                You can gain buffs by partially deving games,<br>
                                                and larger buffs for completing games. <br><br>
                                                <h2 style = 'color: #CC0033'>Rewards</h2><h2>:</h2><br>
                                                ` 
                                                let ecd = CURRENT_GAMES_VALUES["complete"]
                                                let ecdportion = ecd.eq(player.g.completedTally) ? "" : "+" + format(ecd.minus(player.g.completedTally))
                                                let pcd = CURRENT_GAMES_VALUES["partial"]
                                                let pcdportion = pcd.eq(player.g.partialTally) ? "" : "+" + format(pcd.minus(player.g.partialTally))
                                                let b = "You have successfully deved " + formatWhole(player.g.partialTally) + pcdportion + " games so:"
                                                let b2 = ""
                                                let data2 = CURRENT_GAMES_EFFECTS["complete"]
                                                for (i in data2){
                                                        let j = data2[i]
                                                        if (!j[2]) continue
                                                        b2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }

                                                
                                                let c = "<br><br> You have fully completed " + formatWhole(player.g.completedTally) + ecdportion + " games so:"
                                                let c2 = ""
                                                let data1 = CURRENT_GAMES_EFFECTS["partial"]
                                                for (i in data1){
                                                        let j = data1[i]
                                                        if (!j[2]) continue
                                                        c2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }

                                                let rb = tmp.g.clickables.getPrimaryRebirths
                                                let erb = CURRENT_GAMES_VALUES["rebirth"]
                                                if (erb.eq(0)) return a + b + c2 + c + b2
                                                
                                                let erbportion = erb.eq(rb) ? "" : "+" + format(erb.minus(rb))
                                                let d = "<br><br> You have rebirthed " + formatWhole(rb) + erbportion + " times so:"
                                                let d2 = ""
                                                let data3 = CURRENT_GAMES_EFFECTS["rebirth"]
                                                for (i in data3){
                                                        let j = data3[i]
                                                        if (!j[2]) continue
                                                        d2 += "<br>• " + j[1] + format(j[0]) + " to " + i 
                                                }
                                                return a + b + c2 + c + b2 + d + d2 
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "g") return ""
                                                let rb = tmp.g.clickables.getPrimaryRebirths
                                                if (rb == 0 && player.g.completedTally < 15) return ""
                                                let a = `<br><h2 style = 'color: #CC0033'>Rebirth</h2><h2>:</h2><br>
                                                You can rebirth when you have fully deved 16 games.<br>
                                                Upon rebirthing you lose game progress.<br>
                                                Rebirthing makes attempting to dev harder and causes it to consume more charges. <br><br>
                                                You have rebirthed ` + formatWhole(rb) + " times."
                                                let b = "<br>Each attempts costs " + formatWhole(tmp.g.clickables.getChargeComsumption) + " charges."
                                                if (!hasUnlockedPast("h") && !hasUpgrade("g", 32)) return a + b + "<br><br><br>"
                                                let c = `<br><br>
                                                <h2 style = 'color: #CC0033'>Rebirth II</h2><h2>:</h2><br>
                                                Rebirth II and all further rebirths count as 10 of the previous rebirths <br>
                                                in terms of rewards. This is used for calculating completed devs and for use in upgrades. <br>
                                                However, they do not cause any nerfs, for example to Game cost. <br>
                                                Doing the <i>k</i>-th Rebirth II reset requires having 10 + 10 * k Rebirth I<br>
                                                and likewise for further Rebirths. <br>
                                                Doing a rebirth resets everything the previous rebirth does<br>
                                                and resets the previous rebirth amount to what it is by default.
                                                `
                                                return a + b + c + "<br><br><br><br>"
                                        }
                                ],
                        ],
                        unlocked(){
                                return hasMilestone("g", 8) || hasUnlockedPast("g")
                        },
                },
        },
        getStartingRebirth(i){
                let ret = 0
                if (i == 1){
                        if (hasMilestone("h", 8)) ret = 40
                        if (hasUpgrade("h", 12)) ret = 50
                        if (hasUpgrade("g", 45)) ret = Math.max(ret, 9 * player.g.rebirths[2])
                }
                
                return ret
        },
        doReset(layer){
                if (layer == "g") player.g.time = 0
                if (!getsReset("g", layer)) return
                player.g.time = 0
                player.g.times = 0

                if (!hasMilestone("h", 8) && !hasMilestone("i", 6) && !hasMilestone("k", 1)) {
                        //upgrades
                        let keep = []
                        if (hasMilestone("h", 1)) keep.push(14)
                        player.g.upgrades = filter(player.g.upgrades, keep)
                }

                if (!hasMilestone("i", 6)) {
                        //upgrades
                        let keep2 = []
                        let j = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "15", "13", "16", "17", "18", "19", "20", "21", "22", "23"]
                        for (i = 0; i < player.h.times; i ++){
                                if (i > 22) break
                                if (hasMilestone("h", 4)) keep2.push(j[i])
                        }
                        if (hasMilestone("i", 4)) keep2.push("9")
                        player.g.milestones = filter(player.g.milestones, keep2)
                }

                //resources
                player.g.points = new Decimal(0)
                player.g.total = new Decimal(0)
                player.g.best = new Decimal(0)
                player.g.charges = new Decimal(3)
                player.g.chargesMax = new Decimal(10)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.g.buyables[resetBuyables[j]] = new Decimal(0)
                }

                let resetGames = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54]
                for (let j = 0; j < resetBuyables.length; j++){
                        i = resetGames[j]
                        player.g.clickableAmounts[i] = new Decimal(0)
                }
                let resetRebirths = [1, 2, 3, 4, 5]
                for (let j = resetRebirths.length - 1; j >= 0; j--){
                        player.g.rebirths[resetRebirths[j]] = this.getStartingRebirth(j + 1)
                }
        },
})



addLayer("h", {
        name: "Hearts",
        symbol: "H",
        position: 0, 
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                }
        },
        color: "#FF3399",
        branches: ["g"],
        requires: new Decimal(0),
        resource: "Hearts",
        baseResource: "Games",
        baseAmount() {
                return player.g.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("h")
        },
        getBaseDiv(){
                let x = new Decimal("1e93358")
                return x
        },
        getGainExp(){
                let x = new Decimal(4)
                if (hasUpgrade("h", 25)) x = x.plus(player.h.upgrades.length * .2)
                if (hasUpgrade("i", 13)) x = x.plus(player.i.upgrades.length * 10)
                if (hasUpgrade("goalsii", 41)) x = x.plus(player.goalsii.upgrades.length)
                x = x.plus(CURRENT_BUYABLE_EFFECTS["h22"])
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(10, -4)
                if (hasUpgrade("h", 32)) x = x.times(Decimal.pow(2, player.g.rebirths[3]))
                if (hasUpgrade("h", 35)) x = x.times(Decimal.max(1, totalChallengeComps("f")))
                if (hasUpgrade("i", 23)) x = x.times(Decimal.pow(10, player.i.upgrades.length))
                x = x.times(tmp.j.clickables[45].effect)
                x = x.times(CURRENT_BUYABLE_EFFECTS["i13"])
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("h")

                x = x.times(CURRENT_BUYABLE_EFFECTS["h13"])

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("h")) return new Decimal(1)

                let amt = player.h.best

                let exp = player.h.best.sqrt().times(3).min(10)
                if (hasUpgrade("h", 21)) exp = exp.times(player.h.upgrades.length)

                let ret = amt.times(10).plus(1).pow(exp)

                //ret = softcap(ret, "h_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("h")
        },
        update(diff){
                let data = player.h

                data.best = data.best.max(data.points)
                if (hasUpgrade("h", 22)) {
                        let gain = tmp.h.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done) {
                        handleGeneralizedBuyableAutobuy(diff, "h")
                } else {
                        data.abtime = 0
                }

                data.time += diff
        },
        row: 7, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "h", description: "H: Reset for Hearts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+H", description: "Shift+H: Go to Hearts", onPress(){
                                showTab("h")
                        }
                },
                {key: "1", description: "1: Rebirth I", onPress(){
                                let data = layers.g.clickables[15]
                                if (data.canClick()) data.onClick()
                        }
                },
                {key: "2", description: "2: Rebirth II", onPress(){
                                let data = layers.g.clickables[25]
                                if (data.canClick()) data.onClick()
                        }
                },
        ],
        layerShown(){return player.g.best.max(10).log10().gte(103345) || player.h.best.gt(0) || hasUnlockedPast("h")},
        prestigeButtonText(){
                if (hasUpgrade("h", 22)) return ""
                return getGeneralizedPrestigeButtonText("h")
        },
        canReset(){
                return player.h.time >= 2 && !hasUpgrade("h", 22) && tmp.h.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Have</b><br>Requires: 1 Hearts", 
                        effectDescription: "Double the chance to succeed, raise charges gain ^1.1, keep <b>Growth</b>, and gain 2 charges per minute",
                        done(){
                                return player.h.points.gte(1)
                        },
                        unlocked(){
                                return true
                        }, // hasMilestone("h", 1)
                },
                2: {
                        requirementDescription: "<b>Home</b><br>Requires: 2 Hearts", 
                        effectDescription: "Double charge gain and holding shift allows 10x more game attempts",
                        done(){
                                return player.h.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("h", 1) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 2)
                },
                3: {
                        requirementDescription: "<b>Has</b><br>Requires: 3 Hearts", 
                        effectDescription: "Each milestone raises max charges ^1.1 and multiply base charge gain by 1.2",
                        done(){
                                return player.h.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("h", 2) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 3)
                },
                4: {
                        requirementDescription: "<b>He</b><br>Requires: 4 Hearts", 
                        effectDescription: "Keep one <b>G</b> milestone per <b>H</b> reset",
                        done(){
                                return player.h.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("h", 3) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 4)
                },
                5: {
                        requirementDescription: "<b>His</b><br>Requires: 6 Hearts", 
                        effectDescription: "Each milestone adds 1 to base charge gain and half an effective Rebirth level",
                        done(){
                                return player.h.points.gte(6)
                        },
                        unlocked(){
                                return hasMilestone("h", 4) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 5)
                },
                6: {
                        requirementDescription: "<b>Here</b><br>Requires: 9 Hearts", 
                        effectDescription: "Per milestone squared get an effective fully deved level and add 1 to base charge gain",
                        done(){
                                return player.h.points.gte(9)
                        },
                        unlocked(){
                                return hasMilestone("h", 5) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 6)
                },
                7: {
                        requirementDescription: "<b>Help</b><br>Requires: 13 Hearts", 
                        effectDescription: "Keep <b>F</b> upgrades and 5x the chance to succeed",
                        done(){
                                return player.h.points.gte(13)
                        },
                        unlocked(){
                                return hasMilestone("h", 6) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 7)
                },
                8: {
                        requirementDescription: "<b>How</b><br>Requires: 19 Hearts", 
                        effectDescription: "Start with 40 Rebirths and keep <b>G</b> upgrades",
                        done(){
                                return player.h.points.gte(19)
                        },
                        unlocked(){
                                return hasMilestone("h", 7) || hasUnlockedPast("h")
                        }, // hasMilestone("h", 8)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Had",
                        description: "Each upgrade adds 78 to <b>F</b> gain exponent and multiplies base <b>F</b> gain by 90",
                        cost: new Decimal(25),
                        unlocked(){
                                return hasMilestone("h", 8) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 11)
                12: {
                        title: "Health",
                        description: "Start with 50 Rebirths and double base <b>G</b> gain per upgrade",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasUpgrade("h", 11) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 12)
                13: {
                        title: "Her",
                        description: "Unlock a new row of Medal upgrades",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasUpgrade("h", 12) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 13)
                14: {
                        title: "High",
                        description: "Per upgrade per medal upgrade get two free effecitve completed devs and unlock an <b>F</b> buyable autobuyer",
                        cost: new Decimal(150),
                        unlocked(){
                                return hasUpgrade("goalsii", 35) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 14)
                15: {
                        title: "Hotel",
                        description: "Unlock an <b>F</b> buyable and an <b>F</b> challenge and <b>H</b> effect is ^1001 to points",
                        cost: new Decimal(300),
                        unlocked(){
                                return hasUpgrade("h", 14) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 15)
                21: {
                        title: "House",
                        description: "Raise the <b>H</b> effect to the number of upgrades and unlock an <b>F</b> buyable",
                        cost: new Decimal(300),
                        unlocked(){
                                return hasAchievement("ach", "153") || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 21)
                22: {
                        title: "Him",
                        description: "Remove the ability to <b>H</b> reset but gain 100% of Hearts on prestige per second",
                        cost: new Decimal(2000),
                        unlocked(){
                                return hasAchievement("ach", "153") || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 22)
                23: {
                        title: "History",
                        description: "Act as if you have 1% less rebirths per Game upgrade (for Game costs)",
                        cost: new Decimal(2e6),
                        unlocked(){
                                return hasUpgrade("g", 35) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 23)
                24: {
                        title: "Hours",
                        description: "Raise successful devs boost to Games to the number of <b>H</b> upgrades",
                        cost: new Decimal(2e11),
                        unlocked(){
                                return hasUpgrade("f", 55) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 24)
                25: {
                        title: "However",
                        description: "Each upgrade adds .2 to the <b>H</b> gain exponent",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("h", 24) || hasUnlockedPast("h")
                        }
                }, // hasUpgrade("h", 25)
                31: {
                        title: "Human",
                        description: "Each upgrade adds .1 to the <b>I</b> gain exponent",
                        cost: new Decimal("1e687"),
                        unlocked(){
                                return hasUpgrade("g", 55) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 31)
                32: {
                        title: "Hot",
                        description: "Automatically <b>Rebirth III</b> and each <b>Rebirth III</b> doubles base <b>H</b> gain",
                        cost: new Decimal("1e835"),
                        unlocked(){
                                return (hasUpgrade("h", 31) && totalChallengeComps("f") >= 85) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 32)
                33: {
                        title: "Hard",
                        description: "Per <b>F</b> challenge completion act as if you have .2% less rebirths and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e1850"),
                        unlocked(){
                                return hasUpgrade("i", 22) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 33)
                34: {
                        title: "Hand",
                        description: "Per <b>I</b> upgrade increase <b>F</b> challenge completion limit by 1 and unlock an <b>F</b> buyable",
                        cost: new Decimal("1e2075"),
                        unlocked(){
                                return hasUpgrade("h", 33) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 34)
                35: {
                        title: "Head",
                        description: "<b>F</b> challenges completed multiplies base <b>H</b> gain and unlock a <b>G</b> buyable",
                        cost: new Decimal("1e2200"),
                        unlocked(){
                                return hasUpgrade("h", 34) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 35)
                41: {
                        title: "Having",
                        description: "<b>Growing</b> and <b>Guarantee</b> give free <b>Goal</b> and <b>Generation</b> levels",
                        cost: new Decimal("1e2410"),
                        unlocked(){
                                return hasUpgrade("h", 35) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 41)
                42: {
                        title: "Hosting",
                        description: "<b>Growing</b> gives free <b>Guarantee</b> levels and per upgrade add .001 to the <b>Growing</b> base",
                        cost: new Decimal("1e2540"),
                        unlocked(){
                                return hasUpgrade("h", 41) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 42)
                43: {
                        title: "Heart",
                        description: "Each <b>I</b> upgrade adds .001 to the <b>Generated</b> base and adds .2 to the <b>I</b> gain exponent",
                        cost: new Decimal("1e5475"),
                        unlocked(){
                                return totalChallengeComps("f") >= 111 || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 43)
                44: {
                        title: "Half",
                        description: "Each upgrade adds .01 to the <b>Omnipotent VI</b> base and unlock a <b>G</b> buyable",
                        cost: new Decimal("1e6666"),
                        unlocked(){
                                return hasUpgrade("i", 24) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 44)
                45: {
                        title: "Hardware",
                        description: "<b>Rebirth II</b> and <b>Guys</b> give free <b>Generated</b> buyables",
                        cost: new Decimal("1e6789"),
                        unlocked(){
                                return hasUpgrade("h", 44) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("h", 45)
                51: {
                        title: "Homepage",
                        description: "Raise <b>Hope</b> effect to the square root of the number of <b>I</b> upgrades and <b>Hope</b> give free <b>Held</b> buyables",
                        cost: new Decimal("1e1204e3"),
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 51)
                52: {
                        title: "Homes",
                        description: "Best knowledge multiplues <b>J</b> gain and automatically bulk <b>Rebirth III</b>",
                        cost: new Decimal("1e417e6"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(10) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 52)
                53: {
                        title: "Hill",
                        description: "Unlock a <b>H</b> challenge and best experience multiplies base <b>I</b> gain",
                        cost: new Decimal("1e530e6"),
                        unlocked(){
                                return hasUpgrade("i", 41) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 53)
                54: {
                        title: "Hall",
                        description: "<b>Happy</b> gives free <b>Huge</b> and <b>Hour</b> levels",
                        cost: new Decimal("1e1258e6"),
                        unlocked(){
                                return hasUpgrade("i", 42) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 54)
                55: {
                        title: "Hospital",
                        description: "<b>Happy</b> effects <b>Guys</b> at a logarithimic rate",
                        cost: new Decimal("1e4414e6"),
                        unlocked(){
                                return hasUpgrade("h", 54) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("h", 55)
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Holiday",
                        display(){
                                return getBuyableDisplay("h", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h11"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 11)
                        },
                        total(){
                                return getBuyableAmount("h", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 11)
                        },
                        buy(){
                                buyManualBuyable("h", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 11, maximum)
                        },
                        unlocked(){ 
                                return player.j.puzzle.upgrades.includes(31) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                12: {
                        title: "Held",
                        display(){
                                return getBuyableDisplay("h", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h12"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 12)
                        },
                        total(){
                                return getBuyableAmount("h", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 12)
                        },
                        buy(){
                                buyManualBuyable("h", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 12, maximum)
                        },
                        unlocked(){ 
                                return player.j.puzzle.upgrades.includes(32) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                13: {
                        title: "Hope",
                        display(){
                                return getBuyableDisplay("h", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h13"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 13)
                        },
                        total(){
                                return getBuyableAmount("h", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 13)
                        },
                        buy(){
                                buyManualBuyable("h", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 13, maximum)
                        },
                        unlocked(){ 
                                return player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                21: {
                        title: "Hour",
                        display(){
                                return getBuyableDisplay("h", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h21"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 21)
                        },
                        total(){
                                return getBuyableAmount("h", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 21)
                        },
                        buy(){
                                buyManualBuyable("h", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 21, maximum)
                        },
                        unlocked(){ 
                                return player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                22: {
                        title: "Huge",
                        display(){
                                return getBuyableDisplay("h", 22)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h22"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 22)
                        },
                        total(){
                                return getBuyableAmount("h", 22).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 22)
                        },
                        buy(){
                                buyManualBuyable("h", 22)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 22, maximum)
                        },
                        unlocked(){ 
                                return player.j.puzzle.upgrades.includes(44) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                23: {
                        title: "Happy",
                        display(){
                                return getBuyableDisplay("h", 23)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h23"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 23)
                        },
                        total(){
                                return getBuyableAmount("h", 23).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 23)
                        },
                        buy(){
                                buyManualBuyable("h", 23)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 23, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("j", 6) || hasUnlockedPast("j")
                        },
                },
                31: {
                        title: "Hair",
                        display(){
                                return getBuyableDisplay("h", 31)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h31"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 31)
                        },
                        total(){
                                return getBuyableAmount("h", 31).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 31)
                        },
                        buy(){
                                buyManualBuyable("h", 31)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 31, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("j", 12) || hasUnlockedPast("j")
                        },
                },
                32: {
                        title: "Horse",
                        display(){
                                return getBuyableDisplay("h", 32)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h32"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 32)
                        },
                        total(){
                                return getBuyableAmount("h", 32).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 32)
                        },
                        buy(){
                                buyManualBuyable("h", 32)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 32, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("j", 7) || hasUnlockedPast("j")
                        },
                },
                33: {
                        title: "Omnipotent VIII",
                        display(){
                                return getBuyableDisplay("h", 33)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["h33"]
                        },
                        canAfford(){
                                return canAffordBuyable("h", 33)
                        },
                        total(){
                                return getBuyableAmount("h", 33).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("h", 33)
                        },
                        buy(){
                                buyManualBuyable("h", 33)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("h", 33, maximum)
                        },
                        unlocked(){ 
                                return hasMilestone("k", 3) || hasUnlockedPast("k")
                        },
                },
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Hi",
                        challengeDescription: "All previous layer buyables have no effect",
                        rewardDescription: "Give free <b>Huge</b> levels",
                        rewardEffect(){
                                let c = challengeCompletions("h", 11)
                                let ret = c * c * c * 5 + c * c * 45 + c * 50
                                return Math.floor(ret)
                        },
                        goal(){
                                let init = new Decimal("1e3800e18")
                                let factor = getChallengeFactor(challengeCompletions("h", 11))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e11e18", factor))
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(52) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length

                                return ret
                        },
                },
                12: {
                        name: "Hold",
                        challengeDescription: "<b>Hi</b> and Medal effect is nullified",
                        rewardDescription: "Raise <b>I</b> effect to a power",
                        rewardEffect(){
                                let c = challengeCompletions("h", 12)
                                let base = 10
                                if (hasUpgrade("j", 23)) base += player.j.upgrades.length
                                return Decimal.pow(base, Math.sqrt(c))
                        },
                        goal(){
                                let init = new Decimal("1e9525e18")
                                let factor = getChallengeFactor(challengeCompletions("h", 12))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e1624e18", factor))
                        },
                        unlocked(){
                                return hasUpgrade("h", 53) || hasUnlockedPast("j")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length

                                return ret
                        },
                        countsAs: [11],
                },
                21: {
                        name: "Housing",
                        challengeDescription: "<b>Hold</b> and <b>Egg</b> effect is nullified",
                        rewardDescription: "Multiply base <b>J</b> and knowledge gain",
                        rewardEffect(){
                                let c = challengeCompletions("h", 21)
                                let base = 2
                                if (hasUpgrade("j", 33)) base += .1 * player.j.upgrades.length
                                return Decimal.pow(base, c)
                        },
                        goal(){
                                let init = new Decimal("1e2362e21")
                                let factor = getChallengeFactor(challengeCompletions("h", 21))
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e587e21", factor))
                        },
                        unlocked(){
                                return hasMilestone("k", 4) || hasUnlockedPast("k")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length

                                return ret
                        },
                        countsAs: [11, 12],
                },
                22: {
                        name: "Hit",
                        challengeDescription: "<b>Housing</b> and <b>Heart</b> effect is nullified",
                        rewardDescription: "Add to Larger Puzzle and <b>Japan</b> base",
                        rewardEffect(){
                                let c = challengeCompletions("h", 22)
                                let exp = 1.5
                                let init = Decimal.pow(c, exp)
                                if (init.gt(10) && !hasUpgrade("j", 43)) init = init.log10().times(10)
                                return init.times(.02)
                        },
                        goal(){
                                let init = new Decimal("1e1099e28")
                                let c = challengeCompletions("h", 22)
                                if (c > 3) c = c * c / 3
                                let factor = getChallengeFactor(c)
                                if (factor.eq(1)) factor = new Decimal(0)
                                return init.times(Decimal.pow("1e191e28", factor))
                        },
                        unlocked(){
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        },
                        currencyInternalName: "points",
                        completionLimit(){
                                let ret = 20
                                if (hasUpgrade("j", 33)) ret += player.j.upgrades.length
                                if (hasUpgrade("k", 21)) ret += 5
                                if (hasMilestone("k", 10)) ret += player.k.milestones.length

                                return ret
                        },
                        countsAs: [11, 12, 21],
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("h", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                return shiftDown ? "Your best Hearts is " + format(player.h.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (hasUnlockedPast("h")) return ""
                                                return "You have done " + formatWhole(player.h.times) + " Heart resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (hasUpgrade("h", 22)) return "You are gaining " + format(tmp.h.getResetGain) + " Hearts per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.h.time)) + ")" 
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
                                return player.j.puzzle.upgrades.includes(31) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Challenges": {
                        content: [
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                return "Challenge completions are never reset, and you can bulk complete challenges"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                return "You have completed " + formatWhole(totalChallengeComps("h")) + " Heart Challenges"
                                        }
                                ],
                                "challenges",
                        ],
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(52) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                },
                
        },
        doReset(layer){
                let data = player.h
                if (layer == "h") data.time = 0
                if (!getsReset("h", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("i", 7)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                if (!false) {
                        //upgrades
                        let keep2 = []
                        if (hasMilestone("i", 1)) keep2.push("1")
                        data.milestones = filter(data.milestones, keep2)
                }

                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)
                player.goalsii.points = new Decimal(0)
                player.goalsii.total = new Decimal(0)
                player.goalsii.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})


addLayer("i", {
        name: "Ideas",
        symbol: "I",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                }
        },
        color: "#FFFF33",
        branches: ["h"],
        requires: new Decimal(0),
        resource: "Ideas",
        baseResource: "Hearts",
        baseAmount() {
                return player.h.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("i")
        },
        getBaseDiv(){
                let x = new Decimal("1e10")
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasMilestone("i", 7)) x = x.plus(1)
                if (hasUpgrade("h", 31)) x = x.plus(player.h.upgrades.length * .1)
                if (hasUpgrade("h", 43)) x = x.plus(player.i.upgrades.length * .2)
                if (hasMilestone("j", 4)) x = x.plus(123.456 * player.j.milestones.length)
                if (hasMilestone("k", 8)) x = x.plus(tmp.h.challenges[11].rewardEffect)
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(7, -1)
                if (hasUpgrade("i", 14)) x = x.times(Decimal.pow(1.1, player.i.upgrades.length))
                if (hasUpgrade("i", 25)) x = x.times(Math.max(1, totalChallengeComps("f")))
                if (hasMilestone("j", 2)) x = x.times(Decimal.pow(2, player.j.milestones.length))
                if (hasUpgrade("h", 53)) x = x.times(player.j.puzzle.bestExp.max(1))
                if (hasUpgrade("i", 43)) x = x.times(Decimal.pow(player.i.upgrades.length, player.i.upgrades.length).max(1))
                if (hasUpgrade("i", 44)) x = x.times(Decimal.pow(totalChallengeComps("f"), totalChallengeComps("f")).max(1))
                if (hasUpgrade("j", 14)) x = x.times(Decimal.pow(player.j.puzzle.bestExp.max(1), player.j.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("i")

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("i")) return new Decimal(1)

                let amt = player.i.best

                let exp = player.i.best.pow(.4).times(2).min(30)
                if (hasUpgrade("i", 24)) exp = exp.times(tmp.f.challenges[21].rewardEffect)
                exp = exp.times(tmp.h.challenges[12].rewardEffect)
                
                let exp2 = new Decimal(0)
                exp2 = exp2.plus(CURRENT_BUYABLE_EFFECTS["h23"]) 

                let ret = amt.times(2).pow(2).plus(1).pow(exp)

                let ret2 = amt.pow(exp2).max(1)

                //ret = softcap(ret, "h_eff")

                return ret.times(ret2)
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("i")
        },
        update(diff){
                let data = player.i

                data.best = data.best.max(data.points)
                if (hasUpgrade("i", 22)) {
                        let gain = tmp.i.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (hasUpgrade("j", 42)) {
                        handleGeneralizedBuyableAutobuy(diff, "i")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                data.autodevtime += diff
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autodevtime > 10) data.autodevtime = 10

                let l =  ["f", "g", "h"]
                let l2 = ["F", "G", "H"]
                let trylist = [11, 12, 13, 14, 15, 
                               21, 22, 23, 24, 25,
                               31, 32, 33, 34, 35,
                               41, 42, 43, 44, 45,
                               51, 52, 53, 54, 55,]
                for (j in l){
                        i = l[j] //i is our layer
                        let can = data["autobuy" + l2[j]] && hasMilestone("i", String(Number(j) + 3))
                        // check if the ab is on and unlocked
                        if (!can) continue
                        for (k in trylist) {
                                //if we have the upgrade continue
                                if (hasUpgrade(i, trylist[k])) continue
                                if (layers[i].upgrades[trylist[k]] == undefined) continue
                                
                                //if we dont have it, try to buy it and then break, so we only buy one
                                buyUpgrade(i, trylist[k])
                                if (!false) break
                        }
                }
        },
        row: 8, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "i", description: "I: Reset for Ideas", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+I", description: "Shift+I: Go to Ideas", onPress(){
                                showTab("i")
                        }
                },
                {key: "3", description: "3: Rebirth III", onPress(){
                                let data = layers.g.clickables[35]
                                if (data.canClick()) data.onClick()
                        }
                },
        ],
        layerShown(){return player.h.best.gt(5e16) || player.i.best.gt(0) || hasUnlockedPast("i")},
        prestigeButtonText(){
                if (hasUpgrade("i", 22)) return ""
                return getGeneralizedPrestigeButtonText("i")
        },
        canReset(){
                return player.i.time >= 2 && !hasUpgrade("i", 22) && tmp.i.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>In</b><br>Requires: 1 Idea", 
                        effectDescription: "Side layers do not get reset and keep <b>Have</b>",
                        done(){
                                return player.i.points.gte(1)
                        },
                        unlocked(){
                                return true
                        }, // hasMilestone("i", 1)
                },
                2: {
                        requirementDescription: "<b>Is</b><br>Requires: 2 Ideas", 
                        effectDescription: "Doing a Rebirth II does not reset your Rebirth Is",
                        done(){
                                return player.i.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("i", 1) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 2)
                },
                3: {
                        requirementDescription: "<b>I</b><br>Requires: 3 Ideas", 
                        effectDescription: "Each <b>I</b> milestone doubles base <b>G</b> gain and autobuy <b>F</b> upgrades",
                        done(){
                                return player.i.points.gte(3)
                        },
                        unlocked(){
                                return hasMilestone("i", 2) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 3)
                        toggles: [["i", "autobuyF"]]
                },
                4: {
                        requirementDescription: "<b>It</b><br>Requires: 5 Ideas", 
                        effectDescription: "Keep <b>Gallery</b> and autobuy <b>G</b> upgrades and add 100 to base charge gain",
                        done(){
                                return player.i.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("i", 3) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 4)
                        toggles: [["i", "autobuyG"]],
                },
                5: {
                        requirementDescription: "<b>If</b><br>Requires: 7 Ideas", 
                        effectDescription: "Keep <b>F</b> upgrades and autobuy <b>H</b> upgrades",
                        done(){
                                return player.i.points.gte(7)
                        },
                        unlocked(){
                                return hasMilestone("i", 4) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 5)
                        toggles: [["i", "autobuyH"]],
                },
                6: {
                        requirementDescription: "<b>Information</b><br>Requires: 11 Ideas", 
                        effectDescription: "Keep <b>G</b> upgrades and <b>G</b> milestones",
                        done(){
                                return player.i.points.gte(11)
                        },
                        unlocked(){
                                return hasMilestone("i", 5) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 6)
                },
                7: {
                        requirementDescription: "<b>Its</b><br>Requires: 15 Ideas", 
                        effectDescription: "Keep <b>H</b> upgrades and add one to the <b>H</b> gain exponent",
                        done(){
                                return player.i.points.gte(15)
                        },
                        unlocked(){
                                return hasMilestone("i", 6) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 7)
                },
                8: {
                        requirementDescription: "<b>Into</b><br>Requires: 2e6 Ideas", 
                        effectDescription: "Automatically bulk buy Rebirth I",
                        done(){
                                return player.i.points.gte(2e6)
                        },
                        unlocked(){
                                return hasMilestone("i", 7) || hasUnlockedPast("i")
                        }, // hasMilestone("i", 8)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Info",
                        description: "Unlock an <b>F</b> buyable and each upgrade in this row unlocks a <b>G</b> buyable",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasMilestone("i", 8) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 11)
                12: {
                        title: "Items",
                        description: "Unlock an <b>F</b> challenge and per upgrade act as if you have 3% less rebirths",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasUpgrade("g", 51) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 12)
                13: {
                        title: "Item",
                        description: "Each upgrade adds 10 to the <b>H</b> gain exponent and <b>F</b> and <b>G</b> buyables cost nothing",
                        cost: new Decimal(3e6),
                        unlocked(){
                                return hasUpgrade("g", 52) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 13)
                14: {
                        title: "International",
                        description: "Per upgrade raise <b>A</b> gain ^1.1 and multiply base <b>I</b> gain by 1.1",
                        cost: new Decimal(1e10),
                        unlocked(){
                                return hasUpgrade("h", 32) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 14)
                15: {
                        title: "Internet",
                        description: "Per upgrade add .01 to <b>Gives</b> base and <b>Generation</b> gives free <b>Goal</b> levels",
                        cost: new Decimal(3e10),
                        unlocked(){
                                return hasUpgrade("i", 14) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 15)
                21: {
                        title: "Index",
                        description: "<b>Guarantee</b> and <b>Generation</b> give free <b>Guidelines</b> levels",
                        cost: new Decimal(3e11),
                        unlocked(){
                                return hasUpgrade("i", 15) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 21)
                22: {
                        title: "Including",
                        description: "Remove the ability to prestige but gain 100% of <b>I</b> upon prestige per second",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("i", 21) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 22)
                23: {
                        title: "Image",
                        description: "Unlock a <b>G</b> buyable and each upgrade multiplies base <b>H</b> gain by 10",
                        cost: new Decimal(2e15),
                        unlocked(){
                                return hasUpgrade("h", 42) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 23)
                24: {
                        title: "Insurance",
                        description: "<b>Further</b> effects <b>I</b> effect and <b>Generated</b> gives free <b>Growing</b> levels",
                        cost: new Decimal(2e16),
                        unlocked(){
                                return hasUpgrade("i", 23) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 24)
                25: {
                        title: "Include",
                        description: "<b>F</b> challenge completions multiply base <b>I</b> gain and <b>Guys</b> gives free <b>Growing</b> levels",
                        cost: new Decimal(1e25),
                        unlocked(){
                                return hasUpgrade("h", 45) || hasUnlockedPast("i")
                        }
                }, // hasUpgrade("i", 25)
                31: {
                        title: "Industry",
                        description: "Multiply knowledge gain by the number of <b>I</b> upgrades",
                        cost: new Decimal("1e8642"),
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(41) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 31)
                32: {
                        title: "Issues",
                        description: "Upon placing all corners and edges while building the edge automatically start buidling the center",
                        cost: new Decimal("1e40e3"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(3) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 32)
                33: {
                        title: "Important",
                        description: "Remove the ability to prestige for Jigsaws but gain 100% of Jigsaws upon prestige per second",
                        cost: new Decimal("1e41e3"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(5) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 33)
                34: {
                        title: "Issue",
                        description: "If you do not have the requirements for the current puzzle mode then automatically start filtering",
                        cost: new Decimal("1e43210"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(6) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 34)
                35: {
                        title: "Interest",
                        description: "Levels of Japan multiply <b>Huge</b> base and base <b>J</b> gain",
                        cost: new Decimal("1e54321"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(8) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 35)
                41: {
                        title: "Images",
                        description: "Make the puzzle reset cooldown 20 seconds and log10([best knowledge]) adds to <b>Generated</b> base",
                        cost: new Decimal("1e100000"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(11) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 41)
                42: {
                        title: "Includes",
                        description: "Per upgrade add .01 to the <b>Hour</b> base",
                        cost: new Decimal("1e118000"),
                        unlocked(){
                                return player.j.puzzle.repeatables[14].gte(12) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 42)
                43: {
                        title: "Island",
                        description: "Per upgrade multiply base <b>I</b> gain by the number of upgrades",
                        cost: new Decimal("1e120000"),
                        unlocked(){
                                return hasUpgrade("h", 55) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 43)
                44: {
                        title: "Individual",
                        description: "Per <b>F</b> challenge completion multiply base <b>I</b> gain by the number of <b>F</b> challenge completions",
                        cost: new Decimal("1e140000"),
                        unlocked(){
                                return hasUpgrade("i", 43) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 44)
                45: {
                        title: "Included",
                        description: "Square <b>Huge</b> base and unlock <b>J</b> upgrades",
                        cost: new Decimal("1e477000"),
                        unlocked(){
                                return hasUpgrade("i", 44) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("i", 45)
                51: {
                        title: "India",
                        description: "You start at 90% of your best puzzles finished this <b>K</b> and get resources as if you did them",
                        cost: new Decimal("1e1234567"),
                        unlocked(){
                                return hasMilestone("k", 4) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 51)
                52: {
                        title: "Income",
                        description: "Keep success chance levels and unlock a <b>K</b> milestone",
                        cost: new Decimal("1e1444444"),
                        unlocked(){
                                return hasUpgrade("i", 51) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 52)
                53: {
                        title: "Institute",
                        description: "Once per second get Attempt Speed levels as if you bought max but it doesn't cost Knowledge",
                        cost: new Decimal("1e5500e3"),
                        unlocked(){
                                return hasUpgrade("i", 52) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 53)
                54: {
                        title: "Inside",
                        description: "Once per second get attempt to Reset<sup>2</sup> and per <b>J</b> upgrade multiply base <b>J</b> gain by bulk amount",
                        cost: new Decimal("1e6000e3"),
                        unlocked(){
                                return hasUpgrade("i", 53) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 54)
                55: {
                        title: "Islands",
                        description: "Each Reset<sup>2</sup> doubles base <b>K</b> gain and multiplies Knowledge gain by 10",
                        cost: new Decimal("1e7777e3"),
                        unlocked(){
                                return hasUpgrade("i", 54) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("i", 55)

                /*
                idea
                independent
                improve
                Impact
                introduction
                */
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Investment",
                        display(){
                                return getBuyableDisplay("i", 11)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["i11"]
                        },
                        canAfford(){
                                return canAffordBuyable("i", 11)
                        },
                        total(){
                                return getBuyableAmount("i", 11).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("i", 11)
                        },
                        buy(){
                                buyManualBuyable("i", 11)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("i", 11, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        },
                },
                12: {
                        title: "Ideas",
                        display(){
                                return getBuyableDisplay("i", 12)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["i12"]
                        },
                        canAfford(){
                                return canAffordBuyable("i", 12)
                        },
                        total(){
                                return getBuyableAmount("i", 12).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("i", 12)
                        },
                        buy(){
                                buyManualBuyable("i", 12)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("i", 12, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("j", 42) || hasUnlockedPast("k")
                        },
                },
                13: {
                        title: "Inn",
                        display(){
                                return getBuyableDisplay("i", 13)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["i13"]
                        },
                        canAfford(){
                                return canAffordBuyable("i", 13)
                        },
                        total(){
                                return getBuyableAmount("i", 13).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("i", 13)
                        },
                        buy(){
                                buyManualBuyable("i", 13)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("i", 13, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("j", 43) || hasUnlockedPast("k")
                        },
                },
                21: {
                        title: "Industrial",
                        display(){
                                return getBuyableDisplay("i", 21)
                        },
                        effect(){
                                return CURRENT_BUYABLE_EFFECTS["i21"]
                        },
                        canAfford(){
                                return canAffordBuyable("i", 21)
                        },
                        total(){
                                return getBuyableAmount("i", 21).plus(this.extra())
                        },
                        extra(){
                                return calcBuyableExtra("i", 21)
                        },
                        buy(){
                                buyManualBuyable("i", 21)
                        },
                        buyMax(maximum){
                                buyMaximumBuyable("i", 21, maximum)
                        },
                        unlocked(){ 
                                return hasUpgrade("j", 44) || hasUnlockedPast("k")
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("i", 22) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "i") return ""
                                                return shiftDown ? "Your best Ideas is " + format(player.i.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "i") return ""
                                                if (hasUnlockedPast("i")) return ""
                                                return "You have done " + formatWhole(player.i.times) + " Idea resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "i") return ""
                                                if (hasUpgrade("i", 22)) return "You are gaining " + format(tmp.i.getResetGain) + " Ideas per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.i.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                ["upgrades", [1,5]]
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){
                let data = player.i
                if (layer == "i") data.time = 0
                if (!getsReset("i", layer)) return
                data.time = 0
                data.times = 0

                if (!hasMilestone("j", 3)) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!hasMilestone("k", 2)) {
                        //milestones
                        let keep2 = []
                        for (i = 0; i < player.j.times; i++) {
                                if (i >= 8) break
                                if (!hasMilestone("j", 1)) break
                                keep2.push(["1", "2", "3", "4", "5", "6", "7", "8"][i])
                        }
                        data.milestones = filter(data.milestones, keep2)
                }


                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break //remove when buyables added
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})

addLayer("j", {
        name: "Jigsaws",
        symbol: "J",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                        autopuzzlereset: false,
                        puzzle: {
                                exp: new Decimal(0),
                                bestExp: new Decimal(0),
                                bankedExp: new Decimal(0),
                                knowledge: new Decimal(0),
                                bestKnowledge: new Decimal(0),
                                mode: 4,
                                currentX: 10,
                                currentY: 10,
                                upgrades: [],
                                autotime: 0,
                                time: 0,
                                finished: 0,
                                bartype: 2,
                                bestCompletedK: 0,
                                bestCompletedAllTime: 0,
                                repeatables: {
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        35: new Decimal(0),
                                        45: new Decimal(0),
                                        55: new Decimal(0),
                                        65: new Decimal(0),
                                },
                                found: {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                },
                                placed: {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                },
                                reset2: {
                                        times: 0,
                                        done: false,
                                }
                        },
                }
        },
        color: "#66CCFF",
        branches: ["i"],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Jigsaws", // Name of prestige currency
        baseResource: "Ideas", // Name of resource prestige is based on
        baseAmount() {
                return player.i.best
        }, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("j")
        },
        getBaseDiv(){
                let x = new Decimal("3e30")
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("j", 25)) {
                        let a = player.j.puzzle.reset2.times 
                        if (hasUpgrade("j", 31)) a = Decimal.times(a,a)
                        x = x.plus(a)
                }
                if (player.j.puzzle.upgrades.includes(61)) x = x.plus(player.j.puzzle.repeatables[35])
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(11, -1)
                if (hasUpgrade("i", 35)) x = x.times(player.j.puzzle.repeatables[35].max(1))
                if (hasMilestone("j", 6)) x = x.times(tmp.j.clickables[35].effect)
                x = x.times(tmp.j.clickables[55].effect)
                if (hasMilestone("k", 2)) x = x.times(Decimal.pow(3, player.k.milestones.length))
                x = x.times(tmp.h.challenges[21].rewardEffect)
                if (hasUpgrade("i", 54)) x = x.times(Decimal.pow(tmp.j.clickables.getBulkAmount, player.j.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("j")

                if (hasUpgrade("h", 52)) x = x.times(player.j.puzzle.bestKnowledge.max(1))
                if (hasUpgrade("j", 11)) x = x.times(Decimal.pow(player.j.puzzle.repeatables[13].max(1), player.j.upgrades.length))
                if (hasUpgrade("j", 13)) x = x.times(player.j.puzzle.repeatables[12].max(10).log10())

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("j")) return new Decimal(1)

                let amt = player.j.best

                let exp = player.j.best.pow(.35).times(4).min(500)
                if (player.j.puzzle.upgrades.includes(43)) exp = exp.times(player.j.puzzle.upgrades.length)

                let ret = amt.times(3).plus(1).pow(exp)

                //ret = softcap(ret, "h_eff")

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("j")
        },
        update(diff){
                let data = player.j

                data.best = data.best.max(data.points)
                if (hasUpgrade("i", 33)) {
                        let gain = tmp.j.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (false) {
                        handleGeneralizedBuyableAutobuy(diff, "j")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                data.autodevtime += diff / Math.min(1, player.devSpeed)

                if (!hasUnlockedPast("i")) return //should help w lag

                //puzzle
                let data2 = data.puzzle
                let tot1 = (data2.currentX - 2) * (data2.currentY - 2)
                let tot2 = (data2.currentX - 2 + data2.currentY - 2) * 2
                let tot3 = 4
                data2.bestKnowledge = data2.bestKnowledge.max(data2.knowledge)
                data2.bestExp = data2.bestExp.max(data2.exp)
                data2.bestCompletedK = Math.max(data2.bestCompletedK, data2.finished)
                data2.bestCompletedAllTime = Math.max(data2.bestCompletedAllTime, data2.finished)
                data2.time += diff / (player.devSpeed || 1)
                data2.autotime += diff * tmp.j.clickables.getAttemptSpeed.toNumber() / (player.devSpeed || 1)
                let multiplier = tmp.j.clickables.getBulkAmount

                let finishedPEdges = tot2 == data2.placed.edges
                let finishedPCorners = tot3 == data2.placed.corners
                let finishedPCenters = tot1 == data2.placed.centers
                let finishedFEdges = tot2 == data2.found.edges
                let finishedFCorners = tot3 == data2.found.corners
                let finishedFCenters = tot1 == data2.found.centers


                if (data2.mode == 1) layers.j.clickables.doSearch(Math.floor(data2.autotime) * multiplier)
                if (data2.mode == 2) {
                        if (finishedFCorners && finishedFEdges) {
                                layers.j.clickables.doEdges(Math.floor(data2.autotime) * multiplier)
                        } else if (hasUpgrade("i", 34) || player.j.puzzle.reset2.done) {
                                data2.mode = 1
                        }
                }
                if (data2.mode == 3) {
                        if (finishedFCenters && finishedPEdges) {
                                layers.j.clickables.doCenters(Math.floor(data2.autotime) * multiplier)
                        } else if (hasUpgrade("i", 34) || player.j.puzzle.reset2.done) {
                                data2.mode = 1
                        }
                }
                if (data2.mode == 4) {
                        if (hasUpgrade("i", 34) || player.j.puzzle.reset2.done) {
                                if (finishedPEdges && finishedPCorners && finishedPCenters) {}
                                else {
                                        data2.mode = 1
                                }

                        }
                        if (data2.autotime > 1) layers.j.clickables.attemptFinish()
                }

                finishedPEdges = tot2 == data2.placed.edges
                finishedPCorners = tot3 == data2.placed.corners
                finishedFEdges = tot2 == data2.found.edges
                finishedFCorners = tot3 == data2.found.corners
                finishedFCenters = tot1 == data2.found.centers

                if (!(finishedFEdges && finishedFCorners && finishedFCenters)){
                        data2.placed.centers = 0
                        data2.placed.corners = 0
                        data2.placed.edges = 0
                } //not found all pieces
                if (!finishedPCorners){
                        data2.placed.centers = 0
                        data2.placed.edges = 0
                } //not placed all corners
                if (!finishedPEdges) {
                        data2.placed.centers = 0
                } //not placed all centers
                

                //do stuff for other settings
                data2.autotime += -1 * Math.floor(data2.autotime)
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autopuzzlereset && hasMilestone("j", 5)) {
                        layers.j.clickables[25].onClick()
                }
                if (hasMilestone("k", 6)) {
                        layers.j.clickables[11].onClick(forcemulti = true, nocost = true)
                }
                if (hasUpgrade("i", 53)) {
                        layers.j.clickables[12].onClick(forcemulti = true, nocost = true)
                }
                if (hasUpgrade("i", 54)) {
                        layers.j.clickables[65].onClick()
                }
                if (hasUpgrade("j", 32)) {
                        layers.j.clickables[13].onClick(nocost = true)
                }
                if (hasMilestone("k", 9)) {
                        layers.j.clickables[14].onClick(nocost = true)
                }
                if (hasUpgrade("j", 44)){
                        layers.j.clickables[35].onClick()
                        layers.j.clickables[45].onClick()
                        layers.j.clickables[55].onClick()
                }
                if (data.autodevtime > 10) data.autodevtime = 10
        },
        row: 9, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "j", description: "J: Reset for Jigsaws", onPress(){
                                if (!shiftDown) {
                                        if (canReset(this.layer)) doReset(this.layer)
                                } else {
                                        showTab("j")
                                }
                        }
                },
                {key: "shift+J", description: "Shift+J: Go to Jigsaws", onPress(){
                                showTab("j")
                        }
                },
                {key: "4", description: "4: Rebirth IV", onPress(){
                                let data = layers.g.clickables[45]
                                if (data.canClick()) data.onClick()
                        }
                },
                {key: "6", description: "6: Select Filter", onPress(){
                                layers.j.clickables[21].onClick()
                        }
                },
                {key: "7", description: "7: Select Edges", onPress(){
                                layers.j.clickables[22].onClick()
                        }
                },
                {key: "8", description: "8: Select Center", onPress(){
                                layers.j.clickables[23].onClick()
                        }
                },
                {key: "9", description: "9: Select Finish", onPress(){
                                layers.j.clickables[24].onClick()
                        }
                },
                {key: "shift+)", description: "Shift+0: Puzzle Reset", onPress(){
                                layers.j.clickables[25].onClick()
                        }
                },
        ],
        layerShown(){return hasUpgrade("i", 25) || player.j.best.gt(0) || hasUnlockedPast("j")},
        prestigeButtonText(){
                if (hasUpgrade("i", 33)) return ""
                return getGeneralizedPrestigeButtonText("j")
        },
        canReset(){
                return player.j.time >= 2 && !hasUpgrade("i", 33) && tmp.j.getResetGain.gt(0)
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Just</b><br>Requires: 1 Jigsaw", 
                        effectDescription: "Per <b>J</b> reset keep one <b>I</b> milestone",
                        done(){
                                return player.j.points.gte(1)
                        },
                        unlocked(){
                                return true || hasUnlockedPast("j")
                        }, // hasMilestone("j", 1)
                },
                2: {
                        requirementDescription: "<b>January</b><br>Requires: 5 Jigsaws", 
                        effectDescription: "Per <b>J</b> milestone double base <b>I</b> gain",
                        done(){
                                return player.j.points.gte(5)
                        },
                        unlocked(){
                                return hasMilestone("j", 1) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 2)
                },
                3: {
                        requirementDescription: "<b>Jobs</b><br>Requires: 625 Jigsaws", 
                        effectDescription: "Keep <b>I</b> upgrades and per <b>J</b> milestone act as if you have 4% less rebirths",
                        done(){
                                return player.j.points.gte(625)
                        },
                        unlocked(){
                                return hasMilestone("j", 2) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 3)
                },
                4: {
                        requirementDescription: "<b>Job</b><br>Requires: 1,953,125 Jigsaws", 
                        effectDescription: "Per <b>J</b> milestone add 123.456 to <b>I</b> gain exponent",
                        done(){
                                return player.j.points.gte(1953125)
                        },
                        unlocked(){
                                return hasMilestone("j", 3) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 4)
                },
                5: {
                        requirementDescription: "<b>Jones</b><br>Requires: 152,587,890,625 Jigsaws", 
                        effectDescription: "Unlock the ability to automatically reset puzzles if possible",
                        done(){
                                return player.j.points.gte(5 ** 16)
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(51) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }, // hasMilestone("j", 5)
                        toggles: [["j", "autopuzzlereset"]]
                },
                6: {
                        requirementDescription: "<b>Jim</b><br>Requires: 2.98e17 Jigsaws", 
                        effectDescription: "Unlock a <b>H</b> buyable and <b>Japan</b> multiplies base <b>J</b> gain",
                        done(){
                                return player.j.points.max(1).log(5).gte(25)
                        },
                        unlocked(){
                                return hasMilestone("j", 5) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 6)
                },
                7: {
                        requirementDescription: "<b>Judge</b><br>Requires: 1.46e25 Jigsaws", 
                        effectDescription: "Unlock a <b>H</b> buyable and <b>Hair</b> gives free <b>Happy</b> levels",
                        done(){
                                return player.j.points.max(1).log(5).gte(36)
                        },
                        unlocked(){
                                return hasUpgrade("j", 13) || hasUnlockedPast("j")
                        }, // hasMilestone("j", 7)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Joint",
                        description: "Per upgrade multiply <b>J</b> gain by your Bulk Amount levels and you can puzzle reset 3% faster for every upgrade",
                        cost: new Decimal(2e20),
                        unlocked(){
                                return hasUpgrade("h", 45) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 11)
                12: {
                        title: "Joe",
                        description: "Unlock a <b>H</b> buyable and raise the jigsaw speed multiplier to the square root of the number of upgrades",
                        cost: new Decimal(1e22),
                        unlocked(){
                                return hasUpgrade("j", 11) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 12)
                13: {
                        title: "Jackson",
                        description: "You can bulk attempt speed while holding shift, log10(attempt speed levels) multiplies <b>J</b> gain, and unlock a milestone",
                        cost: new Decimal(5e23),
                        unlocked(){
                                return hasUpgrade("j", 12) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 13)
                14: {
                        title: "Joseph",
                        description: "Multiply knowledge gain by the number of upgrades and each upgrade multiplies base <b>I</b> gain by best exp",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasUpgrade("j", 13) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 14)
                15: {
                        title: "Jeff",
                        description: "log(best knowledge) multiplies knowledge gain and <b>Horse</b> gives free <b>Hair</b> levels",
                        cost: new Decimal(5e28),
                        unlocked(){
                                return hasUpgrade("j", 14) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 15)
                21: {
                        title: "Jordan",
                        description: "<b>Junior</b> effects <b>Held</b> and <b>Horse</b> gives free <b>Happy</b> levels",
                        cost: new Decimal(2e30),
                        unlocked(){
                                return hasUpgrade("j", 15) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 21)
                22: {
                        title: "Jean",
                        description: "Raise <b>Hope</b> base to the number of puzzle upgrades and add one to <b>Junior</b> base",
                        cost: new Decimal(5e33),
                        unlocked(){
                                return (hasUpgrade("j", 21) && player.j.puzzle.repeatables[14].gte(20)) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 22)
                23: {
                        title: "Journals",
                        description: "Each upgrade adds one to <b>Hold</b> effect base (it is initially 10)",
                        cost: new Decimal(1e38),
                        unlocked(){
                                return (hasUpgrade("j", 22) && player.j.puzzle.reset2.done) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 23)
                24: {
                        title: "Jennifer",
                        description: "<b>Japan</b> effects <b>Junior</b> base and you can complete one more of each <b>F</b> challenge",
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("j", 23) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 24)
                25: {
                        title: "Jose",
                        description: "Gain 5x attempt speed and knowledge gain and each <b>Reset<sup>2</sup></b> adds 1 to the <b>J</b> gain exponent",
                        cost: new Decimal(1e46),
                        unlocked(){
                                return hasUpgrade("j", 24) || hasUnlockedPast("j")
                        }
                }, // hasUpgrade("j", 25)
                31: {
                        title: "Jane",
                        description: "Raise <b>Jose</b> effect to the number of <b>Reset<sup>2</sup></b>'s and halve reset cooldown",
                        cost: new Decimal("1e1750"),
                        unlocked(){
                                return hasMilestone("k", 7) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 31)
                32: {
                        title: "Journey",
                        description: "Add one to the <b>K</b> gain exponent and if you can buy a level of Bulk Amount you do so for free once per second",
                        cost: new Decimal("1e5432"),
                        unlocked(){
                                return hasUpgrade("j", 31) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 32)
                33: {
                        title: "Jewellery",
                        description: "Each upgrade adds .1 to the <b>Housing</b> base and you can complete one more <b>H</b> challenge",
                        cost: new Decimal("1e9876"),
                        unlocked(){
                                return hasUpgrade("j", 32) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 33)
                34: {
                        title: "Jay",
                        description: "Buff <b>India</b> to all but 5 and add .1 to the <b>Japan</b> base",
                        cost: new Decimal("1e24680"),
                        unlocked(){
                                return hasUpgrade("j", 33) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 34)
                35: {
                        title: "Jacket",
                        description: "Each <b>K</b> milestone adds .1 to the <b>K</b> gain exponent and .01 to the <b>Japan</b> base",
                        cost: new Decimal("1e27272"),
                        unlocked(){
                                return hasUpgrade("j", 34) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 35)
                41: {
                        title: "Jet",
                        description: "Per upgrade in this row unlock an <b>I</b> buyable and unlock the final <b>H</b> challenge",
                        cost: new Decimal("1e357e3"),
                        unlocked(){
                                return hasUpgrade("k", 22) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 41)
                42: {
                        title: "Joy",
                        description: "Automatically buy <b>I</b> buyables, each upgrade doubles base <b>K</b> gain, and you buy 10x Bulk Amount levels",
                        cost: new Decimal("1e458e3"),
                        unlocked(){
                                return hasUpgrade("j", 41) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 42)
                43: {
                        title: "Jon",
                        description: "Remove <b>Hit</b> effect softcap and <b>Housing</b> effects <b>K</b> gain",
                        cost: new Decimal("1e701e3"),
                        unlocked(){
                                return hasUpgrade("j", 42) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 43)
                44: {
                        title: "Judgment",
                        description: "Autobuy <b>Japan</b>, <b>Jack</b>, and <b>Junior</b> once per second and add one to <b>K</b> gain exponent",
                        cost: new Decimal("1e897e3"),
                        unlocked(){
                                return hasUpgrade("j", 43) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 44)
                45: {
                        title: "Jokes",
                        description: "<b>Industrial</b> gives free <b>Inn</b> and <b>Ideas</b> levels and <b>Inn</b> gives free <b>Ideas</b> and <b>Investment</b> levels",
                        cost: new Decimal("1e912e3"),
                        unlocked(){
                                return hasUpgrade("j", 44) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("j", 45)

                /*
                jessica
                jerry
                johnny
                jimmy
                */
        },
        clickables: {
                rows: 6,
                cols: 5, 
                jigsawEffect(){
                        let base = player.j.points.plus(1e9).log10()

                        let exp = new Decimal(.5)
                        if (hasUpgrade("j", 12)) exp = exp.times(Math.sqrt(player.j.upgrades.length))
                        let ret = base.pow(exp)
                        return ret
                },
                nameOfModeV(){
                        let m = player.j.puzzle.mode
                        if (m == 1) return "filter pieces"
                        if (m == 2) return "build the edge"
                        if (m == 3) return "build the center"
                        return "finish the puzzle"
                },
                getAttemptSpeed(){
                        let ret = tmp.j.clickables.jigsawEffect
                        ret = ret.times(tmp.j.clickables[12].effect)
                        if (hasUpgrade("j", 25)) {
                                let e = hasUpgrade("j", 31) ? player.j.puzzle.reset2.times : 1
                                ret = ret.times(Decimal.pow(5, e))
                        }
                        return ret
                },
                getAttemptChance(){
                        let ret = Decimal.pow(.5, player.j.puzzle.finished).times(.5)
                        ret = ret.times(tmp.j.clickables[11].effect)
                        ret = ret.times(tmp.j.clickables[35].effect)
                        return ret
                },
                getBulkAmount(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.j.clickables[13].effect)
                        if (player.j.puzzle.reset2.done) ret = ret.times(2)
                        if (hasMilestone("k", 1)) ret = ret.times(2)
                        return Math.round(ret.toNumber())
                },
                doSearch(times = 1){
                        let data = player.j.puzzle
                        let tot1 = (data.currentX - 2) * (data.currentY - 2)
                        let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                        let tot3 = 4
                        let b = 0
                        for (i = 0; i < times; i ++){
                                let rem1 = tot1 - data.found.centers
                                let rem2 = tot2 - data.found.edges
                                let rem3 = tot3 - data.found.corners
                                let remtot = rem1 + rem2 + rem3 
                                if (remtot == 0) {
                                        b = i + 1
                                        break
                                }
                                let r = Math.random()
                                if (r < rem1/remtot) data.found.centers ++
                                else if (r < (rem1 + rem2)/remtot) data.found.edges ++
                                else if (r < (rem1 + rem2 + rem3)/remtot) data.found.corners ++
                        }
                        if (!(player.j.puzzle.upgrades.includes(44) || player.j.puzzle.reset2.done)) return
                        if (tot1 != data.found.centers) return
                        if (tot2 != data.found.edges) return
                        if (tot3 != data.found.corners) return
                        data.mode = 2
                        if (times == b) return
                        this.doEdges(times - b)
                },
                doEdges(times = 1){
                        let data = player.j.puzzle
                        let b = 0
                        let c = 0
                        while (c < 5){
                                c ++ 
                                if (data.placed.corners < 4) {
                                        let left = 4 - data.placed.corners 
                                        b += getTimesRequired(tmp.j.clickables.getAttemptChance.div(left))
                                        if (b > times) return 
                                        data.placed.corners ++ 
                                } else break
                        }

                        let left = (data.currentX - 2 + data.currentY - 2) * 2 - data.placed.edges
                        let total = (data.currentX - 2 + data.currentY - 2) * 2
                        let x = getNumFinished(tmp.j.clickables.getAttemptChance.times(10), left, times - b, total)
                        data.placed.edges = total - x[0]
                        b = times - x[1]

                        if (x[1] == 0) return 
                        if (!(hasUpgrade("i", 32) || player.j.puzzle.reset2.done)) return
                        data.mode = 3
                        if (times >= b + 1) return
                        this.doCenters(times - b - 1)
                },
                doCenters(times = 1){
                        let data = player.j.puzzle
                        let b = 0
                        let c = 0
                        
                        let left = (data.currentX - 2) * (data.currentY - 2) - data.placed.centers
                        let total = (data.currentX - 2) * (data.currentY - 2)
                        let x = getNumFinished(tmp.j.clickables.getAttemptChance.times(50), left, times, total)
                        data.placed.centers = total - x[0]
                        b = times - x[1]
                        
                        if (x[1] == 0) return 
                        if (!(player.j.puzzle.upgrades.includes(53) || player.j.puzzle.reset2.done)) return
                        data.mode = 4
                        let k
                        if (times > b) k = this.attemptFinish()
                        if (k) this.doSearch(times - b - 1)
                },
                attemptFinish(){
                        let data = player.j.puzzle
                        let tot1 = (data.currentX - 2) * (data.currentY - 2)
                        let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                        let tot3 = 4
                        if (tot1 != data.placed.centers) return false
                        if (tot2 != data.placed.edges) return false
                        if (tot3 != data.placed.corners) return false
                        data.finished ++
                        data.exp = data.exp.plus(1)
                        data.bankedExp = data.bankedExp.plus(tmp.j.clickables.getBankedExpGainUF.times(data.finished).floor())
                        data.knowledge = data.knowledge.plus(tmp.j.clickables.getKnowledgeGainUF.floor())
                        data.placed = {
                                edges: 0,
                                corners: 0,
                                centers: 0,
                        }
                        data.found = {
                                edges: 0,
                                corners: 0,
                                centers: 0,
                        }
                        if (player.j.puzzle.upgrades.includes(43) || player.j.puzzle.reset2.done) data.mode = 1
                        return true
                },
                getKnowledgeGainUF(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.j.clickables[14].effect)
                        if (hasUpgrade("i", 31)) ret = ret.times(player.i.upgrades.length)
                        if (hasUpgrade("j", 14)) ret = ret.times(player.j.upgrades.length)
                        if (hasUpgrade("j", 15)) ret = ret.times(player.j.puzzle.bestKnowledge.max(3).ln())
                        ret = ret.times(Decimal.pow(3, player.j.puzzle.reset2.times))
                        if (hasUpgrade("j", 25)) {
                                let e = hasUpgrade("j", 31) ? player.j.puzzle.reset2.times : 1
                                ret = ret.times(Decimal.pow(5, e))
                        }
                        if (hasMilestone("k", 3)) ret = ret.times(player.ach.best.max(1))
                        ret = ret.times(tmp.h.challenges[21].rewardEffect)
                        if (hasUpgrade("i", 55)) ret = ret.times(Decimal.pow(10, player.j.puzzle.reset2.times))
                        if (hasUpgrade("k", 11)) ret = ret.times(tmp.j.clickables[35].effect)
                        if (hasUpgrade("k", 12)) ret = ret.times(Decimal.pow(10, player.k.upgrades.length))
                        if (hasUpgrade("k", 13)) ret = ret.times(player.j.puzzle.bestExp.max(1).pow(.1))
                        if (hasUpgrade("k", 21) && hasMilestone("k", 7)) ret = ret.times(Decimal.pow(2, totalChallengeComps("h")))
                        return ret
                },
                getBankedExpGainUF(){
                        let ret = new Decimal(1)
                        ret = ret.times(tmp.j.clickables[14].effect)
                        if (player.j.puzzle.upgrades.includes(54)) ret = ret.times(Decimal.pow(2, player.j.upgrades.length))
                        ret = ret.times(Decimal.pow(3, player.j.puzzle.reset2.times))
                        if (hasMilestone("k", 2)) ret = ret.times(player.ach.best.max(1))
                        if (hasMilestone("k", 7)) ret = ret.times(Decimal.pow(2, totalChallengeComps("h")))
                        if (hasUpgrade("k", 11)) ret = ret.times(tmp.j.clickables[35].effect)
                        if (hasUpgrade("k", 13)) ret = ret.times(player.j.puzzle.bestKnowledge.max(1).pow(.1))
                        if (hasUpgrade("k", 22)) ret = ret.times(Decimal.pow(tmp.j.clickables[35].effect, player.k.upgrades.length))
                        return ret
                },
                getResetCD(){
                        let ret = 60
                        if (hasUpgrade("i", 41)) ret = Math.min(ret, 20)
                        if (hasUpgrade("j", 11)) ret *= Math.pow(.97, player.j.upgrades.length)
                        if (hasUpgrade("j", 31)) ret *= .5
                        return ret
                },
                getCurrentMaxSize(){
                        let ret = 20
                        ret += 5 * player.j.puzzle.reset2.times
                        return ret
                },
                11: {
                        title(){
                                return "<h3 style='color: #FF3333'>Success Chance</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (shiftDown && !hasMilestone("k", 6)) {
                                        end = ""
                                        if (tmp.j.clickables[11].effeciency.lt(tmp.j.clickables[12].effeciency)) {
                                                if (tmp.j.clickables[11].effeciency.lt(tmp.j.clickables[13].effeciency)) {
                                                        end = "<br><h2 style='color: #CCFF66'>Best!</h2>"
                                                }
                                        }
                                        return "Effeciency:<br>" + format(tmp.j.clickables[11].effeciency) + end
                                }
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[11].cost) + " Knowledge<br>"
                                let b = "<h3 style='color: #339900'>Current</h3>: " + formatWhole(player.j.puzzle.repeatables[11]) + " levels<br>"
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[11].effect, 4) + " success chance<br>"
                                if (hasMilestone("k", 6)) return c
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                if (player.j.puzzle.repeatables[11].lt(1e10)) return new Decimal(Math.floor(Math.sqrt(player.j.puzzle.repeatables[11].toNumber() + 1)))
                                return Decimal.pow(player.j.puzzle.repeatables[11].plus(1), .5).floor()                                                                            
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[11].cost)
                        },
                        effect(delta = 0){
                                let lvl = player.j.puzzle.repeatables[11].plus(delta)
                                let ret = Decimal.pow(lvl.plus(1), lvl.plus(1).log10().div(3))
                                if (ret.gt(1e4)) ret = ret.sqrt().times(100)
                                if (ret.gt(1e5)) ret = ret.log10().plus(5).pow(5)
                                return ret
                        },
                        totalSoFar(){
                                return this.totalTarget(player.j.puzzle.repeatables[11])
                        },
                        totalTarget(target = new Decimal(0)){
                                let sf = target.round()
                                let norm = sf.plus(1).sqrt().floor().minus(1)
                                let normCost = norm.times(norm.plus(1)).times(norm.times(4).plus(5)).div(6)
                                let extra = sf.minus(norm.plus(1).pow(2)).plus(1).times(norm.plus(1))
                                return normCost.plus(extra)
                        },
                        costTo(target = new Decimal(0)) {
                                let sf = tmp.j.clickables[11].totalSoFar
                                let tr = layers.j.clickables[11].totalTarget(target)
                                return tr.minus(sf).max(0)
                        },
                        getMaxCostTo(){
                                let z = player.j.puzzle.repeatables[11]
                                let a = .5
                                let run = true
                                let amt = player.j.puzzle.knowledge
                                let amt2 = player.j.puzzle.knowledge.plus(tmp.j.clickables[11].totalSoFar)
                                if (amt2.gt(1e40)) {
                                        while (run){
                                                a *= 2
                                                if (amt.lt(this.costTo(z.plus(a)))) run = false
                                        }
                                        a /= 2
                                        let sum = a
                                        if (sum < 1) return 0
                                        let c = 0
                                        while (a >= 1 && c < 100){
                                                c ++
                                                a /= 2
                                                if (amt.gte(this.costTo(z.plus(sum).plus(a)))) sum += a
                                        }
                                        return sum
                                } else {
                                        let ncInverse = amt2.times(3/2).cbrt() 
                                        //gives us norm
                                        return ncInverse.pow(2).sub(z).max(0)
                                }
                        },
                        effeciency(){
                                let c = tmp.j.clickables[11].cost
                                let e = this.effect(1).div(tmp.j.clickables[11].effect)
                                return e.ln().pow(-1).times(c)
                        },
                        onClick(forcemulti = false, nocost = false){
                                let data = player.j.puzzle

                                let additional = new Decimal(tmp.j.clickables[11].getMaxCostTo)
                                if (!player.j.puzzle.upgrades.includes(51) && !player.j.puzzle.reset2.done) additional = additional.min(1)
                                if (!shiftDown && !forcemulti) additional = additional.min(1)
                                if (!nocost) data.knowledge = data.knowledge.minus(this.costTo(data.repeatables[11].plus(additional)))
                                data.repeatables[11] = data.repeatables[11].plus(additional)
                        },
                },
                12: {
                        title(){
                                return "<h3 style='color: #FF3333'>Attempt Speed</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (shiftDown && !hasUpgrade("i", 53)) {
                                        end = ""
                                        if (tmp.j.clickables[12].effeciency.lt(tmp.j.clickables[11].effeciency)) {
                                                if (tmp.j.clickables[12].effeciency.lt(tmp.j.clickables[13].effeciency)) {
                                                        end = "<br><h2 style='color: #CCFF66'>Best!</h2>"
                                                }
                                        }
                                        return "Effeciency:<br>" + format(tmp.j.clickables[12].effeciency) + end
                                }
                                let ktf = tmp.j.clickables[12].cost.lt(100) ? " Knowledge" : ""
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[12].cost) + ktf + "<br>"
                                let b = "<h3 style='color: #339900'>Current</h3>: " + formatWhole(player.j.puzzle.repeatables[12]) + " levels<br>"
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[12].effect) + " Attempt Speed<br>"
                                if (hasUpgrade("i", 53)) return c
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                return player.j.puzzle.repeatables[12].plus(1)
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[12].cost)
                        },
                        effect(delta = 0){
                                let lvl = player.j.puzzle.repeatables[12].plus(delta)
                                let exp = new Decimal(2)
                                if (player.j.puzzle.upgrades.includes(34)) exp = exp.times(2)
                                let ret = lvl.plus(10).log10().pow(exp)
                                if (ret.gt(100)) ret = ret.sqrt().times(10)
                                return ret
                        },
                        totalSoFar(){
                                let sf = player.j.puzzle.repeatables[12]
                                return sf.times(sf.plus(1)).div(2)
                        },
                        totalTarget(target = new Decimal(0)){
                                return target.times(target.plus(1)).div(2)
                        },
                        costTo(target = new Decimal(0)) {
                                let sf = tmp.j.clickables[12].totalSoFar
                                let tr = layers.j.clickables[12].totalTarget(target)
                                return tr.minus(sf).max(0)
                        },
                        getMaxCostTo(){
                                let z = player.j.puzzle.repeatables[12]
                                let a = .5
                                let run = true
                                let amt = player.j.puzzle.knowledge.plus(tmp.j.clickables[12].totalSoFar)
                                /*
                                x^2 + x < 2*amt (ROUND DOWN x)
                                x = -1 + sqrt(1+8*amt) / 2
                                */
                                let x = amt.times(8).plus(1).sqrt().minus(1).div(2).floor()
                                return x.minus(z)
                        },
                        effeciency(){
                                let c = tmp.j.clickables[12].cost
                                let e = this.effect(1).div(tmp.j.clickables[12].effect)
                                return e.ln().pow(-1).times(c)
                        },
                        onClick(forcemulti = false, nocost = false){
                                let data = player.j.puzzle

                                let additional = new Decimal(tmp.j.clickables[12].getMaxCostTo)
                                if (!hasUpgrade("j", 13) && !player.j.puzzle.reset2.done) additional = additional.min(1)
                                if (!shiftDown && !forcemulti) additional = additional.min(1)
                                if (!nocost) data.knowledge = data.knowledge.minus(this.costTo(data.repeatables[12].plus(additional)))
                                data.repeatables[12] = data.repeatables[12].plus(additional)
                        },
                },
                13: {
                        title(){
                                return "<h3 style='color: #FF3333'>Bulk Amount</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                if (shiftDown && (!hasUpgrade("i", 53) || !hasMilestone("k", 6))) {
                                        end = ""
                                        if (tmp.j.clickables[13].effeciency.lt(tmp.j.clickables[12].effeciency)) {
                                                if (tmp.j.clickables[13].effeciency.lt(tmp.j.clickables[11].effeciency)) {
                                                        end = "<br><h2 style='color: #CCFF66'>Best!</h2>"
                                                }
                                        }
                                        return "Effeciency:<br>" + format(tmp.j.clickables[13].effeciency) + end
                                }
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[13].cost) + " Knowledge<br>"
                                let b = "<h3 style='color: #339900'>Current</h3>: " + formatWhole(player.j.puzzle.repeatables[13]) + " levels<br>"
                                if (player.j.puzzle.repeatables[13].gt(50)) b = ""
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[13].effect) + " to Bulk amount<br>"
                                return a + b + c
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        cost(){
                                return Decimal.pow(1.5, player.j.puzzle.repeatables[13]).times(10).floor()
                        },
                        canClick(){
                                return player.j.puzzle.knowledge.gte(tmp.j.clickables[13].cost)
                        },
                        effect(delta = 0){
                                let ret = player.j.puzzle.repeatables[13].plus(delta).plus(1)
                                if (hasMilestone("k", 1)) ret = ret.pow(2)
                                return ret
                        },
                        effeciency(){
                                let c = tmp.j.clickables[13].cost
                                let e = this.effect(1).div(tmp.j.clickables[13].effect)
                                return e.ln().pow(-1).times(c)
                        },
                        onClick(nocost = false, times = 1){
                                let data = player.j.puzzle
                                if (hasUpgrade("j", 42)) times *= 10
                                for (i = 0; i < times; i++) {
                                        let cost = this.cost()
                                        if (cost.gt(data.knowledge)) return 
                                        if (!nocost) data.knowledge = data.knowledge.minus(cost)
                                        data.repeatables[13] = data.repeatables[13].plus(1)
                                }
                        },
                },
                14: {
                        title(){
                                return "<h3 style='color: #FF3333'>Larger Puzzle</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                let a = "<h3 style='color: #993300'>Cost</h3>: " + formatWhole(tmp.j.clickables[14].cost) + " Knowledge<br>"
                                let x = tmp.j.clickables.getCurrentMaxSize
                                if (Math.min(player.j.puzzle.currentX, player.j.puzzle.currentY) == x) a = "<h3 style='color: #993300'>MAXED!</h3><br>"
                                let c = "<h3 style='color: #9933CC'>Effect</h3>: *" + format(tmp.j.clickables[14].effect) + " Knowledge and Banked Exp gain<br>"
                                return a + c
                        },
                        unlocked(){
                                return true
                        },
                        cost(){
                                let a = Decimal.pow(4, player.j.puzzle.repeatables[14].pow(.8)).times(40)
                                let b = Decimal.pow(2.25, player.j.puzzle.repeatables[14])
                                let c = Decimal.pow(1.0046, player.j.puzzle.repeatables[14].pow(2))

                                return a.max(b).max(c).floor()
                        },
                        canClick(){
                                let x = tmp.j.clickables.getCurrentMaxSize
                                return player.j.puzzle.knowledge.gte(this.cost()) && (player.j.puzzle.currentX < x || player.j.puzzle.currentY < x)
                        },
                        base(){
                                let base = new Decimal(1.8)
                                if (hasUpgrade("k", 15)) base = base.plus(.02 * player.k.upgrades.length)
                                base = base.plus(tmp.h.challenges[22].rewardEffect)
                                return base
                        },
                        effect(){
                                let exp = player.j.puzzle.repeatables[14]
                                if (exp.gt(4) && !hasUpgrade("k", 14)) exp = exp.sqrt().times(2)
                                let base = tmp.j.clickables[14].base
                                return Decimal.pow(base, exp)
                        },
                        onClick(nocost = false){
                                let data = player.j.puzzle
                                let cost = this.cost()

                                if (!this.canClick()) return 
                                if (!nocost) data.knowledge = data.knowledge.minus(cost)
                                data.repeatables[14] = data.repeatables[14].plus(1)
                                let x = tmp.j.clickables.getCurrentMaxSize
                                if (data.currentY == x) {
                                        data.currentX ++
                                } else if (data.currentX == x) {
                                        data.currentY ++
                                } else if (Math.random() < .5) {
                                        data.currentY ++
                                } else data.currentX ++
                                data.placed = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                                data.found = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }

                                return //bulk needs to be done eventually
                        },
                },
                15: {
                        title(){
                                return "<h3 style='color: #FF3333'>Progress Bar</h3>"
                        },
                        display(){
                                if (player.tab != "j") return ""
                                let z = player.j.puzzle.bartype
                                if (z == 1) return "Current mode:<br>Only placing"
                                if (z == 0) return "Current mode:<br>Finding and placing"
                                if (z == 2) return "Current mode:<br>Semi-linear (smart)"
                                return "broke yeet"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.bartype ++ 
                                if (player.j.puzzle.bartype >= 3) player.j.puzzle.bartype -= 3
                        },
                },
                21: {
                        title(){
                                if (player.j.puzzle.mode == 1) return "<h3 style='color: #FFFFFF'>Filter</h3><br>(6)"
                                return "<h3 style='color: #FF3333'>Filter</h3><br>(6)"
                        },
                        display(){
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 1
                        },
                },
                22: {
                        title(){
                                if (player.j.puzzle.mode == 2) return "<h3 style='color: #FFFFFF'>Edges</h3><br>(7)"
                                return "<h3 style='color: #FF3333'>Edges</h3><br>(7)"
                        },
                        display(){
                                let data = player.j.puzzle
                                let x = (data.currentX - 2 + data.currentY - 2) * 2
                                if (data.found.corners < 4) return "Requires: 4 corners found"
                                if (data.found.edges < x) return "Requires: " + formatWhole(x) + " edges found"
                                if (data.placed.corners < 4) {
                                        let left = 4 - data.placed.corners 
                                        return "Chance " + formatChances(tmp.j.clickables.getAttemptChance.div(left).min(1).times(100)) + "%"
                                }
                                if (data.placed.edges < x) {
                                        let left = x - data.placed.edges
                                        return "Chance " + formatChances(tmp.j.clickables.getAttemptChance.div(left).min(.1).times(1000)) + "%"
                                }
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 2
                        },
                },
                23: {
                        title(){
                                if (player.j.puzzle.mode == 3) return "<h3 style='color: #FFFFFF'>Center</h3><br>(8)"
                                return "<h3 style='color: #FF3333'>Center</h3><br>(8)"
                        },
                        display(){
                                let data = player.j.puzzle
                                let a = data.currentX * 2 + data.currentY * 2 - 8
                                let b = (data.currentX - 2) * (data.currentY - 2)
                                if (data.placed.edges < a) return "Requires: " + formatWhole(a) + " edges placed"
                                if (data.found.centers < b) return "Requires: " + formatWhole(b) + " centers found"
                                if (data.placed.centers < b) {
                                        let left = b - data.placed.centers
                                        return "Chance " + formatChances(tmp.j.clickables.getAttemptChance.div(left).min(.02).times(5000)) + "%"
                                }
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 3
                        },
                },
                24: {
                        title(){
                                if (player.j.puzzle.mode == 4) return "<h3 style='color: #FFFFFF'>Finish</h3><br>(9)"
                                return "<h3 style='color: #FF3333'>Finish</h3><br>(9)"
                        },
                        display(){
                                let data = player.j.puzzle
                                let tot1 = (data.currentX - 2) * (data.currentY - 2)
                                let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                                let tot3 = 4
                                if (tot1 != data.placed.centers) return "Requires: All pieces placed"
                                if (tot2 != data.placed.edges) return "Requires: All pieces placed"
                                if (tot3 != data.placed.corners) return "Requires: All pieces placed"
                                return ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.j.puzzle.mode = 4
                        },
                },
                25: {
                        title(){
                                return "<h3 style='color: #FF3333'>Reset</h3><br>(Shift+0)"
                        },
                        display(){
                                return "Reset puzzle progress to get Banked Experience (" + format(Math.max(0, tmp.j.clickables.getResetCD - player.j.puzzle.time)) + "s)" 
                        },
                        unlocked(){
                                return player.j.puzzle.bestExp.gt(2) || player.j.puzzle.reset2.done || player.j.puzzle.bankedExp.gt(2) || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.bankedExp.gt(0) && player.j.puzzle.time >= tmp.j.clickables.getResetCD
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.exp = data.exp.plus(data.bankedExp)
                                data.bankedExp = new Decimal(0)
                                data.placed = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                                data.found = {
                                        edges: 0,
                                        corners: 0,
                                        centers: 0,
                                }
                                data.finished = 0
                                data.time = 0
                                if (player.j.puzzle.upgrades.includes(43) || player.j.puzzle.reset2.done) data.mode = 1
                                if (!hasUpgrade("i", 51)) return

                                let target = Math.floor(data.bestCompletedK * .9)
                                if (hasUpgrade("j", 34)) target = Math.max(target, data.bestCompletedK - 5)
                                if (hasMilestone("k", 9)) target = Math.max(target, data.bestCompletedK - 1)
                                data.finished = target
                                let c2 = function(x){return x * (x + 1) / 2}

                                data.bankedExp = data.bankedExp.plus(tmp.j.clickables.getBankedExpGainUF.times(c2(target)).floor())
                                data.knowledge = data.knowledge.plus(tmp.j.clickables.getKnowledgeGainUF.times(target).floor())
                        },
                },
                31: {
                        title(){
                                return "<b style='color: #003333'>Join</b>"
                        },
                        display(){
                                let a = "Per upgrade in this row unlock an <b>H</b> buyable and raise charge gain ^50"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[31].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.bestExp.gt(2) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[31].cost) && !player.j.puzzle.upgrades.includes(31)
                        },
                        cost(){
                                return new Decimal(10)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(31) ? "#77bf5f" : tmp.j.clickables[31].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[31].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[31].cost)
                                data.upgrades.push(31)
                        },
                },
                32: {
                        title(){
                                return "<b style='color: #003333'>June</b>"
                        },
                        display(){
                                let a = "Unlock the final <b>G</b> buyable and per puzzle upgrade act as if you have 5% less rebirths"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[32].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(31) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[32].cost) && !player.j.puzzle.upgrades.includes(32)
                        },
                        cost(){
                                return new Decimal(20)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(32) ? "#77bf5f" : tmp.j.clickables[32].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[32].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[32].cost)
                                data.upgrades.push(32)
                        },
                },
                33: {
                        title(){
                                return "<b style='color: #003333'>July</b>"
                        },
                        display(){
                                let a = "Automatically buy <b>H</b> buyables and <b>Held</b> gives free <b>Holiday</b> and <b>Omnipotent VII</b> levels"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[33].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(32) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[33].cost) && !player.j.puzzle.upgrades.includes(33)
                        },
                        cost(){
                                return new Decimal(40)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(33) ? "#77bf5f" : tmp.j.clickables[33].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[33].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[33].cost)
                                data.upgrades.push(33)
                        },
                },
                34: {
                        title(){
                                return "<b style='color: #003333'>Journal</b>"
                        },
                        display(){
                                let a = "Unlock Bulk Amount, square Attempt speed, and Rebirth II is no longer reset by later rebirths"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[34].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(33) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[34].cost) && !player.j.puzzle.upgrades.includes(34)
                        },
                        cost(){
                                return new Decimal(80)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(34) ? "#77bf5f" : tmp.j.clickables[34].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[34].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[34].cost)
                                data.upgrades.push(34)
                        },
                },
                35: {
                        title(){
                                return "<b style='color: #003333'>Japan</b>"
                        },
                        display(){
                                let a = "Multiply success chance by " + format(tmp.j.clickables[35].base, 4)
                                let c = "<br>Currently: *" + format(tmp.j.clickables[35].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[35].cost) + " Exp"
                                return a + c + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[35].cost)
                        },
                        cost(){
                                return Decimal.pow(1.5, player.j.puzzle.repeatables[35].pow(2)).ceil()
                        },
                        base(){
                                let ret = new Decimal(1.2)
                                if (hasUpgrade("j", 34)) ret = ret.plus(.1)
                                if (hasUpgrade("j", 35)) ret = ret.plus(.01 * player.k.milestones.length)
                                if (hasUpgrade("k", 12)) ret = ret.plus(.01 * player.k.upgrades.length)
                                ret = ret.plus(tmp.h.challenges[22].rewardEffect)
                                if (player.j.puzzle.upgrades.includes(61)) ret = ret.plus(player.j.puzzle.repeatables[35].times(.005))
                                return ret
                        },
                        effect(){
                                return Decimal.pow(tmp.j.clickables[35].base, player.j.puzzle.repeatables[35])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[35].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[35].cost)
                                data.repeatables[35] = data.repeatables[35].plus(1)
                        },
                },
                41: {
                        title(){
                                return "<b style='color: #003333'>Jewelry</b>"
                        },
                        display(){
                                let a = "<b>Hour</b> gives free <b>Hope</b> levels and unlock rebirth IV"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[41].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.bestKnowledge.gte(30) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[41].cost) && !player.j.puzzle.upgrades.includes(41)
                        },
                        cost(){
                                return new Decimal(160)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(41) ? "#77bf5f" : tmp.j.clickables[41].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[41].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[41].cost)
                                data.upgrades.push(41)
                        },
                },
                42: {
                        title(){
                                return "<b style='color: #003333'>Joined</b>"
                        },
                        display(){
                                let a = "<b>Rebirth IV</b> doesn't reset <b>Rebirth III</b>, autobuy <b>Rebirth IV</b>, and <b>Rebirth IV</b> gives free <b>Hour</b> levels"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[42].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(41) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[42].cost) && !player.j.puzzle.upgrades.includes(42)
                        },
                        cost(){
                                return new Decimal(320)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(42) ? "#77bf5f" : tmp.j.clickables[42].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[42].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[42].cost)
                                data.upgrades.push(42)
                        },
                },
                43: {
                        title(){
                                return "<b style='color: #003333'>Japanese</b>"
                        },
                        display(){
                                let a = "Raise <b>J</b> effect to the number of puzzle upgrades and upon finish or reset automatically start filtering"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[43].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(42) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[43].cost) && !player.j.puzzle.upgrades.includes(43)
                        },
                        cost(){
                                return new Decimal(640)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(43) ? "#77bf5f" : tmp.j.clickables[43].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[43].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[43].cost)
                                data.upgrades.push(43)
                        },
                },
                44: {
                        title(){
                                return "<b style='color: #003333'>Jersey</b>"
                        },
                        display(){
                                let a = "Upon finding all pieces while Filtering automatically go to edges and unlock an <b>H</b> buyable"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[44].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(43) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[44].cost) && !player.j.puzzle.upgrades.includes(44)
                        },
                        cost(){
                                return new Decimal(1280)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(44) ? "#77bf5f" : tmp.j.clickables[44].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[44].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[44].cost)
                                data.upgrades.push(44)
                        },
                },
                45: {
                        title(){
                                return "<b style='color: #003333'>Jack</b>"
                        },
                        display(){
                                let a = "Multiply base <b>H</b> gain by 1e1000"
                                let c = "<br>Currently: *" + format(tmp.j.clickables[45].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[45].cost) + " Exp"
                                return a + c + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(44) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[45].cost)
                        },
                        cost(){
                                return Decimal.pow(2, player.j.puzzle.repeatables[45].pow(2))
                        },
                        effect(){
                                return Decimal.pow("1e1000", player.j.puzzle.repeatables[45])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[45].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[45].cost)
                                data.repeatables[45] = data.repeatables[45].plus(1)
                        },
                },
                51: {
                        title(){
                                return "<b style='color: #003333'>Justice</b>"
                        },
                        display(){
                                let a = "You can hold shift to max buy Success Chance, you can complete 5 more <b>F</b> challenges, and unlock another milestone"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[51].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("i", 34) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[51].cost) && !player.j.puzzle.upgrades.includes(51)
                        },
                        cost(){
                                return new Decimal(2560)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(51) ? "#77bf5f" : tmp.j.clickables[51].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[51].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[51].cost)
                                data.upgrades.push(51)
                        },
                },
                52: {
                        title(){
                                return "<b style='color: #003333'>Jump</b>"
                        },
                        display(){
                                let a = "<b>Huge</b> gives free <b>Hour</b> and <b>Hope</b> levels and unlock a <b>H</b> challenge"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[52].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(51) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[52].cost) && !player.j.puzzle.upgrades.includes(52)
                        },
                        cost(){
                                return new Decimal(5120)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(52) ? "#77bf5f" : tmp.j.clickables[52].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[52].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[52].cost)
                                data.upgrades.push(52)
                        },
                },
                53: {
                        title(){
                                return "<b style='color: #003333'>Johnson</b>"
                        },
                        display(){
                                let a = "<b>Hour</b> gives free <b>Held</b> levels and upon placing all pieces go to Finish"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[53].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(52) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[53].cost) && !player.j.puzzle.upgrades.includes(53)
                        },
                        cost(){
                                return new Decimal(10240)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(53) ? "#77bf5f" : tmp.j.clickables[53].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[53].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[53].cost)
                                data.upgrades.push(53)
                        },
                },
                54: {
                        title(){
                                return "<b style='color: #003333'>Jazz</b>"
                        },
                        display(){
                                let a = "Each <b>J</b> upgrade doubles banked exp gain"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[54].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("j", 14) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[54].cost) && !player.j.puzzle.upgrades.includes(54)
                        },
                        cost(){
                                return new Decimal(1e6)
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(54) ? "#77bf5f" : tmp.j.clickables[54].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[54].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[54].cost)
                                data.upgrades.push(54)
                        },
                },
                55: {
                        title(){
                                return "<b style='color: #003333'>Junior</b>"
                        },
                        display(){
                                let a = "Multiply base <b>J</b> gain by " + format(tmp.j.clickables[55].base)
                                let c = "<br>Currently: *" + format(tmp.j.clickables[55].effect)
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[55].cost) + " Exp"
                                return a + c + b
                        },
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(54) || player.j.puzzle.reset2.done || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[55].cost)
                        },
                        cost(){
                                return Decimal.pow(3, player.j.puzzle.repeatables[55].pow(2)).times(3e6)
                        },
                        base(){
                                let base = new Decimal(2)
                                if (hasUpgrade("j", 22)) base = base.plus(1)
                                if (hasUpgrade("j", 24)) base = base.times(tmp.j.clickables[35].effect)
                                return base
                        },
                        effect(){
                                let base = tmp.j.clickables[55].base
                                return Decimal.pow(base, player.j.puzzle.repeatables[55])
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[55].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[55].cost)
                                data.repeatables[55] = data.repeatables[55].plus(1)
                        },
                },
                65: {
                        title(){
                                return "<b style='color: #003333'>Reset<sup>2</sup></b>"
                        },
                        display(){
                                let a = "Requires: Maxed Larger Puzzle"
                                let c = "<br>You have done: " + formatWhole(player.j.puzzle.reset2.times)
                                return a + c
                        },
                        unlocked(){
                                return player.j.puzzle.reset2.done || (player.j.puzzle.repeatables[14].gte(20) && player.ach.best.gte(149)) || hasUnlockedPast("j")
                        },
                        canClick(){
                                return player.j.puzzle.repeatables[14].gte(20 + 10 * player.j.puzzle.reset2.times)
                        },
                        style(){
                                return {
                                        "background-color": tmp.j.clickables[65].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!this.canClick()) return
                                let data = player.j.puzzle
                                data.reset2.times ++
                                data.reset2.done = true
                                if (hasMilestone("k", 4)) return 
                                data.exp = new Decimal(0)
                                data.bankedExp = new Decimal(0)
                                data.knowledge = new Decimal(0)
                                data.repeatables[11] = new Decimal(0)
                                data.repeatables[12] = new Decimal(0)
                                data.repeatables[13] = new Decimal(0)
                                data.repeatables[14] = new Decimal(0)
                                data.repeatables[35] = new Decimal(0)
                                data.repeatables[45] = new Decimal(0)
                                data.repeatables[55] = new Decimal(0)
                                data.upgrades = []
                                data.placed = {
                                        corners: 0,
                                        edges: 0,
                                        centers: 0,
                                }
                                data.found = {
                                        corners: 0,
                                        edges: 0,
                                        centers: 0,
                                }
                                data.currentX = 10
                                data.currentY = 10
                                data.finished = 0
                                data.mode = 1
                        },
                },
                61: {
                        title(){
                                return "<b style='color: #003333'>Jonathan</b>"
                        },
                        display(){
                                let a = "Each <b>Japan</b> adds .005 to the <b>Japan</b> base and adds one to the <b>J</b> gain exponent"
                                let b = "<br><br>Cost: " + formatWhole(tmp.j.clickables[61].cost) + " Exp"
                                return a + b
                        },
                        unlocked(){
                                return hasUpgrade("j", 45) || hasUnlockedPast("k")
                        },
                        canClick(){
                                return player.j.puzzle.exp.gte(tmp.j.clickables[61].cost) && !player.j.puzzle.upgrades.includes(61)
                        },
                        cost(){
                                return new Decimal("2e385")
                        },
                        style(){
                                return {
                                        "background-color": player.j.puzzle.upgrades.includes(61) ? "#77bf5f" : tmp.j.clickables[61].canClick ? "#66CCFF" : "#bf8f8f"
                                }
                        },
                        onClick(){
                                if (!tmp.j.clickables[61].canClick) return
                                let data = player.j.puzzle
                                data.exp = data.exp.minus(tmp.j.clickables[61].cost)
                                data.upgrades.push(61)
                        },
                },
        },
        bars: {
                progressionBar: {
                        direction: RIGHT,
                        width: 650,
                        height: 40,
                        progress(){
                                if (player.tab != "j") return 0
                                let data = player.j.puzzle
                                let z = data.bartype
                                if (z == 1){
                                        return (data.placed.centers + data.placed.edges + data.placed.corners) / (data.currentX * data.currentY)
                                }
                                if (z == 0) {
                                        let alltot = 2 * data.currentX * data.currentY
                                        let sf = data.placed.centers + data.placed.edges + data.placed.corners + data.found.centers + data.found.edges + data.found.corners
                                        return sf / alltot
                                }
                                if (z == 2){
                                        let por = [4, 2 * (data.currentX + data.currentY) - 8, (data.currentX - 2) * (data.currentY - 2)]
                                        let val = [data.placed.corners, data.placed.edges, data.placed.centers]
                                        let c2 = function(x){
                                                return x * (x + 1) /2
                                        }
                                        let todo = [c2(por[0]), c2(por[1]), c2(por[2])]
                                        let done = [c2(por[0]) - c2(por[0] - val[0]),
                                                        c2(por[1]) - c2(por[1] - val[1]),
                                                        c2(por[2]) - c2(por[2] - val[2])]
                                        let w1 = done[0]
                                        //total number alr done
                                        let w2 = done[1] / 10
                                        let w3 = done[2] / 50
                                        let tot = c2(por[0]) + c2(por[1]) / 10 + c2(por[2]) / 50
                                        //total number needed to be done
                                        let togo = tot - (w1 + w2 + w3)
                                        let factor = 1 / tmp.j.clickables.getBulkAmount / tmp.j.clickables.getAttemptChance.toNumber() / tmp.j.clickables.getAttemptSpeed.toNumber()
                                        let timePLACE = togo * factor //time needed to place the rest
                                        let timePLACETOTAL = tot * factor

                                        let remtofind = (data.currentX * data.currentY - data.found.edges - data.found.corners - data.found.centers)
                                        let timeFIND = remtofind / tmp.j.clickables.getBulkAmount / tmp.j.clickables.getAttemptSpeed.toNumber()
                                        let timeFINDTOTAL = data.currentX * data.currentY / tmp.j.clickables.getBulkAmount / tmp.j.clickables.getAttemptSpeed.toNumber()

                                        return 1 - (timePLACE + timeFIND) / (timePLACETOTAL + timeFINDTOTAL)
                                }
                        },
                        display(){
                                let data = player.j.puzzle
                                let por = [4, 2 * (data.currentX + data.currentY) - 8, (data.currentX - 2) * (data.currentY - 2)]
                                let val = [data.placed.corners, data.placed.edges, data.placed.centers]
                                let c2 = function(x){
                                        return x * (x + 1) /2
                                }
                                let todo = [c2(por[0]), c2(por[1]), c2(por[2])]
                                let done = [c2(por[0]) - c2(por[0] - val[0]),
                                                c2(por[1]) - c2(por[1] - val[1]),
                                                c2(por[2]) - c2(por[2] - val[2])]
                                let w1 = done[0]
                                //total number alr done
                                let w2 = done[1] / 10
                                let w3 = done[2] / 50
                                let tot = c2(por[0]) + c2(por[1]) / 10 + c2(por[2]) / 50
                                //total number needed to be done
                                let togo = tot - (w1 + w2 + w3)
                                let factor = 1 / tmp.j.clickables.getBulkAmount / tmp.j.clickables.getAttemptChance.toNumber() / tmp.j.clickables.getAttemptSpeed.toNumber()
                                let timePLACE = togo * factor
                                
                                let remtofind = (data.currentX * data.currentY - data.found.edges - data.found.corners - data.found.centers)
                                let timeFIND = remtofind / tmp.j.clickables.getBulkAmount / tmp.j.clickables.getAttemptSpeed.toNumber()

                                let timeTICK = (1 - data.autotime) / tmp.j.clickables.getAttemptSpeed.toNumber()
                                if (timePLACE != 0) timePLACE += timeTICK
                                return "Percent complete with this puzzle (est time " + format(timePLACE + timeFIND) + "s)"
                        },
                        fillStyle(){
                                return {
                                        "background": "#66CCFF"
                                }
                        },
                        textStyle(){
                                return {
                                        "color": "#990033"
                                }
                        },
                        /*
                        borderStyle(){
                                return {
                                        "color": "#99CC33"
                                }
                                let data = player.j.puzzle
                                let tot1 = (data.currentX - 2) * (data.currentY - 2)
                                let tot2 = (data.currentX - 2 + data.currentY - 2) * 2
                                let tot3 = 4
                                if (tot1 != data.placed.centers) return {}
                                if (tot2 != data.placed.edges) return {}
                                if (tot3 != data.placed.corners) return {}
                                return {
                                        "color": "#99CC33"
                                }
                        },
                        */
                        /*
                        - baseStyle, fillStyle, borderStyle, textStyle: **Optional**, Apply CSS to the unfilled portion, filled portion, border, and 
                        display text on the bar, in the form of an object where the keys are CSS attributes, and the values are the
                        values for those attributes (both as strings). 
                        */
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("i", 33) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "j") return ""
                                                return shiftDown ? "Your best Jigsaws is " + format(player.j.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "j") return ""
                                                if (hasUnlockedPast("j")) return ""
                                                return "You have done " + formatWhole(player.j.times) + " Jigsaw resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "j") return ""
                                                if (hasUpgrade("i", 33)) return "You are gaining " + format(tmp.j.getResetGain) + " Jigsaws per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.j.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                ["upgrades", [1,5]]],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Puzzle": {
                        content: [
                                ["display-text", function(){
                                        if (player.tab != "j") return ""
                                        let data = player.j.puzzle
                                        let a = "You have " + formatWhole(player.j.points) + " jigsaws, causing a " + format(tmp.j.clickables.jigsawEffect, 4) + " speed multiplier<br>"
                                        if (shiftDown && (!hasUpgrade("i", 53) || !hasMilestone("k", 6))) {
                                                a = "You are holding shift down to bulk buy and see effeciencies (hint: smaller is better)<br>"
                                        }
                                        let b = "You have " + formatWhole(data.exp) + " experience, " + formatWhole(data.bankedExp) + " banked experience, " + formatWhole(data.knowledge) + " knowledge<br>"
                                        let c = "You are currently working on a <h3>" + data.currentX + "</h3>x<h3>" + data.currentY + "</h3> puzzle (" + formatWhole(data.finished) + " completed)<br>"
                                        if (shiftDown) {
                                                c = "Your bulk amount is " + formatWhole(tmp.j.clickables.getBulkAmount) + "<br>"
                                        }
                                        return a + b + c
                                }],
                                ["clickables", [1,2]],
                                ["display-text", function(){
                                        if (player.tab != "j") return ""
                                        let data = player.j.puzzle
                                        let data2 = data.found
                                        let data3 = data.placed
                                        let a = "You have found " + formatWhole(data2.corners) + " corners, " + formatWhole(data2.edges) + " edges and, " + formatWhole(data2.centers) + " centers.<br>"
                                        let b = "You have placed " + formatWhole(data3.corners) + " corners, " + formatWhole(data3.edges) + " edges and, " + formatWhole(data3.centers) + " centers.<br>"
                                        let c = ""
                                        if (tmp.j.clickables.getAttemptSpeed.lt(10)) {
                                                let x = formatWhole(Math.floor(Math.min(data.autotime, 1) * 100))
                                                if (x.length == 1) x = "0" + x
                                                c = "You are currently attempting to " + tmp.j.clickables.nameOfModeV + " every " + format(tmp.j.clickables.getAttemptSpeed.pow(-1)) + " seconds (" + x + "%).<br>"
                                        } else {
                                                c = "You are currently attempting to " + tmp.j.clickables.nameOfModeV + " " + format(tmp.j.clickables.getAttemptSpeed) + " times per second.<br>"
                                        }
                                        return a + b + c
                                }],
                                ["bar", "progressionBar"],
                                ["clickables", [3,6]],
                        ],
                        unlocked(){
                                return hasMilestone("j", 4) || hasUnlockedPast("j")
                        },
                },
                "Details": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                        if (player.tab != "j") return ""
                                        let a = `<h2 style='color:#FF3366'>Puzzle mechanic:</h2><br>
                                        You have a 10x10 puzzle (initially)<br>You can buy the following upgrades [more unlocked later], <br>
                                        1. success chance, [50% base]<br>2. attempt speed, [1s base]<br><br>
                                        There are edge, corner, and center pieces<br>There are 4 settings you can be in<br>
                                        1. Filter<br>1a. It filters for pieces putting them into catagories<br>
                                        2. Build edges [gives 10x chances if on edges]<br>
                                        3. Build center [gives 50x chances]<br>3a. Puts parts together<br>4. Finish puzzle<br>
                                        <br><br>Note that you both need to be on the correct piece (randomly chosen)<br>
                                        and succeed to place the piece<br>In other words, you have <br>
                                        <b style='color:#883333'> [which piece factor]/[remaining piece of type]*[base chance] </b><br>chance to succeed<br>
                                        This [base chance] is halved per completed puzzle and boosted by various upgrades<br><br>
                                        You get things for finishing a puzzle:<br>Exp: 1<br>
                                        Banked Exp: [puzzles beaten so far] + 1<br>Knowledge: 1<br>Note gain is [base]*[multipliers], floored<br><br> 
                                        Exp is spent on upgrades that boost the rest of the game<br>
                                        Knowledge is spent on the upgrades mentioned at the top<br><br>`
                                        if (player.j.puzzle.bestExp.eq(0)) return a + "<br><br><br>"
                                        let b = `<h2 style='color:#FF3366'>Reset:</h2><br>
                                        Finishing at least one puzzle allows you to Reset (requires 2 initially)<br>
                                        Restarting makes you start at the first puzzle again and gives you your banked exp<br>
                                        It also resets your progress in the current puzzle, but is vital for progression<br>
                                        Resetting has initially a 60 second cooldown, but this can be reduced later on<br><br>
                                        `
                                        if (player.j.puzzle.repeatables[14].lt(20) && !player.j.puzzle.reset2.done) return a + b + "<br><br><br>"
                                        let c = `<h2 style='color:#FF3366'>Reset<sup>2</sup>:</h2><br>
                                        You unlock reset<sup>2</sup> by having 149 achievements and maxing out Larger Puzzle<br>
                                        You can reset<sup>2</sup> by maxing larger puzzle upgrades.<br>
                                        Each reset allows you to make larger puzzles (by 5 in each dimension)<br>
                                        Additionally, doing your first reset<sup>2</sup> allows you lets you keep all automation unlocked previously<br>
                                        Furthermore, each reset<sup>2</sup> triples banked exp and knowledge gain<br>
                                        The first reset<sup>2</sup> permanently doubles bulk amount<br>
                                        However, doing a reset<sup>2</sup> resets all puzzle content except best exp and best knowledge<br>
                                        Unlike resetting, there is no cooldown [atm]<br><br>`
                                        return a + b + c + "<br><br><br>"
                                }
                                ]
                        ],
                        unlocked(){
                                return true
                        },
                }
        },
        doReset(layer){
                let data = player.j
                if (layer == "j") data.time = 0
                if (!getsReset("j", layer)) return
                data.time = 0
                data.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!hasMilestone("k", 2)) {
                        //upgrades
                        let keep2 = []
                        data.milestones = filter(data.milestones, keep2)
                }

                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break //remove when buyables added
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }

                let data2 = data.puzzle
                data2.exp = new Decimal(0)
                data2.bankedExp = new Decimal(0)
                data2.knowledge = new Decimal(0)
                data2.bestKnowledge = new Decimal(0)
                data2.bestExp = new Decimal(0)
                if (!hasUpgrade("i", 52)) data2.repeatables[11] = new Decimal(0)
                data2.repeatables[12] = new Decimal(0)
                if (!hasMilestone("k", 6)) data2.repeatables[13] = new Decimal(0)
                data2.repeatables[14] = new Decimal(0)
                data2.repeatables[35] = new Decimal(0)
                data2.repeatables[45] = new Decimal(0)
                data2.repeatables[55] = new Decimal(0)
                data2.upgrades = []
                data2.placed = {
                        corners: 0,
                        edges: 0,
                        centers: 0,
                }
                data2.found = {
                        corners: 0,
                        edges: 0,
                        centers: 0,
                }
                data2.currentX = 10
                data2.currentY = 10
                data2.finished = 0
                data2.mode = 1
                data2.reset2.times = 0
                data2.time = 0
                data2.bestCompletedK = 0
        },
})

addLayer("k", {
        name: "Keys",
        symbol: "K",
        position: 0,
        startData() { 
                return {
                        unlocked: true,
                        points: new Decimal(0),
                        best: new Decimal(0),
                        total: new Decimal(0),
                        abtime: 0,
                        time: 0,
                        times: 0,
                        autotimes: 0,
                        autodevtime: 0,
                        lock: {
                                mines: { //extra
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        15: new Decimal(0),
                                        21: new Decimal(0),
                                        22: new Decimal(0),
                                        23: new Decimal(0),
                                        24: new Decimal(0),
                                        25: new Decimal(0),
                                },
                                repeatables: {
                                        11: new Decimal(0),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        14: new Decimal(0),
                                        15: new Decimal(0),
                                        21: new Decimal(0),
                                        22: new Decimal(0),
                                        23: new Decimal(0),
                                        24: new Decimal(0),
                                        25: new Decimal(0),
                                        31: new Decimal(0),
                                        32: new Decimal(0),
                                        33: new Decimal(0),
                                        34: new Decimal(0),
                                        35: new Decimal(0),
                                        41: new Decimal(0),
                                        42: new Decimal(0),
                                        43: new Decimal(0),
                                        44: new Decimal(0),
                                        45: new Decimal(0),
                                        51: new Decimal(0),
                                        52: new Decimal(0),
                                        53: new Decimal(0),
                                        54: new Decimal(0),
                                        55: new Decimal(0),
                                        61: new Decimal(0),
                                        62: new Decimal(0),
                                        63: new Decimal(0),
                                        64: new Decimal(0),
                                        65: new Decimal(0),
                                        71: new Decimal(0),
                                        72: new Decimal(0),
                                        73: new Decimal(0),
                                        74: new Decimal(0),
                                        75: new Decimal(0),
                                        81: new Decimal(0),
                                        82: new Decimal(0),
                                        83: new Decimal(0),
                                        84: new Decimal(0),
                                        85: new Decimal(0),
                                },
                                autotime: 0,
                        },
                } //no comma here
        },
        color: "#3333CC",
        branches: ["j"],
        requires: new Decimal(0),
        resource: "Keys",
        baseResource: "Jigsaws",
        baseAmount() {
                return player.j.best
        },
        type: "custom",
        getResetGain() {
                return getGeneralizedPrestigeGain("k")
        },
        getBaseDiv(){
                let x = new Decimal("1e55")
                return x
        },
        getGainExp(){
                let x = new Decimal(2)
                if (hasUpgrade("j", 32)) x = x.plus(1)
                if (hasUpgrade("j", 35)) x = x.plus(.1 * player.k.milestones.length)
                if (hasUpgrade("k", 22)) x = x.plus(.08 * player.k.upgrades.length)
                if (hasUpgrade("j", 44)) x = x.plus(1)
                return x
        },
        getGainMultPre(){
                let x = Decimal.pow(19, -1)
                if (hasUpgrade("i", 55)) x = x.times(Decimal.pow(2, player.j.puzzle.reset2.times))
                if (hasUpgrade("j", 42)) x = x.times(Decimal.pow(2, player.j.upgrades.length))
                return x
        },
        getGainMultPost(){
                let x = getGeneralizedInitialPostMult("k")

                if (hasMilestone("k", 5)) x = x.times(Decimal.pow(2, player.k.milestones.length))
                if (hasUpgrade("k", 11)) x = x.times(tmp.j.clickables[35].effect)
                if (hasUpgrade("j", 43)) x = x.times(tmp.h.challenges[21].rewardEffect)

                return x
        },
        effect(){
                if (!isPrestigeEffectActive("k")) return new Decimal(1)

                let amt = player.k.best

                let exp = player.k.best.pow(.2).times(3).min(98)
                
                let exp2 = new Decimal(2)

                let ret = amt.times(3).plus(1).pow(exp)

                let ret2 = amt.pow(exp2).max(1)

                //ret = softcap(ret, "h_eff")

                return ret.times(ret2)
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("k")
        },
        update(diff){
                let data = player.k

                data.best = data.best.max(data.points)
                if (hasMilestone("k", 5)) {
                        let gain = tmp.k.getResetGain
                        data.points = data.points.plus(gain.times(diff))
                        data.total = data.total.plus(gain.times(diff))
                        data.autotimes += diff
                        if (data.autotimes > 3) data.autotimes = 3
                        if (data.autotimes > 1) {
                                data.autotimes += -1
                                data.times ++
                        }
                }
                if (false) {
                        handleGeneralizedBuyableAutobuy(diff, "k")
                } else {
                        data.abtime = 0
                }

                data.time += diff
                data.autodevtime += diff
                
                if (data.autodevtime < 1) return
                data.autodevtime += -1
                if (data.autodevtime > 10) data.autodevtime = 10
        },
        row: 10, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "k", description: "K: Reset for Keys", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                {key: "shift+K", description: "Shift+K: Go to Keys", onPress(){
                                showTab("k")
                        }
                },
                {key: "5", description: "5: Rebirth V [not yet]", onPress(){
                                return
                                let data = layers.g.clickables[55]
                                if (data.canClick()) data.onClick()
                        }
                },
        ],
        layerShown(){return player.j.best.gt(1e67) || player.k.best.gt(0) || hasUnlockedPast("k")},
        prestigeButtonText(){
                if (hasMilestone("k", 5)) return ""
                return getGeneralizedPrestigeButtonText("k")
        },
        canReset(){
                return player.k.time >= 2 && !hasMilestone("k", 5) && tmp.k.getResetGain.gt(0)
        },
        milestones: {
                //sequence is 1, 2, then x -> x^2 each time
                1: {
                        requirementDescription: "<b>Know</b><br>Requires: 1 Key", 
                        effectDescription: "Keep <b>F</b> and <b>G</b> upgrades, double bulk amount, and square Bulk Amount",
                        done(){
                                return player.k.points.gte(1)
                        },
                        unlocked(){
                                return true || hasUnlockedPast("k")
                        }, // hasMilestone("k", 1)
                },
                2: {
                        requirementDescription: "<b>Key</b><br>Requires: 2 Keys",
                        effectDescription: "Keep <b>I</b> and <b>J</b> milestones, triple base <b>J</b> gain per milestone, and achievements multiply banked exp gain",
                        done(){
                                return player.k.points.gte(2)
                        },
                        unlocked(){
                                return hasMilestone("k", 1) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 2)
                },
                3: {
                        requirementDescription: "<b>Keep</b><br>Requires: 4 Keys",
                        effectDescription: "Achievements multiply knowledge gain, unlock a <b>H</b> buyable, and remove <b>E</b> effect softcap",
                        done(){
                                return player.k.points.gte(4)
                        },
                        unlocked(){
                                return hasMilestone("k", 2) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 3)
                },
                4: {
                        requirementDescription: "<b>Kids</b><br>Requires: 16 Keys",
                        effectDescription: "Reset<sup>2</sup> resets nothing and unlock a <b>H</b> challenge",
                        done(){
                                return player.k.points.gte(16)
                        },
                        unlocked(){
                                return hasMilestone("k", 3) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 4)
                },
                5: {
                        requirementDescription: "<b>Knowledge</b><br>Requires: 256 Keys",
                        effectDescription: "Remove the ability to prestige but gain 100% of Keys upon prestige per second, and each milestone doubles <b>K</b> gain",
                        done(){
                                return player.k.points.gte(256)
                        },
                        unlocked(){
                                return hasUpgrade("i", 52) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 5)
                },
                6: {
                        requirementDescription: "<b>Known</b><br>Requires: 65,536 Keys",
                        effectDescription: "Keep Bulk Amount levels upon reset and once per second get Success Chance levels as if you bought max, but it doesn't cost Knowledge",
                        done(){
                                return player.k.points.gte(65536)
                        },
                        unlocked(){
                                return hasMilestone("k", 5) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 6)
                },
                7: {
                        requirementDescription: "<b>Kingdom</b><br>Requires: 4,294,967,296 Keys",
                        effectDescription: "Each <b>H</b> challenge completion doubles banked exp gain",
                        done(){
                                return player.k.points.gte(4294967296)
                        },
                        unlocked(){
                                return hasMilestone("k", 6) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 7)
                },
                8: {
                        requirementDescription: "<b>King</b><br>Requires: 1.84e19 Keys",
                        effectDescription: "Square <b>Huge</b> and <b>Hi</b> effects <b>I</b> gain exponent",
                        done(){
                                return player.k.points.max(1).log(2).gte(64)
                        },
                        unlocked(){
                                return hasMilestone("k", 7) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 8)
                },
                9: {
                        requirementDescription: "<b>Kit</b><br>Requires: 3.40e38 Keys",
                        effectDescription: "Buff India to all but one and attempt to buy Larger Puzzle without cost once per second",
                        done(){
                                return player.k.points.max(1).log(2).gte(128)
                        },
                        unlocked(){
                                return hasMilestone("k", 8) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 9)
                },
                10: {
                        requirementDescription: "<b>Korea</b><br>Requires: 1.16e77 Keys",
                        effectDescription: "Per milestone you can complete one more <b>H</b> challenge",
                        done(){
                                return player.k.points.max(1).log(2).gte(256)
                        },
                        unlocked(){
                                return hasUpgrade("k", 22) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 10)
                },
                11: {
                        requirementDescription: "<b>Kelly</b><br>Requires: 1.34e154 Keys",
                        effectDescription: "Per milestone you get ten <b>Inn</b> levels",
                        done(){
                                return player.k.points.max(1).log(2).gte(512)
                        },
                        unlocked(){
                                return hasUpgrade("j", 45) || hasUnlockedPast("k")
                        }, // hasMilestone("k", 11)
                },
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Kind",
                        description: "<b>Japan</b> multiplies knowledge, <b>K</b> and banked exp gain",
                        cost: new Decimal(1e32),
                        unlocked(){
                                return hasUpgrade("j", 35) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 11)
                12: {
                        title: "Kitchen",
                        description: "Each upgrade gives 10x Knowledge gain and adds .01 to the <b>Japan</b> base",
                        cost: new Decimal(2e36),
                        unlocked(){
                                return hasUpgrade("k", 11) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 12)
                13: {
                        title: "Keywords",
                        description: "Best knowledge<sup>.1</sup> multiplies banked exp gain and best exp<sup>.1</sup> multiplies knowledge gain",
                        cost: new Decimal(2e40),
                        unlocked(){
                                return hasUpgrade("k", 12) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 13)
                14: {
                        title: "Kansas",
                        description: "Remove the softcap on the Larger Puzzle effect",
                        cost: new Decimal(1e42),
                        unlocked(){
                                return hasUpgrade("k", 13) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 14)
                15: {
                        title: "Keyword",
                        description: "Per upgrade add .02 to the Larger Puzzle effect base",
                        cost: new Decimal(1e59),
                        unlocked(){
                                return hasUpgrade("k", 14) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 15)
                21: {
                        title: "Kinds",
                        description: "<b>Kingdom</b> effects knowledge and you can complete 5 more of each <b>H</b> challenge",
                        cost: new Decimal(2e60),
                        unlocked(){
                                return hasUpgrade("k", 15) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 21)
                22: {
                        title: "Knew",
                        description: "Per upgrade add .08 to the <b>K</b> gain exponent and <b>Japan</b> multiplies experience gain",
                        cost: new Decimal(1e66),
                        unlocked(){
                                return hasUpgrade("k", 21) || hasUnlockedPast("k")
                        }
                }, // hasUpgrade("k", 22)
                
                /*
                Kept
                Kentucky
                */
        },
        clickables: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<h3 style='color: #C03000'>Iron Mine</h3>"
                        },
                        display(){
                                if (player.tab != "k") return ""
                                let a 
                                let b 
                                let c 
                                if (shiftDown) {
                                        let extra = tmp.k.clickables[11].cost.lt("1e900") ? " <b>Keys</b>" : ""
                                        a = "<h3 style='color: #AC4600'>Cost</h3>: " + formatWhole(tmp.k.clickables[11].cost) + extra + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 70%'>Mine Production/mine/s</h3>:<br>" + format(tmp.k.clickables[11].mineProductionPer, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 70%'>Metal Production/mine/s</h3>:<br>" + format(tmp.k.clickables[11].metalProductionPer, 4) + "<br>"
                                } else {
                                        a = "<h3 style='color: #AC4600'>Mines</h3>: " + formatWhole(player.k.lock.repeatables[11]) + "+" + formatWhole(player.k.lock.mines[11]) + "<br>"
                                        b = "<h3 style='color: #FF33CC; font-size: 80%'>Mine Production/s</h3>:<br>" + format(tmp.k.clickables[11].mineProductionPerSecond, 4) + "<br>"
                                        c = "<h3 style='color: #FF33CC; font-size: 80%'>Metal Production/s</h3>:<br>" + format(tmp.k.clickables[11].metalProductionPerSecond, 4) + "<br>"
                                }
                                return a + b + c
                        },
                        unlocked(){
                                return true
                        },
                        metalProductionPer(){
                                return new Decimal(1)
                        },
                        metalProductionPerSecond(){
                                return tmp.k.clickables[11].metalProductionPer.times(tmp.k.clickables[11].total)
                        },
                        mineProductionPer(){
                                return new Decimal(1)
                        },
                        total(){
                                let data = player.k.lock
                                return data.mines[11].plus(data.repeatables[11])
                        },
                        bases(){
                                return [new Decimal("1e171"), new Decimal(10)]
                        },
                        cost(){
                                let bases = tmp.k.clickables[11].bases
                                let a = bases[0]
                                let b = bases[1]
                                return a.times(Decimal.pow(b, player.k.lock.repeatables[11].pow(2)))
                        },
                        mineProductionPerSecond(){
                                return tmp.k.clickables[11].mineProductionPer.times(tmp.k.clickables[11].total)
                        },
                        canClick(){
                                if (player.tab != "k") return false
                                return player.k.points.gte(this.cost())
                        },
                        onClick(nocost = false){
                                if (!this.canClick()) return 
                                let cost = this.cost()
                                if (!nocost) player.k.points = player.k.points.minus(cost)
                                player.k.lock.repeatables[11] = player.k.lock.repeatables[11].plus(1)
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasMilestone("k", 5) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                return shiftDown ? "Your best Ideas is " + format(player.k.best) : ""
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (hasUnlockedPast("k")) return ""
                                                return "You have done " + formatWhole(player.k.times) + " Key resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "k") return ""
                                                if (hasMilestone("k", 5)) return "You are gaining " + format(tmp.k.getResetGain) + " Keys per second"
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.k.time)) + ")" 
                                        },
                                        //{"font-size": "20px"}
                                ],
                                "blank", 
                                ["upgrades", [1,5]]
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                "blank", 
                                "buyables"],
                        unlocked(){
                                return false
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Lock": {
                        content: [
                                "main-display",
                                ["clickables", [1,2]], //mines
                                "blank", 
                                /* text, */
                                ["clickables", [3,5]], //locks
                                ["clickables", [6,8]], //keys
                        ],
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(61) || hasUnlockedPast("k")
                        },
                },
                "Details": {
                        content: [
                                ["display-text", function(){
                                        let a = `tbd
                                        there are 10 mines which produce previous mines<br>
                                        Each mine also produced its own metal:<br>
                                        Iron, Silver, Gold, Bronze, Copper, <br>
                                        Tin, Titanium, Tungsten, Alumnium, Osmium<br>
                                        Each metal has its own lock + key that it makes<br>
                                        Each time you open a lock you get a boost to things idk lol<br>
                                        <br>
                                        the 3rd row of keys/locks is tbd<br> 
                                        Please dont click things ty<br>
                                        `
                                        return a
                                }],
                        ],
                        unlocked(){
                                return player.j.puzzle.upgrades.includes(61) || hasUnlockedPast("k")
                        },
                },
        },
        doReset(layer){
                let data = player.k
                if (layer == "k") data.time = 0
                if (!getsReset("k", layer)) return
                data.time = 0
                data.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        data.upgrades = filter(data.upgrades, keep)
                }
                
                if (!false) {
                        //milestones
                        let keep2 = []
                        data.milestones = filter(data.milestones, keep2)
                }


                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        break //remove when buyables added
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})


