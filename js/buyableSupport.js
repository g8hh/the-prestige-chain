/*
key = [buyable layer][buyable id] i.e. a11 or b23
data = [another key]: function
*/

var MAIN_BUYABLE_DATA = {
        a11: {
                name: "All",
                func: "exp",
                effects: "points",
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
                bases(){
                        let b0 = new Decimal(500)
                        let b1 = new Decimal(2)
                        let b2 = new Decimal(1.001)
                        return [b0, b1, b2]
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
                effects: "Amoebas",
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
                bases(){
                        let b0 = new Decimal(1e4)
                        let b1 = new Decimal(3)
                        let b2 = new Decimal(1.005)
                        return [b0, b1, b2]
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
                effects: "Are effect",
                effectSymbol: "^",
                eFormula: "x^2*.3 + 1",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = new Decimal(1e8)
                        let b1 = new Decimal(8)
                        let b2 = new Decimal(1.25)
                        return [b0, b1, b2]
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
                effects: "Amoeba gain exponent",
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
                bases(){
                        let b0 = new Decimal(1e66)
                        let b1 = new Decimal(100)
                        let b2 = new Decimal(2)
                        return [b0, b1, b2]
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
                effects: "Bacteria",
                base: {
                        initial: new Decimal(1.2),
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
                bases(){
                        let b0 = new Decimal(1e149)
                        let b1 = new Decimal(1e4)
                        let b2 = new Decimal(5)
                        return [b0, b1, b2]
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
                effects: "points",
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
                bases(){
                        let b0 = Decimal.pow(10, 625)
                        let b1 = new Decimal(1)
                        let b2 = new Decimal(7)
                        return [b0, b1, b2]
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
                effects: "Amoebas",
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
                bases(){
                        let b0 = Decimal.pow(10, 1805)
                        let b1 = new Decimal(1e5)
                        let b2 = new Decimal(10)
                        return [b0, b1, b2]
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
                effects: "Access base",
                base: {
                        initial: new Decimal(.01),
                },
                bases(){
                        let b0 = Decimal.pow(10, 12086)
                        let b1 = new Decimal(1.5e99)
                        let b2 = new Decimal(20)
                        return [b0, b1, b2]
                },
        },
        a33: {
                name: "Omnipotent I",
                func: "lin",
                effects: "B gain exp",
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
                bases(){
                        let b0 = Decimal.pow(10, 32099)
                        let b1 = Decimal.pow(10, 777)
                        let b2 = new Decimal(1e22)
                        return [b0, b1, b2]
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
                effects: "points",
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
                bases(){
                        let b0 = new Decimal(1e15)
                        let b1 = new Decimal(4)
                        let b2 = new Decimal(1.5)
                        return [b0, b1, b2]
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
                eFormula() {
                        return "(" + format(CURRENT_BUYABLE_BASES["b12"], 4) + "+x)^x"
                },
                effects: "Bacteria",
                effectSymbol: "*",
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
                bases(){
                        let b0 = new Decimal(1e71)
                        let b1 = new Decimal(10)
                        let b2 = new Decimal(2)
                        return [b0, b1, b2]
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
                effects: "Circles",
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
                bases(){
                        let b0 = Decimal.pow(10, 1270)
                        let b1 = new Decimal(1)
                        let b2 = new Decimal(5)
                        return [b0, b1, b2]
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
                effects: "Amoebas",
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
                bases(){
                        let b0 = Decimal.pow(10, 1421)
                        let b1 = new Decimal(1e28)
                        let b2 = new Decimal(100)
                        return [b0, b1, b2]
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
                effects: "Against base",
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
                bases(){
                        let b0 = Decimal.pow(10, 10967)
                        let b1 = Decimal.pow(10, 419)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
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
                effects: "Because base",
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
                bases(){
                        let b0 = Decimal.pow(10, 11369)
                        let b1 = Decimal.pow(10, 156)
                        let b2 = new Decimal(1e15)
                        return [b0, b1, b2]
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
                effects: "Advanced base",
                base: {
                        initial: new Decimal(1e50),
                },
                bases(){
                        let b0 = Decimal.pow(10, 48252)
                        let b1 = new Decimal(5e175)
                        let b2 = new Decimal(2e27)
                        return [b0, b1, b2]
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
                effects: "Circle gain exponent",
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
                bases(){
                        let b0 = Decimal.pow(10, 71386)
                        let b1 = new Decimal(1)
                        let b2 = new Decimal(1e37)
                        return [b0, b1, b2]
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
                effects: "Baby base",
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
                bases(){
                        let b0 = Decimal.pow(10, 135520)
                        let b1 = Decimal.pow(10, 3481)
                        let b2 = Decimal.pow(10, 150)
                        return [b0, b1, b2]
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
                effects: "Beauty base",
                base: {
                        initial: new Decimal(100),
                },
                bases(){
                        let b0 = Decimal.pow(10, 443)
                        let b1 = new Decimal(2)
                        let b2 = new Decimal(1.5)
                        return [b0, b1, b2]
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
                effects: "Circle effect",
                base: {
                        initial: Decimal.pow(10, 1624),
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
                bases(){
                        let b0 = Decimal.pow(10, 1875)
                        let b1 = new Decimal(1e100)
                        let b2 = new Decimal(3)
                        return [b0, b1, b2]
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
                effects: "Brand base",
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
                bases(){
                        let b0 = Decimal.pow(10, 5422)
                        let b1 = new Decimal(1e10)
                        let b2 = new Decimal(10)
                        return [b0, b1, b2]
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
                effects: "base Bacteria gain",
                base: {
                        initial: new Decimal(2),
                },
                bases(){
                        let b0 = Decimal.pow(10, 10314)
                        let b1 = new Decimal(1e253)
                        let b2 = new Decimal(1000)
                        return [b0, b1, b2]
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
                effects: "Doodles",
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
                bases(){
                        let b0 = Decimal.pow(10, 99999)
                        let b1 = new Decimal(.001)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
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
                effects: "Amoebas",
                base: {
                        initial: Decimal.pow(10, 1572e3),
                },
                bases(){
                        let b0 = Decimal.pow(10, 455951)
                        let b1 = Decimal.pow(10, 1000)
                        let b2 = new Decimal(1e20)
                        return [b0, b1, b2]
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
                effects: "Call base",
                base: {
                        initial: new Decimal(1e50),
                },
                bases(){
                        let b0 = Decimal.pow(10, 1507038)
                        let b1 = Decimal.pow(10, 3000)
                        let b2 = new Decimal(1e50)
                        return [b0, b1, b2]
                },
                c32: {
                        active: function(){
                                return hasMilestone("goalsii", 10)
                        },
                },
        },
        c32: {
                name: "Category",
                func: "exp",
                effects: "Circles",
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
                bases(){
                        let b0 = Decimal.pow(10, 1000)
                        let b1 = new Decimal(10)
                        let b2 = new Decimal(100)
                        return [b0, b1, b2]
                },
        },
        c33: {
                name: "Omnipotent III",
                func: "exp_sqrt",
                effects: "Features",
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
                        3: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["d32"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 5e6)
                        let b1 = Decimal.pow(10, 1e6)
                        let b2 = Decimal.pow(10, 1e4)
                        return [b0, b1, b2]
                },
        },
        d11: {
                name: "Department",
                func: "exp",
                effects: "Doodles",
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
                bases(){
                        let b0 = Decimal.pow(10, 608)
                        let b1 = new Decimal(4.5)
                        let b2 = new Decimal(1.01)
                        return [b0, b1, b2]
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
                effects: "Card base",
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
                bases(){
                        let b0 = Decimal.pow(10, 627).times(5)
                        let b1 = new Decimal(45)
                        let b2 = new Decimal(1.1)
                        return [b0, b1, b2]
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
                effects: "Department base",
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
                bases(){
                        let b0 = Decimal.pow(10, 687).times(5)
                        let b1 = new Decimal(50)
                        let b2 = new Decimal(2)
                        return [b0, b1, b2]
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
                effects: "Based base",
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
                bases(){
                        let b0 = Decimal.pow(10, 1655)
                        let b1 = new Decimal(.2)
                        let b2 = new Decimal(5)
                        return [b0, b1, b2]
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
                effects: "Omnipotent II base",
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
                bases(){
                        let b0 = Decimal.pow(10, 1945)
                        let b1 = new Decimal(1e77)
                        let b2 = new Decimal(10)
                        return [b0, b1, b2]
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
                effects: "Eggs",
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
                bases(){
                        let b0 = Decimal.pow(10, 22222)
                        let b1 = new Decimal(1e100)
                        b1 = b1.div(getGoalChallengeReward("34"))
                        let b2 = new Decimal(1e3)
                        return [b0, b1, b2]
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
                effects: "Drive base",
                base: {
                        initial: new Decimal(.25),
                },
                bases(){
                        let b0 = Decimal.pow(10, 44444)
                        let b1 = Decimal.pow(10, 323)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
                },
        },
        d32: {
                name: "Done",
                func: "lin",
                effects: "Omnipotent III base",
                base: {
                        initial: new Decimal(.02),
                },
                bases(){
                        let b0 = Decimal.pow(10, 333333)
                        let b1 = Decimal.pow(10, 1234)
                        let b2 = new Decimal(1e50)
                        return [b0, b1, b2]
                },
        },
        d33: {
                name: "Omnipotent IV",
                func: "lin_sqrt",
                effects: "Free successfully deved games",
                base: {
                        initial: new Decimal(.1),
                },
                bases(){
                        let b0 = new Decimal(1)
                        let b1 = new Decimal(1)
                        let b2 = Decimal.pow(10, 1e40)
                        return [b0, b1, b2]
                },
        },
        e11: {
                name: "Experience",
                func: "exp",
                effects: "Eggs",
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
                bases(){
                        let b0 = new Decimal(1e116)
                        let b1 = new Decimal(2)
                        if (hasMilestone("goalsii", 22)) b1 = new Decimal(1)
                        let b2 = new Decimal(1.001)
                        return [b0, b1, b2]
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
                effects: "Egg gain exponent",
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
                bases(){
                        let b0 = Decimal.pow(10, 350)
                        b0 = b0.div(getGoalChallengeReward("34"))
                        let b1 = new Decimal(10)
                        if (hasMilestone("goalsii", 23)) b1 = new Decimal(1) 
                        let b2 = new Decimal(1.1)
                        return [b0, b1, b2]
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
                effects: "Due base",
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
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["e31"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = new Decimal(1e200)
                        if (hasUpgrade("goalsii", 12)) b0 = b0.div(getGoalChallengeReward("34"))
                        let b1 = new Decimal(10)
                        let b2 = new Decimal(2)
                        return [b0, b1, b2]
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
                effects: "Category base",
                base: {
                        initial: new Decimal(1e50),
                },
                bases(){
                        let b0 = Decimal.pow(10, 1000)
                        let b1 = new Decimal(20)
                        let b2 = new Decimal(5)
                        return [b0, b1, b2]
                },
        },
        e22: {
                name: "Event",
                func: "exp_cbrt",
                effects: "Medal effect",
                base: {
                        initial: new Decimal(1e5),
                },
                bases(){
                        let b0 = Decimal.pow(10, 500)
                        let b1 = new Decimal(.1)
                        let b2 = new Decimal(10)
                        return [b0, b1, b2]
                },
        },
        e23: {
                name: "Enter",
                func: "lin",
                effects: "Doodle gain exponent",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 2000)
                        let b1 = new Decimal(1e67)
                        let b2 = new Decimal(100)
                        return [b0, b1, b2]
                },
        },
        e31: {
                name: "Energy",
                func: "lin",
                effects: "Example base",
                base: {
                        initial: new Decimal(.01),
                },
                bases(){
                        let b0 = Decimal.pow(10, 4000)
                        let b1 = new Decimal(1e59)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
                },
        },
        e32: {
                name: "Entertainment",
                func(a,x){
                        let ret = Decimal.plus(x, 10).log10().times(a)
                        return ret
                },
                identity: new Decimal(1),
                effectSymbol: "*",
                eFormula: "[base]*log10(10+x)",
                effects: "Medal gain",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 39000)
                        let b1 = Decimal.pow(10, 1234)
                        let b2 = new Decimal(1e50)
                        return [b0, b1, b2]
                },
        },
        e33: {
                name: "Omnipotent V",
                func(a,x){
                        let ret = Decimal.plus(x, 1).log10().times(a)
                        return ret.plus(1)
                },
                identity: new Decimal(1),
                effectSymbol: "*",
                eFormula: "[base]*log10(10+x)",
                effects: "Base <b>G</b> gain",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = new Decimal(1)
                        let b1 = new Decimal(1)
                        let b2 = Decimal.pow(10, 1e40)
                        return [b0, b1, b2]
                },
                f11: {
                        active: function(){
                                return hasUpgrade("goalsii", 35)
                        },
                },
        },
        f11: {
                name: "Four",
                func: "exp",
                effects: "F gain",
                base: {
                        initial: new Decimal(1e10),
                },
                bases(){
                        let b0 = Decimal.pow(10, 970e3)
                        let b1 = Decimal.pow(10, 1e3)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
                },
                f12: {
                        active: function(){
                                return hasUpgrade("f", 51)
                        },
                },
                f13: {
                        active: function(){
                                return hasUpgrade("f", 52)
                        },
                },
        },
        f12: {
                name: "February",
                func: "lin",
                effects: "F gain exponent",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return hasUpgrade("g", 35)
                                },
                                amount: function(){
                                        return new Decimal(player.g.upgrades.length / 10)
                                },
                                type: "plus"
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["g22"]
                                },
                                type: "plus"
                        },
                        3: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.m.clickables[102].effect
                                },
                                type: "times",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 1e6)
                        let b1 = new Decimal(1e270)
                        let b2 = new Decimal(1e20)
                        return [b0, b1, b2]
                },
                f13: {
                        active: function(){
                                return hasUpgrade("g", 31)
                        },
                },
                f21: {
                        active: function(){
                                return hasUpgrade("g", 42)
                        },
                },
        },
        f13: {
                name: "Future",
                func: "lin_sqrt",
                effects: "effective devs",
                base: {
                        initial: new Decimal(1010),
                        1: {
                                active: function(){
                                        return hasUpgrade("g", 35)
                                },
                                amount: function(){
                                        return Math.max(1, player.g.upgrades.length)
                                },
                                type: "times"
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["g13"]
                                },
                                type: "plus"
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 1225e3)
                        let b1 = Decimal.pow(10, 456).times(1.23)
                        let b2 = new Decimal(1e50)
                        return [b0, b1, b2]
                },
                f21: {
                        active: function(){
                                return hasUpgrade("g", 41)
                        },
                },
        },
        f21: {
                name: "Friends",
                effects: "effective rebirths",
                func(a,x){
                        let ret = Decimal.pow(x, .8).times(a)
                        return ret
                },
                identity: new Decimal(0),
                effectSymbol: "+",
                eFormula: "[base]*x^.8",
                base: {
                        initial: new Decimal(.5),
                        1: {
                                active: function(){
                                        return hasUpgrade("g", 43)
                                },
                                amount: function(){
                                        return player.g.rebirths[1] * .01
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 3525e3)
                        let b1 = Decimal.pow(10, 4567).times(1.23)
                        let b2 = new Decimal(1e100)
                        return [b0, b1, b2]
                },
                f22: {
                        active: function(){
                                return hasUpgrade("g", 53)
                        },
                },
        },
        f22: {
                name: "Front",
                func: "lin_sqrt",
                effects: "Feature effect exponent",
                base: {
                        initial: new Decimal(.05),
                        1: {
                                active(){
                                        return true
                                },
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["f31"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 150289e3)
                        let b1 = Decimal.pow(10, 45678).times(1.23)
                        let b2 = new Decimal(1e300)
                        return [b0, b1, b2]
                },
        },
        f23: {
                name: "Final",
                func: "lin_sqrt",
                effects: "Medal gain exponent",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 27e13)
                        let b1 = Decimal.pow(10, 1e10)
                        let b2 = Decimal.pow(10, 1e6)
                        return [b0, b1, b2]
                },
        },
        f31: {
                name: "Finance",
                func: "lin",
                effects: "Front base",
                base: {
                        initial: new Decimal(.0001),
                },
                bases(){
                        let b0 = Decimal.pow(10, 1.7e15)
                        let b1 = Decimal.pow(10, 1e13)
                        let b2 = Decimal.pow(10, 1e8)
                        return [b0, b1, b2]
                },
        },
        f32: {
                name: "Fast",
                func: "lin",
                effects: "Amoeba effect exponent",
                base: {
                        initial: new Decimal(.1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["g23"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 1e23)
                        let b1 = Decimal.pow(10, 1e19)
                        let b2 = Decimal.pow(10, 1e13)
                        return [b0, b1, b2]
                },
        },
        f33: {
                name: "Omnipotent VI",
                func: "lin",
                effects: "<b>Egg</b> effect exponent",
                base: {
                        initial: new Decimal(.1),
                        1: {
                                active: function(){
                                        return hasUpgrade("h", 44)
                                },
                                amount: function(){
                                        return new Decimal(.01 * player.h.upgrades.length)
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 3e23)
                        let b1 = Decimal.pow(10, 1e20)
                        let b2 = Decimal.pow(10, 1e14)
                        return [b0, b1, b2]
                },
        },
        g11: {
                name: "Gives",
                func: "lin",
                effects: "G gain exponent",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return hasUpgrade("i", 15)
                                },
                                amount: function(){
                                        return new Decimal(player.i.upgrades.length * .01)
                                },
                                type: "plus"
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 3435e3)
                        let b1 = new Decimal(1e50)
                        let b2 = new Decimal(1e3)
                        return [b0, b1, b2]
                },
                g12: {
                        active: function(){
                                return hasUpgrade("g", 53)
                        },
                },
        },
        g12: {
                name: "Guidelines",
                func: "exp",
                effects: "base G gain",
                base: {
                        initial: new Decimal(1.05),
                        1: {
                                active: function(){
                                        return hasUpgrade("g", 52)
                                },
                                amount: function(){
                                        return new Decimal(.001 * player.i.upgrades.length)
                                },
                                type: "add",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 4558e3)
                        let b1 = Decimal.pow(10, 2000)
                        let b2 = new Decimal(1e5)
                        return [b0, b1, b2]
                },
                g13: {
                        active: function(){
                                return hasUpgrade("goalsii", 44)
                        },
                },
                g21: {
                        active: function(){
                                return hasUpgrade("i", 21)
                        },
                },
                g22: {
                        active: function(){
                                return hasUpgrade("i", 21)
                        },
                },
        },
        g13: {
                name: "Goal",
                func: "lin",
                effects: "<b>Future</b> base",
                base: {
                        initial: new Decimal(5),
                },
                bases(){
                        let b0 = Decimal.pow(10, 11047e3)
                        let b1 = new Decimal(1e10)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
                },
                g21: {
                        active: function(){
                                return hasUpgrade("i", 15)
                        },
                },
                g22: {
                        active: function(){
                                return hasUpgrade("h", 41)
                        },
                },
                g23: {
                        active: function(){
                                return hasUpgrade("h", 41)
                        },
                },
        },
        g21: {
                name: "Generation",
                func: "lin",
                effects: "<b>Federal</b> base",
                base: {
                        initial: new Decimal(.01),
                },
                bases(){
                        let b0 = Decimal.pow(10, 302e6)
                        let b1 = Decimal.pow(10, 1e5)
                        let b2 = new Decimal(1e100)
                        return [b0, b1, b2]
                },
                g22: {
                        active: function(){
                                return hasUpgrade("h", 41)
                        },
                },
                g23: {
                        active: function(){
                                return hasUpgrade("h", 41)
                        },
                },
        },
        g22: {
                name: "Guarantee",
                func: "lin",
                effects: "<b>February</b> base",
                base: {
                        initial: new Decimal(.01),
                },
                bases(){
                        let b0 = Decimal.pow(10, 347e6)
                        let b1 = Decimal.pow(10, 5e5)
                        let b2 = Decimal.pow(10, 5e2)
                        return [b0, b1, b2]
                },
                g23: {
                        active: function(){
                                return hasUpgrade("h", 42)
                        },
                },
        },
        g23: {
                name: "Growing",
                func: "lin",
                effects: "<b>Fast</b> base",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active: function(){
                                        return hasUpgrade("h", 42)
                                },
                                amount: function(){
                                        return new Decimal(player.h.upgrades.length * .001)
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["h12"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 95e9)
                        let b1 = Decimal.pow(10, 1e8)
                        let b2 = Decimal.pow(10, 1e4)
                        return [b0, b1, b2]
                },
                g31: {
                        active: function(){
                                return hasUpgrade("i", 24)
                        },
                },
                g32: {
                        active: function(){
                                return hasUpgrade("i", 25)
                        },
                },
        },
        g31: {
                name: "Generated",
                func: "exp_sqrt",
                effects: "point gain",
                effectSymbol: "^",
                base: {
                        initial: new Decimal(1.1),
                        1: {
                                active: function(){
                                        return hasUpgrade("h", 43)
                                },
                                amount: function(){
                                        return new Decimal(.001 * player.i.upgrades.length)
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["g33"]
                                },
                                type: "plus",
                        },
                        3: {
                                active: function(){
                                        return hasUpgrade("i", 41)
                                },
                                amount: function(){
                                        return player.j.puzzle.bestKnowledge.plus(1).log10()
                                },
                                type: "plus",
                        },
                        4: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["i31"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 153e9)
                        let b1 = Decimal.pow(10, 5e8)
                        let b2 = Decimal.pow(10, 1e5)
                        return [b0, b1, b2]
                },
                g32: {
                        active: function(){
                                return hasUpgrade("h", 45)
                        },
                },
        },
        g32: {
                name: "Guys",
                func: "lin_sqrt",
                effects: "<b>Film</b> exponent",
                base: {
                        initial: new Decimal(.001),
                        1: {
                                active: function(){
                                        return hasUpgrade("h", 55)
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["h23"].plus(10).log10()
                                },
                                type: "times",
                        },
                        2: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["h32"]
                                },
                                type: "plus",
                        }
                },
                bases(){
                        let b0 = Decimal.pow(10, 498e9)
                        let b1 = new Decimal(1)
                        let b2 = Decimal.pow(10, 1e6)
                        return [b0, b1, b2]
                },
        },
        g33: {
                name: "Omnipotent VII",
                func: "lin",
                effects: "<b>Generated</b> base",
                base: {
                        initial: new Decimal(.001),
                },
                bases(){
                        let b0 = Decimal.pow(10, 1310e9)
                        let b1 = Decimal.pow(10, 4e9)
                        let b2 = Decimal.pow(10, 1e7)
                        return [b0, b1, b2]
                },
                h12: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(33)
                        },
                },
        },
        h11: {
                name: "Holiday",
                func: "lin",
                effects: "<b>G</b> gain exponent",
                base: {
                        initial: new Decimal(1e6),
                },
                bases(){
                        let b0 = Decimal.pow(10, 1160e3)
                        let b1 = Decimal.pow(10, 1000)
                        let b2 = new Decimal(1e5)
                        return [b0, b1, b2]
                },
                h12: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(33)
                        },
                },
        },
        h12: {
                name: "Held",
                func: "lin",
                effects: "<b>Growing</b> base",
                base: {
                        initial: new Decimal(.002),
                        1: {
                                active: function(){
                                        return hasUpgrade("j", 21)
                                },
                                amount: function(){
                                        return tmp.j.clickables[55].effect
                                },
                                type: "mult",
                        }
                },
                bases(){
                        let b0 = Decimal.pow(10, 1165e3)
                        let b1 = Decimal.pow(10, 3000)
                        let b2 = new Decimal(1e10)
                        return [b0, b1, b2]
                },
                h13: {
                        active: function(){
                                return hasUpgrade("h", 51)
                        },
                },
                h21: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(53)
                        },
                },
        },
        h13: {
                name: "Hope",
                func: "exp",
                effects: "<b>H</b> gain",
                base: {
                        initial: Decimal.pow(10, 1000),
                        1: {
                                active: function(){
                                        return hasUpgrade("h", 51)
                                },
                                amount: function(){
                                        return Decimal.sqrt(player.i.upgrades.length).max(1)
                                },
                                type: "pow",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("j", 22)
                                },
                                amount: function(){
                                        return player.j.puzzle.upgrades.length
                                },
                                type: "pow",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 1180e3)
                        let b1 = Decimal.pow(10, 1000)
                        let b2 = new Decimal(1e20)
                        return [b0, b1, b2]
                },
                h21: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(41)
                        },
                },
                h22: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(52)
                        },
                },
        },
        h21: {
                name: "Hour",
                func: "exp_sqrt",
                effects: "all prior buyable limit",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active: function(){
                                        return hasUpgrade("i", 42)
                                },
                                amount: function(){
                                        return .01 * player.i.upgrades.length
                                },
                                type: "plus",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("j", 54)
                                },
                                amount: function(){
                                        return .04 * player.j.upgrades.length
                                },
                                type: "plus",
                        },
                        3: {
                                active: function(){
                                        return hasUpgrade("l", 21)
                                },
                                amount: function(){
                                        return tmp.k.clickables.totalLocks.max(1)
                                },
                                type: "pow",
                        },
                        4: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["k12"]
                                },
                                type: "times",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 1623e3)
                        let b1 = new Decimal(1)
                        let b2 = new Decimal(1e25)
                        return [b0, b1, b2]
                },
                h22: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(52)
                        },
                },
                h23: {
                        active: function(){
                                return hasUpgrade("h", 54)
                        },
                },
        },
        h22: {
                name: "Huge",
                func: "lin",
                effects: "<b>H</b> gain exponent",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return hasUpgrade("i", 35)
                                },
                                amount: function(){
                                        return player.j.puzzle.repeatables[35].max(1)
                                },
                                type: "times",
                        },
                        2: {
                                active: function(){
                                        return hasUpgrade("i", 45)
                                },
                                amount: function(){
                                        return 2
                                },
                                type: "pow",
                        },
                        3: {
                                active: function(){
                                        return hasMilestone("k", 8)
                                },
                                amount: function(){
                                        return 2
                                },
                                type: "pow",
                        },
                        4: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["i21"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 9876543)
                        let b1 = new Decimal(1e210)
                        let b2 = new Decimal(1e98)
                        return [b0, b1, b2]
                },
                h23: {
                        active: function(){
                                return hasUpgrade("h", 54)
                        },
                },
        },
        h23: {
                name: "Happy",
                func: "lin",
                effects: "<b>I</b> effect exponent",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["i11"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 716e6)
                        let b1 = Decimal.pow(10, 123e3)
                        let b2 = Decimal.pow(10, 1e3)
                        return [b0, b1, b2]
                },
                h31: {
                        active: function(){
                                return hasMilestone("j", 7)
                        },
                },
                h32: {
                        active: function(){
                                return hasUpgrade("j", 21)
                        },
                },
        },
        h31: {
                name: "Hair",
                func: "exp",
                effects: "base <b>G</b> gain",
                base: {
                        initial: new Decimal(1e10),
                },
                bases(){
                        let b0 = Decimal.pow(10, 51e9)
                        let b1 = Decimal.pow(10, 1e7)
                        let b2 = Decimal.pow(10, 1e4)
                        return [b0, b1, b2]
                },
                h32: {
                        active: function(){
                                return hasUpgrade("j", 15)
                        },
                },
        },
        h32: {
                name: "Horse",
                func: "lin",
                effects: "<b>Guys</b> base",
                base: {
                        initial: new Decimal(.001),
                },
                bases(){
                        let b0 = Decimal.pow(10, 119e9)
                        let b1 = Decimal.pow(10, 5e7)
                        let b2 = Decimal.pow(10, 1e5)
                        return [b0, b1, b2]
                },
        },
        h33: {
                name: "Omnipotent VIII",
                func: "exp_sqrt",
                effects: "<b>E</b> effect exponent",
                effectSymbol: "^",
                base: {
                        initial: new Decimal(1.1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["j23"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 2380e9)
                        let b1 = Decimal.pow(10, 1e9)
                        let b2 = Decimal.pow(10, 1e6)
                        return [b0, b1, b2]
                },
        },
        i11: {
                name: "Investment",
                func: "lin",
                effects: "<b>Happy</b> base",
                base: {
                        initial: new Decimal(1),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["i12"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 5050e6)
                        let b1 = Decimal.pow(10, 1e6)
                        let b2 = Decimal.pow(10, 100)
                        return [b0, b1, b2]
                },
                i13: {
                        active: function(){
                                return hasUpgrade("j", 45)
                        },
                },
        },
        i12: {
                name: "Ideas",
                func: "lin",
                effects: "<b>Investment</b> base",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["j21"]
                                },
                                type: "plus",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 8100e6)
                        let b1 = Decimal.pow(10, 5e6)
                        let b2 = Decimal.pow(10, 1e3)
                        return [b0, b1, b2]
                },
                i21: {
                        active: function(){
                                return hasUpgrade("j", 45)
                        },
                },
                i13: {
                        active: function(){
                                return hasUpgrade("j", 45)
                        },
                },
        },
        i13: {
                name: "Inn",
                func: "exp",
                effects: "base <b>H</b> gain",
                base: {
                        initial: Decimal.pow(10, 1e5),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["i23"]
                                },
                                type: "times",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 11200e6)
                        let b1 = Decimal.pow(10, 1e7)
                        let b2 = Decimal.pow(10, 1e4)
                        return [b0, b1, b2]
                },
                i21: {
                        active: function(){
                                return hasUpgrade("j", 45)
                        },
                },
        },
        i21: {
                name: "Industrial",
                func: "lin",
                effects: "<b>Huge</b> base",
                base: {
                        initial: new Decimal(1e5),
                },
                bases(){
                        let b0 = Decimal.pow(10, 11600e6)
                        let b1 = Decimal.pow(10, 2e7)
                        let b2 = Decimal.pow(10, 2e4)
                        return [b0, b1, b2]
                },
        },
        i22: {
                name: "Idea",
                func: "exp",
                effects: "base <b>Idea</b> gain",
                base: {
                        initial: Decimal.pow(10, 111),
                        1: {
                                active: function(){
                                        return hasMilestone("k", 13)
                                },
                                amount: function(){
                                        return player.k.lock.resources[23].max(1)
                                },
                                type: "times",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 37e9)
                        let b1 = Decimal.pow(10, 1e8)
                        let b2 = Decimal.pow(10, 5e4)
                        return [b0, b1, b2]
                },
        },
        i23: {
                name: "Independent",
                func: "exp",
                effects: "<b>Inn</b> base",
                base: {
                        initial: Decimal.pow(10, 1000),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["j11"]
                                },
                                type: "times",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 40e12)
                        let b1 = Decimal.pow(10, 1e10)
                        let b2 = Decimal.pow(10, 1e7)
                        return [b0, b1, b2]
                },
        },
        i31: {
                name: "Improve",
                func: "lin",
                effects: "<b>Generated</b> base",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 10e13)
                        let b1 = Decimal.pow(10, 1e12)
                        let b2 = Decimal.pow(10, 1e9)
                        return [b0, b1, b2]
                },
        },
        i32: {
                name: "Impact",
                func: "lin",
                effects: "<b>H</b> effect exponent",
                base: {
                        initial: new Decimal(1e7),
                },
                bases(){
                        let b0 = Decimal.pow(10, 4e17)
                        let b1 = Decimal.pow(10, 1e14)
                        let b2 = Decimal.pow(10, 1e11)
                        return [b0, b1, b2]
                },
        },
        i33: {
                name: "Omnipotent IX",
                func: "exp_sqrt",
                effectSymbol: "^",
                effects: "point and <b>A</b> gain",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["j32"]
                                },
                                type: "plus"
                        }
                },
                bases(){
                        let b0 = Decimal.pow(10, 2e18)
                        let b1 = Decimal.pow(10, 1e16)
                        let b2 = Decimal.pow(10, 1e13)
                        return [b0, b1, b2]
                },
        },
        j11: {
                name: "Jefferson",
                func: "exp",
                effects: "<b>Independent</b> base",
                base: {
                        initial: Decimal.pow(10, 1e4),
                },
                bases(){
                        let b0 = Decimal.pow(10, 319e9)
                        let b1 = Decimal.pow(10, 1e8)
                        let b2 = Decimal.pow(10, 1e4)
                        return [b0, b1, b2]
                },
        },
        j12: {
                name: "Jacksonville",
                func: "lin",
                effects: "<b>J</b> effect exponent",
                base: {
                        initial: new Decimal(1e3),
                },
                bases(){
                        let b0 = Decimal.pow(10, 321e9)
                        let b1 = Decimal.pow(10, 2e8)
                        let b2 = Decimal.pow(10, 1e5)
                        return [b0, b1, b2]
                },
                j21: {
                        active: function(){
                                return hasUpgrade("k", 42)
                        },
                },
        },  
        j13: {
                name: "Jamaica",
                func: "lin",
                effects: "<b>I</b> gain exponent",
                base: {
                        initial: new Decimal(1e5),
                        1:{
                                active:function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["j33"]
                                },
                                type: "plus"
                        },
                        2:{
                                active:function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.m.clickables[42].effect
                                },
                                type: "times"
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 5.7e11)
                        let b1 = Decimal.pow(10, 1e8)
                        let b2 = Decimal.pow(10, 1e6)
                        return [b0, b1, b2]
                },
                j21: {
                        active: function(){
                                return hasUpgrade("k", 42)
                        },
                },
        },     
        j21: {
                name: "Juice",
                func: "lin",
                effects: "<b>Ideas</b> base",
                base: {
                        initial: new Decimal(1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 7e11)
                        let b1 = Decimal.pow(10, 1e8)
                        let b2 = Decimal.pow(10, 3e6)
                        return [b0, b1, b2]
                },
        }, 
        j22: {
                name: "Juan",
                func(a,x){
                        let ret = Decimal.plus(x, 1).log10().times(a)
                        return ret
                },
                identity: new Decimal(0),
                effectSymbol: "-",
                eFormula: "[base]*log10(1+x)",
                effects: "effective <b>H</b> challenges",
                base: {
                        initial: new Decimal(.1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 7e14)
                        let b1 = Decimal.pow(10, 1e13)
                        let b2 = Decimal.pow(10, 1e11)
                        return [b0, b1, b2]
                },
        },
        j23: {
                name: "Junction",
                func: "lin",
                effects: "<b>Omnipotent VIII</b> base",
                base: {
                        initial: new Decimal(.2),
                },
                bases(){
                        let b0 = Decimal.pow(10, 7e16)
                        let b1 = Decimal.pow(10, 1e14)
                        let b2 = Decimal.pow(10, 1e12)
                        return [b0, b1, b2]
                },
        },
        j31: {
                name: "Joel",
                func: "exp",
                effects: "<b>Knowledge</b>",
                base: {
                        initial: Decimal.pow(10, 1e10),
                },
                bases(){
                        let b0 = Decimal.pow(10, 2.9e26)
                        let b1 = Decimal.pow(10, 1e24)
                        let b2 = Decimal.pow(10, 1e22)
                        return [b0, b1, b2]
                },
        },
        j32: {
                name: "Julie",
                func: "lin",
                effects: "<b>Omnipotent IX</b> base",
                base: {
                        initial: new Decimal(.2),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return CURRENT_BUYABLE_EFFECTS["k13"]
                                },
                                type: "times"
                        }
                },
                bases(){
                        let b0 = Decimal.pow(10, 4.3e26)
                        let b1 = Decimal.pow(10, 5e24)
                        let b2 = Decimal.pow(10, 3e22)
                        return [b0, b1, b2]
                },
        },
        j33: {
                name: "Omnipotent X",
                func: "lin",
                effects: "<b>Jamaica</b> base",
                base: {
                        initial: new Decimal(1e4),
                },
                bases(){
                        let b0 = Decimal.pow(10, 5e29)
                        let b1 = Decimal.pow(10, 1e26)
                        let b2 = Decimal.pow(10, 1e23)
                        return [b0, b1, b2]
                },
        },
        k11: {
                name: "Knight",
                func(a,x){
                        let ret = Decimal.times(a, x).plus(1)
                        return ret
                },
                identity: new Decimal(1),
                effectSymbol: "*",
                eFormula: "[base]*x+1",
                effects: "<b>L</b> effect exponent",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.m.clickables[32].effect
                                },
                                type: "add",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 3e14)
                        let b1 = Decimal.pow(10, 1e12)
                        let b2 = Decimal.pow(10, 1e09)
                        return [b0, b1, b2]
                },
        },
        k12: {
                name: "Kennedy",
                func: "exp",
                effects: "<b>Hour</b> base",
                base: {
                        initial: Decimal.pow(10, 1e6),
                },
                bases(){
                        let b0 = Decimal.pow(10, 4e15)
                        let b1 = Decimal.pow(10, 1e13)
                        let b2 = Decimal.pow(10, 1e10)
                        return [b0, b1, b2]
                },
        },
        k13: {
                name: "Killing",
                func: "exp",
                effects: "<b>Julie</b> base",
                base: {
                        initial: new Decimal(1.1),
                },
                bases(){
                        let b0 = Decimal.pow(10, 6e15)
                        let b1 = Decimal.pow(10, 3e13)
                        let b2 = Decimal.pow(10, 1e11)
                        return [b0, b1, b2]
                },
        },
        k21: {
                name: "Knife",
                func: "exp",
                effects: "<b>Iron Key</b> effect",
                base: {
                        initial: new Decimal(1e10),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.m.clickables[102].effect
                                },
                                type: "times",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 2e16)
                        let b1 = Decimal.pow(10, 5e13)
                        let b2 = Decimal.pow(10, 3e11)
                        return [b0, b1, b2]
                },
        },
        k22: {
                name: "Katrina",
                func: "exp",
                effects: "<b>G</b> gain",
                effectSymbol: "^",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active: function(){
                                        return true
                                },
                                amount: function(){
                                        return tmp.m.clickables[32].effect
                                },
                                type: "add",
                        },
                },
                bases(){
                        let b0 = Decimal.pow(10, 2e18)
                        let b1 = Decimal.pow(10, 1e14)
                        let b2 = Decimal.pow(10, 1e12)
                        return [b0, b1, b2]
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
        e23: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return getGoalChallengeReward("44")
                        },
                },
        },
        f12: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return tmp.f.challenges[11].rewardEffect
                        }
                }
        },
        f13: {
                1: {
                        active: function(){
                                return hasUpgrade("g", 31)
                        },
                        amount: function(){
                                return new Decimal(player.f.challenges[11])
                        },
                },
        },
        f21: {
                1: {
                        active: function(){
                                return hasUpgrade("g", 43)
                        },
                        amount: function(){
                                return player.g.rebirths[1]
                        },
                        name: "Rebirth I",
                },
        },
        g31: {
                1: {
                        active: function(){
                                return hasUpgrade("h", 45)
                        },
                        amount: function(){
                                return player.g.rebirths[2]
                        },
                        name: "Rebirth II",
                },
        },
        h21: {
                1: {
                        active: function(){
                                return player.j.puzzle.upgrades.includes(42)
                        },
                        amount: function(){
                                return player.g.rebirths[4]
                        },
                        name: "Rebirth IV",
                },
        },
        h22: {
                1: {
                        active: function(){
                                return true
                        },
                        amount: function(){
                                return tmp.h.challenges[11].rewardEffect
                        }
                }
        },
        i13: {
                1: {
                        active: function(){
                                return hasMilestone("k", 11)
                        },
                        amount: function(){
                                return 10 * player.k.milestones.length
                        },
                },
        },
        i31: {
                1: {
                        active: function(){
                                return hasUpgrade("l", 24)
                        },
                        amount: function(){
                                return tmp.h.challenges[11].rewardEffect
                        },
                },
        },
        i33: {
                1: {
                        active: function(){
                                return hasUpgrade("k", 42)
                        },
                        amount: function(){
                                return totalChallengeComps("h")
                        },
                },
        },
}


