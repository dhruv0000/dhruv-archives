---
title: "Django"
date: 2025-06-09T12:14:44-04:00
_build:
  list: local
  render: link
---

# Django
Django is a high-level Python web framework that promotes rapid development and clean, pragmatic design by taking care of common web development tasks so developers can focus on application logic ([MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Django/Introduction?utm_source=chatgpt.com)). It follows a shared-nothing architecture that cleanly separates its components, allowing you to scale by adding hardware at any level—database servers, caching servers, or web/app servers—without tight coupling between layers ([Django Project](https://docs.djangoproject.com/en/5.2/faq/general/?utm_source=chatgpt.com)). At its core, Django adopts a variant of the MVC pattern, combining an Object-Relational Mapper (ORM), a URL dispatcher, a templating engine, and middleware into a cohesive yet loosely coupled stack that handles everything from request routing to response rendering ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).

## Architecture Overview

Celery: is a distributed task queue often used with Django to perform background tasks asynchronously

## To Remember:
Cookie-clutter: django apps boilerplate

## Adv Course
Pillow: used for img processing

## Deployments
- Digital Ocean / Azure
- manually install Db, change settings.py DATABASE_SETTINGS
- Gunicorn:  Python WSGI HTTP Server for UNIX (made for prod)
 - Need to create socket and service
 - Make 
- NGINX: Traffic handler

- AWS: `.ebextensions/` for advance configuration (like django migrate)
- Elastic Bean Stock will not hold on to files for us
console->config->database (Use env var for db name, user, password)
django-storages (for static storage) boto3

- HEROKU: Git required -> Push to Heroku (Heroku create)
- Make Procfile (on release: do migration; web:setup gunicorn)
- Addons for DB. 
- Run commands from cli
- s3 for static/media files: django-storages (for static storage) boto3


## Move to React
Set FRONTEND_ROOT to the build and update view | In react update proxy in package.json
Axois is used to communicate b/w frontend and backend

### Design Principles

Django’s philosophy emphasizes loose coupling and tight cohesion: each layer (database, business logic, presentation) interacts only through well-defined interfaces, minimizing dependencies between components ([Django Project](https://docs.djangoproject.com/en/5.2/misc/design-philosophies/?utm_source=chatgpt.com)). This approach makes Django projects easier to maintain and extend over time.

### Core Components

* **Object-Relational Mapper (ORM):** Maps Python classes to database tables, enabling developers to work with databases using Python code instead of SQL ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).
* **URL Dispatcher:** Routes incoming request URLs to the appropriate view functions or classes based on URL patterns ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).
* **Template Engine:** Renders data into HTML using the Django Template Language, supporting inheritance, filters, and tags ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).
* **Middleware:** Hooks that process requests and responses globally (e.g., for authentication, caching, or security) before and after view logic ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).
* **Development Server:** A lightweight web server for local development and testing, automatically reloading on code changes ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).
* **Built-in Features:** Includes form serialization and validation, a caching framework, internationalization, an authentication system, and an automatic admin interface ([Wikipedia](https://en.wikipedia.org/wiki/Django_%28web_framework%29?utm_source=chatgpt.com)).

### Request-Response Cycle

1. **WSGI/ASGI Interface:** Django supports both WSGI (synchronous) and ASGI (asynchronous) interfaces to communicate with web servers, with ASGI enabling real-time features like WebSockets ([Django Project](https://docs.djangoproject.com/en/5.2/howto/deployment/?utm_source=chatgpt.com)).
2. **Middleware Processing:** Once the environment is loaded, the request object passes through middleware classes defined in `MIDDLEWARE` settings, which can modify the request or perform tasks like authentication and caching ([Medium](https://medium.com/%40developerstacks/django-request-response-cycle-7165167f54c5?utm_source=chatgpt.com)).
3. **URL Routing:** The URL dispatcher matches the request path against URL patterns and directs it to the corresponding view function or class ([DEV Community](https://dev.to/timiemmy/understand-the-request-response-cycle-of-django-228k?utm_source=chatgpt.com)).
4. **View Execution:** The view callable processes the business logic, often querying the database via the ORM, and then returns an `HttpResponse`—frequently by rendering a template into HTML ([W3Schools](https://www.w3schools.com/django/django_intro.php?utm_source=chatgpt.com)).
5. **Response Middleware:** After the view returns a response, response middleware can further modify it before Django hands it back to the web server for delivery to the client ([DataFlair](https://data-flair.training/blogs/django-request-response-cycle/?utm_source=chatgpt.com)).

## MVT (Model-View-Template) Pattern

### Overview of MVT

Django’s architectural pattern is called Model-View-Template (MVT), a slight adaptation of the traditional MVC approach tailored for web development ([TutorialsPoint](https://www.tutorialspoint.com/django/django_mvt.htm?utm_source=chatgpt.com)). It divides application code into three interconnected layers, each with a distinct responsibility.

### Model

Models define the data structure and database schema through Python classes. Each model class corresponds to a database table, and Django’s ORM handles SQL generation and execution under the hood ([GeeksforGeeks](https://www.geeksforgeeks.org/django-project-mvt-structure/?utm_source=chatgpt.com)).

- Django forms can be used to enforce specific rules (like `clean_title`)
- `meta -> widgets` can be added to change CSS/HTML of the form


### View

Views are Python callables—either functions or class-based views—that receive HTTP requests, apply business logic (such as validating forms or querying models), and return an `HttpResponse` object. Views may render templates or return data in other formats (JSON, XML, etc.) ([Medium](https://angelogentileiii.medium.com/basics-of-django-model-view-template-mvt-architecture-8585aecffbf6?utm_source=chatgpt.com)).


- ModelSerializer for converting to JSON,XML,YML
- PageNo Pagination; LimitOffset: Use limit+offset; curser Pagination: Use db pointer

### Decorator and Mixins
@login_required(login_url=) can be used to login.
In class we can use Mixins like (LoginRequiredMixin) for login

We can use `ListView` and `DetailView` for easy reflection.

### Template

Templates are text files (usually HTML) that define how data is presented to the user. The Django Template Language allows embedding variables, control flow tags, filters, and template inheritance to build dynamic, reusable layouts ([Medium](https://angelogentileiii.medium.com/basics-of-django-model-view-template-mvt-architecture-8585aecffbf6?utm_source=chatgpt.com)).

- Can create a base template using `{% block content %} and {% endblock %}` and `{% extends "base.html" %}`.
- Needs `CSRF` for forms.

### Benefits of Separation

By isolating data handling (Models), business logic (Views), and presentation (Templates), Django’s MVT pattern streamlines development, makes code easier to test, and enhances maintainability and scalability for growing projects ([educative.io](https://www.educative.io/answers/what-is-mvt-structure-in-django?utm_source=chatgpt.com)).

## Django Project Structure

A typical Django project follows a standardized directory layout that helps organize code and configuration. Below is a sample structure for a project named `myproject`:

```
myproject/                 # Root directory for the project
├── manage.py              # CLI utility for Django commands (runserver, migrations, etc.)
├── requirements.txt       # List of Python dependencies
├── myproject/             # Main project package
│   ├── __init__.py        # Marks this directory as a Python package
│   ├── settings.py        # Global settings & configuration
│   ├── urls.py            # URL declarations for the project
│   ├── asgi.py            # ASGI entrypoint
│   └── wsgi.py            # WSGI entrypoint
├── app1/                  # First Django app
│   ├── migrations/        # Database migrations
│   ├── __init__.py
│   ├── admin.py           # Admin site configuration
│   ├── apps.py            # App configuration
│   ├── models.py          # Data models (ORM)
│   ├── tests.py           # Unit tests
│   ├── views.py           # View functions or classes
│   ├── urls.py            # URL patterns for this app
│   ├── templates/         # App-specific templates
│   │   └── app1/          # Namespace for app1 templates
│   │       └── index.html
│   └── static/            # App-specific static files
│       └── app1/          # Namespace for app1 static files
│           ├── css/
│           └── js/
├── templates/             # Project-level templates
│   └── base.html          # Base template for inheritance
└── static/                # Project-level static assets
    ├── css/
    ├── js/
    └── images/
```

### Component Breakdown

* **manage.py**: Entry point for Django's command-line utilities. It sets the `DJANGO_SETTINGS_MODULE` environment variable and executes commands such as `runserver`, `migrate`, and `createsuperuser`.
* **requirements.txt**: Keeps track of project dependencies for easy installation (e.g., `Django==5.2`, `djangorestframework`).
* **Project package (`myproject/`)**: Contains configuration files:

  * `settings.py`: Central settings module (database config, installed apps, middleware, templates, LOGIN_REDIRECT_URL,  etc.).
  * `urls.py`: Routes URLs to views across the entire project.
  * `asgi.py` & `wsgi.py`: Entry points for asynchronous (ASGI) and synchronous (WSGI) servers.
* **Apps (`app1/`, `app2/`, etc.)**: Each Django app encapsulates a discrete piece of functionality. Standard files include:

  * `models.py`: Defines data models.
  * `views.py`: Handles request logic.
  * `urls.py`: Declares app-specific URL patterns.
  * `admin.py`: Registers models with the admin interface.
  * `migrations/`: Auto-generated database migration files.
  * `templates/` & `static/`: Store app-scoped templates and static files for modularity.
* **Templates & Static directories**: Shared folders for templates and static assets used across multiple apps.

This structure promotes separation of concerns, modularization, and ease of maintenance as your Django project grows.
