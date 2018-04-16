# We :heart: the 90s Social Network

### Overview

<p>A 12 day project to create a simple social network for people who love the 90s. It's a single-page application using React with basic functionalities like account registration and login, editable user profile, friend request buttons, and a chat room.</p>

### Website

<p>https://welovethe90ssocialnetwork.herokuapp.com</p>

### Technologies Used

<p>HTML, CSS, Javascript, React, Redux, socket.io, node.js and express.js, postgreSQL, Amazon S3 image storage bucket</p>

### Key Features

<p>New users are directed to a welcome register page.</p>
<p align="center">
<img src=""  width="800"/>
</p>

<p>When new users sign up, they are directed to their default profile page, which has a default profile picture and an empty bio. Users can change their profile picture by clicking on the main picture or the icon picture in the top corner.  Users can change their bio by clicking the "Edit Bio" button.  All changes are immediately saved and stored.</p>
<p align="center">
<img src=""  width="800"/>
</p>

<p>Here is a side by side view of the new user just created (on the left) and an already registered user re-signing in (on the right).  On the homepage, users can click on the hamburger menu and go to the "Online Users" link which shows a list of online users (using socket.io).  By clicking on a users profile, you are redirected to their profile page where there is a "Send Friend Request" button.  The request is then shown in the "My Friends" page as a Pending Request.</p>
<p align="center">
<img src=""  width="800"/>
</p>

<p>Here is a single screen of the "My Friends" page where a user can view all their current friends or delete friends, and add pending requests. As you can see, when a button is pressed the friend list is updated immediately.</p>
<p align="center">
<img src=""  width="800"/>
</p>

<p>Lastly, there is a group chat room, where every current user online can view and send chats to each other.  If the comment box fills up, then the box automatically scrolls down to the most recent comment.  You can see the chat room updated immediately in both screens.</p>
<p align="center">
<img src=""  width="800"/>
</p>
