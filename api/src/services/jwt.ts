import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    issuer: 'accounts.examplesoft.com',
    audience: 'yoursite.net',
};


function action (jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}



const strategy = new JwtStrategy(options, action);
export default strategy;