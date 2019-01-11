# Front End Technical Exercise

This is my work on the Dwolla front-end technical exercise portion of the interview.

### Technologies Used

Due to time contraints, I wasn't able to use the most efficient technologies, at least
in terms of a long-term, easily maintained solution.
- Vanilla CSS
- Bootstrap
- jQuery
- QUnit Testing Framework

### Instructions for Viewing Application

1. Download files to local machine
2. Open index.html

### Instructions for Running Unit Tests

1. Download files to local machine
2. Open test/test.html (Tests run automatically when file is opened)

### Ideas if I had more time

- Switch from Vanilla CSS to SCSS. I'm a little rusty with SCSS and this application was
small enough that I chose to use Vanilla CSS, but if this application were larger, SCSS
could help prevent the CSS from getting too messy
- Implement a better solution for the "Create another Masspay" button. It currently just
refreshes the page, but I would rather not do that and instead switch back to the other view
after clearing the data, resetting number of rows, etc.
- Implement a warning system to help users avoid making duplicate payments. It would check
to see if any two rows had the same recipient and amount before submitting. If it found a
duplicate, a popup modal would appear to display this, allowing the user to either cancel
or continue.
