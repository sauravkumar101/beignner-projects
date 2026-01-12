"""Seed script: creates DB tables and sample data (admin + products)
Run: python seed.py"""
from app import create_app, db
from app.models import User, Product

app = create_app()

with app.app_context():
    db.create_all()

    if not User.query.filter_by(email='admin@example.com').first():
        admin = User(username='admin', email='admin@example.com', is_admin=True)
        admin.set_password('adminpass')
        db.session.add(admin)

    if Product.query.count() == 0:
        for i in range(1,7):
            p = Product(title=f'Demo Product {i}', description='A simple demo product', price=9.99 * i)
            db.session.add(p)

    db.session.commit()
    print('Seed complete: admin user (admin@example.com / adminpass) and demo products')