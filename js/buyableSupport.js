/*
key = [buyable layer][buyable id] i.e. a11 or b23
data = [another key]: function
*/

/*
Check code
for (i in [0,0,0 ,0,0,0, 0,0,0]) {
    id = [11,12,13,21,22,23,31,32,33][i]
    console.log(calcBuyableExtra("a", id).mag)
    console.log(tmp.a.buyables[id].extra.mag)
}
replace "a" with another layer of choice
*/


/*


FUNCITONS LEFT TO DEAL WITH:
display
getAmountDisplay
getBases
canAfford
buyMax
buy
unlocked
*/
var FREE_BUYABLE_DATA = {
        a11: {
                name: "All",
                func: "exp",
                base: {
                        initial: new Decimal(1.5),
                        1: {
                                active: function(){
                                        return hasUpgrade("a", 34)
                                },
                                amount: function(){
                                        return tmp.a.buyables[13].total.div(100)
                                },
                                type: "add",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("d", 11)
                                },
                                amount: function(){
                                        return tmp.a.buyables[32].total
                                },
                                type: "add",
                        },
                },
                a12: {
                        active: function(){
                                return hasUpgrade("a", 24)
                        }
                },
                a13: {
                        active: function(){
                                return hasUpgrade("a", 34)
                        }
                },
        },
        a12: {
                name: "Any",
                func: "exp",
                base: {
                        initial: new Decimal(1.1),
                        1: {
                                active: function(){
                                        return hasUpgrade("b", 12)
                                },
                                amount: function(){
                                        return Decimal.div(player.b.upgrades.length, 10)
                                },
                                type: "add",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("a", 43)
                                },
                                amount: function(){
                                        return tmp.a.buyables[22].total.div(20)
                                },
                                type: "add",
                        },
                        3: {
                                active: function(){
                                        return hasUpgrade("a", 51)
                                },
                                amount: function(){
                                        return tmp.a.buyables[21].total.div(100)
                                },
                                type: "add",
                        },
                },
                a13: {
                        active: function(){
                                return hasUpgrade("b", 15)
                        }
                },
                a21: {
                        active: function(){
                                return hasUpgrade("b", 23)
                        }
                },
        },
        a13: {
                name: "After",
                func(a,x){
                        let ret = Decimal.pow(x, 2).times(.3).plus(1)
                        return ret
                },
                identity: new Decimal(1),
                base: {
                        initial: new Decimal(1),
                },
                a21: {
                        active: function(){
                                return hasUpgrade("b", 25)
                        }
                },
                a22: {
                        active: function(){
                                return hasUpgrade("a", 52)
                        }
                },
                a23: {
                        active: function(){
                                return hasUpgrade("c", 33)
                        }
                },
        },
        a21: {
                name: "Access",
                func: "lin",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.a.buyables[32].effect
                                },
                                type: "add",
                        },
                },
                a22: {
                        active: function(){
                                return hasUpgrade("a", 42)
                        }
                },
                a23: {
                        active: function(){
                                return hasUpgrade("c", 13)
                        }
                },
                a32: {
                        active: function(){
                                return hasUpgrade("b", 44)
                        }
                },
        },
        a22: {
                name: "Account",
                func: "exp",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return hasUpgrade("a", 45)
                                },
                                amount: function(){
                                        return tmp.a.buyables[22].total.div(100)
                                },
                                type: "add",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("21")
                                },
                                type: "mult",
                        },
                },
                a23: {
                        active: function(){
                                return hasUpgrade("a", 54)
                        }
                },
                a31: {
                        active: function(){
                                return hasUpgrade("b", 33)
                        }
                },
                a32: {
                        active: function(){
                                return hasUpgrade("c", 32)
                        }
                },
        },
        a23: {
                name: "Advanced",
                func: "exp",
                base: {
                        initial: new Decimal(1e5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.b.buyables[31].effect
                                },
                                type: "mult",
                        },
                },
                a31: {
                        active: function(){
                                return hasUpgrade("b", 42)
                        }
                },
                a32: {
                        active: function(){
                                return hasUpgrade("c", 23)
                        }
                },
        },
        a31: {
                name: "Against",
                func: "exp",
                base: {
                        initial: new Decimal(1e5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.b.buyables[22].effect
                                },
                                type: "mult",
                        },
                },
                a32: {
                        active: function(){
                                return hasUpgrade("d", 14)
                        }
                },
                b13: {
                        active: function(){
                                return hasUpgrade("d", 24)
                        }
                },
        },
        a32: {
                name: "Above",
                func: "lin",
                base: {
                        initial: new Decimal(.01),
                },
        },
        a33: {
                name: "Omnipotent I",
                func: "lin",
                base: {
                        initial: new Decimal(.5),
                        1: {
                                active: function(){
                                        return hasUpgrade("b", 53)
                                },
                                amount: function(){
                                        return totalChallengeComps("b") / 10
                                },
                                type: "add",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("c", 35)
                                },
                                amount: function(){
                                        return tmp.a.buyables[23].total.div(1e4)
                                },
                                type: "add",
                        },
                        3: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("01")
                                },
                                type: "add",
                        },
                },
                b31: {
                        active: function(){
                                return hasUpgrade("c", 44)
                        }
                },
                c11: {
                        active: function(){
                                return hasUpgrade("d", 23)
                        }
                },
        },
        b11: {
                name: "Because",
                func: "exp",
                base: {
                        initial: new Decimal(1e20),
                        1: {
                                active: function(){
                                        return hasUpgrade("c", 21)
                                },
                                amount: function(){
                                        return tmp.a.buyables[12].total.max(1).pow(2)
                                },
                                type: "mult",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.b.buyables[23].effect
                                },
                                type: "add",
                        },
                },
                b12: {
                        active: function(){
                                return hasUpgrade("b", 34)
                        }
                },
                b13: {
                        active: function(){
                                return hasUpgrade("b", 54)
                        }
                },
        },
        b12: {
                name: "Based",
                func(a,x){
                        return a.plus(x).pow(x)
                },
                identity: new Decimal(1),
                base: {
                        initial: new Decimal(10),
                        1: {
                                active: function(){
                                        return hasUpgrade("b", 41)
                                },
                                amount: function(){
                                        return tmp.a.buyables[11].total.div(1000)
                                },
                                type: "add",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("d", 32)
                                },
                                amount: function(){
                                        return tmp.a.buyables[33].total.pow(2)
                                },
                                type: "add",
                        },
                        3: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.d.buyables[21].effect
                                },
                                type: "mult",
                        },
                },
                b13: {
                        active: function(){
                                return hasUpgrade("b", 54)
                        }
                },
                b21: {
                        active: function(){
                                return hasUpgrade("c", 34)
                        }
                },
        },
        b13: {
                name: "Become",
                func: "exp",
                base: {
                        initial: new Decimal(5),
                        1: {
                                active: function(){
                                        return hasUpgrade("b", 41)
                                },
                                amount: function(){
                                        return tmp.b.buyables[13].total.div(100)
                                },
                                type: "add",
                        },
                },
                b21: {
                        active: function(){
                                return hasUpgrade("c", 34)
                        }
                },
                b22: {
                        active: function(){
                                return hasUpgrade("c", 42)
                        }
                },
        },
        b21: {
                name: "Baby",
                func: "exp",
                base: {
                        initial: new Decimal(1.11e111),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.b.buyables[33].effect
                                },
                                type: "times",
                        },
                },
                b22: {
                        active: function(){
                                return hasUpgrade("b", 55)
                        }
                },
                b23: {
                        active: function(){
                                return hasUpgrade("b", 55)
                        }
                },
                b31: {
                        active: function(){
                                return hasUpgrade("c", 43)
                        }
                },
        },
        b22: {
                name: "Bank",
                func: "exp_sqrt",
                base: {
                        initial: new Decimal(1e5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.c.challenges[11].rewardEffect
                                },
                                type: "times",
                        },
                },
                b23: {
                        active: function(){
                                return hasUpgrade("d", 15)
                        }
                },
                b31: {
                        active: function(){
                                return hasUpgrade("c", 41)
                        }
                },
                b32: {
                        active: function(){
                                return hasUpgrade("d", 31)
                        }
                },
        },
        b23: {
                name: "Beauty",
                func: "exp",
                base: {
                        initial: new Decimal(1e10),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.c.buyables[11].effect
                                },
                                type: "times",
                        },
                },
                b31: {
                        active: function(){
                                return hasUpgrade("c", 41)
                        }
                },
                b32: {
                        active: function(){
                                return hasUpgrade("c", 45)
                        }
                },
                d11: {
                        active: function(){
                                return hasUpgrade("d", 42)
                        },
                },
        },
        b31: {
                name: "Basic",
                func: "exp",
                base: {
                        initial: new Decimal(1e50),
                },
                b32: {
                        active: function(){
                                return hasUpgrade("c", 45)
                        }
                },
                d11: {
                        active: function(){
                                return hasUpgrade("d", 42)
                        },
                },
        },
        b32: {
                name: "Brand",
                func: "lin",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.c.buyables[13].effect
                                },
                                type: "plus",
                        },
                },
                c21:{
                        active: function(){
                                return hasUpgrade("d", 34)
                        },
                },
                d11:{
                        active: function(){
                                return hasUpgrade("d", 41)
                        },
                },
        },
        b33: {
                name: "Omnipotent II",
                func: "exp",
                base: {
                        initial: new Decimal(1e40),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.d.buyables[22].effect
                                },
                                type: "times",
                        },
                },
                c22: {
                        active: function(){
                                return hasUpgrade("c", 54)
                        }
                },
                c23: {
                        active: function(){
                                return hasUpgrade("c", 55)
                        }
                },
        },
        c11: {
                name: "Case",
                func: "exp",
                base: {
                        initial: new Decimal(100),
                },
                c12: {
                        active: function(){
                                return hasUpgrade("d", 25)
                        }
                },
                c13: {
                        active: function(){
                                return hasUpgrade("c", 52)
                        }
                },
                c21: {
                        active: function(){
                                return hasUpgrade("c", 53)
                        }
                },
        },
        c12: {
                name: "Call",
                func: "exp_sqrt",
                base: {
                        initial: new Decimal("1e1624"),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.c.buyables[31].effect
                                },
                                type: "times",
                        },
                },
                c13: {
                        active: function(){
                                return hasUpgrade("c", 52)
                        }
                },
                c21: {
                        active: function(){
                                return hasUpgrade("c", 53)
                        }
                },
                c22: {
                        active: function(){
                                return hasUpgrade("e", 12)
                        }
                },
        },
        c13: {
                name: "Country",
                func: "lin",
                base: {
                        initial: new Decimal(.02),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("01")
                                },
                                type: "plus",
                        },
                },
                c21: {
                        active: function(){
                                return hasUpgrade("d", 33)
                        },
                },
                c22: {
                        active: function(){
                                return hasUpgrade("e", 12)
                        },
                },
        },
        c21: {
                name: "Compare",
                func: "exp",
                base: {
                        initial: new Decimal(2),
                },
                c22: {
                        active: function(){
                                return hasUpgrade("c", 54)
                        },
                },
                c23: {
                        active: function(){
                                return hasUpgrade("c", 55)
                        }
                },
        },
        c22: {
                name: "Card",
                func: "exp",
                base: {
                        initial: new Decimal(5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.d.buyables[12].effect
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("04")
                                },
                                type: "plus",
                        },
                },
                c23: {
                        active: function(){
                                return hasUpgrade("d", 35)
                        },
                },
                c31: {
                        active: function(){
                                return hasUpgrade("d", 43)
                        },
                },
        },
        c23: {
                name: "Canada",
                func: "exp",
                base: {
                        initial: Decimal.pow(10, 1572e3),
                },
                c31: {
                        active: function(){
                                return hasUpgrade("d", 43)
                        },
                },
                c32: {
                        active: function(){
                                return hasMilestone("goalsii", 10)
                        },
                },
        },
        c31: {
                name: "Conditions",
                func: "exp",
                base: {
                        initial: new Decimal(1e50),
                },
                c32: {
                        active: function(){
                                return hasMilestone("goalsii", 10)
                        },
                },
        },
        c32: {
                name: "Catagory",
                func: "exp",
                base: {
                        initial: new Decimal(100),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getBuyableEffect("e", 21)
                                },
                                type: "times",
                        },
                },
        },
        c33: {
                name: "Omnipotent III",
                func: "exp_sqrt",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active: function(){
                                        return hasMilestone("goalsii", 16)
                                },
                                amount: function(){
                                        return player.goalsii.milestones.length/10
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("42")
                                },
                                type: "plus",
                        },
                },
        },
        d11: {
                name: "Department",
                func: "exp",
                base: {
                        initial: new Decimal(5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.d.buyables[13].effect
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("11")
                                },
                                type: "plus",
                        },
                        3: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("41")
                                },
                                type: "times",
                        },
                },
                d13: {
                        active: function(){
                                return hasUpgrade("e", 14)
                        },
                },
                d12: {
                        active: function(){
                                return hasUpgrade("e", 21)
                        },
                },
                d21: {
                        active: function(){
                                return hasMilestone("goalsii", 19) 
                        },
                },
        },
        d12: {
                name: "December",
                func: "lin",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("03")
                                },
                                type: "plus",
                        },
                },
                d13: {
                        active: function(){
                                return hasUpgrade("d", 44)
                        },
                },
                d21: {
                        active: function(){
                                return hasUpgrade("e", 15)
                        },
                },
                d22: {
                        active: function(){
                                return hasUpgrade("e", 23)
                        },
                },
        },
        d13: {
                name: "Delivery",
                func: "lin",
                base: {
                        initial: new Decimal(.1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("03")
                                },
                                type: "plus",
                        },
                },
                d21: {
                        active: function(){
                                return hasUpgrade("e", 15)
                        },
                },
                d22: {
                        active: function(){
                                return hasUpgrade("d", 45)
                        },
                },
        },
        d21: {
                name: "Drive",
                func: "exp",
                base: {
                        initial: new Decimal(5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getBuyableEffect("d", 31)
                                },
                                type: "plus",
                        },
                },
                d22: {
                        active: function(){
                                return hasUpgrade("e", 24)
                        },
                },
                d23: {
                        active: function(){
                                return hasMilestone("goalsii", 22) 
                        },
                },
        },
        d22: {
                name: "Director",
                func: "exp",
                base: {
                        initial: new Decimal(10),
                        1: {
                                active: function(){
                                        return hasUpgrade("e", 25)
                                },
                                amount: function(){
                                        return 1
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.d.buyables[22].total.times(getGoalChallengeReward("32"))
                                },
                                type: "plus",
                        },
                },
                e11: {
                        active: function(){
                                return hasMilestone("goalsii", 20) 
                        },
                },
                d23: {
                        active: function(){
                                return hasMilestone("goalsii", 22) 
                        },
                },
        },
        d23: {
                name: "Due",
                func: "exp",
                base: {
                        initial: new Decimal(5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getBuyableEffect("e", 13)
                                },
                                type: "times",
                        },
                },
                e12: {
                        active: function(){
                                return hasMilestone("goalsii", 23) 
                        },
                },
        },
        d31: {
                name: "Database",
                func: "lin",
                base: {
                        initial: new Decimal(.25),
                },
        },
        e11: {
                name: "Experience",
                func: "exp",
                base: {
                        initial: new Decimal(10),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return getGoalChallengeReward("04")
                                },
                                type: "plus",
                        },
                },
                e12: {
                        active: function(){
                                return hasMilestone("goalsii", 23) 
                        },
                },
                e13: {
                        active: function(){
                                return hasUpgrade("goalsii", 12)
                        },
                },
        },
        e12: {
                name: "East",
                func: "lin",
                base: {
                        initial: new Decimal(.2),
                        1: {
                                active: function(){
                                        return hasMilestone("goalsii", 24)
                                },
                                amount: function(){
                                        return .002 * player.ach.achievements.length
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("goalsii", 11)
                                },
                                amount: function(){
                                        return .01 * player.goalsii.upgrades.length
                                },
                                type: "plus",
                        },
                },
                e13: {
                        active: function(){
                                return hasUpgrade("goalsii", 11)
                        },
                },
        },
        e13: {
                name: "Example",
                func: "exp",
                base: {
                        initial: new Decimal(1.1),
                        1: {
                                active: function(){
                                        return hasUpgrade("goalsii", 13)
                                },
                                amount: function(){
                                        return .02 * player.goalsii.upgrades.length
                                },
                                type: "plus",
                        },
                },
                e21: {
                        active: function(){
                                return hasUpgrade("goalsii", 23)
                        },
                },
        },
        e21: {
                name: "Easy",
                func: "exp",
                base: {
                        initial: new Decimal(1e50),
                },
        },
        e22: {
                name: "Event",
                func: "exp_cbrt",
                base: {
                        initial: new Decimal(1e5),
                },
        },
}

