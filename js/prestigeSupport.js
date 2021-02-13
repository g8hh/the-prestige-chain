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

function isPrestigeEffectActive(layer){
        if (layer == "o") return true
        if (layer == "n") return true
        if (layer == "m") return true
        if (layer == "l") return true
        if (layer == "k") return !inChallenge("k", 22)
        if (layer == "j") return true
        if (layer == "i") return !inChallenge("k", 21)
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
                exp = exp.times(CURRENT_BUYABLE_EFFECTS["i33"])
        }
        if (layer == "g") {
                exp = exp.times(CURRENT_BUYABLE_EFFECTS["k22"])
        }
        if (layer == "i"){
                if (hasUpgrade("l", 35)) exp = exp.times(Decimal.pow(2, player.k.lock.repeatables[82]))
                if (player.m.stoneUpgrades.includes(171)) exp = exp.times(Decimal.pow(2, tmp.m.clickables.totalPerTier(2)))
        }
        if (layer == "j"){
                if (player.m.stoneUpgrades.includes(171)) exp = exp.times(Decimal.pow(2, tmp.m.clickables.totalPerTier(2)))
        }
        return exp
}

function doPrestigeGainChange(amt, layer){
        let exp = getPrestigeGainChangeExp(layer)
        amt = amt.pow(exp)
        amt = doDilation(amt, getDilationExp(layer))
        return amt
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

function getGeneralizedPrestigeButtonText(layer){
        if (player.tab != layer) return ""
        if (player.subtabs[layer].mainTabs != "Upgrades") return ""
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



