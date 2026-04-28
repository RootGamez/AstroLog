import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
fileConfig(config.config_file_name)

# Import your metadata object here for 'autogenerate' support
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app.db import models as models_module

target_metadata = models_module.Base.metadata

# set sqlalchemy.url from environment or use default
def get_url():
    return os.getenv('DATABASE_URL', 'postgresql+psycopg2://astrolog:astrologpass@db:5432/astrologdb')

config.set_main_option('sqlalchemy.url', get_url())

def run_migrations_offline():
    url = config.get_main_option('sqlalchemy.url')
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
