import {Direction} from "../util";
import {HoldWallStrategy} from "./HoldWallStrategy";

class HoldLeftStrategy extends HoldWallStrategy  {
    getNecessaryDirection(): Direction {
        switch (super.getPreviousDirection()) {
            case "U": return "L"
            case "R": return "U"
            case "L": return "D"
            case "D": return "R"
        }
    }


}