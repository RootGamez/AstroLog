from sqlalchemy import Column, Integer, String, Date, Text, ARRAY
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
