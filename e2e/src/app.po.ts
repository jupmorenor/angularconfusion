import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo(link: string): Promise<unknown> {
    return browser.get(browser.baseUrl + link) as Promise<unknown>;
  }

  getTitleText(selector: string): Promise<string> {
    return element(by.css(selector)).getText() as Promise<string>;
  }

  getElement(selector: string): ElementFinder {
    return element(by.css(selector));
  }

  getAllElements(selector: string): ElementArrayFinder {
    return element.all(by.css(selector))
  }
}
