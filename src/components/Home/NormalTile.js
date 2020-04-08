import React from 'react';

import { Button, Card, CardTitle,Icon, Row, Col } from 'react-materialize';

import '../../SidePanel.css';

import {
    Link
} from "react-router-dom";

const Tiles = (props) => {
    let save = (e) => {
        e.preventDefault();
    }

    return (

            <Card
                actions={[
                    <Button  onClick={save}><Link to="/quiz">{props.button}</Link></Button>
                ]}
                header={<CardTitle image={props.image}>{props.title}</CardTitle>}
                revealIcon={<Icon>more_vert</Icon>}

            >
               {props.subtitle}

            </Card>
    );
};

export default Tiles;