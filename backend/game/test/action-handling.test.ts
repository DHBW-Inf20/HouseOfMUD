import { ActionElement, ActionElementImpl } from "../src/data/interfaces/actionElement";
import { ActionEventImpl } from "../src/data/interfaces/actionEvent";
import { Character, CharacterImpl } from "../src/data/interfaces/character";
import { CharacterClass, CharacterClassImpl } from "../src/data/interfaces/characterClass";
import { CharacterGender, CharacterGenderImpl } from "../src/data/interfaces/characterGender";
import { CharacterSpecies, CharacterSpeciesImpl } from "../src/data/interfaces/characterSpecies";
import { CharacterStats, CharacterStatsImpl } from "../src/data/interfaces/characterStats";
import { ConnectionInfo, ConnectionInfoImpl } from "../src/data/interfaces/connectionInfo";
import { Dungeon, DungeonImpl } from "../src/data/interfaces/dungeon";
import { Item, ItemImpl } from "../src/data/interfaces/item";
import { ItemInfo } from "../src/data/interfaces/itemInfo";
import { Npc, NpcImpl } from "../src/data/interfaces/npc";
import { Room, RoomImpl } from "../src/data/interfaces/room";
import { ActionHandler, ActionHandlerImpl } from "../src/worker/action/action-handler";
import { actionMessages, errorMessages, triggers } from "../src/worker/action/actions/action-resources";
import { BroadcastMessageAction } from "../src/worker/action/actions/broadcast-message-action";
import { DiscardAction } from "../src/worker/action/actions/discard-action";
import { DungeonAction } from "../src/worker/action/actions/dungeon-action";
import { InspectAction } from "../src/worker/action/actions/inspect-action";
import InvalidAction from "../src/worker/action/actions/invalid-action";
import { InventoryAction } from "../src/worker/action/actions/inventory-action";
import { LookAction } from "../src/worker/action/actions/look-action";
import { MessageAction } from "../src/worker/action/actions/message-action";
import { MessageMasterAction } from "../src/worker/action/actions/message-dm-action";
import { MoveAction } from "../src/worker/action/actions/move-action";
import { PickupAction } from "../src/worker/action/actions/pickup-action";
import { PrivateMessageAction } from "../src/worker/action/actions/private-message-action";
import UnspecifiedAction from "../src/worker/action/actions/unspecified-action";
import { AddDamage } from "../src/worker/action/dmactions/addDamage-action";
import { AddHp } from "../src/worker/action/dmactions/addHp-action";
import { AddMana } from "../src/worker/action/dmactions/addMana-action";
import { AmqpAdapter } from "../src/worker/amqp/amqp-adapter";
import { DungeonController } from "../src/worker/controller/dungeon-controller";

// Testdaten
const amqpAdapter: AmqpAdapter = new AmqpAdapter(
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test'
);
const TestSpecies: CharacterSpecies = new CharacterSpeciesImpl(
    '1',
    'Hexer',
    'Hexiger Hexer'
);
const TestStartStats: CharacterStats = new CharacterStatsImpl(50, 10, 50);
const TestMaxStats: CharacterStats = new CharacterStatsImpl(100, 20, 100);
const TestGender: CharacterGender = new CharacterGenderImpl(
    '1',
    'Mann',
    'Maennlicher Mann'
);
const TestClass: CharacterClass = new CharacterClassImpl(
    '1',
    'Magier',
    'Magischer Magier',
    TestMaxStats,
    TestStartStats
);
const TestNpc: Npc = new NpcImpl(
    '1',
    'Bernd',
    'Bernd liebt die Musik',
    'Barde'
);
const TestItem: Item = new ItemImpl('1', 'Apfel', 'Apfliger Apfel');
const TestItemDiscard: Item = new ItemImpl('2', 'Schwert', 'Schwertiges Schwert');
const TestItemPickup: Item = new ItemImpl('3', 'Gold', 'Goldiges Gold')
const TestItemRemoveHp: Item = new ItemImpl('4', 'Giftpilz', 'Test');
const TestItemAddMana: Item = new ItemImpl('5', 'Manatrank', 'Test');
const TestItemRemoveItem: Item = new ItemImpl('6', 'Stein', 'Test');

