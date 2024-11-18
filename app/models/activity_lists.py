from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .base_model import EntityMeta


class ActivityListsModel(EntityMeta):
    __tablename__ = "activity_lists"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("UserModel", back_populates='activity_lists')
    activities =  relationship("ActivitiesModel", back_populates='activity_lists')

    def normalize(self):
        return {
            "id": self.id.__str__(),
            "name": self.name.__str__(),
            "user_id": self.user_id.__str__(),
        }