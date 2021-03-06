import React, {Component, Fragment} from 'react';
import {Button, Col, Collection, CollectionItem, Container, Range, Row, Select} from 'react-materialize';
import 'materialize-css'
import '../../Loader.css';
import '../../SidePanel.css';
import './Tiles'
import Tiles from "./Tiles";
import NormalTile from "./NormalTile";
import CourseTile from "./CourseTile";

import axios from 'axios';

import {connect} from 'react-redux';
import NoCourseTile from "./NoCourseTile";
import Loader from "react-loader-spinner";
import {Graph} from "react-d3-graph";


export class Entry extends Component {

    state = {
        requestCompleted: false,
        learning_styles: [],
        course: [],
        value: 10,
        url: '',
        rangeValue: '',
        explainShortPath: [],
        coursesCanChoose: [],
        selectedCourse: '',
        recommendation: [],
        noCourse: [],
        timeDisappear: false,
        completeDataSet: [],
        courseDisappear: false,
    };

    componentWillMount() {


        const config = {
            headers: {
                Authorization: `bearer ${localStorage.getItem('access_token')}`,
                'Content-type': 'application/json'
            }

        };

        axios.get('/next-active', config)
            .then(res => {
                // if it is the first course
                this.setState({completeDataSet: res.data});
                if (!res.data['shortest_path'] && !res.data['jarrard'] && !res.data['none']) {
                    this.setState({course: res.data[0]});
                    // if there is nothing done yet (new user)
                } else if (res.data['none']) {
                    this.setState({noCourse: res.data['none']});
                } else if (res.data['shortest_path'] && !res.data['jarrard']) {
                    this.setState({course: res.data['shortest_path'][0]});
                    this.setState({explainShortPath: res.data['explain_short_path'][0]});

                } else {
                    console.log('request', res.data['explain_short_path'][0]);
                    this.setState({course: res.data['shortest_path'][0]});
                    this.setState({recommendation: res.data['jarrard'][0]});
                    this.setState({explainShortPath: res.data['explain_short_path'][0]});

                }

                this.setState({requestCompleted: true});
            }).then(
            axios.get('/courses', config)
                .then(ress => {
                    this.setState({coursesCanChoose: ress.data.data});

                })
        );

    }


    handleCourse(event) {
        this.setState({coursesCanChoose: event.target.value})
    }

    handleRangeSlider(event) {
        this.setState({rangeValue: event.target.value})
    }


    render() {


// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used

        const myConfig = {
            directed: true,

            nodeHighlightBehavior: true,
            node: {
                color: "lightblue",
                size: 420,
                symbolType: 'wye',
                fontColor: 'white',
                highlightStrokeColor: "blue",
            },
            link: {
                renderLabel: true,
                highlightColor: "blue",
                fontSize: 15,
                fontColor: 'white',
                semanticStrokeWidth: true,
                labelProperty: 'label'
            },
        };

        // graph event callbacks
        const onClickGraphFirst = function () {
        };

        const onClickNodeFirst = function (nodeId) {
        };

        const onDoubleClickNodeFirst = function (nodeId) {
        };

        const onRightClickNodeFirst = function (event, nodeId) {
        };

        const onMouseOverNodeFirst = function (nodeId) {
        };

        const onMouseOutNodeFirst = function (nodeId) {
        };

        const onClickLinkFirst = function (source, target) {
        };

        const onRightClickLinkFirst = function (event, source, target) {
        };

        const onMouseOverLinkFirst = function (source, target) {
        };

        const onMouseOutLinkFirst = function (source, target) {
        };

        const onNodePositionChangeFirst = function (nodeId, x, y) {
        };


        const {isTeacher, isUser, isLoading, isAuthenticated, user} = this.props.auth;
        // const {isTeacher,isUser, isLoading, isAuthenticated, user } = this.props.auth;


        let saveCourse = (e) => {
            const config = {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('access_token')}`,
                    'Content-type': 'application/json'
                }
            };
            e.preventDefault();

            const body = JSON.stringify({course: this.state.coursesCanChoose[0]});

            axios.post('/courses', body, config)
                .then(res => {
                    // console.log(res.data);
                    this.setState({courseDisappear: true});

                });
        };
        let save = (e) => {
            const config = {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('access_token')}`,
                    'Content-type': 'application/json'
                }
            };
            e.preventDefault();
            const body = JSON.stringify({time: this.state.rangeValue});

