import React, { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent } from "react";
import { Row, Table } from 'react-bootstrap';
import { Pencil, Trash } from "react-bootstrap-icons";
import { MudCharacterClass, MudItem } from "src/types/dungeon";
import { MudActionElement } from '../../types/dungeon';
import DungeonObjectListElement from './DungeonObjectListElement';

import './index.css'

export type AcceptedTypes = MudCharacterClass | MudItem | MudActionElement;
export interface DungeonObjectListProps {
    title: string;
    buttonText?: string;
    identifier: string;
    onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
    onEditElement: (key: number) => void;
    onDeleteElement: (key: number) => void;
    data: AcceptedTypes[];
    displayKeys: { [key: string]: string };
}

const DungeonObjectList: React.FC<DungeonObjectListProps> = (props) => {

    return (
        <>
            <Row className="mt-5">
                <hr />
                <div className="col-md-9">
                    <span className="headline">{props.title}</span>
                </div>
                <div className="col-md-3">
                    <button className="btn drawn-border btn-standard col-md-2" onClick={props.onAdd}>{props.buttonText}</button>
                </div>
            </Row>
            <Row className="py-2">
                {Object.keys(props.displayKeys).map((key, index) => {
                            return (
                                <div className="col" key={index}>
                                    <b><u>{props.displayKeys[key]}</u></b>
                                </div>
                            )
                        })}
                <div className="col"></div>
            </Row>

            {props.data.length > 0 && props.data.map((item: any, index) => {
                return (
                    <DungeonObjectListElement key={index} item={props.data[item.id]} {...props} />
                )
            })}

        </>
    )
}

export default DungeonObjectList;