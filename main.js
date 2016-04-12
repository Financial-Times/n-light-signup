export default {
    init(flags) {
        flags.get('lightSignUp') && require('./src/light-signup');
    }
}
