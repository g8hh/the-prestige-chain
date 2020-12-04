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
                return new Decimal(0)
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
                return new Decimal(0)
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
                return new Decimal(0)
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
                return new Decimal(0)
        },
        "33"(x){
                return new Decimal(0)
        },
        "34"(x){
                return new Decimal(0)
        },
        "40"(x){
                return new Decimal(0)
        },
        "41"(x){
                return new Decimal(0)
        },
        "42"(x){
                return new Decimal(0)
        },
        "43"(x){
                return new Decimal(0)
        },
        "44"(x){
                return new Decimal(0)
        },
}

var CURRENT_GOALS_EFFECTS = {}

function updateCurrentGoalEffects(){
        for (i in GOALS_REWARD_FUNCTIONS){
                let a = new Decimal(0)
                if (typeof player != "undefined") a = player.goalsii.tokens.points[i]
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
        let c = player.goalsii.currentChallenge
        let a = 0
        if (c.slice(0, 1) == chall) a += 2
        if (c.slice(1, 2) == chall) a += 1
        a = a + getChallengeDepth(chall + 1)
        if (chall >= 2) a = a + getChallengeDepth(chall + 1)
        return a
}




/*
Goals II: <br>
Unlocked by: Doing an <b>F</b> reset<br>
Each challenge has a reward, and upon claiming said reward,<br>
all prior unlocked main layers are totally reset, and goals are also reset<br>
<br>
5 challenges, one of them is nothing<br>
<br>
Chall AB means you are in A twice and B once<br>
<br>
Challenge table: (will be clickables to enter/exit and to disp reward)<br>
00, 01, 02, 03, 04<br>
10, 11, 12, 13, 14<br>
20, 21, 22, 23, 24<br>
30, 31, 32, 33, 34<br>
40, 41, 42, 43, 44<br>
<br>
Each completion gives tokens<br>
Only applies to layers unlocked before Goals II<br>
C0: Nothing<br>
C1: Raise all prestige gains ^.99 + C0<br>
C2: Raise point gain ^.9 (makes challenges harder) + C1<br>
C3: First column buyables do not give effects + C2<br>
C4: No buyables automatically give free levels to other buyables + C3<br>
<br>
<br>
Completion of a challenge gives a token to that "upgrade" which gives an effect<br>
You get one token per reset, though multipliers will exist<br>
Rewards: 00 tokens add to all prestige gain exponents .05*(x*Math.min(x + 1,100))<br>
<br>
<br>
<br>
1, 2, 3, 5, 7, 11, ... what comes next?
<br>
<br>
<br>
*/