/*
Function order:
- Reset buyable extras
- Reset buyable effects
- Update buyable extras
- Update buyable effects
- is buyable defined (bool)
- is buyable unlocked (booL)
- getBuyableTotal (Decimal, amount)
- getCodedBuyableAmount (Decimal, amount)
- isValidBuyableCode (bool)
- getBuyableName (string)
- calcBuyableExtra (recalls it)
- reCalcBuyableExtra (calcs it)
- getAlwaysActiveAdditionalBuyables (returns list)
- getBuyableExtraText (returns text)
- getBuyableEffectFunction (returns function for inputted buyable)
- getBuyableEffectSymbol (returns the symbol that the effect has)
- getBuyableEffectString (returns the effect display string)
- reCalcBuyableBase (calcs it)
- getIdentity (recalls what happens with no effect/disabled)
- reCalcBuyableEffect (calcs it)
- getBuyableBase (recalls it)
- getBuyableBases (recalls it)
- getBuyableCost (calcs it)
- canAffordBuyable (calcs it)
- isBuyableFree
- buyManualBuyable
- buyMaximumBuyable
- getBuyableAmountDisplay (calcs it)
- getBuyableDisplay (calcs it)
*/

var CURRENT_BUYABLE_EXTRAS = {}
var CURRENT_BUYABLE_BASES = {}
var CURRENT_BUYABLE_EFFECTS = {}
var BUYABLES_FUNCTION_NAMES = {
        "exp": {
                "func": BUYABLE_EFFECT_EXPONENTIAL,
                "identity": new Decimal(1),
                "string": "^x",
                "eff": "*",
        },
        "exp_sqrt":{
                "func": BUYABLE_EFFECT_EXPONENTIAL_SQRT,
                "identity": new Decimal(1),
                "string": "^sqrt(x)",
                "eff": "*",
        },
        "exp_cbrt": {
                "func": BUYABLE_EFFECT_EXPONENTIAL_CBRT,
                "identity": new Decimal(1),
                "string": "^cbrt(x)",
                "eff": "*",
        },
        "lin": {
                "func": BUYABLES_EFFECT_LINEAR,
                "identity": new Decimal(0),
                "string": "*x",
                "eff": "+",
        },
        "lin_sqrt": {
                "func": BUYABLES_EFFECT_LINEAR_SQRT,
                "identity": new Decimal(0),
                "string": "*sqrt(x)",
                "eff": "+",
        },
}

