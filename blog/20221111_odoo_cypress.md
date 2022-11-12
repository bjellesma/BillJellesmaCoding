---
title: "End to End Testing Odoo with Cypress"
date: "2022-11-11 23:00:00"
updateTime: "2022-11-11 23:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20221111_cypress.png
tagline: "Automate putting an RFQ in an ERP"
published: True
tags:
  - Odoo
  - test
  - cypress
---

Cypress is an amazing tool for testing your entire application just as a user would see it. I've used it in other projects that I've worked on in the past so I wanted to revisit it and take a look how I could use it to do end2end testing for Odoo

<ul>
    <li><a href="blog/20221111_odoo_cypress#install">Installing Cypress</a></li>
    <li><a href="blog/20221111_odoo_cypress#configure">Configure Cypress</a></li>
    <li><a href="blog/20221111_odoo_cypress#logging">Logging into Odoo</a></li>
    <li><a href="blog/20221111_odoo_cypress#rfq">Entering a Request for Quotation</a></li>
</ul>

## <a name="install">Installing Cypress</a>

1. (Linux) install the necessary aptitude packages

The docs specify that for ubuntu, you will need the following packages. I likely already had these in my system because I did not need to install these.

```
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

2. Create a package.json file

`npm init`

This will ask you a bunch of questions about your package such as the author. Once the `package.json` file is created, we can install cypress using

`npm install cypress --save-dev`

The following code will automatically be inserted into your `package.json` file

```js
"devDependencies": {
    "cypress": "^11.0.1"
  }
```

## <a name="configure">Configure Cypress</a>

Add a script command to your `package.json` to open cypress launchpad from the command line

```js
"scripts": {
    "cypress:open": "cypress open"
  },
```

You can then open the cypress launchpad using `npm run cypress:open`. Choose E2E testing as the type in order to test the entire odoo app as we want

![Choose a Testing Type](../../assets/images/20221111_cypress/2022-11-11-20-37-19.png)

Choose continue on the configuration files section to select the default

![Configuration Files](../../assets/images/20221111_cypress/2022-11-11-20-46-20.png)

The launchpad will begin loading your configuration and then you will be able to select a browser from your system to be able to test in.

![Choose a Browser](../../assets/images/20221111_cypress/2022-11-11-20-49-02.png)

##<a href="test">Your first test</a>

Now that we've configured cypress, cypress launchpad has launched a new automated web browser.

![Automated Browser](../../assets/images/20221111_cypress/2022-11-11-20-56-31.png)

You'll notice (if you're using Google Chrome) We'll this to generate a new empty spec file.

![Create spec file](../../assets/images/20221111_cypress/2022-11-11-20-53-00.png)

Notice after creating the spec file that you'll now have a new cypress directory along with an e2e subdirectory where your spec file will reside.

![spec file directory](../../assets/images/20221111_cypress/2022-11-11-20-59-16.png)

Replace the contents of this spec file with the following code which will simply test if it's able to visit the address that odoo is running on.

```js
describe("Visiting Odoo", () => {
  it("passes", () => {
    cy.visit("http://127.0.0.1:8069/");
  });
});
```

Once you save the spec file with the new contents, notice that your automated browser will automatically reload with the new test

![Visiting Odoo](../../assets/images/20221111_cypress/2022-11-11-21-04-24.png)

Lastly for our test, we want to use an assertion which is a clear indication that a test has passed/failed. In cypress language, this is done using a `.should()` method. The following assertion will make sure that we're redirected to the `/web/login` page.

```js
describe("Visiting Odoo", () => {
  it("passes", () => {
    cy.visit("http://127.0.0.1:8069/");
    cy.url().should("include", "/web/login");
  });
});
```

This is a simple test to make sure that we can visit the website. Now we want to actually login to the website to create a purchase order.

## <a name="logging">Logging into Odoo</a>

Using Cypress will require us to actually be able to find the elements in the Document Object Model (DOM) so that we can have cypress type in the details. In Google Chrome, you can either right click anywhere on the webpage and click "Inspect" or you can press F12 on your keyboard. From there, you can actually hover over the names of the elements in the DOM and chrome will highlight on the page what the DOM element is rendering.

![Identify the DOM of the form](../../assets/images/20221111_cypress/2022-11-11-21-13-12.png)

After identifying how to input the login and password using the `.type()` method and using `.click()` to login, here's the full script

```js
describe("Visiting Odoo", () => {
  it("passes", () => {
    cy.visit("http://127.0.0.1:8069/");
    cy.url().should("include", "/web/login");
    cy.get('input[name="login"]').type("bjellz");
    cy.get('input[name="password"]').type("test");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/web#");
  });
});
```

## <a name="rfq">Entering a Request for Quotation</a>

After logging into Odoo, creating any automation just becomes a matter of finding the element in the DOM and entering it into the cypress scripts. All elements on the page are fair game to be captured using the familiar CSS selectors. Creating a new request for quotation can be done by expanding the initial script to do the following

```js
describe("Visiting Odoo", () => {
  it("Create RFQ", () => {
    cy.visit("http://127.0.0.1:8069/");
    cy.url().should("include", "/web/login");
    cy.get('input[name="login"]').type("bjellz");
    cy.get('input[name="password"]').type("test");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/web#");
    cy.get("button.dropdown-toggle i").click();
    cy.get('a[data-menu-xmlid="purchase.menu_purchase_root"]').click();
    cy.get("button.o_list_button_add").click();
    cy.get('div[name="partner_id"] input').type("Administrator");
    cy.get('input[name="schrute_bucks"]').type(2);
    // add a product
    cy.get(
      "table.o_section_and_note_list_view td.o_field_x2many_list_row_add a"
    )
      .contains("Add a product")
      .click();
    cy.get('div[name="product_id"] input').type("Test Product").click();
    // In Odoo, you need to click outside to save the many2many
    cy.get("body").click(0, 0);
    // click the save button
    cy.get("button.o_form_button_save").contains("Save").click();
    // the only way that id= can be in the url is if we have navigated to a saved record
    cy.url().should("match", /&id=|\?id=/);
  });
});
```

As you can see in the above script, a few items take some explaining

1. Tricky selectors in Odoo

```js
cy.get("table.o_section_and_note_list_view td.o_field_x2many_list_row_add a")
  .contains("Add a product")
  .click();
```

Odoo doesn't always make it easy to find the selectors that you need. For example, the above took some time in looking at the DOM and find creative ways to targe only that one element that I want. In this case, I want to click the "Add a product" element.

2. For many2many and one2many fields, I've found that you need to click outside before saving the record

The following code just finds the exact coordinates on the page of where to click

```js
// In Odoo, you need to click outside to save the many2many
cy.get("body").click(0, 0);
```

3. You can use regex with certain assertions, which is useful when dealing with Odoo

The following code says that the url should contain either "?id=" or "&id=" which makes sense as this is going to be in the query parameters somewhere when we're navigating to a finished record.

```js
// the only way that id= can be in the url is if we have navigated to a saved record
cy.url().should("match", /&id=|\?id=/);
```

So, this was a simple case demonstrating the power that Cypress can accomplish given only for us to do some handy javascript work
