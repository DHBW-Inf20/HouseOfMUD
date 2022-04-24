/**
 * @module Dashboard
 * @category React Components
 * @description The dashboard is the main page of the application.
 * @children {@linkcode AllDungeons}, {@linkcode MyDungeons}
 * @props {@linkcode DashboardProps}
 * ```jsx
 * <>
 *  <AllDungeons />
 *  <MyDungeons />
 * </>
 * ```
 */
import React, { useEffect } from 'react'
import { Container, Nav, Row } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import { useMudConsole } from 'src/hooks/useMudConsole';
import { supervisor } from 'src/services/supervisor';
import { DungeonResponseData, GetDungeonsRequest, GetDungeonsResponse, GetMyDungeonsResponse } from '@supervisor/api';
import AllDungeons from './AllDungeons';
import "./index.css"
import { useNavigate } from 'react-router-dom';


export type DashboardProps = {
}

const Dashboard: React.FC<DashboardProps> = (props) => {

    const auth = useAuth();
    const homsole = useMudConsole();
    const navigate = useNavigate();
    let [allDungeons, setAllDungeons] = React.useState<DungeonResponseData[]>();
    let [myDungeons, setMyDungeons] = React.useState<DungeonResponseData[]>();
    let [dungeonView, setDungeonView] = React.useState<"all" | "my">("all");

    useEffect(() => {
        let request: GetDungeonsRequest = {
            user: auth.user,
        }
        supervisor.getDungeons(request, setAllDungeons, homsole.supervisorerror)
        supervisor.getMyDungeons(request, setMyDungeons, homsole.supervisorerror);
    }, [])

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === "all") {
            setDungeonView("all");
        } else {
            setDungeonView("my");
        }
    }

    return (
        <Container className="mb-5">
            <Row className="align-items-center mb-3">
                <div className="col-8">
                    <h2 className='my-3'>Dashboard</h2>
                </div>
                <div className="col-4">
                    <button className="btn drawn-border btn-standard" onClick={() => {
                        navigate("/dungeon-configurator", { state: { action: "new" } });
                    }}>Neuen Dungeon erstellen</button>
                </div>
            </Row>
            <Nav variant="tabs" defaultActiveKey="all" onSelect={handleSelect}>
                <Nav.Item>
                    <Nav.Link eventKey="all">Verfügbare Dungeons</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="my">Eigene Dungeons</Nav.Link>
                </Nav.Item>
            </Nav>

            {dungeonView === "all" && allDungeons ? <AllDungeons allDungeons={allDungeons} /> : null}
            {dungeonView === "my" && myDungeons ? <AllDungeons allDungeons={myDungeons} /> : null}
        </Container >
    )
}

export default Dashboard;