function resetCurrBuyableExtras(){ 
        // Fully general
        for (i in MAIN_BUYABLE_DATA){
                CURRENT_BUYABLE_EXTRAS[i] = new Decimal(0)
        }
}
resetCurrBuyableExtras()

function resetCurrBuyableEffects(){
        // NOT fully general
        for (i in MAIN_BUYABLE_DATA){
                data1 = MAIN_BUYABLE_DATA[i]

                let id = getIdentity(i.slice(0,1), i.slice(1,3))
                CURRENT_BUYABLE_BASES[i] = id
                CURRENT_BUYABLE_EFFECTS[i] = id
        }
}
resetCurrBuyableEffects()

function updateAllBuyableExtras(){
        // NOT fully general
        resetCurrBuyableExtras()
        let order = []
        for (i in MAIN_BUYABLE_DATA){
                order.push(i)
        }
        order.reverse()
        for (j in order){
                i = order[j]
                CURRENT_BUYABLE_EXTRAS[i] = reCalcBuyableExtra(i.slice(0,1), i.slice(1,3))
        }
}

function updateAllBuyableEffects(){
        // NOT fully general
        resetCurrBuyableEffects()
        let order = []
        for (i in MAIN_BUYABLE_DATA){
                order.push(i)
        }
        order.reverse()
        for (j in order){
                i = order[j]
                CURRENT_BUYABLE_BASES[i]   = reCalcBuyableBase(  i.slice(0,1), i.slice(1,3))
                CURRENT_BUYABLE_EFFECTS[i] = reCalcBuyableEffect(i.slice(0,1), i.slice(1,3))
        }
}

