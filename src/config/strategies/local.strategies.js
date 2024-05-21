const passport = require('passport');
const {Strategy} = require('passport-local');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:local');
const User = require('../../schemas/UserSchema');


function localStrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password'

        }, (username, password, done) => {
            (async () => {
                let client;
                try {
                    const user = await User.collection.findOne({'email': username})
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (isMatch) {
                        done(null, user)
                    } else {
                        done(null, false)
                    }
                } catch (err) {
                    debug(err.stack);
                }
            })();
        }))
}

module.exports = localStrategy;