const TestConnections: ConnectionInfo = new ConnectionInfoImpl(
    'open',
    'open'
);
const TestActionAddHp: ActionElement = new ActionElementImpl(
    '1',
    'essen Apfel',
    'Du hast einen Apfel gegessen!',
    'test',
    [new ActionEventImpl('addhp', '10')],
    [new ItemInfo(TestItem.id, 1)]
);
const TestActionRemoveHp: ActionElement = new ActionElementImpl(
    '2',
    'essen Giftpilz',
    'Du hast einen Giftpilz gegessen!',
    'test',
    [new ActionEventImpl('removehp', '20')],
    [new ItemInfo(TestItemRemoveHp.id, 1)]
);
const TestActionAddMana: ActionElement = new ActionElementImpl(
    '3',
    'trinken Manatrank',
    'Du hast einen Manatrank getrunken!',
    'test',
    [new ActionEventImpl('addmana', '10')],
    [new ItemInfo(TestItemAddMana.id, 1)]
);
const TestActionRemoveMana: ActionElement = new ActionElementImpl(
    '4',
    'trinke aus dem Brunnen',
    'Du hast aus dem Brunnen getrunken!',
    'test',
    [new ActionEventImpl('removemana', '20')],
    []
);
const TestActionAddDamage: ActionElement = new ActionElementImpl(
    '5',
    'trinke Bier',
    'Du hast ein Bier getrunken!',
    'test',
    [new ActionEventImpl('adddmg', '10')],
    []
);
const TestActionRemoveDamage: ActionElement = new ActionElementImpl(
    '6',
    'nahkampf',
    'Du wechselst in den Nahkampf!',
    'test',
    [new ActionEventImpl('removedmg', '5')],
    []
);
const TestActionRemoveItem: ActionElement = new ActionElementImpl(
    '7',
    'werfe Stein',
    'Du hast einen Stein geworfen!',
    'test',
    [new ActionEventImpl('removeItem', '6')],
    [new ItemInfo(TestItemRemoveItem.id, 1)]
);
const TestActionAddItem: ActionElement = new ActionElementImpl(
    '8',
    'oeffne Truhe',
    'Du hast die Truhe geoeffnet!',
    'test',
    [new ActionEventImpl('additem', '3')],
    []
);
const TestActionInOtherRoom: ActionElement = new ActionElementImpl(
    '9',
    'test',
    'test',
    'test',
    [new ActionEventImpl('addhp', '3')],
    []
);
const TestActionItemMissing: ActionElement = new ActionElementImpl(
    '10',
    'kaufe leben',
    'test',
    'test',
    [new ActionEventImpl('addhp', '3')],
    [new ItemInfo(TestItemPickup.id, 1)]
);

const TestRoom: Room = new RoomImpl(
    '1',
    'Raum-1',
    'Der Raum in dem alles begann',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    TestConnections,
    [TestActionAddHp.id],
    2,
    2
);
const TestRoomNorth: Room = new RoomImpl(
    '2',
    'Raum-N',
    'Der Raum im Norden',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('inactive', 'open'),
    [TestActionAddHp.id],
    2,
    1
);
const TestRoomEast: Room = new RoomImpl(
    '3',
    'Raum-O',
    'Der Raum im Osten',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestActionAddHp.id],
    3,
    2
);
const TestRoomSouth: Room = new RoomImpl(
    '4',
    'Raum-S',
    'Der Raum im Sueden',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestActionAddHp.id],
    2,
    3
);
const TestRoomWest: Room = new RoomImpl(
    '5',
    'Raum-W',
    'Der Raum im Westen',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('open', 'inactive'),
    [TestActionAddHp.id],
    1,
    2
);
const TestRoomNorthNorth: Room = new RoomImpl(
    '6',
    'Raum-NN',
    'Der Raum im Norden, Norden',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('inactive', 'closed'),
    [TestActionAddHp.id],
    2,
    0
);
const TestRoomNorthEast: Room = new RoomImpl(
    '7',
    'Raum-NE',
    'Der Raum im Norden, dann Osten',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestActionAddHp.id, TestActionInOtherRoom.id],
    3,
    1
);
const TestRoomActions: Room = new RoomImpl(
    '8',
    'Raum-A',
    'Der Raum zum Testen der dungeonspezifischen Aktionen',
    [TestNpc.id],
    [new ItemInfo(TestItem.id,1)],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestActionAddHp.id, TestActionRemoveHp.id, TestActionAddMana.id, TestActionRemoveMana.id, TestActionAddDamage.id, TestActionRemoveDamage.id, TestActionAddItem.id, TestActionRemoveItem.id, TestActionItemMissing.id],
    10,
    10
);
const TestCharacter: Character = new CharacterImpl(
    '1',
    '1',
    'Jeff',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoom.id,
    [new ItemInfo(TestItem.id,1)]
);
const TestCharacterSameRoom: Character = new CharacterImpl(
    '2',
    '1',
    'Spieler',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoom.id,
    [new ItemInfo(TestItem.id,1)]
);
const TestCharacterNotSameRoom: Character = new CharacterImpl(
    '3',
    '1',
    'Bob',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoomNorth.id,
    [new ItemInfo(TestItem.id,1)]
);
const TestCharacterDungeonActions: Character = new CharacterImpl(
    '4',
    '1',
    'CoolerTyp',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoomActions.id,
    [new ItemInfo(TestItem.id, 1), new ItemInfo(TestItemAddMana.id, 1), new ItemInfo(TestItemRemoveHp.id, 2), new ItemInfo(TestItemRemoveItem.id, 1)]
);
const TestDungeon: Dungeon = new DungeonImpl(
    '1',
    'TestDungeon1',
    'Test',
    '1',
    '1',
    2,
    1,
    [TestSpecies],
    [TestClass],
    [TestGender],
    [TestCharacter, TestCharacterSameRoom, TestCharacterNotSameRoom, TestCharacterDungeonActions],
    [
        TestRoom,
        TestRoomNorth,
        TestRoomEast,
        TestRoomSouth,
        TestRoomWest,
        TestRoomNorthNorth,
        TestRoomNorthEast,
        TestRoomActions
    ],
    ['abc'],
    [TestActionAddHp, TestActionRemoveHp, TestActionAddMana, TestActionRemoveMana, TestActionAddDamage, TestActionRemoveDamage, TestActionAddItem, TestActionRemoveItem, TestActionInOtherRoom, TestActionItemMissing],
    [TestItem, TestItemDiscard, TestItemPickup, TestItemAddMana, TestItemRemoveHp, TestItemRemoveItem],
    [TestNpc]
);
const TestDungeonController: DungeonController = new DungeonController(
    '1',
    amqpAdapter,
    TestDungeon
);

