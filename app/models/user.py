from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from passlib.hash import pbkdf2_sha256 as sha256

from .base_model import EntityMeta


class UserModel(EntityMeta):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    firstname = Column(String(30), nullable=False)
    lastname = Column(String(30), nullable=False)
    email = Column(String(50), nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean(), nullable=False)
    activities = relationship("ActivitiesModel", lazy='dynamic', cascade="all, delete-orphan",
                          foreign_keys="ActivitiesModel.user_id")
    activity_lists = relationship("ActivityListsModel", lazy='dynamic', cascade="all, delete-orphan",
                          foreign_keys="ActivityListsModel.user_id")

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

    def normalize(self):
        return {
            "id": self.id.__str__(),
            "firstname": self.firstname.__str__(),
            "lastname": self.lastname.__str__(),
            "email": self.email.__str__(),
            "hashed_password": self.hashed_password.__str__(),
            "is_active": self.is_active.__str__(),
            "activities": self.activities,
            "activity_lists": self.activity_lists,
        }
