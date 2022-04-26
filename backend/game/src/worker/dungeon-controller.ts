import { AmqpAdapter } from "./amqp-adapter";
import { CharacterGenderImpl, CharacterImpl, CharacterSpeciesImpl, CharacterStatsImpl, Dungeon } from "../dungeon/dungeon"
import { ConsumeMessage } from "amqplib";
import { ActionHandlerImpl, ActionHandler } from "./action/action-handler";


export class DungeonController {

    private dungeonID: string;
    private amqpAdapter: AmqpAdapter;
    private actionHandler: ActionHandler;
    private dungeon: Dungeon;

    constructor(dungeonID: string, amqpAdapter: AmqpAdapter, dungeon: Dungeon) {
        this.dungeonID = dungeonID;
        this.amqpAdapter = amqpAdapter;
        this.dungeon = dungeon;

        this.actionHandler = new ActionHandlerImpl(this);
    }

    init() {
        this.amqpAdapter.consume((consumeMessage: ConsumeMessage) => {
            let data = JSON.parse(consumeMessage.content.toString());
            console.log(data);
            switch (data.action) {
                case 'login':
                    this.amqpAdapter.initClient(data.character);
                    break;
                case 'message':
                    this.actionHandler.processAction(data.character, data.data.message);
                    break;
            }
            // TODO: check verifyToken
            // this.actionHandler.processAction(data.character, data.data.message);
        });
    }

    createCharacter(name: string) {
        new CharacterImpl(
            name,
            name,
            '1',
            name,
            'Magier',
            new CharacterSpeciesImpl(
                '1',
                'Hexer',
                'Hexiger Hexer'
            ),
            new CharacterGenderImpl(
                '1',
                'Mann',
                'Maennlicher Mann'
            ),
            new CharacterStatsImpl(100, 20, 100),
            new CharacterStatsImpl(100, 20, 100),
            "1",
            ["1"]
        )
    }

    getDungeon(): Dungeon {
        return this.dungeon
    }

    getAmqpAdapter(): AmqpAdapter {
        return this.amqpAdapter
    }

    
}
