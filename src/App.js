import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Profile from "./Profile.js";
import ProfilePic from "./ProfilePic.js";
import ProfilePicUpload from "./ProfilePicUpload.js";
import OtherProfile from "./OtherProfile.js";
import Friends from "./Friends.js";
import Online from "./Online.js";
import Chat from "./Chat.js";

// ------------------------------------------------------------ //

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            first: "",
            last: "",
            email: "",
            profilepic: "/images/defaultprofile.png",
            bio: "",
            showUploadModal: false,
            showMenu: false
        };

        this.toggleUploadModal = this.toggleUploadModal.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        axios.get("/profile").then(res => {
            const { id, first, last, email, profilepic, bio } = res.data;
            this.setState(
                {
                    id,
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

    toggleMenu() {
        this.setState({ showMenu: !this.state.showMenu });
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
        const { id, first, last, email, profilepic, bio } = this.state;

        return (
            <div>
                <BrowserRouter>
                    <div>
                        <header>
                            <Link to="/" style={{ textDecoration: "none" }}>
                                <h1>We &hearts; The 90s</h1>
                            </Link>
                            <div id="header-menu-box">
                                <img
                                    id="menu-icon"
                                    src="/images/menu.png"
                                    onClick={this.toggleMenu}
                                />
                                {this.state.showMenu && (
                                    <div id="menu-box">
                                        <Link to="/" onClick={this.toggleMenu}>
                                            My Profile
                                        </Link>
                                        <br />
                                        <Link
                                            to="/friends"
                                            onClick={this.toggleMenu}
                                        >
                                            My Friends
                                        </Link>
                                        <br />
                                        <Link
                                            to="/online"
                                            onClick={this.toggleMenu}
                                        >
                                            Online Users
                                        </Link>
                                        <br />
                                        <Link
                                            to="/chat"
                                            onClick={this.toggleMenu}
                                        >
                                            Chat Room
                                        </Link>
                                        <br />
                                        <Link
                                            to="/user/1"
                                            onClick={this.toggleMenu}
                                        >
                                            Other Profile
                                        </Link>
                                        <br />
                                        <a
                                            href="/logout"
                                            onClick={this.toggleMenu}
                                        >
                                            Log Out
                                        </a>
                                    </div>
                                )}
                                <ProfilePic
                                    profilepic={profilepic}
                                    toggleUploadModal={this.toggleUploadModal}
                                    setImage={this.setImage}
                                    first={this.props.first}
                                    last={this.props.last}
                                />
                            </div>
                        </header>
                        {this.state.showUploadModal && (
                            <ProfilePicUpload
                                setImage={this.setImage}
                                toggleUploadModal={this.toggleUploadModal}
                            />
                        )}
                        <div id="profile">
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
                            <Route
                                exact
                                path="/user/:userId"
                                component={OtherProfile}
                            />
                            <Route exact path="/friends" component={Friends} />

                            <Route exact path="/online" component={Online} />

                            <Route
                                exact
                                path="/chat"
                                render={() => (
                                    <Chat
                                        first={first}
                                        last={last}
                                        id={id}
                                        profilepic={profilepic}
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