describe('ActionHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const messageAction: MessageAction = actionHandler.actions[triggers.message] as MessageAction;
    const privateMessageAction: PrivateMessageAction = actionHandler.actions[triggers.whisper] as PrivateMessageAction;
    const messageMasterAction: MessageMasterAction = actionHandler.actions[triggers.messageMaster] as MessageMasterAction;
    const broadcastMessageAction: BroadcastMessageAction = actionHandler.actions[triggers.broadcast] as BroadcastMessageAction;
    const discardAction: DiscardAction = actionHandler.actions[triggers.discard] as DiscardAction;
    const inspectAction: InspectAction = actionHandler.actions[triggers.inspect] as InspectAction;
    const inventoryAction: InventoryAction = actionHandler.actions[triggers.inventory] as InventoryAction;
    const lookAction: LookAction = actionHandler.actions[triggers.look] as LookAction;
    const moveAction: MoveAction = actionHandler.actions[triggers.move] as MoveAction;
    const pickupAction: PickupAction = actionHandler.actions[triggers.pickup] as PickupAction;
    const dungeonAction: DungeonAction = actionHandler.dungeonActions['essen Apfel'];
    const unspecifiedAction: UnspecifiedAction = actionHandler.actions[triggers.unspecified] as UnspecifiedAction;
    const invalidAction: InvalidAction = actionHandler.invalidAction;
    
    messageAction.performAction = jest.fn();
    privateMessageAction.performAction = jest.fn();
    messageMasterAction.performAction = jest.fn();
    broadcastMessageAction.performAction = jest.fn();
    discardAction.performAction = jest.fn();
    inspectAction.performAction = jest.fn();
    inventoryAction.performAction = jest.fn();
    lookAction.performAction = jest.fn();
    moveAction.performAction = jest.fn();
    pickupAction.performAction = jest.fn();
    dungeonAction.performAction = jest.fn();
    unspecifiedAction.performAction = jest.fn();
    invalidAction.performAction = jest.fn();

    test('ActionHandler should call performAction on InvalidAction when the dungeon master tries an action that isnt either fluester or broadcast', () => {
        actionHandler.processAction('0', `${triggers.message} Hallo`);
        actionHandler.processAction('0', `${triggers.messageMaster} Hallo`);
        actionHandler.processAction('0', `${triggers.discard} Apfel`);
        actionHandler.processAction('0', `${triggers.inspect} Apfel`);
        actionHandler.processAction('0', triggers.inventory);
        actionHandler.processAction('0', triggers.look);
        actionHandler.processAction('0', `${triggers.pickup} Apfel`);
        actionHandler.processAction('0', `essen Apfel`);
        actionHandler.processAction('0', `${triggers.unspecified} Test`);
        expect(messageAction.performAction).not.toHaveBeenCalled()
        expect(messageMasterAction.performAction).not.toHaveBeenCalled()
        expect(discardAction.performAction).not.toHaveBeenCalled()
        expect(inspectAction.performAction).not.toHaveBeenCalled()
        expect(inventoryAction.performAction).not.toHaveBeenCalled()
        expect(lookAction.performAction).not.toHaveBeenCalled()
        expect(pickupAction.performAction).not.toHaveBeenCalled()
        expect(dungeonAction.performAction).not.toHaveBeenCalled()
        expect(unspecifiedAction.performAction).not.toHaveBeenCalled()
    })

    test('ActionHandler should call performAction on MessageAction with the correct parameters when it receives a "sag" action message', () => {
        actionHandler.processAction('Jeff', `sag Hallo`);
        expect(messageAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Hallo',
        ]);
    });
    test('ActionHandler should call performAction on PrivateMessageAction with the correct parameters when it receives a "fluester" action message', () => {
        actionHandler.processAction('Jeff', `fluester Spieler Hallo`);
        expect(privateMessageAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Spieler',
            'Hallo',
        ]);
    });
    test('ActionHandler should call performAction on DiscardAction with the correct parameters when it receives a "ablegen" action message', () => {
        actionHandler.processAction('Jeff', `ablegen Apfel`);
        expect(discardAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on InspectAction with the correct parameters when it receives a "untersuche" action message', () => {
        actionHandler.processAction('Jeff', `untersuche Apfel`);
        expect(inspectAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on InventoryAction with the correct parameters when it receives a "inv" action message', () => {
        actionHandler.processAction('Jeff', "inv");
        expect(inventoryAction.performAction).toHaveBeenCalledWith('Jeff', []);
    });
    test('ActionHandler should call performAction on LookAction with the correct parameters when it receives a "umschauen" action message', () => {
        actionHandler.processAction('Jeff', 'umschauen');
        expect(lookAction.performAction).toHaveBeenCalledWith('Jeff', []);
    });
    test('ActionHandler should call performAction on MoveAction with the correct parameters when it receives a "gehe" action message', () => {
        actionHandler.processAction('Jeff', `gehe Norden`);
        expect(moveAction.performAction).toHaveBeenCalledWith('Jeff', ['Norden']);
    });
    test('ActionHandler should call performAction on PickupAction with the correct parameters when it receives a "aufheben" action message', () => {
        actionHandler.processAction('Jeff', `aufheben Apfel`);
        expect(pickupAction.performAction).toHaveBeenCalledWith('Jeff', ['Apfel']);
    });
    test('ActionHandler should call performAction on DungeonAction with the correct parameters when it receives a non standard action message', () => {
        actionHandler.processAction('Jeff', 'essen Apfel');
        expect(dungeonAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on UnspecifiedAction with the correct parameters when it receives an action message for the dungeon master', () => {
        actionHandler.processAction('Jeff', `dm Test`);
        expect(unspecifiedAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Test',
        ]);
    });
    test('ActionHandler should call performAction on InvalidAction with the correct parameters when it receives an invalid action message', () => {
        actionHandler.processAction('Jeff', 'angriff Monster');
        expect(invalidAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Monster',
        ]);
    });
    //Tests with dungeon master as user
    test('ActionHandler should call performAction on PrivateMessageAction when the dungeon master sends a message to a user', () => {
        actionHandler.processAction('0', `fluester Spieler Hilfe`);
        expect(privateMessageAction.performAction).toHaveBeenCalledWith('0', ['Spieler', 'Hilfe'])
    })
    test('ActionHandler should call performAction on BroadcastMessage when the dungeon master broadcasts a message to all users', () => {
        actionHandler.processAction('0', `broadcast Hallo`);
        expect(broadcastMessageAction.performAction).toHaveBeenCalledWith('0', ['Hallo'])
    })
    test('ActionHandler should call performAction on InvalidAction when a regular player tries to use the broadcast action', () => {
        actionHandler.processAction('Jeff', `broadcast Hallo`);
        expect(invalidAction.performAction).toHaveBeenCalledWith('Jeff', ['Hallo'])
    })
    test('ActionHandler should call performAction on MessageMasterAction with the correct parameters when it receives a "fluesterdm" action message', () => {
        actionHandler.processAction('Jeff', `fluesterdm Hallo`);
        expect(messageMasterAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Hallo',
        ]);
    });
    
});

