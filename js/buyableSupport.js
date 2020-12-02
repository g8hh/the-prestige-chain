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
var FREE_BUYABLE_DATA = {
        a11: {
                name: "All",
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
        },
        a33: {
                name: "Omnipotent I",
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
                c32: {
                        active: function(){
                                return hasMilestone("goalsii", 10)
                        },
                },
        },
        c32: {
                name: "Catagory",
        },
        d11: {
                name: "Department",
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
        },
        d12: {
                name: "December",
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
                d22: {
                        active: function(){
                                return hasUpgrade("e", 24)
                        },
                },
        },
        d22: {
                name: "Director",
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
                }
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
        let a = new Decimal(0)
        if (CURRENT_BUYABLE_EXTRAS[layer+id] != undefined) a = CURRENT_BUYABLE_EXTRAS[layer+id]
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
        return layers[code.slice(0,1)].buyables[code.slice(1,3)].title
}

function calcBuyableExtra(layer, id){
        if (!isBuyableDefined(layer, id)) return new Decimal(0)
        let a = new Decimal(0)
        if (CURRENT_BUYABLE_EXTRAS[layer+id] != undefined) a = CURRENT_BUYABLE_EXTRAS[layer+id]
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
        let depth = getChallengeDepth(4)
        if (depth > 0 && layer == "a") return []
        if (depth > 1 && layer == "b") return []
        if (depth > 2 && layer == "c") return []

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





