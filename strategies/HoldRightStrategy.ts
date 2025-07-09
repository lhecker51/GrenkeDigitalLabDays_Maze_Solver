import {Direction} from "../util";
import {HoldWallStrategy} from "./HoldWallStrategy";

export class HoldRightStrategy extends HoldWallStrategy  {
    getNecessaryDirection(): Direction {
        //This is a test, I don't know what's going on exactly lol
        switch (super.getPreviousDirection()) {
            case "U": return "R"
            case "R": return "D"
            case "L": return "U"
            case "D": return "L"
        }
    }


}