describe('Actions', () => {
    beforeAll(() => {
        console.log(TestDungeon)
    })
    beforeEach(() => {
        TestDungeon.characters['Jeff'].position = TestRoom.id;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const messageAction: MessageAction = actionHandler.actions[triggers.message] as MessageAction;
    const privateMessageAction: PrivateMessageAction = actionHandler.actions[triggers.whisper] as PrivateMessageAction;
    const messageMasterAction: MessageMasterAction = actionHandler.actions[triggers.messageMaster] as MessageMasterAction;
    const broadcastMessageAction: BroadcastMessageAction = actionHandler.actions[triggers.broadcast] as BroadcastMessageAction;
    const discardAction: DiscardAction = actionHandler.actions[triggers.discard] as DiscardAction;
    const inspectAction: InspectAction = actionHandler.actions[triggers.inspect] as InspectAction;
    const inventoryAction: InventoryAction = actionHandler.actions[triggers.inventory] as InventoryAction;
    const lookAction: LookAction = actionHandler.actions[triggers.look] as LookAction;
    const moveAction: MoveAction = actionHandler.actions[triggers.move] as MoveAction;
    const pickupAction: PickupAction = actionHandler.actions[triggers.pickup] as PickupAction;
    const dungeonAction: DungeonAction = actionHandler.dungeonActions['essen Apfel'];
    const unspecifiedAction: UnspecifiedAction = actionHandler.actions[triggers.unspecified] as UnspecifiedAction;
    const invalidAction: InvalidAction = actionHandler.invalidAction;

    amqpAdapter.sendWithRouting = jest.fn();
    amqpAdapter.sendToClient = jest.fn();
    amqpAdapter.broadcast = jest.fn();
    amqpAdapter.bindClientQueue = jest.fn();
    amqpAdapter.unbindClientQueue = jest.fn();

    test('MessageAction should call sendWithRouting on the AmqpAdapter with the correct routingKey and payload', () => {
        messageAction.performAction('Jeff', [
            'Hallo',
            'zusammen!',
        ]);
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.1', {
            action: 'message',
            data: { message: `[Raum-1] Jeff sagt Hallo zusammen!` },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload', () => {
        privateMessageAction.performAction('Jeff', [
            'Spieler',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: '[privat] Jeff -> Spieler: Hallo' },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Spieler', {
            action: 'message',
            data: { message: '[privat] Jeff -> Spieler: Hallo' },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload when dungeon master whispers to a player', () => {
        privateMessageAction.performAction('0', [
            'Spieler',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('0', {
            action: 'message',
            data: { message: `[privat] Dungeon Master -> Spieler: Hallo` },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Spieler', {
            action: 'message',
            data: { message: `[privat] Dungeon Master -> Spieler: Hallo` },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient is not in the same room when trying to send a message to a character that is not in the same room', () => {
        privateMessageAction.performAction('Jeff', [
            'Bob',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `Bob ist nicht in diesem Raum!` },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient does not exist in the dungeon when trying to send a message to a character that does not exist', () => {
        privateMessageAction.performAction('Jeff', [
            'Held',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: {
                message:
                    `Der Charakter Held existiert nicht in diesem Dungeon!`,
            },
        });
    });

    
    test(`MoveAction should modify the position, call the functions to bind the client queues 
    and call sendWithRouting on the AmqpAdapter when user moves to another room`, async () => {
        await moveAction.performAction('Jeff', ['Norden']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomNorth.id);
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.1', {
            action: 'message',
            data: { message: `Jeff hat Raum-1 verlassen!` },
        });
        expect(amqpAdapter.unbindClientQueue).toHaveBeenCalledWith(
            'Jeff',
            'room.1'
        );
        expect(amqpAdapter.bindClientQueue).toHaveBeenCalledWith('Jeff', 'room.2');
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.2', {
            action: 'message',
            data: { message: `Jeff ist Raum-N beigetreten!` },
        });
    });

    test('MoveAction should modify the position to the room in the East when user moves east', async () => {
        await moveAction.performAction('Jeff', ['Osten']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomEast.id);
    });

    test('MoveAction should modify the position to the room in the South when user moves south', async () => {
        await moveAction.performAction('Jeff', ['Sueden']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomSouth.id);
    });

    test('MoveAction should modify the position to the room in the West when user moves west', async () => {
        await moveAction.performAction('Jeff', ['Westen']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomWest.id);
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room does not exist when the user tries to move to a direction where a room does not exist', async () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorth.id;
        await moveAction.performAction('Jeff', ['Osten']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "In diese Richtung geht es nicht weiter!" },
        });
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the user input an invalid direction when the user inputs anything but Norden, Osten, Sueden or Westen', async() => {
        TestDungeon.characters['Jeff'].position = TestRoomNorth.id;
        await moveAction.performAction('Jeff', ['Nord-Sueden']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "Diese Richtung existiert nicht!" },
        });
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room is closed when the user tries to move into a room that is closed', async () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorth.id;
        await moveAction.performAction('Jeff', ['Norden']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "In diese Richtung ist der Raum geschlossen!" },
        });
    });
    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the path does not exist', async () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorthNorth.id;
        await moveAction.performAction('Jeff', ['Osten']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "In diese Richtung geht es nicht weiter!" },
        });
    });
    //MOVEACTION TEST

    test('LookAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        lookAction.performAction('Jeff', []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: {
                message:
                    'Du befindest dich im Raum Raum-1: Der Raum in dem alles begann. Du schaust dich um. Es liegen folgende Items in dem Raum: Apfel (1x). Folgende NPCs sind in diesem Raum: Bernd. Im Norden befindet sich folgender Raum: Raum-N. Im Osten befindet sich folgender Raum: Raum-O. Im Sueden befindet sich folgender Raum: Raum-S. Im Westen befindet sich folgender Raum: Raum-W. Du kannst in diesem Raum folgende Aktionen ausfuehren: essen Apfel. In diesem Raum befinden sich folgende Spieler: Jeff Spieler. ',
            },
        });
    });

    test('InventoryAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        inventoryAction.performAction('Jeff', []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `Du hast folgende Items im Inventar: Apfel (1x)` },
        });
    });

    test('InspectAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        inspectAction.performAction('Jeff', ['Apfel']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `Du untersuchst Apfel: Apfliger Apfel` },
        });
    });

    test('InspectAction should call sendToClient on AmqpAdapter saying the user does not have the item when the user does not have the item', () => {
        inspectAction.performAction('Jeff', ['Birne']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "Du besitzt dieses Item nicht!" },
        });
    });

    test('MessageMasterAction should call sendToClient on the AmqpAdapter to both the sender and the dungeon master with the correct payload', () => {
        messageMasterAction.performAction('Jeff', [
            'Hallo'
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `[privat] Jeff -> Dungeon Master: Hallo` },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('0', {
            action: 'message',
            data: { message: `[privat] Jeff -> Dungeon Master: Hallo` },
        });
    })

    test('DiscardAction should call sendToClient on AmqpAdapter and modify the inventory of the character and the room items list when user discards an item', () => {
        TestDungeon.characters['Jeff'].inventory.push({item: TestItemDiscard.id, count: 1})
        discardAction.performAction('Jeff', ['Schwert']);
        expect(TestDungeon.characters['Jeff'].inventory).toEqual([{"count": 1, "item": TestItem.id}])
        expect(TestDungeon.rooms['1'].items).toEqual([{"count": 1, "item": TestItem.id}, {"count": 1, "item": TestItemDiscard.id}])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `Du hast folgendes Item abgelegt: Schwert` },
        });
        TestDungeon.rooms['1'].items.pop()
    })

    test('DiscardAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to discard an item he does not own', () => {
        discardAction.performAction('Jeff', ['Gold']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "Du besitzt dieses Item nicht!" },
        });
    })

    test('DiscardAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to discard an item that does not exist in the dungeon', () => {
        discardAction.performAction('Jeff', ['Rubin']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "Du besitzt dieses Item nicht!" },
        });
    })

    test('PickupAction should call sendToClient on AmqpAdapter and modify the inventory of the character and the room items list when user picks up an item', () => {
        TestDungeon.rooms[TestRoom.id].items.push({item: TestItemPickup.id, count: 1})
        pickupAction.performAction('Jeff', ['Gold']);
        expect(TestDungeon.characters['Jeff'].inventory).toEqual([{"count": 1, "item": TestItem.id}, {"count": 1, "item": TestItemPickup.id}])
        expect(TestDungeon.rooms['1'].items).toEqual([{"count": 1, "item": TestItem.id}])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `Du hast folgendes Item aufgehoben: Gold` },
        });
        TestDungeon.characters['Jeff'].inventory.pop()
    })

    test('PickupAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to pickup an item the room does not hold', () => {
        pickupAction.performAction('Jeff', ['Schwert']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "Dieses Item existiert nicht in diesem Raum!" },
        });
    })

    test('PickupAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to pick up an item that does not exist in the dungeon', () => {
        pickupAction.performAction('Jeff', ['Rubin']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: "Dieses Item existiert nicht in diesem Raum!" },
        });
    })
});