function isBuyableDefined(layer, id){
        // Fully general
        if (layers[layer] == undefined) return false
        if (layers[layer].buyables == undefined) return false
        return layers[layer].buyables[id] != undefined
}

function isBuyableUnlocked(layer, id){
        // Fully general
        if (!isBuyableDefined(layer, id)) return false
        return layers[layer].buyables[id].unlocked()
}

function getBuyableTotal(layer, id){
        // Fully general
        if (!isBuyableDefined(layer, id)) return new Decimal(0)

        let a = calcBuyableExtra(layer, id)

        return getBuyableAmount(layer, id).plus(a)
}

function getCodedBuyableAmount(code){
        // NOT fully general
        return getBuyableTotal(code.slice(0,1), code.slice(1,3)) 
}

function isValidBuyableCode(code){
        // NOT fully general
        if (code.length != 3) return false
        let letter = code.slice(0,1)
        let num = Number(code.slice(1,3))
        return isBuyableDefined(letter, num)
}

function getBuyableName(code){
        // NOT fully general
        if (MAIN_BUYABLE_DATA[code] != undefined && MAIN_BUYABLE_DATA[code].name != undefined) return MAIN_BUYABLE_DATA[code].name
        console.log("do this " + code)
        return "bug bug bug yeet"
        //return layers[code.slice(0,1)].buyables[code.slice(1,3)].title
}

