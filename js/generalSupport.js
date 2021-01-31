function convertToB16(n){
        let codes = {
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9",
                10: "A",
                11: "B",
                12: "C",
                13: "D",
                14: "E",
                15: "F",
        }
        let x = n % 16
        return codes[(n-x)/16] + codes[x]
}

function getUndulatingColor(delta = 0){
        let t = new Date().getTime()
        if (!player.undulating) t = 0
        let a = Math.sin(t / 1e4 + 0 + delta) 
        let b = Math.sin(t / 1e4 + 2 + delta)
        let c = Math.sin(t / 1e4 + 4 + delta)
        a = convertToB16(Math.floor(a*128) + 128)
        b = convertToB16(Math.floor(b*128) + 128)
        c = convertToB16(Math.floor(c*128) + 128)
        return String(a) + String(b) + String(c)
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function filterout(list, remove){
        return list.filter(x => !remove.includes(x))
}

function getNextLayer(l){
        x = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"]
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

function replaceString(s,find,replace){
        let d = 1 + s.length - find.length
        for (i = 0; i < d; i++){
                if (s.slice(i, i + find.length) == find) return s.slice(0, i) + replace + s.slice(i + find.length, s.length)
        }
        return s 
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

function getPrestigeName(layer){
        return layers[layer].name
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

function getTimesRequiredDecimal(chance, r1){
        chance = new Decimal(chance)
        if (chance.gte(1)) return new Decimal(1)
        if (chance.lte(0)) return new Decimal(Infinity)
        if (r1 == undefined) r1 = Math.random()
        //we want (1-chance)^n < r1
        let n
        if (chance.log10().gt(-5)){
                n = Decimal.ln(r1).div(Math.log(1-chance))
        } else {
                n = Decimal.ln(1/r1).div(chance)
        }
        //log(1-chance) of r2
        return n.floor().plus(1)
}

function changeDist(r1, t){
        // x -> 1/2 + (x-1/2)^(2t-1) * 2 ^ (2t-2)
        if (t > 500) return .5
        if (t < 50) return r1
        return (1 + ((r1-1/2)**(t-40)) * (2**(t-40))) / 2
}

function roundRandom(r){
        let a = r % 1
        if (a < Math.random()) return Math.floor(r)
        return Math.ceil(r)
}

function getNumFinished(chance, pleft, attempts, ptotal){
        /*
        The chance with 1 left is chance
        pleft is the number of pieces left, 
        return [the number of pieces unfinished, moves left]
        */
        chance = new Decimal(chance)
        if (attempts.eq(0)) return [pleft, attempts]
        if (chance.gte(1)) {
                if (attempts.gt(pleft)) return [0, attempts.sub(pleft)]
                return [pleft-attempts.toNumber(), new Decimal(0)]
        }
        if (chance.lte(0)) return [pleft, new Decimal(0)]
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
                attempts = attempts.toNumber()
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
                        return [0, new Decimal(attempts - unitsUsed)]
                }
                let l = pleft
                RET = -1/2 + Math.sqrt(1/4 - 2 * STEPS + l * l + l)
                RET = roundRandom(RET)
                
                return [RET, new Decimal(0)]

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
                        return [0, attempts.sub(attemptUsedFinal)]
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
                        return [RET, new Decimal(0)]
                        
                }
        }
}

function getGeneralizedEffectDisplay(layer){
        if (player.tab != layer) return ""
        let eff = tmp[layer].effect
        let a = "which buffs point and all previous prestige gain by "

        return a + format(eff) + "."
}








