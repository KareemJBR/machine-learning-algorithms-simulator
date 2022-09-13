## Requirements
   - Python
   - Django
   - Numpy
   - Matplotlib
   - Pip for Python package and environment management.

## Start

1. Activate the virtual environment:

   - on Linux: `source .venv/bin/activate`
   - on Windows: `source .venv/Scripts/activate`


2. Start a Django application `python manage.py runserver`

3. Visit http://127.0.0.1:8000/

## Project setup

1. Create virtual environment `python -m venv .venv`

2. Activate the virtual environment:

   - on Linux: `source .venv/bin/activate`
   - on Windows: `source .venv/Scripts/activate`

3. Install the project dependencies: `pip install -r requirements.txt`

4. Create `.env` file in the `setup` folder with such environment variables:

   `SECRET_KEY=<some_secret_value>`

5. Start a Django application `python manage.py runserver`

6. Visit http://127.0.0.1:8000/
