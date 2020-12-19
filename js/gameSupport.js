/*
Goal: keep track of all the game stuffs

First goal:
Deal with all of the rewards nonesense

*/


var CURRENT_GAMES_VALUES = {
        partial: new Decimal(0),
        complete: new Decimal(0),
        rebirth: new Decimal(0),
}

var CURRENT_GAMES_EFFECTS = {
        partial: {},
        complete: {},
        rebirth: {},
}

function calcEffectiveRebirths(){
        let arg = new Decimal(layers.g.clickables.getPrimaryRebirths())
        if (arg == undefined) arg = new Decimal(0)
        if (hasUpgrade("g", 11)) arg = arg.plus(player.g.upgrades.length)
        if (hasUpgrade("e", 35)) arg = arg.plus(1)
        if (hasMilestone("h", 5)) arg = arg.plus(player.h.milestones.length / 2)
        if (hasUpgrade("g", 34)) arg = arg.plus(player.f.challenges[12])
        arg = arg.plus(CURRENT_BUYABLE_EFFECTS["f21"])
        return arg
}

function calcEffectiveCompletedDevs(){
        let arg = new Decimal(player.g.completedTally)
        if (arg == undefined) arg = new Decimal(0)
        arg = arg.plus(layers.g.clickables.getRebirthEffects()["Effective Completed Games"][0])
        if (hasMilestone("h", 6)) arg = arg.plus(player.h.milestones.length ** 2)
        if (hasUpgrade("h", 14)) arg = arg.plus(2 * player.h.upgrades.length * player.goalsii.upgrades.length)
        return arg
}

function calcEffectivePartialDevs(){
        let arg = new Decimal(player.g.partialTally)
        if (arg == undefined) arg = new Decimal(0)
        arg = arg.plus(getBuyableEffect("d", 33))
        arg = arg.plus(CURRENT_BUYABLE_EFFECTS["f13"])
        return arg
}

function reCalcPartialDevEffects(arg){
        let names = ["Features", "Games", "Medals", "Max Charges", "G Gain exponent", "Base G Gain"]
        let symbols = ["*", "*", "*", "+", "+", "*"]
        let functions = [
                function(x){
                        let ret = Decimal.pow(x.plus(1), x.sqrt())

                        if (ret.gt(1e100) && !hasUpgrade("f", 12)) ret = ret.log10().pow(50)

                        if (hasUpgrade("e", 42)) ret = ret.pow(20)
                        
                        return ret
                },
                function(x){
                        if (x.lte(4)) return new Decimal(1)
                        let exp = Decimal.max(.5, Decimal.min(1.5, x.div(30).toNumber()))
                        if (hasUpgrade("h", 24)) exp = exp.times(player.h.upgrades.length)
                        if (x.gte(129)) {
                                let j = x.div(100)
                                if (j.gt(256)) j = j.sqrt().times(16)
                                exp = exp.times(j)
                        }
                        let ret = x.div(2).pow(exp)
                        
                        if (ret.gt(1e10) && !hasUpgrade("f", 14)) ret = ret.log10().pow(10)
                        return ret
                },
                function(x){
                        if (x.lte(80)) return new Decimal(1)
                        let exp = x.sqrt().div(3)
                        let ret = x.pow(exp)
                        
                        if (ret.gt(1e10) && !hasUpgrade("f", 13)) ret = ret.log10().pow(10)
                        return ret
                },
                function(x){
                        if (x.lte(108)) return new Decimal(0)
                        let ret = x.minus(50).sqrt().times(20)
                        if (ret.gt(200))  ret = ret.div(1e2).pow(2).times(1e2)
                        if (ret.gt(15e2)) ret = ret.div(5e2).pow(2).times(5e2)
                        if (ret.gt(75e3)) ret = ret.div(5e4).pow(2).times(5e4)

                        if (hasUpgrade("e", 43)) ret = ret.pow(2)
                        if (hasUpgrade("g", 24)) ret = ret.pow(2)

                        return ret.floor()
                },
                function(x){
                        if (x.lte(110)) return new Decimal(0)
                        let ret = x.minus(102).sqrt().div(3)
                        
                        if (ret.gt(10) && !hasUpgrade("f", 32)) ret = ret.log10().times(10)
                        return ret
                },
                function(x){
                        if (x.lte(144)) return new Decimal(1)
                        let exp = x.div(100)
                        if (exp.gt(2)) exp = exp.div(2).log10().plus(2)
                        let ret = x.log10().pow(exp)
                        
                        return ret
                }
        ]
        let a = {}
        for (i in names){
                let v = functions[i](arg)
                a[names[i]] = [v, symbols[i], v.neq(functions[i](new Decimal(0)))]
        }
        return a
}

