import React from 'React'

export default class NewSingerForm extends React.Component {

    constructor() {
        super()

        this.state = {
            name: "",
            band: ""
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log("new state", this.state))
    }

    render() {
        const { name, band } = this.state

        return (
            <form>
                <input onChange={ this.handleChange } name="name" type="text" placeholder="singer name"/>
                <input onChange={ this.handleChange } name="band" type="text" placeholder="band"/>
                <button onClick={ (e) => {e.preventDefault() this.props.handleSubmit(name, band)} }>Add New Singer</button>
            </form>
        )
    }
}