function getNoExtras(layer, id){
        // remove the lines for this and fully general
        let depth = getChallengeDepth(4)
        if (depth > 0 && layer == "a") return true
        if (depth > 1 && layer == "b") return true
        if (depth > 2 && layer == "c") return true
        return false
}

function calcBuyableExtra(layer, id){
        // Fully general
        if (!isBuyableDefined(layer, id)) return new Decimal(0)
        if (getNoExtras(layer, id)) return new Decimal(0)
        let a = CURRENT_BUYABLE_EXTRAS[layer+id]
        if (a != undefined) return a
        return new Decimal(0)
}

function reCalcBuyableExtra(layer, id){
        // Fully general
        let key = layer + id
        let data = MAIN_BUYABLE_DATA[key] || {}
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

function getAlwaysActiveAdditionalBuyables(layer, id){
        // kinda a spec thing, but basically general
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
        // Fully general
        let a = "<b><h2>Extra levels from</h2>:<br>"
        let extra = false
        let key = layer + id
        let data = MAIN_BUYABLE_DATA[key] || {}
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
        return a.slice(0, a.length-2) + "<br>"
}

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

function BUYABLES_EFFECT_LINEAR_SQRT(a,b){
        return a.times(b.sqrt())
}

function getBuyableEffectFunction(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) return BUYABLE_EFFECT_EXPONENTIAL
        let func = MAIN_BUYABLE_DATA[layer+id]["func"]
        if (typeof func == "function") return func
        return BUYABLES_FUNCTION_NAMES[func]["func"] || BUYABLE_EFFECT_EXPONENTIAL
}