function reCalcCompleteDevEffects(arg){
        let names = ["Features", "Games", "Base G Gain"]
        let symbols = ["*", "*", "*"]
        let functions = [
                function(x){
                        let exp = x.sqrt().times(4)
                        if (hasUpgrade("g", 41)) exp = exp.times(500)
                        return Decimal.pow(x.plus(4), exp)
                },
                function(x){
                        if (x.lte(6)) return new Decimal(1)
                        let exp = x.sqrt()
                        if (x.gte(10)) exp = exp.times(2)
                        if (x.gte(96)) exp = exp.times(1.25)
                        if (hasUpgrade("g", 42)) exp = exp.times(50)
                        let ret = x.div(6).pow(exp)
                        return ret
                },
                function(x){
                        if (!hasUpgrade("e", 32)) return new Decimal(1)
                        if (x.lt(100)) return new Decimal(1)
                        let base = x.div(100)
                        let exp = x.pow(.2).div(4)
                        let ret = Decimal.pow(base, exp)
                        return ret
                },
        ]
        let a = {}
        for (i in names){
                let v = functions[i](arg)
                a[names[i]] = [v, symbols[i], v.neq(functions[i](new Decimal(0)))]
        }
        return a
}

function reCalcRebirthEffects(arg){
        let names = ["Games", "Manual Bulk", "Base G Gain", "F gain exponent", "Base F gain", "Medals", "Effective Completed Games"]
        let symbols = ["*", "*", "*", "+", "*", "*", "+"]
        let functions = [
                function(x){
                        if (x.lte(2)) return new Decimal(1)

                        let exp = x.times(3).sqrt()
                        if (hasUpgrade("f", 53)) exp = exp.times(50)

                        let base = new Decimal(100)
                        if (x.gte(5)) base = base.times(x)
                        if (x.gte(7)) base = base.times(x.pow(.6))

                        let ret = Decimal.pow(base, exp)
                        return ret
                },
                function(x){
                        if (x.lte(8)) return new Decimal(1)
                        let base = x.sqrt()
                        let exp = x.sqrt()
                        return Decimal.pow(base, exp)
                },
                function(x){
                        if (!hasUpgrade("f", 21)) return new Decimal(1)
                        if (x.eq(0)) return new Decimal(1)
                        let ret = x
                        if (hasUpgrade("f", 23)) ret = ret.pow(1.5)
                        if (hasUpgrade("f", 55)) ret = ret.pow(1.5)
                        return ret
                },
                function(x){
                        if (!hasUpgrade("f", 22)) return new Decimal(0)
                        if (x.eq(0)) return new Decimal(0)
                        let ret = x.pow(.75).times(5)
                        return ret
                },
                function(x){
                        if (!hasUpgrade("f", 23)) return new Decimal(1)
                        if (x.eq(0)) return new Decimal(1)
                        let ret = x.pow(x)
                        return ret
                },
                function(x){
                        if (!hasUpgrade("f", 24)) return new Decimal(1)
                        if (x.eq(0)) return new Decimal(1)
                        let ret = x.pow(x.pow(1.1))
                        return ret
                },
                function(x){
                        if (!hasUpgrade("f", 25)) return new Decimal(0)
                        if (x.eq(0)) return new Decimal(0)
                        let ret = x.pow(1.5)
                        return ret
                },
        ]
        let a = {}
        for (i in names){
                let v = functions[i](arg)
                a[names[i]] = [v, symbols[i], v.neq(functions[i](new Decimal(0)))]
        }
        return a
}

function updateGamesRewards(){
        CURRENT_GAMES_VALUES["rebirth"]  = calcEffectiveRebirths()
        CURRENT_GAMES_EFFECTS["rebirth"]  = reCalcRebirthEffects(CURRENT_GAMES_VALUES["rebirth"])

        CURRENT_GAMES_VALUES["complete"] = calcEffectiveCompletedDevs()
        CURRENT_GAMES_EFFECTS["complete"] = reCalcCompleteDevEffects(CURRENT_GAMES_VALUES["complete"])

        CURRENT_GAMES_VALUES["partial"]  = calcEffectivePartialDevs()
        CURRENT_GAMES_EFFECTS["partial"]  = reCalcPartialDevEffects(CURRENT_GAMES_VALUES["partial"])
}


