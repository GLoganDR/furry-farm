## Furry Farm
### Code Badges
[![Build Status](https://travis-ci.org/GLoganDR/furry-farm.svg)](https://travis-ci.org/GLoganDR/furry-farm)
[![Coverage Status](https://coveralls.io/repos/GLoganDR/furry-farm/badge.png)](https://coveralls.io/r/GLoganDR/furry-farm)

### Screenshots
![Image1](https://raw.githubusercontent.com/kadowki/furry-farm/master/docs/screenshots/sn1.png)
![Image2](https://raw.githubusercontent.com/kadowki/furry-farm/master/docs/screenshots/sn2.png)

### Description
This is our super original and awesome dating website for Furries! If you like dressing up as an animal and going out on a date, you'll love Furry Farm!

### Models
#User
- .find
- .findById
- .register
- .localAuthenticate
- .twitterAuthenticate
- .googleAuthenticate
- .facebookAuthenticate
- .displayProfile
- .addWag
- .addLick
- .displayLicks 
- .displayProposals
- .propose 
- prototype.uploadPhoto
- prototype.save
- prototype.messages
- prototype.send
- prototype.acceptProposal
- prototype.declineProposal
- prototype.changePhoto
- fn-userIterator
- fn-sendText
- fn-sendEmail


#Message
- prop-fromtId
- prop-receiverId
- prop-body
- prop-date
- prop-isRead
- .messages
- .read
- .unread
- .send
- fn-iterator


#Proposal
- .findById
- .find


#Gift
- .findById
- .all

### Database: MongoDB: furry-farm

#User
- username
- password
- wags
- licks
- photos
- primaryPhotos
- height
- bodyType
- sex
- species
- description
- lookingFor
- favMedia

#Message
- receiverId
- fromId
- _id
- date
- body
- isRead

#Proposal
- receiverId
- fromId
- _id

#Gift
- _id
- name
- photo
- price

### Features
- Login/Logout
- Texting/Email/Internal Messaging
- Uploading photos
- Twitter/Facebook/Google Login
- Unique dating service...?

### Running Tests
```bash
$ npm install
$ npm test
```

### Contributors
- [Logan Richardson](https://github.com/GLoganDR)
- [Dave Boling](https://github.com/kadowki)
- [JoAnn Brookes](https://github.com/jbrooks036)
- [Jessica Raines](https://github.com/jessicafraines)

### License
[MIT](LICENSE)

