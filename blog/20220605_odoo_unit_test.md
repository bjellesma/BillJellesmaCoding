---
title: "Unit Testing Schrute Farm Beets"
date: "2022-07-17 23:00:00"
updateTime: "2022-07-17 23:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20220606_odoo_modules.jpg
tagline: "Unit testing is important for software. Odoo included"
published: True
tags:
  - Odoo
  - test
---

# Identify the problem

Our app is pretty good at allowing the purchaser to enter the price in Schrute Bucks, but there is one problem. It looks like the user is able to enter any text in the field. We want the user to only be able to enter a number.

![Able to enter text](../../assets/images/20220606_unit_test/2022-07-17-15-53-19.png)

Ideally, we'll want to override the create method to add a check to ensure that the value in the field is a number. However, we see this becoming a large project so we want to ensure that any features that we add in the future will not break our check that we have yet to write. We're going to adopt a methodology called test driven development. **Test Driven Development** means that we want to write the test first for the expected behavior and then we'll write the code to pass this test. The test will fail the first time that you run it because there's no code in place to change this behavior.

# Write a test

## Coding

Similarly when we defined a model, we'll make a `tests` subfolder. This is not just a convention but Odoo is programmed to check a subfolder named `tests` to find any tests to run for the module.

![Tests folder structure](../../assets/images/20220606_unit_test/2022-07-17-16-04-01.png)

You will need an `__init__.py` file which will import any test files so that Odoo knows what to run.

```py
from . import test_schrute_bucks
```

Any test file will need to begin with `test_`. For `test_schrute_bucks.py`, we're going to use the most common test case that Odoo provides for us to help define our class, `common.TransactionCase`, which we'll import from the Odoo base tests. Now, we'll create a simple method called `test_is_number` which uses the `with` context manager keyword to make sure that when we attempt to create a record with test in the `schrute_bucks` field, a `ValidationError` will be raised. Finally, notice when creating the record, we must also specify a valid `partner_id` in the dictionary. This is because when we create a record for `purchase.order` on the web, a `Vendor` field is required.

![Required fields](../../assets/images/20220606_unit_test/2022-07-17-16-39-51.png)

Notice that `Order Deadline` doesn't need to be filled out because this is automatically generated when the record is created.

Further reading on Odoo python unit testing can be found [here](https://www.odoo.com/documentation/15.0/developer/reference/backend/testing.html#testing-python-code)

```py
from odoo.tests import common

from odoo.exceptions import ValidationError

class TestSchruteBucks(common.TransactionCase):
    def test_is_number(self):
        with self.assertRaises(ValidationError):
            self.env['purchase.order'].create(
                {
                    'partner_id': 2,
                    'schrute_bucks': 'test_val'
                }
            )
```

## Running the test

Running a test can be confusing when you first write a test in Odoo. From the [documentation](https://www.odoo.com/documentation/15.0/developer/reference/backend/testing.html#running-tests) you want to both upgrade the module with the test that you want to run and include the `--test-enable` flag on the command line. Doing this will start Odoo as normal but search the module that you've specified for the `tests` subfolder and run any tests before starting the server. I include any other flags that I want to specify in a configuration file so that I can fun the following command: `python ./odoo-bin -c run.conf -u purchase_schrute_bucks --test-enable`. For convenience and because I already use the virtual environment `pipenv` from [a previous post](https://billjellesmacoding.netlify.app/blog/20211021_odoo_pipenv), I usually include this as a separate command: `test = python ./odoo-bin -c run.conf -u purchase_schrute_bucks --test-enable` so that I can just enter `pipenv run test`

What can also be confusing is that any output is included with your other logs so you may need to search your logs to find the result. After a little digging, I've found a failed test that my error was never raised.

```
2022-07-17 20:31:12,321 24208 ERROR odoo-test4 odoo.addons.purchase_schrute_bucks.tests.test_schrute_bucks: FAIL: TestSchruteBucks.test_is_number
Traceback (most recent call last):
  File "Projects/odoo15/odoo/customaddons/purchase_schrute_bucks/tests/test_schrute_bucks.py", line 11, in test_is_number
    'schrute_bucks': 'test_val'
  File "/usr/lib/python3.7/contextlib.py", line 119, in __exit__
    next(self.gen)
  File "Projects/odoo15/odoo/odoo/tests/common.py", line 436, in _assertRaises
    yield cm
  File "/usr/lib/python3.7/contextlib.py", line 524, in __exit__
    raise exc_details[1]
  File "/usr/lib/python3.7/contextlib.py", line 509, in __exit__
    if cb(*exc_details):
  File "/usr/lib/python3.7/contextlib.py", line 377, in _exit_wrapper
    return cm_exit(cm, exc_type, exc, tb)
AssertionError: ValidationError not raised
```

This is what we want. We want the test to fail so that I can write some code to successfully raise the error and pass the test.

# Create code to pass the test

We will add to `purchase.py` from [the last post](https://billjellesmacoding.netlify.app/blog/20220605_odoo_custom_module_inherit) and override the `create` method to attempt to convert our value to a number using the `int` method. If we can convert this without an error, we will proceed with the record creation using a call to `super()`. If we can't convert this value, we'll raise a validation error.

```py
from odoo import models, fields, api
from odoo.exceptions import ValidationError

class PurchaseOrder(models.Model):
    _inherit = "purchase.order"

    schrute_bucks = fields.Char(string='Price in Schrute Bucks', required=True)

    @api.model
    def create(self, vals):
        if 'schrute_bucks' in vals:
            try:
                int(vals.get('schrute_bucks'))
            except ValueError as ver:
                raise ValidationError(f'Unable to convert {vals.get("schrute_bucks")}. Error: {ver}')
        return super().create(vals)
```

Here's what this looks like on the web when the error is generated ![Unable to convert](../../assets/images/20220606_unit_test/2022-07-17-17-15-18.png). Odoo won't allow you to save the record until you enter a valid number.

## Pass that test

We should have the code now that's able to properly pass the test. One thing that I've found challenging and don't know a solution for is getting test results. You'll be able to see an Info log that was generated like

```
2022-07-17 21:31:04,777 4029 INFO odoo-test4 odoo.addons.purchase_schrute_bucks.tests.test_schrute_bucks: Starting TestSchruteBucks.test_is_number ...
```

However, I like to do a little customization and include a print statement after that assert because an assertion error will be raised anyway if the assertion fails. So here, I'll just add a simple print statement. Depending on the system that you're using, you can also go further and customize the colors to make this print statement pop out more. You can also modify the test to have this written to a test-results file

```py
from odoo.tests import common

from odoo.exceptions import ValidationError

class TestSchruteBucks(common.TransactionCase):
    def test_is_number(self):
        with self.assertRaises(ValidationError):
            self.env['purchase.order'].create(
                {
                    'partner_id': 2,
                    'schrute_bucks': '6'
                }
            )
        print('Schrute Bucks has passed')

```
