import {Direction} from "../util";
import {HoldWallStrategy} from "./HoldWallStrategy";

class HoldRightStrategy extends HoldWallStrategy  {
    getNecessaryDirection(): Direction {
        //This is a test, I don't know what's going on exactly
        switch (super.getPreviousDirection()) {
            case "U": return "R"
            case "R": return "D"
            case "L": return "U"
            case "D": return "L"
        }
    }


}