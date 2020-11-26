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
        a33: {
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
        },
        b31: {
                b32: {
                        active: function(){
                                return hasUpgrade("c", 45)
                        }
                },
        },
        b33: {
                c22: {
                        active: function(){
                                return hasUpgrade("c", 54)
                        }
                },
        },
        c11: {
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
                c21: {
                        active: function(){
                                return hasUpgrade("d", 33)
                        }
                },
                c22: {
                        active: function(){
                                return hasUpgrade("e", 12)
                        }
                },
        },
        c21: {
                c22: {
                        active: function(){
                                return hasUpgrade("c", 54)
                        }
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
                        }
                },
        },
}

function isBuyableDefined(layer, id){
        if (layers[layer] == undefined) return false
        if (layers[layer].buyables == undefined) return false
        return layers[layer].buyables[id] != undefined
}

function getBuyableTotal(layer, id){
        if (!isBuyableDefined(layer, id)) return new Decimal(0)
        return tmp[layer].buyables[id].total
}

function getCodedBuyableAmount(code){
        return getBuyableTotal(code.slice(0,1), code.slice(1,3)) 
}

function calcBuyableExtra(layer, id){
        let key = layer + id
        let data = FREE_BUYABLE_DATA[key] || {}
        if (data == undefined) return new Decimal(0)
        let amt = new Decimal(0)
        for (i in data) {
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







