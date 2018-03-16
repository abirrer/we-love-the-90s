import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Profile from "./Profile.js";
import ProfilePic from "./ProfilePic.js";
import ProfilePicUpload from "./ProfilePicUpload.js";

// ------------------------------------------------------------ //

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            first: "",
            last: "",
            email: "",
            profilepic: "/images/defaultprofile.png",
            bio: "",
            showUploadModal: false
        };

        this.toggleUploadModal = this.toggleUploadModal.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios.get("/profile").then(res => {
            const { first, last, email, profilepic, bio } = res.data;
            this.setState(
                {
                    first,
                    last,
                    email,
                    profilepic: profilepic || this.state.profilepic,
                    bio
                }
                // () => {
                //     console.log("new state: ", this.state);
                // }
            );
        });
    }

    toggleUploadModal() {
        this.setState({ showUploadModal: !this.state.showUploadModal });
    }

    setImage(url) {
        this.toggleUploadModal();
        this.setState({
            profilepic: url
        });
    }

    setBio(bio) {
        this.setState({ bio: bio });
    }

    render() {
        const { first, last, email, profilepic, bio } = this.state;

        return (
            <div>
                <BrowserRouter>
                    <div>
                        <h1>We &#9829; The Nineties</h1>
                        <Link to="/">Profile</Link>
                        <br />
                        <ProfilePic
                            profilepic={profilepic}
                            toggleUploadModal={this.toggleUploadModal}
                            setImage={this.setImage}
                            first={this.props.first}
                            last={this.props.last}
                        />
                        {this.state.showUploadModal && (
                            <ProfilePicUpload setImage={this.setImage} />
                        )}
                        <div>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        first={first}
                                        last={last}
                                        email={email}
                                        profilepic={profilepic}
                                        bio={bio}
                                        setBio={this.setBio}
                                        setImage={this.setImage}
                                        toggleUploadModal={
                                            this.toggleUploadModal
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
