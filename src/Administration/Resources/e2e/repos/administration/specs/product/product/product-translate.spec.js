const productPage = require('administration/page-objects/module/sw-product.page-object.js');

const fixture = {
    name: "Really good product",
    descriptionLong: "This describes a product. It is your product. You will take care of your product. You will set a price, keep records of storage quantities and take care of whatever needs your product might develop. You love your product. Your are the product. Now go find someone dumb enough to buy your precious product.",
};

module.exports = {
    '@tags': ['product', 'product-translate', 'translation', 'language-switch'],
    before: (browser, done) => {
        global.ProductFixtureService.setProductFixture(fixture).then(() => {
            done();
        });
    },
    'open product listing': (browser) => {
        const page = productPage(browser);

        browser
            .openMainMenuEntry({
                targetPath: '#/sw/product/index',
                mainMenuId: 'sw-product'
            })
            .expect.element(page.elements.productListName).to.have.text.that.contains(fixture.name);
    },
    'find product to be translated': (browser) => {
        const page = productPage(browser);

        browser
            .clickContextMenuItem('.sw-context-menu-item__text', page.elements.contextMenuButton, `${page.elements.gridRow}--0`)
            .waitForElementNotPresent(`.product-basic-form ${page.elements.loader}`)
            .expect.element(page.elements.smartBarHeader).to.have.text.that.equals(fixture.name);
    },
    'change language to german': (browser) => {
        const page = productPage(browser);
        browser
            .click('.sw-language-switch')
            .waitForElementNotPresent('.sw-field__select-load-placeholder');

        browser.expect.element('.sw-select-option:last-child').to.have.text.that.equals('Deutsch');
        browser
            .click('.sw-select-option:last-child')
            .waitForElementNotPresent('.sw-field__select-load-placeholder')
            .expect.element(`${page.elements.modal}__body`).to.have.text.that.contains('There are unsaved changes in the current language. Do you want to save them now?');

        browser
            .click(`${page.elements.modal}__footer button${page.elements.primaryButton}`)
            .waitForElementNotPresent(page.elements.modal)
            .checkNotification(`Product "${fixture.name}" has been saved successfully.`)
            .expect.element('.sw-language-info').to.have.text.that.equals(`Translation of "${fixture.name}" in the root language "Deutsch". Fallback is the system default language "English".`);

    },
    'translate some information to german': (browser) => {
        const page = productPage(browser);

        browser
            .fillField('input[name=sw-field--product-name]', 'Echt gutes Produkt', true)
            .fillField('.ql-editor', 'Siehst du nicht, dass das ein wunderbares Produkt ist?', true, 'editor')
            .click(page.elements.productSaveAction)
            .checkNotification('Product "Echt gutes Produkt" has been saved successfully.');
    },
    'verify product in listing': (browser) => {
        const page = productPage(browser);

        browser
            .click('.smart-bar__actions .sw-button__content')
            .expect.element(`${page.elements.gridRow}--0 .sw-product-list__column-product-name`).to.have.text.that.equals('Echt gutes Produkt');
    },
    'change back to english and verify again': (browser) => {
        const page = productPage(browser);

        browser
            .click('.sw-language-switch')
            .waitForElementNotPresent('.sw-field__select-load-placeholder')
            .expect.element('.sw-select-option:first-child').to.have.text.that.equals('English');

        browser
            .click('.sw-select-option:first-child')
            .waitForElementNotPresent('.sw-field__select-load-placeholder')
            .waitForElementNotPresent(page.elements.loader)
            .expect.element(`${page.elements.gridRow}--0  .sw-product-list__column-product-name`).to.have.text.that.equals(fixture.name).before(5000);
    },
    after: (browser) => {
        browser.end();
    }
};
