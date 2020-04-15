import React from 'react';
import { Button, Card, CardTitle,Icon, Col } from 'react-materialize';

import '../../SidePanel.css';

import {
    Link
} from "react-router-dom";

const Tiles = (props) => {
    let save = (e) => {
        e.preventDefault();
        console.log('account');
    }

    return (


            <Card
                actions={[
                    <Button  onClick={save}><Link to="/quiz">{props.button}</Link></Button>

                ]}
                header={<CardTitle image={props.image}>{props.title}</CardTitle>}
                revealicon={<Icon>more_vert</Icon>}

            >

                {props.subtitle}<br></br>
                <a href={'http://www.mycollegesuccessstory.com/academic-success-tools/global-learner.html'}>Global/Sequential - {props.learning_styles.global}</a><br></br>
                <a href={'http://www.cityu.edu.hk/ss/pltr/p1/preparation/Lecture_notes/Intuitive_Learner.html'}>Intuitive/Sensing - {props.learning_styles.intuitive}</a><br></br>
                <a href={'https://classroom.synonym.com/reflective-learning-style-5373027.html'}>Reflective/Active - {props.learning_styles.reflective}</a><br></br>
                <a href={'https://www.time4learning.com/learning-styles/verbal-linguistic.html'}>Verbal/Visual - {props.learning_styles.verbal}</a><br></br>
            </Card>



    );
};

export default Tiles;