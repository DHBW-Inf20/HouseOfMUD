import React from 'react';
import { Modal, Button, ModalProps, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import MudInput from 'src/components/Custom/MudInupt';
import { MudActionElement } from 'src/types/dungeon';
import { validator } from 'src/utils/validator';
import { useMudConsole } from '../../../hooks/useMudConsole';
import { useDungeonConfigurator } from '../../../hooks/useDungeonConfigurator';
import { MudItem, MudEvent } from '../../../types/dungeon';
import MudTypeahead from '../../Custom/MudTypeahead';
import MudSelect from 'src/components/Custom/MudSelect';
type Option = string | { [key: string]: any };

//REFACTOR: Redunant Modal, make generic pls
export interface AddActionModalProps {
    show: boolean;
    onHide: () => void;
    onSendAction: (action: MudActionElement) => void;
    editData?: MudActionElement;
}

const AddActionModal: React.FC<AddActionModalProps> = (props) => {
    const [itemsNeeded, setItemsNeeded] = React.useState<Option[]>([]);
    const [removeItems, setRemoveItems] = React.useState<Option[]>([]);
    const [addItems, setAddItems] = React.useState<Option[]>([]);
    const [selectedEvents, setSelectedEvents] = React.useState<Option[]>([]);
    const [eventValues, setEventValues] = React.useState<{ [key: string]: any }>({});
    const [command, setCommand] = React.useState<string>(props.editData?.command || "");
    const [output, setOutput] = React.useState<string>(props.editData?.output || "");
    const [description, setDescription] = React.useState<string>(props.editData?.description || "");
    const homosole = useMudConsole();

    const dconf = useDungeonConfigurator();

    const eventTypes = [
        "additem",
        "removeitem",
        "addhp",
        "removehp",
        "adddmg",
        "removedmg",
        "addmana",
        "removemana"
    ]

    const onSubmit = () => {
        console.log(eventValues);
        if (validator.isEmpty(description) || validator.isEmpty(command) || validator.isEmpty(output) || itemsNeeded.length === 0) {
            homosole.warn("Es sind nicht alle Felder ausgefüllt!", "AddActionModal");
        }
        let allEvents: MudEvent[] = [];
        // REFACTOR: Typing!!!
        selectedEvents.forEach((event) => {
            let value;
            if (event === "additem" && addItems.length > 0) {
                value = (addItems[0] as any).id;
            } else if (event === "removeitem" && removeItems.length > 0) {
                value = (removeItems[0] as any).id;
            } else {
                value = eventValues[event as MudEvent["eventType"]];
            }
            console.log(value);
            let currEvent: MudEvent = {
                eventType: event as MudEvent["eventType"],
                value
            }
            allEvents.push(currEvent);
        });
        console.log(allEvents);
        const characterAction: MudActionElement = {
            command: "mock command",
            output: "mock output",
            description,
        } as MudActionElement;
        props.onSendAction(characterAction);
        props.onHide();

    }


    return (
        <Modal
            onHide={props.onHide}
            show={props.show}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Neue Aktion anlegen
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='row px-4 g-3'>
                <MudInput placeholder='Befehl' colmd={12} value={command} onChange={(event) => setCommand(event.target.value)} />
                <MudInput placeholder='Beschreibung' colmd={12} value={description} onChange={(event) => setDescription(event.target.value)} />
                <MudInput placeholder='Ausgabe' colmd={12} value={output} onChange={(event) => setOutput(event.target.value)} />
                <MudTypeahead
                    colmd={12}
                    title={'benötigte Items'}
                    id={"typeahead-items-needed"}
                    labelKey={(option: any) => `${option.name} (${option.description})`}
                    options={dconf.items}
                    multiple
                    onChange={setItemsNeeded}
                    placeholder="Items auswählen"
                    selected={itemsNeeded}
                />
                <MudTypeahead
                    colmd={12}
                    title="Events"
                    id="typeahead-events"
                    labelKey="events"
                    multiple
                    options={eventTypes}
                    onChange={setSelectedEvents}
                    placeholder="Items auswählen"
                    selected={selectedEvents}
                />
                {selectedEvents.length > 0 && selectedEvents.map((mudEvent, index) => {
                    if (mudEvent as string === 'additem' || mudEvent as string === 'removeitem') {
                        return (
                            <MudTypeahead
                                colmd={12}
                                key={mudEvent as string}
                                title={mudEvent as string}
                                id={"typeahead" + mudEvent as string}
                                labelKey={(option: any) => `${option.name} (${option.description})`}
                                options={dconf.items}
                                onChange={(mudEvent as string === 'additem') ? setAddItems : (a) => { setRemoveItems(a); setItemsNeeded(a) }}
                                placeholder="Items auswählen"
                                selected={(mudEvent as string === 'additem') ? addItems : removeItems}
                            />
                        )
                    }
                    return (
                        <MudInput type="number" required key={mudEvent as string} placeholder={mudEvent as string} colmd={12} value={eventValues[mudEvent as string] || ""} onChange={(event) => setEventValues({ ...eventValues, [mudEvent as string]: event.target.value })} />
                    )
                })}

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} className="btn-danger">Abbrechen</Button>
                <Button onClick={onSubmit} className="btn-success">Anlegen</Button>
            </Modal.Footer>
        </Modal>
    );
}


export default AddActionModal;