function getBuyableEffectSymbol(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) return "bug"
        let data = MAIN_BUYABLE_DATA[layer+id]
        let func = data["func"]
        
        return data["effectSymbol"] || BUYABLES_FUNCTION_NAMES[func]["eff"] || "bug"
}

function getBuyableEffectString(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) return "bug"
        let func = MAIN_BUYABLE_DATA[layer+id]["func"]
        if (typeof func == "function") return MAIN_BUYABLE_DATA[layer+id]["effectSymbol"]
        return BUYABLES_FUNCTION_NAMES[func]["string"] || "bug"
}

function reCalcBuyableBase(layer, id){
        if (!isValidBuyableCode(layer + id)) {
                console.log("ya boi broke" + layer+ id)
                Decimal(0)
        }
        if (!isBuyableActive(layer, id)) return getIdentity(layer, id)
        let data1 = MAIN_BUYABLE_DATA[layer+id]
        
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
                if (func == "add" || func == "plus") a = a.plus(eff)
                else if (func == "mult" || func == "times") a = a.times(eff)
                else if (func == "exp" || func == "pow") a = a.pow(eff)
                else {
                        console.log("ahh")
                        console.log(b)
                        console.log(layer + id)
                }
                //do the effect to a
        }
        return a
}

function getIdentity(layer, id){
        // Fully general
        let data1 = MAIN_BUYABLE_DATA[layer+id]
        if (typeof data1.func == "function") return data1.identity
        return BUYABLES_FUNCTION_NAMES[data1.func]["identity"]
}

