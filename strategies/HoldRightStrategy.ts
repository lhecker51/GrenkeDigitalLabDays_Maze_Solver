import {Direction} from "../util";
import {HoldWallStrategy} from "./HoldWallStrategy";

class HoldRightStrategy extends HoldWallStrategy  {
    getNecessaryDirection(): Direction {
        switch (super.previousDirection) {
            case "U": return "R"
            case "R": return "D"
            case "L": return "U"
            case "D": return "L"
        }
    }


}