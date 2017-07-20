import { RegifactPage } from './app.po';

describe('regifact App', () => {
  let page: RegifactPage;

  beforeEach(() => {
    page = new RegifactPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
