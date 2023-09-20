# UI Notes

## Components: Divs vs. Sections

For components other than header and footer, you can use <section> tags if the content inside is related and forms a distinct section. Otherwise, <div> tags are fine for generic containers.

## Containers for Headers, Footers

For headers and footers, you can have a top-level container that sets the overall layout and inner containers for more specific layout control.

## Form Containers

For forms, you can have a specific .form-container if you need to apply styles or behaviors that are unique to forms. Otherwise, letting the top-level container handle it is fine.

## To summarize:

Use semantic HTML tags like <main>, <header>, and <footer> in your App.vue.
Use <section> for related content and <div> for generic containers.
Consider inner containers for more layout control.
Specific form containers can be useful but are not strictly necessary.

# Configurable Text

Strategy 1: Database-Driven Text
Pros:
Highly dynamic and configurable.
Easy to update without deploying code.
Cons:
Adds database queries to your application, which could impact performance.
Requires a UI for admins to update the text.
Implementation: Store the text in a database table but pulled it from json colum in mainassets table
