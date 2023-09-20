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

# Vue Router

No, dynamic routes and lazy-loading are two different concepts.

Dynamic Routes
Dynamic routes are routes that are defined using a special syntax to include parts of the URL as route parameters. For example, /user/:id is a dynamic route where :id is a route parameter. When you navigate to /user/1, the id parameter will be 1.

In the context of HMR, if you are working on a component that is loaded based on a dynamic route and you make changes to how those route parameters are used within the component, HMR might not always update the component as expected. You might have to manually refresh the page to see the changes.

Lazy-Loading
Lazy-loading is a technique where you only load the code for a route when the user actually navigates to that route. This is done to improve the initial load time of the application. In Vue Router, you can achieve this by using dynamic imports in your route configuration:

javascript
Copy code
const routes = [
{ path: '/about', component: () => import('@/views/About.vue') }
]
Here, the About.vue component will only be loaded when the user navigates to /about, not when the application initially loads.

Both dynamic routes and lazy-loading are useful features, but they serve different purposes. Dynamic routes are about making your routes flexible and parameterized, while lazy-loading is about optimizing load performance.