var EXTRA_FREE_BUYABLE_DATA = {
        a12: {
                1: {
                        active: function(){
                                return hasUpgrade("b", 24)
                        },
                        amount: function(){
                                return player.a.upgrades.length
                        },
                        name: "A Upgrades",
                },
        },
        a21: {
                1: {
                        active: function(){
                                return hasUpgrade("a", 41)
                        },
                        amount: function(){
                                return 1
                        },
                },
        },
        a22: {
                1: {
                        active: function(){
                                return hasUpgrade("b", 31)
                        },
                        amount: function(){
                                return 1
                        },
                },
        },
        a31: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return tmp.b.challenges[12].rewardEffect
                        },
                },
        },
        a32: {
                1: {
                        active: function(){
                                return hasUpgrade("d", 13)
                        },
                        amount: function(){
                                return player.d.upgrades.length
                        },
                        name: "D upgrades"
                },
        },
        a33: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return tmp.b.challenges[21].rewardEffect
                        },
                },
                2: {
                        active: function(){
                                return hasUpgrade("c", 31)
                        },
                        amount: function(){
                                let ret = new Decimal(1)
                                if (hasUpgrade("c", 32)) ret = ret.plus(1)
                                if (hasUpgrade("c", 33)) ret = ret.plus(1)
                                if (hasUpgrade("c", 34)) ret = ret.plus(1)
                                if (hasUpgrade("c", 35)) ret = ret.plus(1)
                                return ret
                        },
                },
        },
        b12: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return tmp.b.challenges[11].rewardEffect
                        },
                },
                2: {
                        active: function(){
                                return hasUpgrade("c", 15)
                        },
                        amount: function(){
                                return player.b.upgrades.length
                        },
                        name: "B Upgrades"
                },
        },
        b33: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("11")
                        },
                },
        },
        c23: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return tmp.c.challenges[12].rewardEffect
                        },
                },
        },
        c32: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("12")
                        },
                },
        },
        c33: {
                1: {
                        active: function(){
                                return hasMilestone("goalsii", 16)
                        },
                        amount: function(){
                                return player.goalsii.milestones.length * 2
                        },
                },
        },
        d21: {
                1: {
                        active: function(){
                                return hasUpgrade("e", 21)
                        },
                        amount: function(){
                                return 1
                        },
                },
                2: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("22")
                        },
                },
        },
        d22: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("10")
                        }
                },
        },
        d31: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("40")
                        },
                },
        },
        e11: {
                1: {
                        active: function(){
                                return hasMilestone("goalsii", 21) 
                        },
                        amount: function(){
                                return 1
                        },
                },
                2: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("14")
                        }
                }
        },
        e12: {
                1: {
                        active: function(){
                                return hasMilestone("goalsii", 23)
                        },
                        amount: function(){
                                return player.goalsii.milestones.length
                        },
                },
        },
        e13: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("40")
                        },
                },
        },
        e21: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("43")
                        },
                },
        },
}

