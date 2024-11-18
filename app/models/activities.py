from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from .base_model import EntityMeta


class ActivitiesModel(EntityMeta):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("UserModel", back_populates='activities')
    one_time_only = Column(Boolean(), default=True)
    repeat = Column(String)
    activity_list_id = Column(Integer, ForeignKey('activity_lists.id'))
    activity_lists = relationship("ActivityListsModel", back_populates='activities')
    start = Column(DateTime, nullable=False)
    finish = Column(DateTime)
    done = Column(Boolean(), default=False)

    def normalize(self):
        return {
            "id": self.id.__str__(),
            "name": self.name.__str__(),
            "one_time_only": self.one_time_only.__str__(),
            "repeat": self.repeat.__str__(),
            "activity_list_id": self.activity_list_id.__str__(),
            "start": self.start.__str__(),
            "finish": self.finish.__str__(),
            "user_id": self.user_id.__str__(),
            "done": self.done.__str__(),
        }
