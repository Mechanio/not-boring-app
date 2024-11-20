![PyPI - Python Version](https://img.shields.io/pypi/pyversions/privat_exchange_rates?style=for-the-badge)

## not boring app

API is implemented in FastAPI, database ORM - SQLAlchemy, front-end - ReactJS.


---
## How to install it?

#### - Python 3.10
#### - PIP dependencies
#### - in folder /app
```bash
pip install -r requirements.txt
```
---
#### - React(NodeJS)

For Ubuntu 20.04

```bash
sudo apt install npm
```

## How to start it?
## Fill .env variables
#### API backend (in app directory)
```bash
uvicorn app:app --reload
```
#### React (in frontend directory)
```bash
npm install
npm start
```

To connect:
- API documentation: http://localhost:8000/docs
- React front-end: http://localhost:3000/auth/login
---