var CURRENT_BUYABLE_EXTRAS = {}

function resetCurrBuyableExtras(){
        for (i in FREE_BUYABLE_DATA){
                CURRENT_BUYABLE_EXTRAS[i] = new Decimal(0)
        }
}
resetCurrBuyableExtras()

function isBuyableDefined(layer, id){
        if (layers[layer] == undefined) return false
        if (layers[layer].buyables == undefined) return false
        return layers[layer].buyables[id] != undefined
}

function getBuyableTotal(layer, id){
        if (!isBuyableDefined(layer, id)) return new Decimal(0)

        let a = calcBuyableExtra(layer, id)

        return getBuyableAmount(layer, id).plus(a)
}

function getCodedBuyableAmount(code){
        return getBuyableTotal(code.slice(0,1), code.slice(1,3)) 
}

function isValidBuyableCode(code){
        if (code.length != 3) return false
        let letter = code.slice(0,1)
        let num = Number(code.slice(1,3))
        return isBuyableDefined(letter, num)
}

function getBuyableName(code){
        if (FREE_BUYABLE_DATA[code] != undefined && FREE_BUYABLE_DATA[code].name != undefined) return FREE_BUYABLE_DATA[code].name
        console.log("do this " + code)
        return layers[code.slice(0,1)].buyables[code.slice(1,3)].title
}

