// @flow
process.env.NODE_ENV = "production"
import invariant from '../src/tiny-invariant';
import invariantKeepMessages from '../src/tiny-invariant-keep-messages';

it('invariant should not display custom messages in production', () => {
try {
    invariant(false, 'This is a custom message');
} catch (e) {
    invariant(e instanceof Error);
    expect(e.message).toEqual('Invariant failed');
}
});

it('invariantKeepMessages should display custom messages in production', () => {
try {
    invariantKeepMessages(false, 'This is a custom message');
} catch (e) {
    invariant(e instanceof Error);
    expect(e.message).toEqual('Invariant failed: This is a custom message');
}
});


  