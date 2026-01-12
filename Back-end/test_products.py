from app import create_app, db
import pytest


@pytest.fixture
def client():
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client


def test_create_list_products(client):
    # products list empty
    resp = client.get('/api/products/')
    assert resp.status_code == 200
    assert resp.get_json() == []