            axios.post('/user-time', body, config)
                .then(res => {
                    this.setState({timeDisappear: true});
                });


        };

        const welcome = (
            <Fragment>
                <h1 style={{textAlign: "center", marginBottom: "2rem", marginTop: '4rem', color: 'white'}}>Welcome to
                    Easy Learn</h1>

                <Collection>
                    <CollectionItem>
                        First select the a course
                    </CollectionItem>
                    <CollectionItem>
                        Find out your learning style
                    </CollectionItem>
                    <CollectionItem>
                        Work through course
                    </CollectionItem>
                </Collection>
            </Fragment>
        );


        const {value} = this.state;
        if (this.state.requestCompleted) {
            // {this.explainShortPath.map((course) => console.log(course) )}
            console.log('recomm', Object.keys(this.state.explainShortPath).length)
        }
        const loadingSign = (
            <div className={this.state.requestCompleted ? 'normal' : 'loader  '} style={{textAlign: 'center'}}>
                <Loader
                    type="MutatingDots"
                    color="#00BFFF"
                    height={80}
                    width={80}
                    timeout={500} //3 secs
                />
            </div>
        );
        let timeClass = this.state.timeDisappear ? "timeDiv" : "";
        let courseClass = this.state.courseDisappear ? "courseDiv" : "";

        return (

            <div>
                {!this.state.requestCompleted ? loadingSign :
                    <Container>

                        {welcome}

                        {this.state.noCourse.length > 0 && Object.keys(user.learning_styles).length > 1 ?

                            <Row className="bottom-row">

                                <Tiles
                                    image={"/audo.jpg"}
                                    title={user.first_name + ' ' + user.surname}
                                    learning_styles={user.learning_styles}
                                    subtitle={'Here are your results'}
                                    description={'It will help'}
                                    button={'TakeQuiz'}
                                />

                                <NoCourseTile
                                    image={"/study-notebooks.jpg"}
                                    title={this.state.noCourse}
                                />


                            </Row> : null

                        }

                        {this.state.noCourse.length === 0 && Object.keys(user.learning_styles).length > 1 && Object.keys(this.state.explainShortPath).length === 0 ?

                            <Row className="bottom-row">

                                <Tiles
                                    image={"/audo.jpg"}
                                    title={user.first_name + ' ' + user.surname}
                                    learning_styles={user.learning_styles}
                                    subtitle={'Here are your results'}
                                    description={'It will help'}
                                    button={'TakeQuiz'}
                                />
                                {user.learning_styles ?
                                    <CourseTile
                                        image={"/study.jpg"}
                                        title={this.state.course.name_of_resource}
                                        stage={this.state.course.stage}
                                        course={this.state.coursesCanChoose}
                                        url={this.state.course.url ? this.state.course.url : this.state.course.name_of_file}
                                        email={user.email}
                                        button={'Start Course'}
                                    /> : null}
                            </Row>

                            : null
                        }

                        {/* this is to check that the user is authenticated, has learning styles and request has been made*/}
                        {this.state.noCourse.length === 0 && Object.keys(user.learning_styles).length > 1 && Object.keys(this.state.explainShortPath).length > 0 ?

                            <Row className="bottom-row">

                                <Tiles
                                    image={"/audo.jpg"}
                                    title={user.first_name + ' ' + user.surname}
                                    learning_styles={user.learning_styles}
                                    subtitle={'Here are your results'}
                                    description={'It will help'}
                                    button={'TakeQuiz'}
                                />


                                {user.learning_styles ?
                                    <CourseTile
                                        image={"/study.jpg"}
                                        title={this.state.course.name_of_resource}
                                        stage={this.state.course.stage}
                                        course={this.state.coursesCanChoose}
                                        url={this.state.course.url}
                                        email={user.email}
                                        button={'Start Course'}
                                    /> : null}

                                {this.state.recommendation.length > 0 ?

                                    <CourseTile
                                        image={"/study-notebooks.jpg"}
                                        title={this.state.recommendation.name_of_resource}
                                        stage={this.state.recommendation.stage}
                                        course={this.state.coursesCanChoose}
                                        url={this.state.course.url}
                                        email={user.email}
                                        button={'Your Friends took this'}
                                    /> : null}
                                <Col>
                                    <h3>Explain your path </h3>
                                    <h4 style={{color: 'white'}}>This are the top learning paths which are based
                                        around the time your spefifed at the beginning of the course</h4>
                                    <h5 style={{color: 'white'}}>You can look into your top learning paths by selecting
                                        the graph, these graphs where selected by finding the shortest path based around
                                        how long it takes to get from one resource to the next</h5>
                                    <Graph
                                        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                                        data={this.state.explainShortPath.first}
                                        config={myConfig}
                                        onClickNode={onClickNodeFirst}
                                        onDoubleClickNode={onDoubleClickNodeFirst}
                                        onRightClickNode={onRightClickNodeFirst}
                                        onClickGraph={onClickGraphFirst}
                                        onClickLink={onClickLinkFirst}
                                        onRightClickLink={onRightClickLinkFirst}
                                        onMouseOverNode={onMouseOverNodeFirst}
                                        onMouseOutNode={onMouseOutNodeFirst}
                                        onMouseOverLink={onMouseOverLinkFirst}
                                        onMouseOutLink={onMouseOutLinkFirst}
                                        onNodePositionChange={onNodePositionChangeFirst}
                                    />;

                                </Col>
                            </Row> : null

                        }


                        {Object.keys(user.learning_styles).length < 1 ?

                            <div className="bottom-row">
                                <Row
                                >
                                    {/*<Col m={6}*/}
                                    {/*     s={6} className={timeClass}>*/}
                                    <h1>Student Information</h1>
                                    <h4>First enter your time you want to spend on the course</h4>
                                    <Range
                                        value={this.state.rangeValue}
                                        onChange={this.handleRangeSlider.bind(this)}
                                        max="100"
                                        min="0"
                                        name="points"
                                    />
                                    {user.time === '' ? <Button onClick={save}>That's enough time</Button> : null}
                                    {/*</Col>*/}

                                    {/*<Col m={6}*/}
                                    {/*     s={6} className={courseClass}>*/}
                                    {/*    <h4>Now select the course you wish to take</h4>*/}

                                    <Select
                                        label="Choose your option"
                                        options={{
                                            classes: '',
                                            dropdownOptions: {
                                                alignment: 'left',
                                                autoTrigger: true,
                                                closeOnClick: true,
                                                constrainWidth: true,
                                                container: null,
                                                coverTrigger: true,
                                                hover: false,
                                                inDuration: 150,
                                                onCloseEnd: null,
                                                onCloseStart: null,
                                                onOpenEnd: null,
                                                onOpenStart: null,
                                                outDuration: 250
                                            }
                                        }}
                                        value={this.state.selectedCourse}
                                        onChange={this.handleCourse.bind(this)}
                                    >
                                        <option value={this.state.coursesCanChoose}>
                                            {this.state.coursesCanChoose}
                                        </option>
                                    </Select>
                                    {/*</Col>*/}


                                    <Button onClick={saveCourse}>Choose this course</Button>
                                    <hr style={{background: 'white'}}></hr>
                                    <h1>Student Learning Course</h1>


                                    <NormalTile
                                        image={"/brainprocess.jpg"}
                                        title={user.first_name + ' ' + user.surname}
                                        subtitle={'Take this quiz to get your results'}
                                        description={'It will help'}
                                        button={'TakeQuiz'}
                                    />

                                </Row>
                            </div> : null

                        }

                    </Container>
                }
            </div>
        )

    }
}


const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    null
)(Entry);