describe("Dungeon Actions", () => {
    beforeEach(() => {
        TestDungeon.characters[TestCharacterDungeonActions.name].currentStats.hp = 50
        TestDungeon.characters[TestCharacterDungeonActions.name].currentStats.dmg = 10
        TestDungeon.characters[TestCharacterDungeonActions.name].currentStats.mana = 50
        TestDungeon.characters[TestCharacterDungeonActions.name].inventory = [new ItemInfo(TestItem.id, 1), new ItemInfo(TestItemAddMana.id, 1), new ItemInfo(TestItemRemoveHp.id, 2), new ItemInfo(TestItemRemoveItem.id, 1)]
    })
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        TestDungeon.characters[TestCharacterDungeonActions.name].currentStats = TestStartStats
    })

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const dungeonActionItemMissing: DungeonAction = actionHandler.dungeonActions[TestActionItemMissing.command]
    const dungeonActionInOtherRoom: DungeonAction = actionHandler.dungeonActions[TestActionInOtherRoom.command]
    const dungeonActionAddHp: DungeonAction = actionHandler.dungeonActions[TestActionAddHp.command];
    const dungeonActionRemoveHp: DungeonAction = actionHandler.dungeonActions[TestActionRemoveHp.command];
    const dungeonActionAddMana: DungeonAction = actionHandler.dungeonActions[TestActionAddMana.command];
    const dungeonActionRemoveMana: DungeonAction = actionHandler.dungeonActions[TestActionRemoveMana.command];
    const dungeonActionAddDamage: DungeonAction = actionHandler.dungeonActions[TestActionAddDamage.command];
    const dungeonActionRemoveDamage: DungeonAction = actionHandler.dungeonActions[TestActionRemoveDamage.command];
    const dungeonActionAddItem: DungeonAction = actionHandler.dungeonActions[TestActionAddItem.command];
    const dungeonActionRemoveItem: DungeonAction = actionHandler.dungeonActions[TestActionRemoveItem.command];

    amqpAdapter.sendToClient = jest.fn();

    test('DungeonAction.performAction should call sentToClient notifying the user that he does not have the items to perform the action when the user does not have the required items to perform the action', async () => {
        await dungeonActionItemMissing.performAction('CoolerTyp', ['leben']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Dir fehlen folgende Items fuer die Aktion: Gold (1x)" },
        })
    })

    test('DungeonAction.performAction should call sentToClient notifying the user that he is not able to perform the action in the room when the user does tries to perform an action that is not available in this room', async () => {
        await dungeonActionInOtherRoom.performAction('CoolerTyp', []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Diese Aktion ist nicht möglich!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and add hp to character when the event type is addhp", async () => {
        await dungeonActionAddHp.performAction('CoolerTyp', ['Apfel']);
        expect(TestDungeon.characters['CoolerTyp'].currentStats.hp).toBe(60)
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 60,
                    dmg: 10,
                    mana: 50
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast einen Apfel gegessen!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and remove hp to character when the event type is removehp", async () => {
        await dungeonActionRemoveHp.performAction('CoolerTyp', ['Giftpilz']);
        expect(TestDungeon.characters['CoolerTyp'].currentStats.hp).toBe(30)
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 30,
                    dmg: 10,
                    mana: 50
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 1,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast einen Giftpilz gegessen!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and add mana to character when the event type is addmana", async () => {
        await dungeonActionAddMana.performAction('CoolerTyp', ['Manatrank']);
        expect(TestDungeon.characters['CoolerTyp'].currentStats.mana).toBe(60)
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 50,
                    dmg: 10,
                    mana: 60
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast einen Manatrank getrunken!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and remove mana to character when the event type is removemana", async () => {
        await dungeonActionRemoveMana.performAction('CoolerTyp', ['aus dem Brunnen']);
        expect(TestDungeon.characters['CoolerTyp'].currentStats.mana).toBe(30)
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 50,
                    dmg: 10,
                    mana: 30
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast aus dem Brunnen getrunken!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and add dmg to character when the event type is adddmg", async () => {
        await dungeonActionAddDamage.performAction('CoolerTyp', ['Bier']);
        expect(TestDungeon.characters['CoolerTyp'].currentStats.dmg).toBe(20)
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 50,
                    dmg: 20,
                    mana: 50
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast ein Bier getrunken!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and remove dmg to character when the event type is removedmg", async () => {
        await dungeonActionRemoveDamage.performAction('CoolerTyp', []);
        expect(TestDungeon.characters['CoolerTyp'].currentStats.dmg).toBe(5)
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 50,
                    dmg: 5,
                    mana: 50
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du wechselst in den Nahkampf!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and add item to character when the event type is additem", async () => {
        await dungeonActionAddItem.performAction('CoolerTyp', ['Truhe']);
        expect(TestDungeon.characters['CoolerTyp'].inventory).toEqual([new ItemInfo(TestItem.id, 1), new ItemInfo(TestItemAddMana.id, 1), new ItemInfo(TestItemRemoveHp.id, 2), new ItemInfo(TestItemRemoveItem.id, 1), new ItemInfo(TestItemPickup.id, 1)])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 50,
                    dmg: 10,
                    mana: 50
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                },
                {
                    count: 1,
                    item: "Stein"
                },
                {
                    count: 1,
                    item: "Gold"
                },
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast die Truhe geoeffnet!" },
        })
    })

    test("DungeonAction.performAction should call sendToClient with the correct output and remove item to character when the event type is removeitem", async () => {
        await dungeonActionRemoveItem.performAction('CoolerTyp', ['Stein']);
        expect(TestDungeon.characters['CoolerTyp'].inventory).toEqual([new ItemInfo(TestItem.id, 1), new ItemInfo(TestItemAddMana.id, 1), new ItemInfo(TestItemRemoveHp.id, 2)])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'stats',
            data: { 
                currentStats: {
                    hp: 50,
                    dmg: 10,
                    mana: 50
                }, 
                maxStats: {
                    hp: 100,
                    dmg: 20,
                    mana: 100
                } 
            },
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'inventory',
            data: [
                {
                    count: 1,
                    item: "Apfel"
                },
                {
                    count: 1,
                    item: "Manatrank"
                },
                {
                    count: 2,
                    item: "Giftpilz"
                }
            ],
        })
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('CoolerTyp', {
            action: 'message',
            data: { message: "Du hast einen Stein geworfen!" },
        })
    })
})

