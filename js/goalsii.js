/*
Todo:
1) Make challenge effects do things
- 1
- 2
- 3
- 4
2) Balance the first run back through

*/


var GOALS_REWARD_FUNCTIONS = {
        "00"(x){
                if (x.eq(0)) return new Decimal(0)
                let ret = x.plus(3).times(x).plus(36).times(.01)
                if (ret.gt(.5)) ret = ret.times(2).log10().plus(.5)
                if (ret.gt(.6)) ret = ret.plus(.4).log10().plus(.6)
                if (ret.gt(.7)) ret = ret.plus(.3).log10().plus(.7)
                return ret
        },
        "01"(x){
                let ret = x.div(10)
                if (ret.gt(1)) ret = ret.log10().plus(1)
                return ret.div(1000)
        },
        "02"(x){
                let ret = x.div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret
        },
        "03"(x){
                let ret = x.div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.div(100)
        },
        "04"(x){
                let ret = x.div(100)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.times(100)
        },
        "10"(x){
                let ret = x.div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.times(10).floor()
        },
        "11"(x){
                let ret = x.div(5)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.times(10).floor()
        },
        "12"(x){
                let ret = x.div(5)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.times(9).floor()
        },
        "13"(x){
                let ret = x.pow(2).div(10).plus(1)
                if (ret.gt(5)) ret = ret.times(2).log10().minus(1/3).times(15/2)
                return ret
        },
        "14"(x){
                let ret = x.plus(3).times(x).div(400)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret.times(100).floor()
        },
        "20"(x){
                let ret = x.sqrt().div(4)
                return ret
        },
        "21"(x){
                let ret = x.div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.times(10).plus(1)
        },
        "22"(x){
                let ret = x.div(5)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.times(14).floor()
        },
        "23"(x){
                let ret = x.pow(2).div(1000)
                if (ret.gt(1)) ret = ret.log10().plus(1)
                return ret.times(10)
        },
        "24"(x){
                let ret = x.cbrt()
                if (ret.gte(3)) ret = ret.times(2)
                if (ret.gt(20)) ret = ret.div(2).log10().times(10).plus(10)
                if (ret.gt(30)) ret = ret.div(3).log10().times(10).plus(20)
                return ret.div(10)
        },
        "30"(x){
                let ret = x.div(5)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                if (ret.gt(2)) ret = ret.div(2).log10().plus(2)
                return ret.div(2)
        },
        "31"(x){
                let ret = x.cbrt().div(10).plus(1)
                return ret
        },
        "32"(x){
                let ret = x.div(100)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret
        },
        "33"(x){
                let ret = x.sqrt().div(20)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret.times(100)
        },
        "34"(x){
                return Decimal.pow(1e50, x.sqrt())
        },
        "40"(x){
                let ret = x.sqrt().div(20)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret.times(100).floor()
        },
        "41"(x){
                let ret = x.sqrt().div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret.times(5).plus(1)
        },
        "42"(x){
                let ret = x.sqrt().div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret
        },
        "43"(x){
                let ret = x.sqrt().div(10)
                if (ret.gt(1)) ret = ret.div(1).log10().plus(1)
                return ret.times(30).floor()
        },
        "44"(x){
                let ret = x.sqrt().div(50)
                if (ret.gt(10)) ret = ret.log10().times(10)
                return ret.times(10).ceil()
        },
}

var CURRENT_GOALS_EFFECTS = {}

function getMaximumTokens(c){
        if (c == "44") return new Decimal(1/0)
        if (c.includes("4")) return new Decimal(1e4)
        if (c.includes("3")) return new Decimal(1e5)
        if (c.includes("2")) return new Decimal(3e5)
        if (c.includes("1")) return new Decimal(1e6)
        return new Decimal(1e7)
}

function updateCurrentGoalEffects(){
        for (i in GOALS_REWARD_FUNCTIONS){
                let a = new Decimal(0)
                if (typeof player != "undefined") a = player.goalsii.tokens.points[i]
                a = a.min(getMaximumTokens(i))
                CURRENT_GOALS_EFFECTS[i] = GOALS_REWARD_FUNCTIONS[i](a)
        }
}

updateCurrentGoalEffects()


function getGoalChallengeReward(challnum){
        return CURRENT_GOALS_EFFECTS[challnum]
}

var CURRENT_DEPTH_VALUES = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
}

function updateCurrentDepthValues(){
        if (typeof player == "undefined") return
        for (let i = 4; i >= 0; i--){
                CURRENT_DEPTH_VALUES[i] = updateChallengeDepth(i)
        }
}

updateCurrentDepthValues()

function getChallengeDepth(chall){
        return CURRENT_DEPTH_VALUES[chall] || 0
}

function updateChallengeDepth(chall){
        chall = Number(chall)
        if (chall > 4) return 0
        if (hasUpgrade("f", 43)) return 0
        let c = player.goalsii.currentChallenge
        let a = 0
        if (c.slice(0, 1) == chall) a += 2
        if (c.slice(1, 2) == chall) a += 1
        let factor = Math.ceil(Math.pow(2, chall-1))
        if (factor == 4) factor = 3
        a = a + getChallengeDepth(chall + 1) * factor
        return a
}




