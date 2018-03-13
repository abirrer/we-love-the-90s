import React from "react";
import Singer from "./Singer.js";
import axios from "axios";
import NewSingerForm from "./NewSingerForm.js";

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            singers: []
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        axios.get("/singers")
            .then(res => {
                this.setState({singers: res.data}, () => {
                    console.log("new state", this.state)
                })
            })
    }

    handleSubmit(name, band) {
        //do an axios post to submit this data to our db and ensure it gets saved
        const copy = this.state.singers.slice()
        copy.push({ name, band })
        this.setState({ singers: copy })

    }

    renderSingers() {
        if(this.state.singers.length == 0) {
            return (
                <div>Loading singers...</div>
            )
        }

        // console.log("Current state", this.state);

        return this.state.singers.map(singer => {
            const { name, band } = singer
            return (
                <Singer
                    key={ singer.name }
                    name={ name }
                    band={ band }
                />
            )
        })
    }

    render() {
        return (
            <div>
                <h1>Singers</h1>
                <NewSingerForm handleSubmit={ this.handleSubmit }/>

                { this.renderSingers() }
            </div>

        )
    }
}