function reCalcBuyableEffect(layer, id){
        // Softcap is not general, otherwise it is
        if (!isBuyableActive(layer, id)) return getIdentity(layer, id)
        let base = CURRENT_BUYABLE_BASES[layer + id]
        let amt = getBuyableTotal(layer, id)
        let ret = getBuyableEffectFunction(layer,id)(base, amt)

        if (softcap_data[layer+"_buy"+id] != undefined){
                ret = softcap(ret, layer+"_buy"+id)
        }

        return ret
}

function getBuyableBase(layer, id){
        // Fully general
        return CURRENT_BUYABLE_BASES[layer + id]
}

function getBuyableBases(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) {
                console.log("ya boi broke" + layer+ id)
                Decimal(0)
        }
        return MAIN_BUYABLE_DATA[layer+id].bases()
}

function getBuyableCost(layer, id, delta = new Decimal(0)){
        // assuming the cost formula is alwuas the same fully general
        let bases = getBuyableBases(layer, id)
        let x = getBuyableAmount(layer, id).plus(delta)

        let base0 = bases[0]
        let base1 = bases[1]
        let base2 = bases[2]
        let exp0 = 1
        let exp1 = x
        let exp2 = x.times(x)

        return Decimal.pow(base0, exp0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
}

function canAffordBuyable(layer, id, cost = undefined){
        // Fully general
        if (player.tab != layer) return false
        let amt = getBuyableAmount(layer, id)
        if (amt.eq(amt.plus(1))) return false
        if (cost == undefined) cost = getBuyableCost(layer, id, 0)
        let a = player[layer].points.gte(cost)
        let b = getBuyableAmount(layer, id).lt(getMaxBuyablesAmount(layer))
        return a && b
}

function isBuyableFree(layer){
        // Spec function
        if (hasMilestone("m", 6)) return true
        if (layer == "a") return hasUpgrade("a", 35) || hasMilestone("goalsii", 2)
        if (layer == "b") return hasUpgrade("b", 52) || hasMilestone("goalsii", 3)
        if (layer == "c") return hasUpgrade("e", 12) || hasMilestone("goalsii", 4)
        if (layer == "d") return hasMilestone("goalsii", 5)
        if (layer == "e") return hasMilestone("goalsii", 24)
        if (layer == "f") return hasUpgrade("i", 13)
        if (layer == "g") return hasUpgrade("i", 13)
        if (layer == "h") return false

        return false
}

function buyManualBuyable(layer, id){
        // Fully general
        let cost = getBuyableCost(layer, id)
        if (!canAffordBuyable(layer, id, cost)) return
        player[layer].buyables[id] = player[layer].buyables[id].plus(1)
        if (isBuyableFree(layer)) return
        player[layer].points = player[layer].points.minus(cost)
}

function buyMaximumBuyable(layer, id, maximum){
        // Fully general
        let maxAllowed = getMaxBuyablesAmount(layer)
        if (getBuyableAmount(layer, id).gte(maxAllowed)) return
        let bases = getBuyableBases(layer, id)
        let pts = player[layer].points
        if (!isBuyableUnlocked(layer, id)) return 
        if (pts.lt(bases[0])) return 
        
        let pttarget = pts.div(bases[0]).log(1.01)
        let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
        //want to find ax^2+bx = c
        let c = pttarget
        let b = bfactor
        let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))

        let target = c.times(a).times(4).plus(b.pow(2)).sqrt().minus(b).div(2).div(a).floor().plus(1)
        //-b + sqrt(b*b+4*c*a)

        target = target.min(maxAllowed)

        let diff = target.minus(player[layer].buyables[id]).max(0)
        if (maximum != undefined) diff = diff.min(maximum)
                                
        player[layer].buyables[id] = player[layer].buyables[id].plus(diff)

        if (isBuyableFree(layer) || diff.eq(0)) return 
        pts = pts.sub(getBuyableCost(layer, id, -1)).max(0)
        //max 0 so nothing goes horribly wrong with weird errors and stuffs
}