function calcBuyableExtra(layer, id){
        if (!isBuyableDefined(layer, id)) return new Decimal(0)
        let a = new Decimal(0)
        if (CURRENT_BUYABLE_EXTRAS[layer+id] != undefined) a = CURRENT_BUYABLE_EXTRAS[layer+id]

        let depth = getChallengeDepth(4)
        if (depth > 0 && layer == "a") return new Decimal(0)
        if (depth > 1 && layer == "b") return new Decimal(0)
        if (depth > 2 && layer == "c") return new Decimal(0)
        
        return a 
}

function reCalcBuyableExtra(layer, id){
        let key = layer + id
        let data = FREE_BUYABLE_DATA[key] || {}
        if (data == undefined) return new Decimal(0)
        let amt = new Decimal(0)
        for (i in data) {
                if (!isValidBuyableCode(i)) continue
                if (data[i].active() == true) amt = amt.plus(getCodedBuyableAmount(i))
        }
        let data2 = getAlwaysActiveAdditionalBuyables(layer, id)
        for (j in data2) {
                let i = data2[j]
                amt = amt.plus(getCodedBuyableAmount(i))
        }
        let data3 = EXTRA_FREE_BUYABLE_DATA[key] || {}
        for (i in data3) {
                if (data3[i].active() == true) amt = amt.plus(data3[i].amount())
        }
        return amt
}

