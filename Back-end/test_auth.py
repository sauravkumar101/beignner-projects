import os
import tempfile
import pytest
from app import create_app, db


@pytest.fixture
def client():
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client


def test_signup_and_login(client):
    # sign up
    resp = client.post('/api/auth/signup', json={
        'username': 'testuser', 'email': 'test@example.com', 'password': 'secret'
    })
    assert resp.status_code == 201

    # login
    resp = client.post('/api/auth/login', json={'email': 'test@example.com', 'password': 'secret'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'access_token' in data
