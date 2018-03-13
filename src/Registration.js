import React from "react";

export default class Registration extends React.Component {

    constructor() {
        super()

        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            error: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(first, last, email, password) {
        axios.post("/welcome/register").then(res => {
            if (res.data.success) {
                location.replace('/');
            } else {
                this.setState({
                    error: true
                })
            }
        })
    }

    render() {

        const { first, last, email, password } = this.state

        return (
            <div>
                <form>
                    <input onChange={ this.handleChange } name="first" type="text" placeholder="First Name"/>
                    <input onChange={ this.handleChange } name="last" type="text" placeholder="Last Name"/>
                    <input onChange={ this.handleChange } name="email" type="email" placeholder="Email Address"/>
                    <input onChange={ this.handleChange } name="password" type="password" placeholder="Password"/>
                    <button onClick={ (e) => {
                            e.preventDefault()
                            this.props.handleSubmit(first, last, email, password)
                        }}>Register</button>
                </form>
                <p>Already a member? <a href="#">Log In</a>.</p>
            </div>    
        )
    }
}
