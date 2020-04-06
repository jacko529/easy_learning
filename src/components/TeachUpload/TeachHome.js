import React, { Component } from 'react';

import {
    Collection,
    CollectionItem,
    Container,
    Row,
    Col,
    CardTitle,
    Icon,
    CardPanel,
    Card
} from 'react-materialize';
import {
    Link
} from "react-router-dom";
import '../../Loader.css';
import '../../SidePanel.css';

import 'react-rangeslider/lib/index.css'
import axios from 'axios';

import { connect } from 'react-redux';


export class TeachHome extends Component {

    state = {
        requestCompleted:false,
        courseAnalytics: [],
        course: [],
        values: '',

    };

    componentWillMount() {


        const config = {
            headers: { Authorization: `bearer ${localStorage.getItem('access_token')}` ,'Content-type': 'application/json'}

        };

        axios.get('/course-analytics',config )
            .then(res => {
                this.setState({courseAnalytics: res.data});
                this.setState({requestCompleted: true});

            })

    }


    render() {
        // const {isTeacher,isUser, isLoading, isAuthenticated, user } = this.props.auth;

        let analytics= [];

        if(this.state.requestCompleted){
             analytics = [this.state.courseAnalytics];
             console.log(analytics)
        }

        return (
            <Container style={{textAlign:'center' , marginTop: '5rem'}}>
                <Row>
                    <Col
                        m={2}
                        s={6}
                    >
                        <Card
                            actions={[
                                <Link to="/upload-course">Upload a course</Link>
                            ]}
                            closeIcon={<Icon>close</Icon>}
                            header={<CardTitle image="/course.jpg">Upload A New Course</CardTitle>}
                            revealIcon={<Icon>more_vert</Icon>}
                        >
                            Upload a new course for students to learn.
                        </Card>
                    </Col>

                    <Col
                        m={2}
                        s={6}
                    >
                        <Card
                            actions={[
                                <Link to="/upload-content">Upload course content</Link>
                            ]}
                            closeIcon={<Icon>close</Icon>}
                            header={<CardTitle image="/download.png">Course Content</CardTitle>}
                            revealIcon={<Icon>more_vert</Icon>}
                        >
                            Upload some course content
                        </Card>
                    </Col>
                </Row>
                {this.state.requestCompleted && this.state.courseAnalytics ?
                    <Row>
                        <Col
                            m={6}
                            s={12}
                        >
        {!analytics.includes("no courses") ?
      analytics.map((person) => (

          <Collection >
              <div>
                  {person.courses.map((pet) => (
                    <CollectionItem>
                         Course {pet.course}
                         <ul>
                             <li> Has {pet.count} students </li>
                             <li> {pet.finished} have finished the course</li>
                             {/*<li> The average time of finishing is  {pet.avg_time_wanted}  </li>*/}
                             <li> The most common learning style was  {pet.most_popular_learning_style}  </li>
                         </ul>
                        {/*<p>The most common learning style was {pet.avg_time_wanted} minutes</p>*/}

                    </CollectionItem>

                  ))}
                      </div>

          </Collection>
      )) : null}

                  {/*{Object.keys(this.state.courseAnalytics).map((key) => {*/}
                  {/*    return this.state.courseAnalytics[key].map((station) => {*/}
                  {/*        console.log(station);*/}
                  {/*        // you should return something here*/}
                  {/*    })*/}
                  {/*})}*/}



                        </Col>
                    </Row>: null

                }

            </Container>
        );
    }

}



const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    null
)(TeachHome);