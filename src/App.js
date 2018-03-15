import React from "react";
import ProfilePic from "./ProfilePic.js";
import ProfilePicUpload from "./ProfilePicUpload.js";
import axios from "./axios";

// ------------------------------------------------------------ //

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            first: "",
            last: "",
            email: "",
            profilepic: "/images/defaultprofile.png",
            showUploadModal: false
        };

        this.toggleUploadModal = this.toggleUploadModal.bind(this);
    }

    componentDidMount() {
        axios.get("/profile").then(res => {
            const { id, first, last, email, profilepic } = res.data;
            this.setState(
                {
                    id,
                    first,
                    last,
                    email,
                    profilepic: profilepic || this.state.profilepic
                },
                () => {
                    console.log("new state: ", this.state);
                }
            );
        });
    }

    toggleUploadModal() {
        this.setState({ showUploadModal: !this.state.showUploadModal });
    }

    render() {
        const { first, last, email, profilepic } = this.state;

        return (
            <div>
                <h1>
                    Welcome, {first} {last}!
                </h1>
                <ProfilePic
                    toggleUploadModal={this.toggleUploadModal}
                    first={first}
                    last={last}
                    email={email}
                    profilepic={profilepic}
                />
                {this.state.showUploadModal && <ProfilePicUpload />}
            </div>
        );
    }
}
