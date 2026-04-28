from sqlalchemy import Column, Integer, String, Date, Text, ARRAY, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class AstrologRecord(Base):
    __tablename__ = "astrolog_records"

    id = Column(Integer, primary_key=True, index=True)
    user_title = Column(String(100), nullable=False)
    personal_note = Column(Text, nullable=False)
    tags = Column(ARRAY(String), default=[])
    nasa_date = Column(Date, nullable=False)
    nasa_title = Column(String(200), nullable=False)
    nasa_explanation = Column(Text, nullable=False)
    nasa_url = Column(String(500), nullable=False)
    nasa_media_type = Column(String(20), nullable=False)


class MarsExploration(Base):
    __tablename__ = "mars_explorations"

    id = Column(Integer, primary_key=True, index=True)
    rover_name = Column(String(100), nullable=False)
    camera_name = Column(String(100), nullable=True)
    earth_date = Column(Date, nullable=False)
    sol = Column(Integer, nullable=True)
    image_url = Column(String(1000), nullable=False)
    is_favorite = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False)
