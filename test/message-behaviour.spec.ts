// @flow
import invariant from '../src/tiny-invariant';
import invariantKeepMessages from '../src/tiny-invariant-keep-messages';

describe.each([
  ['invariant', invariant],
  ['invariantKeepMessages', invariantKeepMessages]
])("%s", (_, invariantFunction: typeof invariant)=> {
  it('should include a default message when an invariant does throw and no message is provided', () => {
    try {
      invariantFunction(false);
    } catch (e) {
      invariantFunction(e instanceof Error);
      expect(e.message).toEqual('Invariant failed');
    }
  });
  
  it('should include a provided message when an invariant does throw', () => {
    try {
      invariantFunction(false, 'my message');
    } catch (e) {
      invariantFunction(e instanceof Error);
      expect(e.message).toEqual('Invariant failed: my message');
    }
  });
  
  it('should not execute a message function if the invariant does not throw', () => {
    const message = jest.fn(() => 'lazy message');
    invariantFunction(true, message);
    expect(message).not.toHaveBeenCalled();
  });
  
  it('should execute a message function if the invariant does throw', () => {
    const message = jest.fn(() => 'lazy message');
    try {
      invariantFunction(false, message);
    } catch (e) {
      invariantFunction(e instanceof Error);
      expect(message).toHaveBeenCalled();
      expect(e.message).toEqual('Invariant failed: lazy message');
    }
  });
})