function getBuyableAmountDisplay(layer, id){
        // Fully general
        let extra = calcBuyableExtra(layer, id)
        if (extra.eq(0)) return formatWhole(getBuyableAmount(layer, id))
        return formatWhole(getBuyableAmount(layer, id)) + "+" + formatWhole(extra)
}

function getBuyableDisplay(layer, id){
        // other than softcapping fully general
        if (player.tab != layer) return ""
        if (player.subtabs[layer].mainTabs != "Buyables") return ""
        //if we arent on the tab, then we dont care :) (makes it faster)
        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay(layer, id) + "</b><br>"
        let eff1 = "<b><h2>Effect</h2>: " + getBuyableEffectSymbol(layer, id) 
        let savedEff = CURRENT_BUYABLE_EFFECTS[layer + id]
        let eff2 = format(savedEff, 4) + " " + MAIN_BUYABLE_DATA[layer + id]["effects"] + "</b><br>"
        let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost(layer, id)) + " " + getPrestigeName(layer) + "</b><br>"
        let eformula = ""
        if (MAIN_BUYABLE_DATA[layer + id]["eFormula"] != undefined) {
                eformula = MAIN_BUYABLE_DATA[layer + id]["eFormula"]
                if (typeof eformula == "function") eformula = eformula()
                eformula = replaceString(eformula, "[base]", format(getBuyableBase(layer, id), 4))
        } else {
                eformula = format(getBuyableBase(layer, id), 4) + getBuyableEffectString(layer, id)
        }
        //if its undefined set it to that
        //otherwise use normal formula
        let ef1 = "<b><h2>Effect formula</h2>:<br>"
        let ef2 = "</b><br>"

        let exformula = getBuyableExtraText(layer, id)

        let scs = false
        if (softcap_data[layer+"_buy"+id] != undefined && softcap_data[layer+"_buy"+id][1] != undefined){
                scs = softcap_data[layer+"_buy"+id][1].active
                if (scs == undefined) scs = true
                if (typeof scs == "function") scs = scs()
                scs = scs && Decimal.lte(softcap_data[layer+"_buy"+id][1].start, savedEff)
        }

        let scsText = scs ? " (softcapped)" : ""

        let allEff = ef1 + eformula + scsText + ef2

        if (!shiftDown) {
                let end = "Shift to see details"
                let start = amt + eff1 + eff2 + cost
                return "<br>" + start + end
        }

        let bases = getBuyableBases(layer, id)
        let cost1 = "<b><h2>Cost formula</h2>:<br>"
        let cost3 = "</b><br>"
        let cost2a = bases[0].eq(1) ? "" :  "(" + formatBuyableCostBase(bases[0]) + ")"
        let cost2b = bases[1].eq(1) ? "" : "*(" + formatBuyableCostBase(bases[1]) + "^x)"
        let cost2c = bases[2].eq(1) ? "" : "*(" + formatBuyableCostBase(bases[2]) + "^x<sup>2</sup>)" 
        let cost2 = cost2a + cost2b + cost2c
        if (cost2.slice(0,1) == "*") cost2 = cost2.slice(1) //removes the star if its the first character
        let allCost = cost1 + cost2 + cost3


        let end = allEff + exformula + allCost
        return "<br>" + end
}

function formatBuyableCostBase(x){
        if (x.lt(1)) {
                let a = formatBuyableCostBase(Decimal.div(1, x))
                if (a == "1") return "1"
                return "1/" + a
        } else if (x.lt(1.0001)) return "1"
        else if (x.eq(x.floor())) return formatWhole(x)
        else if (x.lt(1.99)) return format(x, 4)
        else if (x.lt(10)) return format(x, 3)
        return format(x)
}

function getGeneralizedBuyableData(layer, id, unlockedTF){
        let title = getBuyableName(layer+id)
        let display = function(){
                return getBuyableDisplay(layer, id)
        }
        let effect = function(){
                return CURRENT_BUYABLE_EFFECTS[layer+id]
        }
        let canAfford = function(){
                return canAffordBuyable(layer, id)
        }
        let total = function(){
                return getBuyableAmount(layer, id).plus(this.extra())
        }
        let extra = function(){
                return calcBuyableExtra(layer, id)
        }
        let buy = function(){
                buyManualBuyable(layer, id)
        }
        let buyMax = function(maximum){
                buyMaximumBuyable(layer, id, maximum)
        }
        return {
                title: title, 
                display: display, 
                effect: effect,
                canAfford: canAfford,
                total: total,
                extra: extra,
                buy: buy,
                buyMax: buyMax,
                unlocked: unlockedTF,
                }
}

// GENERAL BUYABLE SUPPORT

function isBuyableActive(layer, thang){
        if (layer == "o") return true
        if (layer == "n") return true
        if (layer == "m") return true
        if (layer == "l") return true
        if (layer == "k") return true
        if (inChallenge("k", 11)) return hasUpgrade("m", 23) && layer != "a"
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
        console.log(layer, thang)
        return true
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

function getMaxBuyablesAmount(layer){
        let ret = Decimal.pow(10, 20)
        if (layer == "a") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "b") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "c") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "d") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "e") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "f") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "g") {
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["h21"])
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
        }
        if (layer == "h"){
                if (hasUpgrade("k", 32)) ret = ret.times(Decimal.pow(2, player.k.lock.repeatables[45]))
                if (hasUpgrade("j", 52)) ret = ret.times(Decimal.pow(2.5, player.l.upgrades.length))
        }
        if (layer == "i"){
                ret = ret.times(tmp.m.clickables[72].effect)
        }
        return ret
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

