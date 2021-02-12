/*

missions: {
        completed: {
                list: [],
                total: 0,
        },
        maxMissions: 1,
        currentMissions: [
                {
                        requirement: new Decimal(789),
                        getAmount(){
                                return totalChallengeComps("h")
                        },
                        name: "<b>H</b> challenge completions",
                        progress: "lin", //lin, log, exp
                        rewardPassive: .1,
                        rewardOnce: 20,
                        id: 1,
                },
        ],
        money: new Decimal(0),
        moneyPassive: new Decimal(0),
},
*/

var FIXED_MISSION_DATA = {
        1: {
                requirement: new Decimal(789),
                amountType: "h challs",
                name: "<b>H</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.1),
                rewardOnce: new Decimal(20),  
                id: 1,
        },
        2: {
                requirement: new Decimal(79),
                amountType: "diamond key",
                name: "<b>Diamond Keys</b>",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.15),
                rewardOnce: new Decimal(50),  
                id: 2,
        },
        3: {
                requirement: new Decimal(353),
                amountType: "k challs",
                name: "<b>K</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.2),
                rewardOnce: new Decimal(100),  
                id: 3,
        },
        4: {
                requirement: Decimal.pow(10, 2000),
                amountType: "m points",
                name: "<b>M</b>",
                progress: "log", //lin, log, exp
                rewardPassive: new Decimal(.3),
                rewardOnce: new Decimal(300),  
                id: 4,
        },
        5: {
                requirement: new Decimal(355),
                amountType: "k challs",
                name: "<b>K</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.2),
                rewardOnce: new Decimal(1000),  
                id: 5,
        },
        6: {
                requirement: Decimal.pow(10, 4000),
                amountType: "m points",
                name: "<b>M</b>",
                progress: "log", //lin, log, exp
                rewardPassive: new Decimal(.3),
                rewardOnce: new Decimal(1300),  
                id: 6,
        },
        7: {
                requirement: Decimal.pow(10, 4567).times(1.23),
                amountType: "m points",
                name: "<b>M</b>",
                progress: "log", //lin, log, exp
                rewardPassive: new Decimal(.5),
                rewardOnce: new Decimal(2500),  
                id: 7,
        },
        8: {
                requirement: new Decimal(362),
                amountType: "k challs",
                name: "<b>K</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.6),
                rewardOnce: new Decimal(3500),  
                id: 8,
        },
        9: {
                requirement: new Decimal(365),
                amountType: "k challs",
                name: "<b>K</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.6),
                rewardOnce: new Decimal(5000),  
                id: 9,
        },
        
}

function getMissionsAmount(s){
        let layer = s.split(" ")[0];
        let attr = s.split(" ")[1];
        if (attr == "challs"){
                return totalChallengeComps(layer);
        }
        if (attr == "points"){
                return player[layer].points;
        }
        if (attr == "key"){
                if (layer == "diamond") return player.k.lock.repeatables[82]
        }
        console.log("adsahshdashdba")
        return 0
}


function getMissionProgress(data){
        let req = data.requirement
        let amt = getMissionsAmount(data.amountType)
        if (data.progress == "lin"){
                return Decimal.div(amt, req).toNumber()
        }
        if (data.progress == "log"){
                if (new Decimal(req).lt(1)) return 0
                return Decimal.div(Decimal.ln(amt), Decimal.ln(req)).toNumber()
        }
        if (data.progress == "exp"){
                return Decimal.pow(2, Decimal.sub(amt, req)).toNumber()
        }
}

function getNextMission(){
        let data = player.m.missions
        let comp = data.completed
        let curr = data.currentMissions
        for (i = 1; i <= Object.keys(FIXED_MISSION_DATA).length; i ++) {
                if (comp.list.includes(i)) continue
                for (j in curr){
                        k = curr[j]
                        if (k.id == i) continue
                }
                return FIXED_MISSION_DATA[i]
        }
        console.log("OOOPS")
        return {
                requirement: Decimal.pow(10, 1e20),
                amountType: "m points",
                name: "<b>M</b>",
                progress: "log", //lin, log, exp
                rewardPassive: new Decimal(.5),
                rewardOnce: new Decimal(2500),  
                id: 1236712631723,
        }
}

function isMissionComplete(data){
        return Decimal.gte(getMissionsAmount(data.amountType), data.requirement)
}

function attemptCompleteMission(id){
        let data2 = player.m.missions
        data = data2.currentMissions[id]
        if (!isMissionComplete(data)) return 
        data2.money = data2.money.plus(data.rewardOnce)
        data2.moneyPassive = data2.moneyPassive.plus(data.rewardPassive)
        data2.currentMissions = data2.currentMissions.slice(0, id).concat(data2.currentMissions.slice(id+1))
        data2.completed.list.push(data.id)
        data2.completed.total ++
        // remove the given mission
}

function getTaxRate(){
        let ret = .0002
        if (hasUpgrade("l", 42)) ret *= 5
        return ret
}

function getMoneyPerSecond(){
        let ret = player.m.missions.moneyPassive
        ret = ret.plus(tmp.m.clickables[11].effect)
        ret = ret.plus(tmp.m.clickables[61].effect)

        for (i = 11; i < 156; i++){
                if (tmp.m.clickables[i] == undefined) continue
                ret = ret.sub(tmp.m.clickables[i].passiveCost)
        }

        if (hasUpgrade("m", 24)) ret = ret.plus(.2)
        
        return ret.max(0)
}

function getActualMoneyPerSecond(){
        let a = player.m.missions.money.times(getTaxRate())
        return getMoneyPerSecond().sub(a)
}

function doPassiveMoneyGeneration(diff){
        player.m.missions.money = player.m.missions.money.plus(getMoneyPerSecond().times(diff))
        player.m.missions.money = player.m.missions.money.times(Decimal.pow(1-getTaxRate(), diff))
}

function updateMissions(diff){
        let data = player.m.missions
        doPassiveMoneyGeneration(diff)

        for (let i = 0; i < data.currentMissions.length; i ++){
                attemptCompleteMission(i)
        } // check if youve completed them
        
        if (data.maxMissions > data.currentMissions.length){
                data.currentMissions.push(getNextMission())
        } // give new goals if so


        // NOT DONE YET
        // update the displays
}

function makeMissionsDecimal(){
        let d = player.m.missions.currentMissions
        for (i in d){
                if (d[i].rewardOnce) d[i].rewardOnce = new Decimal(d[i].rewardOnce)
                if (d[i].rewardPassive) d[i].rewardPassive = new Decimal(d[i].rewardPassive)
                if (d[i].requirement) d[i].requirement = new Decimal(d[i].requirement)
        }
}









