import { rgb2hex } from "./color-utility";


describe('rgb2hex', () => {

  it('should transform rgb value to hex value', () => {
    expect(rgb2hex('rgb(123, 123, 123)')).toEqual('#7b7b7b');
  });

  it('should not transform rgb value to hex value if rgb value is an invalid value.', () => {
    expect(rgb2hex('whatever')).toEqual('');
  });
});


  