function updateAllBuyableExtras(){
        resetCurrBuyableExtras()
        let order = []
        for (i in FREE_BUYABLE_DATA){
                order.push(i)
        }
        order.reverse()
        for (j in order){
                i = order[j]
                CURRENT_BUYABLE_EXTRAS[i] = reCalcBuyableExtra(i.slice(0,1), i.slice(1,3))
        }
}

function getAlwaysActiveAdditionalBuyables(layer, id){
        let l = []
        let yet1 = false
        for (j in LAYERS){
                i = LAYERS[j]
                if (layers[i].row == "side") continue
                if (yet1 && isBuyableDefined(i, id)) l.push(i+id)
                if (i == layer) yet1 = true
        }
        if (id == 33) return l
        if (isBuyableDefined(layer, 33)) l.push(layer+33)
        return l
}

function getBuyableExtraText(layer, id){
        let a = "<b><h2>Extra levels from</h2>:<br>"
        let extra = false
        let key = layer + id
        let data = FREE_BUYABLE_DATA[key] || {}
        for (i in data) {
                if (!isValidBuyableCode(i)) continue
                if (data[i].active() == true) {
                        extra = true
                        a += "<h3>" + getBuyableName(i) + "</h3>, "
                }
        }
        let data3 = EXTRA_FREE_BUYABLE_DATA[key] || {}
        for (i in data3) {
                if (!data3[i].name) continue
                if (data3[i].active() == true) {
                        extra = true
                        a += "<h3>" + data3[i].name + "</h3>, "
                }
        }
        if (!extra) return ""
        return a.slice(0, a.length-2)
}