describe("DungeonMaster Actions", () => {
    beforeEach(() => {
        TestDungeon.characters['Jeff'].position = TestRoom.id;
        TestDungeon.characters[TestCharacterDungeonActions.name].currentStats = TestStartStats
    })
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        TestDungeon.characters[TestCharacterDungeonActions.name].currentStats = TestStartStats //(100, 20, 100);
    })

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const addDamage: AddDamage = actionHandler.dmActions[triggers.addDamage] as AddDamage;
    const addHp: AddHp = actionHandler.dmActions[triggers.addHp] as AddHp;
    const addMana: AddMana = actionHandler.dmActions[triggers.addMana] as AddMana;


    amqpAdapter.sendToClient = jest.fn();

    

    test('dungeonmaster should add amount of actual Damage to a Charakter', () => {
        addDamage.performAction('dungeonmaster', ['Jeff' , '1']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('dungeonmaster', {
            action: 'message',
            data: { message: "Du hast 1 Schaden erhalten" },
        });
    });

//         test('Jeff should get 1 Attack and then have 11 in total', async () => {
//             await addDamage.performAction('dungeonmaster', ['Jeff' ,'1']);
//             expect(TestDungeon.characters['Jeff'].getCharakterStats().dmg).toEqual(11);
//         });

//         test('Jeff should get so much attack so that he reaches his max Attack', async () => {
//             await addDamage.performAction('dungeonmaster', ['Jeff' ,'211']);
//             expect(TestDungeon.characters['Jeff'].getCharakterStats().dmg).toEqual(20);
//         });

//         test('dungeonmaster should add amount of actual HP to a Charakter', () => {
//             addHp.performAction('dungeonmaster', ['Jeff' , '1']);
//             expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('dungeonmaster', {
//                 action: 'message',
//                 data: { message: "Du hast 1 Leben erhalten" },
//             });
//         });
    
//             test('Jeff should get 1 HP and then have 51 in total', async () => {
//                 await addHp.performAction('dungeonmaster', ['Jeff' ,'1']);
//                 expect(TestDungeon.characters['Jeff'].getCharakterStats().hp).toEqual(51);
//             });
    
//             test('Jeff should get so much life so that he reaches his max life', async () => {
//                 await addHp.performAction('dungeonmaster', ['Jeff' ,'211']);
//                 expect(TestDungeon.characters['Jeff'].getCharakterStats().hp).toEqual(100);
//             });

//             test('dungeonmaster should add amount of actual Mana to a Charakter', () => {
//                 addMana.performAction('dungeonmaster', ['Jeff' , '1']);
//                 expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('dungeonmaster', {
//                     action: 'message',
//                     data: { message: "Du hast 1 Mana erhalten" },
//                 });
//             });
        
//                 test('Jeff should get 1 mana and then have 51 in total', async () => {
//                     await addMana.performAction('dungeonmaster', ['Jeff' ,'1']);
//                     expect(TestDungeon.characters['Jeff'].getCharakterStats().mana).toEqual(51);
//                 });
        
//                 test('Jeff should get so much mana so that he reaches his max mana', async () => {
//                     await addMana.performAction('dungeonmaster', ['Jeff' ,'211']);
//                     expect(TestDungeon.characters['Jeff'].getCharakterStats().mana).toEqual(100);
//                 });
// })
