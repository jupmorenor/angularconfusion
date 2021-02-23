import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying Ristorante Con Fusion', () => {
    page.navigateTo('/');
    expect(page.getTitleText('app-root h1')).toEqual('Ristorante Con Fusion');
  });

  it('should navigate to about us page by clicking the link', () => {
    page.navigateTo('/');
    let navlink = page.getAllElements('a').get(1);
    navlink.click();
    expect(page.getTitleText('h3')).toBe('About Us');
  });

  it('should enter a comment for the first dish', () => {
    page.navigateTo('/dishdetail/0');
    const newAuthor = page.getElement('input[type=text]');
    const newComment = page.getElement('textarea');
    const submitButton = page.getElement('button[type=submit]');
    newAuthor.sendKeys('test Author');
    newComment.sendKeys('Test comment');
    submitButton.click();
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
