from datetime import datetime

from sqlalchemy import Boolean, Column, ForeignKey, DateTime, Integer, String
from sqlalchemy.orm import relationship, Session
from passlib.hash import pbkdf2_sha256 as sha256

from database.database import base


class UserModel(base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    firstname = Column(String(30), nullable=False)
    lastname = Column(String(30), nullable=False)
    email = Column(String(50), nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean(), nullable=False)
    activities = relationship("ActivitiesModel", lazy='dynamic', cascade="all, delete-orphan",
                          foreign_keys="ActivitiesModel.user_id")

    @classmethod
    def find_by_id(cls, db: Session, id_: int):
        """
        Find active user by id
        :param id_: user id

        :return:  model instance
        """
        user = db.query(cls).filter_by(id=id_).first()
        if not user:
            return {}
        if user.is_active:
                return user
        else:
            return {}

    @classmethod
    def find_by_name(cls, db: Session, firstname: str, lastname: str):
        """
        Find active user by name
        :param firstname: user firstname
        :param lastname: user lastname
        :return: model instance
        """
        user = db.query(cls).filter_by(firstname=firstname, lastname=lastname) \
            .order_by(cls.id).first()
        if not user:
            return {}
        if user.is_active:
                return user
        else:
            return {}

    @classmethod
    def find_by_email(cls, db: Session, email: str):
        """
        Find active user by email
        :param email: user email
        :return: model instance
        """
        user = db.query(cls).filter_by(email=email).first()
        if not user:
            return {}
        if user.is_active:
                return user
        else:
            return {}

    @classmethod
    def return_all(cls, db: Session, offset: int, limit: int):
        """
        Return all active users
        :param offset: skip offset rows before beginning to return rows
        :param limit: determines the number of rows returned by the query
        :return: list of dict representations of users
        """
        users = db.query(cls).order_by(cls.id).offset(offset).limit(limit).all()
        return [user for user in users if user.is_active]

    @classmethod
    def return_all_inactive(cls, db: Session, offset: int, limit: int):
        """
        Return all inactive users
        :param offset: skip offset rows before beginning to return rows
        :param limit: determines the number of rows returned by the query
        :return: list of dict representations of users
        """
        users = db.query(cls).order_by(cls.id).offset(offset).limit(limit).all()
        return [user for user in users if not user.is_active]

    @classmethod
    def delete_by_id(cls, db: Session, id_: int):
        """
        Delete user by id
        :param id_: user id
        :return: code status (200, 404)
        """
        user = db.query(cls).filter_by(id=id_).first()
        if user:
            user.is_active = False
            user.save_to_db()
            return 200
        else:
            return 404

    def save_to_db(self, db: Session):
        """
        Save model instance to database
        :return: None
        """
        db.add(self)
        db.commit()

    @staticmethod
    def generate_hash(password):
        """
        Generate hashed password
        :param password: password to hash
        :return: hashed password
        """
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hashed):
        """
        Verify hashed password with imputed one
        :param password: imputed password
        :param hashed: hashed password
        :return: True or False
        """
        return sha256.verify(password, hashed)


class ActivitiesModel(base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("UserModel", back_populates='activities')
    start = Column(String(20), nullable=False)
    finish = Column(String(20))

    @classmethod
    def find_by_id(cls, db: Session, id_: int):
        """
        Find activity by id
        :param id_: activity id
        :return: dict representation of score info or model instance
        """
        activity = db.query(cls).filter_by(id=id_).first()
        if not activity:
            return {}
        return activity

    @classmethod
    def find_by_user_id(cls, db: Session, user_id: int):
        """
        Find activities by user id
        :param user_id: user id
        :return: list of dict representations of activities
        """
        activities = db.query(cls).filter_by(user_id=user_id).order_by(cls.id).all()
        return [activity for activity in activities]

    @classmethod
    def return_all(cls, db: Session):
        """
        Return all activities
        :return: list of dict representations of activities
        """
        activities = db.query(cls).order_by(cls.id).all()
        return [cls.to_dict(activity) for activity in activities]

    @classmethod
    def delete_by_id(cls, db: Session, id_: int):
        """
        Delete activity by id
        :param id_: activity id
        :return: code status (200, 404)
        """
        activity = db.query(cls).filter_by(id=id_).first()
        if activity:
            db.delete(activity)
            db.commit()
            return 200
        else:
            return 404

    def save_to_db(self, db: Session):
        """
        Save model instance to database
        :return: None
        """
        db.add(self)
        db.commit()


class RevokedTokenModel(base):
    __tablename__ = 'revoked_tokens'
    id_ = Column(Integer, primary_key=True)
    jti = Column(String(120))
    blacklisted_on = Column(DateTime, default=datetime.utcnow)

    def add(self, db: Session):
        """
        Save model instance to database
        :return: None
        """
        db.add(self)
        db.commit()

    @classmethod
    def is_jti_blacklisted(cls, db: Session, jti):
        """
        Check if jwt token is blocklisted
        :param jti: signature
        :return: True or False
        """
        query = db.query(cls).filter_by(jti=jti).first()
        return bool(query)