var BUYABLES_FUNCTION_NAMES = {
        "exp": {
                "func": BUYABLE_EFFECT_EXPONENTIAL,
                "identity": new Decimal(1),
        },
        "exp_sqrt":{
                "func": BUYABLE_EFFECT_EXPONENTIAL_SQRT,
                "identity": new Decimal(1),
        },
        "exp_cbrt": {
                "func": BUYABLE_EFFECT_EXPONENTIAL_CBRT,
                "identity": new Decimal(1),
        },
        "lin": {
                "func": BUYABLES_EFFECT_LINEAR,
                "identity": new Decimal(0),
        },
}

var CURRENT_BUYABLE_BASES = {}
var CURRENT_BUYABLE_EFFECTS = {}

function BUYABLE_EFFECT_EXPONENTIAL(a,b){
        return a.pow(b)
}

function BUYABLE_EFFECT_EXPONENTIAL_SQRT(a,b){
        return a.pow(b.sqrt())
}

function BUYABLE_EFFECT_EXPONENTIAL_CBRT(a,b){
        return a.pow(b.cbrt())
}

function BUYABLES_EFFECT_LINEAR(a,b){
        return a.times(b)
}

function getBuyableEffectFunction(layer, id){
        if (!isValidBuyableCode(layer, id)) return BUYABLE_EFFECT_EXPONENTIAL
        let func = FREE_BUYABLE_DATA[layer+id]["func"]
        if (typeof func == "function") return func
        return BUYABLES_FUNCTION_NAMES[func]["func"] || BUYABLE_EFFECT_EXPONENTIAL
}

