import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class RemoveMana implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.removeMana;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let manastring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let actualMana: number = recipientCharacter.getCharakterStats().getMana()
            let maxMana: number = recipientCharacter.getMaxStats().getMana()
            try {
                let manaCount: number = +args[0]
                if (actualMana - manaCount <= 0) {
                    manastring = parseResponseString(dungeonMasterSendMessages.removeMana, (actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: manastring })

                    manastring = parseResponseString(dungeonMasterSendMessages.ManaRemoved, recipientCharacter.name , (actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: manastring } )

                    recipientCharacter.getCharakterStats().setMana(0)

                } else if (actualMana - manaCount > 0) {
                    actualMana = actualMana - manaCount 
                    recipientCharacter.getCharakterStats().setMana(actualMana)
                    
                    manastring = parseResponseString(dungeonMasterSendMessages.removeMana, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message",{ message: manastring })

                    manastring = parseResponseString(dungeonMasterSendMessages.ManaRemoved, recipientCharacter.name , args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: manastring })
                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)

            } catch (e) {
                //console.log(e)
                amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(errorMessages.actionDoesNotExist, recipientCharacterName) })
            }

        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
