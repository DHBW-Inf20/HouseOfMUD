/**
 * @module DemoJoin
 * @category React Components
 * @description Component to handle Character-Creation and to join a dungeon.
 * @props {@linkcode DemoJoinProps}
 * ```jsx
 * <>
 *  <CreateNewCharacter />
 *  <AvailableCharacters />
 * </>
 * ```
 */

import React, { FormEvent } from 'react'
import { useEffect } from 'react'
import { useGame } from 'src/hooks/useGame'
import { supervisor } from 'src/services/supervisor';
import { useAuth } from 'src/hooks/useAuth';
import { GetCharactersRequest, GetCharacterAttributesResponse, LoginRequest, StartDungeonRequest, StartDungeonResponse } from '@supervisor/api';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import { useMudConsole } from '../../hooks/useMudConsole';
import { CharactersResponseData } from '@supervisor/api';
import MudInput from '../Custom/MudInupt';
export interface DemoJoinProps { }


const DemoJoin: React.FC<DemoJoinProps> = (props) => {

    const game = useGame();
    const auth = useAuth();
    const navigate = useNavigate();
    const homsole = useMudConsole();
    let dungeon = game.dungeon;
    let dungeonName = game.dungeonName;
    let user = auth.user;
    const homosole = useMudConsole();
    

    const join = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        let formData = new FormData(evt.currentTarget);
        let character: string = formData.get('name') as string;

        console.log(`join ${character}`);

        let body: LoginRequest = {
            character: character,
        }

        supervisor.login(dungeon, body, (data) => {
            game.setCharacter(character);
            game.setVerifyToken(data.verifyToken);
            navigate("/game");
        }, (error) => {
            // TODO: handle error in a better way
            homosole.error(error.error);
        });
    }

    return (
        <Container className="mb-5">
            <h2>{dungeonName}</h2>
            <form onSubmit={join}>
                <Row className="align-items-end g-2">
                    <MudInput required colmd={8} name="name" type="text" placeholder="Charactername eingeben" />

                    <div className="col-md-4">
                        <button className="btn w-100 drawn-border btn-green" type="submit">Dungeon beitreten</button>
                    </div>
                </Row>
            </form>
        </Container>
    )
}

export default DemoJoin;    