function reCalcBuyableBase(layer, id){
        if (!isValidBuyableCode(layer + id)) {
                console.log("ya boi broke" + layer+ id)
                Decimal(0)
        }
        let data1 = FREE_BUYABLE_DATA[layer+id]
        if (!isBuyableActive(layer, id)) {
                if (typeof data1.func == "function"){
                        return data1.identity
                }
                return BUYABLES_FUNCTION_NAMES[data1.func]["identity"]
        }
        let data2 = data1.base
        let a = data2.initial
        let b = 0
        while (b < 10){ //maybe change later
                b ++
                let data3 = data2[b]
                //this is the data
                if (data3 == undefined) break
                //if data undefined done w loop
                if (!data3.active()) continue
                //if the effect isnt active continue to next effect
                let func = data3.type
                let eff = data3.amount()
                //effect of the effect... (xd)
                if (func == "add") a = a.plus(eff)
                if (func == "mult") a = a.times(eff)
                if (func == "exp") a = a.pow(eff)
                //do the effect to a
        }
        if (softcap_data[layer+"_buy"+id] != undefined){
                a = softcap(a, layer+"_buy"+id)
        }
        return a
}

function getSavedBuyableEffect(layer, id){
        if (!isValidBuyableCode(layer + id)) {
                console.log("ya boi broke" + layer+ id)
                Decimal(0)
        }
        //change this later if we store it in a class
        return tmp[layer].buyables[id].effect 
}





