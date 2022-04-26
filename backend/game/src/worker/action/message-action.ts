import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DungeonController } from "../dungeon-controller"

/**
 * Action that gets performed when user sends a "sag" message.
 */
export class MessageAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "sag";
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let senderCharacter: Character = this.dungeonController.getDungeon().getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let roomId: string = senderCharacter.getPosition()
        let room: Room = this.dungeonController.getDungeon().getRoom(roomId)
        let roomName: string = room.getName()
        let dungeonId: string = this.dungeonController.getDungeon().getId()
        let responseMessage: string = `[${roomName}] ${senderCharacterName} sagt ${messageBody}`
        // let routingKey = `${dungeonId}.room.${roomId}`
        // this.dungeonController.getAmqpAdapter().sendWithRouting(routingKey, {action: "message", data: {message: responseMessage}})
        this.dungeonController.getAmqpAdapter().broadcast({action: "message", data: {message: responseMessage}});
    }
}