import { Unit } from "./unit.js";
import { randomInt } from "./undym/random.js";
export class Battle {
    constructor() { }
    static getPhaseUnit() {
        return Unit.all[this.phase];
    }
    static setup(type, battleEndAction) {
        this.start = true;
        this.type = type;
        this.result = BattleResult.LOSE;
        this.battleEndAction = battleEndAction;
        this.turn = 0;
        this.firstPhase = randomInt(0, Unit.all.length);
        this.phase = (Battle.firstPhase + Unit.all.length - 1) % Unit.all.length;
        // this.attacker = Unit.all[0];
        // this.target = Unit.all[0];
    }
}
Battle.start = false;
Battle.phase = 0;
Battle.firstPhase = 0;
Battle.turn = 0;
/**敵の補充ルーチンを書く。敵全滅時実行され、敵ユニットを補充する。配列が空になるまで、全滅・補充を繰り返す。 */
Battle.setReserveUnits = [];
export class BattleType {
    constructor() { }
}
BattleType.NORMAL = new BattleType();
BattleType.BOSS = new BattleType();
BattleType.EX = new BattleType();
BattleType.DUNGEON_CLEAR = new BattleType();
export var BattleResult;
(function (BattleResult) {
    BattleResult[BattleResult["WIN"] = 0] = "WIN";
    BattleResult[BattleResult["LOSE"] = 1] = "LOSE";
    BattleResult[BattleResult["ESCAPE"] = 2] = "ESCAPE";
})(BattleResult || (BattleResult = {}));
