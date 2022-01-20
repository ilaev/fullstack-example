import { ensureLeadingSlash, ensureTrailingSlash } from "./string-utility";

describe('ensureTrailingSlash', () => {

  it('should append slash at the end of a string', () => {
    expect(ensureTrailingSlash('test')).toEqual('test/');
  });

  it('should not append slash at the end of a string if it\'s already there.', () => {
    expect(ensureTrailingSlash('test/')).toEqual('test/');
  });
});

describe('ensureLeadingSlash', () => {

    it('should append slash at the beginning of a string', () => {
      expect(ensureLeadingSlash('test')).toEqual('/test');
    });

    it('should not append slash at the beginning of a string if it\'s already there', () => {
        expect(ensureLeadingSlash('/test')).toEqual('/test');
      });
  });
  
